// ==UserScript==
// @name         RR Tracker v11(final release)
// @namespace    https://greasyfork.org/users/1493252
// @version      11
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
//###* A new icon (➕/➡️) next to the result circle shows if you 'created' or 'joined' the game.
//###Edit Bets (✏️ NEW LOGIC!)
//###* Enable "Dynamic Bets" to use the new calculator.
//###* Set your strategy (Capital, Streak, Multiplier).
//###* Use the lock icons (🔒/🔓) to choose your calculation method.
//###* Lock 'Gambling Capital' to calculate the 'Starting Bet'.
//###* Lock 'Starting Bet' to calculate the required 'Gambling Capital'.
//###* The script populates your bet buttons automatically.
//###* Disable "Dynamic Bets" to return to setting bets manually.
//###Charging Shoots (⚡)
//###* When enabled in settings, a new panel appears during matches.
//###* Click "+ Add Charge" to load up to 3 shoots.
//###* The script will automatically click the "Shoot" button for you.
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545864/RR%20Tracker%20v11%28final%20release%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545864/RR%20Tracker%20v11%28final%20release%29.meta.js
// ==/UserScript==

(function waitUntilReady() {
    'use strict';

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

    const PANEL_ID = 'rr-tracker-panel';
    const API_SYNC_INTERVAL_MS = 15 * 1000; // 15 seconds. This now controls everything.
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
    const UI_BUTTON_COUNT_KEY = 'rr_uiButtonCount';
    const MAX_L_STREAK_CAP = 15;
    const PANEL_SCALE_KEY = 'rr_panelScale';
	 const MANUAL_SYNC_COOLDOWN_KEY = 'rr_tracker_last_manual_sync';

    const DEFAULT_DYNAMIC_SETTINGS = {
        testBet: 10000,
        capital: 100000000,
        maxLStreak: 10,
        martingaleValue: 2,
        reinforce: false,
        lockedField: 'capital',
        startingBet: 0
    };
	  
    
// --- State Variables ---
    let apiKey = '';
    let lastSyncTime = 0;
    let manualBets, currentBets, showBetsPanel, showEditBetsPanel, showStatsPanel, isDragging, dragMouseX, dragMouseY, isTwoFingerDragging, initialTouchMidX, initialTouchMidY, initialPanelX, initialPanelY;
    let results, totalProfit, collapsed, autoHide, showSettings, maxDisplayMatches, currentOpacity, profitTarget, lossLimit, alertShownProfit, alertShownLoss, miniBarCount, miniButtonSize;
    let isShootDelayed = false;
    let uiButtonCount;
let isMinimized = false;
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

    // --- Dynamic Bets State ---
    let dynamicBetsEnabled, dynamicBetsSettings;
    let capitalInput, startingBetInput, testBetInput, capitalLock, startingBetLock;

    // --- Stats Panel State ---
    let currentStatsTimeframe = 7;

    const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

    // --- Initial Checks ---
    if (document.getElementById(PANEL_ID)) return;
    if (!document.body.innerText.includes('Password') && !document.body.innerText.includes('POT MONEY') && !document.body.innerText.includes('Shoot') && !document.body.innerText.includes('Players') && !document.querySelector('.create-game-section') && !document.querySelector('.russian-roulette-container')) {
        return setTimeout(waitUntilReady, 200);
    }

    // --- Load Data and Initialize Variables ---
    function initializeState() {
isMinimized = JSON.parse(localStorage.getItem(MINIMIZE_KEY) || 'false');

        apiKey = localStorage.getItem(API_KEY_STORAGE) || '';lastSyncTime = parseInt(localStorage.getItem(LAST_SYNC_KEY) || '0', 10);
        manualBets = []; currentBets = []; showBetsPanel = false; showEditBetsPanel = false; showStatsPanel = false; isDragging = false; dragMouseX = 0; dragMouseY = 0; isTwoFingerDragging = false; initialTouchMidX = 0; initialTouchMidY = 0; initialPanelX = 0; initialPanelY = 0;

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
        alertShownProfit = JSON.parse(localStorage.getItem(ALERT_SHOWN_PROFIT_KEY) || 'false');
        alertShownLoss = JSON.parse(localStorage.getItem(ALERT_SHOWN_LOSS_KEY) || 'false');
        miniBarCount = parseInt(localStorage.getItem(MINI_BAR_COUNT_KEY) || '10', 10);
        if (isNaN(miniBarCount) || miniBarCount < 1 || miniBarCount > 50) { miniBarCount = 10; localStorage.setItem(MINI_BAR_COUNT_KEY, miniBarCount.toString()); }
        miniButtonSize = parseInt(localStorage.getItem(MINI_BUTTON_SIZE_KEY) || '9', 10);
        if (isNaN(miniButtonSize) || miniButtonSize < 7 || miniButtonSize > 14) { miniButtonSize = 9; localStorage.setItem(MINI_BUTTON_SIZE_KEY, miniButtonSize.toString()); }
        uiButtonCount = 16;
        if (isNaN(uiButtonCount) || uiButtonCount < 4 || uiButtonCount > 16) { uiButtonCount = 11; localStorage.setItem(UI_BUTTON_COUNT_KEY, uiButtonCount.toString()); }
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
    sessionStartDate = parseInt(localStorage.getItem(SESSION_START_KEY) || '0', 10);
        manualBets = loadManualBets();
        adjustManualBetsArray();
    }
    initializeState();

    // --- UI Creation ---
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    Object.assign(panel.style, {
        position: 'fixed', top: '12px', left: '12px', background: `rgba(0,0,0,${currentOpacity})`, color: '#fff',
        fontFamily: 'monospace', fontSize: '14px', padding: '36px 12px 12px', borderRadius: '10px',
        boxShadow: '0 0 12px rgba(255,0,0,0.3)', zIndex: '9999999', userSelect: 'none', display: 'flex',
        flexDirection: 'column', gap: '8px', minWidth: '140px',
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
        isMinimized = !isMinimized;
        if (isMinimized) {
            collapsed = true; // Minimizing also collapses the panel
            saveCollapsed();
        }
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
    profitDiv.title = "Total profit or loss tracked since the last reset.";

    const dailyProfitDiv = document.createElement('div');
    dailyProfitDiv.title = "Profit or loss for today (since midnight local time).";

    const winrateDiv = document.createElement('div');
    const streakDiv = document.createElement('div');
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
statsGroup.append(profitDiv, dailyProfitDiv, winrateDiv, streakDiv, syncTimerDisplay, sessionDiv);

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

    const clearAlertsBtn = document.createElement('button'); clearAlertsBtn.textContent = '✔️ Clear Alerts'; clearAlertsBtn.title = "Dismiss any active Profit Target or Loss Limit alerts."; Object.assign(clearAlertsBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
    clearAlertsBtn.onmouseenter = () => clearAlertsBtn.style.background = 'rgba(255,255,255,0.2)'; clearAlertsBtn.onmouseleave = () => clearAlertsBtn.style.background = 'rgba(255,255,255,0.1)';
    clearAlertsBtn.onclick = () => { alertShownProfit = false; alertShownLoss = false; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'false'); localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'false'); alertMessageDiv.style.display = 'none'; refreshAll(); };
    settingsScrollContainer.appendChild(clearAlertsBtn);

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

    const resetBtn = document.createElement('button'); resetBtn.textContent = '🔄 Reset Data'; resetBtn.title = "WARNING: This will clear all tracked stats, profit, and reset all bet configurations to default.";
    Object.assign(resetBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' });
    resetBtn.onmouseenter = () => resetBtn.style.background = 'rgba(255,255,255,0.2)'; resetBtn.onmouseleave = () => resetBtn.style.background = 'rgba(255,255,255,0.1)';
        resetBtn.onclick = () => {
        if (confirm('Clear all results and reset profit? This will also reset all bet configurations and your API key.')) {
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
            
            // --- ADD THESE THREE LINES TO RESET THE SESSION ---
            localStorage.removeItem(SESSION_ACTIVE_KEY);
            localStorage.removeItem(SESSION_PROFIT_KEY);
            localStorage.removeItem(SESSION_START_KEY);
            
            initializeState();
            apiKeyInput.value = '';
            refreshAll();
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
    const backButtonEditBets = document.createElement('button'); backButtonEditBets.textContent = '← Back to Settings';
    Object.assign(backButtonEditBets.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
    backButtonEditBets.onmouseenter = () => backButtonEditBets.style.background = 'rgba(255,255,255,0.2)'; backButtonEditBets.onmouseleave = () => backButtonEditBets.style.background = 'rgba(255,255,255,0.1)';
    backButtonEditBets.onclick = () => { showEditBetsPanel = false; showSettings = true; refreshAll(); };
    editBetsPanel.appendChild(backButtonEditBets);

    const dynamicBetsToggleContainer = document.createElement('div');
    Object.assign(dynamicBetsToggleContainer.style, { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' });
    const dynamicBetsToggle = document.createElement('input'); dynamicBetsToggle.type = 'checkbox'; dynamicBetsToggle.id = 'dynamic-bets-toggle'; dynamicBetsToggle.checked = dynamicBetsEnabled;
    const dynamicBetsLabel = document.createElement('label'); dynamicBetsLabel.textContent = 'Enable Dynamic Bets'; dynamicBetsLabel.htmlFor = 'dynamic-bets-toggle'; dynamicBetsLabel.style.cursor = 'pointer';
    dynamicBetsToggleContainer.title = "Toggle between setting manual bet amounts and using the dynamic bet calculator.";
    dynamicBetsToggleContainer.append(dynamicBetsToggle, dynamicBetsLabel);
    editBetsPanel.appendChild(dynamicBetsToggleContainer);

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

    const createDynamicInput = (label, id, value, title, type = 'text') => {
        const lbl = document.createElement('label'); lbl.textContent = label; lbl.htmlFor = id;
        const input = document.createElement('input'); input.type = type; input.id = id; input.value = value; input.title = title;
        Object.assign(input.style, { width: '100%', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
        const lock = document.createElement('button'); lock.style.cursor = 'pointer'; lock.style.background = 'none'; lock.style.border = 'none'; lock.style.color = '#fff'; lock.style.fontSize = '16px'; lock.style.padding = '0 5px';
        return [lbl, input, lock];
    };

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

    const reinforceContainer = document.createElement('div');
    Object.assign(reinforceContainer.style, { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' });
    const reinforceCheck = document.createElement('input'); reinforceCheck.type = 'checkbox'; reinforceCheck.id = 'dyn-reinforce'; reinforceCheck.checked = dynamicBetsSettings.reinforce;
    const reinforceLabel = document.createElement('label'); reinforceLabel.textContent = 'Reinforce Bet'; reinforceLabel.htmlFor = 'dyn-reinforce'; reinforceLabel.style.cursor = 'pointer';
    reinforceContainer.title = "If checked, adds the Starting Bet back into the calculation on odd-numbered bets (3rd, 5th, etc.) for a more aggressive progression.";
    reinforceCheck.onchange = () => { dynamicBetsSettings.reinforce = reinforceCheck.checked; saveDynamicBetsSettings(); calculateBetsAndRefresh(); };
    reinforceContainer.append(reinforceCheck, reinforceLabel);
    dynamicBetsContainer.appendChild(reinforceContainer);

    dynamicBetsToggle.onchange = () => {
        dynamicBetsEnabled = dynamicBetsToggle.checked;
        localStorage.setItem(DYNAMIC_BETS_ENABLED_KEY, JSON.stringify(dynamicBetsEnabled));
        dynamicBetsContainer.style.display = dynamicBetsEnabled ? 'grid' : 'none';
        manualBetsContainer.style.display = dynamicBetsEnabled ? 'none' : 'block';
        calculateBetsAndRefresh();
    };

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
    Object.assign(miniCirclesContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', padding: '4px 0' });

    const miniStatsContainer = document.createElement('div');
    Object.assign(miniStatsContainer.style, { display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333' });
    
    // Add clones of the main stats divs to the mini container
    const miniStreakDiv = streakDiv.cloneNode(true);
    const miniDailyProfitDiv = dailyProfitDiv.cloneNode(true);
    const miniSessionDiv = sessionDiv.cloneNode(true);
    miniStatsContainer.append(miniStreakDiv, miniDailyProfitDiv, miniSessionDiv);

    miniBar.append(miniCirclesContainer, miniStatsContainer, miniBetGridContainer);
    // --- End Mini Panel Structure ---

    const statsDisplayPanel = document.createElement('div');
    Object.assign(statsDisplayPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0', width: '360px' });
    panel.appendChild(statsDisplayPanel);

    const statsDisplayTitle = document.createElement('div');
    statsDisplayTitle.textContent = 'Statistics & Graph';
    Object.assign(statsDisplayTitle.style, { fontSize: '16px', fontWeight: 'bold' });
    statsDisplayPanel.appendChild(statsDisplayTitle);

    const backButtonStats = document.createElement('button');
    backButtonStats.textContent = '← Back';
    Object.assign(backButtonStats.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
    backButtonStats.onmouseenter = () => backButtonStats.style.background = 'rgba(255,255,255,0.2)';
    backButtonStats.onmouseleave = () => backButtonStats.style.background = 'rgba(255,255,255,0.1)';
    backButtonStats.onclick = () => { showStatsPanel = false; refreshAll(); };
    statsDisplayPanel.appendChild(backButtonStats);

    const statsSummaryDiv = document.createElement('div');
    Object.assign(statsSummaryDiv.style, { fontSize: '12px', display: 'flex', justifyContent: 'space-around', padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' });
    statsDisplayPanel.appendChild(statsSummaryDiv);

    const graphCanvas = document.createElement('canvas');
    graphCanvas.id = 'rr-graph-canvas';
    graphCanvas.width = 350;
    graphCanvas.height = 200;
    Object.assign(graphCanvas.style, { background: 'rgba(0,0,0,0.2)', borderRadius: '6px', marginTop: '8px' });
    statsDisplayPanel.appendChild(graphCanvas);

    const timeframeContainer = document.createElement('div');
    Object.assign(timeframeContainer.style, { display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '8px' });
    statsDisplayPanel.appendChild(timeframeContainer);

 const graphTooltipDisplay = document.createElement('div');
    graphTooltipDisplay.id = 'rr-graph-tooltip-display';
    Object.assign(graphTooltipDisplay.style, {
        display: 'none', // Hidden by default
        padding: '8px',
        marginTop: '10px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '6px',
        border: '1px solid #555',
        textAlign: 'center',
        fontSize: '12px',
        fontFamily: 'monospace',
        transition: 'opacity 0.2s',
        color: '#ddd'
    });
    statsDisplayPanel.appendChild(graphTooltipDisplay);

  const timeframes = [
        { label: '7D', days: 7 }, { label: '1M', days: 30 }, { label: '3M', days: 90 },
        { label: '6M', days: 182 }, { label: '1Y', days: 365 }
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
        btn.onclick = () => {
            currentStatsTimeframe = tf.days;
            updateGraph();
        };
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
// --- ADD THIS ENTIRE NEW BLOCK ---

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



        function updateGraph() {
        // Step 1: Clean up any old chart instance.
        // If a chart from a previous view exists, we "destroy" it to remove its mouse listeners.
        // This prevents memory leaks and buggy behavior.
        if (rrChart) {
            rrChart.destroy();
            rrChart = null;
        }

        // Step 2: Get the data for the graph.
        // This function of yours already works perfectly. It gets the profit history for the chosen timeframe.
        const { dataPoints, summary } = processDataForGraph(currentStatsTimeframe);

        // Step 3: Update the summary statistics above the graph.
        // This also works fine. It shows Total Profit, W/L, etc., for the period.
        const profitSign = summary.totalProfit >= 0 ? '+' : '-';
        const profitColor = summary.totalProfit >= 0 ? '#4CAF50' : '#E53935';
        statsSummaryDiv.innerHTML = `
            <span title="Total profit/loss for this period" style="color:${profitColor};">${profitSign}$${formatNumberToKMB(Math.abs(summary.totalProfit))}</span>
            <span title="Wins / Losses">W/L: ${summary.wins} / ${summary.losses}</span>
            <span title="Total games played">Games: ${summary.totalGames}</span>
        `;

        // Step 4: Find our HTML "sticky note" on the page.
        // We need a direct reference to the <div> we created to show the tooltip text.
        // We find it using its unique ID.
        const graphTooltipDisplay = document.getElementById('rr-graph-tooltip-display');

        // Step 5: Create the new chart and give it the sticky note.
        // We call `new RrChart()` to create our "artist".
        // - `graphCanvas`: This is the whiteboard it will draw on.
        // - `dataPoints`: This is the data it needs to draw.
        // - `graphTooltipDisplay`: This is the "sticky note" we're telling it to use for text.
        rrChart = new RrChart(graphCanvas, dataPoints, graphTooltipDisplay);

        // Step 6: Update the style of the timeframe buttons (7D, 1M, etc.)
        // This just highlights the currently selected button.
        timeframeContainer.querySelectorAll('button').forEach(btn => {
            if (parseInt(btn.dataset.days, 10) === currentStatsTimeframe) {
                btn.style.background = 'rgba(100, 180, 255, 0.3)';
                btn.style.borderColor = '#64B4FF';
            } else {
                btn.style.background = 'rgba(255,255,255,0.1)';
                btn.style.borderColor = '#555';
            }
        });
    }



    function processDataForGraph(timeframeInDays) {
        const now = Math.floor(Date.now() / 1000);
        const cutoffTimestamp = now - (timeframeInDays * 24 * 60 * 60);

        const filteredResults = results.filter(r => r.timestamp >= cutoffTimestamp);

        if (filteredResults.length === 0) {
            return { dataPoints: [], summary: { totalProfit: 0, wins: 0, losses: 0, totalGames: 0 } };
        }

        filteredResults.sort((a, b) => a.timestamp - b.timestamp);

        let cumulativeProfit = 0;
        let wins = 0;
        let losses = 0;

        const dataPoints = filteredResults.map(game => {
            const profit = game.result === 'win' ? game.bet : -game.bet;
            cumulativeProfit += profit;
            if (profit > 0) wins++;
            else losses++;
            return { timestamp: game.timestamp, cumulativeProfit: cumulativeProfit };
        });

        if (dataPoints.length > 0) {
            const firstGame = filteredResults[0];
            const profitOfFirstGame = firstGame.result === 'win' ? firstGame.bet : -firstGame.bet;
            const startingProfit = dataPoints[0].cumulativeProfit - profitOfFirstGame;
            dataPoints.unshift({ timestamp: firstGame.timestamp - 1, cumulativeProfit: startingProfit });
        }


        const summary = {
            totalProfit: cumulativeProfit,
            wins: wins,
            losses: losses,
            totalGames: wins + losses,
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
            const profits = data.map(p => p.cumulativeProfit);
            const timestamps = data.map(p => p.timestamp);

            let minProfit = Math.min(...profits);
            let maxProfit = Math.max(...profits);
            const range = maxProfit - minProfit;

            if (range === 0) {
                maxProfit += 1000;
                minProfit -= 1000;
            }
            this.maxProfit = Math.max(maxProfit + (maxProfit - minProfit) * 0.1, 0);
            this.minProfit = Math.min(minProfit - (maxProfit - minProfit) * 0.1, 0);

            this.minTimestamp = Math.min(...timestamps);
            this.maxTimestamp = Math.max(...timestamps);

            this.mapX = (ts) => padding.left + (ts - this.minTimestamp) / (this.maxTimestamp - this.minTimestamp) * (canvas.width - padding.left - padding.right);
            this.mapY = (profit) => canvas.height - padding.bottom - (profit - this.minProfit) / (this.maxProfit - this.minProfit) * (canvas.height - padding.top - padding.bottom);
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
                const date = new Date(timestamp * 1000);
                ctx.fillText(date.toLocaleDateString(), x, height - padding.bottom + 5);
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


    async function fetchAllLogsPaginated(logType) {
        const allLogs = [];
        let currentToTimestamp = null;
        const stopTimestamp = Math.floor(Date.now() / 1000) - (36500 * 24 * 3600); // 100 years ago

        while (true) {
            try {
                const batch = await fetchLogs(logType, currentToTimestamp);
                const logsInBatch = Object.values(batch.log || {});

                for (const log of logsInBatch) {
                    if (log.timestamp >= stopTimestamp) {
                        allLogs.push(log);
                    }
                }

                if (logsInBatch.length < 100) {
                    console.log(`RR Tracker: Finished fetching log type ${logType}. Found the last page (${logsInBatch.length} entries).`);
                    break;
                }

                let oldestTimestampInBatch = Math.min(...logsInBatch.map(log => log.timestamp));

                if (!isFinite(oldestTimestampInBatch)) {
                     console.warn(`RR Tracker: Could not determine next timestamp for log type ${logType}. Halting pagination for safety.`);
                     break;
                }

                await new Promise(resolve => setTimeout(resolve, 400));
                currentToTimestamp = oldestTimestampInBatch ;

            } catch (error) {
                console.error(`RR Tracker: A critical error occurred while fetching log type ${logType}. Stopping.`, error);
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
    // This is a new Promise wrapper around the old GM_xmlhttpRequest
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({ // Using the older, more compatible function
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        reject(new Error(data.error.error));
                    } else {
                        resolve(Object.values(data.log || {}));
                    }
                } catch (e) {
                    reject(new Error("Failed to parse API response."));
                }
            },
            onerror: function(err) {
                reject(new Error("Network request failed."));
            },
            ontimeout: function() {
                reject(new Error("Request timed out."));
            }
        });
    });
}



/**
 * Clears all local game results and repopulates them by forcing a full "deep scan" from the Torn API.
 * This is a data-only reset; settings are not affected.
 */
async function forceFullResync() {
    // 1. Ask the user for confirmation because this clears the current view.
    if (!confirm("This will clear your current game data and re-download your entire RR history from the Torn API. Your settings will not be affected. Continue?")) {
        return; // Do nothing if the user clicks "Cancel".
    }

    // Since we assigned an ID in the past, we can select the button this way
    const forceSyncButton = document.getElementById('rr-force-sync-btn');
    if (forceSyncButton) {
        forceSyncButton.textContent = 'Refreshing...';
        forceSyncButton.disabled = true;
    }

    try {
        // 2. Clear all the current game data from memory and storage.
        console.log("RR Tracker: Clearing local data for full re-sync...");
        results = [];
        totalProfit = 0;
        sessionProfit = 0; // Also reset the session profit
        saveResults();
        saveTotalProfit();
        saveSessionState();
        refreshAll(); // Instantly update the UI to show it's empty

        // 3. Temporarily reset the sync timer to 0.
        // This is the key step that forces `importApiData` to do a full "deep scan".
        lastSyncTime = 0;

        // 4. Run the import process. It will now fetch all history.
        await importApiData(false);

        alert('Full re-sync complete!');

    } catch (error) {
        console.error("Full re-sync failed:", error);
        alert("Full re-sync failed. Check the console (F12) for details.");
    } finally {
        // 5. Reset the button's state.
        if (forceSyncButton) {
            forceSyncButton.textContent = '🔄 Sync Now';
            forceSyncButton.disabled = false;
        }
    }
}
 
// ===================================================================
// ============= THE FINAL, BULLETPROOF SYNC FUNCTION ================
// ===================================================================
async function importApiData(isSilent = false) {
    // 1. LOCK: If a sync is already running, exit immediately.
    if (isSyncing) {
        console.log("RR Tracker: Sync already in progress. Skipping new request.");
        return;
    }
    if (!apiKey || apiKey.length < 16) {
        if (!isSilent) alert('Please enter a valid Torn API key in the settings panel to sync data.');
        return;
    }

    const isInitialSync = !lastSyncTime || (Date.now() - lastSyncTime > 6 * 3600 * 1000); // 6-hour rule
    let allRawLogs = [];

    try {
        // SET THE LOCK: Mark that a sync has started.
        isSyncing = true;
        console.log(`RR Tracker: Starting sync. Deep Scan: ${isInitialSync}`);
        if (!isSilent) { document.body.style.cursor = 'wait'; panel.style.cursor = 'wait'; }

        if (isInitialSync) {
            console.log("RR Tracker: Performing deep scan for full history...");
            const logPromises = [8392, 8391, 8395, 8396].map(logType => fetchAllLogsPaginated(logType));
            const allLogsArrays = await Promise.all(logPromises);
            allRawLogs = [].concat(...allLogsArrays);
// ... inside importApiData() ...
        } else {
            console.log("RR Tracker: Performing quick scan for recent logs...");

            // --- START OF YOUR MODIFICATION ---
            // Define one hour in milliseconds for clarity.
            const oneHourInMs = 60 * 60 * 1000;

            // Subtract one hour from the last sync time to create an overlap.
            // This is the new starting point for our fetch.
            const syncStartTime = lastSyncTime - oneHourInMs;

            console.log(`RR Tracker: Syncing with a 1-hour overlap. Fetching from ${new Date(syncStartTime).toLocaleString()}`);
            // --- END OF YOUR MODIFICATION ---

            // Now, use this new 'syncStartTime' variable for the API call.
            const logPromises = [8392, 8391, 8395, 8396].map(logType => fetchAllLogsSince(syncStartTime, logType));
            const allLogsArrays = await Promise.all(logPromises);
            allRawLogs = [].concat(...allLogsArrays);
        }
// ...


        if (allRawLogs.length > 0) {
            allRawLogs.sort((a, b) => a.timestamp - b.timestamp);
            const startGameIndices = [];
            allRawLogs.forEach((log, index) => {
                if (log.log === 8392 || log.log === 8391) startGameIndices.push(index);
            });
            const newlyProcessedGames = [];
            for (let i = 0; i < startGameIndices.length; i++) {
                const startIndex = startGameIndices[i];
                const endIndex = (i + 1 < startGameIndices.length) ? startGameIndices[i + 1] : undefined;
                const gameSlice = allRawLogs.slice(startIndex, endIndex);
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
            const existingTimestamps = new Set(results.map(r => r.timestamp));
            const newUniqueGames = newlyProcessedGames.filter(game => !existingTimestamps.has(game.timestamp));
            if (newUniqueGames.length > 0) {
                 console.log(`RR Tracker API: Found ${newUniqueGames.length} new unique games to add.`);
                 let combinedResults = [...results, ...newUniqueGames];
                 combinedResults.sort((a, b) => b.timestamp - a.timestamp);
                 results = combinedResults;
            } else {
                 console.log("RR Tracker API: No new games to add from API.");
            }
        } else {
             console.log("RR Tracker API: No new log entries found.");
        }

        totalProfit = results.reduce((acc, game) => acc + (game.result === 'win' ? game.bet : -game.bet), 0);
        if (isSessionActive) {
            const sessionGames = results.filter(r => r.timestamp * 1000 >= sessionStartDate);
            sessionProfit = sessionGames.reduce((acc, game) => acc + (game.result === 'win' ? game.bet : -game.bet), 0);
        }
        saveResults();
        saveTotalProfit();
        saveSessionState();
        refreshAll();

        // 2. THE CRITICAL FIX IS HERE
        // The "bookmark" is ONLY updated at the very end of a completely successful run.
        lastSyncTime = Date.now();
        localStorage.setItem(LAST_SYNC_KEY, lastSyncTime.toString());

    } catch (error) {
        console.error("RR Tracker API Sync Error:", error);
        if (!isSilent) alert(`API Sync Error: ${error.message}. Please check your API key and console (F12) for details.`);
    } finally {
        // 3. RELEASE THE LOCK
        // No matter what happens (success or failure), mark the sync as finished.
        isSyncing = false;
        if (!isSilent) { document.body.style.cursor = ''; panel.style.cursor = ''; }
        console.log("RR Tracker: Sync finished.");
    }
}


    function fetchLogs(logType, toTimestamp = null) {
        let url = `https://api.torn.com/user/?selections=log&log=${logType}&key=${apiKey}`;
        if (toTimestamp) {
            url += `&to=${Math.floor(toTimestamp)}`;
        }
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            reject(new Error(data.error.error));
                        } else {
                            resolve(data);
                        }
                    } catch (e) {
                        reject(new Error("Failed to parse API response."));
                    }
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
            console.log("RR Tracker: No API key set, auto-sync disabled.");
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

    function adjustManualBetsArray() {
        const currentLength = manualBets.length;
        if (currentLength === uiButtonCount) return;

        if (currentLength < uiButtonCount) {
            const lastValue = currentLength > 0 ? manualBets[currentLength - 1] : 10000;
            for (let i = currentLength; i < uiButtonCount; i++) {
                manualBets.push(lastValue * Math.pow(2, i - currentLength + 1));
            }
        } else {
            manualBets = manualBets.slice(0, uiButtonCount);
        }
        saveManualBets();
    }

    function buildManualBetInputs() {
        manualEditGrid.innerHTML = '';
        manualEditInputs = [];
        for (let i = 0; i < uiButtonCount; i++) {
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

    function startMatch(originalButtonBetValue) {
        const inputBox = document.querySelector('input[aria-label="Money value"]');

        // This branch handles the CREATE GAME page
        if (inputBox) {
            nativeSet.call(inputBox, originalButtonBetValue.toLocaleString('en-US'));
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));
            inputBox.dispatchEvent(new Event('change', { bubbles: true }));
            const betAfterInputSet = parseBetInput(inputBox.value);
            if (betAfterInputSet === null || betAfterInputSet <= 0) { alert("Invalid bet amount currently in the input box. Please ensure it's a valid number."); return; }
            if (betAfterInputSet < originalButtonBetValue) { alert(`The bet amount in the box ($${betAfterInputSet.toLocaleString()}) is less than the button's intended value ($${originalButtonBetValue.toLocaleString()}).\nMatch not started.`); return; }

            const startButton = document.querySelector('button.submit___Yr2z1');
            
            if (startButton) {
                // If the "Start" button exists, click it.
                startButton.click();
            } else {
                // If not, directly look for the "X" close button by its unique class.
                const closeButton = document.querySelector('button.button___aQaRr');
                if (closeButton) {
                    console.log('RR Tracker: Action failed, closing notification directly.');
                    closeButton.click();
                }
            }
        // This branch handles the JOIN GAME confirmation
        } else {
            const yesButton = document.querySelector('button.button___QgVxd');

            if (yesButton) {
                // If the "Yes" button exists, click it.
                yesButton.click();
            } else {
                // If not, directly look for the "X" close button by its unique class.
                const closeButton = document.querySelector('button.button___aQaRr');
                if (closeButton) {
                    console.log('RR Tracker: Action failed, closing notification directly.');
                    closeButton.click();
                }
            }
        }
    }


    function getSumOfRatios(L, M, reinforce, numCoeffs) {
        if (numCoeffs <= 0 || M <= 1) return { sum: 0, coeffs: [] };
        const maxCoeffs = Math.max(L, numCoeffs);
        const allCoeffs = [];
        if (!reinforce) {
            for (let i = 0; i < maxCoeffs; i++) {
                allCoeffs.push(Math.pow(M, i));
            }
        } else {
            let lastCoeff = 0;
            for (let i = 1; i <= maxCoeffs; i++) {
                let currentCoeff;
                if (i === 1) { currentCoeff = 1; }
                else if (i % 2 === 0) { currentCoeff = M * lastCoeff; }
                else { currentCoeff = (M * lastCoeff) + 1; }
                allCoeffs.push(currentCoeff);
                lastCoeff = currentCoeff;
            }
        }
        const sum = allCoeffs.slice(0, L).reduce((acc, val) => acc + val, 0);
        const coeffsForDisplay = allCoeffs.slice(0, numCoeffs);
        return { sum, coeffs: coeffsForDisplay };
    }

    function calculateBets() {
        if (dynamicBetsEnabled) {
            const { capital, maxLStreak, martingaleValue, reinforce, lockedField } = dynamicBetsSettings;
            let startingBet = dynamicBetsSettings.startingBet;
            // We now generate coefficients for ALL buttons, not uiButtonCount - 1.
            const numCoeffsToGenerate = uiButtonCount; 
            const { sum, coeffs } = getSumOfRatios(maxLStreak, martingaleValue, reinforce, numCoeffsToGenerate);

            if (lockedField === 'capital') {
                startingBet = (sum > 0) ? Math.floor(capital / sum) : 0;
                dynamicBetsSettings.startingBet = startingBet;
            } else {
                dynamicBetsSettings.capital = Math.floor(startingBet * sum);
            }
            
            currentBets = [];
            // The loop now creates all 16 bets based on the martingale progression.
            // No more separate "Test Bet".
            for (let i = 0; i < coeffs.length; i++) {
                const betValue = Math.floor(startingBet * coeffs[i]);
                currentBets.push(betValue);
            }
        } else {
            currentBets = [...manualBets];
        }
    }
    function buildBetButtons() {
        // Clear previous buttons from both grids
        mainBetGridContainer.innerHTML = '';
        miniBetGridContainer.innerHTML = '';

        // Also clear the old win/loss circles container if it's separate
        const oldCirclesContainer = miniBar.querySelector('div:not(#rr-mini-bet-grid)');
        if (oldCirclesContainer) {
            oldCirclesContainer.innerHTML = '';
        }

        if (!currentBets || currentBets.length === 0) return;

        // --- Highlight Logic ---
        // 1. Calculate the current losing streak
        let losingStreak = 0;
        for (const r of results) {
            if (r.result === 'lose') {
                losingStreak++;
            } else {
                break; // Stop counting on the first win
            }
        }
        // 2. Determine which button index to highlight
        const highlightIndex = losingStreak > 0 ? losingStreak : -1; // Use -1 if no highlight

        // --- Button Creation Loop ---
        // This loop creates buttons for BOTH the main grid and the new mini grid.
        for (let i = 0; i < uiButtonCount; i++) {
            if(i >= 16) break; // Safety break for the 4x4 grid

            const bet = currentBets[i];
            const formattedBet = formatNumberToKMB(bet);
            const title = `$${bet.toLocaleString()}`;

            // Create button for the MAIN grid
            const mainBtn = document.createElement('button');
            mainBtn.textContent = formattedBet;
            mainBtn.title = title;
            mainBtn.dataset.index = i; // Store index for highlighting
            Object.assign(mainBtn.style, {
                background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid #444',
                borderRadius: '6px', padding: '4px 2px', cursor: 'pointer', fontSize: '11px',
            });
            mainBtn.onmouseenter = () => { if (!mainBtn.classList.contains('next-bet-highlight')) mainBtn.style.background = 'rgba(255,255,255,0.2)'; };
            mainBtn.onmouseleave = () => { if (!mainBtn.classList.contains('next-bet-highlight')) mainBtn.style.background = 'rgba(255,255,255,0.08)'; };
            mainBtn.onclick = () => startMatch(bet);
            mainBetGridContainer.appendChild(mainBtn);

            // Create button for the MINI grid (collapsed view)
            const miniBtn = document.createElement('button');
            miniBtn.textContent = formattedBet;
            miniBtn.title = title;
            miniBtn.dataset.index = i; // Store same index for highlighting
            Object.assign(miniBtn.style, {
                background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid #444',
                borderRadius: '4px', padding: '2px', cursor: 'pointer',
                fontSize: `${miniButtonSize}px`, // Use the configurable mini button size
            });
            miniBtn.onmouseenter = () => { if (!miniBtn.classList.contains('next-bet-highlight')) miniBtn.style.background = 'rgba(255,255,255,0.2)'; };
            miniBtn.onmouseleave = () => { if (!miniBtn.classList.contains('next-bet-highlight')) miniBtn.style.background = 'rgba(255,255,255,0.08)'; };
            miniBtn.onclick = () => startMatch(bet);
            miniBetGridContainer.appendChild(miniBtn);
            
            // Apply highlight if this button's index matches
            if (i === highlightIndex) {
                mainBtn.classList.add('next-bet-highlight');
                miniBtn.classList.add('next-bet-highlight');
            }
        }
        
        // Rebuild the mini-bar win/loss circles (we still want these)
        const miniCirclesContainer = document.createElement('div');
        Object.assign(miniCirclesContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' });
        results.slice(0, miniBarCount).forEach((r, idx) => miniCirclesContainer.append(makeCircle(r.result, r.bet, idx)));
        // Prepend the circles so they appear above the mini button grid
        if (miniBar.firstChild) {
            miniBar.insertBefore(miniCirclesContainer, miniBar.firstChild);
        } else {
            miniBar.appendChild(miniCirclesContainer);
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


    const createOriginIcon = (origin) => {
        const icon = document.createElement('span');
        const isCreated = origin === 'created';
        const iconText = isCreated ? '➕' : '🔗';
        const titleText = isCreated ? 'Game Created' : 'Game Joined';
        const popupText = isCreated ? 'You CREATED this game' : 'You JOINED this game';

        Object.assign(icon.style, {
            display: 'inline-block',
            width: '14px',
            marginRight: '6px',
            textAlign: 'center',
            cursor: 'pointer'
        });

        icon.textContent = iconText;
        icon.title = titleText;

        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDragging || isTwoFingerDragging) return;

            const existingPopup = document.querySelector('.rr-temp-popup');
            if (existingPopup) existingPopup.remove();

            const tempPopup = document.createElement('div');
            tempPopup.classList.add('rr-temp-popup');
            tempPopup.textContent = popupText;
            Object.assign(tempPopup.style, {
                position: 'fixed',
                background: 'rgba(0,0,0,0.9)', border: '1px solid #555', color: 'white',
                padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                whiteSpace: 'nowrap', zIndex: '99999999', pointerEvents: 'none',
                opacity: '0', transition: 'opacity 0.2s ease-in-out, top 0.2s ease-in-out'
            });

            document.body.appendChild(tempPopup);

            const rect = icon.getBoundingClientRect();
            tempPopup.style.left = `${rect.left + (rect.width / 2) - (tempPopup.offsetWidth / 2)}px`;
            tempPopup.style.top = `${rect.top - tempPopup.offsetHeight - 5}px`;

            setTimeout(() => {
                tempPopup.style.opacity = '1';
                tempPopup.style.top = `${rect.top - tempPopup.offsetHeight - 8}px`;
            }, 10);

            setTimeout(() => {
                tempPopup.style.opacity = '0';
                setTimeout(() => { if (document.body.contains(tempPopup)) document.body.removeChild(tempPopup); }, 200);
            }, 1800);
        });

        return icon;
    };


    const ICONS = {
        created: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
        joined: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V9h8v2zM20 3H12c-1.1 0-2 .9-2 2v2h2V5h8v14h-8v-2h-2v2c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2z"/></svg>`
    };

    const makeTypeIcon = (type) => {
        if (!type || !ICONS[type]) {
            const emptySpan = document.createElement('span');
            Object.assign(emptySpan.style, { display: 'inline-block', width: '16px', height: '14px' });
            return emptySpan;
        }

        const container = document.createElement('span');
        container.innerHTML = ICONS[type];
        Object.assign(container.style, {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '14px',
            marginRight: '3px',
            cursor: 'pointer',
            position: 'relative',
            verticalAlign: 'middle',
            color: '#ccc'
        });
        container.title = type;

        container.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDragging || isTwoFingerDragging) return;

            Array.from(container.children).forEach(child => { if (child.classList.contains('rr-temp-popup')) container.removeChild(child); });

            const tempPopup = document.createElement('div');
            tempPopup.classList.add('rr-temp-popup');
            tempPopup.textContent = type;
            Object.assign(tempPopup.style, {
                position: 'absolute', background: 'rgba(0,0,0,0.9)', border: '1px solid #555',
                color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                whiteSpace: 'nowrap', zIndex: '10000000', top: '-28px', left: '50%',
                transform: 'translateX(-50%)', pointerEvents: 'none', opacity: '0',
                transition: 'opacity 0.2s ease-in-out'
            });
            container.appendChild(tempPopup);
            setTimeout(() => tempPopup.style.opacity = '1', 10);
            setTimeout(() => {
                tempPopup.style.opacity = '0';
                setTimeout(() => { if (container.contains(tempPopup)) container.removeChild(tempPopup); }, 200);
            }, 1500);
        });

        return container;
    };

    function updateStatus() { statusDiv.textContent = collapsed ? '▪' : '►'; }

function updatePanelVisibility() {
    panel.style.display = 'flex';
}

function refreshAll() {
    // This is the controller that decides which panel view is active.
    const allContent = [statsGroup, mainBetGridContainer, buttonContainer, settingsPanel, editBetsPanel, statsDisplayPanel, miniBar, profitMini, alertMessageDiv];

    // First, check if the panel is minimized.
    if (isMinimized) {
        panel.style.minWidth = '85px';
        panel.style.padding = '36px 8px 8px';
        allContent.forEach(p => p.style.display = 'none'); // Hide everything
        minimizeButton.innerHTML = '&#9723;'; // Restore icon (a square)
        statusDiv.innerHTML = '►';
    } else {
        // If not minimized, run the normal visibility logic.
        panel.style.minWidth = '140px';
        panel.style.padding = '36px 12px 12px';
        minimizeButton.innerHTML = '—'; // Minimize icon (a dash)

        const mainViewContainers = [statsGroup, mainBetGridContainer, buttonContainer];

        if (collapsed) {
            miniBar.style.display = 'block';
            profitMini.style.display = 'block';
            [...mainViewContainers, settingsPanel, editBetsPanel, statsDisplayPanel, alertMessageDiv].forEach(p => p.style.display = 'none');
        } else if (showSettings) {
            settingsPanel.style.display = 'flex';
            [...mainViewContainers, editBetsPanel, statsDisplayPanel, miniBar, profitMini, alertMessageDiv].forEach(p => p.style.display = 'none');
        } else if (showEditBetsPanel) {
            editBetsPanel.style.display = 'flex';
            [...mainViewContainers, settingsPanel, statsDisplayPanel, miniBar, profitMini, alertMessageDiv].forEach(p => p.style.display = 'none');
        } else if (showStatsPanel) {
            statsDisplayPanel.style.display = 'flex';
            [...mainViewContainers, settingsPanel, editBetsPanel, miniBar, profitMini, alertMessageDiv].forEach(p => p.style.display = 'none');
        } else {
            // Default State
            statsGroup.style.display = 'flex';
            mainBetGridContainer.style.display = 'grid';
            buttonContainer.style.display = 'flex';
            [settingsPanel, editBetsPanel, statsDisplayPanel, miniBar, profitMini].forEach(p => p.style.display = 'none');
        }
    }

    // --- This part runs regardless of the panel's state ---
    
    // Update Icons and Status
    updateStatus(); // This updates the collapse icon text ('►' or '▪')
    updatePanelVisibility();

    // Update alerts
    let showAlert = false, alertText = '', alertBackgroundColor = '', alertBorderColor = '';
    if (lossLimit > 0 && totalProfit <= -lossLimit && !alertShownLoss) { showAlert = true; alertText = `🚨 LOSS LIMIT REACHED! -$${lossLimit.toLocaleString()}`; alertBackgroundColor = 'rgba(229, 57, 53, 0.8)'; alertBorderColor = '#E53935'; alertShownLoss = true; localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'true'); }
    else if (profitTarget > 0 && totalProfit >= profitTarget && !alertShownProfit) { showAlert = true; alertText = `🎯 PROFIT TARGET REACHED! +$${profitTarget.toLocaleString()}`; alertBackgroundColor = 'rgba(76, 175, 80, 0.8)'; alertBorderColor = '#4CAF50'; alertShownProfit = true; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'true'); }
    if (showAlert && !isMinimized && !collapsed) { 
        alertMessageDiv.textContent = alertText; 
        Object.assign(alertMessageDiv.style, { background: alertBackgroundColor, borderColor: alertBorderColor, display: 'block' }); 
    } else {
        alertMessageDiv.style.display = 'none';
    }
    
    // Update All Stats Text
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayTimestamp = Math.floor(today.getTime() / 1000);
    let dailyProfit = 0;
    for (const game of results) {
        if (game.timestamp >= startOfTodayTimestamp) {
            dailyProfit += (game.result === 'win' ? game.bet : -game.bet);
        } else {
            break; 
        }
    }
    const dailySign = dailyProfit >= 0 ? '+' : '–';
    dailyProfitDiv.textContent = `📅 Daily: ${dailySign}$${Math.abs(dailyProfit).toLocaleString()}`;
    dailyProfitDiv.style.color = dailyProfit >= 0 ? '#4CAF50' : '#E53935';

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
    profitDiv.textContent = `💰 LifeTime Profit: ${sign}$${Math.abs(totalProfit).toLocaleString()}`;
    profitDiv.style.color = totalProfit >= 0 ? '#4CAF50' : '#E53935';
    
    const wins = results.filter(r => r.result === 'win').length;
    const tot = results.length;
    winrateDiv.textContent = `🎯 Win Rate: ${tot ? ((wins / tot) * 100).toFixed(1) : '0.0'}% (${wins}/${tot})`;
    let w = 0, l = 0;
    for (const r of results) { if (r.result === 'win') { if (l) break; w++; } else { if (w) break; l++; } }
    streakDiv.textContent = w ? `🔥 Streak: ${w}` : l ? `💀 Streak: ${l}` : '⏸️ No streak';
    
    // Also update the mini-panel clones
    miniStreakDiv.textContent = streakDiv.textContent;
    miniDailyProfitDiv.innerHTML = `📅 <small>${dailySign}$${Math.abs(dailyProfit).toLocaleString()}</small>`;
    miniDailyProfitDiv.style.color = dailyProfitDiv.style.color;
    miniSessionDiv.innerHTML = sessionDiv.textContent.replace('Session:', '<small>Session:</small>');
    miniSessionDiv.style.color = sessionDiv.style.color;

    // Update Results List
    resultsContainer.innerHTML = '';
    results.slice(0, maxDisplayMatches).forEach((r, i) => {
        const row = document.createElement('div');
        const originIcon = createOriginIcon(r.origin);
        const winLossCircle = makeCircle(r.result, r.bet, i);
        const textNode = document.createTextNode(` ${i + 1}. ${r.result.toUpperCase()} — $${r.bet.toLocaleString()}`);
        row.append(originIcon, winLossCircle, textNode);
        resultsContainer.appendChild(row);
    });

    // Update Settings Inputs if visible
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
    const margin = PANEL_EDGE_MARGIN;
    const panelRenderedWidth = panel.offsetWidth * panelScale; // Use the scaled width
    const panelRenderedHeight = panel.offsetHeight * panelScale; // Use the scaled height

    const minX = -(panelRenderedWidth - margin);
    const maxX = window.innerWidth - margin;
    const minY = 0;
    const maxY = window.innerHeight - margin;

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
    const margin = PANEL_EDGE_MARGIN;
    const panelRenderedWidth = panel.offsetWidth * panelScale; // Use the scaled width
    const panelRenderedHeight = panel.offsetHeight * panelScale; // Use the scaled height

    const minX = -(panelRenderedWidth - margin);
    const maxX = window.innerWidth - margin;
    const minY = 0;
    const maxY = window.innerHeight - margin;

    newLeft = Math.max(minX, Math.min(newLeft, maxX));
    newTop = Math.max(minY, Math.min(newTop, maxY));

    panel.style.left = newLeft + 'px';
    panel.style.top = newTop + 'px';
}

    function onTwoFingerEnd(e) { if (!isTwoFingerDragging) return; if (e.touches.length < 2) { document.removeEventListener('touchmove', onTwoFingerMove); document.removeEventListener('touchend', onTwoFingerEnd); savePos(); isTwoFingerDragging = false; panel.style.cursor = ''; document.body.style.cursor = ''; } }

    statusDiv.addEventListener('click', () => { if (isDragging || isTwoFingerDragging) return; collapsed = !collapsed; if (collapsed) { showSettings = false; showBetsPanel = false; showEditBetsPanel = false; showStatsPanel = false; } saveCollapsed(); refreshAll(); });
    alertMessageDiv.addEventListener('click', () => { alertMessageDiv.style.display = 'none'; });

// --- Main Loop ---
calculateBetsAndRefresh();
initiateSyncing();
syncCountdownInterval = setInterval(updateSyncTimer, 1000);

})();
