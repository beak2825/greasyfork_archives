// ==UserScript==
// @name         YouTube Shorts zu normaler URL Konverter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Konvertiert YouTube Shorts URLs automatisch zu regulären YouTube URLs
// @author       You
// @match        *://*.youtube.com/*
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520239/YouTube%20Shorts%20zu%20normaler%20URL%20Konverter.user.js
// @updateURL https://update.greasyfork.org/scripts/520239/YouTube%20Shorts%20zu%20normaler%20URL%20Konverter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertUrl() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/shorts/')) {
            const videoId = currentUrl.split('/shorts/')[1].split('?')[0];
            const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
            window.location.replace(newUrl);
        }
    }

    convertUrl();

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            convertUrl();
        }
    }).observe(document, {subtree: true, childList: true});
})();