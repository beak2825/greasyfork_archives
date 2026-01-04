// ==UserScript==
// @name         Optimiser
// @namespace    http://tampermonkey.net/
// @version      2025-06-18
// @description  Optimal block mining
// @author       You
// @include      https://deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541466/Optimiser.user.js
// @updateURL https://update.greasyfork.org/scripts/541466/Optimiser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(() => {
        console.log("starting")
        let bonusPanel = document.querySelectorAll('[id^="bonus-panel"]')[0];
        bonusPanel.innerHTML = '\
<div id="sector_counter">\
</div>\
' + bonusPanel.innerHTML;

        let tiles = document.querySelectorAll('[id^="tile_wrapper"]');
        let SectorCounter = document.querySelectorAll('[id^="sector_counter"]')[0];
        let regular = 0, corrupt = 0, valuable = 0;
        if (tiles) {
            tiles.forEach((tile) => {
                let tileType = tile.innerText.replace(/[^⚙︎^$︎^▓︎]/g,"");
                switch (tileType) {
                    case "▓︎":
                        break;
                    case "⚙︎":
                        corrupt += 1;
                        break;
                    case "$︎":
                        valuable += 1;
                        break;
                    default:
                        regular += 1;
                }
                new MutationObserver((mutation, observer) => {
                    let tileType = tile.innerText.replace(/[^⚙︎^$︎^▓︎]/g,"");
                    switch (tileType) {
                        case "▓︎":
                            break;
                        case "⚙︎":
                            corrupt += 1;
                            SectorCounter.innerText = "▓︎: " + regular + "\n⚙︎: " + corrupt + "\n$︎: " + valuable;
                            observer.disconnect();
                            break;
                        case "$︎":
                            valuable += 1;
                            SectorCounter.innerText = "▓︎: " + regular + "\n⚙︎: " + corrupt + "\n$︎: " + valuable;
                            observer.disconnect();
                            break;
                        default:
                            regular += 1;
                            SectorCounter.innerText = "▓︎: " + regular + "\n⚙︎: " + corrupt + "\n$︎: " + valuable;
                            observer.disconnect();
                    }
                }).observe(tile, { childList: true });
            });
        }
        SectorCounter.innerText = "▓︎: " + regular + "\n⚙︎: " + corrupt + "\n$︎: " + valuable;
    }, 3000);
})();

