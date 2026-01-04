// ==UserScript==
// @name         TypeRacer Helper ;)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://i.imgur.com/j66eH7j.jpeg
// @description  Advanced cheat for typeracer.com — manual typing, auto mode, WPM limiter (Auto mode might IS be buggy)
// @author       @igniran 🩷
// @match        https://play.typeracer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533592/TypeRacer%20Helper%20%3B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533592/TypeRacer%20Helper%20%3B%29.meta.js
// ==/UserScript==

(function () {
  let prompt = '';
  let currentIndex = 0;
  let enabled = true;
  let autoMode = false;
  let autoInterval = null;
  let maxWPM = 85;
  let toggleKey = '1';

  function getPromptText() {
    const container = document.querySelector(".inputPanel div");
    if (!container) return;
    const newPrompt = container.innerText.trim();
    if (newPrompt && newPrompt !== prompt) {
      prompt = newPrompt;
      currentIndex = 0;
    }
  }

  function typeNextChar(input) {
    if (!prompt || currentIndex >= prompt.length) return;
    const nextChar = prompt[currentIndex];
    input.value += nextChar;
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    currentIndex++;
  }

  function startAutoType() {
    stopAutoType();
    const input = document.querySelector(".txtInput");
    if (!input || !enabled || !autoMode || !prompt) return;

    const charsPerMinute = maxWPM * 5;
    const delay = 60000 / charsPerMinute;

    autoInterval = setInterval(() => {
      if (!enabled || !autoMode || currentIndex >= prompt.length) {
        stopAutoType();
        return;
      }
      typeNextChar(input);
    }, delay);
  }

  function stopAutoType() {
    clearInterval(autoInterval);
    autoInterval = null;
  }

  function handleKeyDown(e) {
    const input = document.querySelector(".txtInput");
    if (!input || !enabled) return;

    const isToggle = e.ctrlKey && e.key.toLowerCase() === toggleKey.toLowerCase();

    if (isToggle) {
      enabled = !enabled;
      updateUI();
      stopAutoType();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      input.value = input.value.slice(0, -1);
      currentIndex = Math.max(0, currentIndex - 1);
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
      return;
    }

    if (!autoMode && e.key.length === 1) {
      e.preventDefault();
      getPromptText();
      typeNextChar(input);
    }
  }

  function checkWPMandBlockChallenge() {
    const resultEl = document.querySelector('.Results .score');
    if (!resultEl) return;

    const wpmText = resultEl.textContent.match(/\d+/);
    const wpm = wpmText ? parseInt(wpmText[0], 10) : 0;

    if (wpm > 100) {
      const dialog = document.querySelector(".challengePromptDialog");
      const overlay = document.querySelector(".TPOverlay");
      if (dialog) dialog.style.display = 'none';
      if (overlay) overlay.style.display = 'none';

      const msg = document.createElement('div');
      msg.textContent = 'WPM over 100 doesn’t count :(';
      msg.style.position = 'fixed';
      msg.style.top = '120px';
      msg.style.left = '50%';
      msg.style.transform = 'translateX(-50%)';
      msg.style.background = 'rgba(0, 0, 0, 0.85)';
      msg.style.color = 'white';
      msg.style.padding = '10px 20px';
      msg.style.borderRadius = '10px';
      msg.style.zIndex = 10000;
      msg.style.fontSize = '16px';
      msg.style.fontFamily = 'sans-serif';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 5000);
    }
  }

  function createUI() {
    const wrapper = document.createElement('div');
    wrapper.id = 'cheat-ui';
    wrapper.innerHTML = `
      <div style="
        position: fixed;
        top: 60px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        font-family: sans-serif;
        padding: 10px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        width: 220px;
      ">
        <div><b>Status:</b> <span id="cheat-status">ON</span></div>
        <div style="font-size: 12px; color: gray;">Toggle: Ctrl + <span id="keybind-display">1</span></div>
        <input type="text" id="keybind-input" maxlength="1" placeholder="Change key…" style="width: 50px; font-size: 12px; margin-top: 5px;" />
        <div style="margin-top: 8px;">
          <label><input type="checkbox" id="auto-mode" /> Auto Mode</label>
        </div>
        <div id="wpm-control" style="margin-top: 5px; display: none;">
          Max WPM:
          <input type="number" id="wpm-input" min="10" max="300" value="85" style="width: 60px;" />
        </div>
        <div style="margin-top: 8px; font-size: 12px; color: pink;">Made by @igniran 🩷</div>
      </div>
    `;
    document.body.appendChild(wrapper);

    document.getElementById("auto-mode").addEventListener("change", (e) => {
      autoMode = e.target.checked;
      updateUI();
      stopAutoType();
      if (enabled && autoMode) startAutoType();
    });

    document.getElementById("wpm-input").addEventListener("input", (e) => {
      maxWPM = parseInt(e.target.value, 10);
      if (enabled && autoMode) startAutoType();
    });

    document.getElementById("keybind-input").addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase();
      if (val && /^[a-z0-9]$/i.test(val)) {
        toggleKey = val;
        document.getElementById("keybind-display").textContent = toggleKey;
      }
    });

    document.getElementById("auto-mode").checked = autoMode;
  }

  function updateUI() {
    const status = document.getElementById("cheat-status");
    if (status) {
      status.textContent = enabled ? "ON" : "OFF";
      status.style.color = enabled ? "lime" : "red";
    }

    const wpmBox = document.getElementById("wpm-control");
    if (wpmBox) {
      wpmBox.style.display = autoMode ? "block" : "none";
    }
  }

  document.addEventListener('keydown', handleKeyDown, true);

  createUI();
  updateUI();

  const observer = new MutationObserver(() => {
    const inputBox = document.querySelector('.txtInput');
    if (inputBox) getPromptText();

    const resultShown = document.querySelector('.Results');
    if (resultShown) checkWPMandBlockChallenge();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
