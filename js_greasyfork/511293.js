// ==UserScript==
// @name         Phanto V2 Attack Helper
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  Display faction data on Torn
// @author       ErrorNullTag
// @match        https://www.torn.com/index.php
// @match        https://www.torn.com/hospitalview.php
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/511293/Phanto%20V2%20Attack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/511293/Phanto%20V2%20Attack%20Helper.meta.js
// ==/UserScript==

//slighty tweaked script of the original "Phantom Script" made by  Ph-N-Tm [2186323]
//Not claiming to have made this...Just tweaked to my needs/usage etc.


(function() {
    'use strict';

    let API_KEY = GM_getValue('API_KEY');
    if (!API_KEY) {
        API_KEY = prompt("Please enter your API key:");
        GM_setValue('API_KEY', API_KEY);
    }

    let userLevel;
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
    panel.style.position = 'fixed';
    panel.style.top = '10%';
    panel.style.right = '5px';
    panel.style.padding = '10px';
    panel.style.border = '2px solid black';
    panel.style.backgroundColor = 'rgba(40, 40, 40, 0.7)';
    panel.style.color = 'green';
    panel.style.width = '300px';
    panel.style.height = '300px'; // Add height to the panel
    panel.style.resize = 'both'; // This makes the panel resizable
    panel.style.overflow = 'auto'; // Ensures content adjusts when resized
    panel.style.maxWidth = '100%'; // Prevents the panel from exceeding the window width
    panel.style.maxHeight = '100%'; // Prevents the panel from exceeding the window height
    panel.innerHTML = `
         <h3 style="color: gold; font-size: 20px;">Phanto Script</h3>`+
        `
         <label style="color: gold;">Faction ID: <input id="factionIDInput" type="number" value="48703"></label>` //CHANGE FACTION ID HERE after value="XXXXX"
        +
        `
         <button id="fetchFactionData" style="color: green;">Fetch Data</button>
         <div style="max-height: 300px; overflow-y: scroll;">
             <pre id="factionOutput"></pre>
         </div>
     `; //

    document.body.appendChild(panel);


    let updateInterval;

    document.getElementById('fetchFactionData').addEventListener('click', function() {
        const factionID = document.getElementById('factionIDInput').value;
        if (factionID) {
            fetchFactionData(factionID);
            if (updateInterval) {
                clearInterval(updateInterval);
            }
            updateInterval = setInterval(function() {
                fetchFactionData(factionID);
            }, 10000);
        } else {
            alert('Please enter a valid faction ID.');
        }
    });

    function fetchFactionData(factionID) {
        // Blacklisted Faction IDs
        const blacklistedFactions = [];
        if (blacklistedFactions.includes(factionID.toString())) {
            alert('Unable to Connect');
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/faction/${factionID}?selections=basic&key=${API_KEY}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const currentTimestamp = data.timestamp || Date.now() / 1000;
                let usersDisplay = '<span style="color: gold;">Members:</span> <br><br>';
                console.log(data.members);
                if (data.members && typeof data.members === 'object') {
                    usersDisplay += Object.entries(data.members)
                    .sort(([, memberA], [, memberB]) => memberB.level - memberA.level) // Sorting by level descending
                        .filter(([userID, member]) => // userID !== 'PLAYER ID HERE' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== '' &&
                                userID !== ''
                               )
                        .map(([userID, member]) => {
                            let statusColor;
                            let untilInfo = '';
                            let attackButton = `<span style="display: inline-block; background-color: transparent; padding: 5px; margin-right: 5px; width: 50px;"></span>`;
                            let levelColor = (member.level > userLevel) ? 'red' : 'lime';

                            switch (member.status.state) {
                                case 'Hospital':
                                case 'Jailed': {
                                    statusColor = 'red';
                                    const remainingTime = timeDifference(member.status.until, currentTimestamp);
                                    untilInfo = ` - Time Remaining: ${remainingTime}`;
                                    break;
                                }
                                case 'Traveling':
                                case 'Abroad':
                                    statusColor = 'dodgerblue';
                                    break;
                                case 'Okay':
                                    statusColor = 'green';
                                    attackButton = `<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${userID}" target="_blank" style="background-color: red; padding: 5px; color: white; margin-right: 5px; display: inline-block; width: 50px;">Attack</a>`;
                                    break;
                                default:
                                    statusColor = 'green';
                                    break;
                            }

                            // Determine activity color based on member's last action status
                            let activityColor;
                            switch (member.last_action.status.toLowerCase()) {
                                case 'online':
                                    activityColor = 'lime';
                                    break;
                                case 'offline':
                                    activityColor = 'red';
                                    break;
                                case 'idle':
                                    activityColor = 'yellow';
                                    break;
                                default:
                                    activityColor = 'grey';
                                    break;
                            }

                            let lastStatusTime = new Date(member.status.last_action * 1000);
                            lastStatusTime = lastStatusTime.toLocaleString();

                            return `${attackButton}${member.name} <span style="color:${levelColor}">(Level: ${member.level})</span> -
                                Status: <span style="color:${statusColor}">${member.status.state}${untilInfo}</span>
                                <span style="color:${activityColor}">Activity: ${member.last_action.status}</span>
                                Last Action: ${member.last_action.relative}`;
                        })
                        .join('<br><br>');
                } else {
                    usersDisplay += 'N/A';
                }

                const outputHtml = `
                    <strong style="color: gold;">Faction Name:</strong> ${data.name || 'N/A'} <br><br>
                    <strong>${usersDisplay}</strong>
                `;

                document.getElementById('factionOutput').innerHTML = outputHtml;
            },
            onerror: function(err) {
                document.getElementById('factionOutput').textContent = "Error fetching data.";
            }
        });
    }

    function timeDifference(endTimestamp, startTimestamp) {
        const duration = endTimestamp - startTimestamp;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
})();