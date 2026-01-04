// ==UserScript==
// @name         HD Twitter
// @author       Duskdyr
// @description  Improves Twitter's (X) image quality by replacing image formats. When clicking an image, JPEGs are replaced with lossless PNGs.
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @grant        none
// @namespace    dskdr
// @license      MIT
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/524826/HD%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/524826/HD%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function imgrplcr() {
        document.querySelectorAll('img').forEach(img => {
            let url = img.src;

            if (url.includes('format=jpg') && url.includes('name=large')) {
                url = url.replace('=jpg', '=png');
//                url = url.replace('/feed_thumbnail', '/feed_fullsize');
            }
            if (img.src !== url) {
                img.src = url;
            }
        });
    }

    imgrplcr();

    const observer = new MutationObserver(imgrplcr);
    observer.observe(document.body, { childList: true, subtree: true });
})();
