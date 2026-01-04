// ==UserScript==
// @name         TorrentBD Activities and Breakdown Page Sorter
// @namespace    ThermaL -userscripts
// @version      1.2
// @description  clickable column headers to sort torrent data by name, size, seedtime, seedbonus, and ratio on TorrentBD's seedbonus and activities pages.
// @author       ThermaL
// @match        https://www.torrentbd.net/seedbonus-breakdown.php*
// @match        https://www.torrentbd.com/seedbonus-breakdown.php*
// @match        https://www.torrentbd.me/seedbonus-breakdown.php*
// @match        https://www.torrentbd.org/seedbonus-breakdown.php*
// @match        https://www.torrentbd.net/activities.php*
// @match        https://www.torrentbd.com/activities.php*
// @match        https://www.torrentbd.me/activities.php*
// @match        https://www.torrentbd.org/activities.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentbd.net
// @grant        GM_addStyle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/533748/TorrentBD%20Activities%20and%20Breakdown%20Page%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/533748/TorrentBD%20Activities%20and%20Breakdown%20Page%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles that match TorrentBD's theme
    GM_addStyle(`
        th.sortable {
            cursor: pointer;
            position: relative;
            padding-right: 20px !important;
            user-select: none;
            color: #fff;  /* Always white */
        }

        th.sortable:hover {
            background-color: #222;
        }

        th.sortable .sort-icon {
            position: absolute;
            right: 5px;
            opacity: 0.5;
            font-size: 12px;
            color: #fff;  /* Always white */
        }

        th.sortable.sort-active .sort-icon {
            opacity: 1;
            color: #fff;  /* Keep white when active */
        }

        th.sortable.sort-active {
            color: #fff;  /* Keep white when active */
        }

        /* Add specific styles for ascending/descending states */
        th.sortable.sort-desc .sort-icon,
        th.sortable.sort-asc .sort-icon {
            opacity: 1;
            color: #fff;  /* Keep white when sorting */
        }

        th.sortable.sort-desc,
        th.sortable.sort-asc {
            color: #fff;  /* Keep white when sorting */
        }

        /* Add hover effect for better visual feedback */
        th.sortable:hover .sort-icon {
            opacity: 0.8;
        }

        /* Loading spinner styles */
        #sort-spinner {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 8px;
            padding: 20px;
            display: none;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .spinner {
            border: 4px solid rgba(75, 75, 75, 0.3);
            border-radius: 50%;
            border-top: 4px solid #3a7ca5;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .spinner-text {
            color: #ccc;
            font-weight: bold;
        }

        /* Header spinner */
        .header-spinner {
            position: absolute;
            right: 5px;
            width: 16px;
            height: 16px;
            border: 2px solid #3a7ca5;
            border-top-color: transparent;
            border-radius: 50%;
            animation: header-spin 0.8s linear infinite;
            display: none;
        }

        @keyframes header-spin {
            to { transform: rotate(360deg); }
        }

        th.sortable.sorting .header-spinner {
            display: block;
        }

        th.sortable.sorting .sort-icon {
            display: none;
        }
    `);

    // Add logging utility
    function log(message, level = 'info') {
        const prefix = `[TorrentSort] ${level.toUpperCase()}: `;
        if (typeof GM_log !== 'undefined') {
            GM_log(prefix + message);
        } else {
            console.log(prefix + message);
        }
    }

    // Determine page type
    function getPageType() {
        if (window.location.href.includes('seedbonus-breakdown.php')) {
            return 'seedbonus';
        } else if (window.location.href.includes('activities.php')) {
            return 'activities';
        }
        return null;
    }

    // Extract torrent name
    function extractTorrentName(row) {
        try {
            const link = row.cells[0]?.querySelector('a');
            if (!link) return '';

            // Get the text content and normalize it
            let name = link.textContent.trim();

            // Convert Bangla numerals to ASCII numerals
            name = name.replace(/[০-৯]/g, function(d) {
                return String.fromCharCode(d.charCodeAt(0) - 2534);
            });

            // Normalize the string for better sorting
            return name.normalize('NFKC').toLowerCase();
        } catch (error) {
            log(`Error extracting torrent name: ${error.message}`, 'error');
            return '';
        }
    }

    function convertToBytes(sizeText) {
        try {
            if (!sizeText || sizeText === '-' || sizeText === '0') return 0;

            // Normalize the input
            const normalizedText = sizeText.replace(/,/g, '').trim();

            // Extract numeric part and unit
            const match = normalizedText.match(/^([\d.]+)\s*([A-Za-z]+)$/i);
            if (!match) {
                log(`Unable to parse size format: ${sizeText}`, 'warn');
                return 0;
            }

            const [, value, unit] = match;
            const numericValue = parseFloat(value);

            if (isNaN(numericValue)) {
                log(`Invalid numeric value: ${value}`, 'warn');
                return 0;
            }

            // Define unit multipliers (both binary and decimal)
            const units = {
                'B': 1,
                'KB': 1000,
                'MB': 1000 * 1000,
                'GB': 1000 * 1000 * 1000,
                'TB': 1000 * 1000 * 1000 * 1000,
                'KIB': 1024,
                'MIB': 1024 * 1024,
                'GIB': 1024 * 1024 * 1024,
                'TIB': 1024 * 1024 * 1024 * 1024
            };

            // Normalize unit to uppercase for comparison
            const normalizedUnit = unit.toUpperCase();
            const multiplier = units[normalizedUnit];

            if (multiplier === undefined) {
                log(`Unknown unit: ${unit}, assuming bytes`, 'warn');
                return numericValue;
            }

            return numericValue * multiplier;
        } catch (error) {
            log(`Error converting size: ${error.message}`, 'error');
            return 0;
        }
    }

    // Extract size in bytes
    function extractSize(row) {
        try {
            const sizeText = row.cells[1]?.textContent.trim() || '';
            if (!sizeText) {
                log(`Empty size text in cell`, 'warn');
                return 0;
            }
            return convertToBytes(sizeText);
        } catch (error) {
            log(`Error extracting size: ${error.message}`, 'error');
            return 0;
        }
    }

    function convertSeedtimeToDays(seedtimeText) {
        try {
            // Handle null, undefined, or empty input
            if (!seedtimeText || typeof seedtimeText !== 'string') {
                console.warn('Invalid seedtime input:', seedtimeText);
                return 0;
            }

            // Handle special cases
            if (seedtimeText === '-' || seedtimeText === '0' || seedtimeText === 'N/A' ||
                seedtimeText.toLowerCase() === 'none' || seedtimeText.toLowerCase() === 'unknown') {
                return 0;
            }

            // Normalize the input - handle various formats
            let normalized = seedtimeText.toLowerCase()
                .replace(/\s+/g, '')  // Remove all whitespace
                .replace(/,/g, '')    // Remove commas
                .replace(/\./g, '')   // Remove periods
                .trim();

            // Handle Bangla numerals
            normalized = normalized.replace(/[০-৯]/g, function(d) {
                return String.fromCharCode(d.charCodeAt(0) - 2534);
            });

            let totalDays = 0;

            // Handle combined formats (e.g., "1y2mo3w4d5h6m7s")
            const combinedMatch = normalized.match(/(\d+)(y|mo|w|d|h|m|s)/g);
            if (combinedMatch) {
                for (const match of combinedMatch) {
                    const value = parseInt(match.match(/\d+/)[0]);
                    const unit = match.match(/[a-z]+/)[0];

                    switch (unit) {
                        case 'y':
                            totalDays += value * 365;
                            break;
                        case 'mo':
                            totalDays += value * 30;
                            break;
                        case 'w':
                            totalDays += value * 7;
                            break;
                        case 'd':
                            totalDays += value;
                            break;
                        case 'h':
                            totalDays += value / 24;
                            break;
                        case 'm':
                            totalDays += value / (24 * 60);
                            break;
                        case 's':
                            totalDays += value / (24 * 60 * 60);
                            break;
                    }
                }
            }

            // Handle individual units (for backward compatibility)
            if (totalDays === 0) {
                // Handle months (must be checked before minutes)
                const monthsMatch = normalized.match(/(\d+)mo/);
                if (monthsMatch) {
                    const value = parseInt(monthsMatch[1]);
                    if (!isNaN(value)) totalDays += value * 30;
                }

                // Handle years
                const yearsMatch = normalized.match(/(\d+)y/);
                if (yearsMatch) {
                    const value = parseInt(yearsMatch[1]);
                    if (!isNaN(value)) totalDays += value * 365;
                }

                // Handle weeks
                const weeksMatch = normalized.match(/(\d+)w/);
                if (weeksMatch) {
                    const value = parseInt(weeksMatch[1]);
                    if (!isNaN(value)) totalDays += value * 7;
                }

                // Handle days
                const daysMatch = normalized.match(/(\d+)d/);
                if (daysMatch) {
                    const value = parseInt(daysMatch[1]);
                    if (!isNaN(value)) totalDays += value;
                }

                // Handle hours
                const hoursMatch = normalized.match(/(\d+)h/);
                if (hoursMatch) {
                    const value = parseInt(hoursMatch[1]);
                    if (!isNaN(value)) totalDays += value / 24;
                }

                // Handle minutes (must be checked after months)
                const minutesMatch = normalized.match(/(\d+)m(?!o)/);
                if (minutesMatch) {
                    const value = parseInt(minutesMatch[1]);
                    if (!isNaN(value)) totalDays += value / (24 * 60);
                }

                // Handle seconds
                const secondsMatch = normalized.match(/(\d+)s/);
                if (secondsMatch) {
                    const value = parseInt(secondsMatch[1]);
                    if (!isNaN(value)) totalDays += value / (24 * 60 * 60);
                }
            }

            // Handle simple number of days (if no units found)
            if (totalDays === 0) {
                const simpleMatch = normalized.match(/^(\d+)$/);
                if (simpleMatch) {
                    const value = parseInt(simpleMatch[1]);
                    if (!isNaN(value)) totalDays = value;
                }
            }

            // Validate the result
            if (isNaN(totalDays) || !isFinite(totalDays)) {
                console.warn('Invalid seedtime calculation result:', totalDays, 'from input:', seedtimeText);
                return 0;
            }

            return totalDays;
        } catch (error) {
            console.error('Error converting seedtime:', error, 'Input:', seedtimeText);
            return 0;
        }
    }

    // Extract seedtime in days
    function extractSeedtime(row) {
        try {
            if (!row || !row.cells) {
                console.warn('Invalid row structure');
                return 0;
            }

            const pageType = getPageType();
            let seedtimeText;

            if (pageType === 'activities') {
                // For activities page, get the first line of the second column
                const cell = row.cells[1];
                if (!cell) {
                    console.warn('Missing seedtime cell in activities page');
                    return 0;
                }

                // Handle multi-line content and remove any size information
                seedtimeText = cell.textContent
                    .split('\n')[0]  // Get first line
                    .replace(/size:.*$/i, '')  // Remove any size information
                    .trim();
            } else {
                // For seedbonus page, get the third column
                const cell = row.cells[2];
                if (!cell) {
                    console.warn('Missing seedtime cell in seedbonus page');
                    return 0;
                }
                seedtimeText = cell.textContent.trim();
            }

            if (!seedtimeText) {
                console.warn('Empty seedtime text');
                return 0;
            }

            const days = convertSeedtimeToDays(seedtimeText);
            if (days === 0) {
                console.warn('Could not convert seedtime:', seedtimeText);
            }
            return days;
        } catch (error) {
            console.error('Error extracting seedtime:', error);
            return 0;
        }
    }

    // Extract hourly seedbonus
    function extractHourlySeedbonus(row) {
        try {
            const text = row.cells[3]?.textContent.trim() || '';
            if (!text || text === '-' || text === '0') return 0;

            // Handle decimal numbers with optional leading/trailing spaces
            const match = text.match(/^\s*(\d*\.?\d+)\s*$/);
            if (match) {
                const value = parseFloat(match[1]);
                return isNaN(value) ? 0 : value;
            }
            return 0;
        } catch (error) {
            log(`Error extracting hourly seedbonus: ${error.message}`, 'error');
            return 0;
        }
    }

    // Extract uploaded data
    function extractUploaded(row) {
        try {
            const cells = row.cells;
            if (!cells || cells.length < 4) return 0;

            const uploadedText = cells[3].textContent.trim();
            if (!uploadedText || uploadedText === '-' || uploadedText === '0') return 0;

            return convertToBytes(uploadedText);
        } catch (error) {
            log(`Error extracting uploaded: ${error.message}`, 'error');
            return 0;
        }
    }

    // Extract downloaded data
    function extractDownloaded(row) {
        try {
            const cells = row.cells;
            if (!cells || cells.length < 3) return 0;

            const downloadedText = cells[2].textContent.trim();
            if (!downloadedText || downloadedText === '-' || downloadedText === '0') return 0;

            return convertToBytes(downloadedText);
        } catch (error) {
            log(`Error extracting downloaded: ${error.message}`, 'error');
            return 0;
        }
    }

    // Extract ratio
    function extractRatio(row) {
        try {
            const cells = row.cells;
            if (!cells || cells.length < 5) {
                return { value: 0, isInfinity: false };
            }

            const text = cells[4].textContent.trim();
            if (!text || text === '-' || text === '0') {
                return { value: 0, isInfinity: false };
            }

            // Handle infinity cases
            if (text === '∞' || text.toLowerCase().includes('inf')) {
                return { value: Infinity, isInfinity: true };
            }

            // Try to parse the ratio directly
            const ratio = parseFloat(text.replace(/[^0-9.]/g, ''));
            if (!isNaN(ratio)) {
                return { value: ratio, isInfinity: false };
            }

            // If direct parsing fails, calculate from uploaded/downloaded
            const uploaded = extractUploaded(row);
            const downloaded = extractDownloaded(row);

            if (downloaded === 0) {
                if (uploaded > 0) {
                    return { value: Infinity, isInfinity: true };
                }
                return { value: 0, isInfinity: false };
            }

            return { value: uploaded / downloaded, isInfinity: false };
        } catch (error) {
            log(`Error extracting ratio: ${error.message}`, 'error');
            return { value: 0, isInfinity: false };
        }
    }

    function compareRatios(a, b, descending) {
        try {
            const getGroup = (x) => {
                if (x.isInfinity) return 2;
                if (x.value === 0) return 0;
                return 1;
            };

            const groupA = getGroup(a);
            const groupB = getGroup(b);

            if (groupA !== groupB) {
                return descending ? groupB - groupA : groupA - groupB;
            }

            if (groupA === 1) {
                return descending ? b.value - a.value : a.value - b.value;
            }

            return 0;
        } catch (error) {
            log(`Error comparing ratios: ${error.message}`, 'error');
            return 0;
        }
    }

    // Create loading spinner
    function createLoadingSpinner() {
        if (document.getElementById('sort-spinner')) return;

        const spinner = document.createElement('div');
        spinner.id = 'sort-spinner';

        const spinnerCircle = document.createElement('div');
        spinnerCircle.className = 'spinner';
        spinner.appendChild(spinnerCircle);

        const spinnerText = document.createElement('div');
        spinnerText.className = 'spinner-text';
        spinnerText.textContent = 'Sorting...';
        spinner.appendChild(spinnerText);

        document.body.appendChild(spinner);
    }

    function showLoadingSpinner() {
        const spinner = document.getElementById('sort-spinner');
        if (spinner) spinner.style.display = 'flex';
    }

    function hideLoadingSpinner() {
        const spinner = document.getElementById('sort-spinner');
        if (spinner) spinner.style.display = 'none';
    }

    // Sort the table
    function sortTable(table, columnIndex, ascending, headerElement) {
        const pageType = getPageType();
        if (!pageType) return;

        const headerRow = table.querySelector('tr:first-child');
        if (!headerRow) {
            if (headerElement) headerElement.classList.remove('sorting');
            return;
        }

        // Get all rows except headers
        const allRows = Array.from(table.querySelectorAll('tr')).slice(1);
        if (allRows.length === 0) {
            if (headerElement) headerElement.classList.remove('sorting');
            return;
        }

        // Find the summary row by checking for specific patterns
        const summaryRow = allRows.find(row => {
            const cells = Array.from(row.cells);
            if (cells.length < 5) return false;

            // Check for summary row patterns
            const hasSizeLabel = cells[0].textContent.includes('Size:');
            const hasAvgLabel = cells[1].textContent.includes('Avg:');
            const hasDownloadedLabel = cells[2].textContent.includes('Downloaded:');
            const hasUploadedLabel = cells[3].textContent.includes('Uploaded:');
            const hasRatioLabel = cells[4].textContent.includes('Ratio:');

            return hasSizeLabel && hasAvgLabel && hasDownloadedLabel && hasUploadedLabel && hasRatioLabel;
        });

        // Filter out the summary row from the rows to sort
        const dataRows = allRows.filter(row => row !== summaryRow);

        const options = config[pageType].sortOptions[columnIndex];
        if (!options) {
            if (headerElement) headerElement.classList.remove('sorting');
            return;
        }

        // Use setTimeout to ensure the spinner is visible before heavy computation
        setTimeout(() => {
            try {
                // Sort the data rows
                dataRows.sort((a, b) => {
                    const valueA = options.extractor(a);
                    const valueB = options.extractor(b);

                    if (options.customCompare) {
                        return options.customCompare(valueA, valueB, !ascending);
                    }

                    if (options.isNumeric) {
                        return ascending ? valueA - valueB : valueB - valueA;
                    } else if (options.isAlpha) {
                        if (!valueA) return ascending ? -1 : 1;
                        if (!valueB) return ascending ? 1 : -1;
                        const comparison = valueA.localeCompare(valueB);
                        return ascending ? comparison : -comparison;
                    }

                    return 0;
                });

                // Remove all data rows (including summary if it exists)
                allRows.forEach(row => row.remove());

                // Re-insert sorted rows
                dataRows.forEach(row => headerRow.parentNode.appendChild(row));

                // Always add summary row at the end if it exists
                if (summaryRow) {
                    headerRow.parentNode.appendChild(summaryRow);
                }
            } catch (error) {
                console.error('Error during sorting:', error);
            } finally {
                if (headerElement) {
                    headerElement.classList.remove('sorting');
                    // Update sort icon based on final state
                    const sortIcon = headerElement.querySelector('.sort-icon');
                    if (sortIcon) {
                        sortIcon.textContent = ascending ? '▲' : '▼';
                    }
                }
            }
        }, 50);
    }

    // Add sort controls to table headers
    function addSortControls(table) {
        const pageType = getPageType();
        if (!pageType) return;

        const headerRow = table.querySelector('tr:first-child');
        if (!headerRow) return;

        // Clear any existing click handlers
        headerRow.querySelectorAll('th').forEach(th => {
            th.onclick = null;
        });

        headerRow.querySelectorAll('th').forEach((th, index) => {
            const col = config[pageType].sortOptions[index];
            if (!col) return;

            // Remove existing sortable class and icons
            th.classList.remove('sortable', 'sort-active', 'sort-desc', 'sorting');
            const existingIcon = th.querySelector('.sort-icon');
            if (existingIcon) {
                existingIcon.remove();
            }
            const existingSpinner = th.querySelector('.header-spinner');
            if (existingSpinner) {
                existingSpinner.remove();
            }

            th.classList.add('sortable');

            // Add sort icon
            const sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';
            sortIcon.textContent = '▼';
            th.appendChild(sortIcon);

            // Add spinner
            const spinner = document.createElement('div');
            spinner.className = 'header-spinner';
            th.appendChild(spinner);

            // Initialize state
            th.dataset.column = index;
            th.dataset.state = 'none';

            // Use addEventListener instead of onclick for better event handling
            th.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Reset all headers first
                headerRow.querySelectorAll('th.sortable').forEach(otherHeader => {
                    if (otherHeader !== this) {
                        otherHeader.querySelector('.sort-icon').textContent = '▼';
                        otherHeader.classList.remove('sort-active', 'sort-desc', 'sorting');
                        otherHeader.dataset.state = 'none';
                    }
                });

                // Show spinner
                this.classList.add('sorting');

                // Simple toggle logic for all columns
                const isAscending = this.dataset.state === 'none' ? false : this.dataset.state !== 'asc';

                // Update the header state
                this.dataset.state = isAscending ? 'asc' : 'desc';
                this.classList.remove('sort-active', 'sort-desc');
                this.classList.add(isAscending ? 'sort-active' : 'sort-desc');

                // Update the sort icon
                const sortIcon = this.querySelector('.sort-icon');
                if (sortIcon) {
                    sortIcon.textContent = isAscending ? '▲' : '▼';
                }

                // Sort the table immediately
                sortTable(table, index, isAscending, this);
            });
        });
    }

    // Find the main table
    function findTable() {
        try {
            const pageType = getPageType();
            if (!pageType) {
                log('Unsupported page type', 'warn');
                return null;
            }

            const tables = document.querySelectorAll('table');
            const requiredHeaders = config[pageType].requiredHeaders;

            for (const table of tables) {
                const headers = Array.from(table.querySelectorAll('th')).map(th =>
                    th.textContent.trim().toLowerCase()
                );

                if (requiredHeaders.every(required =>
                    headers.some(header => header.includes(required))
                )) {
                    log('Found matching table');
                    return table;
                }
            }
            log('No table found matching required headers', 'warn');
            return null;
        } catch (error) {
            log(`Error finding table: ${error.message}`, 'error');
            return null;
        }
    }

    // Configuration for different page types
    const config = {
        seedbonus: {
            requiredHeaders: ['torrent', 'size', 'seedtime', 'hourly seedbonus'],
            sortOptions: {
                0: { label: 'Torrent', extractor: extractTorrentName, isAlpha: true },
                1: { label: 'Size', extractor: extractSize, isNumeric: true },
                2: { label: 'Seedtime', extractor: extractSeedtime, isNumeric: true },
                3: { label: 'Hourly Seedbonus', extractor: extractHourlySeedbonus, isNumeric: true }
            }
        },
        activities: {
            requiredHeaders: ['torrent', 'seedtime', 'downloaded', 'uploaded', 'ratio'],
            sortOptions: {
                0: { label: 'Torrent', extractor: extractTorrentName, isAlpha: true },
                1: { label: 'Seedtime', extractor: extractSeedtime, isNumeric: true, forceFirstClick: true },
                2: { label: 'Downloaded', extractor: extractDownloaded, isNumeric: true },
                3: { label: 'Uploaded', extractor: extractUploaded, isNumeric: true },
                4: { label: 'Ratio', extractor: extractRatio, customCompare: compareRatios }
            }
        }
    };

    // Initialize the script
    function init() {
        const table = findTable();
        if (table) {
            createLoadingSpinner(); // Ensure the spinner is created
            addSortControls(table);
        }
    }

    // Run the script
    init();
})();