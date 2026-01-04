// ==UserScript==
// @name         Remove Gradient Dimming in Video Player on Prime Video
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      GNU GPLv3
// @description  Removes the gradient dimming on the top of the video player on Prime Video
// @author       Slyceth
// @match        *://*.primevideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502804/Remove%20Gradient%20Dimming%20in%20Video%20Player%20on%20Prime%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/502804/Remove%20Gradient%20Dimming%20in%20Video%20Player%20on%20Prime%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeGradient() {
        const gradientOverlays = document.querySelectorAll('.atvwebplayersdk-overlays-container > div:first-child, .gradientOverlay');

        gradientOverlays.forEach(function(overlay) {
            overlay.style.background = 'none';
        });
    }

    removeGradient();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                removeGradient();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    setInterval(removeGradient, 1000);
})();