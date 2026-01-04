// ==UserScript==
// @name         -PopZ- Athena Battle System
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  -PopZ- Athena Battle System. To facilitate war targets and hits among members.
// @author       Jimskylark
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @connect      popz-athena.azurewebsites.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546931/-PopZ-%20Athena%20Battle%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/546931/-PopZ-%20Athena%20Battle%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // CONFIGURATION & STATE
    // =================================================================================
    const SCRIPT_PREFIX = 'PABS';
    const DATA_POLLING_INTERVAL_SECONDS = 5;
    const WAR_MODE_POLLING_INTERVAL_SECONDS = 10;
    const MAX_SELECTIONS = 10;
    const ADMIN_ROLE = "Techie";
    const ADMIN_ROLE_1 = "Leader";
    const ADMIN_ROLE_2 = "Co-leader";
    const ADMIN_ROLE_3 = "WarHawk";

    const GET_SELECTIONS_URL = "https://popz-athena.azurewebsites.net/api/getSelections?code=2_Q4yKpdtDtBuP3wfegvg1rggbClkDFyqVZ_dJn37jmmAzFuV-Dydg==";
    const UPDATE_SELECTION_URL = "https://popz-athena.azurewebsites.net/api/updateSelection?code=-0kYEETFR_4_yW5s9mTT3037yys2N8I5lTM3pUqrdB5uAzFujlqbQA==";
    const GET_WAR_MODE_URL = "https://popz-athena.azurewebsites.net/api/getWarMode?code=hq6CTDU9Ab_TbMrkuuYxVV4Cuz8bhv3_vh9DRIqp0kIsAzFu9y8ciw==";
    const UPDATE_WAR_MODE_URL = "https://popz-athena.azurewebsites.net/api/updateWarMode?code=MSdVgNt62LPkixH923tga7ZCfF3l4gZPm0G9uNPkDJkaAzFuqRbGIQ==";

    let mySelections = new Set();
    let dataPollingId = null;
    let warModePollingId = null;
    let countdownIntervalId = null;
    let currentEnemyFactionData = {};
    let currentSelectionsData = {};
    let scriptState = { apiKey: null, userName: null, userId: null, userFactionId: null, userFactionRole: null, enemyFactionId: null, isWarModeActive: false };
    let clickListenerAdded = false;
    let isRunning = false;

    // =================================================================================
    // STYLES (CSS)
    // =================================================================================
    GM_addStyle(`
        /* Main Container Styles */
        .${SCRIPT_PREFIX}-container {
            position: fixed; left: 0; width: 330px;
            background-color: #333; color: #ccc; border: 1px solid #555;
            border-top-right-radius: 10px; border-bottom-right-radius: 10px;
            z-index: 9998; transition: transform 0.3s ease-in-out, opacity 0.3s;
            display: flex; flex-direction: column; font-family: Arial, Helvetica, sans-serif;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }
        #${SCRIPT_PREFIX}-main-container { top: 140px; height: 45vh; }
        #${SCRIPT_PREFIX}-selections-container { top: calc(45vh + 150px); height: 25vh; }

        .${SCRIPT_PREFIX}-container.collapsed { transform: translateX(-330px); }
        .${SCRIPT_PREFIX}-toggle-handle {
            position: absolute; top: 50%; left: 100%; transform: translateY(-50%);
            width: 25px; height: 80px; background-color: #333;
            border: 1px solid #555; border-left: none; border-top-right-radius: 10px;
            border-bottom-right-radius: 10px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; font-size: 18px; color: #ccc;
        }
        .${SCRIPT_PREFIX}-header {
            padding: 10px; background-color: #222; border-bottom: 1px solid #555;
            text-align: center; font-weight: bold; font-size: 1.2em;
        }
        .${SCRIPT_PREFIX}-content-area { padding: 10px; flex-grow: 1; overflow-y: auto; }

        /* Target Item Styles */
        .${SCRIPT_PREFIX}-target-item { display: flex; align-items: center; justify-content: space-between; padding: 5px; border-bottom: 1px solid #444; font-size: 13px; }
        .${SCRIPT_PREFIX}-target-item a { color: #fff !important; text-decoration: none; }
        .${SCRIPT_PREFIX}-target-item a:hover { text-decoration: underline; }
        .${SCRIPT_PREFIX}-target-info { flex-grow: 1; }
        .${SCRIPT_PREFIX}-status-dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: middle; }
        .dot-green { background-color: #4CAF50; } .dot-gray { background-color: #9E9E9E; } .dot-goldenrod { background-color: goldenrod; }
        .${SCRIPT_PREFIX}-status-text { font-size: 11px; }
        .status-green { color: #81C784; } .status-red { color: #E57373; } .status-blue { color: #64B5F6; } .status-yellow { color: #FFF176; }
        .${SCRIPT_PREFIX}-selections-display { font-size: 10px; color: #FFD700; font-style: italic; padding-left: 18px; }

        /* Action Buttons */
        .${SCRIPT_PREFIX}-action-btn { background-color: #555; color: #fff; border: 1px solid #777; border-radius: 3px; padding: 4px 8px; cursor: pointer; font-size: 12px; margin-left: 5px; }
        .${SCRIPT_PREFIX}-action-btn:hover { background-color: #666; }
        .${SCRIPT_PREFIX}-action-btn:disabled { background-color: #444; color: #888; cursor: not-allowed; }
        .${SCRIPT_PREFIX}-attack-btn { background-color: #B71C1C; }
        .${SCRIPT_PREFIX}-attack-btn:hover { background-color: #D32F2F; }

        /* Admin Panel Styles */
        #${SCRIPT_PREFIX}-admin-panel {
            position: fixed; top: 60px; left: 0;
            background-color: #222; border: 1px solid #d4af37;
            border-top-right-radius: 8px; border-bottom-right-radius: 8px;
            padding: 8px 15px; z-index: 9999; display: flex; align-items: center; gap: 15px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
            transition: transform 0.3s ease-in-out;
        }
        #${SCRIPT_PREFIX}-admin-panel.collapsed { transform: translateX(-100%); }
        #${SCRIPT_PREFIX}-admin-panel label { font-weight: bold; color: #d4af37; }
        .switch { position: relative; display: inline-block; width: 60px; height: 34px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #4CAF50; }
        input:checked + .slider:before { transform: translateX(26px); }
    `);

    // =================================================================================
    // CORE FUNCTIONS
    // =================================================================================

    function promptForApiKey() {
        const currentKey = GM_getValue('apiKey', '');
        const newKey = prompt('Please enter your 16-character Torn API key:', currentKey);
        if (newKey === null) return;
        if (/^[A-Za-z0-9]{16}$/.test(newKey)) {
            GM_setValue('apiKey', newKey);
            alert('API Key saved successfully! The page will now reload.');
            window.location.reload();
        } else {
            alert('Invalid API Key format. Must be 16 alphanumeric characters.');
        }
    }

    const callApi = (url, method = 'GET', body = null) => {
        return new Promise((resolve, reject) => {
            if (!url || url.includes("PASTE_YOUR")) return reject("API URL is not configured.");
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: body ? JSON.stringify(body) : null,
                onload: res => (res.status >= 200 && res.status < 300) ? resolve(JSON.parse(res.responseText || '{}')) : reject(`API Error (${res.status}): ${res.responseText || 'No response'}`),
                onerror: res => reject(`Network error: ${res.statusText || 'Could not connect'}`)
            });
        });
    };

    function initializeUI() {
        if (document.getElementById(`${SCRIPT_PREFIX}-admin-placeholder`)) return;
        const adminPanelPlaceholder = document.createElement('div');
        adminPanelPlaceholder.id = `${SCRIPT_PREFIX}-admin-placeholder`;
        document.body.appendChild(adminPanelPlaceholder);
    }

    function createMainUI() {
        if (document.getElementById(`${SCRIPT_PREFIX}-main-container`)) return;

        const mainContainer = document.createElement('div');
        mainContainer.id = `${SCRIPT_PREFIX}-main-container`;
        mainContainer.className = `${SCRIPT_PREFIX}-container`;
        mainContainer.innerHTML = `<div class="${SCRIPT_PREFIX}-toggle-handle">&#9776;</div><div class="${SCRIPT_PREFIX}-header">-PopZ- Athena Battle System</div><div class="${SCRIPT_PREFIX}-content-area" id="${SCRIPT_PREFIX}-target-list-content"><p>Loading targets...</p></div>`;

        // ** PERSISTENCE FIX **: Check saved state on creation
        if (GM_getValue('mainCollapsed', false)) {
            mainContainer.classList.add('collapsed');
        }
        document.body.appendChild(mainContainer);

        const selectionsContainer = document.createElement('div');
        selectionsContainer.id = `${SCRIPT_PREFIX}-selections-container`;
        selectionsContainer.className = `${SCRIPT_PREFIX}-container`;
        selectionsContainer.innerHTML = `<div class="${SCRIPT_PREFIX}-toggle-handle">&#9776;</div><div class="${SCRIPT_PREFIX}-header">My Selections</div><div class="${SCRIPT_PREFIX}-content-area" id="${SCRIPT_PREFIX}-my-selections-content"><p>No targets selected.</p></div>`;

        // ** PERSISTENCE FIX **: Check saved state on creation
        if (GM_getValue('selectionsCollapsed', false)) {
            selectionsContainer.classList.add('collapsed');
        }
        document.body.appendChild(selectionsContainer);

        document.querySelectorAll(`.${SCRIPT_PREFIX}-toggle-handle`).forEach(handle => {
            handle.addEventListener('click', () => {
                const parent = handle.parentElement;
                const isCollapsed = parent.classList.toggle('collapsed');

                // ** PERSISTENCE FIX **: Save the state when the button is clicked
                if (parent.id === `${SCRIPT_PREFIX}-main-container`) {
                    GM_setValue('mainCollapsed', isCollapsed);
                } else if (parent.id === `${SCRIPT_PREFIX}-selections-container`) {
                    GM_setValue('selectionsCollapsed', isCollapsed);
                }
            });
        });
    }

    function destroyMainUI() {
        const mainUI = document.getElementById(`${SCRIPT_PREFIX}-main-container`);
        const selectionsUI = document.getElementById(`${SCRIPT_PREFIX}-selections-container`);
        if (mainUI) mainUI.remove();
        if (selectionsUI) selectionsUI.remove();
    }

    function createAdminUI(isWarModeOn) {
        const placeholder = document.getElementById(`${SCRIPT_PREFIX}-admin-placeholder`);
        if (!placeholder || document.getElementById(`${SCRIPT_PREFIX}-admin-panel`)) return;
        placeholder.innerHTML = `<div id="${SCRIPT_PREFIX}-admin-panel"><label for="war-mode-toggle">War Mode</label><label class="switch"><input type="checkbox" id="war-mode-toggle" ${isWarModeOn ? 'checked' : ''}><span class="slider"></span></label></div>`;

        document.getElementById('war-mode-toggle').addEventListener('change', async (event) => {
            const isEnabled = event.target.checked;
            try {
                await callApi(UPDATE_WAR_MODE_URL, 'POST', { factionId: scriptState.userFactionId, warModeEnabled: isEnabled });
                if (isEnabled && !scriptState.isWarModeActive) {
                    await startWarManager();
                } else if (!isEnabled && scriptState.isWarModeActive) {
                    stopWarManager();
                }
            } catch (error) {
                console.error("Failed to update War Mode:", error);
                alert("Error: Could not update War Mode status.");
                event.target.checked = !isEnabled;
            }
        });
    }

    function renderFullTargetList() {
        const members = currentEnemyFactionData;
        const selections = currentSelectionsData;
        const targetListContent = document.getElementById(`${SCRIPT_PREFIX}-target-list-content`);
        const mySelectionsContent = document.getElementById(`${SCRIPT_PREFIX}-my-selections-content`);
        if (!targetListContent || !mySelectionsContent || Object.keys(members).length === 0) return;

        const sortedMemberIds = Object.keys(members).sort((a, b) => members[a].name.localeCompare(members[b].name));
        let targetListHTML = '', mySelectionsHTML = '';

        for (const memberId of sortedMemberIds) {
            const member = members[memberId];
            let dotColor = 'gray';
            if (member.last_action.status === 'Online') dotColor = 'green';
            else if (member.last_action.status === 'Idle') dotColor = 'goldenrod';
            const selectionsHTML = (selections[memberId] && selections[memberId].length > 0) ? `<div class='PABS-selections-display'>Selected by: ${selections[memberId].join(', ')}</div>` : '';
            const isSelected = mySelections.has(memberId);

            const commonHTML = `<div class='PABS-target-info'><div><span class='PABS-status-dot dot-${dotColor}'></span><a href='https://www.torn.com/profiles.php?XID=${memberId}' target='_blank' rel='noopener'>${member.name} [${memberId}]</a></div><div class='PABS-status-text status-${member.status.color}' data-timestamp="${member.status.until}">${member.status.description}</div>${selectionsHTML}</div>`;
            targetListHTML += `<div class='PABS-target-item' data-user-id='${memberId}'>${commonHTML}<button class='${SCRIPT_PREFIX}-action-btn select-btn' data-user-id='${memberId}' ${isSelected || mySelections.size >= MAX_SELECTIONS ? 'disabled' : ''}>Select</button></div>`;
            if (isSelected) mySelectionsHTML += `<div class='PABS-target-item' data-user-id='${memberId}'>${commonHTML}<div><a href="https://www.torn.com/loader.php?sid=attack&user2ID=${memberId}" class="PABS-action-btn PABS-attack-btn" target="_blank">Attack</a><button class='${SCRIPT_PREFIX}-action-btn remove-btn' data-user-id='${memberId}'>Remove</button></div></div>`;
        }
        targetListContent.innerHTML = targetListHTML || "<p>No targets found.</p>";
        mySelectionsContent.innerHTML = mySelectionsHTML || "<p>You have not selected any targets.</p>";
        updateTimers();
    }

    const fetchData = async () => {
        if (!scriptState.enemyFactionId) return;
        try {
            const tornUrl = `https://api.torn.com/faction/${scriptState.enemyFactionId}?selections=basic&key=${scriptState.apiKey}`;
            const azureUrl = `${GET_SELECTIONS_URL.split('?')[0]}/${scriptState.enemyFactionId}?code=${GET_SELECTIONS_URL.split('code=')[1]}`;
            const [tornData, selectionsData] = await Promise.all([callApi(tornUrl), callApi(azureUrl)]);

            if (tornData && tornData.members) currentEnemyFactionData = tornData.members;
            currentSelectionsData = selectionsData;

            mySelections.clear();
            for (const targetId in selectionsData) {
                if (selectionsData[targetId].includes(scriptState.userName)) {
                    mySelections.add(targetId);
                }
            }
            renderFullTargetList();
        } catch (error) {
            console.error("Polling Error:", error);
            const targetListContent = document.getElementById(`${SCRIPT_PREFIX}-target-list-content`);
            if(targetListContent) targetListContent.innerHTML = `<p style="color: #f44336;">Polling Error: ${error}</p>`;
        }
    };

    function updateTimers() {
        document.querySelectorAll(`.${SCRIPT_PREFIX}-status-text[data-timestamp]`).forEach(el => {
            const timestamp = parseInt(el.dataset.timestamp, 10);
            if (timestamp > 0) {
                const remaining = timestamp - Math.floor(Date.now() / 1000);
                const originalText = el.innerText.split(' (')[0];
                el.innerText = (remaining > 0) ? `${originalText} (${formatTime(remaining)})` : originalText;
            }
        });
    }

    function formatTime(s) { const h = Math.floor(s / 3600).toString().padStart(2, '0'), m = Math.floor((s % 3600) / 60).toString().padStart(2, '0'), sec = Math.floor(s % 60).toString().padStart(2, '0'); return h > '00' ? `${h}:${m}:${sec}` : `${m}:${sec}`; }

    async function startWarManager() {
        if (scriptState.isWarModeActive) return;
        scriptState.isWarModeActive = true;
        console.log("Athena Battle System: Activating...");
        createMainUI();
        try {
            const warsData = await callApi(`https://api.torn.com/faction/?selections=rankedwars&key=${scriptState.apiKey}`);
            let enemyFactionId = null;
            if (warsData.rankedwars && Object.keys(warsData.rankedwars).length > 0) {
                const myWars = Object.values(warsData.rankedwars).filter(war => war.factions[scriptState.userFactionId]).sort((a, b) => b.war.start - a.war.start);
                if (myWars.length > 0) {
                    for (const factionId in myWars[0].factions) { if (parseInt(factionId, 10) !== scriptState.userFactionId) { enemyFactionId = factionId; break; } }
                }
            }
            scriptState.enemyFactionId = enemyFactionId;
            if (!scriptState.enemyFactionId) {
                document.getElementById(`${SCRIPT_PREFIX}-target-list-content`).innerHTML = "<p>Your faction is not in a ranked war.</p>";
                return;
            }

            await fetchData();
            if (dataPollingId) clearInterval(dataPollingId);
            dataPollingId = setInterval(fetchData, DATA_POLLING_INTERVAL_SECONDS * 1000);
            if (countdownIntervalId) clearInterval(countdownIntervalId);
            countdownIntervalId = setInterval(updateTimers, 1000);

            if (!clickListenerAdded) {
                document.body.addEventListener('click', async (event) => {
                    if (!scriptState.isWarModeActive) return;
                    const target = event.target;
                    if (!target.classList.contains(`${SCRIPT_PREFIX}-action-btn`)) return;
                    const userId = target.dataset.userId;
                    if (!userId) return;
                    let action = null;
                    if (target.classList.contains('select-btn') && mySelections.size < MAX_SELECTIONS) { mySelections.add(userId); action = 'select'; }
                    else if (target.classList.contains('remove-btn')) { mySelections.delete(userId); action = 'deselect'; }

                    if (action) {
                        renderFullTargetList();
                        try {
                            await callApi(UPDATE_SELECTION_URL, 'POST', { apiKey: scriptState.apiKey, userName: scriptState.userName, targetId: userId, action: action, enemyFactionId: scriptState.enemyFactionId });
                        } catch (error) { console.error("Failed to update selection:", error); alert("Error: Could not sync selection."); }
                        await fetchData();
                    }
                });
                clickListenerAdded = true;
            }
        } catch (error) {
            console.error("War Manager Start Error:", error);
        }
    }

    function stopWarManager() {
        if (!scriptState.isWarModeActive) return;
        scriptState.isWarModeActive = false;
        if (dataPollingId) clearInterval(dataPollingId);
        if (countdownIntervalId) clearInterval(countdownIntervalId);
        dataPollingId = null;
        countdownIntervalId = null;
        destroyMainUI();
        console.log("Athena Battle System: Deactivated.");
    }

    // =================================================================================
    // MAIN SCRIPT LOGIC
    // =================================================================================
    async function main() {
        if (isRunning) return;
        isRunning = true;

        document.getElementById(`${SCRIPT_PREFIX}-admin-placeholder`)?.remove();
        if (warModePollingId) clearInterval(warModePollingId);
        stopWarManager();

        initializeUI();
        scriptState.apiKey = GM_getValue('apiKey', null);
        if (!scriptState.apiKey) { isRunning = false; return; }

        try {
            const userData = await callApi(`https://api.torn.com/user/?selections=profile&key=${scriptState.apiKey}`);
            scriptState.userName = userData.name;
            scriptState.userId = userData.player_id;
            scriptState.userFactionId = userData?.faction?.faction_id;
            scriptState.userFactionRole = userData?.faction?.position;

            if (!scriptState.userFactionId) { isRunning = false; return; }

            const checkWarMode = async () => {
                try {
                    const warModeUrl = `${GET_WAR_MODE_URL.split('?')[0]}/${scriptState.userFactionId}?code=${GET_WAR_MODE_URL.split('code=')[1]}`;
                    const warModeStatus = await callApi(warModeUrl);

                    if (warModeStatus.warModeEnabled && !scriptState.isWarModeActive) {
                        await startWarManager();
                    } else if (!warModeStatus.warModeEnabled && scriptState.isWarModeActive) {
                        stopWarManager();
                    }

                    const adminToggle = document.getElementById('war-mode-toggle');
                    if (adminToggle) adminToggle.checked = warModeStatus.warModeEnabled;

                } catch (error) {
                    console.error("Error checking war mode status:", error);
                }
            };

            const initialWarModeStatus = await callApi(`${GET_WAR_MODE_URL.split('?')[0]}/${scriptState.userFactionId}?code=${GET_WAR_MODE_URL.split('code=')[1]}`);

            if (scriptState.userFactionRole === ADMIN_ROLE || scriptState.userFactionRole === ADMIN_ROLE_1 || scriptState.userFactionRole === ADMIN_ROLE_2 || scriptState.userFactionRole === ADMIN_ROLE_3) {
                createAdminUI(initialWarModeStatus.warModeEnabled);
            }

            if (initialWarModeStatus.warModeEnabled) {
                await startWarManager();
            }

            warModePollingId = setInterval(checkWarMode, WAR_MODE_POLLING_INTERVAL_SECONDS * 1000);

        } catch (error) {
            console.error("Initialization Error:", error);
        } finally {
            isRunning = false;
        }
    }

    // =================================================================================
    // SCRIPT ENTRY POINT
    // =================================================================================
    GM_registerMenuCommand('Set -PopZ- Athena Battle System API Key', promptForApiKey);

    setInterval(() => {
        if (!document.getElementById(`${SCRIPT_PREFIX}-admin-placeholder`)) {
            console.log("Athena Battle System: Page change detected, re-initializing...");
            main();
        }
    }, 2000);

    // Initial run on page load
    main();

})();