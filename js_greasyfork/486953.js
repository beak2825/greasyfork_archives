// ==UserScript==
// @name         Twitch Auto Points
// @namespace    Terminator.Scripts
// @version      0.1
// @description  Auto claim points
// @author       TERMINATOR
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486953/Twitch%20Auto%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/486953/Twitch%20Auto%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function claim() {
        const claimBTN = document.querySelector("div.community-points-summary > div > div > div > div > button");
        if (claimBTN) {
            claimBTN.click();
        }
    }

    setInterval(() => {
        claim();
    }, 5000);

})();