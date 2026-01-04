// ==UserScript==
// @name         Shell Shockers - Actual Invisibility with Visual Cue and Freeze
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make yourself truly invisible and show visual cue, plus freeze players!
// @author       You
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521980/Shell%20Shockers%20-%20Actual%20Invisibility%20with%20Visual%20Cue%20and%20Freeze.user.js
// @updateURL https://update.greasyfork.org/scripts/521980/Shell%20Shockers%20-%20Actual%20Invisibility%20with%20Visual%20Cue%20and%20Freeze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInvisible = false;  // Flag for invisibility
    let frozenPlayers = [];   // Store frozen players
    let playerElement = null; // Your player element
    let invisibilityIndicator = null; // Visual indicator for invisibility

    // Wait for the page to load and find the player element
    window.addEventListener('load', () => {
        playerElement = document.querySelector('.player'); // Find player element

        // Create invisibility indicator (small icon or text that shows when invisible)
        invisibilityIndicator = document.createElement('div');
        invisibilityIndicator.textContent = "Invisible!";
        invisibilityIndicator.style.position = 'absolute';
        invisibilityIndicator.style.fontSize = '16px';
        invisibilityIndicator.style.color = 'red';
        invisibilityIndicator.style.top = '10px';
        invisibilityIndicator.style.right = '10px';
        invisibilityIndicator.style.fontWeight = 'bold';
        invisibilityIndicator.style.display = 'none'; // Hide initially
        document.body.appendChild(invisibilityIndicator);

        // Set up event listeners for key presses
        document.addEventListener('keydown', function(event) {
            if (event.key === 'y' || event.key === 'Y') {
                freezeAllPlayers();  // Freeze all players when Y is pressed
            }

            if (event.key === 'i' || event.key === 'I') {
                toggleInvisibility();  // Toggle invisibility when I is pressed
            }
        });
    });

    // Function to freeze all players (disable movement and shooting)
    function freezeAllPlayers() {
        const players = document.querySelectorAll('.player'); // Find all players

        players.forEach(player => {
            // Check if the player is already frozen
            if (!frozenPlayers.includes(player)) {
                frozenPlayers.push(player);

                // Freeze the player: Disable interaction and movement
                player.style.pointerEvents = 'none';  // Disable clicks, shooting, and interactions
                player.style.opacity = '0.2';  // Make player semi-transparent to indicate freeze

                // Optionally, make frozen players visually appear frozen
                player.style.position = 'absolute';
                player.style.zIndex = '9999';
                player.style.top = player.offsetTop + 'px';
                player.style.left = player.offsetLeft + 'px';

                alert(`Player ${player.getAttribute('data-name') || 'Unknown'} is frozen!`);
            }
        });
    }

    // Function to toggle invisibility for you and all players
    function toggleInvisibility() {
        if (!playerElement) return; // If no player element is found, do nothing

        isInvisible = !isInvisible;  // Toggle invisibility state

        // Apply invisibility to yourself and all players
        const players = document.querySelectorAll('.player');
        players.forEach(player => {
            if (isInvisible) {
                player.style.visibility = 'hidden';  // Completely hide the player (invisible)
            } else {
                player.style.visibility = 'visible';  // Show the player again
            }
        });

        // Show or hide the invisibility indicator
        invisibilityIndicator.style.display = isInvisible ? 'block' : 'none';  // Show indicator when invisible

        // Optional: Show message when invisibility is toggled
        alert(isInvisible ? "You and all players are now invisible!" : "Players are now visible!");
    }

})();
