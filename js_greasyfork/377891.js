// ==UserScript==
// @name         Krew.io Anti-Lag
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  A lag customizer for krew.io
// @author       DamienVesper
// @match        *://krew.io/*
// @match        *://*.krew.io/*
// @exclud       *://beta.krew.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377891/Krewio%20Anti-Lag.user.js
// @updateURL https://update.greasyfork.org/scripts/377891/Krewio%20Anti-Lag.meta.js
// ==/UserScript==

/*
Copyright DamienVesper 2019
Liscensed under the Apache 2.0 Liscence.
All rights reserved.
*/

(function() {
    'use strict';
    var newW = 1;
    var newH = 1;

    function keyController(e) {
        if(document.activeElement.tagName.toLowerCase() == `input`) return;
        else {
            let regCanvas = document.querySelectorAll(`canvas`)[0];
            let mapCanvas = document.querySelectorAll(`canvas`)[1];
            let regGL = regCanvas.getContext(`2d`);
            let mapGL = mapCanvas.getContext(`2d`);

            switch(e.keyCode) {
                case 189 || 107:
                    newW *= 1.25;
                    newH *= 1.25;

                    regCanvas.width = newW;
                    regCanvas.height = newH;

                    mapCanvas.width = newW;
                    mapCanvas.height = newH;

                    regGL.viewport(0, 0, newW, newH);
                    mapGL.viewport(0, 0, newW, newH);
                    break;
                case 187 || 109:
                    newW /= 1.25;
                    newH /= 1.25;

                    regCanvas.width = newW;
                    regCanvas.height = newH;

                    mapCanvas.width = newW;
                    mapCanvas.height = newH;

                    regGL.viewport(0, 0, newW, newH);
                    mapGL.viewport(0, 0, newW, newH);
                    break;
                default:
                    return console.log(`Key ${e.keyCode} typed.`);
            }
        }
    }

    document.addEventListener(`keydown`, function(e){keyController(e);});
})();