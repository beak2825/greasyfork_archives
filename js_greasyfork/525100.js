// ==UserScript==
// @name         Drawaria Movement Free - Open for Custom Mods
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds movement only this is a Simplified version of Drawaria Mario Mod so you can make your custom mods
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/525100/Drawaria%20Movement%20Free%20-%20Open%20for%20Custom%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/525100/Drawaria%20Movement%20Free%20-%20Open%20for%20Custom%20Mods.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Game Constants
    const GRAVITY = 0.5; // Simulates gravity (adjust as needed)
    const MAX_SPEED = 10; // Units/second
    const MIN_SPEED = 2; // Units/second
    const JUMP_HEIGHT = 15; // Units

    // Avatar Properties
    let avatarX = 50;
    let avatarY = 50;
    let avatarVX = 0; // Horizontal velocity
    let avatarVY = 0; // Vertical velocity
    let isJumping = false;

    // Keyboard State
    const keys = {};

    // Function to handle movement
    function updateAvatar() {
        // 1. Apply Gravity
        avatarVY += GRAVITY;

        // 2. Handle horizontal movement (keyboard input)
        if (keys['ArrowRight']) {
            avatarVX = Math.min(avatarVX + 0.5, MAX_SPEED);
        } else if (keys['ArrowLeft']) {
            avatarVX = Math.max(avatarVX - 0.5, -MAX_SPEED);
        } else {
            avatarVX *= 0.9; // Friction
        }

        // 3. Handle jumping
        if (keys['ArrowUp'] && !isJumping) {
            avatarVY = -JUMP_HEIGHT;
            isJumping = true;
        }

        // 4. Update Avatar Position
        avatarX += avatarVX;
        avatarY += avatarVY;

        // 5. Collision Detection (simplified)
        if (avatarY > 768 - 50) { // Assuming ground level is at 768 - 50
            avatarY = 768 - 50;
            avatarVY = 0;
            isJumping = false;
        }

        // 6. Boundary Check
        avatarX = Math.max(-900, Math.min(avatarX, 1024 + 100)); // Keep within bounds
        avatarY = Math.max(-350, Math.min(avatarY, 768 + 50));

        // 7. Update visual representation (Draw the avatar)
        drawAvatar(avatarX, avatarY);

        // Request next frame
        requestAnimationFrame(updateAvatar);
    }

    // Function to handle keyboard input
    function handleKeyDown(event) {
        keys[event.key] = true;
    }

    function handleKeyUp(event) {
        keys[event.key] = false;
    }

    // Function to draw the avatar
    function drawAvatar(x, y) {
        const avatar = document.querySelector('#selfavatarimage');
        if (avatar) {
            avatar.style.transform = `translate(${x}px, ${y}px)`;
            avatar.style.border = 'none'; // Make border transparent
            avatar.style.boxShadow = 'none'; // Make box-shadow transparent
        }
    }

    // Event listeners for keyboard input
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Start the game loop
    updateAvatar();

})();
