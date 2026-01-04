// ==UserScript==
// @name         Slither.io simple zoom
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Press z to zoom in, x to zoom out, and c to let zoom drift with game.
// @author       Thor Lancaster
// @match        http://slither.io/
// @grant        none
// @comment Press z to zoom in, x to zoom out, and c to let zoom drift with game.
// @downloadURL https://update.greasyfork.org/scripts/383456/Slitherio%20simple%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/383456/Slitherio%20simple%20zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        if(window.desiredGSC){
            window.gsc = window.desiredGSC;
        }
    }, 100);

    addEventListener('keydown', function (e) {
        if (e.key == 'z') {
            window.desiredGSC = window.gsc * 0.9;
            window.gsc = window.desiredGSC;
        }
        if(e.key == 'c') {
            window.desiredGSC = undefined;
        }
        if (e.key == 'x') {
            window.desiredGSC = window.gsc * 1.11;
            window.gsc = window.desiredGSC;
        }
    });
})();