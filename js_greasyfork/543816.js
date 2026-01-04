// --- ElevenLabs TTS AudioContext and AudioBuffer integration ---
let elevenLabsAudioContext = null;

function getElevenLabsAudioContext() {
    if (!elevenLabsAudioContext) {
        elevenLabsAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return elevenLabsAudioContext;
}

function decodeTTSArrayBuffer(arrayBuffer) {
    const audioContext = getElevenLabsAudioContext();
    return audioContext.decodeAudioData(arrayBuffer.slice(0));
}

function dispatchTTSDecodedAudio(audioBuffer, playbackRate = 1.0) {
    const event = new CustomEvent('ElevenLabsTTSDecodedAudio', {
        detail: {
            audioBuffer,
            playbackRate
        }
    });
    window.dispatchEvent(event);
}

function logAudioBuffer(audioBuffer) {
    if (!(audioBuffer instanceof AudioBuffer)) {
        console.error('Provided object is not an AudioBuffer');
        return;
    }
    console.log('AudioBuffer Info:');
    console.log('Sample Rate:', audioBuffer.sampleRate);
    console.log('Number of Channels:', audioBuffer.numberOfChannels);
    console.log('Length (frames):', audioBuffer.length);
    console.log('Duration (seconds):', audioBuffer.duration);
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        console.log(`Channel ${i} Data:`, audioBuffer.getChannelData(i));
    }
}

// ==UserScript==
// @name         JanitorAI - Text to Speech (TESTTTT)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license      MIT
// @description  Adds Text-to-Speech to JanitorAI with customizable voices and settings, including ElevenLabs support.
// @author       Zephyr (xzeph__) & Gemini
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.elevenlabs.io
// @downloadURL https://update.greasyfork.org/scripts/543816/JanitorAI%20-%20Text%20to%20Speech%20%28TESTTTT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543816/JanitorAI%20-%20Text%20to%20Speech%20%28TESTTTT%29.meta.js
// ==/UserScript==


