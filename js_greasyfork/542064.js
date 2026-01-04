// ==UserScript==
// @name         Wildhare Race Hosting Notification
// @namespace    wildhareRaceHostNotification
// @version      2025-07-12.1
// @description  alert discord when you post a race
// @author       Wildhare
// @match        *://*.torn.com/loader.php?sid=racing
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542064/Wildhare%20Race%20Hosting%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/542064/Wildhare%20Race%20Hosting%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //WildhareTools discord for testing
    //const discordWebHookUrl = 'https://discord.com/api/webhooks/1392218323231576064/7AnsrmDYDiiuI20YJAmJLuGZeFyWjKIlBnV8rpnW4UQEGL2kRlH3rziLV3DXJzJHhdHG'
    //GDI discord
    const discordWebHookUrl = 'https://discord.com/api/webhooks/1392302433383743528/uKirDJmFFvKS_Jm_EYKhmJ9Nb1-LUlvmnzSWXwetuH-hCUWHO9JryApq4NTnWNa8cCYW';
    let trackName;
    let laps;
    let raceName;
    let playerName;
    let playerRace;
    let startTime;
    let customRaceForm;
    let customRaceButton;
    let leaderboard;

    function customRaceButtonPresent() {
        customRaceForm = document.getElementsByName('createCustomRace');
        customRaceButton = customRaceForm[1];
        if (customRaceButton) { return true } else {return false};
    }

    function hasRequiredData() {
        leaderboard = document.querySelector('#leaderBoard');
        if (leaderboard) {
            playerRace = leaderboard.firstChild.dataset.id;
            if (playerRace) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const customRaceObserver = new MutationObserver(() => {
        if ( document.querySelector('#racingAdditionalContainer') && customRaceButtonPresent()) {
            if (!customRaceButton.hasAttribute('wildhareListenerOnClick')) {
                playerName = document.querySelector('div.toggle-content___BJ9Q9 > div > p > a').innerText;

                // Add a submit event listener
                customRaceButton.addEventListener('click', function(event) {
                    trackName = document.querySelector('#select-racing-track-button > span.ui-selectmenu-status').innerText;
                    laps = document.querySelector('#createCustomRace > div.form-custom > ul.column.right > li.laps-wrap > div.input-wrap > input[type=text]').value;
                    raceName = document.querySelector('#racename').value;
                    startTime = document.querySelector('#wait-time-button > span.ui-selectmenu-status').innerText;

                });
                customRaceButton.setAttribute('wildhareListenerOnClick', 'true');
            }
        } else if ( hasRequiredData() ) {
            if (trackName && laps && raceName && !leaderboard.hasAttribute('racePostedToBot')) {
                const playerRaceArray = playerRace.split('-');
                const raceId = playerRaceArray[0];
                const link = `[Join ${playerName}'s race!](https://www.torn.com/loader.php?sid=racing&tab=customrace&section=chooseRacingCar&step=chooseRacingCar&id=${raceId})`
                const resultsLink = `[Results Link](https://www.torn.com/loader.php?sid=racing&tab=log&raceID=${raceId})`;
                console.log(link);
                const payloadContent = `**${link}**\n**Race Name:** ${raceName} | **Track:** ${trackName} | **Laps:** ${laps} | **Start Time:** ${startTime}\n[${resultsLink}]`
                const payload = {
                    content: payloadContent
                };
                GM_xmlhttpRequest({
                    method: 'POST', // Specify the HTTP method
                    url: discordWebHookUrl, // Replace with your API endpoint URL
                    headers: {
                        'Content-type': 'application/json'
                    },
                    data: JSON.stringify(payload),
                    onload: function(responseDetails) {
                        // Handle the API response here
                        console.log("API response:", responseDetails.responseText);
                    },
                    onerror: function(responseDetails) {
                        // Handle errors here
                        console.error("API error:", responseDetails);
                    }
                });
                trackName = undefined;
                laps = undefined;
                raceName = undefined;
                leaderboard.setAttribute('racePostedToBot', 'true');
            }

        }
    });

    customRaceObserver.observe(document.body, { childList: true, subtree: true });

})();