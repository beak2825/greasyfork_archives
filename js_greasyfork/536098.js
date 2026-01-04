// ==UserScript==
// @name         Allegro Listings Data Extractor (Serial + Persistent Status + ETA)
// @namespace    http://tampermonkey.net/
// @version      2025-05-29
// @description  Sequential fetch for EAN + error data with live persistent progress and ETA display across pages on Allegro listings in BaseLinker panel.
// @author       You
// @include      https://panel-*.baselinker.com/allegro_auctions.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536098/Allegro%20Listings%20Data%20Extractor%20%28Serial%20%2B%20Persistent%20Status%20%2B%20ETA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536098/Allegro%20Listings%20Data%20Extractor%20%28Serial%20%2B%20Persistent%20Status%20%2B%20ETA%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration - set to 0 to process all pages
    const MAX_PAGES_TO_PROCESS = 0;

    const baseUrl = window.location.hostname;

    function getProductIdsFromPage() {
        const anchors = [...document.querySelectorAll('a[data-remote*="modal_allegro_auction_details.php?id="]')];
        return anchors.map(a => {
            const match = a.getAttribute('data-remote')?.match(/id=(\d+)/);
            return match ? match[1] : null;
        }).filter(Boolean);
    }

    async function fetchDetails(id) {
        const url = `https://${baseUrl}/ajax/modal/modal_allegro_auction_details.php?id=${id}`;
        try {
            const res = await fetch(url);
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const getVal = (label) => {
                const row = [...doc.querySelectorAll('#auction_details_table tr')].find(tr =>
                    tr.textContent.includes(label)
                );
                return row?.querySelector('td:nth-child(2)')?.textContent.trim() || null;
            };

            return {
                id,
                ean: getVal('EAN:'),
                error: getVal('Chyba při ověřování:')
            };
        } catch (e) {
            console.error(`❌ Fetch failed for ID ${id}`, e);
            return { id, ean: null, error: 'Fetch error' };
        }
    }

    async function waitForPageLoad(oldIds, timeout = 3000) {
        return new Promise(resolve => {
            const start = Date.now();
            const check = setInterval(() => {
                const newIds = getProductIdsFromPage();
                if (newIds.length && newIds.some(id => !oldIds.includes(id))) {
                    clearInterval(check);
                    resolve();
                }
                if (Date.now() - start > timeout) {
                    clearInterval(check);
                    console.warn("⚠️ Timeout waiting for page load");
                    resolve();
                }
            }, 100);
        });
    }

    function getLastPageNumber() {
        //if url is panel-g. e.g. https://panel-g.baselinker.com/allegro_auctions.php
        if (window.location.hostname.includes('panel-g')) {
            const anchor = document.querySelector('#table_offers_container_controls .pagination li:nth-of-type(3) a');
            const onclick = anchor?.getAttribute('onclick');
            const match = onclick?.match(/table_setPage\('table_offers_container',\s*(\d+)/);
            return match ? parseInt(match[1]) : 1;
        } else {
            //find element select with onchange="table_setPage('table_offers_container',this.value, true) " and get last option value that is last page number
            const select = document.querySelector('.pager_select');
            const options = select?.querySelectorAll('option');
            return options ? parseInt(options[options.length - 1].value) : 1;
        }
    }

    function createControlElements() {
        const container = document.createElement('div');
        container.id = 'ean-scrape-controls';
        container.style.margin = '15px 0';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        // Create status element
        const statusEl = document.createElement('div');
        statusEl.id = 'ean-scrape-status';
        statusEl.style.fontWeight = 'bold';
        statusEl.style.color = '#007BFF';
        statusEl.style.fontSize = '14px';
        statusEl.textContent = 'Ready to start collect errors';

        // Create start button
        const startButton = document.createElement('button');
        startButton.id = 'ean-scrape-start';
        startButton.textContent = 'Start Collecting Errors';
        startButton.style.padding = '5px 10px';
        startButton.style.backgroundColor = '#28a745';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '4px';
        startButton.style.cursor = 'pointer';

        // Add hover effect
        startButton.onmouseover = () => { startButton.style.backgroundColor = '#218838'; };
        startButton.onmouseout = () => { startButton.style.backgroundColor = '#28a745'; };

        // Add click event
        startButton.onclick = () => {
            startButton.disabled = true;
            startButton.style.backgroundColor = '#6c757d';
            startButton.textContent = 'Processing...';
            processAllPages();
        };

        container.appendChild(startButton);
        container.appendChild(statusEl);

        const tableContainer = document.querySelector('#table_offers_container');
        if (tableContainer && tableContainer.parentNode) {
            tableContainer.parentNode.insertBefore(container, tableContainer);
        }

        return { statusEl, startButton };
    }

    function getStatusElement() {
        let statusEl = document.querySelector('#ean-scrape-status');
        if (!statusEl) {
            const controls = createControlElements();
            // If controls weren't created (error counter not valid), create a dummy element
            if (!controls) {
                return { textContent: '' }; // Return a dummy object that accepts textContent updates
            }
            statusEl = controls.statusEl;
        }
        return statusEl;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    }

    function downloadCSV(errors) {
        // Create CSV content with UTF-8 BOM for proper encoding
        let csvContent = '\uFEFF'; // UTF-8 BOM

        // Add header row
        csvContent += 'error;eans\n';

        // Add data rows
        Object.entries(errors).forEach(([error, eans]) => {
            // Replace any ; in the error with , to avoid CSV parsing issues
            const safeError = error.replace(/;/g, ',');
            // Join all EANs with comma
            const eansString = eans.join(',');
            csvContent += `"${safeError}";"${eansString}"\n`;
        });

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `allegro-errors-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function processAllPages() {
        const errors = {};
        const seen = new Set();
        const lastPage = getLastPageNumber();
        // Determine the actual last page to process based on MAX_PAGES_TO_PROCESS
        const lastPageToProcess = MAX_PAGES_TO_PROCESS > 0 ? Math.min(MAX_PAGES_TO_PROCESS, lastPage) : lastPage;
        const totalExpected = lastPageToProcess * 50;

        let processedCount = 0;
        const statusEl = getStatusElement();
        const startTime = Date.now();

        let page = 1;

        while (page <= lastPageToProcess) {
            console.log(`📄 Processing page ${page}`);
            const currentIds = getProductIdsFromPage();
            const newIds = currentIds.filter(id => !seen.has(id));

            for (const id of newIds) {
                seen.add(id);
                const t0 = performance.now();
                const { ean, error } = await fetchDetails(id);
                const t1 = performance.now();

                if (ean && error) {
                    if (!errors[error]) errors[error] = [];
                    errors[error].push(ean);
                }

                processedCount++;
                const elapsed = (Date.now() - startTime) / 1000;
                const avgPerItem = elapsed / processedCount;
                const remaining = totalExpected - processedCount;
                const eta = formatTime(remaining * avgPerItem);

                statusEl.textContent = `✅ Completed ${processedCount}/${totalExpected} items • ETA: ~${eta}`;
            }

            page++;
            if (page <= lastPageToProcess) {
                console.log(`➡️ Moving to page ${page}`);
                table_setPage('table_offers_container', page, true);
                await waitForPageLoad(currentIds);
            }
        }

        const totalTime = formatTime((Date.now() - startTime) / 1000);
        statusEl.textContent = `✅ Finished ${processedCount}/${totalExpected} items in ${totalTime}`;

        // Download CSV if we have any errors
        if (Object.keys(errors).length > 0) {
            downloadCSV(errors);
            statusEl.textContent += ` • CSV file downloaded with ${Object.keys(errors).length} error types`;
        } else {
            statusEl.textContent += ` • No errors found`;
        }

        // Reset button
        const startButton = document.querySelector('#ean-scrape-start');
        if (startButton) {
            startButton.disabled = false;
            startButton.style.backgroundColor = '#28a745';
            startButton.textContent = 'Start Scraping';
        }
    }

    // Initialize the UI when the page loads
    window.addEventListener('load', function() {
        createControlElements();
    });
})();
