// ==UserScript==
// @name         Flight Type Identifier (Mobile Compatible)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Identifies the type of flight someone is taking on their profile page and displays it under the travel box (works on mobile and desktop)
// @author       OptimusGrimeDC
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526553/Flight%20Type%20Identifier%20%28Mobile%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526553/Flight%20Type%20Identifier%20%28Mobile%20Compatible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to determine the flight type
    function getFlightType() {
        // Use a more flexible selector to find the profile status element
        const profileStatus = document.querySelector(".profile-status.m-top10.travelling");

        // Check if the profile status element exists and contains the "travelling" class
        if (!profileStatus || !profileStatus.classList.contains("travelling")) {
            return null; // No flight, return null
        }

        // Check for specific classes in the profile status element
        if (profileStatus.classList.contains("airstrip")) {
            return "PI";
        } else if (profileStatus.classList.contains("private")) {
            return "WLT";
        } else {
            return "BCT or Standard"; // Default if neither "airstrip" nor "private" is present
        }
    }

    // Function to display the flight type under the travel box
    function displayFlightType(flightType) {
        // Use a more flexible selector to find the travel box
        const travelBox = document.querySelector(".profile-status.m-top10.travelling");

        if (!travelBox) {
            console.error("Travel box not found!");
            return;
        }

        // Create a new element to display the flight type
        const flightInfo = document.createElement("div");
        flightInfo.style.marginTop = "10px"; // Add some spacing
        flightInfo.style.padding = "8px";
        flightInfo.style.backgroundColor = "#333";
        flightInfo.style.color = "#fff";
        flightInfo.style.borderRadius = "5px";
        flightInfo.style.fontSize = "14px";
        flightInfo.style.fontWeight = "bold";
        flightInfo.style.textAlign = "center";
        flightInfo.textContent = `Flight Type: ${flightType}`;

        // Insert the flight type message under the travel box
        travelBox.insertAdjacentElement("afterend", flightInfo);
    }

    // Wait for the page to load completely
    function waitForPageLoad() {
        // Check if the travel box exists
        const travelBox = document.querySelector(".profile-status.m-top10.travelling");

        if (travelBox) {
            const flightType = getFlightType();

            // Only display the flight type if it's not null
            if (flightType !== null) {
                displayFlightType(flightType);
            }
        } else {
            // If the travel box isn't found yet, wait and try again
            setTimeout(waitForPageLoad, 500);
        }
    }

    // Start waiting for the page to load
    waitForPageLoad();
})();