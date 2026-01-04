// ==UserScript==
// @name         Bloxd.io autoclick speed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple auto clicker for bloxd.io with toggle functionality using the V key. Click interval set to 1 second.
// @author       Xaviel_client
// @match        https://bloxd.io*
// @icon         https://bloxd.io*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527245/Bloxdio%20autoclick%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/527245/Bloxdio%20autoclick%20speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickInterval = 1000;
    let autoClickerEnabled = false;

    function autoClick() {
        if (autoClickerEnabled) {
            const canvas = document.querySelector("#noa-canvas");
            if (canvas) {
                canvas.dispatchEvent(new MouseEvent("mousedown", { button: 0, bubbles: true, cancelable: true }));
                canvas.dispatchEvent(new MouseEvent("mouseup", { button: 0, bubbles: true, cancelable: true }));
            }
        }
    }

    setInterval(autoClick, clickInterval);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'v' || event.key === 'V') {
            autoClickerEnabled = !autoClickerEnabled;
            console.log('Auto Clicker ' + (autoClickerEnabled ? 'Enabled' : 'Disabled'));
        }
    });
})();

