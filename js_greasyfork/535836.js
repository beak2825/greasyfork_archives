// ==UserScript==
// @name         Weav3r Buy-Mug
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Shows battle stats, online status, and potential mug on https://weav3r.dev/
// @author       Allenone [2033011]
// @match        https://weav3r.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/535836/Weav3r%20Buy-Mug.user.js
// @updateURL https://update.greasyfork.org/scripts/535836/Weav3r%20Buy-Mug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL_BASE = '/api/bazaar/item/';
    const Min_Mug_Purchase = 25000000;
    const MAX_STAT_LEVEL = 200000000;
    const CACHE_PREFIX = 'Weav3rBM_'; // Updated cache prefix
    const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds

    // Prompt for API key if not stored
    let API_KEY = GM_getValue('api_key');
    if (!API_KEY) {
        API_KEY = prompt('Please enter your Torn API key (Public Only Access):');
        if (!API_KEY) {
            alert('API key is required for functionality.');
            return;
        }
        GM_setValue('api_key', API_KEY);
    }


    function highlightRowByUserId(userId, attempt = 0) {
        const MAX_ATTEMPTS = 30;
        const INTERVAL = 100;

        const link = document.querySelector(`a[href*="userId=${userId}"]`);
        if (!link) {
            if (attempt < MAX_ATTEMPTS) {
                setTimeout(() => highlightRowByUserId(userId, attempt + 1), INTERVAL);
            } else {
                console.warn(`User ID ${userId} not found after ${MAX_ATTEMPTS} attempts.`);
            }
            return;
        }

        const row = link.closest('tr');
        if (!row) return;

        row.querySelectorAll('*').forEach(el => {
            if (el.classList.contains('dark:bg-gray-800')) {
                el.classList.remove('dark:bg-gray-800');
                el.classList.add('bg-green-600');
            }

            if (el.classList.contains('text-primary')) {
                el.classList.remove('text-primary');
                el.classList.add('text-gray-200');
            }

            if (el.classList.contains('dark:border-gray-600')) {
                el.classList.remove('dark:border-gray-600');
            }
        });
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

    async function OnlineStatus(userId) {
        try {
            const { battleStat } = await fetchData(userId);
            setCachedData(userId, { battleStat });

            if (battleStat <= MAX_STAT_LEVEL) {
                const response = await fetch(`https://api.torn.com/v2/user?key=${API_KEY}&selections=profile&id=${userId}`);
                const data = await response.json();

                if (data.last_action.status === "Offline" && data.status.state !== "Hospital" && data.status.state !== "Traveling") {
                    //console.log(data);
                    return true;
                }
            }

            return false;
        } catch (err) {
            console.error(`Error in OnlineStatus(${userId}):`, err);
            return false;
        }
    }

    // Fetch Interception (natural requests)
    const win = (unsafeWindow || window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (!url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }

        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            for (const bazaar of json) {
                if (Number(bazaar.price) <= (Number(bazaar.market_price)* 0.999)) {
                    if (bazaar.price * bazaar.quantity >= Min_Mug_Purchase) {
                        //console.log(bazaar.player_id);
                        const isOffline = await OnlineStatus(bazaar.player_id);
                        if (isOffline === true) {
                            highlightRowByUserId(bazaar.player_id);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Failed to parse response or process user:', err);
        }
        return response;
    };
})();