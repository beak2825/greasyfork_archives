// ==UserScript==
// @name         MZ - Ongoing Matches
// @namespace    douglaskampl
// @version      3.99
// @description  Fetches results of ongoing matches and updates standings
// @author       Douglas
// @match        https://www.managerzone.com/?p=league*
// @match        https://www.managerzone.com/?p=friendlyseries*
// @match        https://www.managerzone.com/?p=private_cup*
// @match        https://www.managerzone.com/?p=cup*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js
// @resource     NPROGRESS_CSS https://unpkg.com/nprogress@0.2.0/nprogress.css
// @resource     ongoingMatchesStyles https://mzdv.me/mz/userscript/other/ongoing.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520328/MZ%20-%20Ongoing%20Matches.user.js
// @updateURL https://update.greasyfork.org/scripts/520328/MZ%20-%20Ongoing%20Matches.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('NPROGRESS_CSS'));
    GM_addStyle(GM_getResourceText('ongoingMatchesStyles'));

    const UI = {
        BUTTON_STATES: {
            READY: 'GetMatchResults',
            FETCHING: 'Processing…',
            DONE: 'Done!'
        },
        PROGRESS_MESSAGES: {
            FETCHING_MATCHES: 'Fetching matches…',
            PROCESSING_RESULTS: 'Processing results…',
            UPDATING_STANDINGS: 'Updating standings…',
            ALL_COMPLETE: 'Done!'
        },
        MODAL: {
            NO_MATCHES_FOUND: 'Matches have not started yet. Please wait a few minutes.',
            STANDINGS_UPDATED: 'League standings have been updated with the results above.',
            NO_UPDATES_NEEDED: 'No ongoing matches. League standings were not updated.'
        },
        MATCH_STATUS: {
            WIN: 'green',
            DRAW: 'yellow',
            LOSS: 'red'
        }
    };

    const SELECTORS = {
        TRACK_BUTTONS: [
            '[id^="trackButton_series_"]',
            '[id^="trackButton_u18_series_"]',
            '[id^="trackButton_u21_series_"]',
            '[id^="trackButton_u23_series_"]',
            '[id^="trackButton_world_series_"]',
            '[id^="trackButton_u18_world_series_"]',
            '[id^="trackButton_u21_world_series_"]',
            '[id^="trackButton_u23_world_series_"]',
            '[id^="trackButton_friendlyseries_"]',
            '[id^="trackButton_cup_"]',
            '[id^="trackButton_privatecup_"]'
        ],
        MATCHES_TABLE: 'table.hitlist',
        STANDINGS_TABLE: 'table.nice_table',
        LAST_SIX_CELL: 'td.responsive-hide'
    };

    const ENDPOINTS = {
        MATCH_INFO: 'https://www.managerzone.com/xml/match_info.php?sport_id=1&match_id=',
        FRIENDLY_LEAGUE_SCHEDULE: 'https://www.managerzone.com/ajax.php?p=friendlySeries&sub=matches&sport=soccer&fsid='
    };

    class OngoingMatchesTracker {
        constructor() {
            this.matchResults = new Map();
            this.isFriendlyLeague = window.location.href.includes('friendlyseries');
            this.isPrivateCup = window.location.href.includes('private_cup');
            this.isCup = window.location.href.includes('p=cup');
            this.hasRun = false;
            this.observe();
        }

        async init() {
            const matches = await this.getMatches();
            if (!matches || !matches.length) return;
            this.setUpUI(matches);
        }

        async getMatches() {
            if (this.isFriendlyLeague) return await this.getFriendlyLeagueMatches();
            if (this.isPrivateCup || this.isCup) return this.getCupMatches();
            return this.getLeagueMatches();
        }

        getLeagueMatches() {
            const matchesTable = document.querySelector(SELECTORS.MATCHES_TABLE);
            if (!matchesTable) return [];
            return Array.from(matchesTable.querySelectorAll('tr'))
                .filter(row => {
                    const link = row.querySelector('a[href*="mid="]');
                    if (!link) return false;
                    const score = link.textContent.trim();
                    return !/^\d+\s*-\s*\d+$/.test(score) && !/^X\s*-\s*X$/.test(score);
                })
                .map(row => {
                    const link = row.querySelector('a[href*="mid="]');
                    const homeTeam = row.querySelector('td:first-child').textContent.trim();
                    const awayTeam = row.querySelector('td:last-child').textContent.trim();
                    const params = new URLSearchParams(link.href);
                    return {
                        mid: params.get('mid'),
                        homeTeam,
                        awayTeam
                    };
                });
        }

        async getFriendlyLeagueMatches() {
            const fsidMatch = window.location.href.match(/fsid=(\d+)/);
            if (!fsidMatch) return [];
            try {
                const response = await fetch(ENDPOINTS.FRIENDLY_LEAGUE_SCHEDULE + fsidMatch[1]);
                const text = await response.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const now = new Date();
                const ongoingMatches = [];
                const rounds = doc.querySelectorAll('h2.subheader.clearfix');
                rounds.forEach(round => {
                    const headerText = round.textContent;
                    const dateTimeMatch = headerText.match(/(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2}(?:am|pm))/i);
                    if (dateTimeMatch) {
                        const dateStr = dateTimeMatch[1];
                        const timeStr = dateTimeMatch[2];
                        const matchTime = this.parseDateTime(dateStr, timeStr);
                        const matchEndTime = new Date(matchTime.getTime() + 2 * 60 * 60 * 1000);
                        const matchesDiv = round.nextElementSibling;
                        if (matchesDiv && matchesDiv.classList.contains('mainContent')) {
                            const matchRows = matchesDiv.querySelectorAll('tr');
                            matchRows.forEach(m => {
                                const link = m.querySelector('a[href*="mid="]');
                                if (link) {
                                    const score = link.textContent.trim();
                                    if (!/^\d+-\d+$/.test(score)) {
                                        if (score === 'X - X') {
                                            if (now >= matchTime && now <= matchEndTime) {
                                                const homeTeam = m.querySelector('td:first-child').textContent.trim();
                                                const awayTeam = m.querySelector('td:last-child').textContent.trim();
                                                const params = new URLSearchParams(link.href);
                                                ongoingMatches.push({
                                                    mid: params.get('mid'),
                                                    homeTeam,
                                                    awayTeam
                                                });
                                            }
                                        } else {
                                            const homeTeam = m.querySelector('td:first-child').textContent.trim();
                                            const awayTeam = m.querySelector('td:last-child').textContent.trim();
                                            const params = new URLSearchParams(link.href);
                                            ongoingMatches.push({
                                                mid: params.get('mid'),
                                                homeTeam,
                                                awayTeam
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                return ongoingMatches;
            } catch (error) {
                return [];
            }
        }

        getCupMatches() {
            const groupStages = document.querySelector('#group-stages');
            if (!groupStages) return [];
            return Array.from(groupStages.querySelectorAll('table.hitlist tr'))
                .filter(row => {
                    const link = row.querySelector('a[href*="mid="]');
                    if (!link) return false;
                    const score = link.textContent.trim();
                    return !/^\d+\s*-\s*\d+$/.test(score) && !/^X\s*-\s*X$/.test(score);
                })
                .map(row => {
                    const link = row.querySelector('a[href*="mid="]');
                    const homeTeam = row.querySelector('td:first-child').textContent.trim();
                    const awayTeam = row.querySelector('td:last-child').textContent.trim();
                    const params = new URLSearchParams(link.href);
                    return {
                        mid: params.get('mid'),
                        homeTeam,
                        awayTeam
                    };
                });
        }

        setUpUI(matches) {
            const trackButton = this.findTrackButton();
            if (!trackButton) return;
            if (trackButton.parentNode.classList.contains('mz-fetch-added')) return;
            trackButton.parentNode.classList.add('mz-fetch-added');
            const fetchButton = this.createFetchButton();
            trackButton.parentNode.insertBefore(fetchButton, trackButton.nextSibling);
            fetchButton.addEventListener('click', () => {
                if (!this.hasRun) this.handleFetchClick(fetchButton, matches);
            });
        }

        findTrackButton() {
            const stdButton = SELECTORS.TRACK_BUTTONS.reduce(
                (found, selector) => found || document.querySelector(selector),
                null
            );
            const alt = document.querySelector('img[src*="/img/livescores/cm_promo_icon.gif"]')?.closest('div');
            return stdButton || alt || null;
        }

        createFetchButton() {
            const button = document.createElement('button');
            button.className = 'mz-fetch-matches-button';
            button.textContent = UI.BUTTON_STATES.READY;
            return button;
        }

        showResultsModal(results) {
            const modal = document.createElement('div');
            modal.className = 'mz-modal';
            const roundNum = this.getCurrentRound();
            const headerTitle = roundNum
                ? `Match Results for Round ${roundNum}`
                : 'Match Results for Current Round';

            const header = document.createElement('div');
            header.className = 'mz-modal-header';
            header.innerHTML = `
            <h3>${headerTitle}</h3>
            <button class="mz-modal-close">Close</button>
          `;

            const content = document.createElement('div');
            content.className = 'mz-modal-content';

            if (results && results.length > 0) {
                results.forEach(r => {
                    const matchDiv = document.createElement('div');
                    matchDiv.className = 'mz-match-result';
                    const matchLink = document.createElement('a');
                    matchLink.href = `https://www.managerzone.com/?p=match&mid=${r.mid}`;
                    matchLink.className = 'mz-match-link';
                    matchLink.textContent = `${r.homeTeam} ${r.score} ${r.awayTeam}`;
                    matchDiv.appendChild(matchLink);
                    content.appendChild(matchDiv);
                });
            } else {
                const noMatchesDiv = document.createElement('div');
                noMatchesDiv.className = 'mz-no-matches';
                noMatchesDiv.textContent = UI.MODAL.NO_MATCHES_FOUND;
                content.appendChild(noMatchesDiv);
            }

            const footer = document.createElement('div');
            footer.className = 'mz-modal-footer';
            footer.innerHTML = `
            <div class="mz-update-info">
              ${results && results.length > 0
                    ? UI.MODAL.STANDINGS_UPDATED
                    : UI.MODAL.NO_UPDATES_NEEDED}
            </div>
          `;

            modal.appendChild(header);
            modal.appendChild(content);
            modal.appendChild(footer);
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);

            modal.querySelector('.mz-modal-close').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }

        async clickStandingsTab() {
            if (window.location.href === 'https://www.managerzone.com/?p=league&type=senior') {
                const ul = document.querySelectorAll('.ui-tabs-nav')[0];
                if (ul) {
                    const tabs = ul.querySelectorAll('li[role="tab"]');
                    if (tabs.length >= 1) {
                        const firstTab = tabs[0];
                        if (
                            !firstTab.classList.contains('ui-tabs-active') &&
                            !firstTab.classList.contains('ui-state-active')
                        ) {
                            firstTab.querySelector('a').click();
                            await new Promise(r => setTimeout(r, 1000));
                        }
                    }
                }
            } else if (window.location.href.includes('p=league')) {
                const ul = document.querySelectorAll('.ui-tabs-nav')[0];
                if (ul) {
                    const tabs = ul.querySelectorAll('li[role="tab"]');
                    if (tabs.length >= 2) {
                        const secondTab = tabs[1];
                        if (
                            !secondTab.classList.contains('ui-tabs-active') &&
                            !secondTab.classList.contains('ui-state-active')
                        ) {
                            secondTab.querySelector('a').click();
                            await new Promise(r => setTimeout(r, 1000));
                        }
                    }
                }
            } else if (this.isFriendlyLeague) {
                const allUls = document.querySelectorAll('.ui-tabs-nav');
                if (allUls.length >= 2) {
                    const secondUl = allUls[1];
                    const tabs = secondUl.querySelectorAll('li[role="tab"]');
                    if (tabs.length >= 2) {
                        const secondTab = tabs[1];
                        if (
                            !secondTab.classList.contains('ui-tabs-active') &&
                            !secondTab.classList.contains('ui-state-active')
                        ) {
                            secondTab.querySelector('a').click();
                            await new Promise(r => setTimeout(r, 1000));
                        }
                    }
                }
            }
        }

        async handleFetchClick(button, matches) {
            if (this.hasRun) return;
            this.hasRun = true;

            await this.clickStandingsTab();

            NProgress.configure({ showSpinner: false });
            NProgress.start();
            this.showStatusMessage(UI.PROGRESS_MESSAGES.FETCHING_MATCHES);

            if (!matches.length) {
                if (this.isFriendlyLeague || this.isPrivateCup || this.isCup) {
                    this.showResultsModal([]);
                }
                NProgress.done();
                return;
            }

            button.classList.add('disabled');
            button.textContent = UI.BUTTON_STATES.FETCHING;

            this.showStatusMessage(UI.PROGRESS_MESSAGES.PROCESSING_RESULTS);
            const results = await this.processMatches(matches);

            if (this.isFriendlyLeague || this.isPrivateCup || this.isCup) {
                this.showResultsModal(results);
            }

            this.showStatusMessage(UI.PROGRESS_MESSAGES.UPDATING_STANDINGS);
            this.updateAllTeamStats();

            button.classList.remove('disabled');
            button.classList.add('done');
            button.textContent = UI.BUTTON_STATES.DONE;

            NProgress.done();
            this.showStatusMessage(UI.PROGRESS_MESSAGES.ALL_COMPLETE);
        }

        parseDateTime(dateStr, timeStr) {
            const [day, month, year] = dateStr.split('/');
            const date = `${month}/${day}/${year}`;
            let [time, period] = timeStr.toLowerCase().split(/(?=[ap]m)/);
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            if (period === 'pm' && hours !== 12) hours += 12;
            else if (period === 'am' && hours === 12) hours = 0;
            return new Date(`${date} ${hours}:${minutes}`);
        }

        getCurrentRound() {
            const table = document.querySelector(SELECTORS.STANDINGS_TABLE);
            if (!table) return null;
            const firstDataRow = table.querySelector('tbody tr');
            if (!firstDataRow) return null;
            const matchesCell = firstDataRow.querySelector('td:nth-child(3)');
            if (!matchesCell) return null;
            return parseInt(matchesCell.textContent.trim(), 10) + 1;
        }

        async processMatches(matches) {
            const results = [];
            const total = matches.length;
            for (let i = 0; i < total; i++) {
                const match = matches[i];
                try {
                    const response = await fetch(`${ENDPOINTS.MATCH_INFO}${match.mid}`);
                    const text = await response.text();
                    const matchData = this.parseMatchResponse({ responseText: text });
                    if (matchData) {
                        matchData.homeTeam = match.homeTeam;
                        matchData.awayTeam = match.awayTeam;
                        this.matchResults.set(match.mid, matchData);
                        this.updateMatchDisplay(match.mid, matchData);
                        results.push({
                            ...match,
                            score: `${matchData.homeGoals}-${matchData.awayGoals}`
                        });
                    }
                } catch (error) { }
                NProgress.set((i + 1) / total);
            }
            return results;
        }

        parseMatchResponse(response) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.responseText, 'application/xml');
            const matchNode = xmlDoc.querySelector('Match');
            if (!matchNode) return null;
            const homeTeam = matchNode.querySelector('Team[field="home"]');
            const awayTeam = matchNode.querySelector('Team[field="away"]');
            if (!homeTeam || !awayTeam) return null;
            return {
                homeTid: homeTeam.getAttribute('id'),
                awayTid: awayTeam.getAttribute('id'),
                homeGoals: parseInt(homeTeam.getAttribute('goals'), 10) || 0,
                awayGoals: parseInt(awayTeam.getAttribute('goals'), 10) || 0
            };
        }

        updateMatchDisplay(mid, matchData) {
            const link = Array.from(document.links).find(l => l.href.includes(`mid=${mid}`));
            if (link) {
                link.textContent = `${matchData.homeGoals}-${matchData.awayGoals}`;
            }
        }

        calculateMatchResult(matchData) {
            if (matchData.homeGoals > matchData.awayGoals) {
                return {
                    home: { points: 3, goalsFor: matchData.homeGoals, goalsAgainst: matchData.awayGoals },
                    away: { points: 0, goalsFor: matchData.awayGoals, goalsAgainst: matchData.homeGoals }
                };
            } else if (matchData.homeGoals < matchData.awayGoals) {
                return {
                    home: { points: 0, goalsFor: matchData.homeGoals, goalsAgainst: matchData.awayGoals },
                    away: { points: 3, goalsFor: matchData.awayGoals, goalsAgainst: matchData.homeGoals }
                };
            } else {
                return {
                    home: { points: 1, goalsFor: matchData.homeGoals, goalsAgainst: matchData.awayGoals },
                    away: { points: 1, goalsFor: matchData.awayGoals, goalsAgainst: matchData.homeGoals }
                };
            }
        }

        sortTableByPoints() {
            const table = document.querySelector(SELECTORS.STANDINGS_TABLE);
            if (!table) return;
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            const dataRows = Array.from(tbody.querySelectorAll('tr')).filter(r => {
                const cells = r.querySelectorAll('td');
                return cells.length >= 10 && cells[2] && !isNaN(parseInt(cells[2].textContent));
            });
            dataRows.sort((a, b) => {
                const getVal = (rw, i) => parseInt(rw.querySelectorAll('td')[i].textContent.trim(), 10) || 0;
                const pointsA = getVal(a, 9);
                const pointsB = getVal(b, 9);
                if (pointsB !== pointsA) return pointsB - pointsA;
                const goalDiffA = getVal(a, 6) - getVal(a, 7);
                const goalDiffB = getVal(b, 6) - getVal(b, 7);
                if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
                return getVal(b, 6) - getVal(a, 6);
            });
            const nonDataRows = Array.from(tbody.children).filter(r => !dataRows.includes(r));
            const tempContainer = document.createDocumentFragment();
            dataRows.forEach((row, index) => {
                const originalRow = row.cloneNode(true);
                const positionCell = originalRow.querySelector('td:first-child span');
                if (positionCell) {
                    const prevHelpButton = row.querySelector('td:first-child span .help_button');
                    positionCell.innerHTML = `${index + 1}`;
                    if (prevHelpButton) positionCell.appendChild(prevHelpButton);
                }
                originalRow.className = index % 2 === 0 ? '' : 'highlight_row';
                if (index === 0) originalRow.classList.add('mz-table-row-champion');
                else if (index === 1) originalRow.classList.add('mz-table-row-promotion');
                else if (index === 7) originalRow.classList.add('mz-table-row-relegation');
                tempContainer.appendChild(originalRow);
            });
            nonDataRows.forEach(r => {
                tempContainer.appendChild(r.cloneNode(true));
            });
            tbody.innerHTML = '';
            tbody.appendChild(tempContainer);
            table.classList.add('standings-updated');
            setTimeout(() => table.classList.remove('standings-updated'), 2000);
        }

        findTeamRows(tid) {
            const teamLinks = Array.from(document.querySelectorAll(`a[href*="tid=${tid}"]`));
            const rowsSet = new Set();
            teamLinks.forEach(link => {
                const row = link.closest('tr');
                if (row) rowsSet.add(row);
            });
            const highlightedRows = Array.from(document.querySelectorAll('.highlight_row'))
                .filter(r => r.querySelector(`a[href*="tid=${tid}"]`));
            highlightedRows.forEach(r => rowsSet.add(r));
            return Array.from(rowsSet);
        }

        updateAllTeamStats() {
            this.matchResults.forEach(m => {
                const result = this.calculateMatchResult(m);
                this.updateTeamRow(m.homeTid, result.home);
                this.updateTeamRow(m.awayTid, result.away);
            });
            this.sortTableByPoints();
        }

        updateTeamRow(tid, result) {
            const teamRows = this.findTeamRows(tid);
            if (!teamRows.length) return;
            teamRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 10) return;
                const parseCell = c => parseInt(c.textContent, 10) || 0;
                const updateCell = (c, val) => {
                    c.classList.add('updated-cell');
                    c.textContent = val;
                    setTimeout(() => c.classList.remove('updated-cell'), 1500);
                };
                updateCell(cells[2], parseCell(cells[2]) + 1);
                if (result.points === 3) updateCell(cells[3], parseCell(cells[3]) + 1);
                else if (result.points === 1) updateCell(cells[4], parseCell(cells[4]) + 1);
                else updateCell(cells[5], parseCell(cells[5]) + 1);
                updateCell(cells[6], parseCell(cells[6]) + result.goalsFor);
                updateCell(cells[7], parseCell(cells[7]) + result.goalsAgainst);
                const goalDiff = parseCell(cells[6]) - parseCell(cells[7]);
                const goalDiffElem = cells[8].querySelector('nobr');
                if (goalDiffElem) updateCell(goalDiffElem, goalDiff);
                updateCell(cells[9], parseCell(cells[9]) + result.points);
                this.updateLastSixDisplay(row, result, tid);
            });
        }

        updateLastSixDisplay(row, result, tid) {
            const lastSixCell = row.querySelector(SELECTORS.LAST_SIX_CELL);
            if (!lastSixCell) return;
            const nobrElement = lastSixCell.querySelector('nobr');
            if (!nobrElement) return;
            const links = nobrElement.querySelectorAll('a');
            const allTeamMatches = Array.from(this.matchResults.entries()).filter(([_, data]) => data.homeTid === tid || data.awayTid === tid);
            if (!allTeamMatches.length) return;
            const [matchId, data] = allTeamMatches[allTeamMatches.length - 1];
            const matchStatus = this.getMatchStatus(result);
            if (links.length >= 6) links[0].remove();
            const newStatusLink = this.createStatusLink(matchStatus, matchId, data, tid);
            nobrElement.appendChild(newStatusLink);
        }

        getMatchStatus(result) {
            if (result.points === 3) return UI.MATCH_STATUS.WIN;
            if (result.points === 1) return UI.MATCH_STATUS.DRAW;
            return UI.MATCH_STATUS.LOSS;
        }

        createStatusLink(status, matchId, matchData, tid) {
            const link = document.createElement('a');
            link.href = `/?p=match&sub=result&mid=${matchId}`;
            const isHome = matchData.homeTid === tid;
            const teamScore = isHome ? matchData.homeGoals : matchData.awayGoals;
            const oppScore = isHome ? matchData.awayGoals : matchData.homeGoals;
            link.title = `${matchData.homeTeam} ${matchData.homeGoals} - ${matchData.awayGoals} ${matchData.awayTeam}`;
            const img = document.createElement('img');
            img.style.border = '0';
            img.src = `img/status_${status}.gif`;
            img.alt = '';
            img.width = '13';
            img.height = '12';
            link.appendChild(img);
            return link;
        }

        showStatusMessage(message) {
            const existingMessage = document.querySelector('.status-message');
            existingMessage?.remove();
            const messageElement = document.createElement('div');
            messageElement.className = 'status-message';
            messageElement.textContent = message;
            document.body.appendChild(messageElement);
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => messageElement.remove(), 300);
            }, 2000);
        }

        observe() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        const trackButton = this.findTrackButton();
                        if (trackButton && !document.querySelector('.mz-fetch-matches-button')) {
                            this.init();
                            break;
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    const tracker = new OngoingMatchesTracker();
    tracker.init();
})();
