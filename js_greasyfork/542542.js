// ==UserScript==
// @name         Not a Bot
// @namespace    notbot
// @version      1.2.1
// @description  Trying to do something
// @author       Your Friend
// @match        https://www.edominacy.com/en/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542542/Not%20a%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/542542/Not%20a%20Bot.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to perform an action if battleID is not 0
    async function doSomething() {
        const battleId = getLocalStorageData(keys.battleID);
        const side = getLocalStorageData(keys.side);
        const weaponID = getLocalStorageData(keys.weaponID);
        const weaponQ = getLocalStorageData(keys.weaponQ);
        const speed = getLocalStorageData(keys.speed);
        const OH = getLocalStorageData(keys.hit);

        logMessage('Check Battle');
        let urlCheck = `https://www.edominacy.com/en/battlefield-update/1/${battleId}/${side}/0/0`;
        const data = await PostRequest(urlCheck);
        if (data) {
            const dataObj = parseServerResponse(data);
            console.log(dataObj);
            if (dataObj[0].STATUS == 1) {
                logMessage(`ongoing battle ${battleId}`);
                //continue to check in this bracket <-----------------------------
                let end = "0";
                while (end === "0") {
                    let urlRound = `https://www.edominacy.com/en/battlefield-update/7/${battleId}/${side}/0/0`;
                    try {
                        const round = await PostRequest(urlRound); // Await the result of the asynchronous request
                        if (round) {
                            const dataRound = parseServerResponse(round); // Parse the response
                            if (dataRound[0].STATUS == 1) {
                                console.log(dataRound); // Log the data if STATUS is 1
                                const r = dataRound[0];
                                const time = r.COUNTDOWN;
                                const {
                                    serverSyncTimestamp,
                                    untilValue
                                } = extractCountdownValues(time);
                                console.log(untilValue);

                                if (untilValue === null) {
                                    await delay(30000);
                                    reloadPage();
                                }

                                logMessage(`ROUND ${r.ROUND} end in ${untilValue} seconds or ${secondsToHHMMSS(untilValue)}`);
                                if(side == 1){
                                    logMessage(`CURRENT SIDE: BLUE`);
                                } else if(side == 2){
                                    logMessage(`CURRENT SIDE: RED`);
                                }
                                logMessage(`blue damage: ${r.A_DMG} : ${r.VAL_A}% : ${r.ROUND_A} POINT `);
                                logMessage(`red damage: ${r.D_DMG} : ${r.VAL_D}% : ${r.ROUND_D} POINT`);

                                if (untilValue <= OH) {
                                    const urlAttack = `https://www.edominacy.com/en/battlefield-update/4/${battleId}/${side}/${weaponID}/${weaponQ}/${speed}`;
                                    const urlEB = `https://www.edominacy.com/en/battlefield-update/2/${battleId}/${side}/11/5/${speed}`;

                                    let energy = 500;
                                    let ready = 1;
                                    while (energy >= 500 && ready == 1){
                                        const attack = await PostRequest(urlAttack);
                                        const energyLeft = attack[0].ENERGY;
                                        const status = attack[0].STATUS;
                                        logMessage(`ENERGY: ${energyLeft}`);
                                        await delay(3100);
                                        energy = energyLeft;
                                        ready = status;
                                        if(energyLeft < 1300){
                                            //refill energy with EB
                                            await PostRequest(urlEB);
                                            await delay(3100);
                                            logMessage(`recharge`);
                                        }
                                        if (status !== 1){
                                            await delay(5000);
                                            reloadPage();
                                        }
                                    }

                                    logMessage(`WAITING`);
                                    await delay(5000);
                                    reloadPage();


                                } else {
                                    const nextCheck = untilValue - OH;
                                    const delayTime = nextCheck * 999;
                                    logMessage(`next check in ${nextCheck}`);
                                    await delay(delayTime);
                                }
                                logMessage('---------');
                            }
                            end = dataRound[0].END; // Update the end variable


                            // Wait for 10 seconds before making the next request
                            await delay(60000);
                        }
                    } catch (error) {
                        console.error('Error fetching or processing data:', error);
                        // Optional: Handle error or retry
                    }
                } //end of loop


            } else {
                logMessage('ended battle');
            }
        } else {
            console.error("Failed to retrieve data.");
        }
    }

    // Data keys
    const keys = {
        battleID: 'battleID',
        side: 'side',
        weaponID: 'weaponID',
        weaponQ: 'weaponQ',
        speed: 'speed',
        hit: 'hit',
    };

    // Function to create and show modal
    async function createModal() {
        // Check if the modal already exists
        if (document.getElementById('myModal')) {
            return; // Exit if modal is already present
        }

        // Initialize toggle button state using getLocalStorageData
        const toggleState = getLocalStorageData('toggleState');
        const buttonText = toggleState === '1' ? 'ON' : 'OFF';

        // Create modal HTML
        const modalHTML = `
        <div id="myModal" style="display:block; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
            <div style="background-color:white; margin:15% auto; padding:20px; border:1px solid #888; width:900px; max-width:90%; position:relative; display:flex;">
                <div style="flex:1; padding:10px;">
                    <span id="closeModal" style="position:absolute; top:10px; right:10px; cursor:pointer; font-size:20px;">&times;</span>
                    <div style="margin-bottom:10px; display:flex; align-items:center;">
                        <label for="toggleButton" style="font-size:16px; margin-right:10px;">POWER State:</label>
                        <button type="button" id="toggleButton" style="padding:5px 10px; font-size:16px;">${buttonText}</button>
                    </div>
                    <form id="dataForm" style="width:200px;">
                        <label for="battleID">Battle ID:</label><br>
                        <input type="text" id="battleID" value="${getLocalStorageData(keys.battleID)}"><br>
                        <label for="side">Side:</label><br>
                        <input type="text" id="side" value="${getLocalStorageData(keys.side)}"><br>
                        <label for="weaponID">Weapon ID:</label><br>
                        <input type="text" id="weaponID" value="${getLocalStorageData(keys.weaponID)}"><br>
                        <label for="weaponQ">Weapon Q:</label><br>
                        <input type="text" id="weaponQ" value="${getLocalStorageData(keys.weaponQ)}"><br>
                        <label for="speed">Speed:</label><br>
                        <input type="text" id="speed" value="${getLocalStorageData(keys.speed)}"><br>
                        <label for="hit">Hit (seconds) before end:</label><br>
                        <input type="text" id="hit" value="${getLocalStorageData(keys.hit)}"><br><br>
                        <button type="button" id="saveData">Save</button>
                    </form>
                </div>
                <div id="logArea" style="flex:1; padding:10px; border-left:1px solid #888; overflow-y:auto; max-height:400px; background-color:#f9f9f9;">
                    <!-- Log messages will be added here -->
                </div>
            </div>
        </div>
    `;

        // Append modal to the body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get modal, close elements, and toggle button
        const modal = document.getElementById('myModal');
        const closeModal = document.getElementById('closeModal');
        const saveButton = document.getElementById('saveData');
        const toggleButton = document.getElementById('toggleButton');

        // Show modal
        modal.style.display = 'block';

        // Close modal when 'X' is clicked
        closeModal.onclick = function() {
            modal.style.display = 'none';
        };

        // Close modal when clicking outside of the modal content
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };

        // Save data to local storage when the save button is clicked
        saveButton.onclick = function() {
            saveLocalStorageData();
        };

        // Toggle button functionality
        toggleButton.onclick = function() {
            const isOn = toggleButton.textContent === 'ON';
            // Update button text
            toggleButton.textContent = isOn ? 'OFF' : 'ON';
            // Update local storage immediately
            localStorage.setItem('toggleState', isOn ? '0' : '1');
            // Log the state change
            logMessage(isOn ? 'Toggle switched OFF' : 'Toggle switched ON');
            reloadPage();
        };

        // Call doSomething() when the modal is created if battleID is not 0
        const isOn = getLocalStorageData('toggleState');
        const battleID = document.getElementById('battleID').value;
        if (isOn == 1 && battleID !== '0') {
            await delay(1000);
            await doSomething();
        } else if (isOn == 0) {
            logMessage(`BOT is OFF, please turn it ON`);
        }
    }

    // Function to introduce a delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to observe DOM changes and create the modal
    async function observeAndCreateModal() {
        // Introduce a delay before starting to observe
        await delay(2000); // Adjust the delay as needed

        let triggerCount = 0; // Counter for MutationObserver triggers
        const maxTriggers = 3; // Limit for triggers

        console.log("Starting MutationObserver"); // Debugging

        const observer = new MutationObserver((mutationsList) => {
            console.log("MutationObserver triggered"); // Debugging
            triggerCount += 1;

            // Check if the modal already exists
            if (!document.getElementById('myModal')) {
                createModal();
            }

            // Stop observing after reaching the trigger limit
            if (triggerCount >= maxTriggers) {
                console.log("Stopping MutationObserver"); // Debugging
                observer.disconnect();
            }
        });

        // Start observing the document for changes
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // Function to get data from local storage or set default value
    function getLocalStorageData(key) {
        let value = localStorage.getItem(key);
        if (value === null) {
            value = '0'; // Default value is '0'
            localStorage.setItem(key, value);
        }
        return value;
    }

    // Function to save data to local storage
    function saveLocalStorageData() {
        for (const [key, id] of Object.entries(keys)) {
            const input = document.getElementById(id);
            localStorage.setItem(key, input.value);
        }
        logMessage('NEW SETTING UPDATED');
        reloadPage();
    }

    function reloadPage() {
        window.location.href = "https://www.edominacy.com/en/index";
    }

    // Function to log messages to the log area
    function logMessage(message) {
        const logArea = document.getElementById('logArea');
        if (logArea) {
            const logEntry = document.createElement('p');
            logEntry.textContent = message;
            logArea.appendChild(logEntry);
            // Scroll to the bottom of the log area
            logArea.scrollTop = logArea.scrollHeight;
        }
    }

    async function PostRequest(url) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    // Function to process the JSON data
    function parseServerResponse(response) {
        try {
            // Additional processing if necessary
            if (response.BH_D) {
                // Example: Stripping HTML tags and handling escaped characters
                response.BH_D = response.BH_D.replace(/<\/?[^>]+(>|$)/g, "");
            }

            return response;
        } catch (error) {
            console.error("Failed to process response:", error);
            return null;
        }
    }

    function extractCountdownValues(countdownHtml) {
        // Regular expression to extract the serverSync date string
        const serverSyncRegex = /serverSync: '([^']+)'/;
        const matchServerSync = countdownHtml.match(serverSyncRegex);

        // Regular expression to extract the 'until' value
        const untilRegex = /until: \+(\d+)/;
        const matchUntil = countdownHtml.match(untilRegex);

        let serverSyncTimestamp = null;
        let untilValue = null;

        // Extract and convert the serverSync date string to Unix timestamp
        if (matchServerSync && matchServerSync[1]) {
            const serverSyncString = matchServerSync[1];
            const serverSyncDate = new Date(serverSyncString);
            serverSyncTimestamp = Math.floor(serverSyncDate.getTime() / 1000);
        } else {
            console.error('serverSync date string not found.');
        }

        // Extract the 'until' value
        if (matchUntil && matchUntil[1]) {
            untilValue = parseInt(matchUntil[1], 10);
        } else {
            console.error('until value not found.');
        }

        return {
            serverSyncTimestamp,
            untilValue
        };
    }

    function secondsToHHMMSS(seconds) {
        // Ensure seconds is a positive integer
        seconds = Math.max(0, parseInt(seconds, 10));

        // Calculate hours, minutes, and remaining seconds
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        // Format each part to be two digits (pad with leading zeros if needed)
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(secs).padStart(2, '0');

        // Combine into HH:MM:SS format
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    // Call observeAndCreateModal when the page fully loads
    //window.addEventListener('load', observeAndCreateModal);
    observeAndCreateModal();
})();