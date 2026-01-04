// ==UserScript==
// @name         YouTube Simplificator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simplificates the youtube interface for a better user experience
// @author       Stavros
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527778/YouTube%20Simplificator.user.js
// @updateURL https://update.greasyfork.org/scripts/527778/YouTube%20Simplificator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to remove specific elements
    function removeElements() {
        const selectors = [
            'button.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]',
            '.ytp-miniplayer-button',
            '.ytp-next-button.ytp-button',
            '.ytp-prev-button.ytp-button',
            '.yt-spec-touch-feedback-shape',
            '.yt-spec-touch-feedback-shape--touch-response',
            '.style-scope.ytd-masthead #guide-button',
            '.style-scope.ytd-masthead #guide-button yt-icon',
            '.ytp-fullerscreen-edu-chevron',
            '.ytp-fullerscreen-edu-button',
            '.ytp-fullerscreen-edu-button-subtle',
            '.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s.yt-spec-button-shape-next--icon-leading',
            '.style-scope.ytd-structured-description-content-renderer',
            '.yt-spec-button-view-model.style-scope.ytd-menu-renderer',
            '.ytp-subtitles-button.ytp-button', // Subtitles button
            'ytd-expandable-metadata-renderer.style-scope.ytd-watch-flexy' // Added element
        ];

        // Remove general elements from the selectors list
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => element.remove());
        });

        // Remove ONLY the channel icon inside the description (but not the one at the top)
        document.querySelectorAll('#description .style-scope.yt-img-shadow').forEach(element => element.remove());

        // Remove the item with ID title inside the description
        const descriptionTitleElement = document.querySelector('#description #title');
        if (descriptionTitleElement) {
            descriptionTitleElement.remove();
        }

        // Remove the item with ID subtitle inside the description
        const descriptionSubtitleElement = document.querySelector('#description #subtitle');
        if (descriptionSubtitleElement) {
            descriptionSubtitleElement.remove();
        }

        // Remove the icon with the specified classes in the description
        document.querySelectorAll('#description .yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading').forEach(element => element.remove());

        // Completely remove elements with the specific class combination
        document.querySelectorAll('.yt-core-attributed-string__link.yt-core-attributed-string__link--call-to-action-color.yt-core-attributed-string--link-inherit-color')
            .forEach(element => element.remove());
    }

    // Observe DOM changes to remove dynamically added elements
    const observer = new MutationObserver(() => removeElements());
    observer.observe(document.body, { childList: true, subtree: true });

    // Reinforce removal with an interval
    setInterval(removeElements, 1000);

    // Initial cleanup when the window loads
    window.addEventListener('load', removeElements);
})();