// ==UserScript==
// @name        FT.live Message reader
// @namespace   Violentmonkey Scripts
// @match       https://www.fishtank.live/*
// @grant       none
// @version     1.0
// @license     AGPL-3.0
// @author      Me :)
// @description 3/19/2025, 2:23:22 PM
// @downloadURL https://update.greasyfork.org/scripts/530293/FTlive%20Message%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/530293/FTlive%20Message%20reader.meta.js
// ==/UserScript==

const USERNAME = 'FT_USERNAME';
const SPEECH_PITCH = 1.0;
const SPEECH_RATE = 1.0;
const MAX_TTS_QUEUED = 3; // If there's a bunch of messages in a row, the get queued up, if the queue is full the most recent message will be replaced
const MS_BETWEEN_TTS = 3000; // Time in between TTS in milliseconds
const PREFERRED_VOICES = ['Asilia', 'Aria', 'Google'];
const LANGS = ['en-US', 'en-KE']; // Accepted voice languages

(function() {
    window.playingTTS = false;
    window.ttsQueue = [];
    'use strict';
    const voices = speechSynthesis.getVoices();

    function chooseVoice() {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        console.log('No TTS voices available.');
        return null;
      }
      let fallback = null;
      for (let j = 0; j < PREFERRED_VOICES.length; j++) {
        for (let i = 0; i < voices.length; i++) {
          const v = voices[i];
          if (LANGS.indexOf(v.lang) === -1) continue;
          if (fallback === null) fallback = v;

          if (v.name.includes(PREFERRED_VOICES[j])) {
            return v;
          }
        }
      }
      return fallback || voices[0];
    }

    function speakTextAdvanced(text, forceTTS=false) {
      if (window.playingTTS && !forceTTS) {
        if (window.ttsQueue.length >= MAX_TTS_QUEUED) {
          window.ttsQueue[MAX_TTS_QUEUED-1] = text; // replace last message in queue
        } else {
          window.ttsQueue.push(text);
        }
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = SPEECH_RATE; // Speed (0.1 - 10, default: 1)
      utterance.pitch = SPEECH_PITCH; // Pitch (0 - 2, default: 1)

      // Get available voices and select one
      utterance.voice = chooseVoice();
      if (utterance.voice === null) return;

      utterance.onend = () => {
        if (window.ttsQueue.length === 0) {
          window.playingTTS = false;
        } else {
          setTimeout(() => speakTextAdvanced(window.ttsQueue.pop(), true), MS_BETWEEN_TTS);
        }
      };

      speechSynthesis.speak(utterance);
      window.playingTTS = true;
    }

    function processChatMessage(node) {
        const msgSpans = node.getElementsByClassName('chat-message-default_message__milmT');
        if (msgSpans.length == 0) return;
        const msg = msgSpans[0].innerText.toLocaleLowerCase();
        if (msg.indexOf(USERNAME.toLocaleLowerCase()) !== -1) {
          let cleanMsg = msg.replaceAll('@' + USERNAME, '');
          cleanMsg = cleanMsg.replaceAll(USERNAME, '');
          speakTextAdvanced(cleanMsg);
        }
    }

    // Function to handle new messages
    function handleNewMessage(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'DIV') {
                        processChatMessage(node);
                    }
                });
            }
        }
    }

    // Wait for the chat container to be available
    function waitForChatContainer() {
        const chatContainer = document.getElementById("chat-messages");
        if (chatContainer) {
            const observer = new MutationObserver(handleNewMessage);
            observer.observe(chatContainer, { childList: true });
            console.log("Observer started on #chat-messages");
        } else {
            setTimeout(waitForChatContainer, 500);
        }
    }

    waitForChatContainer();
})();