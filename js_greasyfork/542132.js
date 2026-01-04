// ==UserScript==
// @name         RR Tracker v18.3
// @namespace    https://greasyfork.org/users/1493252
// @version      18.3
// @description RR tracker with cool features, now with an integrated stats panel and profit graph, Martingale bet auto-start, a powerful dynamic bet calculator, and a fully scalable UI.
//###Your Torn RR Tracker: Quick Guide
//###Auto-Tracking
//###Just open Russian Roulette, and your tracker starts automatically. It records every win and loss, showing your profit, win rate, and streaks.
//###Panel Controls
//###* Drag: Click and drag the ☰ icon to move the panel anywhere you like.
//###* Shift + Drag: Hold Shift and drag with your mouse from anywhere on the panel to move it.
//###* Collapse/Expand: Click the ► (or ▪) icon to shrink or expand the panel.
//###* Hide/Show: If Auto-Hide is on in settings, the tracker hides when you leave RR and reappears when you return.
//###Settings (⚙️ icon)
//###* Panel Size: Use the slider to zoom the entire panel in or out for a perfect fit.
//###* Panel Opacity: Adjust how see-through the panel is.
//###* Profit/Loss Alerts: Set targets to be notified when you hit a certain profit or loss.
//###* Mini-Bar Count: Choose how many recent games show in the collapsed view.
//###* Mini-Button Size: Adjust the size of the bet buttons in the collapsed view.
//###* Bet Button Count: Use a slider to choose how many bet buttons to display (4-16).
//###* Reset Data: Clear all your tracked stats and profit.
//###* Edit Bets: Customize your bet amounts in a dedicated panel.
//###* Charging Shoots: Toggle the auto-shoot helper panel on or off.
//###Bets (💰 icon)
//###* Smart Bets: The panel now shows your recent match history and allows you to auto-start bets.
//###Stats (📊 icon) (NEW!)
//###* Open a new panel with a cumulative profit graph.
//###* Select timeframes: 7 Days, 1 Month, 3 Months, 6 Months, or 1 Year.
//###* See key stats for the selected period like Total Profit, Win/Loss, and Games Played.
//###* A new icon (➕/🔗) next to the result circle shows if you 'created' or 'joined' the game.
//###Edit Bets (✏️ NEW LOGIC!)
//###* Enable "Dynamic Bets" to use the new calculator.
//###* Set your strategy (Capital, Streak, Multiplier).
//###* Use the lock icons (🔒/🔓) to choose your calculation method.
//###* Lock 'Gambling Capital' to calculate the 'Starting Bet'.
//###* Lock 'Starting Bet' to calculate the required 'Gambling Capital'.
//###* The script populates your bet buttons automatically.
//###* Disable "Dynamic Bets" to return to setting bets manually.
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542132/RR%20Tracker%20v183.user.js
// @updateURL https://update.greasyfork.org/scripts/542132/RR%20Tracker%20v183.meta.js
// ==/UserScript==






