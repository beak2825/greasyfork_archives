// ==UserScript==
// @name         Shadow's Agario Macro Split
// @namespace    Macro Split
// @version      0.02
// @description  Press z To Spilt 16 times
// @author       ShadowPlays - Agar.io & More
// @license      MIT
// @match        http://agarly.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/23952/Shadow%27s%20Agario%20Macro%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/23952/Shadow%27s%20Agario%20Macro%20Split.meta.js
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