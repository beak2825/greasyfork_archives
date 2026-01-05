// ==UserScript==
// @name         EP Macro (ORC)
// @namespace    http://orcclan.chatovod.com/
// @version      3.0
// @description  EP Macro coded for ORC Clan <3
// @author       Sopyan
// @match        http://www.epeffects.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12898/EP%20Macro%20%28ORC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12898/EP%20Macro%20%28ORC%29.meta.js
// ==/UserScript==

(function() {
    var amount = 10;
    var duration = 5; //ms

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
