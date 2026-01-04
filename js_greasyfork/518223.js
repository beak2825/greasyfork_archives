// ==UserScript==
// @name         FIBA Live Data - Max Optimized
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Fetch live basketball game data from fiba.basketball with enhanced performance and error handling.
// @author       Michal
// @match        https://example.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518223/FIBA%20Live%20Data%20-%20Max%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/518223/FIBA%20Live%20Data%20-%20Max%20Optimized.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let previousHash = null;
    let cache = {};

    // Create the table for displaying data
    function createTable() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .fiba-table {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-collapse: collapse;
                border: 3px solid black;
                background-color: white;
                font-size: 18px;
                color: black;
                z-index: 999;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .fiba-table th, .fiba-table td {
                border: 1px solid black;
                padding: 10px;
                text-align: center;
            }
            .fiba-table th {
                background-color: #f2f2f2;
            }
        `;
        document.head.appendChild(style);

        const table = document.createElement('table');
        table.id = 'fiba-table';
        table.className = 'fiba-table';
        table.innerHTML = `
            <tr><th>Home Team</th><td id="fiba-home-team">N/A</td></tr>
            <tr><th>Away Team</th><td id="fiba-away-team">N/A</td></tr>
            <tr><th>Score</th><td id="fiba-score">N/A</td></tr>
            <tr><th>Status</th><td id="fiba-status">N/A</td></tr>
        `;
        document.body.appendChild(table);
    }

    // Update table cells only if the data changes
    function updateTable(data) {
        const updateCell = (id, value) => {
            const cell = document.getElementById(id);
            if (cell.innerText !== value) {
                cell.innerText = value;
            }
        };

        updateCell('fiba-home-team', data.homeTeam);
        updateCell('fiba-away-team', data.awayTeam);
        updateCell('fiba-score', data.score);
        updateCell('fiba-status', data.status);
    }

    // Fetch data with caching mechanism
    async function fetchWithCache(url) {
        if (cache[url]) {
            return cache[url]; // Return cached data if available
        }

        const data = await fetchFibaData(url);
        cache[url] = data;

        // Invalidate cache after 10 seconds
        setTimeout(() => delete cache[url], 10000);
        return data;
    }

    // Fetch FIBA data using GM_xmlhttpRequest or fallback to fetch
    async function fetchFibaData(url) {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Tampermonkey Script)',
                        'Accept': 'text/html'
                    },
                    timeout: 10000, // 10-second timeout
                    onload: function (response) {
                        if (response.status === 200) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            resolve(parseFibaData(doc));
                        } else {
                            reject(`HTTP error: ${response.status}`);
                        }
                    },
                    ontimeout: function () {
                        reject('Request timed out.');
                    },
                    onerror: function () {
                        reject('Network error occurred.');
                    }
                });
            });
        } else {
            // Fallback to fetch if GM_xmlhttpRequest is not defined
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Tampermonkey Script)',
                        'Accept': 'text/html'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                return parseFibaData(doc);

            } catch (error) {
                throw new Error(`Failed to fetch data: ${error.message}`);
            }
        }
    }

    // Parse the HTML document for game data
    function parseFibaData(doc) {
        const scoreElement = doc.querySelector('.qap2wa2');
        const homeTeamElement = doc.querySelector('h1._1bu5s946._1d88n031.japnsh1p');
        const awayTeamElement = doc.querySelector('h1._1bu5s946._1d88n031.japnsh1e');
        const statusElement = doc.querySelector('.qap2wa7');

        return {
            homeTeam: homeTeamElement?.innerText.trim() || 'N/A',
            awayTeam: awayTeamElement?.innerText.trim() || 'N/A',
            score: scoreElement?.innerText.trim() || 'N/A',
            status: statusElement?.innerText.trim() || 'N/A'
        };
    }

    // Display errors in the UI
    function showError(message) {
        const errorContainer = document.createElement('div');
        errorContainer.style.position = 'fixed';
        errorContainer.style.top = '10px';
        errorContainer.style.right = '10px';
        errorContainer.style.backgroundColor = 'red';
        errorContainer.style.color = 'white';
        errorContainer.style.padding = '10px';
        errorContainer.style.zIndex = '1000';
        errorContainer.style.borderRadius = '5px';
        errorContainer.innerText = `Error: ${message}`;
        document.body.appendChild(errorContainer);

        setTimeout(() => errorContainer.remove(), 5000);
    }

    // Monitor hash changes using MutationObserver
    function monitorHashChanges() {
        const observer = new MutationObserver(async () => {
            const hash = window.location.hash;
            const fibaUrlPattern = /^#https:\/\/www\.fiba\.basketball\/.+\/games\/\d+-[\w-]+$/;

            if (fibaUrlPattern.test(hash)) {
                const url = hash.substring(1);
                if (url !== previousHash) {
                    previousHash = url;

                    try {
                        const data = await fetchWithCache(url);
                        updateTable(data);
                    } catch (error) {
                        console.error(error);
                        showError(error);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script
    function init() {
        if (!document.getElementById('fiba-table')) {
            createTable();
        }
        monitorHashChanges();
    }

    init();
})();
