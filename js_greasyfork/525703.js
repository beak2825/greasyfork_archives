// ==UserScript==
// @name         TornTrader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tracks trade status and values via API calls and displays relevant info on the trade dashboard
// @match        https://www.torn.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/525703/TornTrader.user.js
// @updateURL https://update.greasyfork.org/scripts/525703/TornTrader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /***** Configuration & GM Menu Commands *****/
  const DEFAULT_INTERVAL = 30000; // 30 seconds
  let API_KEY = localStorage.getItem("torn_full_key") || "";
  if (!API_KEY) {
    API_KEY = prompt("Enter your Torn full API key:");
    if (API_KEY) localStorage.setItem("torn_full_key", API_KEY);
  }
  let updateInterval = parseInt(localStorage.getItem("tornUpdateInterval") || DEFAULT_INTERVAL, 10);

  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("Set Torn API Key", () => {
      try {
        const newKey = prompt("Enter your Torn full API key:", API_KEY);
        if (newKey) {
          API_KEY = newKey;
          localStorage.setItem("torn_full_key", newKey);
        }
      } catch (err) {
        console.error("Error setting API key:", err);
      }
    });
    GM_registerMenuCommand("Set Update Interval", () => {
      try {
        const newInt = prompt("Enter update interval in ms (default 30000):", updateInterval);
        if (newInt && !isNaN(newInt)) {
          updateInterval = parseInt(newInt, 10);
          localStorage.setItem("tornUpdateInterval", updateInterval.toString());
        }
      } catch (err) {
        console.error("Error setting update interval:", err);
      }
    });
  }

  /***** Constants *****/
  const LOG_TRADE_ITEMS_ADD_OTHER_USER = 4482;
  const LOG_TRADE_ITEMS_REMOVE_OTHER_USER = 4483;
  const LOG_TRADE_CANCEL_INCOMING = 4411; // closing type
  const LOG_TRADE_CANCEL_OUTGOING = 4410; // closing type
  const LOG_TRADE_EXPIRE = 4420; // closing type
  const LOG_TRADE_COMPLETED = 4430; // closing type
  const COMMENT_LOG_TYPES = [4498, 4499];
  const CLOSING_LOG_TYPES = [LOG_TRADE_COMPLETED, LOG_TRADE_EXPIRE, LOG_TRADE_CANCEL_INCOMING, LOG_TRADE_CANCEL_OUTGOING];

  /***** Leader & Timer Settings *****/
  const LEADER_TIMEOUT = 10000; // 10 sec
  const LEADER_KEY = "tornLeader";
  const LAST_API_CALL_KEY = "lastApiCall";
  function getCurrentTimestamp() {
    return Date.now();
  }
  function getLastApiCall() {
    return parseInt(localStorage.getItem(LAST_API_CALL_KEY) || "0", 10);
  }
  function updateLastApiCall(ts) {
    localStorage.setItem(LAST_API_CALL_KEY, ts.toString());
  }

  /***** Leader Election *****/
  const tabId = Math.random().toString(36).substr(2, 9);
  let isLeader = false;
  function updateLeaderStatus() {
    try {
      const now = getCurrentTimestamp();
      let leaderData;
      try {
        leaderData = JSON.parse(localStorage.getItem(LEADER_KEY));
      } catch (e) {
        leaderData = null;
      }
      if (!leaderData || now - leaderData.timestamp > LEADER_TIMEOUT) {
        localStorage.setItem(LEADER_KEY, JSON.stringify({ id: tabId, timestamp: now }));
        isLeader = true;
      } else if (leaderData.id === tabId) {
        leaderData.timestamp = now;
        localStorage.setItem(LEADER_KEY, JSON.stringify(leaderData));
        isLeader = true;
      } else {
        isLeader = false;
      }
    } catch (err) {
      console.error("Leader status error:", err);
    }
  }
  setInterval(updateLeaderStatus, 2000);

  /***** Broadcast Channel *****/
  const bc = new BroadcastChannel("tornTradeChannel");
  bc.onmessage = (ev) => {
    try {
      const data = ev.data;
      if (data.type === "tradeMappingUpdate") {
        localTradeMapping = data.mapping || {};
        if (data.itemValues) {
          cachedItemValues = data.itemValues;
        }
        updateTradeRows().then(checkForActionReminder);
      }
    } catch (err) {
      console.error("Broadcast error:", err);
    }
  };

  /***** Local Trade Mapping Storage *****/
  // Structure: { [tradeId]: { inventory, lastNotification, firstTimestamp, lastTimestamp, effectiveLogType } }
  let localTradeMapping = {};
  try {
    const stored = localStorage.getItem("tornTradeMapping");
    if (stored) localTradeMapping = JSON.parse(stored);
  } catch (err) {
    localTradeMapping = {};
  }
  function saveTradeMapping() {
    try {
      localStorage.setItem("tornTradeMapping", JSON.stringify(localTradeMapping));
    } catch (err) {
      console.error("Error saving mapping:", err);
    }
  }
  let lastProcessedId = localStorage.getItem("lastProcessedId") || null;
  let closedTrades = new Set();

  /***** Cached Market Values *****/
  let cachedItemValues = null;
  let cachedMarketValuesDate = localStorage.getItem("cachedMarketValuesDate") || null;
  function getCurrentUTCDate() {
    return new Date().toISOString().split("T")[0];
  }
  async function getMarketValues() {
    try {
      const currentUTCDate = getCurrentUTCDate();
      const nowUTC = new Date();
      const minutes = nowUTC.getUTCMinutes();
      const hour = nowUTC.getUTCHours();
      const forceFetch = (hour === 0 && minutes < 30);
      if (cachedItemValues && cachedMarketValuesDate === currentUTCDate && !forceFetch) {
        return cachedItemValues;
      }
      const values = await fetchItemValues();
      if (values && Object.keys(values).length > 0) {
        cachedItemValues = values;
        cachedMarketValuesDate = currentUTCDate;
        localStorage.setItem("cachedMarketValuesDate", currentUTCDate);
      }
      return cachedItemValues;
    } catch (err) {
      console.error("Market values error:", err);
      return cachedItemValues || {};
    }
  }
  async function fetchItemValues() {
    try {
      const url = `https://api.torn.com/torn/?selections=items&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.items) {
        throw new Error("No items data received.");
      }
      const mapping = {};
      Object.keys(data.items).forEach((id) => {
        mapping[id] = data.items[id].market_value;
      });
      return mapping;
    } catch (err) {
      console.error("Error fetching market values:", err);
      return {};
    }
  }

  /***** Helper: Calculate Trade Value *****/
  function calculateTradeValue(inventory, itemValues) {
    let total = 0;
    for (const itemId in inventory) {
      const qty = inventory[itemId];
      const mVal = itemValues[itemId] || 0;
      total += mVal * qty;
    }
    return total;
  }

  /***** Processing Logs *****/
  function processLogEntry(logEntry) {
    try {
      const tradeIdMatch = (logEntry.data.trade_id || "").toString().match(/\d+/);
      if (!tradeIdMatch) return;
      const tradeId = tradeIdMatch[0];
      if (closedTrades.has(tradeId)) return;
      if (CLOSING_LOG_TYPES.includes(logEntry.log)) {
        closedTrades.add(tradeId);
        if (localTradeMapping[tradeId]) {
          delete localTradeMapping[tradeId];
          saveTradeMapping();
        }
        return;
      }
      let record = localTradeMapping[tradeId] || { inventory: {}, lastNotification: "", firstTimestamp: 0, lastTimestamp: 0, effectiveLogType: 0 };
      if (!record.firstTimestamp) {
        record.firstTimestamp = logEntry.timestamp;
      }
      if (logEntry.timestamp <= record.lastTimestamp) return;
      record.lastTimestamp = logEntry.timestamp;
      if (logEntry.log === LOG_TRADE_ITEMS_ADD_OTHER_USER) {
        if (Array.isArray(logEntry.data.items)) {
          logEntry.data.items.forEach((item) => {
            record.inventory[item.id] = (record.inventory[item.id] || 0) + item.qty;
          });
        }
      } else if (logEntry.log === LOG_TRADE_ITEMS_REMOVE_OTHER_USER) {
        if (Array.isArray(logEntry.data.items)) {
          logEntry.data.items.forEach((item) => {
            record.inventory[item.id] = (record.inventory[item.id] || 0) - item.qty;
            if (record.inventory[item.id] <= 0) delete record.inventory[item.id];
          });
        }
      }
      record.lastNotification = logEntry.title || `Log ${logEntry.log}`;
      if (!COMMENT_LOG_TYPES.includes(logEntry.log)) {
        record.effectiveLogType = logEntry.log;
      }
      localTradeMapping[tradeId] = record;
      saveTradeMapping();
    } catch (err) {
      console.error("Error processing log entry:", err);
    }
  }
  function processLogs(logs) {
    try {
      logs.sort((a, b) => a.timestamp - b.timestamp);
      logs.forEach(processLogEntry);
    } catch (err) {
      console.error("Error processing logs:", err);
    }
  }

  /***** Cleanup *****/
  function cleanupOldTrades() {
    try {
      const now = Math.floor(Date.now() / 1000);
      for (let tradeId in localTradeMapping) {
        const record = localTradeMapping[tradeId];
        if (now > record.firstTimestamp + 6 * 3600) {
          delete localTradeMapping[tradeId];
        }
      }
      if (location.pathname.includes("trade.php")) {
        const container = document.querySelector(".trades-cont.current.cont-gray.bottom-round");
        if (container) {
          const domTradeIds = new Set();
          container.querySelectorAll("li").forEach((li) => {
            const viewLink = li.querySelector(".view a");
            if (viewLink) {
              const m = viewLink.href.match(/ID=(\d+)/);
              if (m) {
                domTradeIds.add(m[1]);
              }
            }
          });
          for (let tradeId in localTradeMapping) {
            if (!domTradeIds.has(tradeId)) {
              delete localTradeMapping[tradeId];
            }
          }
        }
      }
      saveTradeMapping();
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  }

  /***** Fetch & Process Logs *****/
  async function fetchAndProcessLogs() {
    try {
      const fromTimestamp = Math.floor(Date.now() / 1000) - 300;
      const url = `https://api.torn.com/user/?selections=log&cat=94&key=${API_KEY}&from=${fromTimestamp}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.log) {
        throw new Error("No log data received.");
      }
      let entries = Object.entries(data.log);
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      let newEntries = [];
      if (lastProcessedId) {
        const idx = entries.findIndex((entry) => entry[0] === lastProcessedId);
        newEntries = idx === -1 ? entries : entries.slice(0, idx);
      } else {
        newEntries = entries;
      }
      newEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const newLogs = newEntries.map(([id, logEntry]) => {
        logEntry._id = id;
        return logEntry;
      });
      processLogs(newLogs);
      cleanupOldTrades();
      if (entries.length > 0) {
        const newTopId = entries[0][0];
        if (newTopId !== lastProcessedId) {
          lastProcessedId = newTopId;
          localStorage.setItem("lastProcessedId", lastProcessedId);
        }
      }
    } catch (err) {
      console.error("Error in fetchAndProcessLogs:", err);
    }
  }

  /***** Tooltip / Action Reminder *****/
  function showActionReminder(message) {
    try {
      let tooltip = document.getElementById("newTradeTooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "newTradeTooltip";
        tooltip.style.position = "fixed";
        tooltip.style.top = "10px";
        tooltip.style.right = "10px";
        tooltip.style.backgroundColor = "#ffeb3b";
        tooltip.style.color = "#000";
        tooltip.style.padding = "10px";
        tooltip.style.border = "1px solid #ccc";
        tooltip.style.borderRadius = "4px";
        tooltip.style.cursor = "pointer";
        tooltip.style.zIndex = "9999";
        document.body.appendChild(tooltip);
      }
      if (location.pathname.includes("trade.php")) {
        tooltip.onclick = () => { location.reload(); };
      } else {
        tooltip.onclick = () => { window.location.href = "https://www.torn.com/trade.php"; };
      }
      tooltip.textContent = message;
      tooltip.style.display = "block";
    } catch (err) {
      console.error("Error showing reminder:", err);
    }
  }
  function hideTooltip() {
    try {
      const tooltip = document.getElementById("newTradeTooltip");
      if (tooltip) {
        tooltip.style.display = "none";
      }
    } catch (err) {
      console.error("Error hiding tooltip:", err);
    }
  }
  function checkForActionReminder() {
    try {
      if (location.pathname.includes("trade.php")) {
        const container = document.querySelector(".trades-cont.current.cont-gray.bottom-round");
        if (container) {
          const domTradeIds = new Set();
          container.querySelectorAll("li").forEach((li) => {
            const viewLink = li.querySelector(".view a");
            if (viewLink) {
              const m = viewLink.href.match(/ID=(\d+)/);
              if (m) {
                domTradeIds.add(m[1]);
              }
            }
          });
          let newTradeExists = false;
          for (let tradeId in localTradeMapping) {
            if (!domTradeIds.has(tradeId)) {
              newTradeExists = true;
              break;
            }
          }
          if (newTradeExists) {
            showActionReminder("New trades found! Click here to refresh");
          } else {
            hideTooltip();
          }
        } else {
          hideTooltip();
        }
      } else {
        let count = 0;
        for (let tradeId in localTradeMapping) {
          const rec = localTradeMapping[tradeId];
          if (rec.effectiveLogType === LOG_TRADE_ITEMS_ADD_OTHER_USER || rec.effectiveLogType === LOG_TRADE_ITEMS_REMOVE_OTHER_USER) {
            count++;
          }
        }
        if (count > 0) {
          showActionReminder(`Trades awaiting your action: ${count}`);
        } else {
          hideTooltip();
        }
      }
    } catch (err) {
      console.error("Error checking reminder:", err);
    }
  }

  /***** Leader Timer *****/
  async function leaderTimer() {
    try {
      updateLeaderStatus();
      if (isLeader) {
        const now = Date.now();
        const lastCall = getLastApiCall();
        if (now - lastCall >= updateInterval) {
          updateLastApiCall(now);
          await fetchAndProcessLogs();
          const itemVals = await getMarketValues();
          cachedItemValues = itemVals;
          bc.postMessage({ type: "tradeMappingUpdate", mapping: localTradeMapping, itemValues: cachedItemValues });
          await updateTradeRows();
          checkForActionReminder();
        }
      }
    } catch (err) {
      console.error("Leader timer error:", err);
    }
  }
  setInterval(leaderTimer, 1000);

  /***** Update Trade Rows on trade.php *****/
  async function updateTradeRows() {
    try {
      const container = document.querySelector(".trades-cont.current.cont-gray.bottom-round");
      if (!container) return;
      if (!cachedItemValues || Object.keys(cachedItemValues).length === 0) {
        cachedItemValues = await getMarketValues();
      }
      container.querySelectorAll("li").forEach((li) => {
        try {
          const viewLink = li.querySelector(".view a");
          if (!viewLink) return;
          const match = viewLink.href.match(/ID=(\d+)/);
          if (!match) return;
          const tradeId = match[1];
          let notifSpan = li.querySelector(".torn-notification");
          let valueSpan = li.querySelector(".torn-tradevalue");
          if (!notifSpan || !valueSpan) {
            const desc = li.querySelector(".desc");
            if (!desc) return;
            if (!notifSpan) {
              notifSpan = document.createElement("span");
              notifSpan.className = "torn-notification";
              notifSpan.style.display = "block";
              notifSpan.style.marginTop = "5px";
            }
            if (!valueSpan) {
              valueSpan = document.createElement("span");
              valueSpan.className = "torn-tradevalue";
              valueSpan.style.display = "block";
              valueSpan.style.marginTop = "2px";
            }
            const timeSpan = desc.querySelector(".time");
            if (timeSpan) {
              timeSpan.insertAdjacentElement("afterend", notifSpan);
              notifSpan.insertAdjacentElement("afterend", valueSpan);
            } else {
              desc.appendChild(notifSpan);
              desc.appendChild(valueSpan);
            }
          }
          if (localTradeMapping[tradeId]) {
            const rec = localTradeMapping[tradeId];
            notifSpan.textContent = `Last Notification: ${rec.lastNotification}`;
            const tradeValue = calculateTradeValue(rec.inventory, cachedItemValues);
            if (tradeValue === 0) {
              valueSpan.style.display = "none";
            } else {
              valueSpan.style.display = "block";
              valueSpan.textContent = `Trade Value: $${tradeValue.toLocaleString()}`;
            }
          } else {
            notifSpan.textContent = "No recent notifications";
            valueSpan.textContent = "";
          }
        } catch (innerErr) {
          console.error("Error updating a trade row:", innerErr);
        }
      });
    } catch (err) {
      console.error("Error in updateTradeRows:", err);
    }
  }

  /***** Observe DOM Mutations *****/
  const domObserver = new MutationObserver(() => {
    updateTradeRows().then(checkForActionReminder);
  });
  domObserver.observe(document.body, { childList: true, subtree: true });
})();