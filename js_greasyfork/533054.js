// ==UserScript==
// @name             F95zone Development Time Tracker & Sorter
// @namespace        http://tampermonkey.net/
// @version          1.0
// @description      Calculates and shows the development duration of games on f95zone.to/sam/latest_alpha/* page with a sorting feature. 
// @author           0wn3dbot
// @license          MIT
// @match            https://f95zone.to/sam/latest_alpha/*
// @grant            GM_xmlhttpRequest
// @grant            GM_addStyle
// @grant            GM_setValue
// @grant            GM_getValue
// @connect          f95zone.to
// @downloadURL https://update.greasyfork.org/scripts/533054/F95zone%20Development%20Time%20Tracker%20%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/533054/F95zone%20Development%20Time%20Tracker%20%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        filterStorageKey: 'devTimeFilterSettings',
        sortStorageKey: 'devTimeSortEnabled',
        requestBatchSize: 5, // Number of requests to send simultaneously
        creationDateStoragePrefix: 'threadCreationDate_' // Prefix for keys in GM storage
    };

    // --- Styles ---
    GM_addStyle(`
        /* Main overlay styles */
        .resource-tile {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .resource-tile_thumb-wrap {
            position: relative;
        }
        .dev-time-overlay {
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(15, 15, 15, 0.8);
            color: #e0e0e0;
            padding: 3px 6px;
            font-size: 11px;
            font-weight: 500;
            border-radius: 0 8px 0 0;
            z-index: 10;
            font-family: 'Lato', 'Open Sans', sans-serif;
            pointer-events: none;
            line-height: 1.2;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
        }

        /* Toolbar */
        .dev-tools-panel {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 12px 15px;
            margin: 0 auto 20px;
            max-width: 1200px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            border: 1px solid #3a3a3a;
        }

        .dev-progress-container {
            flex: 1;
            min-width: 200px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .dev-progress-bar {
            flex: 1;
            height: 8px;
            background: #3a3a3a;
            border-radius: 4px;
            overflow: hidden;
        }

        .dev-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a8bfc, #2a65c5);
            width: 0%;
            transition: width 0.3s ease;
        }

        .dev-progress-text {
            font-size: 12px;
            color: #aaa;
            min-width: 80px;
            text-align: center;
            font-family: 'Lato', sans-serif;
        }

        .dev-tools-btn {
            background: #3a3a3a;
            color: #ddd;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-family: 'Lato', sans-serif;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .dev-tools-btn:hover {
            background: #4a4a4a;
            color: #fff;
        }

        .dev-tools-btn.active {
            background: #4a8bfc;
            color: #fff;
        }

        .dev-tools-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .dev-filter-container {
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(0,0,0,0.2);
            padding: 5px 8px;
            border-radius: 4px;
            border: 1px solid #3a3a3a;
        }

        .dev-filter-input {
            width: 30px;
            background: #3a3a3a;
            border: 1px solid #4a4a4a;
            color: #ddd;
            padding: 3px;
            text-align: center;
            border-radius: 3px;
            font-size: 11px;
        }

        .dev-filter-separator {
            color: #666;
            font-size: 12px;
        }

        /* Animations */
        @keyframes pulse {
            0% { opacity: 0.6;
            }
            50% { opacity: 1;
            }
            100% { opacity: 0.6;
            }
        }

        .dev-processing {
            animation: pulse 1.5s infinite;
        }

        .dev-hidden {
            transform: scale(0.95);
            opacity: 0.3;
            pointer-events: none;
        }
    `);

    // --- Helper functions ---

    /**
     * Converts development time string to milliseconds
     * @param {string} timeStr - Time string (e.g., "1y, 2m, 3w, 4d")
     * @returns {number} Time in milliseconds
     */
    function timeStringToMs(timeStr) {
        if (!timeStr || timeStr === "N/A") return 0;
        const msPerDay = 1000 * 60 * 60 * 24;
        const msPerWeek = msPerDay * 7;
        const msPerMonth = msPerDay * (365.25 / 12);
        const msPerYear = msPerDay * 365.25;

        let totalMs = 0;
        const parts = timeStr.split(',').map(p => p.trim());

        parts.forEach(part => {
            if (part.includes('y')) {
                const years = parseInt(part.replace('y', '')) || 0;
                totalMs += years * msPerYear;
            } else if (part.includes('m')) {
                const months = parseInt(part.replace('m', '')) || 0;
                totalMs += months * msPerMonth;
            } else if (part.includes('w')) {
                const weeks = parseInt(part.replace('w', '')) || 0;
                totalMs += weeks * msPerWeek;
            } else if (part.includes('d')) {
                const days = parseInt(part.replace('d', '')) || 0;
                totalMs += days * msPerDay;
            } else if (part === "&lt;1d") {
                totalMs += msPerDay * 0.5; // Half a day for "<1d"
            }
        });

        return totalMs;
    }

    /**
     * Calculates the difference between two dates and formats it.
     * @param {Date} startDate - Start date (thread creation)
     * @param {Date} endDate - End date (last update)
     * @returns {string} Formatted difference string (e.g., "1y, 2m, 3w, 1d")
     */
    function calculateDateDifference(startDate, endDate) {
        if (!startDate || !endDate) {
            return "N/A";
        }

        if (startDate > endDate) {
            return ">1d"; // Display ">1d" if creation date is in the future
        }

        let diff = Math.abs(endDate - startDate);
        const msPerDay = 1000 * 60 * 60 * 24;
        const msPerWeek = msPerDay * 7;
        const msPerMonth = msPerDay * (365.25 / 12);
        const msPerYear = msPerDay * 365.25;

        const years = Math.floor(diff / msPerYear);
        diff -= years * msPerYear;

        const months = Math.floor(diff / msPerMonth);
        diff -= months * msPerMonth;
        const weeks = Math.floor(diff / msPerWeek);
        diff -= weeks * msPerWeek;

        const days = Math.floor(diff / msPerDay);
        let result = [];
        if (years > 0) result.push(`${years}y`);
        if (months > 0) result.push(`${months}m`);
        if (weeks > 0) result.push(`${weeks}w`);
        if (days > 0 && (result.length === 0 || years > 0 || months > 0 || weeks > 0)) {
            result.push(`${days}d`);
        }
        if (result.length === 0 && Math.abs(endDate - startDate) > 0) {
            return "&lt;1d";
        }

        return result.join(', ') || "N/A";
    }

    /**
     * Determines the approximate last update date based on the text in the tile.
     * @param {Element} timeElement - Span element inside .resource-tile_info-meta_time
     * @returns {Date|null} Calculated date or null
     */
    function getLastUpdateDate(timeElement) {
        const now = new Date();
        if (!timeElement) return now;

        const timeValue = parseInt(timeElement.textContent.trim(), 10);
        const timeClass = timeElement.className;
        if (timeClass.includes('tile-date_mins')) {
            now.setMinutes(now.getMinutes() - (isNaN(timeValue) ? 0 : timeValue));
        } else if (timeClass.includes('tile-date_hrs')) {
            now.setHours(now.getHours() - (isNaN(timeValue) ? 0 : timeValue));
        } else if (timeClass.includes('tile-date_yesterday')) {
            now.setDate(now.getDate() - 1);
        } else if (timeClass.includes('tile-date_days')) {
            now.setDate(now.getDate() - (isNaN(timeValue) ? 0 : timeValue));
        } else if (timeClass.includes('tile-date_week')) {
            now.setDate(now.getDate() - (isNaN(timeValue) ? 0 : timeValue) * 7);
        } else if (timeClass.includes('tile-date_month')) {
            now.setMonth(now.getMonth() - (isNaN(timeValue) ? 0 : timeValue));
        } else if (timeClass.includes('tile-date_years')) {
            now.setFullYear(now.getFullYear() - (isNaN(timeValue) ? 0 : timeValue));
        } else {
            return new Date();
        }
        return now;
    }

    /**
     * Finds the thread creation date on the page
     * @param {Document} doc - DOM of the thread page
     * @returns {Date|null} Creation date or null
     */
    function findThreadCreationDate(doc) {
        // Try to find the standard time element
        let threadTimeElement = doc.querySelector('time.u-dt[datetime]');
        if (threadTimeElement) {
            const creationDateTimeString = threadTimeElement.getAttribute('datetime');
            const creationDate = new Date(creationDateTimeString);
            return isNaN(creationDate) ? null : creationDate;
        }

        // Alternative for pages with a different format
        const startDateElement = doc.querySelector('i.fa-clock')?.nextElementSibling?.nextElementSibling;
        if (startDateElement) {
            const timeElement = startDateElement.querySelector('time.u-dt[datetime]');
            if (timeElement) {
                const creationDateTimeString = timeElement.getAttribute('datetime');
                const creationDate = new Date(creationDateTimeString);
                return isNaN(creationDate) ? null : creationDate;
            }
        }

        return null;
    }

    // --- Class for managing tools ---
    class DevTools {
        constructor() {
            this.totalTiles = 0;
            this.processedTiles = 0;
            this.tilesData = new Map();
            this.sortActive = GM_getValue(CONFIG.sortStorageKey, false);
            this.filterSettings = GM_getValue(CONFIG.filterStorageKey, { min: {}, max: {} });
            this.processingQueue = [];
            this.isProcessing = false;
            this.collectionStarted = false;

            this.initPanel();
            this.updateProgress(); // Initialize progress to display 0/0
        }

        initPanel() {
            // Create a container for the toolbar
            const noticesContainer = document.querySelector('.notices--block')?.parentElement ||
            document.body;
            this.panelElement = document.createElement('div');
            this.panelElement.className = 'dev-tools-panel';

            // "Start Collection" button
            this.startButton = document.createElement('button');
            this.startButton.className = 'dev-tools-btn';
            this.startButton.innerHTML = '<i class="fas fa-play"></i> Start Collection';
            this.startButton.addEventListener('click', () => this.startCollection());
            // Progress container (hidden until collection starts)
            this.progressContainer = document.createElement('div');
            this.progressContainer.className = 'dev-progress-container';
            this.progressContainer.style.display = 'none';

            this.progressBar = document.createElement('div');
            this.progressBar.className = 'dev-progress-bar';

            this.progressFill = document.createElement('div');
            this.progressFill.className = 'dev-progress-fill';
            this.progressBar.appendChild(this.progressFill);
            this.progressText = document.createElement('span');
            this.progressText.className = 'dev-progress-text';
            this.progressText.textContent = '0/0';

            this.progressContainer.appendChild(this.progressBar);
            this.progressContainer.appendChild(this.progressText);
            // Sort button
            this.sortBtn = document.createElement('button');
            this.sortBtn.className = `dev-tools-btn ${this.sortActive ? 'active' : ''}`;
            this.sortBtn.innerHTML = '<i class="fas fa-sort-amount-down"></i> Sort';
            this.sortBtn.disabled = true;
            this.sortBtn.addEventListener('click', () => this.toggleSort());

            // Assembling the panel
            this.panelElement.append(
                this.startButton,
                this.progressContainer,
                this.sortBtn
            );
            // Insert the panel after notifications or at the beginning of the body
            noticesContainer.insertBefore(this.panelElement, noticesContainer.firstChild);
        }

        startCollection() {
            if (!this.collectionStarted) {
                this.collectionStarted = true;
                this.startButton.style.display = 'none';
                this.progressContainer.style.display = 'flex';
                this.totalTiles = document.querySelectorAll('.resource-tile').length; // Set the total number of tiles once
                this.updateProgress();
                this.processAllTiles();
                setTimeout(() => this.observeDOM(), 10000); // Start MutationObserver after 10 seconds
                this.startPeriodicCheck();
            }
        }

        updateProgress() {
            this.progressText.textContent = `${this.processedTiles}/${this.totalTiles}`;
            const progressPercent = this.totalTiles > 0 ? (this.processedTiles / this.totalTiles) * 100 : 0;
            this.progressFill.style.width = `${progressPercent}%`;
            // Activate buttons if all tiles are processed
            if (this.processedTiles > 0 && this.processedTiles === this.totalTiles) {
                this.sortBtn.disabled = false;

                // Apply saved sorting
                if (this.sortActive) {
                    this.applySort();
                }
            }
        }

        toggleSort() {
            this.sortActive = !this.sortActive;
            this.sortBtn.classList.toggle('active', this.sortActive);
            GM_setValue(CONFIG.sortStorageKey, this.sortActive);

            if (this.sortActive) {
                this.applySort();
            } else {
                this.resetSort();
            }
        }

        applySort() {
            const container = document.querySelector('#latest-page_items-wrap_inner');
            if (!container) return;

            // Create an array of tiles for sorting
            const tilesArray = Array.from(this.tilesData.keys());
            // Sort by development time (descending), placing ">1d" at the end
            tilesArray.sort((a, b) => {
                const aData = this.tilesData.get(a);
                const bData = this.tilesData.get(b);

                if (aData.devTime === ">1d" && bData.devTime !== ">1d") {
                    return 1;
                }
                if (bData.devTime === ">1d" && aData.devTime !== ">1d") {
                    return -1;
                }

                const aMs = timeStringToMs(aData.devTime);
                const bMs = timeStringToMs(bData.devTime);

                return bMs - aMs;
            });
            // Rearrange tiles in the DOM
            tilesArray.forEach(tile => {
                container.appendChild(tile);
            });
        }

        resetSort() {
            const container = document.querySelector('#latest-page_items-wrap_inner');
            if (!container) return;

            // Create an array of tiles with their original positions
            const tilesArray = Array.from(this.tilesData.keys()).map(tile => ({
                tile,
                originalOrder: parseInt(tile.dataset.originalOrder || '0')
            }));
            // Sort by original order
            tilesArray.sort((a, b) => a.originalOrder - b.originalOrder);
            // Rearrange tiles in the DOM
            tilesArray.forEach(({tile}) => {
                container.appendChild(tile);
            });
        }

        addTileToQueue(tile, threadUrl, lastUpdateDate) {
            if (!tile.dataset.devTimeProcessed) {
                tile.dataset.devTimeProcessed = 'pending';
                this.processingQueue.push({ tile, threadUrl, lastUpdateDate });
                this.updateProgress(); // Update progress to show the total count
                if (!this.isProcessing) {
                    this.processQueue();
                }
            }
        }

        processQueue() {
            if (this.processingQueue.length === 0) {
                this.isProcessing = false;
                return;
            }

            this.isProcessing = true;
            const batch = this.processingQueue.splice(0, CONFIG.requestBatchSize);
            const requests = batch.map(({ tile, threadUrl, lastUpdateDate }) => {
                const threadIdMatch = threadUrl.match(/threads\/(\d+)/);
                const threadId = threadIdMatch ? threadIdMatch[1] : null;
                const creationDateKey = threadId ? `${CONFIG.creationDateStoragePrefix}${threadId}` : null;

                return new Promise((resolve, reject) => {
                    if (creationDateKey) {
                        const storedCreationDate = GM_getValue(creationDateKey);
                        if (storedCreationDate) {
                            const creationDate = new Date(storedCreationDate);
                            const diffString = calculateDateDifference(creationDate, lastUpdateDate);
                            const thumbWrap = tile.querySelector('.resource-tile_thumb-wrap');
                            if (thumbWrap) {
                                const overlay = document.createElement('div');
                                overlay.className = 'dev-time-overlay';
                                overlay.innerHTML = `Dev Time: ${diffString}`;
                                thumbWrap.appendChild(overlay);
                            }
                            devTools.tilesData.set(tile, { devTime: diffString, lastUpdateDate, creationDate });
                            tile.dataset.devTimeProcessed = 'true';
                            devTools.processedTiles++;
                            devTools.updateProgress();
                            resolve();
                            return;
                        }
                    }

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: threadUrl,
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, "text/html");
                                    const creationDate = findThreadCreationDate(doc);

                                    if (creationDate) {
                                        if (creationDateKey) {
                                            GM_setValue(creationDateKey, creationDate.toISOString());
                                        }
                                        const diffString = calculateDateDifference(creationDate, lastUpdateDate);
                                        const thumbWrap = tile.querySelector('.resource-tile_thumb-wrap');
                                        if (thumbWrap) {
                                            const overlay = document.createElement('div');
                                            overlay.className = 'dev-time-overlay';
                                            overlay.innerHTML = `Dev Time: ${diffString}`;
                                            thumbWrap.appendChild(overlay);
                                        }
                                        devTools.tilesData.set(tile, { devTime: diffString, lastUpdateDate, creationDate });
                                        tile.dataset.devTimeProcessed = 'true';
                                        devTools.processedTiles++;
                                        devTools.updateProgress();
                                        resolve();
                                    } else {
                                        console.warn(`Could not find creation date on: ${threadUrl}`);
                                        devTools.tilesData.set(tile, { devTime: "N/A", lastUpdateDate });
                                        tile.dataset.devTimeProcessed = 'failed';
                                        devTools.processedTiles++;
                                        devTools.updateProgress();
                                        resolve();
                                    }
                                } catch (e) {
                                    console.error(`Error parsing response for ${threadUrl}:`, e);
                                    devTools.tilesData.set(tile, { devTime: "N/A", lastUpdateDate });
                                    tile.dataset.devTimeProcessed = 'error';
                                    devTools.processedTiles++;
                                    devTools.updateProgress();
                                    resolve();
                                }
                            } else {
                                console.error(`Failed to fetch ${threadUrl}. Status: ${response.status}`);
                                devTools.tilesData.set(tile, { devTime: "N/A", lastUpdateDate });
                                tile.dataset.devTimeProcessed = 'failed';
                                devTools.processedTiles++;
                                devTools.updateProgress();
                                resolve();
                            }
                        },
                        onerror: function(error) {
                            console.error(`Network error fetching ${threadUrl}:`, error);
                            devTools.tilesData.set(tile, { devTime: "N/A", lastUpdateDate });
                            tile.dataset.devTimeProcessed = 'error';
                            devTools.processedTiles++;
                            devTools.updateProgress();
                            resolve();
                        }
                    });
                });
            });

            Promise.all(requests).then(() => {
                setTimeout(() => this.processQueue(), 200); // Small delay between batches
            });
        }

        processAllTiles() {
            const tiles = document.querySelectorAll('.resource-tile:not([data-dev-time-processed])');
            // totalTiles is set in startCollection once
            tiles.forEach(tile => {
                if (!tile.dataset.originalOrder) {
                    tile.dataset.originalOrder = Array.from(tile.parentNode.children).indexOf(tile);
                }
                const linkElement = tile.querySelector('a.resource-tile_link');
                const timeMetaElement = tile.querySelector('.resource-tile_info-meta_time span');

                if (!linkElement) {
                    console.warn('Could not find link for tile:', tile);
                    return;
                }

                const threadUrl = linkElement.href;
                const lastUpdateDate = getLastUpdateDate(timeMetaElement);

                const threadIdMatch = threadUrl.match(/threads\/(\d+)/);
                const threadId = threadIdMatch ? threadIdMatch[1] : null;
                const creationDateKey = threadId ? `${CONFIG.creationDateStoragePrefix}${threadId}` : null;

                if (creationDateKey && GM_getValue(creationDateKey)) {
                    const storedCreationDate = GM_getValue(creationDateKey);
                    const creationDate = new Date(storedCreationDate);
                    const diffString = calculateDateDifference(creationDate, lastUpdateDate);
                    const thumbWrap = tile.querySelector('.resource-tile_thumb-wrap');
                    if (thumbWrap) {
                        const overlay = document.createElement('div');
                        overlay.className = 'dev-time-overlay';
                        overlay.innerHTML = `Dev Time: ${diffString}`;
                        thumbWrap.appendChild(overlay);
                    }
                    devTools.tilesData.set(tile, { devTime: diffString, lastUpdateDate, creationDate });
                    tile.dataset.devTimeProcessed = 'true';
                    devTools.processedTiles++;
                    devTools.updateProgress();
                } else {
                    this.addTileToQueue(tile, threadUrl, lastUpdateDate);
                }
            });
        }

        observeDOM() {
            const observerTarget = document.querySelector('#latest-page_items-wrap_inner');
            if (observerTarget) {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    if (node.matches('.resource-tile')) {
                                        this.processTile(node);
                                    } else {
                                        const newTiles = node.querySelectorAll('.resource-tile:not([data-dev-time-processed])');
                                        newTiles.forEach(this.processTile.bind(this));
                                    }
                                }
                            });
                        }
                    });
                });
                observer.observe(observerTarget, {
                    childList: true,
                    subtree: true
                });
            } else {
                console.error("Target element for MutationObserver (#latest-page_items-wrap_inner) not found.");
            }
        }

        processTile(tile) {
            if (!tile || tile.dataset.devTimeProcessed) {
                return;
            }
            if (!tile.dataset.originalOrder) {
                tile.dataset.originalOrder = Array.from(tile.parentNode.children).indexOf(tile);
            }

            const linkElement = tile.querySelector('a.resource-tile_link');
            const timeMetaElement = tile.querySelector('.resource-tile_info-meta_time span');

            if (!linkElement) {
                console.warn('Could not find link for tile:', tile);
                return;
            }

            const threadUrl = linkElement.href;
            const lastUpdateDate = getLastUpdateDate(timeMetaElement);

            const threadIdMatch = threadUrl.match(/threads\/(\d+)/);
            const threadId = threadIdMatch ? threadIdMatch[1] : null;
            const creationDateKey = threadId ? `${CONFIG.creationDateStoragePrefix}${threadId}` : null;

            if (creationDateKey && GM_getValue(creationDateKey)) {
                const storedCreationDate = GM_getValue(creationDateKey);
                const creationDate = new Date(storedCreationDate);
                const diffString = calculateDateDifference(creationDate, lastUpdateDate);
                const thumbWrap = tile.querySelector('.resource-tile_thumb-wrap');
                if (thumbWrap) {
                    const overlay = document.createElement('div');
                    overlay.className = 'dev-time-overlay';
                    overlay.innerHTML = `Dev Time: ${diffString}`;
                    thumbWrap.appendChild(overlay);
                }
                devTools.tilesData.set(tile, { devTime: diffString, lastUpdateDate, creationDate });
                tile.dataset.devTimeProcessed = 'true';
                devTools.processedTiles++;
                devTools.updateProgress();
            } else {
                this.addTileToQueue(tile, threadUrl, lastUpdateDate);
            }
        }

        startPeriodicCheck() {
            this.checkInterval = setInterval(() => {
                const unprocessed = document.querySelectorAll('.resource-tile:not([data-dev-time-processed])');
                if (unprocessed.length > 0) {
                    unprocessed.forEach(this.processTile.bind(this));
                }
            }, 1000);
        }
    }

    // --- Main logic ---
    const devTools = new DevTools();
})();