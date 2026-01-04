// ==UserScript==
// @name          MZ - Player Ratings from MZLive
// @namespace     douglaskampl
// @version       1.8
// @description   Displays player ratings on transfer, player, and national team pages
// @author        Douglas
// @match         https://www.managerzone.com/?p=transfer*
// @match         https://www.managerzone.com/?p=players*
// @match         https://www.managerzone.com/?p=national_teams*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant         GM_addStyle
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/528082/MZ%20-%20Player%20Ratings%20from%20MZLive.user.js
// @updateURL https://update.greasyfork.org/scripts/528082/MZ%20-%20Player%20Ratings%20from%20MZLive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const RATINGS = {
        "SPEED": { "K": 0.09, "D": 0.25, "A": 0.25, "M": 0.15, "W": 0.25, "F": 0.23 },
        "STAMINA": { "K": 0.09, "D": 0.16, "A": 0.18, "M": 0.15, "W": 0.20, "F": 0.15 },
        "PLAYINT": { "K": 0.09, "D": 0.07, "A": 0.05, "M": 0.10, "W": 0.06, "F": 0.05 },
        "PASSING": { "K": 0.02, "D": 0.02, "A": 0.05, "M": 0.15, "W": 0.04, "F": 0.04 },
        "SHOOTING": { "K": 0.00, "D": 0.00, "A": 0.00, "M": 0.00, "W": 0.05, "F": 0.28 },
        "HEADING": { "K": 0.00, "D": 0.00, "A": 0.02, "M": 0.00, "W": 0.00, "F": 0.03 },
        "GOALKEEPING": { "K": 0.55, "D": 0.00, "A": 0.00, "M": 0.00, "W": 0.00, "F": 0.00 },
        "BALLCONTROL": { "K": 0.09, "D": 0.08, "A": 0.10, "M": 0.12, "W": 0.15, "F": 0.15 },
        "TACKLING": { "K": 0.00, "D": 0.30, "A": 0.25, "M": 0.20, "W": 0.05, "F": 0.02 },
        "CROSSING": { "K": 0.02, "D": 0.07, "A": 0.05, "M": 0.08, "W": 0.15, "F": 0.00 },
        "SETPLAYS": { "K": 0.00, "D": 0.00, "A": 0.00, "M": 0.00, "W": 0.00, "F": 0.00 },
        "EXPERIENCE": { "K": 0.05, "D": 0.05, "A": 0.05, "M": 0.05, "W": 0.05, "F": 0.05 }
    };
    const SKILLS = [
        "SPEED",
        "STAMINA",
        "PLAYINT",
        "PASSING",
        "SHOOTING",
        "HEADING",
        "GOALKEEPING",
        "BALLCONTROL",
        "TACKLING",
        "CROSSING",
        "SETPLAYS",
        "EXPERIENCE",
    ];

    function calculateRatings(skills) {
        const player = { K: 0, D: 0, A: 0, M: 0, W: 0, F: 0, B: 0, top: 0 };
        if (typeof skills !== 'object' || skills === null) {
            return player;
        }

        SKILLS.forEach(skillName => {
            if (!skills[skillName] || !RATINGS[skillName]) return;

            const value = parseInt(skills[skillName], 10);
            if (isNaN(value)) return;

            if (skillName !== "EXPERIENCE") {
                player.B += value;
            }

            Object.keys(player).forEach(pos => {
                if (pos !== 'B' && pos !== 'top') {
                    const weight = RATINGS[skillName][pos];
                    if (typeof weight === 'number') {
                        player[pos] += value * weight;
                        if (player[pos] > player.top) {
                            player.top = player[pos];
                        }
                    }
                }
            });
        });

        return {
            K: player.K.toFixed(2),
            D: player.D.toFixed(2),
            A: player.A.toFixed(2),
            M: player.M.toFixed(2),
            W: player.W.toFixed(2),
            F: player.F.toFixed(2),
            B: player.B,
            top: player.top.toFixed(2)
        };
    }

    function extractSkillsFromTable(skillsTable) {
        const skills = {};
        if (!skillsTable || typeof skillsTable.querySelectorAll !== 'function') return skills;

        const skillRows = skillsTable.querySelectorAll('tbody > tr');
        if (!skillRows || typeof skillRows.forEach !== 'function') return skills;

        skillRows.forEach((row, index) => {
            if (index >= SKILLS.length) return;
            if (!row || typeof row.querySelector !== 'function') return;

            const valueElem = row.querySelector('td.skillval > span');
            if (valueElem && valueElem.textContent) {
                const skillType = SKILLS[index];
                const value = valueElem.textContent.trim().replace(/[()]/g, '');
                if (skillType && value !== null && value !== '' && !isNaN(parseInt(value, 10))) {
                    skills[skillType] = value;
                }
            }
        });

        return skills;
    }

    function extractPlayerSkillsDirectly(playerElement) {
        if (!playerElement || typeof playerElement.querySelector !== 'function') return {};
        const skillsTable = playerElement.querySelector('.player_skills');
        if (skillsTable) {
            return extractSkillsFromTable(skillsTable);
        }
        return {};
    }

    function decodeHtmlEntities(text) {
        if (typeof text !== 'string' || !text) return '';
        try {
            const textarea = document.createElement('textarea');
            textarea.innerHTML = text;
            return textarea.value;
        } catch (e) {
            console.error("Error decoding HTML", e);
            return text;
        }
    }

    function fetchSkillsFromTransfer(playerId) {
        return new Promise((resolve, reject) => {
            if (typeof playerId !== 'string' || !playerId.trim()) {
                reject("Invalid player ID for fetch.");
                return;
            }

            const url = `https://www.managerzone.com/ajax.php?p=transfer&sub=transfer-search&sport=soccer&issearch=true&u=${playerId}&nationality=all_nationalities&deadline=0&category=&valuea=&valueb=&bida=&bidb=&agea=19&ageb=37&birth_season_low=56&birth_season_high=74&tot_low=0&tot_high=110&s0a=0&s0b=10&s1a=0&s1b=10&s2a=0&s2b=10&s3a=0&s3b=10&s4a=0&s4b=10&s5a=0&s5b=10&s6a=0&s6b=10&s7a=0&s7b=10&s8a=0&s8b=10&s9a=0&s9b=10&s10a=0&s10b=10&s11a=0&s11b=10&s12a=0&s12b=10&o=0`;

            fetch(url, { credentials: 'include' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.players) {
                        try {
                            const decodedHtml = decodeHtmlEntities(data.players);
                            const parser = new DOMParser();
                            const ajaxDoc = parser.parseFromString(decodedHtml, 'text/html');
                            const skillsTable = ajaxDoc.querySelector('.player_skills');
                            if (skillsTable) {
                                const skills = extractSkillsFromTable(skillsTable);
                                if (Object.keys(skills).length > 0) {
                                    resolve(skills);
                                } else {
                                    reject("Could not extract skills from the AJAX response table.");
                                }
                            } else {
                                reject("Skills table not found in AJAX response.");
                            }
                        } catch (e) {
                            console.error("Error parsing AJAX response:", e);
                            reject("Error parsing AJAX response: " + e.message);
                        }
                    } else {
                        reject("No player data found in AJAX response.");
                    }
                })
                .catch(error => {
                    console.error("Error during fetch request:", error);
                    reject("Error during fetch request: " + error.message);
                });
        });
    }

    function createRatingDisplay(ratingsData) {
        if (typeof ratingsData !== 'object' || ratingsData === null) {
            const errorContainer = document.createElement('div');
            errorContainer.textContent = 'Error generating rating display.';
            return errorContainer;
        }

        const positions = [
            { code: 'K', name: 'Goalkeeper', value: ratingsData.K },
            { code: 'D', name: 'Defender', value: ratingsData.D },
            { code: 'A', name: 'Anchorman', value: ratingsData.A },
            { code: 'M', name: 'Midfielder', value: ratingsData.M },
            { code: 'W', name: 'Winger', value: ratingsData.W },
            { code: 'F', name: 'Forward', value: ratingsData.F }
        ];

        const container = document.createElement('div');
        container.className = 'mz-rating-container';

        const ratingsList = document.createElement('div');
        ratingsList.className = 'mz-rating-list';

        positions.forEach(pos => {
            const row = document.createElement('div');
            row.className = 'mz-rating-row';

            const isTop = typeof pos.value === 'string' && typeof ratingsData.top === 'string' && pos.value === ratingsData.top;

            const posName = document.createElement('span');
            posName.className = 'mz-pos-name' + (isTop ? ' mz-pos-top' : '');
            posName.textContent = (pos.name || 'N/A') + ':';

            const posValue = document.createElement('span');
            posValue.className = 'mz-pos-value' + (isTop ? ' mz-pos-top' : '');
            posValue.textContent = pos.value || '0.00';

            row.appendChild(posName);
            row.appendChild(posValue);
            ratingsList.appendChild(row);
        });

        container.appendChild(ratingsList);

        const infoRow = document.createElement('div');
        infoRow.className = 'mz-rating-info-row';
        const totalBalls = ratingsData.B !== undefined ? ratingsData.B : 'N/A';
        const topRating = ratingsData.top !== undefined ? ratingsData.top : 'N/A';
        infoRow.innerHTML = `<span>Total Balls: <strong>${totalBalls}</strong></span> <span>Top: <strong>${topRating}</strong></span>`;
        container.appendChild(infoRow);

        return container;
    }

    function shouldAddButton(playerElement) {
        if (!playerElement || typeof playerElement.querySelector !== 'function') return false;

        const skillsTable = playerElement.querySelector('.player_skills');
        if (skillsTable && skillsTable.querySelector('tbody > tr > td.skillval > span')) {
            return true;
        }

        const currentSearch = typeof window !== 'undefined' && window.location && window.location.search ? window.location.search : "";
        const isSinglePlayerPage = currentSearch.includes('pid=') && !currentSearch.includes('&sub=search&pid=');
        const isOnTransferMarketLink = playerElement.querySelector('a[href*="p=transfer&sub=players&u="]');

        if (isSinglePlayerPage && isOnTransferMarketLink) {
            return true;
        }

        const isNationalTeamSearchPlayerPage = currentSearch.includes('p=national_teams') && currentSearch.includes('&sub=search&pid=');
        if (isNationalTeamSearchPlayerPage && skillsTable) {
            return true;
        }

        return false;
    }

    function addRatingButton(playerElement) {
        if (!playerElement || typeof playerElement.querySelector !== 'function') {
            return;
        }
        const idElementContainer = playerElement.querySelector('.subheader');
        if (!idElementContainer) {
             return;
        }
        const idElement = idElementContainer.querySelector('.player_id_span');

        if (!idElement || !idElement.textContent) {
            return;
        }

        const playerId = idElement.textContent.trim();
        if (!playerId) {
            return;
        }

        if (!shouldAddButton(playerElement)) {
            return;
        }

        if (idElement.parentNode.querySelector('.mz-rating-btn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'mz-rating-btn';
        btn.innerHTML = '<i class="fa-solid fa-calculator"></i>';
        btn.title = 'Show player ratings';
        btn.dataset.playerId = playerId;

        let ratingContainer = null;
        let isVisible = false;
        let isLoading = false;

        btn.addEventListener('click', async (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (isLoading) return;

            if (isVisible && ratingContainer) {
                ratingContainer.classList.remove('mz-rating-visible');
                setTimeout(() => {
                    if (ratingContainer && ratingContainer.parentNode) {
                        try {
                            ratingContainer.parentNode.removeChild(ratingContainer);
                        } catch (removeError) {
                            console.error("MZ Ratings: Error removing rating container:", removeError);
                        }
                    }
                    ratingContainer = null;
                }, 300);
                isVisible = false;
                btn.innerHTML = '<i class="fa-solid fa-calculator"></i>';
                btn.title = 'Show player ratings';
                return;
            }

            isLoading = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.title = 'Loading ratings...';
            let skills = {};

            try {
                skills = extractPlayerSkillsDirectly(playerElement);
                const currentSearch = typeof window !== 'undefined' && window.location && window.location.search ? window.location.search : "";

                if (Object.keys(skills).length === 0) {
                    const isSinglePlayerPage = currentSearch.includes('pid=') && !currentSearch.includes('&sub=search&pid=');
                    const isOnTransferMarketLink = playerElement.querySelector('a[href*="p=transfer&sub=players&u="]');
                    if (isSinglePlayerPage && isOnTransferMarketLink) {
                         skills = await fetchSkillsFromTransfer(playerId);
                    }
                }

                if (Object.keys(skills).length > 0) {
                    const ratingsData = calculateRatings(skills);
                    ratingContainer = createRatingDisplay(ratingsData);

                    const playerHeader = playerElement.querySelector('.subheader');
                    const targetElement = playerHeader && playerHeader.nextSibling ? playerHeader.nextSibling : playerElement.firstChild;
                    if (playerHeader && playerHeader.parentNode) {
                         playerHeader.parentNode.insertBefore(ratingContainer, targetElement);
                    } else {
                        playerElement.insertBefore(ratingContainer, playerElement.firstChild);
                    }

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                           if (ratingContainer) ratingContainer.classList.add('mz-rating-visible');
                        });
                    });

                    isVisible = true;
                    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                    btn.title = 'Hide player ratings';
                } else {
                    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                    btn.title = 'Could not retrieve skills';
                    setTimeout(() => {
                        if (!isVisible) {
                            btn.innerHTML = '<i class="fa-solid fa-calculator"></i>';
                            btn.title = 'Show player ratings';
                        }
                    }, 2000);
                }
            } catch (error) {
                console.error(`MZ Ratings: Error getting ratings for player ${playerId}:`, error);
                btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                btn.title = `Error: ${typeof error === 'object' && error !== null && error.message ? error.message : String(error)}`;
                setTimeout(() => {
                    if (!isVisible) {
                        btn.innerHTML = '<i class="fa-solid fa-calculator"></i>';
                        btn.title = 'Show player ratings';
                    }
                }, 3000);
            } finally {
                isLoading = false;
                if (!isVisible && btn.innerHTML && !btn.innerHTML.includes('fa-triangle-exclamation')) {
                    btn.innerHTML = '<i class="fa-solid fa-calculator"></i>';
                    btn.title = 'Show player ratings';
                }
            }
        });

        const idSpanContainer = idElement.parentNode;
        if (idSpanContainer) {
            idSpanContainer.insertBefore(btn, idElement.nextSibling);
        } else {
            console.error("MZ Ratings: Could not find parent of player ID span to insert button.");
        }
    }

    function processPlayerElements() {
        try {
            const playerContainers = document.querySelectorAll('div[id^="thePlayers_"]');
            if (playerContainers && typeof playerContainers.forEach === 'function') {
                playerContainers.forEach(container => {
                    try {
                        if (container) addRatingButton(container);
                    } catch (e) {
                        console.error("MZ Ratings: Error processing individual player container:", container, e);
                    }
                });
            }
        } catch (e) { console.error("MZ Ratings: Error querying for player containers:", e); }
    }

    function setUpObserver() {
        let targetNode = null;
        if (typeof document !== 'undefined') {
            targetNode = document.getElementById('players_container')
                            || document.querySelector('.mainContent')
                            || document.body;
        }

        if (!targetNode) {
            console.error("MZ Ratings: Could not find a suitable node to observe for mutations.");
            return null;
        }

        const observer = new MutationObserver((mutations) => {
            let needsProcessing = false;
            if (mutations && typeof mutations.forEach === 'function') {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if ((node.id && typeof node.id === 'string' && node.id.startsWith('thePlayers_')) ||
                                    (node.querySelector && node.querySelector('div[id^="thePlayers_"]')))
                                {
                                    needsProcessing = true;
                                    break;
                                }
                            }
                        }
                    }
                    if(needsProcessing) return;
                });
            }

            if (needsProcessing) {
                setTimeout(processPlayerElements, 250);
            }
        });

        try {
            observer.observe(targetNode, { childList: true, subtree: true });
            return observer;
        } catch (e) {
            console.error("Error starting MutationObserver:", e);
            return null;
        }
    }

    function addStyles() {
        if (typeof GM_addStyle !== 'function') {
            console.error("GM_addStyle is not available. Styles will not be applied.");
            return;
        }
        try {
            GM_addStyle(
                `.mz-rating-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 8px;
                    width: 20px;
                    height: 20px;
                    border: none;
                    border-radius: 50%;
                    background: #1a73e8;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    line-height: 1;
                    vertical-align: middle;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                    padding: 0;
                }
                .mz-rating-btn:hover {
                    background: #0d5bbb;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .mz-rating-btn > i {
                    font-size: 12px;
                    line-height: 1;
                    vertical-align: baseline;
                }
                .mz-rating-container {
                    margin: 10px 0 5px 5px;
                    padding: 10px 12px;
                    background: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    width: fit-content;
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease-out;
                }
                .mz-rating-visible {
                    opacity: 1;
                    max-height: 500px;
                    transform: translateY(0);
                    margin-bottom: 10px;
                }
                .mz-rating-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 5px 10px;
                    margin-bottom: 8px;
                }
                .mz-rating-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2px 0px;
                    font-size: 12px;
                }
                .mz-pos-name {
                    color: #444;
                    margin-right: 5px;
                }
                .mz-pos-value {
                    font-weight: bold;
                    color: #222;
                    font-family: monospace;
                }
                .mz-pos-top {
                    color: #1a73e8;
                    font-weight: bold;
                }
                .mz-rating-info-row {
                    margin-top: 8px;
                    padding-top: 6px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 11px;
                    color: #555;
                    display: flex;
                    justify-content: space-between;
                }
                .mz-rating-info-row strong {
                    color: #111;
                    font-weight: 600;
                }`
            );
        } catch (e) {
            console.error("MZ Ratings: Error calling GM_addStyle:", e);
        }
    }

    function initializeNTStuff() {
        if (typeof window === 'undefined' || !window.location || !window.location.search) return;

        const currentSearch = window.location.search;
        if (!currentSearch.startsWith("?p=national_teams")) return;

        if (currentSearch.includes('&sub=search&pid=')) {
            return;
        }

        const tabsNav = document.querySelector('ul.ui-tabs-nav');
        if (tabsNav && typeof tabsNav.querySelectorAll === 'function') {
            const tabLinks = tabsNav.querySelectorAll('li > a.ui-tabs-anchor');
            if (tabLinks && typeof tabLinks.forEach === 'function') {
                tabLinks.forEach(link => {
                    if (link && typeof link.addEventListener === 'function' && link.href && link.href.includes('&sub=players')) {
                        link.addEventListener('click', () => {
                            setTimeout(() => {
                                const parentLi = link.closest('li');
                                if (parentLi && parentLi.classList.contains('ui-tabs-active')) {
                                    processPlayerElements();
                                }
                            }, 750);
                        });
                    }
                });
            }

            const activePlayersTabLink = tabsNav.querySelector('li.ui-tabs-active > a.ui-tabs-anchor[href*="&sub=players"]');
            if (activePlayersTabLink) {
                 setTimeout(processPlayerElements, 500);
            }
        }
    }

    function init() {
        addStyles();
        processPlayerElements();
        setUpObserver();
        initializeNTStuff();
    }

    if (typeof document !== 'undefined' && (document.readyState === 'complete' || document.readyState === 'interactive')) {
        setTimeout(init, 350);
    } else if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 350));
    } else {
        console.error("Could not determine document ready state to initialize.");
    }
})();