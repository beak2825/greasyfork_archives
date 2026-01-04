// ==UserScript==
// @name         Torn Faction Member Sidebar
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @version      1.6.4
// @description  Shows faction members status in an adjustable panel with caching
// @author       Davrone (with Gemini edits)
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/537617/Torn%20Faction%20Member%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/537617/Torn%20Faction%20Member%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Faction Sidebar] Script starting...');

    // Configuration
    const CONFIG = {
        refreshInterval: 5000, // 5 seconds
        apiUrl: 'https://api.torn.com/faction/?selections=basic&key=',
        panelWidth: '300px',
        onlineSound: 'https://files.catbox.moe/a7xnu4.mp3',
        awaySound: 'https://files.catbox.moe/skq6on.mp3',
        offlineSound: 'https://files.catbox.moe/n3smae.mp3'
    };

    // Check if we're in a popup window
    const isPopupWindow = window.name === 'faction-sidebar-popup' || window.location.search.includes('faction-popup=true');

    // Audio state management
    let audioElements = {
        online: null,
        away: null,
        offline: null
    };
    let audioInitialized = false;

    // Audio settings
    let audioSettings = {
        enabled: true,
        onlineEnabled: true,
        awayEnabled: true,
        offlineEnabled: true,
        onlineVolume: 0.3,
        awayVolume: 0.3,
        offlineVolume: 0.3
    };

    // State management
    let isMinimized = false;
    let apiKey = '';
    let refreshTimer = null;
    let factionData = null;
    let previousMemberStatus = new Map();
    let panelX = 50;
    let panelY = 100;
    let panelHeight = 500;
    let panelWidth = 300;
    let useShortFormat = false;
    let popupWindow = null;
    let popupCheckInterval = null;

    // Try to load saved values
    try {
        isMinimized = GM_getValue('sidebarMinimized', false);
        apiKey = GM_getValue('tornApiKey', '');
        panelX = GM_getValue('panelX', 50);
        panelY = GM_getValue('panelY', 100);
        panelHeight = GM_getValue('panelHeight', 500);
        panelWidth = GM_getValue('panelWidth', 300);
        useShortFormat = GM_getValue('useShortFormat', false);

        // Validate position values to prevent off-screen panel
        if (panelX < 0 || panelX > window.innerWidth - 100) {
            console.log('[Faction Sidebar] Invalid panelX, resetting to 50');
            panelX = 50;
            GM_setValue('panelX', 50);
        }
        if (panelY < 0 || panelY > window.innerHeight - 100) {
            console.log('[Faction Sidebar] Invalid panelY, resetting to 100');
            panelY = 100;
            GM_setValue('panelY', 100);
        }

        // Load audio settings
        audioSettings.enabled = GM_getValue('audioEnabled', true);
        audioSettings.onlineEnabled = GM_getValue('onlineAudioEnabled', true);
        audioSettings.awayEnabled = GM_getValue('awayAudioEnabled', true);
        audioSettings.offlineEnabled = GM_getValue('offlineAudioEnabled', true);
        audioSettings.onlineVolume = GM_getValue('onlineVolume', 0.3);
        audioSettings.awayVolume = GM_getValue('awayVolume', 0.3);
        audioSettings.offlineVolume = GM_getValue('offlineVolume', 0.3);
    } catch(e) {
        console.log('[Faction Sidebar] Could not load saved values:', e);
    }

    // If we're in a popup window, set up the popup environment
    if (isPopupWindow) {
        setupPopupWindow();
        return;
    }

    // Check if popup is already open before creating main panel
    function isPopupOpen() {
        try {
            const popupTimestamp = GM_getValue('popupOpenTimestamp', 0);
            const popupWindowId = GM_getValue('popupWindowId', '');

            // Consider popup "open" if timestamp is recent (within last 5 seconds of a refresh)
            const timeSincePopup = Date.now() - popupTimestamp;
            return timeSincePopup < 5000 && popupWindowId;
        } catch(e) {
            return false;
        }
    }

    // Wait for page to load (main window only)
    if (document.readyState === 'loading') {
        window.addEventListener('load', function() {
            console.log('[Faction Sidebar] Page loaded, checking for existing popup...');

            // Check if popup is already open
            if (isPopupOpen()) {
                console.log('[Faction Sidebar] Popup detected as open, not creating main panel');
                startPopupMonitoring();
                return;
            }

            console.log('[Faction Sidebar] No popup detected, initializing main panel...');
            init();
        });
    } else {
        // Document already loaded
        console.log('[Faction Sidebar] Page already loaded, checking for existing popup...');
        if (isPopupOpen()) {
            console.log('[Faction Sidebar] Popup detected as open, not creating main panel');
            startPopupMonitoring();
        } else {
            console.log('[Faction Sidebar] No popup detected, initializing main panel...');
            init();
        }
    }

    function setupPopupWindow() {
        console.log('[Faction Sidebar] Setting up popup window');

        // Mark this popup as open with a timestamp
        GM_setValue('popupOpenTimestamp', Date.now());
        GM_setValue('popupWindowId', 'popup-' + Date.now());

        // Set up periodic heartbeat to indicate popup is still alive
        setInterval(() => {
            GM_setValue('popupOpenTimestamp', Date.now());
        }, 2000);

        // Clean up when popup closes
        window.addEventListener('beforeunload', () => {
            GM_setValue('popupOpenTimestamp', 0);
            GM_setValue('popupWindowId', '');
        });

        // Set up the popup window HTML
        document.title = 'Faction Members';
        document.body.innerHTML = '';

        // Add styles for popup
        const popupStyles = `
            body {
                margin: 0;
                padding: 0;
                background: #1a1a1a;
                font-family: Arial, sans-serif;
                color: #e0e0e0;
                overflow: hidden;
            }

            /* FIX: Hide UI elements from other scripts (e.g., War Alerter) that might inject into this popup window */
            body > div:not(.popup-container) {
                display: none !important;
            }

            .popup-container {
                height: 100vh;
                display: flex;
                flex-direction: column;
            }

            .popup-header {
                background: #2d2d2d;
                padding: 10px;
                border-bottom: 1px solid #444;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            .popup-title {
                font-weight: bold;
                font-size: 14px;
            }

            .popup-controls {
                display: flex;
                gap: 5px;
            }

            .popup-controls button {
                background: #444;
                border: 1px solid #555;
                color: #ddd;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .popup-controls button:hover {
                background: #555;
                border-color: #666;
            }

            .popup-body {
                flex: 1;
                padding: 10px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .faction-search {
                margin-bottom: 10px;
                flex-shrink: 0;
            }

            .faction-search input {
                width: 100%;
                padding: 6px;
                background: #2d2d2d;
                border: 1px solid #444;
                color: #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }

            .faction-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                font-size: 12px;
                flex-shrink: 0;
            }

            .faction-filters label {
                cursor: pointer;
            }

            .member-list {
                flex: 1;
                overflow-y: auto;
                min-height: 0;
                padding-right: 5px;
            }

            .member-list::-webkit-scrollbar {
                width: 8px;
            }

            .member-list::-webkit-scrollbar-track {
                background: #2d2d2d;
                border-radius: 4px;
            }

            .member-list::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            .member-list::-webkit-scrollbar-thumb:hover {
                background: #666;
            }

            .member-item {
                display: flex;
                align-items: center;
                padding: 8px;
                margin-bottom: 4px;
                background: #2d2d2d;
                border-radius: 4px;
                text-decoration: none;
                color: #ddd;
            }

            .member-item:hover {
                background: #3d3d3d;
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;
            }

            .status-online { background: #5fbf5f; }
            .status-idle { background: #f0ad4e; }
            .status-offline { background: #d9534f; }

            .member-info {
                flex: 1;
            }

            .member-name {
                font-weight: bold;
            }

            .member-details {
                font-size: 11px;
                color: #999;
            }

            .member-status {
                font-size: 11px;
                color: #4a9eff;
                margin-top: 2px;
            }

            .status-hospital { color: #ff6b6b; }
            .status-traveling { color: #ffd93d; }
            .status-abroad { color: #6bcf7f; }
            .status-federal { color: #ff8787; }
            .status-jail { color: #ffa500; }

            .loading {
                text-align: center;
                padding: 20px;
                color: #999;
            }

            .error {
                text-align: center;
                padding: 20px;
                color: #d9534f;
            }

            .audio-status {
                position: absolute;
                top: 10px;
                display: none;
                right: 10px;
                padding: 4px 8px;
                background: #4a9eff;
                border-radius: 4px;
                font-size: 10px;
                z-index: 1000;
            }

            .audio-ready {
                background: #5fbf5f;
            }

            .audio-disabled {
                background: #d9534f;
            }

            .settings-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #444;
            }

            .settings-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .settings-section h4 {
                margin: 0 0 10px 0;
                color: #4a9eff;
                font-size: 13px;
            }

            .audio-control {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px;
                background: #2d2d2d;
                border-radius: 4px;
            }

            .audio-control label {
                display: flex;
                align-items: center;
                font-size: 12px;
                cursor: pointer;
            }

            .audio-control input[type="checkbox"] {
                margin-right: 8px;
            }

            .volume-control {
                display: flex;
                align-items: center;
                margin-left: 10px;
            }

            .volume-control input[type="range"] {
                width: 60px;
                margin: 0 5px;
                accent-color: #4a9eff;
            }

            .volume-control span {
                font-size: 10px;
                color: #999;
                min-width: 25px;
                text-align: right;
            }

            .audio-control.disabled {
                opacity: 0.5;
            }

            .master-audio-toggle {
                margin-bottom: 15px;
                padding: 8px;
                background: #2d2d2d;
                border-radius: 4px;
                border: 1px solid #444;
            }

            .master-audio-toggle label {
                display: flex;
                align-items: center;
                font-weight: bold;
                cursor: pointer;
            }

            .master-audio-toggle input[type="checkbox"] {
                margin-right: 8px;
                transform: scale(1.2);
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.textContent = popupStyles;
        document.head.appendChild(styleEl);

        // Create popup container
        const container = document.createElement('div');
        container.className = 'popup-container';
        container.innerHTML = `
            <div class="popup-header">
                <span class="popup-title">👥 Faction Members</span>
                <div class="popup-controls">
                    <button id="refresh-btn" title="Refresh">↻</button>
                    <button id="format-btn" title="Toggle Format">${useShortFormat ? 'S' : 'L'}</button>
                    <button id="audio-test-btn" title="Test Audio">🔊</button>
                    <button id="settings-btn" title="Settings">⚙</button>
                    <button id="close-btn" title="Close">✕</button>
                </div>
            </div>
            <div class="popup-body">
                <div class="audio-status" id="audio-status">Audio Loading...</div>
                <div class="faction-main-view" id="faction-main-view">
                    <div class="faction-search">
                        <input type="text" id="member-search" placeholder="Search members...">
                    </div>
                    <div class="faction-filters">
                        <label><input type="checkbox" id="filter-online" checked> Online</label>
                        <label><input type="checkbox" id="filter-idle" checked> Idle</label>
                        <label><input type="checkbox" id="filter-offline" checked> Offline</label>
                    </div>
                    <div id="member-list" class="member-list">
                        <div class="loading">Loading...</div>
                    </div>
                </div>
                <div class="faction-settings-view" id="faction-settings-view" style="display:none">
                    <h3>Settings</h3>

                    <div class="settings-section">
                        <h4>🔑 API Configuration</h4>
                        <label>API Key:</label>
                        <input type="text" id="api-key-input" placeholder="Enter your Torn API key">
                        <button id="save-api-key">Save</button>
                        <p class="hint">Get your API key from Torn Settings → API</p>
                    </div>

                    <div class="settings-section">
                        <h4>🔊 Audio Settings</h4>
                        <div class="master-audio-toggle">
                            <label>
                                <input type="checkbox" id="master-audio-toggle" ${audioSettings.enabled ? 'checked' : ''}>
                                Enable All Audio Notifications
                            </label>
                        </div>

                        <div id="audio-controls" ${!audioSettings.enabled ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                            <div class="audio-control ${!audioSettings.onlineEnabled ? 'disabled' : ''}">
                                <label>
                                    <input type="checkbox" id="online-audio-toggle" ${audioSettings.onlineEnabled ? 'checked' : ''}>
                                    🟢 Online Sound
                                </label>
                                <div class="volume-control">
                                    <input type="range" id="online-volume" min="0" max="1" step="0.1" value="${audioSettings.onlineVolume}">
                                    <span id="online-volume-display">${Math.round(audioSettings.onlineVolume * 100)}%</span>
                                </div>
                            </div>

                            <div class="audio-control ${!audioSettings.awayEnabled ? 'disabled' : ''}">
                                <label>
                                    <input type="checkbox" id="away-audio-toggle" ${audioSettings.awayEnabled ? 'checked' : ''}>
                                    🟡 Away/Idle Sound
                                </label>
                                <div class="volume-control">
                                    <input type="range" id="away-volume" min="0" max="1" step="0.1" value="${audioSettings.awayVolume}">
                                    <span id="away-volume-display">${Math.round(audioSettings.awayVolume * 100)}%</span>
                                </div>
                            </div>

                            <div class="audio-control ${!audioSettings.offlineEnabled ? 'disabled' : ''}">
                                <label>
                                    <input type="checkbox" id="offline-audio-toggle" ${audioSettings.offlineEnabled ? 'checked' : ''}>
                                    🔴 Offline Sound
                                </label>
                                <div class="volume-control">
                                    <input type="range" id="offline-volume" min="0" max="1" step="0.1" value="${audioSettings.offlineVolume}">
                                    <span id="offline-volume-display">${Math.round(audioSettings.offlineVolume * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        <button id="test-all-audio" style="width: 100%; margin-top: 10px; padding: 6px; background: #5fbf5f; border: none; color: white; border-radius: 4px; cursor: pointer;">Test All Sounds</button>
                    </div>

                    <div class="settings-section">
                        <p class="hint">💡 Tip: Use the Pop Out button (🗗) to open in a separate window. This keeps audio working even when you refresh or navigate to other pages!</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Initialize audio immediately in popup
        initializeAudio();

        // Set up popup event listeners (using document as the container)
        setupPopupEventListeners(document);

        // Start fetching data (using document as the container)
        if (apiKey) {
            fetchFactionData(document);
            startAutoRefresh(document);
        } else {
            showError('No API key found! Please set it up in the settings.', document);
        }
    }

    function setupPopupEventListeners(containerEl) {
        containerEl.querySelector('#refresh-btn').addEventListener('click', () => fetchFactionData(containerEl));
        containerEl.querySelector('#format-btn').addEventListener('click', () => toggleFormat(containerEl));
        containerEl.querySelector('#audio-test-btn').addEventListener('click', testAudio);
        containerEl.querySelector('#close-btn').addEventListener('click', () => window.close());
        containerEl.querySelector('#member-search').addEventListener('input', () => filterMembers(containerEl));
        containerEl.querySelector('#save-api-key').addEventListener('click', () => saveApiKey(containerEl));

        // Filter checkboxes
        containerEl.querySelectorAll('.faction-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => filterMembers(containerEl));
        });


        // Audio control listeners
        setupAudioEventListeners(containerEl);

        // Update audio status display
        updateAudioStatus(containerEl);
    }

    function setupAudioEventListeners(containerEl) {
        // Master audio toggle
        const masterToggle = containerEl.querySelector('#master-audio-toggle');
        if (masterToggle) {
            masterToggle.addEventListener('change', (e) => {
                audioSettings.enabled = e.target.checked;
                GM_setValue('audioEnabled', audioSettings.enabled);

                const audioControls = containerEl.querySelector('#audio-controls');
                if (audioControls) {
                    if (audioSettings.enabled) {
                        audioControls.style.opacity = '1';
                        audioControls.style.pointerEvents = 'auto';
                    } else {
                        audioControls.style.opacity = '0.5';
                        audioControls.style.pointerEvents = 'none';
                    }
                }
                updateAudioStatus(containerEl);
            });
        }

        // Individual audio toggles
        const audioTypes = ['online', 'away', 'offline'];
        audioTypes.forEach(type => {
            const toggle = containerEl.querySelector(`#${type}-audio-toggle`);
            const volumeSlider = containerEl.querySelector(`#${type}-volume`);
            const volumeDisplay = containerEl.querySelector(`#${type}-volume-display`);
            const audioControl = toggle?.closest('.audio-control');

            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    audioSettings[`${type}Enabled`] = e.target.checked;
                    GM_setValue(`${type}AudioEnabled`, audioSettings[`${type}Enabled`]);

                    if (audioControl) {
                        if (e.target.checked) {
                            audioControl.classList.remove('disabled');
                        } else {
                            audioControl.classList.add('disabled');
                        }
                    }
                    updateAudioStatus(containerEl);
                });
            }

            if (volumeSlider && volumeDisplay) {
                volumeSlider.addEventListener('input', (e) => {
                    const volume = parseFloat(e.target.value);
                    audioSettings[`${type}Volume`] = volume;
                    GM_setValue(`${type}Volume`, volume);

                    volumeDisplay.textContent = Math.round(volume * 100) + '%';

                    // Update the actual audio element volume if it exists
                    if (audioElements[type]) {
                        audioElements[type].volume = volume;
                    }
                });
            }
        });

        // Test all audio button
        const testAllButton = containerEl.querySelector('#test-all-audio');
        if (testAllButton) {
            testAllButton.addEventListener('click', testAllAudio);
        }
    }

    function updateAudioStatus(containerEl = document) {
        const statusEl = containerEl.querySelector('#audio-status');
        if (statusEl) {
            if (!audioSettings.enabled) {
                statusEl.textContent = '🔇 Audio Disabled';
                statusEl.className = 'audio-status audio-disabled';
            } else if (audioInitialized) {
                statusEl.textContent = '';
                statusEl.className = 'audio-status audio-ready';
            } else {
                statusEl.textContent = '🔇 Audio Loading...';
                statusEl.className = 'audio-status';
            }
        }
    }

    function testAudio() {
        console.log('[Faction Sidebar] Testing audio...');

        if (!audioSettings.enabled) {
            alert('Audio is disabled. Enable it in settings first.');
            return;
        }

        // Check for audio conflicts first
        checkAudioConflicts();

        if (!audioInitialized) {
            initializeAudio();
        }

        // Test only enabled sounds with delays between them
        let delay = 100;

        if (audioSettings.onlineEnabled) {
            setTimeout(() => {
                console.log('[Faction Sidebar] Testing online sound...');
                playSound('online');
            }, delay);
            delay += 1500;
        }

        if (audioSettings.awayEnabled) {
            setTimeout(() => {
                console.log('[Faction Sidebar] Testing away sound...');
                playSound('away');
            }, delay);
            delay += 1500;
        }

        if (audioSettings.offlineEnabled) {
            setTimeout(() => {
                console.log('[Faction Sidebar] Testing offline sound...');
                playSound('offline');
            }, delay);
        }
    }

    function testAllAudio() {
        testAudio();
    }

    function checkAudioConflicts() {
        // Check if other audio is currently playing
        const allAudio = document.querySelectorAll('audio, video');
        let conflictDetected = false;

        allAudio.forEach(element => {
            if (!element.paused && element !== audioElements.online && element !== audioElements.away && element !== audioElements.offline) {
                console.log('[Faction Sidebar] Audio conflict detected with element:', element);
                conflictDetected = true;
            }
        });

        // Check for Torn's own audio elements
        const tornAudio = document.querySelectorAll('[id*="audio"], [class*="audio"], [src*=".mp3"], [src*=".wav"], [src*=".ogg"]');
        if (tornAudio.length > 3) { // More than just our 3 audio elements
            console.log('[Faction Sidebar] Potential Torn audio conflict detected');
            conflictDetected = true;
        }

        if (conflictDetected) {
            console.log('[Faction Sidebar] Audio conflicts detected - using higher volume and retry logic');
            return true;
        }

        return false;
    }

    function startPopupMonitoring() {
        console.log('[Faction Sidebar] Starting popup monitoring...');

        // Check periodically if popup is still alive
        popupCheckInterval = setInterval(() => {
            if (!isPopupOpen()) {
                console.log('[Faction Sidebar] Popup no longer detected, creating main panel');
                clearInterval(popupCheckInterval);
                init();
            }
        }, 3000);
    }

    function openPopupWindow() {
        // Check if popup is already open
        if (isPopupOpen()) {
            console.log('[Faction Sidebar] Popup already detected as open');
            return;
        }

        const popupUrl = window.location.origin + window.location.pathname + '?faction-popup=true';

        popupWindow = window.open(
            popupUrl,
            'faction-sidebar-popup',
            `width=350,height=600,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no`
        );

        if (popupWindow) {
            console.log('[Faction Sidebar] Popup window opened');

            // Hide the main panel immediately
            const mainPanel = document.getElementById('faction-panel');
            if (mainPanel) {
                mainPanel.style.display = 'none';
            }

            // Set popup as open
            GM_setValue('popupOpenTimestamp', Date.now());
            GM_setValue('popupWindowId', 'popup-' + Date.now());

            // Start monitoring the popup
            const checkClosed = setInterval(() => {
                try {
                    if (popupWindow.closed) {
                        console.log('[Faction Sidebar] Popup window closed');
                        clearInterval(checkClosed);

                        // Clear popup status
                        GM_setValue('popupOpenTimestamp', 0);
                        GM_setValue('popupWindowId', '');

                        // Show the main panel again
                        if (mainPanel) {
                            mainPanel.style.display = 'flex';
                        }

                        popupWindow = null;
                    }
                } catch(e) {
                    // Popup window might not be accessible due to cross-origin restrictions
                    // Fall back to checking our stored values
                    if (!isPopupOpen()) {
                        clearInterval(checkClosed);
                        console.log('[Faction Sidebar] Popup detected as closed via storage check');

                        if (mainPanel) {
                            mainPanel.style.display = 'flex';
                        }

                        popupWindow = null;
                    }
                }
            }, 1000);
        } else {
            alert('Popup blocked! Please allow popups for this site to use the pop-out feature.');
        }
    }

    function initializeAudio() {
        if (audioInitialized) return;

        console.log('[Faction Sidebar] Initializing audio elements...');

        try {
            // Create persistent audio elements for all three sounds
            audioElements.online = new Audio(CONFIG.onlineSound);
            audioElements.online.volume = audioSettings.onlineVolume;
            audioElements.online.preload = 'auto';

            audioElements.away = new Audio(CONFIG.awaySound);
            audioElements.away.volume = audioSettings.awayVolume;
            audioElements.away.preload = 'auto';

            audioElements.offline = new Audio(CONFIG.offlineSound);
            audioElements.offline.volume = audioSettings.offlineVolume;
            audioElements.offline.preload = 'auto';

            // Add event listeners for all audio elements
            ['online', 'away', 'offline'].forEach(type => {
                audioElements[type].addEventListener('canplaythrough', () => {
                    console.log(`[Faction Sidebar] ${type} audio ready`);
                    updateAudioStatus();
                });

                audioElements[type].addEventListener('error', (e) => {
                    console.error(`[Faction Sidebar] ${type} audio error:`, e);
                });

                audioElements[type].addEventListener('pause', () => {
                    console.log(`[Faction Sidebar] ${type} audio was paused (possible conflict)`);
                });
            });

            audioInitialized = true;
            console.log('[Faction Sidebar] Audio elements initialized');
            updateAudioStatus();

            // Try to preload
            Promise.all([
                audioElements.online.load(),
                audioElements.away.load(),
                audioElements.offline.load()
            ]).then(() => {
                console.log('[Faction Sidebar] Audio files preloaded successfully');
                updateAudioStatus();
            }).catch(err => {
                console.log('[Faction Sidebar] Audio preload failed:', err);
            });

        } catch (error) {
            console.error('[Faction Sidebar] Failed to initialize audio:', error);
        }
    }

    function playSound(type) {
        console.log('[Faction Sidebar] Attempting to play sound:', type);

        // Check if audio is globally disabled
        if (!audioSettings.enabled) {
            console.log('[Faction Sidebar] Audio globally disabled, skipping sound');
            return;
        }

        // Check if this specific sound type is disabled
        if (!audioSettings[`${type}Enabled`]) {
            console.log(`[Faction Sidebar] ${type} audio disabled, skipping sound`);
            return;
        }

        if (!audioInitialized) {
            console.log('[Faction Sidebar] Audio not initialized yet, skipping sound');
            return;
        }

        const audioElement = audioElements[type];
        if (!audioElement) {
            console.error('[Faction Sidebar] Audio element not found for type:', type);
            return;
        }

        // Update volume before playing
        audioElement.volume = audioSettings[`${type}Volume`];

        // Check if audio context is suspended (common browser protection)
        if (typeof AudioContext !== 'undefined') {
            try {
                // Create a temporary audio context to check state
                const tempContext = new (window.AudioContext || window.webkitAudioContext)();
                if (tempContext.state === 'suspended') {
                    console.log('[Faction Sidebar] Audio context suspended, attempting to resume');
                    tempContext.resume().then(() => {
                        console.log('[Faction Sidebar] Audio context resumed');
                        attemptPlaySound(audioElement, type);
                    }).catch(err => {
                        console.error('[Faction Sidebar] Failed to resume audio context:', err);
                        fallbackNotification(type);
                    });
                    tempContext.close();
                    return;
                }
                tempContext.close();
            } catch (e) {
                console.log('[Faction Sidebar] AudioContext check failed:', e);
            }
        }

        attemptPlaySound(audioElement, type);
    }

    function attemptPlaySound(audioElement, type) {
        // Stop any currently playing audio to avoid conflicts
        audioElement.pause();
        audioElement.currentTime = 0;

        // Force volume in case it was changed by other audio
        audioElement.volume = audioSettings[`${type}Volume`];

        // Try to play with multiple fallback strategies
        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('[Faction Sidebar] Sound played successfully:', type);
            }).catch(error => {
                console.error('[Faction Sidebar] Error playing sound:', error);

                // Try fallback strategies
                setTimeout(() => {
                    console.log('[Faction Sidebar] Retrying sound after delay:', type);
                    retryPlaySound(audioElement, type);
                }, 100);
            });
        } else {
            // Older browser fallback
            console.log('[Faction Sidebar] Using legacy audio play method');
            try {
                audioElement.play();
                console.log('[Faction Sidebar] Legacy sound played:', type);
            } catch (e) {
                console.error('[Faction Sidebar] Legacy audio play failed:', e);
                fallbackNotification(type);
            }
        }
    }

    function retryPlaySound(audioElement, type, retryCount = 0) {
        if (retryCount >= 3) {
            console.log('[Faction Sidebar] Max retries reached, using fallback notification');
            fallbackNotification(type);
            return;
        }

        // Try creating a new audio element as fallback
        try {
            const soundUrl = type === 'online' ? CONFIG.onlineSound :
                  type === 'away' ? CONFIG.awaySound :
                  CONFIG.offlineSound;
            const fallbackAudio = new Audio(soundUrl);
            fallbackAudio.volume = audioSettings[`${type}Volume`];

            const playPromise = fallbackAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('[Faction Sidebar] Fallback sound played successfully:', type);
                }).catch(() => {
                    setTimeout(() => retryPlaySound(audioElement, type, retryCount + 1), 200);
                });
            }
        } catch (e) {
            setTimeout(() => retryPlaySound(audioElement, type, retryCount + 1), 200);
        }
    }

    function fallbackNotification(type) {
        // Visual fallback when audio completely fails
        if (isPopupWindow || document.getElementById('faction-panel')) {
            const notification = document.createElement('div');
            const notificationText = type === 'online' ? '👥 Member Online!' :
                  type === 'away' ? '😴 Member Away!' :
                  '💤 Member Offline';
            const notificationColor = type === 'online' ? '#5fbf5f' :
                  type === 'away' ? '#f0ad4e' :
                  '#d9534f';

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${notificationColor};
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-weight: bold;
                z-index: 10001;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            `;
            notification.textContent = notificationText;

            document.body.appendChild(notification);

            // Remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);

            console.log('[Faction Sidebar] Used visual fallback notification for:', type);
        }
    }

    function setupGlobalInteractionListeners() {
        // Initialize audio on any user interaction with the entire page
        const initOnInteraction = () => {
            initializeAudio();
            // Remove listeners after first interaction
            document.removeEventListener('click', initOnInteraction);
            document.removeEventListener('keydown', initOnInteraction);
            document.removeEventListener('mousedown', initOnInteraction);
            document.removeEventListener('touchstart', initOnInteraction);
        };

        document.addEventListener('click', initOnInteraction);
        document.addEventListener('keydown', initOnInteraction);
        document.addEventListener('mousedown', initOnInteraction);
        document.addEventListener('touchstart', initOnInteraction);

        console.log('[Faction Sidebar] Global interaction listeners set up for audio initialization');
    }

    function init() {
        const panel = createPanel();
        if (!panel) {
            console.error("[Faction Sidebar] Panel creation failed. Aborting init.");
            return;
        }
        addStyles();
        setupEventListeners(panel);
        setupGlobalInteractionListeners();

        if (apiKey) {
            fetchFactionData(panel);
            startAutoRefresh(panel);
        } else {
            showApiKeyPrompt(panel);
        }
    }

    function createPanel() {
        // Don't create if already exists
        if (document.getElementById('faction-panel')) return document.getElementById('faction-panel');

        const panel = document.createElement('div');
        panel.id = 'faction-panel';
        panel.className = isMinimized ? 'minimized' : '';
        panel.style.left = panelX + 'px';
        panel.style.top = panelY + 'px';
        panel.style.height = panelHeight + 'px';
        panel.style.width = panelWidth + 'px';

        panel.innerHTML = `
            <div class="faction-header" id="faction-header">
                <span class="faction-title">👥 Faction Members</span>
                <div class="faction-controls">
                    <button id="refresh-btn" title="Refresh">↻</button>
                    <button id="format-btn" title="Toggle Format">${useShortFormat ? 'S' : 'L'}</button>
                    <button id="popup-btn" title="Pop Out">🗗</button>
                    <button id="settings-btn" title="Settings">⚙</button>
                    <button id="minimize-btn" title="Minimize">${isMinimized ? '+' : '−'}</button>
                </div>
            </div>
            <div class="faction-body" id="faction-body" style="${isMinimized ? 'display:none' : ''}">
                <div class="faction-main-view" id="faction-main-view">
                    <div class="faction-search">
                        <input type="text" id="member-search" placeholder="Search members...">
                    </div>
                    <div class="faction-filters">
                        <label><input type="checkbox" id="filter-online" checked> Online</label>
                        <label><input type="checkbox" id="filter-idle" checked> Idle</label>
                        <label><input type="checkbox" id="filter-offline" checked> Offline</label>
                    </div>
                    <div id="member-list" class="member-list">
                        <div class="loading">Loading...</div>
                    </div>
                </div>
                <div class="faction-settings-view" id="faction-settings-view" style="display:none">
                    <h3>Settings</h3>

                    <div class="settings-section">
                        <h4>🔑 API Configuration</h4>
                        <label>API Key:</label>
                        <input type="text" id="api-key-input" placeholder="Enter your Torn API key">
                        <button id="save-api-key">Save</button>
                        <p class="hint">Get your API key from Torn Settings → API</p>
                    </div>

                    <div class="settings-section">
                        <h4>🔊 Audio Settings</h4>
                        <div class="master-audio-toggle">
                            <label>
                                <input type="checkbox" id="master-audio-toggle" ${audioSettings.enabled ? 'checked' : ''}>
                                Enable All Audio Notifications
                            </label>
                        </div>

                        <div id="audio-controls" ${!audioSettings.enabled ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                            <div class="audio-control ${!audioSettings.onlineEnabled ? 'disabled' : ''}">
                                <label>
                                    <input type="checkbox" id="online-audio-toggle" ${audioSettings.onlineEnabled ? 'checked' : ''}>
                                    🟢 Online Sound
                                </label>
                                <div class="volume-control">
                                    <input type="range" id="online-volume" min="0" max="1" step="0.1" value="${audioSettings.onlineVolume}">
                                    <span id="online-volume-display">${Math.round(audioSettings.onlineVolume * 100)}%</span>
                                </div>
                            </div>

                            <div class="audio-control ${!audioSettings.awayEnabled ? 'disabled' : ''}">
                                <label>
                                    <input type="checkbox" id="away-audio-toggle" ${audioSettings.awayEnabled ? 'checked' : ''}>
                                    🟡 Away/Idle Sound
                                </label>
                                <div class="volume-control">
                                    <input type="range" id="away-volume" min="0" max="1" step="0.1" value="${audioSettings.awayVolume}">
                                    <span id="away-volume-display">${Math.round(audioSettings.awayVolume * 100)}%</span>
                                </div>
                            </div>

                            <div class="audio-control ${!audioSettings.offlineEnabled ? 'disabled' : ''}">
                                <label>
                                    <input type="checkbox" id="offline-audio-toggle" ${audioSettings.offlineEnabled ? 'checked' : ''}>
                                    🔴 Offline Sound
                                </label>
                                <div class="volume-control">
                                    <input type="range" id="offline-volume" min="0" max="1" step="0.1" value="${audioSettings.offlineVolume}">
                                    <span id="offline-volume-display">${Math.round(audioSettings.offlineVolume * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        <button id="test-all-audio" style="width: 100%; margin-top: 10px; padding: 6px; background: #5fbf5f; border: none; color: white; border-radius: 4px; cursor: pointer;">Test All Sounds</button>
                    </div>

                    <div class="settings-section">
                        <p class="hint">💡 Tip: Use the Pop Out button (🗗) to open in a separate window. This keeps audio working even when you refresh or navigate to other pages!</p>
                    </div>
                </div>
            </div>
            <div class="faction-resize-handle" id="resize-handle"></div>
            <div class="faction-resize-corner" id="resize-corner"></div>
        `;

        document.body.appendChild(panel);
        console.log('[Faction Sidebar] Panel created');
        return panel;
    }

    function addStyles() {
        const styles = `
            #faction-panel {
                position: fixed;
                background: #1a1a1a;
                border: 2px solid #333;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.8);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 13px;
                color: #e0e0e0;
                display: flex;
                flex-direction: column;
                min-height: 300px;
                min-width: 100px;
                max-width: 600px;
            }

            .faction-header {
                background: #2d2d2d;
                padding: 10px;
                border-bottom: 1px solid #444;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
                border-radius: 6px 6px 0 0;
            }

            .faction-title {
                font-weight: bold;
                font-size: 14px;
            }

            .faction-controls {
                display: flex;
                gap: 5px;
            }

            .faction-controls button {
                background: #444;
                border: 1px solid #555;
                color: #ddd;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .faction-controls button:hover {
                background: #555;
                border-color: #666;
            }

            #popup-btn {
                background: #4a9eff;
                border-color: #3b82f6;
            }

            #popup-btn:hover {
                background: #3b82f6;
                border-color: #2563eb;
            }

            .faction-body {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .faction-main-view, .faction-settings-view {
                padding: 10px;
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                min-height: 0;
            }

            .faction-search {
                margin-bottom: 10px;
                flex-shrink: 0;
            }

            .faction-search input {
                width: 100%;
                padding: 6px;
                background: #2d2d2d;
                border: 1px solid #444;
                color: #ddd;
                border-radius: 4px;
            }

            .faction-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                font-size: 12px;
                flex-shrink: 0;
            }

            .faction-filters label {
                cursor: pointer;
            }

            .member-list {
                flex: 1;
                overflow-y: auto;
                min-height: 0;
                padding-right: 5px;
            }

            /* Custom scrollbar styling */
            .member-list::-webkit-scrollbar {
                width: 8px;
            }

            .member-list::-webkit-scrollbar-track {
                background: #2d2d2d;
                border-radius: 4px;
            }

            .member-list::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            .member-list::-webkit-scrollbar-thumb:hover {
                background: #666;
            }

            .member-item {
                display: flex;
                align-items: center;
                padding: 8px;
                margin-bottom: 4px;
                background: #2d2d2d;
                border-radius: 4px;
                text-decoration: none;
                color: #ddd;
            }

            .member-item:hover {
                background: #3d3d3d;
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;
            }

            .status-online { background: #5fbf5f; }
            .status-idle { background: #f0ad4e; }
            .status-offline { background: #d9534f; }

            .member-info {
                flex: 1;
            }

            .member-name {
                font-weight: bold;
            }

            .member-details {
                font-size: 11px;
                color: #999;
            }

            .member-status {
                font-size: 11px;
                color: #4a9eff;
                margin-top: 2px;
            }

            .status-hospital { color: #ff6b6b; }
            .status-traveling { color: #ffd93d; }
            .status-abroad { color: #6bcf7f; }
            .status-federal { color: #ff8787; }
            .status-jail { color: #ffa500; }

            .faction-resize-handle {
                height: 5px;
                background: #444;
                cursor: ns-resize;
                border-top: 1px solid #555;
            }

            .faction-resize-handle:hover {
                background: #555;
            }

            .faction-resize-corner {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, transparent 40%, #666 40%, #666 60%, transparent 60%),
                            linear-gradient(135deg, transparent 60%, #666 60%);
                cursor: nwse-resize;
                border-radius: 0 0 6px 0;
            }

            .faction-resize-corner:hover {
                background: linear-gradient(135deg, transparent 40%, #888 40%, #888 60%, transparent 60%),
                            linear-gradient(135deg, transparent 60%, #888 60%);
            }

            .faction-resize-corner::before {
                content: '';
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 5px;
                height: 5px;
                border-right: 2px solid #999;
                border-bottom: 2px solid #999;
            }

            .faction-settings-view input[type="text"] {
                width: 100%;
                padding: 6px;
                margin: 5px 0;
                background: #1a1a1a;
                border: 1px solid #444;
                color: #ddd;
                border-radius: 4px;
            }

            .faction-settings-view button {
                width: 100%;
                padding: 8px;
                margin-top: 10px;
                background: #4a9eff;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 4px;
            }

            .faction-settings-view button:hover {
                background: #3b82f6;
            }

            .hint {
                font-size: 11px;
                color: #999;
                margin-top: 5px;
            }

            .loading {
                text-align: center;
                padding: 20px;
                color: #999;
            }

            .error {
                text-align: center;
                padding: 20px;
                color: #d9534f;
            }

            .settings-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #444;
            }

            .settings-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .settings-section h4 {
                margin: 0 0 10px 0;
                color: #4a9eff;
                font-size: 13px;
            }

            .audio-control {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px;
                background: #2d2d2d;
                border-radius: 4px;
            }

            .audio-control label {
                display: flex;
                align-items: center;
                font-size: 12px;
                cursor: pointer;
            }

            .audio-control input[type="checkbox"] {
                margin-right: 8px;
            }

            .volume-control {
                display: flex;
                align-items: center;
                margin-left: 10px;
            }

            .volume-control input[type="range"] {
                width: 60px;
                margin: 0 5px;
                accent-color: #4a9eff;
            }

            .volume-control span {
                font-size: 10px;
                color: #999;
                min-width: 25px;
                text-align: right;
            }

            .audio-control.disabled {
                opacity: 0.5;
            }

            .master-audio-toggle {
                margin-bottom: 15px;
                padding: 8px;
                background: #2d2d2d;
                border-radius: 4px;
                border: 1px solid #444;
            }

            .master-audio-toggle label {
                display: flex;
                align-items: center;
                font-weight: bold;
                cursor: pointer;
            }

            .master-audio-toggle input[type="checkbox"] {
                margin-right: 8px;
                transform: scale(1.2);
            }
        `;

        GM_addStyle(styles);
        console.log('[Faction Sidebar] Styles added');
    }

    function setupEventListeners(panel) {
        const header = panel.querySelector('#faction-header');
        const resizeHandle = panel.querySelector('#resize-handle');
        const resizeCorner = panel.querySelector('#resize-corner');

        // Dragging and resizing functionality
        let isDragging = false;
        let isResizing = false;
        let resizeMode = '';
        let initialX, initialY, initialHeight, initialWidth;

        header.addEventListener('mousedown', e => {
            // Don't drag if clicking on buttons
            if (e.target.tagName === 'BUTTON') return;

            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
            isDragging = true;
        });

        resizeHandle.addEventListener('mousedown', e => {
            initialY = e.clientY;
            initialHeight = panel.offsetHeight;
            isResizing = true;
            resizeMode = 'vertical';
            e.preventDefault();
        });

        resizeCorner.addEventListener('mousedown', e => {
            initialX = e.clientX;
            initialY = e.clientY;
            initialHeight = panel.offsetHeight;
            initialWidth = panel.offsetWidth;
            isResizing = true;
            resizeMode = 'both';
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                e.preventDefault();
                const newX = e.clientX - initialX;
                const newY = e.clientY - initialY;

                // Validate position to prevent off-screen
                if (newX >= 0 && newX <= window.innerWidth - 100) {
                    panel.style.left = newX + 'px';
                }
                if (newY >= 0 && newY <= window.innerHeight - 100) {
                    panel.style.top = newY + 'px';
                }
            } else if (isResizing) {
                e.preventDefault();
                if (resizeMode === 'vertical' || resizeMode === 'both') {
                    const newHeight = initialHeight + (e.clientY - initialY);
                    if (newHeight >= 300 && newHeight <= window.innerHeight - 100) {
                        panel.style.height = newHeight + 'px';
                    }
                }
                if (resizeMode === 'both') {
                    const newWidth = initialWidth + (e.clientX - initialX);
                    if (newWidth >= 100 && newWidth <= 600) {
                        panel.style.width = newWidth + 'px';
                    }
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                const finalX = panel.offsetLeft;
                const finalY = panel.offsetTop;

                // Validate and save position
                if (finalX >= 0 && finalX <= window.innerWidth - 100) {
                    GM_setValue('panelX', finalX);
                }
                if (finalY >= 0 && finalY <= window.innerHeight - 100) {
                    GM_setValue('panelY', finalY);
                }
            } else if (isResizing) {
                GM_setValue('panelHeight', panel.offsetHeight);
                GM_setValue('panelWidth', panel.offsetWidth);
            }
            isDragging = false;
            isResizing = false;
            resizeMode = '';
        });

        // Button listeners
        panel.querySelector('#minimize-btn').addEventListener('click', () => toggleMinimize(panel));
        panel.querySelector('#refresh-btn').addEventListener('click', () => fetchFactionData(panel));
        panel.querySelector('#format-btn').addEventListener('click', () => toggleFormat(panel));
        panel.querySelector('#popup-btn').addEventListener('click', openPopupWindow);
        panel.querySelector('#settings-btn').addEventListener('click', () => toggleSettings(panel));
        panel.querySelector('#save-api-key').addEventListener('click', () => saveApiKey(panel));
        panel.querySelector('#member-search').addEventListener('input', () => filterMembers(panel));


        // Filter checkboxes
        panel.querySelectorAll('.faction-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => filterMembers(panel));
        });


        // Audio control listeners
        setupAudioEventListeners(panel);
    }

    function toggleMinimize(panel) {
        const body = panel.querySelector('#faction-body');
        const btn = panel.querySelector('#minimize-btn');

        isMinimized = !isMinimized;
        body.style.display = isMinimized ? 'none' : 'flex';
        btn.textContent = isMinimized ? '+' : '−';

        GM_setValue('sidebarMinimized', isMinimized);
    }

    function formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else if (seconds < 3600) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}m ${secs}s`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${mins}m`;
        }
    }

    function toggleFormat(panel) {
        useShortFormat = !useShortFormat;
        panel.querySelector('#format-btn').textContent = useShortFormat ? 'S' : 'L';
        GM_setValue('useShortFormat', useShortFormat);

        // Re-display members with new format
        if (factionData) {
            displayMembers(factionData.members, panel);
        }
    }

    function toggleSettings(panel) {
        const mainView = panel.querySelector('#faction-main-view');
        const settingsView = panel.querySelector('#faction-settings-view');
        const apiKeyInput = panel.querySelector('#api-key-input');

        if (settingsView.style.display === 'none') {
            mainView.style.display = 'none';
            settingsView.style.display = 'flex';
            if (apiKeyInput) {
                apiKeyInput.value = apiKey;
            }
        } else {
            mainView.style.display = 'flex';
            settingsView.style.display = 'none';
        }
    }

    function saveApiKey(panel) {
        const input = panel.querySelector('#api-key-input');
        apiKey = input.value.trim();

        if (apiKey) {
            GM_setValue('tornApiKey', apiKey);
            toggleSettings(panel);
            fetchFactionData(panel);
            startAutoRefresh(panel);
        }
    }

    function checkMemberStatusChanges(members) {
        const currentMemberStatus = new Map();

        // Get current status for all members
        Object.entries(members).forEach(([id, data]) => {
            currentMemberStatus.set(id, data.last_action.status);
        });

        // Only check for changes if we have previous data
        if (previousMemberStatus.size > 0) {
            // Check each member for status changes
            currentMemberStatus.forEach((currentStatus, memberId) => {
                const previousStatus = previousMemberStatus.get(memberId);

                if (previousStatus && previousStatus !== currentStatus) {
                    const memberName = members[memberId].name;
                    console.log(`[Faction Sidebar] ${memberName} status changed from ${previousStatus} to ${currentStatus}`);

                    // Play appropriate sound based on new status
                    if (currentStatus === 'Online') {
                        playSound('online');
                    } else if (currentStatus === 'Idle') {
                        playSound('away');
                    } else if (currentStatus === 'Offline') {
                        playSound('offline');
                    }
                }
            });
        } else {
            console.log('[Faction Sidebar] First data load, initializing member status tracking');
        }

        // Update previous state
        previousMemberStatus = new Map(currentMemberStatus);
    }

    function fetchFactionData(containerEl) {
        if (!apiKey) {
            showApiKeyPrompt(containerEl);
            return;
        }

        const memberList = containerEl.querySelector('#member-list');
        if (!factionData && memberList) {
            memberList.innerHTML = '<div class="loading">Loading faction data...</div>';
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: CONFIG.apiUrl + apiKey,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            showError('API Error: ' + data.error.error, containerEl);
                        } else {
                            // Check for status changes before updating display
                            if (factionData) {
                                checkMemberStatusChanges(data.members);
                            }

                            factionData = data;
                            displayMembers(data.members, containerEl);
                        }
                    } catch (e) {
                        showError('Failed to parse API response', containerEl);
                    }
                } else {
                    showError('API request failed', containerEl);
                }
            },
            onerror: function() {
                showError('Network error', containerEl);
            }
        });
    }

    function displayMembers(members, containerEl) {
        const memberList = containerEl.querySelector('#member-list');
        if (!memberList) {
            console.error("[Faction Sidebar] Could not find member list element to display members.");
            return;
        }
        memberList.innerHTML = '';

        const membersArray = Object.entries(members).map(([id, data]) => ({
            id,
            ...data
        }));

        membersArray.sort((a, b) => {
            const statusOrder = { 'Online': 0, 'Idle': 1, 'Offline': 2 };
            const statusDiff = statusOrder[a.last_action.status] - statusOrder[b.last_action.status];
            if (statusDiff !== 0) return statusDiff;
            return a.name.localeCompare(b.name);
        });

        membersArray.forEach(member => {
            const memberEl = document.createElement('a');
            memberEl.className = 'member-item';
            memberEl.href = `https://www.torn.com/profiles.php?XID=${member.id}`;
            memberEl.target = isPopupWindow ? '_blank' : '_self';
            memberEl.dataset.status = member.last_action.status.toLowerCase();
            memberEl.dataset.name = member.name.toLowerCase();

            let statusText = '';
            let statusClass = '';

            // Location abbreviations for short format
            const locationAbbr = {
                'Torn': 'Torn',
                'Mexico': 'MEX',
                'Cayman Islands': 'CAY',
                'Canada': 'CAN',
                'Hawaii': 'HAW',
                'United Kingdom': 'UK',
                'Argentina': 'ARG',
                'Switzerland': 'SWI',
                'Japan': 'JPN',
                'China': 'CHN',
                'UAE': 'UAE',
                'South Africa': 'SA'
            };

            if (member.status.state === 'Hospital') {
                const timeLeft = member.status.until - Math.floor(Date.now()/1000);
                const timeStr = formatTime(Math.max(0, timeLeft));
                const desc = member.status.description || '';

                // Parse hospital reason and location
                let location = '';
                let reason = '';

                // Check if description contains location info
                if (desc.includes(' in ')) {
                    const parts = desc.split(' in ');
                    reason = parts[0];
                    location = parts[1];
                } else {
                    reason = desc;
                }

                if (useShortFormat) {
                    if (location && location !== '') {
                        const loc = locationAbbr[location] || location.substring(0, 3).toUpperCase();
                        statusText = `🏥 ${loc} (${timeStr})`;
                    } else {
                        statusText = `🏥 Torn (${timeStr})`;
                    }
                } else {
                    if (location && location !== '') {
                        statusText = `🏥 Hospital in ${location} (${timeStr})`;
                    } else {
                        statusText = `🏥 Hospital (${timeStr})`;
                    }

                    // Add reason if available
                    if (reason) {
                        if (reason.includes('Mugged')) {
                            statusText += ' - Mugged';
                        } else if (reason.includes('Attacked')) {
                            statusText += ' - Attacked';
                        } else if (reason.includes('Ipecac') || reason.includes('ipecac')) {
                            statusText += ' - Ipecac';
                        } else if (reason.includes('hemolytic transfusion') || reason.includes('wrong blood') || reason.includes('Wrong blood') || reason.includes('blood type')) {
                            statusText += ' - Wrong Blood';
                        } else if (reason.includes('Overdosed') || reason.includes('overdosed')) {
                            statusText += ' - Overdose';
                        } else if (reason.includes('radiation poisoning')) {
                            statusText += ' - Radiation';
                        } else if (reason.includes('Hospitalized')) {
                            statusText += ' - Hospitalized';
                        }
                    }
                }
                statusClass = 'status-hospital';
            } else if (member.status.state === 'Traveling') {
                const desc = member.status.description || '';

                if (useShortFormat) {
                    if (desc.includes('Returning to Torn from')) {
                        const from = desc.replace('Returning to Torn from ', '');
                        const fromAbbr = locationAbbr[from] || from.substring(0, 3).toUpperCase();
                        statusText = `✈️ ${fromAbbr}→Torn`;
                    } else if (desc.includes('Traveling to')) {
                        const match = desc.match(/Traveling to (.+)/);
                        if (match) {
                            const to = match[1];
                            const toAbbr = locationAbbr[to] || to.substring(0, 3).toUpperCase();
                            statusText = `✈️ Torn→${toAbbr}`;
                        } else {
                            statusText = `✈️ Travel`;
                        }
                    } else {
                        statusText = `✈️ Travel`;
                    }
                } else {
                    statusText = `✈️ ${desc}`;
                }
                statusClass = 'status-traveling';
            } else if (member.status.state === 'Abroad') {
                let location = member.status.description || '';

                if (location.startsWith('In ')) {
                    location = location.substring(3);
                }

                if (useShortFormat) {
                    const abbr = locationAbbr[location] || location.substring(0, 3).toUpperCase();
                    statusText = `🌍 ${abbr}`;
                } else {
                    statusText = `🌍 In ${location}`;
                }
                statusClass = 'status-abroad';
            } else if (member.status.state === 'Federal') {
                statusText = useShortFormat ? '🔒 Fed' : '🔒 Federal Prison';
                statusClass = 'status-federal';
            } else if (member.status.state === 'Jail') {
                const timeLeft = member.status.until - Math.floor(Date.now()/1000);
                const timeStr = formatTime(Math.max(0, timeLeft));
                statusText = useShortFormat ? `⛓️ Jail (${timeStr})` : `⛓️ Jail (${timeStr})`;
                statusClass = 'status-jail';
            }

            memberEl.innerHTML = `
                <div class="status-indicator status-${member.last_action.status.toLowerCase()}"></div>
                <div class="member-info">
                    <div class="member-name">${member.name} [${member.id}]</div>
                    <div class="member-details">${member.position} • ${member.last_action.relative}</div>
                    ${statusText ? `<div class="member-status ${statusClass}">${statusText}</div>` : ''}
                </div>
            `;

            memberList.appendChild(memberEl);
        });

        filterMembers(containerEl);
    }

    function filterMembers(containerEl) {
        const searchInput = containerEl.querySelector('#member-search');
        const onlineFilter = containerEl.querySelector('#filter-online');
        const idleFilter = containerEl.querySelector('#filter-idle');
        const offlineFilter = containerEl.querySelector('#filter-offline');
        const memberList = containerEl.querySelector('#member-list');

        // Gracefully exit if any required elements are missing from the page.
        if (!searchInput || !onlineFilter || !idleFilter || !offlineFilter || !memberList) {
            console.error("[Faction Sidebar] Could not find filter or list elements. Aborting filter.");
            return;
        }

        const searchTerm = searchInput.value.toLowerCase();
        const showOnline = onlineFilter.checked;
        const showIdle = idleFilter.checked;
        const showOffline = offlineFilter.checked;

        memberList.querySelectorAll('.member-item').forEach(member => {
            const name = member.dataset.name;
            const status = member.dataset.status;

            const matchesSearch = !searchTerm || name.includes(searchTerm);
            const matchesFilter =
                (status === 'online' && showOnline) ||
                (status === 'idle' && showIdle) ||
                (status === 'offline' && showOffline);

            member.style.display = matchesSearch && matchesFilter ? 'flex' : 'none';
        });
    }

    function showApiKeyPrompt(containerEl) {
        const memberList = containerEl.querySelector('#member-list');
        if (!memberList) return;
        memberList.innerHTML = `
            <div class="error">
                <p><strong>No API key found!</strong></p>
                <p>${isPopupWindow ? 'Please set it up in the main window first.' : 'Click the settings button (⚙) to add your API key.'}</p>
            </div>
        `;
    }

    function showError(message, containerEl) {
        const memberList = containerEl.querySelector('#member-list');
        if (!memberList) return;
        memberList.innerHTML = `<div class="error">Error: ${message}</div>`;
    }

    function startAutoRefresh(panel) {
        if (refreshTimer) clearInterval(refreshTimer);

        const refreshLogic = isPopupWindow ? () => fetchFactionData(document) : () => fetchFactionData(panel);
        const condition = isPopupWindow ?
              () => !document.hidden && apiKey :
              () => !document.hidden && apiKey && !isMinimized;


        refreshTimer = setInterval(() => {
            if (condition()) {
                refreshLogic();
            }
        }, CONFIG.refreshInterval);
    }
})();

