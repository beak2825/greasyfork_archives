// ==UserScript==
// לא לגעת בכלום!
// @name         niSoEditor - FastSplit
// @namespace    אפשר להפצל 16--
// @version      11.1
// @description  תלחצו D כדי להתפצל או Z
// @author       Niso (Happy Cat)
// @license      MIT
// @match        http://www.blobs.co.il/*
// @grant        none
// @run-at       בהצלחה
// @downloadURL https://update.greasyfork.org/scripts/26884/niSoEditor%20-%20FastSplit.user.js
// @updateURL https://update.greasyfork.org/scripts/26884/niSoEditor%20-%20FastSplit.meta.js
// ==/UserScript==
(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 90) { // KEY_D
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