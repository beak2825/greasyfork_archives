// ==UserScript==
// @name         PokerHistorygpt108
// @namespace    http://www.torn.com/
// @version      2.7
// @description  Records all Poker history with enhanced regex search and improved VPIP, PFR, and AF tracking with JSON export/import. Now shows 9 most recently active players.
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543951/PokerHistorygpt108.user.js
// @updateURL https://update.greasyfork.org/scripts/543951/PokerHistorygpt108.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let db = null;
  let messageBoxObserver = null;

    // Drag functionality variables
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

  // Stats storage
  const vpipStats = new Map();
  const pfrStats = new Map();

  // Current hand tracking sets
  let handInProgress = false;
  const currentHandPlayersSeen = new Set();
  const currentHandPlayersVoluntary = new Set();
  const currentHandPlayersRaisedPreflop = new Set();

  initIndexDB();

  window.onload = function () {
    initCSS();
    initControlPanel();
    initPokerObserver();
    createVPIPPanel();
    loadVPIPStats();
  };

  function initIndexDB() {
    const openRequest = indexedDB.open("scriptPokerHistoryDB", 2);
    openRequest.onupgradeneeded = function (e) {
      db = e.target.result;
      if (!db.objectStoreNames.contains("messageStore")) {
        db.createObjectStore("messageStore", { keyPath: "autoId", autoIncrement: true });
      }
      // Add new object store for VPIP stats
      if (!db.objectStoreNames.contains("vpipStore")) {
        db.createObjectStore("vpipStore", { keyPath: "id" });
      }
    };
    openRequest.onsuccess = function (e) {
      db = e.target.result;
    };
    openRequest.onerror = function (e) {
      console.error("PokerHistory: initIndexDB open onerror", e);
    };
  }

  function dbWrite(message) {
    if (!db || !message) return;
    const transaction = db.transaction(["messageStore"], "readwrite");
    const store = transaction.objectStore("messageStore");
    store.put(message);
  }

  function dbReadAll() {
    if (!db) return Promise.resolve([]);
    const transaction = db.transaction(["messageStore"], "readonly");
    const store = transaction.objectStore("messageStore");
    return new Promise((resolve) => {
      const resultList = [];
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resultList.push(cursor.value);
          cursor.continue();
        } else {
          resolve(resultList);
        }
      };
      store.openCursor().onerror = () => resolve(resultList);
    });
  }

  function dbClearAll() {
    if (!db) return;
    const transaction = db.transaction(["messageStore"], "readwrite");
    const store = transaction.objectStore("messageStore");
    store.clear();
    vpipStats.clear();
    pfrStats.clear();
    updateVPIPPanel();
  }

  // New functions for VPIP stats persistence
  function saveVPIPStats() {
    if (!db) return;
    const vpipData = {
      vpipStats: Object.fromEntries(vpipStats),
      pfrStats: Object.fromEntries(pfrStats),
      timestamp: Date.now()
    };

    const transaction = db.transaction(["vpipStore"], "readwrite");
    const store = transaction.objectStore("vpipStore");
    store.put({ id: "current", data: vpipData });
  }

  function loadVPIPStats() {
    if (!db) return;
    const transaction = db.transaction(["vpipStore"], "readonly");
    const store = transaction.objectStore("vpipStore");
    const request = store.get("current");

    request.onsuccess = function(event) {
      const result = event.target.result;
      if (result && result.data) {
        // Load vpipStats
        vpipStats.clear();
        Object.entries(result.data.vpipStats || {}).forEach(([player, stats]) => {
          // Add default lastUpdated timestamp for existing data
          if (!stats.lastUpdated) {
            stats.lastUpdated = 0;
          }
          vpipStats.set(player, stats);
        });

        // Load pfrStats
        pfrStats.clear();
        Object.entries(result.data.pfrStats || {}).forEach(([player, stats]) => {
          // Add default lastUpdated timestamp for existing data
          if (!stats.lastUpdated) {
            stats.lastUpdated = 0;
          }
          pfrStats.set(player, stats);
        });

        updateVPIPPanel();
      }
    };
  }

  function exportVPIPStatsToJSON() {
    const exportData = {
      vpipStats: Object.fromEntries(vpipStats),
      pfrStats: Object.fromEntries(pfrStats),
      exportDate: new Date().toISOString(),
      version: "2.7"
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vpip_stats_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importVPIPStatsFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importData = JSON.parse(e.target.result);

        if (!importData.vpipStats || !importData.pfrStats) {
          alert("Invalid VPIP stats file format");
          return;
        }

        const shouldMerge = confirm("Do you want to merge with existing stats? Click Cancel to replace existing stats completely.");

        if (!shouldMerge) {
          vpipStats.clear();
          pfrStats.clear();
        }

        // Import vpipStats
        Object.entries(importData.vpipStats).forEach(([player, stats]) => {
          // Add default lastUpdated timestamp for imported data without it
          if (!stats.lastUpdated) {
            stats.lastUpdated = 0;
          }

          if (shouldMerge && vpipStats.has(player)) {
            const existing = vpipStats.get(player);
            vpipStats.set(player, {
              seen: existing.seen + stats.seen,
              voluntary: existing.voluntary + stats.voluntary,
              lastUpdated: Math.max(existing.lastUpdated || 0, stats.lastUpdated || 0)
            });
          } else {
            vpipStats.set(player, stats);
          }
        });

        // Import pfrStats
        Object.entries(importData.pfrStats).forEach(([player, stats]) => {
          // Add default lastUpdated timestamp for imported data without it
          if (!stats.lastUpdated) {
            stats.lastUpdated = 0;
          }

          if (shouldMerge && pfrStats.has(player)) {
            const existing = pfrStats.get(player);
            pfrStats.set(player, {
              seen: existing.seen + stats.seen,
              raised: existing.raised + stats.raised,
              bets: existing.bets + stats.bets,
              calls: existing.calls + stats.calls,
              lastUpdated: Math.max(existing.lastUpdated || 0, stats.lastUpdated || 0)
            });
          } else {
            pfrStats.set(player, stats);
          }
        });

        saveVPIPStats();
        updateVPIPPanel();

        const action = shouldMerge ? "merged" : "imported";
        alert(`VPIP stats successfully ${action}! Imported data from: ${importData.exportDate || 'Unknown date'}`);

      } catch (error) {
        alert("Error parsing JSON file: " + error.message);
      }
    };

    reader.onerror = function() {
      alert("Error reading file");
    };

    reader.readAsText(file);
  }

  function clearVPIPStats() {
    if (confirm("Are you sure you want to clear all VPIP stats? This cannot be undone.")) {
      vpipStats.clear();
      pfrStats.clear();
      saveVPIPStats();
      updateVPIPPanel();
      alert("VPIP stats cleared.");
    }
  }

  function initPokerObserver() {
    const $poker = $("div.holdemWrapper___D71Gy");
    const observerConfig = { attributes: false, childList: true, subtree: false };
    const observer = new MutationObserver(reObserveMessageBox);
    if ($poker.length === 1) {
      observer.observe($poker[0], observerConfig);
      reObserveMessageBox();
    }
  }

    function makeVPIPPanelDraggable() {
  const panel = document.getElementById('vpipPanel');
  if (!panel) return;

  // Create a draggable header if it doesn't exist
  let dragHandle = panel.querySelector('.drag-handle');
  if (!dragHandle) {
    // Create the drag handle
    dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cssText = `
      cursor: move;
      padding: 5px;
      background: #f0f0f0;
      border-bottom: 1px solid #ccc;
      user-select: none;
      font-weight: bold;
    `;
    dragHandle.textContent = 'Stats Panel (drag to move)';

    // Find the existing "Stats Panel" text and replace it
    const existingTitle = panel.querySelector('strong');
    if (existingTitle && existingTitle.textContent === 'Stats Panel') {
      existingTitle.replaceWith(dragHandle);
    } else {
      panel.insertBefore(dragHandle, panel.firstChild);
    }
  }

  // Add drag event listeners
  dragHandle.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

function startDrag(e) {
  isDragging = true;
  const panel = document.getElementById('vpipPanel');
  const rect = panel.getBoundingClientRect();

  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;

  panel.style.zIndex = '10000'; // Bring to front while dragging
  e.preventDefault();
}

function drag(e) {
  if (!isDragging) return;

  const panel = document.getElementById('vpipPanel');
  const newX = e.clientX - dragOffset.x;
  const newY = e.clientY - dragOffset.y;

  panel.style.left = newX + 'px';
  panel.style.top = newY + 'px';
  panel.style.right = 'auto'; // Remove right positioning when dragging
}

function stopDrag() {
  if (isDragging) {
    isDragging = false;
    const panel = document.getElementById('vpipPanel');
    panel.style.zIndex = '9999'; // Return to normal z-index
  }
}

  function reObserveMessageBox() {
    if (!messageBoxObserver) {
      messageBoxObserver = new MutationObserver(handleMessageBoxChange);
    }
    messageBoxObserver.disconnect();
    const $messageWrap = $("div.holdemWrapper___D71Gy div.messagesWrap___tBx9u");
    const observerConfig = { attributes: true, childList: true, subtree: false };
    messageBoxObserver.observe($messageWrap[0], observerConfig);
  }

  function handleMessageBoxChange(mutated) {
    if (mutated.length >= 40) return;
    for (const mutation of mutated) {
      for (const node of mutation.addedNodes) {
        if (node.classList.contains("message___RlFXd")) {
          const messageText = node.innerText.trim();
          const message = {
            timestamp: Date.now() / 1000,
            text: messageText,
          };
          dbWrite(message);
          updateVPIPStats(messageText);
        }
      }
    }
  }

  // Updated VPIP, PFR, and AF tracking function
  function updateVPIPStats(text) {
    const preflopStartRegex = /The preflop\s+Two cards dealt to each player/;
    const handEndRegex = /won \$/;
    const voluntaryActionRegex = /^(.*?)\s+(called|raised|bet)/i;
    const foldCheckRegex = /^(.*?)\s+(folded|checked)/i;
    const dealtCardsRegex = /^Dealt to (.*?) \[(.*?)\]/i;

    if (preflopStartRegex.test(text)) {
      handInProgress = true;
      currentHandPlayersSeen.clear();
      currentHandPlayersVoluntary.clear();
      currentHandPlayersRaisedPreflop.clear();
      return;
    }

    if (!handInProgress) return;

    if (handEndRegex.test(text)) {
      // Update stats on hand end
      const currentTime = Date.now();
      for (const player of currentHandPlayersSeen) {
        if (!vpipStats.has(player)) vpipStats.set(player, { seen: 0, voluntary: 0, lastUpdated: 0 });
        if (!pfrStats.has(player)) pfrStats.set(player, { seen: 0, raised: 0, bets: 0, calls: 0, lastUpdated: 0 });

        vpipStats.get(player).seen++;
        vpipStats.get(player).lastUpdated = currentTime;
        pfrStats.get(player).seen++;
        pfrStats.get(player).lastUpdated = currentTime;
      }
      for (const player of currentHandPlayersVoluntary) {
        vpipStats.get(player).voluntary++;
        vpipStats.get(player).lastUpdated = currentTime;
      }
      for (const player of currentHandPlayersRaisedPreflop) {
        pfrStats.get(player).raised++;
        pfrStats.get(player).lastUpdated = currentTime;
      }
      currentHandPlayersSeen.clear();
      currentHandPlayersVoluntary.clear();
      currentHandPlayersRaisedPreflop.clear();
      handInProgress = false;
      saveVPIPStats(); // Auto-save after each hand
      updateVPIPPanel();
      return;
    }

    let match = text.match(voluntaryActionRegex);
    if (match) {
      const player = match[1].trim();
      const action = match[2].toLowerCase();
      const currentTime = Date.now();
      currentHandPlayersSeen.add(player);
      if (action === "called" || action === "raised" || action === "bet") {
        currentHandPlayersVoluntary.add(player);
      }
      if (action === "raised") {
        currentHandPlayersRaisedPreflop.add(player);
      }
      if (!pfrStats.has(player)) pfrStats.set(player, { seen: 0, raised: 0, bets: 0, calls: 0, lastUpdated: 0 });
      const stats = pfrStats.get(player);
      if (action === "called") stats.calls++;
      else if (action === "bet") stats.bets++;
      else if (action === "raised") stats.raised++;
      stats.lastUpdated = currentTime;
      return;
    }

    match = text.match(foldCheckRegex);
    if (match) {
      const player = match[1].trim();
      currentHandPlayersSeen.add(player);
      return;
    }

    match = text.match(dealtCardsRegex);
    if (match) {
      const player = match[1].trim();
      currentHandPlayersSeen.add(player);
      return;
    }
  }

 // Replace your existing createVPIPPanel function with this updated version:

function createVPIPPanel() {
  const $panel = $(`
    <div id="vpipPanel" style="position:fixed;top:10px;right:10px;background:#fff;color:#000;padding:10px;border:1px solid #aaa;border-radius:8px;z-index:9999;font-size:14px;max-width:350px;">
      <strong>Stats Panel</strong>
      <div style="margin: 5px 0;">
        <button id="exportVPIPBtn" style="font-size:11px;padding:2px 5px;margin:1px;">Export Stats</button>
        <button id="importVPIPBtn" style="font-size:11px;padding:2px 5px;margin:1px;">Import Stats</button>
        <button id="clearVPIPBtn" style="font-size:11px;padding:2px 5px;margin:1px;">Clear Stats</button>
        <input type="file" id="vpipFileInput" accept=".json" style="display:none;">
      </div>
      <div id="vpipContent">No VPIP data yet</div>
      <div id="vpipCounter" style="font-size:12px;color:#666;margin-top:5px;"></div>
    </div>
  `);
  $(document.body).append($panel);

  // Add event listeners
  $("#exportVPIPBtn").click(exportVPIPStatsToJSON);
  $("#importVPIPBtn").click(() => $("#vpipFileInput").click());
  $("#vpipFileInput").change(function(e) {
    if (e.target.files[0]) {
      importVPIPStatsFromJSON(e.target.files[0]);
      e.target.value = ''; // Reset file input
    }
  });
  $("#clearVPIPBtn").click(clearVPIPStats);

  // Add drag functionality - THIS IS THE NEW LINE
  makeVPIPPanelDraggable();
}
  function updateVPIPPanel() {
    const $content = $("#vpipContent");
    const $counter = $("#vpipCounter");

    if (vpipStats.size === 0) {
      $content.html("No VPIP data yet");
      $counter.html("");
      return;
    }

    // Sort players by most recent activity (lastUpdated timestamp)
    const sortedPlayers = Array.from(vpipStats.entries()).sort((a, b) => {
      const aTime = a[1].lastUpdated || 0;
      const bTime = b[1].lastUpdated || 0;
      return bTime - aTime; // Most recent first
    });

    // Show only the top 9 most recently active players
    const displayPlayers = sortedPlayers.slice(0, 9);

    let html = "";
    displayPlayers.forEach(([player, vpip]) => {
      const seen = vpip.seen;
      const voluntary = vpip.voluntary;
      const vpipPct = seen ? ((voluntary / seen) * 100).toFixed(1) : "0.0";

      const pfr = pfrStats.get(player);
      const raised = pfr ? pfr.raised : 0;
      const pfrSeen = pfr ? pfr.seen : 0;
      const pfrPct = pfrSeen ? ((raised / pfrSeen) * 100).toFixed(1) : "0.0";

      const bets = pfr ? pfr.bets : 0;
      const calls = pfr ? pfr.calls : 0;
      let af = "-";
      if (calls > 0) af = ((bets + raised) / calls).toFixed(2);
      else if ((bets + raised) > 0) af = "∞";

      html += `<div><strong>${player}</strong>: VPIP ${vpipPct}% (${voluntary}/${seen}), PFR ${pfrPct}% (${raised}/${pfrSeen}), AF ${af} (B:${bets}+R:${raised}/C:${calls})</div>`;
    });

    $content.html(html);

    // Show counter of displayed vs total players
    const totalPlayers = vpipStats.size;
    const displayedPlayers = displayPlayers.length;
    $counter.html(`Showing ${displayedPlayers} of ${totalPlayers} players (most recent activity)`);
  }

  function initCSS() {
    const isDarkmode = $("body").hasClass("dark-mode");
    GM_addStyle(`
      .poker-control-panel-popup {
        position: fixed;
        top: 10%;
        left: 15%;
        border-radius: 10px;
        padding: 10px;
        background: ${isDarkmode ? "#282828" : "#F0F0F0"};
        z-index: 1000;
        display: none;
      }
      .poker-control-panel-results { padding: 10px; }
      .poker-control-player {
        margin: 4px !important;
        display: inline-block !important;
      }
      .poker-control-panel-overlay {
        position: fixed;
        top: 0;
        left: 0;
        background: ${isDarkmode ? "#404040" : "#B0B0B0"};
        width: 100%;
        height: 100%;
        opacity: 0.7;
        z-index: 900;
        display: none;
      }
      .poker-control-panel-item {
        display: inline-block;
        margin: 2px;
      }
      .poker-search-input {
        width: 300px;
        padding: 5px;
        margin: 5px;
      }
      .poker-search-row {
        margin: 5px 0;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .poker-search-label {
        font-weight: bold;
        margin-right: 10px;
        display: inline-block;
        width: 100px;
      }
      .poker-match-count {
        font-size: 12px;
        color: ${isDarkmode ? "#aaa" : "#666"};
        margin-left: 10px;
      }
      #vpipPanel {
        font-family: Arial, sans-serif;
      }
      #vpipPanel button {
        background: #007cba;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      #vpipPanel button:hover {
        background: #005a87;
      }
    `);
  }

  function initControlPanel() {
    const $title = $("div#top-page-links-list");
    if ($title.length === 0) return;

    const $controlBtn = $(`
      <a id="pokerHistoryControl" class="t-clear h c-pointer right last">
        <span class="icon-wrap svg-icon-wrap">
          <span class="link-icon-svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10.33">
              <path fill="#777" d="M10 4.67a2 2 0 01-4 0 1.61 1.61 0 010-.39A1.24 1.24 0 007.64 2.7a2.19 2.19 0 01.36 0A2 2 0 0110 4.67zM8 0C3 0 0 4.37 0 4.37s3.22 5 8 5c5.16 0 8-5 8-5S13.14 0 8 0zm0 8a3.34 3.34 0 113.33-3.33A3.33 3.33 0 018 8z"/>
            </svg>
          </span>
        </span>
        <span>PokerHistory v2.7</span>
      </a>
    `);

    const $controlPanelDiv = $("<div id=\"pokerControlPanel\" class=\"poker-control-panel-popup\"></div>");
    const $controlPanelOverlayDiv = $("<div id=\"pokerControlOverlayPanel\" class=\"poker-control-panel-overlay\"></div>");

   $controlPanelDiv.html(`
  <div class="poker-search-row">
    <span class="poker-search-label">Text Search:</span>
    <input type="text" id="pokerSearchText" class="poker-search-input" placeholder="Simple text search (e.g. 'XenaciousXanax raised')">
    <span id="textMatchCount" class="poker-match-count"></span>
  </div>
  <div class="poker-search-row">
    <span class="poker-search-label">Regex Search:</span>
    <input type="text" id="pokerSearchRegex" class="poker-search-input" placeholder="Regex pattern (e.g. '^.*XenaciousXanax.*(called|raised).*\\$')">
    <span id="regexMatchCount" class="poker-match-count"></span>
  </div>
  <div class="poker-search-row">
    <label style="font-size:12px;">
      <input type="checkbox" id="showFullHands" style="margin-right:5px;"> Show complete hands (from Game start)
    </label>
  </div>
  <button id="clearHistory">Clear History</button>
  <button id="exportHistory">Export History</button>
  <button id="copyLast50">Copy Last 50</button>
  <button id="copyFiltered">Copy Filtered</button>
  <button id="clearSearch">Clear Search</button><br>
  <textarea readonly id="poker-results" cols="120" rows="30"></textarea>
`);

    $title.append($controlBtn);
    $title.append($controlPanelDiv);
    $title.append($controlPanelOverlayDiv);

    function renderResults(results, textFilter = "", regexFilter = "") {
  let text = "";
  let matchCount = 0;
  let regex = null;
  const showFullHands = $("#showFullHands").is(":checked");
  const processedHands = new Set(); // Track which hands we've already shown

  try {
    if (regexFilter) regex = new RegExp(regexFilter, "i");
  } catch (e) {
    $("#regexMatchCount").text("Invalid regex");
    regex = null;
  }

  for (let i = 0; i < results.length; i++) {
    const message = results[i];
    let match = true;

    if (textFilter && match) {
      match = message.text.toLowerCase().includes(textFilter.toLowerCase());
    }
    if (regexFilter && match && regex) {
      match = regex.test(message.text);
    }

    if (match) {
      matchCount++;

      if (showFullHands) {
        // Get the hand context for this match
        const handContext = getHandContext(results, i);
        const handKey = `${handContext.startIndex}-${handContext.endIndex}`;

        // Only show this hand if we haven't already processed it
        if (!processedHands.has(handKey)) {
          processedHands.add(handKey);

          text += `\n=== COMPLETE HAND (Match found in line below) ===\n`;

          // Show all messages in this hand
          for (let j = handContext.startIndex; j <= handContext.endIndex; j++) {
            const timeStr = formatDateString(new Date(results[j].timestamp * 1000));
            const isMatchLine = (j === handContext.matchIndex);
            const prefix = isMatchLine ? ">>> " : "    ";
            text += `${prefix}${timeStr} ${results[j].text}\n`;
          }
          text += `=== END OF HAND ===\n\n`;
        }
      } else {
        // Original behavior - show just the matching line
        const timeStr = formatDateString(new Date(message.timestamp * 1000));
        text += `${timeStr} ${message.text}\n`;
      }
    }
  }

  text += `\nMatched ${matchCount} of ${results.length} total records\n`;
  if (showFullHands && processedHands.size > 0) {
    text += `Showed ${processedHands.size} complete hands\n`;
  }

  $("#poker-results").val(text).scrollTop($("#poker-results")[0].scrollHeight);

  if (textFilter) $("#textMatchCount").text(`${matchCount} matches`);
  if (regexFilter && regex) $("#regexMatchCount").text(`${matchCount} matches`);
  if (!textFilter && !regexFilter) {
    $("#textMatchCount").text("");
    $("#regexMatchCount").text("");
  }
}

    $controlBtn.click(function () {
      dbReadAll().then((result) => {
        renderResults(result);
        $controlPanelDiv.fadeToggle(200);
        $controlPanelOverlayDiv.fadeToggle(200);
      });
    });

    $controlPanelOverlayDiv.click(function () {
      $controlPanelDiv.fadeOut(200);
      $controlPanelOverlayDiv.fadeOut(200);
    });

    $(document).on("input", "#pokerSearchText", function () {
      const textFilter = $(this).val();
      const regexFilter = $("#pokerSearchRegex").val();
      dbReadAll().then((result) => renderResults(result, textFilter, regexFilter));
    });

    $(document).on("input", "#pokerSearchRegex", function () {
      const textFilter = $("#pokerSearchText").val();
      const regexFilter = $(this).val();
      dbReadAll().then((result) => renderResults(result, textFilter, regexFilter));
    });

      $(document).on("change", "#showFullHands", function () {
  const textFilter = $("#pokerSearchText").val();
  const regexFilter = $("#pokerSearchRegex").val();
  dbReadAll().then((result) => renderResults(result, textFilter, regexFilter));
    });

    $(document).on("click", "#clearSearch", function () {
      $("#pokerSearchText").val("");
      $("#pokerSearchRegex").val("");
      $("#textMatchCount").text("");
      $("#regexMatchCount").text("");
      dbReadAll().then((result) => renderResults(result));
    });

    $(document).on("click", "#clearHistory", function () {
      if (confirm("Are you sure you want to clear all poker history?")) {
        dbClearAll();
        $("#poker-results").val("History cleared.\n");
      }
    });

    $(document).on("click", "#exportHistory", function () {
      dbReadAll().then((result) => {
        let output = "";
        for (const message of result) {
          const timeStr = formatDateString(new Date(message.timestamp * 1000));
          output += `${timeStr} ${message.text}\n`;
        }
        const blob = new Blob([output], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "poker_history.txt";
        a.click();
        URL.revokeObjectURL(url);
      });
    });

    $(document).on("click", "#copyLast50", function () {
      dbReadAll().then((result) => {
        const last50 = result.slice(-50);
        let text = "";
        for (const message of last50) {
          const timeStr = formatDateString(new Date(message.timestamp * 1000));
          text += `${timeStr} ${message.text}\n`;
        }
        navigator.clipboard.writeText(text).then(() => alert("Last 50 lines copied to clipboard!"));
      });
    });

    $(document).on("click", "#copyFiltered", function () {
  const textFilter = $("#pokerSearchText").val();
  const regexFilter = $("#pokerSearchRegex").val();
  const showFullHands = $("#showFullHands").is(":checked");

  dbReadAll().then((result) => {
    let regex = null;
    try {
      if (regexFilter) regex = new RegExp(regexFilter, "i");
    } catch (e) {
      alert("Invalid regex pattern");
      return;
    }

    let text = "";
    const processedHands = new Set();

    for (let i = 0; i < result.length; i++) {
      const message = result[i];
      let match = true;

      if (textFilter && match) {
        match = message.text.toLowerCase().includes(textFilter.toLowerCase());
      }
      if (regexFilter && match && regex) {
        match = regex.test(message.text);
      }

      if (match) {
        if (showFullHands) {
          const handContext = getHandContext(result, i);
          const handKey = `${handContext.startIndex}-${handContext.endIndex}`;

          if (!processedHands.has(handKey)) {
            processedHands.add(handKey);

            text += `\n=== COMPLETE HAND (Match found in line below) ===\n`;
            for (let j = handContext.startIndex; j <= handContext.endIndex; j++) {
              const timeStr = formatDateString(new Date(result[j].timestamp * 1000));
              const isMatchLine = (j === handContext.matchIndex);
              const prefix = isMatchLine ? ">>> " : "    ";
              text += `${prefix}${timeStr} ${result[j].text}\n`;
            }
            text += `=== END OF HAND ===\n\n`;
          }
        } else {
          const timeStr = formatDateString(new Date(message.timestamp * 1000));
          text += `${timeStr} ${message.text}\n`;
        }
      }
    }

    if (text.length === 0) {
      alert("No matches to copy");
      return;
    }
    navigator.clipboard.writeText(text).then(() => alert("Filtered lines copied to clipboard!"));
  });
});
  }

  function formatDateString(date) {
    // Format as hh:mm:ss
    return date.toLocaleTimeString();
  }
    function getHandContext(results, matchIndex) {
  // Find the start of the current hand by looking backwards for "Game ... started"
  let handStartIndex = matchIndex;
  for (let i = matchIndex; i >= 0; i--) {
    if (results[i].text.includes("Game")) {
      handStartIndex = i;
      break;
    }
  }

  // Find the end of the current hand by looking forwards for the next "Game ... started"
  let handEndIndex = matchIndex;
  for (let i = matchIndex + 1; i < results.length; i++) {
    if (results[i].text.includes("Game")) {
      handEndIndex = i - 1; // End before the next game starts
      break;
    }
  }
  // If no next game found, include everything up to the current match
  if (handEndIndex === matchIndex) {
    handEndIndex = Math.min(matchIndex + 10, results.length - 1);// Show some context after
  }

  return {
    startIndex: handStartIndex,
    endIndex: handEndIndex,
    matchIndex: matchIndex
  };
}
})();