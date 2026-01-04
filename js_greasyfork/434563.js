// ==UserScript==
// @name         Gather Cookie Finder
// @namespace    http://talhahabib.com/
// @version      0.1
// @description  gather cookie stealer!
// @author       Talha Habib
// @match        *://*.gather.town/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434563/Gather%20Cookie%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/434563/Gather%20Cookie%20Finder.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var exec = false;
    var find = (str, autoMove = true, findTill = 2, teleportBackIn = 10) => {
        var c = 1;
        var intr = setInterval(() => {
            var o = game.completeMaps[gameSpace.mapId].objects; // current game objects
            var e = Object.keys(o); // converted to array
            var b = o[e.filter(s => o[s].id == str)]; // finding id for given string
            var p = game.players[gameSpace.id]; // player position

            console.log(++c); // indicator
            if (b) { // object found
                if(autoMove){
                    game.teleport(0, b.x, b.y); // teleporting to found object
                    setTimeout(() => game.teleport(0, p.x, p.y), 1000 * teleportBackIn); // player going back to original position where he teleported from
                }
                clearInterval(intr) // stop interval
                exec = false // unlock trigger
            }
        }, 1000); // 1s ticker
        setTimeout(() => { // max limit
            clearInterval(intr) // stop interval
            exec = false // unlock trigger
        }, 1000 * 60 * findTill); // find till 2 minute default
        return intr;
    }
    var keys = [];
    document.addEventListener("keydown", function(zEvent) {
        // alt + f on windows
        // option + f on mac
        keys.push(zEvent.code)
        if (keys.includes("KeyF") && (keys.includes("AltRight") || keys.includes("AltLeft")) && !exec) {
            console.log('triggered')
            find('COOKIE-HUNT-COOKIE')
            exec = true;
        }
    });
    document.addEventListener('keyup', () => keys = []);
    // Your code here...
})();