// ==UserScript==
// @name         Land of the Rair Debugging Tools
// @namespace    http://rair.land
// @version      0.1
// @description  Debug this awful game
// @author       Seiyria
// @match        http*://rair.land
// @match        http://localhost:4200
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38422/Land%20of%20the%20Rair%20Debugging%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/38422/Land%20of%20the%20Rair%20Debugging%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let globalInterval = null;
    let curTeleportLoc = 0;

    console.log('Land of the Rair debugging tools init; window.rairHelp() to see all commands');

    window.rairHelp = () => {
        console.table({
            'window.itemX(num, item)': 'spawn num of item on the ground',
            'window.teleportBetween(locations, delay)': 'teleport between all locations with a delay (loc must be like: "8 8 Rylt"',
            'window.cancelTeleportBetween()': 'cancel previous teleportBetween'
        });
    };

    window.itemX = (num, item) => {
        for(let i = 0; i < num; i++) {
            window.sendCommand(`@item ${item}`);
        }
    };

    window.teleportBetween = (locations, delay) => {
        if(globalInterval) {
            window.cancelTeleportBetween();
        }
        globalInterval = setInterval(() => {
            curTeleportLoc = curTeleportLoc + 1 === locations.length ? 0 : curTeleportLoc + 1;
            window.sendCommand(`@teleport ${locations[curTeleportLoc]}`);
        }, delay);
    };

    window.cancelTeleportBetween = () => { curTeleportLoc = 0; clearInterval(globalInterval); };
})();