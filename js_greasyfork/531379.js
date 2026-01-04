// ==UserScript==
// @name         Organized Crime Analytics
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Tracks and analyzes organized crime scenarios with local caching, player stats, faction stats, and UI
// @author       Allenone[2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/531379/Organized%20Crime%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/531379/Organized%20Crime%20Analytics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINT = 'https://tornprobability.com:3000/api/scenarios';
    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const SUBMIT_TO_API = GM_getValue('SUBMIT_TO_API', false);

    let cachedScenarios = GM_getValue('cachedScenarios', {});
    let playerAnalytics = GM_getValue('playerAnalytics', {});
    let submittedScenarios = new Set(GM_getValue('submittedScenarios', []));
    const processedScenarios = new Set(GM_getValue('processedScenarios', []));
    let factioncut = GM_getValue('factioncut', 0);
    let customFactionCut = false;
    let lvl1 = 0, lvl2 = 0, lvl3 = 0, lvl4 = 5, lvl5 = 5, lvl6 = 5, lvl7 = 10, lvl8 = 10, lvl9 = 10, lvl10 = 10;

    // Ensure all existing playerAnalytics entries have necessary fields
    Object.keys(playerAnalytics).forEach(playerId => {
        if (!Array.isArray(playerAnalytics[playerId].scenarios)) {
            playerAnalytics[playerId].scenarios = [];
        }
    });

    // Fetch Interception (Unchanged)
    const win = (unsafeWindow || window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }

        let isCompletedGroup = false;
        if (config?.body instanceof FormData) {
            isCompletedGroup = config.body.get('group') === 'Completed';
        } else if (config?.body) {
            isCompletedGroup = config.body.toString().includes('group=Completed');
        }

        if (!isCompletedGroup) {
            return originalFetch.apply(this, arguments);
        }

        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            if (json.success && json.data) {
                const newScenarios = [];
                json.data.forEach(scenario => {
                    const scenarioId = String(scenario.ID);
                    if (!processedScenarios.has(scenarioId)) {
                        processScenario(scenario);
                        processedScenarios.add(scenarioId);
                        newScenarios.push(scenarioId);
                    }
                });
                GM_setValue('cachedScenarios', cachedScenarios);
                GM_setValue('playerAnalytics', playerAnalytics);
                GM_setValue('processedScenarios', Array.from(processedScenarios));
                if (SUBMIT_TO_API) {
                    submitPendingScenarios(newScenarios);
                }
            }
        } catch (err) {
            console.error("Error processing fetch response:", err);
        }
        return response;
    };

    function updateUI() {
        const statsTabBtn = document.getElementById('oca-stats-tab-btn');
        const factionStatsTabBtn = document.getElementById('oca-faction-stats-tab-btn');

        // Only update the active tab
        if (statsTabBtn?.classList.contains('active___ImR61')) {
            updateStats();
        } else if (factionStatsTabBtn?.classList.contains('active___ImR61')) {
            updateFactionStats();
        }
    }

    function replaceUserIdsWithNames(text, playerSlots) {
        let modifiedText = text;
        playerSlots.forEach(slot => {
            const userId = `userId-${slot.player.ID}`;
            modifiedText = modifiedText.replace(new RegExp(`\\b${userId}\\b`, 'gi'), slot.player.name);
        });
        return modifiedText;
    }

    function enhanceScenarioEvents(events, playerSlots) {
        return events.map((event, index, arr) => {
            const sanitizedKey = event.id.replace(/^\[|\]$/g, '');
            const enhanced = {
                key: sanitizedKey,
                text: replaceUserIdsWithNames(event.description, playerSlots),
                type: event.type
            };
            if (index > 0) {
                enhanced.previous = arr[index - 1].key;
            }
            return enhanced;
        });
    }

    // Unified Processing with Leaner Cached Data
    function processScenario(scenario) {
        const scenarioId = String(scenario.ID);
        if (processedScenarios.has(scenarioId)) return;

        const enhancedEvents = enhanceScenarioEvents(scenario.scenario.scenes.map(scene => scene.dialogues[0]), scenario.playerSlots);
        const checkpointSetupPlayers = new Map();

        enhancedEvents.forEach(event => {
            if (event.key.includes('-C') && !event.key.match(/[PF]$/)) {
                const playersInvolved = scenario.playerSlots
                    .filter(slot => event.text.toLowerCase().includes(slot.player.name.toLowerCase()))
                    .map(slot => slot.player.name.trim());
                if (playersInvolved.length > 0) {
                    checkpointSetupPlayers.set(event.key, playersInvolved);
                }
            }
        });

        const numPlayers = scenario.playerSlots.length;
        const totalRespect = scenario.rewards?.faction?.respect || 0;
        const totalMoney = scenario.rewards?.faction?.moneyEquivalent || 0;
        const respectPerPlayer = numPlayers > 0 ? Math.round(totalRespect / numPlayers) : 0;
        const moneyPerPlayer = numPlayers > 0 ? Math.round(totalMoney / numPlayers) : 0;
        const isSuccessful = scenario.status === "Successful";
        const expiresAt = scenario.expiresAt * 1000;

        scenario.playerSlots.forEach(slot => {
            const playerId = slot.player.ID;
            const playerName = slot.player.name.trim();
            const stats = playerAnalytics[playerId] || {
                name: playerName,
                scenarios: []
            };

            const scenarioStats = {
                expiresAt,
                successfulScenarios: isSuccessful ? 1 : 0,
                failedScenarios: isSuccessful ? 0 : 1,
                successfulCheckpoints: 0,
                failedCheckpoints: 0,
                injuries: slot.outcome === 'Hospitalized' ? 1 : 0,
                jailed: slot.outcome === 'Jailed' ? 1 : 0,
                totalRespect: respectPerPlayer,
                totalMoney: moneyPerPlayer,
                scenarioName: scenario.scenario.name,
                role: slot.name
            };

            enhancedEvents.forEach(event => {
                if (event.key.includes('C') && (event.key.endsWith('P') || event.key.endsWith('F'))) {
                    let responsiblePlayers = [];
                    if (event.text.toLowerCase().includes(playerName.toLowerCase())) {
                        responsiblePlayers = [playerName];
                    } else {
                        const setupKey = event.key.slice(0, -1);
                        responsiblePlayers = checkpointSetupPlayers.get(setupKey) || [];
                    }
                    if (responsiblePlayers.includes(playerName)) {
                        if (event.key.endsWith('P')) scenarioStats.successfulCheckpoints += 1;
                        else if (event.key.endsWith('F')) scenarioStats.failedCheckpoints += 1;
                    }
                }
            });

            stats.scenarios.push(scenarioStats);
            playerAnalytics[playerId] = stats;
        });

        // Updated cached data with scenes, key, and preRequisiteCrimeID
        cachedScenarios[scenarioId] = {
            ID: scenario.ID,
            status: scenario.status,
            expiresAt: scenario.expiresAt,
            preRequisiteCrimeID: scenario.preRequisiteCrimeID !== undefined ? String(scenario.preRequisiteCrimeID) : null,
            playerSlots: scenario.playerSlots.map(slot => ({
                key: slot.key,
                player: { ID: slot.player.ID, name: slot.player.name, successChance: slot.successChance },
                outcome: slot.outcome,
                role: slot.name
            })),
            rewards: scenario.rewards ? { faction: scenario.rewards.faction } : { faction: {} },
            scenario: {
                name: scenario.scenario.name,
                level: scenario.scenario.level,
                scenes: scenario.scenario.scenes
            }
        };
    }

    function submitPendingScenarios(scenarioIds) {
        const toSubmit = scenarioIds.filter(id => !submittedScenarios.has(id));
        toSubmit.forEach((id, index) => {
            setTimeout(() => {
                const scenario = cachedScenarios[id];
                if (scenario) {
                    const dataToSubmit = prepareDataForSubmission(scenario);
                    submitScenarioData(dataToSubmit);
                }
            }, index * 40);
        });
    }

    function prepareDataForSubmission(scenario) {
        const events = scenario.scenario.scenes.map(scene => scene.dialogues[0]);
        const enhancedEvents = enhanceScenarioEventsForSubmission(events, scenario.playerSlots);
        return {
            name: scenario.scenario.name,
            scenarioId: String(scenario.ID),
            preRequisiteCrimeID: scenario.preRequisiteCrimeID,
            rewards: {
                respect: Number(scenario.rewards?.faction?.respect || 0),
                scope: Number(scenario.rewards?.faction?.scope || 0),
                money: Number(scenario.rewards?.faction?.cash || 0),
                items: scenario.rewards?.faction?.items?.map(item => ({
                    name: item.name,
                    quantity: Number(item.quantity || 1)
                })) || []
            },
            events: enhancedEvents
        };
    }

    function replaceUserIdsWithRoles(text, roleMappings) {
        let modifiedText = text;
        roleMappings.forEach((role, userId) => {
            modifiedText = modifiedText.replace(new RegExp(`\\b${userId}\\b`, 'gi'), role);
        });
        return modifiedText;
    }

    function buildRoleMappings(playerSlots) {
        const memberRoles = new Map();
        const sortedSlots = playerSlots.slice().sort((a, b) => {
            const posA = parseInt(a.key.match(/\d+/)?.[0] || 0, 10);
            const posB = parseInt(b.key.match(/\d+/)?.[0] || 0, 10);
            return posA - posB;
        });

        const roleRegistry = new Map();
        sortedSlots.forEach(slot => {
            const role = slot.role;
            roleRegistry.set(role, (roleRegistry.get(role) || 0) + 1);
        });

        const roleCounts = new Map();
        sortedSlots.forEach(slot => {
            const role = slot.role;
            const total = roleRegistry.get(role);
            const count = (roleCounts.get(role) || 0) + 1;
            roleCounts.set(role, count);
            const displayName = total > 1 ? `${role} ${count}` : role;
            memberRoles.set(`userId-${slot.player.ID}`, displayName);
        });

        return memberRoles;
    }

    function enhanceScenarioEventsForSubmission(events, playerSlots) {
        const roleMappings = buildRoleMappings(playerSlots);
        return events.map((event, index, arr) => {
            const enhanced = {
                key: event.id,
                text: replaceUserIdsWithRoles(event.description, roleMappings)
            };
            if (index > 0) {
                enhanced.previous = arr[index - 1].id;
                if (enhanced.previous === '[Prelude]' && !event.id.startsWith('[A0')) {
                    enhanced.previous = '[Prelude]';
                }
            }
            return enhanced;
        });
    }

    function submitScenarioData(scenarioData) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_ENDPOINT,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(scenarioData),
            onload: (response) => {
                if (response.status >= 200 && response.status < 300) {
                    submittedScenarios.add(String(scenarioData.scenarioId));
                    GM_setValue('submittedScenarios', Array.from(submittedScenarios));
                } else {
                    console.error(`Failed to submit scenario ${scenarioData.scenarioId}: ${response.status}`);
                }
            },
            onerror: (error) => {
                console.error(`Error submitting scenario ${scenarioData.scenarioId}: ${error.message}`, error);
            }
        });
    }

    function injectStatsUI() {
        const style = document.createElement('style');
        style.textContent = `
        .oca-stats-tab {}
        .oca-stats-tab.active___ImR61 {}
        .oca-stats-section, .oca-faction-stats-section {
            display: none;
        }
        .oca-container {
            padding: 20px;
        }
        .oca-title-wrapper {
            background: rgb(42, 42, 42);
            border-radius: 8px;
            padding: 10px 20px;
        }
        .oca-title {
            font-size: 24px;
            font-weight: bold;
            color: #fff;
            text-align: center;
        }
        .oca-content-wrapper {
            background: #333;
            border-radius: 8px;
            margin-top: 20px;
            padding: 20px;
        }
        .oca-header {
            margin-bottom: 20px;
        }
        .oca-header h2 {
            font-size: 20px;
            color: #ddd;
            margin: 0 0 15px 0;
            text-align: center !important;
        }
        .oca-controls {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        .oca-controls label {
            color: #ccc;
            font-weight: bold;
        }
        .oca-select-container {
            min-width: 150px;
        }
        .oca-select-container select {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            background: #444;
            color: #fff;
            border: 1px solid #666;
        }
        .oca-button-container button {
            padding: 8px 16px;
            background: #555;
            color: #fff;
            border: 1px solid #777;
            border-radius: 4px;
            cursor: pointer;
        }
        .oca-button-container button:hover {
            background: #666;
        }
        .oca-stats-display {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
        }
        .oca-stats-display p {
            margin: 0 0 10px;
            color: #ddd;
            font-size: 16px;
        }
        .oca-stats-display p:last-child {
            margin-bottom: 0;
        }
        .oca-stats-display strong {
            color: #fff;
        }
        .oca-stats-display h3 {
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #555;
            padding-bottom: 5px;
            font-size: 18px;
        }
        .oca-stats-display table {
            width: 100%;
            border-collapse: collapse;
            color: #ddd;
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .oca-stats-display th, .oca-stats-display td {
            padding: 8px !important;
            border: 1px solid #555 !important;
            text-align: left;
        }
        .oca-stats-display th {
            background: #444;
            font-weight: bold;
        }
        .oca-stats-display table td[data-player-id] {
            cursor: pointer;
        }
        .sortable {
            cursor: pointer;
        }
        .sortable:hover {
            background: #666;
            text-decoration: underline;
        }
        .oca-stats-display table, .oca-stats-display th, .oca-stats-display td {
            color: #fff;
        }
        /* New styles for two-column layout */
        .oca-two-column-layout {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 20px;
        }
        .oca-column {
            flex: 1;
            min-width: 0; /* Prevent overflow */
        }
        /* Styles for Completed OCs list */
        .oca-oc-list {
            list-style: none;
            margin: 0;
            padding: 10px;
            background: #2a2a2a;
            border: 1px solid #555;
            border-radius: 4px;
            color: #ddd;
            font-size: 14px;
            line-height: 1.5;
        }
        .oca-oc-list li {
            padding: 5px 0;
            border-bottom: 1px solid #444;
        }
        .oca-oc-list li:last-child {
            border-bottom: none;
        }
        /* Styles for Items Earned list */
        .oca-items-list {
            list-style: none;
            margin: 0;
            padding: 10px;
            background: #2a2a2a;
            border: 1px solid #555;
            border-radius: 4px;
            color: #ddd;
            font-size: 14px;
            line-height: 1.5;
        }
        .oca-items-list li {
            padding: 5px 0;
            border-bottom: 1px solid #444;
        }
        .oca-items-list li:last-child {
            border-bottom: none;
        }
        @media (max-width: 768px) {
            .oca-container {
                padding: 10px;
            }
            .oca-title {
                font-size: 20px;
            }
            .oca-header h2 {
                font-size: 18px;
            }
            .oca-controls {
                flex-direction: column;
                align-items: stretch;
            }
            .oca-select-container, .oca-button-container {
                width: 100%;
                margin-bottom: 10px;
            }
            .oca-stats-display {
                padding: 10px;
            }
            .oca-stats-display table {
                width: 100%;
                overflow-x: auto;
                display: block;
            }
            .oca-two-column-layout {
                flex-direction: column;
                gap: 15px;
            }
            .oca-column {
                width: 100%;
            }
            .oca-controls input[type="number"] {
                width: 100%; /* Full width on mobile */
            }
        }
    `;
        if (!document.head.querySelector('style[data-oc-analytics]')) {
            style.setAttribute('data-oc-analytics', 'true');
            document.head.appendChild(style);
        }

        const tabContainer = document.querySelector('.buttonsContainer___aClaa');
        if (tabContainer && !document.getElementById('oca-stats-tab-btn')) {
            const statsTabBtn = document.createElement('button');
            statsTabBtn.id = 'oca-stats-tab-btn';
            statsTabBtn.className = 'button___cwmLf oca-stats-tab';
            statsTabBtn.innerHTML = '<span class="iconContainer___Lbeo_"><span class="iconWrapper___t8rNs"></span></span>Player Statistics';
            tabContainer.appendChild(statsTabBtn);

            const factionStatsTabBtn = document.createElement('button');
            factionStatsTabBtn.id = 'oca-faction-stats-tab-btn';
            factionStatsTabBtn.className = 'button___cwmLf oca-stats-tab';
            factionStatsTabBtn.innerHTML = '<span class="iconContainer___Lbeo_"><span class="iconWrapper___t8rNs"></span></span>Faction Statistics';
            tabContainer.appendChild(factionStatsTabBtn);
        }
        return !!tabContainer;
    }

    function switchToPlayerStats(playerId) {
        const playerSelect = document.getElementById('ocaPlayerSelect');
        playerSelect.value = playerId;
        const playerStatsTabBtn = document.getElementById('oca-stats-tab-btn');
        playerStatsTabBtn.click();
    }

    function markContentArea() {
        let wrapper = document.querySelector('.wrapper___U2Ap7');
        if (wrapper) {
            let contentArea = wrapper.parentElement;
            if (!contentArea.id) {
                contentArea.id = 'oc-content-area';
            }
            return contentArea;
        }
        return null;
    }

    function getContentArea() {
        let contentArea = document.getElementById('oc-content-area');
        if (!contentArea) {
            contentArea = markContentArea();
        }
        return contentArea;
    }

    function initializeStats() {
        const statsTabBtn = document.getElementById('oca-stats-tab-btn');
        const factionStatsTabBtn = document.getElementById('oca-faction-stats-tab-btn');
        const contentArea = getContentArea();
        if (!statsTabBtn || !factionStatsTabBtn || !contentArea) return;

        let statsSection = contentArea.querySelector('.oca-stats-section');
        if (!statsSection) {
            statsSection = document.createElement('div');
            statsSection.className = 'oca-stats-section';
            statsSection.style.display = 'none';
            statsSection.innerHTML = `
            <div class="oca-container">
                <div class="oca-title-wrapper">
                    <div class="oca-title">Player Analytics Dashboard</div>
                </div>
                <div class="oca-content-wrapper">
                    <div class="oca-header">
                        <div class="oca-controls" id="ocaControls">
                            <label for="ocaPlayerSelect">Player:</label>
                            <div class="oca-select-container" id="playerSelectContainer"></div>
                            <label for="ocaTimePeriod">Time Period:</label>
                            <div class="oca-select-container" id="timePeriodContainer"></div>
                        </div>
                    </div>
                    <div id="ocaStatsDisplay" class="oca-stats-display"></div>
                </div>
            </div>
        `;
            contentArea.appendChild(statsSection);
        }

        let factionStatsSection = contentArea.querySelector('.oca-faction-stats-section');
        if (!factionStatsSection) {
            factionStatsSection = document.createElement('div');
            factionStatsSection.className = 'oca-faction-stats-section';
            factionStatsSection.style.display = 'none';
            factionStatsSection.innerHTML = `
            <div class="oca-container">
                <div class="oca-title-wrapper">
                    <div class="oca-title">Faction Analytics Dashboard</div>
                </div>
                <div class="oca-content-wrapper">
                    <div class="oca-header">
                        <div class="oca-controls">
                            <label for="ocaFactionTimePeriod">Time Period:</label>
                            <div class="oca-select-container" id="factionTimePeriodContainer"></div>
                        </div>
                    </div>
                    <div id="ocaFactionStatsDisplay" class="oca-stats-display"></div>
                </div>
            </div>
        `;
            contentArea.appendChild(factionStatsSection);
        }

        const playerSelectContainer = document.getElementById('playerSelectContainer');
        let playerSelect = document.getElementById('ocaPlayerSelect');
        let timePeriod = document.getElementById('ocaTimePeriod');

        // Initialize or update the dropdown
        if (!playerSelect) {
            playerSelect = document.createElement('select');
            playerSelect.id = 'ocaPlayerSelect';
            playerSelectContainer.appendChild(playerSelect);

            timePeriod = document.createElement('select');
            timePeriod.id = 'ocaTimePeriod';
            timePeriod.innerHTML = `
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="all" selected>All Time</option>
        `;
            document.getElementById('timePeriodContainer').appendChild(timePeriod);

            playerSelect.addEventListener('change', () => {
                const selectedPlayerId = playerSelect.value;
                GM_setValue('lastSelectedPlayer', selectedPlayerId);
                updateStats();
            });
            timePeriod.addEventListener('change', updateStats);
        }

        // Refresh dropdown with latest playerAnalytics on every initialization
        playerSelect.innerHTML = ''; // Clear existing options
        const sortedPlayers = Object.entries(playerAnalytics).sort((a, b) =>
                                                                   a[1].name.localeCompare(b[1].name)
                                                                  );
        sortedPlayers.forEach(([id, stats]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = stats.name;
            playerSelect.appendChild(option);
        });

        const lastSelectedPlayer = GM_getValue('lastSelectedPlayer');
        if (lastSelectedPlayer && playerAnalytics[lastSelectedPlayer]) {
            playerSelect.value = lastSelectedPlayer;
        } else if (sortedPlayers.length > 0) {
            playerSelect.value = sortedPlayers[0][0];
        }

        const factionTimePeriodContainer = document.getElementById('factionTimePeriodContainer');
        let factionTimePeriod = document.getElementById('ocaFactionTimePeriod');
        if (!factionTimePeriod) {
            factionTimePeriod = document.createElement('select');
            factionTimePeriod.id = 'ocaFactionTimePeriod';
            factionTimePeriod.innerHTML = `
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="all" selected>All Time</option>
        `;
            factionTimePeriodContainer.appendChild(factionTimePeriod);
            factionTimePeriod.addEventListener('change', updateFactionStats);
        }

        // Add faction cut input and submit to API checkbox to .oca-controls
        const factionControls = factionStatsSection.querySelector('.oca-controls');
        if (!factionControls.querySelector('#ocaFactionCut')) {
            const factionCutLabel = document.createElement('label');
            factionCutLabel.htmlFor = 'ocaFactionCut';
            factionCutLabel.textContent = 'Faction Cut: ';
            factionCutLabel.style.color = '#ccc';
            factionCutLabel.style.fontWeight = 'bold';

            const factionCutInput = document.createElement('input');
            factionCutInput.type = 'number';
            factionCutInput.id = 'ocaFactionCut';
            factionCutInput.min = '0';
            factionCutInput.max = '100';
            factionCutInput.value = factioncut; // Set initial value from cached factioncut
            factionCutInput.style.width = '60px';
            factionCutInput.style.padding = '8px';
            factionCutInput.style.marginLeft = '5px';
            factionCutInput.style.borderRadius = '4px';
            factionCutInput.style.background = '#444';
            factionCutInput.style.color = '#fff';
            factionCutInput.style.border = '1px solid #666';
            factionCutInput.addEventListener('change', () => {
                factioncut = parseInt(factionCutInput.value) || 0; // Ensure valid number
                if (factioncut > 100) factioncut = 100; // Cap at 100
                if (factioncut < 0) factioncut = 0; // Minimum 0
                GM_setValue('factioncut', factioncut);
                updateFactionStats(); // Refresh UI to reflect new faction cut
                updateStats(); // Refresh player stats to reflect new faction cut
            });

            const submitToAPILabel = document.createElement('label');
            submitToAPILabel.htmlFor = 'ocaSubmitToAPI';
            submitToAPILabel.textContent = 'Submit anonymous data: ';
            submitToAPILabel.style.color = '#ccc';
            submitToAPILabel.style.fontWeight = 'bold';
            submitToAPILabel.style.marginLeft = '20px'; // Space between controls

            const submitToAPICheckbox = document.createElement('input');
            submitToAPICheckbox.type = 'checkbox';
            submitToAPICheckbox.id = 'ocaSubmitToAPI';
            submitToAPICheckbox.checked = SUBMIT_TO_API; // Set initial value from cached SUBMIT_TO_API
            submitToAPICheckbox.style.marginLeft = '5px';
            submitToAPICheckbox.addEventListener('change', () => {
                const isChecked = submitToAPICheckbox.checked;
                GM_setValue('SUBMIT_TO_API', isChecked);
                if (isChecked) {
                    const allScenarioIds = Object.keys(cachedScenarios);
                    submitPendingScenarios(allScenarioIds);
                }
            });

            // Append controls to .oca-controls
            factionControls.appendChild(factionCutLabel);
            factionControls.appendChild(factionCutInput);
            factionControls.appendChild(submitToAPILabel);
            factionControls.appendChild(submitToAPICheckbox);
        }

        const tabs = document.querySelectorAll('.buttonsContainer___aClaa button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active___ImR61'));
                tab.classList.add('active___ImR61');

                const allChildren = contentArea.children;
                for (let child of allChildren) {
                    child.style.display = 'none';
                }

                const manualSpawner = document.querySelector('.manualSpawnerContainer___JRyED');
                const notInvolvedMembers = document.querySelector('.notInvolvedMembers___ifZnn');
                const hrBefore = contentArea.previousElementSibling;
                const hrAfter = contentArea.nextElementSibling;
                const allWrappers = contentArea.querySelectorAll('.wrapper___U2Ap7');

                if (tab.id === 'oca-stats-tab-btn') {
                    statsSection.style.display = 'block';
                    updateStats();
                    if (manualSpawner) manualSpawner.style.display = 'none';
                    if (notInvolvedMembers) notInvolvedMembers.style.display = 'none';
                    if (hrBefore && hrBefore.tagName === 'HR') hrBefore.style.display = 'none';
                    if (hrAfter && hrAfter.tagName === 'HR') hrAfter.style.display = 'none';
                } else if (tab.id === 'oca-faction-stats-tab-btn') {
                    factionStatsSection.style.display = 'block';
                    updateFactionStats();
                    if (manualSpawner) manualSpawner.style.display = 'none';
                    if (notInvolvedMembers) notInvolvedMembers.style.display = 'none';
                    if (hrBefore && hrBefore.tagName === 'HR') hrBefore.style.display = 'none';
                    if (hrAfter && hrAfter.tagName === 'HR') hrAfter.style.display = 'none';
                } else {
                    if (manualSpawner) manualSpawner.style.display = '';
                    if (notInvolvedMembers) notInvolvedMembers.style.display = '';
                    if (hrBefore && hrBefore.tagName === 'HR') hrBefore.style.display = '';
                    if (hrAfter && hrAfter.tagName === 'HR') hrAfter.style.display = '';

                    allWrappers.forEach(wrapper => {
                        if (!wrapper.closest('.oca-stats-section') && !wrapper.closest('.oca-faction-stats-section')) {
                            if (tab.textContent === 'Planning' || tab.textContent === 'Recruiting') {
                                wrapper.style.display = 'block';
                            } else if (tab.textContent === 'Completed' && !wrapper.classList.contains('planning___H0H9c')) {
                                wrapper.style.display = 'block';
                            } else {
                                wrapper.style.display = 'none';
                            }
                        }
                    });
                }
            });
        });

        if (statsTabBtn.classList.contains('active___ImR61')) {
            statsSection.style.display = 'block';
            updateStats();
        } else if (factionStatsTabBtn.classList.contains('active___ImR61')) {
            factionStatsSection.style.display = 'block';
            updateFactionStats();
        }
    }

    function getFilteredStats(playerId, days) {
        const stats = playerAnalytics[playerId] || {
            name: 'Unknown',
            scenarios: []
        };

        const cutoff = days === 'all' ? 0 : Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000);
        const filteredScenarios = stats.scenarios.filter(scenario => scenario.expiresAt >= cutoff);

        const aggregatedStats = {
            name: stats.name,
            totalScenarios: 0,
            successfulScenarios: 0,
            failedScenarios: 0,
            totalCheckpoints: 0,
            successfulCheckpoints: 0,
            failedCheckpoints: 0,
            injuries: 0,
            jailed: 0,
            totalRespect: 0,
            totalMoney: 0,
            scenarioParticipation: {}
        };

        filteredScenarios.forEach(scenario => {
            aggregatedStats.totalScenarios += 1;
            aggregatedStats.successfulScenarios += scenario.successfulScenarios;
            aggregatedStats.failedScenarios += scenario.failedScenarios;
            aggregatedStats.totalCheckpoints += (scenario.successfulCheckpoints + scenario.failedCheckpoints);
            aggregatedStats.successfulCheckpoints += scenario.successfulCheckpoints;
            aggregatedStats.failedCheckpoints += scenario.failedCheckpoints;
            aggregatedStats.injuries += scenario.injuries;
            aggregatedStats.jailed += scenario.jailed;
            aggregatedStats.totalRespect += scenario.totalRespect;
            aggregatedStats.totalMoney += scenario.totalMoney;
            aggregatedStats.scenarioParticipation[scenario.scenarioName] =
                (aggregatedStats.scenarioParticipation[scenario.scenarioName] || 0) + 1;
        });

        return aggregatedStats;
    }

    function updateStats() {
        const statsDisplay = document.getElementById('ocaStatsDisplay');
        const selectedPlayerId = document.getElementById('ocaPlayerSelect').value;
        const days = document.getElementById('ocaTimePeriod').value;
        const stats = getFilteredStats(selectedPlayerId, days);

        const playerScenarios = Object.values(cachedScenarios).filter(scenario =>
                                                                      scenario.status === 'Successful' && scenario.playerSlots.some(slot => slot.player.ID == selectedPlayerId)
                                                                     );

        let highestOC = { level: 0, role: '', successChance: 0 };
        playerScenarios.forEach(scenario => {
            if (scenario.scenario.level > highestOC.level) {
                const playerSlot = scenario.playerSlots.find(slot => slot.player.ID == selectedPlayerId);
                highestOC = {
                    name: scenario.scenario.name,
                    level: scenario.scenario.level,
                    role: playerSlot.role,
                    successChance: playerSlot.player.successChance || 0
                };
            }
        });

        statsDisplay.innerHTML = `
            <p><strong>Name:</strong> ${stats.name}</p>
            <p><strong>Total Scenarios:</strong> ${stats.totalScenarios}</p>
            <p><strong>Successful Scenarios:</strong> ${stats.successfulScenarios} ( ${stats.totalScenarios > 0 ? Math.round((stats.successfulScenarios / stats.totalScenarios) * 100) : 0}% )</p>
            <p><strong>Failed Scenarios:</strong> ${stats.failedScenarios} ( ${stats.totalScenarios > 0 ? Math.round((stats.failedScenarios / stats.totalScenarios) * 100) : 0}% )</p>
            <p><strong>Successful Checkpoints:</strong> ${stats.successfulCheckpoints} ( ${stats.totalCheckpoints > 0 ? Math.round((stats.successfulCheckpoints / stats.totalCheckpoints) * 100) : 0}% )</p>
            <p><strong>Failed Checkpoints:</strong> ${stats.failedCheckpoints} ( ${stats.totalCheckpoints > 0 ? Math.round((stats.failedCheckpoints / stats.totalCheckpoints) * 100) : 0}% )</p>
            <p><strong>Injuries:</strong> ${stats.injuries}</p>
            <p><strong>Jailed:</strong> ${stats.jailed}</p>
            <p><strong>Total Respect Earned:</strong> ${stats.totalRespect.toLocaleString()}</p>
            <p><strong>Total Money Earned:</strong> $${(stats.totalMoney * ((100-factioncut)/100)).toLocaleString()}</p>
            <p><strong>Most Common Scenario:</strong> ${Object.entries(stats.scenarioParticipation || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}</p>
            <p><strong>Highest OC Completed:</strong> <span title="Role: ${highestOC.role}, Success Chance: ${highestOC.successChance}%">Level ${highestOC.level} : ${highestOC.name}</span></p>
        `;
    }

    function getFactionStats(days) {
        const cutoff = days === 'all' ? 0 : Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000);
        const filteredScenarios = Object.values(cachedScenarios).filter(scenario => {
            const expiresAt = scenario.expiresAt * 1000;
            return expiresAt >= cutoff;
        });

        let totalMoney = 0;
        let totalRespect = 0;
        const ocCounts = {};
        const itemCounts = {};
        let totalScenarios = filteredScenarios.length;
        let successfulScenarios = 0;

        // Map OC names to levels
        const ocLevelMap = {};
        filteredScenarios.forEach(scenario => {
            const ocName = scenario.scenario.name;
            ocLevelMap[ocName] = scenario.scenario.level; // Store the level for each OC
        });

        filteredScenarios.forEach(scenario => {
            const ocName = scenario.scenario.name;
            if (!ocCounts[ocName]) {
                ocCounts[ocName] = { total: 0, successful: 0 };
            }
            ocCounts[ocName].total += 1;

            if (scenario.status === 'Successful') {
                totalMoney += scenario.rewards?.faction?.moneyEquivalent || 0;
                totalRespect += scenario.rewards?.faction?.respect || 0;
                ocCounts[ocName].successful += 1;
                successfulScenarios += 1;

                if (scenario.rewards?.faction?.items) {
                    scenario.rewards.faction.items.forEach(item => {
                        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
                    });
                }
            }
        });

        const successRate = totalScenarios > 0 ? Math.round((successfulScenarios / totalScenarios) * 100) : 0;

        const playerData = {};
        Object.entries(playerAnalytics).forEach(([id, stats]) => {
            const playerStats = getFilteredStats(id, days);
            const successfulPlayerScenarios = filteredScenarios.filter(scenario =>
                                                                       scenario.status === 'Successful' && scenario.playerSlots.some(slot => slot.player.ID == id)
                                                                      );

            let level = 0;
            if (successfulPlayerScenarios.length > 0) {
                const highestLevelScenario = successfulPlayerScenarios.reduce((max, scenario) =>
                                                                              scenario.scenario.level > max.scenario.level ? scenario : max,
                                                                              successfulPlayerScenarios[0]
                                                                             );
                level = highestLevelScenario.scenario.level;
            }

            playerData[id] = {
                level,
                successChance: playerStats.totalScenarios > 0
                    ? Math.round((playerStats.successfulScenarios / playerStats.totalScenarios) * 100)
                    : 0,
                totalRespect: playerStats.totalRespect,
                totalMoney: playerStats.totalMoney
            };
        });

        return { totalMoney, totalRespect, ocCounts, ocLevelMap, playerData, itemCounts, totalScenarios, successfulScenarios, successRate };
    }

    function updateFactionStats() {
        const factionStatsDisplay = document.getElementById('ocaFactionStatsDisplay');
        if (!factionStatsDisplay) return;

        const days = document.getElementById('ocaFactionTimePeriod').value;
        const stats = getFactionStats(days);

        let playerTableData = Object.entries(stats.playerData).map(([id, data]) => ({
            id,
            name: playerAnalytics[id]?.name || 'Unknown',
            level: data.level,
            successChance: data.successChance,
            totalRespect: data.totalRespect,
            totalMoney: data.totalMoney * ((100 - factioncut) / 100)
        }));

        playerTableData.sort((a, b) => a.name.localeCompare(b.name));

        // Function to render the "Player Performance Overview" table
        function renderPlayerTable() {
            return `
            <table>
                <thead>
                    <tr>
                        <th class="sortable" data-sort="name">Player</th>
                        <th class="sortable" data-sort="level">Highest OC Level</th>
                        <th class="sortable" data-sort="successChance">Success Rate (%)</th>
                        <th class="sortable" data-sort="totalRespect">Total Respect Earned</th>
                        <th class="sortable" data-sort="totalMoney">Total Money Earned</th>
                    </tr>
                </thead>
                <tbody>
                    ${playerTableData.map(player => `
                        <tr>
                            <td data-player-id="${player.id}">${player.name}</td>
                            <td>${player.level}</td>
                            <td>${player.successChance}</td>
                            <td>${player.totalRespect.toLocaleString()}</td>
                            <td>$${player.totalMoney.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        }

        // Function to render the "Completed OCs" list, sorted by level
        function renderCompletedOCs() {
            const ocEntries = Object.entries(stats.ocCounts).map(([ocName, counts]) => {
                const successRate = counts.total > 0 ? Math.round((counts.successful / counts.total) * 100) : 0;
                const level = stats.ocLevelMap[ocName] || 0; // Default to 0 if level not found
                return { ocName, count: counts.successful, total: counts.total, successRate, level };
            });

            // Sort by level in descending order (highest to lowest)
            ocEntries.sort((a, b) => b.level - a.level);

            return `
            <ul class="oca-oc-list">${ocEntries.map(entry => `
                <li>${entry.ocName}: ${entry.count} / ${entry.total} (${entry.successRate}% Success)</li>
            `).join('')}</ul>
        `;
        }

        // Function to render "Items Earned" list
        function renderItemsEarned() {
            const itemEntries = Object.entries(stats.itemCounts).map(([itemName, count]) => `<li>${itemName}: ${count}</li>`);
            return itemEntries.length > 0 ? `<ul class="oca-items-list">${itemEntries.join('')}</ul>` : '';
        }

        // Render the Faction Stats display with two-column layout
        factionStatsDisplay.innerHTML = `
        <div class="oca-two-column-layout">
            <div class="oca-column">
                <p><strong>OCs Completed:</strong> ${stats.totalScenarios} (${stats.successRate}% success)</p>
                <p><strong>Total Money Earned:</strong> $${stats.totalMoney.toLocaleString()}</p>
                <p><strong>Total Respect Earned:</strong> ${stats.totalRespect.toLocaleString()}</p>
            </div>
            <div class="oca-column">
                <!-- Controls are now in .oca-controls, so no need to duplicate here -->
            </div>
        </div>
        <h3 style='text-align:center!important; margin-top: 2px;'>Completed OCs & Items Earned</h3>
        <div class="oca-two-column-layout">
            <div class="oca-column">${renderCompletedOCs()}</div>
            <div class="oca-column">${renderItemsEarned()}</div>
        </div>
        <h3 style='text-align:center!important;'>Player Performance Overview</h3>
        ${renderPlayerTable()}
    `;

        // Add click listener for player table
        if (!factionStatsDisplay.dataset.clickListenerAdded) {
            factionStatsDisplay.addEventListener('click', (event) => {
                const td = event.target.closest('td[data-player-id]');
                if (td) {
                    const playerId = td.getAttribute('data-player-id');
                    switchToPlayerStats(playerId);
                }
            });
            factionStatsDisplay.dataset.clickListenerAdded = 'true';
        }

        // Add sorting functionality for the player table
        document.querySelectorAll('#ocaFactionStatsDisplay .sortable').forEach(header => {
            header.addEventListener('click', () => {
                const sortKey = header.getAttribute('data-sort');
                const ascending = !header.classList.contains('asc');
                playerTableData.sort((a, b) => {
                    if (sortKey === 'name') {
                        return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                    } else {
                        return ascending ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
                    }
                });
                const tableBody = factionStatsDisplay.querySelector('table tbody');
                tableBody.innerHTML = playerTableData.map(player => `
                <tr>
                    <td data-player-id="${player.id}">${player.name}</td>
                    <td>${player.level}</td>
                    <td>${player.successChance}</td>
                    <td>${player.totalRespect.toLocaleString()}</td>
                    <td>$${player.totalMoney.toLocaleString()}</td>
                </tr>
            `).join('');
                factionStatsDisplay.querySelectorAll('.sortable').forEach(h => h.classList.remove('asc', 'desc'));
                header.classList.add(ascending ? 'asc' : 'desc');
            });
        });
    }

    function observeDOM() {
        const rootNode = document.querySelector('#factionCrimes-root, #faction-crimes-root') || document.body;
        let observer;

        function checkAndInitialize() {
            if (!window.location.hash.includes('#/tab=crimes')) return false;

            const tabContainer = document.querySelector('.buttonsContainer___aClaa');
            if (tabContainer && !document.getElementById('oca-stats-tab-btn')) {
                if (!injectStatsUI()) return false;
            }

            const statsTab = document.getElementById('oca-stats-tab-btn');
            const factionStatsTab = document.getElementById('oca-faction-stats-tab-btn');
            const wrapper = document.querySelector('.wrapper___U2Ap7');

            if (statsTab && factionStatsTab && tabContainer && wrapper && !wrapper.classList.contains('oc-stats-processed')) {
                markContentArea();
                initializeStats();
                wrapper.classList.add('oc-stats-processed');
                return true;
            }
            return false;
        }

        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations, obs) => {
            if (checkAndInitialize()) { }
        });

        observer.observe(rootNode, {
            childList: true,
            subtree: true
        });

        checkAndInitialize();
    }

    if (document.readyState === 'complete') {
        observeDOM();
    } else {
        window.addEventListener('load', observeDOM);
    }
})();