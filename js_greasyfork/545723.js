// ==UserScript==
// @name         WarScript - Player Attack Buttons 
// @namespace    http://tampermonkey.net/
// @version      3.7.5
// @description  Adds a player attack bar to the top of the page with a lock-on-scroll feature.
// @author       TobyFlenderson[474025]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      bigfatboys.com
// @downloadURL https://update.greasyfork.org/scripts/545723/WarScript%20-%20Player%20Attack%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/545723/WarScript%20-%20Player%20Attack%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG_MODE = true;

    const logDebug = (message, ...args) => {
        if (DEBUG_MODE) {
            console.log(`WarScript DEBUG: ${message}`, ...args);
        }
    };

    console.log("WarScript: Script starting (v3.7.4)...");
    const SETTINGS_KEY = 'torn_attack_settings';
    const API_KEY_STORAGE = 'torn_script_api_key';
    const FACTION_ID_STORAGE = 'torn_script_faction_id';
    const POLLING_RATE_STORAGE = 'torn_script_polling_rate';
    const LIVE_DATA_KEY = 'warscript_live_data';
    const HIDE_BAR_KEY = 'warscript_hide_bar';
    const LOCK_BAR_KEY = 'warscript_lock_bar';

    let factionPollingInterval = null;
    let individualPollingInterval = null;
    let statusTimers = {};

    // --- UTILITY FUNCTIONS ---
    function formatStats(total) {
        if (total === null || isNaN(total)) return '-';
        if (total >= 1_000_000_000) return `${(total / 1_000_000_000).toFixed(1)}b`;
        if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}m`;
        if (total >= 1_000) return `${(total / 1_000).toFixed(1)}k`;
        if (total > 0) return '<1k';
        return '-';
    }

    // --- STYLES ---
    GM_addStyle(`
        :root {
            --torn-dark-bg: #333;
            --torn-dark-bg-darker: #222;
            --torn-light-text: #ccc;
            --torn-border-color: #555;
            --torn-red: #990000;
            --torn-red-hover: #d40000;
            --torn-blue: #00698C;
            --torn-blue-hover: #008CBA;
            --torn-green: #4CAF50;
            --torn-green-hover: #5cb85c;
            --torn-orange: #E69500;
            --torn-orange-hover: #f0ad4e;
            --torn-grey: #777;
            --torn-grey-hover: #999;
            --status-online: #4baf50;
            --status-idle: #ff9800;
            --status-offline: #607d8b;
        }

        #script-bar-wrapper {
            width: 100%;
            background-color: var(--torn-dark-bg-darker);
            padding: 5px 0;
            border-bottom: 1px solid var(--torn-border-color);
        }

        #script-bar-wrapper.bar-locked {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 2147483646 !important;
        }

        #script-controls-container {
            max-width: 1080px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            gap: 10px;
        }

        #warscript-content-area {
            flex-grow: 1;
            display: flex;
            min-width: 0;
        }

        #attack-buttons-container,
        #status-icons-container {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            width: 100%;
        }

        #status-icons-container {
            display: none;
            min-height: 17px;
            gap: 5px;
        }

        .status-icon {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 1px solid #000;
            display: inline-block;
        }

        #script-main-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }

        .attack-button {
            color: white;
            border: 1px solid #000;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            text-shadow: 0px 1px 0px #000;
            transition: background 0.3s ease;
        }

        .attack-button.status-okay-online,
        .status-icon.status-okay-online { background-color: var(--status-online); }

        .attack-button.status-okay-idle,
        .status-icon.status-okay-idle { background-color: var(--status-idle); }

        .attack-button.status-okay-offline,
        .status-icon.status-okay-offline { background-color: var(--status-offline); }

        .attack-button.status-default,
        .status-icon.status-default { background-color: var(--torn-grey); }

        .attack-button.status-hospital.online-green { background-image: linear-gradient(to right, var(--status-online) 25%, var(--torn-red) 25%); }
        .status-icon.status-hospital.online-green { background-image: linear-gradient(to right, var(--status-online) 50%, var(--torn-red) 50%); }

        .attack-button.status-hospital.online-orange { background-image: linear-gradient(to right, var(--status-idle) 25%, var(--torn-red) 25%); }
        .status-icon.status-hospital.online-orange { background-image: linear-gradient(to right, var(--status-idle) 50%, var(--torn-red) 50%); }

        .attack-button.status-hospital.online-grey { background-image: linear-gradient(to right, var(--status-offline) 25%, var(--torn-red) 25%); }
        .status-icon.status-hospital.online-grey { background-image: linear-gradient(to right, var(--status-offline) 50%, var(--torn-red) 50%); }

        .attack-button.status-traveling.online-green { background-image: linear-gradient(to right, var(--status-online) 25%, var(--torn-blue) 25%); }
        .status-icon.status-traveling.online-green { background-image: linear-gradient(to right, var(--status-online) 50%, var(--torn-blue) 50%); }

        .attack-button.status-traveling.online-orange { background-image: linear-gradient(to right, var(--status-idle) 25%, var(--torn-blue) 25%); }
        .status-icon.status-traveling.online-orange { background-image: linear-gradient(to right, var(--status-idle) 50%, var(--torn-blue) 50%); }

        .attack-button.status-traveling.online-grey { background-image: linear-gradient(to right, var(--status-offline) 25%, var(--torn-blue) 25%); }
        .status-icon.status-traveling.online-grey { background-image: linear-gradient(to right, var(--status-offline) 50%, var(--torn-blue) 50%); }

        #settings-button, #toggle-bar-button {
            background: linear-gradient(to bottom, #555 5%, #333 100%);
            color: var(--torn-light-text);
            border: 1px solid #666;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        }

        #settings-button:hover, #toggle-bar-button:hover {
            background: linear-gradient(to bottom, #333 5%, #555 100%);
        }

        #settings-modal {
            display: none; position: fixed; z-index: 2147483647 !important;
            left: 0; top: 0; width: 100%; height: 100%;
            overflow: auto; background-color: rgba(0,0,0,0.7);
            font-family: var(--default-font, "Helvetica Neue",Helvetica,Arial,sans-serif);
        }

        #settings-modal-content {
            background-color: var(--torn-dark-bg);
            color: var(--torn-light-text);
            margin: 10% auto; padding: 20px; border: 1px solid var(--torn-border-color);
            border-radius: 5px; width: 80%; max-width: 600px; position: relative;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }

        #settings-modal-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--torn-border-color); padding-bottom: 10px; margin-bottom: 20px;
        }

        #settings-modal-header h2 { margin: 0; font-size: 24px; color: #fff; }

        .close-button {
            color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;
        }
        .close-button:hover, .close-button:focus { color: white; text-decoration: none; }

        #settings-rows { margin-bottom: 20px; max-height: 40vh; overflow-y: auto; }

        .settings-row, .settings-header-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 0; border-bottom: 1px solid #444;
            gap: 10px;
            position: relative;
        }

        .settings-row.dragging {
            opacity: 0.5;
            background: #444;
        }
        .drag-handle {
            display: none;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            cursor: move;
            color: #888;
            font-size: 20px;
            padding: 5px;
        }
        .reorder-active .drag-handle {
            display: inline-block;
        }
        .reorder-active .settings-row {
            padding-left: 20px;
        }
        #reorder-button.active {
             background: linear-gradient(to bottom, var(--torn-green-hover) 5%, var(--torn-green) 100%);
        }

        .settings-header-row { font-weight: bold; border-bottom: 2px solid var(--torn-border-color); }
        .settings-column { text-align: left; }
        .settings-column.profile-id { flex: 1.5; }
        .settings-column.username { flex: 2; }
        .settings-column.stats { flex: 1.5; text-align: right; }
        .settings-column.enabled { flex: 1; text-align: center; }
        .settings-column.delete { flex: 0.5; text-align: right; }

        /* ADDED: Styles for sortable headers */
        .settings-column.sortable {
            cursor: pointer;
            user-select: none;
        }
        .settings-column.sortable:hover {
            color: #fff;
        }
        .sort-arrow {
            display: inline-block;
            margin-left: 5px;
            color: #888;
            width: 1em; /* Reserve space */
        }
        .sort-arrow.asc::after {
            content: '▲';
        }
        .sort-arrow.desc::after {
            content: '▼';
        }

        .settings-column input[type="text"], #api-key-input, #faction-id-input, #polling-rate-input, #player-search-input {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--torn-border-color);
            border-radius: 4px;
            background-color: var(--torn-dark-bg-darker);
            color: var(--torn-light-text);
            font-size: 14px;
            box-sizing: border-box;
        }
        .settings-column input[type="text"]:disabled {
            background-color: #333;
            color: #888;
        }
        #api-key-input, #faction-id-input { width: 100%; margin-bottom: 15px; }

        #polling-rate-input { width: 70px; }

        .settings-column input[type="checkbox"] { width: 20px; height: 20px; }

        .delete-row-button {
            color: #aaa; font-size: 22px; font-weight: bold;
            cursor: pointer; padding: 0 10px;
        }
        .delete-row-button:hover { color: var(--torn-red-hover); }

        #settings-options-container {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 10px;
            gap: 20px;
        }

        #polling-rate-container, #lock-bar-container {
            display: flex;
            align-items: center;
        }

        #settings-modal-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
        }
        #settings-modal-footer-right {
             display: flex;
             gap: 10px;
             align-items: center;
        }


        .modal-footer-button, .modal-header-button {
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid #000;
            cursor: pointer;
            font-size: 16px;
            color: white;
            text-shadow: 0px 1px 0px #000;
        }
        .modal-footer-button:disabled {
            background: var(--torn-grey) !important;
            cursor: not-allowed;
        }
        .modal-header-button {
             padding: 5px 10px;
             font-size: 14px;
             margin-right: 15px;
        }

        #new-line-button { background: linear-gradient(to bottom, var(--torn-green-hover) 5%, var(--torn-green) 100%); }
        #clear-all-button, #delete-api-key-button { background: linear-gradient(to bottom, var(--torn-red-hover) 5%, var(--torn-red) 100%); }
        #save-settings-button, #save-api-key-button { background: linear-gradient(to bottom, var(--torn-blue-hover) 5%, var(--torn-blue) 100%); }
        #back-to-settings-from-api-button { background: linear-gradient(to bottom, var(--torn-grey-hover) 5%, var(--torn-grey) 100%); }
        #change-api-key-button, #disable-all-button { background: linear-gradient(to bottom, var(--torn-orange-hover) 5%, var(--torn-orange) 100%); }
        .modal-header-button { background: linear-gradient(to bottom, #555 5%, #333 100%); border-color: #666; color: var(--torn-light-text); }
        #faction-fetch-button { background: linear-gradient(to bottom, #6a00d4 5%, #5200a3 100%); }
        #api-key-status { font-style: italic; color: #aaa; margin-bottom: 15px; }
    `);

    async function fetchFromServer(endpoint, body = {}, extraHeaders = {}, method = "POST") {
        return new Promise(resolve => {
            const requestOptions = {
                method: method,
                url: `https://bigfatboys.com/api/${endpoint}`,
                headers: { "Content-Type": "application/json", ...extraHeaders },
                timeout: 15000,
                onload: response => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error) {
                            console.error(`Server Error for ${endpoint}: ${data.error}`);
                            resolve(null);
                        } else {
                            resolve(data);
                        }
                    } catch (e) {
                        console.error("Failed to parse server response.", e);
                        resolve(null);
                    }
                },
                onerror: error => {
                    console.error("GM_xmlhttpRequest error:", error);
                    resolve(null);
                },
                ontimeout: () => {
                    console.error(`GM_xmlhttpRequest timeout for endpoint: ${endpoint}`);
                    resolve(null);
                }
            };

            // Only attach data/body if it's NOT a GET request
            if (method !== "GET") {
                requestOptions.data = JSON.stringify(body);
            } else {
                // For GET requests, we usually don't send a body or Content-Type for JSON
                // unless the server specifically expects it.
                // We'll remove Content-Type if it was set by default for POST
                if (requestOptions.headers["Content-Type"] === "application/json") {
                    delete requestOptions.headers["Content-Type"];
                }
            }

            GM_xmlhttpRequest(requestOptions);
        });
    }


    function renderOrUpdateButtons(liveMembersData = null) {
        logDebug("renderOrUpdateButtons triggered.", liveMembersData ? `Data for ${Object.keys(liveMembersData).length} members received.` : "No live data.");
        const container = document.getElementById('attack-buttons-container');
        const iconContainer = document.getElementById('status-icons-container');
        if (!container || !iconContainer) return;

        let settings = JSON.parse(GM_getValue(SETTINGS_KEY, '[]'));

        container.innerHTML = '';
        iconContainer.innerHTML = '';

        settings.forEach(setting => {
            if (!setting.enabled || !setting.profileId) {
                return;
            }

            let button = document.createElement('a');
            button.id = `attack-button-${setting.profileId}`;
            button.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${setting.profileId}`;
            container.appendChild(button);

            let icon = document.createElement('a');
            icon.id = `status-icon-${setting.profileId}`;
            icon.href = button.href;
            icon.title = setting.name || setting.profileId;
            iconContainer.appendChild(icon);

            button.addEventListener('click', function(event) {
                event.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                const currentPageId = urlParams.get('user2ID');
                const buttonProfileId = this.id.replace('attack-button-', '');

                if (window.location.pathname.includes('loader.php') && urlParams.get('sid') === 'attack' && currentPageId === buttonProfileId) {
                    const startFightButton = document.querySelector('.dialogButtons___nX4Bz button.torn-btn');
                    if (startFightButton) startFightButton.click();
                } else {
                    window.location.href = this.href;
                }
            });

            const baseName = setting.name || setting.profileId;
            button.textContent = baseName;

            if (statusTimers[setting.profileId]) {
                clearInterval(statusTimers[setting.profileId]);
                delete statusTimers[setting.profileId];
            }

            const memberData = liveMembersData ? liveMembersData[setting.profileId] : null;

            let mainClass = 'status-default';
            let onlineIndicatorClass = '';

            if (memberData && memberData.status && memberData.last_action) {
                const state = memberData.status.state;
                const lastAction = memberData.last_action.status;

                const createTimer = (untilTimestamp) => {
                    const updateTimer = () => {
                        const now = Math.floor(Date.now() / 1000);
                        const remaining = untilTimestamp - now;
                        if (remaining > 60) {
                            button.textContent = `${baseName} (${Math.ceil(remaining / 60)}m)`;
                        } else if (remaining > 0) {
                            button.textContent = `${baseName} (${remaining}s)`;
                        } else {
                            button.textContent = baseName;
                            clearInterval(statusTimers[setting.profileId]);
                            delete statusTimers[setting.profileId];
                        }
                    };
                    updateTimer();
                    if (untilTimestamp > Math.floor(Date.now() / 1000)) {
                       statusTimers[setting.profileId] = setInterval(updateTimer, 1000);
                    }
                };

                if (state === 'Hospital') {
                    mainClass = 'status-hospital';
                    if (lastAction === 'Online') onlineIndicatorClass = 'online-green';
                    else if (lastAction === 'Idle') onlineIndicatorClass = 'online-orange';
                    else onlineIndicatorClass = 'online-grey';
                    createTimer(memberData.status.until);
                } else if (state === 'Traveling' || state === 'Abroad') {
                    mainClass = 'status-traveling';
                    if (lastAction === 'Online') onlineIndicatorClass = 'online-green';
                    else if (lastAction === 'Idle') onlineIndicatorClass = 'online-orange';
                    else onlineIndicatorClass = 'online-grey';
                    createTimer(memberData.status.until);
                } else if (state === 'Okay') {
                    if (lastAction === 'Online') mainClass = 'status-okay-online';
                    else if (lastAction === 'Idle') mainClass = 'status-okay-idle';
                    else mainClass = 'status-okay-offline';
                }
            }

            button.className = `attack-button ${mainClass} ${onlineIndicatorClass}`;
            icon.className = `status-icon ${mainClass} ${onlineIndicatorClass}`;
        });

        updateBodyPadding();
    }

    async function saveSettings() {
        const saveButton = document.getElementById('save-settings-button');
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        const pollingRateInput = document.getElementById('polling-rate-input');
        let pollingRate = parseInt(pollingRateInput.value, 10);
        if (isNaN(pollingRate) || pollingRate < 1 || pollingRate > 9999) {
            pollingRate = 15;
        }
        GM_setValue(POLLING_RATE_STORAGE, pollingRate);

        const lockBarCheckbox = document.getElementById('lock-bar-checkbox');
        GM_setValue(LOCK_BAR_KEY, lockBarCheckbox.checked);
        updateBarLockState();

        const apiKey = GM_getValue(API_KEY_STORAGE, null);
        const rows = document.querySelectorAll('#settings-rows .settings-row');

        const settingsPromises = Array.from(rows).map(async (row) => {
            const profileIdInput = row.querySelector('input.profile-id');
            const usernameInput = row.querySelector('input.username');
            const enabledCheckbox = row.querySelector('input.enabled');
            const source = row.dataset.source || 'manual';

            const profileId = profileIdInput ? profileIdInput.value.trim() : '';
            if (!profileId) return null;

            let name = usernameInput ? usernameInput.value : null;

            if (!name && apiKey) {
                // Individual lookup still uses POST
                let data = await fetchFromServer('individual', { apiKey: apiKey, id: profileId, selections: 'profile' });
                if (data) {
                    if (data.profile) data = data.profile;
                    name = data.name;
                }
            }

            return {
                profileId: profileId,
                name: name,
                enabled: enabledCheckbox ? enabledCheckbox.checked : false,
                source: source
            };
        });

        let newSettings = (await Promise.all(settingsPromises)).filter(s => s !== null);

        // Sort settings: enabled first, then disabled
        const enabledSettings = newSettings.filter(s => s.enabled);
        const disabledSettings = newSettings.filter(s => !s.enabled);
        const sortedSettings = [...enabledSettings, ...disabledSettings];

        GM_setValue(SETTINGS_KEY, JSON.stringify(sortedSettings));

        // --- FIX: STOP FACTION FETCH IF NO FACTION MEMBERS EXIST ---
        const hasFactionMembers = sortedSettings.some(s => s.source === 'faction');
        if (!hasFactionMembers) {
            GM_setValue(FACTION_ID_STORAGE, null);
            console.log("WarScript: No faction members in list. Background faction polling disabled.");
        }

        // --- FIX: PRUNE LIVE DATA CACHE ---
        let oldLiveData = {};
        try {
            oldLiveData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
        } catch (e) { oldLiveData = {}; }

        let cleanLiveData = {};

        // Only copy data for players that are still in our settings
        sortedSettings.forEach(setting => {
            if (oldLiveData[setting.profileId]) {
                cleanLiveData[setting.profileId] = oldLiveData[setting.profileId];
            }
        });

        // Save the cleaned, smaller object
        GM_setValue(LIVE_DATA_KEY, JSON.stringify(cleanLiveData));
        // -----------------------------------------------------------

        console.log("Settings saved:", sortedSettings);

        // Refresh data immediately
        await forcePollAndUpdate();

        // Reload UI to show correct sorting/stats
        loadSettings();
        startAllPolling();

        saveButton.disabled = false;
        saveButton.textContent = 'Save';
    }


    function createNewRow(data = {}, initialStats = '-') {
        const settingsRowsContainer = document.getElementById('settings-rows');
        if (!settingsRowsContainer) return;

        const headerRow = settingsRowsContainer.querySelector('.settings-header-row');
        if (!headerRow) return;

        const row = document.createElement('div');
        row.className = 'settings-row';
        row.dataset.source = data.source || 'manual';
        row.dataset.profileId = data.profileId || '';

        row.innerHTML = `
            <span class="drag-handle">&#9776;</span>
            <div class="settings-column profile-id"><input type="text" class="profile-id" placeholder="Enter Profile ID" value="${data.profileId || ''}"></div>
            <div class="settings-column username"><input type="text" class="username" placeholder="Username (auto)" value="${data.name || ''}" disabled></div>
            <div class="settings-column stats"><span class="stats-display">${initialStats}</span></div>
            <div class="settings-column enabled"><input type="checkbox" class="enabled" ${data.enabled ? 'checked' : ''}></div>
            <div class="settings-column delete"><span class="delete-row-button">&times;</span></div>
        `;
        row.querySelector('.delete-row-button').addEventListener('click', () => row.remove());

        const lastRow = settingsRowsContainer.querySelector('.settings-row:last-of-type');
        if (lastRow) {
             lastRow.insertAdjacentElement('afterend', row);
        } else {
             headerRow.insertAdjacentElement('afterend', row);
        }
    }

    function loadSettings() {
        let settings = [];
        try {
            settings = JSON.parse(GM_getValue(SETTINGS_KEY, '[]'));
        } catch(e) {
            console.error("WarScript: Failed to parse settings, starting with empty list.", e);
        }

        // Fetch live data to populate stats immediately
        let liveData = {};
        try {
            liveData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
        } catch (e) {
            liveData = {};
        }

        const settingsRowsContainer = document.getElementById('settings-rows');
        if (!settingsRowsContainer) return;

        settingsRowsContainer.querySelectorAll('.settings-row').forEach(row => row.remove());

        settings.forEach(setting => {
            let statsText = '-';
            if (liveData[setting.profileId] && liveData[setting.profileId].spy) {
                statsText = formatStats(liveData[setting.profileId].spy.total);
            }
            createNewRow(setting, statsText);
        });
    }

    async function forcePollAndUpdate() {
        const apiKey = GM_getValue(API_KEY_STORAGE, null);
        if (!apiKey) return;

        logDebug("Forcing an immediate poll of all data...");
        let liveData;
        try {
            liveData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
        } catch (e) {
            console.error("WarScript: Could not parse stored live data, starting fresh.", e);
            liveData = {};
        }

        const factionId = GM_getValue(FACTION_ID_STORAGE, null);

        if (factionId) {
            // NEW ENDPOINT: warmonitor-data/{factionId} with Cookie Auth, using GET
            const data = await fetchFromServer(`warmonitor-data/${factionId}?apiKey=${apiKey}`, null, {}, "GET");
            if (data && !data.error) {
                 // The response IS the object of members keyed by ID
                 liveData = { ...liveData, ...data };
            }
        }

        const allSettings = JSON.parse(GM_getValue(SETTINGS_KEY, '[]'));
        const monitoredPlayers = allSettings.filter(s => s.enabled && s.profileId && s.source === 'manual');
        for (const player of monitoredPlayers) {
            // Individual lookup still uses POST
            let data = await fetchFromServer('individual', { apiKey: apiKey, id: player.profileId, selections: 'profile,basic,spy' });
            if (data && data.profile) data = data.profile;

            if (data && data.name && data.last_action && data.status) {
                 liveData[player.profileId] = { ...data, name: data.name, last_action: { status: data.last_action.status }, status: data.status };
            }
        }

        GM_setValue(LIVE_DATA_KEY, JSON.stringify(liveData));
        renderOrUpdateButtons(liveData);
        logDebug("Forced poll complete.");
    }

    function startAllPolling() {
        stopAllPolling();

        const apiKey = GM_getValue(API_KEY_STORAGE, null);
        if (!apiKey) return;

        console.log("Starting polling loops for this tab.");
        logDebug("startAllPolling function initiated.");

        const factionId = GM_getValue(FACTION_ID_STORAGE, null);
        const pollingRate = parseInt(GM_getValue(POLLING_RATE_STORAGE, '15'), 10);

        const factionPoll = async () => {
            try {
                logDebug("Faction poll running...");
                if (!factionId) return;
                //warmonitor-data/{factionId} with api parameter
                const data = await fetchFromServer(`warmonitor-data/${factionId}?apiKey=${apiKey}`, null, {}, "GET");

                if (data && !data.error) {
                    // data contains the member objects keyed by ID directly
                    try {
                        const currentData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
                        const mergedData = {...currentData, ...data};
                        GM_setValue(LIVE_DATA_KEY, JSON.stringify(mergedData));
                        renderOrUpdateButtons(mergedData);
                        logDebug("Faction poll successful. Merged data.", mergedData);
                    } catch (e) {
                        console.error("WarScript: Error processing faction data.", e);
                    }
                } else {
                    logDebug("Faction poll ran, but no valid data returned or error.", data);
                }
            } catch (e) {
                console.error("WarScript: CRITICAL ERROR in factionPoll loop.", e);
            }
        };

        let monitoredPlayers = [];
        try {
            const allSettings = JSON.parse(GM_getValue(SETTINGS_KEY, '[]'));
            monitoredPlayers = allSettings.filter(s => s.enabled && s.profileId && s.source === 'manual');
        } catch (e) {
            console.error("WarScript: Could not parse settings for individual polling.", e);
            monitoredPlayers = [];
        }

        let playerIndex = 0;
        const individualPoll = async () => {
            try {
                if (!monitoredPlayers || monitoredPlayers.length === 0) return;
                logDebug("Individual poll running for player index:", playerIndex);
                if (playerIndex >= monitoredPlayers.length) playerIndex = 0;

                const player = monitoredPlayers[playerIndex];
                // Individual lookup still uses POST
                let data = await fetchFromServer('individual', { apiKey: apiKey, id: player.profileId, selections: 'profile,basic,spy' });

                if (data && data.profile) data = data.profile;

                if (data && data.name && data.last_action && data.status) {
                    try {
                        const currentData = JSON.parse(GM_getValue(LIVE_DATA_KEY, '{}'));
                        const updatedPlayerData = {
                            [player.profileId]: { ...data, name: data.name, last_action: { status: data.last_action.status }, status: data.status }
                        };
                        const mergedData = {...currentData, ...updatedPlayerData};
                        GM_setValue(LIVE_DATA_KEY, JSON.stringify(mergedData));
                        renderOrUpdateButtons(mergedData);
                        logDebug(`Individual poll successful for ${player.profileId}. Merged data.`, mergedData);
                    } catch (e) {
                        console.error("WarScript: Error processing individual player data.", e);
                    }
                } else {
                     logDebug(`Individual poll for ${player.profileId} ran, but returned invalid data object.`, data);
                }
                playerIndex++;
            } catch (e) {
                 console.error("WarScript: CRITICAL ERROR in individualPoll loop.", e);
            }
        };

        if (factionId) {
            logDebug("Faction polling is configured. Starting now.");
            factionPoll();
            factionPollingInterval = setInterval(factionPoll, pollingRate * 1000);
        } else {
             logDebug("Faction polling is NOT configured (no factionId).");
        }

        if (monitoredPlayers.length > 0) {
            logDebug(`Individual polling is configured for ${monitoredPlayers.length} players. Starting now.`);
            individualPoll();
            const individualIntervalMs = 30000 / Math.max(1, Math.min(monitoredPlayers.length, 4));
            individualPollingInterval = setInterval(individualPoll, individualIntervalMs);
        } else {
            logDebug("Individual polling is NOT configured (no manual players).");
        }
    }


    function stopAllPolling() {
        if (factionPollingInterval) clearInterval(factionPollingInterval);
        if (individualPollingInterval) clearInterval(individualPollingInterval);
        factionPollingInterval = null;
        individualPollingInterval = null;
        logDebug("Stopped all polling for this tab.");
    }

    function updateBarVisibility() {
        const isHidden = GM_getValue(HIDE_BAR_KEY, false);
        const attackButtonsContainer = document.getElementById('attack-buttons-container');
        const statusIconsContainer = document.getElementById('status-icons-container');
        const toggleBarButton = document.getElementById('toggle-bar-button');

        if (attackButtonsContainer && statusIconsContainer && toggleBarButton) {
            if (isHidden) {
                attackButtonsContainer.style.display = 'none';
                statusIconsContainer.style.display = 'flex';
                toggleBarButton.innerHTML = '&#9660;';
            } else {
                attackButtonsContainer.style.display = 'flex';
                statusIconsContainer.style.display = 'none';
                toggleBarButton.innerHTML = '&#9650;';
            }
        }
        updateBodyPadding();
    }

    function updateBodyPadding() {
        const wrapper = document.getElementById('script-bar-wrapper');
        if (wrapper && wrapper.classList.contains('bar-locked')) {
            const barHeight = wrapper.offsetHeight;
            document.body.style.paddingTop = `${barHeight}px`;
        } else {
            document.body.style.paddingTop = '';
        }
    }

    function updateBarLockState() {
        const isLocked = GM_getValue(LOCK_BAR_KEY, false);
        const wrapper = document.getElementById('script-bar-wrapper');
        if (wrapper) {
            if (isLocked) {
                wrapper.classList.add('bar-locked');
            } else {
                wrapper.classList.remove('bar-locked');
            }
            updateBodyPadding();
        }
    }

    function initializeUI() {
        const scriptBarWrapper = document.createElement('div');
        scriptBarWrapper.id = 'script-bar-wrapper';

        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'script-controls-container';

        const warscriptContentArea = document.createElement('div');
        warscriptContentArea.id = 'warscript-content-area';

        const attackButtonsContainer = document.createElement('div');
        attackButtonsContainer.id = 'attack-buttons-container';

        const statusIconsContainer = document.createElement('div');
        statusIconsContainer.id = 'status-icons-container';

        const mainControls = document.createElement('div');
        mainControls.id = 'script-main-controls';

        const toggleBarButton = document.createElement('button');
        toggleBarButton.id = 'toggle-bar-button';
        toggleBarButton.innerHTML = '&#9650;';

        const settingsButton = document.createElement('button');
        settingsButton.id = 'settings-button';
        settingsButton.innerHTML = '&#9881; Settings';

        mainControls.appendChild(toggleBarButton);
        mainControls.appendChild(settingsButton);

        warscriptContentArea.appendChild(attackButtonsContainer);
        warscriptContentArea.appendChild(statusIconsContainer);

        controlsContainer.appendChild(warscriptContentArea);
        controlsContainer.appendChild(mainControls);

        scriptBarWrapper.appendChild(controlsContainer);
        document.body.prepend(scriptBarWrapper);

        const modal = document.createElement('div');
        modal.id = 'settings-modal';

        modal.innerHTML = `
            <div id="settings-modal-content">
                <div id="api-key-view">
                    <div id="settings-modal-header"><h2>API Key Setup</h2></div>
                    <p>Please enter your Torn API key to use WarScript.</p>
                    <input type="text" id="api-key-input" placeholder="Your Torn API Key">
                    <div id="settings-modal-footer">
                         <div class="footer-button-row">
                            <button id="back-to-settings-from-api-button" class="modal-footer-button" style="display: none;">Back</button>
                            <button id="save-api-key-button" class="modal-footer-button">Save</button>
                         </div>
                    </div>
                </div>
                <div id="main-settings-view">
                    <div id="settings-modal-header">
                        <h2>Settings</h2>
                        <div>
                            <button id="reorder-button" class="modal-header-button">Reorder List</button>
                            <button id="show-api-management-button" class="modal-header-button">API Key Settings</button>
                            <span class="close-button">&times;</span>
                        </div>
                    </div>
                    <div id="profile-list-view">
                        <div id="search-container" style="margin-bottom: 10px;"> <input type="text" id="player-search-input" placeholder="Search by name or ID..."> </div>
                        <div id="settings-rows">
                            <div class="settings-header-row">
                                <div class="settings-column profile-id">Profile ID</div>
                                <div class="settings-column username sortable" data-sort="username">Username<span class="sort-arrow"></span></div>
                                <div class="settings-column stats sortable" data-sort="stats">Total Stats<span class="sort-arrow"></span></div>
                                <div class="settings-column enabled">Enabled</div>
                                <div class="settings-column delete"></div>
                            </div>
                        </div>
                        <div id="settings-options-container">
                             <div id="lock-bar-container">
                                <label for="lock-bar-checkbox" style="margin-right: 5px;">Lock bar on scroll:</label>
                                <input type="checkbox" id="lock-bar-checkbox">
                            </div>
                            <div id="polling-rate-container">
                                <label for="polling-rate-input" style="margin-right: 5px;">Faction Poll Rate (s):</label>
                                <input type="number" id="polling-rate-input" min="1" max="9999" value="15">
                            </div>
                        </div>
                        <div id="settings-modal-footer">
                            <div class="footer-button-row">
                                <button id="faction-fetch-button" class="modal-footer-button">Faction Fetch</button>
                                <button id="new-line-button" class="modal-footer-button">New Line</button>
                            </div>
                            <div class="footer-button-row">
                                <button id="disable-all-button" class="modal-footer-button">Disable All</button>
                                <button id="clear-all-button" class="modal-footer-button">Clear All</button>
                                <button id="save-settings-button" class="modal-footer-button">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="api-management-view">
                      <div id="settings-modal-header">
                        <h2>API Key Management</h2>
                        <button id="back-to-settings-from-mgmt-button" class="modal-header-button">Back to Settings</button>
                      </div>
                      <p id="api-key-status">Status: Not set</p>
                      <div id="settings-modal-footer">
                          <div class="footer-button-row">
                            <button id="change-api-key-button" class="modal-footer-button">Change Key</button>
                            <button id="delete-api-key-button" class="modal-footer-button">Delete Key</button>
                          </div>
                      </div>
                </div>
            </div>`;

        document.body.appendChild(modal);

        const apiKeyView = document.getElementById('api-key-view');
        const mainSettingsView = document.getElementById('main-settings-view');
        const apiManagementView = document.getElementById('api-management-view');
        const pollingRateInput = document.getElementById('polling-rate-input');
        const apiKeyStatus = document.getElementById('api-key-status');
        const backFromApiButton = document.getElementById('back-to-settings-from-api-button');
        const searchInput = document.getElementById('player-search-input');
        const lockBarCheckbox = document.getElementById('lock-bar-checkbox');
        const reorderButton = document.getElementById('reorder-button');

        let isReordering = false;
        let draggedItem = null;
        let currentSort = { column: null, direction: 'asc' };

        function parseStatValue(statString) {
            if (typeof statString !== 'string' || statString === '-') return -1;
            const lower = statString.toLowerCase();
            const num = parseFloat(lower);
            if (lower.includes('b')) return num * 1e9;
            if (lower.includes('m')) return num * 1e6;
            if (lower.includes('k')) return num * 1e3;
            return num;
        }

        const sortableHeaders = document.querySelectorAll('.settings-header-row .sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortColumn = header.dataset.sort;

                if (currentSort.column === sortColumn) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = sortColumn;
                    currentSort.direction = 'asc';
                }

                // Update header visuals
                sortableHeaders.forEach(h => {
                    const arrow = h.querySelector('.sort-arrow');
                    if (h === header) {
                        arrow.className = `sort-arrow ${currentSort.direction}`;
                    } else {
                        arrow.className = 'sort-arrow';
                    }
                });

                // Sort the rows
                const rowsContainer = document.getElementById('settings-rows');
                const rows = Array.from(rowsContainer.querySelectorAll('.settings-row'));

                rows.sort((rowA, rowB) => {
                    let valA, valB;

                    if (sortColumn === 'username') {
                        valA = rowA.querySelector('.username').value.toLowerCase();
                        valB = rowB.querySelector('.username').value.toLowerCase();
                    } else if (sortColumn === 'stats') {
                        valA = parseStatValue(rowA.querySelector('.stats-display').textContent);
                        valB = parseStatValue(rowB.querySelector('.stats-display').textContent);
                    }

                    let comparison = 0;
                    if (valA > valB) {
                        comparison = 1;
                    } else if (valA < valB) {
                        comparison = -1;
                    }

                    return currentSort.direction === 'asc' ? comparison : -comparison;
                });

                // Re-append rows in the new order
                rows.forEach(row => rowsContainer.appendChild(row));
            });
        });

        function handleDragStart(e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('dragging'), 0);
        }

        function handleDragEnd() {
            this.classList.remove('dragging');
            draggedItem = null;
        }

        function handleDragOver(e) {
            e.preventDefault();
            const container = document.getElementById('settings-rows');
            const afterElement = getDragAfterElement(container, e.clientY);
            if (draggedItem) {
                 if (afterElement == null) {
                    container.appendChild(draggedItem);
                } else {
                    container.insertBefore(draggedItem, afterElement);
                }
            }
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.settings-row:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        function toggleReordering() {
            isReordering = !isReordering;
            const container = document.getElementById('settings-rows');
            const rows = container.querySelectorAll('.settings-row');

            reorderButton.classList.toggle('active', isReordering);
            container.classList.toggle('reorder-active', isReordering);
            reorderButton.textContent = isReordering ? 'Lock Order' : 'Reorder List';

            rows.forEach(row => {
                if (isReordering) {
                    row.draggable = true;
                    row.addEventListener('dragstart', handleDragStart);
                    row.addEventListener('dragend', handleDragEnd);
                } else {
                    row.draggable = false;
                    row.removeEventListener('dragstart', handleDragStart);
                    row.removeEventListener('dragend', handleDragEnd);
                }
            });

            if (isReordering) {
                container.addEventListener('dragover', handleDragOver);
            } else {
                container.removeEventListener('dragover', handleDragOver);
            }
        }
        reorderButton.addEventListener('click', toggleReordering);

        function showView(viewToShow) {
            [apiKeyView, mainSettingsView, apiManagementView].forEach(v => v.style.display = 'none');
            viewToShow.style.display = 'block';
        }

        async function validateAndSaveApiKey(key) {
            const saveButton = document.getElementById('save-api-key-button');
            saveButton.disabled = true;
            saveButton.textContent = 'Validating...';

            const factionData = await fetchFromServer('getFaction', { RL_ApiKey: key });
            if (!factionData || !factionData.faction_id) {
                alert('Could not retrieve faction information. Please ensure your API key is valid and has user data access.');
                saveButton.disabled = false;
                saveButton.textContent = 'Save';
                return;
            }

            const accessData = await fetchFromServer('checkAccess', { factionId: factionData.faction_id });
            if (accessData && accessData.access === 1) {
                GM_setValue(API_KEY_STORAGE, key);
                alert('API Key validated and saved successfully!');
                showView(mainSettingsView);
                loadSettings();
            } else {
                alert('Access for your faction is not enabled. Please contact TobyFlenderson[474025] for assistance.');
            }

            saveButton.disabled = false;
            saveButton.textContent = 'Save';
        }


        settingsButton.onclick = () => {
            const apiKey = GM_getValue(API_KEY_STORAGE, null);
            if (apiKey) {
                pollingRateInput.value = GM_getValue(POLLING_RATE_STORAGE, '15');
                lockBarCheckbox.checked = GM_getValue(LOCK_BAR_KEY, false);
                showView(mainSettingsView);
                loadSettings();
                // Removed redundant stats population loop here, as loadSettings handles it now.
            } else {
                backFromApiButton.style.display = 'none';
                showView(apiKeyView);
            }
            modal.style.display = 'block';
        };

        toggleBarButton.onclick = () => {
            const isHidden = GM_getValue(HIDE_BAR_KEY, false);
            GM_setValue(HIDE_BAR_KEY, !isHidden);
            updateBarVisibility();
        };


        document.getElementById('save-api-key-button').onclick = () => {
            const keyInput = document.getElementById('api-key-input').value;
            if (keyInput && keyInput.trim() !== '') {
                validateAndSaveApiKey(keyInput.trim());
            } else {
                alert('Please enter a valid API key.');
            }
        };

        document.getElementById('show-api-management-button').onclick = () => {
             const key = GM_getValue(API_KEY_STORAGE, null);
             apiKeyStatus.textContent = key ? `Status: Key saved (ends in ...${key.slice(-4)})` : `Status: No API key set.`;
             showView(apiManagementView);
        };

        document.getElementById('change-api-key-button').onclick = () => {
            const key = GM_getValue(API_KEY_STORAGE, '');
            document.getElementById('api-key-input').value = key;
            backFromApiButton.style.display = 'inline-block';
            showView(apiKeyView);
        };

        document.getElementById('delete-api-key-button').onclick = () => {
            if (confirm('Are you sure you want to delete your API key? This will disable all monitoring features.')) {
                GM_setValue(API_KEY_STORAGE, null);
                GM_setValue(FACTION_ID_STORAGE, null);
                stopAllPolling();
                document.getElementById('attack-buttons-container').innerHTML = '';
                alert('API Key deleted.');
                showView(mainSettingsView);
            }
        };

        document.getElementById('faction-fetch-button').addEventListener('click', async () => {
            const apiKey = GM_getValue(API_KEY_STORAGE, null);
            if (!apiKey) {
                alert('An API key is required for this feature. Please add one first.');
                showView(apiKeyView);
                return;
            }
            const factionId = prompt("Enter Faction ID to fetch members from:");
            if (!factionId || isNaN(factionId)) {
                if(factionId) alert('Invalid Faction ID.');
                return;
            }

            const fetchButton = document.getElementById('faction-fetch-button');
            fetchButton.disabled = true;
            fetchButton.textContent = 'Fetching...';

            // NEW ENDPOINT CALL: warmonitor-data/{factionId} with Cookie Auth, using GET
            const data = await fetchFromServer(`warmonitor-data/${factionId}?apiKey=${apiKey}`, null, {}, "GET");

            if (data && !data.error) {
                // The new endpoint returns an object where keys are IDs.
                // We convert values to an array to iterate.
                const membersArray = Object.values(data);

                membersArray.forEach(member => {
                    let statsText = '-';
                    if (member.spy && member.spy.total) {
                        statsText = formatStats(member.spy.total);
                    }
                    createNewRow({ profileId: member.id, name: member.name, enabled: false, source: 'faction' }, statsText);
                });
                alert(`${membersArray.length} members have been added to the list. Remember to Save Settings.`);
                GM_setValue(FACTION_ID_STORAGE, factionId.trim());
            } else {
                alert('Failed to fetch faction data. Check ID or API Key.');
            }

            fetchButton.disabled = false;
            fetchButton.textContent = 'Faction Fetch';
        });

        document.getElementById('back-to-settings-from-api-button').onclick = () => showView(mainSettingsView);
        document.getElementById('back-to-settings-from-mgmt-button').onclick = () => showView(mainSettingsView);

        const closeModal = () => {
            if (isReordering) {
                toggleReordering();
            }
            modal.style.display = 'none';
        };

        mainSettingsView.querySelector('.close-button').onclick = closeModal;
        window.onclick = (event) => {
            if (event.target == modal) {
                closeModal();
            }
        };

        mainSettingsView.querySelector('#new-line-button').addEventListener('click', () => createNewRow({ enabled: true, source: 'manual' }));

        mainSettingsView.querySelector('#disable-all-button').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#settings-rows .settings-row input.enabled');
            checkboxes.forEach(cb => cb.checked = false);
        });

        mainSettingsView.querySelector('#clear-all-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all members and stop faction monitoring?')) {
                // Remove from UI
                modal.querySelectorAll('.settings-row').forEach(row => row.remove());

                // Remove from Storage IMMEDIATELY
                GM_setValue(FACTION_ID_STORAGE, null);
                GM_setValue(SETTINGS_KEY, '[]');
                GM_setValue(LIVE_DATA_KEY, '{}'); // Clear the cache blob

                // Stop loops and clear main bar
                stopAllPolling();
                document.getElementById('attack-buttons-container').innerHTML = '';
                document.getElementById('status-icons-container').innerHTML = '';

                alert('All members cleared and faction monitoring has been stopped.');
            }
        });

        mainSettingsView.querySelector('#save-settings-button').addEventListener('click', saveSettings);

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#settings-rows .settings-row');
            rows.forEach(row => {
                const profileIdInput = row.querySelector('input.profile-id');
                const usernameInput = row.querySelector('input.username');

                if (profileIdInput && usernameInput) {
                    const profileId = profileIdInput.value;
                    const username = usernameInput.value.toLowerCase();
                    const isVisible = profileId.includes(searchTerm) || username.includes(searchTerm);
                    row.style.display = isVisible ? 'flex' : 'none';
                }
            });
        });

        // --- SCRIPT INITIALIZATION ---
        window.addEventListener('resize', updateBodyPadding);

        async function runInitialValidation() {
            const apiKey = GM_getValue(API_KEY_STORAGE, null);
            const attackButtonsContainer = document.getElementById('attack-buttons-container');

            if (!apiKey) {
                if (attackButtonsContainer) attackButtonsContainer.innerHTML = '';
                return;
            }

            const factionData = await fetchFromServer('getFaction', { RL_ApiKey: apiKey });
            if (!factionData || !factionData.faction_id) {
                if (attackButtonsContainer) attackButtonsContainer.innerHTML = '';
                return;
            }

            const accessData = await fetchFromServer('checkAccess', { factionId: factionData.faction_id });
            if (accessData && accessData.access === 1) {
                console.log("WarScript: Access validated. Starting services.");
                await forcePollAndUpdate();
                startAllPolling();
            } else {
                console.error("WarScript: Faction access denied. Polling disabled.");
                alert('WarScript: Access for your faction is not enabled. Please contact TobyFlenderson[474025] for assistance.');
                GM_setValue(API_KEY_STORAGE, null);
                GM_setValue(FACTION_ID_STORAGE, null);
                stopAllPolling();
                if (attackButtonsContainer) attackButtonsContainer.innerHTML = '';
            }
        }

        const initialData = GM_getValue(LIVE_DATA_KEY, null);
        renderOrUpdateButtons(initialData ? JSON.parse(initialData) : null);
        updateBarVisibility();
        updateBarLockState();
        runInitialValidation();
    }

    const maxAttempts = 20;
    let attempts = 0;
    const waitForElementInterval = setInterval(() => {
        const targetElement = document.querySelector('#mainContainer');
        attempts++;
        if (targetElement) {
            clearInterval(waitForElementInterval);
            initializeUI();
        } else if (attempts > maxAttempts) {
            clearInterval(waitForElementInterval);
            console.error('Torn.com Settings Panel: Could not find target element after multiple attempts.');
        }
    }, 500);

})();