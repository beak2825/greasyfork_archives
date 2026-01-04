// ==UserScript==
// @name         Youtube Ad Blocker by Bluemoon
// @namespace    http://tampermonkey.net/
// @license MI
// @version      0.1
// @description  Youtube ads  blocker
// @author       IND-BLUEMOON_YT#4211
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460902/Youtube%20Ad%20Blocker%20by%20Bluemoon.user.js
// @updateURL https://update.greasyfork.org/scripts/460902/Youtube%20Ad%20Blocker%20by%20Bluemoon.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var ad = document.getElementById('ad');
    if (ad) {
        ad.parentNode.removeChild(ad);
    }
})();