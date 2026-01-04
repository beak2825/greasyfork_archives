// ==UserScript==
// @name         Photopea Without Ads
// @description  Hide Photopea Ads
// @license      MIT
// @match        https://www.photopea.com/*
// @icon         https://www.photopea.com/promo/thumb256.png
// @version      0.1
// @author       ml98, N190392
// @namespace    https://greasyfork.org/en/scripts/536047-photopea-without-ads
// @downloadURL https://update.greasyfork.org/scripts/536047/Photopea%20Without%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/536047/Photopea%20Without%20Ads.meta.js
// ==/UserScript==

(function () {
    // Check if the page URL is exactly www.photopea.com/
    if (window.location.pathname === '/' && window.location.search === '') {
        location.hash = '#8887'; // Update the hash as needed
    }
})();