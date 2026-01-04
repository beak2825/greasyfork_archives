// ==UserScript==
// @license      MIT
// @name         Diep.io Ren Upgrades
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press "P" To hide the Upgrades.
// @author       Voyager
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523081/Diepio%20Ren%20Upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/523081/Diepio%20Ren%20Upgrades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debugInfoEnabled = true;

    // !!!
    function toggleDebugInfo() {
        debugInfoEnabled = !debugInfoEnabled;
        input.set_convar("ren_upgrades", debugInfoEnabled);
    }

    // Here you can change the key to hide the updgrades. By default is the key "P". (Change the two event.key)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'P' || event.key === 'p') {
            toggleDebugInfo();
        }
    });
})();