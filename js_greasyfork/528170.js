// ==UserScript==
// @name         Assist Caller
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add a button to the game and send a message to Discord via a webhook when clicked
// @author       Hwa
// @match        https://www.torn.com/loader.php?sid=attack&user*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/528170/Assist%20Caller.user.js
// @updateURL https://update.greasyfork.org/scripts/528170/Assist%20Caller.meta.js
// ==/UserScript==

function getAssistData(userID) {
    const assistData = JSON.parse(localStorage.getItem("assistData")) || {};
    return assistData[userID] || { smoke: 2, tear: 0 }; // Return user data or default values
}

function saveAssistData(userID, smoke, tear) {
    let assistData = JSON.parse(localStorage.getItem("assistData")) || {};
    assistData[userID] = { smoke: smoke, tear: tear }; // Update the specific user's data
    localStorage.setItem("assistData", JSON.stringify(assistData));
}


(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user2ID');
    let playerNames = [];
    const storedData = getAssistData(userId);
    console.log(storedData);

    function updateButtonColor(button) {
        if (button.disabled) {
            button.style.backgroundColor = "#B0B0B0"; // Grey when disabled
            button.style.cursor = "not-allowed"; // Change cursor to indicate it's disabled
        } else {
            button.style.backgroundColor = "#7289DA"; // Original color when enabled
            button.style.cursor = "pointer"; // Default cursor
        }
    }

    function addButton() {
        const container = document.querySelector('[class*="appHeaderWrapper"]');
        if (container) {
            const controlDiv = document.createElement('div');
            controlDiv.style.display = "flex";
            controlDiv.style.alignItems = "center";
            controlDiv.style.gap = "1%";
            controlDiv.style.marginRight = "10px";

            //message
            const response = document.createElement('label');
            response.textContent = "";
            response.style.display = "none";

            // smoke input
            const smokeLabel = document.createElement('label');
            smokeLabel.textContent = "Smoke: ";
            const smokeInput = document.createElement('input');
            smokeInput.type = "number";
            smokeInput.value = storedData.smoke;
            smokeInput.style.width = "25px";
            smokeInput.style.marginRight = "2%";
            smokeInput.addEventListener("input", () => saveAssistData(userId, smokeInput.value, tearInput.value));

            // tear input
            const tearLabel = document.createElement('label');
            tearLabel.textContent = "Tear: ";
            const tearInput = document.createElement('input');
            tearInput.type = "number";
            tearInput.value = storedData.tear;
            tearInput.style.width = "25px";
            tearInput.style.marginRight = "10px";
            tearInput.addEventListener("input", () => saveAssistData(userId, smokeInput.value, tearInput.value));

            // button
            const button = document.createElement('button');
            button.textContent = "Call for Assist";
            button.style.padding = "5px 1%";
            button.style.fontSize = "12px";
            button.style.backgroundColor = "#7289DA";
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.marginLeft = "2%";
            button.style.marginRight = "1%";

            // Add click event to send message
            const sendURL = 'http://52.44.42.138:5001/send_assist_request';
            button.addEventListener('click', function() {
                if (playerNames.length == 0) {
                    const names = document.querySelectorAll('[id^="playername_"]');
                    if (names.length > 0) {
                        playerNames = Array.from(names).map(player => player.textContent.trim());
                        console.log("Playername IDs found:", playerNames);
                    }
                }
                else {
                    console.warn("Playername IDs: ", playerNames);
                }

                const smokeCalls = Number(smokeInput.value)
                const tearCalls = Number(tearInput.value)
                const totalAssisters = smokeCalls + tearCalls
                console.log(`Smoke: ${smokeInput.value}, Tear: ${tearInput.value}: ${totalAssisters}`);

                if (totalAssisters <= 0) {
                    response.textContent = "Can\'t call less than 1 assister. | ";
                    response.style.display = "inline";
                }
                else if (totalAssisters > 10) {
                    response.textContent = "Can\'t call more than 10 assisters. | ";
                    response.style.display = "inline";
                }
                else {
                    response.textContent = "Sent! | ";
                    response.style.display = "inline";
                    button.disabled = true;
                    updateButtonColor(button);

                    const payload = { attack_id: userId, attacker_name: playerNames[1], assist_call_name: playerNames[0], smokes: smokeCalls, tears: tearCalls };
                    console.log(payload);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: sendURL,
                        data: JSON.stringify(payload),
                        headers: { "Content-Type": "application/json" },
                        onload: function() {
                            console.log("Request sent to Discord!");
                        },
                        onerror: function(error) {
                            console.error("Failed to send request:", error);
                        }
                    });
                    setTimeout(() => {
                        button.disabled = false;
                        updateButtonColor(button);
                    }, 3000);
                }
                setTimeout(() => {
                    response.style.display = "none";
                }, 3000);
            });

            const clearButton = document.createElement('button');
            clearButton.textContent = "Clear All Cookies";
            clearButton.style.padding = "5px 1%";
            clearButton.style.fontSize = "12px";
            clearButton.style.backgroundColor = "#ff4d4d";
            clearButton.style.color = "white";
            clearButton.style.border = "none";
            clearButton.style.borderRadius = "5px";
            clearButton.style.cursor = "pointer";
            clearButton.style.marginLeft = "auto"; // Push it to the right

            clearButton.addEventListener('click', () => {
                localStorage.removeItem("assistData"); // Remove only assist-related data
                console.log("All assist data has been cleared!");
            });

            // Append the button to the container
            controlDiv.appendChild(response);
            controlDiv.appendChild(smokeLabel);
            controlDiv.appendChild(smokeInput);
            controlDiv.appendChild(tearLabel);
            controlDiv.appendChild(tearInput);
            controlDiv.appendChild(button);
            controlDiv.appendChild(clearButton);

            // Append the div to the container
            container.appendChild(controlDiv);
        } else {
            console.warn("Container not found. Retrying...");
            setTimeout(addButton, 1000);
        }
    }

    // Run the function to add the button
    addButton();
})();