(function waitUntilReady() {



    'use strict';

    try {

        // --- ADD THIS NEW STYLE BLOCK ---
        const styleSheet = document.createElement("style");

        styleSheet.type = "text/css";
        styleSheet.innerText = `
        .next-bet-highlight {
            background: rgba(255, 165, 0, 0.35) !important; /* A distinct orange glow */
            border: 1px solid rgba(255, 165, 0, 0.9) !important;
            box-shadow: 0 0 8px rgba(255, 165, 0, 0.7);
        }
    `;
        document.head.appendChild(styleSheet);
        // --- END OF NEW STYLE BLOCK ---


        // --- Constants ---
        const PANEL_EDGE_MARGIN = 150; // The minimum number of pixels to keep visible
        const MINIMIZE_KEY = 'rr_panelMinimized';
        const BET_MODE_KEY = 'rr_bettingMode'; // 'manual', 'dynamic', 'simple'
        const SIMPLE_STEP_KEY = 'rr_simpleModeStep';
        const AUTO_NEXT_KEY = 'rr_autoNextLoss';
        const AUTO_RESET_KEY = 'rr_autoResetWin';
        const PANEL_ID = 'rr-tracker-panel';
        const API_SYNC_INTERVAL_MS = 10 * 1000; // 15 seconds. This now controls everything.
        const BOOSTED_BETS_ENABLED_KEY = 'rr_boostedBetsEnabled';
        const STORAGE = 'torn_rr_tracker_results';
        const PROFIT_STORAGE = 'torn_rr_total_profit';
        const API_KEY_STORAGE = 'rr_tracker_api_key';
        const LAST_SYNC_KEY = 'rr_tracker_last_sync';
        const POS_KEY = 'rr_panelPos';
        const COLLAPSE_KEY = 'rr_panelCollapsed';
        const AUTOHIDE_KEY = 'rr_autoHide';
        const MAX_DISPLAY_KEY = 'rr_maxDisplayMatches';
        const OPACITY_KEY = 'rr_panelOpacity';
        const PROFIT_TARGET_KEY = 'rr_profitTarget';
        const LOSS_LIMIT_KEY = 'rr_lossLimit';
        const ALERT_SHOWN_PROFIT_KEY = 'rr_alertShownProfit';
        const ALERT_SHOWN_LOSS_KEY = 'rr_alertShownLoss';
        const MINI_BAR_COUNT_KEY = 'rr_miniBarCount';
        const MINI_BUTTON_SIZE_KEY = 'rr_miniButtonSize';
        const MANUAL_BETS_STORAGE_KEY = 'RRManualBets_v3';
        const DEFAULT_MANUAL_BETS = [100000, 200000, 400000, 800000, 1600000, 3200000, 6400000, 12800000, 25600000, 51200000, 102400000];
        const DYNAMIC_BETS_ENABLED_KEY = 'rr_dynamicBetsEnabled';
        const DYNAMIC_BETS_SETTINGS_KEY = 'rr_dynamicBetsSettings_v2';
        const UI_BUTTON_COUNT_KEY = 'rr_16';
        const MAX_L_STREAK_CAP = 15;
        const PANEL_SCALE_KEY = 'rr_panelScale';
        const MANUAL_SYNC_COOLDOWN_KEY = 'rr_tracker_last_manual_sync';
        const STOP_LOSS_ENABLED_KEY = 'rr_stopLossEnabled';
        const HIDE_ALERTS_KEY = 'rr_hideAlerts';
        const STREAK_VIEW_KEY = 'rr_streakView'; // <<< ADD THIS LINE
        const SIM_CAPITAL_KEY = 'rr_simCapital';
        const SIM_STREAK_KEY = 'rr_simStreak';
        const SIM_MATCHES_KEY = 'rr_simMatches';
        const SIM_SESSIONS_KEY = 'rr_simSessions';
        const SIM_MANUAL_BETS_KEY = 'rr_simManualBets';

        const SIM_USE_DYNAMIC_KEY = 'rr_simUseDynamic'; // <<< ADD THIS LINE

        const ENABLE_SHOOT_2_KEY = 'rr_enableShoot2';
        const ENABLE_SHOOT_3_KEY = 'rr_enableShoot3';
        let enableShoot2 = true;
        let enableShoot3 = true;




        const DEFAULT_DYNAMIC_SETTINGS = {
            testBet: 10000,
            capital: 100000000,
            maxLStreak: 10,
            martingaleValue: 2,
            reinforce: false,
            reinforceInterval: 2, // New default
            boostedBets: false,
            boostInterval: 5,     // New default
            lockedField: 'capital',
            startingBet: 0,
            // Drain Settings (Preserved)
            drainEnabled: false,
            drainStart: 3,
            drainRepeats: 4
        };

      



        // --- State Variables ---
        let apiKey = '';
        let lastSyncTime = 0;
        let manualBets, currentBets, showBetsPanel, showEditBetsPanel, showStatsPanel, isDragging, dragMouseX, dragMouseY, isTwoFingerDragging, initialTouchMidX, initialTouchMidY, initialPanelX, initialPanelY;
        let results, totalProfit, collapsed, autoHide, showSettings, maxDisplayMatches, currentOpacity, profitTarget, lossLimit, miniBarCount, miniButtonSize;
        let simulatorManualBetsString = ''; // Will remember the manual bets in the simulator
        let hideAlerts;
        let streakBreakdownView; // <<< ADD THIS LINE
        let bettingMode = 'manual'; // Default
        let simpleModeStep = 0;
        let autoNextEnabled = false;
        let autoResetEnabled = false;

        let simUseDynamic; // <<< ADD THIS LINE
        let showSimulatorConfig = false; // <<< ADD THIS LINE
        let showSimulatorPanel = false;


        let isShootDelayed = false;
        let isMinimized = false;
        let isStopLossActive = false;
        let stopLossEnabled = false;
		  let flashEnabled = false;
		e;

        let manualEditInputs = [];
        let panelScale;
        let rrChart = null;
        let isSyncing = false; // This is our new sync lock
        let wasInMatch = false;
        // --- NEW SESSION VARIABLES ---
        let isSessionActive = false;
        let sessionProfit = 0;
        let sessionStartDate = 0;
        const SESSION_ACTIVE_KEY = 'rr_sessionActive';
        const SESSION_PROFIT_KEY = 'rr_sessionProfit';
        const SESSION_START_KEY = 'rr_sessionStartDate';
        let simCapital, simMaxLStreak, simMatches, simSessions;

        // --- Dynamic Bets State ---
        let dynamicBetsEnabled, dynamicBetsSettings;
        let capitalInput, startingBetInput, testBetInput, capitalLock, startingBetLock;

        // --- Stats Panel State ---
        let currentStatsTimeframe = 1; // Default to 1 Day
        let chartPageOffset = 0; // 0 = Current, -1 = Previous, 1 = Next
        // ...

        const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

        // --- Initial Checks ---
        if (document.getElementById(PANEL_ID)) return;

        // --- Load Data and Initialize Variables ---
        function initializeState() {

            isMinimized = JSON.parse(localStorage.getItem(MINIMIZE_KEY) || 'false');

            apiKey = localStorage.getItem(API_KEY_STORAGE) || '';lastSyncTime = parseInt(localStorage.getItem(LAST_SYNC_KEY) || '0', 10);
            manualBets = []; currentBets = []; showBetsPanel = false; showEditBetsPanel = false; showStatsPanel = false; isDragging = false; dragMouseX = 0; dragMouseY = 0; isTwoFingerDragging = false; initialTouchMidX = 0; initialTouchMidY = 0; initialPanelX = 0; initialPanelY = 0;
            // --- LOAD NEW MODES ---
            bettingMode = localStorage.getItem(BET_MODE_KEY) || 'manual';
            // Backwards compatibility: if dynamicBetsEnabled was true, force dynamic mode
            if (JSON.parse(localStorage.getItem(DYNAMIC_BETS_ENABLED_KEY) || 'false') && bettingMode === 'manual') {
                bettingMode = 'dynamic';
            }

            simpleModeStep = parseInt(localStorage.getItem(SIMPLE_STEP_KEY) || '0', 10);
            autoNextEnabled = JSON.parse(localStorage.getItem(AUTO_NEXT_KEY) || 'false');
            autoResetEnabled = JSON.parse(localStorage.getItem(AUTO_RESET_KEY) || 'false');

            // Sync the old boolean for compatibility with other parts of your script
            dynamicBetsEnabled = (bettingMode !== 'manual');
            results = JSON.parse(localStorage.getItem(STORAGE) || '[]');
            totalProfit = parseFloat(localStorage.getItem(PROFIT_STORAGE) || '0');
            collapsed = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || 'false');
            autoHide = JSON.parse(localStorage.getItem(AUTOHIDE_KEY) || 'false');
            showSettings = false;
            maxDisplayMatches = parseInt(localStorage.getItem(MAX_DISPLAY_KEY) || '100', 10);
            if (isNaN(maxDisplayMatches) || maxDisplayMatches < 1) { maxDisplayMatches = 100; localStorage.setItem(MAX_DISPLAY_KEY, maxDisplayMatches.toString()); }
            currentOpacity = parseFloat(localStorage.getItem(OPACITY_KEY) || '0.6');
            if (isNaN(currentOpacity) || currentOpacity < 0.1 || currentOpacity > 1.0) { currentOpacity = 0.6; localStorage.setItem(OPACITY_KEY, currentOpacity.toString()); }
            profitTarget = parseFloat(localStorage.getItem(PROFIT_TARGET_KEY) || '0');
            lossLimit = parseFloat(localStorage.getItem(LOSS_LIMIT_KEY) || '0');
            hideAlerts = JSON.parse(localStorage.getItem(HIDE_ALERTS_KEY) || 'false');
            streakBreakdownView = localStorage.getItem(STREAK_VIEW_KEY) || 'win'; // <<< ADD THIS LINE
            showSimulatorPanel = false;

            enableShoot2 = JSON.parse(localStorage.getItem(ENABLE_SHOOT_2_KEY) || 'false');
            enableShoot3 = JSON.parse(localStorage.getItem(ENABLE_SHOOT_3_KEY) || 'false');

            miniBarCount = parseInt(localStorage.getItem(MINI_BAR_COUNT_KEY) || '10', 10);
            if (isNaN(miniBarCount) || miniBarCount < 1 || miniBarCount > 50) { miniBarCount = 10; localStorage.setItem(MINI_BAR_COUNT_KEY, miniBarCount.toString()); }
            miniButtonSize = parseInt(localStorage.getItem(MINI_BUTTON_SIZE_KEY) || '9', 10);
            if (isNaN(miniButtonSize) || miniButtonSize < 7 || miniButtonSize > 14) { miniButtonSize = 9; localStorage.setItem(MINI_BUTTON_SIZE_KEY, miniButtonSize.toString()); }
            panelScale = parseFloat(localStorage.getItem(PANEL_SCALE_KEY) || '1.0');
            if (isNaN(panelScale) || panelScale < 0.5 || panelScale > 1.5) { panelScale = 1.0; localStorage.setItem(PANEL_SCALE_KEY, panelScale.toString()); }
            dynamicBetsEnabled = JSON.parse(localStorage.getItem(DYNAMIC_BETS_ENABLED_KEY) || 'false');
            try {
                const storedDynamicSettings = JSON.parse(localStorage.getItem(DYNAMIC_BETS_SETTINGS_KEY));
                dynamicBetsSettings = { ...DEFAULT_DYNAMIC_SETTINGS, ...storedDynamicSettings };
            } catch {
                dynamicBetsSettings = { ...DEFAULT_DYNAMIC_SETTINGS };
            }
            isSessionActive = JSON.parse(localStorage.getItem(SESSION_ACTIVE_KEY) || 'false');
            sessionProfit = parseFloat(localStorage.getItem(SESSION_PROFIT_KEY) || '0');

            sessionStartDate = parseInt(localStorage.getItem(SESSION_START_KEY) || '0' , 10);

            flashEnabled = JSON.parse(localStorage.getItem('rr_flashEnabled') || 'false');

            stopLossEnabled = JSON.parse(localStorage.getItem(STOP_LOSS_ENABLED_KEY) || 'true');

            let initialBets = loadManualBets();
            manualBets = adjustManualBetsArray(initialBets);
            // Load simulator settings
            simCapital = localStorage.getItem(SIM_CAPITAL_KEY) || '500m';
            simMaxLStreak = localStorage.getItem(SIM_STREAK_KEY) || '12';
            simMatches = localStorage.getItem(SIM_MATCHES_KEY) || '10000';
            simSessions = localStorage.getItem(SIM_SESSIONS_KEY) || '1000';
            simulatorManualBetsString = localStorage.getItem(SIM_MANUAL_BETS_KEY) || '';
            simUseDynamic = JSON.parse(localStorage.getItem(SIM_USE_DYNAMIC_KEY) || 'true'); // <<< ADD THIS LINE



        }
        initializeState();

        // --- UI Creation ---
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        Object.assign(panel.style, {
            position: 'fixed', top: '12px', left: '12px', background: `rgba(0,0,0,${currentOpacity})`, color: '#fff',
            fontFamily: 'monospace', fontSize: '14px', padding: '36px 12px 12px', borderRadius: '10px',
            boxShadow: '0 0 12px rgba(255,0,0,0.3)', zIndex: '9999999', userSelect: 'none', display: 'flex',
            flexDirection: 'column', gap: '8px',
            width: '400px',
            flexShrink: '0', // Add this line
            boxSizing: 'border-box', // And add this line
            transformOrigin: 'top left', transform: `scale(${panelScale})`
        });

        document.body.appendChild(panel);
        try { const pos = JSON.parse(localStorage.getItem(POS_KEY) || '{}'); if (pos.top && pos.left) { panel.style.top = pos.top; panel.style.left = pos.left; } } catch {}

        // --- Reposition Panel if Off-Screen on Load ---
        setTimeout(() => {
            let currentLeft = panel.offsetLeft;
            let currentTop = panel.offsetTop;

            // Define the screen boundaries using our new constant
            // REPLACE WITH THESE
            const panelRenderedWidth = panel.offsetWidth * panelScale;
            const minX = -(panelRenderedWidth - PANEL_EDGE_MARGIN);
            const maxX = window.innerWidth - PANEL_EDGE_MARGIN;
            const minY = 0;
            const maxY = window.innerHeight - PANEL_EDGE_MARGIN;

            // Clamp the current position to the valid range
            const clampedX = Math.max(minX, Math.min(currentLeft, maxX));
            const clampedY = Math.max(minY, Math.min(currentTop, maxY));

            // If the position was out of bounds, apply the fix
            if (clampedX !== currentLeft || clampedY !== currentTop) {
                console.log('RR Tracker: Panel was off-screen, repositioning.');
                panel.style.left = clampedX + 'px';
                panel.style.top = clampedY + 'px';
                savePos(); // Save the corrected position for the next reload
            }
        }, 100); // A tiny delay to ensure the panel has rendered
        // --- End of Reposition Logic ---

        const alertMessageDiv = document.createElement('div');
        alertMessageDiv.id = 'rr-alert-message';
        Object.assign(alertMessageDiv.style, { display: 'none', padding: '8px', marginBottom: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: 'white', cursor: 'pointer', border: '1px solid transparent', transition: 'background-color 0.3s, border-color 0.3s' });
        panel.appendChild(alertMessageDiv);

        const miniBar = document.createElement('div');
        const miniBetGridContainer = document.createElement('div');
        miniBetGridContainer.id = 'rr-mini-bet-grid';
        Object.assign(miniBetGridContainer.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', // Creates 4 equal columns
            gap: '3px',
            marginTop: '5px'
        });



        Object.assign(miniBar.style, { display: 'none', flexDirection: 'column', gap: '2px', padding: '4px 0' });
        panel.appendChild(miniBar);

        const profitMini = document.createElement('div');
        Object.assign(profitMini.style, { display: 'none', fontSize: '14px', fontFamily: 'monospace', margin: '2px 0' });
        panel.appendChild(profitMini);

        const statusDiv = document.createElement('div'); statusDiv.title = "Collapse/Expand the tracker panel.";
        Object.assign(statusDiv.style, { position: 'absolute', top: '8px', left: '30px', width: '20px', height: '20px', fontSize: '18px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' });
        panel.appendChild(statusDiv);

        const minimizeButton = document.createElement('div'); minimizeButton.title = "Minimize/Restore the tracker panel.";
        Object.assign(minimizeButton.style, { position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', fontSize: '18px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' });

        minimizeButton.onclick = () => {
            isMinimized = !isMinimized; // Just toggle the minimized state
            saveMinimized();
            refreshAll();
        };

        panel.appendChild(minimizeButton);

        const dragHandle = document.createElement('div'); dragHandle.textContent = '☰'; dragHandle.title = "Click and drag to move the panel.";
        Object.assign(dragHandle.style, { position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', fontSize: '18px', cursor: 'move', color: 'rgba(255,255,255,0.7)', touchAction: 'none' });
        panel.appendChild(dragHandle);

        const statsGroup = document.createElement('div');
        Object.assign(statsGroup.style, { display: 'flex', flexDirection: 'column', gap: '4px' });

        panel.appendChild(statsGroup);

        // --- ADD THIS NEW CODE BLOCK ---
        const mainBetGridContainer = document.createElement('div');
        mainBetGridContainer.id = 'rr-main-bet-grid';
        Object.assign(mainBetGridContainer.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', // Creates 4 equal columns
            gap: '4px', // Space between buttons
            marginTop: '10px',
            paddingTop: '6px',
            borderTop: '1px solid #333' // A separator line
        });
        panel.appendChild(mainBetGridContainer);
        // --- END OF NEW CODE BLOCK ---


        const profitDiv = document.createElement('div');
        profitDiv.id = 'rr-lifetime-profit'; // <-- ADD ID
        profitDiv.title = "Total profit or loss tracked since the last reset.";

        const dailyProfitDiv = document.createElement('div');
        dailyProfitDiv.id = 'rr-daily-profit'; // <-- ADD ID
        dailyProfitDiv.title = "Profit or loss for today (since midnight local time).";

        const winrateDiv = document.createElement('div');
        winrateDiv.id = 'rr-winrate'; // <-- ADD ID

        const streakDiv = document.createElement('div');
        streakDiv.id = 'rr-streak'; // <-- ADD ID

        const sessionDiv = document.createElement('div');
        sessionDiv.id = 'rr-session-div';
        sessionDiv.title = "Profit/loss for the current session.";
        const syncTimerDisplay = document.createElement('div');
        syncTimerDisplay.id = 'rr-sync-timer';
        Object.assign(syncTimerDisplay.style, {
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#999',
            textAlign: 'center',
            marginTop: '6px', // Add some space above
            marginBottom: '2px' // Add some space below
        });
        statsGroup.append(profitDiv, winrateDiv, streakDiv, syncTimerDisplay, dailyProfitDiv, sessionDiv);

        // VVV ADD THIS NEW BLOCK VVV
        const riskAnalysisContainer = document.createElement('div');
        riskAnalysisContainer.id = 'rr-risk-analysis';
        Object.assign(riskAnalysisContainer.style, {
            display: 'none', // Hidden by default
            flexDirection: 'column',
            gap: '4px',
            padding: '8px',
            marginTop: '6px',
            border: '1px solid #444',
            borderRadius: '6px',
            fontSize: '12px'
        });
        statsGroup.appendChild(riskAnalysisContainer);
        // ^^^ END OF NEW BLOCK ^^^


        const resultsContainer = document.createElement('div');
        Object.assign(resultsContainer.style, { maxHeight: '140px', overflowY: 'auto', marginTop: '4px' });
        statsGroup.appendChild(resultsContainer);

        const settingsPanel = document.createElement('div');
        Object.assign(settingsPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0' });
        panel.appendChild(settingsPanel);

        const settingsTitle = document.createElement('div'); settingsTitle.textContent = 'Settings';
        Object.assign(settingsTitle.style, { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' });
        settingsPanel.appendChild(settingsTitle);

        const backButtonSettings = document.createElement('button'); backButtonSettings.textContent = '← Back';
        Object.assign(backButtonSettings.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
        backButtonSettings.onmouseenter = () => backButtonSettings.style.background = 'rgba(255,255,255,0.2)'; backButtonSettings.onmouseleave = () => backButtonSettings.style.background = 'rgba(255,255,255,0.1)';
        backButtonSettings.onclick = () => { showSettings = false; showBetsPanel = false; showEditBetsPanel = false; refreshAll(); };
        settingsPanel.appendChild(backButtonSettings);

        const settingsScrollContainer = document.createElement('div');
        Object.assign(settingsScrollContainer.style, {
            display: 'flex', flexDirection: 'column', gap: '8px',
            maxHeight: '300px', overflowY: 'auto', paddingRight: '5px'
        });
        settingsPanel.appendChild(settingsScrollContainer);

        const apiSettingDiv = document.createElement('div');
        Object.assign(apiSettingDiv.style, { display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', border: '1px solid #444', borderRadius: '6px' });
        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = 'Torn API Key (Auto-Syncs):';
        apiKeyLabel.htmlFor = 'api-key-input';
        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'password';
        apiKeyInput.id = 'api-key-input';
        apiKeyInput.value = apiKey;
        apiKeyInput.placeholder = 'Enter API Key Here';
        apiKeyInput.title = 'Enter your Torn API key here. A limited-access key is recommended.';
        Object.assign(apiKeyInput.style, { width: '95%', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
        apiKeyInput.onchange = () => {
            apiKey = apiKeyInput.value.trim();
            localStorage.setItem(API_KEY_STORAGE, apiKey);
            initiateSyncing();
        };

        const apiButtonsGroup = document.createElement('div');
        Object.assign(apiButtonsGroup.style, { display: 'flex', gap: '8px', marginTop: '8px' });

        const generateKeyLink = document.createElement('a');
        generateKeyLink.href = 'https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=The%20Ultimate%20RR%20Toolkit&user=log';
        generateKeyLink.textContent = 'Generate Key';
        generateKeyLink.target = '_blank';
        generateKeyLink.rel = 'noopener noreferrer';
        generateKeyLink.title = 'Opens a new tab to the Torn API page with pre-filled settings for this script.';
        Object.assign(generateKeyLink.style, {
            background: 'rgba(100, 180, 255, 0.2)', color: '#fff', border: '1px solid #64B4FF', borderRadius: '6px',
            padding: '4px 8px', cursor: 'pointer', textDecoration: 'none', fontSize: '12px'
        });
        generateKeyLink.onmouseenter = () => generateKeyLink.style.background = 'rgba(100, 180, 255, 0.3)';
        generateKeyLink.onmouseleave = () => generateKeyLink.style.background = 'rgba(100, 180, 255, 0.2)';

        const pasteApiKeyButton = document.createElement('button');
        // --- START: New Force Sync Button ---
        const forceSyncButton = document.createElement('button');
        forceSyncButton.textContent = '🔄 Sync Now';
        forceSyncButton.title = 'Manually syncs your RR history from the Torn API. Useful after generating a new key or to check for recent games.';
        Object.assign(forceSyncButton.style, {
            background: 'rgba(128, 90, 213, 0.2)', // A distinct purple color
            color: '#fff',
            border: '1px solid #805AD5',
            borderRadius: '6px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '12px'
        });
        forceSyncButton.onmouseenter = () => forceSyncButton.style.background = 'rgba(128, 90, 213, 0.3)';
        forceSyncButton.onmouseleave = () => forceSyncButton.style.background = 'rgba(128, 90, 213, 0.2)';

        // We give the button an ID to make it easier to find in our new function
        forceSyncButton.id = 'rr-force-sync-btn';

        forceSyncButton.onclick = forceFullResync; // The button now calls our new function.

        // --- END: New Force Sync Button ---

        pasteApiKeyButton.textContent = 'Paste Key';
        pasteApiKeyButton.title = 'Paste API Key from your clipboard';
        Object.assign(pasteApiKeyButton.style, {
            background: 'rgba(76, 175, 80, 0.2)', color: '#fff', border: '1px solid #4CAF50', borderRadius: '6px',
            padding: '4px 8px', cursor: 'pointer', fontSize: '12px'
        });
        pasteApiKeyButton.onmouseenter = () => pasteApiKeyButton.style.background = 'rgba(76, 175, 80, 0.3)';
        pasteApiKeyButton.onmouseleave = () => pasteApiKeyButton.style.background = 'rgba(76, 175, 80, 0.2)';

        pasteApiKeyButton.addEventListener('click', async () => {
            try {
                if (!navigator.clipboard?.readText) {
                    alert('Clipboard API is not supported by your browser.');
                    return;
                }
                const text = await navigator.clipboard.readText();
                if (text) {
                    apiKeyInput.value = text.trim();
                    apiKeyInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } catch (err) {
                console.error('Failed to read clipboard contents:', err);
                alert('Could not paste from clipboard. Please ensure you have granted the website permission to read clipboard data.');
            }
        });

        apiButtonsGroup.append(generateKeyLink, pasteApiKeyButton, forceSyncButton);
        apiSettingDiv.append(apiKeyLabel, apiKeyInput, apiButtonsGroup);
        settingsScrollContainer.appendChild(apiSettingDiv);

        const panelScaleSettingDiv = document.createElement('div');
        Object.assign(panelScaleSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const panelScaleLabel = document.createElement('label');
        panelScaleLabel.textContent = `Panel Size (${Math.round(panelScale * 100)}%):`;
        panelScaleLabel.htmlFor = 'panel-scale-slider';
        Object.assign(panelScaleLabel.style, { flexShrink: '0' });
        const panelScaleSlider = document.createElement('input');
        panelScaleSlider.type = 'range'; panelScaleSlider.id = 'panel-scale-slider';
        panelScaleSlider.min = '0.5'; panelScaleSlider.max = '1.5'; panelScaleSlider.step = '0.05';
        panelScaleSlider.value = panelScale; panelScaleSlider.title = "Adjust the overall size (zoom) of the tracker panel.";
        Object.assign(panelScaleSlider.style, { width: '100px', cursor: 'pointer' });
        panelScaleSlider.oninput = () => {
            panelScaleLabel.textContent = `Panel Size (${Math.round(parseFloat(panelScaleSlider.value) * 100)}%):`;
        };
        panelScaleSlider.onchange = () => {
            panelScale = parseFloat(panelScaleSlider.value);
            panel.style.transform = `scale(${panelScale})`;
            localStorage.setItem(PANEL_SCALE_KEY, panelScale.toString());
        };
        panelScaleSettingDiv.append(panelScaleLabel, panelScaleSlider);
        settingsScrollContainer.appendChild(panelScaleSettingDiv);

        const maxMatchesSettingDiv = document.createElement('div'); Object.assign(maxMatchesSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const maxMatchesLabel = document.createElement('label'); maxMatchesLabel.textContent = 'Max Matches Displayed:'; maxMatchesLabel.htmlFor = 'max-matches-input'; Object.assign(maxMatchesLabel.style, { flexShrink: '0' });
        const maxMatchesInput = document.createElement('input'); maxMatchesInput.type = 'number'; maxMatchesInput.id = 'max-matches-input'; maxMatchesInput.min = '1'; maxMatchesInput.max = '100000'; maxMatchesInput.value = maxDisplayMatches; maxMatchesInput.title = "Set the maximum number of recent matches to show in the main panel."; Object.assign(maxMatchesInput.style, { width: '60px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
        maxMatchesInput.onchange = () => { let newValue = parseInt(maxMatchesInput.value, 10); if (isNaN(newValue) || newValue < 1) { newValue = 1; } if (newValue > 100000) newValue = 100000; maxDisplayMatches = newValue; maxMatchesInput.value = maxDisplayMatches; localStorage.setItem(MAX_DISPLAY_KEY, maxDisplayMatches.toString()); refreshAll(); };
        maxMatchesSettingDiv.append(maxMatchesLabel, maxMatchesInput);
        settingsScrollContainer.appendChild(maxMatchesSettingDiv);

        const transparencySettingDiv = document.createElement('div'); Object.assign(transparencySettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const transparencyLabel = document.createElement('label'); transparencyLabel.textContent = 'Panel Opacity:'; transparencyLabel.htmlFor = 'transparency-slider'; Object.assign(transparencyLabel.style, { flexShrink: '0' });
        const transparencySlider = document.createElement('input'); transparencySlider.type = 'range'; transparencySlider.id = 'transparency-slider'; transparencySlider.min = '0.1'; transparencySlider.max = '1.0'; transparencySlider.step = '0.05'; transparencySlider.value = currentOpacity; transparencySlider.title = "Adjust the transparency of the tracker panel."; Object.assign(transparencySlider.style, { width: '100px', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' });
        transparencySlider.oninput = () => { currentOpacity = parseFloat(transparencySlider.value); panel.style.background = `rgba(0,0,0,${currentOpacity})`; localStorage.setItem(OPACITY_KEY, currentOpacity.toString()); refreshAll(); };
        transparencySettingDiv.append(transparencyLabel, transparencySlider);
        settingsScrollContainer.appendChild(transparencySettingDiv);

        const profitTargetSettingDiv = document.createElement('div'); Object.assign(profitTargetSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const profitTargetLabel = document.createElement('label'); profitTargetLabel.textContent = 'Profit Target ($):'; profitTargetLabel.htmlFor = 'profit-target-input'; Object.assign(profitTargetLabel.style, { flexShrink: '0' });
        const profitTargetInput = document.createElement('input'); profitTargetInput.type = 'text'; profitTargetInput.id = 'profit-target-input'; profitTargetInput.value = profitTarget; profitTargetInput.title = "Set a profit target. You'll get a persistent alert when this target is reached."; Object.assign(profitTargetInput.style, { width: '80px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
        profitTargetInput.onchange = () => { let newValue = parseBetInput(profitTargetInput.value); if (newValue === null || newValue < 0) newValue = 0; profitTarget = newValue; profitTargetInput.value = formatNumberToKMB(profitTarget); localStorage.setItem(PROFIT_TARGET_KEY, profitTarget.toString()); alertShownProfit = false; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'false'); refreshAll(); };
        profitTargetSettingDiv.append(profitTargetLabel, profitTargetInput);
        settingsScrollContainer.appendChild(profitTargetSettingDiv);

        const lossLimitSettingDiv = document.createElement('div'); Object.assign(lossLimitSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const lossLimitLabel = document.createElement('label'); lossLimitLabel.textContent = 'Loss Limit ($):'; lossLimitLabel.htmlFor = 'loss-limit-input'; Object.assign(lossLimitLabel.style, { flexShrink: '0' });
        const lossLimitInput = document.createElement('input'); lossLimitInput.type = 'text'; lossLimitInput.id = 'loss-limit-input'; lossLimitInput.value = lossLimit; lossLimitInput.title = "Set a loss limit. You'll get a persistent alert if your losses reach this amount."; Object.assign(lossLimitInput.style, { width: '80px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
        lossLimitInput.onchange = () => { let newValue = parseBetInput(lossLimitInput.value); if (newValue === null || newValue < 0) newValue = 0; lossLimit = newValue; lossLimitInput.value = formatNumberToKMB(lossLimit); localStorage.setItem(LOSS_LIMIT_KEY, lossLimit.toString()); alertShownLoss = false; localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'false'); refreshAll(); };
        lossLimitSettingDiv.append(lossLimitLabel, lossLimitInput);
        settingsScrollContainer.appendChild(lossLimitSettingDiv);

        const hideAlertsToggleContainer = document.createElement('div');
        Object.assign(hideAlertsToggleContainer.style, { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' });

        const hideAlertsToggle = document.createElement('input');
        hideAlertsToggle.type = 'checkbox';
        hideAlertsToggle.id = 'hide-alerts-toggle';
        hideAlertsToggle.checked = hideAlerts;
        hideAlertsToggle.title = 'If checked, all profit/loss alerts will be hidden from the panel.';

        const hideAlertsLabel = document.createElement('label');
        hideAlertsLabel.textContent = 'Hide Profit/Loss Alerts';
        hideAlertsLabel.htmlFor = 'hide-alerts-toggle';
        hideAlertsLabel.style.cursor = 'pointer';

        hideAlertsToggle.onchange = () => {
            hideAlerts = hideAlertsToggle.checked;
            localStorage.setItem(HIDE_ALERTS_KEY, JSON.stringify(hideAlerts));
            refreshAll();
        };

        hideAlertsToggleContainer.append(hideAlertsToggle, hideAlertsLabel);
        settingsScrollContainer.appendChild(hideAlertsToggleContainer);


        // --- NEW FLASH TOGGLE ---
        const flashToggleContainer = document.createElement('div');
        Object.assign(flashToggleContainer.style, { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' });

        const flashToggle = document.createElement('input');
        flashToggle.type = 'checkbox';
        flashToggle.id = 'flash-toggle';
        flashToggle.checked = flashEnabled;
        flashToggle.title = 'If checked, the screen will flash Green on wins and Red on losses.';

        const flashLabel = document.createElement('label');
        flashLabel.textContent = 'Enable Win/Loss Screen Flash';
        flashLabel.htmlFor = 'flash-toggle';
        flashLabel.style.cursor = 'pointer';

        flashToggle.onchange = () => {
            flashEnabled = flashToggle.checked;
            localStorage.setItem('rr_flashEnabled', JSON.stringify(flashEnabled));
        };

        flashToggleContainer.append(flashToggle, flashLabel);
        settingsScrollContainer.appendChild(flashToggleContainer);
        // --- END FLASH TOGGLE ---

                // ... after stopLossToggleContainer ...

        // --- NEW SHOOT BUTTON SETTINGS ---
        const shootSettingsDiv = document.createElement('div');
        Object.assign(shootSettingsDiv.style, { marginTop: '10px', borderTop: '1px solid #444', paddingTop: '5px' });
        
        const shootTitle = document.createElement('div');
        shootTitle.textContent = "Extra Shoot Buttons:";
        shootTitle.style.fontSize = '12px';
        shootTitle.style.marginBottom = '4px';
        shootTitle.style.color = '#aaa';
        shootSettingsDiv.appendChild(shootTitle);

        // x2 Toggle
        const x2Div = document.createElement('div');
        Object.assign(x2Div.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const x2Check = document.createElement('input'); x2Check.type = 'checkbox'; x2Check.id = 'toggle-x2'; x2Check.checked = enableShoot2;
        const x2Label = document.createElement('label'); x2Label.textContent = 'Enable "x2 Shoot" Button'; x2Label.htmlFor = 'toggle-x2';
        x2Check.onchange = () => { enableShoot2 = x2Check.checked; localStorage.setItem(ENABLE_SHOOT_2_KEY, JSON.stringify(enableShoot2)); refreshAll(); };
        x2Div.append(x2Check, x2Label);

        // x3 Toggle
        const x3Div = document.createElement('div');
        Object.assign(x3Div.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const x3Check = document.createElement('input'); x3Check.type = 'checkbox'; x3Check.id = 'toggle-x3'; x3Check.checked = enableShoot3;
        const x3Label = document.createElement('label'); x3Label.textContent = 'Enable "x3 Shoot" Button'; x3Label.htmlFor = 'toggle-x3';
        x3Check.onchange = () => { enableShoot3 = x3Check.checked; localStorage.setItem(ENABLE_SHOOT_3_KEY, JSON.stringify(enableShoot3)); refreshAll(); };
        x3Div.append(x3Check, x3Label);

        shootSettingsDiv.append(x2Div, x3Div);
        settingsScrollContainer.appendChild(shootSettingsDiv);
        // ...


// --- ADD THIS NEW TOGGLE ---
        const stopLossToggleContainer = document.createElement('div');
        Object.assign(stopLossToggleContainer.style, { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' });

        const stopLossToggle = document.createElement('input');
        stopLossToggle.type = 'checkbox';
        stopLossToggle.id = 'stop-loss-toggle';
        stopLossToggle.checked = stopLossEnabled;
        stopLossToggle.title = 'If enabled, bet buttons will be automatically disabled when the daily loss limit is reached.';

        const stopLossLabel = document.createElement('label');
        stopLossLabel.textContent = 'Enable Auto Stop-Loss';
        stopLossLabel.htmlFor = 'stop-loss-toggle';
        stopLossLabel.style.cursor = 'pointer';

        stopLossToggle.onchange = () => {
            stopLossEnabled = stopLossToggle.checked;
            localStorage.setItem(STOP_LOSS_ENABLED_KEY, JSON.stringify(stopLossEnabled));
            // If the user disables it while it's active, reset the lock
            if (!stopLossEnabled && isStopLossActive) {
                isStopLossActive = false;
                refreshAll();
            }
        };

        stopLossToggleContainer.append(stopLossToggle, stopLossLabel);
        settingsScrollContainer.appendChild(stopLossToggleContainer);
        // --- END OF NEW TOGGLE ---

        //. Instant Leave Toggle ---
        const instantLeaveContainer = document.createElement('div');
        Object.assign(instantLeaveContainer.style, { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' });

        const INSTANT_LEAVE_KEY = 'rr_instantLeave';
        // Define variable here so it is available globally in this scope
        let instantLeaveEnabled = JSON.parse(localStorage.getItem(INSTANT_LEAVE_KEY) || 'false');

        const instantLeaveToggle = document.createElement('input');
        instantLeaveToggle.type = 'checkbox';
        instantLeaveToggle.id = 'instant-leave-toggle';
        instantLeaveToggle.checked = instantLeaveEnabled;
        instantLeaveToggle.title = 'If checked, the script will instantly redirect you to the RR lobby after a Bang (Win or Loss).';

        const instantLeaveLabel = document.createElement('label');
        instantLeaveLabel.textContent = 'Instant Leave on Bang';
        instantLeaveLabel.htmlFor = 'instant-leave-toggle';
        instantLeaveLabel.style.cursor = 'pointer';

        instantLeaveToggle.onchange = () => {
            instantLeaveEnabled = instantLeaveToggle.checked;
            localStorage.setItem(INSTANT_LEAVE_KEY, JSON.stringify(instantLeaveEnabled));
        };

        instantLeaveContainer.append(instantLeaveToggle, instantLeaveLabel);
        settingsScrollContainer.appendChild(instantLeaveContainer);
        // --- END NEW LOCATION ---


        const miniBarCountSettingDiv = document.createElement('div'); Object.assign(miniBarCountSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const miniBarCountLabel = document.createElement('label'); miniBarCountLabel.textContent = 'Mini-Bar Count:'; miniBarCountLabel.htmlFor = 'mini-bar-count-input'; Object.assign(miniBarCountLabel.style, { flexShrink: '0' });
        const miniBarCountInput = document.createElement('input'); miniBarCountInput.type = 'number'; miniBarCountInput.id = 'mini-bar-count-input'; miniBarCountInput.min = '1'; miniBarCountInput.max = '50'; miniBarCountInput.value = miniBarCount; miniBarCountInput.title = "Set how many recent match indicators (W/L circles) are shown in the collapsed view."; Object.assign(miniBarCountInput.style, { width: '60px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
        miniBarCountInput.onchange = () => { let newValue = parseInt(miniBarCountInput.value, 10); if (isNaN(newValue) || newValue < 1) newValue = 1; if (newValue > 50) newValue = 50; miniBarCount = newValue; miniBarCountInput.value = miniBarCount; localStorage.setItem(MINI_BAR_COUNT_KEY, miniBarCount.toString()); refreshAll(); };
        miniBarCountSettingDiv.append(miniBarCountLabel, miniBarCountInput);
        settingsScrollContainer.appendChild(miniBarCountSettingDiv);

        const miniButtonSizeSettingDiv = document.createElement('div'); Object.assign(miniButtonSizeSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const miniButtonSizeLabel = document.createElement('label'); miniButtonSizeLabel.textContent = 'Mini-Button Size:'; miniButtonSizeLabel.htmlFor = 'mini-button-size-slider'; Object.assign(miniButtonSizeLabel.style, { flexShrink: '0' });
        const miniButtonSizeSlider = document.createElement('input'); miniButtonSizeSlider.type = 'range'; miniButtonSizeSlider.id = 'mini-button-size-slider'; miniButtonSizeSlider.min = '7'; miniButtonSizeSlider.max = '14'; miniButtonSizeSlider.step = '1'; miniButtonSizeSlider.value = miniButtonSize; miniButtonSizeSlider.title = "Adjust the font size of the bet buttons in the collapsed view."; Object.assign(miniButtonSizeSlider.style, { width: '100px', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' });
        miniButtonSizeSlider.oninput = () => { miniButtonSize = parseInt(miniButtonSizeSlider.value, 10); localStorage.setItem(MINI_BUTTON_SIZE_KEY, miniButtonSize.toString()); refreshAll(); };
        miniButtonSizeSettingDiv.append(miniButtonSizeLabel, miniButtonSizeSlider);
        settingsScrollContainer.appendChild(miniButtonSizeSettingDiv);


        const editBetsButton = document.createElement('button'); editBetsButton.textContent = '✏️ Edit Bets'; editBetsButton.title = "Open the panel to configure your manual or dynamic betting strategy.";
        Object.assign(editBetsButton.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
        editBetsButton.onmouseenter = () => editBetsButton.style.background = 'rgba(255,255,255,0.2)'; editBetsButton.onmouseleave = () => editBetsButton.style.background = 'rgba(255,255,255,0.1)';
        editBetsButton.onclick = () => { showSettings = false; showBetsPanel = false; showEditBetsPanel = true; refreshAll(); };
        settingsScrollContainer.appendChild(editBetsButton);


        const resetBtn = document.createElement('button'); 
        resetBtn.textContent = '🔄 Reset Data'; 
        resetBtn.title = "WARNING: This will clear all tracked stats, profit, reset all bet configurations (including Boost Wins settings), and your API key.";
        Object.assign(resetBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
        
        resetBtn.onmouseenter = () => resetBtn.style.background = 'rgba(255,255,255,0.2)'; 
        resetBtn.onmouseleave = () => resetBtn.style.background = 'rgba(255,255,255,0.1)';
        
        resetBtn.onclick = () => {
            if (confirm('Clear ALL results, reset profit, and wipe all strategy settings?')) {
                // 1. Clear Standard Data
                localStorage.removeItem(STORAGE);
                localStorage.removeItem(PROFIT_STORAGE);
                localStorage.removeItem(ALERT_SHOWN_PROFIT_KEY);
                localStorage.removeItem(ALERT_SHOWN_LOSS_KEY);
                localStorage.removeItem(MANUAL_BETS_STORAGE_KEY);
                localStorage.removeItem(DYNAMIC_BETS_ENABLED_KEY);
                localStorage.removeItem(DYNAMIC_BETS_SETTINGS_KEY);
                localStorage.removeItem(UI_BUTTON_COUNT_KEY);
                localStorage.removeItem(PANEL_SCALE_KEY);
                localStorage.removeItem(API_KEY_STORAGE);
                localStorage.removeItem(LAST_SYNC_KEY);
                
                // 2. Clear Session Data
                localStorage.removeItem(SESSION_ACTIVE_KEY);
                localStorage.removeItem(SESSION_PROFIT_KEY);
                localStorage.removeItem(SESSION_START_KEY);

                // 3. Clear Auto/Simple Mode Data
                localStorage.removeItem(SIMPLE_STEP_KEY);
                localStorage.removeItem(AUTO_NEXT_KEY);
                localStorage.removeItem(AUTO_RESET_KEY);

                // 4. Clear New "Boost Wins" Strategy Data
                localStorage.removeItem('rr_boostWins');
                localStorage.removeItem('rr_streakCap');
                localStorage.removeItem('rr_martingaleStart');
                localStorage.removeItem('rr_martingaleActive');

                // 5. Re-Initialize and Refresh
                initializeState();
                apiKeyInput.value = '';
                // Reset inputs in the UI to defaults
                if(document.querySelector('#mode-manual')) document.querySelector('#mode-manual').click();
                
                refreshAll();
                alert("All data and settings have been reset.");
            }
        };

        settingsScrollContainer.appendChild(resetBtn);



        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', gap: '4px', marginTop: '4px' });
        panel.appendChild(buttonContainer);

        const settingsButton = document.createElement('button'); settingsButton.textContent = '⚙️ Settings'; settingsButton.title = "Open the settings panel.";
        Object.assign(settingsButton.style, { flex: '1', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
        settingsButton.onmouseenter = () => settingsButton.style.background = 'rgba(255,255,255,0.2)';
        settingsButton.onmouseleave = () => settingsButton.style.background = 'rgba(255,255,255,0.1)';
        settingsButton.onclick = () => { showSettings = !showSettings; showBetsPanel = false; showEditBetsPanel = false; showStatsPanel = false; refreshAll(); };
        buttonContainer.appendChild(settingsButton);

        const editBetsPanel = document.createElement('div');
        Object.assign(editBetsPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0' });
        panel.appendChild(editBetsPanel);
        const editBetsTitle = document.createElement('div'); editBetsTitle.textContent = 'Edit Bets';
        Object.assign(editBetsTitle.style, { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' });
        editBetsPanel.appendChild(editBetsTitle);

        const createDynamicInput = (label, id, value, title, type = 'text') => {
            const lbl = document.createElement('label'); lbl.textContent = label; lbl.htmlFor = id;
            const input = document.createElement('input'); input.type = type; input.id = id; input.value = value; input.title = title;
            Object.assign(input.style, { width: '100%', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
            const lock = document.createElement('button'); lock.style.cursor = 'pointer'; lock.style.background = 'none'; lock.style.border = 'none'; lock.style.color = '#fff'; lock.style.fontSize = '16px'; lock.style.padding = '0 5px';
            return [lbl, input, lock];
        };

        const backButtonEditBets = document.createElement('button'); backButtonEditBets.textContent = '← Back to Settings';
        Object.assign(backButtonEditBets.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
        backButtonEditBets.onmouseenter = () => backButtonEditBets.style.background = 'rgba(255,255,255,0.2)'; backButtonEditBets.onmouseleave = () => backButtonEditBets.style.background = 'rgba(255,255,255,0.1)';
        backButtonEditBets.onclick = () => { showEditBetsPanel = false; showSettings = true; refreshAll(); };
        editBetsPanel.appendChild(backButtonEditBets);

        // --- NEW BETTING MODE SELECTOR ---
        const modeContainer = document.createElement('div');
        Object.assign(modeContainer.style, { display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '10px' });

        const modeTitle = document.createElement('div');
        modeTitle.textContent = "Select Betting Mode:";
        modeTitle.style.fontWeight = "bold";
        modeContainer.appendChild(modeTitle);

        const modes = [
            { value: 'manual', label: 'Manual Grid (Static)' },
            { value: 'dynamic', label: 'Dynamic Grid (Calculated)' },
            { value: 'simple', label: 'Simple Multiplier (4-Button)' }
        ];

        modes.forEach(m => {
            const row = document.createElement('div');
            Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '8px' });

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'rr_bet_mode';
            radio.id = `mode-${m.value}`;
            radio.value = m.value;
            radio.checked = (bettingMode === m.value); // Uses var from Phase 1

            const label = document.createElement('label');
            label.textContent = m.label;
            label.htmlFor = `mode-${m.value}`;
            label.style.cursor = "pointer";

            radio.onchange = () => {
                bettingMode = m.value;
                localStorage.setItem(BET_MODE_KEY, bettingMode);

                // Maintain compatibility with old logic
                dynamicBetsEnabled = (bettingMode !== 'manual');
                localStorage.setItem(DYNAMIC_BETS_ENABLED_KEY, JSON.stringify(dynamicBetsEnabled));

                updateSettingsVisibility();
                calculateBetsAndRefresh();
            };

            row.append(radio, label);
            modeContainer.appendChild(row);
        });

        editBetsPanel.appendChild(modeContainer);

        // --- AUTO FEATURES (Simple Mode Only) ---
        // --- AUTO FEATURES (Simple Mode Only) ---
        const autoFeaturesContainer = document.createElement('div');
        Object.assign(autoFeaturesContainer.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '0 10px 10px 10px', marginLeft: '10px', borderLeft: '2px solid #555' });

        // 1. Existing Simple Toggles
        const createSimpleToggle = (labelText, checked, key, callback) => {
            const div = document.createElement('div');
            Object.assign(div.style, { display: 'flex', alignItems: 'center', gap: '8px' });
            const box = document.createElement('input'); box.type = 'checkbox'; box.checked = checked;
            const lbl = document.createElement('label'); lbl.textContent = labelText;
            box.onchange = () => {
                localStorage.setItem(key, JSON.stringify(box.checked));
                callback(box.checked);
            };
            div.append(box, lbl);
            return div;
        };

                // [Inside the block where you add Auto-Next/Auto-Reset toggles]
        
autoFeaturesContainer.appendChild(createSimpleToggle("Auto-Next after Loss", autoNextEnabled, AUTO_NEXT_KEY, (val) => autoNextEnabled = val));
        autoFeaturesContainer.appendChild(createSimpleToggle("Auto-Reset after Win", autoResetEnabled, AUTO_RESET_KEY, (val) => autoResetEnabled = val));

        // 2. NEW: Boost Wins Section
        const boostContainer = document.createElement('div');
        Object.assign(boostContainer.style, { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #444' });
        
        // Boost Toggle
        const boostCheckDiv = document.createElement('div');
        Object.assign(boostCheckDiv.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const boostCheck = document.createElement('input'); 
        boostCheck.type = 'checkbox';
        boostCheck.checked = JSON.parse(localStorage.getItem('rr_boostWins') || 'false');
        const boostLabel = document.createElement('label'); 
        boostLabel.textContent = 'Enable "Boost Wins" Strategy';
        
        boostCheck.onchange = () => {
            localStorage.setItem('rr_boostWins', JSON.stringify(boostCheck.checked));
            // Reset the "Active Martingale" state if user toggles this, to prevent getting stuck
            localStorage.setItem('rr_martingaleActive', 'false'); 
        };
        boostCheckDiv.append(boostCheck, boostLabel);
        boostContainer.appendChild(boostCheckDiv);

        // Inputs Container
        const boostInputsDiv = document.createElement('div');
        Object.assign(boostInputsDiv.style, { display: 'flex', gap: '10px', fontSize: '12px' });

        // Cap Input
        const capDiv = document.createElement('div');
        capDiv.innerHTML = 'Streak Cap:<br>';
        const capInput = document.createElement('input');
        capInput.type = 'number';
        capInput.value = localStorage.getItem('rr_streakCap') || '4';
        capInput.style.width = '40px';
        capInput.onchange = () => localStorage.setItem('rr_streakCap', capInput.value);
        capDiv.appendChild(capInput);

        // Start Input
        const startDiv = document.createElement('div');
        startDiv.innerHTML = 'Martingale Start:<br>';
        const startInput = document.createElement('input');
        startInput.type = 'number';
        startInput.value = localStorage.getItem('rr_martingaleStart') || '2';
        startInput.style.width = '40px';
        startInput.onchange = () => localStorage.setItem('rr_martingaleStart', startInput.value);
        startDiv.appendChild(startInput);

        boostInputsDiv.append(capDiv, startDiv);
        boostContainer.appendChild(boostInputsDiv);
        
        autoFeaturesContainer.appendChild(boostContainer);

        modeContainer.appendChild(autoFeaturesContainer);


        // and replace it with this visibility helper:

        const dynamicBetsContainer = document.createElement('div');
        Object.assign(dynamicBetsContainer.style, { display: dynamicBetsEnabled ? 'grid' : 'none', gridTemplateColumns: 'auto 1fr auto', gap: '8px 10px', marginTop: '10px' });
        editBetsPanel.appendChild(dynamicBetsContainer);

        const manualBetsContainer = document.createElement('div');
        Object.assign(manualBetsContainer.style, { display: dynamicBetsEnabled ? 'none' : 'block', marginTop: '10px' });
        editBetsPanel.appendChild(manualBetsContainer);
        const manualBetsTitle = document.createElement('div'); manualBetsTitle.textContent = 'Manual Bet Configuration';
        Object.assign(manualBetsTitle.style, { fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' });
        manualBetsContainer.appendChild(manualBetsTitle);
        const manualEditGrid = document.createElement('div');
        Object.assign(manualEditGrid.style, { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 10px', overflowY: 'auto', maxHeight: '200px' });
        manualBetsContainer.appendChild(manualEditGrid);



        const [capitalLabel, localCapitalInput, localCapitalLock] = createDynamicInput('Gambling Capital:', 'dyn-capital', dynamicBetsSettings.capital, "Define your total risk. Lock this (🔒) to have the script calculate the 'Starting Bet' for you. Accepts k/m/b suffixes.", 'text');
        capitalInput = localCapitalInput; capitalLock = localCapitalLock;
        capitalInput.onchange = () => {
            if (dynamicBetsSettings.lockedField === 'capital') {
                const parsed = parseBetInput(capitalInput.value);
                if (parsed !== null) {
                    dynamicBetsSettings.capital = Math.max(0, parsed);
                    saveDynamicBetsSettings();
                    calculateBetsAndRefresh();
                } else {
                    capitalInput.value = formatNumberToKMB(dynamicBetsSettings.capital);
                }
            }
        };
        capitalLock.onclick = () => { dynamicBetsSettings.lockedField = 'capital'; saveDynamicBetsSettings(); calculateBetsAndRefresh(); };
        dynamicBetsContainer.append(capitalLabel, capitalInput, capitalLock);

        const [startingBetLabel, localStartingBetInput, localStartingBetLock] = createDynamicInput('Starting Bet (x):', 'dyn-starting-bet', dynamicBetsSettings.startingBet, "Define your ideal first bet. Lock this (🔒) to have the script calculate the total 'Gambling Capital' required. Accepts k/m/b suffixes.", 'text');
        startingBetInput = localStartingBetInput; startingBetLock = localStartingBetLock;
        startingBetInput.onchange = () => {
            if (dynamicBetsSettings.lockedField === 'startingBet') {
                const parsed = parseBetInput(startingBetInput.value);
                if (parsed !== null) {
                    dynamicBetsSettings.startingBet = Math.max(0, parsed);
                    saveDynamicBetsSettings();
                    calculateBetsAndRefresh();
                } else {
                    startingBetInput.value = formatNumberToKMB(dynamicBetsSettings.startingBet);
                }
            }
        };
        startingBetLock.onclick = () => { dynamicBetsSettings.lockedField = 'startingBet'; saveDynamicBetsSettings(); calculateBetsAndRefresh(); };
        dynamicBetsContainer.append(startingBetLabel, startingBetInput, startingBetLock);

        const [maxLLabel, maxLInput] = createDynamicInput('Max L Streak:', 'dyn-max-l', dynamicBetsSettings.maxLStreak, `The maximum number of consecutive losses your strategy should be able to withstand. Max: ${MAX_L_STREAK_CAP}.`, 'number');
        maxLInput.max = MAX_L_STREAK_CAP;
        maxLInput.onchange = () => {
            let val = Math.max(1, parseInt(maxLInput.value, 10) || 1);
            val = Math.min(val, MAX_L_STREAK_CAP);
            dynamicBetsSettings.maxLStreak = val;
            maxLInput.value = val;
            saveDynamicBetsSettings();
            calculateBetsAndRefresh();
        };
        dynamicBetsContainer.append(maxLLabel, maxLInput, document.createElement('div'));

        const [martingaleLabel, martingaleInput] = createDynamicInput('Martingale Value:', 'dyn-martingale', dynamicBetsSettings.martingaleValue, "The multiplier for your bets (e.g., 2 for doubling, 3 for tripling).", 'number');
        martingaleInput.step = '0.1';
        martingaleInput.onchange = () => {
            let val = Math.max(1.1, parseFloat(martingaleInput.value) || 1.1);
            dynamicBetsSettings.martingaleValue = val;
            martingaleInput.value = val;
            saveDynamicBetsSettings();
            calculateBetsAndRefresh();
        };
        dynamicBetsContainer.append(martingaleLabel, martingaleInput, document.createElement('div'));

        // --- START NEW DRAIN L STREAK UI ---
        const drainContainer = document.createElement('div');
        Object.assign(drainContainer.style, { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #444', paddingTop: '8px', marginTop: '4px' });

        const drainCheck = document.createElement('input'); 
        drainCheck.type = 'checkbox'; 
        drainCheck.id = 'dyn-drain'; 
        drainCheck.checked = dynamicBetsSettings.drainEnabled;
        
        const drainLabel = document.createElement('label'); 
        drainLabel.textContent = 'Drain L Streak'; 
        drainLabel.htmlFor = 'dyn-drain';

        const drainStartInput = document.createElement('input');
        drainStartInput.type = 'number'; 
        drainStartInput.value = dynamicBetsSettings.drainStart; 
        drainStartInput.style.width = '40px'; 
        drainStartInput.title = "Start Step (e.g. 3 starts flattening at 3rd bet)";
        
        const drainRepeatsInput = document.createElement('input');
        drainRepeatsInput.type = 'number'; 
        drainRepeatsInput.value = dynamicBetsSettings.drainRepeats; 
        drainRepeatsInput.style.width = '40px'; 
        drainRepeatsInput.title = "Repeats (how many times to bet the same amount)";

        const drainUpdate = () => {
            dynamicBetsSettings.drainEnabled = drainCheck.checked;
            dynamicBetsSettings.drainStart = parseInt(drainStartInput.value) || 3;
            dynamicBetsSettings.drainRepeats = parseInt(drainRepeatsInput.value) || 4;
            saveDynamicBetsSettings();
            calculateBetsAndRefresh();
        };

        drainCheck.onchange = drainUpdate;
        drainStartInput.onchange = drainUpdate;
        drainRepeatsInput.onchange = drainUpdate;

        drainContainer.append(drainCheck, drainLabel, document.createTextNode(' Start:'), drainStartInput, document.createTextNode(' Reps:'), drainRepeatsInput);
        dynamicBetsContainer.appendChild(drainContainer);
        // --- END NEW DRAIN L STREAK UI ---




        // --- UPDATED REINFORCE UI WITH INTERVAL INPUT ---
        const reinforceContainer = document.createElement('div');
        Object.assign(reinforceContainer.style, { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' });
        
        const reinforceCheck = document.createElement('input'); 
        reinforceCheck.type = 'checkbox'; 
        reinforceCheck.id = 'dyn-reinforce'; 
        reinforceCheck.checked = dynamicBetsSettings.reinforce;
        
        const reinforceLabel = document.createElement('label'); 
        reinforceLabel.textContent = 'Reinforce every:'; 
        reinforceLabel.htmlFor = 'dyn-reinforce';
        
        const reinforceInput = document.createElement('input');
        reinforceInput.type = 'number';
        reinforceInput.value = dynamicBetsSettings.reinforceInterval || 2;
        reinforceInput.style.width = '35px';
        reinforceInput.style.textAlign = 'center';
        reinforceInput.title = "Apply reinforcement every X steps (Default: 2 = odd steps like 3, 5, 7)";
        
        const reinforceSuffix = document.createElement('span');
        reinforceSuffix.textContent = 'steps';
        
        const updateReinforce = () => {
            dynamicBetsSettings.reinforce = reinforceCheck.checked;
            let interval = parseInt(reinforceInput.value);
            if(isNaN(interval) || interval < 1) interval = 2;
            dynamicBetsSettings.reinforceInterval = interval;
            saveDynamicBetsSettings(); 
            calculateBetsAndRefresh(); 
        };
        reinforceCheck.onchange = updateReinforce;
        reinforceInput.onchange = updateReinforce;
        
        reinforceContainer.append(reinforceCheck, reinforceLabel, reinforceInput, reinforceSuffix);
        dynamicBetsContainer.appendChild(reinforceContainer);

        // --- UPDATED BOOSTED BETS UI WITH INTERVAL INPUT ---
        const boostedBetsContainer = document.createElement('div');
        Object.assign(boostedBetsContainer.style, { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' });
        
        const boostedBetsCheck = document.createElement('input');
        boostedBetsCheck.type = 'checkbox';
        boostedBetsCheck.id = 'dyn-boosted';
        boostedBetsCheck.checked = dynamicBetsSettings.boostedBets;
        
        const boostedBetsLabel = document.createElement('label');
        boostedBetsLabel.textContent = 'Boost (x2) every:';
        boostedBetsLabel.htmlFor = 'dyn-boosted';
        
        const boostedInput = document.createElement('input');
        boostedInput.type = 'number';
        boostedInput.value = dynamicBetsSettings.boostInterval || 5;
        boostedInput.style.width = '35px';
        boostedInput.style.textAlign = 'center';
        boostedInput.title = "Double the bet every X steps (Default: 5 = 5th, 10th, 15th)";

        const boostedSuffix = document.createElement('span');
        boostedSuffix.textContent = 'L';

        const updateBoost = () => {
            dynamicBetsSettings.boostedBets = boostedBetsCheck.checked;
            let interval = parseInt(boostedInput.value);
            if(isNaN(interval) || interval < 1) interval = 5;
            dynamicBetsSettings.boostInterval = interval;
            saveDynamicBetsSettings();
            calculateBetsAndRefresh();
        };

        boostedBetsCheck.onchange = updateBoost;
        boostedInput.onchange = updateBoost;

        boostedBetsContainer.append(boostedBetsCheck, boostedBetsLabel, boostedInput, boostedSuffix);
        dynamicBetsContainer.appendChild(boostedBetsContainer);
 
        function performInstantLeave() {
            // This URL is the main lobby for Russian Roulette
            const lobbyUrl = "https://www.torn.com/page.php?sid=russianRoulette";
            
            console.log("RR Tracker: Instant Leave triggered. Redirecting...");
            
            // Force the browser to go there immediately
            window.location.href = lobbyUrl;
        }


        // --- TEXT-BASED DETECTION (Trigger Only) ---
        function enableTextBasedDetection() {
            let syncTriggered = false;
            let flashTriggered = false;

            const observer = new MutationObserver((mutations) => {
                const text = document.body.innerText || "";
                const hasBang = text.includes("BANG");

                // 1. RESET
                if (!hasBang) {
                    if (syncTriggered || flashTriggered) {
                        syncTriggered = false;
                        flashTriggered = false;
                    }
                    return;
                }

                // 2. SYNC TRIGGER (The "Bang")
                if (hasBang && !syncTriggered) {
                    console.log("RR Tracker: 'BANG' detected! Syncing...");
                    // This Sync will eventually call autoBet() when data arrives
                    importApiData(true); 
                    syncTriggered = true;
                }

                // [Inside enableTextBasedDetection, in the 'if (hasBang)' block]

                // 3. FLASH & ACTIONS
                if (hasBang && !flashTriggered) {
                    
                    // LOAD SETTING (Dynamic)
                    const instantLeave = JSON.parse(localStorage.getItem('rr_instantLeave') || 'false');

                    // --- SCENARIO: LOSS ---
                    if (text.includes("You fall down")) {
                        triggerFlash('loss');
                        flashTriggered = true;
                        // Wait 500ms for flash, then redirect
                        if (instantLeave) setTimeout(performInstantLeave, 500); 
                    } 
                    
                    // --- SCENARIO: WIN ---
                    else if (text.includes("You take your winnings")) {
                        triggerFlash('win');
                        flashTriggered = true;
                        // Wait 500ms for flash, then redirect
                        if (instantLeave) setTimeout(performInstantLeave, 500); 
                    }
                }

            });

            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            console.log("RR Tracker: Text-based detection enabled.");
        }



        function updateSettingsVisibility() {
            dynamicBetsContainer.style.display = (bettingMode === 'manual') ? 'none' : 'grid';
            manualBetsContainer.style.display = (bettingMode === 'manual') ? 'block' : 'none';
            autoFeaturesContainer.style.display = (bettingMode === 'simple') ? 'flex' : 'none';
        }
        // Run once to set initial state
        updateSettingsVisibility();


        const statsButton = document.createElement('button'); statsButton.textContent = '📊 Stats'; statsButton.title = "Open the Statistics and Graph panel.";
        Object.assign(statsButton.style, { flex: '1', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
        statsButton.onmouseenter = () => statsButton.style.background = 'rgba(255,255,255,0.2)';
        statsButton.onmouseleave = () => statsButton.style.background = 'rgba(255,255,255,0.1)';
        statsButton.onclick = () => {
            showStatsPanel = !showStatsPanel;
            showSettings = false; showBetsPanel = false; showEditBetsPanel = false;
            refreshAll();
            if (showStatsPanel) {
                updateGraph();
            }
        };
        buttonContainer.appendChild(statsButton);


        // ... after the statsButton is added to buttonContainer ...

        // ... after the statsButton is added to buttonContainer ...

        const simulatorButton = document.createElement('button');
        simulatorButton.textContent = '🔬 Simulator';
        simulatorButton.title = "Open the Strategy Simulator to simulate outcomes.";
        Object.assign(simulatorButton.style, { flex: '1', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
        simulatorButton.onmouseenter = () => simulatorButton.style.background = 'rgba(255,255,255,0.2)';
        simulatorButton.onmouseleave = () => simulatorButton.style.background = 'rgba(255,255,255,0.1)';
        simulatorButton.onclick = () => {
            showSimulatorPanel = !showSimulatorPanel;
            showSettings = false; showBetsPanel = false; showEditBetsPanel = false; showStatsPanel = false;

            // --- ADD THESE TWO LINES ---
            showSimulatorConfig = false; // Always start on the main results view
            if (showSimulatorPanel) refreshSimulatorView(); // Refresh the view if opening
            refreshAll();
        };
        buttonContainer.appendChild(simulatorButton);


        const sessionButton = document.createElement('button');
        sessionButton.id = 'rr-session-button';
        Object.assign(sessionButton.style, {
            flex: '1', background: 'rgba(255, 255, 255, 0.1)', color: '#fff',
            border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer'
        });
        sessionButton.onmouseenter = () => sessionButton.style.background = 'rgba(255,255,255,0.2)';
        sessionButton.onmouseleave = () => sessionButton.style.background = 'rgba(255,255,255,0.1)';
        buttonContainer.appendChild(sessionButton);

        // --- Mini Panel Structure ---
        const miniCirclesContainer = document.createElement('div');
        miniCirclesContainer.id = 'rr-mini-circles-container'; // <<< ADD THIS LINE
        Object.assign(miniCirclesContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', padding: '4px 0' });

        const miniStatsContainer = document.createElement('div');
        Object.assign(miniStatsContainer.style, { display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333' });

        // Add clones of the main stats divs to the mini container
        const miniStreakDiv = streakDiv.cloneNode(true);
        miniStreakDiv.id = ''; // <-- ADD THIS LINE to remove the cloned ID

        const miniDailyProfitDiv = dailyProfitDiv.cloneNode(true);
        miniDailyProfitDiv.id = ''; // <-- ADD THIS LINE to remove the cloned ID

        const miniSessionDiv = sessionDiv.cloneNode(true);
        miniSessionDiv.id = ''; // <-- ADD THIS LINE to remove the cloned ID

        miniStatsContainer.append(miniStreakDiv, miniDailyProfitDiv, miniSessionDiv);

        miniBar.append(miniCirclesContainer, miniStatsContainer, miniBetGridContainer);
        // --- End Mini Panel Structure ---


        const simulatorPanel = document.createElement('div');
        simulatorPanel.id = 'rr-simulator-panel';
        Object.assign(simulatorPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0' });
        panel.appendChild(simulatorPanel);

        // (Inside the (function waitUntilReady() { ... block)

        simulatorPanel.innerHTML = `
        <div style="font-size: 16px; font-weight: bold;">Strategy Simulator</div>
        <button id="simulator-back-btn" style="align-self: flex-start; background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 6px; padding: 4px 8px; cursor: pointer; margin-bottom: 8px;">← Back to Main Panel</button>

        <div id="simulator-main-view">
            <button id="simulator-configure-btn" style="width: 100%; background: rgba(100, 180, 255, 0.2); color: #fff; border: 1px solid #64B4FF; border-radius: 6px; padding: 6px; cursor: pointer; font-size: 14px; margin-bottom: 15px;">
                ⚙️ Simulator Configuration
            </button>

            <div style="display: flex; gap: 8px;">
                <button id="simulator-run-btn" style="flex: 1; background: #4CAF50; color: white; border: none; border-radius: 6px; padding: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">Run Simulation(s)</button>
                <button id="simulator-deep-run-btn" title="Run a detailed analysis to find the optimal Max L Streak for profit and safety." style="flex: 1; background: #3F51B5; color: white; border: none; border-radius: 6px; padding: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">🔬 Deep Simulation</button>
            </div>

            <canvas id="simulator-graph-canvas" width="350" height="200" style="background: rgba(0,0,0,0.2); border-radius: 6px; margin-top: 15px; display: none;"></canvas>

            <div id="simulator-results-container" style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; min-height: 100px; font-size: 13px; white-space: pre-wrap; max-height: 250px; overflow-y: auto;">
                Configure your strategy and run a simulation to see the potential outcome.
            </div>

            <div id="simulator-deep-results-container" style="display: none; margin-top: 10px; font-size: 13px;"></div>
        </div>

        <div id="simulator-config-view" style="display: none; flex-direction: column; gap: 8px;">
            <button id="simulator-config-back-btn" style="align-self: flex-start; background: rgba(255,255,255,0.1); color: #fff; border: none; border-radius: 6px; padding: 4px 8px; cursor: pointer;">← Back to Results</button>

            <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: center; margin-top: 10px; padding: 10px; border: 1px solid #444; border-radius: 6px;">
                <label for="simulator-capital">Starting Capital:</label>
                <input type="text" id="simulator-capital" style="padding: 4px; border: 1px solid #555; border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff;">

                <label for="simulator-max-streak">Max L Streak:</label>
                <input type="number" id="simulator-max-streak" style="padding: 4px; border: 1px solid #555; border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff;">

                <label for="simulator-matches">Matches per Session:</label>
                <input type="number" id="simulator-matches" style="padding: 4px; border: 1px solid #555; border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff;">

                <label for="simulator-sessions">Number of Sessions:</label>
                <input type="number" id="simulator-sessions" style="padding: 4px; border: 1px solid #555; border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff;">
            </div>

            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-top: 10px;">
                <input type="checkbox" id="simulator-dynamic-toggle">
                <label for="simulator-dynamic-toggle" style="cursor: pointer;">Import Bets from Dynamic Calculator</label>
            </div>

            <div id="simulator-manual-bets-container" style="display: none; flex-direction: column; gap: 4px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label for="simulator-manual-bets">Manual Bets (comma-separated):</label>
                    <button id="simulator-copy-dynamic-btn" title="Copy the current bets from the Dynamic Calculator into this text box." style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid #555; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 11px;">↙️ Copy from Dynamic</button>
                </div>
                <textarea id="simulator-manual-bets" rows="3" style="padding: 4px; border: 1px solid #555; border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff; font-family: monospace; resize: vertical;"></textarea>
            </div>
        </div>
    `;



        const statsDisplayPanel = document.createElement('div');
        Object.assign(statsDisplayPanel.style, {
            display: 'none',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px 10px 12px 0',
            width: '360px',
            maxHeight: '80vh',
            overflowY: 'auto'
        });
        panel.appendChild(statsDisplayPanel);

        const statsDisplayTitle = document.createElement('div');
        statsDisplayTitle.textContent = 'Statistics & Graph';
        Object.assign(statsDisplayTitle.style, { fontSize: '16px', fontWeight: 'bold' });

        const backButtonStats = document.createElement('button');
        backButtonStats.textContent = '← Back';
        Object.assign(backButtonStats.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
        backButtonStats.onmouseenter = () => backButtonStats.style.background = 'rgba(255,255,255,0.2)';
        backButtonStats.onmouseleave = () => backButtonStats.style.background = 'rgba(255,255,255,0.1)';
        backButtonStats.onclick = () => { showStatsPanel = false; refreshAll(); };

        // --- Create all stats elements first ---
        const statsSummaryDiv = document.createElement('div');
        Object.assign(statsSummaryDiv.style, { fontSize: '12px', display: 'flex', justifyContent: 'space-around', padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' });

        const lifetimeStreaksDiv = document.createElement('div');
        lifetimeStreaksDiv.id = 'rr-lifetime-streaks-display';
        Object.assign(lifetimeStreaksDiv.style, {
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '6px',
            marginTop: '8px',
            borderTop: '1px solid #444'
        });

        const timeframeContainer = document.createElement('div');
        Object.assign(timeframeContainer.style, { display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '8px' });

        const graphCanvas = document.createElement('canvas');
        graphCanvas.id = 'rr-graph-canvas';
        graphCanvas.width = 350;
        graphCanvas.height = 200;
        Object.assign(graphCanvas.style, { background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginTop: '8px' });

        const breakdownParentContainer = document.createElement('div');
        Object.assign(breakdownParentContainer.style, {
            display: 'flex',
            gap: '10px',
            marginTop: '8px',
            alignItems: 'flex-start'
        });

        const profitBreakdownDiv = document.createElement('div');
        profitBreakdownDiv.id = 'rr-profit-breakdown';
        Object.assign(profitBreakdownDiv.style, {
            flex: '1', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px',
            padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px',
            maxHeight: '150px', overflowY: 'auto'
        });

        // --- Reworked Streak Breakdown Container ---
        const streakBreakdownDiv = document.createElement('div');
        streakBreakdownDiv.id = 'rr-streak-breakdown';
        Object.assign(streakBreakdownDiv.style, {
            flex: '1', display: 'flex', flexDirection: 'column', padding: '8px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '4px'
        });

        const streakTitle = document.createElement('h4');
        streakTitle.textContent = 'Streaks';
        Object.assign(streakTitle.style, { margin: '0 0 8px 0', textAlign: 'center', color: '#ccc' });

        const streakToggleContainer = document.createElement('div');
        Object.assign(streakToggleContainer.style, { textAlign: 'center', marginBottom: '8px' });

        const winStreakToggle = document.createElement('span');
        winStreakToggle.id = 'win-streak-toggle';
        winStreakToggle.textContent = '🔥';
        winStreakToggle.title = 'Show Win Streaks';
        Object.assign(winStreakToggle.style, { cursor: 'pointer', fontSize: '20px', margin: '0 10px', transition: 'opacity 0.2s, transform 0.2s' });

        const lossStreakToggle = document.createElement('span');
        lossStreakToggle.id = 'loss-streak-toggle';
        lossStreakToggle.textContent = '💀';
        lossStreakToggle.title = 'Show Loss Streaks';
        Object.assign(lossStreakToggle.style, { cursor: 'pointer', fontSize: '20px', margin: '0 10px', transition: 'opacity 0.2s, transform 0.2s' });

        const streakSeparator = document.createElement('span');
        streakSeparator.textContent = '|';
        Object.assign(streakSeparator.style, { color: '#555', fontSize: '18px' });

        winStreakToggle.onclick = () => { streakBreakdownView = 'win'; localStorage.setItem(STREAK_VIEW_KEY, 'win'); updateGraph(); };
        lossStreakToggle.onclick = () => { streakBreakdownView = 'loss'; localStorage.setItem(STREAK_VIEW_KEY, 'loss'); updateGraph(); };

        const streakListContainer = document.createElement('div');
        streakListContainer.id = 'rr-streak-list';
        Object.assign(streakListContainer.style, { maxHeight: '105px', overflowY: 'auto' });

        const graphTooltipDisplay = document.createElement('div');
        graphTooltipDisplay.id = 'rr-graph-tooltip-display';
        Object.assign(graphTooltipDisplay.style, {
            display: 'none', padding: '8px', marginTop: '10px', background: 'rgba(0,0,0,0.3)',
            borderRadius: '6px', border: '1px solid #555', textAlign: 'center', fontSize: '12px',
            fontFamily: 'monospace', transition: 'opacity 0.2s', color: '#ddd'
        });

        // --- Assemble the stats panel in the correct, final order ---
        statsDisplayPanel.appendChild(statsDisplayTitle);
        statsDisplayPanel.appendChild(backButtonStats);
        statsDisplayPanel.appendChild(statsSummaryDiv); // Reverted to old layout
        statsDisplayPanel.appendChild(lifetimeStreaksDiv); // Reverted to old layout
        statsDisplayPanel.appendChild(timeframeContainer);
        statsDisplayPanel.appendChild(graphCanvas);

                // --- NEW: Container for Date Navigation (Under Graph) ---
        const graphNavigationDiv = document.createElement('div');
        graphNavigationDiv.id = 'rr-graph-navigation';
        Object.assign(graphNavigationDiv.style, { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '15px', 
            marginTop: '8px', 
            padding: '5px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '4px' 
        });
        statsDisplayPanel.appendChild(graphNavigationDiv);
        // -------------------------------------------------------


streakToggleContainer.appendChild(winStreakToggle);
        streakToggleContainer.appendChild(streakSeparator);
        streakToggleContainer.appendChild(lossStreakToggle);
        streakBreakdownDiv.appendChild(streakTitle);
        streakBreakdownDiv.appendChild(streakToggleContainer);
        streakBreakdownDiv.appendChild(streakListContainer);
        breakdownParentContainer.appendChild(profitBreakdownDiv);
        breakdownParentContainer.appendChild(streakBreakdownDiv);
        statsDisplayPanel.appendChild(breakdownParentContainer);

        statsDisplayPanel.appendChild(graphTooltipDisplay);


        const timeframes = [
            { label: '1D', days: 1 }, { label: '7D', days: 7 }, { label: '1M', days: 30 },
            { label: '6M', days: 182 }, { label: '1Y', days: 365 }, { label: '5Y', days: 1825 }
        ];


        timeframes.forEach(tf => {
            const btn = document.createElement('button');
            btn.textContent = tf.label;
            btn.dataset.days = tf.days;
            btn.title = `Show stats for the last ${tf.label}`;
            Object.assign(btn.style, {
                background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #555',
                borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '11px'
            });
            btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.2)';
            btn.onmouseleave = () => { if(currentStatsTimeframe != tf.days) btn.style.background = 'rgba(255,255,255,0.1)'; };
            // ... inside timeframes.forEach loop ...
            btn.onclick = () => {
                currentStatsTimeframe = tf.days;
                chartPageOffset = 0; // <--- ADD THIS LINE (Reset to "Today/Current" when switching modes)
                updateGraph();
            };
            // ...

            timeframeContainer.appendChild(btn);
        });

        // --- Core Functions ---
        const saveMinimized = () => localStorage.setItem(MINIMIZE_KEY, JSON.stringify(isMinimized));
        const saveResults = () => localStorage.setItem(STORAGE, JSON.stringify(results));
        const saveTotalProfit = () => localStorage.setItem(PROFIT_STORAGE, totalProfit.toString());
        const saveCollapsed = () => localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed));
        const saveManualBets = () => localStorage.setItem(MANUAL_BETS_STORAGE_KEY, JSON.stringify(manualBets));
        const saveDynamicBetsSettings = () => localStorage.setItem(DYNAMIC_BETS_SETTINGS_KEY, JSON.stringify(dynamicBetsSettings));
        const saveSessionState = () => {
            localStorage.setItem(SESSION_ACTIVE_KEY, JSON.stringify(isSessionActive));
            localStorage.setItem(SESSION_PROFIT_KEY, sessionProfit.toString());
            localStorage.setItem(SESSION_START_KEY, sessionStartDate.toString());
        };

        // --- ADD THIS ENTIRE NEW FUNCTION ---
        function calculateLifetimeStreaks() {
            let maxWinStreak = 0;
            let maxLossStreak = 0;
            let currentWinStreak = 0;
            let currentLossStreak = 0;

            // Iterate backwards from the most recent game
            for (let i = results.length - 1; i >= 0; i--) {
                if (results[i].result === 'win') {
                    currentWinStreak++;
                    currentLossStreak = 0; // Reset loss streak
                } else {
                    currentLossStreak++;
                    currentWinStreak = 0; // Reset win streak
                }

                if (currentWinStreak > maxWinStreak) {
                    maxWinStreak = currentWinStreak;
                }
                if (currentLossStreak > maxLossStreak) {
                    maxLossStreak = currentLossStreak;
                }
            }
            return { maxWinStreak, maxLossStreak };
        }


        let syncCountdownInterval = null; // Variable to hold our new timer

        /**
 * Updates the sync countdown timer display in the UI.
 */
        function updateSyncTimer() {
            const timerDisplay = document.getElementById('rr-sync-timer');
            if (!timerDisplay) return;

            if (!apiKey || lastSyncTime === 0) {
                timerDisplay.textContent = 'Auto-sync inactive';
                return;
            }

            // It now also uses the central constant, ensuring the countdown is always accurate.
            const nextSyncTime = lastSyncTime + API_SYNC_INTERVAL_MS;
            const now = Date.now();
            const secondsLeft = Math.round((nextSyncTime - now) / 1000);

            if (secondsLeft > 0) {
                timerDisplay.textContent = `Next sync: ${secondsLeft}s`;
            } else {
                timerDisplay.textContent = 'Syncing now...';
            }
        }


        function toggleSession() {
            if (isSessionActive) {
                // Stopping the session
                isSessionActive = false;
                if (confirm('Do you want to stop the current session? Your session profit will be reset the next time you start.')) {
                    // User confirmed stop
                } else {
                    // User cancelled, so we revert the state
                    isSessionActive = true;
                    return; // Exit without changes
                }
            } else {
                // Starting a new session
                isSessionActive = true;
                sessionProfit = 0;
                sessionStartDate = Date.now();
            }
            saveSessionState();
            refreshAll(); // Update the UI immediately
        }

        // Attach the function to the button after the UI is created
        // Place this line right after you define the sessionButton
        sessionButton.onclick = toggleSession;

        /**
 * Call this function whenever a new game result is recorded.
 * @param {string} result - Should be 'win' or 'lose'.
 * @param {number} betAmount - The amount of money that was bet.
 * @param {object} additionalData - Any other data like timestamp, origin, etc.
 */

        function calculateProfitBreakdown(games, timeframeInDays, offset = 0) {
            const breakdown = [];
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();
            const currentDate = now.getUTCDate();
            
            // Define one day in milliseconds
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;

            // 1. Determine Start and End Timestamps (UTC)
            let startTimestamp, endTimestamp;
            let periodType = '';

            if (timeframeInDays === 1) {
                // --- 1 DAY VIEW (4-Hour Blocks) ---
                periodType = '4-hour';
                // Start: 00:00 UTC of target day
                startTimestamp = Date.UTC(currentYear, currentMonth, currentDate + offset);
                // End: 00:00 UTC of next day
                endTimestamp = Date.UTC(currentYear, currentMonth, currentDate + offset + 1);

            } else if (timeframeInDays === 7) {
                // --- 7 DAY VIEW (Daily, Mon-Sun) ---
                periodType = 'day';
                let dayOfWeek = now.getUTCDay(); 
                if (dayOfWeek === 0) dayOfWeek = 7; // Fix Sunday
                const daysToMonday = dayOfWeek - 1;
                
                // Calculate Monday of the current week, then shift by offset
                const currentMonday = Date.UTC(currentYear, currentMonth, currentDate - daysToMonday);
                startTimestamp = currentMonday + (offset * 7 * ONE_DAY_MS);
                endTimestamp = startTimestamp + (7 * ONE_DAY_MS);

            } else if (timeframeInDays === 30) {
                // --- MONTH VIEW (Daily, 1st-End) ---
                periodType = 'day';
                // Start: 1st of Target Month
                startTimestamp = Date.UTC(currentYear, currentMonth + offset, 1);
                // End: 1st of Next Month
                endTimestamp = Date.UTC(currentYear, currentMonth + offset + 1, 1);

            } else if (timeframeInDays === 365) {
                // --- YEAR VIEW (Quarterly) ---
                periodType = 'quarter';
                // Start: Jan 1st of Target Year
                startTimestamp = Date.UTC(currentYear + offset, 0, 1);
                // End: Jan 1st of Next Year
                endTimestamp = Date.UTC(currentYear + offset + 1, 0, 1);
            } else {
                return [];
            }

            // 2. Generate Periods Loop (Safer Timestamp Math)
            if (periodType === 'quarter') {
                // Special handling for Quarters (3 months each)
                const startYear = new Date(startTimestamp).getUTCFullYear();
                for (let q = 0; q < 4; q++) {
                    const qStart = Date.UTC(startYear, q * 3, 1);
                    const qEnd = Date.UTC(startYear, (q + 1) * 3, 1); // 1st of next block
                    // End of quarter for display (last ms of previous block)
                    const displayEnd = new Date(qEnd - 1); 
                    const displayStart = new Date(qStart);

                    const label = `Q${q+1} (${displayStart.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })} - ${displayEnd.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })})`;
                    
                    breakdown.push({ label: label, start: qStart, end: qEnd });
                }
                // Reverse to show Q4 at top, Q1 at bottom
                breakdown.reverse();

            } else if (periodType === '4-hour') {
                // Loop 6 times (4 hours * 6 = 24 hours)
                for (let t = startTimestamp; t < endTimestamp; t += (4 * 60 * 60 * 1000)) {
                    const pStart = new Date(t);
                    const pEnd = new Date(t + (4 * 60 * 60 * 1000));
                    const label = `${pStart.getUTCHours().toString().padStart(2, '0')}:00 - ${pEnd.getUTCHours().toString().padStart(2, '0')}:00`;
                    
                    // We push to array, then reverse later so newest time is top
                    breakdown.push({ label: label, start: t, end: t + (4 * 60 * 60 * 1000) });
                }
                breakdown.reverse();

            } else {
                // --- DAILY LOOPS (For Week and Month views) ---
                // Loop day by day
                for (let t = startTimestamp; t < endTimestamp; t += ONE_DAY_MS) {
                    const dateObj = new Date(t);
                    let label = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
                    
                    if (timeframeInDays === 30) {
                        label = dateObj.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', timeZone: 'UTC' });
                    }

                    breakdown.push({ label: label, start: t, end: t + ONE_DAY_MS });
                }
                // Reverse so the last day of the month/week is at the top
                breakdown.reverse();
            }

            // 3. Calculate Profit
            // Pre-calculate game results once for performance
            const resultsWithProfit = breakdown.map(p => {
                let pProfit = 0;
                // Optimization: Only iterate relevant portion of games array? 
                // For now, simple filter is safe enough for <100k games.
                for (const g of games) {
                    const gTime = g.timestamp * 1000;
                    if (gTime >= p.start && gTime < p.end) {
                        pProfit += (g.result === 'win' ? g.bet : -g.bet);
                    }
                }
                return { label: p.label, profit: pProfit };
            });

            return resultsWithProfit;
        }



        function refreshSimulatorView() {
            const mainView = document.getElementById('simulator-main-view');
            const configView = document.getElementById('simulator-config-view');
            if (!mainView || !configView) return;

            if (showSimulatorConfig) {
                mainView.style.display = 'none';
                configView.style.display = 'flex';
            } else {
                mainView.style.display = 'block';
                configView.style.display = 'none';
            }
        }


        /**
 * Generates a random sequence of Win/Loss outcomes.
 * @param {number} count The number of matches in the sequence.
 * @returns {string[]} An array like ['W', 'L', 'L', 'W', ...]
 */
        function generateOutcomes(count) {
            const outcomes = [];
            for (let i = 0; i < count; i++) {
                outcomes.push(Math.random() < 0.5 ? 'W' : 'L');
            }
            return outcomes;
        }


        /**
 * Samples a large dataset to a more manageable size for graphing.
 * @param {number[]} data The full array of capital history.
 * @param {number} maxPoints The maximum number of points for the graph.
 * @returns {number[]} The smaller, sampled array.
 */
        function sampleData(data, maxPoints) {
            if (data.length <= maxPoints) {
                return data; // No sampling needed if data is already small
            }
            const sampled = [];
            const step = (data.length - 1) / (maxPoints - 1);
            for (let i = 0; i < maxPoints; i++) {
                sampled.push(data[Math.floor(i * step)]);
            }
            return sampled;
        }


        /**
 * "Replays" a pre-generated timeline of outcomes with a specific strategy.
 * @param {object} params Parameters including capital, bets, outcomes, and the specific maxLStreak to test.
 * @returns {object} The final result { finalCapital, bankrupt: boolean }.
 */
        function replaySessionWithLimit(params) {
            const { capital, bets, outcomes, maxLStreak } = params;
            let currentCapital = capital;
            let currentLStreak = 0;

            for (const outcome of outcomes) {
                const betIndex = currentLStreak;
                const currentBet = bets[betIndex];

                if (!currentBet || currentBet > currentCapital) {
                    // Bankruptcy occurred during this replay.
                    return { finalCapital: currentCapital, bankrupt: true };
                }

                if (outcome === 'W') {
                    currentCapital += currentBet;
                    currentLStreak = 0;
                } else { // Outcome is 'L'
                    currentCapital -= currentBet;
                    currentLStreak++;
                }

                if (currentLStreak >= maxLStreak) {
                    // A reset occurs according to the rule being tested.
                    currentLStreak = 0;
                }
            }
            // If the loop completes, the session was successful for this rule.
            return { finalCapital: currentCapital, bankrupt: false };
        }


        function runMatchByMatchSimulation(params) {
            const { capital, maxLStreak, bets, matches, initialStreak = 0 } = params;
            if (!capital || !maxLStreak || !bets || bets.length === 0 || !matches) {
                return { error: "Invalid simulation parameters. Check all inputs." };
            }
            let currentCapital = capital;
            let currentLStreak = initialStreak;
            let resetCount = 0;
            const streakCounts = {};
            const capitalHistory = [capital];
            for (let i = 0; i < matches; i++) {
                const betIndex = currentLStreak;
                const currentBet = bets[betIndex];
                if (!currentBet || currentBet > currentCapital) {
                    return {
                        finalCapital: currentCapital, streakCounts, resetCount, capitalHistory,
                        matchesCompleted: i,
                        stopReason: `Bankrupt at Match #${i + 1}.`,
                        unfinishedStreak: currentLStreak,
                        finalStreak: currentLStreak
                    };
                }
                const isWin = Math.random() < 0.5;
                if (isWin) {
                    currentCapital += currentBet;
                    if (currentLStreak > 0) {
                        streakCounts[currentLStreak] = (streakCounts[currentLStreak] || 0) + 1;
                    }
                    currentLStreak = 0;
                } else {
                    currentCapital -= currentBet;
                    currentLStreak++;
                }
                capitalHistory.push(currentCapital);
                if (currentLStreak >= maxLStreak) {
                    streakCounts[currentLStreak] = (streakCounts[currentLStreak] || 0) + 1;
                    resetCount++;
                    currentLStreak = 0;
                }
            }
            return {
                finalCapital: currentCapital, streakCounts, resetCount, capitalHistory,
                matchesCompleted: matches,
                stopReason: `Simulation completed successfully.`,
                unfinishedStreak: 0,
                finalStreak: currentLStreak
            };
        }


        function runMultipleSimulations(params) {
            const { capital, maxLStreak, bets, matches, sessions } = params;
            const allSessionResults = [];
            for (let i = 0; i < sessions; i++) {
                const result = runMatchByMatchSimulation({ capital, maxLStreak, bets, matches });
                allSessionResults.push(result);
            }
            const totalResets = allSessionResults.reduce((sum, r) => sum + r.resetCount, 0);
            const finalCapitals = allSessionResults.map(r => r.finalCapital);
            const totalProfit = finalCapitals.reduce((sum, cap) => sum + (cap - capital), 0);
            const bankruptcies = allSessionResults.filter(r => r.stopReason.startsWith('Bankrupt')).length;
            const profitableSessions = allSessionResults.filter(r => r.finalCapital > capital).length;
            const aggregateStreaks = {};
            const bankruptcyStreaks = {};
            allSessionResults.forEach(r => {
                for (const [streak, count] of Object.entries(r.streakCounts)) {
                    aggregateStreaks[streak] = (aggregateStreaks[streak] || 0) + count;
                }
                if (r.unfinishedStreak > 0) {
                    bankruptcyStreaks[r.unfinishedStreak] = (bankruptcyStreaks[r.unfinishedStreak] || 0) + 1;
                }
            });
            finalCapitals.sort((a, b) => a - b);
            const mid = Math.floor(sessions / 2);
            const medianCapital = sessions % 2 !== 0 ? finalCapitals[mid] : (finalCapitals[mid - 1] + finalCapitals[mid]) / 2;
            const mostCommonFailure = Object.entries(bankruptcyStreaks).sort((a, b) => b[1] - a[1])[0];
            return {
                sessions, totalResets,
                bankruptRate: (bankruptcies / sessions) * 100,
                profitableRate: (profitableSessions / sessions) * 100,
                averageProfit: totalProfit / sessions,
                medianProfit: medianCapital - capital,
                aggregateStreaks,
                mostCommonFailure: mostCommonFailure ? `L${mostCommonFailure[0]} (${mostCommonFailure[1]} times)` : 'N/A'
            };
        }



        // Add this new function right after runMultipleSimulations

        function runCumulativeSimulation(params) {
            const { capital, maxLStreak, bets, matches, sessions } = params;
            let currentCapital = capital;
            let currentLStreak = 0;
            let resetCount = 0;
            const streakCounts = {};
            const capitalHistory = [capital];
            const totalMatchesToRun = matches * sessions;
            for (let i = 0; i < totalMatchesToRun; i++) {
                const betIndex = currentLStreak;
                const currentBet = bets[betIndex];
                if (!currentBet || currentBet > currentCapital) {
                    return {
                        finalCapital: currentCapital, capitalHistory, resetCount, streakCounts,
                        stopReason: `Bankrupt at Match #${i + 1}.`,
                    };
                }
                const isWin = Math.random() < 0.5;
                if (isWin) {
                    currentCapital += currentBet;
                    if (currentLStreak > 0) {
                        streakCounts[currentLStreak] = (streakCounts[currentLStreak] || 0) + 1;
                    }
                    currentLStreak = 0;
                } else {
                    currentCapital -= currentBet;
                    currentLStreak++;
                }
                capitalHistory.push(currentCapital);
                if (currentLStreak >= maxLStreak) {
                    streakCounts[currentLStreak] = (streakCounts[currentLStreak] || 0) + 1;
                    resetCount++;
                    currentLStreak = 0;
                }
            }
            return {
                finalCapital: currentCapital, capitalHistory, resetCount, streakCounts,
                stopReason: `Simulation completed successfully.`,
            };
        }

        function runDeepMatchSimulation(params) {
            const { capital, bets, matches } = params;
            let currentCapital = capital;
            let currentLStreak = 0;
            const streakOutcomes = []; // This will log every streak { length, outcome: 'win' or 'bankrupt' }

            for (let i = 0; i < matches; i++) {
                const betIndex = currentLStreak;
                const currentBet = bets[betIndex];

                if (!currentBet || currentBet > currentCapital) {
                    // This is a bankruptcy. Log the streak that caused it.
                    if (currentLStreak > 0) {
                        streakOutcomes.push({ length: currentLStreak, outcome: 'bankrupt' });
                    }
                    return streakOutcomes; // End of this simulation run
                }

                const isWin = Math.random() < 0.5;

                if (isWin) {
                    currentCapital += currentBet;
                    if (currentLStreak > 0) {
                        // We won, so the streak ended successfully.
                        streakOutcomes.push({ length: currentLStreak, outcome: 'win' });
                    }
                    currentLStreak = 0;
                } else {
                    currentCapital -= currentBet;
                    currentLStreak++;
                }
            }
            return streakOutcomes; // Return all streaks from the completed session
        }


        function runDeepAnalysis(params) {
            const { capital, bets, matches, simulations } = params;

            // This object will store the summed results for each limit across all simulations.
            const resultsByLimit = {};
            const maxStreakToAnalyze = bets.length;

            // 1. Main Simulation Loop (e.g., 100 times)
            for (let i = 0; i < simulations; i++) {
                // Generate one master timeline of W/L outcomes
                const outcomes = generateOutcomes(matches);
                let maxStreakInThisTimeline = 0;

                // Find the longest streak in this specific timeline to cap the inner loop
                let currentLStreak = 0;
                for (const outcome of outcomes) {
                    if (outcome === 'L') {
                        currentLStreak++;
                    } else {
                        if (currentLStreak > maxStreakInThisTimeline) {
                            maxStreakInThisTimeline = currentLStreak;
                        }
                        currentLStreak = 0;
                    }
                }
                if (currentLStreak > maxStreakInThisTimeline) {
                    maxStreakInThisTimeline = currentLStreak;
                }


                // 2. Inner "What If" Loop
                // Replay the master timeline for each possible Max L Streak rule
                for (let limit = 4; limit <= maxStreakInThisTimeline + 1 && limit < maxStreakToAnalyze; limit++) {
                    if (!resultsByLimit[limit]) {
                        resultsByLimit[limit] = { totalProfit: 0, bankruptcies: 0 };
                    }

                    const result = replaySessionWithLimit({ capital, bets, outcomes, maxLStreak: limit });

                    // Add the results of this replay to the totals
                    resultsByLimit[limit].totalProfit += (result.finalCapital - capital);
                    if (result.bankrupt) {
                        resultsByLimit[limit].bankruptcies++;
                    }
                }
            }

            // 3. Final Aggregation
            const finalAnalysis = [];
            for (const limit in resultsByLimit) {
                const data = resultsByLimit[limit];
                finalAnalysis.push({
                    limit: parseInt(limit, 10),
                    avgProfit: data.totalProfit / simulations,
                    bankRate: (data.bankruptcies / simulations) * 100
                });
            }

            return finalAnalysis;
        }



        function calculateStreakBreakdown(allResults) {
            if (allResults.length === 0) {
                return { winStreaks: [], lossStreaks: [] };
            }

            const winStreakCounts = {};
            const lossStreakCounts = {};
            let currentStreakLength = 0;
            let currentStreakType = '';

            // Iterate through all results to count streaks
            allResults.slice().reverse().forEach(result => {
                if (result.result === currentStreakType) {
                    currentStreakLength++;
                } else {
                    // Streak is broken, record the previous one if it existed
                    if (currentStreakLength > 0) {
                        if (currentStreakType === 'win') {
                            winStreakCounts[currentStreakLength] = (winStreakCounts[currentStreakLength] || 0) + 1;
                        } else {
                            lossStreakCounts[currentStreakLength] = (lossStreakCounts[currentStreakLength] || 0) + 1;
                        }
                    }
                    // Start the new streak
                    currentStreakType = result.result;
                    currentStreakLength = 1;
                }
            });

            // Record the very last streak after the loop finishes
            if (currentStreakLength > 0) {
                if (currentStreakType === 'win') {
                    winStreakCounts[currentStreakLength] = (winStreakCounts[currentStreakLength] || 0) + 1;
                } else {
                    lossStreakCounts[currentStreakLength] = (lossStreakCounts[currentStreakLength] || 0) + 1;
                }
            }

            const totalWinStreaks = Object.values(winStreakCounts).reduce((a, b) => a + b, 0);
            const totalLossStreaks = Object.values(lossStreakCounts).reduce((a, b) => a + b, 0);

            const formatStreaks = (counts, total) => {
                return Object.entries(counts)
                    .map(([length, count]) => ({
                    length: parseInt(length, 10),
                    count,
                    percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
                }))
                    .sort((a, b) => a.length - b.length);
            };

            return {
                winStreaks: formatStreaks(winStreakCounts, totalWinStreaks),
                lossStreaks: formatStreaks(lossStreakCounts, totalLossStreaks)
            };
        }


        function updateGraph() {
            // 1. Destroy old chart
            if (rrChart) {
                rrChart.destroy();
                rrChart = null;
            }

            // 2. Get Data
            const { dataPoints, summary } = processDataForGraph(currentStatsTimeframe);

            // 3. Prepare Colors
            const profitSign = summary.totalProfit >= 0 ? '+' : '-';
            const profitColor = summary.totalProfit >= 0 ? '#4CAF50' : '#E53935';
            
            // 4. Update Summary HTML (TOP - STATS ONLY)
            // This restores the "Old" look for the top section
            statsSummaryDiv.innerHTML = `
                <span title="Total profit/loss for this period" style="color:${profitColor}; font-weight: bold;">${profitSign}$${formatNumberToKMB(Math.abs(summary.totalProfit))}</span>
                <span title="Wins / Losses">W/L: ${summary.wins} / ${summary.losses}</span>
                <span title="Total games played">Games: ${summary.totalGames}</span>
            `;

            // 5. Update Navigation HTML (BOTTOM - BUTTONS ONLY)
            // We target the new container we created in Step 1
            const navContainer = document.getElementById('rr-graph-navigation');
            if (navContainer) {
                navContainer.innerHTML = `
                    <button id="chart-prev-btn" title="Previous Period" style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; color: #fff; cursor: pointer; font-size: 14px; padding: 2px 10px;">◀</button>
                    
                    <span style="font-weight: bold; color: #fff; font-size: 13px; min-width: 140px; text-align: center;">${summary.rangeLabel || 'Current Period'}</span>
                    
                    <button id="chart-next-btn" title="Next Period" style="background: rgba(255,255,255,0.1); border: 1px solid ${chartPageOffset === 0 ? '#333' : '#555'}; border-radius: 4px; color: ${chartPageOffset === 0 ? '#555' : '#fff'}; cursor: ${chartPageOffset === 0 ? 'default' : 'pointer'}; font-size: 14px; padding: 2px 10px;" ${chartPageOffset === 0 ? 'disabled' : ''}>▶</button>
                `;

                // Bind Button Events
                document.getElementById('chart-prev-btn').onclick = () => {
                    chartPageOffset--; 
                    updateGraph();
                };
                document.getElementById('chart-next-btn').onclick = () => {
                    if (chartPageOffset < 0) { 
                        chartPageOffset++; 
                        updateGraph();
                    }
                };
            }

            // 6. Handle Profit Breakdown 
            const profitBreakdownContainer = document.getElementById('rr-profit-breakdown');
            if(profitBreakdownContainer) {
                 // NOW: We pass the 'chartPageOffset' to the function!
                 const profitBreakdownData = calculateProfitBreakdown(results, currentStatsTimeframe, chartPageOffset);
                 
                 if (profitBreakdownData.length > 0) {
                    profitBreakdownContainer.style.display = 'flex';
                    profitBreakdownContainer.innerHTML = `<h4 style="margin: 0 0 5px 0; text-align: center; color: #ccc;">Profit Breakdown</h4>` +
                        profitBreakdownData.map(item => {
                        const itemProfitSign = item.profit >= 0 ? '+' : '-';
                        const itemProfitColor = item.profit >= 0 ? '#4CAF50' : '#E53935';
                        const formattedProfit = `$${formatNumberToKMB(Math.abs(item.profit))}`;
                        return `
                        <div style="display: flex; justify-content: space-between; padding: 2px 4px; border-bottom: 1px solid #333;">
                            <span>${item.label}:</span>
                            <span style="color: ${itemProfitColor}; font-weight: bold;">${itemProfitSign}${formattedProfit}</span>
                        </div>`;
                    }).join('');
                } else {
                    // Show N/A if no data, but the box is still active
                    profitBreakdownContainer.innerHTML = `<h4 style="margin: 0 0 5px 0; text-align: center; color: #ccc;">Profit Breakdown</h4><div style="text-align:center; color: #888;">No games in this period</div>`;
                }
            }


            // 7. Handle Streak Breakdown
            const streakData = calculateStreakBreakdown(results);
            const listContainer = document.getElementById('rr-streak-list');
            const buildStreakTable = (data) => {
                let tableHTML = `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; font-size: 10px; color: #888; margin-bottom: 4px;"><span>Streak</span><span>Count</span><span>Freq.</span></div>`;
                if (data.length > 0) {
                    tableHTML += data.map(s => `
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; padding: 1px 0;">
                        <span>${s.length}</span>
                        <span>${s.count}x</span>
                        <span>${s.percentage}%</span>
                    </div>`).join('');
                } else {
                    tableHTML += `<div style="text-align:center; color: #888; padding: 5px 0;">No streaks recorded.</div>`;
                }
                return tableHTML;
            };

            if (listContainer) {
                if (streakBreakdownView === 'win') listContainer.innerHTML = buildStreakTable(streakData.winStreaks);
                else listContainer.innerHTML = buildStreakTable(streakData.lossStreaks);
            }

            // 8. Handle Lifetime Streaks
            const { maxWinStreak, maxLossStreak } = calculateLifetimeStreaks();
            const lifetimeStreaksDisplay = document.getElementById('rr-lifetime-streaks-display');
            if (lifetimeStreaksDisplay) {
                lifetimeStreaksDisplay.innerHTML = `
                <span title="Longest lifetime winning streak">🔥 Max W-Streak: <b>${maxWinStreak}</b></span>
                <span title="Longest lifetime losing streak">💀 Max L-Streak: <b>${maxLossStreak}</b></span>
                `;
            }

            // 9. Draw Chart
            const graphTooltipDisplay = document.getElementById('rr-graph-tooltip-display');
            rrChart = new RrChart(graphCanvas, dataPoints, graphTooltipDisplay);

            // 10. Update Active Buttons Style
            const tfContainer = statsDisplayPanel.querySelector('div:nth-child(4)') || timeframeContainer; 
            if(tfContainer) {
                tfContainer.querySelectorAll('button').forEach(btn => {
                    if (parseInt(btn.dataset.days, 10) === currentStatsTimeframe) {
                        btn.style.background = 'rgba(100, 180, 255, 0.3)';
                        btn.style.borderColor = '#64B4FF';
                    } else {
                        btn.style.background = 'rgba(255,255,255,0.1)';
                        btn.style.borderColor = '#555';
                    }
                });
            }
        }


        function processDataForGraph(timeframeInDays) {
            // 1. Setup Torn Time (UTC) Anchor
            const now = new Date();
            // We align everything to UTC because Torn Time is UTC.
            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();
            const currentDate = now.getUTCDate();
            
            // This will determine our window start/end
            let startTime, endTime;
            let rangeLabel = "";

            // 2. Calculate Calendar Windows based on Offset
            if (timeframeInDays === 1) {
                // --- DAY VIEW (Daily) ---
                // Start: 00:00 UTC of the target day
                const targetDate = new Date(Date.UTC(currentYear, currentMonth, currentDate + chartPageOffset));
                startTime = targetDate.getTime();
                
                // End: 23:59:59 UTC of the target day (Start of next day)
                const nextDate = new Date(Date.UTC(currentYear, currentMonth, currentDate + chartPageOffset + 1));
                endTime = nextDate.getTime();

                // Label: "Jan 15"
                rangeLabel = targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

            } else if (timeframeInDays === 7) {
                // --- WEEK VIEW (Mon-Sun) ---
                // Find current Monday UTC
                // getUTCDay(): 0 is Sunday, 1 is Monday.
                let dayOfWeek = now.getUTCDay(); 
                if (dayOfWeek === 0) dayOfWeek = 7; // Make Sunday 7 so we can subtract easily
                const daysToMonday = dayOfWeek - 1;

                const startOfCurrentWeek = new Date(Date.UTC(currentYear, currentMonth, currentDate - daysToMonday));
                
                // Shift by offset weeks (offset * 7 days)
                const startOfTargetWeek = new Date(startOfCurrentWeek.getTime() + (chartPageOffset * 7 * 24 * 60 * 60 * 1000));
                
                startTime = startOfTargetWeek.getTime();
                endTime = startTime + (7 * 24 * 60 * 60 * 1000); // +7 Days

                // Label: "Jan 1 - Jan 7"
                const endLabelDate = new Date(endTime - 1);
                rangeLabel = `${startOfTargetWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} - ${endLabelDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`;

            } else if (timeframeInDays === 30) {
                // --- MONTH VIEW (1st - 31st) ---
                // Start: 1st of Target Month
                const targetMonthDate = new Date(Date.UTC(currentYear, currentMonth + chartPageOffset, 1));
                startTime = targetMonthDate.getTime();
                
                // End: 1st of Next Month
                const nextMonthDate = new Date(Date.UTC(currentYear, currentMonth + chartPageOffset + 1, 1));
                endTime = nextMonthDate.getTime();

                // Label: "January 2024"
                rangeLabel = targetMonthDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

            } else if (timeframeInDays === 365) {
                // --- YEAR VIEW (Jan 1 - Dec 31) ---
                const targetYearDate = new Date(Date.UTC(currentYear + chartPageOffset, 0, 1));
                startTime = targetYearDate.getTime();
                
                const nextYearDate = new Date(Date.UTC(currentYear + chartPageOffset + 1, 0, 1));
                endTime = nextYearDate.getTime();
                
                rangeLabel = targetYearDate.toLocaleDateString('en-GB', { year: 'numeric', timeZone: 'UTC' });

            } else {
                // --- FALLBACK (Rolling Window for weird custom days) ---
                // Just use the old logic if user sets custom day count not matching 1, 7, 30, 365
                endTime = Date.now() + (chartPageOffset * timeframeInDays * 24 * 3600 * 1000);
                startTime = endTime - (timeframeInDays * 24 * 3600 * 1000);
                rangeLabel = "Custom Range";
            }

            // 3. Filter Results (Convert timestamps to ms for comparison)
            const filteredResults = results.filter(r => {
                const rTime = r.timestamp * 1000;
                return rTime >= startTime && rTime < endTime;
            });

            // 4. Build Data Points
            // Note: We need to sort by timestamp
            filteredResults.sort((a, b) => a.timestamp - b.timestamp);

            // We must find the "Profit at Start of Period".
            // To do this, we sum up ALL profit from the beginning of time up until 'startTime'.
            let profitAtStart = 0;
            // Iterate all results, stop when we hit our window
            for (const r of results) {
                if ((r.timestamp * 1000) >= startTime) break;
                profitAtStart += (r.result === 'win' ? r.bet : -r.bet);
            }

            let cumulativeProfit = profitAtStart;
            let wins = 0;
            let losses = 0;

            const dataPoints = filteredResults.map(game => {
                const profit = game.result === 'win' ? game.bet : -game.bet;
                cumulativeProfit += profit;
                if (profit > 0) wins++;
                else losses++;
                // Convert back to seconds for the Chart class if it expects seconds, 
                // OR keep milliseconds. Your existing RrChart likely expects SECONDS based on previous code.
                return { timestamp: game.timestamp, cumulativeProfit: cumulativeProfit };
            });

            // Add an initial point at the exact start time to make the graph look correct
            // (Start of the day/week with the starting profit)
            if (dataPoints.length > 0 || profitAtStart !== 0) {
                 dataPoints.unshift({ timestamp: startTime / 1000, cumulativeProfit: profitAtStart });
            }
            
            // If the period is empty but we have history, we still want a flat line
            if (filteredResults.length === 0 && results.length > 0) {
                 // Add end point so line draws across
                 dataPoints.push({ timestamp: endTime / 1000, cumulativeProfit: profitAtStart });
            }

            const summary = {
                totalProfit: cumulativeProfit - profitAtStart, // Profit made strictly IN this period
                wins: wins,
                losses: losses,
                totalGames: wins + losses,
                rangeLabel: rangeLabel // Pass label back for the UI
            };

            return { dataPoints, summary };
        }



        // ===================================================================
        // ================== DEFINITIVE CHARTING LOGIC ======================
        // ===================================================================

        class RrChart {
            constructor(canvas, data, tooltipElement) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.data = data;
                this.tooltipElement = tooltipElement; // The HTML div for our text
                this.padding = { top: 20, right: 15, bottom: 30, left: 55 };
                this.hoveredPoint = null;

                this.handleMouseMove = this.handleMouseMove.bind(this);
                this.handleMouseOut = this.handleMouseOut.bind(this);
                this.canvas.addEventListener('mousemove', this.handleMouseMove);
                this.canvas.addEventListener('mouseout', this.handleMouseOut);

                this.calculateScales();
                this.draw();
            }

            draw() {
                const { ctx, canvas } = this;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (this.data.length < 2) {
                    this.drawEmptyMessage('Not enough data for this period.');
                    return;
                }

                this.drawGridAndAxes();
                this.drawAreaAndLine();

                if (this.hoveredPoint) {
                    this.drawHoverHighlight(this.hoveredPoint);
                }
            }

            calculateScales() {
                const { data, padding, canvas } = this;
                if (this.data.length === 0) return;

                // Use a loop to find min/max, which is safer for large arrays
                let minProfit = Infinity, maxProfit = -Infinity;
                let minTimestamp = Infinity, maxTimestamp = -Infinity;

                for (const point of data) {
                    if (point.cumulativeProfit < minProfit) minProfit = point.cumulativeProfit;
                    if (point.cumulativeProfit > maxProfit) maxProfit = point.cumulativeProfit;
                    if (point.timestamp < minTimestamp) minTimestamp = point.timestamp;
                    if (point.timestamp > maxTimestamp) maxTimestamp = point.timestamp;
                }

                const range = maxProfit - minProfit;
                if (range === 0) {
                    maxProfit += 1000;
                    minProfit -= 1000;
                }

                this.maxProfit = Math.max(maxProfit + (maxProfit - minProfit) * 0.1, 0);
                this.minProfit = Math.min(minProfit - (maxProfit - minProfit) * 0.1, 0);
                this.minTimestamp = minTimestamp;
                this.maxTimestamp = maxTimestamp;

                const timeRange = this.maxTimestamp - this.minTimestamp;
                const profitRange = this.maxProfit - this.minProfit;

                this.mapX = (ts) => padding.left + (timeRange > 0 ? ((ts - this.minTimestamp) / timeRange) * (canvas.width - padding.left - padding.right) : 0);
                this.mapY = (profit) => canvas.height - padding.bottom - (profitRange > 0 ? ((profit - this.minProfit) / profitRange) * (canvas.height - padding.top - padding.bottom) : 0);
            }


            drawEmptyMessage(message) {
                const { ctx, canvas } = this;
                ctx.save();
                ctx.fillStyle = '#888';
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(message, canvas.width / 2, canvas.height / 2);
                ctx.restore();
            }

            drawGridAndAxes() {
                const { ctx, padding, canvas } = this;
                const { width, height } = canvas;
                ctx.save();
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 1;
                ctx.font = '10px monospace';
                ctx.fillStyle = '#aaa';
                const yLabelCount = 5;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                for (let i = 0; i <= yLabelCount; i++) {
                    const profitValue = this.minProfit + (i / yLabelCount) * (this.maxProfit - this.minProfit);
                    const y = this.mapY(profitValue);
                    ctx.fillText('$' + formatNumberToKMB(profitValue, 1), padding.left - 8, y);
                    ctx.beginPath();
                    ctx.moveTo(padding.left - 4, y);
                    ctx.lineTo(width - padding.right, y);
                    ctx.stroke();
                }
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                const xLabelCount = 2;
                for (let i = 0; i <= xLabelCount; i++) {
                    const timestamp = this.minTimestamp + (i / xLabelCount) * (this.maxTimestamp - this.minTimestamp);
                    const x = this.mapX(timestamp);
                    // If the tooltipElement is null, we know it's the simulator chart
                    let labelText;
                    if (this.tooltipElement === null) {
                        labelText = `Match ${Math.round(timestamp).toLocaleString()}`;
                    } else {
                        const date = new Date(timestamp * 1000);
                        labelText = date.toLocaleDateString();
                    }
                    ctx.fillText(labelText, x, height - padding.bottom + 5);
                    // --- END OF CHANGE ---
                }

                const zeroY = this.mapY(0);
                if (zeroY > padding.top && zeroY < height - padding.bottom) {
                    ctx.setLineDash([3, 4]);
                    ctx.strokeStyle = '#888';
                    ctx.beginPath();
                    ctx.moveTo(padding.left, zeroY);
                    ctx.lineTo(width - padding.right, zeroY);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
                ctx.restore();
            }

            drawAreaAndLine() {
                const { ctx, data, canvas } = this;
                const zeroY = this.mapY(0);
                ctx.save();
                const positivePath = new Path2D();
                positivePath.moveTo(this.mapX(data[0].timestamp), zeroY);
                data.forEach(p => {
                    const yPos = Math.min(this.mapY(p.cumulativeProfit), zeroY);
                    positivePath.lineTo(this.mapX(p.timestamp), yPos);
                });
                positivePath.lineTo(this.mapX(data[data.length - 1].timestamp), zeroY);
                positivePath.closePath();
                ctx.clip(positivePath);
                ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
                ctx.save();
                const negativePath = new Path2D();
                negativePath.moveTo(this.mapX(data[0].timestamp), zeroY);
                data.forEach(p => {
                    const yPos = Math.max(this.mapY(p.cumulativeProfit), zeroY);
                    negativePath.lineTo(this.mapX(p.timestamp), yPos);
                });
                negativePath.lineTo(this.mapX(data[data.length - 1].timestamp), zeroY);
                negativePath.closePath();
                ctx.clip(negativePath);
                ctx.fillStyle = 'rgba(229, 57, 53, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
                ctx.save();
                ctx.lineWidth = 2;
                for (let i = 1; i < data.length; i++) {
                    const p1 = data[i - 1], p2 = data[i];
                    const x1 = this.mapX(p1.timestamp), y1 = this.mapY(p1.cumulativeProfit);
                    const x2 = this.mapX(p2.timestamp), y2 = this.mapY(p2.cumulativeProfit);
                    if (p1.cumulativeProfit * p2.cumulativeProfit < 0) {
                        const intersect_ts = p1.timestamp + (p2.timestamp - p1.timestamp) * (0 - p1.cumulativeProfit) / (p2.cumulativeProfit - p1.cumulativeProfit);
                        const x_intersect = this.mapX(intersect_ts), y_intersect = this.mapY(0);
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x_intersect, y_intersect);
                        ctx.strokeStyle = p1.cumulativeProfit >= 0 ? '#4CAF50' : '#E53935';
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x_intersect, y_intersect);
                        ctx.lineTo(x2, y2);
                        ctx.strokeStyle = p2.cumulativeProfit >= 0 ? '#4CAF50' : '#E53935';
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.strokeStyle = p1.cumulativeProfit >= 0 ? '#4CAF50' : '#E53935';
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }

            drawHoverHighlight(point) {
                const { ctx, canvas, padding } = this;
                const x = this.mapX(point.timestamp);
                const y = this.mapY(point.cumulativeProfit);
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, canvas.height - padding.bottom);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.arc(x, y, 5);
                ctx.fillStyle = point.cumulativeProfit >= 0 ? '#4CAF50' : '#E53935';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.restore();
            }

            handleMouseMove(e) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / panelScale;
                if (mouseX < this.padding.left || mouseX > this.canvas.width - this.padding.right) {
                    this.handleMouseOut();
                    return;
                }
                let closestPoint = null;
                let minDistance = Infinity;
                this.data.forEach(point => {
                    const x = this.mapX(point.timestamp);
                    const distance = Math.abs(x - mouseX);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPoint = point;
                    }
                });
                if (closestPoint && closestPoint !== this.hoveredPoint) {
                    this.hoveredPoint = closestPoint;
                    this.draw();
                    const profitColor = closestPoint.cumulativeProfit >= 0 ? '#4CAF50' : '#E53935';
                    const dateString = new Date(closestPoint.timestamp * 1000).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short'}); // Using a clearer format
                    this.tooltipElement.innerHTML = `
                    <div style="font-weight: bold; color: ${profitColor};">Profit: $${closestPoint.cumulativeProfit.toLocaleString()}</div>
                    <div style="font-size: 11px; color: #999; margin-top: 4px;">${dateString}</div>
                `;
                    this.tooltipElement.style.display = 'block';
                    this.tooltipElement.style.opacity = '1';
                }
            }

            handleMouseOut() {
                if (this.hoveredPoint) {
                    this.hoveredPoint = null;
                    this.draw();
                    this.tooltipElement.style.opacity = '0';
                    this.tooltipElement.style.display = 'none';
                }
            }

            destroy() {
                this.canvas.removeEventListener('mousemove', this.handleMouseMove);
                this.canvas.removeEventListener('mouseout', this.handleMouseOut);
            }
        }


        /**
 * Draws the dual-axis graph for the Deep Simulation results.
 * @param {HTMLCanvasElement} canvas The canvas to draw on.
 * @param {object[]} data The results array from runDeepAnalysis.
 */
        function drawDeepAnalysisGraph(canvas, data) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!data || data.length < 2) {
                ctx.fillStyle = '#888';
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('Not enough data to draw graph.', canvas.width / 2, canvas.height / 2);
                return;
            }

            const padding = { top: 30, right: 50, bottom: 30, left: 55 };

            // --- Calculate Scales (Dual Y-Axis) ---
            const xMin = data[0].limit;
            const xMax = data[data.length - 1].limit;

            const profitMax = Math.max(0, ...data.map(d => d.avgProfit));
            const profitMin = Math.min(0, ...data.map(d => d.avgProfit));

            const mapX = (limit) => padding.left + ((limit - xMin) / (xMax - xMin)) * (canvas.width - padding.left - padding.right);
            const mapYProfit = (profit) => canvas.height - padding.bottom - ((profit - profitMin) / (profitMax - profitMin)) * (canvas.height - padding.top - padding.bottom);
            const mapYBankRate = (rate) => canvas.height - padding.bottom - (rate / 100) * (canvas.height - padding.top - padding.bottom);

            // --- Draw Grid and Axes ---
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 1;
            ctx.font = '10px monospace';

            // Left Y-Axis (Profit)
            ctx.fillStyle = '#aaa';
            ctx.textAlign = 'right';
            for (let i = 0; i <= 5; i++) {
                const profit = profitMin + (i / 5) * (profitMax - profitMin);
                const y = mapYProfit(profit);
                ctx.fillText('$' + formatNumberToKMB(profit, 1), padding.left - 8, y);
                ctx.beginPath();
                ctx.moveTo(padding.left, y);
                ctx.lineTo(canvas.width - padding.right, y);
                ctx.stroke();
            }

            // Right Y-Axis (Bankruptcy %)
            ctx.fillStyle = '#FF9800';
            ctx.textAlign = 'left';
            for (let i = 0; i <= 5; i++) {
                const rate = (i / 5) * 100;
                const y = mapYBankRate(rate);
                ctx.fillText(`${rate.toFixed(0)}%`, canvas.width - padding.right + 8, y);
            }

            // X-Axis (Limit)
            ctx.fillStyle = '#aaa';
            ctx.textAlign = 'center';
            data.forEach(d => {
                if (d.limit % 2 === 0 || data.length < 8) { // Label more if few points
                    const x = mapX(d.limit);
                    ctx.fillText(`L${d.limit}`, x, canvas.height - padding.bottom + 15);
                }
            });

            // --- Draw Profit Area Chart ---
            const zeroY = mapYProfit(0);
            ctx.beginPath();
            ctx.moveTo(mapX(data[0].limit), zeroY);
            data.forEach(d => ctx.lineTo(mapX(d.limit), mapYProfit(d.avgProfit)));
            ctx.lineTo(mapX(data[data.length - 1].limit), zeroY);
            ctx.closePath();
            ctx.save();
            ctx.clip();
            const grad = ctx.createLinearGradient(0, mapYProfit(profitMax), 0, mapYProfit(profitMin));
            grad.addColorStop(mapYProfit(0) / canvas.height, 'rgba(76, 175, 80, 0.4)');
            grad.addColorStop(mapYProfit(0) / canvas.height, 'rgba(229, 57, 53, 0.5)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            // --- Draw Bankruptcy Rate Line Chart ---
            ctx.strokeStyle = '#FF9800';
            ctx.fillStyle = '#FF9800';
            ctx.lineWidth = 2;
            ctx.beginPath();
            data.forEach((d, i) => {
                const x = mapX(d.limit);
                const y = mapYBankRate(d.bankRate);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            // Draw points on the line
            data.forEach(d => {
                ctx.beginPath();
                ctx.arc(mapX(d.limit), mapYBankRate(d.bankRate), 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // --- Draw Legend ---
            ctx.fillStyle = '#aaa';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            ctx.fillText('Avg. Profit', padding.left, 15);
            ctx.fillStyle = '#FF9800';
            ctx.textAlign = 'right';
            ctx.fillText('Bankrupt %', canvas.width - padding.right, 15);
        }


        async function fetchAllLogsPaginated(logType, onStatusUpdate) {
            const allLogs = [];
            let currentToTimestamp = null;
            const stopTimestamp = Math.floor(Date.now() / 1000) - (36500 * 24 * 3600); // 100 years ago
            let pageCount = 0;

            while (true) {
                try {
                    // Update the UI if a callback is provided
                    if (onStatusUpdate) {
                        onStatusUpdate(`Fetching Log ${logType} (Page ${pageCount + 1})...`);
                    }

                    const batch = await fetchLogs(logType, currentToTimestamp);
                    const logsInBatch = Object.values(batch.log || {});
                    pageCount++;

                    for (const log of logsInBatch) {
                        if (log.timestamp >= stopTimestamp) {
                            allLogs.push(log);
                        }
                    }

                    if (logsInBatch.length < 100) {
                        console.log(`RR Tracker: Finished fetching log type ${logType}.`);
                        break;
                    }

                    let oldestTimestampInBatch = Math.min(...logsInBatch.map(log => log.timestamp));

                    if (!isFinite(oldestTimestampInBatch)) {
                        break;
                    }

                    // Small delay to be kind to the API
                    await new Promise(resolve => setTimeout(resolve, 200)); 
                    currentToTimestamp = oldestTimestampInBatch;

                } catch (error) {
                    console.error(`RR Tracker: Error fetching log type ${logType}.`, error);
                    break;
                }
            }
            return allLogs;
        }




        // This new, more powerful function replaces the old fetchLogsSince
        async function fetchAllLogsSince(fromTimestamp, logType) {
            // This new version completely removes the while() loop.
            // It will only fetch the very first "page" of up to 100 logs.
            try {
                const fromSeconds = Math.floor(fromTimestamp / 1000);

                // We call fetchLogPage ONCE and only once.
                // The 'to' parameter is null, which means "give me the most recent ones".
                const logsInBatch = await fetchLogPage(fromSeconds, null, logType);

                // We immediately return what we got, without looping for more.
                return logsInBatch;

            } catch (error) {
                // If the single request fails, log the error and return an empty array.
                console.error(`RR Tracker: Error during single-page (non-paginated) fetch for log type ${logType}.`, error);
                return [];
            }
        }


        // This is a new helper function used by the one above
        function fetchLogPage(from, to, logType) {
            let url = `https://api.torn.com/user/?selections=log&log=${logType}&from=${from}&key=${apiKey}`;
            if (to) {
                url += `&to=${to}`;
            }
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) { reject(new Error(data.error.error)); }
                            else { resolve(Object.values(data.log || {})); }
                        } catch (e) { reject(new Error("Failed to parse API response.")); }
                    },
                    onerror: (err) => reject(new Error("Network request failed.")),
                    ontimeout: () => reject(new Error("Request timed out.")),
                });
            });
        }

        let syncInterval = null;
        function initiateSyncing() {
            if (syncInterval) clearInterval(syncInterval);
            if (!apiKey || apiKey.length < 16) {
                console.log("/*  */RR Tracker: No API key set, auto-sync disabled.");
                return;
            }

            // It now correctly uses our new global constant
            if (Date.now() - lastSyncTime > API_SYNC_INTERVAL_MS) {
                console.log("RR Tracker: Stale data detected, performing initial sync.");
                importApiData(true);
            }

            // The interval is now set correctly to a safe 60 seconds using the constant
            syncInterval = setInterval(() => importApiData(true), API_SYNC_INTERVAL_MS);

            // The log message is now dynamic and always accurate
            console.log(`RR Tracker: Auto-sync initiated for every ${API_SYNC_INTERVAL_MS / 1000} seconds.`);
        }

        /**
 * Clears all local game results and repopulates them by forcing a full "deep scan" from the Torn API.
 * This is a data-only reset; settings are not affected.
 */

        // --- DEEP SYNC ENGINE (Combined Stream) ---
        const DEEP_SYNC_KEY = 'rr_deep_sync_progress';

        async function processDeepSyncStep() {
            // 1. Load State
            const state = JSON.parse(localStorage.getItem(DEEP_SYNC_KEY));
            if (!state) return; 

            const btn = document.getElementById('rr-force-sync-btn');
            
            // 2. Update Button UI
            if (btn) {
                if (state.finished) {
                     btn.textContent = 'Sync Complete ✅';
                     btn.disabled = false;
                     setTimeout(() => btn.textContent = '🔄 Sync Now', 3000);
                     return;
                }
                btn.textContent = `Synced ${state.totalSynced} Matches...`;
                btn.disabled = true;
            }

            try {
                // 3. FETCH COMBINED DATA
                // We ask for BOTH log types at once: "8395,8396"
                // The API will give us the mixed 100 most recent items.
                const batch = await fetchLogPage(0, state.cursorTimestamp, "8395,8396");
                const rawLogs = Object.values(batch || {});

                if (rawLogs.length > 0) {
                    // 4. PARSE (Mixed List)
                    const newGames = rawLogs.map(log => {
                        let result = (log.log === 8395) ? 'win' : (log.log === 8396 ? 'lose' : null);
                        if (!result || !log.data || !log.data.pot) return null;

                        return {
                            result: result,
                            bet: log.data.pot / 2,
                            timestamp: log.timestamp,
                            origin: 'joined'
                        };
                    }).filter(g => g !== null);

                    // 5. UPDATE UI
                    if (newGames.length > 0) {
                        const existingTimestamps = new Set(results.map(r => r.timestamp));
                        const uniqueNew = newGames.filter(g => !existingTimestamps.has(g.timestamp));
                        
                        if (uniqueNew.length > 0) {
                            results = [...results, ...uniqueNew];
                            results.sort((a, b) => b.timestamp - a.timestamp); 
                            
                            // Stats & Graph
                            totalProfit = results.reduce((acc, game) => acc + (game.result === 'win' ? game.bet : -game.bet), 0);
                            saveResults();
                            saveTotalProfit();
                            refreshAll(); 
									  autoBet();
                            if (showStatsPanel) updateGraph();

                            // Update Counter
                            state.totalSynced += uniqueNew.length;
                        }
                    }

                    // 6. UPDATE CURSOR
                    // We just take the oldest timestamp from the mixed batch.
                    // Next call will ask for data OLDER than this.
                    const oldestInBatch = Math.min(...rawLogs.map(l => l.timestamp));
                    state.cursorTimestamp = oldestInBatch;
                    
                    localStorage.setItem(DEEP_SYNC_KEY, JSON.stringify(state));
                    
                    // Loop: 2 seconds
                    setTimeout(processDeepSyncStep, 2000);

                } else {
                    // 7. FINISHED
                    // If the API returns nothing, we have reached the end of history.
                    console.log("RR Tracker: Deep Sync Finished.");
                    state.finished = true;
                    localStorage.removeItem(DEEP_SYNC_KEY); // Done!
                    
                    if (btn) {
                        btn.textContent = 'Sync Complete ✅';
                        btn.disabled = false;
                        setTimeout(() => btn.textContent = '🔄 Sync Now', 3000);
                    }
                    importApiData(true); // Final standard check
                }

            } catch (error) {
                console.error("RR Tracker: Deep Sync Error", error);
                if (btn) btn.textContent = "Retrying...";
                setTimeout(processDeepSyncStep, 5000);
            }
        }



        async function forceFullResync() {
            // 1. Reset Memory
            localStorage.removeItem(DEEP_SYNC_KEY);

            if (!confirm("Start Deep Sync? This Will Trigger 1 API Call Every 2 Secounds(30/min). Matches appear LIVE.")) {
                return;
            }

            console.log("RR Tracker: Starting Combined Deep Sync...");
            
            // 2. Clear current data
            results = []; 
            totalProfit = 0;
            saveResults();
            refreshAll(); 

            // 3. Initialize Simple State
            // We only need ONE cursor now because the API mixes the data for us.
            const initialState = {
                cursorTimestamp: null,  // Where we are in history
                totalSynced: 0,         // Counter
                finished: false
            };
            
            localStorage.setItem(DEEP_SYNC_KEY, JSON.stringify(initialState));

            // 4. Kickstart
            processDeepSyncStep();
        }




        // ADD THIS ENTIRE NEW HELPER FUNCTION
        async function processLogsInChunks(logs, onProgress) {
            return new Promise(resolve => {
                const chunkSize = 500; // Process 500 log entries at a time
                let index = 0;
                const newlyProcessedGames = [];

                function processChunk() {
                    const chunkEnd = Math.min(index + chunkSize, logs.length);
                    const chunk = logs.slice(index, chunkEnd);

                    // This is the processing logic moved from your original function
                    const startGameIndices = [];
                    chunk.forEach((log, i) => {
                        if (log.log === 8392 || log.log === 8391) startGameIndices.push(i);
                    });

                    for (let i = 0; i < startGameIndices.length; i++) {
                        const startIndex = startGameIndices[i];
                        // Note: End index calculation needs to look at the original `logs` array for context
                        const absoluteStartIndex = index + startIndex;
                        let absoluteEndIndex = logs.length;
                        for(let k = absoluteStartIndex + 1; k < logs.length; k++) {
                            if (logs[k].log === 8392 || logs[k].log === 8391) {
                                absoluteEndIndex = k;
                                break;
                            }
                        }

                        const gameSlice = logs.slice(absoluteStartIndex, absoluteEndIndex);

                        let origin, result, bet, gameTimestamp;
                        if (gameSlice.length > 0) {
                            const startLog = gameSlice[0];
                            origin = startLog.log === 8392 ? 'created' : 'joined';
                            for (let j = 1; j < gameSlice.length; j++) {
                                const event = gameSlice[j];
                                if (event.log === 8395) { result = 'win'; bet = event.data.pot / 2; gameTimestamp = event.timestamp; }
                                else if (event.log === 8396) { result = 'lose'; bet = event.data.pot / 2; gameTimestamp = event.timestamp; }
                            }
                        }
                        if (result && gameTimestamp) {
                            newlyProcessedGames.push({ result, bet, timestamp: gameTimestamp, origin });
                        }
                    }
                    // End of moved logic

                    index += chunk.length; // Use actual chunk length to advance

                    if (typeof onProgress === 'function') {
                        onProgress(Math.round((index / logs.length) * 100));
                    }

                    if (index < logs.length) {
                        setTimeout(processChunk, 0); // Yield to the main thread before the next chunk
                    } else {
                        resolve(newlyProcessedGames);
                    }
                }
                processChunk();
            });
        }

        // --- AUTO BET CONTROLLER ---
        function autoBet() {
            // Only run if we are in Simple Mode
            if (bettingMode !== 'simple') return;

            // Check if Auto-features are enabled
            const isAutoNext = JSON.parse(localStorage.getItem(AUTO_NEXT_KEY) || 'false');
            const isAutoReset = JSON.parse(localStorage.getItem(AUTO_RESET_KEY) || 'false');
            
            // If neither is on, do nothing
            if (!isAutoNext && !isAutoReset) return;

            // 1. RUN THE STRATEGY ENGINE
            // We pass the full history (including the game that just finished)
            // The engine returns the mathematically correct NEXT step.
            const state = calculateCurrentState(results);
            
            // 2. APPLY THE RESULT
            // The engine handles ALL rules (Boost, Drain, Martingale) internally.
            // We just trust its output.
            simpleModeStep = state.step;

            // 3. SAVE & UPDATE UI
            localStorage.setItem(SIMPLE_STEP_KEY, simpleModeStep.toString());
            calculateBetsAndRefresh();
            
            console.log(`RR Tracker: AutoBet set Step to ${simpleModeStep + 1}. (Drain Active: ${state.isDrain})`);
        }


        // --- NEW: SIMULATION ENGINE ---

        function calculateCurrentState(games) {
            // --- 1. Settings ---
            const boostEnabled = JSON.parse(localStorage.getItem('rr_boostWins') || 'false');
            // Convert user 1-based inputs to 0-based indices
            const streakCap = parseInt(localStorage.getItem('rr_streakCap') || '4', 10) - 1; 
            const martingaleStart = parseInt(localStorage.getItem('rr_martingaleStart') || '2', 10) - 1; 

            // Drain Settings
            const drainEnabled = dynamicBetsSettings.drainEnabled === true;
            // dStart is the Index (e.g. Input 3 -> Index 2)
            const dStart = (parseInt(dynamicBetsSettings.drainStart) || 3) - 1; 
            const dReps = parseInt(dynamicBetsSettings.drainRepeats) || 4;

            // --- 2. State ---
            let boostStep = 0; 
            let lossStreak = 0; 
            let winStreak = 0; 
            
            let drainActive = false;
            let drainIndex = 0;
            
            // Flag to track what happened in the VERY LAST processed game
            let lastGameWasRetreat = false;

            // --- 3. History ---
            const history = games.slice(0, 200).reverse();

            for (let i = 0; i < history.length; i++) {
                const game = history[i];
                lastGameWasRetreat = false; // Reset flag for this turn

                // A. Planned Step
                let plannedStep = 0;
                if (lossStreak === 0) {
                    plannedStep = boostStep;
                } else {
                    if (boostEnabled && boostStep > martingaleStart) {
                        plannedStep = boostStep - 1; 
                    } else {
                        plannedStep = martingaleStart + lossStreak;
                    }
                }

                // B. Trigger Check
                // NEW CONDITION ADDED: (lossStreak + 1) <= (dStart + 1)
                // This ensures we only trigger if the current streak is <= the Drain Start setting.
                const triggerHit = (
                    drainEnabled && 
                    !drainActive && 
                    game.result === 'lose' && 
                    plannedStep >= dStart && 
                    (lossStreak + 1) <= (dStart + 1)
                );

                // C. Update Brain
                if (game.result === 'win') {
                    lossStreak = 0; 
                    winStreak++; 
                    if (boostEnabled) {
                        if (winStreak > 1) {
                            if (boostStep < streakCap) boostStep++;
                            else if (boostStep === streakCap) boostStep = Math.max(0, boostStep - 1);
                        } else {
                            boostStep = 0; 
                        }
                    } else {
                        boostStep = 0; 
                    }
                } 
                else { // LOSS
                    lossStreak++; 
                    winStreak = 0; 
                    
                    // RETREAT LOGIC (Any loss above floor triggers retreat)
                    if (boostEnabled && boostStep > martingaleStart) {
                        boostStep--;
                        lastGameWasRetreat = true; // Mark this turn as a retreat
                    }
                }

                // D. Drain Status Update
                if (drainActive) {
                    drainIndex++; 
                    if (drainIndex >= dReps) {
                        drainActive = false; 
                        drainIndex = 0;
                    }
                } else if (triggerHit) {
                    drainActive = true;
                    drainIndex = 1; 
                    if (dReps <= 1) { drainActive = false; drainIndex = 0; } 
                }
            }

            // --- 4. Final Output ---
            if (drainActive) {
                return { step: dStart + drainIndex, isDrain: true };
            }

            let finalStep = 0;
            if (lossStreak === 0) {
                finalStep = boostStep;
            } else {
                // If the last thing we did was retreat, we play the new retreated boostStep.
                // If we hit the floor (didn't retreat further), we Slingshot.
                if (boostEnabled && lastGameWasRetreat) {
                    finalStep = boostStep;
                } else {
                    finalStep = martingaleStart + lossStreak;
                }
            }

            return { step: finalStep, isDrain: false };
        }



        // --- HELPER: Parse a batch of raw logs into Game Objects ---
        function parseRawLogsToGames(logs) {
            const parsedGames = [];
            // Sort logs by timestamp to ensure correct game assembly
            logs.sort((a, b) => a.timestamp - b.timestamp);
            
            const startGameIndices = [];
            logs.forEach((log, index) => { 
                if (log.log === 8392 || log.log === 8391) startGameIndices.push(index); 
            });

            for (let i = 0; i < startGameIndices.length; i++) {
                const startIndex = startGameIndices[i];
                // Look ahead for the next start log to define the boundary
                const endIndex = (i + 1 < startGameIndices.length) ? startGameIndices[i + 1] : logs.length;
                
                const gameSlice = logs.slice(startIndex, endIndex);
                let origin, result, bet, gameTimestamp;

                if (gameSlice.length > 0) {
                    const startLog = gameSlice[0];
                    origin = startLog.log === 8392 ? 'created' : 'joined';
                    
                    for (let j = 1; j < gameSlice.length; j++) {
                        const event = gameSlice[j];
                        if (event.log === 8395) { 
                            result = 'win'; 
                            bet = event.data.pot / 2; 
                            gameTimestamp = event.timestamp; 
                        }
                        else if (event.log === 8396) { 
                            result = 'lose'; 
                            bet = event.data.pot / 2; 
                            gameTimestamp = event.timestamp; 
                        }
                    }
                }
                
                if (result && gameTimestamp) {
                    parsedGames.push({ result, bet, timestamp: gameTimestamp, origin });
                }
            }
            return parsedGames;
        }





        // ===================================================================
        // ============= THE FINAL, BULLETPROOF SYNC FUNCTION ================
        // ===================================================================


        async function importApiData(isSilent = false, forceOverride = false) {
            // 1. Stop if Deep Sync is running (prevents conflicts)
            if (localStorage.getItem(DEEP_SYNC_KEY)) {
                if (!isSilent) console.log("RR Tracker: Standard sync skipped (Deep Sync active).");
                return;
            }

            // 2. FIX: Unstick the flag if forced (Fixes "Already Synced" bug)
            if (forceOverride) {
                isSyncing = false;
            }

            if (isSyncing) {
                if (!isSilent) console.log("RR Tracker: Sync already in progress.");
                return;
            }
            
            if (!apiKey || apiKey.length < 16) {
                if (!isSilent) alert('Please check API key settings.');
                return;
            }

            // Update Button Text
            const btn = document.getElementById('rr-force-sync-btn');
            if (btn && forceOverride) {
                btn.textContent = 'Checking...';
                btn.disabled = true;
            }

            const isInitialSync = !lastSyncTime || (Date.now() - lastSyncTime > 6 * 3600 * 1000) || forceOverride;
            let allRawLogs = [];

            try {
                isSyncing = true;
                if (!isSilent) document.body.style.cursor = 'wait';

                if (isInitialSync) {
                    // Full/Deep Scan logic (Paginated)
                    const updateSyncButton = (text) => { if (btn) btn.textContent = text; };
                    const logPromises = [8392, 8391, 8395, 8396].map(logType => 
                        fetchAllLogsPaginated(logType, (msg) => updateSyncButton(msg))
                    );
                    updateSyncButton("Downloading history...");
                    const allLogsArrays = await Promise.all(logPromises);
                    allRawLogs = [].concat(...allLogsArrays);
                } else {
                    // Standard "Quick Sync" logic (Last 1 hour)
                    const oneHourInMs = 60 * 60 * 1000;
                    const syncStartTime = lastSyncTime ? (lastSyncTime - oneHourInMs) : (Date.now() - oneHourInMs * 24);
                    
                    const logPromises = [8392, 8391, 8395, 8396].map(logType => fetchAllLogsSince(syncStartTime, logType));
                    const allLogsArrays = await Promise.all(logPromises);
                    allRawLogs = [].concat(...allLogsArrays);
                }

                if (allRawLogs.length > 0) {
                    // Use the helper to process logs into games
                    const newGames = parseRawLogsToGames(allRawLogs);
                    const existingTimestamps = new Set(results.map(r => r.timestamp));
                    const uniqueNew = newGames.filter(g => !existingTimestamps.has(g.timestamp));

                    if (uniqueNew.length > 0) {
                        console.log(`RR Tracker: Found ${uniqueNew.length} new games.`);
                        
                        // 1. Update Results
                        results = [...results, ...uniqueNew];
                        results.sort((a, b) => b.timestamp - a.timestamp);
                        
                        // 2. Update Stats
                        totalProfit = results.reduce((acc, game) => acc + (game.result === 'win' ? game.bet : -game.bet), 0);
                        if (isSessionActive) {
                            const sessionGames = results.filter(r => r.timestamp * 1000 >= sessionStartDate);
                            sessionProfit = sessionGames.reduce((acc, game) => acc + (game.result === 'win' ? game.bet : -game.bet), 0);
                        }

                        // 3. Save Everything
                        saveResults();
                        saveTotalProfit();
                        saveSessionState();

                        // 4. TRIGGER AUTO-BET (Crucial Step)
                        // This uses the NEW history to calculate the correct next step
                        if (typeof autoBet === 'function') {
                            autoBet(); 
                        }

                        // 5. Refresh UI
                        calculateBets();
                        refreshAll();
                    }
                }
                
                lastSyncTime = Date.now();
                localStorage.setItem(LAST_SYNC_KEY, lastSyncTime.toString());

            } catch (error) {
                console.error("RR Tracker: Sync Error", error);
            } finally {
                isSyncing = false;
                if (!isSilent) document.body.style.cursor = '';
                if (btn) {
                    btn.textContent = '🔄 Sync Now';
                    btn.disabled = false;
                }
            }
        }


        function loadManualBets() {
            try {
                const storedJson = localStorage.getItem(MANUAL_BETS_STORAGE_KEY);
                if (storedJson) {
                    const parsed = JSON.parse(storedJson);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (e) { console.error("Error parsing stored manual bets:", e); }
            return [...DEFAULT_MANUAL_BETS];
        }

        function adjustManualBetsArray(bets) {
            const currentLength = bets.length;
            if (currentLength === 16) return bets;

            if (currentLength < 16) {
                const lastValue = currentLength > 0 ? bets[currentLength - 1] : 10000;
                for (let i = currentLength; i < 16; i++) {
                    bets.push(lastValue * Math.pow(2, i - currentLength + 1));
                }
            } else {
                bets = bets.slice(0, 16);
            }
            return bets;
        }


        function buildManualBetInputs() {
            manualEditGrid.innerHTML = '';
            manualEditInputs = [];
            for (let i = 0; i < 16; i++) {
                const label = document.createElement('label');
                label.textContent = `Bet ${i + 1}:`;
                Object.assign(label.style, { fontSize: '13px', paddingTop: '4px' });
                manualEditGrid.appendChild(label);

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'e.g., 10k';
                input.title = `Set the manual bet amount for UI button ${i + 1}.`;
                Object.assign(input.style, { width: '80px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });

                input.dataset.index = i;
                input.onchange = (e) => {
                    const index = parseInt(e.target.dataset.index, 10);
                    const parsed = parseBetInput(e.target.value);
                    if (parsed !== null) {
                        manualBets[index] = parsed;
                        saveManualBets();
                        e.target.value = formatNumberToKMB(parsed);
                        calculateBetsAndRefresh();
                    } else if (e.target.value !== '') {
                        alert('Invalid input. Please use numbers or suffixes like K/M/B (e.g., 25k, 2.5m).');
                        e.target.value = formatNumberToKMB(manualBets[index]);
                    }
                };
                manualEditGrid.appendChild(input);
                manualEditInputs.push(input);
            }
        }
        buildManualBetInputs();
        // New helper: Only puts the number in the box (Does not click Start)
        function injectBetOnly(amount) {
            const inputBox = document.querySelector('input[aria-label="Money value"]');
            if (inputBox) {
                const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                nativeSet.call(inputBox, amount.toLocaleString('en-US'));
                inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                inputBox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
        function startMatch(originalButtonBetValue) {
            const inputBox = document.querySelector('input[aria-label="Money value"]');

            // --- SCENARIO 1: CREATING A NEW GAME ---
            if (inputBox) {
                // 1. Inject the value into React
                const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                nativeSet.call(inputBox, originalButtonBetValue.toLocaleString('en-US'));
                inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                inputBox.dispatchEvent(new Event('change', { bubbles: true }));

                // 2. Safety Check
                const betAfterInputSet = parseBetInput(inputBox.value);
                if (betAfterInputSet === null || betAfterInputSet <= 0) {
                    alert("Invalid bet amount.");
                    return;
                }
                if (betAfterInputSet < originalButtonBetValue) {
                    alert(`Bet mismatch. Box has ${betAfterInputSet}, button was ${originalButtonBetValue}.`);
                    return;
                }

                // 3. Click the "Start" Button
                const startButton = document.querySelector('button.submit___Yr2z1');
                if (startButton) {
                    startButton.click();

                    // 4. THE FIX: Auto-Confirm Logic
                    // We must wait a tiny bit (400ms) for the "Are you sure?" popup to render
                    setTimeout(() => {
                        // Look for the "Yes" button.
                        // 'button___QgVxd' is the standard class Torn uses for primary confirmation buttons.
                        const confirmButton = document.querySelector('button.button___QgVxd');
                        if (confirmButton) {
                            confirmButton.click();
                        }
                    }, 400);
                }
                // Fallback: If start button not found, look for Close/Error buttons
                else {
                    const closeButton = document.querySelector('button.button___aQaRr');
                    if (closeButton) closeButton.click();
                }
            }
            // --- SCENARIO 2: JOINING AN EXISTING GAME ---
            else {
                const yesButton = document.querySelector('button.button___QgVxd');
                if (yesButton) {
                    yesButton.click();
                } else {
                    const closeButton = document.querySelector('button.button___aQaRr');
                    if (closeButton) closeButton.click();
                }
            }
        }


        function getSumOfRatios(L, M, reinforce, numCoeffs, boosted, drainSettings) {
            // drainSettings: { enabled: bool, start: int, repeats: int }
            if (numCoeffs <= 0 || M <= 1) return { sum: 0, coeffs: [] };
            
            const allCoeffs = [];
            let currentSum = 0;

            // Robustly get intervals, ensuring they are numbers
            let rInterval = parseInt(dynamicBetsSettings.reinforceInterval);
            if (isNaN(rInterval) || rInterval < 1) rInterval = 2;

            let bInterval = parseInt(dynamicBetsSettings.boostInterval);
            if (isNaN(bInterval) || bInterval < 1) bInterval = 5;

            // Prepare Drain indices
            const dEnabled = drainSettings && drainSettings.enabled;
            const dStart = (drainSettings && drainSettings.start) ? drainSettings.start - 1 : -1;
            const dEnd = dStart + (drainSettings ? drainSettings.repeats : 0);

            for (let i = 0; i < numCoeffs; i++) {
                let currentCoeff;
                const betNumber = i + 1;

                // --- LOGIC TREE ---

                // 1. DRAIN MODE (Flat)

	if (dEnabled && i > dStart && i < dEnd) {
    currentCoeff = allCoeffs[dStart]; 
	}


                // 2. DRAIN MODE (Recovery Jump)
                else if (dEnabled && i === dEnd) {
                    currentCoeff = currentSum * M;
                }
                // 3. REINFORCE LOGIC
                // (Only active if 'reinforce' is checked AND we are at the correct interval step)
                // Note: We use (betNumber - 1) so that for interval 2, we hit steps 3, 5, 7...
                // This ensures we have a valid history (Step 1) to look back on.
                else if (reinforce && betNumber > 1 && (betNumber - 1) % rInterval === 0) {
                     const reinforcementCoeff = allCoeffs[i - rInterval] || 0;
                     currentCoeff = (M * allCoeffs[i - 1]) + reinforcementCoeff;
                }
                // 4. STANDARD MARTINGALE (Default)
                else {
                    if (i === 0) currentCoeff = 1;
                    else currentCoeff = allCoeffs[i - 1] * M;
                }

                // --- BOOST LOGIC ---
                // Applies to ALL modes except the flat Drain phase
                const isDrainFlatPhase = (dEnabled && i > dStart && i < dEnd);
                if (boosted && !isDrainFlatPhase && (betNumber % bInterval === 0)) {
                    currentCoeff *= 2;
                }

                allCoeffs.push(currentCoeff);
                currentSum += currentCoeff;
            }

            const sum = allCoeffs.slice(0, L).reduce((acc, val) => acc + val, 0);
            return { sum, coeffs: allCoeffs };
        }

        function formatNumberToKMB(num, decimals = 2) {
            if (num === null || isNaN(num)) return '';
            if (num === 0) return '0';

            const sign = num < 0 ? "-" : "";
            const absNum = Math.abs(num);

            const lookup = [
                { value: 1e9,  symbol: "b" },
                { value: 1e6,  symbol: "m" },
                { value: 1e3,  symbol: "k" }
            ];

            const item = lookup.find(item => absNum >= item.value);

            if (item) {
                // For billions, use 3 decimal places, otherwise use the default.
                const effectiveDecimals = item.symbol === 'b' ? 3 : decimals;
                // Use .replace to remove trailing zeros from the decimal part
                const formatted = (absNum / item.value).toFixed(effectiveDecimals).replace(/\.?0+$/, "");
                return sign + formatted + item.symbol;
            }

            return num.toLocaleString();
        }

function calculateBetsAndRefresh() {
            calculateBets();
            refreshAll();
        }

        function parseBetInput(str) {
            if (typeof str !== 'string') str = String(str);
            str = str.toLowerCase().replace(/,/g, '').trim();
            let m = 1;
            if (str.endsWith('k')) { m = 1e3; str = str.slice(0, -1); }
            else if (str.endsWith('m')) { m = 1e6; str = str.slice(0, -1); }
            else if (str.endsWith('b')) { m = 1e9; str = str.slice(0, -1); }
            let v = parseFloat(str);
            return (isNaN(v) || v < 0) ? null : Math.floor(v * m);
        }

        function getBetForStep(stepIndex) {
            if (bettingMode === 'manual') return manualBets[stepIndex] || 0;

            const { capital, martingaleValue, reinforce, boostedBets, lockedField } = dynamicBetsSettings;

            // --- FIX: Define Drain Settings Here ---
            const drainSettings = {
                enabled: dynamicBetsSettings.drainEnabled === true,
                start: parseInt(dynamicBetsSettings.drainStart) || 3,
                repeats: parseInt(dynamicBetsSettings.drainRepeats) || 4
            };

            // Pass drainSettings to the calculator
            const { sum, coeffs } = getSumOfRatios(
                stepIndex + 1, 
                martingaleValue, 
                reinforce, 
                stepIndex + 1, 
                boostedBets, 
                drainSettings // <--- PASSED HERE
            );

            let startingBet = dynamicBetsSettings.startingBet;

            if (lockedField === 'capital') {
                // For capital lock, we still need a reference sum. 
                // We use the full 16-step calculation to keep the base unit consistent.
                const standardCalc = getSumOfRatios(
                    dynamicBetsSettings.maxLStreak, 
                    martingaleValue, 
                    reinforce, 
                    16, 
                    boostedBets,
                    drainSettings // <--- AND HERE
                );
                startingBet = Math.floor(capital / standardCalc.sum);
            }

            const multiplier = coeffs[stepIndex];
            return Math.floor(startingBet * multiplier);
        }



                function calculateBets() {
            if (dynamicBetsEnabled) {
                const { capital, maxLStreak, martingaleValue, reinforce, lockedField } = dynamicBetsSettings;
                let startingBet = dynamicBetsSettings.startingBet;
                const numCoeffsToGenerate = 16;

                // Explicitly construct the settings object
                const drainSettings = {
                    enabled: dynamicBetsSettings.drainEnabled === true,
                    start: parseInt(dynamicBetsSettings.drainStart) || 3,
                    repeats: parseInt(dynamicBetsSettings.drainRepeats) || 4
                };

                const { sum, coeffs } = getSumOfRatios(
                    maxLStreak, 
                    martingaleValue, 
                    reinforce, 
                    numCoeffsToGenerate, 
                    dynamicBetsSettings.boostedBets, 
                    drainSettings
                );

                if (lockedField === 'capital') {
                    startingBet = (sum > 0) ? Math.floor(capital / sum) : 0;
                    dynamicBetsSettings.startingBet = startingBet;
                } else {
                    dynamicBetsSettings.capital = Math.floor(startingBet * sum);
                }

                currentBets = [];
                for (let i = 0; i < coeffs.length; i++) {
                    const betValue = Math.floor(startingBet * coeffs[i]);
                    currentBets.push(betValue);
                }
            } else {
                currentBets = [...manualBets];
            }
        }



        

        function buildBetButtons() {
            // 1. Clear containers
            mainBetGridContainer.innerHTML = '';
            miniBetGridContainer.innerHTML = '';
            const circlesContainer = document.getElementById('rr-mini-circles-container');
            if (circlesContainer) circlesContainer.innerHTML = '';

            // 2. VISIBILITY CHECK
            // Only show the main grid if we are NOT in settings, stats, simulator, or collapsed.
            const isMainViewActive = (!isMinimized && !collapsed && !showSettings && !showStatsPanel && !showSimulatorPanel && !showEditBetsPanel);
            // Stop-Loss Check
            if (isStopLossActive) {
                mainBetGridContainer.innerHTML = `<div style="text-align:center; padding: 10px; color: #ff7a7a;">Daily loss limit reached.</div>`;
                miniBetGridContainer.innerHTML = `<div style="text-align:center; font-size:10px; color: #ff7a7a;">STOP LOSS</div>`;
                mainBetGridContainer.style.display = isMainViewActive ? 'block' : 'none';
                return;
            }

            // --- A. SIMPLE MODE (4 Buttons) ---
            if (bettingMode === 'simple') {
                const currentBetAmount = getBetForStep(simpleModeStep);
                const formattedBet = formatNumberToKMB(currentBetAmount);

                // ==============================
                // 1. MAIN PANEL (Full Size)
                // ==============================
                mainBetGridContainer.style.display = isMainViewActive ? 'flex' : 'none';
                mainBetGridContainer.style.flexDirection = 'column';
                mainBetGridContainer.style.gap = '8px';

                // Info Text
                const infoDiv = document.createElement('div');
                infoDiv.innerHTML = `Step: <b style="color: #fff">${simpleModeStep + 1}</b>`;
                infoDiv.style.textAlign = 'center';
                infoDiv.style.fontSize = '12px';
                infoDiv.style.color = '#ccc';
                mainBetGridContainer.appendChild(infoDiv);

                const btnRow = document.createElement('div');
                Object.assign(btnRow.style, { display: 'flex', gap: '5px' });

                // Main Buttons
                const prevBtn = document.createElement('button');
                prevBtn.textContent = '◀';
                Object.assign(prevBtn.style, { padding: '10px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer' });
                prevBtn.onclick = () => { if (simpleModeStep > 0) { simpleModeStep--; localStorage.setItem(SIMPLE_STEP_KEY, simpleModeStep.toString()); refreshAll(); }};

                const betBtn = document.createElement('button');
                betBtn.innerHTML = `<span style="font-size:11px; display:block; color:#aaa;">SET BET</span><span style="font-size:15px; font-weight:bold;">$${formattedBet}</span>`;
                Object.assign(betBtn.style, { flex: '1', padding: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #777', borderRadius: '6px', cursor: 'pointer' });
                betBtn.onclick = () => injectBetOnly(currentBetAmount);

                const startBtn = document.createElement('button');
                startBtn.textContent = '🚀';
                Object.assign(startBtn.style, { padding: '0 15px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' });
                startBtn.onclick = () => startMatch(currentBetAmount);

                const nextBtn = document.createElement('button');
                nextBtn.textContent = '▶';
                Object.assign(nextBtn.style, { padding: '10px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer' });
                nextBtn.onclick = () => { simpleModeStep++; localStorage.setItem(SIMPLE_STEP_KEY, simpleModeStep.toString()); refreshAll(); };

                btnRow.append(prevBtn, betBtn, startBtn, nextBtn);
                mainBetGridContainer.appendChild(btnRow);

                // Reset Button
                const resetRow = document.createElement('div');
                const resetBtn = document.createElement('button');
                resetBtn.textContent = "Reset to Start";
                Object.assign(resetBtn.style, { width: '100%', padding: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid #444', borderRadius: '4px', color: '#ccc', cursor: 'pointer', fontSize: '11px' });
                resetBtn.onclick = () => { simpleModeStep = 0; localStorage.setItem(SIMPLE_STEP_KEY, simpleModeStep.toString()); refreshAll(); };
                resetRow.appendChild(resetBtn);
                mainBetGridContainer.appendChild(resetRow);

                // ==============================
                // 2. MINI PANEL (Compact 4 Buttons)
                // ==============================
                miniBetGridContainer.style.display = 'flex'; // Use flex instead of grid
                miniBetGridContainer.style.gap = '3px';

                // Mini Prev
                const mPrev = document.createElement('button');
                mPrev.textContent = '◀';
                Object.assign(mPrev.style, { padding: '2px 6px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' });
                mPrev.onclick = prevBtn.onclick;

                // Mini Set (Shows Amount)
                const mSet = document.createElement('button');
                mSet.textContent = formattedBet;
                Object.assign(mSet.style, { flex: '1', padding: '2px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #777', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' });
                mSet.onclick = betBtn.onclick;

                // Mini Start
                const mStart = document.createElement('button');
                mStart.textContent = '🚀';
                Object.assign(mStart.style, { padding: '2px 6px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' });
                mStart.onclick = startBtn.onclick;

                // Mini Next
                const mNext = document.createElement('button');
                mNext.textContent = '▶';
                Object.assign(mNext.style, { padding: '2px 6px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' });
                mNext.onclick = nextBtn.onclick;

                miniBetGridContainer.append(mPrev, mSet, mStart, mNext);

            }
            // --- B. GRID MODES (Manual/Dynamic) ---
            else {
                // Set Layout
                mainBetGridContainer.style.display = isMainViewActive ? 'grid' : 'none';
                mainBetGridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                mainBetGridContainer.style.gap = '4px';

                // Restore Mini Grid to 4 columns for the 16-button layout
                miniBetGridContainer.style.display = 'grid';
                miniBetGridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                miniBetGridContainer.style.gap = '3px';

                if (!currentBets || currentBets.length === 0) return;

                // Calculate Highlight
                let losingStreak = 0;
                for (const r of results) { if (r.result === 'lose') losingStreak++; else break; }
                const highlightIndex = losingStreak > 0 ? losingStreak : -1;

                // Generate 16 Buttons
                for (let i = 0; i < 16; i++) {
                    const bet = currentBets[i];
                    const formattedBet = formatNumberToKMB(bet);

                    // 1. MAIN Button
                    const mainBtn = document.createElement('button');
                    mainBtn.textContent = formattedBet;
                    mainBtn.title = `$${bet.toLocaleString()}`;
                    Object.assign(mainBtn.style, {
                        background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid #444',
                        borderRadius: '6px', padding: '4px 2px', cursor: 'pointer', fontSize: '11px'
                    });
                    mainBtn.onmouseenter = () => { if (!mainBtn.classList.contains('next-bet-highlight')) mainBtn.style.background = 'rgba(255,255,255,0.2)'; };
                    mainBtn.onmouseleave = () => { if (!mainBtn.classList.contains('next-bet-highlight')) mainBtn.style.background = 'rgba(255,255,255,0.08)'; };
                    mainBtn.onclick = () => startMatch(bet);
                    if (i === highlightIndex) mainBtn.classList.add('next-bet-highlight');
                    mainBetGridContainer.appendChild(mainBtn);

                    // 2. MINI Button
                    const miniBtn = document.createElement('button');
                    miniBtn.textContent = formattedBet;
                    Object.assign(miniBtn.style, {
                        background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid #444',
                        borderRadius: '4px', padding: '2px', cursor: 'pointer', fontSize: `${miniButtonSize}px`
                    });
                    miniBtn.onclick = () => startMatch(bet);
                    if (i === highlightIndex) miniBtn.classList.add('next-bet-highlight');
                    miniBetGridContainer.appendChild(miniBtn);
                }
            }

            // Common: Populate circles in mini bar
            if (circlesContainer) {
                results.slice(0, miniBarCount).forEach((r, idx) => circlesContainer.append(makeCircle(r.result, r.bet, idx)));
            }
        }

        const makeCircle = (result, bet, index) => {
            const container = document.createElement('span');
            Object.assign(container.style, { display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: result === 'win' ? '#4CAF50' : '#E53935', marginRight: '2px', cursor: 'pointer', position: 'relative' });
            container.title = `${result.toUpperCase()}: $${bet.toLocaleString()}`;
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isDragging || isTwoFingerDragging) return;

                const existingPopup = document.querySelector('.rr-temp-popup');
                if (existingPopup) existingPopup.remove();

                const tempPopup = document.createElement('div');
                tempPopup.classList.add('rr-temp-popup');
                tempPopup.textContent = `${result.toUpperCase()}: $${bet.toLocaleString()}`;
                Object.assign(tempPopup.style, {
                    position: 'fixed',
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid #555',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    zIndex: '99999999',
                    pointerEvents: 'none',
                    opacity: '0',
                    transition: 'opacity 0.2s ease-in-out, top 0.2s ease-in-out'
                });

                document.body.appendChild(tempPopup);

                const rect = container.getBoundingClientRect();
                tempPopup.style.left = `${rect.left + (rect.width / 2) - (tempPopup.offsetWidth / 2)}px`;
                tempPopup.style.top = `${rect.top - tempPopup.offsetHeight - 5}px`;

                setTimeout(() => {
                    tempPopup.style.opacity = '1';
                    tempPopup.style.top = `${rect.top - tempPopup.offsetHeight - 8}px`;
                }, 10);

                setTimeout(() => {
                    tempPopup.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(tempPopup)) {
                            document.body.removeChild(tempPopup);
                        }
                    }, 200);
                }, 1800);
            });
            return container;
        };



        function updateStatus() { statusDiv.textContent = collapsed ? '▪' : '►'; }

        function updatePanelVisibility() {
            panel.style.display = 'flex';
        }


        // --- NEW HELPER: Calculates streak but enforces "Sticky" drain logic ---
        function calculateEffectiveStreak(games, drainSettings) {
            // If Drain is disabled, use standard "count consecutive losses backwards" logic
            if (!drainSettings || !drainSettings.enabled) {
                let l = 0;
                for (const r of games) { if (r.result === 'lose') l++; else break; }
                return l;
            }

            // If Drain is enabled, we must simulate forward to account for "ignored wins"
            const dStart = (drainSettings.start || 1) - 1; // Convert 1-based to 0-based
            const dReps = drainSettings.repeats || 0;
            const dEnd = dStart + dReps;

            // Take the last 200 games and reverse them (Oldest -> Newest) to simulate the session
            // We limit to 200 for performance; this is plenty to find a "reset" point.
            const history = games.slice(0, 200).reverse();

            let currentStep = 0;

            for (const game of history) {
                // LOGIC: Are we currently inside the "Drain Zone"?
                // If yes, we stick to the plan (increment step) regardless of Win/Loss.
                if (currentStep >= dStart && currentStep < dEnd) {
                    currentStep++; 
                } 
                // LOGIC: We are outside the Drain Zone (Standard Martingale)
                else {
                    if (game.result === 'win') {
                        currentStep = 0; // Reset on Win
                    } else {
                        currentStep++; // Increment on Loss
                    }
                }
            }
            
            return currentStep;
        }


        // --- NEW SHOOT BUTTON LOGIC (Strict Validation) ---
        
        // 1. Inject CSS for Flashes
        const rrFlashStyle = document.createElement('style');
        rrFlashStyle.type = "text/css";
        rrFlashStyle.innerText = `
            @keyframes rr-success-flash { 0% { background-color: rgba(76, 175, 80, 0.5); } 100% { background-color: transparent; } }
            @keyframes rr-fail-flash { 0% { background-color: rgba(229, 57, 53, 0.5); } 100% { background-color: transparent; } }
            .rr-flash-green { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2147483647; animation: rr-success-flash 0.5s ease-out forwards; }
            .rr-flash-red { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2147483647; animation: rr-fail-flash 0.5s ease-out forwards; }
        `;
        document.head.appendChild(rrFlashStyle);

        // 2. Create the Buttons (Standardized Design)
        
        // --- BUTTON 1 (x1) ---
        const shootGlobalBtn = document.createElement('button');
        shootGlobalBtn.innerHTML = 'x1'; // Default placeholder
        shootGlobalBtn.title = "Instantly shoot 1 round.";
        Object.assign(shootGlobalBtn.style, {
            background: '#E53935', color: '#fff', border: '1px solid #b71c1c', 
            borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
            fontSize: '11px', padding: '3px 0', flex: '1', // Matches x2/x3 exactly
            display: 'none', textAlign: 'center'
        });

        // --- BUTTON 2 (x2) ---
        const shoot2Btn = document.createElement('button');
        shoot2Btn.innerHTML = 'x2';
        shoot2Btn.title = "Instantly shoot 2 rounds.";
        Object.assign(shoot2Btn.style, {
            background: '#C62828', color: '#fff', border: '1px solid #8E0000', 
            borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
            fontSize: '11px', padding: '3px 0', flex: '1',
            display: 'none', textAlign: 'center'
        });

        // --- BUTTON 3 (x3) ---
        const shoot3Btn = document.createElement('button');
        shoot3Btn.innerHTML = 'x3';
        shoot3Btn.title = "Instantly shoot 3 rounds.";
        Object.assign(shoot3Btn.style, {
            background: '#B71C1C', color: '#fff', border: '1px solid #7f0000', 
            borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
            fontSize: '11px', padding: '3px 0', flex: '1',
            display: 'none', textAlign: 'center'
        });

        // Container to hold them side-by-side
        const shootContainer = document.createElement('div');
        Object.assign(shootContainer.style, {
            display: 'flex', gap: '2px', width: '100%', marginTop: '4px'
        });


        // 3. Helper: Trigger Flash
        function triggerFlash(type) {
            // Check the setting first!
            if (!flashEnabled) return; 

            const overlay = document.createElement('div');
            overlay.className = type === 'win' ? 'rr-flash-green' : 'rr-flash-red';
            document.body.appendChild(overlay);
            setTimeout(() => { if (document.body.contains(overlay)) overlay.remove(); }, 500);
        }


        // 4. Helper: Get Token
        function getRfcVToken() {
            const cookieString = document.cookie;
            const cookieArray = cookieString.split('; ');
            for (const cookie of cookieArray) {
                const [cookieName, cookieValue] = cookie.split('=');
                if (cookieName === 'rfc_v') return cookieValue;
            }
            return null;
        }

        // 5. The API Request (Updated to handle target button animation)
        function performShootRequest(shots = 1, targetBtn = shootGlobalBtn) {
            const rfc = getRfcVToken();
            if (!rfc) {
                console.error("RR Tracker: RFC Token not found.");
                return;
            }

            const originalText = targetBtn.innerHTML;
            targetBtn.innerHTML = '💥 ...';
            targetBtn.disabled = true;

            fetch("https://www.torn.com/page.php?sid=russianRouletteData&rfcv=" + rfc, {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "content-type": "multipart/form-data; boundary=----WebKitFormBoundarysjciiQrGixS0J6tF",
                    "x-requested-with": "XMLHttpRequest"
                },
                "body": `------WebKitFormBoundarysjciiQrGixS0J6tF\r\nContent-Disposition: form-data; name=\"step\"\r\n\r\nmakeTurn\r\n------WebKitFormBoundarysjciiQrGixS0J6tF\r\nContent-Disposition: form-data; name=\"shotsAmount\"\r\n\r\n${shots}\r\n------WebKitFormBoundarysjciiQrGixS0J6tF--\r\n`,
                "method": "POST",
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'turnMade') {
                    console.log(`RR Tracker: Shot (${shots}) fired successfully.`);
                } 
                else {
                    console.log("RR Tracker: Shoot ignored. Status:", data.status);
                    targetBtn.innerHTML = '⚠️ Wait';
                }
                
                setTimeout(() => {
                    targetBtn.innerHTML = originalText;
                    targetBtn.disabled = false;
                }, 400);
            })
            .catch(err => {
                console.error("RR Tracker: Shoot Error", err);
                targetBtn.innerHTML = '❌ Error';
                setTimeout(() => {
                    targetBtn.innerHTML = originalText;
                    targetBtn.disabled = false;
                }, 1000);
            });
        }

        // Click Handlers
        shootGlobalBtn.onclick = (e) => { e.stopPropagation(); performShootRequest(1, shootGlobalBtn); };
        shoot2Btn.onclick = (e) => { e.stopPropagation(); performShootRequest(2, shoot2Btn); };
        shoot3Btn.onclick = (e) => { e.stopPropagation(); performShootRequest(3, shoot3Btn); };


        


        function refreshAll() {
            // This is the controller that decides which panel view is active.
            const allContent = [statsGroup, mainBetGridContainer, buttonContainer, settingsPanel, editBetsPanel, statsDisplayPanel, miniBar, profitMini, alertMessageDiv, simulatorPanel];
            
            // --- NEW: Calculate lifetime streaks here to use in multiple places ---
            const { maxWinStreak, maxLossStreak } = calculateLifetimeStreaks();

            // First, hide ALL content panels to ensure a clean slate.
            allContent.forEach(p => p.style.display = 'none');
            
            // --- START OF NEW CODE ---
            // 1. Reset: Remove buttons from wherever they currently are
            shootContainer.remove();
            shootGlobalBtn.remove();
            shoot2Btn.remove();
            shoot3Btn.remove();

            // 2. Configure Visibility based on Settings
            shootGlobalBtn.style.display = 'block'; 
            shoot2Btn.style.display = enableShoot2 ? 'block' : 'none';
            shoot3Btn.style.display = enableShoot3 ? 'block' : 'none';

            // 3. Put buttons back into the container
            shootContainer.innerHTML = ''; 
            shootContainer.appendChild(shootGlobalBtn);
            if(enableShoot2) shootContainer.appendChild(shoot2Btn);
            if(enableShoot3) shootContainer.appendChild(shoot3Btn);

            // 4. Decide labels and location based on view mode
            if (isMinimized) {
                // Minimized View: Very compact
                shootGlobalBtn.innerHTML = '1'; 
                shoot2Btn.innerHTML = '2'; 
                shoot3Btn.innerHTML = '3';
                panel.appendChild(shootContainer);

            } else if (collapsed) {
                // Collapsed View: Short Uniform Labels (Fixes fitting issue)
                shootGlobalBtn.innerHTML = 'x1'; 
                shoot2Btn.innerHTML = 'x2';
                shoot3Btn.innerHTML = 'x3';
                
                // Add to miniBar
                miniBar.appendChild(shootContainer);

            } else {
                // Normal View: Full Labels with Icon
                shootGlobalBtn.innerHTML = '🔫 x1';
                shoot2Btn.innerHTML = '🔫 x2';
                shoot3Btn.innerHTML = '🔫 x3';
                
                // Only append if we are in the main view
                if (!showSettings && !showEditBetsPanel && !showStatsPanel && !showSimulatorPanel) {
                    panel.appendChild(shootContainer);
                }
            }
            // --- END OF NEW CODE ---

            // --- 1. SETUP: Prepare the Container ---
            // Remove everything first to prevent duplicates
            shootContainer.remove();
            shootGlobalBtn.remove();
            shoot2Btn.remove();
            shoot3Btn.remove();

            // Clear the container and re-add buttons based on settings
            shootContainer.innerHTML = ''; 
            
            // x1 is always enabled
            shootGlobalBtn.style.display = 'block'; 
            shootContainer.appendChild(shootGlobalBtn);

            // x2 (Only add if setting is enabled)
            if (enableShoot2) {
                shoot2Btn.style.display = 'block';
                shootContainer.appendChild(shoot2Btn);
            }

            // x3 (Only add if setting is enabled)
            if (enableShoot3) {
                shoot3Btn.style.display = 'block';
                shootContainer.appendChild(shoot3Btn);
            }

            // --- 2. LOGIC: Place the container based on view ---
            // Now, selectively RE-ENABLE the correct view based on the current state.
            if (isMinimized) {
                panel.style.width = '100px';
                panel.style.padding = '36px 4px 8px';
                statusDiv.style.display = 'none';
                minimizeButton.innerHTML = '&#9723;';
                
                // MINIMIZED VIEW: Very small text ('1', '2', '3')
                shootGlobalBtn.innerHTML = '1'; 
                shoot2Btn.innerHTML = '2'; 
                shoot3Btn.innerHTML = '3';
                
                // Append the CONTAINER, not just the button
                panel.appendChild(shootContainer);

            } else {
                statusDiv.style.display = 'block';
                minimizeButton.innerHTML = '—';

                if (collapsed) {
                    panel.style.width = '250px';
                    panel.style.padding = '36px 8px 8px';
                    miniBar.style.display = 'block';
                    
                    // COLLAPSED VIEW: Short text ('x1', 'x2', 'x3')
                    shootGlobalBtn.innerHTML = 'x1'; 
                    shoot2Btn.innerHTML = 'x2'; 
                    shoot3Btn.innerHTML = 'x3';
                    
                    // Append CONTAINER to MiniBar
                    miniBar.appendChild(shootContainer);

                } else {
                    // Default and other expanded states
                    panel.style.width = '400px';
                    panel.style.padding = '36px 12px 12px';

                    if (showSettings) {
                        settingsPanel.style.display = 'flex';
                    } else if (showEditBetsPanel) {
                        editBetsPanel.style.display = 'flex';
                    } else if (showStatsPanel) {
                        statsDisplayPanel.style.display = 'flex';
                    } else if (showSimulatorPanel) {
                        simulatorPanel.style.display = 'flex';
                    } else {
                        // MAIN VIEW
                        statsGroup.style.display = 'flex';
                        mainBetGridContainer.style.display = 'grid';
                        buttonContainer.style.display = 'flex';
                        
                        // EXPANDED VIEW: Full text with Icon
                        shootGlobalBtn.innerHTML = '🔫 x1';
                        shoot2Btn.innerHTML = '🔫 x2';
                        shoot3Btn.innerHTML = '🔫 x3';

                        // Append CONTAINER to Panel
                        panel.appendChild(shootContainer);
                    }
                }
            }


            // --- This part runs regardless of the panel's state ---
            updateStatus();
            updatePanelVisibility();

            // --- TIME CALCULATION (TORN TIME / UTC) ---
            const now = new Date();
            // Create a timestamp for 00:00:00 UTC of the current day
            const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const startOfTodayTimestamp = Math.floor(startOfTodayUTC.getTime() / 1000);

            let dailyProfit = 0;
            for (const game of results) {
                if (game.timestamp >= startOfTodayTimestamp) {
                    dailyProfit += (game.result === 'win' ? game.bet : -game.bet);
                } else {
                    break;
                }
            }


            // Update alerts
            let showAlert = false, alertText = '', alertBackgroundColor = '', alertBorderColor = '';

            if (stopLossEnabled && lossLimit > 0 && dailyProfit <= -lossLimit) {
                showAlert = true;
                isStopLossActive = true;
                alertText = `🚨 DAILY LOSS LIMIT! Bets disabled.`;
                alertBackgroundColor = 'rgba(229, 57, 53, 0.8)';
                alertBorderColor = '#E53935';
            }
            else if (profitTarget > 0 && dailyProfit >= profitTarget) {
                showAlert = true;
                alertText = `🎯 DAILY PROFIT TARGET REACHED!`;
                alertBackgroundColor = 'rgba(76, 175, 80, 0.8)';
                alertBorderColor = '#4CAF50';
            }

            if (showAlert && !isMinimized && !collapsed && !hideAlerts) {
                alertMessageDiv.textContent = alertText;
                Object.assign(alertMessageDiv.style, { background: alertBackgroundColor, borderColor: alertBorderColor, display: 'block' });
            }

            const dailySign = dailyProfit >= 0 ? '+' : '–';
            document.getElementById('rr-daily-profit').textContent = `📅 Daily: ${dailySign}$${Math.abs(dailyProfit).toLocaleString()}`;
            document.getElementById('rr-daily-profit').style.color = dailyProfit >= 0 ? '#4CAF50' : '#E53935';

            if (isSessionActive) {
                const sessionSign = sessionProfit >= 0 ? '+' : '–';
                sessionDiv.textContent = `🔵 Session: ${sessionSign}$${Math.abs(sessionProfit).toLocaleString()}`;
                sessionDiv.style.color = sessionProfit >= 0 ? '#64B4FF' : '#FF7A7A';
                sessionButton.textContent = '⏹️ Stop Session';
                sessionButton.title = `Session started on ${new Date(sessionStartDate).toLocaleString()}`;
            } else {
                sessionDiv.textContent = '🔵 Session: Inactive';
                sessionDiv.style.color = '#888';
                sessionButton.textContent = '▶️ Start Session';
                sessionButton.title = 'Start a new tracking session.';
            }

            const sign = totalProfit >= 0 ? '+' : '–';
            profitMini.textContent = `${sign}$${Math.abs(totalProfit).toLocaleString()}`;
            profitMini.style.color = totalProfit >= 0 ? '#4CAF50' : '#E53935';
            document.getElementById('rr-lifetime-profit').textContent = `💰 LifeTime Profit: ${sign}$${Math.abs(totalProfit).toLocaleString()}`;
            document.getElementById('rr-lifetime-profit').style.color = totalProfit >= 0 ? '#4CAF50' : '#E53935';

            const wins = results.filter(r => r.result === 'win').length;
            const tot = results.length;
            document.getElementById('rr-winrate').textContent = `🎯 Win Rate: ${tot ? ((wins / tot) * 100).toFixed(1) : '0.0'}% (${wins}/${tot})`;

            let w = 0, l = 0;
            for (const r of results) { if (r.result === 'win') { if (l) break; w++; } else { if (w) break; l++; } }
            document.getElementById('rr-streak').textContent = w ? `🔥 Streak: ${w}` : l ? `💀 Streak: ${l}` : '⏸️ No streak';

            // --- RISK ANALYSIS ---
            const riskPanel = document.getElementById('rr-risk-analysis');
            // Recalculate 'l' using your streak logic if needed, but for display we stick to standard 'l'
            if (l > 0 && dynamicBetsEnabled) { 
                const streakLength = l;
                const cumulativeLoss = results.slice(0, streakLength).reduce((acc, game) => acc + game.bet, 0);

                const tornInput = document.querySelector('input[aria-label="Money value"]');
                let nextBet = 0;
                if (tornInput && tornInput.value) {
                    nextBet = parseBetInput(tornInput.value);
                }
                if (!nextBet || nextBet <= 0) {
                    if (bettingMode === 'simple') {
                        nextBet = getBetForStep(simpleModeStep);
                    } else {
                        nextBet = currentBets[l] || 0;
                    }
                }
                const potentialLoss = cumulativeLoss + nextBet;
                const capital = dynamicBetsSettings.capital;
                const capitalAtRisk = capital > 0 ? ((potentialLoss / capital) * 100).toFixed(1) : 0;
                const profitOnWin = nextBet - cumulativeLoss;
                const riskRewardRatio = profitOnWin > 0 ? (potentialLoss / profitOnWin).toFixed(0) : 0;
                let threatLevel = { text: 'LOW', color: '#4CAF50' };
                if (streakLength >= 4) threatLevel = { text: 'MODERATE', color: '#FFC107' };
                if (streakLength >= 7) threatLevel = { text: 'HIGH', color: '#FF9800' };
                if (streakLength >= 10) threatLevel = { text: 'CRITICAL', color: '#E53935' };
                const probNextLoss = (Math.pow(0.5, streakLength + 1) * 100).toFixed(2);
                let lossesUntilBroke = 'N/A';
                if (capital > 0) {
                    let futureLoss = potentialLoss;
                    let steps = 1;
                    while (futureLoss < capital && (streakLength + steps) < currentBets.length) {
                        futureLoss += currentBets[streakLength + steps];
                        steps++;
                    }
                    if (futureLoss >= capital) lossesUntilBroke = `${steps} Loss${steps > 1 ? 'es' : ''}`;
                    else lossesUntilBroke = `> ${steps - 1}`;
                }

                riskPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; padding-bottom: 4px; border-bottom: 1px solid #555;">
                <span>Martingale Risk Analysis (L${streakLength} / Max L${maxLossStreak})</span>
                <span style="color: ${threatLevel.color};">Risk: ${threatLevel.text}</span>
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 2px 8px;">
                <span>Profit on Win:</span> <span style="text-align: right; color: #4CAF50;">+$${profitOnWin.toLocaleString()}</span>
                <span>Potential Loss:</span> <span style="text-align: right; color: #FF9800;">-$${potentialLoss.toLocaleString()}</span>
                <span>Cumulative Loss:</span> <span style="text-align: right; color: #E53935;">-$${cumulativeLoss.toLocaleString()}</span>
                <span title="You are risking ${potentialLoss.toLocaleString()} to win ${profitOnWin.toLocaleString()}">Risk/Reward Ratio:</span> <span style="text-align: right;">${riskRewardRatio} : 1</span>
                <span>Capital at Risk:</span> <span style="text-align: right;">${capitalAtRisk}%</span>
                <span>P(Streak ≥ ${streakLength + 1}):</span> <span style="text-align: right;">${probNextLoss}%</span>
            </div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #555; text-align: center; font-weight: bold;">
                <span style="color: #E53935;">Capital Breach In: ${lossesUntilBroke}</span>
            </div>
        `;
                riskPanel.style.borderColor = threatLevel.color;
                riskPanel.style.display = 'flex'; 
            }

            miniStreakDiv.textContent = document.getElementById('rr-streak').textContent;
            miniDailyProfitDiv.innerHTML = `📅 <small>${dailySign}$${Math.abs(dailyProfit).toLocaleString()}</small>`;
            miniDailyProfitDiv.style.color = document.getElementById('rr-daily-profit').style.color;
            miniSessionDiv.innerHTML = sessionDiv.textContent.replace('Session:', '<small>Session:</small>');
            miniSessionDiv.style.color = sessionDiv.style.color;

            resultsContainer.innerHTML = '';
            results.slice(0, maxDisplayMatches).forEach((r, i) => {
                const row = document.createElement('div');
                const winLossCircle = makeCircle(r.result, r.bet, i);
                const textNode = document.createTextNode(` ${i + 1}. ${r.result.toUpperCase()} — $${r.bet.toLocaleString()}`);
                row.append(winLossCircle, textNode);
                resultsContainer.appendChild(row);
            });

            if (showEditBetsPanel) {
                capitalInput.value = formatNumberToKMB(dynamicBetsSettings.capital);
                startingBetInput.value = formatNumberToKMB(dynamicBetsSettings.startingBet);
                capitalLock.textContent = dynamicBetsSettings.lockedField === 'capital' ? '🔒' : '🔓';
                startingBetLock.textContent = dynamicBetsSettings.lockedField === 'startingBet' ? '🔒' : '🔓';
                capitalInput.readOnly = dynamicBetsSettings.lockedField !== 'capital';
                startingBetInput.readOnly = dynamicBetsSettings.lockedField !== 'startingBet';
                capitalInput.style.background = dynamicBetsSettings.lockedField === 'capital' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)';
                startingBetInput.style.background = dynamicBetsSettings.lockedField === 'startingBet' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)';
            }
            if (showSettings) {
                profitTargetInput.value = formatNumberToKMB(profitTarget);
                lossLimitInput.value = formatNumberToKMB(lossLimit);
            }

            buildBetButtons();
        }

        

        const savePos = () => localStorage.setItem(POS_KEY, JSON.stringify({ top: panel.style.top, left: panel.style.left }));
        function onDragMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const moveEvent = e.touches ? e.touches[0] : e;
            if (typeof moveEvent.clientX === 'undefined') return;

            const dx = moveEvent.clientX - dragMouseX;
            const dy = moveEvent.clientY - dragMouseY;
            dragMouseX = moveEvent.clientX;
            dragMouseY = moveEvent.clientY;

            let newLeft = panel.offsetLeft + (dx / panelScale);
            let newTop = panel.offsetTop + (dy / panelScale);

            // --- Boundary Checks (Corrected) ---
            const panelRenderedWidth = panel.offsetWidth * panelScale;
            const panelRenderedHeight = panel.offsetHeight * panelScale;

            const minX = 0;
            const maxX = window.innerWidth - panelRenderedWidth;
            const minY = 0;
            const maxY = window.innerHeight - panelRenderedHeight;


            newLeft = Math.max(minX, Math.min(newLeft, maxX));
            newTop = Math.max(minY, Math.min(newTop, maxY));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        }

        function onDragEnd() { if (!isDragging) return; isDragging = false; document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd); document.removeEventListener('touchmove', onDragMove); document.removeEventListener('touchend', onDragEnd); savePos(); panel.style.cursor = ''; document.body.style.cursor = ''; }
        function startDrag(e) { if (isTwoFingerDragging) return; e.preventDefault(); const startEvent = e.touches ? e.touches[0] : e; if (typeof startEvent.clientX === 'undefined') return; isDragging = true; dragMouseX = startEvent.clientX; dragMouseY = startEvent.clientY; panel.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.addEventListener('mousemove', onDragMove); document.addEventListener('mouseup', onDragEnd); document.addEventListener('touchmove', onDragMove, { passive: false }); document.addEventListener('touchend', onDragEnd); }
        dragHandle.addEventListener('mousedown', startDrag);
        dragHandle.addEventListener('touchstart', e => { if (e.touches.length === 1) startDrag(e); });
        panel.addEventListener('mousedown', e => { if (e.shiftKey && e.target !== dragHandle) startDrag(e); });
        panel.addEventListener('touchstart', e => { if (e.touches.length === 2) { e.preventDefault(); isTwoFingerDragging = true; isDragging = false; initialTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2; initialTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2; initialPanelX = panel.offsetLeft; initialPanelY = panel.offsetTop; panel.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.addEventListener('touchmove', onTwoFingerMove, { passive: false }); document.addEventListener('touchend', onTwoFingerEnd); } });
        function onTwoFingerMove(e) {
            if (!isTwoFingerDragging || e.touches.length !== 2) { onTwoFingerEnd(e); return; }
            e.preventDefault();
            const currentTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const currentTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const dx = currentTouchMidX - initialTouchMidX;
            const dy = currentTouchMidY - initialTouchMidY;

            let newLeft = initialPanelX + (dx / panelScale);
            let newTop = initialPanelY + (dy / panelScale);

            // --- Boundary Checks (Corrected) ---
            const panelRenderedWidth = panel.offsetWidth * panelScale;
            const panelRenderedHeight = panel.offsetHeight * panelScale;

            const minX = 0;
            const maxX = window.innerWidth - panelRenderedWidth;
            const minY = 0;
            const maxY = window.innerHeight - panelRenderedHeight;


            newLeft = Math.max(minX, Math.min(newLeft, maxX));
            newTop = Math.max(minY, Math.min(newTop, maxY));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        }

        function onTwoFingerEnd(e) { if (!isTwoFingerDragging) return; if (e.touches.length < 2) { document.removeEventListener('touchmove', onTwoFingerMove); document.removeEventListener('touchend', onTwoFingerEnd); savePos(); isTwoFingerDragging = false; panel.style.cursor = ''; document.body.style.cursor = ''; } }

        statusDiv.addEventListener('click', () => {
            if (isDragging || isTwoFingerDragging) return;
            collapsed = !collapsed;
            // The lines that reset the view have been removed from here.
            saveCollapsed();
            refreshAll();
        });

        // --- REAL-TIME INPUT LISTENER ---
        // This detects when you type manually in the Torn input box and updates the Risk Panel immediately.
        document.body.addEventListener('input', (e) => {
            if (e.target && e.target.getAttribute('aria-label') === 'Money value') {
                refreshAll();
            }
        });

        // --- Main Loop ---

        // --- STARTUP SEQUENCE ---
        
        // 1. Check if Deep Sync was interrupted and resume it
        if (localStorage.getItem(DEEP_SYNC_KEY)) {
            console.log("RR Tracker: Resuming interrupted Deep Sync...");
            processDeepSyncStep();
        }
        calculateBetsAndRefresh();
        initiateSyncing();
        syncCountdownInterval = setInterval(updateSyncTimer, 1000);
        
        
        enableNetworkInterception(); // <--- ADD THIS CALL
        enableTextBasedDetection(); // You can comment this out if you trust the network interceptor


        // --- Simulator Panel Logic ---
        const simulatorDynamicToggle = document.getElementById('simulator-dynamic-toggle');
        const simulatorManualBetsContainer = document.getElementById('simulator-manual-bets-container');
        const simulatorManualBetsInput = document.getElementById('simulator-manual-bets');
        const simulatorCapitalInput = document.getElementById('simulator-capital');
        const simulatorMaxStreakInput = document.getElementById('simulator-max-streak');
        const simulatorMatchesInput = document.getElementById('simulator-matches');
        const simulatorSessionsInput = document.getElementById('simulator-sessions');
        const simulatorRunBtn = document.getElementById('simulator-run-btn');
        const simulatorResultsContainer = document.getElementById('simulator-results-container');
        const simulatorCopyBtn = document.getElementById('simulator-copy-dynamic-btn');

        // Populate inputs from saved values
        simulatorCapitalInput.value = simCapital;
        simulatorMaxStreakInput.value = simMaxLStreak;
        simulatorMatchesInput.value = simMatches;
        simulatorSessionsInput.value = simSessions;
        simulatorManualBetsInput.value = simulatorManualBetsString;

        // Set the initial state of the toggle from our loaded variable
        simulatorDynamicToggle.checked = simUseDynamic;

        // Save changes when inputs are modified
        simulatorCapitalInput.onchange = () => localStorage.setItem(SIM_CAPITAL_KEY, simulatorCapitalInput.value);
        simulatorMaxStreakInput.onchange = () => localStorage.setItem(SIM_STREAK_KEY, simulatorMaxStreakInput.value);
        simulatorMatchesInput.onchange = () => localStorage.setItem(SIM_MATCHES_KEY, simulatorMatchesInput.value);
        simulatorSessionsInput.onchange = () => localStorage.setItem(SIM_SESSIONS_KEY, simulatorSessionsInput.value);
        simulatorManualBetsInput.onchange = () => {
            simulatorManualBetsString = simulatorManualBetsInput.value;
            localStorage.setItem(SIM_MANUAL_BETS_KEY, simulatorManualBetsString);
        };

        document.getElementById('simulator-back-btn').onclick = () => { showSimulatorPanel = false; refreshAll(); };

        const syncSimulatorUI = () => {
            const useDynamic = simulatorDynamicToggle.checked;
            if (useDynamic) {
                simulatorManualBetsString = simulatorManualBetsInput.value;
                simulatorManualBetsContainer.style.display = 'none';
            } else {
                simulatorManualBetsContainer.style.display = 'flex';
                simulatorManualBetsInput.value = simulatorManualBetsString;
            }
        };

        // This is the updated onchange handler that saves the state
        simulatorDynamicToggle.onchange = () => {
            simUseDynamic = simulatorDynamicToggle.checked; // Update state variable
            localStorage.setItem(SIM_USE_DYNAMIC_KEY, JSON.stringify(simUseDynamic)); // Save the new choice
            syncSimulatorUI(); // Update the UI
        };

        // --- NEW, SMARTER LOGIC FOR THE COPY BUTTON ---
        simulatorCopyBtn.onclick = () => {
            if (!dynamicBetsEnabled || !currentBets || currentBets.length === 0) {
                alert("Please enable 'Dynamic Bets' in the main settings and ensure a valid strategy is calculated.");
                return;
            }

            const desiredStreakLength = parseInt(simulatorMaxStreakInput.value, 10);
            if (isNaN(desiredStreakLength) || desiredStreakLength < 1) {
                alert("Please enter a valid 'Max L Streak' in the simulator panel first.");
                return;
            }

            // Get the core components of the current dynamic strategy
            const startingBet = currentBets[0];
            const { martingaleValue, reinforce, boostedBets } = dynamicBetsSettings;

            // Use the script's own ratio calculator to generate a new progression
            const { coeffs } = getSumOfRatios(desiredStreakLength, martingaleValue, reinforce, desiredStreakLength, boostedBets);

            // Build the new bet array based on the starting bet and the new coefficients
            const newProgression = coeffs.map(ratio => Math.floor(startingBet * ratio));

            const betsString = newProgression.join(', ');
            simulatorManualBetsInput.value = betsString;
            simulatorManualBetsInput.dispatchEvent(new Event('change')); // Trigger save
        };

        // --- New Onclick Handler for the Deep Simulation Button ---
        const simulatorDeepRunBtn = document.getElementById('simulator-deep-run-btn');
        const deepResultsContainer = document.getElementById('simulator-deep-results-container');

        simulatorDeepRunBtn.onclick = () => {
            const simulatorGraphCanvas = document.getElementById('simulator-graph-canvas');

            // Hide other panels and show a loading message
            document.getElementById('simulator-results-container').style.display = 'none';
            simulatorGraphCanvas.style.display = 'none';
            deepResultsContainer.style.display = 'block';
            deepResultsContainer.innerHTML = 'Running deep analysis... This can take some time for high simulation counts.';
            simulatorDeepRunBtn.disabled = true;
            document.getElementById('simulator-run-btn').disabled = true;

            setTimeout(() => {
                try {
                    // 1. GATHER PARAMETERS
                    const capital = parseBetInput(simulatorCapitalInput.value);
                    const matches = parseInt(simulatorMatchesInput.value, 10);
                    const simulations = parseInt(simulatorSessionsInput.value, 10);
                    let bets;
                    const useDynamic = simulatorDynamicToggle.checked;
                    if (useDynamic) { bets = currentBets; }
                    else {
                        bets = simulatorManualBetsInput.value.split(',').map(s => parseBetInput(s.trim())).filter(n => n !== null && n > 0);
                    }

                    // --- ADD THIS VALIDATION BLOCK ---
                    if (!simulations || simulations < 1 || !matches || matches < 1 || !capital) {
                        deepResultsContainer.innerHTML = `<div style="color: #FFC107; text-align: center; padding: 10px;">
                        <strong>Invalid Input</strong><br>
                        Please ensure Capital, Matches, and Number of Simulations are all valid numbers greater than 0.
                        </div>`;
                        // Re-enable buttons and stop the function
                        simulatorDeepRunBtn.disabled = false;
                        document.getElementById('simulator-run-btn').disabled = false;
                        return;
                    }
                    // --- END OF VALIDATION BLOCK ---

                    // 2. RUN THE ANALYSIS
                    const results = runDeepAnalysis({ capital, bets, matches, simulations });

                    if (results.length === 0) {
                        deepResultsContainer.innerHTML = 'Analysis could not be completed. Check your inputs or try more matches/simulations.';
                        return;
                    }

                    const bestProfitResult = [...results].sort((a, b) => b.avgProfit - a.avgProfit)[0];
                    const safestProfitable = results.filter(r => r.avgProfit > 0).sort((a,b) => a.bankRate - b.bankRate)[0];

                    // 3. BUILD THE HTML TABLE
                    let tableHTML = `
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; text-align: center;">🔬 Deep Simulation Results</div>
                    <div style="max-height: 220px; overflow-y: auto; border: 1px solid #333; border-radius: 4px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid #888; position: sticky; top: 0; background: rgba(0,0,0,0.8);">
                                <th style="padding: 4px;">Max L Streak</th>
                                <th style="padding: 4px; text-align: right;">Avg. Profit</th>
                                <th style="padding: 4px; text-align: right;">Bankrupt %</th>
                                <th style="padding: 4px;">Safety</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                    results.forEach(res => {
                        const profitColor = res.avgProfit > 0 ? '#4CAF50' : '#E53935';
                        let safety, safetyColor;
                        if (res.bankRate === 0)      { safety = 'Perfect ✅';   safetyColor = '#4CAF50'; }
                        else if (res.bankRate < 1)   { safety = 'Very Safe';    safetyColor = '#8BC34A'; }
                        else if (res.bankRate < 5)   { safety = 'Safe';         safetyColor = '#CDDC39'; }
                        else if (res.bankRate < 15)  { safety = 'Moderate 🤔';  safetyColor = '#FFC107'; }
                        else if (res.bankRate < 30)  { safety = 'Risky ⚠️';     safetyColor = '#FF9800'; }
                        else if (res.bankRate < 50)  { safety = 'Very Risky ‼️'; safetyColor = '#FF5722'; }
                        else                         { safety = 'Suicidal 💀';  safetyColor = '#E53935'; }
                        let limitText = `L${res.limit}`;
                        if (res.bankRate === 100) {
                            limitText += ` <span style="color: #E53935;">(bankruptcy)</span>`;
                        }
                        tableHTML += `
                        <tr style="border-bottom: 1px solid #444;">
                            <td style="padding: 4px; color: #fff;">${limitText}</td>
                            <td style="padding: 4px; text-align: right; color: ${profitColor};">${bestProfitResult && res.limit === bestProfitResult.limit ? '🔥' : ''}$${formatNumberToKMB(res.avgProfit)}</td>
                            <td style="padding: 4px; text-align: right;">${res.bankRate.toFixed(2)}%</td>
                            <td style="padding: 4px; color: ${safetyColor};">${safety}</td>
                        </tr>
                    `;
                    });
                    tableHTML += `</tbody></table></div>`;

                    // 4. ADD THE FINAL SUMMARY
                    let summaryHTML = `<div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #555; text-align: center;">`;
                    if (bestProfitResult) {
                        summaryHTML += `<strong>Highest Profit:</strong> Set Max L Streak to <strong>L${bestProfitResult.limit}</strong> for an average of <strong style="color: #4CAF50;">$${formatNumberToKMB(bestProfitResult.avgProfit)}</strong> per run.<br>`;
                    }
                    if (safestProfitable) {
                        summaryHTML += `<strong>Safest Profitable Option:</strong> Set Max L Streak to <strong>L${safestProfitable.limit}</strong>, with a bankruptcy rate of <strong>${safestProfitable.bankRate.toFixed(2)}%</strong>.`;
                    } else {
                        summaryHTML += `<strong style="color: #E53935;">No strategy was found to be consistently profitable with these settings.</strong>`;
                    }
                    summaryHTML += `</div>`;

                    deepResultsContainer.innerHTML = tableHTML + summaryHTML;

                    // 5. SHOW and DRAW the graph
                    simulatorGraphCanvas.style.display = 'block';
                    drawDeepAnalysisGraph(simulatorGraphCanvas, results);

                } catch (e) {
                    deepResultsContainer.innerHTML = `An error occurred during deep analysis: ${e.message}`;
                    console.error("Deep simulation failed", e);
                } finally {
                    simulatorDeepRunBtn.disabled = false;
                    document.getElementById('simulator-run-btn').disabled = false;
                }
            }, 50);
        };

        // A variable to hold our chart so we can destroy it later
        let simulatorChart = null;

        simulatorRunBtn.onclick = () => {
            const simulatorGraphCanvas = document.getElementById('simulator-graph-canvas');
            document.getElementById('simulator-deep-results-container').style.display = 'none';
            document.getElementById('simulator-results-container').style.display = 'block';

            simulatorResultsContainer.textContent = 'Running simulations... This may take a moment.';
            simulatorRunBtn.disabled = true;
            document.getElementById('simulator-deep-run-btn').disabled = true;
            simulatorGraphCanvas.style.display = 'none';

            if (simulatorChart) {
                simulatorChart.destroy();
                simulatorChart = null;
            }

            setTimeout(() => {
                try {
                    // 1. GATHER PARAMETERS
                    const capital = parseBetInput(simulatorCapitalInput.value);
                    const maxLStreak = parseInt(simulatorMaxStreakInput.value, 10);
                    const matches = parseInt(simulatorMatchesInput.value, 10);
                    const sessions = parseInt(simulatorSessionsInput.value, 10);
                    let bets;
                    const useDynamic = simulatorDynamicToggle.checked;
                    if (useDynamic) { bets = currentBets; }
                    else {
                        bets = simulatorManualBetsInput.value.split(',').map(s => parseBetInput(s.trim())).filter(n => n !== null && n > 0);
                    }

                    // VALIDATION
                    if (!sessions || sessions < 1 || !matches || matches < 1 || !capital) {
                        simulatorResultsContainer.innerHTML = `<div style="color: #FFC107; text-align: center; padding: 10px;"><strong>Invalid Input</strong><br>Please ensure Capital, Matches, and Sessions are all valid numbers greater than 0.</div>`;
                        simulatorRunBtn.disabled = false; document.getElementById('simulator-deep-run-btn').disabled = false;
                        return;
                    }
                    if ((matches * sessions) > 10000000) {
                        simulatorResultsContainer.innerHTML = `<div style="color: #FFC107; text-align: center; padding: 10px;"><strong>Limit Exceeded</strong><br>Total matches (Matches × Sessions) cannot exceed 10 million. Please adjust your inputs.</div>`;
                        simulatorRunBtn.disabled = false; document.getElementById('simulator-deep-run-btn').disabled = false;
                        return;
                    }

                    const simParams = { capital, maxLStreak, bets, matches, sessions };

                    // 2A: Run the Multi-Session Analysis
                    const summary = runMultipleSimulations(simParams);

                    // 2B: Run the Cumulative Simulation
                    const cumulativeResult = runCumulativeSimulation(simParams);

                    // 3. BUILD THE COMBINED REPORT
                    let multiStreakReport = 'Total L-Streak Occurrences:\n';
                    const multiSortedStreaks = Object.keys(summary.aggregateStreaks).map(Number).sort((a, b) => a - b);
                    if (multiSortedStreaks.length > 0) {
                        multiSortedStreaks.forEach(streakLen => {
                            const count = summary.aggregateStreaks[streakLen];
                            multiStreakReport += `  L${streakLen}: ${count.toLocaleString()} times\n`;
                        });
                    } else { multiStreakReport += '  None recorded.'; }
                    const avgProfitColor = summary.averageProfit >= 0 ? '#4CAF50' : '#E53935';
                    const medianProfitColor = summary.medianProfit >= 0 ? '#4CAF50' : '#E53935';

                    const cumulativeProfit = cumulativeResult.finalCapital - capital;
                    const cumulativeProfitSign = cumulativeProfit >= 0 ? '+' : '-';
                    const cumulativeProfitColor = cumulativeProfit >= 0 ? '#4CAF50' : '#E53935';
                    let cumulativeStreakReport = 'L-Streak Occurrences:\n';
                    const cumulativeSortedStreaks = Object.keys(cumulativeResult.streakCounts).map(Number).sort((a, b) => a - b);
                    if (cumulativeSortedStreaks.length > 0) {
                        cumulativeSortedStreaks.forEach(streakLen => {
                            const count = cumulativeResult.streakCounts[streakLen];
                            cumulativeStreakReport += `  L${streakLen}: ${count.toLocaleString()} times\n`;
                        });
                    } else { cumulativeStreakReport += '  None recorded.'; }

                    simulatorResultsContainer.innerHTML = `
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #555; text-align: center;">📈 Multi-Session Analysis <small>(${summary.sessions.toLocaleString()} independent runs)</small></div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 10px;">
                    <span>Success Rate:</span> <span style="text-align: right; font-weight: bold; color: #4CAF50;">${(100 - summary.bankruptRate).toFixed(2)}%</span>
                    <span>Total Resets:</span> <span style="text-align: right; font-weight: bold; color: #FFC107;">${summary.totalResets.toLocaleString()}</span>
                    <span>Average P/L:</span> <span style="text-align: right; font-weight: bold; color: ${avgProfitColor};">$${formatNumberToKMB(summary.averageProfit)}</span>
                    <span>Median P/L:</span> <span style="text-align: right; font-weight: bold; color: ${medianProfitColor};">$${formatNumberToKMB(summary.medianProfit)}</span>
                    <span>Main Failure Point:</span> <span style="text-align: right; color: #E53935;">${summary.mostCommonFailure}</span>
                </div>
                <pre style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #444; font-size: 12px; color: #ccc; white-space: pre-wrap;">${multiStreakReport}</pre>

                <div style="font-weight: bold; font-size: 14px; margin: 20px 0 8px 0; padding-bottom: 5px; border-bottom: 1px solid #555; text-align: center;">➡️ Cumulative Run <small>(One continuous journey)</small></div>
                <div style="font-style: italic; color: #ccc; margin-bottom: 8px; text-align: center;">${cumulativeResult.stopReason}</div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 10px;">
                    <span>Final Capital:</span> <span style="text-align: right; font-weight: bold;">$${formatNumberToKMB(cumulativeResult.finalCapital)}</span>
                    <span>Cumulative Profit:</span> <span style="text-align: right; font-weight: bold; color: ${cumulativeProfitColor};">${cumulativeProfitSign}$${formatNumberToKMB(Math.abs(cumulativeProfit))}</span>
                    <span>Total Resets:</span> <span style="text-align: right; font-weight: bold; color: #FFC107;">${cumulativeResult.resetCount.toLocaleString()}</span>
                </div>
                <pre style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #444; font-size: 12px; color: #ccc; white-space: pre-wrap;">${cumulativeStreakReport}</pre>`;

                    // --- DATA SAMPLING FOR PERFORMANCE ---
                    if (cumulativeResult.capitalHistory.length > 1) {
                        const fullData = cumulativeResult.capitalHistory;
                        const sampledData = sampleData(fullData, 2000); // Sample down to a max of 2000 points

                        const dataPoints = sampledData.map((value, index) => {
                            // We need to scale the index to represent the full timeline
                            const originalIndex = Math.floor(index * (fullData.length / sampledData.length));
                            return { timestamp: originalIndex, cumulativeProfit: value };
                        });

                        simulatorGraphCanvas.style.display = 'block';
                        simulatorChart = new RrChart(simulatorGraphCanvas, dataPoints, null);
                    }

                } catch (e) {
                    simulatorResultsContainer.textContent = `An unexpected error occurred during simulation: ${e.message}`;
                    console.error("Simulation failed", e);
                } finally {
                    simulatorRunBtn.disabled = false;
                    document.getElementById('simulator-deep-run-btn').disabled = false;
                }
            }, 50);
        };


        // Set initial state of the simulator UI
        simulatorDynamicToggle.checked = true;
        syncSimulatorUI();


        // --- Add these new handlers at the end of the script ---
        document.getElementById('simulator-configure-btn').onclick = () => {
            showSimulatorConfig = true;
            refreshSimulatorView();
        };

        document.getElementById('simulator-config-back-btn').onclick = () => {
            showSimulatorConfig = false;
            refreshSimulatorView();
        };



    } catch (error) { // <<< ADD THIS ENTIRE BLOCK
        console.error("RR Tracker CRITICAL ERROR:", error); // Also log to the real console for good measure

        const errorPopup = document.createElement('div');
        Object.assign(errorPopup.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(40, 0, 0, 0.95)',
            color: '#ffcdd2',
            border: '2px solid #e53935',
            borderRadius: '8px',
            padding: '20px',
            zIndex: '999999999',
            maxWidth: '90vw',
            fontFamily: 'monospace',
            fontSize: '14px',
            boxShadow: '0 0 15px rgba(0,0,0,0.5)'
        });

        errorPopup.innerHTML = `
            <h2 style="color: #ef5350; margin: 0 0 15px 0;">🚨 RR Tracker Script Crashed!</h2>
            <p style="margin: 5px 0;"><strong>Error Type:</strong> <span style="color: white;">${error.name}</span></p>
            <p style="margin: 5px 0 15px 0;"><strong>Message:</strong> <span style="color: white;">${error.message}</span></p>
            <strong style="color: white; display: block; margin-bottom: 5px;">Stack Trace (Location of the error):</strong>
            <pre style="background: #1a1a1a; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-break: break-all; color: #ffcdd2;">${error.stack}</pre>
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = '❌ Close';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#c62828',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer'
        });
        closeButton.onclick = () => errorPopup.remove();

        errorPopup.prepend(closeButton);
        document.body.appendChild(errorPopup);
    }
// --- NETWORK INTERCEPTOR ---
function enableNetworkInterception() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.includes('sid=russianRouletteData')) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    
                    // Check if the response contains game data
                    if (response && response.data) {
                        const data = response.data;
                        
                        // 1. DETECT GAME OVER (Winner determined)
                        // If winner is NOT null, someone died.
                        if (data.winner) {
                            console.log("RR Tracker (Net): Game Over detected via Network.");
                            
                            // Trigger Sync
                            importApiData(true);

                            // Trigger Flash
                            // We need to know who won. We can check the 'message' or 'winner.ID'.
                            // However, since we don't have the User's ID stored easily in a global var in this scope,
                            // We can infer from the message or just trigger sync and let the text observer handle the flash backup,
                            // OR we can parse the "message" string.
                            
                            if (response.user && response.user.player_id) {
                                // If the API provided the user ID (sometimes it does in wrapper)
                                if (data.winner.ID === response.user.player_id) triggerFlash('win');
                                else triggerFlash('loss');
                            } else {
                                // Fallback: Check message text in the JSON
                                if (data.message && data.message.includes("You take your winnings")) triggerFlash('win');
                                else if (data.message && data.message.includes("You fall down")) triggerFlash('loss');
                            }
                            
                            // Handle Instant Leave if enabled
                            const instantLeave = JSON.parse(localStorage.getItem('rr_instantLeave') || 'false');
                            if (instantLeave) {
                                setTimeout(() => {
                                    window.location.href = "https://www.torn.com/page.php?sid=russianRoulette";
                                }, 500);
                            }
                        }
                    }
                } catch (e) {
                    console.error("RR Tracker: Network Parse Error", e);
                }
            });
        }
        return originalSend.apply(this, arguments);
    };
    console.log("RR Tracker: Network Interception Enabled.");
}


})()