// ==UserScript==
// @name        ylOppTacticsPreview (Modified)
// @namespace   douglaskampl
// @version     5.5.0
// @description Shows the most recent tactics used by an opponent
// @author      kostrzak16 (feat. Douglas and xente)
// @match       https://www.managerzone.com/?p=match&sub=scheduled
// @icon        https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js
// @resource    ylotp https://mzdv.me/mz/userscript/other/ylotp550.css
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489482/ylOppTacticsPreview%20%28Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489482/ylOppTacticsPreview%20%28Modified%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /**
     * @class OpponentTacticsPreview
     * @description A class responsible for all functionality related to previewing opponent tactics.
     */
    class OpponentTacticsPreview {
        /**
         * @description A set of constant values used throughout the class.
         * @static
         * @readonly
         */
        static CONSTANTS = {
            MATCH_TYPE_GROUPS: {
                'All': [
                    { id: 'no_restriction', label: 'Senior' },
                    { id: 'u23', label: 'U23' },
                    { id: 'u21', label: 'U21' },
                    { id: 'u18', label: 'U18' }
                ],
                'World League': [
                    { id: 'world_series', label: 'Senior WL' },
                    { id: 'u23_world_series', label: 'U23 WL' },
                    { id: 'u21_world_series', label: 'U21 WL' },
                    { id: 'u18_world_series', label: 'U18 WL' }
                ],
                'Official League': [
                    { id: 'series', label: 'Senior League' },
                    { id: 'u23_series', label: 'U23 League' },
                    { id: 'u21_series', label: 'U21 League' },
                    { id: 'u18_series', label: 'U18 League' }
                ]
            },
            URLS: {
                CLUBHOUSE: 'https://www.managerzone.com/?p=clubhouse',
                MATCH_LIST: 'https://www.managerzone.com/ajax.php?p=matches&sub=list&sport=soccer',
                MATCH_STATS: (matchId) => `https://www.managerzone.com/matchviewer/getMatchFiles.php?type=stats&mid=${matchId}&sport=soccer`,
                MATCH_RESULT: (matchId) => `https://www.managerzone.com/?p=match&sub=result&mid=${matchId}`,
                MATCH_CHECK: (matchId) => `https://www.managerzone.com/ajax.php?p=matchViewer&sub=check-match&type=2d&sport=soccer&mid=${matchId}`,
                PITCH_IMG: (matchId) => `https://www.managerzone.com/dynimg/pitch.php?match_id=${matchId}`,
                OFFICIAL_LEAGUE_SCHEDULE: (type, sid, tid) => `https://www.managerzone.com/ajax.php?p=league&type=${type}&sid=${sid}&tid=${tid}&sport=soccer&sub=schedule`
            },
            STORAGE_KEYS: {
                MATCH_LIMIT: 'ylopp_match_limit',
                SAVED_TEAMS: 'ylopp_saved_teams',
                USER_TEAM_ID: 'ylopp_user_team_id',
                LEAGUE_CACHE_KEY: 'ylopp_league_data'
            },
            DEFAULTS: {
                MATCH_LIMIT: 10,
                MAX_SAVED_TEAMS: 15,
                MAX_MATCH_LIMIT: 100
            },
            SELECTORS: {
                FIXTURES_LIST: '#fixtures-results-list-wrapper',
                STATS_XENTE: '#legendDiv',
                ELO_SCHEDULED: '#eloScheduledSelect',
                HOME_TEAM: '.home-team-column.flex-grow-1'
            },
            CACHE_EXPIRATION_MS: 24 * 60 * 60 * 1000
        };

        /**
         * @constructor
         * @description Initializes the class properties.
         */
        constructor() {
            this.myTeam = null;
            this.myTeamId = null;
            this.currentOpponentTid = '';
            this.spinnerInstance = null;
            this.playstyleCache = {};
            this.tooltipElement = null;
            this.tooltipHideTimeout = null;
            this.observer = new MutationObserver(() => {
                this.insertIconsAndListeners();
            });
        }

        /**
         * @description Retrieves the user's preferred match limit from storage.
         * @returns {number} The match limit.
         */
        getMatchLimit = () => {
            return GM_getValue(OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.MATCH_LIMIT, OpponentTacticsPreview.CONSTANTS.DEFAULTS.MATCH_LIMIT);
        };

        /**
         * @description Sets the match limit in storage and provides user feedback.
         * @param {string} limit - The new limit value as a string.
         * @param {HTMLElement} confirmElem - The element to show the confirmation message.
         */
        setMatchLimit = (limit, confirmElem) => {
            const numLimit = parseInt(limit, 10);
            if (!isNaN(numLimit) && numLimit > 0 && numLimit <= OpponentTacticsPreview.CONSTANTS.DEFAULTS.MAX_MATCH_LIMIT) {
                GM_setValue(OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.MATCH_LIMIT, numLimit);
                if (confirmElem) {
                    confirmElem.innerHTML = '<i class="fa fa-check"></i> Atualizado :)';
                    confirmElem.classList.add('visible');
                    setTimeout(() => {
                        confirmElem.classList.remove('visible');
                    }, 2000);
                }
            }
        };

        /**
         * @description Retrieves the list of recently saved teams.
         * @returns {Array<Object>} An array of team objects.
         */
        getSavedTeams = () => {
            return GM_getValue(OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.SAVED_TEAMS, []);
        };

        /**
         * @description Saves a team ID and name to storage.
         * @param {string} teamId - The ID of the team.
         * @param {string} teamName - The name of the team.
         */
        saveTeam = (teamId, teamName) => {
            if (!teamId || !teamName || teamName.startsWith('Team ')) {
                return;
            }
            let teams = this.getSavedTeams();
            const existingIndex = teams.findIndex(team => team.id === teamId);
            if (existingIndex > -1) {
                teams.splice(existingIndex, 1);
            }
            teams.unshift({ id: teamId, name: teamName });
            const trimmedTeams = teams.slice(0, OpponentTacticsPreview.CONSTANTS.DEFAULTS.MAX_SAVED_TEAMS);
            GM_setValue(OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.SAVED_TEAMS, trimmedTeams);
        };

        /**
         * @description Starts observing the DOM for mutations to re-insert icons.
         */
        startObserving = () => {
            const fixturesList = document.querySelector(OpponentTacticsPreview.CONSTANTS.SELECTORS.FIXTURES_LIST);
            if (fixturesList) {
                this.observer.observe(fixturesList, { childList: true, subtree: true });
            }
        };

        /**
         * @description Displays a global loading spinner.
         */
        showLoadingSpinner = () => {
            if (this.spinnerInstance) return;
            const spinnerContainer = document.createElement('div');
            spinnerContainer.id = 'spinjs-overlay';
            document.body.appendChild(spinnerContainer);
            this.spinnerInstance = new Spinner({ color: '#FFFFFF', lines: 12, top: '50%', left: '50%' }).spin(spinnerContainer);
        };

        /**
         * @description Hides the global loading spinner.
         */
        hideLoadingSpinner = () => {
            if (this.spinnerInstance) {
                this.spinnerInstance.stop();
                this.spinnerInstance = null;
            }
            const spinnerContainer = document.getElementById('spinjs-overlay');
            if (spinnerContainer) {
                spinnerContainer.remove();
            }
        };

        /**
         * @description Extracts a team name from an HTML document by finding the most frequent name.
         * @param {HTMLDocument} htmlDocument - The HTML document to parse.
         * @param {string} teamId - The ID of the team.
         * @returns {string|null} The team name or null if not found.
         */
        extractTeamNameFromHtml = (htmlDocument, teamId) => {
            const nameCounts = new Map();
            htmlDocument.querySelectorAll('.teams-wrapper a.clippable').forEach(link => {
                const linkUrl = new URL(link.href, location.href);
                const linkTid = linkUrl.searchParams.get('tid');
                if (linkTid === teamId) {
                    const fullName = link.querySelector('.full-name')?.textContent.trim();
                    if (fullName) {
                        nameCounts.set(fullName, (nameCounts.get(fullName) || 0) + 1);
                    }
                }
            });
            if (nameCounts.size > 0) {
                const mostFrequentName = [...nameCounts.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
                return mostFrequentName;
            }
            const boldTeamNameElement = htmlDocument.querySelector('.teams-wrapper a.clippable > strong > .full-name');
            const boldName = boldTeamNameElement ? boldTeamNameElement.textContent.trim() : null;
            return boldName;
        };

        /**
         * @description Fetches and processes the latest tactics for a given team.
         * @async
         * @param {string} teamId - The ID of the team.
         * @param {string} matchType - The type of match to search for.
         */
        fetchLatestTactics = async (teamId, matchType) => {
            const modal = document.getElementById('interaction-modal');
            if (modal) this.fadeOutAndRemove(modal);

            this.showLoadingSpinner();
            try {
                const response = await fetch(
                    OpponentTacticsPreview.CONSTANTS.URLS.MATCH_LIST, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `type=played&hidescore=false&tid1=${teamId}&offset=&selectType=${matchType}&limit=max`,
                    credentials: 'include'
                });

                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

                const data = await response.json();
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(data.list, 'text/html');
                const actualTeamName = this.extractTeamNameFromHtml(htmlDocument, teamId);
                const finalTeamName = actualTeamName || `Team ${teamId}`;

                this.saveTeam(teamId, finalTeamName);
                this.currentOpponentTid = teamId;

                let matches = Array.from(htmlDocument.querySelectorAll('dl > dd.odd'))
                    .filter(this.isRelevantMatch)
                    .map(entry => this.parseMatchEntry(entry, finalTeamName))
                    .filter(Boolean);

                const officialLeagueTypes = ['series', 'u23_series', 'u21_series', 'u18_series'];
                if (officialLeagueTypes.includes(matchType)) {
                    const leagueMatches = await this.fetchLeagueScheduleMatches(htmlDocument, finalTeamName, teamId);
                    matches.push(...leagueMatches);
                }

                const uniqueMatches = Array.from(new Map(matches.map(m => [m.mid, m])).values());
                this.processTacticsData(uniqueMatches, matchType, finalTeamName);

            } catch (error) {
                this.hideLoadingSpinner();
                const message = document.createElement('div');
                message.className = 'no-tactics-message';
                message.textContent = 'Failed to fetch tactics data.';
                const container = this.createTacticsContainer('Error', 'Data Fetch');
                container.querySelector('.tactics-list').appendChild(message);
                document.body.appendChild(container);
                container.classList.add('fade-in');
            } finally {
                this.hideLoadingSpinner();
            }
        };

        /**
         * @description Fetches official league schedule matches, utilizing a single, expiring cache.
         * @async
         * @param {HTMLDocument} initialHtmlDoc - The initial HTML document to find the league link.
         * @param {string} opponentName - The name of the opponent team.
         * @param {string} teamId - The ID of the team.
         * @returns {Promise<Array<Object>>} A promise that resolves to an array of parsed match data.
         */
        fetchLeagueScheduleMatches = async (initialHtmlDoc, opponentName, teamId) => {
            try {
                const leagueLink = initialHtmlDoc.querySelector('.responsive-hide.match-reference-text-wrapper a');
                if (!leagueLink) {
                    return [];
                }

                const url = new URL(leagueLink.href, location.href);
                const sid = url.searchParams.get('sid');
                const type = url.searchParams.get('type');
                if (!sid || !type) {
                    return [];
                }

                const cacheKey = OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.LEAGUE_CACHE_KEY;
                const cachedData = GM_getValue(cacheKey, {});
                const cacheEntry = cachedData[sid];

                if (cacheEntry && (Date.now() - cacheEntry.timestamp < OpponentTacticsPreview.CONSTANTS.CACHE_EXPIRATION_MS)) {
                    const filteredMatches = cacheEntry.data.filter(m => m.homeTeamName === opponentName || m.awayTeamName === opponentName);
                    return filteredMatches.map(m => this.parseMatchData(m, opponentName));
                }

                const scheduleUrl = OpponentTacticsPreview.CONSTANTS.URLS.OFFICIAL_LEAGUE_SCHEDULE(type, sid, teamId);
                const response = await fetch(scheduleUrl);
                if (!response.ok) throw new Error(`Network response for league schedule was not ok: ${response.statusText}`);
                const text = await response.text();
                const scheduleDoc = new DOMParser().parseFromString(text, 'text/html');

                const allMatches = [];
                const rows = scheduleDoc.querySelectorAll('.hitlist.marker tr');

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length !== 3) {
                        return;
                    }

                    const scoreLink = cells[1].querySelector('a');
                    if (!scoreLink) {
                        return;
                    }

                    const score = scoreLink?.textContent.trim();
                    if (!score || score.toLowerCase().includes('x')) {
                        return;
                    }

                    const mid = new URL(scoreLink.href, location.href).searchParams.get('mid');
                    const homeTeamName = cells[0].textContent.trim();
                    const awayTeamName = cells[2].textContent.trim();
                    allMatches.push({ mid, homeTeamName, awayTeamName, score });
                });

                cachedData[sid] = {
                    data: allMatches,
                    timestamp: Date.now()
                };
                GM_setValue(cacheKey, cachedData);

                return allMatches
                    .filter(m => m.homeTeamName === opponentName || m.awayTeamName === opponentName)
                    .map(m => this.parseMatchData(m, opponentName));

            } catch (error) {
                return [];
            }
        };

        /**
         * @description Checks if a match entry is relevant.
         * @param {HTMLElement} entry - The match entry element.
         * @returns {boolean} True if the match is relevant, otherwise false.
         */
        isRelevantMatch = (entry) => {
            const wrapper = entry.querySelector('.responsive-hide.match-reference-text-wrapper');
            return !wrapper || wrapper.querySelector('a') !== null;
        };

        /**
         * @description Parses a match entry from an HTML element.
         * @param {HTMLElement} entry - The match entry element.
         * @param {string} opponentName - The name of the opponent team.
         * @returns {Object|null} The parsed match data or null.
         */
        parseMatchEntry = (entry, opponentName) => {
            const link = entry.querySelector('a.score-shown');
            if (!link) return null;

            const dl = link.closest('dl');
            const score = link.textContent.trim();
            const homeTeamName = dl.querySelector('.home-team-column .full-name')?.textContent.trim() || 'Home';
            const awayTeamName = dl.querySelector('.away-team-column .full-name')?.textContent.trim() || 'Away';
            const mid = new URL(link.href, location.href).searchParams.get('mid');

            if (!mid) return null;
            return this.parseMatchData({ mid, homeTeamName, awayTeamName, score }, opponentName);
        };

        /**
         * @description Parses match data and determines home/away goals.
         * @param {Object} matchData - The raw match data.
         * @param {string} opponentName - The name of the opponent team.
         * @returns {Object} The parsed match data with goal information.
         */
        parseMatchData = (matchData, opponentName) => {
            let [homeGoals, awayGoals] = [0, 0];
            if (matchData.score.includes('-')) {
                const parts = matchData.score.split('-').map(x => parseInt(x.trim(), 10));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    [homeGoals, awayGoals] = parts;
                }
            }
            const opponentIsHome = (matchData.homeTeamName === opponentName);
            return { ...matchData, homeGoals, awayGoals, opponentIsHome };
        };

        /**
         * @description Creates and displays the tactics container with match data.
         * @param {Array<Object>} matches - An array of match objects.
         * @param {string} matchType - The type of match.
         * @param {string} opponentName - The name of the opponent team.
         */
        processTacticsData = (matches, matchType, opponentName) => {
            const container = this.createTacticsContainer(matchType, opponentName);
            document.body.appendChild(container);
            const listWrapper = container.querySelector('.tactics-list');

            const limit = this.getMatchLimit();
            const limitedMatches = matches.slice(0, limit);

            if (limitedMatches.length === 0) {
                const message = document.createElement('div');
                message.className = 'no-tactics-message';
                message.textContent = 'No recent valid tactics found for this team and category.';
                listWrapper.appendChild(message);
                container.classList.add('fade-in');
                return;
            }

            limitedMatches.forEach(match => {
                const tacticUrl = OpponentTacticsPreview.CONSTANTS.URLS.PITCH_IMG(match.mid);
                const resultUrl = OpponentTacticsPreview.CONSTANTS.URLS.MATCH_RESULT(match.mid);
                const canvas = this.createCanvasWithReplacedColors(tacticUrl, match.opponentIsHome);

                const item = document.createElement('div');
                item.className = 'tactic-item';

                const opponentGoals = match.opponentIsHome ? match.homeGoals : match.awayGoals;
                const otherGoals = match.opponentIsHome ? match.awayGoals : match.homeGoals;

                if (opponentGoals > otherGoals) item.classList.add('tactic-win');
                else if (opponentGoals < otherGoals) item.classList.add('tactic-loss');
                else item.classList.add('tactic-draw');

                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'playstyle-status-indicator';
                item.appendChild(statusIndicator);

                const linkA = document.createElement('a');
                linkA.href = resultUrl;
                linkA.target = '_blank';
                linkA.className = 'tactic-link';
                linkA.appendChild(canvas);

                const scoreP = document.createElement('p');
                scoreP.textContent = `${match.homeTeamName} ${match.score} ${match.awayTeamName}`;
                linkA.appendChild(scoreP);
                item.appendChild(linkA);

                this.addPlaystyleHover(match.mid, this.currentOpponentTid, item);
                listWrapper.appendChild(item);
            });
            container.classList.add('fade-in');
        };

        /**
         * @description Shows the interaction modal for selecting tactics options.
         * @param {string} teamId - The ID of the team.
         * @param {HTMLElement} sourceElement - The element that triggered the modal.
         */
        showInteractionModal = (teamId, sourceElement) => {
            const existingModal = document.getElementById('interaction-modal');
            if (existingModal) this.fadeOutAndRemove(existingModal);

            const modal = document.createElement('div');
            modal.id = 'interaction-modal';
            modal.classList.add('fade-in');

            const header = document.createElement('div');
            header.className = 'interaction-modal-header';
            const title = document.createElement('span');
            header.appendChild(title);

            const controlsWrapper = document.createElement('div');
            controlsWrapper.style.display = 'flex';
            controlsWrapper.style.alignItems = 'center';
            controlsWrapper.style.gap = '10px';

            const settingsIcon = document.createElement('span');
            settingsIcon.className = 'settings-icon';
            settingsIcon.innerHTML = '⚙';
            controlsWrapper.appendChild(settingsIcon);

            const closeIcon = document.createElement('i');
            closeIcon.className = 'fa fa-times ylotp-close-icon';
            closeIcon.onclick = () => this.fadeOutAndRemove(modal);
            controlsWrapper.appendChild(closeIcon);

            header.appendChild(controlsWrapper);
            modal.appendChild(header);

            const teamInputSection = this.createTeamInputSection(modal, teamId);
            this.createTabbedButtons(modal, teamInputSection.teamIdInput);
            const settingsPanel = this.createSettingsPanel(modal);
            settingsIcon.onclick = () => {
                settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
            };
            document.body.appendChild(modal);

            const rect = sourceElement.getBoundingClientRect();
            modal.style.position = 'absolute';
            modal.style.left = `${window.scrollX + rect.left}px`;

            const initialTop = window.scrollY + rect.bottom + 5;
            modal.style.top = `${initialTop}px`;

            const modalRect = modal.getBoundingClientRect();
            if (modalRect.bottom > window.innerHeight) {
                modal.style.top = `${window.scrollY + window.innerHeight - modalRect.height - 10}px`;
            }
        };

        /**
         * @description Creates the team ID input section for the modal.
         * @param {HTMLElement} container - The modal container.
         * @param {string} initialTeamId - The initial team ID to populate the input.
         * @returns {Object} An object containing the team ID input and recents dropdown.
         */
        createTeamInputSection = (container, initialTeamId) => {
            const section = document.createElement('div');
            section.className = 'interaction-section team-input-section';

            const label = document.createElement('label');
            label.textContent = 'Team ID:';
            label.htmlFor = 'team-id-input';
            section.appendChild(label);

            const teamIdInput = document.createElement('input');
            teamIdInput.type = 'text';
            teamIdInput.id = 'team-id-input';
            teamIdInput.value = initialTeamId;
            section.appendChild(teamIdInput);

            const select = this.createRecentsDropdown(teamIdInput);
            section.appendChild(select);

            container.appendChild(section);
            return { teamIdInput, recentsSelect: select };
        };

        /**
         * @description Creates the "Recent Teams" dropdown for the modal.
         * @param {HTMLElement} teamIdInput - The team ID input element.
         * @returns {HTMLSelectElement} The created select element.
         */
        createRecentsDropdown = (teamIdInput) => {
            const select = document.createElement('select');
            select.className = 'recents-select';
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Recent Teams';
            defaultOption.value = '';
            select.appendChild(defaultOption);

            this.getSavedTeams().forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = `${team.name} (${team.id})`;
                select.appendChild(option);
            });

            select.onchange = () => {
                if (select.value) {
                    teamIdInput.value = select.value;
                }
            };
            return select;
        };

        /**
         * @description Creates the tabbed buttons for match type selection.
         * @param {HTMLElement} container - The modal container.
         * @param {HTMLInputElement} teamIdInput - The team ID input element.
         */
        createTabbedButtons = (container, teamIdInput) => {
            const tabContainer = document.createElement('div');
            tabContainer.className = 'tab-container';
            const tabHeaders = document.createElement('div');
            tabHeaders.className = 'tab-headers';
            const tabContents = document.createElement('div');
            tabContents.className = 'tab-contents';

            Object.entries(OpponentTacticsPreview.CONSTANTS.MATCH_TYPE_GROUPS).forEach(([groupName, types], index) => {
                const header = document.createElement('button');
                header.className = 'tab-header';
                header.textContent = groupName;

                const content = document.createElement('div');
                content.className = 'tab-content';
                types.forEach(type => {
                    const button = document.createElement('button');
                    button.textContent = type.label;
                    button.onclick = () => {
                        const teamId = teamIdInput.value.trim();
                        if (!teamId || isNaN(parseInt(teamId, 10))) {
                             const error = document.createElement('div');
                             error.className = 'error-message';
                             error.textContent = 'Please enter a valid Team ID.';
                             const existingError = tabContainer.querySelector('.error-message');
                             if (existingError) existingError.remove();
                             tabContainer.insertBefore(error, tabContents);
                             return;
                        }
                        this.fetchLatestTactics(teamId, type.id);
                    };
                    content.appendChild(button);
                });

                header.onclick = () => {
                    tabContainer.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
                    tabContainer.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
                    header.classList.add('active');
                    content.style.display = 'flex';
                };
                tabHeaders.appendChild(header);
                tabContents.appendChild(content);

                if (index === 0) {
                    header.classList.add('active');
                    content.style.display = 'flex';
                } else {
                    content.style.display = 'none';
                }
            });

            tabContainer.appendChild(tabHeaders);
            tabContainer.appendChild(tabContents);
            container.appendChild(tabContainer);
        };

        /**
         * @description Creates the settings panel for the modal.
         * @param {HTMLElement} modalContainer - The modal container.
         * @returns {HTMLElement} The created settings panel.
         */
        createSettingsPanel = (modalContainer) => {
            const panel = document.createElement('div');
            panel.className = 'settings-panel';
            panel.style.display = 'none';

            const limitLabel = document.createElement('label');
            limitLabel.textContent = `MatchLimit (1-${OpponentTacticsPreview.CONSTANTS.DEFAULTS.MAX_MATCH_LIMIT}):`;
            panel.appendChild(limitLabel);

            const inputWrapper = document.createElement('div');
            inputWrapper.style.display = 'flex';
            inputWrapper.style.alignItems = 'center';

            const limitInput = document.createElement('input');
            limitInput.type = 'text';
            limitInput.inputMode = 'numeric';
            limitInput.pattern = '[0-9]*';
            limitInput.value = this.getMatchLimit();

            const confirmationSpan = document.createElement('span');
            confirmationSpan.className = 'save-confirmation';

            limitInput.oninput = () => {
                limitInput.value = limitInput.value.replace(/\D/g, '');
                confirmationSpan.classList.remove('visible');
            };

            limitInput.onchange = () => this.setMatchLimit(limitInput.value, confirmationSpan);

            inputWrapper.appendChild(limitInput);
            inputWrapper.appendChild(confirmationSpan);
            panel.appendChild(inputWrapper);

            const note = document.createElement('small');
            note.textContent = 'Note: the actual number of matches found may be restricted by MZ\'s own limits.';
            panel.appendChild(note);

            modalContainer.appendChild(panel);
            return panel;
        };

        /**
         * @description Creates the container for displaying tactics.
         * @param {string} matchType - The type of match.
         * @param {string} opponent - The opponent's name.
         * @returns {HTMLElement} The created tactics container.
         */
        createTacticsContainer = (matchType, opponent) => {
            const existingContainer = document.getElementById('tactics-container');
            if (existingContainer) {
                this.fadeOutAndRemove(existingContainer);
            }
            const container = document.createElement('div');
            container.id = 'tactics-container';
            container.className = 'tactics-container';

            const header = document.createElement('div');
            header.className = 'tactics-header';
            const title = document.createElement('div');
            title.className = 'match-info-text';

            let matchTypeLabel = matchType;
            for (const group in OpponentTacticsPreview.CONSTANTS.MATCH_TYPE_GROUPS) {
                const found = OpponentTacticsPreview.CONSTANTS.MATCH_TYPE_GROUPS[group].find(t => t.id === matchType);
                if (found) {
                    matchTypeLabel = found.label;
                    break;
                }
            }

            title.innerHTML = `<div class="title-main">${opponent} (${matchTypeLabel})</div>`;
            header.appendChild(title);

            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = '×';
            closeButton.onclick = () => this.fadeOutAndRemove(container);
            header.appendChild(closeButton);
            container.appendChild(header);

            const listWrapper = document.createElement('div');
            listWrapper.className = 'tactics-list';
            container.appendChild(listWrapper);

            return container;
        };

        /**
         * @description Fades out and removes an element from the DOM.
         * @param {HTMLElement} el - The element to fade out.
         */
        fadeOutAndRemove = (el) => {
            if (!el) return;
            el.classList.remove('fade-in');
            el.classList.add('fade-out');
            setTimeout(() => el.remove(), 200);
        };

        /**
         * @description Identifies the user's team name from the current page.
         * @returns {string|null} The user's team name or null.
         */
        identifyUserTeamName = () => {
            const ddRows = document.querySelectorAll('#fixtures-results-list > dd.odd');
            if (ddRows.length === 0) return null;
            const countMap = new Map();
            ddRows.forEach(dd => {
                const homeName = dd.querySelector('.home-team-column .full-name')?.textContent.trim();
                const awayName = dd.querySelector('.away-team-column .full-name')?.textContent.trim();
                if (homeName) countMap.set(homeName, (countMap.get(homeName) || 0) + 1);
                if (awayName) countMap.set(awayName, (countMap.get(awayName) || 0) + 1);
            });
            if (countMap.size === 0) return null;
            const mostFrequentName = [...countMap.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
            return mostFrequentName;
        };

        /**
         * @description Inserts the magnifying glass icons and sets up event listeners.
         */
        insertIconsAndListeners = () => {
            if (!this.myTeam) this.myTeam = this.identifyUserTeamName();
            if (!this.myTeam) {
                return;
            }

            document.querySelectorAll('dd.odd').forEach(dd => {
                const selectWrapper = dd.querySelector('.set-default-wrapper');
                if (selectWrapper && !selectWrapper.querySelector('.magnifier-icon')) {
                    const homeTeamName = dd.querySelector('.home-team-column .full-name')?.textContent.trim();
                    const awayTeamName = dd.querySelector('.away-team-column .full-name')?.textContent.trim();
                    const homeTeamLink = dd.querySelector('.home-team-column a.clippable');
                    const awayTeamLink = dd.querySelector('.away-team-column a.clippable');

                    let opponentName = null;
                    let opponentTid = null;

                    if (homeTeamName === this.myTeam && awayTeamName && awayTeamLink) {
                        opponentName = awayTeamName;
                        if (awayTeamLink.href) opponentTid = new URL(awayTeamLink.href, location.href).searchParams.get('tid');
                    } else if (awayTeamName === this.myTeam && homeTeamName && homeTeamLink) {
                        opponentName = homeTeamName;
                        if (homeTeamLink.href) opponentTid = new URL(homeTeamLink.href, location.href).searchParams.get('tid');
                    }

                    if (opponentName && opponentTid && (opponentTid !== this.myTeamId)) {
                        const iconWrapper = document.createElement('span');
                        iconWrapper.className = 'magnifier-icon';
                        iconWrapper.dataset.tid = opponentTid;
                        iconWrapper.dataset.opponent = opponentName;
                        iconWrapper.title = 'Check opponent latest tactics';
                        iconWrapper.textContent = '🔍';
                        selectWrapper.querySelector('select')?.insertAdjacentElement('afterend', iconWrapper);
                    }
                }
            });
        };

        /**
         * @description Creates a canvas with a pitch image and replaces colors.
         * @param {string} imageUrl - The URL of the image.
         * @param {boolean} opponentIsHome - True if the opponent is the home team.
         * @returns {HTMLCanvasElement} The created canvas element.
         */
        createCanvasWithReplacedColors = (imageUrl, opponentIsHome) => {
            const canvas = document.createElement('canvas');
            canvas.width = 150;
            canvas.height = 200;
            const context = canvas.getContext('2d');
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = () => {
                if (opponentIsHome) {
                    context.translate(canvas.width / 2, canvas.height / 2);
                    context.rotate(Math.PI);
                    context.translate(-canvas.width / 2, -canvas.height / 2);
                }
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const darkGreen = { r: 0, g: 100, b: 0 };
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const isBlack = r < 30 && g < 30 && b < 30;
                    const isYellow = r > 200 && g > 200 && b < 100;
                    if (opponentIsHome) {
                        if (isYellow) { data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; }
                        else if (isBlack) { data[i] = darkGreen.r; data[i + 1] = darkGreen.g; data[i + 2] = darkGreen.b; }
                    } else {
                        if (isBlack) { data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; }
                        else if (isYellow) { data[i] = darkGreen.r; data[i + 1] = darkGreen.g; data[i + 2] = darkGreen.b; }
                    }
                }
                const tempData = new Uint8ClampedArray(data);
                for (let y = 1; y < canvas.height - 1; y++) {
                    for (let x = 1; x < canvas.width - 1; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                            for (let dy = -1; dy <= 1; dy++) {
                                for (let dx = -1; dx <= 1; dx++) {
                                    if (dx === 0 && dy === 0) continue;
                                    const ni = ((y + dy) * canvas.width + (x + dx)) * 4;
                                    if (!(data[ni] === 0 && data[ni + 1] === 0 && data[ni + 2] === 0)) {
                                        tempData[i] = 255; tempData[i + 1] = 255; tempData[i + 2] = 255;
                                    }
                                }
                            }
                        }
                    }
                }
                context.putImageData(new ImageData(tempData, canvas.width, canvas.height), 0, 0);
            };
            image.src = imageUrl;
            return canvas;
        };

        /**
         * @description Ensures a match file is ready for fetching stats.
         * @async
         * @param {string} matchId - The ID of the match.
         * @param {number} [attempt=1] - The current attempt number.
         * @returns {Promise<void>} A promise that resolves when the file is ready.
         */
        ensureMatchFileIsReady = (matchId, attempt = 1) => {
            const maxAttempts = 5;
            return new Promise(async (resolve, reject) => {
                if (attempt > maxAttempts) {
                    const error = new Error(`File preparation failed after ${maxAttempts} attempts.`);
                    return reject(error);
                }
                try {
                    const response = await fetch(OpponentTacticsPreview.CONSTANTS.URLS.MATCH_CHECK(matchId));
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();

                    switch (data.response) {
                        case 'ok':
                            resolve();
                            break;
                        case 'queued':
                            setTimeout(() => this.ensureMatchFileIsReady(matchId, attempt + 1).then(resolve).catch(reject), 3000);
                            break;
                        default:
                            reject(new Error(`Match file unavailable: ${data.response}.`));
                            break;
                    }
                } catch (error) {
                    reject(error);
                }
            });
        };

        _parseTimeToSeconds = (timeString) => {
            if (!timeString || !timeString.includes(':')) return 0;
            const parts = timeString.split(':');
            const minutes = parseInt(parts[0], 10);
            const seconds = parseFloat(parts[1]);
            return isNaN(minutes) || isNaN(seconds) ? 0 : (minutes * 60) + seconds;
        };

        _getSortedGoalEvents = (xml) => {
            const events = [];
            xml.querySelectorAll('Player > Goal').forEach(node => {
                const timeAttr = node.getAttribute('clock') || node.getAttribute('time');
                if (!timeAttr) return;
                const timeInSeconds = this._parseTimeToSeconds(timeAttr);
                const teamId = node.getAttribute('team');
                if (teamId) events.push({ time: timeInSeconds, type: 'Goal', teamId });
            });
            return events.sort((a, b) => a.time - b.time);
        };

        _calculateScoreAtTime = (sortedGoalEvents, targetTime, homeTeamId, awayTeamId) => {
            let homeScore = 0;
            let awayScore = 0;
            for (const event of sortedGoalEvents) {
                if (event.time >= targetTime) break;
                if (event.teamId === homeTeamId) homeScore++;
                if (event.teamId === awayTeamId) awayScore++;
            }
            return { homeScore, awayScore };
        };

        /**
         * @description Fetches and formats playstyle changes from match stats.
         * @async
         * @param {string} mid - The ID of the match.
         * @param {string} opponentTid - The ID of the opponent team.
         * @returns {Promise<string>} A promise that resolves to an HTML string with playstyle data.
         */
        fetchPlaystyleChanges = async (mid, opponentTid) => {
            await this.ensureMatchFileIsReady(mid);

            const response = await fetch(OpponentTacticsPreview.CONSTANTS.URLS.MATCH_STATS(mid));
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            const xml = new DOMParser().parseFromString(text, 'text/xml');
            const opponentTeamNode = xml.querySelector(`Team[id="${opponentTid}"]`);
            if (!opponentTeamNode) return 'Opponent data not found.';

            const isVisiting = opponentTeamNode.getAttribute('visiting') === '1';
            const homeTeamId = xml.querySelector('Team[visiting="0"]')?.getAttribute('id');
            const awayTeamId = xml.querySelector('Team[visiting="1"]')?.getAttribute('id');
            const tooltipLines = [];

            tooltipLines.push(`Tactic: ${opponentTeamNode.getAttribute('tactic') || 'N/A'}`);
            tooltipLines.push(`Playstyle: ${opponentTeamNode.getAttribute('playstyle') || 'N/A'}`);
            tooltipLines.push(`Aggression: ${opponentTeamNode.getAttribute('aggression') || 'N/A'}`);

            const changeNodes = [...xml.querySelectorAll('Events Tactic')].filter(node => node.getAttribute('teamId') === opponentTid);
            if (changeNodes.length > 0) {
                const sortedGoalEvents = this._getSortedGoalEvents(xml);
                tooltipLines.push('<br><strong>Changes</strong>');
                changeNodes.forEach(node => {
                    const changeType = node.getAttribute('type');
                    if (!['playstyle', 'aggression', 'tactic'].includes(changeType)) return;
                    const clock = node.getAttribute('clock') || node.getAttribute('time');
                    const timeInSeconds = this._parseTimeToSeconds(clock);
                    const minute = Math.floor(timeInSeconds / 60);
                    const newSetting = node.getAttribute('new_setting');
                    const { homeScore, awayScore } = this._calculateScoreAtTime(sortedGoalEvents, timeInSeconds, homeTeamId, awayTeamId);
                    const scoreString = isVisiting ? `${awayScore}-${homeScore}` : `${homeScore}-${awayScore}`;
                    tooltipLines.push(`Min ${minute}: ${changeType} → ${newSetting} (Score: ${scoreString})`);
                });
            }

            const result = tooltipLines.length > 0 ? tooltipLines.join('<br>') : 'No relevant tactical data found.';
            return result;
        };

        /**
         * @description Adds hover functionality to tactic items to show playstyle data.
         * @param {string} mid - The ID of the match.
         * @param {string} opponentTid - The ID of the opponent team.
         * @param {HTMLElement} tacticItemElement - The element representing the tactic.
         */
        addPlaystyleHover = (mid, opponentTid, tacticItemElement) => {
            const indicatorElement = tacticItemElement.querySelector('.playstyle-status-indicator');
            const loadAndShowTooltip = async () => {
                const cacheKey = `${mid}-${opponentTid}`;
                const cacheEntry = this.playstyleCache[cacheKey];

                if (cacheEntry?.status === 'success' || cacheEntry?.status === 'error') {
                    this.tooltipElement.innerHTML = cacheEntry.content;
                } else {
                    this.tooltipElement.innerHTML = 'Loading...';
                }

                if (this.tooltipElement.style.display !== 'block') {
                    this.tooltipElement.style.display = 'block';
                }

                if (!cacheEntry || cacheEntry.status === 'error') {
                    this.playstyleCache[cacheKey] = { status: 'loading' };
                    if (indicatorElement) {
                        indicatorElement.innerHTML = '';
                        new Spinner({ lines: 8, length: 3, width: 2, radius: 4, scale: 0.5, color: '#FFFFFF', position: 'relative' }).spin(indicatorElement);
                    }
                    try {
                        const content = await this.fetchPlaystyleChanges(mid, opponentTid);
                        this.playstyleCache[cacheKey] = { status: 'success', content };
                        if (this.tooltipElement.style.display === 'block') this.tooltipElement.innerHTML = content;
                        if (indicatorElement) indicatorElement.innerHTML = '✅';
                    } catch (error) {
                        const errorMessage = 'Match data is not available. Probably a WO :)';
                        this.playstyleCache[cacheKey] = { status: 'error', content: errorMessage };
                        if (this.tooltipElement.style.display === 'block') this.tooltipElement.innerHTML = errorMessage;
                        if (indicatorElement) indicatorElement.innerHTML = '❌';
                    }
                }
            };

            tacticItemElement.addEventListener('mouseenter', () => {
                clearTimeout(this.tooltipHideTimeout);
                loadAndShowTooltip();
            });

            tacticItemElement.addEventListener('mousemove', (ev) => {
                this.tooltipElement.style.top = `${ev.pageY + 15}px`;
                this.tooltipElement.style.left = `${ev.pageX + 5}px`;
            });

            tacticItemElement.addEventListener('mouseleave', () => {
                this.tooltipHideTimeout = setTimeout(() => {
                    this.tooltipElement.style.display = 'none';
                }, 200);
            });
        };

        /**
         * @description Creates a global tooltip element.
         */
        createGlobalTooltip = () => {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.className = 'playstyle-tooltip';
            document.body.appendChild(this.tooltipElement);
            this.tooltipElement.addEventListener('mouseenter', () => clearTimeout(this.tooltipHideTimeout));
            this.tooltipElement.addEventListener('mouseleave', () => {
                this.tooltipHideTimeout = setTimeout(() => { this.tooltipElement.style.display = 'none'; }, 200);
            });
        };

        /**
         * @description Waits for ELO values from another script before inserting icons.
         */
        waitForEloValues = () => {
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(OpponentTacticsPreview.CONSTANTS.SELECTORS.HOME_TEAM);
                if (elements.length > 0 && elements[elements.length - 1]?.innerHTML.includes('br')) {
                    clearInterval(interval);
                    this.insertIconsAndListeners();
                }
            }, 100);
            setTimeout(() => clearInterval(interval), 1500);
        };

        /**
         * @description Handles global click events for the script's UI.
         * @param {Event} e - The click event object.
         */
        handleClickEvents = (e) => {
            const clickedMagnifier = e.target.closest('.magnifier-icon');
            if (clickedMagnifier) {
                e.preventDefault();
                e.stopPropagation();
                const tid = clickedMagnifier.dataset.tid;
                const name = clickedMagnifier.dataset.opponent;
                if (!tid) return;
                this.saveTeam(tid, name);
                this.showInteractionModal(tid, clickedMagnifier);
                return;
            }
            const interactionModal = document.getElementById('interaction-modal');
            if (interactionModal && !interactionModal.contains(e.target)) {
                this.fadeOutAndRemove(interactionModal);
            }
            const tacticsContainer = document.getElementById('tactics-container');
            if (tacticsContainer && !e.target.closest('#tactics-container')) {
                this.fadeOutAndRemove(tacticsContainer);
            }
        };

        /**
         * @description Initializes the user's team ID.
         * @async
         */
        initUserTeamId = async () => {
            let storedId = GM_getValue(OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.USER_TEAM_ID);
            if (storedId) {
                this.myTeamId = storedId;
                return;
            }
            try {
                const response = await fetch(OpponentTacticsPreview.CONSTANTS.URLS.CLUBHOUSE);
                const text = await response.text();
                const match = text.match(/dynimg\/badge\.php\?team_id=(\d+)/);
                if (match && match[1]) {
                    this.myTeamId = match[1];
                    GM_setValue(OpponentTacticsPreview.CONSTANTS.STORAGE_KEYS.USER_TEAM_ID, this.myTeamId);
                }
            } catch (error) {}
        };

        /**
         * @description Main initialization function for the userscript.
         * @async
         */
        init = async () => {
            GM_addStyle(GM_getResourceText('ylotp'));
            this.createGlobalTooltip();
            await this.initUserTeamId();
            const statsXenteRunning = document.querySelector(OpponentTacticsPreview.CONSTANTS.SELECTORS.STATS_XENTE);
            const eloScheduledSelected = document.querySelector(OpponentTacticsPreview.CONSTANTS.SELECTORS.ELO_SCHEDULED)?.checked;

            if (statsXenteRunning && eloScheduledSelected) {
                this.waitForEloValues();
            } else {
                this.insertIconsAndListeners();
            }
            this.startObserving();
            document.body.addEventListener('click', this.handleClickEvents, true);
        };
    }

    const otp = new OpponentTacticsPreview();
    otp.init();
})();