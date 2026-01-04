// ==UserScript==
// @name         Remove YouTube Shorts and Trending from your Homepage.
// @namespace    https://github.com/hallzy
// @version      0.4
// @license      MIT
// @description  Removes YouTube Shorts and Trending Videos from your Homepage.
// @author       Steven Hall modified by Alind
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465918/Remove%20YouTube%20Shorts%20and%20Trending%20from%20your%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/465918/Remove%20YouTube%20Shorts%20and%20Trending%20from%20your%20Homepage.meta.js
// ==/UserScript==
(
    () => {
        const removeShortsAndTrending = () => {
            const containers = [
                'ytd-grid-video-renderer',
                'ytd-video-renderer',
                'ytm-item-section-renderer',
                'ytm-rich-item-renderer',
                'ytm-rich-section-renderer',
                'ytd-rich-shelf-renderer',
                'ytd-rich-section-renderer',
            ];

            containers.forEach(container => {
                const shorts = Array.from(
                    document.querySelectorAll(`${container} a[href^="/shorts"]`)).forEach(a => {
                        const video = a.closest(container);
                        video.remove();
                    }
                    );
                const trending = Array.from(
                    document.querySelectorAll(`${container} a[href^="/feed/trending"]`)).forEach(a => {
                        const video = a.closest(container);
                        video.remove();
                    }
                    );
            }
            );
        }

        const observer = new MutationObserver(removeShortsAndTrending);
        observer.observe
            (
                document,
                {
                    childList: true,
                    subtree: true,
                }
            );

        removeShortsAndTrending();
    }
)();
