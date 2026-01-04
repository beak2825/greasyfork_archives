// ==UserScript==
// @name         LWM Job Searcher
// @author       ImmortalRegis
// @version      1.4
// @description  Finds the best-paying available facility to work at, in current or adjacent locations, with configurable wage threshold and search range.
// @match        https://www.lordswm.com/*
// @grant        none
// @license      GNU GPLv3
// @namespace    https://www.lordswm.com/pl_info.php?id=6736731
// @downloadURL https://update.greasyfork.org/scripts/545719/LWM%20Job%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/545719/LWM%20Job%20Searcher.meta.js
// ==/UserScript==
//
// will the game be okay with this script? who knows.
//

(function () {
    'use strict';

    let MINIMUM_WAGE = 200; // Change this to adjust the the minimum wage cutoff
    let SEARCH_RANGE = 2; //change this to adjust search radius
    const FETCH_DELAY = 500; // ms between adjacent location fetches
    const JOB_SEARCHER_FLAG = 'flag_triggered_job_searcher'; //fw_auto_click_dbut0

    const WORK_PAGES = [
        { code: 'sh', name: 'Production' },
        { code: 'fc', name: 'Processing' },
        { code: 'mn', name: 'Mining' },
    ];

    const VALID_LOCATIONS = [
        "48,48","49,48","50,48","51,48","52,48",
        "48,49","49,49","50,49","51,49","52,49","53,49",
        "48,50","49,50","50,50","51,50","52,50","53,50",
        "49,51","50,51","51,51",
        "49,52","50,52","51,52",
        "51,53","52,53",
        "52,54"
    ];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function parseMapCoordsFromDOM() {
        const links = [...document.querySelectorAll('a[href*="map.php?cx="]')];
        for (const link of links) {
            const match = link.href.match(/cx=(\d+)&cy=(\d+)/);
            if (match) {
                const coords = `${match[1]},${match[2]}`;
                // console.log('[Map Scan] Found map coords from link:', coords);
                return coords;
            }
        }
        return null;
    }

    function getAdjacentCoords(cx, cy) {
        const adj = [];
        const deltas = [];

        for (let dx = -SEARCH_RANGE; dx <= SEARCH_RANGE; dx++) {
            for (let dy = -SEARCH_RANGE; dy <= SEARCH_RANGE; dy++) {
                if (dx === 0 && dy === 0) continue;
                deltas.push([dx, dy]);
            }
        }

        // Sort deltas by Manhattan distance from (0,0) so closest ones come first
        deltas.sort((a, b) => {
            const distA = Math.abs(a[0]) + Math.abs(a[1]);
            const distB = Math.abs(b[0]) + Math.abs(b[1]);
            return distA - distB;
        });

        for (const [dx, dy] of deltas) {
            const newCx = cx + dx;
            const newCy = cy + dy;
            const coordStr = `${newCx},${newCy}`;
            if (VALID_LOCATIONS.includes(coordStr)) {
                adj.push(coordStr);
            }
        }

        return adj;
    }

    async function checkWorkPagesInLocation(cx, cy) {
        for (const page of WORK_PAGES) {
            //skip mining pages if minimum wage is more than 200
            if (page.code === 'mn' && MINIMUM_WAGE >= 200) continue;

            const url = `/map.php?cx=${cx}&cy=${cy}&st=${page.code}`;
            // console.log(`[Check] (${cx},${cy}) ${page.code}: Fetching: ${url}`);
            const resp = await fetch(url);
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const rows = [...doc.querySelectorAll('tr.map_obj_table_hover')];
            for (const row of rows) {
                const wageCell = row.querySelector('td:nth-child(4)');
                const arrowLink = row.querySelector('td:last-child a');
                const link = arrowLink?.href;
                const isOpen = arrowLink?.innerHTML.includes('»»»') && !arrowLink.innerHTML.includes('#E65054');

                if (wageCell && isOpen && link?.includes('object-info.php')) {
                    const wage = parseInt(wageCell.textContent.replace(/[^\d]/g, ''), 10);
                    // console.log(`[Check] (${cx},${cy}) ${page.code}: Wage: ${wage}, Link: ${link}, Open: ${isOpen}`);

                    if (wage >= MINIMUM_WAGE) {
                        return { link, cx, cy };
                    }
                } else {
                    //  console.log(`[Skip] (${cx},${cy}) ${page.code}: Skipping row — Open: ${isOpen}, Wage Cell: ${wageCell?.textContent}`);
                }
            }

        }
        return null;
    }

    function updateLaborerStatus(text) {
        const statusField = document.getElementById('status-laborers');
        if (statusField) statusField.textContent = text;
    }


    async function findAndGoToWorkFacility(onepanel = false) {
        let cx = null, cy = null;
        if (onepanel) updateLaborerStatus(`🔍 Searching initiated`);
        const url = new URL(location.href);

        if (url.pathname === '/map.php' && url.searchParams.has('cx') && url.searchParams.has('cy')) {
            cx = parseInt(url.searchParams.get('cx'), 10);
            cy = parseInt(url.searchParams.get('cy'), 10);
            //  console.log(`[Current] On map with coords: ${cx},${cy}`);
        } else {
            // Try to find from links on map.php
            const resp = await fetch('/map.php');
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = [...doc.querySelectorAll('a[href*="map.php?cx="]')];
            for (const link of links) {
                const match = link.href.match(/cx=(\d+)&cy=(\d+)/);
                if (match) {
                    cx = parseInt(match[1], 10);
                    cy = parseInt(match[2], 10);
                    //   console.log(`[Map Fallback] Parsed coords: ${cx},${cy}`);
                    break;
                }
            }
        }

        if (cx == null || cy == null) {
            alert('Current location not found.');
            return;
        }

        const currentResult = await checkWorkPagesInLocation(cx, cy);
        if (currentResult) {
            //  console.log(`[Success] Valid job found in current location: ${currentResult.link}`);
            window.location.href = currentResult.link;
            return;
        }

        //  console.log('[Info] No valid facility found in current location. Checking adjacent...');
        const adjacentCoords = getAdjacentCoords(cx, cy);
        for (let i = 0; i < adjacentCoords.length; i++) {
            const coord = adjacentCoords[i];
            const [adjCx, adjCy] = coord.split(',').map(Number);

            if (onepanel) {
                updateLaborerStatus(`🔍 Searching ${i + 1} out of ${adjacentCoords.length}`);
            }

            const result = await checkWorkPagesInLocation(adjCx, adjCy);
            if (result) {
                if (onepanel) updateLaborerStatus(`✅ Job found at ${coord}`);
                localStorage.setItem(JOB_SEARCHER_FLAG, true);
                window.location.href = `/map.php?cx=${adjCx}&cy=${adjCy}`;
                return;
            }

            await sleep(FETCH_DELAY); // 💤 Delay between fetches
        }

        /*for (const coord of adjacentCoords) {
            const [adjCx, adjCy] = coord.split(',').map(Number);
            const result = await checkWorkPagesInLocation(adjCx, adjCy);
            if (result) {
                //    console.log(`[Success] Found valid job in adjacent location: ${coord}`);
                localStorage.setItem('fw_auto_click_dbut0', '1');
                window.location.href = `/map.php?cx=${adjCx}&cy=${adjCy}`;

                return;
            }
        }*/

        //    alert('No valid jobs found in this or nearby locations.');
        if (onepanel) updateLaborerStatus(`❌ No jobs found nearby.`);
        const wageInput = prompt('No valid jobs found, Change minimum wage? (recommend 160):', MINIMUM_WAGE);
        if (wageInput === null || wageInput > 215) // User cancelled
        {
            const rangeInput = prompt('Change Search range instead? (recommend 3):', SEARCH_RANGE);
            if (rangeInput === null) return; // User cancelled
            const userRange = parseInt(rangeInput, 10);
            if (!isNaN(userRange)) SEARCH_RANGE = userRange;
        }

        const userWage = parseInt(wageInput, 10);
        if (!isNaN(userWage)) MINIMUM_WAGE = userWage;

        findAndGoToWorkFacility(onepanel);
    }
    //status-laborers
    function addFindWorkButton() {
        const nav = document.querySelector('#breadcrumbs ul li.subnav nobr');
        if (!nav) return;

        const btn = document.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.textContent = 'Find Work';
        btn.className = 'pi';
        //  btn.style.fontWeight = 'bold';
        btn.title = 'Find the first open facility with decent wage in this or nearby location';
        btn.addEventListener('click', () => {
            findAndGoToWorkFacility();
        });

        nav.insertBefore(document.createTextNode(' | '), nav.firstChild);
        nav.insertBefore(btn, nav.firstChild);
    }
    function waitForElement(selector, timeout = 5000, interval = 250) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el || Date.now() - startTime > timeout) {
                    clearInterval(timer);
                    resolve(el);
                }
            }, interval);
        });
    }

    (async function initJobFindPanel() {
        const laborermodule = await waitForElement('#status-laborers');

        if (laborermodule) {
            //console.log("✅ Integrating Job Finder into Scheduler panel...");
            document.addEventListener('click', (e) => {
                const target = e.target.closest('.lwm_custom_module');
                if (!target) return;

                const isLaborers = target.querySelector('#status-laborers');
                if (isLaborers) {
                    e.preventDefault();              // Prevent default redirect
                    e.stopImmediatePropagation();    // Stop the original listener
                    console.log('🛠️ Intercepted Laborers module click. Running custom Job Finder...');
                    findAndGoToWorkFacility(true);       // Your custom logic
                }
            }, true); // 👈 useCapture=true ensures this runs before any other listener

        } else {
            //console.log("⚠️ Scheduler panel not found. Using standalone panel...");
            addFindWorkButton();
        }
    })();


    // Auto-click navigator button if the code redirected us to a map location
    if (window.location.pathname === '/map.php' &&
        window.location.search.includes('cx=') &&
        localStorage.getItem(JOB_SEARCHER_FLAG)) {
        setTimeout(() => {
            const btn = document.querySelector('#dbut0');
            if (btn) {
                //   console.log('[AutoNav] Clicking #dbut0');
                btn.click();
            } else {
                //   console.log('[AutoNav] #dbut0 not found.');
            }
            localStorage.removeItem(JOB_SEARCHER_FLAG);
        }, 1000);
    }

})();