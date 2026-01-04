// ==UserScript==
// @name         NodePay Token Sniffer (localStorage + network)
// @namespace    Forest Army Scripts
// @version      2.0
// @description  Extract np_token and np_webapp_token from localStorage or network responses [file maintained by t.me/forestarmy]
// @match        https://app.nodepay.ai/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541285/NodePay%20Token%20Sniffer%20%28localStorage%20%2B%20network%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541285/NodePay%20Token%20Sniffer%20%28localStorage%20%2B%20network%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const tokenBox = document.createElement('div');
  tokenBox.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #111;
    color: #0ff;
    padding: 15px;
    border: 2px solid #0ff;
    border-radius: 12px;
    z-index: 9999;
    font-family: monospace;
    max-width: 400px;
  `;

  tokenBox.innerHTML = `
    <div><strong>🌐 NodePay Tokens</strong></div>
    <div style="margin-top:10px;"><b>np_token:</b><br>
      <textarea id="np_token_text" rows="2" style="width:100%;font-size:12px;">Searching...</textarea>
      <button id="copy_np_token">Copy</button>
    </div>
    <div style="margin-top:10px;"><b>np_webapp_token:</b><br>
      <textarea id="np_webapp_token_text" rows="2" style="width:100%;font-size:12px;">Searching...</textarea>
      <button id="copy_np_webapp_token">Copy</button>
    </div>
    <div style="margin-top:10px;text-align:center;">
      <a href="https://t.me/forestarmy" target="_blank" style="text-decoration:none;">
        <button style="background:#0ff;color:#000;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;">
          🚀 Join Telegram
        </button>
      </a>
    </div>
  `;
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(tokenBox));

  // Copy handlers
  document.addEventListener('click', (e) => {
    if (e.target.id === 'copy_np_token') {
      navigator.clipboard.writeText(document.getElementById('np_token_text').value);
      alert("np_token copied!");
    } else if (e.target.id === 'copy_np_webapp_token') {
      navigator.clipboard.writeText(document.getElementById('np_webapp_token_text').value);
      alert("np_webapp_token copied!");
    }
  });

  // Attempt from localStorage
  function tryLocalStorage() {
    const token = localStorage.getItem('np_token');
    const webToken = localStorage.getItem('np_webapp_token');
    if (token) document.getElementById('np_token_text').value = token;
    if (webToken) document.getElementById('np_webapp_token_text').value = webToken;
  }

  // Intercept fetch responses to capture tokens
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).then(async (response) => {
      try {
        const clone = response.clone();
        const url = response.url;
        if (url.includes("/v1/") || url.includes("/api/")) {
          const text = await clone.text();
          if (text.includes("np_token") || text.includes("np_webapp_token")) {
            const matches = text.match(/np_(webapp_)?token["']?\s*[:=]\s*["']([a-zA-Z0-9-_\.]+)["']/g);
            if (matches) {
              matches.forEach(m => {
                const parts = m.split(/["']\s*[:=]\s*["']/);
                const key = parts[0].replace(/["']/g, '').trim();
                const value = parts[1];
                if (key === 'np_token') {
                  document.getElementById('np_token_text').value = value;
                } else if (key === 'np_webapp_token') {
                  document.getElementById('np_webapp_token_text').value = value;
                }
              });
            }
          }
        }
      } catch (err) {}
      return response;
    });
  };

  // Also poll localStorage every few seconds just in case
  setInterval(tryLocalStorage, 3000);
})();
