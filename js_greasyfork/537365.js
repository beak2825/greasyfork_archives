// ==UserScript==
// @name         YouTube AdBlocker 05/26/2025
// @namespace    https://github.com/tapetenputzer
// @version      1.3
// @author       tapetenputzer
// @description  Removes all YouTube ad containers without any skip-button logic.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537365/YouTube%20AdBlocker%2005262025.user.js
// @updateURL https://update.greasyfork.org/scripts/537365/YouTube%20AdBlocker%2005262025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1) Insert CSS to hide every ad container and overlay before render
    const css = `
        .video-ads,
        #player-ads,
        ytd-ad-slot-renderer,
        ytd-display-ad-renderer,
        ytd-video-ad-renderer,
        .ytp-ad-module,
        .ytp-ad-overlay-slot,
        .ytp-overlay-ad-conversation,
        .ytp-ad-info,
        .ytp-ad-text,
        .ytp-ad-duration-remaining,
        .ytp-paid-content-overlay,
        .ytd-promoted-sparkles-web-renderer,
        .ytp-ad-player-overlay {
            display: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    // 2) MutationObserver: immediately remove any newly injected ad containers
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) continue;
                if (node.matches(
                    '.video-ads, #player-ads, ytd-ad-slot-renderer, ytd-display-ad-renderer, ytd-video-ad-renderer, .ytp-ad-module'
                )) {
                    node.remove();
                }
            }
        }
    });

    function startObserver() {
        const target = document.body;
        if (target) {
            observer.observe(target, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 100);
        }
    }
    startObserver();

    // 3) Fallback on full page load: remove any leftover ad containers
    window.addEventListener('load', () => {
        document.querySelectorAll(
            '.video-ads, #player-ads, ytd-ad-slot-renderer, ytd-display-ad-renderer, ytd-video-ad-renderer, .ytp-ad-module'
        ).forEach(el => el.remove());
    });
})();

/*
MIT License

Copyright (c) 2025 tapetenputzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
