// ==UserScript==
// @name         Direct download sachvuii.com
// @version      1.2
// @description  Changes the download links to direct downloads
// @match        https://sachvuii.com/*
// @grant        none
// @license     WTFPL
// @namespace https://greasyfork.org/users/1268060
// @downloadURL https://update.greasyfork.org/scripts/488558/Direct%20download%20sachvuiicom.user.js
// @updateURL https://update.greasyfork.org/scripts/488558/Direct%20download%20sachvuiicom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToDirectDownloadUrl(type) {
        const baseUrl = "https://sachvuii.com/wp-content/uploads/file/";
        const currentSlug = window.location.pathname.split('/').filter(Boolean).pop();
        return `${baseUrl}${type}/sachvui-${currentSlug}.${type}`;
    }

    // Change the online reading link
    function updateOnlineLink() {
        const currentUrl = window.location.href;
        const onlineButton = document.querySelector('a[href*="type=online"]');
        if (onlineButton) {
            const newUrl = `${currentUrl}?doc=pdf`;
            onlineButton.href = newUrl;
        }
    }

    // Get all download buttons
    const epubButton = document.querySelector('a[href*="type=epub"]');
    const mobiButton = document.querySelector('a[href*="type=mobi"]');
    const pdfButton = document.querySelector('a[href*="type=pdf"]');

    // Update the href for each button
    if(epubButton) epubButton.href = convertToDirectDownloadUrl('epub');
    if(mobiButton) mobiButton.href = convertToDirectDownloadUrl('mobi');
    if(pdfButton) pdfButton.href = convertToDirectDownloadUrl('pdf');

    updateOnlineLink();
})();
