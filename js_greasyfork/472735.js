// ==UserScript==
// @name         Roblox Web To UWP Joiner with Stylish Button
// @namespace    RobloxJoiner
// @version      0.2
// @description  Adds a stylish button to redirect you from Roblox web to Roblox UWP
// @author       BeboMods
// @match        https://www.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472735/Roblox%20Web%20To%20UWP%20Joiner%20with%20Stylish%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/472735/Roblox%20Web%20To%20UWP%20Joiner%20with%20Stylish%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a stylish button for joining the game
    function addButton() {
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join in UWP";
        joinButton.style.backgroundColor = "#3498db"; // Blue background color
        joinButton.style.color = "white";
        joinButton.style.border = "none";
        joinButton.style.padding = "10px 20px";
        joinButton.style.borderRadius = "25px"; // Round button shape
        joinButton.style.cursor = "pointer";
        joinButton.style.fontWeight = "bold";
        joinButton.style.transition = "background-color 0.3s";

        // Add hover effect
        joinButton.addEventListener("mouseenter", () => {
            joinButton.style.backgroundColor = "#2980b9"; // Darker blue on hover
        });
        joinButton.addEventListener("mouseleave", () => {
            joinButton.style.backgroundColor = "#3498db"; // Restore original color
        });

        // Add an event listener to the button
        joinButton.addEventListener("click", joinInUWP);

        // Find the "Play" button container and insert the button next to it
        const playButtonContainer = document.querySelector(".game-buttons-container");
        if (playButtonContainer) {
            playButtonContainer.insertBefore(joinButton, playButtonContainer.firstChild);
        }
    }

    // Join the game in UWP
    function joinInUWP() {
        const currentURL = window.location.href;
        const numbers = extractNumbersFromURL(currentURL);
        const newURL = `roblox://experiences/start?placeId=${numbers}`;
        window.open(newURL, '_blank');
    }

    // Extract numbers from the URL
    function extractNumbersFromURL(url) {
        const matches = url.match(/\/(\d+)\//);
        return matches ? matches[1] : "";
    }

    addButton(); // Add the stylish join button when the page loads
})();
