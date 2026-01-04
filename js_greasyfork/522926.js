// ==UserScript==
// @name clear all posts that want help
// @description hide posts with help and question flairs does not work with old reddit
// @version 1.0
// @namespace clear help and question posts on r/robloxhackers
// @license MIT
// @author M-r7z
// @match https://www.reddit.com/r/robloxhackers/*
// @downloadURL https://update.greasyfork.org/scripts/522926/clear%20all%20posts%20that%20want%20help.user.js
// @updateURL https://update.greasyfork.org/scripts/522926/clear%20all%20posts%20that%20want%20help.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hide() {
        const posts = document.querySelectorAll('shreddit-post');

        posts.forEach(post => {
            const flair = post.querySelector('shreddit-post-flair .flair-content');
            if (flair && (flair.textContent.includes("HELP") || flair.textContent.includes("QUESTION"))) {
                post.style.display = 'none';
            }
        });
    }

    hide();

    const observer = new MutationObserver(hide);
    observer.observe(document.body, { childList: true, subtree: true });
})();
