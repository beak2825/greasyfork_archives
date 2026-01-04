// ==UserScript==
// @name         YouTube: Hide Unpopular Videos & Shorts
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hides videos and shorts with less than a certain number of views, works with in-app navigation.
// @icon         https://raw.githubusercontent.com/kuronekozero/youtube-remove-unpopular-videos/master/icon.png
// @author       Timothy (kuronek0zero) - (Updated by Gemini)
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478273/YouTube%3A%20Hide%20Unpopular%20Videos%20%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/478273/YouTube%3A%20Hide%20Unpopular%20Videos%20%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const minViews = 500;

    GM_addStyle(`
        .unpopular-video-hidden {
            display: none !important;
        }
    `);

    const processContent = function(item) {
        const metadataSpans = item.querySelectorAll(
            'span.yt-content-metadata-view-model__metadata-text, .shortsLockupViewModelHostOutsideMetadataSubhead span'
        );

        let viewCountElement = null;
        for (const span of metadataSpans) {
            if (span.textContent && span.textContent.includes('views')) {
                viewCountElement = span;
                break;
            }
        }

        if (viewCountElement) {
            const viewCountText = viewCountElement.textContent.trim();
            if (viewCountText.toLowerCase().includes("no views")) {
                item.classList.add('unpopular-video-hidden');
            } else {
                const viewCountMatch = viewCountText.match(/([\d,.]+)\s*(K|M|B)?\s*views/i);
                if (viewCountMatch) {
                    let viewCount = parseFloat(viewCountMatch[1].replace(/,/g, ''));
                    const suffix = viewCountMatch[2] ? viewCountMatch[2].toUpperCase() : null;

                    if (suffix === 'K') viewCount *= 1000;
                    else if (suffix === 'M') viewCount *= 1000000;
                    else if (suffix === 'B') viewCount *= 1000000000;

                    if (viewCount < minViews) {
                        item.classList.add('unpopular-video-hidden');
                    }
                }
            }
            return true;
        }
        return false;
    };

    const runCheck = () => {
        const contentSelectors = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-item-section-renderer'
        ];

        const query = contentSelectors.map(selector => `${selector}:not(.views-processed)`).join(', ');
        const newContent = document.querySelectorAll(query);

        for (const item of newContent) {
            const successfullyProcessed = processContent(item);
            if (successfullyProcessed) {
                item.classList.add('views-processed');
            }
        }
    };

    const observer = new MutationObserver(runCheck);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    window.addEventListener('yt-navigate-finish', () => {
        // wait a brief moment for the new content to settle in before running check
        setTimeout(runCheck, 500);
    });

    // Initial run for the very first page load
    setTimeout(runCheck, 1000);
})();