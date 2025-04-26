"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation';
// import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

// UI components
import Transcript from "./components/Transcript";
import Events from "./components/Events";
import BottomToolbar from "./components/BottomToolbar";

// Types
import { AgentConfig, SessionStatus } from "@/app/types";

// Context providers & hooks
// import { useTranscript } from "@/app/contexts/TranscriptContext";
import { useEvent } from "@/app/contexts/EventContext";
// import { useHandleServerEvent } from "./hooks/useHandleServerEvent";

// Utilities
// import { createRealtimeConnection } from "./lib/realtimeConnection";

// Agent configs
import { allAgentSets, defaultAgentSetKey } from "@/app/agentConfigs";

const SearchComponent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  return (
    <div>
      <h1>Query: {query}</h1>
    </div>
  );
};

function App() {
  const searchParams = useSearchParams();
  // const query = searchParams.get('query');

  // const { transcriptItems, addTranscriptMessage, addTranscriptBreadcrumb } = useTranscript();
  // const { logClientEvent, /*logServerEvent*/ } = useEvent();

  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [selectedAgentConfigSet, setSelectedAgentConfigSet] = useState<AgentConfig[] | null>(null);
  // const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  // const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  // const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [sessionStatus, /*setSessionStatus*/] = useState<SessionStatus>("DISCONNECTED");

  // const sendClientEvent = (eventObj: any, eventNameSuffix = "") => {
  //   if (dcRef.current && dcRef.current.readyState === "open") {
  //     logClientEvent(eventObj, eventNameSuffix);
  //     dcRef.current.send(JSON.stringify(eventObj));
  //   } else {
  //     logClientEvent({ attemptedEvent: eventObj.type }, "error.data_channel_not_open");
  //     console.error("Failed to send message - no data channel available", eventObj);
  //   }
  // };

  // const handleServerEventRef = useHandleServerEvent({
  //   setSessionStatus,
  //   selectedAgentName,
  //   selectedAgentConfigSet,
  //   sendClientEvent,
  //   setSelectedAgentName,
  // });

  useEffect(() => {
    let finalAgentConfig = searchParams.get("agentConfig");
    if (!finalAgentConfig || !allAgentSets[finalAgentConfig]) {
      finalAgentConfig = defaultAgentSetKey;
      const url = new URL(window.location.toString());
      url.searchParams.set("agentConfig", finalAgentConfig);
      window.location.replace(url.toString());
      return;
    }

    const agents = allAgentSets[finalAgentConfig];
    const agentKeyToUse = agents[0]?.name || "";

    setSelectedAgentName(agentKeyToUse);
    setSelectedAgentConfigSet(agents);
  }, [searchParams]);

  // その他のuseEffectやロジックをそのまま残して、Appコンポーネント内で適切に利用します。

  return (
    <div className="text-base flex flex-col h-screen bg-gray-100 text-gray-800 relative">
      <SearchComponent />
      
      <div className="p-5 text-lg font-semibold flex justify-between items-center">
        <div className="flex items-center">
          <div onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
            <Image
              src="/openai-logomark.svg"
              alt="OpenAI Logo"
              width={20}
              height={20}
              className="mr-2"
            />
          </div>
          <div>
            Realtime API <span className="text-gray-500">Agents</span>
          </div>
        </div>
        <div className="flex items-center">
          <label className="flex items-center text-base gap-1 mr-2 font-medium">
            Scenario
          </label>
          <div className="relative inline-block">
            <select
              value={selectedAgentName}
              onChange={(e) => setSelectedAgentName(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg text-base px-2 py-1 pr-8 cursor-pointer font-normal focus:outline-none"
            >
              {selectedAgentConfigSet?.map(agent => (
                <option key={agent.name} value={agent.name}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-2 px-2 overflow-hidden relative">
        <Transcript
          userText={""}  // 他の状態管理を使うため、値はそのままで置いておく
          setUserText={() => {}}
          onSendMessage={() => {}}
          canSend={sessionStatus === "CONNECTED" && dcRef.current?.readyState === "open"}
        />
        <Events isExpanded={true} />
      </div>

      <BottomToolbar
        sessionStatus={sessionStatus}
        onToggleConnection={() => {}}
        isPTTActive={false}
        setIsPTTActive={() => {}}
        isPTTUserSpeaking={false}
        handleTalkButtonDown={() => {}}
        handleTalkButtonUp={() => {}}
        isEventsPaneExpanded={true}
        setIsEventsPaneExpanded={() => {}}
        isAudioPlaybackEnabled={true}
        setIsAudioPlaybackEnabled={() => {}}
      />
    </div>
  );
}

export default App;
