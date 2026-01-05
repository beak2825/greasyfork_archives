// ==UserScript==
// @name         Scrub Settings
// @namespace    https://github.com/DaFudgeWizzad
// @version      Cancer
// @description  Macro mass and auto custom settings
// @author       DaFudgeWizzad
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12531/Scrub%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/12531/Scrub%20Settings.meta.js
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
setNoSkins(false);
setNoNames(false);
setNoColors(false);
setShowMass(true);
setDarkTheme(true);
setSkipStats(true);
setAcid(false);
setShowChart(false);
setColorlessViruses(false);
(end);
