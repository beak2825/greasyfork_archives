// ==UserScript==
// @name         Agar-Macro
// @namespace    http://agar.io/*
// @version      0.03
// @description  A faster, continuous mass ejector for agar.
// @author       Dagen
// @license      Dagen
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/17494/Agar-Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/17494/Agar-Macro.meta.js
// ==/UserScript==

(function() {
    var amount = 16;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 16) { // KEY_E
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // KEY_W
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

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