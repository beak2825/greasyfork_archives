

    // ==UserScript==
    // @name         Add Play Time to Steamdb search
    // @namespace    http://tampermonkey.net/
    // @version      0.3
    // @description  Add play time from howlongtobeat.com to Steamdb game row when you search with tags, sales or viewing your own library
    // @author       Taha
    // @match        https://steamdb.info/tag/*
    // @match        https://steamdb.info/sales/*
    // @grant        GM_xmlhttpRequest
    // @grant        GM_addStyle
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516185/Add%20Play%20Time%20to%20Steamdb%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/516185/Add%20Play%20Time%20to%20Steamdb%20search.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // playtime column styles
        GM_addStyle(`
            .playtime-cell {
                text-align: right;
                padding-right: 10px !important;
            }
            .playtime-cell a {
                color: inherit;
                text-decoration: none;
            }
            .playtime-cell a:hover {
                text-decoration: underline;
            }
            .playtime-loading {
                opacity: 0.5;
            }
            th[data-name="playtime"] {
                cursor: pointer;
            }
        `);

        const CACHE_DURATION = 24 * 60 * 60 * 1000;
        const RATE_LIMIT = 100;
        let lastRequestTime = 0;
        let processedGames = new Set(); // Track which games we've already processed

        function basicCleanGameName(name) {
            // Remove content within parentheses and brackets
            let cleaned = name.replace(/[\(\[\{].*?[\)\]\}]/g, '');

            // Remove trademark and copyright symbols
            cleaned = cleaned.replace(/[™®©]/g, '');

            // Remove special characters and extra spaces
            cleaned = cleaned.replace(/[:\-_]/g, ' ').replace(/\s+/g, ' ').trim();

            return cleaned;
        }

        async function searchGameWithFallback(originalName, loadingCell) {
            // First do a basic cleaning
            let searchName = basicCleanGameName(originalName);
            let words = searchName.split(' ');
            let results = null;

            // Try different variations of the name, starting with the full name
            // and removing one word from the end each time
            while (words.length > 0 && !results) {
                const currentSearch = words.join(' ');
    //            console.log(`Trying search with: "${currentSearch}"`);

                results = await searchGame(currentSearch);

                if (!results) {
                    words.pop(); // Remove the last word and try again
                }
            }

            return results;
        }

        async function searchGame(gameName) {
            const url = 'https://howlongtobeat.com/api/search/5356b6994c0cc3eb';
            const headers = {
                'Host': 'howlongtobeat.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Referer': 'https://howlongtobeat.com/?q=',
                'Content-Type': 'application/json',
                'Origin': 'https://howlongtobeat.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Priority': 'u=4',
                'TE': 'trailers'
            };

            const requestData = {
                "searchType": "games",
                "searchTerms": gameName.split(' '),
                "searchPage": 1,
                "size": 20,
                "searchOptions": {
                    "games": {
                        "userId": 0,
                        "platform": "",
                        "sortCategory": "popular",
                        "rangeCategory": "main",
                        "rangeTime": { "min": null, "max": null },
                        "gameplay": { "perspective": "", "flow": "", "genre": "" },
                        "rangeYear": { "min": "", "max": "" },
                        "modifier": ""
                    },
                    "users": { "sortCategory": "postcount" },
                    "lists": { "sortCategory": "follows" },
                    "filter": "",
                    "sort": 0,
                    "randomizer": 0
                },
                "useCache": true
            };

            // Wait for rate limiting
            const now = Date.now();
            const timeToWait = Math.max(0, RATE_LIMIT - (now - lastRequestTime));
            if (timeToWait > 0) {
                await new Promise(resolve => setTimeout(resolve, timeToWait));
            }
            lastRequestTime = Date.now();

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: url,
                        headers: headers,
                        data: JSON.stringify(requestData),
                        onload: resolve,
                        onerror: reject
                    });
                });

                const data = JSON.parse(response.responseText);
                if (data.data && data.data.length > 0) {
                    return data.data[0];
                }
            } catch (error) {
                console.error('Error searching for game:', error);
            }

            return null;
        }

        function addPlaytimeHeader() {
            if (!document.querySelector('th[data-name="playtime"]')) {
                const headerRow = document.querySelector('thead tr');
                if (headerRow) {
                    const playtimeHeader = document.createElement('th');
                    playtimeHeader.setAttribute('data-name', 'playtime');
                    playtimeHeader.classList.add('dt-type-numeric');
                    playtimeHeader.textContent = 'Playtime';
                    playtimeHeader.setAttribute('data-sort-direction', 'none');
                    playtimeHeader.addEventListener('click', handleSort);

                    const nameColumn = headerRow.querySelector('[data-name="name"]');
                    if (nameColumn && nameColumn.nextSibling) {
                        headerRow.insertBefore(playtimeHeader, nameColumn.nextSibling);
                    }
                }
            }
        }

        function handleSort(event) {
            const header = event.target;
            const table = document.querySelector('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr.app'));

            const currentDirection = header.getAttribute('data-sort-direction');
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            header.setAttribute('data-sort-direction', newDirection);

            rows.sort((a, b) => {
                const timeA = getPlaytimeValue(a);
                const timeB = getPlaytimeValue(b);

                if (isNaN(timeA) && isNaN(timeB)) return 0;
                if (isNaN(timeA)) return 1;
                if (isNaN(timeB)) return -1;

                return newDirection === 'asc' ? timeA - timeB : timeB - timeA;
            });

            rows.forEach(row => tbody.appendChild(row));
        }

        function getPlaytimeValue(row) {
            const cell = row.querySelector('.playtime-cell a');
            if (!cell) return NaN;

            const text = cell.textContent;
            let totalMinutes = 0;

            // Extract hours and minutes if they exist
            const hoursMatch = text.match(/(\d+)h/);
            const minutesMatch = text.match(/(\d+)m/);

            // Convert hours to minutes
            if (hoursMatch) {
                totalMinutes += parseInt(hoursMatch[1], 10) * 60;
            }

            // Add remaining minutes
            if (minutesMatch) {
                totalMinutes += parseInt(minutesMatch[1], 10);
            }

            return totalMinutes;
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

        async function fetchGameTime(originalGameName, gameRow) {
            // Skip if we've already processed this game
            if (processedGames.has(originalGameName)) {
                return;
            }
            processedGames.add(originalGameName);

            // Check cache first
            const cachedData = getCachedTime(originalGameName);
            if (cachedData) {
                appendTimeToRow(cachedData.time, gameRow, cachedData.link);
                return;
            }

            // Add loading indicator
            const loadingCell = document.createElement('td');
            loadingCell.classList.add('dt-type-numeric', 'playtime-loading');
            loadingCell.textContent = 'Loading...';
            gameRow.insertBefore(loadingCell, gameRow.querySelector('a.b').parentNode.nextSibling);

            try {
                const gameData = await searchGameWithFallback(originalGameName, loadingCell);

                if (gameData) {
                    const mainTime = gameData.comp_main / 3600;
                    const gameLink = `https://howlongtobeat.com/game/${gameData.game_id}`;

                    setCachedTime(originalGameName, {
                        time: mainTime,
                        link: gameLink,
                        reviewScore: gameData.review_score
                    });

                    loadingCell.remove();
                    appendTimeToRow(mainTime, gameRow, gameLink);

    //                console.log(`Found match for "${originalGameName}": "${gameData.game_name}"`);
                } else {
                    loadingCell.textContent = 'N/A';
                    loadingCell.classList.remove('playtime-loading');
    //                console.log(`No results found for: ${originalGameName}`);
                }
            } catch (error) {
                console.error('Failed to fetch game time:', error);
                loadingCell.textContent = 'Error';
                loadingCell.classList.remove('playtime-loading');
            }
        }

        function appendTimeToRow(time, gameRow, gameLink) {
            // Check if playtime cell already exists
            if (!gameRow.querySelector('.playtime-cell')) {
                const newCell = document.createElement('td');
                newCell.classList.add('dt-type-numeric', 'playtime-cell');

                const link = document.createElement('a');
                link.href = gameLink;
                link.target = '_blank';
                link.title = 'View on HowLongToBeat';

                // Format time as hours and minutes
                const hours = Math.floor(time);
                const minutes = Math.round((time - hours) * 60);
                link.textContent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                newCell.appendChild(link);

                const nameCell = gameRow.querySelector('a.b').parentNode;
                if (nameCell && nameCell.nextSibling) {
                    gameRow.insertBefore(newCell, nameCell.nextSibling);
                }
            }
        }

        function processNewGames() {
            const gameRows = document.querySelectorAll('tr.app');
            gameRows.forEach(row => {
                const gameNameElement = row.querySelector('a.b');
                if (gameNameElement) {
                    const gameName = gameNameElement.textContent.trim();
                    fetchGameTime(gameName, row);
                }
            });
        }

        // Debounce function to prevent too frequent updates
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Function to process updates after interactive elements are clicked
        function setupInteractionListeners() {
            // Debounced version of the process function
            const debouncedProcess = debounce(() => {
                addPlaytimeHeader();
                processNewGames();
            }, 1000); // 1 second debounce time

            // List of selectors for interactive elements
            const interactiveSelectors = [
                'a', // Links (including pagination)
                'button', // Buttons
                'select', // Dropdowns
                'input', // Input fields
                'th[data-name]', // Table headers (for sorting)
                '.paginate_button', // Pagination buttons
                '.dt-button', // DataTables buttons
                '.sorting', // Sorting elements
                'label' // Labels (often used for filters)
            ].join(', ');

            // Function to handle mutations
            const mutationCallback = function(mutationsList, observer) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' &&
                        mutation.addedNodes.length > 0) {
                        debouncedProcess();
                        break;
                    }
                }
            };

            // Create an observer instance
            const observer = new MutationObserver(mutationCallback);

            // Start observing the document with the configured parameters
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Add click listeners to interactive elements
            document.body.addEventListener('click', (event) => {
                if (event.target.matches(interactiveSelectors) ||
                    event.target.closest(interactiveSelectors)) {
                    debouncedProcess();
                }
            });

            // Listen for select changes
            document.body.addEventListener('change', (event) => {
                if (event.target.matches('select')) {
                    debouncedProcess();
                }
            });

            // Listen for DataTables events
            document.addEventListener('draw.dt', debouncedProcess);
            document.addEventListener('length.dt', debouncedProcess);
            document.addEventListener('page.dt', debouncedProcess);
            document.addEventListener('search.dt', debouncedProcess);
            document.addEventListener('order.dt', debouncedProcess);
        }

        // Initialize
        function init() {
            addPlaytimeHeader();
            processNewGames();
            setupInteractionListeners();
        }

        // Wait for the page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();

