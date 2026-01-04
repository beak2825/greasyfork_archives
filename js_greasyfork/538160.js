// ==UserScript==
// @name         T3Chat OpenAI TTS & STT
// @namespace    https://github.com/cameron/t3chat-userscripts
// @version      0.1.2
// @description  Adds OpenAI text-to-speech and speech-to-text to T3Chat
// @match        https://t3.chat/*
// @match        https://*.t3.chat/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538160/T3Chat%20OpenAI%20TTS%20%20STT.user.js
// @updateURL https://update.greasyfork.org/scripts/538160/T3Chat%20OpenAI%20TTS%20%20STT.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CONFIG = {
    apiBaseUrl: 'https://api.openai.com/v1',
    ttsModel: 'tts-1',
    ttsVoice: 'alloy',
    sttModel: 'whisper-1',
    maxRecordingTime: 60000,
    currentVersion: '0.1.2',
    storageKeys: {
      t3chatApiKey: 'apikey:openai',
      ttsEnabled: 't3chat-tts-enabled',
      sttEnabled: 't3chat-stt-enabled',
      ttsVoice: 't3chat-tts-voice',
      sttMethod: 't3chat-stt-method',
      version: 't3chat-tts-stt-version'
    }
  };

  if (localStorage.getItem(CONFIG.storageKeys.version) !== CONFIG.currentVersion) {
    localStorage.removeItem(CONFIG.storageKeys.sttMethod);
    localStorage.setItem(CONFIG.storageKeys.version, CONFIG.currentVersion);
  }

  const SELECTORS = {
    chatInput: [
      '#chat-input',
      'textarea[aria-describedby="chat-input-description"]',
      'textarea[placeholder*="message"]',
      'textarea[data-testid="chat-input"]'
    ],
    messageContainer: '[role="article"], .message, div[class*="message"]',
    messageContent: '.prose, .message-content, div[class*="prose"], p, div[class*="text"]',
    messageActionsContainer:
      'div[class*="absolute"][class*="flex"][class*="items-center"][class*="gap"], div.absolute.left-0[class*="-ml-0"][class*="mt-2"], div.absolute.right-0[class*="mt-"]',
    sendButton: 'button[type="submit"][aria-label*="Message"], button[aria-label*="send" i]'
  };

  const getT3ChatApiKey = () => {
    const key = localStorage.getItem(CONFIG.storageKeys.t3chatApiKey);
    return key?.startsWith('sk-') ? key : null;
  };

  const state = {
    get apiKey() {
      return getT3ChatApiKey();
    },
    ttsEnabled: localStorage.getItem(CONFIG.storageKeys.ttsEnabled) !== 'false',
    sttEnabled: localStorage.getItem(CONFIG.storageKeys.sttEnabled) !== 'false',
    sttMethod: localStorage.getItem(CONFIG.storageKeys.sttMethod) || 'openai',
    ttsVoice: localStorage.getItem(CONFIG.storageKeys.ttsVoice) || CONFIG.ttsVoice,
    isRecording: false,
    mediaRecorder: null,
    audioChunks: [],
    currentAudio: null,
    recordingMimeType: '',
    speechRecognition: null
  };

  if (localStorage.getItem(CONFIG.storageKeys.ttsEnabled) === null) {
    localStorage.setItem(CONFIG.storageKeys.ttsEnabled, 'true');
    state.ttsEnabled = true;
  }
  if (localStorage.getItem(CONFIG.storageKeys.sttEnabled) === null) {
    localStorage.setItem(CONFIG.storageKeys.sttEnabled, 'true');
    state.sttEnabled = true;
  }

  const findChatInput = () =>
    SELECTORS.chatInput
      .map((s) => document.querySelector(s))
      .find((el) => el && el.tagName === 'TEXTAREA');

  const findInputContainer = () => {
    const input = findChatInput();
    if (!input) return null;
    const sendBtn =
      document.querySelector(SELECTORS.sendButton) ||
      input.parentElement?.querySelector('button[type="submit"]') ||
      input.parentElement?.querySelector('button[aria-label*="send" i]');
    return sendBtn ? sendBtn.parentElement : input.closest('div[class*="flex"]') || input.parentElement;
  };

  const injectStyles = () => {
    if (document.querySelector('#t3chat-tts-stt-styles')) return;
    const style = document.createElement('style');
    style.id = 't3chat-tts-stt-styles';
    style.textContent = `
      .t3-tts-btn,.t3-stt-btn,.t3-settings-btn{
        display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid hsl(var(--border));
        border-radius:6px;background:hsl(var(--background));color:hsl(var(--foreground));cursor:pointer;
        transition:all .2s ease;position:relative;flex-shrink:0
      }
      .t3-tts-btn:hover,.t3-stt-btn:hover,.t3-settings-btn:hover{background:hsl(var(--muted));border-color:hsl(var(--ring))}
      .t3-stt-btn.recording{background:#ef4444;color:#fff;animation:pulse 1s infinite}
      .t3-tts-btn.speaking{background:#3b82f6;color:#fff}
      .t3-tts-btn.disabled,.t3-stt-btn.disabled{opacity:.5;cursor:not-allowed}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
      .t3-tooltip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:hsl(var(--foreground));
        color:hsl(var(--background));padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;opacity:0;
        pointer-events:none;transition:opacity .2s ease;margin-bottom:4px;z-index:1000}
      .t3-stt-btn:hover .t3-tooltip,.t3-settings-btn:hover .t3-tooltip{opacity:1}
      button[aria-label="Speak message"].speaking{background:#3b82f6!important;color:#fff!important}
      button[aria-label="Speak message"]{width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;
        display:flex!important;align-items:center!important;justify-content:center!important}
      button[aria-label="Speak message"] .relative,button[aria-label="Speak message"] svg{width:24px!important;height:24px!important}
    `;
    document.head.appendChild(style);
  };

  const callOpenAI = async (endpoint, data, options = {}) => {
    if (!state.apiKey) throw new Error('OpenAI API key not configured');
    const res = await fetch(`${CONFIG.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    return res;
  };

  const textToSpeech = async (text) => {
    const res = await callOpenAI('/audio/speech', {
      model: CONFIG.ttsModel,
      voice: state.ttsVoice,
      input: text.slice(0, 4096)
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    if (state.currentAudio) {
      state.currentAudio.pause();
      URL.revokeObjectURL(state.currentAudio.src);
    }
    state.currentAudio = new Audio(url);
    return state.currentAudio;
  };

  const speechToText = async (blob) => {
    const mime = blob.type.toLowerCase();
    const ext =
      mime.includes('wav')
        ? 'wav'
        : mime.includes('mp4')
        ? 'mp4'
        : mime.includes('mp3')
        ? 'mp3'
        : mime.includes('ogg')
        ? 'ogg'
        : 'webm';

    const form = new FormData();
    form.append('file', blob, `audio.${ext}`);
    form.append('model', CONFIG.sttModel);

    const res = await fetch(`${CONFIG.apiBaseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.apiKey}` },
      body: form
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`STT failed: ${txt}`);
    }
    const json = await res.json();
    return json.text;
  };

  const initSpeechRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.lang = 'en-US';

    rec.onstart = () => {
      state.isRecording = true;
      updateSTTButton();
    };
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      const input = findChatInput();
      if (input && txt.trim()) {
        input.value = (input.value + ' ' + txt).trim();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      }
    };
    rec.onerror = rec.onend = () => {
      state.isRecording = false;
      updateSTTButton();
    };
    return rec;
  };

  const startRecording = async () => {
    if (state.sttMethod === 'browser') return startBrowserSpeechRecognition();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const types = [
        'audio/wav',
        'audio/mp4',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp3'
      ];
      const type = types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      if (!type) throw new Error('No supported audio MIME type found');

      state.mediaRecorder = new MediaRecorder(stream, { mimeType: type });
      state.audioChunks = [];
      state.recordingMimeType = type;

      state.mediaRecorder.ondataavailable = (e) => e.data.size && state.audioChunks.push(e.data);
      state.mediaRecorder.onstop = async () => {
        const blob = new Blob(state.audioChunks, { type: state.recordingMimeType });
        try {
          const txt = await speechToText(blob);
          const input = findChatInput();
          if (input && txt.trim()) {
            input.value = (input.value + ' ' + txt).trim();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
          }
        } finally {
          stream.getTracks().forEach((t) => t.stop());
          state.isRecording = false;
          updateSTTButton();
        }
      };
      state.mediaRecorder.start();
      state.isRecording = true;
      updateSTTButton();
      setTimeout(() => state.isRecording && stopRecording(), CONFIG.maxRecordingTime);
    } catch (err) {}
  };

  const startBrowserSpeechRecognition = () => {
    if (!state.speechRecognition) state.speechRecognition = initSpeechRecognition();
    state.speechRecognition?.start();
  };

  const stopRecording = () => {
    if (state.sttMethod === 'browser') {
      state.speechRecognition?.stop();
    } else {
      state.mediaRecorder?.stop();
    }
  };

  const createButton = (cls, svg, tooltip) => {
    const btn = document.createElement('button');
    btn.className = cls;
    btn.innerHTML = `${svg}<div class="t3-tooltip">${tooltip}</div>`;
    return btn;
  };

  const createTTSButton = () => {
    const svg =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5,6 9,2 9,2 15,6 15,11 19,11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
    const btn = createButton('t3-tts-btn', svg, 'Text to Speech');
    btn.addEventListener('click', async () => {
      const input = findChatInput();
      if (input?.value.trim()) await speakText(input.value.trim());
    });
    return btn;
  };

  const createSTTButton = () => {
    const svg =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line><line x1="8" x2="16" y1="22" y2="22"></line></svg>';
    const btn = createButton('t3-stt-btn', svg, 'Speech to Text');
    btn.addEventListener('click', () => (state.isRecording ? stopRecording() : startRecording()));
    return btn;
  };

  const createSettingsButton = () => {
    const svg =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const btn = createButton('t3-settings-btn', svg, 'TTS/STT Settings');
    btn.addEventListener('click', showSettingsModal);
    return btn;
  };

  const createMessageSpeakButton = (msg) => {
    const btn = document.createElement('button');
    btn.className =
      'inline-flex items-center justify-center text-xs rounded-lg p-0 hover:bg-muted/40';
    btn.setAttribute('aria-label', 'Speak message');
    btn.innerHTML =
      '<div class="relative" style="width:24px;height:24px"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5,6 9,2 9,2 15,6 15,11 19,11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div>';
    btn.addEventListener('click', () => {
      const text = msg.textContent.trim();
      if (!text) return;
      btn.classList.add('speaking');
      speakText(text).finally(() => btn.classList.remove('speaking'));
    });
    return btn;
  };

  const speakText = async (txt) => {
    try {
      const audio = await textToSpeech(txt);
      await audio.play();
    } catch (err) {}
  };

  const updateSTTButton = () => {
    const btn = document.querySelector('.t3-stt-btn');
    if (!btn) return;
    btn.classList.toggle('recording', state.isRecording);
    const tip = btn.querySelector('.t3-tooltip');
    if (tip) tip.textContent = state.isRecording ? 'Stop Recording' : 'Speech to Text';
  };

  const showSettingsModal = () => {
    const hasKey = !!state.apiKey;
    const modal = document.createElement('div');
    modal.className = 't3-settings-modal';
    modal.innerHTML = `
      <style>
        .t3-settings-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10000}
        .t3-settings-content{background:hsl(var(--background));border:1px solid hsl(var(--border));border-radius:8px;padding:24px;min-width:400px;max-width:500px}
        .t3-settings-title{font-size:18px;font-weight:600;margin-bottom:16px;color:hsl(var(--foreground))}
        .t3-form-group{margin-bottom:16px}
        .t3-form-label{display:block;font-size:14px;font-weight:500;margin-bottom:4px;color:hsl(var(--foreground))}
        .t3-form-select,.t3-form-input{width:100%;padding:8px 12px;border:1px solid hsl(var(--border));border-radius:6px;background:hsl(var(--background));color:hsl(var(--foreground));font-size:14px}
        .t3-form-checkbox{display:flex;align-items:center;gap:8px}
        .t3-button-group{display:flex;gap:8px;justify-content:flex-end;margin-top:20px}
        .t3-btn{padding:8px 16px;border-radius:6px;border:1px solid hsl(var(--border));background:hsl(var(--background));color:hsl(var(--foreground));cursor:pointer;font-size:14px;transition:all .2s ease}
        .t3-btn:hover{background:hsl(var(--muted))}
        .t3-btn.primary{background:hsl(var(--primary));color:hsl(var(--primary-foreground));border-color:hsl(var(--primary))}
        .t3-btn.primary:hover{opacity:.9}
        .t3-api-key-status{padding:12px;border-radius:6px;background:hsl(var(--muted));border:1px solid hsl(var(--border))}
        .t3-api-status{font-weight:500;margin-top:4px}
        .t3-api-status.connected{color:#22c55e}
        .t3-api-status.disconnected{color:#ef4444}
        .t3-form-help{font-size:12px;color:hsl(var(--muted-foreground));margin-top:8px}
      </style>
      <div class="t3-settings-content">
        <div class="t3-settings-title">TTS & STT Settings</div>
        <div class="t3-form-group">
          <div class="t3-api-key-status">
            <div class="t3-form-label">OpenAI API Key Status</div>
            <div class="t3-api-status ${hasKey ? 'connected' : 'disconnected'}">
              ${hasKey ? '✅ Connected' : '❌ Not configured'}
            </div>
            ${hasKey ? '' : '<p class="t3-form-help">Add your OpenAI key in T3Chat settings.</p>'}
          </div>
        </div>
        <div class="t3-form-group">
          <label class="t3-form-label">STT Method</label>
          <select class="t3-form-select" id="stt-method-select">
            <option value="browser" ${state.sttMethod === 'browser' ? 'selected' : ''}>Browser</option>
            <option value="openai" ${state.sttMethod === 'openai' ? 'selected' : ''} ${!hasKey ? 'disabled' : ''}>OpenAI Whisper</option>
          </select>
        </div>
        <div class="t3-form-group">
          <label class="t3-form-label">TTS Voice</label>
          <select class="t3-form-select" id="voice-select" ${!hasKey ? 'disabled' : ''}>
            ${['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
              .map((v) => `<option value="${v}" ${state.ttsVoice === v ? 'selected' : ''}>${v[0].toUpperCase() + v.slice(1)}</option>`)
              .join('')}
          </select>
        </div>
        <div class="t3-form-group">
          <label class="t3-form-checkbox"><input type="checkbox" id="tts-enabled" ${state.ttsEnabled ? 'checked' : ''}><span>Enable Text-to-Speech</span></label>
        </div>
        <div class="t3-form-group">
          <label class="t3-form-checkbox"><input type="checkbox" id="stt-enabled" ${state.sttEnabled ? 'checked' : ''}><span>Enable Speech-to-Text</span></label>
        </div>
        <div class="t3-button-group">
          <button class="t3-btn" id="cancel-settings">Cancel</button>
          <button class="t3-btn primary" id="save-settings">Save</button>
        </div>
      </div>`;
    modal.addEventListener('click', (e) => e.target === modal && modal.remove());
    modal.querySelector('#cancel-settings').addEventListener('click', () => modal.remove());
    modal.querySelector('#save-settings').addEventListener('click', () => {
      const voice = modal.querySelector('#voice-select').value;
      const ttsEnabled = modal.querySelector('#tts-enabled').checked;
      const sttEnabled = modal.querySelector('#stt-enabled').checked;
      const method = modal.querySelector('#stt-method-select').value;
      state.ttsVoice = voice;
      state.ttsEnabled = ttsEnabled;
      state.sttEnabled = sttEnabled;
      state.sttMethod = method;
      localStorage.setItem(CONFIG.storageKeys.ttsVoice, voice);
      localStorage.setItem(CONFIG.storageKeys.ttsEnabled, ttsEnabled);
      localStorage.setItem(CONFIG.storageKeys.sttEnabled, sttEnabled);
      localStorage.setItem(CONFIG.storageKeys.sttMethod, method);
      updateControlsVisibility();
      modal.remove();
    });
    document.body.appendChild(modal);
  };

  const updateControlsVisibility = () => {
    const stt = document.querySelector('.t3-stt-btn');
    if (!stt) return;
    stt.style.display = state.sttEnabled ? 'flex' : 'none';
    stt.classList.toggle('disabled', !state.apiKey);
  };

  const addControlsToInput = () => {
    const container = findInputContainer();
    if (!container || container.querySelector('.t3-settings-btn')) return;
    const sendBtn =
      container.querySelector(SELECTORS.sendButton) ||
      container.querySelector('button[type="submit"]') ||
      container.querySelector('button[aria-label*="send" i]');

    const settingsBtn = createSettingsButton();
    if (sendBtn) container.insertBefore(settingsBtn, sendBtn);
    else container.appendChild(settingsBtn);

    if (state.sttEnabled) {
      const sttBtn = createSTTButton();
      sendBtn ? container.insertBefore(sttBtn, sendBtn) : container.appendChild(sttBtn);
    }
    updateControlsVisibility();
  };

  const processMessage = (msg) => {
    const content = msg.querySelector(SELECTORS.messageContent);
    if (!content || !content.textContent.trim() || !state.ttsEnabled) return;
    let actions =
      msg.parentElement?.querySelector(SELECTORS.messageActionsContainer) ||
      msg.querySelector(SELECTORS.messageActionsContainer);
    if (!actions) actions = msg.parentElement?.querySelector('div[class*="absolute"][class*="flex"]');
    if (!actions || actions.querySelector('button[aria-label="Speak message"]')) return;
    const speakBtn = createMessageSpeakButton(content);
    const genTxt = actions.querySelector('span[class*="select-none"]');
    if (genTxt) actions.insertBefore(speakBtn, genTxt);
    else {
      const first = actions.querySelector('button');
      first?.nextSibling ? actions.insertBefore(speakBtn, first.nextSibling) : actions.appendChild(speakBtn);
    }
    msg.setAttribute('data-tts-added', 'true');
  };

  const addTTSToMessages = () => {
    document
      .querySelectorAll(`${SELECTORS.messageContainer}:not([data-tts-added])`)
      .forEach(processMessage);
  };

  const initialize = () => {
    injectStyles();
    addControlsToInput();
    addTTSToMessages();
    new MutationObserver(() => {
      addControlsToInput();
      addTTSToMessages();
    }).observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(addTTSToMessages, 2000);
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initialize)
    : initialize();
})();