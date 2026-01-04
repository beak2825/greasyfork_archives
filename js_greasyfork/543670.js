// ==UserScript==
// @name         B7 Auth Token Tool (BLESS)
// @namespace    https://t.me/forestarmy
// @version      1.3
// @description  Extract B7S_AUTH_TOKEN from localStorage
// @author       forestarmy
// @license      MIT
// @match        *://*.bless.network/*
// @match        *://bless.network/*
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543670/B7%20Auth%20Token%20Tool%20%28BLESS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543670/B7%20Auth%20Token%20Tool%20%28BLESS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEY = 'B7S_AUTH_TOKEN'; // Key name in localStorage

  function readToken() {
    try {
      return localStorage.getItem(KEY) || '(not found)';
    } catch (e) {
      console.error('B7 Token Copier: failed to read token', e);
      return '(error)';
    }
  }

  function copyToClipboard(text) {
    if (typeof GM_setClipboard === 'function') {
      GM_setClipboard(text);
      return Promise.resolve();
    }
    return navigator.clipboard?.writeText(text) || Promise.resolve();
  }

  function buildUI() {
    if (document.getElementById('b7-token-toggle')) return;

    GM_addStyle(`
      #b7-token-toggle{
        position: fixed;
        right: 15px;
        bottom: 15px;
        z-index: 999999;
        width: 40px;
        height: 40px;
        background: #4a90e2;
        color: #fff;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,.25);
      }
      #b7-token-panel{
        position: fixed;
        right: 12px;
        bottom: 65px;
        z-index: 999999;
        background: rgba(0,0,0,.85);
        color: #fff;
        font: 12px/1.4 system-ui, sans-serif;
        padding: 10px;
        border-radius: 8px;
        width: 340px;
        box-shadow: 0 4px 16px rgba(0,0,0,.25);
        display: none;
      }
      #b7-token-panel textarea{
        width: 100%;
        height: 80px;
        resize: vertical;
        background: #111;
        color: #0f0;
        border: 1px solid #333;
        border-radius: 4px;
        padding: 6px;
        font-family: monospace;
        font-size: 11px;
      }
      #b7-token-panel button{
        margin-top: 6px;
        cursor: pointer;
        border: 0;
        border-radius: 4px;
        padding: 4px 8px;
        background: #4a90e2;
        color: #fff;
        font-size: 12px;
      }
      #b7-token-panel .links{
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }
      #b7-token-panel .links a{
        flex: 1;
        text-align: center;
        padding: 5px 0;
        border-radius: 4px;
        text-decoration: none;
        font-size: 12px;
        color: #fff;
      }
      #b7-token-panel .links a.tg { background: #0088cc; }
      #b7-token-panel .links a.yt { background: #ff0000; }
    `);

    const toggle = document.createElement('div');
    toggle.id = 'b7-token-toggle';
    toggle.textContent = '⚙️';
    document.body.appendChild(toggle);

    const panel = document.createElement('div');
    panel.id = 'b7-token-panel';
    panel.innerHTML = `
      <div><strong>Bless B7 Auth Token</strong></div>
      <textarea id="b7-token-textarea" readonly></textarea>
      <button id="b7-copy">Copy</button>
      <div class="links">
        <a href="https://t.me/forestarmy" target="_blank" class="tg">Join Telegram</a>
        <a href="https://youtube.com/forestarmy" target="_blank" class="yt">YouTube</a>
      </div>
    `;
    document.body.appendChild(panel);

    const ta = document.getElementById('b7-token-textarea');
    const copyBtn = document.getElementById('b7-copy');

    function updateToken() {
      ta.value = readToken();
    }

    toggle.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      updateToken();
    });

    copyBtn.addEventListener('click', () => {
      copyToClipboard(ta.value).then(() => alert('Token Copied!'));
    });

    updateToken();
  }

  setTimeout(buildUI, 2000); // wait for page to load
})();