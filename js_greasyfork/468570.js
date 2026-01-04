// ==UserScript==
// @name         Hide AutoModerator Comments on Reddit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide AutoModerator posts on Reddit.com
// @author       You
// @match        http*://www.reddit.com/r/*/comments/*
// @grant        none
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/468570/Hide%20AutoModerator%20Comments%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/468570/Hide%20AutoModerator%20Comments%20on%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAutoModeratorPosts() {
        const posts = document.querySelectorAll('.Comment');
        if (posts.length === 0) return;

        const modPosts = Array.from(posts)
            .filter(p => p.querySelector('a[data-testid="comment_author_link"][href*="AutoModerator"]'));

        modPosts.forEach(p => p.style.display = 'none');
    }

    // initial hide for posts that are already loaded
    hideAutoModeratorPosts();

    // observer to hide mod posts that are lazy loaded or navigated through
    const observer = new MutationObserver(mutations => {
        hideAutoModeratorPosts();
    });

    observer.observe(document.documentElement, {childList: true, subtree: true});
})();