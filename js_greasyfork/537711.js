// ==UserScript==
// @license MIT
// @description A Nitrotype Bot with GUI & variance sliders, also Mostly a Troll Hack TW: GETS YOU BANNED Theres no way currently to make a script that works using tampermonkey.
// @name Nitro Type Bot
// @namespace    https://www.youtube.com/@InternetTyper
// @match https://www.nitrotype.com/*
// @author Internet Typer
// @run-at document-start
// @grant none
// @version 1.0.3
// @downloadURL https://update.greasyfork.org/scripts/537711/Nitro%20Type%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/537711/Nitro%20Type%20Bot.meta.js
// ==/UserScript==

(() => {
  'use strict';

  function isRacePage() {
    return location.pathname.startsWith('/race');
  }

  const sockets = [];
  const nativeWebSocket = window.WebSocket;
  window.WebSocket = function (...args) {
    const socket = new nativeWebSocket(...args);
    sockets.push(socket);
    return socket;
  };

  function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }

  function loadNum(key, def) {
    const val = sessionStorage.getItem(key);
    return val !== null ? parseInt(val) : def;
  }
  function saveNum(key, val) {
    sessionStorage.setItem(key, val.toString());
  }
  function loadBool(key, def) {
    const val = sessionStorage.getItem(key);
    return val === null ? def : val === 'true';
  }
  function saveBool(key, val) {
    sessionStorage.setItem(key, val ? 'true' : 'false');
  }
  function loadStr(key, def) {
    const val = sessionStorage.getItem(key);
    return val !== null ? val : def;
  }
  function saveStr(key, val) {
    sessionStorage.setItem(key, val);
  }

  const keys = {
    enabled: 'ntbot_enabled',
    baseWpm: 'ntbot_wpm',
    baseAcc: 'ntbot_acc',
    wpmVar: 'ntbot_wpm_var',
    accVar: 'ntbot_acc_var',
    color: 'ntbot_color'
  };
  const defaults = {
    enabled: true,
    baseWpm: 200,
    baseAcc: 100,
    wpmVar: 10,
    accVar: 5,
    color: '#0f0'
  };

  let enabled = loadBool(keys.enabled, defaults.enabled);
  let baseWpm = loadNum(keys.baseWpm, defaults.baseWpm);
  let baseAcc = loadNum(keys.baseAcc, defaults.baseAcc);
  let wpmVar = loadNum(keys.wpmVar, defaults.wpmVar);
  let accVar = loadNum(keys.accVar, defaults.accVar);
  let color = loadStr(keys.color, defaults.color);

  function createGUI() {
    if (document.getElementById('ntbot_gui')) return;
    const style = document.createElement('style');
    style.textContent = `
      #ntbot_gui {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #111;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        width: 280px;
        box-shadow: 0 0 15px ${color};
        z-index: 99999;
        user-select: none;
      }
      #ntbot_gui h2 {
        margin: 0 0 10px 0;
        font-size: 18px;
        cursor: pointer;
      }
      #ntbot_gui .section {
        margin-bottom: 12px;
      }
      #ntbot_gui label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
      }
      #ntbot_gui input[type="number"], #ntbot_gui input[type="range"], #ntbot_gui input[type="color"] {
        width: 100%;
        font-size: 14px;
        padding: 4px;
        border-radius: 4px;
        border: none;
        background: white;
        color: black;
      }
      #ntbot_gui .small-text {
        font-size: 11px;
        color: #aaa;
        margin-top: 2px;
      }
      #ntbot_gui button.toggle-btn {
        background: ${color};
        border: none;
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        color: #000;
        width: 100%;
        margin-top: 8px;
      }
      #ntbot_gui .variance-value {
        text-align: right;
        font-size: 12px;
        color: ${color};
        margin-top: -16px;
        margin-bottom: 6px;
        user-select: none;
      }
      #ntbot_credits {
        font-size: 12px;
        text-align: center;
        margin-top: 10px;
        color: #ccc;
      }
      #ntbot_credits .highlight {
        font-size: 14px;
        color: ${color};
        font-weight: bold;
      }
      #ntbot_credits a {
        color: ${color};
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = 'ntbot_gui';
    gui.innerHTML = `
      <h2 id="ntbot_toggle">Nitrotype Bot ▲</h2>
      <div class="collapse-content">
        <div class="section">
          <label for="ntbot_enabled">Enable Bot</label>
          <button id="ntbot_enabled" class="toggle-btn">${enabled ? 'ON' : 'OFF'}</button>
        </div>
        <div class="section">
          <label for="ntbot_wpm_input">Base WPM</label>
          <input type="number" id="ntbot_wpm_input" min="1" max="3600" value="${baseWpm}" />
        </div>
        <div class="variance-value" id="wpm_var_val">${wpmVar} WPM variance</div>
        <input type="range" id="ntbot_wpm_var" min="0" max="50" step="1" value="${wpmVar}" />
        <div class="section" style="margin-top:12px;">
          <label for="ntbot_acc_input">Base Accuracy (%)</label>
          <input type="number" id="ntbot_acc_input" min="1" max="100" value="${baseAcc}" />
        </div>
        <div class="variance-value" id="acc_var_val">${accVar} accuracy variance</div>
        <input type="range" id="ntbot_acc_var" min="0" max="20" step="1" value="${accVar}" />
        <div class="section">
          <label for="ntbot_color_picker">Highlight Color</label>
          <input type="color" id="ntbot_color_picker" value="${color}" />
        </div>
        <div id="ntbot_credits">
          Credit: RedHawk and adl212 and<br>
          <a class="highlight" href="https://www.youtube.com/@InternetTyper" target="_blank">@InternetTyper on YouTube</a>
        </div>
      </div>
    `;

    document.body.appendChild(gui);

    gui.querySelector('#ntbot_toggle').addEventListener('click', () => {
      gui.classList.toggle('collapsed');
      gui.querySelector('#ntbot_toggle').textContent = gui.classList.contains('collapsed') ? 'Nitrotype Bot ▼' : 'Nitrotype Bot ▲';
    });

    const enableBtn = gui.querySelector('#ntbot_enabled');
    enableBtn.addEventListener('click', () => {
      enabled = !enabled;
      saveBool(keys.enabled, enabled);
      enableBtn.textContent = enabled ? 'ON' : 'OFF';
      enableBtn.style.background = enabled ? color : '#555';
    });
    enableBtn.style.background = enabled ? color : '#555';

    gui.querySelector('#ntbot_wpm_input').addEventListener('change', e => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 3600) val = 3600;
      baseWpm = val;
      saveNum(keys.baseWpm, baseWpm);
      e.target.value = baseWpm;
    });

    gui.querySelector('#ntbot_wpm_var').addEventListener('input', e => {
      wpmVar = parseInt(e.target.value);
      saveNum(keys.wpmVar, wpmVar);
      gui.querySelector('#wpm_var_val').textContent = `${wpmVar} WPM variance`;
    });

    gui.querySelector('#ntbot_acc_input').addEventListener('change', e => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 100) val = 100;
      baseAcc = val;
      saveNum(keys.baseAcc, baseAcc);
      e.target.value = baseAcc;
    });

    gui.querySelector('#ntbot_acc_var').addEventListener('input', e => {
      accVar = parseInt(e.target.value);
      saveNum(keys.accVar, accVar);
      gui.querySelector('#acc_var_val').textContent = `${accVar} accuracy variance`;
    });

    gui.querySelector('#ntbot_color_picker').addEventListener('change', e => {
      color = e.target.value;
      saveStr(keys.color, color);
      location.reload();
    });
  }

  async function main(ws, event) {
    if (!enabled || !isRacePage()) return;
    const message = event.data;
    const scan_for_text = msg => {
      try {
        const parsed = JSON.parse(msg.slice(1));
        if (parsed && parsed.payload && typeof parsed.payload.l === 'string') {
          return parsed.payload.l;
        }
      } catch (e) {}
      return null;
    };

    const text = scan_for_text(message);
    if (typeof text !== 'string') return;

    function randrange(min, max) {
      if (max <= min) return min;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const words = text.split(' ');
    const fullText = words.join(' ');
    const numChars = fullText.length;

    let charDelays = [];
    for (let i = 0; i < numChars; i++) {
      const wpm = Math.max(1, Math.min(3600, baseWpm + randrange(-wpmVar, wpmVar)));
      const cpm = wpm * 5;
      const charDelay = 60 * 1000 / cpm;
      charDelays.push(charDelay);
    }

    await sleep(4.3);
    ws.send('4{"stream":"race","msg":"update","payload":{"t":1,"f":0}}');
    let t = 2;
    let e = 1;

    for (let i = 0; i < fullText.length; i++) {
      ws.send(`4{"stream":"race","msg":"update","payload":{"t":${t},"f":${e}}}`);
      await sleep(charDelays[i] / 1000);
      t++;
    }
  }

  createGUI();

  const hookInterval = setInterval(() => {
    if (sockets.length > 0) {
      const ws = sockets[0];
      if (!ws._ntbot_hooked) {
        ws._ntbot_hooked = true;
        ws.addEventListener('message', event => main(ws, event));
        clearInterval(hookInterval);
      }
    }
  }, 500);
})();
