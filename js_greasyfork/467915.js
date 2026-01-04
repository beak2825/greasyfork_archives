// ==UserScript==
// @name         Peacock Compact UI
// @namespace    http://tampermonkey-userscripts/example
// @version      1.1
// @description  Slims the Peacock desktop UI to be a little more compact and take up less screenspace.
// @match        https://www.peacocktv.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467915/Peacock%20Compact%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/467915/Peacock%20Compact%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePlaybackStyles() {
        const playbackElements = document.querySelectorAll('.playback-overlay__container.clip, .playback-overlay__container.live, .playback-overlay__container.preview, .playback-overlay__container.singleliveevent, .playback-overlay__container.vod');
        playbackElements.forEach(element => {
            element.style.background = 'none';
            element.style.paddingBottom = '0.5rem';
        });

        const playbackHeader = document.querySelector('.playback-header__container');
        playbackHeader.style.backgroundColor = 'transparent';

        const metadataText = document.querySelector('.playback-metadata__container.singleliveevent');
        if (metadataText) {
            metadataText.remove();
        }

        const playbackTimeElapsed = document.querySelector('.playback-time-elapsed__container');
        playbackTimeElapsed.style.marginBottom = '0.70rem';
        playbackTimeElapsed.style.marginLeft = '1rem';
        const languageSettings = document.querySelector('[data-testid~="language-settings-button"]').parentElement;
        if (languageSettings.parentElement != playbackTimeElapsed.parentElement) {
            languageSettings.parentNode.insertBefore(playbackTimeElapsed, languageSettings.nextSibling);
        }

        const statusIndicator = document.querySelector('.asset-status-indicator');
        if (statusIndicator) {
            statusIndicator.remove();
        }

        const scrubber = document.querySelector('.playback-scrubber-bar');
        scrubber.style.opacity = .33;

    }

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                removePlaybackStyles();
            }
        }
    });

    // Start observing the entire document with the observer
    observer.observe(document, { childList: true, subtree: true });
})();