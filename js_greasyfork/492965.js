// ==UserScript==
// @name         deez poker
// @namespace    money
// @version      1.2.2
// @description  pokerypokey
// @author       Huntrese [2339855]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.addStyle
// @run-at       document-start
// @license      MIT
// @require      https://www.torn.com/js/script/lib/jquery-1.8.2.js


// @downloadURL https://update.greasyfork.org/scripts/492965/deez%20poker.user.js
// @updateURL https://update.greasyfork.org/scripts/492965/deez%20poker.meta.js
// ==/UserScript==
'use strict';

var playerWrappers = {}; // Hashmap to store player wrappers

if (typeof GM == 'undefined') {
 window.GM = {};
}

if (typeof GM.addStyle == "undefined") { //Add GM.addStyle for browsers that do not support it (e.g. TornPDA, Firefox+Greasemonkey)
    GM.addStyle = function (aCss) {
      'use strict';
      let head = document.getElementsByTagName('head')[0];
      if (head) {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
      }
      return null;
    };
}

const eeeh_observer = new MutationObserver(function(mutations) {
    checkForEgg(); // Check for egg whenever mutation occurs
});

eeeh_observer.observe(document, {attributes: true, childList: true, characterData: true, subtree:true});



function checkForEgg() {
    // Recompute player wrappers
    const playerWrapperElements = document.getElementsByClassName('playerWrapper___wf5jR');
    const currentPlayers = {};
    for (let i = 0; i < playerWrapperElements.length; i++) {
        const playerWrapper = playerWrapperElements[i];
        const playerNameElement = playerWrapper.querySelector('.name___cESdZ');
        if (playerNameElement) {
            const playerName = playerNameElement.textContent.trim();
            currentPlayers[playerName] = playerName; // Store each player's name by their ID
        }
    }

    // Check for removed player wrappers
    const currentPlayerIds = new Set(Object.keys(currentPlayers));
    const previousPlayerIds = new Set(Object.keys(playerWrappers));
    const removedPlayerIds = new Set([...previousPlayerIds].filter(x => !currentPlayerIds.has(x)));

    if (removedPlayerIds.size > 0) {
        console.log('Removed players:', Array.from(removedPlayerIds)); // Print removed players to console
        // Assuming removedPlayerIds contains the names of the players that have disappeared
        removedPlayerIds.forEach(playerName => {
            sendAlert(playerName);
    });
}


    // Update playerWrappers with currentPlayers
    playerWrappers = currentPlayers;
}

function sendAlert(playerName) {
    // Delay the execution of the AJAX request by 1000 milliseconds (1 second)
    setTimeout(function() {
        getAction({
            type: "get",
            action: `/profiles.php?step=getProfileData&NID=${playerName}`,
            success: function(t) {
                console.log(typeof t); // Print the type of t

                // Parse t as JSON
                var jsonData = JSON.parse(t);
                console.log(jsonData['user']['playerName']); // Print the parsed JSON object
                console.log(`https://www.torn.com/loader.php?sid=attack&user2ID=${jsonData['user']['userID']}`); // Print the parsed JSON object

                // Create a custom dialog
                var modal = document.createElement('div');
                modal.innerHTML = `
                    <div style="background-color: rgba(0, 0, 0, 0.5); position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                        <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center;">
                            <p>${playerName} has left, attack?</p>
                            <button id="confirmButton">YES BLYAT</button>
                            <button id="cancelButton">Cancel</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Handle button clicks
                modal.querySelector('#confirmButton').addEventListener('click', function() {
                    window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${jsonData['user']['userID']}`, '_blank');
                    document.body.removeChild(modal);
                });

                modal.querySelector('#cancelButton').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
            }
        });
    }, 200); // Delay in milliseconds
}
