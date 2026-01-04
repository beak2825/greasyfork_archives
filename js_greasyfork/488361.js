// ==UserScript==
// @name         Reddit - Move Thumbnails to Left (LG V60)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Simply move all thumbnails to the left for easier access.
// @author       Threeskimo
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488361/Reddit%20-%20Move%20Thumbnails%20to%20Left%20%28LG%20V60%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488361/Reddit%20-%20Move%20Thumbnails%20to%20Left%20%28LG%20V60%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to add styles to thumbnail div and title anchor tags
    function styleArticleElements() {
        const articles = document.querySelectorAll('article');

        articles.forEach(article => {
            const thumbnail = article.querySelector('div[slot="thumbnail"]');
            if (thumbnail) {
                const titleAnchors = article.querySelectorAll('a[slot="title"]');
                const postFlairTags = article.querySelectorAll('shreddit-post-flair');

                thumbnail.style.right = '245px';

                titleAnchors.forEach(anchor => {
                    anchor.style.left = '90px';
                    anchor.style.position = 'relative';
                });

                postFlairTags.forEach(tag => {
                    tag.style.left = '90px';
                    tag.style.position = 'relative';
                });
            }
        });
    }

    // Run the function every 0.5 seconds
    setInterval(styleArticleElements, 500);
})();