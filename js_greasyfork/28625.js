// ==UserScript==
// @name         SteamCN Auto Sync
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto sync Steam stats for SteamCN
// @icon         https://steamcn.com/favicon-hq.ico
// @author       Bisumaruko
// @match        https://steamcn.com/*
// @downloadURL https://update.greasyfork.org/scripts/28625/SteamCN%20Auto%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/28625/SteamCN%20Auto%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timer = localStorage.getItem('SteamCN_timer'),
        interval = 2 * 60 * 60 * 1000; //2 hours * 60 m * 60 s * 1000 ms

    if (!timer || Date.now() - timer > interval) {
        var iFrame = document.createElement('iframe');

        iFrame.src = 'https://steamdb.steamcn.com/sync';
        iFrame.style = 'height: 0px; border: none;';
        document.body.appendChild(iFrame);
        localStorage.setItem('SteamCN_timer', Date.now());
    }

})();
