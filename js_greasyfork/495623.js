// ==UserScript==
// @name         Bonk.io Grappling Hooks Gamemode
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a grappling hook ability to Bonk.io with aiming and rotation using arrow keys while holding Z, only in Grappling Hooks mode
// @author       Your Name
// @match        *://bonk.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495623/Bonkio%20Grappling%20Hooks%20Gamemode.user.js
// @updateURL https://update.greasyfork.org/scripts/495623/Bonkio%20Grappling%20Hooks%20Gamemode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the game to load
    function waitForGame() {
        if (typeof Game === 'undefined' || typeof Game.currentGame === 'undefined') {
            setTimeout(waitForGame, 1000);
        } else {
            addGrapplingHooksMode();
            initGrapplingHook();
        }
    }

    // Add Grappling Hooks mode to the game mode selector
    function addGrapplingHooksMode() {
        const gameModeSelector = document.querySelector('#gameModeSelector'); // Adjust selector to actual game mode selector element
        if (gameModeSelector) {
            const grapplingHooksOption = document.createElement('option');
            grapplingHooksOption.value = 'grappling_hooks';
            grapplingHooksOption.textContent = 'Grappling Hooks';
            gameModeSelector.appendChild(grapplingHooksOption);
        }
    }

    // Initialize the grappling hook functionality
    function initGrapplingHook() {
        let aiming = false;
        let aimAngle = 0;
        let rotatingLeft = false;
        let rotatingRight = false;

        // Rotation speed in radians per frame
        const rotationSpeed = 0.05;

        // Check if the current game mode is "Grappling Hooks"
        function isGrapplingHooksMode() {
            const modeSelector = document.querySelector('#gameModeSelector'); // Adjust selector to actual game mode selector element
            return modeSelector && modeSelector.value === 'grappling_hooks';
        }

        // Event listener for keydown
        document.addEventListener('keydown', function(event) {
            if (!isGrapplingHooksMode()) return;
            if (event.key === 'z' || event.key === 'Z') {
                aiming = true;
            }
            if (aiming) {
                switch (event.key) {
                    case 'ArrowLeft':
                        rotatingLeft = true;
                        break;
                    case 'ArrowRight':
                        rotatingRight = true;
                        break;
                }
            }
        });

        // Event listener for keyup
        document.addEventListener('keyup', function(event) {
            if (!isGrapplingHooksMode()) return;
            if (event.key === 'z' || event.key === 'Z') {
                aiming = false;

                // Get the direction vector from the aim angle
                const nx = Math.cos(aimAngle);
                const ny = Math.sin(aimAngle);

                // Get the player's current position
                const player = Game.currentGame.player;

                // Grappling hook force multiplier
                const forceMultiplier = 2; // Adjust this value to control the force

                // Apply force to the player towards the aim direction
                player.vel.x += nx * forceMultiplier;
                player.vel.y += ny * forceMultiplier;
            }
            if (aiming) {
                switch (event.key) {
                    case 'ArrowLeft':
                        rotatingLeft = false;
                        break;
                    case 'ArrowRight':
                        rotatingRight = false;
                        break;
                }
            }
        });

        // Main game loop modification to handle rotation
        function gameLoop() {
            if (aiming) {
                if (rotatingLeft) {
                    aimAngle -= rotationSpeed;
                }
                if (rotatingRight) {
                    aimAngle += rotationSpeed;
                }
            }
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        requestAnimationFrame(gameLoop);
    }

    // Start the wait for game function
    waitForGame();
})();
