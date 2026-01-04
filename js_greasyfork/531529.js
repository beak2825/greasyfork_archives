// ==UserScript==
// @name         Moomoo.io Auto Heal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto heal script for moomoo.io
// @author       Your Name
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531529/Moomooio%20Auto%20Heal.user.js
// @updateURL https://update.greasyfork.org/scripts/531529/Moomooio%20Auto%20Heal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoHealEnabled = false;
    const healThreshold = 50; // Heal when health is below 50%

    function toggleAutoHeal() {
        autoHealEnabled = !autoHealEnabled;
        console.log('Auto Heal ' + (autoHealEnabled ? 'Enabled' : 'Disabled'));
    }

    function autoHeal() {
        if (autoHealEnabled) {
            const player = window.player;
            if (player && player.health < (player.maxHealth * (healThreshold / 100))) {
                player.health = player.maxHealth; // Heal to full health
                console.log('Healed to full health!');
            }
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'T') {
            toggleAutoHeal();
        }
    });

    setInterval(autoHeal, 1000); // Check every second
})();