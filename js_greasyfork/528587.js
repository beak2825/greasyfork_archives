// ==UserScript==
// @name         Hide Long Races
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Hide races with more than 5 laps unless they allow any car
// @author       YoYo
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528587/Hide%20Long%20Races.user.js
// @updateURL https://update.greasyfork.org/scripts/528587/Hide%20Long%20Races.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Enhanced Race Filter script loaded.");

    function addRefreshButton() {
        if (document.getElementById("refreshRacesBtn")) return;

        let refreshBtn = document.createElement("button");
        refreshBtn.id = "refreshRacesBtn";
        refreshBtn.textContent = "Refresh Races";
        refreshBtn.style.position = "fixed";
        refreshBtn.style.top = "10px";
        refreshBtn.style.right = "10px";
        refreshBtn.style.padding = "10px";
        refreshBtn.style.background = "#333";
        refreshBtn.style.color = "white";
        refreshBtn.style.border = "none";
        refreshBtn.style.cursor = "pointer";
        refreshBtn.style.zIndex = "1000";
        refreshBtn.style.borderRadius = "5px";
        refreshBtn.onclick = () => {
            console.log("Refresh button clicked, re-filtering races...");
            filterRaces();
        };

        document.body.appendChild(refreshBtn);
    }

    function showNoRacesMessage() {
        if (document.getElementById("noRacesMsg")) return;

        let message = document.createElement("div");
        message.id = "noRacesMsg";
        message.textContent = "No races found.";
        message.style.color = "red";
        message.style.fontSize = "20px";
        message.style.textAlign = "center";
        message.style.marginTop = "20px";

        let raceContainer = document.querySelector(".custom-events-wrap");
        if (raceContainer) {
            raceContainer.appendChild(message);
        }
    }

    function hideNoRacesMessage() {
        let message = document.getElementById("noRacesMsg");
        if (message) message.remove();
    }

    function filterRaces() {
        console.log("Checking races for filtering criteria...");

        let raceElements = document.querySelectorAll(".events-list li");
        let validRaceFound = false;

        raceElements.forEach(li => {
            let hideRace = false;

            // Extract lap count
            let lapsElement = li.querySelector(".laps");
            if (lapsElement) {
                let lapsMatch = lapsElement.textContent.match(/\d+/);
                if (lapsMatch) {
                    let laps = parseInt(lapsMatch[0], 10);
                    console.log(`Race detected with ${laps} laps.`);
                    if (laps > 5) {
                        console.log(`Hiding race: More than 5 laps (${laps} laps).`);
                        hideRace = true;
                    }
                }
            }

            // Extract current and max number of drivers (should be exactly "1 / 2")
            let driversElement = li.querySelector(".drivers");
            if (driversElement) {
                let driversMatch = driversElement.textContent.match(/(\d+)\s*\/\s*(\d+)/);
                if (driversMatch) {
                    let currentDrivers = parseInt(driversMatch[1], 10);
                    let maxDrivers = parseInt(driversMatch[2], 10);
                    console.log(`Race current/max drivers: ${currentDrivers}/${maxDrivers}`);
                    if (currentDrivers !== 1 || maxDrivers !== 2) {
                        console.log(`Hiding race: Does not have exactly 1/2 drivers.`);
                        hideRace = true;
                    }
                }
            }

            // Check for password protection
            let passwordElement = li.querySelector(".password.protected");
            if (passwordElement) {
                console.log("Hiding race: Password-protected.");
                hideRace = true;
            }

            // Check for race start time (should be "waiting" for instant start)
            let startTimeElement = li.querySelector(".startTime");
            if (startTimeElement) {
                let startTime = startTimeElement.textContent.trim().toLowerCase();
                console.log(`Race start time: ${startTime}`);
                if (startTime !== "waiting") {
                    console.log("Hiding race: Not starting immediately.");
                    hideRace = true;
                }
            }

            // Check if race requires a specific car (should allow any car)
            let carElement = li.querySelector(".car");
            if (carElement) {
                let carRequirement = carElement.textContent.trim().toLowerCase();
                console.log(`Car requirement detected: "${carRequirement}"`);
                if (!carRequirement.includes("any car")) { 
                    console.log("Hiding race: Requires a specific car.");
                    hideRace = true;
                }
            }

            // Hide or keep the race
            if (hideRace) {
                li.style.display = "none";
            } else {
                li.style.display = "";
                validRaceFound = true;
            }
        });

        // Display "No races found" message if no valid races exist
        if (!validRaceFound) {
            showNoRacesMessage();
            console.log("No valid races found.");
        } else {
            hideNoRacesMessage();
        }

        console.log("Race filtering process completed.");
    }

    // Run filtering and add UI elements after page load
    window.addEventListener("load", () => {
        console.log("Page loaded, running race filter...");
        filterRaces();
        addRefreshButton();
    });

    // Mutation observer to detect dynamic updates to the race list
    const observer = new MutationObserver(() => {
        console.log("Detected changes in race list, re-checking...");
        filterRaces();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Mutation observer started, waiting for race list updates...");
})();
