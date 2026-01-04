// ==UserScript==
// @name         HLTB Bulk Import
// @namespace    https://howlongtobeat.com/
// @author       badmannersteam
// @version      1.0
// @description  Bulk import games from CSV into HowLongToBeat lists
// @license MIT
// @match        https://howlongtobeat.com/*
// @grant        GM_xmlhttpRequest
// @connect      howlongtobeat.com
// @downloadURL https://update.greasyfork.org/scripts/523066/HLTB%20Bulk%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/523066/HLTB%20Bulk%20Import.meta.js
// ==/UserScript==

// Expected CSV format (no header):
//   list_title,rating,finish_date,game_name
// e.g.:
//   completed,10,23.07.2022,The Witcher 3: Wild Hunt - Game of the Year Edition

(function() {
    'use strict';

    // Rate-limit delay (in milliseconds) between each submission:
    const RATE_LIMIT_DELAY = 2000;

    // The "search" API endpoint:
    // TODO: retrieve hash from js sources
    const SEARCH_ENDPOINT = "https://howlongtobeat.com/api/lookup/e6e71df581a39f40";

    // The "submit" API endpoint:
    const SUBMIT_ENDPOINT = "https://howlongtobeat.com/api/submit";

    // The "user" API endpoint to retrieve user info:
    const USER_INFO_ENDPOINT = "https://howlongtobeat.com/api/user";

    // We'll store the retrieved user ID here:
    let userId = null;

    // First, fetch the user ID automatically.
    fetchUserId().then(id => {
        userId = id;
        console.log("HLTB User ID retrieved:", userId);
        // Once we have userId, add the UI so user can import CSV.
        addUI();
    }).catch(err => {
        console.error("Could not retrieve HLTB user ID:", err);
        alert("Error: Could not retrieve your HowLongToBeat user ID. Make sure you're logged in, then refresh the page.");
    });

    /**
     * Creates a small UI panel with a file input for CSV and an import button.
     */
    function addUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            z-index: 99999;
            top: 10px;
            right: 10px;
            padding: 10px;
            background: #222;
            color: #fff;
            font-family: Arial, sans-serif;
        `;

        const infoLabel = document.createElement('div');
        infoLabel.textContent = "HLTB Bulk Import (User ID: " + userId + ")";
        infoLabel.style.marginBottom = "5px";

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.marginRight = '5px';

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import CSV to HLTB';
        importBtn.onclick = () => {
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Please choose a CSV file first!');
                return;
            }
            const file = fileInput.files[0];
            parseAndProcessCSV(file);
        };

        container.appendChild(infoLabel);
        container.appendChild(fileInput);
        container.appendChild(importBtn);
        document.body.appendChild(container);
    }

    /**
     * Parses the CSV file and processes each row.
     */
    function parseAndProcessCSV(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // Basic line-splitting parse (assumes no commas inside fields except for game name).
            const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

            const entries = [];
            for (const line of lines) {
                const parts = line.split(',');
                if (parts.length < 4) {
                    console.warn('Skipping malformed line:', line);
                    continue;
                }
                const listTitle = parts[0].trim().toLowerCase();
                const rating = parts[1].trim();

                const date = parts[2].trim().split('.');
                const day = date[0];
                const month = date[1];
                const year = date[2];

                const gameName = parts.slice(3).join(',').trim();

                entries.push({ listTitle, gameName, rating, "date":{"month":month,"day":day,"year":year}});
            }

            // Process in sequence to respect rate limits
            processEntriesSequentially(entries, 0);
        };
        reader.readAsText(file);
    }

    /**
     * Recursively processes each entry in the array with a delay between requests.
     */
    async function processEntriesSequentially(entries, index) {
        if (index >= entries.length) {
            alert('All entries processed!');
            return;
        }

        const { listTitle, gameName, rating, date } = entries[index];
        console.log(`Processing [${index+1}/${entries.length}]: ${gameName} → list "${listTitle}" with rating ${rating} and date ${JSON.stringify(date)}`);

        try {
            // 1) Search for the game by name
            const gameInfo = await searchGame(gameName);

            if (!gameInfo) {
                console.warn(`Game not found for: "${gameName}"`);
            } else {
                // 2) Submit the game to the specified list with the rating
                await submitGame(gameInfo.game_id, gameInfo.game_name, listTitle, rating, date);
            }
        } catch (err) {
            console.error('Error processing entry:', err);
        }

        // Wait a bit before processing the next entry
        setTimeout(() => {
            processEntriesSequentially(entries, index + 1);
        }, RATE_LIMIT_DELAY);
    }

    /**
     * Retrieves user ID.
     */
    function fetchUserId() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: USER_INFO_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                },
                anonymous: false,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json.data && json.data[0] && json.data[0].user_id) {
                                resolve(json.data[0].user_id);
                            } else {
                                reject(new Error("No user_id in response"));
                            }
                        } catch(e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`User info request failed: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    /**
     * Searches the game in HLTB base.
     * Returns: { game_id, game_name } or null if no result.
     */
    function searchGame(gameName) {
        const searchTerms = gameName.split(/\s+/).filter(Boolean);

        const payload = {
            "searchType": "games",
            "searchTerms": searchTerms,
            "searchPage": 1,
            "size": 20,
            "searchOptions": {
                "games": {
                    "platform": "",
                    "sortCategory": "popular",
                    "rangeCategory": "",
                    "rangeTime": { "min": "", "max": "" },
                    "gameplay": { "perspective": "", "flow": "", "genre": "", "difficulty": "" },
                    "rangeYear": { "min": "", "max": "" },
                    "modifier": ""
                },
                "users": { "sortCategory": "" },
                "filter": "",
                "sort": "desc",
                "randomizer": 0
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: SEARCH_ENDPOINT,
                data: JSON.stringify(payload),
                headers: {
                    'Referer': 'https://howlongtobeat.com',
                    'Content-Type': 'application/json'
                },
                anonymous: false,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json.data && json.data.length > 0) {
                                // We pick the first search result
                                resolve(json.data[0]);
                            } else {
                                resolve(null);
                            }
                        } catch(e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`Search request failed: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    /**
     * Submits the game to HLTB with the specified list, rating and date.
     */
    function submitGame(gameId, gameTitle, listTitle, rating, date) {
        // Convert rating (1–10) to HLTB’s 0–100 scale
        const intRating = parseInt(rating, 10);
        const finalScore = isNaN(intRating) ? 0 : (intRating * 10);

        // Map the CSV's listTitle to HLTB’s known boolean fields
        const listsObj = {
            playing: false,
            backlog: false,
            replay: false,
            custom: false,
            completed: false,
            retired: false
        };

        // If the CSV includes one of the known list keys, set that to true:
        if (Object.hasOwn(listsObj, listTitle)) {
            listsObj[listTitle] = true;
        } else {
            // Otherwise, default to the "custom" list
            listsObj.custom = true;
        }

        // Build the payload for submission:
        const payload = {
            "manualTimer": {"time":{"hours":null,"minutes":null,"seconds":null}},
            "platform": "PC",
            "title": gameTitle,
            "lists": listsObj,
            "general": {
                "progress": {"hours":null,"minutes":null,"seconds":null},
                "startDate": {"month":"00","day":"00","year":"0000"},
                "completionDate": date
            },
            "review": {
                "score": finalScore,
                "notes": ""
            },
            "multiPlayer": {
                "coOp": {"time":{"hours":null,"minutes":null,"seconds":null}},
                "vs":   {"time":{"hours":null,"minutes":null,"seconds":null}}
            },
            "additionals": {
                "notes":"",
                "video":""
            },
            "singlePlayer": {
                "includesDLC": false,
                "playCount": false,
                "compMain":  {"time":{"hours":null,"minutes":null,"seconds":null},"notes":""},
                "compPlus":  {"time":{"hours":null,"minutes":null,"seconds":null},"notes":""},
                "comp100":   {"time":{"hours":null,"minutes":null,"seconds":null},"notes":""}
            },
            "speedRuns": {
                "percAny":   {"time":{"hours":null,"minutes":null,"seconds":null},"notes":""},
                "perc100":   {"time":{"hours":null,"minutes":null,"seconds":null},"notes":""}
            },
            "userId": userId,
            "adminId": null,
            "gameId": gameId,
            "customLabels": {
                "custom": "Custom Tab",
                "custom2": "",
                "custom3": ""
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: SUBMIT_ENDPOINT,
                data: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                },
                anonymous: false,
                onload: function(response) {
                    if (response.status === 200) {
                        console.log(`Submitted "${gameTitle}" to list "${listTitle}" with rating "${rating}"`);
                        resolve();
                    } else {
                        reject(new Error(`Submit request failed: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }
})();
