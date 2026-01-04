// ==UserScript==
// @name Arras FOV Script
// @description Increases FOV, only activate once you're in the game, otherwise anticheat blocks. Press "x" to activate.
// @author The Scorching of the Thicket
// @match  *://arras.io/*
// @version 1.0.0
// @run-at document-start
// @namespace https://greasyfork.org/users/979757
// @downloadURL https://update.greasyfork.org/scripts/454326/Arras%20FOV%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/454326/Arras%20FOV%20Script.meta.js
// ==/UserScript==

let lock = 0;
document.addEventListener('keydown', function(event) {
    if (event.code === "KeyX" && !lock) {
        Array.prototype.shift = new Proxy(Array.prototype.shift, {
            apply(shift, array, args) {
                if (array[0] === 'u') {
                    array[4] = array[4] * 1.5;
                    lock = 1;
                };
                return shift.apply(array, args);
            }
        });
    }
});