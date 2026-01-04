// ==UserScript==
// @name        Hide Blacklisted Posts on Rule34.xxx
// @namespace   lemusatage
// @description Simple script to hide blacklisted posts on Rule34.xxx
// @version     0.1
// @license     Unlicense
// @match       https://rule34.xxx/index.php?page=post&s=list*
// @downloadURL https://update.greasyfork.org/scripts/494038/Hide%20Blacklisted%20Posts%20on%20Rule34xxx.user.js
// @updateURL https://update.greasyfork.org/scripts/494038/Hide%20Blacklisted%20Posts%20on%20Rule34xxx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hideBlacklisted = () => {
        const blacklistedPosts = document.querySelectorAll('.thumb.blacklisted-image');
        blacklistedPosts.forEach(post => {
            post.style.display = 'none';
        });
    };
    hideBlacklisted();

    const observer = new MutationObserver((mutationsList, observer) => {
        hideBlacklisted();
    });
    const imageList = document.querySelector('.image-list');
    if (imageList) {
        observer.observe(imageList, { childList: true, subtree: true });
    }
})();
