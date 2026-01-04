// ==UserScript==
// @name         Hide Verified X Users with Whitelist
// @namespace    http://tampermonkey.net/
// @version      2024-10-10
// @description  Hide comments and posts from verified (blue check) users on Twitter (x.com) except whitelisted users
// @author       You
// @match        *://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512094/Hide%20Verified%20X%20Users%20with%20Whitelist.user.js
// @updateURL https://update.greasyfork.org/scripts/512094/Hide%20Verified%20X%20Users%20with%20Whitelist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const whitelist = ["elonmusk"];

    function hideBlueCheckUsers() {
        const posts = document.querySelectorAll('article');
        posts.forEach(post => {
            const usernameElement = post.querySelector('div[dir="ltr"] a[role="link"]');
            const blueCheck = post.querySelector('svg[data-testid="icon-verified"]');

            if (blueCheck && usernameElement) {
                const username = usernameElement.getAttribute('href').replace('/', '').trim();
                if (!whitelist.includes(username)) {
                    post.style.display = 'none';
                }
            }
        });
    }

    function waitForElements() {
        const observer = new MutationObserver((mutations, obs) => {
            const posts = document.querySelectorAll('article');
            if (posts.length > 0) {
                hideBlueCheckUsers();
                obs.disconnect();
                const pageObserver = new MutationObserver(hideBlueCheckUsers);
                pageObserver.observe(document.body, { childList: true, subtree: true });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElements();
})();