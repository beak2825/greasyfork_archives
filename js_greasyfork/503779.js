// ==UserScript==
// @name         April Fool's Day 2007
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Redirects all YouTube videos to a certain video.
// @author       InariOkami
// @match        https://www.youtube.com/watch*
// @grant        none
// @icon         https://www.favicon.cc/logo3d/846514.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503779/April%20Fool%27s%20Day%202007.user.js
// @updateURL https://update.greasyfork.org/scripts/503779/April%20Fool%27s%20Day%202007.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetVideoId = "X_8Nh5XfRw0";
    const targetUrl = `https://www.youtube.com/embed/${targetVideoId}?autoplay=1`;

    function replaceVideo() {
        const style = document.createElement('style');
        style.textContent = `
            #player-container,
            .html5-video-container,
            .ytp-chrome-bottom,
            .ytp-chrome-top {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        const iframe = document.createElement('iframe');
        iframe.src = targetUrl;
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.zIndex = '9999';
        iframe.allow = 'autoplay';

        document.body.appendChild(iframe);

        setTimeout(() => {
            const originalPlayer = document.querySelector('video');
            if (originalPlayer) {
                originalPlayer.pause();
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceVideo);
    } else {
        replaceVideo();
    }
})();