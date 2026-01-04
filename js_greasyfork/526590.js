// ==UserScript==
// @name         Torn Racing: NPO Records
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add NPO Racing Lap Times to Torn Racing Statistics
// @author       Ikkakujuu
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/526590/Torn%20Racing%3A%20NPO%20Records.user.js
// @updateURL https://update.greasyfork.org/scripts/526590/Torn%20Racing%3A%20NPO%20Records.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Step 1: Inject Custom CSS ===
    GM_addStyle(`
        .item-wrap > .track-wrap.left {
            width: 100% !important;
        }
        .track-wrap.left > .name {
            width: 100% !important;
        }
        .name {
            padding: 0 !important;
        }
        .placeholder {
            display: none !important;
        }
    `);

    function updateNpoRecords() {
        // Modify Lap Records Tabs
        document.querySelectorAll('ul.tabs-title.bold').forEach(function(ul) {
            // Remove "last" class from the current last item
            let existingLast = ul.querySelector('li.t-overflow.last');
            if (existingLast) {
                existingLast.classList.remove('last');
            }
            // If a tab linking to "#npo-records" isn’t already there, add it.
            let existingNpoTab = ul.querySelector('li.t-overflow a[href^="#npo-records"]');
            if (!existingNpoTab) {
                let newTab = document.createElement('li');
                newTab.className = 't-overflow last';
                newTab.innerHTML = `
                    <a href="#npo-records" title="NPO Records">NPO Records</a>
                    <div class="shadow-left"></div>
                `;
                let clearItem = ul.querySelector('li.clear');
                if (clearItem) {
                    ul.insertBefore(newTab, clearItem);
                } else {
                    ul.appendChild(newTab);
                }
            }
        });

        // Create new NPO Records
        document.querySelectorAll('ul[id^="global-records-"]').forEach(function(globalUl) {
            let id = globalUl.getAttribute('id');
            let match = id.match(/global-records-(\d+)/);
            if (match) {
                let number = match[1];
                // Only create the NPO UL if it doesn't exist already.
                if (!document.getElementById('npo-records-' + number)) {
                    let npoUl = document.createElement('ul');
                    npoUl.id = 'npo-records-' + number;
                    npoUl.className = globalUl.className;
                    // Create 5 placeholder <li>s.
                    for (let i = 0; i < 5; i++) {
                        let li = document.createElement('li');
                        li.innerHTML = `
                            <div class="car"></div>
                            <div class="time">--:--.--</div>
                            <div class="driver">No Record</div>
                            <div class="clear"></div>
                        `;
                        npoUl.appendChild(li);
                    }
                    globalUl.parentNode.insertBefore(npoUl, globalUl.nextSibling);
                }
            }
        });

        // Fetch and Process Google Sheet Data

        // Mapping from track id to CSV column index (0-based; Column A is 0)
        const trackMapping = {
            "6": 1, // Uptown (B)
            "7": 2, // Withdrawl (C)
            "8": 3, // Underdog (D)
            "9": 4, // Parkland (E)
            "10": 5, // Docks (F)
            "11": 6, // Commerce (G)
            "12": 7, // Two Islands (H)
            "15": 8, // Industrial (I)
            "16": 9, // Vector (J)
            "17": 10, // Mudpit (K)
            "18": 11, // Hammerhead (L)
            "19": 12, // Sewage (M)
            "20": 13, // Meltdown (N)
            "21": 14, // Speedway (O)
            "23": 15, // Stone Park (P)
            "24": 16 // Convict (Q)
        };

        // URL for CSV export of your Google Sheet.
        const csvUrl = "https://docs.google.com/spreadsheets/d/18cKMqyWrXA9O-7aA1wXpI3972xVrzAXms8-PhzKenzI/export?format=csv";

        // Simple CSV parser: splits rows by newline, then cells by commas (handles quoted commas)
        function parseCSV(csvText) {
            const rows = csvText.trim().split(/\r?\n/);
            return rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
        }

        // Converts a lap time string ("MM:SS.xx") to seconds. Returns Infinity if invalid.
        function parseLapTime(timeStr) {
            if (!timeStr) return Infinity;
            let parts = timeStr.split(':');
            if (parts.length !== 2) return Infinity;
            let minutes = parseFloat(parts[0]);
            let seconds = parseFloat(parts[1]);
            if (isNaN(minutes) || isNaN(seconds)) return Infinity;
            return minutes * 60 + seconds;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: csvUrl,
            onload: function(response) {
                let csvText = response.responseText;
                let data = parseCSV(csvText);
                let rows = data.slice(1); // skip header row

                let trackRecords = {};
                Object.keys(trackMapping).forEach(trackId => {
                    trackRecords[trackId] = [];
                });

                rows.forEach(row => {
                    let memberName = row[0].trim();
                    Object.keys(trackMapping).forEach(trackId => {
                        let colIndex = trackMapping[trackId];
                        let lapTimeStr = row[colIndex] ? row[colIndex].trim() : "";
                        if (lapTimeStr) {
                            let timeValue = parseLapTime(lapTimeStr);
                            if (timeValue !== Infinity) {
                                trackRecords[trackId].push({
                                    name: memberName,
                                    time: timeValue,
                                    timeStr: lapTimeStr
                                });
                            }
                        }
                    });
                });

                // For each track, sort the records (fastest first) and update the corresponding NPO UL.
                Object.keys(trackRecords).forEach(trackId => {
                    let records = trackRecords[trackId];
                    records.sort((a, b) => a.time - b.time);
                    let top5 = records.slice(0, 5);
                    let npoUl = document.getElementById('npo-records-' + trackId);
                    if (npoUl) {
                        npoUl.innerHTML = ""; // Clear any existing content.
                        top5.forEach(record => {
                            let li = document.createElement('li');
                            li.innerHTML = `
                                <div class="car"></div>
                                <div class="time">${record.timeStr}</div>
                                <div class="driver">${record.name}</div>
                                <div class="clear"></div>
                            `;
                            npoUl.appendChild(li);
                        });
                        // If fewer than 5 records, add placeholder li's.
                        for (let i = top5.length; i < 5; i++) {
                            let li = document.createElement('li');
                            li.innerHTML = `
                                <div class="car"></div>
                                <div class="time">--:--.--</div>
                                <div class="driver">No Record</div>
                                <div class="clear"></div>
                            `;
                            npoUl.appendChild(li);
                        }
                    }
                });
            },
            onerror: function(error) {
                console.error("Error fetching CSV data with GM_xmlhttpRequest: ", error);
            }
        });
    }

    if (window.location.href.indexOf('tab=stats') !== -1) {
        updateNpoRecords();
    }
    let statsButton = document.querySelector('a[tab-value="stats"]');
    if (statsButton) {
        statsButton.addEventListener('click', function() {
            setTimeout(updateNpoRecords, 500);
        });
    }
})();
