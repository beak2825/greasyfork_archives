// ==UserScript==
// @name         YouTube Blur and Reset Script
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  Blur elements on YouTube and reset on button clicks with state management
// @author       You
// @match        https://www.youtube.com
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/518113/YouTube%20Blur%20and%20Reset%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/518113/YouTube%20Blur%20and%20Reset%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // State management variable
    let blurActive = true;

    // Selectors for elements to blur
    const elementsToBlur = [
        'div.yt-spec-button-shape-next__button-text-content:nth-child(3)',
        'ytd-menu-renderer.ytd-watch-metadata > div:nth-child(1) > segmented-like-dislike-button-view-model:nth-child(1) > yt-smartimation:nth-child(1) > div:nth-child(1) > div:nth-child(1) > like-button-view-model:nth-child(1) > toggle-button-view-model:nth-child(1) > button-view-model:nth-child(1) > button:nth-child(1) > div:nth-child(2)',
        '.count-text > span:nth-child(1)',
        'ytd-compact-video-renderer.style-scope:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > div:nth-child(2) > ytd-video-meta-block:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(3)',
        '#owner-sub-count',
        '#vote-count-middle',
        'span.bold:nth-child(1)',
        'ytd-video-meta-block:nth-child(2) > div:nth-child(1) > div:nth-child(2) > span:nth-child(3)'
    ];

    // Selector for always blurred elements
    const alwaysBlurredSelector = 'ytd-video-meta-block:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(3)';

    // Apply blur and disable pointer events
    const modifyElements = () => {
        // Only apply blur if blurActive is true
        if (!blurActive) return;

        elementsToBlur.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.filter = 'blur(10px)';
            });
        });

        const infoTextElement = document.querySelector('#ytd-watch-info-text, .ryd-tooltip-bar-container, .ryd-tooltip, .ryd-tooltip-new-design');
        if (infoTextElement) {
            infoTextElement.style.pointerEvents = 'none';
        }

        const alwaysBlurredElements = document.querySelectorAll(alwaysBlurredSelector);
        alwaysBlurredElements.forEach(element => {
            element.style.filter = 'blur(10px)';
        });
    };

    // Function to unblur elements
    const unblur = () => {
        // Disable blur and remove blur styles
        blurActive = false;

        elementsToBlur.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.filter = 'none';
            });
        });
    };

    // Function to add event listeners dynamically
    const attachButtonListeners = () => {
        const likeButtonSelector = 'ytd-menu-renderer.ytd-watch-metadata > div:nth-child(1) > segmented-like-dislike-button-view-model:nth-child(1) > yt-smartimation:nth-child(1) > div:nth-child(1) > div:nth-child(1) > like-button-view-model:nth-child(1) > toggle-button-view-model:nth-child(1) > button-view-model:nth-child(1) > button:nth-child(1)';
        const dislikeButtonSelector = 'ytd-menu-renderer.ytd-watch-metadata > div:nth-child(1) > segmented-like-dislike-button-view-model:nth-child(1) > yt-smartimation:nth-child(1) > div:nth-child(1) > div:nth-child(1) > dislike-button-view-model:nth-child(2) > toggle-button-view-model:nth-child(1) > button-view-model:nth-child(1) > button:nth-child(1)';

        const likeButtons = document.querySelectorAll(likeButtonSelector);
        const dislikeButtons = document.querySelectorAll(dislikeButtonSelector);

        likeButtons.forEach(button => {
            button.addEventListener('mouseup', unblur);
        });

        dislikeButtons.forEach(button => {
            button.addEventListener('mouseup', unblur);
        });
    };

    // Observe changes in the DOM
    const observer = new MutationObserver(() => {
        // Only re-apply blur if blurActive is true
        if (blurActive) {
            modifyElements();
            attachButtonListeners();
        }
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Initial modifications
    modifyElements();
})();