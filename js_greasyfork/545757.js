// ==UserScript==
// @name         Gobattle.io Noclip and Fly
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enable noclip and flying in Gobattle.io
// @author       Toluwa Oyerinde
// @match        https://gobattle.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545757/Gobattleio%20Noclip%20and%20Fly.user.js
// @updateURL https://update.greasyfork.org/scripts/545757/Gobattleio%20Noclip%20and%20Fly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isNoclipEnabled = false; // Noclip state
    let isFlying = false;        // Fly state
    let player;                  // Reference to the player
    let originalPhysics;         // Store original physics properties
    const flySpeed = 5;          // Speed of flying
    const pressedKeys = new Set(); // Use a Set to track pressed keys efficiently

    // --- Core Functions ---

    function init() {
        // Wait for the game to load the player object
        const interval = setInterval(() => {
            if (window.gobattle && window.gobattle.player) {
                player = window.gobattle.player;
                // Store original physics for later use (if possible)
                originalPhysics = player.physicsProperties ? { ...player.physicsProperties } : null;
                console.log("Noclip and Flying initialized.");
                clearInterval(interval);
                gameLoop(); // Start the main game loop
            }
        }, 100);
    }

    function toggleNoclip() {
        isNoclipEnabled = !isNoclipEnabled;

        if (player && originalPhysics) {
            if (isNoclipEnabled) {
                console.log("Noclip enabled.");
                // Try to disable physics properties if they exist
                player.physicsProperties.collision = false;
                player.physicsProperties.gravity = 0;
            } else {
                console.log("Noclip disabled.");
                // Restore original physics properties
                player.physicsProperties = { ...originalPhysics };
            }
        }
    }

    function toggleFly() {
        isFlying = !isFlying;
        console.log(`Flying ${isFlying ? 'enabled' : 'disabled'}.`);
    }

    // --- Game Logic ---

    function handleMovement() {
        if (!isFlying || !player) return;

        const movement = { x: 0, y: 0, z: 0 };

        if (pressedKeys.has('w')) movement.z -= flySpeed;
        if (pressedKeys.has('s')) movement.z += flySpeed;
        if (pressedKeys.has('a')) movement.x -= flySpeed;
        if (pressedKeys.has('d')) movement.x += flySpeed;
        if (pressedKeys.has(' ')) movement.y += flySpeed; // Space
        if (pressedKeys.has('Shift')) movement.y -= flySpeed; // Shift

        // Update player position directly
        player.transform.position.x += movement.x;
        player.transform.position.y += movement.y;
        player.transform.position.z += movement.z;
    }

    // --- Event Handlers ---

    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key === 'f') {
            toggleNoclip();
        } else if (key === 'g') {
            toggleFly();
        }
        pressedKeys.add(key);
    });

    window.addEventListener('keyup', (event) => {
        pressedKeys.delete(event.key.toLowerCase());
    });

    // --- Main Loop ---

    function gameLoop() {
        handleMovement(); // Handle movement every frame
        requestAnimationFrame(gameLoop);
    }

    // --- Script Initialization ---

    init();
})();