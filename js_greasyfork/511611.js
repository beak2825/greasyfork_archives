// ==UserScript==
// @name         Faction Target Finder
// @version      1.0.9
// @namespace    http://tampermonkey.net/
// @description  Adds a button to the top of the page that opens a live raid target from the faction list.
// @author       Omanpx [1906686], Titanic_ [2968477]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/511611/Faction%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/511611/Faction%20Target%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configurable
    let defaultFacIDs = [];

    const NO_API_MIN_ID = 3600000;
    const NO_API_MAX_ID = 3900000;
    // End of configurable

    let facIDs, maxLevel, apiKey, attackLink, newTab, randTarget, randFaction, ffScouterApiKey, maxStats, minStats, db;
    const DB_NAME = 'FTF_Cache';
    const STORE_NAME = 'ff_stats';
    const DB_VERSION = 1;
    const CACHE_DURATION = 10 * 24 * 60 * 60 * 1000; // 10 days

    function initDB() {
        return new Promise((resolve, reject) => {
            if (db) return resolve(db);
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = event => {
                const dbInstance = event.target.result;
                if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                    dbInstance.createObjectStore(STORE_NAME, { keyPath: 'userId' });
                }
            };
            request.onsuccess = event => {
                db = event.target.result;
                console.log("[FTF] IndexedDB initialized successfully.");
                resolve(db);
            };
            request.onerror = event => {
                console.error("[FTF] IndexedDB error:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

    function getStatsFromDB(userIds) {
        return new Promise((resolve, reject) => {
            if (!db) return reject("DB not initialized");
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const results = {};
            if (userIds.length === 0) return resolve(results);

            let processedCount = 0;
            userIds.forEach(id => {
                const request = store.get(id);
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result && (Date.now() - result.timestamp < CACHE_DURATION)) results[id] = result;
                    if (++processedCount === userIds.length) resolve(results);
                };
                request.onerror = () => {
                    if (++processedCount === userIds.length) resolve(results);
                };
            });
        });
    }

    function saveStatsToDB(statsArray) {
        return new Promise((resolve, reject) => {
            if (!db) return reject("DB not initialized");
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            statsArray.forEach(statData => store.put({
                userId: statData.player_id,
                stats: statData,
                timestamp: Date.now()
            }));
            transaction.oncomplete = () => resolve();
            transaction.onerror = event => reject(event.target.error);
        });
    }

    function fetchFFScouterStats(targetIds) {
        return new Promise((resolve) => {
            if (!ffScouterApiKey || targetIds.length === 0) return resolve([]);
            const FFSCOUTER_TARGETS_PER_REQ = 205;
            const promises = [];

            for (let i = 0; i < targetIds.length; i += FFSCOUTER_TARGETS_PER_REQ) {
                const chunk = targetIds.slice(i, i + FFSCOUTER_TARGETS_PER_REQ);
                const endpoint = `https://ffscouter.com/api/v1/get-stats?key=${ffScouterApiKey}&targets=${chunk.join(",")}`;
                promises.push(new Promise(resolveChunk => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: endpoint,
                        onload: response => {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                if (Array.isArray(responseData)) resolveChunk(responseData);
                                else {
                                    console.error(`[FTF] FFScouter API Error:`, responseData.error || responseData);
                                    resolveChunk([]);
                                }
                            } catch (e) {
                                console.error(`[FTF] FFScouter JSON Parse Error:`, e);
                                resolveChunk([]);
                            }
                        },
                        onerror: error => {
                            console.error("[FTF] FFScouter Fetch Error:", error);
                            resolveChunk([]);
                        }
                    });
                }));
            }
            Promise.all(promises).then(results => resolve([].concat(...results)));
        });
    }

    init();

    function parseSuffixedNumber(input) {
        if (!input) return 0;
        const s = String(input).trim().toLowerCase();
        const lastChar = s.slice(-1);
        let value = parseFloat(s);

        if (isNaN(value)) return 0;

        switch (lastChar) {
            case 'k': value *= 1e3; break;
            case 'm': value *= 1e6; break;
            case 'b': value *= 1e9; break;
            case 't': value *= 1e12; break;
            case 'q': value *= 1e15; break;
        }
        return Math.floor(value);
    }

    function init() {
        const storedFacIDs = localStorage.getItem('FTF_FACTIONS') !== null ? localStorage.getItem('FTF_FACTIONS') : defaultFacIDs.join(',');
        facIDs = storedFacIDs.split(',').map(Number).filter(id => !isNaN(id) && id > 0);

        maxLevel = localStorage.getItem('FTF_LEVEL') || 100;
        apiKey = localStorage.getItem('FTF_API') || null;
        attackLink = localStorage.getItem('FTF_PROFILE') === 'true';
        newTab = localStorage.getItem('FTF_NEWTAB') === 'true';
        randFaction = localStorage.getItem('FTF_RAND_FACTION') === 'true';
        randTarget = localStorage.getItem('FTF_RAND_TARGET') === 'true';

        ffScouterApiKey = localStorage.getItem('FTF_FF_API') || '';
        maxStats = parseSuffixedNumber(localStorage.getItem('FTF_MAX_STATS'));
        minStats = parseSuffixedNumber(localStorage.getItem('FTF_MIN_STATS'));
    }

    function promptAPIKey() {
        const key = prompt('Enter a public API key here:');
        if (key && key.trim() !== '') {
            localStorage.setItem('FTF_API', key);
            init();
        } else {
            alert('No valid API key entered! Search cancelled.');
        }
    }

    function changeSettings() {
        const newApiKey = document.querySelector('#ftf-api').value.trim();
        const newLevel = document.querySelector('#ftf-max-level').value;
        const newProfile = document.querySelector('#ftf-profile').checked;
        const newNewTab = document.querySelector('#ftf-newtab').checked;
        const newRandFaction = document.querySelector('#ftf-random-faction').checked;
        const newRandTarget = document.querySelector('#ftf-random-target').checked;
        const newFFApiKey = document.querySelector('#ftf-ff-api').value.trim();
        const newMaxStats = document.querySelector('#ftf-max-stats').value;
        const newMinStats = document.querySelector('#ftf-min-stats').value;

        localStorage.setItem('FTF_PROFILE', newProfile);
        localStorage.setItem('FTF_NEWTAB', newNewTab);
        localStorage.setItem('FTF_RAND_FACTION', newRandFaction);
        localStorage.setItem('FTF_RAND_TARGET', newRandTarget);
        localStorage.setItem('FTF_FACTIONS', facIDs.join(','));
        localStorage.setItem('FTF_API', newApiKey);
        localStorage.setItem('FTF_FF_API', newFFApiKey);
        localStorage.setItem('FTF_MAX_STATS', newMaxStats);
        localStorage.setItem('FTF_MIN_STATS', newMinStats);

        /*if (newApiKey && newApiKey.trim() !== '') localStorage.setItem('FTF_API', newApiKey);
        else {
            alert('Invalid API key entered!');
            return;
        }*/

        if (newLevel >= 0 && newLevel <= 100) localStorage.setItem('FTF_LEVEL', newLevel);
        else {
            alert('Invalid max level, please enter a value between 0 and 100!');
            return;
        }

        init();
        toggleSettings();
    }

    function findTarget() {
        if (!apiKey) {
            promptAPIKey();
            return;
        }

        initDB().then(() => {
            console.log("[FTF] Checking personal Target List first...");
            processTargetList(null, (targetID) => {
                if (!targetID) processUrls();
            });
        }).catch(err => {
            console.error("[FTF] Failed to initialize DB. Stat checking will be disabled.", err);
            processTargetList(null, (targetID) => {
                if (!targetID) processUrls();
            });
        });
    }

    async function filterAndSelectTarget(potentialTargets) {
        if (potentialTargets.length === 0) return null;

        const useStatFilter = ffScouterApiKey && (maxStats > 0 || minStats > 0);

        if (!useStatFilter) {
            const target = randTarget ? potentialTargets[Math.floor(Math.random() * potentialTargets.length)] : potentialTargets[0];
            return target.id || target;
        }

        const targetIds = potentialTargets.map(t => t.id || t);

        try {
            const cachedStats = await getStatsFromDB(targetIds);
            const idsToFetch = targetIds.filter(id => !cachedStats[id]);

            if (idsToFetch.length > 0) {
                console.log(`[FTF] Fetching stats for ${idsToFetch.length} users from FFScouter.`);
                const fetchedStats = await fetchFFScouterStats(idsToFetch);
                if (fetchedStats.length > 0) await saveStatsToDB(fetchedStats);
                fetchedStats.forEach(data => cachedStats[data.player_id] = { stats: data });
            }

            const finalTargets = potentialTargets.filter(target => {
                const id = target.id || target;
                const statInfo = cachedStats[id];

                if (!statInfo || !statInfo.stats || statInfo.stats.bs_estimate === undefined) return true;

                const estimate = statInfo.stats.bs_estimate;
                const passesMax = maxStats > 0 ? estimate <= maxStats : true;
                const passesMin = minStats > 0 ? estimate >= minStats : true;
                return passesMax && passesMin;
            });

            if (finalTargets.length === 0) return null;

            const finalTarget = randTarget ? finalTargets[Math.floor(Math.random() * finalTargets.length)] : finalTargets[0];
            return finalTarget.id || finalTarget;
        } catch (error) {
            console.error("[FTF] Error during stat filtering, skipping.", error);
            const fallbackTarget = randTarget ? potentialTargets[Math.floor(Math.random() * potentialTargets.length)] : potentialTargets[0];
            return fallbackTarget.id || fallbackTarget;
        }
    }

    function processTargetList(url, callback) {
        const apiUrl = url || `https://api.torn.com/v2/user/list?cat=Targets&timestamp=${Date.now()}&striptags=true&limit=50&sort=ASC&key=${apiKey}`;
        console.log("[FTF] Fetching target list from:", apiUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload(response) {
                const data = JSON.parse(response.responseText);

                if (data.error) {
                    console.error("[FTF] Failed fetching Target List, reason:", data.error.error);
                    return callback(null);
                }

                const targets = data.list || [];
                const suitableTargets = targets.filter(user => user.level <= maxLevel && user.status.state === "Okay");

                filterAndSelectTarget(suitableTargets).then(targetId => {
                    if (targetId) {
                        console.log(`[FTF] Suitable target found: ${targetId}. Stopping search.`);
                        openTargetPage(targetId);
                        return callback(targetId);
                    }

                    const nextUrl = data._metadata?.links?.next;

                    if (nextUrl) {
                        console.log("[FTF] No suitable target on this page. Fetching next page...");
                        processTargetList(nextUrl, callback);
                    } else {
                        console.log("[FTF] No suitable target found after checking all pages.");
                        return callback(null);
                    }
                });
            },
            onerror(error) {
                console.error("[FTF] Error loading Target List URL:", error);
                return callback(null);
            }
        });
    }

    function processUrls(index = 0, checked = new Set()) {
        if (facIDs.length === 0) {
            alert("Your faction list is empty. Please add some faction IDs in the settings panel.");
            return;
        }

        if (checked.size >= facIDs.length) {
            console.log("[FTF] No players met the conditions in any faction. Using failsafe random target.");
            openRandomNoApiTarget();
            return;
        }

        if (randFaction) {
            do {
                index = Math.floor(Math.random() * facIDs.length);
            } while (checked.has(index));
        }

        checked.add(index);

        const url = `https://api.torn.com/faction/${facIDs[index]}?selections=basic&timestamp=${Date.now()}&key=${apiKey}`;
        console.log(`[FTF] Checking faction ID: ${facIDs[index]}`);

        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload(response) {
                const roster = JSON.parse(response.responseText);
                const potentialTargets = checkCondition(roster);

                if (potentialTargets && potentialTargets.length > 0) {
                    filterAndSelectTarget(potentialTargets).then(targetId => {
                        if (targetId) openTargetPage(targetId);
                        else processUrls(index + 1, checked);
                    });
                } else {
                    processUrls(index + 1, checked);
                }
            },
            onerror() {
                console.log(`[FTF] Error loading URL: ${url}`);
                processUrls(index + 1, checked);
            }
        });
    }

    function checkCondition(roster) {
        if ("error" in roster) {
            console.log("[FTF] Failed fetching faction roster, reason:", roster.error.error);
            return [];
        }

        return Object.keys(roster.members).filter(userId => {
            const member = roster.members[userId];
            return member.level <= maxLevel && member.status.state === "Okay" && member.days_in_faction >= 15;
        });
    }

    function openTargetPage(targetId) {
        let profileLink;
        if (attackLink) profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}`;
        else profileLink = `https://www.torn.com/profiles.php?XID=${targetId}`;

        if (newTab) window.open(profileLink, '_blank');
        else window.location.href = profileLink;
    }

    function openRandomNoApiTarget() {
        const randomID = Math.floor(Math.random() * (NO_API_MAX_ID - NO_API_MIN_ID + 1)) + NO_API_MIN_ID;
        openTargetPage(randomID);
    }

    function toggleContainer() {
        const container = document.querySelector('.ftf-container');
        const toggleBtn = document.querySelector('.ftf-toggle-btn');
        if (!container || !toggleBtn) return;
        const isCollapsed = container.classList.toggle('ftf-collapsed');
        localStorage.setItem('FTF_COLLAPSED', isCollapsed);
        toggleBtn.textContent = isCollapsed ? '<' : '>';
    }

    const findBtn = createButton('Find Target', 'ftf-btn', findTarget);
    const chainSaveBtn = createButton('Chain Save', 'ftf-chain-save', openRandomNoApiTarget);
    const settBtn = createButton('Settings', 'ftf-settings', toggleSettings);
    const toggleBtn = createButton('>', 'ftf-toggle-btn', toggleContainer);
    const buttonWrapper = createDiv('ftf-button-wrapper');
    buttonWrapper.append(chainSaveBtn, findBtn, settBtn);

    const container = createDiv('ftf-container');
    container.append(toggleBtn, buttonWrapper);
    document.body.appendChild(container);

    if (localStorage.getItem('FTF_COLLAPSED') === 'true') {
        container.classList.add('ftf-collapsed');
        toggleBtn.textContent = '<';
    }

    let settingsModal;
    createSettingsModal();
    function createSettingsModal() {
        const modalOverlay = createDiv('ftf-modal-overlay');
        modalOverlay.id = 'ftf-settings-modal';
        modalOverlay.style.display = 'none';

        const modalContent = createDiv('ftf-modal-content');
        const modalBody = createDiv('ftf-modal-body');

        const appendElements = (parent, ...elements) => {
            const tempDiv = document.createElement('div');
            tempDiv.classList.add('ftf-settings-row');
            elements.forEach(el => tempDiv.append(el));
            parent.append(tempDiv);
        };

        const { input: apiKeyInput, label: apiKeyLabel } = createInput('ftf-api', "API Key (Limited)", apiKey || '', "text");
        appendElements(modalBody, apiKeyLabel, apiKeyInput);

        const { input: ffApiInput, label: ffApiLabel } = createInput('ftf-ff-api', "FFScouter Key", ffScouterApiKey, "text");
        appendElements(modalBody, ffApiLabel, ffApiInput);

        const { input: maxInput, label: maxLabel } = createInput('ftf-max-level', "Max Level", maxLevel, "number");
        appendElements(modalBody, maxLabel, maxInput);

        const { input: minStatsInput, label: minStatsLabel } = createInput('ftf-min-stats', "Min Stats (k,m,b)", localStorage.getItem('FTF_MIN_STATS') || minStats, "text");
        appendElements(modalBody, minStatsLabel, minStatsInput);

        const { input: maxStatsInput, label: maxStatsLabel } = createInput('ftf-max-stats', "Max Stats (k,m,b)", localStorage.getItem('FTF_MAX_STATS') || maxStats, "text");
        appendElements(modalBody, maxStatsLabel, maxStatsInput);

        const addFactionWrapper = createDiv('ftf-settings-row');
        const addFactionLabel = document.createElement('label');
        addFactionLabel.textContent = 'Faction List';
        const addControlsDiv = createDiv('ftf-add-controls');
        const { input: addFactionInput } = createInput('ftf-add-faction-id', '', '', "number");
        addFactionInput.placeholder = 'Add ID...';

        const addFactionBtn = createButton('Add', 'ftf-add-btn', () => {
            const newId = parseInt(addFactionInput.value, 10);
            if (newId && !isNaN(newId) && newId > 0) {
                if (!facIDs.includes(newId)) {
                    facIDs.push(newId);
                    renderFactionList();
                    addFactionInput.value = '';
                } else { alert('That faction ID is already in the list.'); }
            } else { alert('Please enter a valid faction ID.'); }
        });
        addControlsDiv.append(addFactionInput, addFactionBtn);
        addFactionWrapper.append(addFactionLabel, addControlsDiv);
        modalBody.append(addFactionWrapper);

        const factionListContainer = createDiv('ftf-faction-list-container');
        factionListContainer.id = 'ftf-faction-list-container';
        const factionListRow = createDiv('ftf-settings-row');
        factionListRow.append(factionListContainer);
        modalBody.append(factionListRow);

        function renderFactionList() {
            factionListContainer.innerHTML = '';
            if (facIDs.length === 0) {
                factionListContainer.textContent = 'No factions in list.';
                return;
            }
            facIDs.forEach(id => {
                const item = document.createElement('div');
                item.className = 'ftf-faction-item';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = id;
                item.appendChild(nameSpan);
                const removeBtn = createButton('✖', 'ftf-remove-btn', () => {
                    const index = facIDs.indexOf(id);
                    if (index > -1) facIDs.splice(index, 1);
                    renderFactionList();
                });
                item.appendChild(removeBtn);
                factionListContainer.appendChild(item);
            });
        }

        const { checkbox: profileCheckbox, label: profileLabel } = createCheckbox('ftf-profile', "Open directly to attack page?", attackLink);
        appendElements(modalBody, profileCheckbox, profileLabel);

        const { checkbox: tabCheckbox, label: tabLabel } = createCheckbox('ftf-newtab', "Open in new tab?", newTab);
        appendElements(modalBody, tabCheckbox, tabLabel);

        const { checkbox: randomFCheckbox, label: randomFLabel } = createCheckbox('ftf-random-faction', "Check random faction first?", randFaction);
        appendElements(modalBody, randomFCheckbox, randomFLabel);

        const { checkbox: randomTCheckbox, label: randomTLabel } = createCheckbox('ftf-random-target', "Select random target from list?", randTarget);
        appendElements(modalBody, randomTCheckbox, randomTLabel);

        const buttonContainer = createDiv('ftf-modal-buttons');
        const saveBtn = createButton('Save', 'ftf-save', changeSettings);
        const closeBtn = createButton('Close', 'ftf-close', toggleSettings);
        buttonContainer.append(saveBtn, closeBtn);

        modalContent.append(modalBody);
        modalContent.append(buttonContainer);
        modalOverlay.append(modalContent);
        document.body.appendChild(modalOverlay);
        settingsModal = modalOverlay;
        renderFactionList();
    }

    function toggleSettings() {
        if (!settingsModal) return;
        settingsModal.style.display = settingsModal.style.display === 'none' ? 'flex' : 'none';
    }

    function updateTimerColor(timerElement) {
        const wrapper = timerElement.parentNode;
        if (!wrapper || !wrapper.classList.contains('ftf-timer-wrapper')) return;

        const timeText = timerElement.textContent;
        const parts = timeText.split(':').map(Number);
        if (parts.length !== 2) return;

        const [minutes, seconds] = parts;
        const totalSeconds = (minutes * 60) + seconds;

        wrapper.classList.remove('ftf-timer-red', 'ftf-timer-yellow', 'ftf-timer-green');

        if (totalSeconds == 0) return
        else if (totalSeconds < 60) wrapper.classList.add('ftf-timer-red');
        else if (totalSeconds <= 180) wrapper.classList.add('ftf-timer-yellow');
        else wrapper.classList.add('ftf-timer-green');
    }

    const chainBarObserver = new MutationObserver((mutations, obs) => {
        const timerElement = document.querySelector('.bar-timeleft___B9RGV');
        if (timerElement) {
            timerElement.addEventListener('click', openRandomNoApiTarget);

            const timerWrapper = document.createElement('div');
            timerWrapper.className = 'ftf-timer-wrapper';
            timerElement.parentNode.insertBefore(timerWrapper, timerElement);
            timerWrapper.appendChild(timerElement);

            const timerTextObserver = new MutationObserver(() => updateTimerColor(timerElement));
            timerTextObserver.observe(timerElement, { characterData: true, childList: true, subtree: true });

            updateTimerColor(timerElement);
            obs.disconnect();
        }
    });

    chainBarObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        .ftf-container {
            display: grid;
            grid-template-columns: auto auto;
            gap: 0;
            position: fixed;
            top: 40%;
            right: 0;
            z-index: 9999;
            background-color: transparent;
            border-radius: 5px;
            transition: right 0.3s ease-in-out;
        }

        .ftf-button-wrapper {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .ftf-container.ftf-collapsed .ftf-button-wrapper {
            display: none;
        }

        .ftf-toggle-btn {
            border: 1px solid #666;
            margin-right: 3px;
            color: #ccc;
            border-radius: 5px;
            cursor: pointer;
        }

        .ftf-toggle-btn:hover {
            background: #555;
        }

        .ftf-btn,
        .ftf-settings,
        .ftf-chain-save {
            font-size: 1em;
            padding: 5px 12px;
            cursor: pointer;
            border: 1px solid #666;
            border-radius: 5px;
            color: #ddd;
            text-shadow: 1px 1px 1px #000;
        }

        .ftf-btn {
            background: #5a5a5a;
        }

        .ftf-btn:hover {
            background: #6b6b6b;
        }

        .ftf-settings {
            background: #222;
        }

        .ftf-settings:hover {
            background: #333
        }

        .ftf-chain-save {
            background: #7a5a00;
        }

        .ftf-chain-save:hover {
            background: #8b6b00;
        }

        .ftf-modal-overlay {
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ftf-modal-content {
            color: #ccc;
            background: #111;
            border-radius: 8px;
            max-width: 450px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .ftf-modal-body {
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow-y: auto;
            flex: 1;
        }

        .ftf-settings-row {
            display: grid;
            gap: 7px;
            align-items: center;
        }

        .ftf-settings-row label {
            color: orange;
        }

        #ftf-api,
        #ftf-ff-api,
        #ftf-max-level,
        #ftf-max-stats,
        #ftf-min-stats,
        #ftf-add-faction-id {
            background-color: transparent;
            border: 1px solid #444;
            color: white;
            padding: 5px;
            border-radius: 4px;
            text-align: left;
        }

        .ftf-settings-row input[type="checkbox"] {
            display: none;
        }

        .ftf-settings-row input[type="checkbox"]+label {
            position: relative;
            padding-left: 25px;
            cursor: pointer;
            color: white;
            font-size: 1em;
        }

        .ftf-settings-row input[type="checkbox"]+label:before {
            content: '';
            position: absolute;
            left: 0;
            width: 16px;
            height: 16px;
            border: 1px solid #444;
            border-radius: 5px;
        }

        .ftf-settings-row input[type="checkbox"]:checked+label:after {
            content: '✔';
            position: absolute;
            left: 4px;
            top: 1px;
            font-size: 1em;
            color: green;
        }

        #ftf-faction-list-container {
            background: #222;
            border: 1px solid #444;
            padding: 5px;
            border-radius: 4px;
            max-height: 130px;
            overflow-y: auto;
            grid-column: 1 / -1;
        }

        .ftf-faction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px;
            border-bottom: 1px solid #333;
            font-size: 1em;
        }

        .ftf-faction-item:last-child {
            border-bottom: none;
        }

        .ftf-add-controls {
            display: flex;
            gap: 5px;
        }

        #ftf-add-faction-id {
            flex-grow: 1;
        }

        .ftf-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid #555;
            padding: 10px;
            background: #222;
            border-radius: 0 0 8px 8px;
        }

        .ftf-save,
        .ftf-close,
        .ftf-add-btn,
        .ftf-remove-btn {
            padding: 6px 15px;
            cursor: pointer;
            border-radius: 5px;
            text-shadow: 1px 1px 1px #000;
        }

        .ftf-save {
            color: #fff;
            background: #507b34;
            border: 1px solid #365223;
        }

        .ftf-save:hover {
            background: #5c8f3c;
        }

        .ftf-close {
            color: #ddd;
            background: #5a5a5a;
            border: 1px solid #333;
        }

        .ftf-close:hover {
            background: #6b6b6b;
        }

        .ftf-add-btn {
            padding: 6px 10px;
            color: #fff;
            background: #34687b;
            border: 1px solid #234752;
        }

        .ftf-add-btn:hover {
            background: #3c7a8f;
        }

        .ftf-remove-btn {
            padding: 2px 8px;
            font-size: 1.1em;
            color: #fff;
            background: #9d2f2f;
            border: 1px solid #712020;
        }

        .ftf-remove-btn:hover {
            background: #b13535;
        }

        .bar-stats___E_LqA {
            display: block !important;
        }

        .ftf-timer-wrapper {
            display: inline-block;
            border-radius: 8px;
            padding: 3px 5px;
            transition: all 0.3s ease;
        }

        .bar-timeleft___B9RGV {
            font-size: 60px;
            cursor: pointer;
            transition: color 0.3s;
        }

        .ftf-timer-green {
            color: #4CAF50 !important;
            background-color: rgba(76, 175, 80, 0.2) !important;
        }

        .ftf-timer-yellow {
            color: #FFC107 !important;
            background-color: rgba(255, 193, 7, 0.2) !important;
        }

        .ftf-timer-red {
            color: #F44336 !important;
            background-color: rgba(244, 67, 54, 0.3);
            animation: pulse-red 3s infinite;
        }

        @keyframes pulse-red {
            0% {
                background-color: rgba(244, 67, 54, 0.3);
            }

            50% {
                background-color: rgba(244, 67, 54, 0.6);
            }

            100% {
                background-color: rgba(244, 67, 54, 0.3);
            }
        }
    `);

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function createDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    function createInput(id, text, value, type) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;
        return { input, label };
    }

    function createCheckbox(id, text, value) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = value;
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;
        return { checkbox, label };
    }
})();