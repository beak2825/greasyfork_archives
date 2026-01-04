// ==UserScript==
// @name         DeepSeek Auto-Retry with Text & SVG Detection
// @version      1.6
// @description  Auto retry when server busy detected by text or SVG icon, with toggle UI and cooldown.
// @author       balkken
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      Blakken 
// @namespace https://greasyfork.org/users/1477546
// @downloadURL https://update.greasyfork.org/scripts/537970/DeepSeek%20Auto-Retry%20with%20Text%20%20SVG%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/537970/DeepSeek%20Auto-Retry%20with%20Text%20%20SVG%20Detection.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const config = {
    autoRetryEnabled: true,
    cooldown: 15000, // 15 sec entre clics
  };

  function showStatus(msg) {
    let el = document.getElementById("autoRetryStatus");
    if (!el) {
      el = document.createElement("div");
      el.id = "autoRetryStatus";
      el.style.position = "fixed";
      el.style.bottom = "100px";
      el.style.right = "20px";
      el.style.backgroundColor = "rgba(0,0,0,0.7)";
      el.style.color = "white";
      el.style.padding = "6px 12px";
      el.style.borderRadius = "6px";
      el.style.zIndex = "9999";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    setTimeout(() => {
      if (el.textContent === msg) el.textContent = "";
    }, 3000);
  }

  function findRetryButton() {
    const buttons = document.querySelectorAll('div[role="button"]');
    for (const btn of buttons) {
      const path = btn.querySelector('svg path');
      if (!path) continue;

      const d = path.getAttribute("d") || "";
      if (d.startsWith("M1.27209")) {
        return btn;
      }
    }
    return null;
  }

  function checkAndRetry() {
    if (!config.autoRetryEnabled) return;

    const now = Date.now();
    if (window.lastRetryTime && now - window.lastRetryTime < config.cooldown) {
      const remaining = Math.round((config.cooldown - (now - window.lastRetryTime)) / 1000);
      showStatus(`AutoRetry: cooldown (${remaining}s)`);
      return;
    }

    const retryBtn = findRetryButton();
    if (retryBtn) {
      retryBtn.click();
      window.lastRetryTime = now;
      showStatus("AutoRetry: clicked Retry (SVG)");
      console.log("AutoRetry: Retry clicked", retryBtn);
    }
  }

  function createToggleUI() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "70px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.backgroundColor = "rgba(0,0,0,0.6)";
    container.style.padding = "8px 12px";
    container.style.borderRadius = "8px";
    container.style.color = "white";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "14px";
    container.style.userSelect = "none";

    container.innerHTML = `
      <label style="cursor: pointer;">
        <input type="checkbox" id="autoRetryCheckbox" checked style="margin-right:6px;">
        Auto‑Retry
      </label>
    `;
    document.body.appendChild(container);

    document.getElementById("autoRetryCheckbox").addEventListener("change", e => {
      config.autoRetryEnabled = e.target.checked;
      showStatus(`Auto‑Retry ${config.autoRetryEnabled ? "ON" : "OFF"}`);
    });
  }

  function init() {
    createToggleUI();
    setInterval(checkAndRetry, 1000); // toutes les secondes
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
