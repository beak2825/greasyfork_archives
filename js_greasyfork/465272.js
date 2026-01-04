// ==UserScript==
// @name         Twitter Video High Quality
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Always play Twitter videos in high quality
// @author       @rayan_krb
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465272/Twitter%20Video%20High%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/465272/Twitter%20Video%20High%20Quality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.PlayableMedia-player')) {
                        const video = node.querySelector('video');
                        if (video) {
                            video.addEventListener('loadedmetadata', () => {
                                const sources = Array.from(video.querySelectorAll('source')).map((source) => {
                                    const { src, type } = source;
                                    const height = parseInt(src.match(/\/(\d+)x(\d+)\//)[2]);
                                    return { src, type, height };
                                });

                                const highestQuality = sources.reduce((max, current) => {
                                    return current.height > max.height ? current : max;
                                });

                                video.src = highestQuality.src;
                                video.type = highestQuality.type;
                            });
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
