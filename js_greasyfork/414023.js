// ==UserScript==
// @name         Twitch-chest-auto-clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Farm twitch chat points easier. Clicks twitch chat chest points.
// @author       VicenteJ.
// @grant        none
// @include      https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/414023/Twitch-chest-auto-clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/414023/Twitch-chest-auto-clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        if (document.getElementsByClassName('claimable-bonus__icon') && document.getElementsByClassName('claimable-bonus__icon')[0]) {
            document.getElementsByClassName('claimable-bonus__icon')[0].click();
        }
    }, 5000).call(this);
})();