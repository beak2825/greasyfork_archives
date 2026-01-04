// ==UserScript==
// @name         Fight Code
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Communicates with specified URL to update item with query parameters
// @author       me
// @match        https://www.torn.com/loader.php?sid=attack*
// @require      https://update.greasyfork.org/scripts/489910/1344904/FightButtonLibrary.js
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/489908/Fight%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/489908/Fight%20Code.meta.js
// ==/UserScript==

/* global updateItemLibrary */

(function() {
    'use strict';

    let apiCount = 0;
    let fightStarted = false; // Flag to indicate whether the fight has started successfully

    if (window.location.href.includes("attackLog")) {
        return; // Exit the script if the URL includes "attackLog"
    }

    // Make sure the library has been loaded
    if (window.updateItemLibrary && typeof window.updateItemLibrary.startProcess === "function") {
        window.updateItemLibrary.startProcess();

        const userId = getUserIdFromUrl();
        const apiKey = getApiKey();
        const apiEndpoint = `https://api.torn.com/user/${userId}?selections=basic,personalstats,profile&key=${apiKey}`;
        const tornCoverDiv = document.getElementById('tornCoverDiv');
        const tornInfoDiv = document.getElementById('tornInfoDiv');
        const tornNewButton = document.getElementById('tornNewButton');
        


        tornNewButton.addEventListener("click", async () => {
            const sfightValue = getSFight();
            //alert(sfightValue);
            const url = window.location.href;
            const x = url.indexOf("ID=");
            const ID = url.substring(x + 3);
            const step = sfightValue;

            // Attempt to start the fight without refreshing the page
           
            await startFight(step);
            location.reload();
            // If starting the fight fails, retry with a page refresh
            if (!fightStarted) {
                
                //alert("Fight not started")
            }
        });

        // Check if my status is OK to start the action
        fetchUser(apiKey)
            .then(function(myData) {
                if (myData.status.state === "Okay" && myData.energy.current >= 25) {
                    startAction(userId, apiKey);
                } else {
                    //alert("You are not able to fight");
                }
            })
            .catch(function(error) {
                console.error("Error fetching user data:", error);
            });

        // Get the API key from storage
        function getApiKey() {
            return GM_getValue("apiKey");
        }

        // Get the UserID for opponent
        function getUserIdFromUrl() {
            const userIdMatch = window.location.href.match(/user2ID=(\d+)/);
            return userIdMatch ? userIdMatch[1] : null;
        }

        // Handle API request errors
        function handleApiError(error) {
            console.error('API Request Failed:', error);
            alert('API Request Failed: ' + error.message); // Display error message
        }

        async function startFight(step) {
            try {
                await fetch("/loader.php?sid=attackData&mode=json", {


                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest",
                    },
                    body: step,
                });
                fightStarted = true; // Set flag to indicate fight started successfully
            } catch (error) {
                console.error("Error starting fight:", error);
                fightStarted = false; // Set flag to indicate fight failed to start
            }
        }

        // Display the data in the Div
        function displayData(apiCount, data, infoDiv, coverDiv) {
            const currentTime = Math.floor(Date.now() / 1000);
            const timeDifference = calculateTimeDifference(currentTime, data.status.until);
            coverDiv.innerHTML = `<strong style="font-size: 30px;">Count-Down: ${timeDifference}</strong>`;
            infoDiv.innerHTML = `
                <div style="text-align: left; margin-bottom: 3%;">Name: ${data.name}</div>
                <div style="text-align: left; margin-bottom: 3%;">ID: ${data.player_id}</div>
                <div style="text-align: left; margin-bottom: 3%;">Level: ${data.level}</div>
                <div style="text-align: left; margin-bottom: 3%;">Age: ${data.age}</div>
                <div style="text-align: left;margin-bottom: 6%;">Status: ${data.status.state}</div>
                <div style="text-align: left; margin-bottom: 3%;">Attacks Won: ${data.personalstats.attackswon}</div>
                <div style="text-align: left; margin-bottom: 3%;">Time Played: ${data.personalstats.useractivity.toLocaleString('en-US')}</div>
                <div style="text-align: left; margin-bottom: 3%;">Best Damage: ${data.personalstats.bestdamage}</div>
                <div style="text-align: left; margin-bottom: 3%;">Highest Level Beaten: ${data.personalstats.highestbeaten}</div>
                <div style="text-align: left; margin-bottom: 3%;">Stat Enhancers Used: ${data.personalstats.statenhancersused}</div>
                <div style="text-align: left; margin-bottom: 3%;">Networth: ${data.personalstats.networth.toLocaleString('en-US')}</div>
                <div style="text-align: left; margin-bottom: 3%;">Xanax Used: ${data.personalstats.xantaken}</div>
                <div style="text-align: left; margin-bottom: 3%;">Energy Drink Used: ${data.personalstats.energydrinkused}</div>
                <div style="text-align: left; margin-bottom: 3%;">Energy Refills: ${data.personalstats.refills}</div>
                <div style="text-align: left; margin-bottom: 3%;">API-Count: ${apiCount}</div>
            `;
            if (data.status.until <= currentTime) {
                tornNewButton.disabled = false;
                tornNewButton.textContent = 'ATTACK';
                tornNewButton.style.color = 'red';
                tornNewButton.style.zIndex = '100000';
            } else {
                setTimeout(() => fetchData(apiEndpoint, infoDiv, coverDiv), 1000);
            }
        }

        // Function to calculate time difference between two timestamps in HH:mm:ss format
        function calculateTimeDifference(currentTime, targetTime) {
            const timeDifference = Math.max(targetTime - currentTime, 0); // Ensure non-negative value
            const hours = Math.floor(timeDifference / 3600);
            const minutes = Math.floor((timeDifference % 3600) / 60);
            const seconds = timeDifference % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Fetch user data
        function fetchUser(apiKey) {
            const apiEndpoint = `https://api.torn.com/user/?selections=basic,bars&key=${apiKey}`;
            return fetch(apiEndpoint)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                });
        }

        // Function to fetch data from the API
        function fetchData(apiEndpoint, infoDiv, coverDiv) {
            const maxRetries = 30;
            let retryCount = 0;

            function fetchWithRetry() {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiEndpoint,
                    onload: function(response) {
                        const data = JSON.parse(response.responseText);
                        apiCount++;
                        displayData(apiCount, data, infoDiv, coverDiv);
                    },
                    onerror: function(error) {
                        handleApiError(error); // Handle API request error
                        if (retryCount < maxRetries) {
                            //alert('Retrying in 2 seconds...');
                            setTimeout(fetchWithRetry, 2000); // Retry after 2 seconds
                            retryCount++;
                        } else {
                            alert('API problem - cannot get data from API after 5 retries - please refresh the page');
                        }
                    }
                });
            }

            // Start the initial fetch attempt
            fetchWithRetry();
        }

        // Start the action
        function startAction(userId, apiKey) {
            if (tornCoverDiv && tornInfoDiv && tornNewButton) {
                tornCoverDiv.style.display = 'block';
                tornInfoDiv.style.display = 'block';
                tornNewButton.style.display = 'block';

                fetchData(apiEndpoint, tornInfoDiv, tornCoverDiv); // Start fetching data
            } else {
                alert("One or more elements not found.");
            }
        }
    } else {
        console.error("updateItemLibrary is not defined or startProcess function is missing.");
    }
})();
