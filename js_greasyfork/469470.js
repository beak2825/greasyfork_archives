// ==UserScript==
// @name         MZ - Player Weekly Matches Tracker
// @namespace    douglaskampl
// @version      5.5
// @description  Tracks the amount of friendlies and league matches (Senior/U23/U21/U18) played by each player during the current week
// @author       Douglas
// @match        https://www.managerzone.com/?p=challenges*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     weeklyMatchesTrackerStyles https://mzdv.me/mz/userscript/other/weeklyMatches.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469470/MZ%20-%20Player%20Weekly%20Matches%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/469470/MZ%20-%20Player%20Weekly%20Matches%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('weeklyMatchesTrackerStyles'));

    class MZConfig {
        static get ENDPOINTS() {
            return {
                CHALLENGE_TEMPLATE: 'https://www.managerzone.com/ajax.php',
                MATCHES_LIST: 'https://www.managerzone.com/ajax.php',
                MANAGER_DATA: 'https://www.managerzone.com/xml/manager_data.php',
                MATCH_INFO: 'https://www.managerzone.com/xml/match_info.php'
            };
        }

        static get MATCH_DAYS_FRIENDLY() {
            return ['d1', 'd3', 'd4', 'd5', 'd7'];
        }

        static get SPORT_IDS() {
            return {
                SOCCER: '1',
                HOCKEY: '2'
            };
        }

        static get LEAGUE_TYPES() {
            return ['series', 'u18_series', 'u21_series', 'u23_series'];
        }
    }

    class MatchTracker {
        constructor() {
            this.initializeState();
            this.initializeUI();
            this.fetchPageData();
        }

        initializeState() {
            const sportElement = document.querySelector('#shortcut_link_thezone');
            const sportParam = new URL(sportElement.href).searchParams.get('sport');

            this.sport = sportParam;
            this.sportId = sportParam === 'soccer' ? MZConfig.SPORT_IDS.SOCCER : MZConfig.SPORT_IDS.HOCKEY;
            this.teamId = null;
            this.appearances = new Map();
            this.matchesFetched = { friendly: false, league: false };
            this.pendingLeagueFetches = MZConfig.LEAGUE_TYPES.length;
            this.isLoadingComplete = false;
        }

        initializeUI() {
            this.createModal();
            this.createLoadingElements();
            this.createTable();
            this.addMainButton();
        }

        createModal() {
            const modal = document.createElement('div');
            modal.className = 'friendly-modal';

            const content = document.createElement('div');
            content.className = 'friendly-modal-content';

            const close = document.createElement('span');
            close.className = 'friendly-close';
            close.innerHTML = '×';
            close.onclick = () => this.toggleModal(false);

            content.appendChild(close);
            modal.appendChild(content);
            document.body.appendChild(modal);

            this.modal = modal;
            this.modalContent = content;

            modal.onclick = (e) => {
                if (e.target === modal) {
                    this.toggleModal(false);
                }
            };
        }

        createTable() {
            this.table = document.createElement('table');
            this.table.className = 'friendly-table';
            this.table.style.display = 'none';
            this.modalContent.appendChild(this.table);
        }

        createLoadingElements() {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'friendly-loading';

            const spinner = document.createElement('div');
            spinner.className = 'friendly-spinner';
            spinner.innerHTML = '<div></div><div></div><div></div><div></div>';

            const message = document.createElement('p');
            message.className = 'friendly-message';

            loadingDiv.appendChild(spinner);
            loadingDiv.appendChild(message);
            this.modalContent.appendChild(loadingDiv);

            this.loadingDiv = loadingDiv;
            this.spinner = spinner;
            this.messageElement = message;
        }

        addMainButton() {
            const checkExist = setInterval(() => {
                const target = document.getElementById('fss-title-heading');
                if (target) {
                    clearInterval(checkExist);

                    const container = document.createElement('div');
                    container.className = 'friendly-trigger-container';

                    const text = document.createElement('span');
                    text.className = 'friendly-text';
                    text.textContent = 'Click to check total matches played this week ->';

                    const button = document.createElement('button');
                    button.className = 'friendly-button';
                    button.setAttribute('aria-label', 'Show weekly player matches');
                    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM4.87 4.47a.5.5 0 0 0-.434-.27H3.21a.5.5 0 0 0-.457.672l.62 1.855a.5.5 0 0 0 .457.328h1.22a.5.5 0 0 0 .48-.64L4.87 4.47zM6.16 4.2h.81a.5.5 0 0 0 .48-.64L6.778 1.7a.5.5 0 0 0-.46-.327H5.134a.5.5 0 0 0-.457.672l.62 1.855a.5.5 0 0 0 .457.328h.406zm3.464 0h.81a.5.5 0 0 0 .457-.328l.62-1.855a.5.5 0 0 0-.457-.672H9.23a.5.5 0 0 0-.46.327L8.098 3.56a.5.5 0 0 0 .48.64h.416zM11.67 4.47l-.66 1.98a.5.5 0 0 0 .48.64h1.22a.5.5 0 0 0 .457-.328l.62-1.855a.5.5 0 0 0-.457-.672h-1.22a.5.5 0 0 0-.434.27zM4.183 7.342l-1.15 1.15a.5.5 0 0 0-.044.658l.866 1.298a.5.5 0 0 0 .658.044l1.15-1.15a.5.5 0 0 0 .044-.658L4.84 7.386a.5.5 0 0 0-.658-.044zm1.88 0l-.866 1.299a.5.5 0 0 0 .044.658l1.15 1.15a.5.5 0 0 0 .658.044l.866-1.299a.5.5 0 0 0-.044-.658L6.72 7.386a.5.5 0 0 0-.658-.044zm2.63 0l-.866 1.299a.5.5 0 0 0 .044.658l1.15 1.15a.5.5 0 0 0 .658.044l.866-1.299a.5.5 0 0 0-.044-.658L9.35 7.386a.5.5 0 0 0-.658-.044zm2.48 0l-.866 1.299a.5.5 0 0 0 .044.658l1.15 1.15a.5.5 0 0 0 .658.044l.866-1.299a.5.5 0 0 0-.044-.658l-1.15-1.15a.5.5 0 0 0-.658-.044zm.886 3.03l.866-1.299a.5.5 0 0 0-.044-.658L11.194 7.386a.5.5 0 0 0-.658.044l-.866 1.299a.5.5 0 0 0 .044.658l1.15 1.15a.5.5 0 0 0 .658.044zM4.5 10.05L3.35 8.9a.5.5 0 0 0-.658-.044L1.826 10.155a.5.5 0 0 0-.044.658l.866 1.299a.5.5 0 0 0 .658.044l1.15-1.15a.5.5 0 0 0 .044-.658zm6.836 0l.866 1.299a.5.5 0 0 0 .658.044l1.15-1.15a.5.5 0 0 0 .044-.658l-.866-1.299a.5.5 0 0 0-.658-.044L11.336 8.9a.5.5 0 0 0 .044.658zM7.21 10.692l-1.15 1.15a.5.5 0 0 0-.044.658l.866 1.298a.5.5 0 0 0 .658.044l1.15-1.15a.5.5 0 0 0 .044-.658l-.866-1.299a.5.5 0 0 0-.658-.044zm1.58 0l-.866 1.299a.5.5 0 0 0 .044.658l1.15 1.15a.5.5 0 0 0 .658.044l.866-1.299a.5.5 0 0 0-.044-.658l-1.15-1.15a.5.5 0 0 0-.658-.044z"/></svg>';
                    button.onclick = () => this.toggleModal(true);
                    container.appendChild(text);
                    container.appendChild(button);
                    target.parentNode.insertBefore(container, target);
                }
            }, 100);
        }

        toggleModal(show) {
            requestAnimationFrame(() => {
                if (show) {
                    this.modal.style.display = 'flex';
                    requestAnimationFrame(() => {
                        this.modal.classList.add('visible');
                        if (!this.isLoadingComplete) {
                            this.loadingDiv.style.display = 'flex';
                            this.spinner.style.display = 'block';
                            this.messageElement.style.display = 'none';
                            this.table.style.display = 'none';
                        } else {
                            this.loadingDiv.style.display = 'none';
                            this.table.style.display = 'table';
                        }
                    });
                } else {
                    this.modal.classList.remove('visible');
                    setTimeout(() => {
                        this.modal.style.display = 'none';
                        if (!this.isLoadingComplete) {
                            this.loadingDiv.style.display = 'none';
                        }
                    }, 250);
                }
            });
        }

        async fetchPageData() {
            try {
                const response = await fetch(window.location.href);
                const data = await response.text();
                const doc = new DOMParser().parseFromString(data, 'text/html');
                const username = doc.getElementById('header-username').textContent;
                await this.fetchManagerData(username);
            } catch (error) {
                console.warn('Error fetching page data:', error);
                this.showErrorMessage('Could not fetch page data.');
            }
        }

        async fetchManagerData(username) {
            try {
                const url = new URL(MZConfig.ENDPOINTS.MANAGER_DATA);
                url.searchParams.set('sport_id', this.sportId);
                url.searchParams.set('username', username);

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Manager data fetch failed: ${response.status}`);
                const xmlDoc = new DOMParser().parseFromString(await response.text(), 'text/xml');
                const teamElement = Array.from(xmlDoc.getElementsByTagName('Team')).find(team => team.getAttribute('sport') === this.sport);

                if (!teamElement) throw new Error('Could not find team element in manager data.');

                this.teamId = teamElement.getAttribute('teamId');
                if (!this.teamId) throw new Error('Could not extract team ID from manager data.');

                await this.fetchAllMatches();
            } catch (error) {
                console.warn('Error fetching manager data:', error);
                this.showErrorMessage(`Could not fetch manager data: ${error.message}`);
            }
        }

        checkCompletion() {
            if (this.matchesFetched.friendly && this.matchesFetched.league) {
                this.isLoadingComplete = true;
                if (this.appearances.size === 0) {
                    this.showNoMatchesMessage();
                } else {
                    this.displayPlayerMatches();
                }
            }
        }

        handleLeagueFetchCompletion() {
            this.pendingLeagueFetches--;
            if (this.pendingLeagueFetches <= 0) {
                this.matchesFetched.league = true;
                this.checkCompletion();
            }
        }

        async fetchAllMatches() {
            this.isLoadingComplete = false;
            this.appearances.clear();

            const friendlyPromise = this.fetchFriendlyMatches().catch(error => {
                console.warn('Error in fetchFriendlyMatches:', error);
            }).finally(() => {
                this.matchesFetched.friendly = true;
                this.checkCompletion();
            });

            const leaguePromises = MZConfig.LEAGUE_TYPES.map((leagueType) =>
                this.fetchLeagueMatches(leagueType)
                    .catch((error) => {
                        console.warn(`Error in fetchLeagueMatches for ${leagueType}:`, error);
                    })
                    .finally(() => {
                        this.handleLeagueFetchCompletion();
                    })
            );

            await Promise.all([friendlyPromise, ...leaguePromises]).catch(error => {
                console.warn('Error fetching one or more match types:', error);
                this.showErrorMessage('Error fetching some match data.');
            });
        }

        async fetchFriendlyMatches() {
            try {
                const url = new URL(MZConfig.ENDPOINTS.CHALLENGE_TEMPLATE);
                url.searchParams.set('p', 'challenge');
                url.searchParams.set('sub', 'personal-challenge-template');
                url.searchParams.set('sport', this.sport);

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Challenge template fetch failed: ${response.status}`);
                const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
                const matchesDiv = this.getCurrentWeekFriendlyMatchesDiv(doc);

                let friendlyMatchIds = [];
                if (matchesDiv) {
                    friendlyMatchIds = this.extractFriendlyMatchIds(matchesDiv);
                }

                if (friendlyMatchIds.length > 0) {
                    await this.fetchAndProcessMatches(friendlyMatchIds, 'friendly');
                }
            } catch (error) {
                console.warn('Error fetching friendly matches:', error);
            }
        }

        getCurrentWeekFriendlyMatchesDiv(doc) {
            const scheduleDiv = doc.getElementById('friendly_series_schedule');
            if (!scheduleDiv) return null;

            const calendarDiv = scheduleDiv.querySelector('.calendar');
            if (!calendarDiv) return null;

            const calendarForm = calendarDiv.querySelector('#saveMatchTactics');
            return calendarForm?.querySelector('div.flex-nowrap.fss-row.fss-gw-wrapper.fss-has-matches');
        }

        extractFriendlyMatchIds(matchesDiv) {
            const extractMatchIdFromLink = (link) => {
                const href = link.getAttribute('href');
                if (!href) return null;
                const match = href.match(/mid=(\d+)/);
                return match ? match[1] : null;
            };

            return MZConfig.MATCH_DAYS_FRIENDLY
                .map((className) => matchesDiv.querySelector(`.${className}`))
                .filter(Boolean)
                .flatMap((div) => Array.from(div.querySelectorAll('a.score-shown:not(.gray)'))
                .map(extractMatchIdFromLink)
                .filter(Boolean));
        }

        formatDateForMZ(date) {
            const d = String(date.getDate()).padStart(2, '0');
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const y = date.getFullYear();
            return `${d}-${m}-${y}`;
        }

        getRelevantLeagueDates() {
            const now = new Date();

            const resetHourUTC = 22;
            const resetDayUTC = 1;

            const currentDayUTC = now.getUTCDay();
            const currentHourUTC = now.getUTCHours();

            const startOfCurrentMZWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            startOfCurrentMZWeek.setUTCHours(resetHourUTC, 0, 0, 0);

            let daysAgo = (currentDayUTC - resetDayUTC + 7) % 7;

            if (currentDayUTC < resetDayUTC || (currentDayUTC === resetDayUTC && currentHourUTC < resetHourUTC)) {
                 daysAgo += 7;
            }

            startOfCurrentMZWeek.setUTCDate(startOfCurrentMZWeek.getUTCDate() - daysAgo);

            const wednesdayDate = new Date(startOfCurrentMZWeek);
            wednesdayDate.setUTCDate(startOfCurrentMZWeek.getUTCDate() + 2);

            const sundayDate = new Date(startOfCurrentMZWeek);
            sundayDate.setUTCDate(startOfCurrentMZWeek.getUTCDate() + 6);

            const relevantDates = new Set();
            relevantDates.add(this.formatDateForMZ(wednesdayDate));
            relevantDates.add(this.formatDateForMZ(sundayDate));

            return relevantDates;
        }


        async fetchLeagueMatches(selectType) {
            const relevantDates = this.getRelevantLeagueDates();
            if (relevantDates.size === 0) {

                return;
            }

            try {
                const url = new URL(MZConfig.ENDPOINTS.MATCHES_LIST);
                url.searchParams.set('p', 'matches');
                url.searchParams.set('sub', 'list');
                url.searchParams.set('sport', this.sport);

                const body = new URLSearchParams({
                    type: 'played',
                    hidescore: 'false',
                    tid1: this.teamId,
                    offset: '',
                    selectType: selectType,
                    limit: '10'
                });

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: body.toString()
                });

                if (!response.ok) throw new Error(`League (${selectType}) fetch failed: ${response.status}`);

                const data = await response.json();
                if (!data || !data.list) {
                    console.warn(`Invalid or empty league match list response for ${selectType}`);
                    return;
                }

                const doc = new DOMParser().parseFromString(data.list, 'text/html');
                const leagueMatchIds = this.extractLeagueMatchIds(doc, relevantDates);

                if (leagueMatchIds.length > 0) {
                    await this.fetchAndProcessMatches(leagueMatchIds, 'league');
                }
            } catch (error) {
                console.warn(`Error fetching league matches for type ${selectType}:`, error);
                throw error;
            }
        }

        extractLeagueMatchIds(doc, relevantDates) {
            const matchIds = [];
            const groups = doc.querySelectorAll('#fixtures-results-list > dd.group');
            groups.forEach(group => {
                const dateText = group.textContent.trim();
                if (relevantDates.has(dateText)) {
                    let nextElement = group.nextElementSibling;
                    while (nextElement && !nextElement.classList.contains('group')) {
                        if (nextElement.tagName === 'DD' && (nextElement.classList.contains('odd') || nextElement.classList.contains('even'))) {
                            const link = nextElement.querySelector('a.score-shown:not(.gray)');
                            if (link) {
                                const href = link.getAttribute('href');
                                if (href) {
                                    const match = href.match(/mid=(\d+)/);
                                    if (match && match[1]) {
                                        matchIds.push(match[1]);
                                    }
                                }
                            }
                        }
                        nextElement = nextElement.nextElementSibling;
                    }
                }
            });
            return matchIds;
        }

        async fetchAndProcessMatches(matchIds, type) {
            if (!matchIds || matchIds.length === 0) {
                return;
            }

            const processSingleMatch = async (matchId) => {
                try {
                    const url = new URL(MZConfig.ENDPOINTS.MATCH_INFO);
                    url.searchParams.set('sport_id', this.sportId);
                    url.searchParams.set('match_id', matchId);

                    const response = await fetch(url);
                    if (!response.ok) {
                        console.warn(`Failed to fetch match info for ID ${matchId}, status: ${response.status}`);
                        return;
                    }
                    const xmlText = await response.text();
                    if (!xmlText) {
                        console.warn(`Empty response for match info ID ${matchId}`);
                        return;
                    }

                    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
                    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                        console.warn(`Error parsing XML for match info ID ${matchId}`);
                        return;
                    }

                    const teamElements = Array.from(xmlDoc.getElementsByTagName('Team'));
                    const ourTeamElement = teamElements.find(team => team.getAttribute('id') === this.teamId);

                    if (ourTeamElement) {
                        this.updatePlayerAppearances(ourTeamElement, type);
                    } else {
                        console.warn(`Could not find team ${this.teamId} in match ${matchId}`);
                    }
                } catch (error) {
                    console.warn(`Error processing match ID ${matchId}:`, error);
                }
            };

            await Promise.all(matchIds.map(matchId => processSingleMatch(matchId)));
        }

        updatePlayerAppearances(ourTeamElement, type) {
            Array.from(ourTeamElement.getElementsByTagName('Player')).forEach(player => {
                const playerId = player.getAttribute('id');
                if (!playerId) return;
                const playerName = player.getAttribute('name');
                let playerInfo = this.appearances.get(playerId);

                if (!playerInfo) {
                    playerInfo = { name: playerName, friendly: 0, league: 0 };
                    this.appearances.set(playerId, playerInfo);
                }

                if (type === 'friendly') {
                    playerInfo.friendly += 1;
                } else if (type === 'league') {

                    if (playerInfo.league < 2) {
                        playerInfo.league += 1;
                    }
                }
            });
        }

        displayPlayerMatches() {
            this.loadingDiv.style.display = 'none';
            this.spinner.style.display = 'none';
            this.messageElement.style.display = 'none';
            this.table.style.display = 'table';
            this.table.innerHTML = '';
            this.table.appendChild(this.createHeaderRow());

            const sortedPlayers = Array.from(this.appearances.entries())
            .filter(([, playerInfo]) => playerInfo.friendly > 0 || playerInfo.league > 0)
            .sort(([, a], [, b]) => {
                const totalA = a.friendly + a.league;
                const totalB = b.friendly + b.league;
                if (totalB !== totalA) {
                    return totalB - totalA;
                }
                if (b.league !== a.league) {
                    return b.league - a.league;
                }
                return b.friendly - a.friendly;
            });


            if (sortedPlayers.length === 0) {
                this.showNoMatchesMessage();
                return;
            }

            sortedPlayers.forEach(([playerId, playerInfo]) => {
                this.table.appendChild(this.createPlayerRow(playerId, playerInfo));
            });
        }

        createHeaderRow() {
            const row = document.createElement('tr');
            ['Player', 'Matches'].forEach(text => {
                const th = document.createElement('th');
                th.className = 'friendly-header';
                th.textContent = text;
                row.appendChild(th);
            });
            return row;
        }

        createPlayerRow(playerId, playerInfo) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.className = 'friendly-cell';

            const link = document.createElement('a');
            link.className = 'friendly-link';
            link.href = `https://www.managerzone.com/?p=players&pid=${playerId}`;
            link.target = '_blank';
            link.textContent = playerInfo.name;
            nameCell.appendChild(link);

            const appearancesCell = document.createElement('td');
            appearancesCell.className = 'friendly-cell';

            const totalMatches = playerInfo.friendly + playerInfo.league;
            const detailsParts = [];
            if (playerInfo.friendly > 0) {
                detailsParts.push(`${playerInfo.friendly} Friendl${playerInfo.friendly === 1 ? 'y' : 'ies'}`);
            }
            if (playerInfo.league > 0) {
                detailsParts.push(`${playerInfo.league} League Match${playerInfo.league === 1 ? '' : 'es'}`);
            }
            const detailsString = detailsParts.length > 0 ? `(${detailsParts.join(', ')})` : '';

            appearancesCell.innerHTML = '';

            const totalSpan = document.createElement('span');
            totalSpan.className = 'total-matches';
            totalSpan.textContent = totalMatches;
            appearancesCell.appendChild(totalSpan);

            if (detailsString) {
                const detailsSpan = document.createElement('span');
                detailsSpan.className = 'match-details';
                detailsSpan.textContent = ' ' + detailsString;
                appearancesCell.appendChild(detailsSpan);
            } else if (totalMatches === 0) {
                totalSpan.textContent = '0';
            }

            row.appendChild(nameCell);
            row.appendChild(appearancesCell);

            return row;
        }

        showNoMatchesMessage() {
            this.loadingDiv.style.display = 'flex';
            this.spinner.style.display = 'none';
            this.messageElement.style.display = 'block';
            this.messageElement.classList.remove('error');
            this.messageElement.textContent = 'No friendly or relevant league matches found for players this week!';
            this.table.style.display = 'none';
            this.table.innerHTML = '';
        }

        showErrorMessage(message) {
            this.isLoadingComplete = true;
            this.loadingDiv.style.display = 'flex';
            this.spinner.style.display = 'none';
            this.messageElement.style.display = 'block';
            this.messageElement.classList.add('error');
            this.messageElement.textContent = message;
            this.table.style.display = 'none';
            this.table.innerHTML = '';
        }
    }

    new MatchTracker();
})();
