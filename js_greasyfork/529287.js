// ==UserScript==
// @name         NitroType Ban Check (NT Leaderboards with Caching)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Check if users are banned or flagged on NT Leaderboards and display their status on Nitro Type pages.
// @match        https://www.nitrotype.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      ntleaderboards.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529287/NitroType%20Ban%20Check%20%28NT%20Leaderboards%20with%20Caching%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529287/NitroType%20Ban%20Check%20%28NT%20Leaderboards%20with%20Caching%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_KEY = 'ntleaderboardsCache';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    const VALID_PAGE_PATTERNS = [
        {
            pattern: "https://www.nitrotype.com/racer/",
            handler: handleRacerPage
        },
        {
            pattern: "https://www.nitrotype.com/team/",
            handler: handleTeamPage
        },
        {
            pattern: "https://www.nitrotype.com/leagues",
            handler: handleLeaguesPage
        },
        {
            pattern: "https://www.nitrotype.com/friends",
            handler: handleFriendsPage
        }
    ];

    function init() {
        console.log("[BAN_CHECK_LOG] - Initializing script and checking page type.");
        const location = window.location.href;
        const validPage = VALID_PAGE_PATTERNS.find(({ pattern }) => location.startsWith(pattern));

        if (validPage) {
            console.log("[BAN_CHECK_LOG] - Valid page detected. Processing...");
            loadCache();
            validPage.handler();
        } else {
            console.log("[BAN_CHECK_LOG] - Invalid page. No action required.");
        }
    }

    // Handle /racer/{username} page
    function handleRacerPage() {
        const username = getUsernameFromUrl();
        if (username) {
            checkAndDisplayStatus(username);
        }
    }

    // Handle /team page
    function handleTeamPage() {
        const usernames = getUsernamesFromTeamPage();
        usernames.forEach(username => checkAndDisplayStatus(username));
    }

    // Handle /leagues page
    function handleLeaguesPage() {
        const usernames = getUsernamesFromLeaguesPage();
        usernames.forEach(username => checkAndDisplayStatus(username));
    }

    // Handle /friends page
    function handleFriendsPage() {
        const usernames = getUsernamesFromFriendsPage();
        usernames.forEach(username => checkAndDisplayStatus(username));
    }

    // Utility to get username from /racer/{username} URL
    function getUsernameFromUrl() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    }

    // Utility to collect usernames from the team page
    function getUsernamesFromTeamPage() {
        const playerNameContainers = document.querySelectorAll('.player-name--container[title]');
        return Array.from(playerNameContainers).map(container => container.title.trim());
    }

    // Utility to collect usernames from the leagues page
    function getUsernamesFromLeaguesPage() {
        const playerNameContainers = document.querySelectorAll('.league-user-container[title]');
        return Array.from(playerNameContainers).map(container => container.title.trim());
    }

    // Utility to collect usernames from the friends page
    function getUsernamesFromFriendsPage() {
        const friendNameContainers = document.querySelectorAll('.friend-name[title]');
        return Array.from(friendNameContainers).map(container => container.title.trim());
    }

    // Check the status and display it on the page
    function checkAndDisplayStatus(username) {
        const cachedData = getCachedData(username);
        if (cachedData) {
            console.log(`[BAN_CHECK_LOG] - Using cached data for ${username}.`);
            updateProfileStatus(username, cachedData.status, cachedData.color);
        } else {
            console.log(`[BAN_CHECK_LOG] - Fetching fresh data for ${username}.`);
            fetchBanStatus(username).then(({ status, color }) => {
                updateCache(username, status, color);
                updateProfileStatus(username, status, color);
            }).catch(error => {
                console.error(`[BAN_CHECK_LOG] - Error fetching status for ${username}:`, error);
            });
        }
    }

    // Fetch ban status from NT Leaderboards
    function fetchBanStatus(username) {
        const url = `https://ntleaderboards.com/is_user_banned/${username}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = response.responseText;
                        let status, color;

                        if (data === "N") {
                            status = "Legit";
                            color = "rgb(0, 255, 0)"; // Green
                        } else if (data.includes("flag")) {
                            status = "Banned (Flagged)";
                            color = "rgb(255, 0, 0)"; // Red
                        } else {
                            status = "Banned";
                            color = "rgb(255, 165, 0)"; // Orange
                        }
                        resolve({ status, color });
                    } else {
                        reject(`Failed to fetch ban status: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('Error fetching ban status: ' + error);
                }
            });
        });
    }

    // Cache management functions
    function updateCache(username, status, color) {
        const cache = GM_getValue(CACHE_KEY, {});
        cache[username] = { status, color, timestamp: Date.now() };
        GM_setValue(CACHE_KEY, cache);
    }

    function getCachedData(username) {
        const cache = GM_getValue(CACHE_KEY, {});
        const userData = cache[username];
        if (userData && (Date.now() - userData.timestamp < CACHE_DURATION)) {
            return userData;
        }
        return null;
    }

    function loadCache() {
        console.log("[BAN_CHECK_LOG] - Cache loaded:", GM_getValue(CACHE_KEY, {}));
    }

    // Update UI with the fetched or cached status
    function updateProfileStatus(username, status, color) {
        const playerNameContainer = document.querySelector(`[title='${username}']`);
        if (playerNameContainer) {
            const statusLabel = document.createElement('span');
            statusLabel.textContent = status;
            statusLabel.style.color = color;
            statusLabel.style.marginLeft = "10px";

            const existingStatusLabel = playerNameContainer.querySelector('.status-label');
            if (existingStatusLabel) {
                existingStatusLabel.remove();
            }

            statusLabel.classList.add('status-label');
            playerNameContainer.appendChild(statusLabel);
        }
    }

    init();
})();
