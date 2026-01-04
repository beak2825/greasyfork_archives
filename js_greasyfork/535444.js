// ==UserScript==
// @name         Torn Crime Chain Bonus Tracker
// @namespace    http://tampermonkey.net/
// @author       kaeru [1769499]
// @version      1.0
// @description  Track crime chain bonus from Torn logs & webpages realtime
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535444/Torn%20Crime%20Chain%20Bonus%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/535444/Torn%20Crime%20Chain%20Bonus%20Tracker.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';

    const API_KEY = ''; // Replace with your Torn API key (Full Access)
    const STORAGE_TS_KEY = 'torn_chain_last_ts';
    const STORAGE_BONUS_KEY = 'torn_chain_last_bonus';
    const STORAGE_RUN_KEY = 'torn_chain_last_run';
    const LOG_LIMIT = 1000;
    const MIN_INTERVAL = 30 * 1000; // 30 seconds

    let lastTimestamp = parseInt(localStorage.getItem(STORAGE_TS_KEY)) || 0;
    let lastBonus = parseFloat(localStorage.getItem(STORAGE_BONUS_KEY)) || 0;

    let lastDomSuccesses = null;
    let lastDomFails = null;
    let lastDomCriticalFails = null;

    let errorMessage = null;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchLogsBackward(toTimestamp) {
        let currentTo = toTimestamp;
        const allLogs = [];

        if (!API_KEY) {
            errorMessage = "No API Key";
            return [];
        }

        while (true) {
            const url = `https://api.torn.com/user/?selections=log&cat=136&to=${currentTo}&key=${API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                console.error(`[CrimeChainBonus] API Error: ${data.error.code} - ${data.error.error}`);
                errorMessage = data.error.error;
                break;
            } else {
                errorMessage = null;
            }

            if (!data || !data.log) break;

            const logs = Object.entries(data.log)
                .map(([ts, entry]) => ({ timestamp: parseInt(ts), ...entry }))
                .sort((a, b) => b.timestamp - a.timestamp);

            if (logs.length === 0) break;

            if (allLogs.length >= LOG_LIMIT) break;

            for (const log of logs) {
                if (log.timestamp <= lastTimestamp) {
                    return allLogs; // Stop fetching if we've reached known timestamp
                }
                if (log.title.toLowerCase().startsWith('crime critical fail')) {
                    return allLogs;
                }
                allLogs.push(log);
                console.log(log);
            }

            currentTo = logs[logs.length - 1].timestamp;

            // Move backward using the oldest timestamp returned
            // Wait 1 second before next request
            await sleep(1000);
        }

        return allLogs;
    }

    function applyLogsIncrementally(baseBonus, logs) {
        let bonus = baseBonus;

        // Process logs from oldest to newest
        for (const log of logs.reverse()) {
            const title = (log.title || '').toLowerCase();

            if (title.startsWith('crime success')) {
                bonus = bonus + 1;
            } else if (title.startsWith('crime fail')) {
                bonus = bonus / 2;
            } else if (title.startsWith('crime critical fail')) {
                bonus = 0;
            }
        }

        return bonus;
    }

    function displayBonus(bonus) {
        const container = document.querySelector('.crimes-app [class*="resultCounts"]');
        if (!container) return;

        let el = container.querySelector('#chain-bonus-display');
        if (!el) {
            el = document.createElement('div');
            el.id = 'chain-bonus-display';
            el.style.fontSize = '12px';

            const label = document.createElement('span');
            label.textContent = 'Crime Chain Bonus ';

            const value = document.createElement('span');
            value.id = 'chain-bonus-value';
            value.style.color = 'rgb(103, 140, 0)';
            if (errorMessage) {
                value.textContent = errorMessage;
            } else {
                value.textContent = bonus.toFixed(2);
            }

            el.appendChild(label);
            el.appendChild(value);
            container.prepend(el); // Insert at the top
        } else {
            const value = el.querySelector('#chain-bonus-value');
            if (errorMessage) {
                value.textContent = errorMessage;
            } else if (value) {
                value.textContent = bonus.toFixed(2);
            } else {
                el.textContent = `Crime Chain Bonus `;
                const span = document.createElement('span');
                span.id = 'chain-bonus-value';
                span.style.color = 'rgb(103, 140, 0)';
                span.textContent = bonus.toFixed(2);
                el.appendChild(span);
            }
        }
    }

    async function updateBonus() {
        const now = Date.now();
        const toTimestamp = Math.floor(now / 1000) + 10;
        const lastRun = parseInt(localStorage.getItem(STORAGE_RUN_KEY)) || 0;

        if (now - lastRun < MIN_INTERVAL) {
            console.log('[CrimeChainBonus] Skipping update (too soon)');
            displayBonus(lastBonus);
            return;
        }

        const newLogs = await fetchLogsBackward(toTimestamp);
        if (newLogs.length === 0) {
            displayBonus(lastBonus);
            return;
        }

        const newTimestamp = newLogs[0].timestamp;
        const newBonus = applyLogsIncrementally(lastBonus, newLogs);

        // Store latest timestamp and bonus
        localStorage.setItem(STORAGE_TS_KEY, newTimestamp);
        localStorage.setItem(STORAGE_BONUS_KEY, newBonus);
        localStorage.setItem(STORAGE_RUN_KEY, now);

        // Update display
        displayBonus(newBonus);

        // Update current state
        lastTimestamp = newTimestamp;
        lastBonus = newBonus;
    }

    function parseCount(str) {
        return parseInt(str.replace(/,/g, ''), 10) || 0;
    }

    function readCrimeCounts() {
        const root = document.querySelector('.crimes-app');
        if (!root) return { success: null, fail: null, critical: null };

        const successEl = root.querySelector('[class*="resultCounts"] [class*="successes"] span');
        const failEl = root.querySelector('[class*="resultCounts"] [class*="fails"] span');
        const criticalEl = root.querySelector('[class*="resultCounts"] [class*="criticalFails"] span');

        const parseOrNull = el => el ? parseCount(el.textContent) : null;

        return {
            successes: parseOrNull(successEl),
            fails: parseOrNull(failEl),
            criticalFails: parseOrNull(criticalEl),
        };
    }

    function handleDomChangeByCounts() {
        const { successes, fails, criticalFails } = readCrimeCounts();

        console.log(`Crime successes: ${successes}`);
        console.log(`Crime fails: ${fails}`);
        console.log(`Crime critialFails: ${criticalFails}`);

        const wasValid =
              lastDomSuccesses !== null &&
              lastDomFails !== null &&
              lastDomCriticalFails !== null;

        const isValid = successes !== null && fails !== null && criticalFails !== null;

        if (!wasValid || !isValid) {
            // Just track values, don't calculate bonus
            lastDomSuccesses = successes;
            lastDomFails = fails;
            lastDomCriticalFails = criticalFails;

            displayBonus(lastBonus);

            return;
        }

        const dSuccess = successes - lastDomSuccesses;
        const dFail = fails - lastDomFails;
        const dCritical = criticalFails - lastDomCriticalFails;

        if (dSuccess <= 0 && dFail <= 0 && dCritical <= 0) return;

        let bonus = lastBonus;

        if (dCritical > 0) {
            bonus = 0;
        } else if (dFail > 0) {
            bonus = Math.floor(bonus / Math.pow(2, dFail));
        }

        if (dSuccess > 0) {
            bonus = bonus + dSuccess;
        }

        lastBonus = bonus;
        displayBonus(bonus);

        lastDomSuccesses = successes;
        lastDomFails = fails;
        lastDomCriticalFails = criticalFails;
    }

    // Initial call
    updateBonus();

    // Observe DOM changes and trigger bonus update
    const observer = new MutationObserver(() => {
        handleDomChangeByCounts();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();