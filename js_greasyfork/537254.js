// ==UserScript==
// @name         Torn Bounty Monitor
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Bounty monitor for Torn.com
// @author       Mif
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537254/Torn%20Bounty%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/537254/Torn%20Bounty%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        console.log('Bounty Monitor userscript loaded!');
        // Inject CSS styles
        const css = `
            #torn-bounty-monitor {
                position: fixed !important;
                top: 60px !important;
                right: calc(100% - 350px) !important;
                left: 5px !important;
                min-width: 100px !important;
                min-height: 100px !important;
                max-height: 400px !important;
                resize: both !important;
                overflow: auto !important;
                font-family: Arial, Verdana, Helvetica, sans-serif !important;
                font-size: 13px !important;
                color: #fff !important;
                background: #222 !important;
                border: 1px solid #444 !important;
                box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
                border-radius: 8px !important;
                padding: 12px !important;
                z-index: 999999 !important;
                display: block !important;
                line-height: 1.2 !important;
            }
            #torn-bounty-monitor-header-container {
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent;
                padding: 4px 0;
                border-radius: 3px;
                margin-bottom: 4px;
            }
            #torn-bounty-monitor h3 {
                margin: 0;
                color: #bfc9d1;
                padding: 0;
                font-size: 13px;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-weight: bold;
                letter-spacing: 1px;
                background: transparent;
                border-bottom: none;
                text-shadow: none;
                transition: none;
                text-transform: capitalize;
            }
            #torn-bounty-monitor table {
                min-width: 100%;
                background: transparent;
                border-radius: 6px;
                overflow: hidden;
                table-layout: fixed;
            }
            #torn-bounty-monitor th, #torn-bounty-monitor td {
                background: #222;
                border: 1px solid #555;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-size: 13px;
                color: #fff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #torn-bounty-monitor th {
                background-color: #444;
                color: #fff;
                font-weight: bold;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #23282d;
            }
            #torn-bounty-monitor td {
                color: #bfc9d1;
            }
            #torn-bounty-monitor a {
                color: #6fc3ff;
                text-decoration: none;
                transition: color 0.2s;
            }
            #torn-bounty-monitor a:hover {
                color: #fff;
                text-decoration: none;
            }
            #torn-bounty-monitor .settings-button {
                background-color: #444 !important;
                color: #fff !important;
                border: none !important;
                padding: 4px 12px !important;
                cursor: pointer !important;
                margin-top: 0 !important; /* Remove top margin */
                border-radius: 3px !important;
                font-family: Arial, Verdana, Helvetica, sans-serif !important;
                font-size: 12px !important;
            }
            #torn-bounty-monitor .settings-button:hover {
                background-color: #555 !important; /* Slightly darker hover state */
                color: #fff !important;
            }
            #torn-bounty-settings {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                background-color: #23282d;
                border: 1px solid #23282d;
                color: #bfc9d1;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                z-index: 10001;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                display: none;
                border-radius: 8px;
            }
            #torn-bounty-settings h3 {
                margin-top: 0;
                color: #fff;
                border-bottom: 1px solid #23282d;
                padding-bottom: 5px;
                font-size: 13px;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-weight: bold;
                letter-spacing: 1px;
                background: transparent;
                border-bottom: none;
                text-shadow: none;
                transition: none;
                text-transform: capitalize;
            }
            #torn-bounty-monitor, #torn-bounty-settings {
                font-size: 12px;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                color: #bfc9d1;
                font-weight: normal;
                line-height: 1.2;
            }
            #torn-bounty-monitor table, #torn-bounty-monitor th, #torn-bounty-monitor td {
                font-size: 12px;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                color: #bfc9d1;
                font-weight: normal;
                line-height: 1.2;
            }
            #torn-bounty-settings label {
                display: block;
                margin-bottom: 5px;
                color: #bfc9d1;
            }
            #torn-bounty-settings input[type="text"] {
                width: calc(100% - 22px);
                padding: 10px;
                margin-bottom: 15px;
                background-color: #181c20;
                border: 1px solid #23282d;
                color: #bfc9d1;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-size: 12px;
            }
            #torn-bounty-settings input[type="number"] {
                width: calc(100% - 22px);
                padding: 10px;
                margin-bottom: 15px;
                background-color: #181c20;
                border: 1px solid #23282d;
                color: #bfc9d1;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-size: 12px;
            }
            #torn-bounty-settings .buttons {
                text-align: right;
            }
            #torn-bounty-settings .buttons button {
                background-color: #23282d;
                color: #bfc9d1;
                border: 1px solid #23282d;
                padding: 5px 10px;
                cursor: pointer;
                margin-left: 10px;
                border-radius: 4px;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-size: 12px;
            }
            #torn-bounty-settings .buttons button:hover {
                background-color: #2e353b;
                color: #fff;
            }
            #torn-bounty-monitor .refresh-bounty-button,
            #torn-bounty-monitor .assign-bounty-button,
            #torn-bounty-monitor .remove-player-button {
                background-color: transparent;
                color: #bfc9d1;
                border: none;
                padding: 0;
                cursor: pointer;
                font-size: 0;
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0.8;
                transition: background 0.2s, opacity 0.2s;
            }
            #torn-bounty-monitor .refresh-bounty-button:hover,
            #torn-bounty-monitor .assign-bounty-button:hover,
            #torn-bounty-monitor .remove-player-button:hover {
                background-color: #2e353b;
                opacity: 1;
            }
            #torn-bounty-monitor .add-player-container {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            #torn-bounty-monitor #add-player-id-input {
                width: 50%;
                box-sizing: border-box;
                background: #181c20;
                border: 1px solid #23282d;
                color: #bfc9d1;
                font-family: Arial, Verdana, Helvetica, sans-serif;
                font-size: 12px;
                padding: 5px;
            }
            #torn-bounty-monitor #add-player-button {
                flex-shrink: 0;
                background: #23282d;
                border: 1px solid #23282d;
                color: #bfc9d1;
                border-radius: 4px;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, color 0.2s;
            }
            #torn-bounty-monitor #add-player-button:hover {
                background: #2e353b;
                color: #fff;
            }
            #torn-bounty-monitor .status-icon {
                width: 16px;
                height: 16px;
                display: inline-block;
                margin-right: 5px;
                vertical-align: middle;
            }
            #torn-bounty-monitor .status-ok {
                color: #4CAF50 !important;
            }
            #torn-bounty-monitor .status-hospital {
                color: #f44336 !important;
            }
            #torn-bounty-monitor .status-travel {
                color: #2196F3;
            }
            #torn-bounty-monitor .status-online {
                color: #4CAF50; /* Green */
                font-size: 1.2em; /* Make it slightly bigger */
            }
            #torn-bounty-monitor .status-idle {
                color: #FF9800; /* Orange */
                font-size: 1.2em;
            }
            #torn-bounty-monitor .status-offline {
                color: #9E9E9E; /* Grey */
                font-size: 1.2em;
            }
            #torn-bounty-monitor .online-status-icon {
                margin-right: 5px;
            }
            #torn-bounty-monitor thead th:first-child {
                width: 15px; /* Set a narrower width */
                min-width: 15px;
                text-indent: -9999px; /* Hide text content */
                overflow: hidden;
                padding: 0; /* Remove padding if any */
            }
            #torn-bounty-monitor td.online-status-cell {
                width: 15px; /* Set a narrower width */
                min-width: 15px;
                text-align: center; /* Center the icon */
                padding: 0; /* Remove padding */
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        // Create main monitor window
        const monitorDiv = document.createElement('div');
        monitorDiv.id = 'torn-bounty-monitor';
        monitorDiv.innerHTML = `
            <div id="torn-bounty-monitor-header-container">
                <h3 id="bounty-monitor-header" style="margin: 0;">Bounty Monitor</h3>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div>
                    <button class="refresh-all-button" id="refresh-all-button" style="margin-right: 8px; background-color: #444; color: #fff; border: none; padding: 4px 12px; border-radius: 3px; cursor: pointer; font-size: 12px;">Refresh All</button>
                    <button class="settings-button" id="open-settings-button">Settings</button>
                </div>
            </div>

            <div class="add-player-container" style="margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                <input type="text" id="add-player-id-input" placeholder="Enter player ID" style="padding: 5px; background-color: #222; border: 1px solid #555; color: #fff; flex-grow: 1;" autocomplete="off">
                <button id="add-player-button" class="assign-bounty-button" style="width: 30px; height: 30px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Character</th>
                        <th>Status</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Listed By</th>
                        <th>Refresh</th>
                        <th>Place</th>
                    </tr>
                </thead>
                <tbody id="bounty-table-body">
                    <!-- Bounty data will go here -->
                </tbody>
            </table>
        `;
        document.body.appendChild(monitorDiv);
        console.log('Monitor div appended!');

        // Create settings window
        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'torn-bounty-settings';
        settingsDiv.innerHTML = `
            <h3>Bounty Monitor Settings</h3>
            <label for="api-key">API Key (Public):</label>
            <input type="text" id="api-key" name="api-key">

            <label for="update-interval">Auto-update Interval (minutes):</label>
            <input type="number" id="update-interval" name="update-interval" value="5" min="1">

            <label for="show-header" style="display: flex; align-items: center; gap: 6px; margin-top: 10px;">
                <input type="checkbox" id="show-header" name="show-header"> Show header
            </label>

            <div class="buttons">
                <button id="save-settings-button">Save</button>
                <button id="close-settings-button">Cancel</button>
            </div>
        `;
        document.body.appendChild(settingsDiv);

        // --- Settings logic using localStorage ---
        function getSettings() {
            return {
                tornBountyMonitorApiKey: localStorage.getItem('tornBountyMonitorApiKey') || '',
                tornBountyMonitorPlayerIds: localStorage.getItem('tornBountyMonitorPlayerIds') || '',
                tornBountyMonitorUpdateInterval: parseInt(localStorage.getItem('tornBountyMonitorUpdateInterval')) || 5,
                tornBountyMonitorShowHeader: localStorage.getItem('tornBountyMonitorShowHeader') !== 'false',
            };
        }
        function setSettings(settings) {
            localStorage.setItem('tornBountyMonitorApiKey', settings.tornBountyMonitorApiKey);
            localStorage.setItem('tornBountyMonitorPlayerIds', settings.tornBountyMonitorPlayerIds);
            localStorage.setItem('tornBountyMonitorUpdateInterval', settings.tornBountyMonitorUpdateInterval);
            localStorage.setItem('tornBountyMonitorShowHeader', settings.tornBountyMonitorShowHeader);
        }
        function loadSettings() {
            const settings = getSettings();
            document.getElementById('api-key').value = settings.tornBountyMonitorApiKey;
            document.getElementById('update-interval').value = settings.tornBountyMonitorUpdateInterval;
            document.getElementById('show-header').checked = settings.tornBountyMonitorShowHeader;
        }
        function saveSettings() {
            const apiKey = document.getElementById('api-key').value;
            const updateInterval = document.getElementById('update-interval').value;
            const showHeader = document.getElementById('show-header').checked;
            setSettings({
                tornBountyMonitorApiKey: apiKey,
                tornBountyMonitorPlayerIds: getSettings().tornBountyMonitorPlayerIds,
                tornBountyMonitorUpdateInterval: parseInt(updateInterval),
                tornBountyMonitorShowHeader: showHeader
            });
            alert('Settings saved!');
            document.getElementById('torn-bounty-settings').style.display = 'none';
            applyHeaderVisibility();
            // TODO: restartMonitoring();
        }
        function applyHeaderVisibility() {
            const showHeader = getSettings().tornBountyMonitorShowHeader;
            const header = document.getElementById('bounty-monitor-header');
            if (header) header.style.display = showHeader ? '' : 'none';
        }

        // Settings open/close buttons
        const openSettingsButton = document.getElementById('open-settings-button');
        const settingsDivElement = document.getElementById('torn-bounty-settings');
        if (openSettingsButton) {
            openSettingsButton.addEventListener('click', () => {
                loadSettings();
                settingsDivElement.style.display = 'block';
            });
        }
        const closeSettingsButton = document.getElementById('close-settings-button');
        if (closeSettingsButton) {
            closeSettingsButton.addEventListener('click', () => {
                settingsDivElement.style.display = 'none';
            });
        }
        const saveSettingsButton = document.getElementById('save-settings-button');
        if (saveSettingsButton) {
            saveSettingsButton.addEventListener('click', () => {
                saveSettings();
            });
        }
        // Apply header visibility on load
        applyHeaderVisibility();

        // --- Monitoring logic ---
        let monitoringIntervalId = null;

        // --- SPA-навігація Torn ---
        function observeUrlChange(callback) {
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    callback();
                }
            }).observe(document, {subtree: true, childList: true});
            window.addEventListener('popstate', callback);
        }

        async function fetchBountiesForPlayer(playerId, apiKey) {
            const apiUrl = `https://api.torn.com/v2/user/${playerId}?selections=bounties,basic,profile&key=${apiKey}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (data.error) {
                    const tableBody = document.getElementById('bounty-table-body');
                    document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerId}"]`).forEach(row => row.remove());
                    const row = tableBody.insertRow();
                    row.setAttribute('data-player-id', playerId);
                    row.innerHTML = `<td colspan="8">API Error for ID ${playerId}: ${data.error.error}</td>`;
                    return;
                }
                const playerName = data.name || `ID: ${playerId}`;
                const tableBody = document.getElementById('bounty-table-body');

                // Remove existing rows for this player before adding updated ones
                document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerId}"]`).forEach(row => row.remove());

                const bounties = data.bounties ? Object.values(data.bounties) : [];

                // Group bounties by reward and lister
                const groupedBounties = {};
                bounties.forEach(bounty => {
                    const reward = bounty.reward !== undefined ? bounty.reward : 'N/A';
                    const listerId = bounty.lister_id || 'anon'; // Use 'anon' if lister_id is null
                    const key = `${reward}-${listerId}`;

                    if (!groupedBounties[key]) {
                        groupedBounties[key] = {
                            quantity: 0,
                            reward: bounty.reward,
                            lister_id: bounty.lister_id,
                            lister_name: bounty.lister_name // Store name for display
                        };
                    }
                    groupedBounties[key].quantity += bounty.quantity;
                });

                const groupedBountyList = Object.values(groupedBounties);
                const rowCount = Math.max(1, groupedBountyList.length); // At least one row even if no bounties

                if (groupedBountyList.length === 0) {
                    // Case: Player has no bounties
                    const row = tableBody.insertRow();
                    row.setAttribute('data-player-id', playerId);
                    row.innerHTML = `
                        <td rowspan="1" class="online-status-cell"></td>
                        <td rowspan="1">
                            <a href="https://www.torn.com/profiles.php?XID=${playerId}" style="margin-right: 5px;">${playerName}</a>
                            <button class="remove-player-button" data-player-id="${playerId}" style="vertical-align: middle; display: inline-block;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                            </button>
                        </td>
                        <td class="status-cell" rowspan="1"></td>
                        <td>0</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td rowspan="1">
                            <button class="refresh-bounty-button" data-player-id="${playerId}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.5M22 12.5a10 10 0 0 1-18.8 4.5"/>
                                </svg>
                            </button>
                        </td>
                        <td rowspan="1">
                            <button class="assign-bounty-button" data-player-id="${playerId}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="22" y1="12" x2="18" y2="12"/>
                                    <line x1="6" y1="12" x2="2" y2="12"/>
                                    <line x1="12" y1="6" x2="12" y2="2"/>
                                    <line x1="12" y1="22" x2="12" y2="18"/>
                                </svg>
                            </button>
                        </td>
                    `;
                } else {
                    // Case: Player has bounties (grouped)
                    groupedBountyList.forEach((groupedBounty, index) => {
                        const rewardDisplay = groupedBounty.reward !== undefined ? `$${groupedBounty.reward.toLocaleString()}` : 'N/A';
                        const quantityDisplay = groupedBounty.quantity !== undefined ? groupedBounty.quantity : 'N/A';
                        const listerId = groupedBounty.lister_id;
                        let listerNameDisplay;
                        if (groupedBounty.lister_name && listerId && listerId !== 'anon') {
                            listerNameDisplay = `<a href="https://www.torn.com/profiles.php?XID=${listerId}" style="margin-right: 5px;">${groupedBounty.lister_name}</a>`;
                        } else {
                            listerNameDisplay = 'Anon';
                        }

                        const row = tableBody.insertRow();
                        row.setAttribute('data-player-id', playerId);

                        if (index === 0) {
                            // First row for this player - add name, status, refresh, place with rowspan
                            row.innerHTML += `
                                <td rowspan="${rowCount}" class="online-status-cell"></td>
                                <td rowspan="${rowCount}">
                                    <a href="https://www.torn.com/profiles.php?XID=${playerId}" style="margin-right: 5px;">${playerName}</a>
                                    <button class="remove-player-button" data-player-id="${playerId}" style="vertical-align: middle; display: inline-block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            <line x1="10" y1="11" x2="10" y2="17"/>
                                            <line x1="14" y1="11" x2="14" y2="17"/>
                                        </svg>
                                    </button>
                                </td>
                                <td class="status-cell" rowspan="${rowCount}"></td>
                                <td>${quantityDisplay}</td>
                                <td>${rewardDisplay}</td>
                                <td>${listerNameDisplay}</td>
                                <td rowspan="${rowCount}">
                                    <button class="refresh-bounty-button" data-player-id="${playerId}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.5M22 12.5a10 10 0 0 1-18.8 4.5"/>
                                        </svg>
                                    </button>
                                </td>
                                <td rowspan="${rowCount}">
                                    <button class="assign-bounty-button" data-player-id="${playerId}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="22" y1="12" x2="18" y2="12"/>
                                            <line x1="6" y1="12" x2="2" y2="12"/>
                                            <line x1="12" y1="6" x2="12" y2="2"/>
                                            <line x1="12" y1="22" x2="12" y2="18"/>
                                        </svg>
                                    </button>
                                </td>
                            `;
                        } else {
                            // Subsequent rows for this player - only add bounty details
                            row.innerHTML += `
                                <td>${quantityDisplay}</td>
                                <td>${rewardDisplay}</td>
                                <td>${listerNameDisplay}</td>
                            `;
                        }
                    });
                }
                // Update main status cell (Hospital/Travel/OK)
                let mainStatusHtml = '';
                if (data.status && data.status.state) {
                    if (data.status.state === 'Okay') {
                        mainStatusHtml = '<span class="status-icon status-ok" title="OK">✓</span>';
                    } else if (data.status.state === 'Hospital') {
                        mainStatusHtml = '<span class="status-icon status-hospital" title="Hospital">+</span>';
                    } else if (data.status.state === 'Traveling') {
                        mainStatusHtml = '<span class="status-icon status-travel" title="Travel">🌍</span>';
                    } else if (data.status.state === 'Abroad') {
                        mainStatusHtml = '<span class="status-icon status-travel" title="Abroad">🧳</span>';
                    } else if (data.status.state.startsWith('In ')) {
                        mainStatusHtml = '<span class="status-icon status-travel" title="Abroad">🧳</span>';
                    } else {
                        mainStatusHtml = `<span class="status-icon" title="${data.status.state}">?</span>`;
                    }
                }
                const statusCells = document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerId}"] .status-cell`);
                statusCells.forEach(cell => cell.innerHTML = mainStatusHtml);

                // Update online status icon
                let onlineStatusHtml = '';
                if (data.last_action && data.last_action.status) {
                    const status = data.last_action.status;
                    if (status === 'Online') {
                        onlineStatusHtml = '<span class="online-status-icon status-online" title="Online">•</span>';
                    } else if (status === 'Idle') {
                        onlineStatusHtml = '<span class="online-status-icon status-idle" title="Idle">•</span>';
                    } else if (status === 'Offline') {
                         onlineStatusHtml = '<span class="online-status-icon status-offline" title="Offline">•</span>';
                    } else { // Handle other potential statuses like Hospital, Traveling etc.
                         onlineStatusHtml = '<span class="online-status-icon status-offline" title="Offline">•</span>'; // Default to offline for unknown
                    }
                } else { // Handle cases where last_action might be missing
                    onlineStatusHtml = '<span class="online-status-icon status-offline" title="Offline">•</span>';
                }
                const onlineStatusCells = document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerId}"] .online-status-cell`);
                 onlineStatusCells.forEach(cell => cell.innerHTML = onlineStatusHtml);

            } catch (e) {
                const tableBody = document.getElementById('bounty-table-body');
                document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerId}"]`).forEach(row => row.remove());
                const row = tableBody.insertRow();
                row.setAttribute('data-player-id', playerId);
                row.innerHTML = `<td colspan="8">API Request Error for ID ${playerId}.</td>`;
            }
        }

        function startMonitoring() {
            const settings = getSettings();
            const apiKey = settings.tornBountyMonitorApiKey;
            const playerIdsString = settings.tornBountyMonitorPlayerIds;
            const updateInterval = settings.tornBountyMonitorUpdateInterval || 5;
            if (!apiKey || !playerIdsString) {
                const tableBody = document.getElementById('bounty-table-body');
                tableBody.innerHTML = '<tr><td colspan="5">Please enter API Key and Player IDs in settings.</td></tr>';
                return;
            }
            const playerIds = playerIdsString.split(',').map(id => id.trim()).filter(id => id !== '');
            const tableBody = document.getElementById('bounty-table-body');
            tableBody.innerHTML = '';
            (async () => {
                for (const playerId of playerIds) {
                    await fetchBountiesForPlayer(playerId, apiKey);
                }
            })();
        }

        function restartMonitoring() {
            if (monitoringIntervalId !== null) {
                clearInterval(monitoringIntervalId);
                monitoringIntervalId = null;
            }
            const settings = getSettings();
            const updateInterval = settings.tornBountyMonitorUpdateInterval || 5;
            const intervalInMilliseconds = updateInterval * 60 * 1000;
            startMonitoring();
            if (intervalInMilliseconds > 0) {
                monitoringIntervalId = setInterval(startMonitoring, intervalInMilliseconds);
            }
        }

        // Refresh All button
        const refreshAllButton = document.getElementById('refresh-all-button');
        if (refreshAllButton) {
            refreshAllButton.addEventListener('click', () => {
                startMonitoring();
            });
        }

        // Manual refresh, assign, remove handlers
        monitorDiv.addEventListener('click', (event) => {
            const target = event.target;
            const refreshBtn = target.closest('.refresh-bounty-button');
            if (refreshBtn) {
                const playerId = refreshBtn.dataset.playerId;
                if (playerId) {
                    const settings = getSettings();
                    const apiKey = settings.tornBountyMonitorApiKey;
                    if (apiKey) {
                        document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerId}"]`).forEach(row => row.remove());
                        fetchBountiesForPlayer(playerId, apiKey);
                    } else {
                        alert("API Key not set. Please enter it in the settings.");
                    }
                }
                return;
            }
            const assignBtn = target.closest('.assign-bounty-button');
            if (assignBtn) {
                const playerId = assignBtn.dataset.playerId;
                if (playerId) {
                    const assignBountyUrl = `https://www.torn.com/bounties.php?p=add&XID=${playerId}`;
                    window.location.href = assignBountyUrl;
                }
                return;
            }
            const removeBtn = target.closest('.remove-player-button');
            if (removeBtn) {
                const playerIdToRemove = removeBtn.dataset.playerId;
                if (playerIdToRemove) {
                    const settings = getSettings();
                    const currentPlayerIdsString = settings.tornBountyMonitorPlayerIds || '';
                    const currentPlayerIds = currentPlayerIdsString.split(',').map(id => id.trim()).filter(id => id !== '' && id !== playerIdToRemove);
                    setSettings({
                        ...settings,
                        tornBountyMonitorPlayerIds: currentPlayerIds.join(',')
                    });
                    document.querySelectorAll(`#bounty-table-body tr[data-player-id="${playerIdToRemove}"]`).forEach(row => row.remove());
                }
                return;
            }
        });

        // Add player by ID
        const addPlayerButton = document.getElementById('add-player-button');
        const playerIdInput = document.getElementById('add-player-id-input');
        function addPlayerById() {
            const newPlayerId = playerIdInput.value.trim();
            if (newPlayerId) {
                if (!/^\d+$/.test(newPlayerId)) {
                    alert('Please enter a valid player ID (numbers only).');
                    return;
                }
                const settings = getSettings();
                const apiKey = settings.tornBountyMonitorApiKey;
                if (!apiKey) {
                    alert('Please set your API key in settings.');
                    return;
                }
                fetch(`https://api.torn.com/user/${newPlayerId}?selections=profile&key=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(`Error: ${data.error.error}`);
                            return;
                        }
                        if (!data.player_id) {
                            alert('Player not found.');
                            return;
                        }
                        const currentPlayerIdsString = settings.tornBountyMonitorPlayerIds || '';
                        const currentPlayerIds = currentPlayerIdsString.split(',').map(id => id.trim()).filter(id => id !== '');
                        if (!currentPlayerIds.includes(newPlayerId)) {
                            currentPlayerIds.push(newPlayerId);
                            setSettings({
                                ...settings,
                                tornBountyMonitorPlayerIds: currentPlayerIds.join(',')
                            });
                            fetchBountiesForPlayer(newPlayerId, apiKey);
                        } else {
                            alert('Player is already in the list.');
                        }
                        playerIdInput.value = '';
                    })
                    .catch(() => {
                        alert('Error checking player.');
                    });
            } else {
                alert('Please enter a player ID.');
            }
        }
        if (addPlayerButton) {
            addPlayerButton.addEventListener('click', addPlayerById);
        }
        if (playerIdInput) {
            playerIdInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    addPlayerById();
                }
            });
        }

        // Автоматичне оновлення при переході між сторінками (SPA)
        observeUrlChange(() => {
            restartMonitoring();
        });
        // Також оновлювати при першому завантаженні
        restartMonitoring();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})(); 