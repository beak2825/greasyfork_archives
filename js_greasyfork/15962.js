// ==UserScript==
// @name         nyamboost001001
// @namespace    http://bubble.am/
// @version      0.69
// @description  Made by JP
// @author       jpx280bolonelite
// @match        http://*/*
// @downloadURL https://update.greasyfork.org/scripts/15962/nyamboost001001.user.js
// @updateURL https://update.greasyfork.org/scripts/15962/nyamboost001001.meta.js
// ==/UserScript==

(function() {
    var amount = 2;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 84) { // KEY_T
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

(function() {
    var amount = 4;
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

(function() {
    var amount = 4;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 82) { // KEY_R
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

alert("This script by ThrixElite Do not steal :)");