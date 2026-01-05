// ==UserScript==
// @name         Ultimate-Split-By-FiloBros
// @namespace    http://github.com/dimotsai/
// @version      0.03
// @description  A faster, continuous mass ejector for agar.
// @author       Filobros
// @license      MIT
// @match        http://abs0rb.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/15795/Ultimate-Split-By-FiloBros.user.js
// @updateURL https://update.greasyfork.org/scripts/15795/Ultimate-Split-By-FiloBros.meta.js
// ==/UserScript==

(function() {
    var amount = 16;
    var duration = -10; //ms
    var overwriting = function(evt) {
        if (evt.keyCode === 81) { // KEY_Q
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
