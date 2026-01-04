// ==UserScript==
// @name         YouTube Shorts Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Blocks the YouTube shorts from appearing.
// @author       Aiden Charles
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471062/YouTube%20Shorts%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/471062/YouTube%20Shorts%20Blocker.meta.js
// ==/UserScript==

(function () {
    console.log("YouTube Shorts blocker script is running!");

    const processedElements = new WeakSet();

    const selectors = [
        'ytd-reel-shelf-renderer',
        'a[title="Shorts"]',
        'ytm-shorts-lockup-view-model-v2',
        'ytm-shorts-lockup-view-model',
        'yt-chip-cloud-chip-renderer'
    ];

    function hideElement(element) {
        if (!processedElements.has(element)) {
            element.style.display = 'none';
            processedElements.add(element);
        }
    }

    function blockShorts() {
        const elements = document.querySelectorAll(selectors.join(','));
        elements.forEach(element => {
            if (element.matches('yt-chip-cloud-chip-renderer')) {
                const chipText = element.querySelector('.ytChipShapeChip');
                if (chipText?.textContent.trim() === 'Shorts') {
                    hideElement(element);
                }
            } else {
                hideElement(element);
            }
        });
        document.querySelectorAll('a[href^="/shorts/"]:not([data-processed])').forEach(link => {
            const videoRenderer = link.closest('ytd-video-renderer');
            if (videoRenderer) {
                hideElement(videoRenderer);
            }
            link.setAttribute('data-processed', 'true');
        });
        document.querySelectorAll('.ytGridShelfViewModelGridShelfItem:not([data-processed])').forEach(item => {
            if (item.querySelector('ytm-shorts-lockup-view-model-v2, a[href^="/shorts/"]')) {
                hideElement(item);
            }
            item.setAttribute('data-processed', 'true');
        });
        document.querySelectorAll('grid-shelf-view-model:not([data-processed])').forEach(shelf => {
            const hasShorts = shelf.querySelector('ytm-shorts-lockup-view-model-v2') ||
                shelf.querySelector('.shelf-header-layout-wiz__title span[role="text"]')?.textContent?.includes('Shorts');
            if (hasShorts) {
                hideElement(shelf);
            }
            shelf.setAttribute('data-processed', 'true');
        });
        document.querySelectorAll('span:not([data-processed])').forEach(span => {
            if (span.textContent.includes("Shorts")) {
                const richSection = span.closest('#content.ytd-rich-section-renderer');
                if (richSection) {
                    hideElement(richSection);
                }
            }
            span.setAttribute('data-processed', 'true');
        });
    }

    const observer = new MutationObserver(function (mutations) {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            blockShorts();
        }
    });

    blockShorts();

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();