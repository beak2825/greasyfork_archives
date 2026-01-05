// ==UserScript==
// @name         Force x16 Split
// @namespace    x16 Split
// @version      0.01
// @description  Press z 
// @author       Force :D
// @license      MIT
// @match        http://agar.re/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/19412/Force%20x16%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/19412/Force%20x16%20Split.meta.js
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