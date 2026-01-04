// ==UserScript==
// @name              [Diep.io] Respawn Score Boost
// @namespace    http://tampermonkey.net/
// @version           1.1
// @description     Gives you the score boost without watching any ads.
// @author            _Vap
// @match            https://diep.io/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @license          MIT
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/489683/%5BDiepio%5D%20Respawn%20Score%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/489683/%5BDiepio%5D%20Respawn%20Score%20Boost.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        let screen = window.ui.screen;
        if (screen === "stats") return;
        else window.input.grantReward();
    }, 250);
})();