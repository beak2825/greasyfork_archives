// ==UserScript==
// @name         Enhanced Torn Poker HUD - TestingBB
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Ultimate Poker HUD combining real-time overlays, complete history, advanced stats, and search functionality
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        GM_addStyle
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545644/Enhanced%20Torn%20Poker%20HUD%20-%20TestingBB.user.js
// @updateURL https://update.greasyfork.org/scripts/545644/Enhanced%20Torn%20Poker%20HUD%20-%20TestingBB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Database and storage
    let db = null;
    let messageBoxObserver = null;

    // Player tracking
    let playerStats = {};
    let currentHand = null;
    let playerRefreshInterval = null;
    let hudEnabled = false;
    let playerElements = {};
    let lastPlayerList = [];

    // Hand tracking for VPIP/PFR/AF
    let handInProgress = false;
    const currentHandPlayersSeen = new Set();
    const currentHandPlayersVoluntary = new Set();
    const currentHandPlayersRaisedPreflop = new Set();
    // Test data for unit testing
const testHandHistory = [
    // HAND 1 - Money format
    "3:21:12 AM Game 7c6009f09f1439177d4bbf6719b592 started",
    "3:21:12 AM The preflop Two cards dealt to each player",
    "3:21:12 AM Alice posted small blind $1,000",
    "3:21:12 AM Bob posted big blind $2,000",
    "3:21:14 AM Charlie folded",
    "3:21:15 AM Alice called $1,000", // Alice: VPIP=YES, PFR=NO
    "3:21:16 AM Bob checked",
    "3:21:17 AM The flop: 9♣, A♥, 4♠",
    "3:21:18 AM Alice won $4,000",

    // HAND 2 - BB format
    "3:22:30 AM Game abc123def456 started",
    "3:22:30 AM The preflop Two cards dealt to each player",
    "3:22:30 AM Alice posted small blind 0.50 BB",
    "3:22:30 AM Bob posted big blind 1.00 BB",
    "3:22:31 AM Charlie raised 3.00 BB to 4.00 BB", // Charlie: VPIP=YES, PFR=YES
    "3:22:32 AM Alice folded",
    "3:22:33 AM Bob called 3.00 BB", // Bob: VPIP=YES, PFR=NO
    "3:22:34 AM The flop: K♠, Q♥, J♦",
    "3:22:35 AM Charlie won 9.50 BB",

    // HAND 3 - Money format
    "3:23:45 AM Game xyz789uvw012 started",
    "3:23:45 AM The preflop Two cards dealt to each player",
    "3:23:45 AM Alice posted small blind $1,000",
    "3:23:45 AM Bob posted big blind $2,000",
    "3:23:46 AM Charlie called $2,000", // Charlie: VPIP=YES, PFR=NO
    "3:23:47 AM Alice raised $3,000 to $5,000", // Alice: VPIP=YES, PFR=YES
    "3:23:48 AM Bob folded",
    "3:23:49 AM Charlie folded",
    "3:23:50 AM Alice won $9,000",

    // HAND 4 - BB format
    "3:24:15 AM Game def456ghi789 started",
    "3:24:15 AM The preflop Two cards dealt to each player",
    "3:24:15 AM Alice posted small blind 0.50 BB",
    "3:24:15 AM Bob posted big blind 1.00 BB",
    "3:24:16 AM Charlie folded",
    "3:24:17 AM Alice folded",
    "3:24:18 AM Bob won 1.50 BB"
];
 // ADD THIS LINE TO VERIFY SCRIPT IS RUNNING:
    console.log("🔧 Script loaded! Variables defined:", typeof playerStats, typeof testHandHistory);

    // Drag functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // Initialize everything
    initIndexedDB();
    window.onload = function() {
        initCSS();
        loadStoredStats();
        createControlPanel();
        createStatsPanel();
        createHistoryPanel();
        initPokerObserver();
    };

    // IndexedDB initialization
    function initIndexedDB() {
        const openRequest = indexedDB.open("enhancedPokerHudDB", 3);
        openRequest.onupgradeneeded = function(e) {
            db = e.target.result;
            if (!db.objectStoreNames.contains("messageStore")) {
                db.createObjectStore("messageStore", { keyPath: "autoId", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("statsStore")) {
                db.createObjectStore("statsStore", { keyPath: "id" });
            }
        };
        openRequest.onsuccess = function(e) {
            db = e.target.result;
        };
        openRequest.onerror = function(e) {
            console.error("Enhanced Poker HUD: Database initialization failed", e);
        };
    }

    // Database operations
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
    }

    // Load stats from IndexedDB
    function loadStoredStats() {
        if (!db) return;
        const transaction = db.transaction(["statsStore"], "readonly");
        const store = transaction.objectStore("statsStore");
        const request = store.get("playerStats");

        request.onsuccess = function(event) {
            const result = event.target.result;
            if (result && result.data) {
                playerStats = result.data;
                console.log('📚 Loaded stats for', Object.keys(playerStats).length, 'players');
                updateStatsPanel();
            }
        };
    }

    // Save stats to IndexedDB
    function saveStats() {
        if (!db) return;
        const transaction = db.transaction(["statsStore"], "readwrite");
        const store = transaction.objectStore("statsStore");
        store.put({
            id: "playerStats",
            data: playerStats,
            timestamp: Date.now()
        });
    }

    // Export/Import functions - MOVED UP BEFORE THEY'RE REFERENCED
    function exportStats() {
        const exportData = {
            playerStats: playerStats,
            exportDate: new Date().toISOString(),
            version: "3.0"
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `poker_stats_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importStats() {
        document.getElementById('statsFileInput').click();
    }

    // Handle stats file import
    function handleStatsFileImport(e) {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importData = JSON.parse(event.target.result);

                    if (!importData.playerStats) {
                        alert("Invalid stats file format");
                        return;
                    }

                    const shouldMerge = confirm("Merge with existing stats? Cancel to replace completely.");

                    if (!shouldMerge) {
                        playerStats = {};
                    }

                    Object.entries(importData.playerStats).forEach(([player, stats]) => {
                        if (shouldMerge && playerStats[player]) {
                            const existing = playerStats[player];
                            playerStats[player] = {
                                handsPlayed: existing.handsPlayed + (stats.handsPlayed || 0),
                                vpipHands: existing.vpipHands + (stats.vpipHands || 0),
                                pfrHands: existing.pfrHands + (stats.pfrHands || 0),
                                bets: existing.bets + (stats.bets || 0),
                                calls: existing.calls + (stats.calls || 0),
                                raises: existing.raises + (stats.raises || 0),
                                lastSeen: Math.max(existing.lastSeen || 0, stats.lastSeen || 0),
                                isActive: existing.isActive || stats.isActive
                            };

                            // Recalculate percentages
                            const merged = playerStats[player];
                            merged.vpip = merged.handsPlayed > 0 ? Math.round((merged.vpipHands / merged.handsPlayed) * 100) : 0;
                            merged.pfr = merged.handsPlayed > 0 ? Math.round((merged.pfrHands / merged.handsPlayed) * 100) : 0;
                            merged.af = merged.calls > 0 ? ((merged.bets + merged.raises) / merged.calls).toFixed(2) :
                                       (merged.bets + merged.raises > 0 ? "∞" : "0");
                        } else {
                            playerStats[player] = stats;
                        }
                    });

                    saveStats();
                    updateStatsPanel();
                    updateAllHUDs();

                    const action = shouldMerge ? "merged" : "imported";
                    alert(`Stats successfully ${action}! Imported from: ${importData.exportDate || 'Unknown date'}`);

                } catch (error) {
                    alert("Error parsing JSON file: " + error.message);
                }
            };
            reader.readAsText(e.target.files[0]);
            e.target.value = '';
        }
    }

    // CSS Styles
    function initCSS() {
        const isDarkmode = document.body.classList.contains("dark-mode");
        GM_addStyle(`
            .poker-hud-overlay {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 6px 10px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                font-weight: bold;
                z-index: 1000;
                pointer-events: none;
                border: 1px solid #333;
                min-width: 75px;
                text-align: center;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }

            .poker-hud-overlay.leaving {
                opacity: 0.4;
                border-color: #f44336;
                background: rgba(244, 67, 54, 0.8);
            }

            .poker-hud-stats {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .poker-hud-vpip { color: #4CAF50; }
            .poker-hud-pfr { color: #FF9800; }
            .poker-hud-af { color: #E91E63; }
            .poker-hud-hands { color: #2196F3; font-size: 10px; }

            .poker-control-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .poker-hud-button {
                padding: 10px 15px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                color: white;
                min-width: 140px;
                font-size: 12px;
                transition: all 0.2s;
            }

            .poker-hud-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .poker-stats-panel {
                position: fixed;
                top: 200px;
                right: 10px;
                background: ${isDarkmode ? "rgba(40, 40, 40, 0.95)" : "rgba(240, 240, 240, 0.95)"};
                color: ${isDarkmode ? "white" : "black"};
                padding: 15px;
                border-radius: 10px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 9999;
                max-width: 400px;
                max-height: 500px;
                overflow-y: auto;
                display: none;
                border: 2px solid ${isDarkmode ? "#555" : "#ccc"};
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }

            .poker-history-panel {
                position: fixed;
                top: 10%;
                left: 15%;
                background: ${isDarkmode ? "rgba(40, 40, 40, 0.95)" : "rgba(240, 240, 240, 0.95)"};
                color: ${isDarkmode ? "white" : "black"};
                padding: 15px;
                border-radius: 10px;
                z-index: 9999;
                display: none;
                border: 2px solid ${isDarkmode ? "#555" : "#ccc"};
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }

            .poker-history-overlay {
                position: fixed;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                z-index: 8999;
                display: none;
            }

            .drag-handle {
                cursor: move;
                padding: 8px;
                background: ${isDarkmode ? "#555" : "#ddd"};
                border-bottom: 1px solid ${isDarkmode ? "#666" : "#ccc"};
                border-radius: 6px 6px 0 0;
                user-select: none;
                font-weight: bold;
                text-align: center;
            }

            .search-row {
                margin: 8px 0;
                padding: 8px;
                border: 1px solid ${isDarkmode ? "#555" : "#ccc"};
                border-radius: 6px;
                background: ${isDarkmode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
            }

            .search-input {
                width: 100%;
                padding: 6px;
                margin: 4px 0;
                border: 1px solid ${isDarkmode ? "#555" : "#ccc"};
                border-radius: 4px;
                background: ${isDarkmode ? "#333" : "white"};
                color: ${isDarkmode ? "white" : "black"};
            }

            .match-count {
                font-size: 11px;
                color: ${isDarkmode ? "#aaa" : "#666"};
                margin-left: 10px;
            }

            .player-item {
                margin: 8px 0;
                padding: 10px;
                background: ${isDarkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
                border-radius: 6px;
                border-left: 4px solid #4CAF50;
            }

            .player-name {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .player-stats {
                font-size: 12px;
                color: ${isDarkmode ? "#ccc" : "#666"};
            }

            .status-active { border-left-color: #4CAF50; }
            .status-inactive { border-left-color: #f44336; }
        `);
    }

    // Initialize player stats
    function initPlayerStats(playerName) {
        if (!playerStats[playerName]) {
            playerStats[playerName] = {
                handsPlayed: 0,
                vpipHands: 0,
                pfrHands: 0,
                bets: 0,
                calls: 0,
                raises: 0,
                vpip: 0,
                pfr: 0,
                af: 0,
                lastSeen: Date.now(),
                isActive: true
            };
            console.log('🆕 Initialized stats for new player:', playerName);
        } else {
            playerStats[playerName].lastSeen = Date.now();
            playerStats[playerName].isActive = true;
        }
        saveStats();
    }

    // Enhanced stats calculation with AF
    function updatePlayerStats(playerName, actions) {
        initPlayerStats(playerName);
        const stats = playerStats[playerName];

        stats.handsPlayed++;
        stats.lastSeen = Date.now();

        // Check for VPIP
        const vpipActions = ['call', 'raise', 'bet'];
        const hasVPIP = actions.some(action =>
            action.player === playerName &&
            vpipActions.includes(action.action) &&
            !action.raw.includes('posted')
        );

        if (hasVPIP) {
            stats.vpipHands++;
        }

        // Check for PFR
        const hasPFR = actions.some(action =>
            action.player === playerName &&
            action.action === 'raise'
        );

        if (hasPFR) {
            stats.pfrHands++;
        }

        // Track individual actions for AF calculation
        actions.forEach(action => {
            if (action.player === playerName) {
                switch(action.action) {
                    case 'call':
                        stats.calls++;
                        break;
                    case 'bet':
                        stats.bets++;
                        break;
                    case 'raise':
                        stats.raises++;
                        break;
                }
            }
        });

        // Calculate percentages and AF
        stats.vpip = stats.handsPlayed > 0 ? Math.round((stats.vpipHands / stats.handsPlayed) * 100) : 0;
        stats.pfr = stats.handsPlayed > 0 ? Math.round((stats.pfrHands / stats.handsPlayed) * 100) : 0;
        stats.af = stats.calls > 0 ? ((stats.bets + stats.raises) / stats.calls).toFixed(2) :
                  (stats.bets + stats.raises > 0 ? "∞" : "0");

        console.log(`📊 ${playerName}: VPIP ${stats.vpip}% PFR ${stats.pfr}% AF ${stats.af}`);
        saveStats();
    }

    // Find player elements
    function findPlayerElements() {
        const nameElements = document.querySelectorAll('.name___cESdZ');
        const newPlayerElements = {};
        const currentPlayerList = [];

        nameElements.forEach((element, index) => {
            const playerName = element.textContent.trim();
            if (playerName && playerName !== '') {
                currentPlayerList.push(playerName);
                newPlayerElements[playerName] = {
                    nameElement: element,
                    position: index,
                    hudElement: playerElements[playerName]?.hudElement || null
                };
                initPlayerStats(playerName);
            }
        });

        // Detect players who left
        const playersWhoLeft = lastPlayerList.filter(name => !currentPlayerList.includes(name));
        const playersWhoJoined = currentPlayerList.filter(name => !lastPlayerList.includes(name));

        if (playersWhoLeft.length > 0) {
            console.log('👋 Players left:', playersWhoLeft);
            playersWhoLeft.forEach(playerName => {
                if (playerStats[playerName]) {
                    playerStats[playerName].isActive = false;
                }
                if (playerElements[playerName]?.hudElement) {
                    playerElements[playerName].hudElement.remove();
                }
            });
        }

        if (playersWhoJoined.length > 0) {
            console.log('👋 Players joined:', playersWhoJoined);
        }

        playerElements = newPlayerElements;
        lastPlayerList = [...currentPlayerList];

        return currentPlayerList.length > 0;
    }

    // Create HUD overlay
    function createPlayerHUD(playerName) {
        const playerData = playerElements[playerName];
        if (!playerData || !playerData.nameElement) return;

        if (playerData.hudElement) {
            playerData.hudElement.remove();
        }

        const stats = playerStats[playerName] || { vpip: 0, pfr: 0, af: 0, handsPlayed: 0 };

        const hudElement = document.createElement('div');
        hudElement.className = 'poker-hud-overlay';

        const timeSinceLastSeen = Date.now() - (stats.lastSeen || 0);
        const isStale = timeSinceLastSeen > 300000; // 5 minutes

        if (isStale) {
            hudElement.classList.add('leaving');
        }

        hudElement.innerHTML = `
            <div class="poker-hud-stats">
                <div class="poker-hud-vpip">V: ${stats.vpip}%</div>
                <div class="poker-hud-pfr">P: ${stats.pfr}%</div>
                <div class="poker-hud-af">AF: ${stats.af}</div>
                <div class="poker-hud-hands">(${stats.handsPlayed})</div>
            </div>
        `;

        const nameRect = playerData.nameElement.getBoundingClientRect();
        const pokerWrapper = document.querySelector('.holdemWrapper___D71Gy');
        if (!pokerWrapper) return;

        const wrapperRect = pokerWrapper.getBoundingClientRect();

        hudElement.style.position = 'absolute';
        hudElement.style.left = Math.max(5, (nameRect.left - wrapperRect.left + nameRect.width + 15)) + 'px';
        hudElement.style.top = Math.max(5, (nameRect.top - wrapperRect.top - 5)) + 'px';

        pokerWrapper.appendChild(hudElement);
        playerData.hudElement = hudElement;
    }

    // Update all HUDs
    function updateAllHUDs() {
        if (!hudEnabled) return;
        findPlayerElements();
        Object.keys(playerElements).forEach(playerName => {
            createPlayerHUD(playerName);
        });
    }

    // Poker observer initialization
    function initPokerObserver() {
        const pokerWrapper = document.querySelector("div.holdemWrapper___D71Gy");
        if (!pokerWrapper) return;

        const observer = new MutationObserver(reObserveMessageBox);
        const observerConfig = { attributes: false, childList: true, subtree: false };
        observer.observe(pokerWrapper, observerConfig);
        reObserveMessageBox();
    }

    function reObserveMessageBox() {
        if (!messageBoxObserver) {
            messageBoxObserver = new MutationObserver(handleMessageBoxChange);
        }
        messageBoxObserver.disconnect();
        const messagesWrap = document.querySelector("div.holdemWrapper___D71Gy div.messagesWrap___tBx9u");
        if (messagesWrap) {
            const observerConfig = { attributes: true, childList: true, subtree: false };
            messageBoxObserver.observe(messagesWrap, observerConfig);
        }
    }

    function handleMessageBoxChange(mutated) {
        if (mutated.length >= 40) return;
        for (const mutation of mutated) {
            for (const node of mutation.addedNodes) {
                if (node.classList && node.classList.contains("message___RlFXd")) {
                    const messageText = node.innerText.trim();
                    const message = {
                        timestamp: Date.now() / 1000,
                        text: messageText,
                    };
                    dbWrite(message);
                    processNewMessage(messageText);
                    updateVPIPStats(messageText);
                }
            }
        }
    }

   // Enhanced VPIP tracking - Updated to handle both $ amounts and BB units
 // Enhanced VPIP tracking - Updated to handle both $ amounts and BB units
    function updateVPIPStats(text) {
        const preflopStartRegex = /The preflop\s+Two cards dealt to each player/;
        const handEndRegex = /won (\$[\d,]+|[\d.]+ BB)/;
        // Updated to skip timestamp at beginning
        const voluntaryActionRegex = /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+(called|raised|bet)(?:\s+(\$[\d,]+|[\d.]+ BB))?/i;
        const foldCheckRegex = /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+(folded|checked)/i;
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
            const currentTime = Date.now();
            for (const player of currentHandPlayersSeen) {
                initPlayerStats(player);
                const stats = playerStats[player];
                stats.handsPlayed++;
                stats.lastSeen = currentTime;
            }

            for (const player of currentHandPlayersVoluntary) {
                playerStats[player].vpipHands++;
            }

            for (const player of currentHandPlayersRaisedPreflop) {
                playerStats[player].pfrHands++;
            }

            // Recalculate percentages
            for (const player of currentHandPlayersSeen) {
                const stats = playerStats[player];
                stats.vpip = stats.handsPlayed > 0 ? Math.round((stats.vpipHands / stats.handsPlayed) * 100) : 0;
                stats.pfr = stats.handsPlayed > 0 ? Math.round((stats.pfrHands / stats.handsPlayed) * 100) : 0;
            }

            currentHandPlayersSeen.clear();
            currentHandPlayersVoluntary.clear();
            currentHandPlayersRaisedPreflop.clear();
            handInProgress = false;
            saveStats();
            updateStatsPanel();
            updateAllHUDs();
            return;
        }

        let match = text.match(voluntaryActionRegex);
        if (match) {
            const player = match[1].trim();
            const action = match[2].toLowerCase();
            const amount = match[3];
            currentHandPlayersSeen.add(player);

            if (action === "called" || action === "raised" || action === "bet") {
                currentHandPlayersVoluntary.add(player);
            }
            if (action === "raised") {
                currentHandPlayersRaisedPreflop.add(player);
            }

            // Track actions for AF calculation
            initPlayerStats(player);
            const stats = playerStats[player];
            if (action === "called") stats.calls++;
            else if (action === "bet") stats.bets++;
            else if (action === "raised") stats.raises++;

            stats.af = stats.calls > 0 ? ((stats.bets + stats.raises) / stats.calls).toFixed(2) :
                      (stats.bets + stats.raises > 0 ? "∞" : "0");
            return;
        }

        match = text.match(foldCheckRegex);
        if (match) {
            const player = match[1].trim();
            currentHandPlayersSeen.add(player);
            return;
        }

        // Check for blind posts - this ensures players posting blinds are counted
        const blindPostRegex = /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+posted\s+(small blind|big blind)\s+(\$[\d,]+|[\d.]+ BB)/i;
        match = text.match(blindPostRegex);
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

    // Process new messages for hand tracking
    function processNewMessage(text) {
        if ((text.includes('Game ') && text.includes('started')) ||
            (text.includes('started') && text.match(/[a-f0-9]{20,}/))) {

            if (currentHand && currentHand.actions.length > 0) {
                processCompletedHand(currentHand);
            }

            currentHand = {
                gameId: extractGameId(text),
                actions: [],
                street: 'preflop'
            };
        }

        if (!currentHand) return;

        if (isPlayerAction(text)) {
            const action = parseAction(text);
            if (action.player && action.player.trim() !== '') {
                currentHand.actions.push(action);
                if (playerStats[action.player]) {
                    playerStats[action.player].lastSeen = Date.now();
                    playerStats[action.player].isActive = true;
                }
            }
        }

        if (text.includes('won')) {
            if (currentHand && currentHand.actions.length > 0) {
                processCompletedHand(currentHand);
                currentHand = null;
            }
        }
    }

    function processCompletedHand(hand) {
        if (!hand || !hand.actions) return;

        const playersInHand = [...new Set(hand.actions.map(action => action.player))];
        const preflopActions = hand.actions.filter(action => true); // For now, process all as preflop

        playersInHand.forEach(playerName => {
            if (playerName && playerName.trim() !== '') {
                updatePlayerStats(playerName, preflopActions);
            }
        });

        updateAllHUDs();
        updateStatsPanel();
    }

    // Utility functions
    function extractGameId(text) {
        const match = text.match(/Game ([a-f0-9]+) started/) || text.match(/started.*([a-f0-9]{20,})/);
        return match ? match[1] : `hand_${Date.now()}`;
    }

 // Enhanced action detection
    function isPlayerAction(text) {
        const actionPatterns = [
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+(folded|checked|called|raised|bet)(?:\s+(\$[\d,]+|[\d.]+ BB))?/i,
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+posted\s+(small blind|big blind)\s+(\$[\d,]+|[\d.]+ BB)/i,
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+raised\s+(\$[\d,]+|[\d.]+ BB)\s+to\s+(\$[\d,]+|[\d.]+ BB)/i
        ];

        return actionPatterns.some(pattern => pattern.test(text));
    }
// Enhanced action parsing
    function parseAction(text) {
        const patterns = [
            // Updated to skip timestamp: "3:21:15 AM Alice called $1,000"
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+(called|bet)\s+(\$[\d,]+|[\d.]+ BB)/i,
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+raised\s+(\$[\d,]+|[\d.]+ BB)\s+to\s+(\$[\d,]+|[\d.]+ BB)/i,
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+(folded|checked)/i,
            /^\d{1,2}:\d{2}:\d{2} [AP]M\s+(.*?)\s+posted\s+(small blind|big blind)\s+(\$[\d,]+|[\d.]+ BB)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const player = match[1].trim();
                let action = match[2].toLowerCase();
                let amount = 0;

                if (action === 'raised') {
                    action = 'raise';
                    amount = match[3] ? parseAmount(match[3]) : 0;
                } else if (match[3]) {
                    amount = parseAmount(match[3]);
                }

                if (action === 'small blind' || action === 'big blind') {
                    action = 'post_blind';
                }

                return {
                    player: player,
                    action: action,
                    amount: amount,
                    raw: text,
                    format: detectAmountFormat(text)
                };
            }
        }

        return { player: '', action: '', amount: 0, raw: text };
    }
// Helper functions for amount parsing
    function detectAmountFormat(text) {
        if (text.includes(' BB')) {
            return 'BB';
        }
        if (text.includes('$')) {
            return 'MONEY';
        }
        return 'UNKNOWN';
    }

    function parseAmount(amountText) {
        if (!amountText) return 0;

        if (amountText.includes('BB')) {
            return parseFloat(amountText.replace(' BB', ''));
        } else if (amountText.includes('$')) {
            return parseFloat(amountText.replace('$', '').replace(/,/g, ''));
        }
        return 0;
    }

    // Create control panel
    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'poker-control-panel';

        const hudButton = document.createElement('button');
        hudButton.className = 'poker-hud-button';
        hudButton.innerHTML = '🎯 Start HUD';
        hudButton.style.background = '#4CAF50';
        hudButton.onclick = toggleHUD;

        const statsButton = document.createElement('button');
        statsButton.className = 'poker-hud-button';
        statsButton.innerHTML = '📊 Player Stats';
        statsButton.style.background = '#2196F3';
        statsButton.onclick = toggleStatsPanel;

        const historyButton = document.createElement('button');
        historyButton.className = 'poker-hud-button';
        historyButton.innerHTML = '📚 Hand History';
        historyButton.style.background = '#9C27B0';
        historyButton.onclick = toggleHistoryPanel;

        const exportButton = document.createElement('button');
        exportButton.className = 'poker-hud-button';
        exportButton.innerHTML = '💾 Export All';
        exportButton.style.background = '#607D8B';
        exportButton.onclick = exportAllData;

        const resetButton = document.createElement('button');
        resetButton.className = 'poker-hud-button';
        resetButton.innerHTML = '🔄 Reset All';
        resetButton.style.background = '#f44336';
        resetButton.onclick = resetAllData;

        controlPanel.appendChild(hudButton);
        controlPanel.appendChild(statsButton);
        controlPanel.appendChild(historyButton);
        controlPanel.appendChild(exportButton);
        controlPanel.appendChild(resetButton);

        document.body.appendChild(controlPanel);
    }

    // Create stats panel
    function createStatsPanel() {
        const statsPanel = document.createElement('div');
        statsPanel.className = 'poker-stats-panel';
        statsPanel.id = 'enhancedStatsPanel';

        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.textContent = 'Player Statistics (drag to move)';

        const content = document.createElement('div');
        content.id = 'statsContent';
        content.innerHTML = 'No player data yet';

        const controls = document.createElement('div');
        controls.style.marginTop = '10px';

        // Create buttons with proper event listeners instead of onclick attributes
        const exportStatsBtn = document.createElement('button');
        exportStatsBtn.textContent = 'Export Stats';
        exportStatsBtn.style.cssText = 'margin:2px;padding:5px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;';
        exportStatsBtn.addEventListener('click', exportStats);

        const importStatsBtn = document.createElement('button');
        importStatsBtn.textContent = 'Import Stats';
        importStatsBtn.style.cssText = 'margin:2px;padding:5px;background:#2196F3;color:white;border:none;border-radius:3px;cursor:pointer;';
        importStatsBtn.addEventListener('click', importStats);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'statsFileInput';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleStatsFileImport);

        controls.appendChild(exportStatsBtn);
        controls.appendChild(importStatsBtn);
        controls.appendChild(fileInput);

        statsPanel.appendChild(dragHandle);
        statsPanel.appendChild(content);
        statsPanel.appendChild(controls);

        document.body.appendChild(statsPanel);
        makeDraggable(statsPanel, dragHandle);
    }

    // Create history panel
    function createHistoryPanel() {
        const historyPanel = document.createElement('div');
        historyPanel.className = 'poker-history-panel';
        historyPanel.id = 'enhancedHistoryPanel';

        const overlay = document.createElement('div');
        overlay.className = 'poker-history-overlay';
        overlay.id = 'historyOverlay';
        overlay.onclick = () => toggleHistoryPanel();

        historyPanel.innerHTML = `
            <div class="drag-handle">Hand History & Search (drag to move)</div>
            <div class="search-row">
                <label><strong>Text Search:</strong></label>
                <input type="text" id="textSearch" class="search-input" placeholder="Simple text search (e.g. 'PlayerName raised')">
                <span id="textMatchCount" class="match-count"></span>
            </div>
            <div class="search-row">
                <label><strong>Regex Search:</strong></label>
                <input type="text" id="regexSearch" class="search-input" placeholder="Regex pattern (e.g. '^.*PlayerName.*(called|raised).*\\)">
                <span id="regexMatchCount" class="match-count"></span>
            </div>
            <div class="search-row">
                <label style="font-size:12px;">
                    <input type="checkbox" id="showFullHands" style="margin-right:5px;"> Show complete hands (from Game start)
                </label>
            </div>
            <div style="margin: 10px 0;">
                <button id="clearHistoryBtn" style="margin:2px;padding:8px;background:#f44336;color:white;border:none;border-radius:4px;">Clear History</button>
                <button id="exportHistoryBtn" style="margin:2px;padding:8px;background:#4CAF50;color:white;border:none;border-radius:4px;">Export History</button>
                <button id="importHistoryBtn" style="margin:2px;padding:8px;background:#2196F3;color:white;border:none;border-radius:4px;">Import History</button>
                <button id="copyLast50Btn" style="margin:2px;padding:8px;background:#FF9800;color:white;border:none;border-radius:4px;">Copy Last 50</button>
                <button id="copyFilteredBtn" style="margin:2px;padding:8px;background:#9C27B0;color:white;border:none;border-radius:4px;">Copy Filtered</button>
                <input type="file" id="historyFileInput" accept=".json,.txt" style="display:none;">
            </div>
            <textarea readonly id="historyResults" style="width:100%;height:300px;font-family:monospace;font-size:11px;"></textarea>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(historyPanel);
        makeDraggable(historyPanel, historyPanel.querySelector('.drag-handle'));

        // Add event listeners for search
        document.getElementById('textSearch').addEventListener('input', performSearch);
        document.getElementById('regexSearch').addEventListener('input', performSearch);
        document.getElementById('showFullHands').addEventListener('change', performSearch);

        // Add event listeners for history panel buttons
        document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
        document.getElementById('exportHistoryBtn').addEventListener('click', exportHistory);
        document.getElementById('importHistoryBtn').addEventListener('click', () => {
            document.getElementById('historyFileInput').click();
        });
        document.getElementById('copyLast50Btn').addEventListener('click', copyLast50);
        document.getElementById('copyFilteredBtn').addEventListener('click', copyFiltered);

        // Handle history file import
        document.getElementById('historyFileInput').addEventListener('change', function(e) {
            if (e.target.files[0]) {
                importHistory(e.target.files[0]);
                e.target.value = ''; // Reset file input
            }
        });
    }

    // Make panels draggable
    function makeDraggable(panel, handle) {
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            panel.style.zIndex = '10000';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panel.style.zIndex = '9999';
            }
        });
    }

    // Update stats panel
    function updateStatsPanel() {
        const content = document.getElementById('statsContent');
        if (!content) return;

        if (Object.keys(playerStats).length === 0) {
            content.innerHTML = 'No player data yet';
            return;
        }

        // Sort players by most recent activity
        const sortedPlayers = Object.entries(playerStats)
            .filter(([_, stats]) => stats.handsPlayed > 0)
            .sort(([a, statsA], [b, statsB]) => {
                const aTime = statsA.lastSeen || 0;
                const bTime = statsB.lastSeen || 0;
                return bTime - aTime;
            })
            .slice(0, 12); // Show top 12 most recent

        let html = `<div style="margin-bottom:10px;"><strong>Player Statistics</strong><br><small>Showing ${sortedPlayers.length} most recently active players</small></div>`;

        sortedPlayers.forEach(([playerName, stats]) => {
            const isActive = lastPlayerList.includes(playerName);
            const statusClass = isActive ? 'status-active' : 'status-inactive';
            const statusIcon = isActive ? '🟢' : '🔴';

            html += `
                <div class="player-item ${statusClass}">
                    <div class="player-name">${statusIcon} ${playerName}</div>
                    <div class="player-stats">
                        VPIP: ${stats.vpip}% (${stats.vpipHands}/${stats.handsPlayed})<br>
                        PFR: ${stats.pfr}% (${stats.pfrHands}/${stats.handsPlayed})<br>
                        AF: ${stats.af} (B:${stats.bets}+R:${stats.raises}/C:${stats.calls})<br>
                        <small>Last seen: ${new Date(stats.lastSeen).toLocaleTimeString()}</small>
                    </div>
                </div>
            `;
        });

        html += `<div style="margin-top:10px;font-size:11px;color:#888;">Total players tracked: ${Object.keys(playerStats).length}</div>`;
        content.innerHTML = html;
    }

    // Search functionality
    function performSearch() {
        const textFilter = document.getElementById('textSearch').value;
        const regexFilter = document.getElementById('regexSearch').value;
        const showFullHands = document.getElementById('showFullHands').checked;

        dbReadAll().then(results => {
            renderSearchResults(results, textFilter, regexFilter, showFullHands);
        });
    }

    function renderSearchResults(results, textFilter = "", regexFilter = "", showFullHands = false) {
        let text = "";
        let matchCount = 0;
        let regex = null;
        const processedHands = new Set();

        try {
            if (regexFilter) regex = new RegExp(regexFilter, "i");
        } catch (e) {
            document.getElementById('regexMatchCount').textContent = "Invalid regex";
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
                    const handContext = getHandContext(results, i);
                    const handKey = `${handContext.startIndex}-${handContext.endIndex}`;

                    if (!processedHands.has(handKey)) {
                        processedHands.add(handKey);

                        text += `\n=== COMPLETE HAND (Match found in line below) ===\n`;
                        for (let j = handContext.startIndex; j <= handContext.endIndex; j++) {
                            const timeStr = formatTimestamp(results[j].timestamp);
                            const isMatchLine = (j === handContext.matchIndex);
                            const prefix = isMatchLine ? ">>> " : "    ";
                            text += `${prefix}${timeStr} ${results[j].text}\n`;
                        }
                        text += `=== END OF HAND ===\n\n`;
                    }
                } else {
                    const timeStr = formatTimestamp(message.timestamp);
                    text += `${timeStr} ${message.text}\n`;
                }
            }
        }

        text += `\nMatched ${matchCount} of ${results.length} total records\n`;
        if (showFullHands && processedHands.size > 0) {
            text += `Showed ${processedHands.size} complete hands\n`;
        }

        document.getElementById('historyResults').value = text;
        document.getElementById('historyResults').scrollTop = document.getElementById('historyResults').scrollHeight;

        if (textFilter) document.getElementById('textMatchCount').textContent = `${matchCount} matches`;
        if (regexFilter && regex) document.getElementById('regexMatchCount').textContent = `${matchCount} matches`;
        if (!textFilter && !regexFilter) {
            document.getElementById('textMatchCount').textContent = "";
            document.getElementById('regexMatchCount').textContent = "";
        }
    }

    function getHandContext(results, matchIndex) {
        let handStartIndex = matchIndex;
        for (let i = matchIndex; i >= 0; i--) {
            if (results[i].text.includes("Game")) {
                handStartIndex = i;
                break;
            }
        }

        let handEndIndex = matchIndex;
        for (let i = matchIndex + 1; i < results.length; i++) {
            if (results[i].text.includes("Game")) {
                handEndIndex = i - 1;
                break;
            }
        }

        if (handEndIndex === matchIndex) {
            handEndIndex = Math.min(matchIndex + 10, results.length - 1);
        }

        return {
            startIndex: handStartIndex,
            endIndex: handEndIndex,
            matchIndex: matchIndex
        };
    }

    function formatTimestamp(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString();
    }

    // Toggle functions
    function toggleHUD() {
        const button = document.querySelector('.poker-hud-button');

        if (!hudEnabled) {
            if (findPlayerElements()) {
                hudEnabled = true;
                button.innerHTML = '🎯 Stop HUD';
                button.style.background = '#f44336';

                // Start refresh interval
                if (playerRefreshInterval) clearInterval(playerRefreshInterval);
                playerRefreshInterval = setInterval(() => {
                    if (hudEnabled) updateAllHUDs();
                }, 3000);

                updateAllHUDs();
                console.log('✅ Enhanced HUD enabled');
            } else {
                alert('Could not find poker table or players!');
            }
        } else {
            hudEnabled = false;
            if (playerRefreshInterval) {
                clearInterval(playerRefreshInterval);
                playerRefreshInterval = null;
            }
            button.innerHTML = '🎯 Start HUD';
            button.style.background = '#4CAF50';
            document.querySelectorAll('.poker-hud-overlay').forEach(el => el.remove());
            console.log('⏹️ Enhanced HUD disabled');
        }
    }

    function toggleStatsPanel() {
        const panel = document.getElementById('enhancedStatsPanel');
        if (panel.style.display === 'none' || !panel.style.display) {
            updateStatsPanel();
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }

    function toggleHistoryPanel() {
        const panel = document.getElementById('enhancedHistoryPanel');
        const overlay = document.getElementById('historyOverlay');

        if (panel.style.display === 'none' || !panel.style.display) {
            dbReadAll().then(results => {
                renderSearchResults(results);
                panel.style.display = 'block';
                overlay.style.display = 'block';
            });
        } else {
            panel.style.display = 'none';
            overlay.style.display = 'none';
        }
    }

    // Export/Import functions
    function exportAllData() {
        Promise.all([dbReadAll()]).then(([history]) => {
            const exportData = {
                playerStats: playerStats,
                history: history,
                exportDate: new Date().toISOString(),
                version: "3.0"
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `enhanced_poker_data_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            alert(`Exported complete data for ${Object.keys(playerStats).length} players and ${history.length} messages!`);
        });
    }

    function resetAllData() {
        if (confirm('Reset ALL data including player stats and message history? This cannot be undone.')) {
            playerStats = {};
            dbClearAll();
            saveStats();
            updateStatsPanel();
            updateAllHUDs();
            document.getElementById('historyResults').value = '';
            console.log('🔄 All data reset');
            alert('All data has been reset and cleared!');
        }
    }

    // History panel button functions
    function clearHistory() {
        if (confirm("Clear all poker message history? This cannot be undone.")) {
            dbClearAll();
            document.getElementById('historyResults').value = "History cleared.\n";
            alert("History cleared successfully!");
        }
    }

    function exportHistory() {
        dbReadAll().then(results => {
            let output = "";
            for (const message of results) {
                const timeStr = formatTimestamp(message.timestamp);
                output += `${timeStr} ${message.text}\n`;
            }
            const blob = new Blob([output], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `poker_history_${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            alert(`Exported ${results.length} messages to file!`);
        });
    }

    function importHistory(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                let importedMessages = [];

                if (file.name.endsWith('.json')) {
                    // Handle JSON import (from previous exports)
                    const jsonData = JSON.parse(content);
                    if (jsonData.history && Array.isArray(jsonData.history)) {
                        importedMessages = jsonData.history;
                    } else if (Array.isArray(jsonData)) {
                        importedMessages = jsonData;
                    } else {
                        alert("Invalid JSON format for history import");
                        return;
                    }
                } else {
                    // Handle text file import
                    const lines = content.split('\n').filter(line => line.trim());
                    let messageId = Date.now();

                    importedMessages = lines.map(line => {
                        // Try to parse timestamp from line format: "HH:MM:SS message text"
                        const timeMatch = line.match(/^(\d{1,2}:\d{2}:\d{2})\s+(.+)$/);
                        if (timeMatch) {
                            const timeStr = timeMatch[1];
                            const messageText = timeMatch[2];
                            const today = new Date();
                            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
                            today.setHours(hours, minutes, seconds, 0);

                            return {
                                autoId: messageId++,
                                timestamp: today.getTime() / 1000,
                                text: messageText
                            };
                        } else {
                            // If no timestamp found, use current time
                            return {
                                autoId: messageId++,
                                timestamp: Date.now() / 1000,
                                text: line.trim()
                            };
                        }
                    });
                }

                if (importedMessages.length === 0) {
                    alert("No valid messages found in the file");
                    return;
                }

                const shouldMerge = confirm(`Found ${importedMessages.length} messages to import. Merge with existing history? Cancel to replace existing history.`);

                if (!shouldMerge) {
                    // Clear existing history first
                    dbClearAll();
                }

                // Import messages
                let importCount = 0;
                const importPromises = importedMessages.map(message => {
                    return new Promise((resolve) => {
                        dbWrite(message);
                        importCount++;
                        resolve();
                    });
                });

                Promise.all(importPromises).then(() => {
                    const action = shouldMerge ? "merged" : "imported";
                    alert(`Successfully ${action} ${importCount} messages!`);

                    // Refresh the display
                    performSearch();
                });

            } catch (error) {
                alert("Error importing file: " + error.message);
            }
        };

        reader.onerror = function() {
            alert("Error reading file");
        };

        reader.readAsText(file);
    }

    function copyLast50() {
        dbReadAll().then(results => {
            const last50 = results.slice(-50);
            let text = "";
            for (const message of last50) {
                const timeStr = formatTimestamp(message.timestamp);
                text += `${timeStr} ${message.text}\n`;
            }
            navigator.clipboard.writeText(text).then(() => {
                alert("Last 50 lines copied to clipboard!");
            }).catch(() => {
                alert("Failed to copy to clipboard. Your browser may not support this feature.");
            });
        });
    }

    function copyFiltered() {
        const text = document.getElementById('historyResults').value;
        if (text.length === 0) {
            alert("No filtered results to copy");
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            alert("Filtered results copied to clipboard!");
        }).catch(() => {
            alert("Failed to copy to clipboard. Your browser may not support this feature.");
        });
    }

    // Initialize when poker table is found
    function initialize() {
        const checkForPoker = setInterval(() => {
            const pokerWrapper = document.querySelector('div.holdemWrapper___D71Gy');
            if (pokerWrapper) {
                clearInterval(checkForPoker);
                console.log('🃏 Enhanced Torn Poker HUD Ultimate Edition loaded!');
                console.log('📚 Features: Real-time HUD overlays, complete history, advanced search, VPIP/PFR/AF tracking');
                console.log('📊 Loaded stats for', Object.keys(playerStats).length, 'players');
            }
        }, 1000);

        setTimeout(() => clearInterval(checkForPoker), 30000);
    }

    initialize();
 // Unit test function
function runStatsTest() {
    console.log("🧪 Starting poker stats test...");

    // Clear existing stats
    playerStats = {};
    handInProgress = false;
    currentHandPlayersSeen.clear();
    currentHandPlayersVoluntary.clear();
    currentHandPlayersRaisedPreflop.clear();

    // Process each line of test data - use ONLY updateVPIPStats for testing
    testHandHistory.forEach(line => {
        updateVPIPStats(line);
    });

    // Expected results (calculated manually)
    const expectedStats = {
        "Alice": {
            handsPlayed: 4,
            vpipHands: 2, // Hand 1: called, Hand 3: raised
            pfrHands: 1, // Hand 3: raised preflop
            vpip: 50, // 2/4 * 100 = 50%
            pfr: 25 // 1/4 * 100 = 25%
        },
        "Bob": {
            handsPlayed: 4,
            vpipHands: 1, // Hand 2: called
            pfrHands: 0, // Never raised preflop
            vpip: 25, // 1/4 * 100 = 25%
            pfr: 0 // 0/4 * 100 = 0%
        },
        "Charlie": {
            handsPlayed: 4,
            vpipHands: 2, // Hand 2: raised, Hand 3: called
            pfrHands: 1, // Hand 2: raised preflop
            vpip: 50, // 2/4 * 100 = 50%
            pfr: 25 // 1/4 * 100 = 25%
        }
    };

    // Compare results
    let allTestsPassed = true;

    console.log("📊 TEST RESULTS:");
    console.log("================");

    for (const [playerName, expected] of Object.entries(expectedStats)) {
        const actual = playerStats[playerName];

        if (!actual) {
            console.error(`❌ Player ${playerName} not found in results`);
            allTestsPassed = false;
            continue;
        }

        console.log(`\n👤 ${playerName}:`);
        console.log(`   Expected: VPIP=${expected.vpip}% PFR=${expected.pfr}% Hands=${expected.handsPlayed}`);
        console.log(`   Actual:   VPIP=${actual.vpip}% PFR=${actual.pfr}% Hands=${actual.handsPlayed}`);

        const vpipMatch = actual.vpip === expected.vpip;
        const pfrMatch = actual.pfr === expected.pfr;
        const handsMatch = actual.handsPlayed === expected.handsPlayed;

        if (vpipMatch && pfrMatch && handsMatch) {
            console.log(`   ✅ ALL CORRECT!`);
        } else {
            allTestsPassed = false;
            if (!vpipMatch) console.error(`   ❌ VPIP: expected ${expected.vpip}%, got ${actual.vpip}%`);
            if (!pfrMatch) console.error(`   ❌ PFR: expected ${expected.pfr}%, got ${actual.pfr}%`);
            if (!handsMatch) console.error(`   ❌ Hands: expected ${expected.handsPlayed}, got ${actual.handsPlayed}`);
        }
    }

    console.log("\n" + "=".repeat(50));
    if (allTestsPassed) {
        console.log("🎉 ALL TESTS PASSED! Your parser is working correctly!");
    } else {
        console.log("❌ Some tests failed. Check the parsing logic.");
    }
    console.log("=".repeat(50));
}
// ADD THESE DEBUG LINES:
    console.log("🔧 TEST FUNCTION DEFINED:", typeof runStatsTest);

    // Make test function available globally
    window.runStatsTest = runStatsTest;

    // ADD THIS DEBUG LINE TOO:
    console.log("🔧 WINDOW.runStatsTest SET:", typeof window.runStatsTest);
// Make test function available globally
unsafeWindow.runStatsTest = runStatsTest;
window.runStatsTest = runStatsTest;

// Auto-run test message
setTimeout(() => {
    console.log("🚀 Poker stats script loaded! Type 'runStatsTest()' in console to test.");
    // Uncomment the line below to auto-run tests
    // runStatsTest();
}, 2000);
})();