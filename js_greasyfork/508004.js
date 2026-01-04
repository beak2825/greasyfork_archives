// ==UserScript==
// @name         Ultrawide Fix for Kick (Auto Toggle by Aspect Ratio)
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      1.19
// @description  Adjust video player to maintain 21:9 aspect ratio only on ultrawide screens, auto-disable on 16:9 monitors. Fills screen minus sidebars and toolbars with minimal cropping, with dynamic full-screen adjustment.
// @match        *://kick.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/508004/Ultrawide%20Fix%20for%20Kick%20%28Auto%20Toggle%20by%20Aspect%20Ratio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508004/Ultrawide%20Fix%20for%20Kick%20%28Auto%20Toggle%20by%20Aspect%20Ratio%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isUltrawide() {
        const aspect = window.innerWidth / window.innerHeight;
        // 21:9 is ~2.37, 16:9 is ~1.78 → threshold at 2.0
        return aspect > 2.0;
    }

    function adjustVideoElement() {
        let videoElement = document.querySelector("video");
        if (!videoElement) return;

        if (isUltrawide()) {
            let leftSidebarWidth = 259;
            let rightSidebarWidth = 345;
            let topToolbarHeight = 77;

            if (document.fullscreenElement) {
                videoElement.style.width = '100vw';
                videoElement.style.height = 'calc(100vw / (21 / 9))';
                videoElement.style.position = 'fixed';
                videoElement.style.left = '0';
                videoElement.style.top = '0';
            } else {
                let viewportWidth = window.innerWidth;
                let availableWidth = viewportWidth - (leftSidebarWidth + rightSidebarWidth);
                let desiredHeight = availableWidth / (21 / 9);

                videoElement.style.width = `${availableWidth}px`;
                videoElement.style.height = `${desiredHeight}px`;
                videoElement.style.position = 'fixed';
                videoElement.style.left = `${leftSidebarWidth}px`;
                videoElement.style.top = `${topToolbarHeight}px`;
            }

            videoElement.style.objectFit = 'fill';
        } else {
            // Reset to default styles when not ultrawide
            videoElement.style.width = "";
            videoElement.style.height = "";
            videoElement.style.position = "";
            videoElement.style.left = "";
            videoElement.style.top = "";
            videoElement.style.objectFit = "";
        }
    }

    // Observe DOM changes to reapply adjustments
    function observeChanges() {
        let observer = new MutationObserver(() => adjustVideoElement());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Trigger adjustments on relevant events
    window.addEventListener('resize', adjustVideoElement);
    window.addEventListener('popstate', adjustVideoElement);
    document.addEventListener('fullscreenchange', adjustVideoElement);

    // Initial adjustment
    adjustVideoElement();

    // Start observing changes
    observeChanges();
})();
