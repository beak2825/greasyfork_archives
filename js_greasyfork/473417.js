// ==UserScript==
// @name         Krunker.io Cheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Krunker.io cheat for advantage, no moral compass included.
// @author       You
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473417/Krunkerio%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/473417/Krunkerio%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject cheat code into the game
    
    // Aimbot
    const enableAimbot = true;
    if (enableAimbot) {
        // Aimbot code
        const aimbotInterval = setInterval(() => {
            const players = document.getElementsByClassName("nameTag");
            const crosshair = document.getElementById("crosshair");
            if (players.length > 0 && crosshair) {
                const closestPlayer = Array.from(players).reduce((a, b) =>
                    (Math.abs(parseInt(a.style.left) - parseInt(crosshair.style.left)) < Math.abs(parseInt(b.style.left) - parseInt(crosshair.style.left)) ? a : b));
                
                if (closestPlayer) {
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    closestPlayer.dispatchEvent(event);
                }
            }
        }, 100);
    }
    
    // Wallhack
    const enableWallhack = true;
    if (enableWallhack) {
        // Your wallhack code here
    }
})();
