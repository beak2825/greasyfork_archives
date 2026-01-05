// ==UserScript==
// @name         Netflix Next
// @version      0.2.1
// @description  Instantly plays the next episode. This script skips the wait time on auto-play and circumvents the "auto pause" that checks if you're still watching.
// @author       Luxocracy
// @grant        none
// @match        https://www.netflix.com/*
// @namespace https://greasyfork.org/users/30239
// @downloadURL https://update.greasyfork.org/scripts/17060/Netflix%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/17060/Netflix%20Next.meta.js
// ==/UserScript==
(function() {
    /*jshint multistr: true */
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length == 0) return

            for (let node of mutation.addedNodes) {
                if (['next-episode-seamless-button', 'interrupt-autoplay-continue'].includes(node.dataset?.uia)) {
                    let button = document.querySelector(`[data-uia='${node.dataset.uia}']`)
                    button?.click();
                }
            }
        });
    });

    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();