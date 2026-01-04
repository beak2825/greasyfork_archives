// ==UserScript==
// @name         Torn Profile Link Formatter
// @namespace    GNSC4 [268863]
// @version      1.6.6
// @description  Adds a copy button next to user names on profile, faction, and ranked war pages for easy sharing.
// @author       GNSC4 [268863]
// @match        https://www.torn.com/profiles.php?XID=*
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/539504/Torn%20Profile%20Link%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/539504/Torn%20Profile%20Link%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global cache for live hospital data ---
    let hospTime = {};
    const debug = true; // Set to true for verbose logging

    // --- GM Polyfills for environments without native support ---
    const GNSC_setValue = typeof GM_setValue !== 'undefined' ? GM_setValue : (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const GNSC_getValue = typeof GM_getValue !== 'undefined' ? GM_getValue : (key, def) => JSON.parse(localStorage.getItem(key)) || def;

    // --- Add Styles for the UI ---
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(`
            .gnsc-copy-container { display: inline-flex; align-items: center; vertical-align: middle; gap: 5px; margin-left: 10px; }
            .gnsc-btn { background-color: #333; color: #DDD; border: 1px solid #555; border-radius: 5px; padding: 3px 8px; text-decoration: none; font-size: 12px; line-height: 1.5; font-weight: bold; cursor: pointer; white-space: nowrap; }
            .gnsc-btn:hover { background-color: #444; }
            .gnsc-list-btn { margin-left: 5px; cursor: pointer; font-size: 14px; display: inline-block; vertical-align: middle; width: 18px; text-align: center; }
            .gnsc-faction-copy-btn { margin-left: 8px; cursor: pointer; font-size: 14px; vertical-align: middle; }
            .gnsc-settings-panel { display: none; position: absolute; background-color: #2c2c2c; border: 1px solid #555; border-radius: 5px; padding: 10px; z-index: 1000; top: 100%; left: 0; min-width: 220px; }
            .gnsc-settings-panel div { margin-bottom: 5px; display: flex; align-items: center; }
            .gnsc-settings-panel label { color: #DDD; flex-grow: 1; }
            .gnsc-settings-panel input[type="checkbox"] { margin-left: 5px; }
            .gnsc-settings-panel label.disabled { color: #888; }
            .gnsc-settings-container { position: relative; }
            .gnsc-api-key-wrapper { display: flex; flex-direction: column; align-items: flex-start !important; }
            .gnsc-api-key-wrapper label { margin-bottom: 4px; }
            .gnsc-api-key-input-wrapper { display: flex; width: 100%; }
            .gnsc-api-key-input { width: 100%; background-color: #1e1e1e; border: 1px solid #555; color: #ddd; border-radius: 3px; padding: 2px 4px;}
            #gnsc-show-api-key-btn { font-size: 10px; margin-left: 4px; padding: 2px 4px; }
            .buttons-list .gnsc-list-btn { padding: 4px; font-size: 16px; height: 34px; line-height: 26px; } /* Mini profile button style */
            #gnsc-battlestats-format-wrapper { flex-direction: column; align-items: flex-start; margin-top: 8px; }
            #gnsc-battlestats-format-wrapper label { margin-bottom: 4px; }
            #gnsc-select-battlestats-format { background-color: #1e1e1e; border: 1px solid #555; color: #ddd; border-radius: 3px; padding: 2px 4px; width: 100%; }
        `);
    }

    // --- Page Initialization Logic ---

    function initProfilePage() {
        const nameElement = document.querySelector('#skip-to-content');
        const infoTable = document.querySelector('.basic-information .info-table');
        const alreadyInjected = document.querySelector('.gnsc-copy-container');
        if (nameElement && infoTable && infoTable.children.length > 5 && !alreadyInjected) {
            mainProfile(nameElement, infoTable);
            return true;
        }
        return false;
    }

    function initFactionPage() {
        const memberLists = document.querySelectorAll('.members-list, .enemy-list, .your-faction');
        if (memberLists.length > 0) {
            memberLists.forEach(list => injectButtonsIntoList(list));
            return true;
        }
        return false;
    }

    function initRankedWarPage() {
        const factionNames = document.querySelectorAll('.faction-names .name___PlMCO');
        factionNames.forEach(nameDiv => {
            if (!nameDiv.querySelector('.gnsc-faction-copy-btn')) {
                const button = document.createElement('span');
                button.className = 'gnsc-faction-copy-btn';
                button.textContent = '📋';
                button.title = 'Copy Faction Member List';
                button.addEventListener('click', (e) => handleFactionCopyClick(e, button, nameDiv.classList.contains('left')));
                nameDiv.querySelector('.text___chra_').appendChild(button);
            }
        });
    }

    function initMiniProfile() {
        const miniProfile = document.querySelector('.profile-mini-_wrapper___Arw8R:not(.gnsc-injected), .mini-profile-wrapper:not(.gnsc-injected)');
        if (miniProfile) {
            miniProfile.classList.add('gnsc-injected');
            let attempts = 0;
            const maxAttempts = 25; // Try for 5 seconds
            const interval = setInterval(() => {
                const buttonContainer = miniProfile.querySelector('.buttons-list');
                const nameLink = miniProfile.querySelector('a[href*="profiles.php?XID="]');
                if (buttonContainer && nameLink && !buttonContainer.querySelector('.gnsc-list-btn')) {
                    clearInterval(interval);
                    const button = document.createElement('span');
                    button.className = 'gnsc-list-btn';
                    button.textContent = '📄';
                    button.title = 'Copy Formatted Link';
                    button.addEventListener('click', (e) => handleListCopyClick(e, button, miniProfile));
                    buttonContainer.insertAdjacentElement('beforeend', button);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                }
                attempts++;
            }, 200);
        }
    }

    function injectButtonsIntoList(listElement) {
        const members = listElement.querySelectorAll('li.member, li.table-row, li.enemy, li.your');
        members.forEach(member => {
            const nameLink = member.querySelector('a[href*="profiles.php"]');
            if (nameLink && !member.querySelector('.gnsc-list-btn')) {
                const button = document.createElement('span');
                button.className = 'gnsc-list-btn';
                button.textContent = '📄';
                button.title = 'Copy Formatted Link';
                button.addEventListener('click', (e) => handleListCopyClick(e, button, member));
                nameLink.insertAdjacentElement('afterend', button);
            }
        });
    }

    // --- Profile Page Specific Functions ---

    function mainProfile(nameElement, infoTable) {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('XID');
        if (!userId) return;

        const cleanedName = nameElement.textContent.replace("'s Profile", "").split(' [')[0].trim();
        let factionLinkEl = null;
        let companyLinkEl = null;
        let activityStatus = 'Offline';

        const infoListItems = infoTable.querySelectorAll('li');
        infoListItems.forEach(item => {
            const titleEl = item.querySelector('.user-information-section .bold');
            if (!titleEl) return;
            const title = titleEl.textContent.trim();
            if (title === 'Faction') factionLinkEl = item.querySelector('.user-info-value a');
            if (title === 'Job') companyLinkEl = item.querySelector('.user-info-value a');
        });

        const statusIconEl = document.querySelector('li[id^="icon1-profile-"], li[id^="icon2-profile-"], li[id^="icon62-profile-"]');
        if (statusIconEl) {
            if (statusIconEl.className.includes('-Online')) activityStatus = 'Online';
            else if (statusIconEl.className.includes('-Away')) activityStatus = 'Idle';
        }

        const statusDescEl = document.querySelector('.profile-status.hospital .main-desc');
        const isInHospital = !!statusDescEl;
        const hospitalTimeStr = isInHospital ? statusDescEl.textContent.trim().replace(/\s+/g, ' ') : null;

        const userInfo = {
            id: userId,
            name: cleanedName,
            profileUrl: `https://www.torn.com/profiles.php?XID=${userId}`,
            attackUrl: `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${userId}`,
            factionUrl: factionLinkEl ? factionLinkEl.href : null,
            companyUrl: companyLinkEl ? companyLinkEl.href : null,
            activityStatus: activityStatus,
            isInHospital: isInHospital,
            hospitalTimeStr: hospitalTimeStr
        };

        createUI(nameElement, userInfo);
    }

    function createUI(targetElement, userInfo) {
        const container = document.createElement('div');
        container.className = 'gnsc-copy-container';

        const copyButton = document.createElement('a');
        copyButton.href = "#";
        copyButton.className = 'gnsc-btn';
        copyButton.innerHTML = '<span>Copy</span>';
        copyButton.addEventListener('click', (e) => handleCopyClick(e, copyButton, userInfo));

        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'gnsc-settings-container';

        const settingsButton = document.createElement('a');
        settingsButton.href = "#";
        settingsButton.className = 'gnsc-btn';
        settingsButton.innerHTML = '⚙️';

        const settingsPanel = createSettingsPanel(userInfo);
        settingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!settingsContainer.contains(e.target)) {
                settingsPanel.style.display = 'none';
            }
        });

        settingsContainer.appendChild(settingsButton);
        settingsContainer.appendChild(settingsPanel);
        container.appendChild(copyButton);
        container.appendChild(settingsContainer);
        targetElement.insertAdjacentElement('afterend', container);
    }

    function createSettingsPanel(userInfo) {
        const panel = document.createElement('div');
        panel.className = 'gnsc-settings-panel';
        const settings = loadSettings();

        const apiKeyWrapper = document.createElement('div');
        apiKeyWrapper.className = 'gnsc-api-key-wrapper';
        apiKeyWrapper.innerHTML = `<label for="gnsc-api-key">TornStats API Key</label>`;
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'gnsc-api-key-input-wrapper';

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'password';
        apiKeyInput.id = 'gnsc-api-key';
        apiKeyInput.className = 'gnsc-api-key-input';
        apiKeyInput.value = settings.apiKey || '';
        apiKeyInput.addEventListener('input', () => {
            updateBattleStatsAvailability();
            saveSettings();
        });

        const showApiKeyBtn = document.createElement('button');
        showApiKeyBtn.id = 'gnsc-show-api-key-btn';
        showApiKeyBtn.className = 'gnsc-btn';
        showApiKeyBtn.textContent = 'Show';
        showApiKeyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
            showApiKeyBtn.textContent = apiKeyInput.type === 'password' ? 'Show' : 'Hide';
        });

        inputWrapper.appendChild(apiKeyInput);
        inputWrapper.appendChild(showApiKeyBtn);
        apiKeyWrapper.appendChild(inputWrapper);
        panel.appendChild(apiKeyWrapper);
        panel.appendChild(document.createElement('hr'));

        const options = [
            { key: 'attack', label: 'Attack', available: true },
            { key: 'activity', label: 'Activity Status', available: true },
            { key: 'faction', label: 'Faction', available: !!userInfo.factionUrl },
            { key: 'company', label: 'Company', available: !!userInfo.companyUrl },
            { key: 'timeRemaining', label: 'Time Remaining', available: userInfo.isInHospital },
            { key: 'releaseTime', label: 'Release Time (TCT)', available: userInfo.isInHospital },
            { key: 'battlestats', label: 'Battle Stats', available: true }
        ];

        options.forEach(option => {
            const wrapper = document.createElement('div');
            const checkbox = document.createElement('input');
            const label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.id = `gnsc-check-${option.key}`;
            checkbox.checked = option.available && settings[option.key];
            checkbox.disabled = !option.available;
            checkbox.addEventListener('change', () => {
                if (option.key === 'battlestats') {
                    updateBattleStatsAvailability();
                }
                saveSettings();
            });

            label.htmlFor = `gnsc-check-${option.key}`;
            label.textContent = option.label;
            if (!option.available) label.classList.add('disabled');

            wrapper.appendChild(label);
            wrapper.appendChild(checkbox);
            panel.appendChild(wrapper);
        });

        const formatWrapper = document.createElement('div');
        formatWrapper.id = 'gnsc-battlestats-format-wrapper';
        formatWrapper.style.display = 'none'; // Initially hidden

        const formatLabel = document.createElement('label');
        formatLabel.htmlFor = 'gnsc-select-battlestats-format';
        formatLabel.textContent = 'Stat Display Format';

        const formatSelect = document.createElement('select');
        formatSelect.id = 'gnsc-select-battlestats-format';
        formatSelect.innerHTML = `
            <option value="all">All Stats</option>
            <option value="highest">Highest Stat & Total</option>
            <option value="total">Total Only</option>
        `;
        formatSelect.value = settings.battleStatsFormat;
        formatSelect.addEventListener('change', saveSettings);

        formatWrapper.appendChild(formatLabel);
        formatWrapper.appendChild(formatSelect);
        panel.appendChild(formatWrapper);

        updateBattleStatsAvailability();
        return panel;
    }

    // --- Action Handlers ---

    async function handleCopyClick(e, button, userInfo) {
        e.preventDefault();
        const settings = loadSettings();
        let battleStatsStr = null;
        let hospitalStr = null;
        let statusEmoji = '';

        if (settings.activity) {
            statusEmoji = userInfo.activityStatus === 'Online' ? '🟢 ' : (userInfo.activityStatus === 'Idle' ? '🟡 ' : '⚫ ');
        }

        const releaseTimestamp = hospTime[userInfo.id] || null;
        if (releaseTimestamp) {
            const timeParts = [];
            if (settings.timeRemaining) {
                const remainingSeconds = releaseTimestamp - (Date.now() / 1000);
                if (remainingSeconds > 0) timeParts.push(`In hospital for ${formatRemainingTime(remainingSeconds)}`);
            }
            if (settings.releaseTime) {
                const releaseDate = new Date(releaseTimestamp * 1000);
                const tctTimeString = releaseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' });
                timeParts.push(`Out at ${tctTimeString} TCT`);
            }
            if (timeParts.length > 0) hospitalStr = `(${timeParts.join(' | ')})`;
        } else if (userInfo.hospitalTimeStr && settings.timeRemaining) {
            hospitalStr = `(${userInfo.hospitalTimeStr})`;
        }

        if (settings.battlestats && settings.apiKey) {
            button.innerHTML = '<span>Fetching...</span>';
            try {
                const spyData = await fetchTornStatsSpy(settings.apiKey, userInfo.id);
                if (spyData?.spy?.status === true) {
                    battleStatsStr = formatBattleStatsString(spyData.spy, settings.battleStatsFormat);
                } else {
                    battleStatsStr = "(Stats: N/A)";
                }
            } catch (error) {
                if (debug) console.error("Torn Profile Link Formatter: Failed to fetch TornStats data.", error);
                battleStatsStr = "(Stats: API Error)";
            }
        }

        const linkedName = `<a href="${userInfo.profileUrl}">${userInfo.name} [${userInfo.id}]</a>`;
        const details = [];
        if (settings.attack) details.push(`<a href="${userInfo.attackUrl}">Attack</a>`);
        if (settings.faction && userInfo.factionUrl) details.push(`<a href="${userInfo.factionUrl}">Faction</a>`);
        if (settings.company && userInfo.companyUrl) details.push(`<a href="${userInfo.companyUrl}">Company</a>`);
        if (hospitalStr) details.push(hospitalStr);
        if (battleStatsStr) details.push(battleStatsStr);

        copyToClipboard(details.length > 0 ? `${statusEmoji}${linkedName} - ${details.join(' - ')}` : `${statusEmoji}${linkedName}`);

        button.innerHTML = '<span>Copied!</span>';
        button.style.backgroundColor = '#2a633a';
        setTimeout(() => { button.innerHTML = '<span>Copy</span>'; button.style.backgroundColor = ''; }, 2000);
    }

    async function handleListCopyClick(e, button, memberElement) {
        e.preventDefault();
        e.stopPropagation();

        const nameLink = memberElement.querySelector('a[href*="profiles.php"]');
        if (!nameLink) return;

        const name = nameLink.textContent.trim();
        const idMatch = nameLink.href.match(/XID=(\d+)/);
        if (!idMatch) return;
        const id = idMatch[1];

        const settings = loadSettings();
        let statusEmoji = '';
        let healthStr = null;
        let battleStatsStr = null;

        if (settings.activity) {
            const statusEl = memberElement.querySelector('.userStatusWrap___ljSJG svg, li[class*="user-status-16-"]');
            statusEmoji = '⚫ '; // Default
            if (statusEl) {
                const className = statusEl.className.toString();
                if (className.includes('-Online') || statusEl.getAttribute('fill')?.includes('online')) statusEmoji = '🟢 ';
                else if (className.includes('-Away') || className.includes('-Idle') || statusEl.getAttribute('fill')?.includes('idle')) statusEmoji = '🟡 ';
            }
        }

        const releaseTimestamp = hospTime[id] || null;
        if (releaseTimestamp && (settings.timeRemaining || settings.releaseTime)) {
            const timeParts = [];
            if (settings.timeRemaining) {
                const remainingSeconds = releaseTimestamp - (Date.now() / 1000);
                if (remainingSeconds > 0) timeParts.push(`In hospital for ${formatRemainingTime(remainingSeconds)}`);
            }
            if(settings.releaseTime) {
                const releaseDate = new Date(releaseTimestamp * 1000);
                const tctTimeString = releaseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' });
                timeParts.push(`Out at ${tctTimeString} TCT`);
            }
            if (timeParts.length > 0) healthStr = `(${timeParts.join(' | ')})`;
        }

        if (settings.battlestats && settings.apiKey) {
            button.textContent = '...';
            try {
                const spyData = await fetchTornStatsSpy(settings.apiKey, id);
                if (spyData?.spy?.status === true) {
                    battleStatsStr = formatBattleStatsString(spyData.spy, settings.battleStatsFormat);
                } else {
                    battleStatsStr = "(Stats: N/A)";
                }
            } catch (error) {
                if (debug) console.error("Torn Profile Link Formatter: Failed to fetch TornStats data.", error);
                battleStatsStr = "(Stats: API Error)";
            }
        }

        const linkedName = `<a href="https://www.torn.com/profiles.php?XID=${id}">${name} [${id}]</a>`;
        const attackLink = `<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}">Attack</a>`;
        const details = [attackLink];
        if (healthStr) details.push(healthStr);
        if (battleStatsStr) details.push(battleStatsStr);

        copyToClipboard(`${statusEmoji}${linkedName} - ${details.join(' - ')}`);

        button.textContent = '✅';
        setTimeout(() => { button.textContent = '📄'; }, 1500);
    }

    async function handleFactionCopyClick(e, button, isLeftFaction) {
        e.preventDefault();
        e.stopPropagation();
        if (debug) console.log('[Faction Copy] Faction copy process started.');

        const settings = loadSettings();
        if (!settings.apiKey) {
            const originalText = button.textContent;
            button.textContent = '🔑';
            button.title = 'TornStats API key is required for this feature.';
            setTimeout(() => {
                button.textContent = '📋';
                button.title = 'Copy Faction Member List';
            }, 3000);
            return;
        }

        button.textContent = '...';

        const warInfo = document.querySelector('.faction-war-info');
        if (!warInfo) {
            if (debug) console.error('[Faction Copy] Could not find .faction-war-info container.');
            button.textContent = '❓';
            button.title = 'Could not find faction info container.';
            setTimeout(() => { button.textContent = '📋'; button.title = 'Copy Faction Member List'; }, 3000);
            return;
        }

        const factionLinks = warInfo.querySelectorAll('a[href*="factions.php?step=profile&ID="]');
        if (factionLinks.length < 2) {
            if (debug) console.error('[Faction Copy] Could not find both faction links in the header.');
            button.textContent = '❓';
            button.title = 'Could not find faction links.';
            setTimeout(() => { button.textContent = '📋'; button.title = 'Copy Faction Member List'; }, 3000);
            return;
        }

        const targetFactionLink = isLeftFaction ? factionLinks[0] : factionLinks[1];
        const factionIdMatch = targetFactionLink.href.match(/ID=(\d+)/);
        if (!factionIdMatch) {
            if (debug) console.error('[Faction Copy] Could not extract faction ID from link:', targetFactionLink.href);
            button.textContent = '❓';
            button.title = 'Could not parse faction ID.';
            setTimeout(() => { button.textContent = '📋'; button.title = 'Copy Faction Member List'; }, 3000);
            return;
        }
        const factionId = factionIdMatch[1];
        if (debug) console.log(`[Faction Copy] Identified Target Faction ID: ${factionId}`);

        const apiUrl = `https://www.tornstats.com/api/v2/${settings.apiKey}/spy/faction/${factionId}`;
        if (debug) console.log(`[Faction Copy] Fetching faction data from TornStats: ${apiUrl}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: (response) => {
                if (response.status !== 200) {
                    if (debug) console.error(`[Faction Copy] TornStats API responded with status: ${response.status}`);
                    button.textContent = '❌';
                    button.title = `TornStats API Error: ${response.status}`;
                    setTimeout(() => { button.textContent = '📋'; button.title = 'Copy Faction Member List'; }, 3000);
                    return;
                }

                if (debug) console.log('[Faction Copy] Received raw response from TornStats:', response.responseText);
                const data = JSON.parse(response.responseText);

                if (!data.status || !data.faction || !data.faction.members) {
                    if (debug) console.error('[Faction Copy] Invalid or unsuccessful response from TornStats API.', data);
                    button.textContent = '❓';
                    button.title = data.message || 'Invalid API response.';
                    setTimeout(() => { button.textContent = '📋'; button.title = 'Copy Faction Member List'; }, 3000);
                    return;
                }

                const members = data.faction.members;
                if (debug) console.log(`[Faction Copy] Found ${Object.keys(members).length} members in API response.`);
                let factionData = [];

                for (const id in members) {
                    const member = members[id];
                    const name = member.name;

                    let statsString = "(Stats: N/A)";
                    if (member.spy && typeof member.spy.total !== 'undefined') {
                        const spy = member.spy;
                        const str = `Str: ${formatNumber(spy.strength)}`;
                        const def = `Def: ${formatNumber(spy.defense)}`;
                        const spd = `Spd: ${formatNumber(spy.speed)}`;
                        const dex = `Dex: ${formatNumber(spy.dexterity)}`;
                        const total = `Total: ${formatNumber(spy.total)}`;
                        statsString = `(${str} | ${def} | ${spd} | ${dex} | ${total})`;
                    }

                    if (debug) console.log(`[Faction Copy] Processing member: ${name} [${id}], Stats: ${statsString}`);

                    const profileLink = `<a href="https://www.torn.com/profiles.php?XID=${id}">${name} [${id}]</a>`;
                    const attackLink = `<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}">Attack</a>`;
                    const dataString = `${profileLink} - ${attackLink} - ${statsString}`;

                    factionData.push(dataString);
                }

                const finalContent = factionData.join('<br><hr><br>');
                if (debug) console.log('[Faction Copy] Final content to be copied:\n', finalContent);
                copyToClipboard(finalContent);

                button.textContent = '✅';
                setTimeout(() => { button.textContent = '📋'; }, 2000);
            },
            onerror: (error) => {
                if (debug) console.error('[Faction Copy] Error calling TornStats API:', error);
                button.textContent = '❌';
                button.title = 'Error calling TornStats API.';
                setTimeout(() => { button.textContent = '📋'; button.title = 'Copy Faction Member List'; }, 3000);
            }
        });
    }

    // --- Utility Functions ---

    function formatBattleStatsString(spyResult, format) {
        if (!spyResult || typeof spyResult.total === 'undefined') return "(Stats: N/A)";

        const spyStr = `Spy: ${formatTimeDifference(spyResult.timestamp)}`;
        const totalStr = `Total: ${formatNumber(spyResult.total)}`;

        switch (format) {
            case 'highest':
                const stats = {
                    'Str': spyResult.strength,
                    'Def': spyResult.defense,
                    'Spd': spyResult.speed,
                    'Dex': spyResult.dexterity
                };
                const highestStatName = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
                const highestStatValue = formatNumber(stats[highestStatName]);
                return `(Highest: ${highestStatName} ${highestStatValue} | ${totalStr} | ${spyStr})`;

            case 'total':
                return `(${totalStr} | ${spyStr})`;

            case 'all':
            default:
                const str = `Str: ${formatNumber(spyResult.strength)}`;
                const def = `Def: ${formatNumber(spyResult.defense)}`;
                const spd = `Spd: ${formatNumber(spyResult.speed)}`;
                const dex = `Dex: ${formatNumber(spyResult.dexterity)}`;
                return `(${str} | ${def} | ${spd} | ${dex} | ${totalStr} | ${spyStr})`;
        }
    }

    function formatNumber(num) {
        if (num < 1e3) return num;
        if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(2) + "K";
        if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(2) + "M";
        if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(2) + "B";
        if (num >= 1e12 && num < 1e15) return +(num / 1e12).toFixed(2) + "T";
        if (num >= 1e15) return +(num / 1e15).toFixed(2) + "Q";
    };

    function formatRemainingTime(totalSeconds) {
        if (totalSeconds <= 0) return "0s";
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return [hours > 0 ? `${hours}h` : '', minutes > 0 ? `${minutes}m` : '', seconds > 0 ? `${seconds}s` : ''].filter(Boolean).join(' ');
    }

    function formatTimeDifference(timestamp) {
        const seconds = Math.floor(Date.now() / 1000) - timestamp;
        if (seconds < 60) return `${Math.floor(seconds)}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
        if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
        return `${Math.floor(seconds / 31536000)}y ago`;
    }

    function fetchTornStatsSpy(apiKey, userId, verbose = false) {
        const url = `https://www.tornstats.com/api/v2/${apiKey}/spy/user/${userId}`;
        if (debug && verbose) {
            console.log(`[TornStats Spy] Fetching URL: ${url}`);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    if (debug && verbose) {
                        console.log(`[TornStats Spy] Received raw response for ${userId}:`, response.responseText);
                    }
                    if (response.status === 200) {
                        try {
                            const parsed = JSON.parse(response.responseText);
                            if (debug && verbose) {
                                console.log(`[TornStats Spy] Parsed data for ${userId}:`, parsed);
                            }
                            resolve(parsed);
                        }
                        catch (e) {
                            reject(new Error("Failed to parse JSON from TornStats."));
                        }
                    } else {
                        reject(new Error(`API responded with status ${response.status}`));
                    }
                },
                onerror: (error) => reject(error)
            });
        });
    }

    function loadSettings() {
        return GNSC_getValue('tornProfileFormatterSettings', {
            attack: true, faction: false, company: false,
            timeRemaining: true, releaseTime: true,
            battlestats: false, activity: true, apiKey: '',
            battleStatsFormat: 'all'
        });
    }

    function updateBattleStatsAvailability() {
        const battleStatsCheckbox = document.getElementById('gnsc-check-battlestats');
        const battleStatsLabel = document.querySelector('label[for="gnsc-check-battlestats"]');
        const apiKeyInput = document.getElementById('gnsc-api-key');
        const formatWrapper = document.getElementById('gnsc-battlestats-format-wrapper');

        if (!battleStatsCheckbox || !battleStatsLabel || !apiKeyInput || !formatWrapper) return;

        const hasApiKey = !!apiKeyInput.value.trim();
        battleStatsCheckbox.disabled = !hasApiKey;
        battleStatsLabel.classList.toggle('disabled', !hasApiKey);

        if (!hasApiKey) battleStatsCheckbox.checked = false;

        const showFormatOptions = battleStatsCheckbox.checked && hasApiKey;
        formatWrapper.style.display = showFormatOptions ? 'flex' : 'none';
    }

    function saveSettings() {
        const apiKeyInput = document.getElementById('gnsc-api-key');
        const hasApiKey = !!(apiKeyInput && apiKeyInput.value.trim());

        const settings = {
            attack: document.getElementById('gnsc-check-attack').checked,
            faction: document.getElementById('gnsc-check-faction')?.checked || false,
            company: document.getElementById('gnsc-check-company')?.checked || false,
            timeRemaining: document.getElementById('gnsc-check-timeRemaining')?.checked || false,
            releaseTime: document.getElementById('gnsc-check-releaseTime')?.checked || false,
            activity: document.getElementById('gnsc-check-activity').checked,
            battlestats: hasApiKey && document.getElementById('gnsc-check-battlestats')?.checked || false,
            apiKey: apiKeyInput?.value || '',
            battleStatsFormat: document.getElementById('gnsc-select-battlestats-format')?.value || 'all'
        };
        GNSC_setValue('tornProfileFormatterSettings', settings);
    }

    function copyToClipboard(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.left = '-9999px';
        tempTextarea.value = text;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            if (debug) console.error('Torn Profile Link Formatter: Clipboard copy failed.', err);
        }
        document.body.removeChild(tempTextarea);
    }


    // --- Script Entry Point ---
    const observer = new MutationObserver(() => {
        if (window.location.href.includes('profiles.php')) {
            initProfilePage();
        } else if (window.location.href.includes('factions.php')) {
            initFactionPage();
            initRankedWarPage();
        }
        initMiniProfile();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- Live Data Interception ---
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (...args) => {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        const isKnownDataSource = url.includes("step=getwarusers") || url.includes("step=getProcessBarRefreshData") || url.includes("sidebarAjaxAction.php?q=sync");

        if (!isKnownDataSource) return originalFetch(...args);

        const response = await originalFetch(...args);
        const clone = response.clone();

        clone.json().then(json => {
            let members = null;
            if (json.warDesc?.members) members = json.warDesc.members;
            else if (json.userStatuses) members = json.userStatuses;
            else if (json.status?.bar?.hospital?.end) {
                const userId = json.user?.userID;
                if (userId) hospTime[userId] = json.status.bar.hospital.end;
                return;
            } else if (json.user?.userID) {
                const userId = json.user.userID;
                if (hospTime[userId]) delete hospTime[userId];
                return;
            } else return;

            Object.keys(members).forEach((id) => {
                const status = members[id].status || members[id];
                const userId = members[id].userID || id;
                if (status.text === "Hospital") {
                    hospTime[userId] = status.updateAt;
                } else if (hospTime[userId]) {
                   delete hospTime[userId];
                }
            });
        }).catch(err => { if (debug) console.error("Torn Profile Link Formatter: Error parsing fetch JSON.", err)});

        return response;
    };
})();