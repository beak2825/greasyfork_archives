// ==UserScript==
// @name         Remove YouTube Comments on Mobile Firefox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the comments section on the YouTube mobile site.
// @author       nickm8
// @match        https://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522337/Remove%20YouTube%20Comments%20on%20Mobile%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/522337/Remove%20YouTube%20Comments%20on%20Mobile%20Firefox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeCommentsSection = () => {
        // Select the comments section by class
        const commentsSection = document.querySelector('.ytVideoMetadataCarouselViewModelTitleSection');
        if (commentsSection) {
            commentsSection.parentNode.remove();
            console.log('Comments section removed.');
        }
    };

    removeCommentsSection();

    // Observe DOM changes to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        removeCommentsSection();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
