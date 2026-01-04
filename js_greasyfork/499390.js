// ==UserScript==
// @name         Youtube no below 1K
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Remove small view count video thumbs in the main page
// @author       CosmicRice
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/499390/Youtube%20no%20below%201K.user.js
// @updateURL https://update.greasyfork.org/scripts/499390/Youtube%20no%20below%201K.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const absoluteUrls = ['https://www.youtube.com', 'https://www.youtube.com/'];
    const partialUrls = ['https://www.youtube.com/watch?'];

    const removeSmallViews = () => {
        // Under 1K
        const allThumbnailMetadata = [...document.querySelectorAll('div#metadata-line > span.inline-metadata-item')];

        const viewMetadata = allThumbnailMetadata.filter((d) => d.textContent.includes(' views') && !d.textContent.includes('K') && !d.textContent.includes('M') && !d.textContent.includes('B'));
        const smallViewMetadata = viewMetadata.filter((d) => parseInt(d.textContent.replace(' views'), 10) < 1000 || d.textContent === 'No views' || d.textContent === '1 view');

        const smallViewYoutubeThumbEls = smallViewMetadata.map((el) => el.closest('ytd-rich-item-renderer') || el.closest('ytd-compact-video-renderer')).filter(el => el && el.style.display !== 'none');

        if (smallViewYoutubeThumbEls.length === 0) { return false; }
        smallViewYoutubeThumbEls.forEach((el) => { el.style.display = 'none' });
        return true;
    }

    const interval = setInterval(() => {
        // workaround for tampermonkey not catching youtube route change
        if (absoluteUrls.includes(window.location.href) || partialUrls.some(u => window.location.href.includes(u))) {
            removeSmallViews();
            return;
        }
    }, 1000);
})();