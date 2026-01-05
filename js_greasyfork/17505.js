// ==UserScript==
// @name         Agario Macro Split
// @namespace    Macro Split
// @version      1.1
// @description  Press Shift To Spilt 16 times
// @author       Dagen
// @license      MIT
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/17505/Agario%20Macro%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/17505/Agario%20Macro%20Split.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 90) { // KEY_Z
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // KEY_SPACE
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();