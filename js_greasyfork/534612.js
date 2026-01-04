// ==UserScript==
// @name        Riffusion Multitool
// @namespace   http://tampermonkey.net/
// @version     1.70
// @description Manage Riffusion songs: selective/bulk delete, download queue (MP3/M4A/WAV), privacy settings. Draggable/minimizable UI, filters, auto-reload & more. USE WITH CAUTION.
// @author      Graph1ks (assisted by GoogleAI)
// @match       https://www.riffusion.com/*
// @grant       GM_addStyle
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/534612/Riffusion%20Multitool.user.js
// @updateURL https://update.greasyfork.org/scripts/534612/Riffusion%20Multitool.meta.js
// ==/UserScript==



(function() {
'use strict';

    // --- Configuration ---
    const SCRIPT_PREFIX = 'Graph1ksRiffTool_'; // Unique prefix for all IDs
    const MAIN_UI_ID = `${SCRIPT_PREFIX}MainUI`;
    const MINIMIZED_ICON_ID = `${SCRIPT_PREFIX}MinimizedIcon`;

    const INITIAL_VIEW = 'menu';
    const DELETION_DELAY = 500;
    const DOWNLOAD_MENU_DELAY = 550;
    const DOWNLOAD_ACTION_DELAY = 500;
    const DEFAULT_INTRA_FORMAT_DELAY_SECONDS = 6;
    const DROPDOWN_DELAY = 400; // General delay for main dropdowns to open
    const DEFAULT_INTER_SONG_DELAY_SECONDS = 6;

    // New Privacy Delays
    const PRIVACY_MENU_OPEN_DELAY = 400; // Delay to open the "More Options" menu
    const PRIVACY_SUBMENU_TRIGGER_CLICK_DELAY = 150; // Delay after clicking "Privacy" for submenu to register
    const PRIVACY_SUBMENU_OPEN_DELAY = 450; // Delay for the privacy submenu itself to open
    const PRIVACY_ACTION_CLICK_DELAY = 500; // Delay after clicking the specific privacy option
    const DEFAULT_PRIVACY_INTER_SONG_DELAY_SECONDS = 6;


    const MAX_RETRIES = 3;
    const MAX_SUB_MENU_OPEN_RETRIES = 4; // Applies to download and privacy submenus
    const MAX_EMPTY_CHECKS = 3;
    const EMPTY_RETRY_DELAY = 6000;
    const KEYWORD_FILTER_DEBOUNCE = 500;
    const UI_INITIAL_TOP = '60px';
    const UI_INITIAL_RIGHT = '20px';
    const INITIAL_IGNORE_LIKED_DELETE = true;
    const MINIMIZED_ICON_SIZE = '40px';
    const MINIMIZED_ICON_TOP = '15px';
    const MINIMIZED_ICON_RIGHT = '15px';
    const AUTO_RELOAD_INTERVAL = 3000;
    const DEFAULT_SONGLIST_HEIGHT = '22vh'; // Unified default height

    // --- State Variables ---
    let debugMode = false;
    let isDeleting = false;
    let isDownloading = false;
    let isChangingPrivacy = false; // New state
    let currentView = INITIAL_VIEW;
    let ignoreLikedSongsDeleteState = INITIAL_IGNORE_LIKED_DELETE;

    let downloadInterSongDelaySeconds = DEFAULT_INTER_SONG_DELAY_SECONDS;
    let downloadIntraFormatDelaySeconds = DEFAULT_INTRA_FORMAT_DELAY_SECONDS;

    // New Privacy State Variables
    let privacyInterSongDelaySeconds = DEFAULT_PRIVACY_INTER_SONG_DELAY_SECONDS;

    let keywordFilterDebounceTimer = null;
    let stopBulkDeletionSignal = false;
    let stopPrivacyChangeSignal = false; // New signal

    let isMinimized = true;
    let lastUiTop = UI_INITIAL_TOP;
    let lastUiLeft = null;
    let uiElement = null;
    let minimizedIconElement = null;

    let autoReloadEnabled = true;
    let autoReloadTimer = null;
    let lastKnownSongIdsDelete = [];
    let lastKnownSongIdsDownload = [];
    let lastKnownSongIdsPrivacy = []; // New
    let selectedSongIdsDelete = new Set();
    let selectedSongIdsDownload = new Set();
    let selectedSongIdsPrivacy = new Set(); // New

    let currentDeleteListHeight = DEFAULT_SONGLIST_HEIGHT;
    let currentDownloadListHeight = DEFAULT_SONGLIST_HEIGHT;
    let currentPrivacyListHeight = DEFAULT_SONGLIST_HEIGHT; // New

    // Privacy button text map
    const privacyButtonTextMap = {
        "Only Me": "Set to Only Me",
        "Link Only": "Set to Link Only",
        "Publish": "Publish Selected"
    };
    const privacySubmenuTextMap = { // Maps UI dropdown value to the exact text in the submenu
        "Only Me": "Only me",
        "Link Only": "Anyone with the link",
        "Publish": "Publish"
    };


    GM_addStyle(`
        #${MAIN_UI_ID} {
            position: fixed; background: linear-gradient(145deg, #2a2a2a, #1e1e1e); border: 1px solid #444; border-radius: 10px; padding: 0; z-index: 10000; width: 300px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4); color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: none; overflow: hidden;
            display: ${isMinimized ? 'none' : 'block'};
        }
        #${MAIN_UI_ID} #riffControlHeader { /* Scoped to main UI */
            background: linear-gradient(90deg, #3a3a3a, #2c2c2c); padding: 8px 12px; cursor: move; border-bottom: 1px solid #444; border-radius: 10px 10px 0 0; position: relative;
        }
        #${MAIN_UI_ID} #riffControlHeader h3 { margin: 0; font-size: 15px; font-weight: 600; color: #ffffff; text-align: center; text-shadow: 0 1px 1px rgba(0,0,0,0.2); padding-right: 25px; /* Space for minimize button */ }

        #${MAIN_UI_ID} #minimizeButton { /* Scoped to main UI */
            position: absolute; top: 4px; right: 6px; background: none; border: none; color: #aaa; font-size: 18px; font-weight: bold; line-height: 1; cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: color 0.2s, background-color 0.2s;
        }
        #${MAIN_UI_ID} #minimizeButton:hover { color: #fff; background-color: rgba(255, 255, 255, 0.1); }

        #${MINIMIZED_ICON_ID} {
            position: fixed; top: ${MINIMIZED_ICON_TOP}; right: ${MINIMIZED_ICON_RIGHT}; width: ${MINIMIZED_ICON_SIZE}; height: ${MINIMIZED_ICON_SIZE}; background: linear-gradient(145deg, #3a3a3a, #2c2c2c); border: 1px solid #555; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: bold; display: ${isMinimized ? 'flex' : 'none'}; align-items: center; justify-content: center; cursor: pointer; z-index: 10001; transition: background 0.2s; user-select: none;
        }
        #${MINIMIZED_ICON_ID}:hover { background: linear-gradient(145deg, #4a4a4a, #3c3c3c); }

        /* Scoping general rules to within the main UI container */
        #${MAIN_UI_ID} #riffControlContent { padding: 12px; }
        #${MAIN_UI_ID} .riffControlButton { display: block; border: none; border-radius: 6px; padding: 8px; font-size: 13px; font-weight: 500; text-align: center; cursor: pointer; transition: transform 0.15s, background 0.15s; width: 100%; margin-bottom: 8px; }
        #${MAIN_UI_ID} .riffControlButton:hover:not(:disabled) { transform: translateY(-1px); }
        #${MAIN_UI_ID} .riffControlButton:disabled { background: #555 !important; cursor: not-allowed; transform: none; opacity: 0.7; }
        #${MAIN_UI_ID} .riffMenuButton { background: linear-gradient(90deg, #4d94ff, #3385ff); color: #fff; }
        #${MAIN_UI_ID} .riffMenuButton:hover:not(:disabled) { background: linear-gradient(90deg, #3385ff, #1a75ff); }
        #${MAIN_UI_ID} .riffBackButton { background: linear-gradient(90deg, #888, #666); color: #fff; margin-top: 12px; margin-bottom: 0; }
        #${MAIN_UI_ID} .riffBackButton:hover:not(:disabled) { background: linear-gradient(90deg, #666, #444); }
        #${MAIN_UI_ID} #deleteAllButton, #${MAIN_UI_ID} #deleteButton { background: linear-gradient(90deg, #ff4d4d, #e63939); color: #fff; }
        #${MAIN_UI_ID} #deleteAllButton:hover:not(:disabled), #${MAIN_UI_ID} #deleteButton:hover:not(:disabled) { background: linear-gradient(90deg, #e63939, #cc3333); }
        #${MAIN_UI_ID} #startDownloadQueueButton { background: linear-gradient(90deg, #1db954, #17a34a); color: #fff; }
        #${MAIN_UI_ID} #startDownloadQueueButton:hover:not(:disabled) { background: linear-gradient(90deg, #17a34a, #158a3f); }
        #${MAIN_UI_ID} #changePrivacyStatusButton { background: linear-gradient(90deg, #8A2BE2, #6A1B9A); color: #fff; } /* Purple for privacy */
        #${MAIN_UI_ID} #changePrivacyStatusButton:hover:not(:disabled) { background: linear-gradient(90deg, #6A1B9A, #4A148C); }
        #${MAIN_UI_ID} #reloadDeleteButton, #${MAIN_UI_ID} #reloadDownloadButton, #${MAIN_UI_ID} #reloadPrivacyButton { background: linear-gradient(90deg, #ff9800, #e68a00); color: #fff; }
        #${MAIN_UI_ID} #reloadDeleteButton:hover:not(:disabled), #${MAIN_UI_ID} #reloadDownloadButton:hover:not(:disabled), #${MAIN_UI_ID} #reloadPrivacyButton:hover:not(:disabled) { background: linear-gradient(90deg, #e68a00, #cc7a00); }


        #${MAIN_UI_ID} #statusMessage { margin-top: 8px; font-size: 12px; color: #1db954; text-align: center; min-height: 1.1em; word-wrap: break-word; }
        #${MAIN_UI_ID} .section-controls { display: none; }
        #${MAIN_UI_ID} .songListContainer { margin-bottom: 0px; overflow-y: auto; padding-right: 5px; /* For scrollbar */ border: 1px solid #444; border-radius: 5px; background-color: rgba(0,0,0,0.1); padding: 6px; }
        #${MAIN_UI_ID} .songListContainer label { display: flex; align-items: center; margin: 6px 0; color: #d0d0d0; font-size: 13px; transition: color 0.2s; }
        #${MAIN_UI_ID} .songListContainer label:hover:not(.ignored) { color: #ffffff; }
        #${MAIN_UI_ID} .songListContainer input[type="checkbox"] { margin-right: 8px; accent-color: #1db954; width: 15px; height: 15px; cursor: pointer; flex-shrink: 0; }
        #${MAIN_UI_ID} .songListContainer input[type="checkbox"]:disabled { cursor: not-allowed; accent-color: #555; }
        #${MAIN_UI_ID} .songListContainer label.ignored { color: #777; cursor: not-allowed; font-style: italic; }
        #${MAIN_UI_ID} .songListContainer label.liked { font-weight: bold; color: #8c8cff; /* Light purple/blue for liked */ }
        #${MAIN_UI_ID} .songListContainer label.liked:hover { color: #a0a0ff; }

        #${MAIN_UI_ID} .listResizer {
            width: 100%; height: 8px; background-color: #4a4a4a; cursor: ns-resize;
            border-radius: 3px; margin-top: 2px; margin-bottom: 10px; display: block;
            transition: background-color 0.2s;
        }
        #${MAIN_UI_ID} .listResizer:hover { background-color: #5c5c5c; }

        #${MAIN_UI_ID} .selectAllContainer { margin-bottom: 8px; display: flex; align-items: center; color: #d0d0d0; font-size: 13px; font-weight: 500; cursor: pointer; }
        #${MAIN_UI_ID} .selectAllContainer input[type="checkbox"] { margin-right: 8px; accent-color: #1db954; width: 15px; height: 15px; }
        #${MAIN_UI_ID} .selectAllContainer:hover { color: #ffffff; }
        #${MAIN_UI_ID} .counterDisplay { margin-bottom: 8px; font-size: 13px; color: #1db954; text-align: center; }
        #${MAIN_UI_ID} .songListContainer::-webkit-scrollbar { width: 6px; }
        #${MAIN_UI_ID} .songListContainer::-webkit-scrollbar-track { background: #333; border-radius: 3px; }
        #${MAIN_UI_ID} .songListContainer::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        #${MAIN_UI_ID} .songListContainer::-webkit-scrollbar-thumb:hover { background: #777; }

        #${MAIN_UI_ID} .filterSettings { margin-top: 8px; margin-bottom: 8px; padding-top: 8px; border-top: 1px solid #444; }
        #${MAIN_UI_ID} .settings-checkbox-label { display: flex; align-items: center; font-size: 12px; color: #ccc; cursor: pointer; margin-bottom: 6px; }
        #${MAIN_UI_ID} .settings-checkbox-label:hover { color: #fff; }
        #${MAIN_UI_ID} .settings-checkbox-label input[type="checkbox"] { margin-right: 6px; accent-color: #1db954; width: 14px; height: 14px; cursor: pointer; }

        #${MAIN_UI_ID} .filterSettings input[type="text"], #${MAIN_UI_ID} .filterSettings input[type="number"] { width: 100%; background-color: #333; border: 1px solid #555; color: #ddd; padding: 5px 8px; border-radius: 5px; font-size: 12px; box-sizing: border-box; margin-top: 4px; }
        #${MAIN_UI_ID} .filterSettings input[type="text"]:focus, #${MAIN_UI_ID} .filterSettings input[type="number"]:focus { outline: none; border-color: #777; }

        #${MAIN_UI_ID} #downloadSelectLiked, #${MAIN_UI_ID} #privacySelectLiked { background: linear-gradient(90deg, #6666ff, #4d4dff); color: #fff; }
        #${MAIN_UI_ID} #downloadSelectLiked:hover:not(:disabled), #${MAIN_UI_ID} #privacySelectLiked:hover:not(:disabled) { background: linear-gradient(90deg, #4d4dff, #3333cc); }
        #${MAIN_UI_ID} .downloadButtonRow, #${MAIN_UI_ID} .privacyButtonRow { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        #${MAIN_UI_ID} #downloadSelectLiked, #${MAIN_UI_ID} #privacySelectLiked { flex-grow: 1; }
        #${MAIN_UI_ID} #downloadClearSelection, #${MAIN_UI_ID} #privacyClearSelection {
             background: linear-gradient(90deg, #ff4d4d, #e63939); color: #fff;
             width: 28px; height: 28px; padding: 0; font-size: 15px; font-weight: bold; line-height: 1; border: none; border-radius: 5px; cursor: pointer; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0; transition: transform 0.15s, background 0.15s;
        }
         #${MAIN_UI_ID} #downloadClearSelection:hover:not(:disabled), #${MAIN_UI_ID} #privacyClearSelection:hover:not(:disabled) { background: linear-gradient(90deg, #e63939, #cc3333); transform: translateY(-1px); }
         #${MAIN_UI_ID} #downloadClearSelection:disabled, #${MAIN_UI_ID} #privacyClearSelection:disabled { background: #555 !important; cursor: not-allowed; transform: none; opacity: 0.7; }

         #${MAIN_UI_ID} .downloadFormatContainer { margin-top: 8px; padding-top: 8px; border-top: 1px solid #444; }
         #${MAIN_UI_ID} .downloadFormatContainer > label.settings-checkbox-label { margin-bottom: 4px; justify-content: center; display: block; text-align: center;}
         #${MAIN_UI_ID} .downloadFormatContainer div { display: flex; justify-content: space-around; margin-top: 4px; }

         #${MAIN_UI_ID} .downloadDelayContainer { margin-top: 8px; padding-top: 8px; border-top: 1px solid #444; display: flex; justify-content: space-between; gap: 10px; }
         #${MAIN_UI_ID} .downloadDelayContainer > div { flex: 1; }
         #${MAIN_UI_ID} .downloadDelayContainer label.settings-checkbox-label { margin-bottom: 2px; display: block; }
         #${MAIN_UI_ID} .downloadDelayContainer input[type="number"] { margin-top: 0; }

         #${MAIN_UI_ID} #bulkModeControls p { font-size: 11px; color:#aaa; text-align:center; margin-top:4px; margin-bottom: 8px; }
         #${MAIN_UI_ID} #commonSettingsFooter { margin-top: 10px; padding-top: 8px; border-top: 1px solid #444; }

         /* Privacy Specific Settings */
         #${MAIN_UI_ID} .privacySettingsContainer { margin-top: 8px; padding-top: 8px; border-top: 1px solid #444; }
         #${MAIN_UI_ID} .privacySettingsContainer > label.settings-checkbox-label { display: block; margin-bottom: 4px; text-align: left; }
         #${MAIN_UI_ID} .privacySettingsContainer select,
         #${MAIN_UI_ID} .privacySettingsContainer input[type="number"] {
            width: 100%; background-color: #333; border: 1px solid #555; color: #ddd;
            padding: 5px 8px; border-radius: 5px; font-size: 12px;
            box-sizing: border-box; margin-bottom: 8px;
         }
         #${MAIN_UI_ID} .privacySettingsContainer select:focus,
         #${MAIN_UI_ID} .privacySettingsContainer input[type="number"]:focus { outline: none; border-color: #777; }
         #${MAIN_UI_ID} .privacyDelayContainer { display: flex; justify-content: space-between; gap: 10px; } /* This class might be unused if only one delay input */
         #${MAIN_UI_ID} .privacyDelayContainer > div { flex: 1; }
    `);

    // --- Helper Functions ---
    function debounce(func, wait) { let t; return function(...a) { const l=()=> { clearTimeout(t); func.apply(this,a); }; clearTimeout(t); t=setTimeout(l, wait); }; }
    function log(m, l='info') { const p="[RiffTool]"; if(l==='error') console.error(`${p} ${m}`); else if(l==='warn') console.warn(`${p} ${m}`); else console.log(`${p} ${m}`); updateStatusMessage(m); }
    function logDebug(m, e=null) { if(!debugMode) return; console.log(`[RiffTool DEBUG] ${m}`, e instanceof Element ? e.outerHTML.substring(0,250)+'...' : e !== null ? e : ''); }
    function logWarn(m, e=null) { console.warn(`[RiffTool WARN] ${m}`, e instanceof Element ? e.outerHTML.substring(0,250)+'...' : e !== null ? e : ''); }
    function updateStatusMessage(m) {
        if (!uiElement) return;
        const s = uiElement.querySelector('#statusMessage'); // Scoped query
        if(s) s.textContent = m.length > 100 ? `... ${m.substring(m.length - 100)}` : m;
    }

    function simulateClick(e) {
        if (!e) { logDebug('Element null for click'); return false; }
        try {
            ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t =>
                e.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, composed: true }))
            );
            logDebug('Sim Click (full event sequence):', e);
            return true;
        } catch (err) {
            log(`Click simulation failed: ${err.message}`, 'error');
            console.error('[RiffTool] Click details:', err, e);
            return false;
        }
    }
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }


    // --- UI Functions ---
    function createMainUI() {
        uiElement = document.createElement('div');
        uiElement.id = MAIN_UI_ID; // Use new unique ID
        if (UI_INITIAL_RIGHT) {
            const rightPx = parseInt(UI_INITIAL_RIGHT, 10);
            const widthPx = parseInt(uiElement.style.width, 10) || 300; // Default width if not set
            lastUiLeft = `${Math.max(0, window.innerWidth - rightPx - widthPx)}px`;
            uiElement.style.left = lastUiLeft;
            uiElement.style.right = 'auto';
        } else {
            lastUiLeft = '20px'; // Default left if right is not specified
            uiElement.style.left = lastUiLeft;
        }
        lastUiTop = UI_INITIAL_TOP;
        uiElement.style.top = lastUiTop;
        uiElement.style.display = isMinimized ? 'none' : 'block';

        uiElement.innerHTML = `
            <div id="riffControlHeader">
                <h3>Riffusion Multitool v${GM_info.script.version}</h3>
                <button id="minimizeButton" title="Minimize UI">_</button>
            </div>
            <div id="riffControlContent">
                <div id="mainMenuControls" class="section-controls">
                    <button id="goToSelectiveDelete" class="riffMenuButton riffControlButton">Selective Deletion</button>
                    <button id="goToBulkDelete" class="riffMenuButton riffControlButton">Bulk Deletion</button>
                    <button id="goToDownloadQueue" class="riffMenuButton riffControlButton">Download Queue</button>
                    <button id="goToPrivacyStatus" class="riffMenuButton riffControlButton">Privacy Status</button>
                </div>
                <div id="selectiveModeControls" class="section-controls">
                    <button class="riffBackButton riffControlButton backToMenuButton">Back to Menu</button>
                    <label class="selectAllContainer"><input type="checkbox" id="deleteSelectAll"> Select All Visible</label>
                    <div id="deleteSongList" class="songListContainer" style="max-height: ${currentDeleteListHeight};">Loading...</div>
                    <div class="listResizer" data-list-id="deleteSongList" data-height-var-name="currentDeleteListHeight"></div>
                    <div id="deleteCounter" class="counterDisplay">Deleted: 0 / 0</div>
                    <button id="deleteButton" class="riffControlButton">Delete Selected</button>
                    <button id="reloadDeleteButton" class="riffControlButton" style="display: ${autoReloadEnabled ? 'none' : 'block'};">Reload List</button>
                    <div class="filterSettings">
                        <label class="settings-checkbox-label"><input type="checkbox" id="ignoreLikedToggleDelete"> Ignore Liked</label>
                        <input type="text" id="deleteKeywordFilterInput" placeholder="Keywords to ignore (comma-sep)...">
                    </div>
                </div>
                <div id="bulkModeControls" class="section-controls">
                     <button class="riffBackButton riffControlButton backToMenuButton">Back to Menu</button>
                    <button id="deleteAllButton" class="riffControlButton">Delete Entire Library</button>
                    <p>Deletes all songs without scrolling. Retries if needed. Click "Stop Deletion" to halt.</p>
                </div>
                <div id="downloadQueueControls" class="section-controls">
                    <button class="riffBackButton riffControlButton backToMenuButton">Back to Menu</button>
                    <label class="selectAllContainer"><input type="checkbox" id="downloadSelectAll"> Select All</label>
                    <div class="downloadButtonRow">
                        <button id="downloadSelectLiked" class="riffControlButton">Select/Deselect Liked</button>
                        <button id="downloadClearSelection" title="Clear Selection" class="riffControlButton">C</button>
                    </div>
                    <div id="downloadSongList" class="songListContainer" style="max-height: ${currentDownloadListHeight};">Loading...</div>
                    <div class="listResizer" data-list-id="downloadSongList" data-height-var-name="currentDownloadListHeight"></div>
                     <div id="downloadCounter" class="counterDisplay">Downloaded: 0 / 0</div>
                    <button id="startDownloadQueueButton" class="riffControlButton">Start Download Queue</button>
                    <button id="reloadDownloadButton" class="riffControlButton" style="display: ${autoReloadEnabled ? 'none' : 'block'};">Reload List</button>
                    <div class="filterSettings">
                        <label class="settings-checkbox-label" for="downloadKeywordFilterInput">Filter list by keywords:</label>
                        <input type="text" id="downloadKeywordFilterInput" placeholder="Keywords to show (comma-sep)...">
                        <div class="downloadFormatContainer">
                            <label class="settings-checkbox-label">Download Formats:</label>
                            <div>
                                <label class="settings-checkbox-label"><input type="checkbox" id="formatMP3" value="MP3" checked> MP3</label>
                                <label class="settings-checkbox-label"><input type="checkbox" id="formatM4A" value="M4A"> M4A</label>
                                <label class="settings-checkbox-label"><input type="checkbox" id="formatWAV" value="WAV"> WAV</label>
                            </div>
                        </div>
                        <div class="downloadDelayContainer">
                             <div>
                                 <label class="settings-checkbox-label" for="downloadIntraFormatDelayInput">Format Delay (s):</label>
                                 <input type="number" id="downloadIntraFormatDelayInput" min="0" step="0.1" value="${DEFAULT_INTRA_FORMAT_DELAY_SECONDS}">
                             </div>
                             <div>
                                 <label class="settings-checkbox-label" for="downloadInterSongDelayInput">Song Delay (s):</label>
                                 <input type="number" id="downloadInterSongDelayInput" min="1" value="${DEFAULT_INTER_SONG_DELAY_SECONDS}">
                             </div>
                        </div>
                    </div>
                </div>

                <div id="privacyStatusControls" class="section-controls">
                    <button class="riffBackButton riffControlButton backToMenuButton">Back to Menu</button>
                    <label class="selectAllContainer"><input type="checkbox" id="privacySelectAll"> Select All Visible</label>
                    <div class="privacyButtonRow">
                        <button id="privacySelectLiked" class="riffControlButton">Select/Deselect Liked</button>
                        <button id="privacyClearSelection" title="Clear Selection" class="riffControlButton">C</button>
                    </div>
                    <div id="privacySongList" class="songListContainer" style="max-height: ${currentPrivacyListHeight};">Loading...</div>
                    <div class="listResizer" data-list-id="privacySongList" data-height-var-name="currentPrivacyListHeight"></div>
                    <div id="privacyCounter" class="counterDisplay">Updated: 0 / 0</div>
                    <button id="changePrivacyStatusButton" class="riffControlButton">Change Status</button>
                    <button id="reloadPrivacyButton" class="riffControlButton" style="display: ${autoReloadEnabled ? 'none' : 'block'};">Reload List</button>
                    <div class="filterSettings privacySettingsContainer">
                        <label class="settings-checkbox-label" for="privacyKeywordFilterInput">Filter list by keywords:</label>
                        <input type="text" id="privacyKeywordFilterInput" placeholder="Keywords to show (comma-sep)...">

                        <label class="settings-checkbox-label" for="privacyLevelSelect">Set selected songs to:</label>
                        <select id="privacyLevelSelect">
                            <option value="Only Me">Only Me</option>
                            <option value="Link Only">Link Only</option>
                            <option value="Publish">Publish</option>
                        </select>

                        <div> <!-- Removed privacyDelayContainer class for single input -->
                             <label class="settings-checkbox-label" for="privacyInterSongDelayInput">Song Delay (s):</label>
                             <input type="number" id="privacyInterSongDelayInput" min="1" value="${DEFAULT_PRIVACY_INTER_SONG_DELAY_SECONDS}">
                        </div>
                    </div>
                </div>

                <div id="commonSettingsFooter">
                     <label id="autoReloadToggleContainer" class="settings-checkbox-label" style="display: none;"><input type="checkbox" id="autoReloadToggle"> Auto-Update Lists</label>
                     <label id="debugToggleContainer" class="settings-checkbox-label" style="display: none;"><input type="checkbox" id="debugToggleCheckbox"> Enable Debug</label>
                </div>
                <div id="statusMessage">Ready.</div>
            </div>`;
        document.body.appendChild(uiElement);

        minimizedIconElement = document.createElement('div');
        minimizedIconElement.id = MINIMIZED_ICON_ID; // Use new unique ID
        minimizedIconElement.textContent = 'RM';
        minimizedIconElement.title = 'Restore Riffusion Multitool';
        minimizedIconElement.style.display = isMinimized ? 'flex' : 'none';
        document.body.appendChild(minimizedIconElement);

        const header = uiElement.querySelector('#riffControlHeader');
        enableDrag(uiElement, header);
        uiElement.querySelector('#minimizeButton')?.addEventListener('click', minimizeUI); // Scoped query
        minimizedIconElement?.addEventListener('click', restoreUI);

        uiElement.querySelector('#goToSelectiveDelete')?.addEventListener('click', () => navigateToView('selective'));
        uiElement.querySelector('#goToBulkDelete')?.addEventListener('click', () => navigateToView('bulk'));
        uiElement.querySelector('#goToDownloadQueue')?.addEventListener('click', () => navigateToView('download'));
        uiElement.querySelector('#goToPrivacyStatus')?.addEventListener('click', () => navigateToView('privacy'));
        uiElement.querySelectorAll('.backToMenuButton').forEach(btn => btn.addEventListener('click', () => navigateToView('menu')));

        // Selective Delete Listeners
        uiElement.querySelector('#deleteSelectAll')?.addEventListener('change', (e) => toggleSelectAll(e, '#deleteSongList', selectedSongIdsDelete, 'delete'));
        uiElement.querySelector('#deleteButton')?.addEventListener('click', deleteSelectedSongs);
        uiElement.querySelector('#reloadDeleteButton')?.addEventListener('click', () => { if (currentView === 'selective') populateDeleteSongList(); });
        const ignoreLikedToggle = uiElement.querySelector('#ignoreLikedToggleDelete');
        if (ignoreLikedToggle) { ignoreLikedToggle.checked = ignoreLikedSongsDeleteState; ignoreLikedToggle.addEventListener('change', (e) => { ignoreLikedSongsDeleteState = e.target.checked; log(`Ignore Liked Songs (Delete): ${ignoreLikedSongsDeleteState}`); populateDeleteSongList(); });}
        const deleteKeywordInput = uiElement.querySelector('#deleteKeywordFilterInput');
        if (deleteKeywordInput) { deleteKeywordInput.addEventListener('input', debounce(() => { log('Delete keywords changed, refreshing list...'); populateDeleteSongList(); }, KEYWORD_FILTER_DEBOUNCE)); }
        initListResizer(uiElement.querySelector('.listResizer[data-list-id="deleteSongList"]'), uiElement.querySelector('#deleteSongList'), 'currentDeleteListHeight');

        // Bulk Delete Listeners
        uiElement.querySelector('#deleteAllButton')?.addEventListener('click', () => {
            if (currentView === 'bulk') {
                if (isDeleting) { stopBulkDeletionByUser(); }
                else { if (isDownloading || isChangingPrivacy) { log("Another operation in progress. Cannot start deletion.", "warn"); return; }
                       if (confirm("ARE YOU SURE? This will attempt to delete ALL songs in your library without scrolling. NO UNDO.")) { deleteAllSongsInLibrary(); }
                }
            }
        });

        // Download Queue Listeners
        uiElement.querySelector('#downloadSelectAll')?.addEventListener('change', (e) => toggleSelectAll(e, '#downloadSongList', selectedSongIdsDownload, 'download'));
        uiElement.querySelector('#downloadSelectLiked')?.addEventListener('click', () => toggleSelectLikedGeneric('#downloadSongList', selectedSongIdsDownload, '#downloadSelectAll', updateDownloadSelectLikedButtonText));
        uiElement.querySelector('#downloadClearSelection')?.addEventListener('click', () => clearSelectionGeneric('#downloadSongList', selectedSongIdsDownload, '#downloadSelectAll', updateDownloadSelectLikedButtonText));
        uiElement.querySelector('#startDownloadQueueButton')?.addEventListener('click', startDownloadQueue);
        uiElement.querySelector('#reloadDownloadButton')?.addEventListener('click', () => { if (currentView === 'download') populateDownloadSongList(); });
        const downloadKeywordInput = uiElement.querySelector('#downloadKeywordFilterInput');
        if (downloadKeywordInput) { downloadKeywordInput.addEventListener('input', debounce(() => { log('Download filter changed, refreshing list...'); populateDownloadSongList(); }, KEYWORD_FILTER_DEBOUNCE)); }
        const interSongDelayInput = uiElement.querySelector('#downloadInterSongDelayInput');
        if (interSongDelayInput) { interSongDelayInput.value = downloadInterSongDelaySeconds; interSongDelayInput.addEventListener('input', (e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val) && val >= 0) { downloadInterSongDelaySeconds = val; log(`Inter-Song delay (Download) set to: ${downloadInterSongDelaySeconds}s`); } }); }
        const intraFormatDelayInput = uiElement.querySelector('#downloadIntraFormatDelayInput');
        if (intraFormatDelayInput) { intraFormatDelayInput.value = downloadIntraFormatDelaySeconds; intraFormatDelayInput.addEventListener('input', (e) => { const val = parseFloat(e.target.value); if (!isNaN(val) && val >= 0) { downloadIntraFormatDelaySeconds = val; log(`Intra-Format delay set to: ${downloadIntraFormatDelaySeconds}s`); } }); }
        initListResizer(uiElement.querySelector('.listResizer[data-list-id="downloadSongList"]'), uiElement.querySelector('#downloadSongList'), 'currentDownloadListHeight');

        // Privacy Status Listeners
        uiElement.querySelector('#privacySelectAll')?.addEventListener('change', (e) => toggleSelectAll(e, '#privacySongList', selectedSongIdsPrivacy, 'privacy'));
        uiElement.querySelector('#privacySelectLiked')?.addEventListener('click', () => toggleSelectLikedGeneric('#privacySongList', selectedSongIdsPrivacy, '#privacySelectAll', updatePrivacySelectLikedButtonText));
        uiElement.querySelector('#privacyClearSelection')?.addEventListener('click', () => clearSelectionGeneric('#privacySongList', selectedSongIdsPrivacy, '#privacySelectAll', updatePrivacySelectLikedButtonText));
        uiElement.querySelector('#changePrivacyStatusButton')?.addEventListener('click', changeSelectedSongsPrivacy);
        uiElement.querySelector('#reloadPrivacyButton')?.addEventListener('click', () => { if (currentView === 'privacy') populatePrivacySongList(); });
        const privacyKeywordInput = uiElement.querySelector('#privacyKeywordFilterInput');
        if (privacyKeywordInput) { privacyKeywordInput.addEventListener('input', debounce(() => { log('Privacy filter changed, refreshing list...'); populatePrivacySongList(); }, KEYWORD_FILTER_DEBOUNCE)); }
        const privacyLevelSelect = uiElement.querySelector('#privacyLevelSelect');
        if (privacyLevelSelect) { privacyLevelSelect.addEventListener('change', updateChangePrivacyButtonText); }
        const privacyInterSongDelayInput = uiElement.querySelector('#privacyInterSongDelayInput');
        if (privacyInterSongDelayInput) {
            privacyInterSongDelayInput.value = privacyInterSongDelaySeconds;
            privacyInterSongDelayInput.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 0) {
                    privacyInterSongDelaySeconds = val;
                    log(`Inter-Song delay (Privacy) set to: ${privacyInterSongDelaySeconds}s`);
                }
            });
        }
        initListResizer(uiElement.querySelector('.listResizer[data-list-id="privacySongList"]'), uiElement.querySelector('#privacySongList'), 'currentPrivacyListHeight');
        updateChangePrivacyButtonText();


        // Common Settings Listeners
        const autoReloadCheckbox = uiElement.querySelector('#autoReloadToggle');
        if (autoReloadCheckbox) { autoReloadCheckbox.checked = autoReloadEnabled; autoReloadCheckbox.addEventListener('change', handleAutoReloadToggle); }
        const debugCheckbox = uiElement.querySelector('#debugToggleCheckbox');
        if (debugCheckbox) { debugCheckbox.checked = debugMode; debugCheckbox.addEventListener('change', handleDebugToggle); }

        updateUIVisibility();
        startAutoReloadPolling();
    }

    function minimizeUI() {
        if (!uiElement || !minimizedIconElement) return;
        if (!isMinimized) {
             lastUiTop = uiElement.style.top || UI_INITIAL_TOP;
             lastUiLeft = uiElement.style.left || lastUiLeft;
        }
        uiElement.style.display = 'none';
        minimizedIconElement.style.display = 'flex';
        isMinimized = true;
        logDebug("UI Minimized");
    }

    function restoreUI() {
        if (!uiElement || !minimizedIconElement) return;
        minimizedIconElement.style.display = 'none';
        uiElement.style.display = 'block';
        uiElement.style.top = lastUiTop;
        uiElement.style.left = lastUiLeft;
        uiElement.style.right = 'auto';
        isMinimized = false;
        logDebug("UI Restored to:", { top: lastUiTop, left: lastUiLeft });
        updateUIVisibility();
    }


    function navigateToView(view) {
        if (isDeleting || isDownloading || isChangingPrivacy) {
            if (!(currentView === 'bulk' && isDeleting)) {
                 log("Cannot switch views while an operation is in progress.", "warn");
                 return;
            }
        }
        logDebug(`Navigating to view: ${view}`);
        const oldView = currentView;
        currentView = view;
        updateUIVisibility();

        const noAutoReloadOrEmptyList = !autoReloadEnabled ||
            (view === 'selective' && lastKnownSongIdsDelete.length === 0) ||
            (view === 'download' && lastKnownSongIdsDownload.length === 0) ||
            (view === 'privacy' && lastKnownSongIdsPrivacy.length === 0);

        if (noAutoReloadOrEmptyList) {
            if (view === 'selective') populateDeleteSongListIfNeeded();
            else if (view === 'download') populateDownloadSongListIfNeeded();
            else if (view === 'privacy') populatePrivacySongListIfNeeded();
        }
        if (autoReloadEnabled && oldView !== currentView) {
            checkAndReloadLists(true); // Force check current view's list if auto-reload is on
        }
    }

    function updateUIVisibility() {
        if (!uiElement) return; // Guard against calls before uiElement is ready

        if (isMinimized) {
            uiElement.style.display = 'none';
            if (minimizedIconElement) minimizedIconElement.style.display = 'flex';
            return;
        }
        if (minimizedIconElement) minimizedIconElement.style.display = 'none';
        uiElement.style.display = 'block';

        const sections = {
            menu: uiElement.querySelector('#mainMenuControls'),
            selective: uiElement.querySelector('#selectiveModeControls'),
            bulk: uiElement.querySelector('#bulkModeControls'),
            download: uiElement.querySelector('#downloadQueueControls'),
            privacy: uiElement.querySelector('#privacyStatusControls')
        };
        const headerTitle = uiElement.querySelector('#riffControlHeader h3');
        const statusMsg = uiElement.querySelector('#statusMessage');
        let title = `Riffusion Multitool v${GM_info.script.version}`;

        Object.values(sections).forEach(section => {
            if (section) section.style.display = 'none';
        });

        const autoReloadContainer = uiElement.querySelector('#autoReloadToggleContainer');
        const debugContainer = uiElement.querySelector('#debugToggleContainer');

        if (autoReloadContainer) autoReloadContainer.style.display = 'none';
        if (debugContainer) debugContainer.style.display = 'none';

        const opInProgress = isDeleting || isDownloading || isChangingPrivacy;

        if (sections[currentView]) {
            sections[currentView].style.display = 'block';
            switch (currentView) {
                case 'menu':
                    title += " - Menu";
                    if (!opInProgress) updateStatusMessage("Select a tool.");
                    if (debugContainer) debugContainer.style.display = 'flex';
                    break;
                case 'selective':
                    title += " - Selective Deletion";
                    populateDeleteSongListIfNeeded();
                    if (!opInProgress) updateStatusMessage("Select songs to delete.");
                    if (autoReloadContainer) autoReloadContainer.style.display = 'flex';
                    break;
                case 'bulk':
                    title += " - Bulk Deletion";
                    const deleteAllBtn = uiElement.querySelector('#deleteAllButton');
                    if (deleteAllBtn) {
                        deleteAllBtn.textContent = isDeleting ? "Stop Deletion" : "Delete Entire Library";
                    }
                    if (!opInProgress) updateStatusMessage("Warning: Deletes entire library.");
                    break;
                case 'download':
                    title += " - Download Queue";
                    populateDownloadSongListIfNeeded();
                    if (!opInProgress) updateStatusMessage("Select songs to download.");
                    if (autoReloadContainer) autoReloadContainer.style.display = 'flex';
                    break;
                case 'privacy':
                    title += " - Privacy Status";
                    populatePrivacySongListIfNeeded();
                    if (!opInProgress) updateStatusMessage("Select songs and privacy level.");
                    if (autoReloadContainer) autoReloadContainer.style.display = 'flex';
                    updateChangePrivacyButtonText(); // Ensure button text is correct on view switch
                    break;
            }
        } else {
            log(`View '${currentView}' not found, showing menu.`, 'warn');
            if (sections.menu) sections.menu.style.display = 'block'; // Fallback check
            currentView = 'menu'; // Default to menu if view is invalid
            title += " - Menu";
            if (!opInProgress) updateStatusMessage("Select a tool.");
            if (debugContainer) debugContainer.style.display = 'flex';
        }
        if (headerTitle) headerTitle.textContent = title;
        if (statusMsg) statusMsg.style.display = 'block'; // Always show status message area

        // Toggle reload buttons based on autoReloadEnabled state
        const reloadDelBtn = uiElement.querySelector('#reloadDeleteButton');
        if (reloadDelBtn) reloadDelBtn.style.display = autoReloadEnabled ? 'none' : 'block';
        const reloadDownBtn = uiElement.querySelector('#reloadDownloadButton');
        if (reloadDownBtn) reloadDownBtn.style.display = autoReloadEnabled ? 'none' : 'block';
        const reloadPrivBtn = uiElement.querySelector('#reloadPrivacyButton');
        if (reloadPrivBtn) reloadPrivBtn.style.display = autoReloadEnabled ? 'none' : 'block';

        logDebug(`UI Visibility Updated. Current View: ${currentView}`);
    }


    function handleDebugToggle(event) {
        debugMode = event.target.checked;
        log(`Debug mode ${debugMode ? 'enabled' : 'disabled'}.`);
    }

    function enableDrag(element, handle) {
        let isDragging = false, offsetX, offsetY;
        handle.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.closest('button')) return; // Ignore clicks on buttons within the header
            if (isMinimized) return; // Don't drag if minimized
            isDragging = true;
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            element.style.cursor = 'grabbing';
            handle.style.cursor = 'grabbing'; // Change handle cursor too
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, { once: true });
            e.preventDefault(); // Prevent text selection or other default actions
        });
        function onMouseMove(e) {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            const elWidth = element.offsetWidth;
            const elHeight = element.offsetHeight;
            // Constrain to viewport
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + elWidth > winWidth) newX = winWidth - elWidth;
            if (newY + elHeight > winHeight) newY = winHeight - elHeight;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto'; // Important: override fixed right if it was set
        }
        function onMouseUp(e) {
            if (e.button !== 0 || !isDragging) return; // Ensure it's the left mouse button releasing
            isDragging = false;
            element.style.cursor = 'default';
            handle.style.cursor = 'move';
            document.removeEventListener('mousemove', onMouseMove);
             if (!isMinimized) { // Store position only if not minimized
                 lastUiTop = element.style.top;
                 lastUiLeft = element.style.left;
                 logDebug("Stored new position after drag:", { top: lastUiTop, left: lastUiLeft });
             }
        }
    }

    function initListResizer(resizerElem, listContentElem, heightVarName) {
        if (!resizerElem || !listContentElem) return;
        let startY, startHeight;

        resizerElem.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // Only left click
            e.preventDefault();
            startY = e.clientY;
            // Use current style.maxHeight if set, otherwise current offsetHeight
            startHeight = parseInt(window.getComputedStyle(listContentElem).maxHeight, 10);
            if (isNaN(startHeight) || startHeight === 0) { // Fallback if maxHeight is not set or 'none'
                 startHeight = listContentElem.offsetHeight;
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, { once: true });
        });

        function onMouseMove(e) {
            if (e.buttons === 0) { // If mouse button was released outside window
                onMouseUp();
                return;
            }
            const dy = e.clientY - startY;
            let newHeight = startHeight + dy;
            newHeight = Math.max(50, newHeight); // Min height
            newHeight = Math.min(window.innerHeight * 0.8, newHeight); // Max height (80% of viewport)

            listContentElem.style.maxHeight = newHeight + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            const finalHeight = listContentElem.style.maxHeight;
            // Update the corresponding global state variable for height
            if (heightVarName === 'currentDeleteListHeight') currentDeleteListHeight = finalHeight;
            else if (heightVarName === 'currentDownloadListHeight') currentDownloadListHeight = finalHeight;
            else if (heightVarName === 'currentPrivacyListHeight') currentPrivacyListHeight = finalHeight;
            logDebug(`List ${listContentElem.id} height set to ${finalHeight}`);
        }
    }


    // --- Song List Population & Filtering ---
    function getSongDataFromPage() {
        let listContainer = document.querySelector('div[data-sentry-component="InfiniteScroll"] > div.grow');
        if (!listContainer || listContainer.children.length === 0) {
            const allRiffRows = document.querySelectorAll('div[data-sentry-component="DraggableRiffRow"]');
            if (allRiffRows.length > 0 && allRiffRows[0].parentElement.childElementCount > 1) {
                 if (Array.from(allRiffRows[0].parentElement.children).every(child => child.getAttribute('data-sentry-component') === 'DraggableRiffRow' || child.tagName === 'HR')) {
                    listContainer = allRiffRows[0].parentElement;
                 }
            }
        }
        const songElements = listContainer
            ? listContainer.querySelectorAll(':scope > div[data-sentry-component="DraggableRiffRow"]')
            : document.querySelectorAll('div[data-sentry-component="DraggableRiffRow"]');

        const songs = [];
        songElements.forEach((songElement, index) => {
             const titleLink = songElement.querySelector('a[href^="/song/"]');
             let titleElement = titleLink ? titleLink.querySelector('h4.text-primary') : null;
             if (!titleElement) titleElement = songElement.querySelector('[data-sentry-element="RiffTitle"]'); // Generic title element
             if (!titleElement && titleLink) titleElement = titleLink.querySelector('div[class*="truncate"], h4'); // Fallback for different structures under link
             const title = titleElement ? titleElement.textContent.trim() : `Untitled Song ${index + 1}`;

             let songId = null;
             if (titleLink) {
                  const match = titleLink.href.match(/\/song\/([a-f0-9-]+)/);
                  if (match && match[1]) songId = match[1];
             }
             if (!songId) songId = songElement.dataset.songId; // Fallback to data attribute on row
             if (!songId) { // Try to extract from menu trigger if available and ID follows a pattern
                 const menuTrigger = songElement.querySelector('button[data-sentry-element="MenuTrigger"]');
                 if (menuTrigger && menuTrigger.id) {
                     // Example id: radix-:r2gH:-trigger-songshare:song:bff4d67c-51e1-487e-9bca-a641d5c2df55
                     const idParts = menuTrigger.id.split(':');
                     if (idParts.length > 2 && idParts[idParts.length-2] === 'song') { // Check if 'song' is the second to last part
                         songId = idParts[idParts.length-1];
                     }
                 }
             }
             if (!songId) { logDebug(`Could not determine songId for element at index ${index}:`, songElement); return; } // Skip if no ID can be found

             const unfavoriteButton = songElement.querySelector('button[aria-label^="Unfavorite"]');
             const solidHeartIcon = songElement.querySelector('button svg[data-prefix="fas"][data-icon="heart"]'); // Solid heart for liked
             let isLiked = !!unfavoriteButton || (!!solidHeartIcon && !songElement.querySelector('button[aria-label^="Favorite"]')); // Liked if unfav exists, or solid heart without fav button

             songs.push({ id: songId, title: title, titleLower: title.toLowerCase(), isLiked: isLiked, element: songElement });
        });
        return songs;
    }

    function populateDeleteSongListIfNeeded() {
        if (!uiElement) return;
        const songListDiv = uiElement.querySelector('#deleteSongList');
        if (!songListDiv) return;
        if (isDeleting || isDownloading || isChangingPrivacy) { logDebug("Skipping delete list population during active operation."); return; }
        if (songListDiv.innerHTML === '' || songListDiv.innerHTML === 'Loading...' || songListDiv.children.length === 0 || (songListDiv.children.length === 1 && songListDiv.firstElementChild.tagName === 'P')) {
            populateDeleteSongList();
        }
    }
    function populateDeleteSongList() {
         if (!uiElement || currentView !== 'selective' || isMinimized) return;
         if (isDeleting || isDownloading || isChangingPrivacy) { logDebug("Skipping delete list population during active operation."); return; }
         logDebug('Populating DELETE song list...');
         const songListDiv = uiElement.querySelector('#deleteSongList');
         const deleteCounter = uiElement.querySelector('#deleteCounter');
         if (!songListDiv || !deleteCounter) return;

         songListDiv.innerHTML = 'Loading...';
         deleteCounter.textContent = 'Deleted: 0 / 0';

         const selectAllCheckbox = uiElement.querySelector('#deleteSelectAll');
         if (selectAllCheckbox) selectAllCheckbox.checked = false;
         const ignoreLikedCheckbox = uiElement.querySelector('#ignoreLikedToggleDelete');
         if(ignoreLikedCheckbox) ignoreLikedCheckbox.checked = ignoreLikedSongsDeleteState;

         const keywordInput = uiElement.querySelector('#deleteKeywordFilterInput');
         const keywordString = keywordInput ? keywordInput.value : '';
         const dynamicIgnoreKeywords = keywordString.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== '');

         setTimeout(() => { // Delay to allow DOM to update if called rapidly
             const songsFromPage = getSongDataFromPage();
             songListDiv.innerHTML = ''; // Clear loading message
             songListDiv.style.maxHeight = currentDeleteListHeight; // Apply current height

             if (songsFromPage.length === 0) {
                 songListDiv.innerHTML = '<p style="color:#d0d0d0;text-align:center;font-size:12px;">No songs found on page.</p>';
                 if(!(isDeleting || isDownloading || isChangingPrivacy)) updateStatusMessage("No songs found.");
                 lastKnownSongIdsDelete = [];
                 return;
             }

             let ignoredCount = 0;
             let visibleCount = 0;

             songsFromPage.forEach(song => {
                 const keywordMatch = dynamicIgnoreKeywords.length > 0 && dynamicIgnoreKeywords.some(keyword => song.titleLower.includes(keyword));
                 const likedMatch = ignoreLikedSongsDeleteState && song.isLiked;
                 const shouldIgnore = keywordMatch || likedMatch;

                 let ignoreReason = '';
                 if (keywordMatch) ignoreReason += 'Keyword';
                 if (likedMatch) ignoreReason += (keywordMatch ? ' & Liked' : 'Liked');

                 const label = document.createElement('label');
                 const checkbox = document.createElement('input');
                 checkbox.type = 'checkbox';
                 checkbox.dataset.songId = song.id;
                 checkbox.disabled = shouldIgnore;
                 checkbox.checked = selectedSongIdsDelete.has(song.id) && !shouldIgnore;

                 checkbox.addEventListener('change', (event) => {
                     if (event.target.checked) selectedSongIdsDelete.add(song.id);
                     else selectedSongIdsDelete.delete(song.id);
                     updateSelectAllCheckboxState('#deleteSelectAll', '#deleteSongList');
                 });

                 label.appendChild(checkbox);
                 label.appendChild(document.createTextNode(` ${song.title}`));
                 if (song.isLiked) label.classList.add('liked');

                 if (shouldIgnore) {
                    label.classList.add('ignored');
                    label.title = `Ignoring for delete: ${ignoreReason}`;
                    ignoredCount++;
                 } else {
                    visibleCount++;
                 }
                 songListDiv.appendChild(label);
             });
             updateSelectAllCheckboxState('#deleteSelectAll', '#deleteSongList');

             logDebug(`Populated DELETE list: ${songsFromPage.length} total, ${visibleCount} selectable, ${ignoredCount} ignored. ${selectedSongIdsDelete.size} selected.`);
             if(!(isDeleting || isDownloading || isChangingPrivacy)) updateStatusMessage(`Loaded ${songsFromPage.length} songs (${ignoredCount} ignored).`);
             lastKnownSongIdsDelete = songsFromPage.map(s => s.id);
         }, 100);
     }

    function populateDownloadSongListIfNeeded() {
        if (!uiElement) return;
        const songListDiv = uiElement.querySelector('#downloadSongList');
         if (!songListDiv) return;
         if (isDeleting || isDownloading || isChangingPrivacy) { logDebug("Skipping download list population during active operation."); return; }
        if (songListDiv.innerHTML === '' || songListDiv.innerHTML === 'Loading...' || songListDiv.children.length === 0 || (songListDiv.children.length === 1 && songListDiv.firstElementChild.tagName === 'P')) {
            populateDownloadSongList();
        }
    }
    function populateDownloadSongList() {
        if (!uiElement || currentView !== 'download' || isMinimized) return;
        if (isDeleting || isDownloading || isChangingPrivacy) { logDebug("Skipping download list population during active operation."); return; }
        logDebug('Populating DOWNLOAD song list...');
        const songListDiv = uiElement.querySelector('#downloadSongList');
        const downloadCounter = uiElement.querySelector('#downloadCounter');
        if (!songListDiv || !downloadCounter) return;

        songListDiv.innerHTML = 'Loading...';
        downloadCounter.textContent = 'Downloaded: 0 / 0';

        const selectAllCheckbox = uiElement.querySelector('#downloadSelectAll');
        if (selectAllCheckbox) selectAllCheckbox.checked = false;

        const keywordInput = uiElement.querySelector('#downloadKeywordFilterInput');
        const keywordString = keywordInput ? keywordInput.value : '';
        const filterKeywords = keywordString.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== '');

        setTimeout(() => {
            const songsFromPage = getSongDataFromPage();
            songListDiv.innerHTML = '';
            songListDiv.style.maxHeight = currentDownloadListHeight;

             if (songsFromPage.length === 0) {
                 songListDiv.innerHTML = '<p style="color:#d0d0d0;text-align:center;font-size:12px;">No songs found on page.</p>';
                 if(!(isDeleting || isDownloading || isChangingPrivacy)) updateStatusMessage("No songs found.");
                 updateDownloadSelectLikedButtonText();
                 lastKnownSongIdsDownload = [];
                 return;
             }

            let displayedCount = 0;

            songsFromPage.forEach(song => {
                const keywordMatch = filterKeywords.length === 0 || filterKeywords.some(keyword => song.titleLower.includes(keyword));

                if (keywordMatch) {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.dataset.songId = song.id;
                    checkbox.dataset.isLiked = song.isLiked.toString(); // Store liked status
                    checkbox.checked = selectedSongIdsDownload.has(song.id);

                    checkbox.addEventListener('change', (event) => {
                        if (event.target.checked) selectedSongIdsDownload.add(song.id);
                        else selectedSongIdsDownload.delete(song.id);
                        updateSelectAllCheckboxState('#downloadSelectAll', '#downloadSongList');
                        updateDownloadSelectLikedButtonText();
                    });

                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${song.title}`));
                    if (song.isLiked) label.classList.add('liked');

                    songListDiv.appendChild(label);
                    displayedCount++;
                }
            });
            updateSelectAllCheckboxState('#downloadSelectAll', '#downloadSongList');

            logDebug(`Populated DOWNLOAD list: ${songsFromPage.length} total, ${displayedCount} displayed. ${selectedSongIdsDownload.size} selected.`);
            if(!(isDeleting || isDownloading || isChangingPrivacy)) updateStatusMessage(`Showing ${displayedCount} of ${songsFromPage.length} songs.`);
            updateDownloadSelectLikedButtonText();
            lastKnownSongIdsDownload = songsFromPage.map(s => s.id);
        }, 100);
    }

    function populatePrivacySongListIfNeeded() {
        if (!uiElement) return;
        const songListDiv = uiElement.querySelector('#privacySongList');
        if (!songListDiv) return;
        if (isDeleting || isDownloading || isChangingPrivacy) { logDebug("Skipping privacy list population during active operation."); return; }
        if (songListDiv.innerHTML === '' || songListDiv.innerHTML === 'Loading...' || songListDiv.children.length === 0 || (songListDiv.children.length === 1 && songListDiv.firstElementChild.tagName === 'P')) {
            populatePrivacySongList();
        }
    }

    function populatePrivacySongList() {
        if (!uiElement || currentView !== 'privacy' || isMinimized) return;
        if (isDeleting || isDownloading || isChangingPrivacy) { logDebug("Skipping privacy list population during active operation."); return; }
        logDebug('Populating PRIVACY song list...');
        const songListDiv = uiElement.querySelector('#privacySongList');
        const privacyCounter = uiElement.querySelector('#privacyCounter');
        if (!songListDiv || !privacyCounter) return;

        songListDiv.innerHTML = 'Loading...';
        privacyCounter.textContent = 'Updated: 0 / 0';

        const selectAllCheckbox = uiElement.querySelector('#privacySelectAll');
        if (selectAllCheckbox) selectAllCheckbox.checked = false;

        const keywordInput = uiElement.querySelector('#privacyKeywordFilterInput');
        const keywordString = keywordInput ? keywordInput.value : '';
        const filterKeywords = keywordString.split(',').map(k => k.trim().toLowerCase()).filter(k => k !== '');

        setTimeout(() => {
            const songsFromPage = getSongDataFromPage();
            songListDiv.innerHTML = '';
            songListDiv.style.maxHeight = currentPrivacyListHeight;

            if (songsFromPage.length === 0) {
                songListDiv.innerHTML = '<p style="color:#d0d0d0;text-align:center;font-size:12px;">No songs found on page.</p>';
                if(!(isDeleting || isDownloading || isChangingPrivacy)) updateStatusMessage("No songs found.");
                updatePrivacySelectLikedButtonText();
                lastKnownSongIdsPrivacy = [];
                return;
            }

            let displayedCount = 0;
            songsFromPage.forEach(song => {
                const keywordMatch = filterKeywords.length === 0 || filterKeywords.some(keyword => song.titleLower.includes(keyword));

                if (keywordMatch) {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.dataset.songId = song.id;
                    checkbox.dataset.isLiked = song.isLiked.toString();
                    checkbox.checked = selectedSongIdsPrivacy.has(song.id);

                    checkbox.addEventListener('change', (event) => {
                        if (event.target.checked) selectedSongIdsPrivacy.add(song.id);
                        else selectedSongIdsPrivacy.delete(song.id);
                        updateSelectAllCheckboxState('#privacySelectAll', '#privacySongList');
                        updatePrivacySelectLikedButtonText();
                    });

                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${song.title}`));
                    if (song.isLiked) label.classList.add('liked');

                    songListDiv.appendChild(label);
                    displayedCount++;
                }
            });
            updateSelectAllCheckboxState('#privacySelectAll', '#privacySongList');

            logDebug(`Populated PRIVACY list: ${songsFromPage.length} total, ${displayedCount} displayed. ${selectedSongIdsPrivacy.size} selected.`);
            if(!(isDeleting || isDownloading || isChangingPrivacy)) updateStatusMessage(`Showing ${displayedCount} of ${songsFromPage.length} songs.`);
            updatePrivacySelectLikedButtonText();
            lastKnownSongIdsPrivacy = songsFromPage.map(s => s.id);
        }, 100);
    }


    function updateSelectAllCheckboxState(selectAllSelector, listSelector) {
        if (!uiElement) return;
        const selectAllCb = uiElement.querySelector(selectAllSelector);
        if (!selectAllCb) return;
        const visibleCheckboxes = uiElement.querySelectorAll(`${listSelector} input[type="checkbox"]:not(:disabled)`);
        const checkedVisibleCheckboxes = uiElement.querySelectorAll(`${listSelector} input[type="checkbox"]:not(:disabled):checked`);
        selectAllCb.checked = visibleCheckboxes.length > 0 && visibleCheckboxes.length === checkedVisibleCheckboxes.length;
    }

    function toggleSelectAll(event, listSelector, selectionSet, type) {
        if (!uiElement || isMinimized || isDeleting || isDownloading || isChangingPrivacy) return;
        const isChecked = event.target.checked;
        const checkboxes = uiElement.querySelectorAll(`${listSelector} input[type="checkbox"]:not(:disabled)`);
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            const songId = cb.dataset.songId;
            if (isChecked) selectionSet.add(songId);
            else selectionSet.delete(songId);
        });
        logDebug(`Select All Toggled in ${listSelector}: ${isChecked} (${checkboxes.length} items). Selection Set: ${selectionSet.size}`);
        if (type === 'download') updateDownloadSelectLikedButtonText();
        else if (type === 'privacy') updatePrivacySelectLikedButtonText();
    }

    function toggleSelectLikedGeneric(listSelector, selectionSet, selectAllSelector, updateButtonTextFn) {
        if (!uiElement || isMinimized || isDeleting || isDownloading || isChangingPrivacy) return;
        const checkboxes = uiElement.querySelectorAll(`${listSelector} input[type="checkbox"]:not(:disabled)`);
        if (checkboxes.length === 0) { logWarn("No songs available in list for liked toggle."); return; }

        let shouldSelect = false; // Determine if we should select or deselect liked songs
        for (const cb of checkboxes) {
            if (cb.dataset.isLiked === 'true' && !cb.checked) { shouldSelect = true; break; }
        }

        let changedCount = 0;
        checkboxes.forEach(cb => {
            if (cb.dataset.isLiked === 'true') {
                 if (cb.checked !== shouldSelect) { // Only change if current state is different from target state
                     cb.checked = shouldSelect;
                     const songId = cb.dataset.songId;
                     if (shouldSelect) selectionSet.add(songId); else selectionSet.delete(songId);
                     changedCount++;
                 }
            }
        });
        log(`Toggled selection for ${changedCount} liked songs. Action: ${shouldSelect ? 'Select' : 'Deselect'}`);
        updateStatusMessage(`${shouldSelect ? 'Selected' : 'Deselected'} ${changedCount} liked songs.`);
        updateSelectAllCheckboxState(selectAllSelector, listSelector);
        if (updateButtonTextFn) updateButtonTextFn();
    }

    function clearSelectionGeneric(listSelector, selectionSet, selectAllSelector, updateButtonTextFn) {
        if (!uiElement || isMinimized || isDeleting || isDownloading || isChangingPrivacy) return;
        const checkboxes = uiElement.querySelectorAll(`${listSelector} input[type="checkbox"]:checked`);
        if (checkboxes.length === 0) { log("No songs selected to clear.", "info"); return; }

        checkboxes.forEach(cb => cb.checked = false);
        selectionSet.clear();

        const selectAllCheckbox = uiElement.querySelector(selectAllSelector);
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        log(`Cleared selection for ${checkboxes.length} songs in ${listSelector}.`);
        updateStatusMessage("Selection cleared.");
        if (updateButtonTextFn) updateButtonTextFn();
    }


    function updateDownloadSelectLikedButtonText() {
        if (!uiElement || currentView !== 'download' || isMinimized) return;
        const button = uiElement.querySelector('#downloadSelectLiked');
        if (!button) return;

        const checkboxes = uiElement.querySelectorAll('#downloadSongList input[type="checkbox"]:not(:disabled)');
        if (checkboxes.length === 0) {
             button.textContent = 'Select Liked';
             button.disabled = true; return;
        }
        button.disabled = false;
        let shouldOfferSelect = false;
        checkboxes.forEach(cb => {
            if (cb.dataset.isLiked === 'true' && !cb.checked) {
                shouldOfferSelect = true;
            }
        });
        button.textContent = shouldOfferSelect ? 'Select Liked' : 'Deselect Liked';
    }

    function updatePrivacySelectLikedButtonText() {
        if (!uiElement || currentView !== 'privacy' || isMinimized) return;
        const button = uiElement.querySelector('#privacySelectLiked');
        if (!button) return;

        const checkboxes = uiElement.querySelectorAll('#privacySongList input[type="checkbox"]:not(:disabled)');
         if (checkboxes.length === 0) {
             button.textContent = 'Select Liked';
             button.disabled = true; return;
        }
        button.disabled = false;
        let shouldOfferSelect = false;
        checkboxes.forEach(cb => {
            if (cb.dataset.isLiked === 'true' && !cb.checked) {
                shouldOfferSelect = true;
            }
        });
        button.textContent = shouldOfferSelect ? 'Select Liked' : 'Deselect Liked';
    }

    function updateChangePrivacyButtonText() {
        if (!uiElement || currentView !== 'privacy' || isMinimized) return;
        const button = uiElement.querySelector('#changePrivacyStatusButton');
        const select = uiElement.querySelector('#privacyLevelSelect');
        if (button && select) {
            const selectedOption = select.value;
            button.textContent = privacyButtonTextMap[selectedOption] || "Change Status";
        }
    }

    function updateCounter(type, count, total) {
       if (!uiElement || isMinimized) return;
       let counterElementId = '';
       if (type === 'delete') counterElementId = 'deleteCounter';
       else if (type === 'download') counterElementId = 'downloadCounter';
       else if (type === 'privacy') counterElementId = 'privacyCounter';
       else return;

       const counterElement = uiElement.querySelector(`#${counterElementId}`); // Scoped query
       if (counterElement) {
           const prefix = type === 'delete' ? 'Deleted' : (type === 'download' ? 'Downloaded' : 'Updated');
           counterElement.textContent = `${prefix}: ${count} / ${total}`;
       }
    }

    // --- Auto Reload Logic ---
    function handleAutoReloadToggle(event) {
        autoReloadEnabled = event.target.checked;
        log(`Automatic list reload ${autoReloadEnabled ? 'enabled' : 'disabled'}.`);
        if (!uiElement) return;
        const reloadDelBtn = uiElement.querySelector('#reloadDeleteButton');
        if (reloadDelBtn) reloadDelBtn.style.display = autoReloadEnabled ? 'none' : 'block';
        const reloadDownBtn = uiElement.querySelector('#reloadDownloadButton');
        if (reloadDownBtn) reloadDownBtn.style.display = autoReloadEnabled ? 'none' : 'block';
        const reloadPrivBtn = uiElement.querySelector('#reloadPrivacyButton');
        if (reloadPrivBtn) reloadPrivBtn.style.display = autoReloadEnabled ? 'none' : 'block';


        if (autoReloadEnabled) {
            startAutoReloadPolling();
            checkAndReloadLists(true); // Force a check on toggle to immediately reflect state
        } else {
            stopAutoReloadPolling();
        }
    }

    function startAutoReloadPolling() {
        if (autoReloadTimer) clearInterval(autoReloadTimer);
        if (autoReloadEnabled) {
            autoReloadTimer = setInterval(() => checkAndReloadLists(false), AUTO_RELOAD_INTERVAL);
            logDebug("Auto-reload polling started.");
        }
    }

    function stopAutoReloadPolling() {
        if (autoReloadTimer) {
            clearInterval(autoReloadTimer);
            autoReloadTimer = null;
            logDebug("Auto-reload polling stopped.");
        }
    }


    function checkAndReloadLists(forceCheckCurrentView = false) {
        if ((!autoReloadEnabled && !forceCheckCurrentView) || !uiElement || isMinimized || isDeleting || isDownloading || isChangingPrivacy || uiElement.style.display === 'none') {
            return;
        }

        const songsOnPage = getSongDataFromPage();
        const currentPageSongIds = songsOnPage.map(s => s.id);
        const currentPageSongIdsString = [...currentPageSongIds].sort().join(','); // Create a comparable string

        let listNeedsRefresh = false;
        let currentListIsEmpty = false;

        if (currentView === 'selective' || (forceCheckCurrentView && currentView === 'selective')) {
            const knownIdsString = [...lastKnownSongIdsDelete].sort().join(',');
            listNeedsRefresh = currentPageSongIdsString !== knownIdsString;
            currentListIsEmpty = uiElement.querySelector('#deleteSongList')?.children.length === 0;
            if (listNeedsRefresh || (forceCheckCurrentView && currentListIsEmpty && songsOnPage.length > 0)) {
                logDebug("Page song list changed for Selective Deletion. Reloading UI list.");
                populateDeleteSongList();
            }
        } else if (currentView === 'download' || (forceCheckCurrentView && currentView === 'download')) {
            const knownIdsString = [...lastKnownSongIdsDownload].sort().join(',');
            listNeedsRefresh = currentPageSongIdsString !== knownIdsString;
            currentListIsEmpty = uiElement.querySelector('#downloadSongList')?.children.length === 0;
            if (listNeedsRefresh || (forceCheckCurrentView && currentListIsEmpty && songsOnPage.length > 0)) {
                logDebug("Page song list changed for Download Queue. Reloading UI list.");
                populateDownloadSongList();
            }
        } else if (currentView === 'privacy' || (forceCheckCurrentView && currentView === 'privacy')) {
            const knownIdsString = [...lastKnownSongIdsPrivacy].sort().join(',');
            listNeedsRefresh = currentPageSongIdsString !== knownIdsString;
            currentListIsEmpty = uiElement.querySelector('#privacySongList')?.children.length === 0;
            if (listNeedsRefresh || (forceCheckCurrentView && currentListIsEmpty && songsOnPage.length > 0)) {
                logDebug("Page song list changed for Privacy Status. Reloading UI list.");
                populatePrivacySongList();
            }
        }
    }


    // --- Deletion Logic ---
    function getCurrentSongElements() { // Helper to get current song row elements on the page
        let listContainer = document.querySelector('div[data-sentry-component="InfiniteScroll"] > div.grow');
        if (!listContainer || listContainer.children.length === 0) {
            const allRiffRows = document.querySelectorAll('div[data-sentry-component="DraggableRiffRow"]');
            if (allRiffRows.length > 0 && allRiffRows[0].parentElement.childElementCount > 1) {
                 if (Array.from(allRiffRows[0].parentElement.children).every(child => child.getAttribute('data-sentry-component') === 'DraggableRiffRow' || child.tagName === 'HR')) {
                    listContainer = allRiffRows[0].parentElement;
                 }
            }
        }
        if(listContainer) {
             return listContainer.querySelectorAll(':scope > div[data-sentry-component="DraggableRiffRow"]');
        }
        return document.querySelectorAll('div[data-sentry-component="DraggableRiffRow"]');
    }


    async function deleteSelectedSongs() {
        if (isMinimized) { log("Restore UI to delete.", "warn"); return; }
        if (currentView !== 'selective') { log("Selective delete only in Selective View.", "warn"); return; }
        if (isDeleting || isDownloading || isChangingPrivacy) { log("Operation in progress.", "warn"); return; }

        const songIdsToDeleteArray = Array.from(selectedSongIdsDelete);
        const totalToDelete = songIdsToDeleteArray.length;

        if (totalToDelete === 0) {
            updateCounter('delete', 0, 0); log('No songs selected for deletion.');
            updateStatusMessage('No songs selected or all selected are ignored.'); return;
        }

        isDeleting = true; setAllButtonsDisabled(true);
        log(`Starting deletion for ${totalToDelete} selected: [${songIdsToDeleteArray.join(', ')}]`);
        updateCounter('delete', 0, totalToDelete); updateStatusMessage(`Deleting ${totalToDelete} selected...`);

        let deletedCount = 0, criticalErrorOccurred = false;
        for (const songId of songIdsToDeleteArray) {
            if (criticalErrorOccurred || !isDeleting) { break; }
            const songElement = Array.from(getCurrentSongElements()).find(el => {
                const link = el.querySelector(`a[href="/song/${songId}"]`);
                return !!link;
            });
            if (!songElement) {
                log(`Song ID ${songId} not found (deleted?). Removing from selection.`, "warn");
                selectedSongIdsDelete.delete(songId); continue;
            }
            const title = getSongDataFromPage().find(s => s.id === songId)?.title || `song ID ${songId}`;
            const success = await processSingleAction(songElement, 'delete', songId);
            if (success) {
                deletedCount++; selectedSongIdsDelete.delete(songId);
                updateCounter('delete', deletedCount, totalToDelete); updateStatusMessage(`Deleted ${deletedCount}/${totalToDelete}...`);
            } else {
                log(`Failed to delete ${title}. Stopping.`, "error");
                updateStatusMessage(`Error deleting ${title}. Stopped.`); criticalErrorOccurred = true;
            }
            await delay(50);
        }
        log(`Selective deletion: ${deletedCount}/${totalToDelete} attempted.`);
        updateStatusMessage(criticalErrorOccurred ? `Deletion stopped. ${deletedCount} deleted.` : `Selected deletion complete. ${deletedCount} deleted.`);
        isDeleting = false; setAllButtonsDisabled(false); populateDeleteSongList();
    }

    function stopBulkDeletionByUser() {
        if (!isDeleting || currentView !== 'bulk') { return; }
        log("Bulk deletion stop by user."); updateStatusMessage("Stopping bulk deletion...");
        stopBulkDeletionSignal = true;
    }

     async function deleteAllSongsInLibrary() {
         if (isMinimized) { log("Restore UI to delete.", "warn"); return; }
         if (currentView !== 'bulk') { log("Bulk delete only in Bulk View.", "warn"); return; }
         if (isDownloading || isChangingPrivacy) { log("Another operation is in progress.", "warn"); return; }

         stopBulkDeletionSignal = false; isDeleting = true; setAllButtonsDisabled(true);
         const deleteAllBtn = uiElement.querySelector('#deleteAllButton'); // Scoped query
         if (deleteAllBtn) deleteAllBtn.textContent = "Stop Deletion";
         log("--- STARTING BULK LIBRARY DELETION ---"); updateStatusMessage("Starting full library deletion...");
         let totalDeleted = 0, emptyChecks = 0;
         while (isDeleting && !stopBulkDeletionSignal) {
             await delay(500);
             if (stopBulkDeletionSignal) { isDeleting = false; break; }

             const currentElements = getCurrentSongElements();
             let currentSize = currentElements.length;
             if (currentSize === 0) {
                 emptyChecks++;
                 if (emptyChecks >= MAX_EMPTY_CHECKS) { log("No songs after retries. Assuming empty."); isDeleting = false; break; }
                 updateStatusMessage(`No songs. Re-checking (${emptyChecks}/${MAX_EMPTY_CHECKS})...`); await delay(EMPTY_RETRY_DELAY); continue;
             }
             emptyChecks = 0; let batchDeleted = 0;

             for (const firstElement of currentElements) { // Iterate over a static list for this batch
                 if (!isDeleting || stopBulkDeletionSignal) { isDeleting = false; break; }

                 if (!firstElement || !firstElement.parentNode) { continue; }
                 const title = (firstElement.querySelector('a[href^="/song/"] h4, [data-sentry-element="RiffTitle"], div[class*="truncate"]') || {textContent: 'Top song'}).textContent.trim();
                 updateStatusMessage(`Deleting ${title} (${totalDeleted + batchDeleted + 1} total...)`);
                 const success = await processSingleAction(firstElement, 'delete', `Bulk ${totalDeleted + batchDeleted + 1}`);
                 if (success) {
                     batchDeleted++;
                     await delay(DELETION_DELAY / 2);
                 } else {
                     log(`Failed to delete ${title}. Stopping.`, "error"); updateStatusMessage(`Error deleting ${title}.`); isDeleting = false; break;
                 }
                 await delay(50);
             }
             totalDeleted += batchDeleted;
             if (isDeleting && !stopBulkDeletionSignal) updateStatusMessage(`Batch done. Total: ${totalDeleted}. Checking more...`);
         }
         if (deleteAllBtn) deleteAllBtn.textContent = "Delete Entire Library";
         let finalMsg = stopBulkDeletionSignal ? `Stopped by user. Total: ${totalDeleted}.`
                       : (emptyChecks >= MAX_EMPTY_CHECKS ? `Complete. No more songs. Total: ${totalDeleted}.`
                       : `Finished. Total: ${totalDeleted}.`);
         log(`--- BULK DELETION FINISHED --- ${finalMsg}`); updateStatusMessage(finalMsg);
         isDeleting = false; stopBulkDeletionSignal = false; setAllButtonsDisabled(false);
     }

    // --- Download Logic ---
    async function startDownloadQueue() {
        if (!uiElement || isMinimized) { log("Restore UI to download.", "warn"); return; }
        if (currentView !== 'download') { log("Download only in Download View.", "warn"); return; }
        if (isDeleting || isDownloading || isChangingPrivacy) { log("Operation in progress.", "warn"); return; }

        const songIdsToDownloadArray = Array.from(selectedSongIdsDownload);
        const totalSongsToDownload = songIdsToDownloadArray.length;
        if (totalSongsToDownload === 0) { updateCounter('download', 0, 0); log('No songs selected.'); updateStatusMessage('No songs selected.'); return; }
        const selectedFormats = [];
        if (uiElement.querySelector('#formatMP3')?.checked) selectedFormats.push('MP3'); // Scoped query
        if (uiElement.querySelector('#formatM4A')?.checked) selectedFormats.push('M4A'); // Scoped query
        if (uiElement.querySelector('#formatWAV')?.checked) selectedFormats.push('WAV'); // Scoped query
        if (selectedFormats.length === 0) { log('No formats selected.', 'error'); updateStatusMessage('Select download format(s).'); return; }

        isDownloading = true; setAllButtonsDisabled(true);
        const interSongDelayMs = downloadInterSongDelaySeconds * 1000, intraFormatDelayMs = downloadIntraFormatDelaySeconds * 1000;
        log(`Starting download: ${totalSongsToDownload} songs. Formats: [${selectedFormats.join(', ')}]`);
        updateCounter('download', 0, totalSongsToDownload); updateStatusMessage(`Downloading ${totalSongsToDownload} (${selectedFormats.join('/')})...`);
        let songsProcessedCount = 0, criticalErrorOccurred = false;

        for (const songId of songIdsToDownloadArray) {
            if (criticalErrorOccurred || !isDownloading) { break; }
            const songElement = Array.from(getCurrentSongElements()).find(el => {
                const link = el.querySelector(`a[href="/song/${songId}"]`);
                return !!link;
            });
            if (!songElement) { log(`Song ID ${songId} not found. Skipping.`, "warn"); selectedSongIdsDownload.delete(songId); continue; }
            const title = getSongDataFromPage().find(s => s.id === songId)?.title || `song ID ${songId}`;
            let songDownloadSuccessThisSong = false, formatIndex = 0;
            for (const format of selectedFormats) {
                if (!isDownloading) { criticalErrorOccurred = true; break; }
                const currentSongElCheck = Array.from(getCurrentSongElements()).find(el => {
                    const link = el.querySelector(`a[href="/song/${songId}"]`);
                    return !!link;
                });
                 if (!currentSongElCheck) { logWarn(`${title} disappeared. Skipping formats.`); criticalErrorOccurred = true; break; }
                 updateStatusMessage(`DL ${songsProcessedCount + 1}/${totalSongsToDownload}: ${title} (${format})...`);
                 const success = await processSingleAction(currentSongElCheck, 'download', `${songId}-${format}`, format);
                 if (success) {
                     songDownloadSuccessThisSong = true; formatIndex++;
                     if (formatIndex < selectedFormats.length && isDownloading && intraFormatDelayMs > 0) await delay(intraFormatDelayMs);
                     else if (isDownloading && intraFormatDelayMs <= 0 && formatIndex < selectedFormats.length) await delay(50);
                 } else {
                     log(`Failed DL ${title} (${format}). Stopping.`, "error"); updateStatusMessage(`Error DL ${title} (${format}).`); criticalErrorOccurred = true; break;
                 }
            }
            if (songDownloadSuccessThisSong) songsProcessedCount++;
            if (criticalErrorOccurred || !isDownloading) break;
            if (songsProcessedCount < totalSongsToDownload && isDownloading && (songIdsToDownloadArray.indexOf(songId) < songIdsToDownloadArray.length -1) ) {
                 updateStatusMessage(`Wait ${downloadInterSongDelaySeconds}s for next song...`); await delay(interSongDelayMs);
            }
        }
        log(`DL queue finished. Processed ${songsProcessedCount}/${totalSongsToDownload}.`);
        updateStatusMessage(criticalErrorOccurred ? `DL stopped. ${songsProcessedCount} processed.` : `DL queue complete. ${songsProcessedCount} processed.`);
        isDownloading = false; setAllButtonsDisabled(false); populateDownloadSongList();
    }

    async function changeSelectedSongsPrivacy() {
        if (!uiElement || isMinimized) { log("Restore UI to change privacy.", "warn"); return; }
        if (currentView !== 'privacy') { log("Privacy change only in Privacy View.", "warn"); return; }
        if (isDeleting || isDownloading || isChangingPrivacy) { log("Operation in progress.", "warn"); return; }

        const songIdsToChangeArray = Array.from(selectedSongIdsPrivacy);
        const totalToChange = songIdsToChangeArray.length;
        if (totalToChange === 0) {
            updateCounter('privacy', 0, 0); log('No songs selected for privacy change.');
            updateStatusMessage('No songs selected.'); return;
        }

        const privacyLevelSelect = uiElement.querySelector('#privacyLevelSelect'); // Scoped query
        const targetPrivacyKey = privacyLevelSelect ? privacyLevelSelect.value : "Only Me";
        const targetSubMenuText = privacySubmenuTextMap[targetPrivacyKey]; // Get exact submenu text

        isChangingPrivacy = true; stopPrivacyChangeSignal = false; setAllButtonsDisabled(true);
        const interSongDelayMs = privacyInterSongDelaySeconds * 1000;
        log(`Starting privacy change for ${totalToChange} songs to '${targetPrivacyKey}'.`);
        updateCounter('privacy', 0, totalToChange); updateStatusMessage(`Updating ${totalToChange} songs to ${targetPrivacyKey}...`);

        let changedCount = 0, criticalErrorOccurred = false;
        for (const songId of songIdsToChangeArray) {
            if (criticalErrorOccurred || !isChangingPrivacy || stopPrivacyChangeSignal) { break; }
            const songElement = Array.from(getCurrentSongElements()).find(el => {
                const link = el.querySelector(`a[href="/song/${songId}"]`);
                return !!link;
            });
            if (!songElement) {
                log(`Song ID ${songId} not found (possibly removed?). Skipping.`, "warn");
                selectedSongIdsPrivacy.delete(songId);
                continue;
            }
            const title = getSongDataFromPage().find(s => s.id === songId)?.title || `song ID ${songId}`;
            updateStatusMessage(`Updating ${changedCount + 1}/${totalToChange}: ${title} to ${targetPrivacyKey}...`);

            const success = await processSinglePrivacyChange(songElement, targetSubMenuText, songId);
            if (success) {
                changedCount++;
                updateCounter('privacy', changedCount, totalToChange);
            } else {
                log(`Failed to change privacy for ${title}. Stopping.`, "error");
                updateStatusMessage(`Error for ${title}. Stopped.`);
                criticalErrorOccurred = true;
            }
            if (isChangingPrivacy && !stopPrivacyChangeSignal && !criticalErrorOccurred && (songIdsToChangeArray.indexOf(songId) < songIdsToChangeArray.length - 1)) {
                 if (interSongDelayMs > 0) {
                    updateStatusMessage(`Waiting ${privacyInterSongDelaySeconds}s for next song...`);
                    await delay(interSongDelayMs);
                 } else {
                    await delay(50);
                 }
            }
        }
        const finalMessage = criticalErrorOccurred ? `Privacy change stopped. ${changedCount} updated.`
                           : stopPrivacyChangeSignal ? `Privacy change stopped by user. ${changedCount} updated.`
                           : `Privacy change complete. ${changedCount} updated.`;
        log(finalMessage);
        updateStatusMessage(finalMessage);
        isChangingPrivacy = false; stopPrivacyChangeSignal = false; setAllButtonsDisabled(false);
        populatePrivacySongList();
    }


    async function processSinglePrivacyChange(songElement, targetSubMenuText, identifier, retryCount = 0) {
        const logPrefix = `(Privacy - ${identifier}) -`;
        if (!isChangingPrivacy || stopPrivacyChangeSignal) { log(`${logPrefix} Op cancelled.`, "warn"); return false; }
        if (!songElement || !songElement.parentNode) { log(`${logPrefix} Element gone.`, "warn"); return false; }

        const menuButton = songElement.querySelector('button[data-sentry-element="MenuTrigger"]');
        if (!menuButton) { log(`${logPrefix} No MenuTrigger.`, "error"); return false; }

        logDebug(`${logPrefix} Clicking 'More options' button:`, menuButton);
        if (!simulateClick(menuButton)) { log(`${logPrefix} Fail click MenuTrigger.`, "error"); return false; }
        await delay(PRIVACY_MENU_OPEN_DELAY);

        let menuContentElement = null;
        let popperWrapper = document.querySelector(`div[data-radix-popper-content-wrapper][style*="transform: translate"]`);
        if (popperWrapper) menuContentElement = popperWrapper.querySelector('div[data-radix-menu-content][data-state="open"]');
        if (!menuContentElement) {
             const openMenus = document.querySelectorAll('div[data-radix-menu-content][data-state="open"]');
             if (openMenus.length > 0) menuContentElement = openMenus[openMenus.length - 1];
        }
        if (!menuContentElement) {
            if (retryCount < MAX_RETRIES) {
                 logWarn(`${logPrefix} No open menu content. Retrying (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
                 try { document.body.click(); await delay(150); } catch(e){}
                 return processSinglePrivacyChange(songElement, targetSubMenuText, identifier, retryCount + 1);
            }
            log(`${logPrefix} No open menu content after retries.`, "error");
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        let privacyMainMenuItem = Array.from(menuContentElement.querySelectorAll('div[role="menuitem"]')).find(el => {
            const mainDiv = el.querySelector('div.flex.items-center.gap-4');
            if (!mainDiv) return false;
            const hasEyeIcon = mainDiv.querySelector('svg[data-icon="eye"]');
            // Extract text directly from mainDiv, excluding sub-texts like current privacy status
            let mainText = "";
            mainDiv.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) mainText += node.textContent.trim() + " ";
                else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('overflow-hidden')) { // Common container for main text
                    mainText += node.textContent.trim() + " ";
                }
            });
            mainText = mainText.trim();
            return hasEyeIcon && mainText === "Privacy";
        });
        if (!privacyMainMenuItem) { // Fallback using data-sentry-source-file as it was specific
            privacyMainMenuItem = menuContentElement.querySelector('div[role="menuitem"][data-sentry-source-file="PrivacySubMenu.tsx"]');
             if (privacyMainMenuItem) logDebug(`${logPrefix} Found Privacy item by data-sentry-source-file`);
        }

        if (!privacyMainMenuItem) {
            if (retryCount < MAX_RETRIES) {
                logWarn(`${logPrefix} 'Privacy' option not found in menu (Attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying...`);
                try { document.body.click(); await delay(150); } catch(e){}
                if (!songElement?.parentNode) { logWarn(`${logPrefix} Song element disappeared before retry for 'Privacy'.`); return false; }
                return processSinglePrivacyChange(songElement, targetSubMenuText, identifier, retryCount + 1);
            }
            log(`${logPrefix} 'Privacy' option not found after ${MAX_RETRIES} retries. Menu HTML:`, menuContentElement.innerHTML.substring(0, 700) + '...');
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        const privacySubMenuId = privacyMainMenuItem.getAttribute('aria-controls');
        logDebug(`${logPrefix} Clicking 'Privacy' menu item (controls: ${privacySubMenuId || 'N/A'}):`, privacyMainMenuItem);
        if (!simulateClick(privacyMainMenuItem)) {
            log(`${logPrefix} Failed to simulate click on 'Privacy' option.`, "error");
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }
        await delay(PRIVACY_SUBMENU_TRIGGER_CLICK_DELAY);

        let subMenuContent = null, subMenuOpenRetries = 0;
        while ((isChangingPrivacy && !stopPrivacyChangeSignal) && subMenuOpenRetries < MAX_SUB_MENU_OPEN_RETRIES) {
            await delay(PRIVACY_SUBMENU_OPEN_DELAY);
            if (privacySubMenuId) subMenuContent = document.getElementById(privacySubMenuId);

            if (subMenuContent?.getAttribute('data-state') === 'open') {
                logDebug(`${logPrefix} Privacy sub-menu (ID: ${privacySubMenuId}) found by ID and open.`);
                break;
            } else {
                const allPoppers = Array.from(document.querySelectorAll(`div[data-radix-popper-content-wrapper][style*="transform: translate"]`));
                let foundSubMenu = null;
                allPoppers.some(p => {
                     const sm = p.querySelector(`div[data-radix-menu-content][data-state="open"][data-sentry-component="MenuSubContent"]`);
                     if (sm && (!privacySubMenuId || sm.id === privacySubMenuId)) {
                         foundSubMenu = sm;
                         logDebug(`${logPrefix} Found privacy sub-menu in popper (ID: ${sm.id}).`);
                         return true;
                     }
                     return false;
                });
                if (foundSubMenu) { subMenuContent = foundSubMenu; break; }
            }
            subMenuOpenRetries++;
            if (subMenuOpenRetries > 1 && privacyMainMenuItem?.offsetParent !== null && privacyMainMenuItem.getAttribute('data-state') === 'closed' && privacyMainMenuItem.getAttribute('aria-expanded') === 'false') {
                 logWarn(`${logPrefix} Submenu not opening. Re-clicking 'Privacy'. Attempt ${subMenuOpenRetries}.`);
                 if(!simulateClick(privacyMainMenuItem)) { logWarn("Re-click 'Privacy' for submenu failed."); break;}
                 await delay(PRIVACY_SUBMENU_TRIGGER_CLICK_DELAY);
             }
        }

        if (!isChangingPrivacy || stopPrivacyChangeSignal) { log(`${logPrefix} Op cancelled while waiting for sub-menu.`, "warn"); return false; }
        if (!subMenuContent || subMenuContent.getAttribute('data-state') !== 'open') {
            log(`${logPrefix} Privacy sub-menu (ID: ${privacySubMenuId || 'unknown'}) did not open. Aborting.`, "error");
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        logDebug(`${logPrefix} Open sub-menu. Searching for option '${targetSubMenuText}'.`);
        const potentialItems = subMenuContent.querySelectorAll(':scope > div[role="menuitem"]');
        let targetItem = Array.from(potentialItems).find(el => {
            const textDiv = el.querySelector('.line-clamp-2');
            const itemText = textDiv ? textDiv.textContent.trim() : el.textContent.trim();
            let iconMatch = false;
            if (targetSubMenuText === "Only me" && el.querySelector('svg[data-icon="lock"]')) iconMatch = true;
            else if (targetSubMenuText === "Anyone with the link" && el.querySelector('svg[data-icon="link-simple"]')) iconMatch = true;
            else if (targetSubMenuText === "Publish" && el.querySelector('svg[data-icon="earth-americas"]')) iconMatch = true;
            return itemText === targetSubMenuText && iconMatch && el.offsetParent !== null;
        });

        if (!targetItem && retryCount < MAX_RETRIES) {
            logWarn(`${logPrefix} Target privacy option '${targetSubMenuText}' not in sub-menu (Attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying sub-menu check...`);
             // This is a soft retry, just re-evaluating the existing submenu content after a small delay
            await delay(PRIVACY_SUBMENU_OPEN_DELAY / 2);
            if (subMenuContent?.getAttribute('data-state') === 'open') {
                 const potentialItemsAgain = subMenuContent.querySelectorAll(':scope > div[role="menuitem"]');
                 targetItem = Array.from(potentialItemsAgain).find(el => {
                     const textDiv = el.querySelector('.line-clamp-2');
                     const itemText = textDiv ? textDiv.textContent.trim() : el.textContent.trim();
                     let iconMatch = false;
                     if (targetSubMenuText === "Only me" && el.querySelector('svg[data-icon="lock"]')) iconMatch = true;
                     else if (targetSubMenuText === "Anyone with the link" && el.querySelector('svg[data-icon="link-simple"]')) iconMatch = true;
                     else if (targetSubMenuText === "Publish" && el.querySelector('svg[data-icon="earth-americas"]')) iconMatch = true;
                     return itemText === targetSubMenuText && iconMatch && el.offsetParent !== null;
                 });
                if (targetItem) logDebug(`${logPrefix} Found target privacy option '${targetSubMenuText}' after re-check.`);
            } else { log(`${logPrefix} Sub-menu closed unexpectedly during re-check.`, 'error'); return false; }
        }

        if (!targetItem) {
            log(`${logPrefix} Target privacy option '${targetSubMenuText}' not found. Submenu HTML:`, subMenuContent.innerHTML.substring(0, 700) + '...');
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        logDebug(`${logPrefix} Clicking target privacy option '${targetSubMenuText}':`, targetItem);
        if (!simulateClick(targetItem)) {
            log(`${logPrefix} Failed to click target privacy option '${targetSubMenuText}'.`, "error");
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }
        await delay(PRIVACY_ACTION_CLICK_DELAY);
        logDebug(`--- Finished processing ${logPrefix} (Privacy change to '${targetSubMenuText}' assumed initiated) ---`);
        return true;
    }

    async function processSingleAction(songElement, actionType, identifier, format = null, retryCount = 0) {
        const logPrefix = `(${actionType} - ${identifier}) -`;
        if ((actionType === 'delete' && (!isDeleting || stopBulkDeletionSignal)) ||
            (actionType === 'download' && !isDownloading)) {
            log(`${logPrefix} Op cancelled.`, "warn"); return false;
        }
        if (isChangingPrivacy) { log(`${logPrefix} Privacy change in progress, ${actionType} op paused.`, "warn"); return false;}


        if (!songElement || !songElement.parentNode) { log(`${logPrefix} Element gone.`, "warn"); return actionType === 'delete'; }

        const menuButton = songElement.querySelector('button[data-sentry-element="MenuTrigger"]');
        if (!menuButton) { log(`${logPrefix} No MenuTrigger.`, "error"); return false; }

        logDebug(`${logPrefix} Clicking 'More options' button:`, menuButton);
        if (!simulateClick(menuButton)) { log(`${logPrefix} Fail click MenuTrigger.`, "error"); return false; }
        await delay(DROPDOWN_DELAY);

        let primaryActionText = actionType === 'delete' ? 'delete' : 'download';
        let primaryActionItem = null, downloadMenuItemId = null, menuContentElement = null;

        let popperWrapper = document.querySelector(`div[data-radix-popper-content-wrapper][style*="transform: translate"]`);
        if (popperWrapper) menuContentElement = popperWrapper.querySelector('div[data-radix-menu-content][data-state="open"]');

        if (!menuContentElement) {
             const openMenus = document.querySelectorAll('div[data-radix-menu-content][data-state="open"]');
             if (openMenus.length > 0) menuContentElement = openMenus[openMenus.length - 1];
        }

        if (!menuContentElement) {
            if (retryCount < MAX_RETRIES) {
                 logWarn(`${logPrefix} No open menu content. Retrying (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
                 try { document.body.click(); await delay(150); } catch(e){}
                 return processSingleAction(songElement, actionType, identifier, format, retryCount + 1);
            }
            log(`${logPrefix} No open menu content after retries.`, "error");
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        primaryActionItem = Array.from(menuContentElement.querySelectorAll(':scope > [role="menuitem"], :scope > [data-radix-collection-item]')).find(el => {
            const isVisible = el.offsetParent !== null;
            if (!isVisible) return false;
            let itemText = '';
            const lineClampDiv = el.querySelector('.line-clamp-2'); // Common for primary text
            if (lineClampDiv) {
                itemText = lineClampDiv.textContent.trim().toLowerCase();
            } else { // Fallback if no .line-clamp-2
                const mainContentContainer = el.querySelector('.flex.items-center.gap-4 > .overflow-hidden:not(:has(svg))'); // Div that holds text, not icon
                if (mainContentContainer) {
                     itemText = mainContentContainer.textContent.trim().toLowerCase();
                } else { // Broader fallback
                     itemText = el.textContent.trim().toLowerCase();
                     // Clean up potential extra text for items like Privacy that show current status
                     if (itemText.startsWith("privacy ")) itemText = "privacy";
                     if (itemText.startsWith("download ")) itemText = "download";
                }
            }
            logDebug(`${logPrefix} Checking menu item, text: '${itemText}' vs target: '${primaryActionText}'`);
            if (itemText === primaryActionText) {
                 if (primaryActionText === 'download') {
                     downloadMenuItemId = el.getAttribute('aria-controls');
                     logDebug(`${logPrefix} Found '${primaryActionText}' item, controls submenu: ${downloadMenuItemId || 'N/A'}`);
                 } else {
                     logDebug(`${logPrefix} Found '${primaryActionText}' item`);
                 }
                 return true;
            }
            return false;
        });


        if (!primaryActionItem && retryCount < MAX_RETRIES) {
            logWarn(`${logPrefix} '${primaryActionText}' option not found in menu (Attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying...`);
            try { document.body.click(); await delay(150); } catch(e){}
            if (!songElement?.parentNode) {
                logWarn(`${logPrefix} Song element disappeared before retry for '${primaryActionText}'.`);
                return (actionType === 'delete');
            }
            return processSingleAction(songElement, actionType, identifier, format, retryCount + 1);
        }

        if (!primaryActionItem) {
            log(`${logPrefix} '${primaryActionText}' option not found after ${MAX_RETRIES} retries. Aborting. Menu HTML:`, menuContentElement.innerHTML.substring(0, 700) + '...');
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        logDebug(`${logPrefix} Clicking primary action '${primaryActionText}' (controls: ${primaryActionItem.getAttribute('aria-controls') || 'N/A'}):`, primaryActionItem);
        if (!simulateClick(primaryActionItem)) {
            log(`${logPrefix} Failed to simulate click on '${primaryActionText}' option.`, "error");
            try { document.body.click(); await delay(50); } catch(e){} return false;
        }

        if (actionType === 'delete') {
            await delay(DELETION_DELAY);
            logDebug(`--- Finished processing ${logPrefix} (Delete action assumed successful) ---`);
            return true;
        }
        else if (actionType === 'download') {
            if (!downloadMenuItemId) {
                log(`${logPrefix} No submenu ID for Download. Aborting format ${format}.`, "error");
                try { document.body.click(); await delay(50); } catch(e){} return false;
            }
            let subMenuContent = null, subMenuOpenRetries = 0;
            while (isDownloading && subMenuOpenRetries < MAX_SUB_MENU_OPEN_RETRIES) {
                await delay(DOWNLOAD_MENU_DELAY);
                if (downloadMenuItemId) subMenuContent = document.getElementById(downloadMenuItemId);

                if (subMenuContent?.getAttribute('data-state') === 'open') {
                    logDebug(`${logPrefix} Download sub-menu (ID: ${downloadMenuItemId}) found by ID and open.`);
                    break;
                } else {
                    const allPoppers = Array.from(document.querySelectorAll(`div[data-radix-popper-content-wrapper][style*="transform: translate"]`));
                    let foundInPopper = false;
                    allPoppers.some(p => {
                        const sm = p.querySelector(`div[data-radix-menu-content][data-state="open"]` + (downloadMenuItemId ? `[id="${downloadMenuItemId}"]` : `[data-sentry-component="MenuSubContent"]`));
                        if (sm) {
                            subMenuContent = sm;
                            logDebug(`${logPrefix} Found download sub-menu in popper (ID: ${sm.id}).`);
                            foundInPopper = true;
                        }
                        return foundInPopper;
                    });
                    if (foundInPopper) break;
                }
                subMenuOpenRetries++;
                if (subMenuOpenRetries > 1 && primaryActionItem?.offsetParent !== null && primaryActionItem.getAttribute('data-state') === 'closed' && primaryActionItem.getAttribute('aria-expanded') === 'false') {
                     logWarn(`${logPrefix} Submenu not opening. Re-clicking 'Download'. Attempt ${subMenuOpenRetries}.`);
                     if(!simulateClick(primaryActionItem)) { logWarn("Re-click download for submenu failed."); break;}
                     await delay(DOWNLOAD_MENU_DELAY / 2);
                 }
            }

            if (!isDownloading) { log(`${logPrefix} Download cancelled while waiting for sub-menu.`, "warn"); return false; }
            if (!subMenuContent || subMenuContent.getAttribute('data-state') !== 'open') {
                log(`${logPrefix} Download sub-menu (ID: ${downloadMenuItemId || 'unknown'}) did not open. Aborting format ${format}.`, "error");
                try { document.body.click(); await delay(50); } catch(e){} return false;
            }

            let formatItem = null; const formatTextUpper = format.toUpperCase();
            logDebug(`${logPrefix} Open sub-menu. Searching for format '${formatTextUpper}'.`);
            const potentialFormatItems = subMenuContent.querySelectorAll(':scope > [role="menuitem"], :scope > [data-radix-collection-item]');
            formatItem = Array.from(potentialFormatItems).find(el => {
                const textDiv = el.querySelector('.line-clamp-2');
                const itemText = textDiv ? textDiv.textContent.trim().toUpperCase() : el.textContent.trim().toUpperCase();
                return itemText === formatTextUpper && el.offsetParent !== null && !el.querySelector('svg[data-icon="angle-right"]');
            });

            if (!formatItem && retryCount < MAX_RETRIES) { // Soft retry for format item
                logWarn(`${logPrefix} Format '${formatTextUpper}' not in sub-menu (Attempt ${retryCount +1}/${MAX_RETRIES}). Re-checking...`);
                await delay(DOWNLOAD_MENU_DELAY / 2);
                if (subMenuContent?.getAttribute('data-state') === 'open') {
                    const potentialFormatItemsAgain = subMenuContent.querySelectorAll(':scope > [role="menuitem"], :scope > [data-radix-collection-item]');
                    formatItem = Array.from(potentialFormatItemsAgain).find(el => {
                        const textDiv = el.querySelector('.line-clamp-2');
                        const itemText = textDiv ? textDiv.textContent.trim().toUpperCase() : el.textContent.trim().toUpperCase();
                        return itemText === formatTextUpper && el.offsetParent !== null && !el.querySelector('svg[data-icon="angle-right"]');
                    });
                    if (formatItem) logDebug(`${logPrefix} Found format '${formatTextUpper}' after re-check.`);
                } else { log(`${logPrefix} Sub-menu closed unexpectedly.`, 'error'); return false; }
            }
            if (!formatItem) { log(`${logPrefix} Format '${formatTextUpper}' not found. Submenu:`, subMenuContent.innerHTML.substring(0,700)); return false; }

            logDebug(`${logPrefix} Clicking format '${formatTextUpper}' option:`, formatItem);
            if (!simulateClick(formatItem)) { log(`${logPrefix} Failed click format '${formatTextUpper}'.`, "error"); return false; }
            await delay(DOWNLOAD_ACTION_DELAY);
            logDebug(`--- Finished processing ${logPrefix} (Format ${format} assumed initiated) ---`);
            return true;
        }
        return false;
    }

    function setAllButtonsDisabled(disabled) {
        if (!uiElement) return;
        if (isMinimized && disabled) { return; }

        const buttons = uiElement.querySelectorAll('#riffControlContent button');
        buttons.forEach(btn => {
            if (btn.id === 'minimizeButton') return;
            if (btn.id === 'deleteAllButton' && currentView === 'bulk' && isDeleting && disabled) {
                btn.disabled = false; // Keep stop button enabled
            }
            // Add similar logic for a stopPrivacyChangeButton if it exists
            else {
                btn.disabled = disabled;
            }
        });
        const inputs = uiElement.querySelectorAll('#riffControlContent input, #riffControlContent select');
        inputs.forEach(input => {
             if (input.type === 'checkbox' && (input.id === 'autoReloadToggle' || input.id === 'debugToggleCheckbox' || input.id.startsWith('format') || input.id === 'ignoreLikedToggleDelete')) {
                 input.disabled = false; // Always enable these specific checkboxes
             } else if (input.id.includes('DelayInput') || input.id === 'privacyLevelSelect') {
                 input.disabled = false; // Always enable delay inputs and privacy select
             }
             else input.disabled = disabled;
         });

        const labels = uiElement.querySelectorAll('#riffControlContent label.settings-checkbox-label, #riffControlContent label.selectAllContainer, #riffControlContent .downloadFormatContainer > label.settings-checkbox-label, #riffControlContent .downloadDelayContainer label.settings-checkbox-label, #riffControlContent .privacySettingsContainer label.settings-checkbox-label');
         labels.forEach(label => {
             const forActiveStop = label.htmlFor === 'deleteAllButton' && currentView === 'bulk' && isDeleting && disabled;
             const isAlwaysInteractive = label.closest('#commonSettingsFooter') ||
                                      label.closest('.downloadFormatContainer') ||
                                      label.closest('.downloadDelayContainer') ||
                                      label.closest('.privacySettingsContainer') ||
                                      label.htmlFor === 'ignoreLikedToggleDelete';

             if (forActiveStop || isAlwaysInteractive) {
                 label.style.cursor = 'pointer'; label.style.opacity = '1';
             }
             else { label.style.cursor = disabled ? 'not-allowed' : 'pointer'; label.style.opacity = disabled ? '0.7' : '1'; }
         });

        const songListCheckboxes = uiElement.querySelectorAll('.songListContainer input[type="checkbox"]');
        songListCheckboxes.forEach(cb => {
            if (cb.closest('label.ignored')) { // Ignored checkboxes in delete list
                 cb.disabled = true;
            } else {
                 cb.disabled = disabled;
            }
        });


        if (!disabled) {
            if(currentView === 'selective' && uiElement.querySelector('#selectiveModeControls')?.style.display === 'block') populateDeleteSongListIfNeeded();
            if(currentView === 'download' && uiElement.querySelector('#downloadQueueControls')?.style.display === 'block') populateDownloadSongListIfNeeded();
            if(currentView === 'privacy' && uiElement.querySelector('#privacyStatusControls')?.style.display === 'block') populatePrivacySongListIfNeeded();
        }
        const status = uiElement.querySelector('#statusMessage');
        if (status) {
             const allowPointerEvents = (!disabled) || (currentView === 'bulk' && isDeleting && disabled);
             status.style.pointerEvents = allowPointerEvents ? 'auto' : 'none';
        }
        logDebug(`Controls ${disabled ? 'mostly disabled' : 'enabled'}.`);
    }


    // --- Initialization ---
    function waitForAppReady(callback) {
        const checkInterval = 500, maxWaitTime = 20000; let elapsedTime = 0;
        const intervalId = setInterval(() => {
            elapsedTime += checkInterval;
            const appReadyElement = document.querySelector('div#__next main, div#__next nav, div#__next header'); // Check for main app structure
            if (appReadyElement) {
                clearInterval(intervalId); setTimeout(callback, 300); // Wait a bit more for full render
            } else if (elapsedTime >= maxWaitTime) {
                clearInterval(intervalId); logWarn("Riffusion app not fully detected. Initializing anyway."); setTimeout(callback, 300);
            }
        }, checkInterval);
    }

    function init() {
        try {
            log(`Riffusion Multitool Script Loaded (v${GM_info.script.version}).`);
            createMainUI();
            log(`Initialized. UI is ${isMinimized ? 'minimized' : 'visible'}. Auto-reload: ${autoReloadEnabled}. Debug: ${debugMode}.`);
            if (isMinimized) updateStatusMessage("Ready. Click icon to expand.");
            logDebug("Initial debug log test post-UI creation.");
        } catch (e) {
            console.error("[RiffTool] Initialization failed:", e); alert("RiffTool Init Error: " + e.message);
        }
    }

    waitForAppReady(init);

})();