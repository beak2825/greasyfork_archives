// ==UserScript==
// @name         Chronophoto cheat
// @namespace    http://tampermonkey.net/
// @version      2024-04-16
// @description  Automaticaly gets 1000 points per question. Simply press next round.
// @author       Anthony Kercher
// @match        https://www.chronophoto.app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/492681/Chronophoto%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/492681/Chronophoto%20cheat.meta.js
// ==/UserScript==

(function() {
        'use strict';

    console.log("initialized");



     function waitForGameFunction() {
        if (typeof pictureDate !== 'undefined' && typeof pictureDate === 'string') {
            let year = pictureDate/29.234
            pipsSlider.noUiSlider.set(year)
            submitAnswer()
        } else {
            setTimeout(waitForGameFunction, 100);
        }
    }
    waitForGameFunction();

})();