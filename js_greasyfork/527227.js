// ==UserScript==
// @name         Reddit Subreddit Auto-Redirect to Hot
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects subreddit pages to the "hot" section, even when navigating within Reddit
// @author       You
// @match        https://www.reddit.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527227/Reddit%20Subreddit%20Auto-Redirect%20to%20Hot.user.js
// @updateURL https://update.greasyfork.org/scripts/527227/Reddit%20Subreddit%20Auto-Redirect%20to%20Hot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToHot() {
        let path = window.location.pathname;
        let subredditMatch = path.match(/^\/r\/([^\/]+)\/$/);

        console.log('checking match', path, subredditMatch)
        if (subredditMatch) {
            let newUrl = `https://www.reddit.com/r/${subredditMatch[1]}/hot`;
            if (window.location.href !== newUrl) {
                window.location.replace(newUrl);
            }
        }
    }

    // Run on initial page load
    redirectToHot();

    // Detect URL changes using MutationObserver
    const observer = new MutationObserver(() => {
        redirectToHot();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
