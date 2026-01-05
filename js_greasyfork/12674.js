// ==UserScript==
// @name         agar-mass-ejector-w
// @namespace    http://github.com/dimotsai/
// @version      0.03
// @description  A faster, continuous mass ejector for agar.
// @author       dimotsai
// @license      MIT
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/12674/agar-mass-ejector-w.user.js
// @updateURL https://update.greasyfork.org/scripts/12674/agar-mass-ejector-w.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 87) { // KEY_W
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 88}); // KEY_W
                    window.onkeyup({keyCode: 88});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
