// ==UserScript==
// @name         War Script
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Display faction data on Torn with minimized/maximized functionality, persistence, and auto-refresh.
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/index.php
// @match        https://www.torn.com/hospitalview.php
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/507224/War%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/507224/War%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = GM_getValue('API_KEY') || prompt("Please enter your API key:");
    if (API_KEY) GM_setValue('API_KEY', API_KEY);
    let userLevel;
    let updateInterval;
    const CHECK_INTERVAL = 30000;
    const savedFactionID = GM_getValue('factionID', '');
    const lastCheckedTime = GM_getValue('lastCheckedTime', null);
    const savedData = GM_getValue('factionData', 'No data yet.');
    let isMinimized = GM_getValue('isMinimized', false);
    fetchUserLevel();

    function fetchUserLevel() {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=basic&key=${API_KEY}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                userLevel = data.level;
            },
            onerror: function(err) {
                console.error("Error fetching user level:", err);
            }
        });
    }

    let panel = document.createElement('div');
    panel.id = 'factionPanel';
    panel.style.position = 'fixed';
    panel.style.top = '10%';
    panel.style.right = '5px';
    panel.style.padding = '10px';
    panel.style.border = '2px solid black';
    panel.style.backgroundColor = '#282c34';
    panel.style.color = 'white';
    panel.style.width = '450px';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
    panel.innerHTML = `
        <button id="minimizeButton" style="padding: 2px 5px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; width: 100%;">${isMinimized ? '+' : '-'}</button>
        <div id="content" style="display: ${isMinimized ? 'none' : 'block'};">
            <label>Faction ID: <input id="factionIDInput" type="number" value="${savedFactionID}" style="width: 100%; padding: 5px; margin-top: 10px;"></label>
            <button id="fetchFactionData" style="width: 100%; padding: 10px; margin-top: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Fetch Data</button>
            <div style="max-height: 300px; overflow-y: auto; margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
                <p id="lastChecked">Last checked: ${lastCheckedTime ? new Date(lastCheckedTime).toLocaleString() : 'Never'}</p>
                <pre id="factionOutput" style="font-family: monospace; white-space: nowrap; overflow-x: scroll;">${savedData}</pre>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    document.getElementById('minimizeButton').addEventListener('click', function() {
        const content = document.getElementById('content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            this.textContent = '-';
            GM_setValue('isMinimized', false);
        } else {
            content.style.display = 'none';
            this.textContent = '+';
            GM_setValue('isMinimized', true);
        }
    });
    document.getElementById('fetchFactionData').addEventListener('click', function() {
        const factionID = document.getElementById('factionIDInput').value;
        if (factionID) {
            GM_setValue('factionID', factionID);
            fetchFactionData(factionID);
            clearInterval(updateInterval);
            updateInterval = setInterval(() => fetchFactionData(factionID), CHECK_INTERVAL);
        } else {
            alert('Please enter a valid faction ID.');
        }
    });

    function fetchFactionData(factionID) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/${factionID}?selections=basic&key=${API_KEY}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const currentTimestamp = Date.now();
                GM_setValue('lastCheckedTime', currentTimestamp);
                let usersDisplay = '<strong>Members:</strong><br><br>';
                if (data.members) {
                    usersDisplay += Object.entries(data.members)
                        .sort(([, memberA], [, memberB]) => memberA.level - memberB.level)
                        .map(([userID, member]) => {
                            let statusColor;
                            let untilInfo = '';
                            let attackButton = `<span style="display: inline-block; width: 50px;"></span>`;
                            let levelColor = member.level > userLevel ? 'red' : 'lime';
                            if (['Hospital', 'Jailed'].includes(member.status.state)) {
                                statusColor = 'orange';
                                untilInfo = ` - Time Remaining: ${timeDifference(member.status.until, currentTimestamp)}`;
                            } else if (member.status.state === 'Traveling') {
                                statusColor = '#00BFFF';
                            } else if (member.status.state === 'Okay') {
                                statusColor = 'green';
                                attackButton = `<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${userID}" target="_blank" style="background-color: red; padding: 5px; color: white; border-radius: 3px;">Attack</a>`;
                            } else {
                                statusColor = 'grey';
                            }
                            let activityColor = member.last_action.status === 'Online' ? 'lightgreen' :
                                               member.last_action.status === 'Idle' ? 'orange' : 'red';

                            return `
                                <div style="padding: 5px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
                                    ${attackButton} <span style="color: ${levelColor};"> ${member.name} (Level: ${member.level})</span>
                                    <span style="color:${statusColor}">Status: ${member.status.state}${untilInfo}</span>
                                    <span style="color:${activityColor}">Activity: ${member.last_action.status.charAt(0).toUpperCase() + member.last_action.status.slice(1)}</span>
                                </div>
                            `;
                        })
                        .join('<br>');
                } else {
                    usersDisplay += 'No members available.';
                }
                GM_setValue('factionData', usersDisplay);
                document.getElementById('factionOutput').innerHTML = usersDisplay;
                document.getElementById('lastChecked').innerText = `Last checked: ${new Date(currentTimestamp).toLocaleString()}`;
            },
            onerror: function(err) {
                document.getElementById('factionOutput').textContent = "Error fetching data.";
            }
        });
    }
    if (savedFactionID) {
        updateInterval = setInterval(() => fetchFactionData(savedFactionID), CHECK_INTERVAL);
    }

    function timeDifference(endTimestamp, startTimestamp) {
        const duration = Math.max(endTimestamp * 1000 - startTimestamp, 0);
        const hours = Math.floor((duration / 1000) / 3600);
        const minutes = Math.floor(((duration / 1000) % 3600) / 60);
        const seconds = Math.floor((duration / 1000) % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

})();
