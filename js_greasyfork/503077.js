// ==UserScript==
// @name        Block Ads
// @namespace   Violentmonkey Scripts
// @match       *://vrbangers.com/*
// @grant       none
// @version     1.0
// @author      -
// @description block vrb ads to other sites via removing the grandparent elements of divs with the class 'video-item-preview --no-video' from the page.
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503077/Block%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/503077/Block%20Ads.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function removeNoVideoPreviews() {
        const elements = document.querySelectorAll('.video-item-preview.--no-video');
        elements.forEach(element => {
            const grandparent = element.parentElement?.parentElement;
            if (grandparent) {
                grandparent.remove();
            }
        });
    }

    function observePage() {
        const target = document.body;
        if (target) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches('.video-item-preview.--no-video')) {
                            const grandparent = node.parentElement?.parentElement;
                            if (grandparent) {
                                grandparent.remove();
                            }
                        }
                    });
                });
            });
            observer.observe(target, { childList: true, subtree: true });
        }
    }

    // Initial removal on page load
    removeNoVideoPreviews();

    // Observe dynamic content loading and remove matching elements' grandparents
    observePage();
})();