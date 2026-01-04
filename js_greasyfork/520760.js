// ==UserScript==
// @name         Bloxd.io Fly Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable creative mode flying in survival mode by pressing 'Y'.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520760/Bloxdio%20Fly%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520760/Bloxdio%20Fly%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const FLY_KEY = 'Y'; // Key to toggle fly mode

    // Fly state variables
    let isFlying = false;
    let verticalSpeed = 0;
    const flySpeed = 0.2;
    const gravity = 0.05;

    // Hook into the game loop
    function enableFlyMode() {
        const game = window.game; // Adjust this to match the game object in Bloxd.io

        if (!game || !game.player || !game.player.movement) {
            console.error("Game object or player movement not found.");
            return;
        }

        // Listen for key press
        document.addEventListener('keydown', (event) => {
            if (event.key.toUpperCase() === FLY_KEY) {
                isFlying = !isFlying;
                if (isFlying) {
                    console.log('Fly mode enabled.');
                } else {
                    console.log('Fly mode disabled.');
                }
            }
        });

        // Override the game loop to inject flying behavior
        const originalUpdate = game.player.update;
        game.player.update = function(...args) {
            if (isFlying) {
                const input = game.player.input;
                const movement = game.player.movement;

                // Handle vertical movement
                if (input.isKeyDown('Space')) { // Space for upward movement
                    verticalSpeed = flySpeed;
                } else if (input.isKeyDown('Shift')) { // Shift for downward movement
                    verticalSpeed = -flySpeed;
                } else {
                    verticalSpeed = 0;
                }

                // Apply movement
                movement.velocity.y = verticalSpeed;

                // Prevent falling
                movement.velocity.y = Math.max(movement.velocity.y, -gravity);

            } else {
                // Call original update for normal behavior
                originalUpdate.apply(this, args);
            }
        };
    }

    // Wait for the game to load
    const checkInterval = setInterval(() => {
        if (window.game && window.game.player) {
            clearInterval(checkInterval);
            enableFlyMode();
        }
    }, 100);
})();
