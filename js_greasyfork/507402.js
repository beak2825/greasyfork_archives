// ==UserScript==
// @name         Google Search Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide sponsored content in Google search results
// @match        https://www.google.com/search*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/507402/Google%20Search%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/507402/Google%20Search%20Ad%20Blocker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function hideAds() {
        const topAds = document.querySelectorAll('#tads');
        topAds.forEach(ad => ad.style.display = 'none');

        const rightAds = document.querySelectorAll('#rhs');
        rightAds.forEach(ad => ad.style.display = 'none');

        const inlineAds = document.querySelectorAll('.ads-ad');
        inlineAds.forEach(ad => ad.style.display = 'none');
    }

    hideAds();

    const observer = new MutationObserver(hideAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
