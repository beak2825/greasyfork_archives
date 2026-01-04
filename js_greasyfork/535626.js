// ==UserScript==
// @name         [GGn] GPH Range Estimator
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @license      MIT
// @description  Display min-max gold per hour (GPH) for torrents on GGn.
// @author       azstrait
// @include      https://gazellegames.net/torrents.php?id=*
// @icon         https://icons.duckduckgo.com/ip3/gazellegames.net.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535626/%5BGGn%5D%20GPH%20Range%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/535626/%5BGGn%5D%20GPH%20Range%20Estimator.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('[GPH] Script loaded.');

    function getMaxShare(seeders) {
        if (seeders <= 1) return 1.00;
        if (seeders === 2) return 0.85;
        if (seeders === 3) return 0.75;
        if (seeders === 4) return 0.60;
        if (seeders === 5) return 0.50;
        return 0.40;
    }

    function getMinShare(seeders) {
        if (seeders === 1) return 1.00;
        if (seeders === 2) return 0.15;
        if (seeders >= 3 && seeders <= 5) return 0.05;
        if (seeders >= 6) return 0.02;
        return 0.02;
    }

    function calculateGPH(hiddenRow, seederCount) {
        const goldSpan = hiddenRow.querySelector('span#gold_amt');
        if (!goldSpan) {
            console.warn('[GPH] No gold span found in hidden row:', hiddenRow);
            return null;
        }

        const title = goldSpan.getAttribute('title');
        const match = title && title.match(/([0-9]+.[0-9]+)/);
        if (!match) {
            console.warn('[GPH] Gold span title did not match expected pattern:', title);
            return null;
        }

        const totalGold = parseFloat(match[1]);
        const minShare = getMinShare(seederCount);
        const maxShare = getMaxShare(seederCount);

        const minGPH = Math.max(totalGold / seederCount, totalGold * minShare).toFixed(2);
        const limitGPH = Math.min(totalGold / seederCount, totalGold * maxShare).toFixed(2);
        const maxGPH = Math.max(minGPH, limitGPH).toFixed(2);
        const soloGPH = minGPH;

        console.log(`[GPH] Seeders: ${seederCount}, Total Gold: ${totalGold}, MinGPH: ${minGPH}, MaxGPH: ${maxGPH}`);

        return minGPH == maxGPH
            ? { soloGPH }
            : { minGPH, maxGPH };
    }

    function processTorrentRow(row) {
            const tdList = row.querySelectorAll('td');
        if (tdList.length < 6) {
            console.warn('[GPH] Not enough TDs in row:', row);
            return;
        }

        const seederTd = tdList[4];
            let seederCount = 0;

            try {
                // Try parsing from the title if available
                const title = seederTd.getAttribute('title');
            seederCount = title
                ? parseInt(title.replace(/\D/g, '')) || 0
                : parseInt(seederTd.innerText.trim()) || 0;
            } catch (e) {
            console.warn('[GPH] Failed to parse seeder count:', e);
                return;
            }

        const hiddenRow = row.nextElementSibling;
        if (!hiddenRow || !hiddenRow.classList.contains('pad')) {
            console.warn('[GPH] Hidden row not found or has wrong class for:', row);
            return;
        }

        const gph = calculateGPH(hiddenRow, seederCount);
        if (!gph) {
            console.warn('[GPH] GPH calculation failed for row:', row);
            return;
        }

        const titleCell = tdList[0];
        if (!titleCell || titleCell.querySelector('.gph-display')) {
            console.log('[GPH] GPH already displayed or titleCell missing');
            return;
        }

        const span = document.createElement('span');
        span.className = 'gph-display';
        span.style.marginLeft = '8px';
        span.style.fontSize = 'smaller';
        span.style.color = '#aaa';

        if (gph.soloGPH) {
            span.textContent = `GPH: ${gph.soloGPH}`;
        } else {
            span.textContent = `GPH: ${gph.minGPH}–${gph.maxGPH}`;
        }

        titleCell.appendChild(span);
        console.log('[GPH] GPH added to row.');
    }

    function scanPage() {
        const rows = document.querySelectorAll('tr.group_torrent');
        rows.forEach(row => {
            if (!row.dataset.gphProcessed) {
                processTorrentRow(row);
                row.dataset.gphProcessed = 'true'; // Mark as processed
            }
        });
    }

    function waitForTorrents() {
        console.log('[GPH] Waiting for torrents (persistent)...');
        const observer = new MutationObserver(() => {
            scanPage(); // Re-scan on any mutation
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Also periodically scan just in case
        const interval = setInterval(() => {
            scanPage();
        }, 1000); // every 1 second

        // Optional: Stop after a while to avoid CPU use (e.g., 30s)
        setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
            console.log('[GPH] Stopped observing after timeout.');
        }, 30000);
    }

    waitForTorrents();
})();
