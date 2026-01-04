// ==UserScript==
// @name         MooMoo.io Anti-Trap & Trap Line Indicator
// @version      1.0
// @description  Places 2 traps behind you when stuck & shows a line when an enemy is trapped
// @author      II
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1428570
// @downloadURL https://update.greasyfork.org/scripts/525329/MooMooio%20Anti-Trap%20%20Trap%20Line%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/525329/MooMooio%20Anti-Trap%20%20Trap%20Line%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastX = 0, lastY = 0;
    let stuckCounter = 0;
    let trappedEnemies = [];

    // Function to send key events
    function sendKey(code) {
        document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: code }));
        document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: code }));
    }

    // Anti-Trap System: Places traps when stuck
    function checkIfStuck() {
        let player = window.gameObjects[window.myPlayerID]; // Get player data

        if (player) {
            let currentX = player.x;
            let currentY = player.y;

            if (currentX === lastX && currentY === lastY) {
                stuckCounter++;
            } else {
                stuckCounter = 0;
            }

            lastX = currentX;
            lastY = currentY;

            if (stuckCounter > 10) { // If stuck for 10 cycles
                console.log("Stuck detected! Placing traps...");

                sendKey(54); // Select Trap (Assumed ID 54)
                setTimeout(() => sendKey(32), 100); // Place first trap
                setTimeout(() => sendKey(32), 200); // Place second trap

                stuckCounter = 0; // Reset counter
            }
        }
    }

    setInterval(checkIfStuck, 100); // Check every 100ms

    // Trap Line Indicator
    function drawTrapLines() {
        let ctx = document.querySelector("canvas").getContext("2d");

        trappedEnemies.forEach(enemy => {
            ctx.beginPath();
            ctx.moveTo(enemy.x, enemy.y); // Enemy position
            ctx.lineTo(window.myPlayer.x, window.myPlayer.y); // Line to player
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    setInterval(drawTrapLines, 50); // Update every 50ms

    // Detect trapped enemies
    setInterval(() => {
        trappedEnemies = Object.values(window.gameObjects).filter(obj => obj.type === "enemy" && obj.isTrapped);
    }, 500);

    // Captcha Bypass
    setInterval(() => {
        let captchaBox = document.querySelector("#captchaBox");
        let captchaInput = document.querySelector("#captchaInput");

        if (captchaBox && captchaBox.style.display !== "none") {
            console.log("Captcha detected! Auto-solving...");
            let captchaAnswer = document.querySelector("#captchaImage").alt; // Get solution from alt text
            if (captchaInput) {
                captchaInput.value = captchaAnswer;
                captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => document.querySelector("#captchaSubmit").click(), 200);
            }
        }
    }, 1000); // Check for captcha every second

})();
