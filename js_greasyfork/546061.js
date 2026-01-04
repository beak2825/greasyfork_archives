// ==UserScript==
// @name        Hide Steam Soundtrack DLCs
// @namespace   EY4WE/hide-steam-soundtrack-dlcs
// @version     0.0.2
// @description Hide only the soundtrack DLCs from the "CONTENT FOR THIS GAME" list on the game's Steam page.
// @author      EY4WE
// @match       https://store.steampowered.com/app/*
// @license     GPL-3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/546061/Hide%20Steam%20Soundtrack%20DLCs.user.js
// @updateURL https://update.greasyfork.org/scripts/546061/Hide%20Steam%20Soundtrack%20DLCs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // サウンドトラックDLCのブロックを隠す
    var dlcElements = document.querySelectorAll('.ds_options, .game_area_dlc_row');
    dlcElements.forEach(function(el) {
        var text = el.textContent.toLowerCase();
        if (text.includes('soundtrack') || el.textContent.includes('サウンドトラック')) {
            el.style.display = 'none';
        }
    });
})();