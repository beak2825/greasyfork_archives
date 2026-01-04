// ==UserScript==
// @name         Lah Forum Post Link Modifier
// @icon         https://lah.li/favicon.ico?v=3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify links in forum posts from hxxp to http
// @match        https://lah.li/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500809/Lah%20Forum%20Post%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/500809/Lah%20Forum%20Post%20Link%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyLinks() {
        const posts = document.getElementsByClassName('postbubble');
        const urlRegex = /(?!<a)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])$/gim;

        for (let post of posts) {
            post.innerHTML = post.innerHTML.replace(/hxxp/g,'http');

            const links = post.getElementsByTagName('a');

            for (let link of links) {
                link.setAttribute('rel', 'noopener noreferrer nofollow');
                link.href = link.href.replace(/http/g, 'http://anonymto.com/?http');
            }

            // TEXT LINKS TO ACTUAL LINKS
            post.innerHTML = post.innerHTML.replace(urlRegex, ' <a href="http://anonymto.com/?$1" target="_blank" rel="noopener noreferrer nofollow">$1</a>');
        }
    }

    // Run the function when the page loads
    modifyLinks();

    // Optional: Use a MutationObserver to run the function when new content is added to the page
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                modifyLinks();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();