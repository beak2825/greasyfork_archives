// ==UserScript==
// @name         Antimatter Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to make the tab title display how much resource you have
// @author       ducdat0507
// @match        https://ivark.github.io/
// @match        https://aarextiaokhiao.github.io/IvarK.github.io/
// @grant        none
// @license      yes
// @downloadURL https://update.greasyfork.org/scripts/441656/Antimatter%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/441656/Antimatter%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        function fn(n) {
            return formatValue(player.options.notation, n, 2, 0)
        };
        document.title = !player ? "Loading Antimatter Dimensions..." :
        ((player.eternityPoints.gt(0) ? (fn(player.eternityPoints) + ' EP, ') : "") +
         (player.infinityPoints.gt(0) ? (fn(player.infinityPoints) + ' IP, ') : "") +
         fn(player.money) + ' AM')
    }, 100);
})();