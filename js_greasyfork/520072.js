// ==UserScript==
// @name         Torn Territory War Slot Notifier TEST
// @namespace    https://www.torn.com/
// @version      0.1
// @description  Notify when there’s a slot to join a territory war.
// @author       User
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520072/Torn%20Territory%20War%20Slot%20Notifier%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/520072/Torn%20Territory%20War%20Slot%20Notifier%20TEST.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
    const TIMESTAMP_KEY = "1previousWallSlotCheck";
    const API_KEY_STORAGE = "1publicAPIKey";
    const FACTION_ID_STORAGE = "1wallSlotFactionID";
    const LAST_DATA_STORAGE = "1wallSlotLastData";

    // Globals
    let globalAssaultersOrDefendersLength = 0;
    let globalDefendingFaction = null;
    let globalTerritoryID = null;

    // Initialize
    const now = Date.now();
    let lastCheck = parseInt(localStorage.getItem(TIMESTAMP_KEY) || "0", 10);
    console.log(lastCheck);

    // Fetch or prompt for API key
    let publicAPIKey = localStorage.getItem(API_KEY_STORAGE);
    if (!publicAPIKey) {
        addAPIKeyInput();
        return;
    }
    
    // Check if last check was too recent
    if (now - lastCheck < CHECK_INTERVAL) {
        console.log("Using cached data for notification.");
        const lastData = JSON.parse(localStorage.getItem(LAST_DATA_STORAGE));
        if (lastData) {
            globalAssaultersOrDefendersLength = lastData.globalAssaultersOrDefendersLength;
            globalDefendingFaction = lastData.globalDefendingFaction;
            globalTerritoryID = lastData.globalTerritoryID;
            
            if (lastData.difference > 0) {
                displayNotification(lastData.difference, globalTerritoryID);
            }
        } else {
            console.warn("No cached data found for previous notification.");
        }
        return;
    }
    localStorage.setItem(TIMESTAMP_KEY, now);

    // Main logic
    startMainFunction(publicAPIKey);

    // Add input for public API key
    function addAPIKeyInput() {
        const banner = document.querySelector("#topHeaderBanner");
        if (!banner) {
            console.warn("Top header banner not found.");
            return;
        }

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter Public API Key";
        input.style.margin = "5px";
        input.style.backgroundColor = "#333"; // Dark background
        input.style.color = "#fff"; // Light text
        input.style.border = "1px solid #555"; // Subtle border
        input.style.padding = "10px";
        input.style.borderRadius = "5px"; // Rounded edges

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.margin = "5px";
        saveButton.style.backgroundColor = "#444"; // Darker background for the button
        saveButton.style.color = "#fff"; // Light text
        saveButton.style.border = "1px solid #555"; // Subtle border
        saveButton.style.padding = "10px 15px";
        saveButton.style.borderRadius = "5px"; // Rounded edges
        saveButton.style.cursor = "pointer"; // Pointer cursor on hover
        saveButton.style.transition = "background-color 0.3s"; // Smooth hover transition

        saveButton.addEventListener("click", () => {
            const key = input.value.trim();
            if (key) {
                localStorage.setItem(API_KEY_STORAGE, key);
                banner.removeChild(input);
                banner.removeChild(saveButton);
                startMainFunction(key);
            } else {
                alert("Please enter a valid API key.");
            }
        });

        banner.appendChild(input);
        banner.appendChild(saveButton);
    }

    // Main function
    function startMainFunction(apiKey) {
        let factionID = localStorage.getItem(FACTION_ID_STORAGE);
        if (!factionID) {
            fetchFactionID(apiKey);
        } else {
            fetchTerritoryWars(apiKey, factionID);
        }
    }

    // Fetch faction ID
    function fetchFactionID(apiKey) {
        fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}&comment=wallslots`)
            .then((response) => response.json())
            .then((data) => {
                const factionID = data?.faction?.faction_id;
                if (factionID) {
                    localStorage.setItem(FACTION_ID_STORAGE, factionID);
                    console.log("Faction ID saved:", factionID);
                    fetchTerritoryWars(apiKey, factionID);
                } else {
                    console.error("Faction ID not found in API response.");
                }
            })
            .catch((error) => {
                console.error("Error fetching faction ID:", error);
            });
    }

    function fetchTerritoryWars(apiKey, factionID) {
        fetch(`https://api.torn.com/torn/?selections=territorywars&key=${apiKey}&comment=wallslots`)
            .then((response) => response.json())
            .then((data) => {
                const wars = data.territorywars;
                for (const [territoryID, war] of Object.entries(wars)) {
                    if (war.assaulting_faction == factionID || war.defending_faction == factionID) {
                        const isAssaulting = war.assaulting_faction == factionID;
                        globalAssaultersOrDefendersLength = (war.assaulters.length + war.defenders.length);
                        globalDefendingFaction = war.defending_faction;
                        globalTerritoryID = territoryID;

                        fetchTerritoryDetails(apiKey);
                        break;
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching territory wars:", error);
            });
    }

    // Fetch territory details
    function fetchTerritoryDetails(apiKey) {
        fetch(`https://api.torn.com/faction/${globalDefendingFaction}?selections=territory&key=${apiKey}&comment=wallslots`)
            .then((response) => response.json())
            .then((data) => {
                const territory = data.territory[globalTerritoryID];
                if (territory) {
                    const slots = territory.slots;
                    const difference = slots - globalAssaultersOrDefendersLength;

                    if (difference > 0) {
                        displayNotification(difference, globalTerritoryID);
                    }

                    // Save the data
                    const lastData = {
                        globalAssaultersOrDefendersLength,
                        globalDefendingFaction,
                        globalTerritoryID,
                        difference,
                    };
                    localStorage.setItem(LAST_DATA_STORAGE, JSON.stringify(lastData));
                    console.log("Last data saved:", lastData);
                } else {
                    console.error("Territory ID not found in API response.");
                }
            })
            .catch((error) => {
                console.error("Error fetching territory details:", error);
            });
    }

    // Display notification
    function displayNotification(difference, territoryID) {
        const banner = document.querySelector("#topHeaderBanner");
        if (!banner) {
            console.warn("Top header banner not found.");
            return;
        }

        const span = document.createElement("span");
        span.textContent = `There are ${difference} wall slots available for ${territoryID}`;
        span.style.margin = "5px";
        span.style.color = "#fff"; // Light text for contrast
        span.style.backgroundColor = "#232323"; // Dark background
        span.style.padding = "8px 12px"; // Adds spacing around the text
        span.style.borderRadius = "5px"; // Rounded corners
        span.style.fontWeight = "bold"; // Emphasized text
        span.style.border = "1px solid #444"; // Subtle border for separation
        span.style.display = "inline-block"; // Ensures the span maintains padding

        banner.appendChild(span);
    }
})();
