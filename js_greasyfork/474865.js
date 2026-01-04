// ==UserScript==
// @name         Offline Torntools
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hopefully this will open up a player stat box similar to torntools but without the API request
// @author       Toilet [2241143]
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474865/Offline%20Torntools.user.js
// @updateURL https://update.greasyfork.org/scripts/474865/Offline%20Torntools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Pull the player ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("XID");

    if (playerId) {
        // URL of the hosted JSON file on GitHub
        const jsonUrl = "https://raw.githubusercontent.com/toiletwritescode/offline-torntools/main/elim_players.json";

        // Check if cached data is available
        const cachedData = localStorage.getItem("cachedPlayerData");

        if (cachedData) {
            // Use cached data
            const parsedData = JSON.parse(cachedData);
            const playerInfo = parsedData.find(player => player.player_id == playerId);
            if (playerInfo) {
                // Display the player info
                displayPlayerInfo(playerInfo);
            } else {
                console.error("Player not found in cached data");
            }
        } else {
            // Fetch player info from JSON
            fetch(jsonUrl)
                .then(response => {
                    if (!response.ok) {
                        console.error("Fetch failed with status:", response.status);
                        return Promise.reject("Fetch failed");
                    }
                    return response.json();
                })
                .then(data => {
                    // Find the player info by matching player_id
                    const playerInfo = data.find(player => player.player_id == playerId);
                    if (playerInfo) {
                        // Display the player info
                        displayPlayerInfo(playerInfo);

                        // Cache the response
                        localStorage.setItem("cachedPlayerData", JSON.stringify(data));
                    } else {
                        console.error("Player not found in JSON data");
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                });
        }
    } else {
        console.error("Player ID not found in the URL");
    }


    // Function to display player info
    function displayPlayerInfo(data) {
        // Check if the "team" is not NULL or religious extremists
        if (data.team !== null && data.team !== "religious-extremists") {
            // Determine if dark mode is enabled by checking for the "dark-mode" class on the body element
            const bodyElement = document.body;
            const isDarkMode = bodyElement.classList.contains("dark-mode");

            // Set the highlight background color based on the mode
            const highlightColor = isDarkMode ? "#848634" : "#fbff71";

            // Create a div element with appropriate background, text, and border colors
            const playerInfoDiv = document.createElement("div");
            playerInfoDiv.style.padding = "10px";
            playerInfoDiv.style.border = "1px solid #ccc";
            playerInfoDiv.style.backgroundColor = isDarkMode ? "#333" : "#f0f0f0";
            playerInfoDiv.style.color = isDarkMode ? "#fff" : "#000";

            playerInfoDiv.innerHTML = `
                <p><strong>Xanax Taken:</strong> ${data.xantaken.toLocaleString()}</p>
                <p><strong>Energy Drinks Used:</strong> ${data.energydrinkused.toLocaleString()}</p>
                <p><strong>Energy Refills:</strong> ${data.refills.toLocaleString()}</p>
                <p><strong>Stat Enhancers Used:</strong> ${data.statenhancersused.toLocaleString()}</p>
                <div style="background-color: ${highlightColor};">
                    <p><strong>Stat Estimate*:</strong> ${data.stat_est !== null ? data.stat_est.toLocaleString() : 'N/A'}</p>
                    <p><strong>Minimum Stats*:</strong> ${data.minimum_stats !== null ? data.minimum_stats.toLocaleString() : 'N/A'}</p>
                    <p><strong>Maximum Stats*:</strong> ${data.maximum_stats !== null ? data.maximum_stats.toLocaleString() : 'N/A'}</p>
                </div>
                <div style="background-color: ${highlightColor}; padding: 5px;">
                    <em>*Stat Estimates based upon Toilet's BSP cache, min and max estimate based upon Tiksan's prediction code</em>
                </div>
            `;
    }
    }
})();
