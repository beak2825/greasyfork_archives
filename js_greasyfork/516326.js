// ==UserScript==
// @name         add playtime to Steam store pages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds HowLongToBeat completion time to Steam store pages
// @author       taha
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/516326/add%20playtime%20to%20Steam%20store%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/516326/add%20playtime%20to%20Steam%20store%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add Material Icons font and styles
    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=timer";
    document.head.appendChild(styleSheet);

    // Add custom styles
    GM_addStyle(`
        .material-symbols-outlined {
            font-size: 24px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .timer-icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
        }
    `);

    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const RATE_LIMIT = 100; // milliseconds between requests
    let lastRequestTime = 0;

    function extractGameName() {
        const path = window.location.pathname;
        const match = path.match(/\/app\/\d+\/([^/]+)/);
        if (match) {
            return decodeURIComponent(match[1].replace(/_/g, ' '));
        }
        return null;
    }

    function basicCleanGameName(name) {
        // Remove content within parentheses and brackets
        let cleaned = name.replace(/[\(\[\{].*?[\)\]\}]/g, '');

        // Remove trademark and copyright symbols
        cleaned = cleaned.replace(/[™®©]/g, '');

        // Remove special characters and extra spaces
        cleaned = cleaned.replace(/[:\-_]/g, ' ').replace(/\s+/g, ' ').trim();

        return cleaned;
    }

    function getCachedTime(gameName) {
        const cached = GM_getValue(gameName);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }
        return null;
    }

    function setCachedTime(gameName, data) {
        GM_setValue(gameName, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    }

    async function searchGame(gameName) {
        const url = 'https://howlongtobeat.com/api/search/5356b6994c0cc3eb';
        const headers = {
            'Host': 'howlongtobeat.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Origin': 'https://howlongtobeat.com',
            'Referer': 'https://howlongtobeat.com/'
        };

        const requestData = {
            searchType: "games",
            searchTerms: gameName.split(' '),
            searchPage: 1,
            size: 20,
            searchOptions: {
                games: {
                    userId: 0,
                    platform: "",
                    sortCategory: "popular",
                    rangeCategory: "main",
                    rangeTime: { min: null, max: null },
                    gameplay: { perspective: "", flow: "", genre: "" },
                    rangeYear: { min: "", max: "" },
                    modifier: ""
                },
                users: { sortCategory: "postcount" },
                lists: { sortCategory: "follows" },
                filter: "",
                sort: 0,
                randomizer: 0
            }
        };

        // Rate limiting
        const now = Date.now();
        const timeToWait = Math.max(0, RATE_LIMIT - (now - lastRequestTime));
        if (timeToWait > 0) {
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        }
        lastRequestTime = Date.now();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: headers,
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.data && data.data.length > 0) {
                            resolve(data.data[0]);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    async function searchGameWithFallback(originalName) {
        let searchName = basicCleanGameName(originalName);
        let words = searchName.split(' ');
        let results = null;

        while (words.length > 0 && !results) {
            const currentSearch = words.join(' ');
            results = await searchGame(currentSearch);
            if (!results) {
                words.pop();
            }
        }

        return results;
    }

    function formatTime(hours) {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return wholeHours > 0 ? `${wholeHours}h ${minutes}m` : `${minutes}m`;
    }

    async function addHLTBInfo() {
        const gameName = extractGameName();
        if (!gameName) return;

        // Check cache first
        const cachedData = getCachedTime(gameName);
        if (cachedData) {
            createHLTBElement(cachedData.time, cachedData.link);
            return;
        }

        try {
            const gameData = await searchGameWithFallback(gameName);
            if (gameData) {
                const mainTime = gameData.comp_main / 3600;
                const gameLink = `https://howlongtobeat.com/game/${gameData.game_id}`;

                setCachedTime(gameName, {
                    time: mainTime,
                    link: gameLink
                });

                createHLTBElement(mainTime, gameLink);
            }
        } catch (error) {
            console.error('Failed to fetch game time:', error);
        }
    }

    function createHLTBElement(time, hltbLink) {
        const originalContainer = document.querySelector('a.game_area_details_specs_ctn[href*="category2=2"]');
        if (!originalContainer) return;

        const clonedContainer = originalContainer.cloneNode(true);
        clonedContainer.href = hltbLink;
        clonedContainer.classList.add('cloned-container');
        clonedContainer.querySelector('.label').textContent = formatTime(time);

        const iconDiv = clonedContainer.querySelector('.icon');
        iconDiv.innerHTML = `
            <div class="timer-icon-container">
                <span class="material-symbols-outlined">timer</span>
            </div>
        `;

        originalContainer.parentNode.insertBefore(clonedContainer, originalContainer.nextSibling);
    }

    // Run the script when the page loads
    window.addEventListener('load', addHLTBInfo);
})();