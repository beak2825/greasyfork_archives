// ==UserScript==
// @name         Remove YouTube Tracking Parameters and Convert Share Links
// @version      1.5
// @description  Removes tracking parameters from all YouTube links and converts them to shortened youtu.be links within the share box.
// @author       kpganon
// @license      MIT
// @namespace    https://github.com/kpg-anon/scripts
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482977/Remove%20YouTube%20Tracking%20Parameters%20and%20Convert%20Share%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/482977/Remove%20YouTube%20Tracking%20Parameters%20and%20Convert%20Share%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTrackingParameters(input) {
        if (input && input.value) {
            let newValue = input.value
                .replace(/(?:&|\?)si=[^&]+/, '')
                .replace(/(?:&|\?)pp=[^&]+/, '')
                .replace(/^([^?]+)&/, '$1?')
                .replace(/(?:youtube\.com\/shorts\/|youtube\.com\/live\/|www\.youtube\.com\/watch\?v=|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/, 'youtu.be/$1')
                .replace(/www\.youtu\.be/, 'youtu.be');

            if (input.value !== newValue) {
                input.value = newValue;
            }
        }
    }

    function handleInputChange() {
        const shareInput = document.querySelector('yt-share-target-renderer input');
        removeTrackingParameters(shareInput);
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('yt-share-target-renderer')) {
                        const intervalId = setInterval(handleInputChange, 50);

                        const closeButton = node.querySelector('[aria-label="Close"]');
                        if (closeButton) {
                            closeButton.addEventListener('click', () => {
                                clearInterval(intervalId);
                            });
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        document.querySelectorAll('input, a').forEach(element => {
            if (element.tagName.toLowerCase() === 'input') {
                removeTrackingParameters(element);
            } else if (element.tagName.toLowerCase() === 'a' && /\/watch\?v=/.test(element.href)) {
                element.href = element.href.replace(/(?:&|\?)si=[^&]+/, '').replace(/(?:&|\?)pp=[^&]+/, '')
                    .replace(/(?:youtube\.com\/shorts\/|youtube\.com\/live\/|www\.youtube\.com\/watch\?v=|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/, 'youtu.be/$1')
                    .replace(/www\.youtu\.be/, 'youtu.be');
            }
        });
    }, 50);
})();