(function () {
  "use strict";

  // --- One-time settings reset for new voice storage format ---
  try {
    const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    // If old, non-specific voice keys exist, reset all settings to ensure a clean slate for the new per-character system.
    if (settings.hasOwnProperty('charVoice') || settings.hasOwnProperty('userVoice')) {
      console.log('TTS Userscript: Old voice setting format detected. Resetting all TTS settings to default to start fresh.');
      localStorage.removeItem("ttsSettings");
    }
  } catch (e) {
    // In case of parsing error, also reset.
    console.error("TTS Userscript: Could not parse settings, resetting to default.", e);
    localStorage.removeItem("ttsSettings");
  }


  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 1: BOT MESSAGE DETECTION                         *
  * (Detects and logs the last bot message)                         *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  const CHAT_CONTAINER_SELECTOR = '[class^="_messagesMain_"]';
  const MESSAGE_CONTAINER_SELECTOR = '[data-testid="virtuoso-item-list"] > div[data-index]';
  const BOT_NAME_ICON_SELECTOR = '[class^="_nameIcon_"]';
  const LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR = '[class^="_botChoicesContainer_"]';
  const SWIPE_SLIDER_SELECTOR = '[class^="_botChoicesSlider_"]';
  const MESSAGE_WRAPPER_SELECTOR = 'li[class^="_messageDisplayWrapper_"]';
  const MESSAGE_TEXT_SELECTOR = ".css-ji4crq p";
  const EDIT_PANEL_SELECTOR = '[class^="_editPanel_"]';
  const CONTROL_PANEL_SELECTOR = '[class^="_controlPanel_"]';
  const BOT_NAME_SELECTOR = '[class^="_nameText_"]';

  let lastLoggedText = "";
  let lastLoggedStatus = "";
  let lastLoggedSwipeIndex = -1;
  let lastLoggedMessageIndex = -1;

  // Pick last finished bot message
  function logMessageStatus() {
    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessageNodes.length === 0) return;

    // Find the last finished message from a bot
    let lastBotMessageContainer = null;
    let activeMessageNode = null;
    let activeSwipeIndex = 0;
    let messageIndex = -1;
    for (let i = allMessageNodes.length - 1; i >= 0; i--) {
      const node = allMessageNodes[i];
      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        // Check if finished
        let candidateNode;
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (!slider) continue;
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
          if (allSwipes.length <= activeSwipeIndex) continue;
          candidateNode = allSwipes[activeSwipeIndex];
        } else {
          candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        }
        if (!candidateNode) continue;
        if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
        if (!candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastBotMessageContainer = node;
        activeMessageNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        break;
      }
    }
    if (!activeMessageNode) return;

    // Improved extraction compared to 1.3
    const messageText = extractFormattedMessageText(activeMessageNode);

    // Process TTS output according to settings
    const { processed: processedTTS, needsDelay } = processTTSOutput(messageText);

    // Only finished messages are processed
    let status = "Finished";

    const shouldLog =
      status !== lastLoggedStatus ||
      activeSwipeIndex !== lastLoggedSwipeIndex ||
      messageIndex !== lastLoggedMessageIndex ||
      (status !== "Streaming" && messageText !== lastLoggedText);

    if (shouldLog) {
      lastLoggedStatus = status;
      lastLoggedSwipeIndex = activeSwipeIndex;
      lastLoggedMessageIndex = messageIndex;
      lastLoggedText = messageText;

      // Log raw and processed TTS output
      console.log("📜 Raw extracted text (Auto):");
      console.log(messageText);
      console.log("\n🎤 Processed TTS (Auto):");
      console.log(processedTTS || "[No TTS output]");
      console.log("--------------------");


      // Play TTS for the processed text
      if (processedTTS) {
          playTTS(processedTTS, true); // isBot is true here
      }
    }
  }

  // Pick last finished message (bot or user)
  function logLastFinishedMessage() {
    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessageNodes.length === 0) return;

    let lastFinishedNode = null;
    let messageIndex = -1;
    let isBot = false;
    for (let i = allMessageNodes.length - 1; i >= 0; i--) {
      const node = allMessageNodes[i];
      let candidateNode;
      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        // Bot message, may have swipes
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (!slider) continue;
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          const activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
          if (allSwipes.length <= activeSwipeIndex) continue;
          candidateNode = allSwipes[activeSwipeIndex];
        } else {
          candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        }
        if (!candidateNode) continue;
        if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
        if (!candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastFinishedNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        isBot = true;
        break;
      } else {
        // User message, no swipes
        candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        if (!candidateNode) continue;
        if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
        if (!candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastFinishedNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        isBot = false;
        break;
      }
    }
    if (!lastFinishedNode) return;

    const messageText = extractFormattedMessageText(lastFinishedNode);
    const { processed: processedTTS, needsDelay } = processTTSOutput(messageText);

    let status = "Finished";

    if (
      status !== lastLoggedStatus ||
      messageIndex !== lastLoggedMessageIndex ||
      (status !== "Streaming" && messageText !== lastLoggedText)
    ) {
      lastLoggedStatus = status;
      lastLoggedSwipeIndex = -1;
      lastLoggedMessageIndex = messageIndex;
      lastLoggedText = messageText;

      // Log raw and processed TTS output
      console.log("📜 Raw extracted text (Auto, User+Bot):");
      console.log(messageText);
      console.log("\n🎤 Processed TTS (Auto, User+Bot):");
      console.log(processedTTS || "[No TTS output]");
      console.log("--------------------");

      // Play TTS for the processed text
      if (processedTTS) {
          playTTS(processedTTS, isBot);
      }
    }
  }

  // Utility: Extract formatted message text from message node
  function extractFormattedMessageText(messageNode) {
    const ji4crq = messageNode.querySelector('.css-ji4crq');
    if (!ji4crq) return "[No text found]";
    let result = [];
    // Each .css-0 is a paragraph or block
    ji4crq.querySelectorAll('.css-0').forEach(block => {
      // Paragraphs
      const p = block.querySelector('p');
      if (p) {
        let line = '';
        p.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === 'EM') {
              line += '_' + child.textContent + '_';
            } else if (child.tagName === 'STRONG') {
              line += '**' + child.textContent + '**';
            } else if (child.tagName === 'CODE') {
              line += '`' + child.textContent + '`';
            } else {
              line += child.textContent;
            }
          } else if (child.nodeType === Node.TEXT_NODE) {
            line += child.textContent;
          }
        });
        if (line.trim()) result.push(line.trim());
        return;
      }
      // Bullet points
      const ul = block.querySelector('ul');
      if (ul) {
        ul.querySelectorAll('li').forEach(li => {
          result.push('• ' + li.textContent.trim());
        });
        return;
      }
      // Standalone codeblock
      const code = block.querySelector('code');
      if (code && !p) {
        result.push('`' + code.textContent.trim() + '`');
        return;
      }
      // If block is empty, skip
      if (!block.textContent.trim()) return;
      // Otherwise, plain text
      result.push(block.textContent.trim());
    });
    return result.length ? result.join('\n') : "[No text found]";
  }

  // Process TTS output according to settings
  function processTTSOutput(rawText) {
    // Load settings
    const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    const provider = settings.provider || 'builtin';
    const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : '';

    let processed = rawText;
    let needsDelay = false;

    // Handle codeblocks (```...``` and `...`)
    if (settings[`${prefix}tts-skip-codeblocks`]) {
      // Remove all codeblocks (```...```)
      const codeblockRegex = /```[\s\S]*?```/g;
      if (codeblockRegex.test(processed)) needsDelay = true;
      processed = processed.replace(codeblockRegex, "");
      // Remove inline codeblocks (single-line)
      const inlineCodeRegex = /`[^`]*`/g;
      if (inlineCodeRegex.test(processed)) needsDelay = true;
      processed = processed.replace(inlineCodeRegex, "");
    } else {
      // Convert codeblocks to plain text (remove backticks, keep content)
      // Multiline codeblocks
      processed = processed.replace(/```([\s\S]*?)```/g, (m, p1) => p1.trim());
      // Inline code
      processed = processed.replace(/`([^`]*)`/g, (m, p1) => p1);
    }

    // Skip bullet points (lines starting with • or - or *)
    if (settings[`${prefix}tts-skip-bulletpoints`]) {
      const lines = processed.split("\n");
      let found = false;
      processed = lines.filter(line => {
        if (/^\s*([•\-*])\s+/.test(line)) {
          found = true;
          return false;
        }
        return true;
      }).join("\n");
      if (found) needsDelay = true;
    }

    // Handle italics/asterisks/underscores
    if (settings[`${prefix}tts-ignore-asterisks`]) {
      // Remove all *...*, _..._, and **...** (greedy, but not across newlines)
      let found = false;
      // Remove **...**
      processed = processed.replace(/\*\*[^*\n]+\*\*/g, (m) => {
        found = true;
        return "";
      });
      // Remove *...*
      processed = processed.replace(/\*[^*\n]+\*/g, (m) => {
        found = true;
        return "";
      });
      // Remove _..._
      processed = processed.replace(/_[^_\n]+_/g, (m) => {
        found = true;
        return "";
      });
      if (found) needsDelay = true;
    } else {
      // Convert **bold** and *italic* and _italic_ to plain text
      processed = processed.replace(/\*\*([^*\n]+)\*\*/g, (m, p1) => p1);
      processed = processed.replace(/\*([^*\n]+)\*/g, (m, p1) => p1);
      processed = processed.replace(/_([^_\n]+)_/g, (m, p1) => p1);
    }

    // Only narrate quoted text (text inside double quotes)
    if (settings[`${prefix}tts-only-quotes`]) {
      // Extract all quoted text
      const matches = [];
      let match;
      const regex = /"([^"]+)"/g;
      while ((match = regex.exec(processed)) !== null) {
        matches.push(match[1]);
      }
      if (matches.length > 0) {
        processed = matches.join(" ");
      } else {
        processed = "";
      }
    }

    // Clean up whitespace
    processed = processed.replace(/\n{2,}/g, "\n").trim();

    return { processed, needsDelay };
  }

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 2: CHAT OBSERVER                                 *
  * (Observes chat for changes and triggers detection)               *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  function initializeObserver() {
    const container = document.querySelector(CHAT_CONTAINER_SELECTOR);

    if (container) {

      const observer = new MutationObserver(() => {
        // Load TTS settings
        const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
        const provider = settings.provider || 'builtin';
        const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : '';

        const ttsEnabled = !!settings[`${prefix}tts-enabled`];
        const autoGen = !!settings[`${prefix}tts-auto-gen`];
        const narrateUser = !!settings[`${prefix}tts-narrate-user`];
        if (ttsEnabled && autoGen && !narrateUser) {
          logMessageStatus();
        } else if (ttsEnabled && autoGen && narrateUser) {
          logLastFinishedMessage();
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });

      // Initial check
      const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
      const provider = settings.provider || 'builtin';
      const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : '';

      const ttsEnabled = !!settings[`${prefix}tts-enabled`];
      const autoGen = !!settings[`${prefix}tts-auto-gen`];
      const narrateUser = !!settings[`${prefix}tts-narrate-user`];
      if (ttsEnabled && autoGen && !narrateUser) {
        logMessageStatus();
      } else if (ttsEnabled && autoGen && narrateUser) {
        logLastFinishedMessage();
      }
    } else {
      setTimeout(initializeObserver, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeObserver);
  } else {
    initializeObserver();
  }

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 3: BUILTIN VOICES LOADING & POPUP                *
  * (Loads voices for dropdowns and shows a popup with all voices) *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  let builtinVoices = [];
  function loadBuiltinVoices(callback) {
    function updateVoices() {
      builtinVoices = window.speechSynthesis.getVoices();
      if (typeof callback === "function") callback(builtinVoices);
    }
    if (!window.speechSynthesis) {
      builtinVoices = [];
      if (typeof callback === "function") callback([]);
      return;
    }
    // onvoiceschanged is the reliable event to listen for
    window.speechSynthesis.onvoiceschanged = updateVoices;
    // Also call getVoices() to trigger the loading if it hasn't started
    updateVoices();
  }

  function showVoicesPopup() {
    loadBuiltinVoices(function(voices) {
      if (!voices || voices.length === 0) {
        alert("No built-in voices available or they are still loading. Try again in a moment.");
        return;
      }
      let msg = "Available Built-in Voices:\n\n";
      voices.forEach((v, i) => {
        msg += `${i + 1}. ${v.name} (${v.lang})${v.default ? " [default]" : ""}\n`;
      });
      alert(msg);
    });
  }

  // Add a temporary button combination to trigger the popup (testing, remember to delete later)
  window.addEventListener("keydown", function(e) {
    // Ctrl+Alt+V to show voices
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "v") {
      showVoicesPopup();
    }
  });

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 3.5: TTS SETTINGS MENU                           *
  * (Displays a settings modal for TTS options)                     *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // CSS for TTS menu
  const TTS_MENU_CSS = `
    .tts-modal-overlay {
      position: fixed;
      z-index: 9999;
      left: 0; top: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center;
    }
    .tts-modal-container {
      background: #23242a;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      min-width: 450px;
      max-width: 95vw;
      min-height: 320px;
      max-height: 90vh;
      padding: 0;
      display: flex;
      flex-direction: column;
      font-family: inherit;
    }
    .tts-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px 0 24px;
      flex-shrink: 0;
    }
    .tts-modal-title {
      font-size: 1.25rem;
      font-weight: bold;
      color: #fff;
      margin: 0;
    }
    .tts-modal-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .tts-modal-close:hover {
      background: #444;
    }
    .tts-modal-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow-y: auto;
    }
    .tts-checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
    }
    .tts-checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tts-checkbox-row label {
      color: #eee;
      font-size: 1rem;
      cursor: pointer;
    }
    .tts-slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .tts-slider-label {
      color: #eee;
      font-size: 1rem;
      margin-right: 8px;
      min-width: 110px;
    }
    .tts-slider {
      width: 140px;
      accent-color: #7ab7ff;
    }
    .tts-slider-value {
      width: 54px;
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid #444;
      background: #222;
      color: #fff;
      font-size: 1rem;
      margin-left: 8px;
      text-align: center;
    }
    .tts-dropdown-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
    }
    .tts-dropdown-label {
      color: #eee;
      font-size: 1rem;
      margin-bottom: 2px;
    }
    .tts-dropdown {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #444;
      background: #222;
      color: #fff;
      font-size: 1rem;
      min-width: 120px;
      margin-bottom: 2px;
    }
    .tts-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 18px 24px;
      border-top: 1px solid #444;
      background: #23242a;
      border-radius: 0 0 12px 12px;
      flex-shrink: 0;
    }
    .tts-modal-btn {
      padding: 8px 22px;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .tts-modal-btn.cancel {
      background: #313339;
      color: #bbb;
    }
    .tts-modal-btn.save {
      background: #7ab7ff;
      color: #23242a;
    }
    .tts-modal-btn.cancel:hover {
      background: #444;
      color: #fff;
    }
    .tts-modal-btn.save:hover {
      background: #5a9be0;
      color: #fff;
    }
    .tts-api-key-container {
        display: flex;
        align-items: stretch;
        gap: 8px;
    }
    .tts-api-key-container textarea {
        flex-grow: 1;
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #444;
        background: #222;
        color: #fff;
        font-size: 1rem;
        resize: none;
        font-family: monospace;
        height: 38px;
        line-height: 1.5;
    }
    .tts-api-key-validate-btn {
        padding: 0 16px;
        border-radius: 6px;
        border: 1px solid #444;
        background: #313339;
        color: #bbb;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s;
    }
    .tts-api-key-validate-btn:hover {
        background: #444;
        color: #fff;
    }
    .tts-api-key-status {
        font-size: 0.85rem;
        margin-top: 4px;
        height: 16px;
    }
    .tts-api-key-status.success { color: #4CAF50; }
    .tts-api-key-status.error { color: #F44336; }
  `;
  // Inject CSS once
  if (!document.getElementById("tts-menu-style")) {
    const style = document.createElement("style");
    style.id = "tts-menu-style";
    style.textContent = TTS_MENU_CSS;
    document.head.appendChild(style);
  }

  const CHECKBOX_OPTIONS = [
      { id: "tts-enabled", label: "Enabled", default: false },
      { id: "tts-narrate-user", label: "Narrate user messages", default: false },
      { id: "tts-auto-gen", label: "Auto Generation", default: false },
      { id: "tts-only-quotes", label: 'Only narrate "quotes"', default: false },
      { id: "tts-ignore-asterisks", label: 'Ignore *text, even "quotes", inside asterisks*', default: false },
      { id: "tts-skip-codeblocks", label: "Skip codeblocks", default: false },
      { id: "tts-skip-bulletpoints", label: "Skip bulletpoints", default: false }
  ];

  let elevenLabsVoices = [];
  let elevenLabsModels = [];

  // TTS menu HTML
  function createTTSMenu() {
    // Load saved settings or defaults
    const savedSettings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    // Helper to get setting or default
    function getSetting(key, def) {
      return key in savedSettings ? savedSettings[key] : def;
    }

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "tts-modal-overlay";
    overlay.style.display = "none";

    // Container
    const container = document.createElement("div");
    container.className = "tts-modal-container";

    // Header
    const header = document.createElement("div");
    header.className = "tts-modal-header";
    const title = document.createElement("h2");
    title.className = "tts-modal-title";
    title.textContent = "Text to Speech Settings";
    const closeBtn = document.createElement("button");
    closeBtn.className = "tts-modal-close";
    closeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    closeBtn.onclick = () => { overlay.style.display = "none"; };
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Main Body
    const mainBody = document.createElement("div");
    mainBody.className = "tts-modal-body";

    // Provider Dropdown
    const providerDropdownRow = document.createElement("div");
    providerDropdownRow.className = "tts-dropdown-row";
    providerDropdownRow.style.paddingBottom = "18px";
    providerDropdownRow.style.marginBottom = "0";
    providerDropdownRow.style.borderBottom = "1px solid #444";

    const providerLabel = document.createElement("label");
    providerLabel.className = "tts-dropdown-label";
    providerLabel.textContent = "TTS Provider";
    const providerSelect = document.createElement("select");
    providerSelect.id = "tts-provider-select";
    providerSelect.className = "tts-dropdown";
    providerSelect.innerHTML = `<option value="builtin">Built-in</option><option value="elevenlabs">ElevenLabs</option>`;
    providerSelect.value = getSetting("provider", "builtin");
    providerDropdownRow.appendChild(providerLabel);
    providerDropdownRow.appendChild(providerSelect);
    mainBody.appendChild(providerDropdownRow);

    // Get current Bot/User names
    let botName = "char";
    try {
        const botNameElem = document.querySelector('[class^="_nameText_"]');
        if (botNameElem && botNameElem.textContent.trim()) {
            botName = botNameElem.textContent.trim();
        }
    } catch (e) {}
    let userPersona = "User";
    try {
        const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
        for (let i = allMessageNodes.length - 1; i >= 0; i--) {
            const node = allMessageNodes[i];
            if (!node.querySelector('[class^="_nameIcon_"]')) {
                const nameElem = node.querySelector('[class^="_nameText_"]');
                if (nameElem && nameElem.textContent.trim()) {
                    userPersona = nameElem.textContent.trim();
                    break;
                }
            }
        }
    } catch (e) {}

    // -- START BUILT-IN SETTINGS PANEL --
    const settingsBuiltIn = document.createElement("div");
    settingsBuiltIn.id = "tts-settings-builtin";
    settingsBuiltIn.style.display = "flex";
    settingsBuiltIn.style.flexDirection = "column";
    settingsBuiltIn.style.gap = "18px";

    const checkboxListBuiltIn = document.createElement("div");
    checkboxListBuiltIn.className = "tts-checkbox-list";
    CHECKBOX_OPTIONS.forEach(opt => {
        const row = document.createElement("div");
        row.className = "tts-checkbox-row";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = `builtin-${opt.id}`;
        cb.dataset.key = opt.id;
        cb.className = "tts-checkbox";
        cb.checked = !!getSetting(opt.id, opt.default);
        const label = document.createElement("label");
        label.htmlFor = cb.id;
        label.textContent = opt.label;
        row.appendChild(cb);
        row.appendChild(label);
        checkboxListBuiltIn.appendChild(row);
    });
    settingsBuiltIn.appendChild(checkboxListBuiltIn);

    const sliderRowBuiltIn = document.createElement("div");
    sliderRowBuiltIn.className = "tts-slider-row";
    const sliderLabelBuiltIn = document.createElement("span");
    sliderLabelBuiltIn.className = "tts-slider-label";
    sliderLabelBuiltIn.textContent = "Playback speed";
    const sliderBuiltIn = document.createElement("input");
    sliderBuiltIn.type = "range";
    sliderBuiltIn.dataset.key = "playbackSpeed";
    sliderBuiltIn.className = "tts-slider";
    sliderBuiltIn.min = "0.10";
    sliderBuiltIn.max = "2.00";
    sliderBuiltIn.step = "0.05";
    sliderBuiltIn.value = getSetting("playbackSpeed", "1.00");
    const sliderValueBuiltIn = document.createElement("input");
    sliderValueBuiltIn.type = "text";
    sliderValueBuiltIn.className = "tts-slider-value";
    sliderValueBuiltIn.value = sliderBuiltIn.value;
    sliderBuiltIn.oninput = () => { sliderValueBuiltIn.value = parseFloat(sliderBuiltIn.value).toFixed(2); };
    sliderValueBuiltIn.oninput = () => {
      let v = parseFloat(sliderValueBuiltIn.value);
      if (!isNaN(v) && v >= 0.1 && v <= 2) sliderBuiltIn.value = v.toFixed(2);
    };
    sliderRowBuiltIn.appendChild(sliderLabelBuiltIn);
    sliderRowBuiltIn.appendChild(sliderBuiltIn);
    sliderRowBuiltIn.appendChild(sliderValueBuiltIn);
    settingsBuiltIn.appendChild(sliderRowBuiltIn);

    const dropdownRowBuiltIn = document.createElement("div");
    dropdownRowBuiltIn.className = "tts-dropdown-row";
    dropdownRowBuiltIn.innerHTML = `
        <label class="tts-dropdown-label">Default voice</label>
        <select class="tts-dropdown" data-key="defaultVoice"></select>
        <label class="tts-dropdown-label">Voice for "${botName}"</label>
        <select class="tts-dropdown" data-key="charVoice_${botName}"></select>
        <label class="tts-dropdown-label">Voice for "${userPersona}" (You)</label>
        <select class="tts-dropdown" data-key="userVoice_${userPersona}"></select>
    `;
    loadBuiltinVoices(() => {
        const dropdowns = dropdownRowBuiltIn.querySelectorAll('.tts-dropdown');
        dropdowns.forEach(dd => {
            dd.innerHTML = `<option value="Default">Default</option>`;
            builtinVoices.forEach(v => {
                const opt = document.createElement("option");
                opt.value = v.name;
                opt.textContent = `${v.name} (${v.lang})${v.default ? " [default]" : ""}`;
                dd.appendChild(opt);
            });
            const key = dd.dataset.key;
            const fallbackKey = key.startsWith('charVoice') || key.startsWith('userVoice') ? 'defaultVoice' : 'Default';
            dd.value = getSetting(key, getSetting(fallbackKey, 'Default'));
        });
    });
    settingsBuiltIn.appendChild(dropdownRowBuiltIn);
    // -- END BUILT-IN SETTINGS PANEL --

    // -- START ELEVENLABS SETTINGS PANEL --
    const settingsElevenLabs = document.createElement("div");
    settingsElevenLabs.id = "tts-settings-elevenlabs";
    settingsElevenLabs.style.display = "none";
    settingsElevenLabs.style.flexDirection = "column";
    settingsElevenLabs.style.gap = "18px";

    // API Key Input
    const apiKeyRow = document.createElement("div");
    apiKeyRow.className = "tts-dropdown-row";
    apiKeyRow.style.paddingBottom = "18px";
    apiKeyRow.style.marginBottom = "0";
    apiKeyRow.style.borderBottom = "1px solid #444";
    const apiKeyLabel = document.createElement("label");
    apiKeyLabel.className = "tts-dropdown-label";
    apiKeyLabel.textContent = "ElevenLabs API Key";
    const apiKeyContainer = document.createElement("div");
    apiKeyContainer.className = 'tts-api-key-container';
    const apiKeyInput = document.createElement("textarea");
    apiKeyInput.dataset.key = "elevenlabs_apiKey";
    apiKeyInput.value = getSetting("elevenlabs_apiKey", "");
    apiKeyInput.placeholder = "Enter your API Key";
    const validateBtn = document.createElement("button");
    validateBtn.type = "button";
    validateBtn.className = "tts-api-key-validate-btn";
    validateBtn.textContent = "Validate";
    const apiKeyStatus = document.createElement("div");
    apiKeyStatus.className = "tts-api-key-status";

    // Auto-hide API key logic
    let isKeyHidden = true;
    const originalKey = apiKeyInput.value;
    function maskKey(key) {
        return key.length > 0 ? '•'.repeat(key.length) : '';
    }
    if (originalKey) {
        apiKeyInput.value = maskKey(originalKey);
        apiKeyInput.dataset.original = originalKey;
    }

    apiKeyInput.addEventListener('focus', () => {
        if (isKeyHidden && apiKeyInput.dataset.original) {
            apiKeyInput.value = apiKeyInput.dataset.original;
            isKeyHidden = false;
        }
    });

    apiKeyInput.addEventListener('blur', () => {
        apiKeyInput.dataset.original = apiKeyInput.value;
        apiKeyInput.value = maskKey(apiKeyInput.value);
        isKeyHidden = true;
    });

    apiKeyInput.addEventListener('input', () => {
       apiKeyInput.dataset.original = apiKeyInput.value;
    });


    apiKeyContainer.appendChild(apiKeyInput);
    apiKeyContainer.appendChild(validateBtn);
    apiKeyRow.appendChild(apiKeyLabel);
    apiKeyRow.appendChild(apiKeyContainer);
    apiKeyRow.appendChild(apiKeyStatus);
    settingsElevenLabs.appendChild(apiKeyRow);

    const checkboxListElevenLabs = document.createElement("div");
    checkboxListElevenLabs.className = "tts-checkbox-list";
    CHECKBOX_OPTIONS.forEach(opt => {
        const row = document.createElement("div");
        row.className = "tts-checkbox-row";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = `elevenlabs-${opt.id}`;
        cb.dataset.key = `elevenlabs_${opt.id}`;
        cb.className = "tts-checkbox";
        cb.checked = !!getSetting(cb.dataset.key, opt.default);
        const label = document.createElement("label");
        label.htmlFor = cb.id;
        label.textContent = opt.label;
        row.appendChild(cb);
        row.appendChild(label);
        checkboxListElevenLabs.appendChild(row);
    });
    settingsElevenLabs.appendChild(checkboxListElevenLabs);

    function createSlider(labelText, key, min, max, step, defaultValue, formatFn, parseFn) {
        const row = document.createElement("div");
        row.className = "tts-slider-row";
        row.innerHTML = `<span class="tts-slider-label">${labelText}</span>`;
        const slider = document.createElement("input");
        slider.type = "range";
        slider.dataset.key = key;
        slider.className = "tts-slider";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = getSetting(key, defaultValue);
        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.className = "tts-slider-value";
        valueInput.value = formatFn(slider.value);
        slider.oninput = () => { valueInput.value = formatFn(slider.value); };
        valueInput.onchange = () => {
            const parsed = parseFn(valueInput.value);
            if (parsed.isValid) {
                slider.value = parsed.value;
                valueInput.value = formatFn(slider.value);
            } else {
                 valueInput.value = formatFn(slider.value); // revert
            }
        };
        row.appendChild(slider);
        row.appendChild(valueInput);
        return row;
    }

    settingsElevenLabs.appendChild(createSlider("Playback speed", "elevenlabs_playbackSpeed", "0.1", "2.0", "0.05", "1.00",
        v => parseFloat(v).toFixed(2),
        v => { const n = parseFloat(v); return { isValid: !isNaN(n) && n >= 0.1 && n <= 2, value: n.toFixed(2) }; }
    ));
    settingsElevenLabs.appendChild(createSlider("Stability", "elevenlabs_stability", "0", "1", "0.01", "0.75",
        v => `${Math.round(v * 100)}%`,
        v => { const n = parseInt(v.replace('%','')); return { isValid: !isNaN(n) && n >= 0 && n <= 100, value: (n/100).toFixed(2) }; }
    ));
    settingsElevenLabs.appendChild(createSlider("Similarity Boost", "elevenlabs_similarity", "0", "1", "0.01", "0.75",
        v => `${Math.round(v * 100)}%`,
        v => { const n = parseInt(v.replace('%','')); return { isValid: !isNaN(n) && n >= 0 && n <= 100, value: (n/100).toFixed(2) }; }
    ));
    settingsElevenLabs.appendChild(createSlider("Style", "elevenlabs_style", "0", "1", "0.01", "0.45",
        v => `${Math.round(v * 100)}%`,
        v => { const n = parseInt(v.replace('%','')); return { isValid: !isNaN(n) && n >= 0 && n <= 100, value: (n/100).toFixed(2) }; }
    ));

    const speakerBoostRow = document.createElement("div");
    speakerBoostRow.className = "tts-checkbox-row";
    const speakerBoostCb = document.createElement("input");
    speakerBoostCb.type = "checkbox";
    speakerBoostCb.id = "elevenlabs-speaker-boost";
    speakerBoostCb.dataset.key = "elevenlabs_speaker-boost";
    speakerBoostCb.className = "tts-checkbox";
    speakerBoostCb.checked = !!getSetting("elevenlabs_speaker-boost", false);
    const speakerBoostLabel = document.createElement("label");
    speakerBoostLabel.htmlFor = speakerBoostCb.id;
    speakerBoostLabel.textContent = "Use Speaker Boost";
    speakerBoostRow.appendChild(speakerBoostCb);
    speakerBoostRow.appendChild(speakerBoostLabel);
    checkboxListElevenLabs.appendChild(speakerBoostRow);

    const dropdownRowElevenLabs = document.createElement("div");
    dropdownRowElevenLabs.className = "tts-dropdown-row";
    dropdownRowElevenLabs.innerHTML = `
        <label class="tts-dropdown-label">Model</label>
        <select class="tts-dropdown" data-key="elevenlabs_modelId"></select>
        <label class="tts-dropdown-label">Default voice</label>
        <select class="tts-dropdown" data-key="elevenlabs_defaultVoice"></select>
        <label class="tts-dropdown-label">Voice for "${botName}"</label>
        <select class="tts-dropdown" data-key="elevenlabs_charVoice_${botName}"></select>
        <label class="tts-dropdown-label">Voice for "${userPersona}" (You)</label>
        <select class="tts-dropdown" data-key="elevenlabs_userVoice_${userPersona}"></select>
    `;
    settingsElevenLabs.appendChild(dropdownRowElevenLabs);

    validateBtn.addEventListener('click', async () => {
        const key = apiKeyInput.dataset.original || apiKeyInput.value;
        if (!key) {
            apiKeyStatus.textContent = "API Key is empty.";
            apiKeyStatus.className = "tts-api-key-status error";
            return;
        }
        apiKeyStatus.textContent = "Validating...";
        apiKeyStatus.className = "tts-api-key-status";
        validateBtn.disabled = true;

        const validation = await validateElevenLabsKey(key);
        apiKeyStatus.textContent = validation.message;
        apiKeyStatus.className = `tts-api-key-status ${validation.isValid ? 'success' : 'error'}`;

        if (validation.isValid) {
            await fetchAndPopulateElevenLabsData(key);
            // Save the valid key immediately
            const currentSettings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
            currentSettings.elevenlabs_apiKey = key;
            localStorage.setItem("ttsSettings", JSON.stringify(currentSettings));
        }
        validateBtn.disabled = false;
    });

    async function fetchAndPopulateElevenLabsData(apiKey) {
        try {
            const [voices, models] = await Promise.all([
                elevenLabsApiRequest({ method: "GET", endpoint: "/v1/voices", apiKey }),
                elevenLabsApiRequest({ method: "GET", endpoint: "/v1/models", apiKey })
            ]);

            elevenLabsVoices = voices.voices || [];
            elevenLabsModels = models.filter(m => m.can_do_text_to_speech) || [];

            // Populate Model Dropdown
            const modelSelect = dropdownRowElevenLabs.querySelector('[data-key="elevenlabs_modelId"]');
            modelSelect.innerHTML = '';
            elevenLabsModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.model_id;
                option.textContent = model.name;
                modelSelect.appendChild(option);
            });
            modelSelect.value = getSetting('elevenlabs_modelId', elevenLabsModels[0]?.model_id || '');


            // Populate Voice Dropdowns
            const dropdownsEL = dropdownRowElevenLabs.querySelectorAll('[data-key^="elevenlabs_"], [data-key*="Voice"]');
            dropdownsEL.forEach(dd => {
                if(dd.dataset.key === 'elevenlabs_modelId') return; // skip model dropdown
                const currentVal = dd.value;
                dd.innerHTML = `<option value="Default">Default</option>`;
                const categorized = { 'Premade': [], 'Cloned': [] };
                elevenLabsVoices.forEach(v => {
                    if(v.category === 'premade') categorized.Premade.push(v);
                    else categorized.Cloned.push(v);
                });

                Object.keys(categorized).forEach(category => {
                    const voicesInCategory = categorized[category];
                    if(voicesInCategory.length > 0){
                        const optgroup = document.createElement('optgroup');
                        optgroup.label = `${category} (${voicesInCategory.length})`;
                        voicesInCategory.forEach(voice => {
                            const option = document.createElement('option');
                            option.value = voice.voice_id;
                            option.textContent = voice.name;
                            optgroup.appendChild(option);
                        });
                        dd.appendChild(optgroup);
                    }
                });
                const key = dd.dataset.key;
                const fallbackKey = key.includes('charVoice') || key.includes('userVoice') ? 'elevenlabs_defaultVoice' : 'Default';
                dd.value = getSetting(key, getSetting(fallbackKey, 'Default'));
            });

        } catch (error) {
            console.error("TTS Userscript: Failed to fetch ElevenLabs data:", error);
            apiKeyStatus.textContent = `Failed to get voices/models: ${error.message}`;
            apiKeyStatus.className = "tts-api-key-status error";
        }
    }


    // -- END ELEVENLABS SETTINGS PANEL --

    mainBody.appendChild(settingsBuiltIn);
    mainBody.appendChild(settingsElevenLabs);

    // Provider switch logic
    providerSelect.onchange = () => {
      if (providerSelect.value === 'builtin') {
        settingsBuiltIn.style.display = 'flex';
        settingsElevenLabs.style.display = 'none';
      } else {
        settingsBuiltIn.style.display = 'none';
        settingsElevenLabs.style.display = 'flex';
        const key = getSetting("elevenlabs_apiKey", "");
        if(key) {
            fetchAndPopulateElevenLabsData(key);
        }
      }
    };
    setTimeout(() => { providerSelect.onchange(); }, 0);

    // Footer
    const footer = document.createElement("div");
    footer.className = "tts-modal-footer";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "tts-modal-btn cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => { overlay.style.display = "none"; };

    const saveBtn = document.createElement("button");
    saveBtn.className = "tts-modal-btn save";
    saveBtn.textContent = "Save Settings";
    saveBtn.onclick = () => {
      const prevSettings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
      const newSettings = { ...prevSettings, provider: providerSelect.value };

      // Save fields from both panels to not lose settings when switching
      document.querySelectorAll('#tts-settings-builtin [data-key], #tts-settings-elevenlabs [data-key]').forEach(el => {
          const key = el.dataset.key;
          if (key === 'elevenlabs_apiKey') {
              if (el.dataset.original) {
                  newSettings[key] = el.dataset.original;
              }
          } else if (el.type === 'checkbox') {
              newSettings[key] = el.checked;
          } else if (el.type === 'range' || el.classList.contains('tts-slider-value')) {
              // Save as float for sliders
              newSettings[key] = parseFloat(el.value);
          } else {
              newSettings[key] = el.value;
          }
      });

      localStorage.setItem("ttsSettings", JSON.stringify(newSettings));
      overlay.style.display = "none";
      document.querySelectorAll('.temp-btn').forEach(btn => btn.remove());
      document.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectTempButton);
    };
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    container.appendChild(header);
    container.appendChild(mainBody);
    container.appendChild(footer);
    overlay.appendChild(container);

    document.body.appendChild(overlay);
    return overlay;
  }

  let ttsMenuOverlay = null;

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 4: MENU INJECTION                                *
  * (Injects "Text to Speech" option into popup menu)                *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  const MENU_LIST_SELECTOR = '[class^="_menuList_"]';
  const MENU_ITEM_CLASS = '[class^="_menuItem_"]';
  const TTS_BUTTON_ID = 'tts-menu-item';

  const bodyObserver = new MutationObserver(() => {
    injectTTSMenuItem();
  });

  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  function injectTTSMenuItem() {
    const menuList = document.querySelector(MENU_LIST_SELECTOR);
    if (!menuList) return;

    if (menuList.querySelector(`#${TTS_BUTTON_ID}`)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    const firstMenuItem = menuList.querySelector(MENU_ITEM_CLASS);
    btn.className = firstMenuItem ? firstMenuItem.className : '';
    btn.id = TTS_BUTTON_ID;
    btn.innerHTML = `
      <span class="_menuItemIcon_1fzcr_81">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines-icon lucide-audio-lines">
          <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
        </svg>
      </span>
      <span class="_menuItemContent_1fzcr_96">Text to Speech</span>
    `;
    btn.addEventListener('click', function() {
      // If a menu overlay already exists in the DOM, remove it
      if (ttsMenuOverlay) {
        ttsMenuOverlay.remove();
      }
      // Create a fresh menu to get the latest bot/user names
      ttsMenuOverlay = createTTSMenu();
      ttsMenuOverlay.style.display = "flex";
    });

    const menuItems = Array.from(menuList.querySelectorAll(MENU_ITEM_CLASS));
    let inserted = false;
    for (let i = 0; i < menuItems.length; i++) {
      const span = menuItems[i].querySelector('span[class*="_menuItemContent_"]');
      if (span && span.textContent.trim() === "Generation Settings") {
        if (menuItems[i].nextSibling) {
          menuList.insertBefore(btn, menuItems[i].nextSibling);
        } else {
          menuList.appendChild(btn);
        }
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      menuList.appendChild(btn);
    }
  }

  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 5: TEXT TO SPEECH (TTS)                          *
  * (Handles the speech synthesis based on settings)                *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  // Keep a reference to the utterance object so it doesn't get garbage-collected mid-speech.
  let currentUtterance = null;
  let currentElevenLabsAudio = null;


  function playTTS(text, isBot) {
      const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
      const provider = settings.provider || 'builtin';

      if (provider === 'elevenlabs') {
          playElevenLabsTTS(text, isBot, settings);
      } else {
          playBuiltinTTS(text, isBot, settings);
      }
  }

  function stopTTS() {
      // Stop Built-in TTS
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
      }
      // Stop ElevenLabs TTS
      if (currentElevenLabsAudio) {
          currentElevenLabsAudio.pause();
          currentElevenLabsAudio.src = '';
          currentElevenLabsAudio = null;
          document.querySelectorAll('.temp-btn').forEach(button => {
              button.innerHTML = PLAY_SVG;
          });
      }
      // Dispatch event to notify other scripts (e.g., Live2D) to stop playback
      window.dispatchEvent(new CustomEvent('TTSStopPlayback'));
  }

  // Built-in TTS: use playbackSpeed and selected voice
  function playBuiltinTTS(text, isBot, settings) {
    if (!settings['tts-enabled']) {
      stopTTS();
      return;
    }
    if (!window.speechSynthesis || !text || typeof text !== 'string') {
      return;
    }
    stopTTS();

    const utter = new SpeechSynthesisUtterance(text);
    currentUtterance = utter;

    utter.rate = parseFloat(settings.playbackSpeed) || 1.0;
    utter.pitch = 1;

    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length === 0) {
      window.speechSynthesis.speak(utter);
      return;
    }

    let defaultVoice = allVoices.find(v => v.lang === 'en-US' && v.default) || allVoices.find(v => v.lang === 'en-US') || allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
    let botName = "char";
    try {
      const botNameElem = document.querySelector('[class^="_nameText_"]');
      if (botNameElem && botNameElem.textContent.trim()) {
        botName = botNameElem.textContent.trim();
      }
    } catch (e) {}
    let userPersona = "User";
    try {
      const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
      for (let i = allMessageNodes.length - 1; i >= 0; i--) {
        const node = allMessageNodes[i];
        if (!node.querySelector('[class^="_nameIcon_"]')) {
          const nameElem = node.querySelector('[class^="_nameText_"]');
          if (nameElem && nameElem.textContent.trim()) {
            userPersona = nameElem.textContent.trim();
            break;
          }
        }
      }
    } catch (e) {}
    let targetVoiceName = 'Default';
    if (isBot) {
      targetVoiceName = settings[`charVoice_${botName}`] || settings.defaultVoice || 'Default';
    } else {
      targetVoiceName = settings[`userVoice_${userPersona}`] || settings.defaultVoice || 'Default';
    }
    let selectedVoice = (targetVoiceName !== 'Default') ? allVoices.find(v => v.name === targetVoiceName) : null;
    utter.voice = selectedVoice || defaultVoice;

    utter.onstart = () => {
        document.querySelectorAll('.temp-btn').forEach(button => {
            button.innerHTML = STOP_SVG;
        });
    };

    utter.onend = () => {
        document.querySelectorAll('.temp-btn').forEach(button => {
            button.innerHTML = PLAY_SVG;
        });
    };

    window.speechSynthesis.speak(utter);
  }

  // ElevenLabs TTS: use all relevant settings and stream audio
  async function playElevenLabsTTS(text, isBot, settings) {
    const apiKey = settings.elevenlabs_apiKey;
    if (!settings['elevenlabs_tts-enabled'] || !apiKey) {
        stopTTS();
        return;
    }
    stopTTS();

    let botName = "char";
    try {
        const botNameElem = document.querySelector('[class^="_nameText_"]');
        if (botNameElem && botNameElem.textContent.trim()) {
            botName = botNameElem.textContent.trim();
        }
    } catch (e) {}
    let userPersona = "User";
    try {
        const allMessageNodes = document.querySelectorAll('[data-testid="virtuoso-item-list"] > div[data-index]');
        for (let i = allMessageNodes.length - 1; i >= 0; i--) {
            const node = allMessageNodes[i];
            if (!node.querySelector('[class^="_nameIcon_"]')) {
                const nameElem = node.querySelector('[class^="_nameText_"]');
                if (nameElem && nameElem.textContent.trim()) {
                    userPersona = nameElem.textContent.trim();
                    break;
                }
            }
        }
    } catch (e) {}

    let voiceId;
    if (isBot) {
        voiceId = settings[`elevenlabs_charVoice_${botName}`] || settings.elevenlabs_defaultVoice;
    } else {
        voiceId = settings[`elevenlabs_userVoice_${userPersona}`] || settings.elevenlabs_defaultVoice;
    }
    if (!voiceId || voiceId === 'Default') {
        console.error("TTS Userscript: No ElevenLabs voice selected for this speaker.");
        return;
    }

    // Use all slider/checkbox values, fallback to defaults if missing
    const playbackSpeed = parseFloat(settings.elevenlabs_playbackSpeed) || 1.0;
    const stability = typeof settings.elevenlabs_stability !== "undefined" ? parseFloat(settings.elevenlabs_stability) : 0.75;
    const similarity = typeof settings.elevenlabs_similarity !== "undefined" ? parseFloat(settings.elevenlabs_similarity) : 0.75;
    const style = typeof settings.elevenlabs_style !== "undefined" ? parseFloat(settings.elevenlabs_style) : 0.45;
    const speakerBoost = !!settings['elevenlabs_speaker-boost'];

    const requestBody = {
        text: text,
        model_id: settings.elevenlabs_modelId,
        voice_settings: {
            stability: stability,
            similarity_boost: similarity,
            style: style,
            use_speaker_boost: speakerBoost
        }
    };

    try {
        document.querySelectorAll('.temp-btn').forEach(button => {
             button.innerHTML = STOP_SVG;
        });

        const audioData = await elevenLabsApiRequest({
            method: 'POST',
            endpoint: `/v1/text-to-speech/${voiceId}`,
            apiKey: apiKey,
            data: requestBody,
            responseType: 'arraybuffer'
        });

        // Decode ArrayBuffer to AudioBuffer and dispatch event for Live2D
        try {
            const audioBuffer = await decodeTTSArrayBuffer(audioData);
            logAudioBuffer(audioBuffer);
            dispatchTTSDecodedAudio(audioBuffer, playbackSpeed);
        } catch (err) {
            console.error('Failed to decode ElevenLabs TTS ArrayBuffer:', err);
        }

        const blob = new Blob([audioData], { type: 'audio/mpeg' });

        const audioUrl = URL.createObjectURL(blob);

        // Dispatch custom event with blob URL for other scripts
        const ttsBlobUrlEvent = new CustomEvent('TTSBlobUrlReady', {
            detail: { blobUrl: audioUrl, blob: blob }
        });
        window.dispatchEvent(ttsBlobUrlEvent);

        currentElevenLabsAudio = new Audio(audioUrl);
        currentElevenLabsAudio.playbackRate = playbackSpeed;

        currentElevenLabsAudio.onended = () => {
            document.querySelectorAll('.temp-btn').forEach(button => {
                button.innerHTML = PLAY_SVG;
            });
            currentElevenLabsAudio = null;
        };

        currentElevenLabsAudio.play();

    } catch (error) {
        console.error("TTS Userscript: ElevenLabs generation failed:", error);
        alert(`ElevenLabs TTS failed: ${error.message}`);
        document.querySelectorAll('.temp-btn').forEach(button => {
            button.innerHTML = PLAY_SVG;
        });
    }
}


  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 5.5: ELEVENLABS API HELPERS                      *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  function elevenLabsApiRequest(options) {
      const { method, endpoint, apiKey, params = {}, data = null, responseType = 'json' } = options;
      let url = `https://api.elevenlabs.io${endpoint}`;
      if (Object.keys(params).length > 0) {
          url += `?${new URLSearchParams(params).toString()}`;
      }

      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: method,
              url: url,
              headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
              data: data ? JSON.stringify(data) : null,
              responseType: responseType,
              onload: function(response) {
                  if (response.status === 200) {
                      resolve(responseType === 'json' ? JSON.parse(response.responseText) : response.response);
                  } else {
                      let errorMessage = `Error: ${response.status}`;
                      try {
                          const errorDetail = JSON.parse(response.responseText).detail;
                          if(typeof errorDetail === 'string') errorMessage = errorDetail;
                          else if (errorDetail[0]?.msg) errorMessage = errorDetail[0].msg;
                      } catch (e) { /* Ignore parsing error */ }
                      reject({ status: response.status, message: errorMessage });
                  }
              },
              onerror: function(error) {
                  reject({ status: 0, message: `Network error: ${error.statusText || 'Unknown'}` });
              }
          });
      });
  }

  async function validateElevenLabsKey(apiKey) {
      try {
          await elevenLabsApiRequest({ method: "GET", endpoint: "/v1/models", apiKey });
          return { isValid: true, message: "API Key Valid" };
      } catch (error) {
          return { isValid: false, message: `Invalid API Key` };
      }
  }


  /*
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  * *
  * SECTION 6: CONTROL PANEL BUTTON                          *
  * *
  *・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.*.。.:*・☆・゜・*:.。.:*・*
  */

  const PLAY_SVG = `
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z" clip-rule="evenodd"/>
    </svg>`;

  const STOP_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-stop-icon lucide-circle-stop">
      <circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>`;


  // Inject a button into a control panel, it follows the user's settings for TTS.
  function injectTempButton(panel) {
    if (!panel || panel.querySelector('.temp-btn')) return;
    const settings = JSON.parse(localStorage.getItem("ttsSettings") || "{}");
    const provider = settings.provider || 'builtin';
    const prefix = provider === 'elevenlabs' ? 'elevenlabs_' : '';

    const ttsEnabled = !!settings[`${prefix}tts-enabled`];
    const narrateUser = !!settings[`${prefix}tts-narrate-user`];
    if (!ttsEnabled) return;

    const isBot = !!(panel.closest && panel.closest('[data-index]') && panel.closest('[data-index]').querySelector(BOT_NAME_ICON_SELECTOR));

    if (!narrateUser && !isBot) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = '_controlPanelButton_prxth_8 temp-btn';
    btn.style.marginLeft = '0px';
    btn.innerHTML = PLAY_SVG;

    btn.onclick = function() {
      // If speech is happening, any button acts as a stop button.
      if ((window.speechSynthesis && window.speechSynthesis.speaking) || currentElevenLabsAudio) {
          stopTTS();
          return;
      }

      const messageWrapper = this.closest(MESSAGE_WRAPPER_SELECTOR);
      if (messageWrapper) {
          const messageText = extractFormattedMessageText(messageWrapper);
          const { processed: processedTTS } = processTTSOutput(messageText);
          if (processedTTS) {
              playTTS(processedTTS, isBot);
          }
      }
    };

    panel.insertBefore(btn, panel.firstChild);
  }

  // Observe for control panels to appear
  const controlPanelObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node is a control panel or contains one
          if (node.matches(CONTROL_PANEL_SELECTOR)) {
            injectTempButton(node);
          }
          node.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectTempButton);
        }
      }
    }
  });

  function startControlPanelObserver() {
    const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if (chatContainer) {
      // Initial injection for existing panels
      document.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectTempButton);
      // Observe for future panels
      controlPanelObserver.observe(chatContainer, { childList: true, subtree: true });
    } else {
      setTimeout(startControlPanelObserver, 1000);
    }
  }

  startControlPanelObserver();

})();
