// ==UserScript==
// @name         youtube-ad-skip
// @namespace    https://github.com/roaris/youtube-ad-skip
// @version      1.0
// @description  Skip skippable Youtube ads and remove banner ads
// @author       roaris
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/445145/youtube-ad-skip.user.js
// @updateURL https://update.greasyfork.org/scripts/445145/youtube-ad-skip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const body = document.getElementsByTagName('body')[0];
    const observer = new MutationObserver(() => {
        const skipButtons = Array.from(document.getElementsByClassName('ytp-ad-skip-button'));
        skipButtons.forEach((skipButton) => {
            skipButton.click();
        });
        const overlayCloseButtons = Array.from(document.getElementsByClassName('ytp-ad-overlay-close-button'));
        overlayCloseButtons.forEach((overlayCloseButton) => {
            overlayCloseButton.click();
        });
    });
    observer.observe(body, {
        childList: true,
        subtree: true,
    });
})();