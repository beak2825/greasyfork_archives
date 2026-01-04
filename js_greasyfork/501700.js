// ==UserScript==
// @name         Moomoo.io Auto Spike Breaker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       wat
// @description  Automatically breaks spikes using hammer and tank in sandbox.moomoo.io
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501700/Moomooio%20Auto%20Spike%20Breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/501700/Moomooio%20Auto%20Spike%20Breaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hammerKey = 'KeyV'; // Key to equip hammer
    const tankKey = 'KeyH';   // Key to equip tank gear

    const angleStep = Math.PI / 8; // Angle step for rotation (45 degrees)
    let currentAngle = 0;

    function equipHammer() {
        const event = new KeyboardEvent('keydown', { 'key': hammerKey });
        document.dispatchEvent(event);
    }

    function equipTank() {
        const event = new KeyboardEvent('keydown', { 'key': tankKey });
        document.dispatchEvent(event);
    }

    function attack() {
        window.input.mouseButton = 1;
        window.input.mouseButtonOld = 1;
    }

    function stopAttack() {
        window.input.mouseButton = 0;
        window.input.mouseButtonOld = 0;
    }

    function rotatePlayer() {
        currentAngle = (currentAngle + angleStep) % (2 * Math.PI);
        window.player.dir = currentAngle;
    }

    function autoBreakSpikes() {
        equipHammer();
        setTimeout(() => {
            equipTank();
            setTimeout(() => {
                attack();
                const breakInterval = setInterval(() => {
                    rotatePlayer();
                    if (currentAngle === 0) {
                        clearInterval(breakInterval);
                        stopAttack();
                    }
                }, 100);
            }, 50);
        }, 50);
    }

    // Run the auto break function every 5 seconds
    setInterval(autoBreakSpikes, 5000);

    // Add a hotkey to manually trigger the auto break function (press 'B')
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyB') {
            autoBreakSpikes();
        }
    });

    console.log("Auto Spike Breaker script loaded!");
})();