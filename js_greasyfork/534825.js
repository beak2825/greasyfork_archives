// ==UserScript==
// @name         Tumblr .gifv to .gif Replacer
// @namespace    lander_scripts
// @version      1.0
// @description  Replace all .gifv image sources with .gif on Tumblr
// @author       You
// @match        *://*.tumblr.com/*
// @icon         https://assets.tumblr.com/pop/manifest/favicon-0e3d244a.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534825/Tumblr%20gifv%20to%20gif%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/534825/Tumblr%20gifv%20to%20gif%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceGifvSources() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && img.src.endsWith('.gifv')) {
                img.src = img.src.replace(/\.gifv$/, '.gif');
            }
        });
    }

    // Run on initial load
    replaceGifvSources();

    // Run again if DOM changes (e.g., Tumblr loads posts dynamically)
    const observer = new MutationObserver(() => {
        replaceGifvSources();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
