// ==UserScript==
// @name         Agar-Mass-Ejector
// @namespace    Online
// @version      5.6
// @description  enter something useful
// @author       You
// @match        http://agar.io/
// @match        http://agar.io/?ip=127.0.0.1:443
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12191/Agar-Mass-Ejector.user.js
// @updateURL https://update.greasyfork.org/scripts/12191/Agar-Mass-Ejector.meta.js
// ==/UserScript==

(function() {
    var amount = 9;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_W
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
setShowMass(true);
setSkipStats(true);
setDarkTheme(true);
setNoColors(false);
setNoSkins(false);
setNoNames(false);