// ==UserScript==
// @name         Auto Respawn
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Automatically clicks the respawn button with O key toggle. Green = ON, Red = OFF.
// @author       M.Rithish
// @match        *://battledudes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538658/Auto%20Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/538658/Auto%20Respawn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoRespawnEnabled = false;

    // Toggle Display Box
    const toggle = document.createElement('div');
    toggle.style.position = 'fixed';
    toggle.style.top = '40px';
    toggle.style.left = '1100px';
    toggle.style.padding = '10px';
    toggle.style.fontSize = '16px';
    toggle.style.color = 'white';
    toggle.style.border = '2px solid #666';
    toggle.style.borderRadius = '5px';
    toggle.style.zIndex = '1000';
    toggle.style.overflow = 'hidden';
    toggle.style.fontFamily = 'monospace';
    toggle.style.backgroundColor = 'red'; // start with OFF
    toggle.innerText = 'Auto Respawn: OFF';
    document.body.appendChild(toggle);

    // Listen for 'O' key to toggle auto respawn
    document.addEventListener('keydown', function (e) {
        if (e.key.toUpperCase() === 'O') {
            autoRespawnEnabled = !autoRespawnEnabled;
            toggle.innerText = 'Auto Respawn: ' + (autoRespawnEnabled ? 'ON' : 'OFF');
            toggle.style.backgroundColor = autoRespawnEnabled ? 'green' : 'red';
        }
    });

    // Function for Auto Respawn
    setInterval(() => {
        if (!autoRespawnEnabled) return;
        const btn = document.querySelector('#respawn_button');
        if (btn && btn.offsetParent !== null) {
            btn.click();
        }
    }, 21);
})();
