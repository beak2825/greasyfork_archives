// ==UserScript==
// @name         MZ - SoT
// @namespace    douglaskampl
// @version      1.1
// @description  Displays shots on target below match results
// @author       Douglas
// @match        https://www.managerzone.com/?p=match&sub=played
// @match        https://www.managerzone.com/?p=league*
// @match        https://www.managerzone.com/?p=friendlyseries*
// @match        https://www.managerzone.com/?p=cup*
// @match        https://www.managerzone.com/?p=private_cup*
// @match        https://www.managerzone.com/?p=national_teams*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547186/MZ%20-%20SoT.user.js
// @updateURL https://update.greasyfork.org/scripts/547186/MZ%20-%20SoT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`.sot-container-dk { display: block; margin: 2px auto 0 auto; font-size: 0.9em; font-weight: bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; color: navy; line-height: 1; text-align: center; } .sot-container-dk.visible { opacity: 1; transform: translateY(0); } .sot-spinner-dk { display: inline-block; width: 10px; height: 10px; margin-right: 6px; vertical-align: -1px; border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top-color: #555; animation: spin 1s ease-in-out infinite; } .sot-fetching-dk { color: #888; } .sot-loaded-dk { color: #333; } .sot-error-dk { color: #D32F2F; } @keyframes spin { to { transform: rotate(360deg); } }`);

    const fetchAndDisplaySoT = (mid) => {
        const resultUrl = `/?p=match&sub=result&mid=${mid}`;

        fetch(resultUrl)
            .then(response => {
            if (!response.ok) throw new Error(`Network response not OK. Status: ${response.status}`);
            return response.text();
        })
            .then(html => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            let statsTable = null;
            const candidateTables = doc.querySelectorAll('table.statsLite.marker');

            for (const table of candidateTables) {
                const headerCells = table.querySelectorAll('thead tr:first-child td');
                const statsTableFound = headerCells && headerCells.length === 3;
                if (statsTableFound) {
                    statsTable = table;
                    break;
                }
            }

            if (!statsTable) {
                throw new Error("Could not find the stats table.");
            }

            const sotRow = statsTable.querySelector('tbody tr:nth-child(8)');
            const sotContainer = document.getElementById(`sot-container-${mid}`);

            if (!sotContainer) {
                return;
            }

            if (sotRow) {
                const cells = sotRow.querySelectorAll('td');
                if (cells.length === 3) {
                    const homeSoT = cells[1].textContent.trim();
                    const awaySoT = cells[2].textContent.trim();
                    sotContainer.innerHTML = `${homeSoT} - ${awaySoT}`;
                    sotContainer.className = 'sot-container-dk sot-loaded-dk visible';
                } else {
                    throw new Error(`The 8th row was found, but it has ${cells.length} cells instead of the expected 3.`);
                }
            } else {
                throw new Error("Found the correct stats table, but could not find the 8th row (tr:nth-child(8)) within it.");
            }
        })
            .catch(error => {
            const sotContainer = document.getElementById(`sot-container-${mid}`);
            if(sotContainer) {
                sotContainer.textContent = 'Error';
                sotContainer.className = 'sot-container-dk sot-error-dk visible';
            }
        });
    };

    const processPlayedMatchesPage = () => {
        const matchElements = document.querySelectorAll('#fixtures-results-list > dd.odd, #fixtures-results-list > dd.even');
        matchElements.forEach(matchElement => {
            if (matchElement.querySelector('.score-cell-wrapper') && !matchElement.querySelector('.sot-container-dk')) {
                const anyMatchLink = matchElement.querySelector('a[href*="&mid="]');
                if (!anyMatchLink) return;

                const match = anyMatchLink.href.match(/mid=(\d+)/);
                const mid = match && match[1] ? match[1] : null;

                if (mid) {
                    const scoreWrapper = matchElement.querySelector('.score-cell-wrapper');
                    const sotContainer = document.createElement('div');
                    sotContainer.id = `sot-container-${mid}`;
                    sotContainer.className = 'sot-container-dk sot-fetching-dk';
                    sotContainer.innerHTML = `<div class="sot-spinner-dk"></div>SoT`;
                    scoreWrapper.appendChild(sotContainer);
                    setTimeout(() => sotContainer.classList.add('visible'), 10);
                    fetchAndDisplaySoT(mid);
                }
            }
        });
    };

    const processHitlistTables = () => {
        const tables = document.querySelectorAll('table.hitlist.marker');
        const scoreRegex = /^\d+\s*-\s*\d+$/;

        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                if (row.dataset.sotProcessed) return;

                const scoreCell = row.querySelector('td:nth-child(2)');
                const scoreLink = scoreCell?.querySelector('a[href*="mid="]');

                if (!scoreCell || !scoreLink) return;

                if (!scoreRegex.test(scoreLink.textContent.trim())) return;

                row.dataset.sotProcessed = 'true';

                const midMatch = scoreLink.href.match(/mid=(\d+)/);
                const mid = midMatch?.[1];

                if (!mid) return;

                const sotContainer = document.createElement('div');
                sotContainer.id = `sot-container-${mid}`;
                sotContainer.className = 'sot-container-dk sot-fetching-dk';
                sotContainer.innerHTML = `<div class="sot-spinner-dk"></div>SoT`;

                scoreCell.style.textAlign = 'center';
                scoreCell.style.lineHeight = '1.4';

                scoreCell.appendChild(sotContainer);
                setTimeout(() => sotContainer.classList.add('visible'), 10);
                fetchAndDisplaySoT(mid);
            });
        });
    };

    const routeByPage = () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('p');
        const sub = params.get('sub');

        if (page === 'match' && sub === 'played') {
            processPlayedMatchesPage();
        } else if (['league', 'friendlyseries', 'cup', 'private_cup', 'national_teams'].includes(page)) {
            processHitlistTables();
        } else {
        }
    };

    let processTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(processTimeout);
        processTimeout = setTimeout(() => {
            routeByPage();
        }, 500);
    });

    routeByPage();
    observer.observe(document.body, { childList: true, subtree: true });
})();
