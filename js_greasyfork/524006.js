// ==UserScript==
// @name         BeatStars Ad Blocker
// @version      1.0.0
// @description  block annoying beat promotions
// @author       danthekidd
// @match        https://www.beatstars.com/*
// @run-at       document-start
// @icon         https://content.beatstars.com/public/bts/content/favicon.png
// @grant        none
// @namespace https://greasyfork.org/users/1287532
// @downloadURL https://update.greasyfork.org/scripts/524006/BeatStars%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/524006/BeatStars%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url.includes("getPartialAds")) {
            console.log(`Blocked XMLHttpRequest to: ${url}`);
            this.abort();
            return;
        }

        originalOpen.call(this, method, url, ...rest);
    };

})();
