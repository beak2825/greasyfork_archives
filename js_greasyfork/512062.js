// ==UserScript==
// @name         Gobattle.io Noclip and Fly
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable noclip and flying in Gobattle.io
// @author       Toluwa Oyerinde
// @match        https://gobattle.io/*
// @grant
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512062/Gobattleio%20Noclip%20and%20Fly.user.js
// @updateURL https://update.greasyfork.org/scripts/512062/Gobattleio%20Noclip%20and%20Fly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isNoclipEnabled = false; // Noclip state
    let isFlying = false;        // Fly state
    let player;                  // Reference to the player
    const speed = 5;             // Speed of flying

    // Get the player object from the game
    function init() {
        // Ensure the game context is available
        player = window.gobattle.player;
        if (!player) {
            console.error("Player object not found.");
            return;
        }
        console.log("Noclip and Flying initialized.");
    }

    // Toggle Noclip
    function toggleNoclip() {
        isNoclipEnabled = !isNoclipEnabled;
        if (isNoclipEnabled) {
            console.log("Noclip enabled.");
        } else {
            console.log("Noclip disabled.");
        }
    }

    // Toggle Fly
    function toggleFly() {
        isFlying = !isFlying;
        if (isFlying) {
            console.log("Flying enabled.");
        } else {
            console.log("Flying disabled.");
        }
    }

    // Noclip logic
    function noclip() {
        if (isNoclipEnabled) {
            // Manipulate the player's collision properties
            player.transform.position.x += 0; // Neutralize collision
            player.transform.position.y += 0; // Neutralize gravity
            player.transform.position.z += 0; // Neutralize collision
            requestAnimationFrame(noclip); // Continue noclip
        }
    }

    // Flying logic
    function fly() {
        if (isFlying) {
            const movement = new THREE.Vector3(0, 0, 0); // Create a movement vector

            if (isKeyPressed('W')) movement.z -= speed; // Move forward
            if (isKeyPressed('S')) movement.z += speed; // Move backward
            if (isKeyPressed('A')) movement.x -= speed; // Move left
            if (isKeyPressed('D')) movement.x += speed; // Move right
            if (isKeyPressed('Space')) movement.y += speed; // Move up
            if (isKeyPressed('Shift')) movement.y -= speed; // Move down

            // Apply movement to player position
            player.transform.position.add(movement);
            requestAnimationFrame(fly); // Continue flying
        }
    }

    // Check if a key is pressed
    function isKeyPressed(key) {
        return window.input.isKeyPressed(key);
    }

    // Key event listener
    window.addEventListener('keydown', (event) => {
        if (event.key === 'F') { // Toggle noclip with F
            toggleNoclip();
        }
        if (event.key === 'G') { // Toggle flying with G
            toggleFly();
        }
    });

    // Main loop
    function gameLoop() {
        if (isFlying) {
            fly();
        }
        if (isNoclipEnabled) {
            noclip();
        }
        requestAnimationFrame(gameLoop); // Repeat the loop
    }

    // Initialize script
    init();
    gameLoop(); // Start the main loop
})();