// ==UserScript==
// @name         Milkyway Idle - Current Loot Tracker
// @namespace    https://milkywayidle.com/
// @version      2.1
// @description  Tracks loot with overlay, total coin value via ask prices, improved UI/CSS, and fixed display logic.
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531302/Milkyway%20Idle%20-%20Current%20Loot%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/531302/Milkyway%20Idle%20-%20Current%20Loot%20Tracker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const playerLootData = {};
  const previousLootCounts = {};
  const lastBattleLoot = {};
  let myPlayerName = null;
  let activePlayer = null;
  let selfTabSelected = false;
  let isMinimized = localStorage.getItem("lootOverlayMinimized") === "true";
  let isLootListMinimized =
    localStorage.getItem("lootListMinimized") === "true";
  let overlayReady = false;

  let marketData = {};

  fetch(
    "https://raw.githubusercontent.com/holychikenz/MWIApi/main/medianmarket.json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      marketData = data;
      console.log("[LootTracker] Market data loaded successfully.");
      if (activePlayer && document.getElementById("lootOverlay")) {
        updateLootDisplay(activePlayer);
      }
    })
    .catch((err) =>
      console.error("[LootTracker] Failed to load market data:", err)
    );

  function formatGold(value) {
    const numValue = Number(value) || 0;
    return Math.round(numValue).toLocaleString() + " coin";
  }

  function detectPlayerName() {
    const nameDiv =
      document.querySelector(".CharacterStatus_playerName__XXXXX") ||
      document.querySelector(".CharacterName_name__1amXp[data-name]");

    if (nameDiv) {
      myPlayerName = nameDiv.dataset.name || nameDiv.textContent.trim();
      if (
        overlayReady &&
        myPlayerName &&
        playerLootData[myPlayerName] &&
        !selfTabSelected
      ) {
        selfTabSelected = true;
        switchTab(myPlayerName);
      }
    } else {
      setTimeout(detectPlayerName, 1000);
    }
  }

  function createOverlay() {
    if (overlayReady || document.getElementById("lootOverlay")) return;
    overlayReady = true;

    const panel = document.createElement("div");
    panel.id = "lootOverlay";
    panel.style.top = localStorage.getItem("lootOverlayTop") || "100px";
    panel.style.left = localStorage.getItem("lootOverlayLeft") || "20px";

    panel.innerHTML = `
        <div id="lootHeader">
          <span id="lootTitle">📦 Current Loot</span>
          <div id="lootHeaderButtons">
            <button id="lootExportBtn" class="loot-btn" data-tooltip="Export current player's loot as CSV">CSV</button>
            <button id="lootClearBtn" class="loot-btn" data-tooltip="Clear ALL tracked loot">⟳</button>
            <button id="lootMinBtn" class="loot-btn" data-tooltip="Minimize/Restore Overlay">
              ${isMinimized ? "+" : "−"}
            </button>
          </div>
        </div>
        <div id="lootContent">
          <div id="lootTabs"></div>
          <div id="lootToggleHeader">
              Loot <span id="lootToggleIcon">${
                isLootListMinimized ? "▲" : "▼"
              }</span>
          </div>
          <div id="lootTotals"></div>
          <div id="lootBottomDragger">
            <div id="lootRevenueLine">Total Value: Calculating...</div>
            <div class="drag-spacer"></div>
          </div>
        </div>
      `;

    document.body.appendChild(panel);

    const style = document.createElement("style");
    style.textContent = `
        #lootOverlay {
          position: fixed;
          width: 260px;
          background: rgba(30, 30, 30, 0.95);
          color: #fff;
          font-family: monospace;
          font-size: 13px;
          border: 1px solid #555;
          border-radius: 8px;
          z-index: 99999;
          user-select: none;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }
        #lootHeader {
          display: flex; justify-content: space-between; align-items: center;
          padding: 6px 10px; background: rgba(20, 20, 20, 0.85);
          border-bottom: 1px solid #333; border-radius: 8px 8px 0 0; cursor: move;
        }
        #lootTitle { font-weight: bold; }
        #lootHeaderButtons { display: flex; gap: 4px; }
        .loot-btn {
          background: none; border: none; color: #aaa; cursor: pointer;
          font-size: 14px; padding: 0 3px; position: relative;
        }
        .loot-btn:hover { color: #fff; }
        .loot-btn:hover::after {
          content: attr(data-tooltip); position: absolute; left: 50%; top: 110%;
          transform: translateX(-50%); background: #222; color: #fff; padding: 4px 8px;
          font-size: 11px; border-radius: 4px; white-space: nowrap; opacity: 0.95;
          pointer-events: none; z-index: 100000;
        }
        #lootContent {
          overflow: hidden; transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
          will-change: max-height, opacity;
        }
        #lootTabs {
          display: flex; flex-wrap: wrap; padding: 5px 10px; gap: 6px;
          border-bottom: 1px solid #333; background: rgba(24, 24, 24, 0.8); min-height: 26px;
        }
        #lootTabs button {
          background: none; border: 1px solid #444; color: #aaa; padding: 2px 6px;
          font-family: monospace; cursor: pointer; border-radius: 4px; font-size: 12px;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }
        #lootTabs button:hover { background-color: #555; color: #fff; }
        #lootTabs button.active {
          background: #4caf50; color: #fff; border-color: #4caf50; font-weight: bold;
        }
        #lootToggleHeader {
          padding: 6px 10px; cursor: pointer; font-weight: bold; border-bottom: 1px solid #333;
          background: rgba(28, 28, 28, 0.8);
        }
        #lootToggleHeader:hover { background: rgba(40, 40, 40, 0.9); }
        #lootToggleIcon { display: inline-block; transition: transform 0.2s ease-out; margin-left: 5px; }
        #lootTotals {
          padding: 10px; overflow-y: auto; max-height: 400px;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out, padding 0.3s ease-out;
          will-change: max-height, opacity, padding;
        }
         #lootTotals > div { margin-bottom: 3px; line-height: 1.3; }
        #lootBottomDragger {
          padding: 6px 10px; cursor: move; border-top: 1px solid #444;
          background: rgba(20, 20, 20, 0.85); border-radius: 0 0 8px 8px;
        }
        #lootRevenueLine {
          font-weight: bold; color: gold; cursor: inherit; padding-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .drag-spacer { height: 8px; cursor: inherit; }
        @keyframes lootFlashText { 0% { color: #b6ffb8; transform: scale(1.02); } 100% { color: white; transform: scale(1); } }
        .flashLoot { animation: lootFlashText 1s ease-out; }
        .fadeGain {
          color: lime; font-weight: bold; font-size: 10px; vertical-align: super;
          opacity: 1; transition: opacity 2s ease-out; margin-left: 3px; display: inline-block;
        }
      `;
    document.head.appendChild(style);

    const content = document.getElementById("lootContent");
    const lootTotals = document.getElementById("lootTotals");
    content.style.maxHeight = isMinimized ? "0" : "1000px";
    content.style.opacity = isMinimized ? "0" : "1";
    lootTotals.style.maxHeight = isLootListMinimized ? "0" : "400px";
    lootTotals.style.opacity = isLootListMinimized ? "0" : "1";
    lootTotals.style.padding = isLootListMinimized ? "0 10px" : "10px";

    document.getElementById("lootMinBtn").onclick = () => {
      isMinimized = !isMinimized;
      content.style.maxHeight = isMinimized ? "0" : "1000px";
      content.style.opacity = isMinimized ? "0" : "1";
      document.getElementById("lootMinBtn").textContent = isMinimized
        ? "+"
        : "−";
      localStorage.setItem("lootOverlayMinimized", isMinimized);
    };
    document.getElementById("lootToggleHeader").onclick = () => {
      isLootListMinimized = !isLootListMinimized;
      lootTotals.style.maxHeight = isLootListMinimized ? "0" : "400px";
      lootTotals.style.opacity = isLootListMinimized ? "0" : "1";
      lootTotals.style.padding = isLootListMinimized ? "0 10px" : "10px";
      document.getElementById("lootToggleIcon").textContent =
        isLootListMinimized ? "▲" : "▼";
      localStorage.setItem("lootListMinimized", isLootListMinimized);
    };
    const exportBtn = document.getElementById("lootExportBtn");
    exportBtn.onclick = () => {
      if (
        !activePlayer ||
        !playerLootData[activePlayer] ||
        Object.keys(playerLootData[activePlayer]).length === 0
      ) {
        alert("No loot data available for the active player to export.");
        return;
      }
      try {
        const dataToExport = playerLootData[activePlayer];
        const csvContent = Object.entries(dataToExport)
          .map(([hrid, count]) => {
            let itemName = hrid.replace("/items/", "").replace(/_/g, " ");
            itemName = `"${itemName.replace(/"/g, '""')}"`;
            return `${itemName},${count}`;
          })
          .join("\n");
        const csvOutput = "Item Name,Count\n" + csvContent;
        navigator.clipboard
          .writeText(csvOutput)
          .then(() => {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = "Copied!";
            exportBtn.style.color = "#4caf50";
            setTimeout(() => {
              exportBtn.textContent = originalText;
              exportBtn.style.color = "";
            }, 1500);
          })
          .catch((err) => {
            console.error(
              "[LootTracker] Failed to copy CSV to clipboard:",
              err
            );
            alert("Failed to copy CSV. See console.");
          });
      } catch (error) {
        console.error("[LootTracker] Error generating CSV:", error);
        alert("Error generating CSV data.");
      }
    };
    document.getElementById("lootClearBtn").onclick = () => {
      if (
        confirm(
          "Are you sure you want to clear ALL tracked loot data? This cannot be undone."
        )
      ) {
        clearAllLootData();
      }
    };

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    function beginDrag(e) {
      if (e.target.closest("button")) return;
      dragging = true;
      panel.style.transition = "none";
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "move";
    }
    document
      .getElementById("lootHeader")
      .addEventListener("mousedown", beginDrag);
    document
      .getElementById("lootBottomDragger")
      .addEventListener("mousedown", beginDrag);
    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const newX = Math.max(
        0,
        Math.min(window.innerWidth - panel.offsetWidth, e.clientX - offsetX)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - panel.offsetHeight, e.clientY - offsetY)
      );
      panel.style.left = `${newX}px`;
      panel.style.top = `${newY}px`;
    });
    document.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = "";
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      localStorage.setItem("lootOverlayTop", panel.style.top);
      localStorage.setItem("lootOverlayLeft", panel.style.left);
    });

    console.log("[LootTracker] Overlay created.");
  }

  function updateLootDisplay(playerName) {
    const container = document.getElementById("lootTotals");
    const revenueLine = document.getElementById("lootRevenueLine");

    if (!container) {
      console.error(
        "[LootTracker] updateLootDisplay: Could not find #lootTotals element!"
      );
      if (revenueLine) revenueLine.textContent = "Total Value: Error (UI)";
      return;
    }
    if (!revenueLine) {
      console.warn(
        "[LootTracker] updateLootDisplay: Could not find #lootRevenueLine element."
      );
    }

    if (!playerLootData[playerName]) {
      container.innerHTML = "<i>Waiting for player data...</i>";
      if (revenueLine) revenueLine.textContent = "Total Value: N/A";
      return;
    }
    if (!previousLootCounts[playerName]) previousLootCounts[playerName] = {};

    const currentLoot = playerLootData[playerName];
    const sorted = Object.entries(currentLoot).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    );

    let html = "";
    let totalRevenue = 0;
    let marketDataAvailable =
      marketData &&
      marketData.market &&
      Object.keys(marketData.market).length > 0;

    if (sorted.length === 0) {
      html = "<i>No loot tracked yet.</i>";
      totalRevenue = 0;
    } else {
      sorted.forEach(([itemHrid, count]) => {
        const prevDisplayCount = previousLootCounts[playerName][itemHrid] || 0;
        const lastBattleStartCount =
          lastBattleLoot[playerName] && lastBattleLoot[playerName][itemHrid]
            ? lastBattleLoot[playerName][itemHrid]
            : prevDisplayCount;
        const gain = count - lastBattleStartCount;
        const flash = count > prevDisplayCount;
        const name = itemHrid.replace("/items/", "").replace(/_/g, " ");
        const gainHTML =
          gain > 0 ? `<span class="fadeGain">+${gain}</span>` : "";

        let itemValue = 0;
        let priceFound = false;
        if (itemHrid.endsWith("/coin")) {
          itemValue = count;
          priceFound = true;
        } else if (marketDataAvailable) {
          const marketKey = name
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          if (marketData.market[marketKey]?.ask) {
            itemValue = count * marketData.market[marketKey].ask;
            priceFound = true;
          }
        }
        totalRevenue += itemValue;

        html += `<div class="${flash ? "flashLoot" : ""}">
                • ${name} × ${count}${gainHTML} ${
          !priceFound && !itemHrid.endsWith("/coin")
            ? '<span style="color:gray;" title="Price data unavailable">?</span>'
            : ""
        }
              </div>`;
        previousLootCounts[playerName][itemHrid] = count;
      });
    }

    const hasNonCoinItems = sorted.some(([hrid]) => !hrid.endsWith("/coin"));
    let finalRevenueText = "";
    if (!marketDataAvailable && hasNonCoinItems && sorted.length > 0) {
      finalRevenueText = `Total Value: Calculating...`;
    } else if (sorted.length === 0) {
      finalRevenueText = `Total Value: ${formatGold(0)}`;
    } else {
      finalRevenueText = `Total Value: ${formatGold(totalRevenue)}`;
    }

    try {
      container.innerHTML = html;

      if (revenueLine) {
        revenueLine.textContent = finalRevenueText;
      }
    } catch (uiError) {
      console.error(
        `[LootTracker] CRITICAL: Error occurred during DOM update!`,
        uiError
      );
    }

    document.querySelectorAll(".fadeGain").forEach((el) => {
      setTimeout(() => {
        void el.offsetWidth;
        el.style.opacity = "0";
      }, 100);
    });
    if (
      lastBattleLoot[playerName] &&
      Object.keys(lastBattleLoot[playerName]).length > 0
    ) {
      lastBattleLoot[playerName] = {};
    }
  }

  function switchTab(playerName) {
    activePlayer = playerName;

    document.querySelectorAll("#lootTabs button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.name === playerName);
    });
    updateLootDisplay(playerName);
  }

  function addTab(player) {
    const playerName = player.name;
    const lootMap = player.totalLootMap || {};
    const container = document.getElementById("lootTabs");
    if (!container) {
      console.error("[LootTracker] Loot tabs container not found!");
      return;
    }
    if (!playerLootData[playerName]) playerLootData[playerName] = {};
    if (!previousLootCounts[playerName]) previousLootCounts[playerName] = {};
    if (!lastBattleLoot[playerName]) lastBattleLoot[playerName] = {};

    let tabNeedsUpdate = false;
    for (const key in lootMap) {
      const { itemHrid, count } = lootMap[key];
      if (playerLootData[playerName][itemHrid] !== count) {
        lastBattleLoot[playerName][itemHrid] =
          playerLootData[playerName][itemHrid] || 0;
        playerLootData[playerName][itemHrid] = count;
        tabNeedsUpdate = true;
      }
    }

    let tabButton = container.querySelector(
      `button[data-name="${playerName}"]`
    );
    if (!tabButton) {
      tabButton = document.createElement("button");
      tabButton.textContent = playerName;
      tabButton.dataset.name = playerName;
      tabButton.onclick = () => switchTab(playerName);
      container.appendChild(tabButton);

      if (!activePlayer) activePlayer = playerName;
    }

    if (playerName === myPlayerName && !selfTabSelected) {
      selfTabSelected = true;
      switchTab(playerName);
      tabNeedsUpdate = false;
    } else if (playerName === activePlayer && tabNeedsUpdate) {
      updateLootDisplay(playerName);
    }
    if (playerName === activePlayer) {
      document.querySelectorAll("#lootTabs button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.name === activePlayer);
      });
    }
  }

  function clearAllLootData() {
    console.log("[LootTracker] Clearing all loot data.");

    for (const p in playerLootData) {
      playerLootData[p] = {};
      previousLootCounts[p] = {};
      lastBattleLoot[p] = {};
    }

    const tabsContainer = document.getElementById("lootTabs");
    const totalsContainer = document.getElementById("lootTotals");
    const revenueLine = document.getElementById("lootRevenueLine");

    if (tabsContainer) tabsContainer.innerHTML = "";
    if (totalsContainer)
      totalsContainer.innerHTML = "<i>Loot data cleared.</i>";
    if (revenueLine) revenueLine.textContent = "Total Value: N/A";

    activePlayer = null;
    selfTabSelected = false;
  }

  (function injectWebSocketInterceptor() {
    const scriptId = "milkyway-websocket-interceptor";

    if (document.getElementById(scriptId)) return;

    const s = document.createElement("script");
    s.id = scriptId;
    s.textContent = `
          (function() {

            if (window.originalWebSocket) { return; }
            window.originalWebSocket = window.WebSocket;


            window.WebSocket = new Proxy(window.originalWebSocket, {
              construct(target, args) {

                const wsInstance = new target(...args);
                try {
                    const url = args[0];

                    if (typeof url === 'string' && (url.includes("api.milkywayidle.com/ws") || url.includes("api-test.milkywayidle.com/ws"))) {


                        wsInstance.addEventListener("message", (event) => {
                          try {
                            const data = JSON.parse(event.data);

                            if (data.type === "new_battle" && data.players) {

                              window.dispatchEvent(new CustomEvent("LootTrackerBattle", { detail: data }));
                            }

                            else if ( data.type === "new_character_action" && data.newCharacterActionData?.shouldClearQueue && data.newCharacterActionData.actionHrid?.startsWith("/actions/combat/") ) {

                              window.dispatchEvent(new CustomEvent("LootTrackerCombatReset"));
                            }
                          } catch (parseOrDispatchError) {
                              console.error('[LootTracker WS Interceptor] Error processing message:', parseOrDispatchError, 'Raw Data:', event.data);
                          }
                        });


                        wsInstance.addEventListener("open", () => {

                        });


                        wsInstance.addEventListener("close", (event) => {

                            console.log(\`[LootTracker WS Interceptor] Target WebSocket connection closed. Code: \${event.code}, Reason: \${event.reason}. Dispatching LootTrackerWSClosed event.\`);

                            window.dispatchEvent(new CustomEvent("LootTrackerWSClosed", {
                                detail: { code: event.code, reason: event.reason }
                            }));
                        });


                        wsInstance.addEventListener("error", (event) => {
                            console.error('[LootTracker WS Interceptor] Target WebSocket error:', event);
                        });

                    }
                } catch (proxyConstructError) {
                    console.error('[LootTracker WS Interceptor] Error setting up WebSocket proxy:', proxyConstructError);
                }

                return wsInstance;
              }
            });

            console.log('[LootTracker WS Interceptor] WebSocket Proxy installed.');
          })();
        `;

    (document.head || document.documentElement).appendChild(s);
  })();

  window.addEventListener("LootTrackerBattle", (e) => {
    if (!overlayReady) {
      console.warn(
        "[LootTracker] Overlay not ready when battle event received, skipping update."
      );
      return;
    }
    const data = e.detail;

    if (data && data.players && Array.isArray(data.players)) {
      data.players.forEach((player) => {
        if (player && player.name) {
          addTab(player);
        } else {
          console.warn(
            "[LootTracker] Player data missing name in battle event:",
            player
          );
        }
      });
    } else {
      console.warn(
        "[LootTracker] Invalid data received in LootTrackerBattle event:",
        data
      );
    }
  });

  window.addEventListener("LootTrackerWSClosed", (e) => {
    console.log(
      `[LootTracker] Detected WebSocket closure (Code: ${e.detail?.code}, Reason: ${e.detail?.reason}). Clearing all loot data and resetting player name.`
    );

    myPlayerName = null;

    activePlayer = null;
    selfTabSelected = false;

    if (overlayReady) {
      clearAllLootData();
    } else {
      console.warn(
        "[LootTracker] WebSocket closed, but overlay not ready. Data should be clear on next init."
      );
    }
  });

  window.addEventListener("LootTrackerCombatReset", (e) => {
    if (!overlayReady) {
      console.warn(
        "[LootTracker] Overlay not ready when reset event received, skipping clear."
      );
      return;
    }
    console.log("[LootTracker] Calling clearAllLootData due to combat reset.");
    clearAllLootData();
  });

  function initialize() {
    console.log("[LootTracker] Initializing...");
    createOverlay();
    detectPlayerName();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
