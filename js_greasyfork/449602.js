// ==UserScript==
// @name         Improve 5e.tools visibility
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Enlarges window of 5e.tools
// @author       @marcelbrode
// @match        https://5e.tools/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5e.tools
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449602/Improve%205etools%20visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/449602/Improve%205etools%20visibility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkExist = setInterval(function() {
        const banner = document.querySelector('.w-100.no-shrink');

        if (banner !== null) {
            console.log("BANNED THE BANNER!");
            banner.remove();
            clearInterval(checkExist);
        }
    }, 100);

    document.querySelector('.cancer__wrp-leaderboard.cancer__anchor').remove();
    document.querySelector('#adhesive_container').remove();
})();