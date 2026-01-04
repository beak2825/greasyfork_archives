// ==UserScript==
// @name         Directors Last Action
// @namespace    https://www.torn.com/
// @version      3.7
// @description  Highlight company directors and display their last action.
// @author       GFOUR [3498427]
// @match        https://www.torn.com/joblist.php*
// @run-at       document-end
// @license      Apache License 2.0
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/542858/Directors%20Last%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/542858/Directors%20Last%20Action.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration (API key is stored dynamically)
    const API_KEY_STORAGE_KEY = 'torn_director_api_key';

    // Function to get the API key (from storage)
    function getApiKey() {
        return GM_getValue(API_KEY_STORAGE_KEY, '');
    }

    // Function to set the API key via GM menu prompt
    function setApiKey() {
        const currentKey = getApiKey();
        const newKey = prompt('Enter your Torn API key (or "###PDA-APIKEY###" for TORN-PDA):', currentKey);
        if (newKey !== null && newKey.trim() !== '') {
            GM_setValue(API_KEY_STORAGE_KEY, newKey.trim());
            console.log('API key updated! Refreshing directors.');
            processDirectors(); // Refresh immediately without reload
        }
    }

    // Register menu command for easy access
    GM_registerMenuCommand('Set Torn API Key', setApiKey);

    // Get the API key
    const API_KEY = getApiKey();

    // If no key is set, log warning and exit
    if (!API_KEY.trim()) {
        console.warn('Director Last Action Script: No API key set. Use the script menu (e.g., Tampermonkey icon > Set Torn API Key) to configure it. Processing skipped.');
        return;
    }

    // Rest of the configuration
    const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in ms (cache expiration)
    const REFRESH_INTERVAL = 60 * 1000; // 60 seconds for background refresh
    const DEBOUNCE_TIME = 500; // ms to debounce MutationObserver triggers
    const BATCH_SIZE = 25; // Fetch in batches of 20 to avoid rate limits (adjust if needed)
    const BATCH_DELAY = 1000; // 1 second delay between batches

    // Cache: Map of directorID => { lastAction: string, timestamp: number, activityLevel: 'active'|'moderate'|'inactive'|'unknown' }
    const cache = new Map();
    const processing = new Set(); // To prevent concurrent fetches for the same ID

    // Menu command to clear cache
    GM_registerMenuCommand('Clear Cache (Force Refresh)', () => {
        cache.clear();
        console.log('Cache cleared! Refreshing directors.');
        processDirectors();
    });

    // Possible activity levels for class removal
    const activityLevels = ['active', 'moderate', 'inactive', 'unknown'];

    // Inject CSS for highlighting (only on the timestamp span)
    const style = document.createElement('style');
    style.textContent = `
        .director-last-action {
            font-size: 0.9em;
            margin-left: 5px;
            padding: 1px 3px;
            border-radius: 3px;
            font-weight: normal;
        }
        .director-last-action.active {
            color: #28a745;
        }
        .director-last-action.moderate {
            color: #d39e00;
        }
        .director-last-action.inactive {
            color: #c82333;
        }
        .director-last-action.unknown {
            color: #6c757d;
        }
    `;
    document.head.appendChild(style);

    // Helper: Parse relative time to minutes ago (approximate)
    function parseRelativeToMinutes(relative) {
        if (!relative || relative === 'Unknown' || relative === 'Error') return Infinity;
        const match = relative.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/);
        if (!match) return Infinity;
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 'second': return value / 60;
            case 'minute': return value;
            case 'hour': return value * 60;
            case 'day': return value * 1440;
            case 'week': return value * 10080;
            case 'month': return value * 43200;
            case 'year': return value * 525600;
            default: return Infinity;
        }
    }

    // Helper: Get activity level based on minutes ago
    function getActivityLevel(minutesAgo) {
        if (minutesAgo < 24 * 60) return 'active';
        if (minutesAgo < 3 * 24 * 60) return 'moderate';
        return 'inactive';
    }

    // Fetch last action for multiple IDs concurrently, with batching to avoid rate limits
    async function fetchLastActions(ids) {
        const results = [];
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const batch = ids.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(async (id) => {
                // Check cache first
                const cached = cache.get(id);
                if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                    return { id, ...cached };
                }

                try {
                    const response = await fetch(`https://api.torn.com/user/${id}?key=${API_KEY}&selections=profile`);
                    if (!response.ok) throw new Error(`API error: ${response.status}`);
                    const data = await response.json();
                    console.log(`API response for ID ${id}:`, data.last_action); // Debug log
                    const lastAction = data.last_action?.relative || 'Unknown';
                    const minutesAgo = parseRelativeToMinutes(lastAction);
                    const activityLevel = (lastAction === 'Unknown' || lastAction === 'Error') ? 'unknown' : getActivityLevel(minutesAgo);

                    // Cache successful responses only (skip if 'Unknown' to allow retry)
                    if (lastAction !== 'Unknown' && lastAction !== 'Error') {
                        cache.set(id, { lastAction, timestamp: Date.now(), activityLevel });
                    }

                    return { id, lastAction, activityLevel };
                } catch (error) {
                    console.error(`Failed to fetch data for director ID ${id}:`, error);
                    // Don't cache errors - allow retry next time
                    return { id, lastAction: 'Error', activityLevel: 'unknown' };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Delay between batches to avoid rate limits
            if (i + BATCH_SIZE < ids.length) {
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
        }
        return results;
    }

    // Process directors in the list
    async function processDirectors() {
        const companiesList = document.querySelectorAll('.company-list .item');
        const directorsToFetch = new Set(); // Unique IDs to fetch
        const elementsMap = new Map(); // ID => { link: element, directorElement: element }

        companiesList.forEach(company => {
            const directorElement = company.querySelector('.director');
            if (!directorElement) return;

            const directorLink = directorElement.querySelector('a');
            if (!directorLink) return;

            // Extract ID
            const directorID = directorLink.href.split('XID=')[1];
            if (!directorID) return;

            // Skip if being processed or if already has fresh data
            if (processing.has(directorID)) return;
            const existingSpan = directorLink.querySelector('.director-last-action');
            const existingData = directorLink.getAttribute('data-last-action');
            const cached = cache.get(directorID);
            if (existingSpan && cached && cached.lastAction === existingData && Date.now() - cached.timestamp < CACHE_TTL) {
                return; // Skip if fresh
            }

            directorsToFetch.add(directorID);
            elementsMap.set(directorID, { link: directorLink, directorElement });
        });

        if (directorsToFetch.size === 0) return;

        // Mark as processing
        directorsToFetch.forEach(id => processing.add(id));

        // Fetch and update
        const results = await fetchLastActions(Array.from(directorsToFetch));
        results.forEach(({ id, lastAction, activityLevel }) => {
            const { link } = elementsMap.get(id);
            if (!link) return;

            // Skip UI update for 'Unknown' or 'Error' (hides them to reduce clutter)
            if (lastAction === 'Unknown' || lastAction === 'Error') {
                // Optional: Uncomment next line to display ": Unknown" anyway
                // lastAction = 'Unknown';
                processing.delete(id);
                return;
            }

            // Find or create the timestamp span (prevention: check again)
            let timestampSpan = link.querySelector('.director-last-action');
            if (!timestampSpan) {
                timestampSpan = document.createElement('span');
                timestampSpan.classList.add('director-last-action');
                link.appendChild(timestampSpan);
            }

            // Update text and class
            timestampSpan.textContent = `: ${lastAction}`;
            // Remove old activity classes
            activityLevels.forEach(level => timestampSpan.classList.remove(level));
            timestampSpan.classList.add(activityLevel);

            // Mark as processed/updated
            link.setAttribute('data-last-action', lastAction);

            // Done processing
            processing.delete(id);
        });
    }

    // Debounce function to prevent rapid calls
    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    // Set up MutationObserver to watch for dynamic changes
    const observer = new MutationObserver(debounce(() => processDirectors(), DEBOUNCE_TIME));
    const targetNode = document.querySelector('.company-list') || document.body; // Fallback to body if not found
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Initial process
    processDirectors();

    // Background refresh interval (re-processes without clearing cache)
    setInterval(() => {
        processDirectors();
    }, REFRESH_INTERVAL);
})();