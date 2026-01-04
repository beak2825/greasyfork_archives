// ==UserScript==
// @name         Twitch Theatermode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto activate theater mode on twitch
// @author       Therrom
// @match        http*://*.twitch.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442984/Twitch%20Theatermode.user.js
// @updateURL https://update.greasyfork.org/scripts/442984/Twitch%20Theatermode.meta.js
// ==/UserScript==

let tries = 0;

(function() {
    'use strict';

    tryTheatre();
})();

function tryTheatre() {
    var t = document.querySelector('button[data-a-target="player-theatre-mode-button"]');
    if (t) {
        t.click();
    } else {
        if (tries++ < 100) {
            setTimeout(tryTheatre, 1000);
        }
    }
}