// ==UserScript==
// @name         Fortnite Aimbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically aim at enemies in Fortnite.
// @author       your name
// @match        https://www.epicgames.com/fortnite
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489406/Fortnite%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/489406/Fortnite%20Aimbot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate the angle between two points
    function calculateAngle(targetX, targetY, playerX, playerY) {
        return Math.atan2(targetY - playerY, targetX - playerX) * (180 / Math.PI);
    }

    // Function to aim at enemies
    function aimAtEnemies() {
        // Get coordinates of enemies and player
        const enemyX = document.getElementById('enemy').getBoundingClientRect().x;
        const enemyY = document.getElementById('enemy').getBoundingClientRect().y;
        const playerX = document.getElementById('player').getBoundingClientRect().x;
        const playerY = document.getElementById('player').getBoundingClientRect().y;

        // Calculate angle between player and enemy
        const angle = calculateAngle(enemyX, enemyY, playerX, playerY);

        // Rotate player towards enemy
        document.getElementById('player').style.transform = `rotate(${angle}deg)`;
    }

    // Call aimAtEnemies function every 100 milliseconds
    setInterval(aimAtEnemies, 100);
})();
