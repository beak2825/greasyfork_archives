// ==UserScript==
// @name         NBA League Pass Player Controls Fix
// @namespace    https://github.com/griest024/
// @version      0.1.3
// @description  The controls for the NBA LP player don't disappear automatically in full screen. Its some n00b shit so I fixed it for them. Fuckin amatuers.
// @author       griest024
// @match        https://www.nba.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nba.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453847/NBA%20League%20Pass%20Player%20Controls%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/453847/NBA%20League%20Pass%20Player%20Controls%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playerSelector = '.media-player-container';
    var checkInterval = 100;

    function patchControls(player) {
        player.addEventListener('mouseleave', () => document.querySelectorAll('[data-hide="false"]').forEach(e => e.setAttribute('data-hide', true)));
        player.addEventListener('mouseenter', () => document.querySelectorAll('[data-hide="true"]').forEach(e => e.setAttribute('data-hide', false)));
    }

    function checkPlayerExistence() {
        var el = document.querySelector(playerSelector);

        if (!el) {
            setTimeout(checkPlayerExistence, checkInterval);
        } else {
            patchControls(el);
        }
    }

    checkPlayerExistence();
})();