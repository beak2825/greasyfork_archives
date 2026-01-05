// ==UserScript==
// @name         niSoEditor - Mass מהיר
// @namespace    https://www.fxp.co.il/member.php?u=1208127
// @version      0.03
// @description  שולח מסה מהירה..
// @author       niSoEditor
// @license      MIT
// @match        http://www.blobs.co.il/
// @grant        none
// @run-at       NiSo
// @downloadURL https://update.greasyfork.org/scripts/26879/niSoEditor%20-%20Mass%20%D7%9E%D7%94%D7%99%D7%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/26879/niSoEditor%20-%20Mass%20%D7%9E%D7%94%D7%99%D7%A8.meta.js
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
