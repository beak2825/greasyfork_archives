// ==UserScript==
// @name         64X
// @namespace    Tool
// @version      1.0
// @description  4 = 64X
// @author       KUW
// @match        http://gota.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39340/64X.user.js
// @updateURL https://update.greasyfork.org/scripts/39340/64X.meta.js
// ==/UserScript==
(function() {
    var amount = 6;
    var duration = 5;

    var overwriting = function(evt) {
        if (evt.keyCode === 84) {
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
(function() {
    var amount = 8;
    var duration = 5;

    var overwriting = function(evt) {
        if (evt.keyCode === 89) {
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32});
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();