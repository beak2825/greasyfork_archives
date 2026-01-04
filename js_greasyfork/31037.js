// ==UserScript==
// @name         niSoEditor - Split מהיר
// @namespace    niSoTheOne
// @version      11.11
// @description  תלחצו D כדי להתפצל 16 +
// @author       Niso (Happy Cat)
// @license      MIT
// @match        http://www.blobs.co.il/*
// @grant        נISRAEL
// @run-at       niSoEditor
// @downloadURL https://update.greasyfork.org/scripts/31037/niSoEditor%20-%20Split%20%D7%9E%D7%94%D7%99%D7%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31037/niSoEditor%20-%20Split%20%D7%9E%D7%94%D7%99%D7%A8.meta.js
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
