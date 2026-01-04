// ==UserScript==
// @name         Reddit blur NSFW 😅
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blur thumbnail images for NSFW-tagged posts on old.reddit.com
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @author       Agreasyforkuser
// @match        https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481272/Reddit%20blur%20NSFW%20%F0%9F%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/481272/Reddit%20blur%20NSFW%20%F0%9F%98%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to blur NSFW thumbnails
    function blurNSFWThumbnails() {
        const nsfwPosts = document.querySelectorAll('.nsfw-stamp');
        nsfwPosts.forEach(nsfwStamp => {
            const thumbnail = nsfwStamp.closest('.search-result, .link').querySelector('.thumbnail img');
            if (thumbnail) {
                thumbnail.style.filter = 'blur(5px)';
            }
        });
    }
    // Blur NSFW thumbnails on initial page load
    blurNSFWThumbnails();
    // Observe changes in the DOM and blur NSFW thumbnails dynamically
    const observer = new MutationObserver(() => blurNSFWThumbnails());
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
