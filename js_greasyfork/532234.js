// ==UserScript==
// @name         BF4 Server Notifier
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Notifies when a Battlefield 4 server matches your filters
// @match        *://battlelog.battlefield.com/bf4/servers/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @author       TorrentOfSouls
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532234/BF4%20Server%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/532234/BF4%20Server%20Notifier.meta.js
// ==/UserScript==

window.onload = function () {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  const saved = GM_getValue("scriptEnabled");
  const scriptEnabled = saved === "true";

  const maps = {
    Vanilla: [
      "Siege of Shanghai",
      "Paracel Storm",
      "Flood Zone",
      "Zavod 311",
      "Lancang Dam",
      "Hainan Resort",
      "Dawnbreaker",
      "Rogue Transmission",
      "Golmud Railway",
      "Operation Locker",
    ],
    "China Rising": ["Silk Road", "Altai Range", "Guilin Peaks", "Dragon Pass"],
    "Second Assault": [
      "Operation Metro 2014",
      "Caspian Border 2014",
      "Gulf of Oman 2014",
      "Operation Firestorm 2014",
    ],
    "Naval Strike": [
      "Lost Islands",
      "Nansha Strike",
      "Wave Breaker",
      "Operation Mortar",
    ],
    "Dragon's Teeth": [
      "Pearl Market",
      "Propaganda",
      "Sunken Dragon",
      "Lumphini Garden",
    ],
    "Final Stand": [
      "Hangar 21",
      "Operation Whiteout",
      "Giants of Karelia",
      "Hammerhead",
    ],
    "Night Operations": ["Zavod: Graveyard Shift"],
    "Community Operations": ["Operation Outbreak"],
    "Legacy Operations": ["Dragon Valley 2015"],
  };

  const modes = [
    "Conquest",
    "Conquest Large",
    "Conquest Small",
    "Team Deathmatch",
    "Domination",
    "Obliteration",
    "Defuse",
    "Rush",
    "Squad Deathmatch",
    "Chain Link",
    "Carrier Assault",
    "Air Superiority",
    "Gun Master",
    "Capture the Flag",
  ];

  const presets = ["Normal", "Hardcore", "Infantry Only", "Custom"];

  const container = document.createElement("div");
  container.innerHTML = `
            <style>
              #bf4-container {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #000;
                color: #fff;
                border: 2px solid #007bff;
                padding: 0;
                width: 300px;
                font-family: sans-serif;
                font-size: 14px;
                z-index: 10000;
                max-height: 90vh;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
              }
              #bf4-header {
                background-color: #007bff;
                color: white;
                padding: 4px 8px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
              }
              #bf4-header h3 {
                margin: 0;
                font-size: 16px;
              }
              #toggleBtn {
                background: none;
                border: none;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 16px;
              }
              #bf4-body {
                padding: 0.5rem;
                background-color: #000;
                overflow-y: auto;
              }
              h3 {
                font-size: 14px;
                margin: 0;
                color: #ddd;
                text-transform: uppercase;
                line-height: 30px;
              }
              .checkbox-group {
                max-height: 100px;
                overflow-y: auto;
                border: 1px solid #444;
                padding: 0.4rem;
                background: #111;
              }
              label {
                display: block;
                margin-bottom: 2px;
                color: #ccc;
                font-size: 13px;
              }
              input[type="number"] {
                width: 96%;
                padding: 4px;
                border-radius: 4px;
                border: 1px solid #555;
                background-color: #222;
                color: #fff;
                font-size: 13px;
              }
              #footer button {
                margin-top: 8px;
                padding: 6px;
                width: 48%;
                font-weight: bold;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
              }
              #saveBtn { background-color: #007bff; color: white; }
              #saveBtn:hover { background-color: #0056b3; }
              #clearBtn { background-color: #dc3545; color: white; }
              #clearBtn:hover { background-color: #b02a37; }
              .server-row.highlight-match {
                outline: 3px solid #00ffcc !important;
                background-color: rgba(0, 255, 204, 0.1) !important;
                scroll-margin-top: 100px;
              }
              #scriptToggleContainer {
                display: flex;
                align-items: center;
                margin-bottom: 0.7rem;
                gap: 0.5rem;
              }
              .switch {
                position: relative;
                display: inline-block;
                width: 34px;
                height: 18px;
              }
              .switch input {
                opacity: 0;
                width: 0;
                height: 0;
              }
              .slider {
                position: absolute;
                cursor: pointer;
                background-color: #ccc;
                border-radius: 34px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                transition: 0.3s;
              }
              .slider:before {
                position: absolute;
                content: "";
                height: 12px;
                width: 12px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                border-radius: 50%;
                transition: 0.3s;
              }
              input:checked + .slider {
                background-color: #28a745;
              }
              input:checked + .slider:before {
                transform: translateX(16px);
              }
              .toggle-label {
                color: #fff;
                font-size: 13px;
              }
                #bf4-toast {
                position: absolute;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #28a745;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 14px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 9999;
                width: 150px;
            }
                #bf4-toast.show {
                opacity: 1;
            }
            #switchInfo {
                display: flex;
                justify-content: space-between;
            }
            </style>
            <div id="bf4-container">
              <div id="bf4-header">
                <h3>BF4 Notifier</h3>
                <button id="toggleBtn">−</button>
              </div>
              <div id="bf4-body">
                <div id='switchInfo'>
                  <div id="scriptToggleContainer"> 
                    <label class="switch">
                        <input type="checkbox" id="toggleScriptSwitch">
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Enable Script</span>
                  </div>

                  <div style="position: relative;">
                    <span id="info-icon" style="cursor: pointer; user-select: none;" title="Click for info">ℹ️</span>
                    <div id="info-box" style="
                        display: none;
                        position: absolute;
                        top: 24px;
                        right: 0;
                        background: #1e1e1e;
                        border: 1px solid #555;
                        border-radius: 8px;
                        padding: 12px;
                        font-size: 12px;
                        color: #ccc;
                        z-index: 9999;
                        width: 260px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    ">
                        <strong style="color:#fff;">How it works:</strong><br><br>
                        This extension checks for Battlefield 4 servers based on your selected filters.<br><br>
                        🔄 It auto-refreshes every 60 seconds.<br>
                        🗺️ You must select at least one map to activate detection.<br>
                        🎮 Modes and presets are optional.<br><br>
                        ⚠️ <strong style="color:#f66;">Important:</strong> You must be on:<br>

                        <a href="https://battlelog.battlefield.com/bf4/servers/" target="_blank" style="color: #ccc; text-decoration: underline;">
                            https://battlelog.battlefield.com/bf4/servers/
                        </a>
                    </div>
                </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                  <h3 style="margin: 0;">Minimum Players</h3>
                  <div style="font-size: 11px; color: #aaa; text-align: right;" id="countdown-container">
                    ⏱️ Reload servers: <span id="click-timer">30</span>s<br>
                    🔁 Reload page: <span id="reload-timer"> 600</span>s
                  </div>
                </div>
                <input type="number" id="minPlayers" min="0" max="64" />
                <h3>Maps</h3>
                <div id="mapCheckboxes" class="checkbox-group"></div>
                <h3>Modes</h3>
                <div id="modeCheckboxes" class="checkbox-group"></div>
                <h3>Presets</h3>
                <div id="presetCheckboxes" class="checkbox-group"></div>
                <div id="footer" style="display: flex; justify-content: space-between;">
                    <button id="saveBtn">Save</button>
                    <button id="clearBtn">Clear</button>
                </div>
                <div id="bf4-toast">Saved!</div>
                <div style="text-align: center; font-size: 11px; margin-top: 10px; color: #ccc;">
                    made with <span style="color: #e25555;">♥</span> by 
                    <a href="https://www.youtube.com/@TorrentOfSouls" target="_blank" style="color: #ccc; text-decoration: underline;">
                        TorrentOfSouls
                    </a>
                </div>
              </div>
            </div>
          `;

  let clickCountdown = 30;
  let reloadCountdown = 600;

  setInterval(() => {
    const isEnabled = toggleScriptSwitch.checked;
    if (!isEnabled) return;

    if (clickCountdown > 0) clickCountdown--;
    if (reloadCountdown > 0) reloadCountdown--;

    const clickEl = document.getElementById("click-timer");
    const reloadEl = document.getElementById("reload-timer");

    if (clickEl) clickEl.textContent = clickCountdown;
    if (reloadEl) reloadEl.textContent = reloadCountdown;
  }, 1000);

  function resetClickCountdown() {
    clickCountdown = 30;
  }
  function resetReloadCountdown() {
    reloadCountdown = 600;
  }
  document.body.appendChild(container);

  function showToast(message, bgColor = "#28a745") {
    const toast = document.getElementById("bf4-toast");
    toast.textContent = message;
    toast.style.backgroundColor = bgColor;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  const infoIcon = document.getElementById("info-icon");
  const infoBox = document.getElementById("info-box");

  let infoBoxTimeout;

  infoIcon.addEventListener("mouseenter", () => {
    clearTimeout(infoBoxTimeout);
    infoBox.style.display = "block";
  });

  infoIcon.addEventListener("mouseleave", () => {
    infoBoxTimeout = setTimeout(() => {
      infoBox.style.display = "none";
    }, 200);
  });

  infoBox.addEventListener("mouseenter", () => {
    clearTimeout(infoBoxTimeout);
    infoBox.style.display = "block";
  });

  infoBox.addEventListener("mouseleave", () => {
    infoBoxTimeout = setTimeout(() => {
      infoBox.style.display = "none";
    }, 200);
  });

  const bf4Container = document.getElementById("bf4-container");
  const bf4Header = document.getElementById("bf4-header");
  let isDragging = false,
    offsetX,
    offsetY;

  bf4Header.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - bf4Container.offsetLeft;
    offsetY = e.clientY - bf4Container.offsetTop;
  });

  document.addEventListener("mouseup", () => (isDragging = false));
  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      bf4Container.style.left = e.clientX - offsetX + "px";
      bf4Container.style.top = e.clientY - offsetY + "px";
      bf4Container.style.right = "auto";
    }
  });

  const toggleBtn = document.getElementById("toggleBtn");
  const bodyDiv = document.getElementById("bf4-body");
  toggleBtn.onclick = () => {
    const isHidden = bodyDiv.style.display === "none";
    bodyDiv.style.display = isHidden ? "block" : "none";
    toggleBtn.textContent = isHidden ? "−" : "+";
  };

  const mapContainer = document.getElementById("mapCheckboxes");
  const modeContainer = document.getElementById("modeCheckboxes");
  const presetContainer = document.getElementById("presetCheckboxes");
  const minPlayersInput = document.getElementById("minPlayers");
  const saveBtn = document.getElementById("saveBtn");
  const clearBtn = document.getElementById("clearBtn");

  const toggleScriptSwitch = document.getElementById("toggleScriptSwitch");
  toggleScriptSwitch.checked = scriptEnabled;

  const countdownContainer = document.getElementById("countdown-container");
  if (countdownContainer) {
    countdownContainer.style.display = scriptEnabled ? "block" : "none";
  }

  function createCheckbox(name, value, container) {
    const id = `${name}-${value}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerHTML = `<input type="checkbox" id="${id}" value="${value}" /> ${value}`;
    container.appendChild(label);
  }

  for (const [group, mapList] of Object.entries(maps)) {
    const legend = document.createElement("h6");
    legend.style.margin = "0.3rem 0 0.2rem";
    legend.style.color = "#ccc";
    legend.textContent = group;
    mapContainer.appendChild(legend);
    mapList.forEach((map) => createCheckbox("map", map, mapContainer));
  }

  modes.forEach((mode) => createCheckbox("mode", mode, modeContainer));
  presets.forEach((preset) =>
    createCheckbox("preset", preset, presetContainer)
  );

  function saveFilters() {
    const selectedMaps = [
      ...mapContainer.querySelectorAll("input:checked"),
    ].map((cb) => cb.value);
    const selectedModes = [
      ...modeContainer.querySelectorAll("input:checked"),
    ].map((cb) => cb.value);
    const selectedPresets = [
      ...presetContainer.querySelectorAll("input:checked"),
    ].map((cb) => cb.value);
    const minPlayers = parseInt(minPlayersInput.value || "0");
    const scriptStatus = toggleScriptSwitch.checked;

    GM_setValue("maps", JSON.stringify(selectedMaps));
    GM_setValue("modes", JSON.stringify(selectedModes));
    GM_setValue("presets", JSON.stringify(selectedPresets));
    GM_setValue("minJogadores", minPlayers.toString());
    GM_setValue("scriptEnabled", scriptStatus.toString());

    showToast("Preferences saved!");
    setTimeout(() => location.reload(), 1000);
    resetReloadCountdown();
  }

  function loadFilters() {
    const savedMaps = JSON.parse(GM_getValue("maps") || "[]");
    const savedModes = JSON.parse(GM_getValue("modes") || "[]");
    const savedPresets = JSON.parse(GM_getValue("presets") || "[]");
    const minPlayers = GM_getValue("minJogadores") || "30";

    minPlayersInput.value = minPlayers;
    mapContainer
      .querySelectorAll("input")
      .forEach((cb) => (cb.checked = savedMaps.includes(cb.value)));
    modeContainer
      .querySelectorAll("input")
      .forEach((cb) => (cb.checked = savedModes.includes(cb.value)));
    presetContainer
      .querySelectorAll("input")
      .forEach((cb) => (cb.checked = savedPresets.includes(cb.value)));
  }

  function clearFilters() {
    mapContainer
      .querySelectorAll("input")
      .forEach((cb) => (cb.checked = false));
    modeContainer
      .querySelectorAll("input")
      .forEach((cb) => (cb.checked = false));
    presetContainer
      .querySelectorAll("input")
      .forEach((cb) => (cb.checked = false));
    minPlayersInput.value = "30";
    GM_deleteValue("maps");
    GM_deleteValue("modes");
    GM_deleteValue("presets");
    GM_deleteValue("minJogadores");
    GM_deleteValue("minJogadores");
  }

  function pageLoad() {
    if (!scriptEnabled) return;

    const result = scanServers();
    if (result) return;

    if (!window._bf4ClickInterval) {
      window._bf4ClickInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
          const activeTab = document.querySelector("nav.submenu li.active a");
          if (activeTab) {
            activeTab.click();
            resetClickCountdown();
            console.log("[BF4 Notifier] Clicked active tab (30s refresh)");
          }
        }
      }, 30 * 1000);
    }

    if (!window._bf4ReloadInterval) {
      window._bf4ReloadInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
          location.reload();
          resetReloadCountdown();
          console.log("[BF4 Notifier] Page fully reloaded (10 min)");
        }
      }, 10 * 60 * 1000);
    }
  }

  function scanServers() {
    const serverList = document.getElementsByClassName("server-row");

    const savedMaps = JSON.parse(GM_getValue("maps") || "[]").map((m) =>
      m.trim().toLowerCase()
    );
    const savedModes = JSON.parse(GM_getValue("modes") || "[]").map((m) =>
      m.trim().toLowerCase()
    );
    const savedPresets = JSON.parse(GM_getValue("presets") || "[]").map((p) =>
      p.trim().toLowerCase()
    );
    const minPlayers = parseInt(GM_getValue("minJogadores") || "30", 10);

    let notified = false;
    let foundAny = false;

    for (const serverRow of serverList) {
      const map =
        serverRow
          .getElementsByClassName("map")[1]
          ?.innerHTML.trim()
          .toLowerCase() || "";
      const mode =
        serverRow
          .getElementsByClassName("mode")[0]
          ?.innerHTML.trim()
          .toLowerCase() || "";
      const preset =
        serverRow
          .getElementsByClassName("preset")[0]
          ?.innerHTML.trim()
          .toLowerCase() || "";
      const players = parseInt(
        serverRow.getElementsByClassName("occupied")[0]?.innerHTML || "0",
        10
      );

      const isMapMatch = savedMaps.includes(map);
      const isModeMatch = savedModes.length === 0 || savedModes.includes(mode);
      const isPresetMatch =
        savedPresets.length === 0 || savedPresets.includes(preset);
      const isPlayerCountOk = players >= minPlayers;

      const matched =
        isMapMatch && isModeMatch && isPresetMatch && isPlayerCountOk;

      if (matched) {
        foundAny = true;
        serverRow.classList.add("highlight-match");

        if (!notified && Notification.permission === "granted") {
          notified = true;
          serverRow.scrollIntoView({ behavior: "smooth", block: "center" });
          new Notification("🔥 BF4 Match Found!", {
            body: `Map: ${map}\nMode: ${mode}\nPlayers: ${players}`,
            icon: "https://battlelog.battlefield.com/favicon.ico",
          });
        }
      }
    }

    return foundAny;
  }

  saveBtn.addEventListener("click", saveFilters);
  clearBtn.addEventListener("click", clearFilters);

  loadFilters();
  pageLoad();
};
