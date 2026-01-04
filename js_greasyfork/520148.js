// ==UserScript==
// @name         GeoGuessr Leaderboard Force Sync
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Force sync leaderboard with preselected and dynamically changed play modes
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520148/GeoGuessr%20Leaderboard%20Force%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/520148/GeoGuessr%20Leaderboard%20Force%20Sync.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to simulate a click on a leaderboard switch
    function simulateClickOnSwitch(labelText) {
        const targetSwitch = [...document.querySelectorAll('.switch_label__KrnMF')].find(label => label.textContent.trim() === labelText);
        if (targetSwitch) {
            targetSwitch.click();
            console.log(`Leaderboard switched to: ${labelText}`);
        } else {
            console.warn(`Leaderboard switch for ${labelText} not found!`);
        }
    }

    // Sync leaderboard with the currently selected mode
    function syncLeaderboard() {
        const selectedButton = document.querySelector('.play-setting-button_root__AfG8z.play-setting-button_selected__A0_ik');
        if (selectedButton) {
            const label = selectedButton.querySelector('.label_label__9xkbh');
            if (label) {
                const labelText = label.textContent.trim(); // "Move", "No move", "NMPZ"
                console.log(`Detected selected mode: ${labelText}`);
                simulateClickOnSwitch(labelText); // Force the leaderboard to match the preselected mode
            } else {
                console.warn('Selected button label not found.');
            }
        } else {
            console.log('No selected play mode detected.');
        }
    }

    // Ensure leaderboard sync on page load
    function syncOnPageLoad() {
        console.log('Page loaded. Synchronizing leaderboard...');
        setTimeout(syncLeaderboard, 100); // Add a slight delay to ensure elements are fully rendered
    }

    // Sync leaderboard when a mode is clicked
    function syncOnModeChange() {
        document.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.play-setting-button_root__AfG8z');
            if (clickedButton) {
                console.log('Mode change detected. Syncing leaderboard...');
                syncLeaderboard();
            }
        });
    }

    // Initialize the script
    document.addEventListener('DOMContentLoaded', () => {
        syncOnPageLoad(); // Sync leaderboard with preselected mode
        syncOnModeChange(); // Sync leaderboard dynamically on mode change
    });
})();
