// ==UserScript==
// @name         Medout Count
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Count medouts for faction members based on medkit use within 15 min of attack
// @author       Allenone[2033011]
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/534450/Medout%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/534450/Medout%20Count.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const API_KEY = '';
    const from = 1745074800;
    const to = 1745218858;

    async function fetchNews(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `ApiKey ${API_KEY}`
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Failed to parse API response: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('API request failed: ' + error.statusText));
                }
            });
        });
    }

    async function GetAllNews(from, to) {
        let allNews = [];
        let url = `https://api.torn.com/v2/faction/news?striptags=true&limit=100&sort=ASC&to=${to}&from=${from}&cat=attack,armoryAction&key=${API_KEY}`;

        while (url) {
            try {
                const response = await fetchNews(url);
                if (response.error) {
                    alert('API error: ' + JSON.stringify(response.error));
                    console.error('API error:', response.error);
                    return [];
                }
                const newsItems = response.news || [];
                allNews = allNews.concat(newsItems);
                // Stop if fewer than 100 items, indicating the end of data
                if (newsItems.length < 100) {
                    break;
                }
                url = response._metadata && response._metadata.links && response._metadata.links.next ? response._metadata.links.next : null;
            } catch (error) {
                alert('Error fetching news: ' + error.message);
                console.error(error);
                return allNews;
            }
        }
        return allNews;
    }

    function processNews(news) {
        const attackPattern = /^(?:Someone|[\w-]+)\s+(attacked|mugged|hospitalized)\s+([\w-]+)(?:\s*\([^)]*\))?\s*\[view\]/;
        const medkitPattern = /^([\w-]+)\s+used one of the faction's\s+(.+?)\s+item/;
        const medicalItems = [
            // 'Blood Bag : O+', 'Blood Bag : O-', 'Blood Bag : A+', 'Blood Bag : A-',
            // 'Blood Bag : B+', 'Blood Bag : B-', 'Blood Bag : AB+', 'Blood Bag : AB-',
            'Small First Aid Kit', 'First Aid Kit',
            // 'Morphine'
        ];

        let players = {};
        let medouts = [];

        for (let entry of news) {
            let attackMatch = entry.text.match(attackPattern);
            if (attackMatch) {
                let action = attackMatch[1];
                let player = attackMatch[2];
                if (!players[player]) {
                    players[player] = { attacks: [], medkits: [] };
                }
                players[player].attacks.push(entry.timestamp);
            }

            let medkitMatch = entry.text.match(medkitPattern);
            if (medkitMatch && medicalItems.some(item => medkitMatch[2].includes(item))) {
                let player = medkitMatch[1];
                let item = medkitMatch[2];
                if (!players[player]) {
                    players[player] = { attacks: [], medkits: [] };
                }
                players[player].medkits.push({ timestamp: entry.timestamp, item });
            }
        }

        // Count medouts
        for (let player in players) {
            let data = players[player];
            for (let medkit of data.medkits) {
                let recentAttack = data.attacks
                    .filter(attackTime => attackTime <= medkit.timestamp && medkit.timestamp - attackTime <= 900)
                    .sort((a, b) => b - a)[0];

                if (recentAttack) {
                    let existingMedout = medouts.find(
                        m => m.player === player && m.attackTimestamp === recentAttack
                    );
                    if (!existingMedout) {
                        medouts.push({
                            player,
                            item: medkit.item,
                            timestamp: medkit.timestamp,
                            attackTimestamp: recentAttack
                        });
                    }
                }
            }
        }

        let medoutCounts = {};
        medouts.forEach(medout => {
            medoutCounts[medout.player] = (medoutCounts[medout.player] || 0) + 1;
        });

        return medoutCounts;
    }

    function printMedouts(medoutCounts) {
        let totalMedouts = Object.values(medoutCounts).reduce((sum, count) => sum + count, 0);
        console.log(`Total medouts: ${totalMedouts}`);
        Object.keys(medoutCounts)
            .sort() // Sort players alphabetically
            .forEach(player => {
                console.log(`${player}: ${medoutCounts[player]}`);
            });
    }

    try {
        let allNews = await GetAllNews(from, to);
        if (allNews.length === 0) {
            alert('No news data retrieved. Check time range and news categories.');
            return;
        }
        let medoutCounts = processNews(allNews);
        printMedouts(medoutCounts);
    } catch (error) {
        alert('Script error: ' + error.message);
        console.error(error);
    }
})();