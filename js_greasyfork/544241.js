// ==UserScript==
// @name         Google Image Replacer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace all Google Images with your image
// @author       Partly ChatGPT, partly me
// @match        https://www.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544241/Google%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/544241/Google%20Image%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacementUrl = "https://emojiisland.com/cdn/shop/products/Emoji_Icon_-_Smiling_large.png?v=1571606089";

    function replaceImages() {
        document.querySelectorAll("img").forEach(img => {
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            img.src = replacementUrl;
            img.srcset = "";
        });
    }

    // Keep replacing images as more load
    const observer = new MutationObserver(replaceImages);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run immediately
    replaceImages();
})();