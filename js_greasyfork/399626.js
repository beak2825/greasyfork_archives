// ==UserScript==

// @author       Kaiokeno
//               https://twitter.com/Kaiokenoh  //  https://github.com/Kaiokeno

// @name         ROBLOX: Enable Game Filter
// @description  Enable the 'Old-School' Game Filter, decent for finding the perfect game.
// @icon         https://i.imgur.com/wV7C3y1.png

// @match        *://*.roblox.com/games/?SortFilter*
// @namespace    https://www.roblox.com/
// @namespace    https://greasyfork.org/en/scripts/399626-roblox-enable-game-filter
// @supportURL   https://twitter.com/messages/733710878399467520-733710878399467520

// @license      MIT
// @version      0.0.12

// @downloadURL https://update.greasyfork.org/scripts/399626/ROBLOX%3A%20Enable%20Game%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/399626/ROBLOX%3A%20Enable%20Game%20Filter.meta.js
// ==/UserScript==


function loadEvent() {
    new MutationObserver(function() {
        let getFilter = document.getElementsByClassName('filter-hidden');
        if(getFilter[0]) {
            Array.from(getFilter).forEach(function(GameFilter) {
                GameFilter.style.visibility = 'unset';
                GameFilter.style.height = 'unset';
            })
        };

    }) .observe(document, {
        subtree: true,
        childList: true
    });
};

window.onload = loadEvent;