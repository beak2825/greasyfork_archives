// ==UserScript==
// @name         Resurviv UI Mod
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  QoL features for Resurviv/Namerio
// @author       You
// @match        http://resurviv.biz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506150/Resurviv%20UI%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/506150/Resurviv%20UI%20Mod.meta.js
// ==/UserScript==

(function() {
    function toggleUncappedFPS(enabled) {
        window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 1);
        };
    }


    function periodicallyShowKillCounter() {
        showKillCounter();
        setTimeout(periodicallyShowKillCounter, 100);
    }

    function showKillCounter() {
        var killCounter = document.getElementById('ui-kill-counter-wrapper');
        if (killCounter) {
            killCounter.style.display = 'block';

            var counterText = killCounter.querySelector('.counter-text');
            if (counterText) {
                counterText.style.minWidth = '30px';
            }
        }
    }


    showKillCounter();
    periodicallyShowKillCounter();
})();