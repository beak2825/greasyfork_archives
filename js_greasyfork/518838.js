// ==UserScript==
// @name         Highlight Players with Name and Health Bar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Highlight all players and show their name and health bar
// @author       You
// @match        https://tankionline.com
// @match        https://tankionline.com/play/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518838/Highlight%20Players%20with%20Name%20and%20Health%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/518838/Highlight%20Players%20with%20Name%20and%20Health%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight players and display their name and health bar
    function highlightPlayers() {
        // Select all player elements (adjust selector as needed)
        const players = document.querySelectorAll('.player');  // Adjust '.player' to the actual selector for players

        players.forEach(player => {
            // Highlight the player with a border and glowing effect
            player.style.border = '3px solid red';
            player.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.7)';

            // Get player's name (assuming name is within an element with class 'player-name')
            const playerName = player.querySelector('.player-name'); // Adjust selector for player name
            if (playerName) {
                playerName.style.fontSize = '16px';
                playerName.style.fontWeight = 'bold';
                playerName.style.color = 'red';
                playerName.textContent = `Player: ${playerName.textContent}`;  // Prefix name with "Player:"
            }

            // Get player's health (assuming health is within an element with class 'health-bar')
            const healthBar = player.querySelector('.health-bar'); // Adjust selector for health bar
            if (healthBar) {
                // Display the health as a percentage
                const healthPercentage = healthBar.getAttribute('data-health'); // Assuming health is stored in 'data-health' attribute
                const healthText = document.createElement('div');
                healthText.textContent = `Health: ${healthPercentage}%`;
                healthText.style.position = 'absolute';
                healthText.style.top = '0';
                healthText.style.left = '50%';
                healthText.style.transform = 'translateX(-50%)';
                healthText.style.color = 'white';
                healthText.style.fontSize = '12px';
                healthText.style.fontWeight = 'bold';
                healthText.style.textShadow = '2px 2px 5px rgba(0, 0, 0, 0.7)';
                player.appendChild(healthText);

                // Optionally, change the health bar color based on the health
                if (healthPercentage < 50) {
                    healthBar.style.backgroundColor = 'orange';
                }
                if (healthPercentage < 20) {
                    healthBar.style.backgroundColor = 'red';
                }
            }
        });
    }

    // Run the highlight function every 1 second to keep players updated
    setInterval(highlightPlayers, 1000);
})();
