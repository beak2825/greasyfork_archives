// ==UserScript==
// @name         MZ - Tactics on Hover (League Pages)
// @namespace    douglaskampl
// @version      2.0
// @description  Displays most recent tactics in league pages (on match hover or via dropdown in the schedule tab)
// @author       Douglas
// @match        https://www.managerzone.com/?p=league&type*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539317/MZ%20-%20Tactics%20on%20Hover%20%28League%20Pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539317/MZ%20-%20Tactics%20on%20Hover%20%28League%20Pages%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let teamsDataStore = [];
    let allMatchesDataStore = [];
    let isScheduleFeatureInitialized = false;
    let tacticsModalElement = null;
    let floatingDropdownElement = null;

    function injectCustomFont() {
        if (document.getElementById('mz-font-import-dm-sans')) {
            return;
        }
        const fontLink = document.createElement('link');
        fontLink.id = 'mz-font-import-dm-sans';
        fontLink.rel = 'preconnect';
        fontLink.href = 'https://fonts.googleapis.com';
        document.head.appendChild(fontLink);

        const fontLinkCss = document.createElement('link');
        fontLinkCss.rel = 'stylesheet';
        fontLinkCss.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap';
        document.head.appendChild(fontLinkCss);
    }

    function injectCustomStyles() {
        if (document.getElementById('mz-tactics-custom-styles-v2')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'mz-tactics-custom-styles-v2';
        style.textContent = `
            @keyframes mz-spinner-spin {
                to { transform: rotate(360deg); }
            }
            .mz-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-left: 10px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: mz-spinner-spin 1s ease-in-out infinite;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
    }

    function getTeamNameFromCell(cell) {
        if (!cell) {
            return '';
        }
        return cell.firstChild?.textContent.trim() ?? '';
    }

    function extractUniqueTeamsFromSchedule(schedulePanelElement) {
        const teamNames = new Set();
        if (!schedulePanelElement) {
            return [];
        }

        const roundTables = schedulePanelElement.querySelectorAll('table.hitlist.marker');
        roundTables.forEach(table => {
            if (!table.tBodies[0]) {
                return;
            }
            const rows = table.tBodies[0].querySelectorAll('tr');
            rows.forEach(row => {
                if (row.cells && row.cells.length >= 3) {
                    const homeTeamName = getTeamNameFromCell(row.cells[0]);
                    const awayTeamName = getTeamNameFromCell(row.cells[2]);
                    if (homeTeamName) {
                        teamNames.add(homeTeamName);
                    }
                    if (awayTeamName) {
                        teamNames.add(awayTeamName);
                    }
                }
            });
        });
        return Array.from(teamNames).map(name => ({ name })).sort((a, b) => a.name.localeCompare(b.name));
    }

    function extractAllMatchesFromSchedule(schedulePanelElement) {
        const matches = [];
        if (!schedulePanelElement) {
            return matches;
        }

        const contentElements = schedulePanelElement.querySelectorAll('h2.subheader, div.mainContent');
        let currentDate = 'Date N/A';

        contentElements.forEach(element => {
            if (element.tagName === 'H2' && element.classList.contains('subheader')) {
                const headerText = element.textContent.trim();
                const dateMatch = headerText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
                if (dateMatch && dateMatch[1]) {
                    currentDate = dateMatch[1];
                }
            } else if (element.tagName === 'DIV' && element.classList.contains('mainContent')) {
                const table = element.querySelector('table.hitlist.marker');
                if (table && table.tBodies[0]) {
                    const rows = table.tBodies[0].querySelectorAll('tr');
                    rows.forEach(row => {
                        if (row.cells && row.cells.length >= 3) {
                            const matchLinkCell = row.cells[1];
                            const matchLink = matchLinkCell ? matchLinkCell.querySelector('a[href*="mid="]') : null;

                            if (matchLink && matchLink.textContent.trim().toLowerCase() !== 'x - x') {
                                const homeTeamName = getTeamNameFromCell(row.cells[0]);
                                const awayTeamName = getTeamNameFromCell(row.cells[2]);
                                const href = matchLink.getAttribute('href');
                                const midMatch = href.match(/mid=(\d+)/);
                                if (homeTeamName && awayTeamName && midMatch && midMatch[1]) {
                                    matches.push({
                                        mid: midMatch[1],
                                        homeTeam: homeTeamName,
                                        awayTeam: awayTeamName,
                                        date: currentDate
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
        return matches;
    }

    function parseDate(dateString) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(0);
    }

    function createTacticsModalStructure() {
        if (document.getElementById('mz-team-tactics-modal-v2')) {
            tacticsModalElement = document.getElementById('mz-team-tactics-modal-v2');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'mz-team-tactics-modal-v2';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(10, 10, 15, 0.85)',
            zIndex: '30000',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            backdropFilter: 'blur(3px)',
        });
        modal.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: '#2c2f36',
            color: '#d1d1d1',
            padding: '25px',
            border: '1px solid #40444c',
            borderRadius: '8px',
            maxHeight: '90vh',
            maxWidth: '900px',
            width: '90%',
            overflowY: 'auto',
            boxShadow: '0 5px 25px rgba(0,0,0,0.5)',
            position: 'relative',
        });

        const modalTitle = document.createElement('h3');
        modalTitle.id = 'mz-team-tactics-modal-v2-title';
        Object.assign(modalTitle.style, {
            fontSize: '1.4em',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#ffffff',
            borderBottom: '1px solid #40444c',
            paddingBottom: '15px',
            textAlign: 'center',
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'transparent',
            color: '#a0a0a0',
            border: 'none',
            fontSize: '28px',
            lineHeight: '1',
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '4px',
            transition: 'color 0.2s',
        });
        closeButton.onmouseover = () => closeButton.style.color = '#ffffff';
        closeButton.onmouseout = () => closeButton.style.color = '#a0a0a0';
        closeButton.onclick = () => { modal.style.display = 'none'; };

        const imagesContainer = document.createElement('div');
        imagesContainer.id = 'mz-team-tactics-modal-v2-images';

        modalContent.append(closeButton, modalTitle, imagesContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        tacticsModalElement = modal;
    }

    function displayTeamTacticsInModal(selectedTeamName) {
        if (!tacticsModalElement) {
            createTacticsModalStructure();
        }

        const modalTitle = tacticsModalElement.querySelector('#mz-team-tactics-modal-v2-title');
        const imagesContainer = tacticsModalElement.querySelector('#mz-team-tactics-modal-v2-images');

        modalTitle.textContent = `${selectedTeamName} Recent Tactics`;
        imagesContainer.innerHTML = '';

        const teamMatches = allMatchesDataStore.filter(match =>
            (match.homeTeam === selectedTeamName || match.awayTeam === selectedTeamName)
        );

        if (teamMatches.length === 0) {
            imagesContainer.textContent = 'No played matches found or tactics are unavailable.';
            imagesContainer.style.textAlign = 'center';
            imagesContainer.style.display = 'block';
        } else {
            Object.assign(imagesContainer.style, {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'flex-start',
            });

            teamMatches.sort((a, b) => parseDate(b.date) - parseDate(a.date));

            teamMatches.forEach(match => {
                const entryDiv = document.createElement('div');
                Object.assign(entryDiv.style, {
                    width: 'calc(50% - 10px)',
                    boxSizing: 'border-box',
                    padding: '15px',
                    borderRadius: '6px',
                    border: '1px solid #40444c',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                });

                const dateElement = document.createElement('p');
                dateElement.textContent = `Date: ${match.date}`;
                Object.assign(dateElement.style, {
                    fontSize: '1em',
                    color: '#e0e0e0',
                    marginBottom: '10px',
                    fontWeight: '500',
                    textAlign: 'center',
                });

                const imgUrl = `https://www.managerzone.com/dynimg/pitch.php?match_id=${match.mid}`;
                const imgElement = document.createElement('img');
                imgElement.src = imgUrl;
                imgElement.alt = `Tactic from match ${match.mid} on ${match.date}`;
                Object.assign(imgElement.style, {
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    border: '1px solid #4a4e56',
                    borderRadius: '4px',
                    margin: '0 auto 8px auto',
                });

                const detailsRow = document.createElement('div');
                 Object.assign(detailsRow.style, {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    gap: '10px',
                });

                const location = match.homeTeam === selectedTeamName ? 'Home' : 'Away';
                const explanationContainer = document.createElement('div');
                 Object.assign(explanationContainer.style, {
                    fontSize: '0.9em',
                    color: '#c0c5ce',
                    display: 'flex',
                    alignItems: 'center',
                });

                const marker = document.createElement('span');
                Object.assign(marker.style, {
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '3px',
                    marginRight: '8px',
                    verticalAlign: 'middle',
                    backgroundColor: (location === 'Home') ? '#ffd600' : '#111111',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                });

                explanationContainer.appendChild(marker);
                explanationContainer.appendChild(document.createTextNode(location === 'Home' ? 'Yellow.' : 'Black.'));

                const opponent = match.homeTeam === selectedTeamName ? match.awayTeam : match.homeTeam;
                const caption = document.createElement('p');
                caption.textContent = `vs: ${opponent} (${location}) | ID: ${match.mid}`;
                Object.assign(caption.style, {
                    fontSize: '0.85em',
                    textAlign: 'right',
                    color: '#a0a5ad',
                    margin: '0',
                    flexShrink: '0',
                });

                detailsRow.append(explanationContainer, caption);
                entryDiv.append(dateElement, imgElement, detailsRow);
                imagesContainer.appendChild(entryDiv);
            });
        }
        tacticsModalElement.style.display = 'flex';
        if (imagesContainer) {
            imagesContainer.scrollTop = 0;
        }
    }

    function createFloatingDropdownMenu() {
        if (document.getElementById('mz-floating-tactics-container-v2')) {
            floatingDropdownElement = document.getElementById('mz-floating-tactics-container-v2');
            const select = floatingDropdownElement.querySelector('select');
            if (select) {
                const currentValue = select.value;
                while (select.options.length > 1) {
                    select.remove(1);
                }
                teamsDataStore.forEach(team => {
                    const option = document.createElement('option');
                    option.value = team.name;
                    option.textContent = team.name;
                    select.appendChild(option);
                });
                select.value = currentValue;
            }
            return;
        }

        const container = document.createElement('div');
        container.id = 'mz-floating-tactics-container-v2';
        Object.assign(container.style, {
            position: 'fixed',
            top: '69px',
            right: '15px',
            zIndex: '20000',
            background: 'linear-gradient(160deg, #000000 0%, #0f0c29 35%, #7209b7 70%, #00f5d4 100%)',
            padding: '10px 15px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid #40444c',
            display: 'none',
            fontFamily: "'DM Sans', sans-serif",
            alignItems: 'center',
        });

        const label = document.createElement('label');
        label.setAttribute('for', 'mz-floating-tactics-select-v2');
        label.textContent = 'Team: ';
        Object.assign(label.style, {
            color: '#efefef',
            marginRight: '8px',
            fontSize: '12px',
            verticalAlign: 'middle',
            fontWeight: '500',
        });

        const select = document.createElement('select');
        select.id = 'mz-floating-tactics-select-v2';
        select.disabled = true;
        Object.assign(select.style, {
            padding: '4px 6px',
            fontSize: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #cccccc',
            borderRadius: '3px',
            verticalAlign: 'middle',
        });

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a Team';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        teamsDataStore.forEach(team => {
            const option = document.createElement('option');
            option.value = team.name;
            option.textContent = team.name;
            select.appendChild(option);
        });

        select.onchange = function () {
            if (this.value) {
                displayTeamTacticsInModal(this.value);
                this.selectedIndex = 0;
            }
        };

        const spinner = document.createElement('div');
        spinner.className = 'mz-spinner';

        container.append(label, select, spinner);
        document.body.appendChild(container);
        floatingDropdownElement = container;
    }

    function showFloatingDropdown() {
        if (floatingDropdownElement) {
            floatingDropdownElement.style.display = 'flex';
        }
    }

    function hideFloatingDropdown() {
        if (floatingDropdownElement) {
            floatingDropdownElement.style.display = 'none';
        }
    }

    function initializeScheduleFeature(schedulePanel) {
        teamsDataStore = extractUniqueTeamsFromSchedule(schedulePanel);
        allMatchesDataStore = extractAllMatchesFromSchedule(schedulePanel);

        if (teamsDataStore.length === 0) {
            return false;
        }
        injectCustomFont();
        injectCustomStyles();
        createTacticsModalStructure();
        createFloatingDropdownMenu();
        isScheduleFeatureInitialized = true;
        return true;
    }

    function handleActiveTabChange(activeTabLinkElement) {
        const panelId = activeTabLinkElement.getAttribute('aria-controls');
        const isScheduleTabActive = panelId === 'ui-tabs-3' || (activeTabLinkElement.href && activeTabLinkElement.href.includes('&sub=schedule'));

        if (isScheduleTabActive) {
            const schedulePanel = document.getElementById(panelId || 'ui-tabs-3');
            if (schedulePanel && schedulePanel.offsetParent !== null) {
                let attempts = 0;
                const maxAttempts = 10;
                const contentWaitInterval = setInterval(() => {
                    attempts++;
                    const hasContent = schedulePanel.querySelector('table.hitlist.marker') && schedulePanel.querySelector('table.hitlist.marker tr td a[href*="mid="]');
                    if (hasContent) {
                        clearInterval(contentWaitInterval);
                        if (!isScheduleFeatureInitialized) {
                            const success = initializeScheduleFeature(schedulePanel);
                            if (!success) {
                                hideFloatingDropdown();
                                return;
                            }
                        }
                        showFloatingDropdown();
                        if (floatingDropdownElement) {
                            floatingDropdownElement.querySelector('select').disabled = false;
                            const spinner = floatingDropdownElement.querySelector('.mz-spinner');
                            if (spinner) {
                                spinner.style.display = 'none';
                            }
                        }
                    } else if (attempts >= maxAttempts) {
                        clearInterval(contentWaitInterval);
                        hideFloatingDropdown();
                    }
                }, 500);
            } else {
                hideFloatingDropdown();
            }
        } else {
            hideFloatingDropdown();
        }
    }

    function setUpTabChangeObserver() {
        const tabsNav = document.querySelector('ul.ui-tabs-nav');
        if (!tabsNav) {
            return;
        }

        const tabChangeObserver = new MutationObserver(() => {
            const activeLi = tabsNav.querySelector('li.ui-tabs-active');
            if (activeLi) {
                const activeTabLink = activeLi.querySelector('a.ui-tabs-anchor');
                if (activeTabLink) {
                    handleActiveTabChange(activeTabLink);
                } else {
                    hideFloatingDropdown();
                }
            } else {
                hideFloatingDropdown();
            }
        });

        tabsNav.querySelectorAll('li.ui-state-default').forEach(li => {
            tabChangeObserver.observe(li, { attributes: true, attributeFilter: ['class', 'aria-selected'] });
        });

        const initiallyActiveLi = tabsNav.querySelector('li.ui-tabs-active');
        if (initiallyActiveLi) {
            const activeTabLink = initiallyActiveLi.querySelector('a.ui-tabs-anchor');
            if (activeTabLink) {
                handleActiveTabChange(activeTabLink);
            }
        } else {
             hideFloatingDropdown();
        }
    }

    function addHoverTooltipsToMatchLinks(panel) {
        if (!panel) {
            return;
        }
        const anchors = panel.querySelectorAll('a[href*="mid="]:not([data-mz-tactics-processed])');
        anchors.forEach(anchor => {
            const text = anchor.textContent.trim();
            if (text.toLowerCase() === 'x - x') {
                return;
            }

            const href = anchor.getAttribute('href');
            const midMatch = href.match(/mid=(\d+)/);
            if (!midMatch) {
                return;
            }

            const mid = midMatch[1];
            const imgUrl = `https://www.managerzone.com/dynimg/pitch.php?match_id=${mid}`;
            const tooltip = document.createElement('img');
            tooltip.src = imgUrl;
            Object.assign(tooltip.style, {
                position: 'absolute',
                border: '1px solid #ccc',
                background: '#fff',
                display: 'none',
                zIndex: '1000',
                maxWidth: '400px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            });
            document.body.appendChild(tooltip);

            anchor.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.display = 'block';
            });
            anchor.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            anchor.setAttribute('data-mz-tactics-processed', 'true');
        });
    }

    function observePanelForDOMChanges(panel) {
        if (!panel) {
            return;
        }
        const observerConfig = { childList: true, subtree: true };
        const observer = new MutationObserver((mutations) => {
            let addedNodes = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    addedNodes = true;
                    break;
                }
            }
            if (addedNodes) {
                addHoverTooltipsToMatchLinks(panel);
            }
        });
        observer.observe(panel, observerConfig);
    }

    function initializeHoverFeature() {
        const panels = document.querySelectorAll('.ui-tabs-panel');
        panels.forEach(panel => {
            addHoverTooltipsToMatchLinks(panel);
            observePanelForDOMChanges(panel);
        });
    }

    function initializeUs() {
        let attempts = 0;
        const maxAttempts = 30;
        const interval = setInterval(() => {
            attempts++;
            const panels = document.querySelectorAll('.ui-tabs-panel');
            const nav = document.querySelector('ul.ui-tabs-nav');
            if (panels.length > 0 && nav) {
                clearInterval(interval);
                initializeHoverFeature();
                setUpTabChangeObserver();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 500);
    }

    initializeUs();
})();
