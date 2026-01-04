// ==UserScript==
// @name         Facebook Feed Sponsored Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes sponsored posts on your Facebook feed
// @author       joshcantcode
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437313/Facebook%20Feed%20Sponsored%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/437313/Facebook%20Feed%20Sponsored%20Ad%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sidePanel = document.getElementById("ssrb_rhc_start").parentElement;

    const bodyMutating = function(mutationsList, observer) {
        let feedPosts = document.querySelectorAll('div[role="feed"] > div');

        feedPosts.forEach(post => {
            if (post.querySelector('a[aria-label="Sponsored"]') !== null) {
                post.remove();
            }
        });
    };

    const rightBarMutating = function(mutationsList, observer) {
        let rightBarChildren = sidePanel.children[1];

        for (let i = 0; i < rightBarChildren.children.length; i++) {
            var child = rightBarChildren.children[i];
            console.log(child);
            if (!child.hasAttribute('data-visualcompletion')) {
                child.remove();
            }
        }
    };

    rightBarMutating();
    bodyMutating();

    const rightBarObserver = new MutationObserver(rightBarMutating);
    rightBarObserver.observe(sidePanel, {childList: true, subtree: true, attributes: false});

    const bodyObserver = new MutationObserver(bodyMutating);
    bodyObserver.observe(document.querySelector('div[role="feed"]'), {childList: true, subtree: true, attributes: false});
})();