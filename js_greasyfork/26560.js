// ==UserScript==
// @name         Wisher and Lumiz MACRO (FIXED)
// @namespace    Macro Split
// @version      1.2
// @description  Pulsa Z Para 16 Espacios
// @author       Harambe af
// @license      LC0
// @match        http://c0nsume.me
// @match        http://c0nsume.me/index.php
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26560/Wisher%20and%20Lumiz%20MACRO%20%28FIXED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26560/Wisher%20and%20Lumiz%20MACRO%20%28FIXED%29.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 36; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 49) { // KEY_1
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
    var amount = 2;
    var duration = 67; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 50) { // KEY_2
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
    var amount = 3;
    var duration = 55; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 51) { // KEY_3
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