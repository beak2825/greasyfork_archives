// ==UserScript==
// @name         TorrentBD Download History Sorter
// @version      3.0
// @description  Adds a button to fetch, sort, filter, and paginate ALL pages of your download history with an improved UI.
// @author       5ifty6ix
// @namespace    5ifty6ix
// @match        https://*.torrentbd.com/download-history.php*
// @match        https://*.torrentbd.net/download-history.php*
// @match        https://*.torrentbd.org/download-history.php*
// @match        https://*.torrentbd.me/download-history.php*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545272/TorrentBD%20Download%20History%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/545272/TorrentBD%20Download%20History%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        rowsPerPage: 30,
        cacheDurationMinutes: 15,
        selectors: {
            table: 'table.notif-table',
            tableBody: 'table.notif-table tbody',
            paginationBlock: '.pagination-block',
            searchFormContainer: 'form[action="download-history.php"] .center-align',
            searchInput: 'input[name="torrent"]',
            searchButton: 'form[action="download-history.php"] button[type="submit"]'
        }
    };

    let allRowsCache = [];
    let filteredRows = [];
    let isFetching = false;
    let isSortingActive = false;
    let sortState = { colIndex: 3, isAsc: false };
    let currentPage = 1;
    let abortController = null;

    const table = document.querySelector(CONFIG.selectors.table);
    const tbody = document.querySelector(CONFIG.selectors.tableBody);
    const paginationBlock = document.querySelector(CONFIG.selectors.paginationBlock);
    const searchButtonContainer = document.querySelector(CONFIG.selectors.searchFormContainer);
    const originalSearchInput = document.querySelector(CONFIG.selectors.searchInput);
    const originalSearchButton = document.querySelector(CONFIG.selectors.searchButton);

    if (!table || !tbody || !searchButtonContainer || !originalSearchInput) {
        return;
    }

    function injectStyles() {
        const newStyles = document.createElement('style');
        newStyles.textContent = `
            #sorter-loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); color: white; display: flex; justify-content: center; align-items: center; z-index: 10000; font-size: 1.5em; font-family: sans-serif; flex-direction: column; text-align: center; }
            .sorter-loading-content { display: flex; flex-direction: column; align-items: center; justify-content: center; }
            #sorter-error-message { color: #f44336; font-size: 0.8em; margin-top: 15px; max-width: 80%; }
            .sorter-spinner { border: 5px solid #f3f3f3; border-top: 5px solid #4caf50; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 20px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            #sorter-cancel-btn { margin-top: 25px; background-color: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 0.8em; }
            .sort-header-content { display: flex; align-items: center; justify-content: flex-start; }
            .sorted-history-table th:nth-child(6) .sort-header-content { justify-content: center; }
            .sort-icon { vertical-align: middle; font-size: 1.2em; margin-left: 5px; }
            .sorted-history-table { table-layout: fixed; width: 100%; }
            .sorted-history-table th, .sorted-history-table td { word-wrap: break-word; }
            .sorted-history-table th:nth-child(1), .sorted-history-table td:nth-child(1) { width: 62%; }
            .sorted-history-table th:nth-child(2), .sorted-history-table td:nth-child(2) { width: 5%; text-align: center; }
            .sorted-history-table th:nth-child(3), .sorted-history-table td:nth-child(3) { width: 8%; }
            .sorted-history-table th:nth-child(4), .sorted-history-table td:nth-child(4) { width: 12%; }
            .sorted-history-table th:nth-child(5), .sorted-history-table td:nth-child(5) { width: 6%; }
            .sorted-history-table th:nth-child(6), .sorted-history-table td:nth-child(6) { width: 7%; text-align: center; }
            .sorted-history-table th { white-space: nowrap; }
            .sorted-history-table tbody tr:hover { background-color: rgba(255, 255, 255, 0.05); }
            .pagireborn-form { display: flex; align-items: center; margin-right: 15px; }
            .pagireborn-num { width: 80px; text-align: center; background-color: #333; color: #fff; border: 1px solid #555; border-radius: 4px 0 0 4px; padding: 5px; height: 36px; }
            .pagireborn-btn { background-color: #4caf50; color: white; border: 1px solid #4caf50; border-left: none; border-radius: 0 4px 4px 0; padding: 0 15px; cursor: pointer; height: 36px; font-weight: bold; }
            .no-history-message { text-align: center; padding: 20px; font-style: italic; color: #888; }
        `;
        document.head.appendChild(newStyles);
    }

    const parsers = {
        parseName: (cell) => cell.querySelector('a')?.textContent.trim().toLowerCase() || '',
        parseSize: (cell) => {
            const text = cell.textContent.trim().replace(/,/g, '');
            if (!text) return 0;
            const units = { 'TB': 1024**4, 'GB': 1024**3, 'MB': 1024**2, 'KB': 1024, 'B': 1, 'TIB': 1024**4, 'GIB': 1024**3, 'MIB': 1024**2, 'KIB': 1024 };
            const match = text.match(/(\d+\.?\d*)\s*([TGMK]?I?B)/i);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const multiplier = units[match[2].toUpperCase()] || 1;
            return isNaN(value) ? 0 : value * multiplier;
        },
        parseDate: (cell) => {
            let text = cell.textContent.trim().toLowerCase();
            if (!text) return 0;
            let match = text.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s+(am|pm)/);
            if (match) {
                let [, year, month, day, hourStr, minute, period] = match;
                let hour = parseInt(hourStr, 10);
                if (period === 'pm' && hour < 12) hour += 12;
                if (period === 'am' && hour === 12) hour = 0;
                const time = new Date(year, month - 1, day, hour, minute).getTime();
                return isNaN(time) ? 0 : time;
            }
            if (text.includes('ago')) {
                const date = new Date();
                const units = [
                    { key: 'y', val: 31536000 }, { key: 'mo', val: 2592000 },
                    { key: 'w', val: 604800 }, { key: 'd', val: 86400 },
                    { key: 'h', val: 3600 }, { key: 'm', val: 60 },
                    { key: 's', val: 1 }
                ];
                units.forEach(unit => {
                    const match = text.match(new RegExp(`(\\d+\\.?\\d*)\\s*${unit.key}`));
                    if (match) {
                        date.setSeconds(date.getSeconds() - parseFloat(match[1]) * unit.val);
                        text = text.replace(match[0], '');
                    }
                });
                return date.getTime();
            }
            const fallbackTime = new Date(text).getTime();
            return isNaN(fallbackTime) ? 0 : fallbackTime;
        },
        parseSeedTime: (cell) => {
            let text = cell.textContent.trim().toLowerCase();
            if (!text || text === '---') return 0;
            let totalSeconds = 0;
            const units = [
                { key: 'y', val: 31536000 }, { key: 'mo', val: 2592000 },
                { key: 'w', val: 604800 }, { key: 'd', val: 86400 },
                { key: 'h', val: 3600 }, { key: 'm', val: 60 },
                { key: 's', val: 1 }
            ];
            units.forEach(unit => {
                const match = text.match(new RegExp(`(\\d+\\.?\\d*)\\s*${unit.key}`));
                if (match) {
                    totalSeconds += parseFloat(match[1]) * unit.val;
                    text = text.replace(match[0], '');
                }
            });
            return totalSeconds;
        },
        parseActivity: (cell) => cell.querySelector('i.green-text') ? 1 : 0
    };

    const sortableColumns = {
        0: { name: 'Torrent', parser: parsers.parseName },
        2: { name: 'Size', parser: parsers.parseSize },
        3: { name: 'Completed on', parser: parsers.parseDate },
        4: { name: 'Seed time', parser: parsers.parseSeedTime },
        5: { name: 'Active', parser: parsers.parseActivity }
    };

    function showLoadingIndicator(message, error = '') {
        let overlay = document.getElementById('sorter-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sorter-loading-overlay';
            overlay.innerHTML = `<div class="sorter-loading-content"><div class="sorter-spinner"></div><div id="sorter-loading-message"></div><div id="sorter-error-message"></div></div><button id="sorter-cancel-btn">Cancel</button>`;
            document.body.appendChild(overlay);
            overlay.querySelector('#sorter-cancel-btn').onclick = () => abortController?.abort();
        }
        overlay.querySelector('#sorter-loading-message').textContent = message;
        overlay.querySelector('#sorter-error-message').textContent = error;
        overlay.style.display = 'flex';
    }

    function hideLoadingIndicator() {
        const overlay = document.getElementById('sorter-loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    function renderPage(page) {
        currentPage = page;
        tbody.innerHTML = '';
        const start = (page - 1) * CONFIG.rowsPerPage;
        const end = start + CONFIG.rowsPerPage;
        const paginatedItems = filteredRows.slice(start, end);
        const fragment = document.createDocumentFragment();
        paginatedItems.forEach(rowObject => {
            const tr = document.createElement('tr');
            tr.innerHTML = rowObject.html;
            fragment.appendChild(tr);
        });
        tbody.appendChild(fragment);
        renderPaginationControls();
    }

    function renderPaginationControls() {
        if (!paginationBlock) return;
        paginationBlock.innerHTML = '';
        const pageCount = Math.ceil(filteredRows.length / CONFIG.rowsPerPage);
        if (pageCount <= 1) return;

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; justify-content: center; align-items: center; margin-top: 15px;';
        const ul = document.createElement('ul');
        ul.className = 'pagination';
        ul.style.margin = '0';

        const createPageLink = (page, text, isDisabled = false, isActive = false) => {
            const li = document.createElement('li');
            li.className = isDisabled ? 'disabled' : (isActive ? 'active green' : 'waves-effect');
            const a = document.createElement('a');
            a.className = 'waves-effect' + (isActive ? ' white-text' : '');
            a.innerHTML = text || page;
            if (!isDisabled) a.onclick = () => renderPage(page);
            li.appendChild(a);
            return li;
        };

        ul.appendChild(createPageLink(currentPage - 1, '<i class="material-icons">chevron_left</i>', currentPage === 1));

        const maxPagesToShow = 9;
        let startPage = 1, endPage = pageCount;
        if (pageCount > maxPagesToShow) {
            let maxPagesBefore = Math.floor((maxPagesToShow - 1) / 2);
            if (currentPage > maxPagesBefore) {
                startPage = currentPage - maxPagesBefore;
            }
            endPage = startPage + maxPagesToShow - 1;
            if (endPage > pageCount) {
                endPage = pageCount;
                startPage = endPage - maxPagesToShow + 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            ul.appendChild(createPageLink(i, null, false, i === currentPage));
        }

        ul.appendChild(createPageLink(currentPage + 1, '<i class="material-icons">chevron_right</i>', currentPage === pageCount));
        container.appendChild(ul);
        paginationBlock.appendChild(container);
    }

    function updateHeaderVisuals() {
        const headers = table.querySelectorAll('thead th');
        headers.forEach((header, index) => {
            if (sortableColumns[index]) {
                if (!header.querySelector('.sort-header-content')) {
                    header.innerHTML = `<div class="sort-header-content"><span>${header.textContent.trim()}</span><i class="material-icons sort-icon"></i></div>`;
                }
                const icon = header.querySelector('.sort-icon');
                icon.textContent = (isSortingActive && index === sortState.colIndex)
                    ? (sortState.isAsc ? 'arrow_upward' : 'arrow_downward')
                    : '';
            }
        });
    }

    async function fetchAndCacheAllPages() {
        if (isFetching) return;
        isFetching = true;
        abortController = new AbortController();
        const { signal } = abortController;
        showLoadingIndicator('Starting fetch...');
        let tempRows = [];
        let page = 1;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const baseUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;

        try {
            while (true) {
                if (signal.aborted) throw new Error('AbortError');
                showLoadingIndicator(`Fetching page ${page}...`);
                const response = await fetch(`${baseUrl}&page=${page}`, { signal });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const rows = doc.querySelectorAll(CONFIG.selectors.tableBody + ' tr');
                if (rows.length === 0) break;
                rows.forEach(row => {
                    const rowData = { html: row.innerHTML, values: {} };
                    for (const colIndex in sortableColumns) {
                        rowData.values[colIndex] = sortableColumns[colIndex].parser(row.cells[colIndex]);
                    }
                    tempRows.push(rowData);
                });
                page++;
            }
            allRowsCache = tempRows;
            const cacheData = { timestamp: Date.now(), rows: allRowsCache };
            sessionStorage.setItem('sorterCache', JSON.stringify(cacheData));
            return true;
        } catch (err) {
            if (err.message !== 'AbortError') {
                console.error(`Failed to fetch page ${page}:`, err);
                showLoadingIndicator(`Failed to fetch page ${page}.`, `Error: ${err.message}. Check console for details.`);
                await new Promise(resolve => setTimeout(resolve, 4000));
            }
            return false;
        } finally {
            isFetching = false;
            hideLoadingIndicator();
        }
    }

    function sortAndDisplay() {
        showLoadingIndicator('Sorting...');
        setTimeout(() => {
            const { colIndex, isAsc } = sortState;
            filteredRows.sort((a, b) => {
                const valA = a.values[colIndex];
                const valB = b.values[colIndex];
                const order = isAsc ? 1 : -1;
                if (typeof valA === 'string') return valA.localeCompare(valB) * order;
                return (valA - valB) * order;
            });
            localStorage.setItem('sorterLastSort', JSON.stringify(sortState));
            updateHeaderVisuals();
            renderPage(1);
            hideLoadingIndicator();
        }, 50);
    }

    function filterAndDisplay() {
        const filterText = originalSearchInput.value.toLowerCase();
        filteredRows = allRowsCache.filter(row => row.values[0].includes(filterText));
        sortAndDisplay();
    }

    function activateSorting() {
        if (isSortingActive) return;
        isSortingActive = true;
        table.classList.add('sorted-history-table');
        filteredRows = [...allRowsCache];

        if (allRowsCache.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="no-history-message">No download history found.</td></tr>`;
            if (paginationBlock) paginationBlock.innerHTML = '';
            originalSearchInput.placeholder = 'No torrents to filter.';
            return;
        }

        paginationBlock?.querySelector('.pagination')?.remove();
        const savedSort = localStorage.getItem('sorterLastSort');
        if (savedSort) sortState = JSON.parse(savedSort);

        table.querySelectorAll('thead th').forEach((header, index) => {
            if (sortableColumns[index]) {
                header.style.cursor = 'pointer';
                header.title = `Click to sort all pages by ${sortableColumns[index].name}`;
                header.addEventListener('click', () => {
                    const isSameColumn = sortState.colIndex === index;
                    sortState.isAsc = isSameColumn ? !sortState.isAsc : (index === 0);
                    sortState.colIndex = index;
                    sortAndDisplay();
                });
            }
        });

        originalSearchInput.placeholder = `Live filter ${allRowsCache.length} torrents...`;
        originalSearchInput.addEventListener('input', filterAndDisplay);
        if (originalSearchButton) originalSearchButton.style.display = 'none';
        sortAndDisplay();
    }

    function initialize() {
        injectStyles();
        const startButton = document.createElement('button');
        startButton.id = 'start-sort-btn';
        startButton.textContent = 'Sort All Torrents';
        startButton.className = 'btn green darken-2';
        startButton.type = 'button';
        startButton.style.marginLeft = '10px';

        const resetButton = document.createElement('button');
        resetButton.id = 'reset-sort-btn';
        resetButton.textContent = 'Reset';
        resetButton.className = 'btn red darken-2';
        resetButton.type = 'button';
        resetButton.style.marginLeft = '10px';
        resetButton.style.display = 'none';

        startButton.addEventListener('click', async () => {
            startButton.style.opacity = '0.5';
            startButton.style.cursor = 'default';
            startButton.disabled = true;

            const cachedData = JSON.parse(sessionStorage.getItem('sorterCache'));
            const now = Date.now();
            let fetchSuccess = false;

            if (cachedData && (now - cachedData.timestamp) < CONFIG.cacheDurationMinutes * 60 * 1000) {
                showLoadingIndicator('Loading from cache...');
                allRowsCache = cachedData.rows;
                hideLoadingIndicator();
                fetchSuccess = true;
            } else {
                fetchSuccess = await fetchAndCacheAllPages();
            }

            if (fetchSuccess) {
                activateSorting();
                startButton.textContent = 'Sorting Activated';
                resetButton.style.display = 'inline-block';
            } else {
                startButton.style.opacity = '1';
                startButton.style.cursor = 'pointer';
                startButton.disabled = false;
            }
        });

        resetButton.addEventListener('click', () => {
            sessionStorage.removeItem('sorterCache');
            localStorage.removeItem('sorterLastSort');
            window.location.reload();
        });

        searchButtonContainer.appendChild(startButton);
        searchButtonContainer.appendChild(resetButton);
    }

    initialize();

})();
