// ==UserScript==
// @name         agarx-mod
// @namespace    http://github.com/xwalewx/
// @version      0.03
// @description  A faster, continuous mass ejector for agar.
// @author       xwalewx
// @license      MIT
// @match        http://agarx.biz/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368519/agarx-mod.user.js
// @updateURL https://update.greasyfork.org/scripts/368519/agarx-mod.meta.js
// ==/UserScript==

(function() {
    var amount = 1;
    var duration = 1; //ms

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
