// ==UserScript==
// @name         Torn - Log Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a GUI to the settings page to download logs (specific or all) over a certain timeframe as a .json file. 
// @match        https://www.torn.com/preferences.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531349/Torn%20-%20Log%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/531349/Torn%20-%20Log%20Downloader.meta.js
// ==/UserScript==

// TO DO: FILTER OUT LOGS THAT ARE BEFORE THE START TIMESTAMP IF THEY EXIST.

(function() {
    'use strict';

    function createUI() {
        const titleHeader = document.querySelector('div.content-title > h4');
        if (!titleHeader) return;

        const button = document.createElement('button');
        button.textContent = "Download Logs";
        button.style.cssText = "margin-left: 10px; padding: 5px 10px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 5px;";
        titleHeader.appendChild(button);

        button.addEventListener('click', openSettingsBox);
    }

    function openSettingsBox() {
        if (document.getElementById("logFetcherBox")) return;

        const storedApiKey = GM_getValue("apiKey", "");
        const storedMaxRequests = GM_getValue("maxRequests", 75);
        const storedStartTimestamp = GM_getValue("startTimestamp", "");
        const storedEndTimestamp = GM_getValue("endTimestamp", "");
        const storedLogType = GM_getValue("logType", "");

        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const bgColor = isDarkMode ? "#1E1E1E" : "white";
        const textColor = isDarkMode ? "#FFFFFF" : "black";
        const borderColor = isDarkMode ? "#444" : "black";

        const box = document.createElement("div");
        box.id = "logFetcherBox";
        box.style.cssText = `position: fixed; top: 50px; right: 50px; width: 300px; background: ${bgColor}; color: ${textColor}; padding: 10px; border: 2px solid ${borderColor}; box-shadow: 0px 0px 10px rgba(0,0,0,0.5); z-index: 9999; border-radius: 8px;`;

        box.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: ${textColor};">Log Downloader</h3>
            <label style="color: ${textColor};">Full Access API Key:</label>
            <input type="text" id="apiKey" value="${storedApiKey}" style="width: 100%; margin-bottom: 5px; background: ${isDarkMode ? "#333" : "white"}; color: ${textColor}; border: 1px solid ${borderColor};">
            <label style="color: ${textColor};">Max Requests per Minute:</label>
            <input type="number" id="maxRequests" value="${storedMaxRequests}" style="width: 100%; margin-bottom: 5px; background: ${isDarkMode ? "#333" : "white"}; color: ${textColor}; border: 1px solid ${borderColor};">
            <label style="color: ${textColor};">Start Timestamp:</label>
            <input type="number" id="startTimestamp" value="${storedStartTimestamp}" style="width: 100%; margin-bottom: 5px; background: ${isDarkMode ? "#333" : "white"}; color: ${textColor}; border: 1px solid ${borderColor};">
            <label style="color: ${textColor};">End Timestamp:</label>
            <input type="number" id="endTimestamp" value="${storedEndTimestamp}" style="width: 100%; margin-bottom: 10px; background: ${isDarkMode ? "#333" : "white"}; color: ${textColor}; border: 1px solid ${borderColor};">
            <label style="color: ${textColor};">Log Type (eg. '&log=8166'. Leave blank for all logs):</label>
            <input type="text" id="logType" value="${storedLogType}" style="width: 100%; margin-bottom: 5px; background: ${isDarkMode ? "#333" : "white"}; color: ${textColor}; border: 1px solid ${borderColor};">
            <button id="startScript" style="width: 100%; padding: 5px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 5px;">Start</button>
            <button id="closeBox" style="width: 100%; padding: 5px; margin-top: 5px; background: #FF4D4D; color: white; border: none; cursor: pointer; border-radius: 5px;">Close</button>
        `;

        document.body.appendChild(box);

        document.getElementById("closeBox").addEventListener("click", () => box.remove());

        document.getElementById("startScript").addEventListener("click", () => {
            const apiKey = document.getElementById("apiKey").value.trim();
            const maxRequests = parseInt(document.getElementById("maxRequests").value, 10);
            const startTimestamp = parseInt(document.getElementById("startTimestamp").value, 10);
            const endTimestamp = parseInt(document.getElementById("endTimestamp").value, 10);
            const logType = document.getElementById("logType").value.trim() || '';

            if (!apiKey || isNaN(maxRequests) || isNaN(startTimestamp) || isNaN(endTimestamp) || startTimestamp >= endTimestamp) {
                alert("Invalid input! Check your values.");
                return;
            }

            GM_setValue("apiKey", apiKey);
            GM_setValue("maxRequests", maxRequests);
            GM_setValue("startTimestamp", startTimestamp);
            GM_setValue("endTimestamp", endTimestamp);
            GM_setValue("logType", logType);

            fetchTornLogs(apiKey, startTimestamp, endTimestamp, maxRequests, logType);
        });
    }

    async function fetchTornLogs(apiKey, startTimestamp, endTimestamp, maxRequests = 75, logType) {
        let logs = {};
        let currentEndTimestamp = endTimestamp;
        let requestCount = 0;
        let startTime = Date.now();
        let lastFetchedLogId = null;

        while (currentEndTimestamp >= startTimestamp) {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= 60000) {
                requestCount = 0;
                startTime = Date.now();
            }

            if (requestCount >= maxRequests) {
                console.log("Max requests reached. Pausing for 1 minute...");
                await new Promise(resolve => setTimeout(resolve, 60000));
                continue;
            }

            let url;
            if (logType) url = `https://api.torn.com/user/?selections=log&key=${apiKey}&from=1&to=${currentEndTimestamp}${logType}`;
            else url = `https://api.torn.com/user/?selections=log&key=${apiKey}&from=1&to=${currentEndTimestamp}`;
            console.log(`Fetching (${requestCount + 1}/${maxRequests}): ${url}`);

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.error) {
                    console.error(`API Error: ${data.error.error} (Code: ${data.error.code})`);

                    if (data.error.code === 5) {
                        console.warn("Rate limited! Pausing for 1 minute...");
                        await new Promise(resolve => setTimeout(resolve, 60000));
                        continue;
                    } else {
                        if (Object.keys(logs).length > 0) saveLogs(logs);
                        return;
                    }
                }

                const logEntries = Object.entries(data.log);
                if (logEntries.length === 0) break;

                const oldestLogId = logEntries[logEntries.length - 1][0];
                if (oldestLogId === lastFetchedLogId) {
                    console.log("Duplicate log detected, stopping fetch loop.");
                    break;
                }

                lastFetchedLogId = oldestLogId;

                logEntries.forEach(([logId, logData]) => {
                    if (logData.timestamp < startTimestamp) return;
                    logs[logId] = logData;
                });

                const oldestLogTimestamp = logEntries[logEntries.length - 1][1].timestamp;
                if (oldestLogTimestamp < startTimestamp) break;

                currentEndTimestamp = oldestLogTimestamp - 1;
                requestCount++;

            } catch (error) {
                console.error("Fetch error:", error);
                if (Object.keys(logs).length > 0) saveLogs(logs);
                return;
            }
        }

        if (Object.keys(logs).length > 0) saveLogs(logs);
        console.log("Data collection complete.");
    }


    function saveLogs(logs) {
        const jsonData = JSON.stringify({ log: logs }, null, 2);
        GM_download({
            url: "data:application/json;charset=utf-8," + encodeURIComponent(jsonData),
            name: "torn_logs.json"
        });
        console.log("JSON file saved.");
    }

    createUI();
})();