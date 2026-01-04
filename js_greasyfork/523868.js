// ==UserScript==
// @name         YouTube CleanUp
// @namespace    http://h3cx.dev/
// @version      0.1
// @description  Removes unwanted elements on YouTube.
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523868/YouTube%20CleanUp.user.js
// @updateURL https://update.greasyfork.org/scripts/523868/YouTube%20CleanUp.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to remove unwanted elements
    const removeAdsAndUnwantedElements = () => {
        // 1) Remove existing unwanted selectors
        const selectors = [
            'ytd-ad-slot-renderer',
            'div.ytd-ad-slot-renderer',
            '#player-ads',
            'ytd-rich-section-renderer.ytd-rich-grid-renderer',
            '#voice-search-button',
            'span#country-code',
            'div#end div#buttons ytd-button-renderer',
            '#panels', // Remove the panels section
        ];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => element.remove());
        });

        // 2) Remove empty grid items
        document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
            const contentDiv = item.querySelector('div#content');
            if (!contentDiv || contentDiv.innerHTML.trim() === '') {
                item.remove();
            }
        });

        // 3) Remove "More from YouTube" and "Explore" sections
        document.querySelectorAll('h3.style-scope.ytd-guide-section-renderer').forEach(header => {
            const text = header.textContent.trim();
            if (text === 'More from YouTube' || text === 'Explore') {
                const sectionRenderer = header.closest('ytd-guide-section-renderer.style-scope.ytd-guide-renderer');
                if (sectionRenderer) {
                    sectionRenderer.remove();
                }
            }
        });

        // 4) Remove footer links (guide-links-primary, guide-links-secondary)
        const footerSelectors = ['#guide-links-primary', '#guide-links-secondary'];
        footerSelectors.forEach(footerSelector => {
            document.querySelectorAll(footerSelector).forEach(el => el.remove());
        });

        // 5) Remove "Report history", "Help", "Send feedback" (but keep "Settings")
        const unwantedTitles = ['Report history', 'Help', 'Send feedback'];
        document.querySelectorAll('ytd-guide-entry-renderer').forEach(entry => {
            const titleElem = entry.querySelector('.title.style-scope.ytd-guide-entry-renderer');
            if (titleElem) {
                const titleText = titleElem.textContent.trim();
                if (unwantedTitles.includes(titleText)) {
                    entry.remove();
                }
            }
        });

        // 6) Remove "Your videos", "Watch later", "Liked videos" from collapsible "You" section
        const unwantedCollapsibleTitles = ['Your videos', 'Watch later', 'Liked videos'];
        document.querySelectorAll('ytd-guide-collapsible-section-entry-renderer ytd-guide-entry-renderer').forEach(entry => {
            const titleElem = entry.querySelector('.title.style-scope.ytd-guide-entry-renderer');
            if (titleElem) {
                const titleText = titleElem.textContent.trim();
                if (unwantedCollapsibleTitles.includes(titleText)) {
                    entry.remove();
                }
            }
        });
    };

    // Run once on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        removeAdsAndUnwantedElements();
    });

    // Also watch for dynamically added elements
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const observer = new MutationObserver(
        debounce(() => {
            removeAdsAndUnwantedElements();
        }, 300)
    );

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();