// ==UserScript==
// @name         YouTube consent bump remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the annoying consent-bump from youtube.com. (the final . is necessary for removing ads)
// @author       Federico Antoniazzi
// @match        https://www.youtube.com./*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421999/YouTube%20consent%20bump%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/421999/YouTube%20consent%20bump%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let noisy = null
    let counter = 10

    const nail = muteConsentBump() || setInterval(() => {
        counter--;
        if (!counter) {
            clearInterval(nail);
        }
        muteConsentBump();
    }, 500);

    function muteConsentBump() {
        noisy = document.getElementById("consent-bump");
        if (noisy) {
            noisy.remove();
            console.log("FATTO");
            return true;
        }
    }
})();