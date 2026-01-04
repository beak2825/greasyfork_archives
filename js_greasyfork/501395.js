// ==UserScript==
// @name         Battle Stats for Bounties
// @namespace    http://tampermonkey.net/
// @version      2024-07-18
// @description  Displays battle stats predictions only for users with "Okay" status
// @author       Allenone
// @match        https://www.torn.com/bounties.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501395/Battle%20Stats%20for%20Bounties.user.js
// @updateURL https://update.greasyfork.org/scripts/501395/Battle%20Stats%20for%20Bounties.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = '';
    const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds
    const MAX_API_CALLS_PER_MINUTE = 10;
    const CALL_INTERVAL = 60 * 1000; // 1 minute in milliseconds
    const UPDATE_DELAY = 500; // 500ms delay for updateTable

    let apiCallCount = 0;
    let apiCallStartTime = Date.now();
    let updatePending = false;
    let updateTimeout;

    const Rank_Triggers = {
        level: [2, 6, 11, 26, 31, 50, 71, 100],
        crimes: [100, 5000, 10000, 20000, 30000, 50000],
        networth: [5000000, 50000000, 500000000, 5000000000, 50000000000],
        stats: ["under 2k", "2k - 25k", "20k - 250k", "200k - 2.5m", "2m - 25m", "20m - 250m", "over 200m"],
        RANKS: {
            "Absolute beginner": 1,
            "Beginner": 2,
            "Inexperienced": 3,
            "Rookie": 4,
            "Novice": 5,
            "Below average": 6,
            "Average": 7,
            "Reasonable": 8,
            "Above average": 9,
            "Competent": 10,
            "Highly competent": 11,
            "Veteran": 12,
            "Distinguished": 13,
            "Highly distinguished": 14,
            "Professional": 15,
            "Star": 16,
            "Master": 17,
            "Outstanding": 18,
            "Celebrity": 19,
            "Supreme": 20,
            "Idolized": 21,
            "Champion": 22,
            "Heroic": 23,
            "Legendary": 24,
            "Elite": 25,
            "Invincible": 26
        }
    };

    function getEstimate(rank, level, totalCrimes, networth) {
        const titles = ["Damage", "Silent", "One", "Bonds", "Hired"];
        const r = rank.split(' ');
        let rankpos = 0;
        if (r.length > 2 && !titles.includes(r[1])) {
            rankpos = Rank_Triggers.RANKS[r[0] + " " + r[1]];
        } else {
            rankpos = Rank_Triggers.RANKS[r[0]];
        }

        const lpos = Rank_Triggers.level.filter(x => x <= level).length;
        const cpos = Rank_Triggers.crimes.filter(x => x <= totalCrimes).length;
        const lnetworth = Rank_Triggers.networth.filter(x => x <= networth).length;
        const score = rankpos - lpos - cpos - lnetworth - 1;

        return score < Rank_Triggers.stats.length ? Rank_Triggers.stats[score] : Rank_Triggers.stats[Rank_Triggers.stats.length - 1];
    }

    async function fetchData(userId) {
        const apiUrl = `https://api.torn.com/user/${userId}?selections=personalstats,crimes,profile&key=${API_KEY}`;
        try {
            const now = Date.now();
            if (now - apiCallStartTime >= CALL_INTERVAL) {
                apiCallCount = 0;
                apiCallStartTime = now;
            }

            if (apiCallCount >= MAX_API_CALLS_PER_MINUTE) {
                return null; // Rate limit reached
            }

            apiCallCount++;
            const response = await fetch(apiUrl);

            if (response.status === 429) {
                console.error('Rate limit exceeded');
                return null;
            }
            if (!response.ok) {
                console.error(`Error fetching data: ${response.status} - ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return null;
        }
    }

    function getCachedData(userId) {
        const cachedData = localStorage.getItem(`battleStats_${userId}`);
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
        localStorage.setItem(`battleStats_${userId}`, JSON.stringify(cacheEntry));
    }

    async function updateTable() {
        if (updatePending) {
            return;
        }
        updatePending = true;

        // Clear previous timeout if it exists
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        // Wait for a while before executing updateTable
        updateTimeout = setTimeout(async () => {
            console.log('Updating table...'); // Debugging line
            document.querySelector('ul.bounties-list-title li.reason').textContent = 'Battle Stats';

            let rows = document.querySelectorAll('ul.bounties-list.t-blue-cont.h > li');
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
                            reasonDiv.textContent = cachedData;
                        } else {
                            reasonDiv.textContent = 'Waiting to call API...';
                            const data = await fetchData(userId);
                            if (data) {
                                const rank = data.rank || 'N/A';
                                const level = data.level || 0;
                                const totalCrimes = data.criminalrecord ? data.criminalrecord.total || 0 : 0;
                                const networth = data.personalstats ? data.personalstats.networth || 0 : 0;

                                const battleStats = getEstimate(rank, level, totalCrimes, networth);
                                setCachedData(userId, battleStats);
                                reasonDiv.textContent = battleStats;
                            } else {
                                reasonDiv.textContent = 'N/A';
                            }
                            await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200ms between requests
                        }

                        // Remove everything within <div class="left action-wrap"></div> and repopulate it
                        let bountyId = row.getAttribute('data-id');
                        actionWrapDiv.innerHTML = ''; // Clear existing content
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
                    } else {
                        reasonDiv.textContent = 'N/A'; // Set 'N/A' for non-"Okay" statuses
                    }
                }
            }

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

    updateTable();

})();
