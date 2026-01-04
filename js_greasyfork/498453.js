// ==UserScript==
// @name         Shell Shockers ESP Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display players' names and health bars in Shell Shockers
// @author       Your Name
// @match        https://shellshockers.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498453/Shell%20Shockers%20ESP%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/498453/Shell%20Shockers%20ESP%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and update ESP elements
    function updateESP() {
        // Select all player elements on the page
        let players = document.querySelectorAll('.player');

        players.forEach(player => {
            // Get player name and health
            let playerName = player.querySelector('.name').textContent.trim();
            let playerHealth = parseInt(player.querySelector('.health').textContent.trim());

            // Create or update an ESP element for each player
            let espElement = document.getElementById(`esp-${playerName}`);
            if (!espElement) {
                espElement = document.createElement('div');
                espElement.id = `esp-${playerName}`;
                espElement.style.position = 'absolute';
                espElement.style.color = 'white';
                espElement.style.fontFamily = 'Arial, sans-serif';
                espElement.style.fontSize = '12px';
                document.body.appendChild(espElement);
            }

            // Position the ESP element above the player's head
            let rect = player.getBoundingClientRect();
            espElement.style.top = `${rect.top - 20}px`;
            espElement.style.left = `${rect.left}px`;

            // Update ESP text (name and health)
            espElement.textContent = `${playerName} (${playerHealth} HP)`;
        });
    }

    // Call updateESP function initially and then every 500ms
    updateESP();
    setInterval(updateESP, 500);

})();
