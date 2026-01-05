// ==UserScript==
// @name         agar-mass-ejector
// @namespace    http://github.com/dimotsai/
// @version      0.03
// @description  A faster, continuous mass ejector for agar.
// @author       dimotsai
// @license      MIT
// @match        http://agar.io/*
// @match        https://agar.io/*
// @match        http://abs0rb.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/16157/agar-mass-ejector.user.js
// @updateURL https://update.greasyfork.org/scripts/16157/agar-mass-ejector.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_E
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();