// ==UserScript==
// @name         Softr.io Cleanup
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Deletes most elements that are off topic to the page. This does not include ads.
// @author       TheApkDownloader
// @license      GNU GPLv3
// @match        https://*.softr.io/*
// @icon         https://assets.softr-files.com/assets/images/softr_logo/softr_logo_icon_only.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521347/Softrio%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/521347/Softrio%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanUp() {
        const cookieBanner = document.getElementById('cookiebanner');
        if (cookieBanner) {
            cookieBanner.remove();
        }

        const madeByElements = document.getElementsByClassName('made-by-softr');
        Array.from(madeByElements).forEach(element => element.remove());

        const swBannerElements = document.getElementsByClassName('sw-banner');
        Array.from(swBannerElements).forEach(element => element.remove());

        const elementsWithAltTextProductHunt = document.querySelectorAll('img[alt*="Product Hunt"]');
        elementsWithAltTextProductHunt.forEach(element => element.remove());

        const elementsWithAltTextFreeWebsiteBuilder = document.querySelectorAll('img[alt*="Free Website Builder"]');
        elementsWithAltTextFreeWebsiteBuilder.forEach(element => element.remove());
    }

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        if (args[0].includes('https://api.producthunt.com/widgets/embed-image') && args[0].includes('top-post-badge.svg')) {
            location.reload();
            return new Response(null, { status: 404 });
        }
        return originalFetch(...args);
    };

    const observer = new MutationObserver(() => {
        cleanUp();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(cleanUp, 1000);

    cleanUp();
})();
