// ==UserScript==
// @name        MusicBrainz: Reports Statistics
// @namespace   https://musicbrainz.org/user/chaban
// @version     2.0.5
// @description Indicates report changes since the last visit and hides reports without items.
// @tag         ai-created
// @author      chaban
// @license     MIT
// @match       *://*.musicbrainz.org/reports*
// @connect     self
// @icon        https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/537458/MusicBrainz%3A%20Reports%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/537458/MusicBrainz%3A%20Reports%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentScriptVersion = GM_info.script.version;
    const CURRENT_CACHE_VERSION = '2.0';
    const SCRIPT_NAME = GM_info.script.name;
    const INTERNAL_CACHE_DURATION = 1 * 60 * 60 * 1000;
    const REQUEST_DELAY = 1000;
    const HISTORY_MAX_DAYS = 30;

    const MB_REPORT_GENERATION_HOUR_UTC = 0;
    const MB_REPORT_GENERATION_MINUTE_UTC = 10;

    const CENTRAL_CACHE_KEY = 'musicbrainz_reports_cache';

    let progressBarContainer;
    let progressBar;
    let totalLinksToFetch = 0;
    let fetchedLinksCount = 0;
    let currentFilterMode;

    /**
     * Custom logging function to prefix all messages with script name.
     * @param {...any} messages The messages to log.
     */
    function log(...messages) {
        console.log(`[${SCRIPT_NAME}]`, ...messages);
    }

    /**
     * Custom error logging function.
     * @param {...any} messages The error messages to log.
     */
    function error(...messages) {
        console.error(`[${SCRIPT_NAME}] ERROR:`, ...messages);
    }

    /**
     * Creates and initializes the progress bar elements.
     */
    function createProgressBar() {
        progressBarContainer = document.createElement('div');
        progressBarContainer.id = 'mb-report-hider-progress-container';
        Object.assign(progressBarContainer.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            zIndex: '9999',
            display: 'none'
        });

        progressBar = document.createElement('div');
        progressBar.id = 'mb-report-hider-progress-bar';
        Object.assign(progressBar.style, {
            width: '0%',
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease-in-out'
        });

        progressBarContainer.appendChild(progressBar);
        document.documentElement.appendChild(progressBarContainer);
    }

    /**
     * Updates the progress bar's width.
     */
    function updateProgressBar() {
        if (totalLinksToFetch === 0) {
            progressBar.style.width = '0%';
        } else {
            const percentage = (fetchedLinksCount / totalLinksToFetch) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Shows the progress bar.
     */
    function showProgressBar() {
        if (progressBarContainer) {
            progressBarContainer.style.display = 'block';
        }
    }

    /**
     * Hides the progress bar.
     */
    function hideProgressBar() {
        if (progressBarContainer) {
            progressBarContainer.style.display = 'none';
        }
    }

    /**
     * Extracts just the report name from a full MusicBrainz report URL.
     * E.g., "https://beta.musicbrainz.org/report/ArtistsThatMayBeGroups" -> "ArtistsThatMayBeGroups"
     * @param {string} fullUrl The full URL of the report.
     * @returns {string} The simplified report name.
     */
    function getReportName(fullUrl) {
        try {
            const url = new URL(fullUrl);
            const pathParts = url.pathname.split('/');
            for (let i = pathParts.length - 1; i >= 0; i--) {
                if (pathParts[i]) {
                    return pathParts[i];
                }
            }
            return url.pathname;
        } catch (e) {
            error("Error parsing URL to get report name:", fullUrl, e);
            return fullUrl;
        }
    }

    /**
     * Parses the "Generated on" timestamp string from report HTML.
     * Example: "Generated on 2025-05-25 02:20 GMT+2"
     * @param {string} htmlContent The HTML content of the report page.
     * @returns {number|null} UTC milliseconds timestamp, or null if not found/parsed.
     */
    function parseGeneratedOnTimestamp(htmlContent) {
        const match = htmlContent.match(/Generated on (\d{4}-\d{2}-\d{2} \d{2}:\d{2} GMT[+-]\d{1,2})/);
        if (match && match[1]) {
            try {
                const dateString = match[1].replace(/GMT([+-]\d{1,2})/, '$1:00');
                const date = new Date(dateString);
                return date.getTime();
            } catch (e) {
                error("Error parsing generated timestamp:", match[1], e);
            }
        }
        return null;
    }

    /**
     * Extracts item count and generated timestamp from report HTML.
     * @param {string} htmlContent The HTML content of the report page.
     * @returns {{itemCount: number, mbGeneratedTimestamp: number|null}}
     */
    function extractReportData(htmlContent) {
        let itemCount = 0;
        const countMatch = htmlContent.match(/Total\s+[\w\s-]+?\s+found:\s*(\d+)/i);
        if (countMatch && countMatch[1]) {
            itemCount = parseInt(countMatch[1], 10);
        } else {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const tableBody = doc.querySelector('table.tbl tbody');
            if (tableBody && tableBody.children.length === 0) {
                itemCount = 0;
            }
        }
        const mbGeneratedTimestamp = parseGeneratedOnTimestamp(htmlContent);
        return { itemCount, mbGeneratedTimestamp };
    }

    /**
     * Fetches the content of a given URL using GM_xmlhttpRequest.
     * @param {string} url The URL to fetch.
     * @returns {Promise<string>} A promise that resolves with the response text or rejects with an error object including status and responseText.
     */
    function fetchUrlContent(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject({ status: response.status, message: `Failed to fetch ${url}: Status ${response.status}`, responseText: response.responseText });
                    }
                },
                onerror: function(errorResponse) {
                    reject({ status: 0, message: `Error fetching ${url}: ${errorResponse.message || JSON.stringify(errorResponse)}`, responseText: errorResponse.responseText || '' });
                }
            });
        });
    }

    /**
     * Pauses execution for a given number of milliseconds.
     * @param {number} ms The number of milliseconds to wait.
     * @returns {Promise<void>} A promise that resolves after the delay.
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Calculates the UTC timestamp for today's 00:00:00.000.
     * This is used as a boundary to determine if a cached report's generation time is 'today' or 'yesterday/earlier'.
     * @returns {number} UTC milliseconds timestamp for today at midnight.
     */
    function getTodayMidnightUTC() {
        const now = new Date();
        // Create a Date object for current day, 00:00:00.000 UTC
        return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0);
    }

    /**
     * Formats a duration in milliseconds into a human-readable string.
     * @param {number} ms The duration in milliseconds.
     * @returns {string} Human-readable duration (e.g., "5 days ago", "1 hour ago").
     */
    function formatTimeAgo(ms) {
        if (ms < 0) return 'in the future';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.4375);
        const years = Math.floor(days / 365.25);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }

    /**
     * Calculates the change in item count and formats it for display.
     * @param {Object} displayData The report's data for the current filter mode.
     * @returns {string} Formatted change string (e.g., "▲ +5 (2.5%) since 3 days ago").
     */
    function getChangeIndicator(displayData) {
        if (displayData.unsupported) {
             return '<span class="report-change-indicator" style="color: red;">(Unsupported Filter)</span>';
        }
        if (!displayData.history || displayData.history.length < 1) {
            return '<span class="report-change-indicator" style="color: grey;">(No History)</span>';
        }

        const currentEntry = displayData.history[displayData.history.length - 1];
        if (currentEntry.itemCount === -1) {
             return '<span class="report-change-indicator" style="color: grey;">(Unknown Count)</span>';
        }

        let previousEntry = null;
        for (let i = displayData.history.length - 2; i >= 0; i--) {
            if (displayData.history[i].mbGeneratedTimestamp !== currentEntry.mbGeneratedTimestamp && displayData.history[i].itemCount !== -1) {
                previousEntry = displayData.history[i];
                break;
            }
        }

        if (!previousEntry) {
            return `<span class="report-change-indicator" style="color: grey;">(New: ${currentEntry.itemCount} items)</span>`;
        }

        const change = currentEntry.itemCount - previousEntry.itemCount;
        let percentageChange = null;
        if (previousEntry.itemCount !== 0) {
            percentageChange = (change / previousEntry.itemCount) * 100;
        }

        let arrow = '↔';
        let color = 'grey';
        if (change > 0) {
            arrow = '▲';
            color = 'red';
        } else if (change < 0) {
            arrow = '▼';
            color = 'green';
        }

        const changeText = `${arrow} ${change > 0 ? '+' : ''}${change}`;
        const percentageText = percentageChange !== null ? ` (${percentageChange.toFixed(1)}%)` : '';

        let periodText = '';
        if (currentEntry.mbGeneratedTimestamp && previousEntry.mbGeneratedTimestamp) {
            const timeDiff = Math.abs(currentEntry.mbGeneratedTimestamp - previousEntry.mbGeneratedTimestamp);
            periodText = ` (${formatTimeAgo(timeDiff)})`;
        } else if (currentEntry.lastFetchedTimestamp && previousEntry.lastFetchedTimestamp) {
             const timeDiff = Math.abs(currentEntry.lastFetchedTimestamp - previousEntry.lastFetchedTimestamp);
            periodText = ` (fetched ${formatTimeAgo(timeDiff)} apart)`;
        }

        return `<span class="report-change-indicator" style="color: ${color};">${changeText}${percentageText}${periodText}</span>`;
    }

    /**
     * Determines the current filter mode from the URL's 'filter' parameter.
     * @returns {string} 'all' or 'subscribed'.
     */
    function getFilterModeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('filter') === '1' ? 'subscribed' : 'all';
    }

    /**
     * Toggles the filter mode in the URL and reloads the page.
     */
    function toggleFilterModeAndReload() {
        const url = new URL(window.location.href);
        if (currentFilterMode === 'all') {
            url.searchParams.set('filter', '1');
            log("Toggling filter to 'subscribed' mode. Reloading page...");
        } else {
            url.searchParams.delete('filter');
            log("Toggling filter to 'all' mode. Reloading page...");
        }
        window.location.href = url.toString();
    }

    /**
     * Displays the current filter mode next to the H1 element and makes it clickable.
     */
    function displayFilterModeOnPage() {
        const h1 = document.querySelector('#content h1');
        if (h1) {
            let filterSpan = h1.querySelector('.mb-report-filter-mode-indicator');
            if (!filterSpan) {
                filterSpan = document.createElement('span');
                filterSpan.classList.add('mb-report-filter-mode-indicator');
                Object.assign(filterSpan.style, {
                    fontSize: '0.8em',
                    fontWeight: 'normal',
                    marginLeft: '10px',
                    color: '#555',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                });
                filterSpan.setAttribute('tabindex', '0');
                filterSpan.setAttribute('role', 'button');

                filterSpan.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleFilterModeAndReload();
                    }
                });

                filterSpan.addEventListener('click', toggleFilterModeAndReload);
                h1.appendChild(filterSpan);
            }
            filterSpan.textContent = `(Showing: ${currentFilterMode.charAt(0).toUpperCase() + currentFilterMode.slice(1)})`;
        }
    }


    /**
     * Main execution function to scan, manage cache, and process reports.
     */
    async function init() {
        createProgressBar();

        currentFilterMode = getFilterModeFromUrl();
        log(`Current filter mode: ${currentFilterMode}.`);

        const currentReportLinks = Array.from(document.querySelectorAll('#content ul li a[href*="/report/"]'));
        if (currentReportLinks.length === 0) {
            log('No report links found on this page.');
            hideProgressBar();
            return;
        }

        let parsedCache = {};
        let newReportCache = {};
        let currentCacheVersion = null;
        let currentScriptVersionInCache = null;
        let forceAllFetchesDueToStructureChange = false;

        try {
            const cachedData = localStorage.getItem(CENTRAL_CACHE_KEY);
            if (cachedData) {
                parsedCache = JSON.parse(cachedData);
                currentCacheVersion = parsedCache.cache_version;
                currentScriptVersionInCache = parsedCache.script_version;
                log(`Cache loaded (Cache version ${currentCacheVersion || 'none'}, Script version ${currentScriptVersionInCache || 'none'}).`);

                if (currentCacheVersion === CURRENT_CACHE_VERSION) {
                    newReportCache = parsedCache.reports || {};
                } else {
                    log(`Cache mismatch (version ${CURRENT_CACHE_VERSION} vs version ${currentCacheVersion || 'none'}). Initiating full migration and refresh.`);
                    newReportCache = {};

                    // --- Migration logic to populate newReportCache from previous centralized versions ---
                    // Migrate from version 1.5 to 2.0 (nesting under 'all')
                    if (parsedCache.reports && currentCacheVersion === '1.5') {
                        log(`Migrating cache from version ${currentCacheVersion} to version ${CURRENT_CACHE_VERSION} (nesting under 'all').`);
                        for (const reportName in parsedCache.reports) {
                            newReportCache[reportName] = {
                                all: parsedCache.reports[reportName]
                            };
                        }
                    }

                    forceAllFetchesDueToStructureChange = true;
                }
            } else {
                log("No centralized cache found. All reports will be fetched.");
                newReportCache = {};
                forceAllFetchesDueToStructureChange = true;
            }
        } catch (e) {
            error("Cache error. Fetching all reports as fallback:", e);
            newReportCache = {};
            forceAllFetchesDueToStructureChange = true;
        }

        const linksToFetch = [];

        const todayMidnightUTC = getTodayMidnightUTC();

        // Phase 1: Identify reports that need fetching or hiding based on cache
        for (const link of currentReportLinks) {
            const reportName = getReportName(link.href);
            let fullReportUrl = link.href;

            const originalUrlObj = new URL(fullReportUrl);
            if (currentFilterMode === 'subscribed') {
                originalUrlObj.searchParams.set('filter', '1');
                fullReportUrl = originalUrlObj.toString();
                link.href = fullReportUrl;
            } else {
                if (originalUrlObj.searchParams.has('filter')) {
                    originalUrlObj.searchParams.delete('filter');
                    fullReportUrl = originalUrlObj.toString();
                    link.href = fullReportUrl;
                }
            }

            const cachedReportEntry = newReportCache[reportName]?.[currentFilterMode];
            const parentLi = link.closest('li');

            let needsFetch = false;
            let debugReason = "No cache entry";

            if (cachedReportEntry && cachedReportEntry.unsupported) {
                needsFetch = false;
                debugReason = "Filter explicitly marked as unsupported.";
                log(`Skipping fetch for ${reportName} (${currentFilterMode} mode). Reason: ${debugReason}`);
            } else if (forceAllFetchesDueToStructureChange) {
                needsFetch = true;
                debugReason = `Cache version updated (forced full refresh for ${currentFilterMode} mode).`;
            } else {
                if (!cachedReportEntry || !cachedReportEntry.lastFetchedTimestamp || (Date.now() - cachedReportEntry.lastFetchedTimestamp >= INTERNAL_CACHE_DURATION)) {
                    let latestMbGeneratedTimestamp = null;
                    if (cachedReportEntry && cachedReportEntry.history && cachedReportEntry.history.length > 0) {
                        latestMbGeneratedTimestamp = cachedReportEntry.history[cachedReportEntry.history.length - 1].mbGeneratedTimestamp;
                    }

                    if (!latestMbGeneratedTimestamp || latestMbGeneratedTimestamp < todayMidnightUTC) {
                        needsFetch = true;
                        debugReason = latestMbGeneratedTimestamp ? "Data older than today's 00:00 UTC." : `New data for ${currentFilterMode} mode (or no MB timestamp in cache).`;
                    } else {
                        debugReason = `MB data for ${currentFilterMode} mode is already cached for today.`;
                    }
                } else {
                    debugReason = `Recently fetched in this session for ${currentFilterMode} mode.`;
                }
            }

            if (needsFetch) {
                linksToFetch.push({ link, parentLi, fullReportUrl, reportName });
                log(`Preparing to fetch ${reportName} (${currentFilterMode} mode). Reason: ${debugReason}`);
            }

            if (parentLi) {
                const displayData = newReportCache[reportName]?.[currentFilterMode] || { history: [] };
                const latestItemCount = displayData.history && displayData.history.length > 0 ?
                                        displayData.history[displayData.history.length - 1].itemCount : -1;

                if (displayData.unsupported && currentFilterMode === 'subscribed') {
                    parentLi.style.display = 'none';
                    log(`Hidden: ${reportName} (filter not supported).`);
                } else if (latestItemCount === 0) {
                    parentLi.style.display = 'none';
                    log(`Hidden: ${reportName} (0 items).`);
                } else {
                    parentLi.style.display = '';
                    if (latestItemCount === -1) {
                         log(`Visible: ${reportName} (item count unknown).`);
                    } else {
                         log(`Visible: ${reportName} (${latestItemCount} items).`);
                    }
                }

                const existingIndicator = parentLi.querySelector('.report-change-indicator');
                if (existingIndicator) {
                    existingIndicator.remove();
                }

                const changeIndicatorHtml = getChangeIndicator(displayData);
                const indicatorSpan = document.createElement('span');
                indicatorSpan.innerHTML = ` ${changeIndicatorHtml}`;
                link.parentNode.insertBefore(indicatorSpan, link.nextSibling);
            }
        }

        totalLinksToFetch = linksToFetch.length;

        if (totalLinksToFetch === 0) {
            log('All reports for current mode cached. No fetches needed.');
            hideProgressBar();
            localStorage.setItem(CENTRAL_CACHE_KEY, JSON.stringify({
                script_version: currentScriptVersion,
                cache_version: CURRENT_CACHE_VERSION,
                reports: newReportCache
            }));
            displayFilterModeOnPage();
            return;
        }

        showProgressBar();

        // Phase 2: Fetch and process reports that need updating
        for (const { link, parentLi, fullReportUrl, reportName } of linksToFetch) {
            try {
                log(`Fetching ${reportName} (URL: ${fullReportUrl})...`);
                const htmlContent = await fetchUrlContent(fullReportUrl);
                const { itemCount, mbGeneratedTimestamp } = extractReportData(htmlContent);

                if (!newReportCache[reportName]) {
                    newReportCache[reportName] = {};
                }
                if (!newReportCache[reportName][currentFilterMode]) {
                    newReportCache[reportName][currentFilterMode] = { history: [] };
                }
                newReportCache[reportName][currentFilterMode].unsupported = false;

                let currentReportEntry = newReportCache[reportName][currentFilterMode];

                if (mbGeneratedTimestamp !== null) {
                    const lastHistoryEntry = currentReportEntry.history[currentReportEntry.history.length - 1];
                    if (!lastHistoryEntry || lastHistoryEntry.mbGeneratedTimestamp !== mbGeneratedTimestamp) {
                        currentReportEntry.history.push({ mbGeneratedTimestamp, itemCount });
                    } else {
                        lastHistoryEntry.itemCount = itemCount;
                    }
                    currentReportEntry.history = currentReportEntry.history.slice(Math.max(currentReportEntry.history.length - HISTORY_MAX_DAYS, 0));
                }

                currentReportEntry.lastFetchedTimestamp = Date.now();
                newReportCache[reportName][currentFilterMode] = currentReportEntry;

                if (itemCount === 0) {
                    if (parentLi) parentLi.style.display = 'none';
                    log(`Fetched & hidden: ${reportName} (${itemCount} items, ${currentFilterMode} mode).`);
                } else {
                    if (parentLi) parentLi.style.display = '';
                    log(`Fetched & visible: ${reportName} (${itemCount} items, ${currentFilterMode} mode).`);
                }

                if (parentLi) {
                    const existingIndicator = parentLi.querySelector('.report-change-indicator');
                    if (existingIndicator) {
                        existingIndicator.remove();
                    }
                    const changeIndicatorHtml = getChangeIndicator(currentReportEntry);
                    const indicatorSpan = document.createElement('span');
                    indicatorSpan.innerHTML = ` ${changeIndicatorHtml}`;
                    link.parentNode.insertBefore(indicatorSpan, link.nextSibling);
                }

            } catch (e) {
                const isUnsupportedFilterError = e.status === 500 &&
                                                 currentFilterMode === 'subscribed' &&
                                                 e.responseText &&
                                                 e.responseText.includes("This report does not support filtering");

                if (isUnsupportedFilterError) {
                    log(`Filter unsupported for ${reportName}. Hiding.`);
                    if (!newReportCache[reportName]) {
                        newReportCache[reportName] = {};
                    }
                    if (!newReportCache[reportName][currentFilterMode]) {
                        newReportCache[reportName][currentFilterMode] = { history: [] };
                    }
                    newReportCache[reportName][currentFilterMode].unsupported = true;
                    newReportCache[reportName][currentFilterMode].lastFetchedTimestamp = Date.now();

                    if (parentLi) {
                        parentLi.style.display = 'none';
                        const existingIndicator = parentLi.querySelector('.report-change-indicator');
                        if (existingIndicator) {
                            existingIndicator.remove();
                        }
                        const indicatorSpan = document.createElement('span');
                        indicatorSpan.innerHTML = ` <span class="report-change-indicator" style="color: red;">(Unsupported Filter)</span>`;
                        link.parentNode.insertBefore(indicatorSpan, link.nextSibling);
                    }
                } else {
                    error(`Failed processing ${reportName} (${currentFilterMode} mode). Status: ${e.status || 'N/A'}. Message: ${e.message || e}`);
                }
            } finally {
                fetchedLinksCount++;
                updateProgressBar();
                if (fetchedLinksCount < totalLinksToFetch) {
                    await sleep(REQUEST_DELAY);
                }
            }
        }

        try {
            localStorage.setItem(CENTRAL_CACHE_KEY, JSON.stringify({
                script_version: currentScriptVersion,
                cache_version: CURRENT_CACHE_VERSION,
                reports: newReportCache
            }));
            log("Cache updated in localStorage.");
        } catch (e) {
            error("Error saving cache to localStorage:", e);
        }

        progressBar.style.width = '100%';
        setTimeout(() => {
            hideProgressBar();
            displayFilterModeOnPage();
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
