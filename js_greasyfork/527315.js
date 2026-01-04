// ==UserScript==
// @name         Discord Auto Reaction Clicker
// @namespace    http://tampermonkey.net/
// @version      1.9.8
// @description  Automatically click reaction buttons on Discord.
// @match        https://discord.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527315/Discord%20Auto%20Reaction%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/527315/Discord%20Auto%20Reaction%20Clicker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY =
    "auto-reaction-bot-b74cc9e2-6d5b-4106-9902-991b2200f706-63f2195c-c55b-455a-a7d2-967699daa727-23b2ce48-50b8-4d0a-9f69-87a9f9e1e554";

  const defaults = {
    running: false,
    reactionDelayMin: 100,
    reactionDelayMax: 1000,
    scanDelayMin: 2000,
    scanDelayMax: 5000,
    minimized: false,
    includeSuperReactions: false,
    uiPosition: { top: 10, right: 10 },
  };

  let settings = Object.assign({}, defaults, loadSettings());

  let running = settings.running;
  let reactionDelayMin = settings.reactionDelayMin;
  let reactionDelayMax = settings.reactionDelayMax;
  let scanDelayMin = settings.scanDelayMin;
  let scanDelayMax = settings.scanDelayMax;
  let includeSuperReactions = settings.includeSuperReactions;
  let isMinimized = settings.minimized;
  let scanTimeout = null;

  function saveSettings() {
    settings.running = running;
    settings.reactionDelayMin = reactionDelayMin;
    settings.reactionDelayMax = reactionDelayMax;
    settings.scanDelayMin = scanDelayMin;
    settings.scanDelayMax = scanDelayMax;
    settings.includeSuperReactions = includeSuperReactions;
    settings.minimized = isMinimized;
    GM_setValue(STORAGE_KEY, JSON.stringify(settings));
  }

  function loadSettings() {
    let stored = GM_getValue(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Recursively clicks each reaction sequentially with a random delay.
  function clickReactionsSequentially(reactions, index, callback) {
    if (!running) return;
    if (index >= reactions.length) {
      if (callback) callback();
      return;
    }
    const reaction = reactions[index];
    if (reaction && typeof reaction.click === "function") {
      reaction.click();
      console.log("Clicked reaction:", reaction);
    }
    const delay = getRandomDelay(reactionDelayMin, reactionDelayMax);
    setTimeout(() => {
      clickReactionsSequentially(reactions, index + 1, callback);
    }, delay);
  }

  // Main function to process reaction elements.
  function processReactions() {
    if (!running) return;
    // Get all unpressed reaction elements.
    let reactions = Array.from(
      document.querySelectorAll(
        "[class^='reactionInner'][aria-pressed='false']"
      )
    );
    // If includeSuperReactions is disabled, filter out reactions with aria-label
    // that include "press to super react"
    if (!includeSuperReactions) {
      reactions = reactions.filter((reaction) => {
        const ariaLabel = reaction.getAttribute("aria-label") || "";
        return !ariaLabel.toLowerCase().includes("press to super react");
      });
    }
    if (reactions.length === 0) {
      console.log("No clickable reactions found.");
      const delay = getRandomDelay(scanDelayMin, scanDelayMax);
      console.log(`Waiting ${delay} ms before the next scan.`);
      scanTimeout = setTimeout(processReactions, delay);
      return;
    }
    console.log(`Found ${reactions.length} reaction(s) to click.`);
    clickReactionsSequentially(reactions, 0, () => {
      if (!running) return;
      const delay = getRandomDelay(scanDelayMin, scanDelayMax);
      console.log(`Waiting ${delay} ms before the next scan.`);
      scanTimeout = setTimeout(processReactions, delay);
    });
  }

  // Create the UI.
  function createUI() {
    const container = document.createElement("div");
    container.id = "reactionBotUI";
    container.style.position = "fixed";
    container.style.top = settings.uiPosition.top + "px";
    container.style.right = settings.uiPosition.right + "px";

    Object.assign(container.style, {
      backgroundColor: "#2f3136",
      border: "1px solid #202225",
      padding: "8px",
      fontSize: "12px",
      zIndex: "9999",
      borderRadius: "4px",
      color: "#dcddde",
      fontFamily: "gg sans, Helvetica Neue, Helvetica, Arial, sans-serif",
      boxShadow: "0 2px 10px 0 rgba(0,0,0,.2)",
      transition: "all 0.2s ease",
      width: "200px",
    });

    const htmlContent = `
      <div id="botHeader" style="display:flex; justify-content: space-between;
          align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 600;">Reaction Bot</span>
        <button id="minimizeButton" style="background: none; border: none;
          color: #dcddde; cursor: pointer; padding: 0 4px;">${
            isMinimized ? "▲" : "▼"
          }</button>
      </div>
      <div id="botControls" style="display: ${
        isMinimized ? "none" : "block"
      };">
        <button id="toggleButton" style="width: 100%; margin-bottom: 8px;">${
          running ? "Stop" : "Start"
        }</button>
        <div style="margin-bottom: 8px;">
          <div style="margin-bottom: 4px; font-size: 11px; color: #b9bbbe;">
            Reaction Delay (ms):
          </div>
          <div style="display: flex; gap: 4px;">
            <input type="number" id="reactionDelayMin" value="${reactionDelayMin}"
              placeholder="Min" style="width: 50%;">
            <input type="number" id="reactionDelayMax" value="${reactionDelayMax}"
              placeholder="Max" style="width: 50%;">
          </div>
        </div>
        <div style="margin-bottom: 8px;">
          <label style="font-size:11px; color: #b9bbbe;">
            <input type="checkbox" id="superReactToggle" ${
              includeSuperReactions ? "checked" : ""
            }> Include Super Reactions
          </label>
        </div>
        <button id="applyButton" style="width: 100%;">Apply Settings</button>
      </div>
    `;

    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const inputs = container.querySelectorAll("input");
    inputs.forEach((input) => {
      Object.assign(input.style, {
        backgroundColor: "#202225",
        border: "1px solid #040405",
        borderRadius: "3px",
        color: "#dcddde",
        padding: "4px",
        fontSize: "12px",
        width: "100%",
      });
    });

    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.id !== "minimizeButton") {
        Object.assign(button.style, {
          backgroundColor: "#4f545c",
          border: "none",
          borderRadius: "3px",
          color: "#fff",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "12px",
        });
      }
    });

    document.getElementById("minimizeButton").addEventListener("click", () => {
      const controls = document.getElementById("botControls");
      isMinimized = !isMinimized;
      controls.style.display = isMinimized ? "none" : "block";
      document.getElementById("minimizeButton").textContent =
        isMinimized ? "▲" : "▼";
      saveSettings();
    });

    document.getElementById("toggleButton").addEventListener("click", () => {
      if (running) {
        stopScript();
      } else {
        startScript();
      }
    });

    document.getElementById("applyButton").addEventListener("click", () => {
      reactionDelayMin =
        parseInt(document.getElementById("reactionDelayMin").value, 10) ||
        reactionDelayMin;
      reactionDelayMax =
        parseInt(document.getElementById("reactionDelayMax").value, 10) ||
        reactionDelayMax;
      includeSuperReactions =
        document.getElementById("superReactToggle").checked;
      console.log("Settings applied:", {
        reactionDelayMin,
        reactionDelayMax,
        includeSuperReactions,
      });
      saveSettings();
    });
  }

  function startScript() {
    running = true;
    document.getElementById("toggleButton").textContent = "Stop";
    document.getElementById("reactionDelayMin").disabled = true;
    document.getElementById("reactionDelayMax").disabled = true;
    document.getElementById("applyButton").disabled = true;
    console.log("Script started.");
    saveSettings();
    processReactions();
  }

  function stopScript() {
    running = false;
    document.getElementById("toggleButton").textContent = "Start";
    document.getElementById("reactionDelayMin").disabled = false;
    document.getElementById("reactionDelayMax").disabled = false;
    document.getElementById("applyButton").disabled = false;
    if (scanTimeout) clearTimeout(scanTimeout);
    console.log("Script stopped.");
    saveSettings();
  }

  createUI();
  saveSettings();
})();
