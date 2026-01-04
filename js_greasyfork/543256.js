// ==UserScript==
// @name         Cartel Empire Attack Tracker
// @namespace    http://tampermonkey.net/
// @author       Kwyy [2054]
// @license      GNU GPLv3
// @version      0.1
// @description  Floating widget to display recent attacks from Cartel Empire API
// @match        https://cartelempire.online/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543256/Cartel%20Empire%20Attack%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/543256/Cartel%20Empire%20Attack%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const API_KEY = '';
    const API_URL = `https://cartelempire.online/api/cartel?type=attacks&key=${API_KEY}`;
    const USER_API_BASE = `https://cartelempire.online/api/user?type=basic&key=${API_KEY}&id=`;
    const UPDATE_INTERVAL = 60000; // 60 seconds
    const MAX_ATTACKS_DISPLAY = 10;
    const CARTEL_ID = 53; // Your cartel ID

    // Discord Configuration
    const DISCORD_WEBHOOK_URL = ''; // Add your Discord webhook URL here
    const DISCORD_ENABLED = true; // Set to false to disable Discord posting
    const DISCORD_SHOW_NOTIFICATION = false; // Set to false to disable browser notifications

    // Add styles for the attack tracker widget
    GM_addStyle(`
        #attack-tracker {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1a1a1a;
            color: #e0e0e0;
            padding: 0;
            border-radius: 12px;
            z-index: 9999;
            min-width: 350px;
            max-width: 500px;
            min-height: 120px;
            max-height: 600px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            border: 1px solid #333333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            resize: both;
            display: flex;
            flex-direction: column;
        }

        #attack-tracker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #2d2d2d;
            border-bottom: 1px solid #333333;
        }

        #attack-tracker-title {
            font-weight: 600;
            font-size: 12px;
            color: #ffffff;
        }

        #attack-tracker-controls {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        .control-btn {
            background: #404040;
            border: 1px solid #555555;
            color: #cccccc;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.2s ease;
        }

        .control-btn:hover {
            background: #505050;
            border-color: #666666;
        }

        .control-btn.minimize {
            background: #4d3c00;
            border-color: #665200;
            color: #ffd700;
        }

        .control-btn.close {
            background: #4d0000;
            border-color: #660000;
            color: #ff6b6b;
        }

        #attack-tracker-content {
            overflow-y: auto;
            flex: 1 1 auto;
            max-height: none;
            padding: 16px;
            background: #1a1a1a;
        }

        #attack-tracker-content::-webkit-scrollbar {
            width: 6px;
        }

        #attack-tracker-content::-webkit-scrollbar-track {
            background: #2d2d2d;
        }

        #attack-tracker-content::-webkit-scrollbar-thumb {
            background: #555555;
            border-radius: 3px;
        }

        #attack-tracker-content::-webkit-scrollbar-thumb:hover {
            background: #666666;
        }

        .attack-entry {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 8px;
            border: 1px solid #404040;
            transition: all 0.2s ease;
            line-height: 1.4;
            font-size: 13px;
        }

        .attack-entry:hover {
            border-color: #555555;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .attack-entry.win {
            border-left: none;
        }

        .attack-entry.lose {
            border-left: 3px solid #dc3545;
        }

        .attack-entry.new-attack {
            animation: pulse 2s ease-in-out;
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
                transform: scale(1.02);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
                transform: scale(1);
            }
        }

        .attack-line-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .attack-participants {
            display: flex;
            gap: 16px;
            font-size: 13px;
            flex: 1;
        }

        .participant {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .participant-label {
            color: #888888;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .participant-value {
            color: #e0e0e0;
            font-weight: 500;
            font-size: 13px;
        }

        .attack-outcome {
            font-weight: 600;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 12px;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .attack-outcome.win {
            background: none;
            color: inherit;
        }

        .attack-outcome.lose {
            background: #4d1e1e;
            color: #f87171;
        }

        .attack-line-2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }

        .attack-stats {
            display: flex;
            gap: 12px;
        }

        .attack-stat {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .stat-label {
            color: #888888;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .stat-value {
            color: #e0e0e0;
            font-weight: 500;
            font-size: 12px;
        }

        .attack-time {
            font-size: 11px;
            color: #888888;
            white-space: nowrap;
        }

        .attack-entry.highlight-cartel {
            background: #3a1a1a !important;
            border: 2px solid #660000 !important;
        }

        .cartel-member {
            color: #4ade80 !important;
            font-weight: 600 !important;
        }

        .non-cartel-member {
            color: #f87171 !important;
            font-weight: 600 !important;
        }

        #attack-tracker.minimized {
            height: auto;
            max-height: 60px;
            overflow: hidden;
        }

        #attack-tracker.minimized #attack-tracker-content {
            display: none;
        }

        #attack-tracker.minimized #attack-tracker-header {
            margin-bottom: 0;
            border-bottom: none;
        }

        .loading {
            text-align: center;
            color: #888888;
            font-style: italic;
            padding: 30px 20px;
            font-size: 14px;
        }

        .error {
            color: #f87171;
            text-align: center;
            padding: 20px;
            font-size: 14px;
            background: #4d1e1e;
            border-radius: 8px;
            border: 1px solid #660000;
        }

        .player-link {
            color: inherit !important;
            text-decoration: underline;
            cursor: pointer;
            font-weight: 600;
            transition: color 0.2s;
        }
        .player-link:hover {
            color: #38bdf8 !important;
            text-decoration: underline;
        }
    `);

    // Global variables
    let attackData = [];
    let playerNames = new Map(); // Cache for player names
    let cartelNames = new Map(); // Cache for cartel names
    let seenAttackIds = new Set(); // Track seen attack IDs
    let isMinimized = false;
    let lastUpdate = 0;
    let lastMinuteUpdate = 0; // Track last minute-based update

    // Discord variables
    let postedAttackIds = new Set(); // Track attacks already posted to Discord

    // Helper functions for localStorage
    function saveWidgetState(state) {
        localStorage.setItem('attackTrackerWidgetState', JSON.stringify(state));
    }
    function loadWidgetState() {
        try {
            return JSON.parse(localStorage.getItem('attackTrackerWidgetState')) || {};
        } catch {
            return {};
        }
    }

    // Discord settings management
    function saveDiscordSettings() {
        try {
            const settings = {
                postedIds: Array.from(postedAttackIds)
            };
            localStorage.setItem('attackTrackerDiscordSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving Discord settings:', error);
        }
    }

    function loadDiscordSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('attackTrackerDiscordSettings')) || {};
            postedAttackIds = new Set(settings.postedIds || []);
        } catch (error) {
            console.error('Error loading Discord settings:', error);
        }
    }

    // Cache functions for data persistence
    function saveCachedData() {
        try {
            const cacheData = {
                attacks: recentAttacks,
                playerNames: Object.fromEntries(playerNames),
                cartelNames: Object.fromEntries(cartelNames),
                seenAttackIds: Array.from(seenAttackIds),
                timestamp: Date.now()
            };

            localStorage.setItem('attackTrackerCache', JSON.stringify(cacheData));
            console.log(`Cache saved - Attacks: ${recentAttacks.length}, Players: ${playerNames.size}, Cartels: ${cartelNames.size}, Seen: ${seenAttackIds.size}`);
        } catch (error) {
            console.error('Error saving cache:', error);
        }
    }

    function loadCachedData() {
        try {
            const cached = localStorage.getItem('attackTrackerCache');
            if (cached) {
                const data = JSON.parse(cached);
                const cacheAge = Date.now() - data.timestamp;

                console.log('Found cached data:', {
                    age: Math.round(cacheAge / 1000) + 's',
                    hasAttacks: !!data.attacks,
                    hasPlayers: !!data.playerNames,
                    hasCartels: !!data.cartelNames,
                    playerCount: data.playerNames ? Object.keys(data.playerNames).length : 0
                });

                // Only use cache if it's less than 24 hours old
                if (cacheAge < 86400000) {
                    recentAttacks = data.attacks || [];
                    playerNames = new Map(Object.entries(data.playerNames || {}));
                    cartelNames = new Map(Object.entries(data.cartelNames || {}));
                    seenAttackIds = new Set(data.seenAttackIds || []);
                    lastUpdate = Date.now();
                    lastMinuteUpdate = data.lastMinuteUpdate || 0;

                    console.log('Cache loaded successfully:', {
                        attacks: attackData.length,
                        players: playerNames.size,
                        cartels: cartelNames.size,
                        seen: seenAttackIds.size,
                        playerNamesSample: Array.from(playerNames.keys()).slice(0, 3)
                    });
                    return true;
                } else {
                    console.log('Cache too old, clearing');
                    localStorage.removeItem('attackTrackerCache');
                }
            } else {
                console.log('No cached data found');
            }
        } catch (error) {
            console.error('Error loading cache:', error);
        }
        return false;
    }

    function clearOldCache() {
        try {
            const cached = localStorage.getItem('attackTrackerCache');
            if (cached) {
                const data = JSON.parse(cached);
                const cacheAge = Date.now() - data.timestamp;

                // Clear cache if it's older than 48 hours
                if (cacheAge > 172800000) {
                    localStorage.removeItem('attackTrackerCache');
                    console.log('Cleared old cache data');
                }
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    // Create the floating widget
    function createAttackTracker() {
        const widget = document.createElement('div');
        widget.id = 'attack-tracker';

        widget.innerHTML = `
            <div id="attack-tracker-header">
                <div id="attack-tracker-title">⚔️ Attack Tracker</div>
                <div id="attack-tracker-controls">
                    <button class="control-btn minimize" title="Minimize">_</button>
                    <button class="control-btn close" title="Close">×</button>
                </div>
            </div>
            <div id="attack-tracker-content">
                <div class="loading">Loading attacks and player names...</div>
            </div>
        `;

        document.body.appendChild(widget);

        // Make widget draggable
        makeDraggable(widget);

        // Add event listeners
        setupEventListeners(widget);

        return widget;
    }

    // Make the widget draggable
    function makeDraggable(widget) {
        const header = widget.querySelector('#attack-tracker-header');
        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;
        let xOffset = 0;
        let yOffset = 0;

        // Restore position if available
        const state = loadWidgetState();
        if (state.left !== undefined && state.top !== undefined) {
            widget.style.left = state.left + 'px';
            widget.style.top = state.top + 'px';
            widget.style.position = 'fixed';
            widget.style.transform = 'none';
            // Initialize offset values with the restored position
            xOffset = state.left;
            yOffset = state.top;
        }

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.control-btn')) return;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, widget);
            }
        }
        function dragEnd() {
            if (isDragging) {
                // Save position
                const rect = widget.getBoundingClientRect();
                saveWidgetState({
                    ...loadWidgetState(),
                    left: rect.left,
                    top: rect.top,
                });
            }
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
        function setTranslate(xPos, yPos, el) {
            el.style.left = xPos + 'px';
            el.style.top = yPos + 'px';
            el.style.position = 'fixed';
            el.style.transform = 'none';
        }
    }

    // Setup event listeners for controls
    function setupEventListeners(widget) {
        const minimizeBtn = widget.querySelector('.minimize');
        const closeBtn = widget.querySelector('.close');

        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            widget.classList.toggle('minimized', isMinimized);
            minimizeBtn.textContent = isMinimized ? '□' : '_';
            minimizeBtn.title = isMinimized ? 'Maximize' : 'Minimize';
        });

        closeBtn.addEventListener('click', () => {
            widget.remove();
        });
    }



    // Format timestamp to relative time
    function formatTimeAgo(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    // Format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Create attack entry HTML
    function createAttackEntry(attack) {
        const outcomeClass = attack.outcome.toLowerCase();
        const repGained = attack.repGained || 0;
        const cashMugged = attack.cashMugged || 0;
        const attackerName = playerNames.get(attack.initiatorId) || `ID ${attack.initiatorId}`;
        const targetName = playerNames.get(attack.targetId) || `ID ${attack.targetId}`;
        const highlightClass = attack.targetCartelId === CARTEL_ID ? 'highlight-cartel' : '';

        // Debug: Log what names are being used
        if (attackerName !== `ID ${attack.initiatorId}` || targetName !== `ID ${attack.targetId}`) {
            console.log('Using cached names:', {
                attackerId: attack.initiatorId,
                attackerName: attackerName,
                targetId: attack.targetId,
                targetName: targetName
            });
        }

        // Get cartel names and create abbreviated versions
        const attackerCartelName = cartelNames.get(attack.initiatorCartelId) || '';
        const targetCartelName = cartelNames.get(attack.targetCartelId) || '';
        const attackerCartelAbbr = abbreviateCartelName(attackerCartelName);
        const targetCartelAbbr = abbreviateCartelName(targetCartelName);

        // Determine cartel membership classes
        const attackerCartelClass = attack.initiatorCartelId === CARTEL_ID ? 'cartel-member' : 'non-cartel-member';
        const targetCartelClass = attack.targetCartelId === CARTEL_ID ? 'cartel-member' : 'non-cartel-member';

        // Create display names with cartel abbreviations
        const attackerDisplay = attackerCartelAbbr ? `${attackerName} [${attackerCartelAbbr}]` : attackerName;
        const targetDisplay = targetCartelAbbr ? `${targetName} [${targetCartelAbbr}]` : targetName;

        // Create clickable player name links
        const attackerProfileUrl = `https://cartelempire.online/user/${attack.initiatorId}`;
        const targetProfileUrl = `https://cartelempire.online/user/${attack.targetId}`;
        const attackerDisplayHtml = attackerCartelAbbr
            ? `<a href="${attackerProfileUrl}" target="_blank" class="player-link">${attackerName}</a> [${attackerCartelAbbr}]`
            : `<a href="${attackerProfileUrl}" target="_blank" class="player-link">${attackerName}</a>`;
        const targetDisplayHtml = targetCartelAbbr
            ? `<a href="${targetProfileUrl}" target="_blank" class="player-link">${targetName}</a> [${targetCartelAbbr}]`
            : `<a href="${targetProfileUrl}" target="_blank" class="player-link">${targetName}</a>`;

        // Check if this is a new attack
        const isNewAttack = !seenAttackIds.has(attack.id);
        const newAttackClass = isNewAttack ? 'new-attack' : '';

        return `
            <div class="attack-entry ${outcomeClass} ${highlightClass} ${newAttackClass}">
                <div class="attack-line-1">
                    <div class="attack-participants">
                        <div class="participant">
                            <span class="participant-label">A:</span>
                            <span class="participant-value ${attackerCartelClass}">${attackerDisplayHtml}</span>
                        </div>
                        <div class="participant">
                            <span class="participant-label">T:</span>
                            <span class="participant-value ${targetCartelClass}">${targetDisplayHtml}</span>
                        </div>
                    </div>
                    <span class="attack-outcome ${outcomeClass}">${attack.outcome}</span>
                </div>
                <div class="attack-line-2">
                    <div class="attack-stats">
                        <div class="attack-stat">
                            <span class="stat-label">Rep:</span>
                            <span class="stat-value">${formatNumber(repGained.toFixed(1))}</span>
                        </div>
                        <div class="attack-stat">
                            <span class="stat-label">Cash:</span>
                            <span class="stat-value">£${formatNumber(cashMugged)}</span>
                        </div>
                        <div class="attack-stat">
                            <span class="stat-label">Mult:</span>
                            <span class="stat-value">${attack.fairFightMultiplier}x</span>
                        </div>
                        <div class="attack-stat">
                            <span class="stat-label">Type:</span>
                            <span class="stat-value">${attack.attackType}</span>
                        </div>
                    </div>
                    <span class="attack-time">${formatTimeAgo(attack.created)}</span>
                </div>
            </div>
        `;
    }

    // Save ALL cached names (not just from recent attacks)
    function saveAllCachedNames() {
        try {
            const allPlayerIds = new Set();
            const allCartelIds = new Set();

            // Collect ALL player IDs and cartel IDs we've ever seen
            recentAttacks.forEach(attack => {
                allPlayerIds.add(attack.initiatorId);
                allPlayerIds.add(attack.targetId);
                if (attack.initiatorCartelId) allCartelIds.add(attack.initiatorCartelId);
                if (attack.targetCartelId) allCartelIds.add(attack.targetCartelId);
            });

            // Also check any other cached attacks we might have
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    if (data.attacks) {
                        data.attacks.forEach(attack => {
                            allPlayerIds.add(attack.initiatorId);
                            allPlayerIds.add(attack.targetId);
                            if (attack.initiatorCartelId) allCartelIds.add(attack.initiatorCartelId);
                            if (attack.targetCartelId) allCartelIds.add(attack.targetCartelId);
                        });
                    }
                } catch (e) {
                    console.error('Error parsing cached data for name collection:', e);
                }
            }

            // Fetch any missing names
            const missingPlayerIds = Array.from(allPlayerIds).filter(id => !playerNames.has(id));
            const missingCartelIds = Array.from(allCartelIds).filter(id => !cartelNames.has(id));

            if (missingPlayerIds.length > 0 || missingCartelIds.length > 0) {
                console.log(`Found ${missingPlayerIds.length} missing player names and ${missingCartelIds.length} missing cartel names, fetching...`);

                // Fetch missing player names
                missingPlayerIds.forEach(playerId => {
                    fetchPlayerName(playerId).then(name => {
                        playerNames.set(playerId, name);
                        saveCacheOnNewName();
                    }).catch(error => {
                        console.error(`Error fetching missing player name for ID ${playerId}:`, error);
                        playerNames.set(playerId, `ID ${playerId}`);
                        saveCacheOnNewName();
                    });
                });

                // Fetch missing cartel names
                missingCartelIds.forEach(cartelId => {
                    fetchCartelName(cartelId).then(name => {
                        cartelNames.set(cartelId, name);
                        saveCacheOnNewName();
                    }).catch(error => {
                        console.error(`Error fetching missing cartel name for ID ${cartelId}:`, error);
                        cartelNames.set(cartelId, '');
                        saveCacheOnNewName();
                    });
                });
            }
        } catch (error) {
            console.error('Error in saveAllCachedNames:', error);
        }
    }

    // Save cache immediately when player names are loaded
    function saveCacheAfterNamesLoaded() {
        setTimeout(() => {
            saveCachedData();
            console.log('Cache saved after names loaded - Total players:', playerNames.size);
        }, 100);
    }

    // Save cache immediately when any new name is added
    function saveCacheOnNewName() {
        setTimeout(() => {
            saveCachedData();
        }, 50);
    }

    // Fetch player name from API
    function fetchPlayerName(playerId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: USER_API_BASE + playerId,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const playerName = data.name || `ID ${playerId}`;
                        resolve(playerName);
                    } catch (error) {
                        console.error(`Error parsing player data for ID ${playerId}:`, error);
                        resolve(`ID ${playerId}`);
                    }
                },
                onerror: function(error) {
                    console.error(`Error fetching player data for ID ${playerId}:`, error);
                    resolve(`ID ${playerId}`);
                },
                ontimeout: function() {
                    console.error(`Timeout fetching player data for ID ${playerId}`);
                    resolve(`ID ${playerId}`);
                }
            });
        });
    }

    // Fetch cartel name from API
    function fetchCartelName(cartelId) {
        return new Promise((resolve) => {
            if (!cartelId) {
                resolve('');
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://cartelempire.online/api/cartel?type=basic&id=${cartelId}&key=${API_KEY}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const cartelName = data.name || '';
                        resolve(cartelName);
                    } catch (error) {
                        console.error(`Error parsing cartel data for ID ${cartelId}:`, error);
                        resolve('');
                    }
                },
                onerror: function(error) {
                    console.error(`Error fetching cartel data for ID ${cartelId}:`, error);
                    resolve('');
                },
                ontimeout: function() {
                    console.error(`Timeout fetching cartel data for ID ${cartelId}`);
                    resolve('');
                }
            });
        });
    }

    // Create abbreviated cartel name
    function abbreviateCartelName(cartelName) {
        if (!cartelName) return '';

        // Split by spaces and take first letter of each word
        const words = cartelName.split(' ');
        if (words.length === 1) {
            // Single word: take first 3 letters
            return cartelName.substring(0, 3).toUpperCase();
        } else {
            // Multiple words: take first letter of each word
            return words.map(word => word.charAt(0)).join('').toUpperCase();
        }
    }

    // Discord posting functionality
    function postToDiscord(attacks) {
        if (!DISCORD_ENABLED || !DISCORD_WEBHOOK_URL) {
            return;
        }

        // Filter for new attacks that haven't been posted yet
        const newAttacks = attacks.filter(attack => !postedAttackIds.has(attack.id));

        if (newAttacks.length === 0) {
            return;
        }

        // Post each attack individually
        newAttacks.forEach(attack => {
            const attackerName = playerNames.get(attack.initiatorId) || `ID ${attack.initiatorId}`;
            const targetName = playerNames.get(attack.targetId) || `ID ${attack.targetId}`;
            const attackerCartelName = cartelNames.get(attack.initiatorCartelId) || '';
            const targetCartelName = cartelNames.get(attack.targetCartelId) || '';

            const attackerCartelAbbr = abbreviateCartelName(attackerCartelName);
            const targetCartelAbbr = abbreviateCartelName(targetCartelName);

            const attackerDisplay = attackerCartelAbbr ? `${attackerName} [${attackerCartelAbbr}]` : attackerName;
            const targetDisplay = targetCartelAbbr ? `${targetName} [${targetCartelAbbr}]` : targetName;

            const repGained = attack.repGained || 0;
            const cashMugged = attack.cashMugged || 0;

            // Create individual Discord embed for each attack with widget-like styling
            const embed = {
                title: `⚔️ ${attack.outcome.toUpperCase()} - ${attackerDisplay} vs ${targetDisplay}`,
                color: attack.outcome.toLowerCase() === 'win' ? 0x4ade80 : 0xf87171,
                timestamp: new Date().toISOString(),
                description: `**A:** ${attackerDisplay} | **T:** ${targetDisplay}`,
                fields: [
                    {
                        name: "💰 Reputation",
                        value: `${formatNumber(repGained.toFixed(1))}`,
                        inline: true
                    },
                    {
                        name: "💵 Cash Mugged",
                        value: `£${formatNumber(cashMugged)}`,
                        inline: true
                    },
                    {
                        name: "⚡ Multiplier",
                        value: `${attack.fairFightMultiplier}x`,
                        inline: true
                    },
                    {
                        name: "🎯 Attack Type",
                        value: attack.attackType,
                        inline: true
                    }
                ],
                footer: {
                    text: `Cartel Empire Attack Tracker`
                }
            };

            const payload = {
                embeds: [embed]
            };

            // Post with a small delay to avoid rate limiting
            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: DISCORD_WEBHOOK_URL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload),
                    onload: function(response) {
                        if (response.status === 204) {
                            console.log(`Successfully posted attack ${attack.id} to Discord`);
                            // Mark as posted
                            postedAttackIds.add(attack.id);
                            saveDiscordSettings();

                            // Show notification
                            showNotification(
                                `⚔️ ${attack.outcome.toUpperCase()} - ${attackerDisplay} vs ${targetDisplay}`,
                                `Rep: ${formatNumber(repGained.toFixed(1))} | Cash: £${formatNumber(cashMugged)} | Mult: ${attack.fairFightMultiplier}x`
                            );
                        } else {
                            console.error('Discord webhook error:', response.status, response.responseText);
                        }
                    },
                    onerror: function(error) {
                        console.error('Error posting to Discord:', error);
                    }
                });
            }, newAttacks.indexOf(attack) * 1000); // 1 second delay between posts
        });
    }

    // Show browser notification
    function showNotification(title, body, icon = null) {
        if (!DISCORD_SHOW_NOTIFICATION || !('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body, icon });
                }
            });
        }
    }

    // Fetch and cache player names for recent attacks
    async function fetchPlayerNames(attacks) {
        try {
            const uniquePlayerIds = new Set();
            const uniqueCartelIds = new Set();

            // Collect all unique player IDs and cartel IDs from recent attacks
            attacks.slice(0, MAX_ATTACKS_DISPLAY).forEach(attack => {
                uniquePlayerIds.add(attack.initiatorId);
                uniquePlayerIds.add(attack.targetId);
                if (attack.initiatorCartelId) uniqueCartelIds.add(attack.initiatorCartelId);
                if (attack.targetCartelId) uniqueCartelIds.add(attack.targetCartelId);
            });

            // Fetch names for players not already cached
            const playerPromises = [];
            for (const playerId of uniquePlayerIds) {
                if (!playerNames.has(playerId)) {
                    playerPromises.push(
                        fetchPlayerName(playerId).then(name => {
                            playerNames.set(playerId, name);
                            // Save cache immediately when each name is loaded
                            saveCacheOnNewName();
                        }).catch(error => {
                            console.error(`Error fetching player name for ID ${playerId}:`, error);
                            playerNames.set(playerId, `ID ${playerId}`);
                            saveCacheOnNewName();
                        })
                    );
                }
            }

            // Fetch names for cartels not already cached
            const cartelPromises = [];
            for (const cartelId of uniqueCartelIds) {
                if (!cartelNames.has(cartelId)) {
                    cartelPromises.push(
                        fetchCartelName(cartelId).then(name => {
                            cartelNames.set(cartelId, name);
                            saveCacheOnNewName();
                        }).catch(error => {
                            console.error(`Error fetching cartel name for ID ${cartelId}:`, error);
                            cartelNames.set(cartelId, '');
                            saveCacheOnNewName();
                        })
                    );
                }
            }

            // Wait for all fetches to complete
            const allPromises = [...playerPromises, ...cartelPromises];
            if (allPromises.length > 0) {
                await Promise.all(allPromises);
                console.log(`Fetched ${playerPromises.length} new player names and ${cartelPromises.length} new cartel names`);

                // Save cache after all names are loaded
                saveCacheAfterNamesLoaded();
            }
        } catch (error) {
            console.error('Error in fetchPlayerNames:', error);
        }
    }

    // Fetch attack data from API
    async function fetchAttackData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL,
            onload: async function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    attackData = data.attacks || [];

                    // Sort by creation time (newest first)
                    attackData.sort((a, b) => b.created - a.created);

                    // Fetch player names for recent attacks
                    await fetchPlayerNames(attackData);

                    // Update display
                    updateAttackDisplay();
                    lastUpdate = Date.now();
                } catch (error) {
                    console.error('Error parsing attack data:', error);
                    showError('Failed to parse attack data');
                }
            },
            onerror: function(error) {
                console.error('Error fetching attack data:', error);
                showError('Failed to fetch attack data');
            }
        });
    }

    // Update the attack display
    function updateAttackDisplay() {
        const content = document.getElementById('attack-tracker-content');

        if (!attackData || attackData.length === 0) {
            content.innerHTML = '<div class="loading">No attacks found</div>';
            return;
        }

        // Take only the most recent attacks
        const recentAttacks = attackData.slice(0, MAX_ATTACKS_DISPLAY);

        // Track new attack IDs
        const newAttackIds = new Set();
        recentAttacks.forEach(attack => {
            if (!seenAttackIds.has(attack.id)) {
                newAttackIds.add(attack.id);
                seenAttackIds.add(attack.id);
            }
        });

        // Create HTML for attacks
        const attacksHTML = recentAttacks.map(createAttackEntry).join('');
        content.innerHTML = attacksHTML;

        // Remove the new-attack class after animation completes
        setTimeout(() => {
            const newAttackElements = content.querySelectorAll('.new-attack');
            newAttackElements.forEach(element => {
                element.classList.remove('new-attack');
            });
        }, 2000);

        // Post to Discord if enabled
        postToDiscord(attackData);

        // Save cache after display is updated
        saveCachedData();
    }

    // Show error message
    function showError(message) {
        const content = document.getElementById('attack-tracker-content');
        content.innerHTML = `<div class="error">${message}</div>`;
    }

    // Initialize the attack tracker
    function initialize() {
        // Clear old cache first
        clearOldCache();

        // Load Discord settings
        loadDiscordSettings();

        // Try to load cached data
        const cacheLoaded = loadCachedData();

        // Create the widget
        const widget = createAttackTracker();

        // If cache was loaded, update display immediately
        if (cacheLoaded) {
            updateAttackDisplay();
        } else {
            // Load initial data if no cache
            fetchAttackData();
        }

        // Save all cached names to ensure we have all names
        setTimeout(() => {
            saveAllCachedNames();
        }, 1000);

        // Set up minute-based updates
        function checkForMinuteUpdate() {
            if (shouldUpdateOnMinute()) {
                fetchAttackData();
            }
        }

        // Check every 10 seconds for minute-based updates
        setInterval(checkForMinuteUpdate, 10000);

        // Save cache periodically (every 30 seconds)
        setInterval(() => {
            if (attackData.length > 0) {
                saveCachedData();
            }
        }, 30000);

        // Save all cached names periodically (every 2 minutes)
        setInterval(() => {
            saveAllCachedNames();
        }, 120000);

        // Add update indicator
        setInterval(() => {
            const timeSinceUpdate = Date.now() - lastUpdate;
            if (timeSinceUpdate > 120000) { // 2 minutes
                document.getElementById('attack-tracker-title').textContent = '⚔️ Attack Tracker (Updating...)';
            } else {
                document.getElementById('attack-tracker-title').textContent = '⚔️ Attack Tracker';
            }
        }, 1000);

        // Restore size if available
        restoreWidgetSize(widget);
        setupResizePersistence(widget);

        // Save cache before page unload/navigation
        window.addEventListener('beforeunload', saveCachedData);
        window.addEventListener('pagehide', saveCachedData);
        window.addEventListener('unload', saveCachedData);

        // Save Discord settings before page unload
        window.addEventListener('beforeunload', saveDiscordSettings);
        window.addEventListener('pagehide', saveDiscordSettings);
        window.addEventListener('unload', saveDiscordSettings);

        // Save cache when user navigates away (for single-page apps)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                saveCachedData();
                saveDiscordSettings();
            }
        });
    }

    // Start the script when the page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Restore size if available
    function restoreWidgetSize(widget) {
        const state = loadWidgetState();
        if (state.width) widget.style.width = state.width + 'px';
        if (state.height) widget.style.height = state.height + 'px';
    }

    // Listen for resize events and save size
    function setupResizePersistence(widget) {
        let resizeTimeout;
        widget.addEventListener('mouseup', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const rect = widget.getBoundingClientRect();
                saveWidgetState({
                    ...loadWidgetState(),
                    width: rect.width,
                    height: rect.height,
                });
            }, 200);
        });
    }

    // Get next minute timestamp for synchronized updates
    function getNextMinuteTimestamp() {
        const now = new Date();
        const nextMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
        return nextMinute.getTime();
    }

    // Check if it's time for a minute-based update
    function shouldUpdateOnMinute() {
        const now = Date.now();
        const currentMinute = Math.floor(now / 60000) * 60000;

        if (currentMinute > lastMinuteUpdate) {
            lastMinuteUpdate = currentMinute;
            return true;
        }
        return false;
    }

})();