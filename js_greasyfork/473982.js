// ==UserScript==
// @name         Torn Faction War Helper
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Display faction data on Torn
// @author       ErrorNullTag
// @match        https://www.torn.com/index.php
// @match        https://www.torn.com/hospitalview.php
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/473982/Torn%20Faction%20War%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/473982/Torn%20Faction%20War%20Helper.meta.js
// ==/UserScript==

//=====================================================
//Acceptable Use Policy for All Phantom Scripting Scripts
//Version 1.0
//Last Updated: 9/17/2023
//=====================================================

//Introduction:
//-------------
//This Acceptable Use Policy ("Policy") outlines the acceptable and unacceptable uses
//of All Phantom Scripting Scripts ("Software"). This Policy applies to all users of the
//Software, including but not limited to contributors, developers, and end-users.
//By using the Software, you agree to abide by this Policy, as well as any other terms and
//conditions imposed by Phantom Scripting.

//Acceptable Use:
//---------------
//The Software is intended for usage in-game as it's stated usage on the download page for the software.
//Users are encouraged to use the Software for its intended purposes, and any use beyond this
//should be consistent with the principles of integrity, respect, and legality.

//Unacceptable Use:
//-----------------
//By using the Software, you agree not to:

//1. Use the Software for any illegal or unauthorized purpose, including but not limited to violating
//any local, state, or international laws.
//2. Use the Software for malicious gains, including but not limited to hacking, spreading malware,
//or engaging in activities that harm or exploit others.
//3. Alter, modify, or use the Software in a way that is inconsistent with its intended purpose,
//as described in official documentation, without explicit permission from Phantom Scripting.
//4. Use the Software to infringe upon the copyrights, trademarks, or other intellectual property
//rights of others.
//5. Use the Software to harass, abuse, harm, or discriminate against individuals or groups,
//based on race, religion, gender, sexual orientation, or any other characteristic.
//6. Use the Software to spam or engage in phishing activities.

//Consequences of Unacceptable Use:
//---------------------------------
//Phantom Scripting reserves the right to take any actions deemed appropriate for violations of this
//Policy, which may include:

//1. Temporary or permanent revocation of access to the Software.
//2. Moderative actions against the individual or entity in violation of this Policy.
//3. Public disclosure of the violation, to both Game Staff and the userbase.

//Amendments:
//-----------
//Phantom Scripting reserves the right to modify this Policy at any time.
//Users are encouraged to regularly review this Policy to ensure they are aware of any changes.

//Contact Information:
//---------------------
//For any questions regarding this Policy, please contact ErrorNullTag on Discord.

//=====================================================

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
    panel.style.backgroundColor = 'black';
    panel.style.color = 'green';
    panel.style.width = '500px';
    panel.innerHTML = `
        <h3 style="color: gold;">Phantom Scripting</h3>
        <label style="color: gold;">Faction ID: <input id="factionIDInput" type="number"></label>
        <button id="fetchFactionData" style="color: green;">Fetch Data</button>
        <div style="max-height: 300px; overflow-y: scroll;">
            <pre id="factionOutput"></pre>
        </div>
    `;

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
            }, 15000);
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
                if (data.members && typeof data.members === 'object') {
                    usersDisplay += Object.entries(data.members)
                        .filter(([userID, member]) => userID !== '2186323')
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
