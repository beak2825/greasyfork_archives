// ==UserScript==
// @name         Youtube Video's Published Date
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Show YouTube video's publishing date, best to have these 2 uBlock origin filters "www.youtube.com##span.yt-formatted-string.style-scope.bold:nth-of-type(3)" & "www.youtube.com###owner-sub-count"
// @author       dpi0
// @include      *://*youtube.com/*
// @grant        none
// @homepageURL https://github.com/dpi0/scripts/blob/main/greasyfork/youtube-video-published-date.js
// @originalhomepageURL https://greasyfork.org/en/scripts/423791-youtube-videos-publishing-date
// @supportURL  https://github.com/dpi0/scripts/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532932/Youtube%20Video%27s%20Published%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/532932/Youtube%20Video%27s%20Published%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const infoStrings = document.querySelector('#info-strings');
        const subCount = document.querySelector('#owner-sub-count');
        if (infoStrings && subCount) {
            observer.disconnect();

            // Move the publishing date below the sub count
            infoStrings.remove();
            subCount.after(infoStrings);

            // Remove extra spans and apply styles
            infoStrings.querySelectorAll('span').forEach(e => e.remove());

            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            infoStrings.style.fontSize = '15px';
            infoStrings.style.fontWeight = '540';
            infoStrings.style.color = isDark ? '#f1f1f1' : '#0f0f0f';
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
