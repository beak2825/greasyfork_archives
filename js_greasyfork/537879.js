// ==UserScript==
// @name         Kour.io Instakill 2025
// @match        *://kour.io/*
// @version      1.0
// @icon         https://upload.wikimedia.org/wikipedia/commons/f/fd/The_death.svg
// @author       Partypixelparty7
// @description  Enables an Instakill feature for Kour.io. Toggle menu with Right-Shift.
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_info
// @namespace https://greasyfork.org/users/1476481
// @downloadURL https://update.greasyfork.org/scripts/537879/Kourio%20Instakill%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/537879/Kourio%20Instakill%202025.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Global configuration for the script's features
  const featureSettings = { config: { instakillActive: false } };
  unsafeWindow.kourFeatureSettings = featureSettings;


  const PacketSignatures = {
    playerUpdate: "f3 02 fd 02 f4 03 c8"
  };

  function arrayBufferToHexString(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join(" ");
  }

  (function setupWebSocketHook() {
    if (!unsafeWindow.WebSocket) {
      console.warn("[KourInstakill] WebSocket API not found. Hook not initialized.");
      return;
    }
    const OriginalWebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = function (...args) {
      const wsInstance = new OriginalWebSocket(...args);
      const originalSend = wsInstance.send;

      wsInstance.send = function (data) {
        if (data instanceof ArrayBuffer &&
            arrayBufferToHexString(data).startsWith(PacketSignatures.playerUpdate) &&
            featureSettings.config.instakillActive) {
          for (let i = 0; i < 41; i++) {
            originalSend.call(wsInstance, data);
          }
          return;
        }
        return originalSend.call(wsInstance, data);
      };
      return wsInstance;
    };
    unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;
    console.log("[KourInstakill] WebSocket hook initialized for Instakill.");
  })();



  // --- Instakill Menu Creation
  function createInstakillMenu() {
    const menu = document.createElement("div");
    menu.id = "instakillControlMenu";
    menu.style.position = "fixed";
    menu.style.top = "10px";
    menu.style.right = "10px";
    menu.style.backgroundColor = "rgba(35, 39, 42, 0.95)"; // Dark Discord-like bg
    menu.style.border = "1px solid #2c2f33"; // Slightly lighter border
    menu.style.borderRadius = "8px"; // More rounded
    menu.style.padding = "10px"; // Reduced padding
    menu.style.zIndex = "25000";
    menu.style.color = "#dcddde"; // Light gray text (Discord-like)
    menu.style.fontFamily = "'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif"; // Discord font stack
    menu.style.fontSize = "13px"; // Smaller base font size
    menu.style.display = "none";
    menu.style.minWidth = "200px"; // Reduced min-width
    menu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)"; // Softer, more prominent shadow
    menu.style.transition = "opacity 0.2s ease-in-out, transform 0.2s ease-in-out";

    const title = document.createElement("div");
    title.textContent = "Instakill";
    title.style.fontSize = "15px";
    title.style.fontWeight = "600"; // Semi-bold
    title.style.marginBottom = "8px";
    title.style.paddingBottom = "4px";
    title.style.borderBottom = "1px solid #4f545c"; // Discord-like separator
    title.style.textAlign = "center";
    title.style.color = "#7289da"; // Discord blurple
    menu.appendChild(title);

    const instakillButton = document.createElement("button");
    instakillButton.id = "instakillToggleButton";
    instakillButton.textContent = "Instakill: OFF";
    instakillButton.style.backgroundColor = "#4f545c"; // Darker gray for OFF (Discord-like)
    instakillButton.style.color = "white";
    instakillButton.style.border = "none";
    instakillButton.style.padding = "7px 10px"; // Reduced padding
    instakillButton.style.cursor = "pointer";
    instakillButton.style.width = "100%";
    instakillButton.style.marginBottom = "10px";
    instakillButton.style.fontSize = "13px";
    instakillButton.style.borderRadius = "5px";
    instakillButton.style.transition = "background-color 0.15s ease, transform 0.1s ease";
    instakillButton.style.fontWeight = "500";

    instakillButton.onmouseover = function() {
      this.style.transform = "scale(1.02)";
      if (!featureSettings.config.instakillActive) this.style.backgroundColor = "#5c6269";
      else this.style.backgroundColor = "#3ca374"; // Darker active green
    };
    instakillButton.onmouseout = function() {
      this.style.transform = "scale(1)";
      if (!featureSettings.config.instakillActive) this.style.backgroundColor = "#4f545c";
      else this.style.backgroundColor = "#43b581"; // Discord Green
    };
     instakillButton.onmousedown = function() { this.style.transform = "scale(0.98)"; };
     instakillButton.onmouseup = function() { this.style.transform = "scale(1.02)"; };


    instakillButton.onclick = function () {
      featureSettings.config.instakillActive = !featureSettings.config.instakillActive;
      if (featureSettings.config.instakillActive) {
        this.textContent = "Instakill: ON";
        this.style.backgroundColor = "#43b581"; // Discord Green
      } else {
        this.textContent = "Instakill: OFF";
        this.style.backgroundColor = "#4f545c";
      }
    };
    menu.appendChild(instakillButton);

    // Disclaimer Block (Revised Text)
    const disclaimerContainer = document.createElement("div");
    disclaimerContainer.style.fontSize = "10px";
    disclaimerContainer.style.color = "#b9bbbe"; // Lighter gray (Discord)
    disclaimerContainer.style.marginBottom = "8px";
    disclaimerContainer.style.padding = "6px";
    disclaimerContainer.style.backgroundColor = "rgba(0,0,0,0.15)";
    disclaimerContainer.style.borderRadius = "4px";
    disclaimerContainer.style.border = "1px solid #2c2f33";

    const disclaimerP1 = document.createElement("p");
    disclaimerP1.innerHTML = "📦 <strong>GitHub Homepage:</strong>You can visit my GitHub homepage here";
    disclaimerP1.style.margin = "0 0 3px 0";

    const disclaimerP3 = document.createElement("p"); // NEUER ABSATZ
    disclaimerP3.textContent = "Thanks for using this script!";
    disclaimerP3.style.margin = "0";

    disclaimerContainer.appendChild(disclaimerP1);
    // disclaimerContainer.appendChild(disclaimerP2); // ENTFERNT, da disclaimerP2 nicht definiert war
    disclaimerContainer.appendChild(disclaimerP3);
    menu.appendChild(disclaimerContainer);

    const cheatLink = document.createElement("a");
    cheatLink.href = "https://partypixelparty7.github.io/All-my-Scripts/#";
    cheatLink.textContent = "GitHub Homepage"; // More generic
    cheatLink.target = "_blank";
    cheatLink.style.color = "#7289da"; // Discord blurple
    cheatLink.style.textDecoration = "none";
    cheatLink.style.fontSize = "11px";
    cheatLink.style.display = "block";
    cheatLink.style.textAlign = "center";
    cheatLink.style.padding = "4px 0";
    cheatLink.style.borderRadius = "3px";
    cheatLink.style.transition = "background-color 0.15s ease, color 0.15s ease";

    cheatLink.onmouseover = function() {
        this.style.backgroundColor = "rgba(114, 137, 218, 0.2)";
        this.style.color = "#ffffff";
    };
    cheatLink.onmouseout = function() {
        this.style.backgroundColor = "transparent";
        this.style.color = "#7289da";
    };
    menu.appendChild(cheatLink);

    const authorText = document.createElement("div");
    try {
        authorText.textContent = `v${GM_info.script.version} by Partypixelparty7`;
    } catch (e) {
        authorText.textContent = `by Partypixelparty7`; // Fallback if GM_info is not available
    }
    authorText.style.fontSize = "9px";
    authorText.style.color = "#72767d"; // Darker gray (Discord)
    authorText.style.marginTop = "6px";
    authorText.style.textAlign = "center";
    authorText.style.borderTop = "1px solid #4f545c";
    authorText.style.paddingTop = "4px";
    menu.appendChild(authorText);

    document.body.appendChild(menu);
  }

  // Menu Toggle Function (Right-Shift)
  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, [contenteditable='true'], [contenteditable]")) {
      return;
    }
    if (e.code === "ShiftRight") {
      e.preventDefault();
      const menu = document.getElementById("instakillControlMenu");
      if (menu) {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
      }
    }
  });

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', createInstakillMenu);
  } else {
    createInstakillMenu();
  }

  console.log(`[KourInstakill] Script v${GM_info && GM_info.script ? GM_info.script.version : 'N/A'} loaded. Press 'Right-Shift' to toggle menu.`);

})();