// ==UserScript==
// @name         Torn Racing Skill Display
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display Racing Skill (RS) beside each user's name on the racing page.
// @author       Your Name
// @match        https://www.torn.com/loader.php?sid=racing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523200/Torn%20Racing%20Skill%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/523200/Torn%20Racing%20Skill%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your Torn API Key
    const API_KEY = 'your_api_key_here';

    // Function to fetch Racing Skill for a given player ID
    async function fetchRacingSkill(playerId) {
        try {
            const response = await fetch(`https://api.torn.com/user/${playerId}?selections=stats&key=${API_KEY}`);
            const data = await response.json();
            return data.racing?.skill || 'N/A';
        } catch (error) {
            console.error(`Error fetching racing skill for player ${playerId}:`, error);
            return 'Error';
        }
    }

    // Function to update the Racing Skill beside each player's name
    async function updateRacingSkills() {
        // Wait for the page to load and render user list
        const observer = new MutationObserver(async () => {
            const userElements = document.querySelectorAll('.user a[href*="profile.php?user="]');

            for (const userElement of userElements) {
                const userIdMatch = userElement.href.match(/user=(\d+)/);
                if (userIdMatch && !userElement.textContent.includes('RS:')) {
                    const userId = userIdMatch[1];
                    const racingSkill = await fetchRacingSkill(userId);
                    userElement.textContent += ` (RS: ${racingSkill})`;
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start the script
    updateRacingSkills();
})();
