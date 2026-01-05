// ==UserScript==
// @name         Shadow - Agar.io Double Split
// @namespace    Macro Split
// @version      0.01
// @description  Press d To Spilt 2 times
// @author       Shadow
// @license      MIT
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/19583/Shadow%20-%20Agario%20Double%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/19583/Shadow%20-%20Agario%20Double%20Split.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 90) { // KEY_D
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 8}); // KEY_D
                    window.onkeyup({keyCode: 8});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();