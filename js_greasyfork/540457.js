// ==UserScript==
// @name         Show Privy Token from Cookies
// @namespace    https://t.me/forestarmy
// @version      1.0
// @description  Show and copy only privy-token from cookies on screen (as seen in image)
// @author       itsmesatyavir
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/540457/Show%20Privy%20Token%20from%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/540457/Show%20Privy%20Token%20from%20Cookies.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getPrivyToken() {
    const match = document.cookie.match(/privy-token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function showToken(token) {
    const box = document.createElement("div");
    box.innerHTML = `
      <div style="
        background: #111;
        color: #0ff;
        padding: 12px;
        font-family: monospace;
        font-size: 12px;
        border: 2px solid #0ff;
        border-radius: 8px;
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 99999;
        max-width: 90vw;
        word-break: break-all;
      ">
        <strong>privy-token:</strong><br>${token}<br><br>
        <button id="copyPrivyBtn" style="
          background: #0ff;
          color: #000;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        ">📋 Copy Token</button>
      </div>
    `;
    document.body.appendChild(box);

    document.getElementById("copyPrivyBtn").onclick = () => {
      GM_setClipboard(token);
      document.getElementById("copyPrivyBtn").innerText = "✅ Copied!";
      setTimeout(() => {
        document.getElementById("copyPrivyBtn").innerText = "📋 Copy Token";
      }, 1500);
    };
  }

  window.addEventListener("load", () => {
    const token = getPrivyToken();
    if (token) {
      showToken(token);
      console.log("✅ privy-token found:", token);
    } else {
      console.warn("⚠️ privy-token not found in cookies.");
    }
  });
})();
