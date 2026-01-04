// ==UserScript==
// @name         MZ - WLMatches
// @namespace    douglaskampl
// @version      3.16
// @description  Detects potentially weird match results in world leagues
// @author       Douglas
// @match        https://www.managerzone.com/?p=match&sub=livescores_overview
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     weirdWLMatchesStyles https://mzdv.me/mz/userscript/other/worldLeagueMatches.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522957/MZ%20-%20WLMatches.user.js
// @updateURL https://update.greasyfork.org/scripts/522957/MZ%20-%20WLMatches.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('weirdWLMatchesStyles'));

    const improvedSpinnerStyles = `
        .mz-loader {
            box-sizing: border-box;
            font-size: 0;
            width: 40px;
            height: 40px;
            position: fixed;
            top: calc(50% - 20px);
            left: calc(50% - 20px);
            z-index: 10001;
            border-radius: 50%;
            border: 4px solid rgba(150, 150, 150, 0.3);
            border-top-color: #555555;
            animation: mz-loader-spin 0.8s linear infinite;
        }

        @keyframes mz-loader-spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;
    GM_addStyle(improvedSpinnerStyles);

    const CONSTANTS = {
        LEAGUE_TYPES: ['senior', 'u18_world', 'u21_world', 'u23_world'],
        LEAGUE_DISPLAY_NAMES: {
            'senior': 'Senior',
            'u18_world': 'U18',
            'u21_world': 'U21',
            'u23_world': 'U23'
        },
        LEAGUE_LIMITS: {
            div1: 1,
            div2: 13,
            div3: 40,
            div4: 121,
            div5: 291
        },
        ROUND_PAIRS: [
            { first: '11', second: '12', display: '11/12' },
            { first: '10', second: '13', display: '10/13' },
            { first: '9', second: '14', display: '9/14' },
            { first: '8', second: '15', display: '8/15' },
            { first: '7', second: '16', display: '7/16' },
            { first: '6', second: '17', display: '6/17' },
            { first: '5', second: '18', display: '5/18' },
            { first: '4', second: '19', display: '4/19' },
            { first: '3', second: '20', display: '3/20' },
            { first: '2', second: '21', display: '2/21' },
            { first: '1', second: '22', display: '1/22' }
        ],
        ERROR_MESSAGES: {
            FETCH_ERROR: 'Error fetching data from league',
            NO_DISCREPANCIES: 'No result inconsistencies found in this league.',
            INVALID_INPUT: 'Please enter a number between 1 and 10.'
        },
        DOM: {
            NAV_UL_SELECTOR: '#leftnav-wrapper ul.leftnav',
            BUTTON_CLASS: 'wl-check-button',
            BUTTON_TEXT: 'CHECK RESULTS',
            BUTTON_TITLE: 'Find inconsistent results between home and away matches'
        },
        REGEX: {
            SCORE: /<a[^>]*>([^<]+)<\/a>/,
            LINK: /<a href="([^"]+)"/,
            UNPLAYED_SCORE: /X\s*-\s*X/
        }
    };

    function getDivisionName(sid) {
        if (sid === CONSTANTS.LEAGUE_LIMITS.div1) return "Top Series";
        if (sid >= 2 && sid <= 4) return `1.${sid - 1}`;
        if (sid >= 5 && sid <= CONSTANTS.LEAGUE_LIMITS.div2) return `2.${sid - 4}`;
        if (sid >= 14 && sid <= CONSTANTS.LEAGUE_LIMITS.div3) return `3.${sid - 13}`;
        return `4.${sid - 40}`;
    }

    async function fetchLeagueData(leagueType, worldLeagueId) {
        let finalLeagueType = leagueType === 'senior' ? 'world' : leagueType;
        const url = `/ajax.php?p=league&type=${finalLeagueType}&sid=${worldLeagueId}&tid=1&sport=soccer&sub=schedule`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`${CONSTANTS.ERROR_MESSAGES.FETCH_ERROR} ${worldLeagueId}:`, error.message);
            return null;
        }
    }

    function extractMatchesFromHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const roundHeaders = doc.querySelectorAll('h2.subheader');
        const matches = [];

        roundHeaders.forEach((header, index) => {
            const roundNumber = index + 1;
            const nextElement = header.nextElementSibling;

            if (nextElement && nextElement.classList.contains('mainContent')) {
                const matchRows = nextElement.querySelectorAll('tr');

                matchRows.forEach(row => {
                    const teams = row.querySelectorAll('td');
                    const scoreLink = row.querySelector('a');

                    if (teams.length >= 3 && scoreLink) {
                        const match = {
                            teams: [
                                teams[0].textContent.trim(),
                                teams[2].textContent.trim()
                            ],
                            score: scoreLink.textContent.trim(),
                            link: scoreLink.getAttribute('href'),
                            round: roundNumber.toString()
                        };
                        matches.push(match);
                    }
                });
            }
        });

        return matches;
    }

    function checkDiscrepancy(homeScore, awayScore) {
        const homeDiff = homeScore[0] - homeScore[1];
        const awayDiff = awayScore[1] - awayScore[0];

        const getWinner = diff => diff > 0 ? 0 : diff < 0 ? 1 : 2;
        const homeWinner = getWinner(homeDiff);
        const awayWinner = getWinner(awayDiff);

        return {
            totalDiff: Math.abs(homeDiff) + Math.abs(awayDiff),
            isDiscrepancy: homeWinner !== 2 && awayWinner !== 2 && homeWinner !== awayWinner
        };
    }

    async function processLeague(leagueType, worldLeagueId, minTotalDiff, roundNumbers) {
        const html = await fetchLeagueData(leagueType, worldLeagueId);
        if (!html) return { discrepancies: [] };

        const matches = extractMatchesFromHTML(html);
        const homeResults = new Map();
        const awayResults = new Map();
        const discrepancies = [];

        matches.forEach(match => {
            if (CONSTANTS.REGEX.UNPLAYED_SCORE.test(match.score)) return;

            const matchKey = `${match.teams[0]} vs ${match.teams[1]}`;

            if (match.round === roundNumbers.first) {
                homeResults.set(matchKey, match);
            } else if (match.round === roundNumbers.second) {
                awayResults.set(matchKey, match);
            }
        });

        for (const [key, awayMatch] of awayResults) {
            const homeKey = `${awayMatch.teams[1]} vs ${awayMatch.teams[0]}`;
            const homeMatch = homeResults.get(homeKey);

            if (!homeMatch) continue;

            const homeScore = homeMatch.score.split(" - ").map(Number);
            const awayScore = awayMatch.score.split(" - ").map(Number);

            const { totalDiff, isDiscrepancy } = checkDiscrepancy(homeScore, awayScore);

            if (totalDiff >= minTotalDiff && isDiscrepancy) {
                discrepancies.push({
                    division: getDivisionName(worldLeagueId),
                    divisionId: worldLeagueId,
                    homeMatch: { ...homeMatch },
                    awayMatch: { ...awayMatch }
                });
            }
        }

        return { discrepancies };
    }

    function createModal(discrepancies, leagueType, minDiff, roundNumbers) {
        const modalHtml = `
            <div class="mz-modal-overlay mz-modern">
                <div class="mz-modal mz-modern">
                    <div class="mz-modal-header mz-modern">
                        <h2 class="mz-modal-title">
                            ${CONSTANTS.LEAGUE_DISPLAY_NAMES[leagueType]} Inconsistent Results [R${roundNumbers.first}/${roundNumbers.second} | Min Diff: ${minDiff}]
                        </h2>
                        <button class="mz-modal-close">×</button>
                    </div>
                    <div class="mz-modal-content mz-modern">
                        ${discrepancies.map(d => `
                            <div class="mz-discrepancy mz-modern">
                                <div class="mz-discrepancy-header mz-modern">
                                    DIVISION: <a href="/?p=league&type=placeholder&sid=${d.divisionId}" class="mz-div-link">${d.division}</a>
                                </div>
                                <div>
                                    R${d.homeMatch.round}: <a href="${d.homeMatch.link}" class="mz-match-link" target="_blank">
                                        ${d.homeMatch.teams[0]} vs ${d.homeMatch.teams[1]} (${d.homeMatch.score})
                                    </a>
                                </div>
                                <div>
                                    R${d.awayMatch.round}: <a href="${d.awayMatch.link}" class="mz-match-link" target="_blank">
                                        ${d.awayMatch.teams[0]} vs ${d.awayMatch.teams[1]} (${d.awayMatch.score})
                                    </a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);

        const links = modalElement.querySelectorAll('.mz-div-link');
        for (const a of links) {
            const href = a.getAttribute('href');
            const replaced = href.replace('placeholder', encodeURIComponent(leagueType));
            a.setAttribute('href', replaced);
        }

        const closeButton = modalElement.querySelector('.mz-modal-close');
        const overlay = modalElement.querySelector('.mz-modal-overlay');
        const closeModal = () => modalElement.remove();

        closeButton.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        }, { once: true });
    }

    function createSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'mz-loader';
        spinner.style.display = 'none';
        document.body.appendChild(spinner);
        return spinner;
    }

    function promptForParams() {
        const modalHtml = `
            <div class="mz-modal-overlay mz-modern">
                <div class="input-modal mz-modern" onclick="event.stopPropagation()">
                    <h3>SELECT LEAGUE TYPE</h3>
                    <select id="leagueSelect">
                        ${CONSTANTS.LEAGUE_TYPES.map(l => `
                            <option value="${l}">${CONSTANTS.LEAGUE_DISPLAY_NAMES[l]}</option>
                        `).join('')}
                    </select>
                    <h3>SELECT ROUNDS TO COMPARE</h3>
                    <select id="roundSelect">
                        ${CONSTANTS.ROUND_PAIRS.map((pair, index) => `
                            <option value="${index}">${pair.display}</option>
                        `).join('')}
                    </select>
                    <h3>MINIMUM GOAL DIFFERENCE</h3>
                    <input type="text" id="diffInput" placeholder="1-10">
                    <div>
                        <button class="confirm">SEARCH</button>
                        <button class="cancel">CANCEL</button>
                    </div>
                </div>
            </div>
        `;

        return new Promise((resolve, reject) => {
            const modalElement = document.createElement('div');
            modalElement.innerHTML = modalHtml;
            document.body.appendChild(modalElement);

            const leagueSelect = modalElement.querySelector('#leagueSelect');
            const roundSelect = modalElement.querySelector('#roundSelect');
            const input = modalElement.querySelector('#diffInput');
            const confirmBtn = modalElement.querySelector('.confirm');
            const cancelBtn = modalElement.querySelector('.cancel');
            const overlay = modalElement.querySelector('.mz-modal-overlay');

            const cleanup = () => modalElement.remove();

            [leagueSelect, roundSelect, input].forEach(el => {
                el.addEventListener('click', e => e.stopPropagation());
                el.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
            });

            const handleConfirm = () => {
                const val = parseInt(input.value);
                if (val >= 1 && val <= 10) {
                    const selectedPair = CONSTANTS.ROUND_PAIRS[parseInt(roundSelect.value)];
                    cleanup();
                    resolve({
                        leagueType: leagueSelect.value,
                        diff: val,
                        roundNumbers: {
                            first: selectedPair.first,
                            second: selectedPair.second
                        }
                    });
                } else {
                    alert(CONSTANTS.ERROR_MESSAGES.INVALID_INPUT);
                }
            };

            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') handleConfirm();
            });

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', () => {
                cleanup();
                reject('Cancelled');
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    reject('Cancelled');
                }
            });

            setTimeout(() => leagueSelect.focus(), 0);
        });
    }

    let selectedLeagueType;

    async function init() {
        const navList = document.querySelector(CONSTANTS.DOM.NAV_UL_SELECTOR);
        if (!navList) return;

        const buttonContainer = document.createElement('li');
        const button = document.createElement('button');
        button.className = CONSTANTS.DOM.BUTTON_CLASS;
        button.innerHTML = CONSTANTS.DOM.BUTTON_TEXT;
        button.title = CONSTANTS.DOM.BUTTON_TITLE;

        buttonContainer.appendChild(button);
        navList.appendChild(buttonContainer);

        const spinner = createSpinner();

        button.addEventListener('click', async () => {
            try {
                const params = await promptForParams();
                selectedLeagueType = params.leagueType;
                const minTotalDiff = params.diff;
                const roundNumbers = params.roundNumbers;
                const allDiscrepancies = [];

                spinner.style.display = 'block';
                button.style.cursor = 'wait';
                button.disabled = true;

                for (let worldLeagueId = CONSTANTS.LEAGUE_LIMITS.div1; worldLeagueId <= CONSTANTS.LEAGUE_LIMITS.div2; worldLeagueId++) {
                    const result = await processLeague(selectedLeagueType, worldLeagueId, minTotalDiff, roundNumbers);
                    allDiscrepancies.push(...result.discrepancies);
                }

                spinner.style.display = 'none';
                if (allDiscrepancies.length) {
                    createModal(allDiscrepancies, selectedLeagueType, minTotalDiff, roundNumbers);
                } else {
                    alert(CONSTANTS.ERROR_MESSAGES.NO_DISCREPANCIES);
                }
            } catch (error) {
                spinner.style.display = 'none';
                if (error !== 'Cancelled') {
                    console.error('Error:', error);
                }
            } finally {
                button.style.cursor = 'pointer';
                button.disabled = false;
            }
        });
    }

    init();
})();