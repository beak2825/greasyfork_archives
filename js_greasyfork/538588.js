// ==UserScript==
// @name         Remove YouTube Adblock Message & Overlay
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes YouTube's adblock warning by deleting ytd-popup-container and the overlay backdrop
// @author       drewby123
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538588/Remove%20YouTube%20Adblock%20Message%20%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/538588/Remove%20YouTube%20Adblock%20Message%20%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const removeElements = () => {
        const popupContainer = document.querySelector('ytd-popup-container');
        const overlayBackdrop = document.querySelector('tp-yt-iron-overlay-backdrop');

        if (popupContainer) {
            popupContainer.remove();
            console.log('Removed ytd-popup-container');
        }

        if (overlayBackdrop) {
            overlayBackdrop.remove();
            console.log('Removed overlay backdrop');
        }
    };

    // Run initially
    removeElements();

    // Observe and re-run when elements are reinserted
    const observer = new MutationObserver(removeElements);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
