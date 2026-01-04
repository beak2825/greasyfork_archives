// ==UserScript==
// @name         Imgur: fix HTML escape sequences in the old design
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Imgur's "old design" sometimes includes HTML escape sequences in post descriptions, such as having "&#34;" and "&#39;" instead of quotation marks. This replaces them with the appropriate characters.
// @author       Corrodias
// @match        https://imgur.com/gallery/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481153/Imgur%3A%20fix%20HTML%20escape%20sequences%20in%20the%20old%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/481153/Imgur%3A%20fix%20HTML%20escape%20sequences%20in%20the%20old%20design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof imgur === 'undefined') return; // This is not the old design.

    const mutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE)
                    processAddedNode(node);
            }
        }
    });

    function processAddedNode(node) {
        // Only act if a new post has been loaded.
        if (!node.classList.contains('post-image-container')) return;
        replaceText(node);
    }

    function replaceText(post) {
        // This is empty if the current page is not a post.
        const description = post.getElementsByClassName('post-image-description');
        for (const a of description) {
            a.textContent = a.textContent
                .replaceAll('&#34;', '"')
                .replaceAll('&#39;', "'")
                .replaceAll('&gt;', '>')
                .replaceAll('&lt;', '<')
                .replaceAll('&amp;', '&');
        }
    }

    // Run the replacement now in case this is a post.
    replaceText(document.body);

    // Monitor dynamically loaded content, for when the user nagivates to a new post. Observe as little as possible.
    const postContent = document.body.getElementsByClassName('post-images');
    for (const a of postContent) {
        mutationObserver.observe(a, { attributes: false, childList: true, subtree: true });
    }
})();