// ==UserScript==
// @name         OUTDATED Starblast.io FPS Bypass read desc.
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  READ THIS: THIS MOD IS OUTDATED. USE MY 60FPS BUGFIX MOD INSTEAD. To use this mod with minimal lag, your computer must be able to maintain the fps that you input. Use multiples of 60 to ensure minimal lag. You can use any fps value you want, but 120 and 180 will have the least lag. Thank you to Taxin for forcing me to create this. Thank you to Ancient for inspiring me to make something that actually works, unlike his client's fps uncap.
// @author       ✨Stardust™
// @match        *://starblast.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502659/OUTDATED%20Starblastio%20FPS%20Bypass%20read%20desc.user.js
// @updateURL https://update.greasyfork.org/scripts/502659/OUTDATED%20Starblastio%20FPS%20Bypass%20read%20desc.meta.js
// ==/UserScript==

// CHANGE YOUR FPS HERE!!!@$$#@$#@$ FPS HERE &*^**^*^*&^% CHANGE FPS BELOW!!!!!
const getDesiredFPS = () => 120;
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^ CHANGE FPS ^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^ 240 IS THE MAX ^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^ 120 or 180 is recommended ^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

(function() {
    'use strict';

    const jjj = () => 15
    const jjjjjj = () => 4

    const jjjj = () => {
    if (getDesiredFPS() > jjj() * jjjjjj() * jjjjjj()) {
        return jjjjjj() * jjj() * jjjjjj()}
    if (getDesiredFPS() < jjjjjj() * jjj()) {
        return jjj() * jjjjjj()}
    else {
        return getDesiredFPS()}
    }

    const jjjjj = jjjj();

    // Helper function to inject a script into the page context
    function injectScript(fn) {
        const script = document.createElement('script');
        script.textContent = `(${fn})();`;
        document.documentElement.appendChild(script);
        script.remove();
    }

    // Function to override the game's requestAnimationFrame to achieve the desired FPS
    function j() {
        const originalRequestAnimationFrame = window.requestAnimationFrame;
        let lastTime = 0;

        window.requestAnimationFrame = function(callback) {
            const currentTime = performance.now();
            const timeToCall = Math.max(0, (1000 / jjjjj) - (currentTime - lastTime));
            const id = setTimeout(function() {
                callback(currentTime + timeToCall);
            }, timeToCall);
            lastTime = currentTime + timeToCall;
            return id;
        };


        // Create FPS counter display
        const jj = document.createElement('div');
        jj.id = 'fps-counter';
        jj.style.position = 'fixed';
        jj.style.top = '10px';
        jj.style.left = '10px';
        jj.style.padding = '5px';
        jj.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        jj.style.color = 'white';
        jj.style.fontSize = '14px';
        jj.style.zIndex = '10000';
        jj.textContent = `Target FPS: ${jjjjj}`;
        document.body.appendChild(jj);
    }

    // Inject the FPS override and counter function into the page context
    injectScript(j.toString().replace(/jjjjj/g, jjjjj));
})();