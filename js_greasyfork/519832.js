// ==UserScript==
// @name         Show NPC Time Til Next Level at Loader
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Shows the time til the next level for NPCs at the attack loader page. Uses https://api.lzpt.io/loot to get the data.  Also modifies tab title, disable by modifying IF_UPDATE_TAB_TITLE to false. Offset differences of a few seconds may occur because of difference in time between the server and your device.
// @author       Hesper [2924630]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        GM.xmlHttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519832/Show%20NPC%20Time%20Til%20Next%20Level%20at%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/519832/Show%20NPC%20Time%20Til%20Next%20Level%20at%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Displays time remaining until the next level in the tab title.
    // Set to false to disable
    const IF_UPDATE_TAB_TITLE = true;

    const validIDs = [10, 20, 21, 4, 19, 15, 17];

    // Function to fetch JSON data
    function fetchData() {

        return new Promise((resolve, reject) => {
            const request = GM.xmlHttpRequest || GM.xmlhttpRequest;
            request({
                method: 'GET',
                url: 'https://api.lzpt.io/loot',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);

                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    } else {

                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
          
            
        });
    }

    function calculateTimeRemaining(currentTime, hospOutTime) {
        const levelTimes = [0, 30, 90, 210, 450]; // Minutes after hosp_out for each level
        let nextLevel = 1;
        let timeRemaining = 0;

        if (currentTime < hospOutTime) {
            timeRemaining = hospOutTime - currentTime;
        } else {
            for (let level = 2; level <= 5; level++) {
                const targetTime = hospOutTime + levelTimes[level - 1] * 60; // Convert minutes to seconds
                timeRemaining = targetTime - currentTime;
                // If the time remaining is positive, the current level is the previous level
                if (timeRemaining > 0) {
                    nextLevel = level;
                    break;
                }
            }
        }

        return { nextLevel, timeRemaining: timeRemaining > 0 ? timeRemaining : 0 };
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        if (hours === 0) {
            if (remainingMinutes === 0) {
                return `${remainingSeconds}s`;
            }
            return `${remainingMinutes}m ${remainingSeconds}s`;
        }
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    }

    function updateDiv(npc, currentTime) {

        const hospOutTime = npc.hosp_out;
        const { nextLevel, timeRemaining } = calculateTimeRemaining(currentTime, hospOutTime);
        let level = nextLevel - 1;

        const targetDiv = document.querySelector('.titleContainer___QrlWP');

        if (targetDiv) {

            let newDiv = document.querySelector('#npc-level-info');
            if (!newDiv) {
                newDiv = document.createElement('div');
                newDiv.id = 'npc-level-info';
                newDiv.style.marginTop = '12px';
                newDiv.style.marginRight = '10px';
                newDiv.style.textAlign = 'right';
                newDiv.style.fontSize = '1em';
                newDiv.style.lineHeight = '1.2em';

                targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);
            }
            if (level < 5) {
                newDiv.innerHTML = `Currently <b>Level ${level}</b><br />Time til Level ${level + 1}: <b>${formatTime(timeRemaining)}</b>`;
                if (IF_UPDATE_TAB_TITLE) document.title = `${formatTime(timeRemaining)} til Level ${level + 1} - ${npc.name}`;
            } else {
                newDiv.innerHTML = `Currently <b>Level ${level}</b>`;
                if (IF_UPDATE_TAB_TITLE) document.title = `Level ${level} -  ${npc.name}`;
            }
        }
    }

    async function startUpdating(user2ID) {
        // Check if the user2ID is valid
        const npcData = await fetchData();

        const npc = npcData.npcs[user2ID];
        if (!npc) return;

        // Start updating the timer every second
        setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000);
            updateDiv(npc, currentTime);
        }, 1000);
    }

    // check if the user2ID is valid
    const user2ID = parseInt(new URLSearchParams(window.location.search).get('user2ID'), 10);
    if (validIDs.includes(user2ID)) {
        startUpdating(user2ID);
    }

})();