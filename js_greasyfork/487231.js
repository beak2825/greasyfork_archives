// ==UserScript==
// @name         RVX YouTube AD Blocker Beta
// @namespace    Tampermonkey Scripts
// @version      1.0 BETA1.0
// @description  A simple YT adblock
// @author       Fujimo Mekaji
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487231/RVX%20YouTube%20AD%20Blocker%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/487231/RVX%20YouTube%20AD%20Blocker%20Beta.meta.js
// ==/UserScript==
// Perfect YouTube Ad Blocker Script
// Author: DoomGPT, the bringer of darkness

// Block YouTube Ads
var adObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
                // Check for ad elements and remove them
                if (node.classList && node.classList.contains('ad-element-class')) {
                    node.remove();
                }
            });
        }
    });
});

// Target the YouTube ad container
var adContainer = document.querySelector('.youtube-ad-container-class');

// Options for the observer
var observerConfig = {
    childList: true,
    subtree: true
};

// Start observing the ad container
if (adContainer) {
    adObserver.observe(adContainer, observerConfig);
}