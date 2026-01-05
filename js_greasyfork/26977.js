// ==UserScript==
// @name         Lumiz Macro V3
// @namespace    Macro Split
// @version      0.01
// @description  Pulsa X Para 16 Espacios
// @author       Lumiz (Isaac)
// @license      LC0
// @match        http://c0nsume.me
// @match        http://c0nsume.me/index.php
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26977/Lumiz%20Macro%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/26977/Lumiz%20Macro%20V3.meta.js
// ==/UserScript==

(function() {
    var amount = 12;
    var duration = 60; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 88) { // KEY_X
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
// ==UserScript==
// @name         DOUBLE SPLIT
// @namespace    Macro Split
// @version      0.01
// @description  Pulsa Z Para 16 Espacios
// @author       Harambe af
// @license      LC0
// @match        http://c0nsume.me
// @match        http://c0nsume.me/index.php
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    var amount = 2;
    var duration = 40; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 68) { // KEY_D
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