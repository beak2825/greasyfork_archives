// ==UserScript==
// @license MIT 
// @name         Vast.ai Balance Hours Remaining
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add hours remaining and total spend rate to balance display on Vast.ai + Improved Rate Limiting
// @author       You
// @match        https://cloud.vast.ai/*
// @grant        GM_xmlhttpRequest
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/526324/Vastai%20Balance%20Hours%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/526324/Vastai%20Balance%20Hours%20Remaining.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State variables
    let lastCredit = 0;
    let totalSpendRate = 0;
    let isUpdating = false;
    const UPDATE_INTERVAL = 120000; // 2 minutes between updates
    const RETRY_DELAYS = [30000, 60000, 120000, 300000]; // Progressive retry delays
    let retryAttempt = 0;

    // Throttle function to prevent too frequent updates
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function formatTimeRemaining(hours) {
        if (!isFinite(hours) || isNaN(hours)) return "-- remaining";

        const totalHours = Math.floor(hours);
        const minutes = Math.round((hours - totalHours) * 60);

        if (totalHours === 0) {
            return `${minutes}m remaining`;
        } else if (minutes === 0) {
            return `${totalHours}h remaining`;
        } else {
            return `${totalHours}h ${minutes}m remaining`;
        }
    }

    function updateDisplay() {
        const creditDiv = document.evaluate(
            '/html/body/div[1]/div[1]/header/div[2]/span[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (creditDiv) {
            let hoursDiv = document.getElementById('hours-remaining');
            if (!hoursDiv) {
                hoursDiv = document.createElement('span');
                hoursDiv.id = 'hours-remaining';
                hoursDiv.style.fontSize = '14px';
                hoursDiv.style.marginLeft = '10px';
                creditDiv.after(hoursDiv);
            }

            const hoursRemaining = totalSpendRate > 0 ? lastCredit / totalSpendRate : 0;
            hoursDiv.innerHTML = `<span style="color: green; font-weight: bold">($${totalSpendRate.toFixed(3)}/hr)</span>
                                <span style="color: #66cc66; font-weight: bold">${formatTimeRemaining(hoursRemaining)}</span>`;
        }
    }

    async function fetchWithRetry(url, attempt = 0) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                retryAttempt = 0; // Reset retry attempts on success
                return await response.json();
            }

            if (response.status === 429) {
                const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
                console.warn(`Rate limited. Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWithRetry(url, attempt + 1);
            }

            throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    }

    async function updateData() {
        if (isUpdating) return;
        isUpdating = true;

        try {
            // Fetch user data and instances in sequence
            const userData = await fetchWithRetry('https://cloud.vast.ai/api/v0/users/current/');
            lastCredit = userData.credit;

            const instancesData = await fetchWithRetry('https://cloud.vast.ai/api/v0/instances/');
            totalSpendRate = 0;

            if (instancesData.instances && Array.isArray(instancesData.instances)) {
                instancesData.instances.forEach(instance => {
                    if (instance.search && instance.search.totalHour) {
                        totalSpendRate += instance.search.totalHour;
                    }
                });
            }

            updateDisplay();
        } catch (error) {
            console.error('Failed to update data:', error);
        } finally {
            isUpdating = false;
        }
    }

    // Throttled version of updateData
    const throttledUpdate = throttle(updateData, UPDATE_INTERVAL);

    // Initial update
    updateData();

    // Set up periodic updates
    setInterval(throttledUpdate, UPDATE_INTERVAL);

    // Modified fetch interceptor
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0].toString();

        if ((url.includes('/api/v0/users/current/') || url.includes('/api/v0/instances/'))) {
            throttledUpdate();
        }
        return response;
    };
})();
