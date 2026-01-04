// ==UserScript==
// @name         Battle Stats for Bounties + BSP
// @namespace    http://tampermonkey.net/
// @version      8.3
// @description  Displays battle stats predictions only for users with "Okay" status
// @author       Allenone
// @match        https://www.torn.com/bounties.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/501720/Battle%20Stats%20for%20Bounties%20%2B%20BSP.user.js
// @updateURL https://update.greasyfork.org/scripts/501720/Battle%20Stats%20for%20Bounties%20%2B%20BSP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = '';
    const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds
    const REQUEST_DELAY = 1000; // 1 second delay between requests
    const UPDATE_DELAY = 500; // 500ms delay for updateTable
    const MAX_CONCURRENT_REQUESTS = 5; // Limit the number of concurrent API requests
    const MAX_STAT_LEVEL = 400000000; // Minimum stat level for highlighting

    const CACHE_PREFIX = 'BSFP_'; // Updated cache prefix

    let updatePending = false;
    let updateTimeout;
    let activeRequests = 0;
    let requestQueue = [];

    function formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return 'N/A'; // Ensure num is a valid number
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 't';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'b';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'm';
        return num.toString();
    }

    function clearCache() {
        // Remove all items that start with the cache prefix
        for (let key in localStorage) {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        console.log('Cache cleared.');
    }

    async function fetchData(userId) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: `http://www.lol-manager.com/api/battlestats/${API_KEY}/${userId}/9.1.1`,
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        let battleStat;

                        if (data.Result === 1) {
                            battleStat = (data.TBS_Balanced > 0) ? data.TBS_Balanced : data.TBS_Raw;
                            if (data.Score === -1) {
                                battleStat = data.TBS_Raw;
                            }
                            resolve({ battleStat, reason: data.Reason });
                        } else if (data.Result === 3) {
                            battleStat = data.TBS_Raw;
                            resolve({ battleStat, reason: data.Reason });
                        } else if (data.Result === 5) {
                            battleStat = data.TBS;
                            resolve({ battleStat, reason: data.Reason });
                        } else if (data.Result === 6) {
                            battleStat = data.TBS;
                            resolve({ battleStat, reason: data.Reason });
                        } else {
                            reject(new Error(data.Reason || 'Unknown error'));
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => {
                    reject(err);
                }
            });
        });
    }

    function getCachedData(userId) {
        const cachedData = localStorage.getItem(`${CACHE_PREFIX}${userId}`);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                return data;
            }
        }
        return null;
    }

    function setCachedData(userId, data) {
        const cacheEntry = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(`${CACHE_PREFIX}${userId}`, JSON.stringify(cacheEntry));
    }

    function processQueue() {
        while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
            const { userId, reasonDiv, rowElement } = requestQueue.shift();
            activeRequests++;
            fetchData(userId).then(({ battleStat }) => {
                setCachedData(userId, { battleStat });
                reasonDiv.textContent = formatNumber(battleStat);

                // Change background color if battleStat is below or equal to MAX_STAT_LEVEL
                if (battleStat <= MAX_STAT_LEVEL) {
                    rowElement.style.backgroundColor = 'green';
                }
            }).catch(err => {
                reasonDiv.textContent = 'N/A';
                setCachedData(userId, { battleStat: 'N/A' }); // Cache N/A for errors
                console.error(`Error fetching data for user ${userId}:`, err);
            }).finally(() => {
                activeRequests--;
                processQueue();
            });
        }
    }

    async function updateTable() {
        if (updatePending) {
            return;
        }
        updatePending = true;

        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(async () => {
            document.querySelector('ul.bounties-list-title li.reason').textContent = 'Battle Stats';

            let rows = document.querySelectorAll('ul.bounties-list.t-blue-cont.h > li');
            let domUpdates = [];
            requestQueue = []; // Clear the request queue

            for (let row of rows) {
                let userLink = row.querySelector('div.target a');
                let statusDiv = row.querySelector('div.status span.user-green-status');
                let reasonDiv = row.querySelector('div.reason span');
                let actionWrapDiv = row.querySelector('div.left.action-wrap');

                if (userLink && statusDiv && reasonDiv && actionWrapDiv) {
                    let userId = new URLSearchParams(userLink.href.split('?')[1]).get('XID');
                    let statusText = statusDiv.textContent.trim();

                    if (statusText === 'Okay') {
                        const cachedData = getCachedData(userId);
                        if (cachedData) {
                            reasonDiv.textContent = formatNumber(cachedData.battleStat);
                            if (cachedData.battleStat <= MAX_STAT_LEVEL) {
                                row.style.backgroundColor = 'green';
                            }
                        } else {
                            reasonDiv.textContent = 'Waiting to call API...';
                            requestQueue.push({ userId, reasonDiv, rowElement: row });
                        }

                        let bountyId = row.getAttribute('data-id');
                        domUpdates.push(() => {
                            actionWrapDiv.innerHTML = '';
                            let closeWrapDiv = document.createElement('div');
                            closeWrapDiv.className = 'left close-wrap';
                            let closeButton = document.createElement('button');
                            closeButton.className = 'close-icon m-left5 wai-btn';
                            closeButton.setAttribute('aria-label', 'Close');
                            closeWrapDiv.appendChild(closeButton);

                            let claimLink = document.createElement('a');
                            claimLink.className = 'claim';
                            claimLink.href = `loader.php?sid=attack&user2ID=${userId}&bounty=${bountyId}`;
                            claimLink.textContent = 'Claim';
                            claimLink.setAttribute('i-data', `i_${userId}_${bountyId}`);

                            let clearDiv = document.createElement('div');
                            clearDiv.className = 'clear';

                            actionWrapDiv.appendChild(closeWrapDiv);
                            actionWrapDiv.appendChild(claimLink);
                            actionWrapDiv.appendChild(clearDiv);
                        });
                    } else {
                        reasonDiv.textContent = 'N/A';
                    }
                }
            }

            // Apply all DOM updates in one batch
            domUpdates.forEach(updateFn => updateFn());

            processQueue();
            updatePending = false;
        }, UPDATE_DELAY);
    }

    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                updateTable();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Clear cache on script load (for debugging purposes, you may want to remove this later)
    clearCache();

    updateTable();
})();
