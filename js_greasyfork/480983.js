// ==UserScript==
// @name         Twitch Auto Claimer
// @version      1
// @description  Auto Claim
// @author       https://github.com/IrisV3rm
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1162796
// @downloadURL https://update.greasyfork.org/scripts/480983/Twitch%20Auto%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/480983/Twitch%20Auto%20Claimer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkAndClaimPoints() {
        document.querySelectorAll('button[aria-label="Claim Bonus"]').forEach(element => {
            element.click();
        });
    }
    new MutationObserver(checkAndClaimPoints).observe(document.body, { childList: true, subtree: true, attributes: true});
})();