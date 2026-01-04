// ==UserScript==
// @name         Patreon Auto-Like on Download
// @namespace    https://github.com/dear-clouds/mio-userscripts
// @version      1.1
// @description  Automatically like a post when downloading an attachment on Patreon
// @author       Mio.
// @supportURL   https://github.com/dear-clouds/mio-userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @license      GPL-3.0
// @match        *://*.patreon.com/posts/*
// @match        *://*.patreon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513745/Patreon%20Auto-Like%20on%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/513745/Patreon%20Auto-Like%20on%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Observe for new posts loaded dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    processPosts();
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        processPosts();
    });

    function processPosts() {
        // Select all posts that may contain attachments
        const posts = document.querySelectorAll('[data-tag="post-card"]');
        posts.forEach(post => {
            const attachmentContainer = post.querySelector('[data-tag="post-attachments"]');
            if (attachmentContainer) {
                const attachmentElements = attachmentContainer.querySelectorAll('a[data-tag="post-attachment-link"]');
                attachmentElements.forEach(element => {
                    element.addEventListener('click', () => {
                        likePostIfNotLiked(post);
                    });
                });
            }
        });
    }

    function likePostIfNotLiked(postElement) {
        if (!postElement) return;
        const likeButton = postElement.querySelector('[data-tag="like-button"]');
        if (likeButton && likeButton.getAttribute('aria-checked') === 'false') {
            // Simulate a user click on the like button using a mouse event
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            likeButton.dispatchEvent(event);
            console.log('Attempted to like the post by dispatching a click event.');
        }
    }
})();
