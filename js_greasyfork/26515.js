// ==UserScript==
// @name         W macro FEED Agario
// @namespace    FEED
// @version      0.02
// @description  W FEED
// @author       ww
// @license      MIT
// @match        http://c0nsume.me/private4.php?ip=98.236.80.75:443*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26515/W%20macro%20FEED%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/26515/W%20macro%20FEED%20Agario.meta.js
// ==/UserScript==

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 81) { // KEY_W
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