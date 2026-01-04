// ==UserScript==
// @name         YouTube Embed Switcher & Modal Controls
// @namespace    GPT
// @version      1.0.9
// @description  Switch between /watch, /shorts and /embed + modal window with settings
// @description:ru  Переключение между /watch, /shorts и /embed + модальное окно с настройками
// @author       Wizzergod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://youtu.be/*
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @resource     icon https://images.icon-icons.com/3653/PNG/512/filter_settings_filters_icon_228291.png
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538795/YouTube%20Embed%20Switcher%20%20Modal%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/538795/YouTube%20Embed%20Switcher%20%20Modal%20Controls.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const iconURL = GM_getResourceURL('icon');

  let settings = {
    redirectShorts: true,
    redirectWatch: false
  };

  const STORAGE_KEY = 'yt_embed_settings';

  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) Object.assign(settings, JSON.parse(stored));
    } catch (e) {}
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function getVideoId(url) {
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/shorts\/([\w-]+)/) || url.match(/embed\/([\w-]+)/);
    return m ? m[1] : null;
  }

  function redirectIfNeeded() {
    const url = window.location.href;

    if (settings.redirectShorts && url.includes('/shorts/')) {
      const id = getVideoId(url);
      if (id) location.href = `https://www.youtube.com/embed/${id}`;
    }

    if (settings.redirectWatch && url.includes('/watch?v=')) {
      const id = getVideoId(url);
      if (id) location.href = `https://www.youtube.com/embed/${id}`;
    }
  }

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'yt-embed-modal';

    const modal = document.createElement('div');
    modal.className = 'modal-content';

    const header = document.createElement('h2');
    header.textContent = 'Redirect and Settings';
    modal.appendChild(header);

    const actions = [
      ['goto-watch', '/watch'],
      ['goto-shorts', '/shorts'],
      ['goto-embed', '/embed']
    ];

    actions.forEach(([action, label]) => {
      const btn = document.createElement('button');
      btn.textContent = `Go ᐉ ${label}`;
      btn.dataset.action = action;
      modal.appendChild(btn);
    });

    modal.appendChild(document.createElement('hr'));

    const shortsLabel = document.createElement('label');
    const shortsCheckbox = document.createElement('input');
    shortsCheckbox.type = 'checkbox';
    shortsCheckbox.id = 'toggle-shorts';
    shortsLabel.appendChild(shortsCheckbox);
    shortsLabel.append('Auto /shorts ᐉ /embed');
    modal.appendChild(shortsLabel);
    modal.appendChild(document.createElement('br'));

    const watchLabel = document.createElement('label');
    const watchCheckbox = document.createElement('input');
    watchCheckbox.type = 'checkbox';
    watchCheckbox.id = 'toggle-watch';
    watchLabel.appendChild(watchCheckbox);
    watchLabel.append('Auto /watch ᐉ /embed');
    modal.appendChild(watchLabel);
    modal.appendChild(document.createElement('br'));

    modal.appendChild(document.createElement('br'));




    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-modal';
    closeBtn.textContent = '❌ Close';
    modal.appendChild(closeBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    shortsCheckbox.checked = settings.redirectShorts;
    watchCheckbox.checked = settings.redirectWatch;

    shortsCheckbox.addEventListener('change', (e) => {
      settings.redirectShorts = e.target.checked;
      saveSettings();
    });

    watchCheckbox.addEventListener('change', (e) => {
      settings.redirectWatch = e.target.checked;
      saveSettings();
    });

    modal.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = getVideoId(window.location.href);
        if (!id) return;
        const action = btn.dataset.action;
        if (action === 'goto-watch') location.href = `https://www.youtube.com/watch?v=${id}`;
        if (action === 'goto-shorts') location.href = `https://www.youtube.com/shorts/${id}`;
        if (action === 'goto-embed') location.href = `https://www.youtube.com/embed/${id}`;
      });
    });

    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }

  function toggleOverlay() {
    const modal = document.getElementById('yt-embed-modal');
    if (modal) {
      modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }
  }

  function addPlayerButton() {
    const interval = setInterval(() => {
      const controls = document.querySelector('.ytp-right-controls');
      if (controls && !document.getElementById('embedSwitchBtn')) {
        const btn = document.createElement('button');
        btn.id = 'embedSwitchBtn';
        btn.className = 'ytp-button';
        btn.title = 'Open Settings';
        btn.style.backgroundImage = `url(${iconURL})`;
        btn.onclick = toggleOverlay;
        controls.prepend(btn);
        clearInterval(interval);
      }
    }, 1000);
  }

  GM_addStyle(`
    #yt-embed-modal {
      display: none;
      position: fixed;
      z-index: 99999;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #111111c4;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: #111111c4;
      color: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45), -3px -3px rgba(0, 0, 0, .1) inset;
      min-width: 300px;
      text-align: center;
      z-index: 99999;
    }
    .modal-content h2 {
      margin-bottom: 10px;
    }
    .modal-content button {
      padding: 5px 8px;
      background-color: #ffffffab;
      border: 0.1px solid rgba(255, 255, 255, 0.74);
      cursor: pointer;
      border-radius: 5px;
      ition: color 0.3s ease, background-color 0.3s ease;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45), -3px -3px rgba(0, 0, 0, .1) inset;
      line-height: 1.5rem;
      margin: 10px;
      form: scale(1.15) !important;
      font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
      font-size: 16px;
      font-weight: bold;
      align-items: center;
      letter-spacing: -0.04em;
      text-decoration: none;
    }
    .modal-content button:hover {
      background-color: #a0bae37d;
      border: 0.1px solid #27cde86b;
      color: #75ecfff0;
      box-shadow: 0 2px 10px #27cde86b, -3px -3px rgba(0, 0, 0, .1) inset;
    }
    .modal-content button:active {
      border: 1px solid #565656a3;
      form: late(1px, 1px);
      form: scale(1.10) !important;
    }
    .modal-content input[type="checkbox"] {
      form: scale(1.15);
      margin-right: 6px;
    }
    #embedSwitchBtn {
      background-size: 30px 30px !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
/*    width: 48px !important; */
/*    height: 45px !important; */
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      margin: 0 1px !important;
      ition: form 0.3s ease, color 0.3s ease, background-color 0.3s ease !important;
    }
    #embedSwitchBtn:hover {
      form: scale(1.15) !important;
    }
    #embedSwitchBtn:active {
      form: scale(0.90) !important;
      background-color: rgba(0, 0, 0, 0.1) !important;
    }
    #yt-embed-modal .modal-content {
      animation: fadeInUp 0.3s ease;
    }
    @keyframes fadeInUp {
      from { form: lateY(20px); opacity: 0; }
      to { form: lateY(0); opacity: 1; }
    }
  `);

  loadSettings();
  createOverlay();
  redirectIfNeeded();
  addPlayerButton();
})();