// ==UserScript==
// @name         MZ - NT Challenges
// @namespace    douglaskampl
// @version      2.0
// @description  Sends NT challenges and notifies about incoming challenges
// @author       Douglas
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @connect      pub-02de1c06eac643f992bb26daeae5c7a0.r2.dev
// @connect      www.managerzone.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522955/MZ%20-%20NT%20Challenges.user.js
// @updateURL https://update.greasyfork.org/scripts/522955/MZ%20-%20NT%20Challenges.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_PREFIX = '[NT-CHALLENGER]';

    const dataManager = {
        cachedCountries: null,
        endpoints: {
            countries: 'https://pub-02de1c06eac643f992bb26daeae5c7a0.r2.dev/json/countries.json',
            userData: u => `https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${u}`,
            nationalTeam: (nt, cid, type) => `https://www.managerzone.com/ajax.php?p=nationalTeams&sub=team&ntid=${nt}&cid=${cid}&type=${type}&sport=soccer`,
            challenges: 'https://www.managerzone.com/ajax.php?p=nationalTeams&sub=challenge',
            createChallenge: 'https://www.managerzone.com/ajax.php?p=challenge&sub=handle-challenge&action=create'
        },
        storageKeys: {
            countriesCache: 'mz_nt_challenger_countries_cache',
            defaultCoached: 'mz_nt_default_coached_list',
            defaultUncoached: 'mz_nt_default_uncoached_list',
            exclusionList: 'mz_nt_challenge_exclusion_list'
        },

        initializeDefaultLists() {
            if (!GM_getValue(this.storageKeys.defaultCoached, null)) {
                const defaultCoached = [
                    "Albania", "Argentina", "Australia", "Austria", "Belgium", "Brazil",
                    "Canada", "Chile", "China", "Colombia", "Croatia", "Denmark",
                    "England", "Finland", "France", "Germany", "Greece", "Hungary",
                    "Iceland", "Italy", "Mexico", "Netherlands", "Poland", "Portugal",
                    "Russia", "Scotland", "Spain", "Sweden", "Switzerland", "Turkey",
                    "United States", "Uruguay", "Wales"
                ];
                GM_setValue(this.storageKeys.defaultCoached, defaultCoached);
            }
            if (!GM_getValue(this.storageKeys.defaultUncoached, null)) {
                const defaultUncoached = [
                    "Algeria", "Faroe Islands", "Iran", "Jordan", "Kenya",
                    "Kuwait", "Northern Ireland", "Norway", "Pakistan",
                    "Saudi Arabia", "Senegal", "Vietnam"
                ];
                GM_setValue(this.storageKeys.defaultUncoached, defaultUncoached);
            }
        },

        async fetch(details) {
            return new Promise((resolve, reject) => {
                const requestDetails = {
                    ...details,
                    timeout: 20000,
                    onload: response => resolve(response),
                    onerror: (err) => {
                        console.error(`${SCRIPT_PREFIX} GM_xmlhttpRequest error:`, err);
                        reject(new Error('Network Error'));
                    },
                    ontimeout: () => {
                        console.error(`${SCRIPT_PREFIX} GM_xmlhttpRequest timeout for URL: ${details.url}`);
                        reject(new Error('Request Timed Out'));
                    },
                };
                GM_xmlhttpRequest(requestDetails);
            });
        },

        async getCountries(force = false) {
            if (force) {
                this.cachedCountries = null;
                GM_setValue(this.storageKeys.countriesCache, null);
                console.log(`${SCRIPT_PREFIX} Force refresh: Cleared countries cache.`);
            }

            if (this.cachedCountries) {
                return this.cachedCountries;
            }

            const persistentCache = GM_getValue(this.storageKeys.countriesCache, null);
            if (persistentCache) {
                this.cachedCountries = JSON.parse(persistentCache);
                return this.cachedCountries;
            }

            try {
                const response = await this.fetch({
                    method: 'GET',
                    url: this.endpoints.countries
                });
                this.cachedCountries = JSON.parse(response.responseText);
                GM_setValue(this.storageKeys.countriesCache, response.responseText);
                return this.cachedCountries;
            } catch (error) {
                console.error(`${SCRIPT_PREFIX} Failed to fetch and parse countries list.`, error);
                return null;
            }
        },

        async getTargetableNTs() {
            const allTeams = await this.getCountries();
            if (!allTeams) {
                throw new Error("Failed to fetch base country list.");
            }

            const defaultExclusions = GM_getValue(this.storageKeys.defaultUncoached, []);
            const excludedTeams = GM_getValue(this.storageKeys.exclusionList, defaultExclusions);

            const targetable = allTeams.filter(team => !excludedTeams.includes(team.name));
            return targetable;
        }
    };

    const uiManager = {
        triggerId: 'mz-challenger',
        modalId: 'mz-master-modal',
        logPanelId: 'mz-master-log-panel',
        progressTrackerId: 'mz-master-progress-tracker',
        teamTypeSelectorName: 'team-type-selector',

        injectStyles() {
            GM_addStyle(`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
                :root {
                    --mz-master-navy: #0D253F; --mz-master-black: #010101; --mz-master-pink: #EC407A;
                    --mz-master-text: #E0E0E0; --mz-master-text-dark: #a0a0a0; --mz-master-bg: #151821;
                    --mz-master-bg-dark: #111;
                }
                .mz-master-radio-group { display: flex; justify-content: center; gap: 10px; margin: 25px 0; }
                .mz-master-radio-group input { display: none; }
                .mz-master-radio-group label {
                    font-size: 14px; font-weight: 500; color: var(--mz-master-text-dark); background-color: #2c2c2c;
                    padding: 10px 20px; border-radius: 8px; border: 2px solid #444; cursor: pointer; transition: all 0.2s ease;
                }
                .mz-master-radio-group input:checked + label {
                    color: var(--mz-master-text); border-color: var(--mz-master-pink); box-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
                }
                .mz-master-modal-button, #${this.triggerId} {
                    font-family: 'Inter', sans-serif; font-weight: 500; color: var(--mz-master-text);
                    background-image: linear-gradient(to right, var(--mz-master-navy), var(--mz-master-black));
                    border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s ease;
                    box-shadow: 0 2px 5px rgba(236, 64, 122, 0.3);
                }
                #${this.triggerId} { font-size: 12px; padding: 6px 12px; margin-left: 20px; }
                .mz-master-modal-button { font-size: 13px; padding: 10px 20px; }
                .mz-master-modal-button.cancel { background-image: linear-gradient(to right, #555, #333); }
                .mz-master-modal-button.close-btn { margin-top: 20px; }
                .mz-master-modal-button:hover, #${this.triggerId}:hover {
                    transform: scale(1.05); box-shadow: 0 4px 10px rgba(236, 64, 122, 0.5);
                }
                .mz-master-modal-button.cancel:hover { box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2); }
                #${this.triggerId}:disabled {
                    cursor: not-allowed; background-image: linear-gradient(to right, #333, #222);
                    color: #666; transform: none; box-shadow: none;
                }
                .${this.modalId}-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.7); z-index: 9998; display: flex; justify-content: center; align-items: center;
                    opacity: 0; transition: opacity 0.3s ease;
                }
                .${this.modalId}-content {
                    position: relative; font-family: 'Inter', sans-serif; background-color: var(--mz-master-navy); color: var(--mz-master-text);
                    padding: 25px; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 0 20px rgba(236, 64, 122, 0.2);
                    border: 1px solid var(--mz-master-pink); transform: scale(0.9); transition: transform 0.3s ease; text-align: center;
                }
                .${this.modalId}-content h2 { margin: 0 25px 15px; color: var(--mz-master-pink); font-weight: 700; }
                .modal-close-btn {
                    position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px;
                    color: var(--mz-master-text-dark); cursor: pointer; transition: color 0.2s, transform 0.2s;
                }
                .modal-close-btn:hover { color: var(--mz-master-text); transform: scale(1.2); }
                .modal-settings-btn {
                    position: absolute; top: 12px; left: 15px; background: none; border: none; font-size: 18px;
                    color: var(--mz-master-text-dark); cursor: pointer; transition: color 0.2s, transform 0.2s;
                }
                .modal-settings-btn:hover { color: var(--mz-master-text); transform: rotate(45deg); }
                .modal-button-container { display: flex; justify-content: center; gap: 15px; margin-top: 25px; }
                .${this.modalId}-spinner {
                    border: 4px solid #444; border-top: 4px solid var(--mz-master-pink); border-radius: 50%; width: 40px; height: 40px;
                    animation: spin 1s linear infinite; margin: 20px auto;
                }
                .modal-plan-info {
                    font-size: 13px; color: var(--mz-master-text-dark); margin-bottom: 15px;
                    border-bottom: 1px solid #444; padding-bottom: 15px;
                }
                .settings-search-input {
                    width: 100%; padding: 10px; margin-bottom: 15px; box-sizing: border-box; background-color: var(--mz-master-bg-dark);
                    border: 1px solid #444; border-radius: 4px; color: var(--mz-master-text); font-family: 'Inter', sans-serif;
                }
                #${this.progressTrackerId} {
                    font-size: 14px; color: var(--mz-master-text); margin: 20px 0; font-weight: 500;
                }
                #${this.logPanelId}, .modal-plan-details, .settings-list {
                    height: 250px; overflow-y: auto; background-color: var(--mz-master-bg-dark); border: 1px solid #333;
                    border-radius: 4px; margin-top: 20px; padding: 10px; text-align: left;
                    font-size: 12px; line-height: 1.6; font-family: 'Menlo', 'Consolas', monospace;
                }
                .settings-list-item { display: block; margin-bottom: 5px; cursor: pointer; padding: 2px 5px; }
                .log-entry { margin-bottom: 3px; }
                .log-entry-ok { color: #81C784; }
                .log-entry-error { color: #E57373; font-weight: bold; }
                .log-entry-info { color: #90A4AE; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `);
        },

        appendToLog(message, type = 'info') {
            const logPanel = document.getElementById(this.logPanelId);
            if (!logPanel) {
                return;
            }
            const entry = document.createElement('div');
            entry.textContent = message;
            entry.className = `log-entry log-entry-${type}`;
            logPanel.appendChild(entry);
            logPanel.scrollTop = logPanel.scrollHeight;
        },

        updateProgress(sent, total) {
            const tracker = document.getElementById(this.progressTrackerId);
            if (tracker) {
                tracker.textContent = `Processing challenge ${sent} of ${total}...`;
            }
        },

        showModal(content, options = {}) {
            this.closeModal(true);
            const { title, showSettings, closeOnClickOutside } = options;
            const overlay = document.createElement('div');
            overlay.className = `${this.modalId}-overlay`;
            if (closeOnClickOutside) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeModal();
                    }
                });
            }

            const contentDiv = document.createElement('div');
            contentDiv.className = `${this.modalId}-content`;
            contentDiv.innerHTML = `
                <button title="Close" class="modal-close-btn">×</button>
                ${showSettings ? `<button title="Settings" class="modal-settings-btn"><i class="fa fa-cog"></i></button>` : ''}
                ${title ? `<h2>${title}</h2>` : ''}
                ${content}
            `;

            overlay.appendChild(contentDiv);
            document.body.appendChild(overlay);

            contentDiv.querySelector('.modal-close-btn').onclick = () => this.closeModal();
            if (showSettings) {
                const settingsBtn = contentDiv.querySelector('.modal-settings-btn');
                if (settingsBtn) {
                    settingsBtn.onclick = () => massChallengeSender.showSettings();
                }
            }

            setTimeout(() => {
                overlay.style.opacity = '1';
                contentDiv.style.transform = 'scale(1)';
            }, 10);
            return contentDiv;
        },

        updateModal(content, options = {}) {
            const contentDiv = document.querySelector(`.${this.modalId}-content`);
            if (contentDiv) {
                const { title, showSettings } = options;
                const closeBtnHTML = contentDiv.querySelector('.modal-close-btn')?.outerHTML || '';
                const titleHTML = title ? `<h2>${title}</h2>` : '';
                const settingsBtnHTML = showSettings ? `<button title="Settings" class="modal-settings-btn"><i class="fa fa-cog"></i></button>` : '';

                contentDiv.innerHTML = `${closeBtnHTML}${settingsBtnHTML}${titleHTML}${content}`;

                contentDiv.querySelector('.modal-close-btn').onclick = () => this.closeModal();
                if (showSettings) {
                    const settingsBtn = contentDiv.querySelector('.modal-settings-btn');
                    if (settingsBtn) {
                        settingsBtn.onclick = () => massChallengeSender.showSettings();
                    }
                }
            }
        },

        closeModal(isSilent = false) {
            const overlay = document.querySelector(`.${this.modalId}-overlay`);
            if (!overlay) {
                return;
            }
            if (isSilent) {
                overlay.remove();
            } else {
                overlay.style.opacity = '0';
                overlay.querySelector(`.${this.modalId}-content`).style.transform = 'scale(0.9)';
                setTimeout(() => {
                    overlay.remove();
                    this.setButtonState('idle');
                }, 300);
            }
        },

        renderInitialUI(container) {
            if (document.getElementById(this.triggerId)) {
                return null;
            }
            const button = document.createElement('button');
            button.id = this.triggerId;
            button.textContent = 'Send Lots of Challenges';
            const parent = container.parentElement;
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.appendChild(button);
            return button;
        },

        setButtonState(state) {
            const button = document.getElementById(this.triggerId);
            if (!button) {
                return;
            }
            if (state === 'processing') {
                button.disabled = true;
                button.textContent = 'Processing...';
            } else {
                button.disabled = false;
                button.textContent = 'Send Challenges to Everyone';
            }
        }
    };

    const challengeScheduler = {
        CHALLENGE_WINDOW_DAYS: 12,

        generateChallengeDates() {
            const dates = [];
            const now = new Date();

            for (let i = 1; i <= this.CHALLENGE_WINDOW_DAYS; i++) {
                const futureDate = new Date();
                futureDate.setDate(now.getDate() + i);
                futureDate.setUTCHours(0, 0, 0, 0);
                const timestamp = futureDate.getTime() / 1000;
                dates.push(timestamp);
            }
            return dates;
        },

        shuffleArray(array) {
            let currentIndex = array.length,
                randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
            return array;
        },

        createTeamSubgroups(teams, groupCount) {
            const groups = [];
            if (groupCount === 0 || teams.length === 0) {
                return groups;
            }
            let startIndex = 0;
            const baseSize = Math.floor(teams.length / groupCount);
            const remainder = teams.length % groupCount;

            for (let i = 0; i < groupCount; i++) {
                const size = baseSize + (i < remainder ? 1 : 0);
                groups.push(teams.slice(startIndex, startIndex + size));
                startIndex += size;
            }
            return groups.filter(g => g.length > 0);
        },

        prepareChallengeMatrix(teams, dates, teamType) {
            const matrix = [];
            const GROUPS_PER_DATE_BATCH = 6;
            const challengeTypes = [];
            if (teamType === 'senior' || teamType === 'both') {
                challengeTypes.push('senior');
            }
            if (teamType === 'u21' || teamType === 'both') {
                challengeTypes.push('u21');
            }
            if (challengeTypes.length === 0) {
                return [];
            }
            const shuffledDates = this.shuffleArray([...dates]);
            for (let i = 0; i < shuffledDates.length; i += GROUPS_PER_DATE_BATCH) {
                const dateBatch = shuffledDates.slice(i, i + GROUPS_PER_DATE_BATCH);
                const shuffledTeams = this.shuffleArray([...teams]);
                const teamGroups = this.createTeamSubgroups(shuffledTeams, dateBatch.length);
                dateBatch.forEach((date, j) => {
                    const currentGroup = teamGroups[j];
                    if (!currentGroup) {
                        return;
                    }
                    currentGroup.forEach(team => {
                        challengeTypes.forEach(type => {
                            matrix.push({
                                team,
                                type,
                                date,
                                hour: 13,
                                home_away: Math.random() < 0.5 ? 'home' : 'away'
                            });
                        });
                    });
                });
            }
            return this.shuffleArray(matrix);
        },

        async runRealChallenges(matrix) {
            const modalContent = uiManager.showModal(
                `<div class="${uiManager.modalId}-spinner"></div><div id="${uiManager.progressTrackerId}"></div><div id="${uiManager.logPanelId}"></div>`, {
                    closeOnClickOutside: false
                }
            );

            let sentCount = 0;
            const totalChallenges = matrix.length;
            uiManager.updateProgress(sentCount, totalChallenges);

            const challengePromises = matrix.map(challenge => {
                const { team, type, date, hour, home_away } = challenge;
                const formattedDate = new Date(date * 1000).toLocaleDateString("en-CA", {
                    timeZone: 'UTC'
                });
                const formData = new URLSearchParams();
                formData.append(home_away === 'home' ? 'date_home' : 'date_away', `${date},${hour}`);
                formData.append('tactic_home', 'a');
                formData.append('tactic_away', 'a');
                const url = new URL(dataManager.endpoints.createChallenge);
                const teamId = type === 'senior' ? team.ntid : team.u21ntid;
                url.searchParams.append('tid', teamId);
                url.searchParams.append('national', type);
                url.searchParams.append('type', type);
                url.searchParams.append('sport', 'soccer');

                return dataManager.fetch({
                    method: 'POST',
                    url: url.toString(),
                    data: formData.toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                }).then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        uiManager.appendToLog(`[SUCCESS] Sent [${type.toUpperCase()}] challenge to ${team.name} on ${formattedDate}.`, 'ok');
                        return { status: 'fulfilled' };
                    } else {
                        throw new Error(`Status ${response.status}`);
                    }
                }).catch(error => {
                    uiManager.appendToLog(`[FAILED] Sending [${type.toUpperCase()}] challenge to ${team.name}. Reason: ${error.message || 'Network Error'}`, 'error');
                    return { status: 'rejected' };
                }).finally(() => {
                    sentCount++;
                    uiManager.updateProgress(sentCount, totalChallenges);
                });
            });

            await Promise.all(challengePromises);

            modalContent.querySelector(`.${uiManager.modalId}-spinner`).style.display = 'none';
            uiManager.appendToLog('Done.', 'info');
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.className = 'mz-master-modal-button close-btn';
            closeButton.onclick = () => location.reload();
            modalContent.appendChild(closeButton);
        }
    };

    const massChallengeSender = {
        challengeTabSelector: 'a[href*="sub=challenge"]',
        dropdownSelector: 'select[name="tid"]',

        showSettings() {
            const coachedTeams = GM_getValue(dataManager.storageKeys.defaultCoached, []);
            const uncoachedTeams = GM_getValue(dataManager.storageKeys.defaultUncoached, []);
            const allKnownTeams = [...coachedTeams, ...uncoachedTeams];
            const excludedTeams = GM_getValue(dataManager.storageKeys.exclusionList, uncoachedTeams);

            const searchInputHTML = `<input type="text" id="settings-search" class="settings-search-input" placeholder="Filter...">`;
            const settingsListHTML = `<div class="settings-list">${allKnownTeams.sort().map(teamName => `
                <label class="settings-list-item">
                    <input type="checkbox" name="nt-exclusion" value="${teamName}" ${!excludedTeams.includes(teamName) ? 'checked' : ''}>
                    ${teamName}
                </label>
            `).join('')}</div>`;
            const buttonsHTML = `
                <div class="modal-button-container">
                    <button id="modal-save-settings-btn" class="mz-master-modal-button">Save</button>
                </div>
            `;
            uiManager.showModal(`${searchInputHTML}${settingsListHTML}${buttonsHTML}`, {
                title: "Manage Targetable Countries (Uncheck Undesirable Countries)",
                closeOnClickOutside: true,
                showSettings: true
            });

            const searchInput = document.getElementById('settings-search');
            searchInput.oninput = () => {
                const filter = searchInput.value.toLowerCase();
                document.querySelectorAll('.settings-list-item').forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(filter) ? '' : 'none';
                });
            };

            document.getElementById('modal-save-settings-btn').onclick = () => {
                const newExcluded = [...document.querySelectorAll('input[name="nt-exclusion"]:not(:checked)')].map(cb => cb.value);
                GM_setValue(dataManager.storageKeys.exclusionList, newExcluded);
                this.startW();
            };
        },

        async generateAndShowChallengePlan(teamType) {
            uiManager.setButtonState('processing');
            uiManager.showModal(`<div class="${uiManager.modalId}-spinner"></div><p>Please wait...</p>`, {
                showSettings: true
            });
            try {
                const loadingDelay = new Promise(resolve => setTimeout(resolve, 1000));
                const dataFetch = dataManager.getTargetableNTs();
                const [_, teams] = await Promise.all([loadingDelay, dataFetch]);
                const dates = challengeScheduler.generateChallengeDates();

                if (!teams || teams.length === 0) {
                    throw new Error("No targetable NTs found. Check settings.");
                }
                if (!dates || dates.length === 0) {
                    throw new Error("No available challenge dates found.");
                }

                const nowString = new Date().toLocaleString('en-GB', {
                    timeZone: 'Europe/Stockholm',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(' at', ',');

                const matrix = challengeScheduler.prepareChallengeMatrix(teams, dates, teamType);
                const summary = `Reference Time (Sweden): <b>${nowString}</b>.<br><b>${matrix.length} challenges</b> will be sent to <b>${teams.length}</b> targetable NTs.`;
                const planDetails = `<div class="modal-plan-details">${matrix.map(c => `<div>[${c.type.toUpperCase()}] to <b>${c.team.name}</b> on ${new Date(c.date*1000).toLocaleDateString("en-CA",{timeZone: 'UTC'})} at ${c.hour}:00</div>`).join('')}</div>`;
                const buttonsHTML = `
                    <div class="modal-button-container">
                        <button id="modal-cancel-btn" class="mz-master-modal-button cancel">Cancel</button>
                        <button id="modal-confirm-btn" class="mz-master-modal-button">Confirm & Send</button>
                    </div>
                `;
                uiManager.updateModal(`<div class="modal-plan-info">${summary}</div>${planDetails}${buttonsHTML}`, {
                    title: "",
                    showSettings: true
                });

                document.getElementById('modal-cancel-btn').onclick = () => uiManager.closeModal();
                document.getElementById('modal-confirm-btn').onclick = () => challengeScheduler.runRealChallenges(matrix);
            } catch (error) {
                console.error(`${SCRIPT_PREFIX} Error during plan generation:`, error);
                uiManager.showModal(`<p>${error.message}</p>`, {
                    title: 'Error'
                });
                uiManager.setButtonState('idle');
            }
        },

        startW() {
            const types = [{
                value: 'senior',
                text: 'Senior'
            }, {
                value: 'u21',
                text: 'U21'
            }, {
                value: 'both',
                text: 'Both'
            }];
            const radioHTML = types.map((type) => `
                <input type="radio" id="radio-${type.value}" name="${uiManager.teamTypeSelectorName}" value="${type.value}" ${type.value === 'senior' ? 'checked' : ''}>
                <label for="radio-${type.value}">${type.text}</label>
            `).join('');
            const modalContent = `<div class="mz-master-radio-group">${radioHTML}</div><button id="modal-continue-btn" class="mz-master-modal-button">Continue</button>`;
            uiManager.showModal(modalContent, {
                showSettings: true,
                closeOnClickOutside: true,
                title: 'Select Type'
            });
            document.getElementById('modal-continue-btn').addEventListener('click', () => {
                const selectedType = document.querySelector(`input[name="${uiManager.teamTypeSelectorName}"]:checked`).value;
                this.generateAndShowChallengePlan(selectedType);
            });
        },

        watchTab() {
            const persistentObserver = new MutationObserver(() => {
                const dropdown = document.querySelector(this.dropdownSelector);
                if (dropdown && dropdown.parentElement && !document.getElementById(uiManager.triggerId)) {
                    const button = uiManager.renderInitialUI(dropdown.parentElement);
                    if (button) {
                        button.addEventListener('click', () => this.startW());
                    }
                }
            });
            persistentObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        initialize() {
            console.log(`${SCRIPT_PREFIX} Initializing...`);
            dataManager.initializeDefaultLists();
            uiManager.injectStyles();
            this.watchTab();
        }
    };

    const incomingChallengeNotifier = {
        CONFIG: {
            USERNAME: '',
            COUNTRY_NAME: '',
            COUNTRY_ID: null,
            SENIOR_NT_ID: null,
            U21_NT_ID: null
        },
        NOTIFICATION_SETTINGS: {
            duration: 10000,
            close: true,
            gravity: "bottom",
            position: "left",
            style: {
                background: "#0D0D0D",
                color: "#00FF41",
                border: "1px solid #00FF41",
                borderRadius: "0px",
                boxShadow: "0 0 15px #00FF41",
                fontFamily: "monospace"
            }
        },

        async initializeConfig() {
            const u = this.CONFIG.USERNAME || this.getCurrentUsername();
            if (!u) {
                return false;
            }
            try {
                const userResponse = await dataManager.fetch({
                    method: 'GET',
                    url: dataManager.endpoints.userData(u)
                });
                const xml = new DOMParser().parseFromString(userResponse.responseText, 'text/xml');
                const countryCode = xml.querySelector('UserData')?.getAttribute('countryShortname');
                if (!countryCode) {
                    return false;
                }
                const countries = await dataManager.getCountries();
                if (!countries) {
                    return false;
                }
                const countryData = countries.find(c => c.code === countryCode);
                if (!countryData) {
                    return false;
                }
                Object.assign(this.CONFIG, {
                    USERNAME: u,
                    COUNTRY_NAME: countryData.name,
                    COUNTRY_ID: countryData.cid,
                    SENIOR_NT_ID: countryData.ntid,
                    U21_NT_ID: countryData.u21ntid
                });
                return true;
            } catch (e) {
                return false;
            }
        },
        getCurrentUsername() {
            const el = document.querySelector('#header-username');
            return el ? el.textContent.trim() : '';
        },
        async verifyNCStatus() {
            try {
                const url = dataManager.endpoints.nationalTeam(this.CONFIG.SENIOR_NT_ID, this.CONFIG.COUNTRY_ID, 'national_team');
                const response = await dataManager.fetch({
                    method: 'GET',
                    url: url
                });
                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                return Array.from(doc.querySelectorAll('a[href*="/?p=profile"]')).some(link => link.textContent.trim() === this.CONFIG.USERNAME);
            } catch (e) {
                return false;
            }
        },
        async processIncomingChallenges(cat, tid) {
            const p = new URLSearchParams({
                ntid: tid,
                cid: this.CONFIG.COUNTRY_ID,
                type: cat === 'U21' ? 'national_team_u21' : 'national_team',
                sport: 'soccer'
            });
            try {
                const response = await dataManager.fetch({
                    method: 'GET',
                    url: `${dataManager.endpoints.challenges}&${p.toString()}`
                });
                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                const tab = doc.querySelector('#matches_in');
                if (!tab) {
                    return;
                }
                tab.querySelectorAll('tbody tr').forEach(row => {
                    const opp = row.querySelector('td:nth-child(1) a');
                    const tim = row.querySelector('td:nth-child(3)');
                    if (!opp || !tim) {
                        return;
                    }
                    const oppName = opp.textContent.trim();
                    const timeText = tim.textContent.trim();
                    const sk = `challenge_${oppName}_${cat}_${timeText}`;
                    if (!GM_getValue(sk, false)) {
                        Toastify({
                            text: `Incoming NT challenge from ${oppName} (${cat})!`,
                            ...this.NOTIFICATION_SETTINGS
                        }).showToast();
                        GM_setValue(sk, true);
                    }
                });
            } catch (e) {
                return;
            }
        },
        async initialize() {
            GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));

            const ok = await this.initializeConfig();
            if (!ok) {
                return;
            }
            const isNC = await this.verifyNCStatus();
            if (!isNC) {
                return;
            }
            if (this.CONFIG.SENIOR_NT_ID) {
                this.processIncomingChallenges('SENIOR', this.CONFIG.SENIOR_NT_ID);
            }
            if (this.CONFIG.U21_NT_ID) {
                this.processIncomingChallenges('U21', this.CONFIG.U21_NT_ID);
            }
        }
    };

    massChallengeSender.initialize();
    incomingChallengeNotifier.initialize();
})();