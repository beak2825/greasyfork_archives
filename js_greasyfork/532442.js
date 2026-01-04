// ==UserScript==
// @name         YouTube Auto Like & Close Window
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically likes the video and closes the window when the video has ended.
// @author       RichardG
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch*
// @exclude      https://www.youtube.com/watch*list=*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/532442/YouTube%20Auto%20Like%20%20Close%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/532442/YouTube%20Auto%20Like%20%20Close%20Window.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForElement = (selector, callback) => {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Auto Like Video
    waitForElement("[title='I like this']", (btn) => {
        if (btn && btn.getAttribute('aria-pressed') === 'false') {
            btn.click();
        }
    });

    const checkEnd = () => {
        const video = document.querySelector('video');
        if (!video || video.getAttribute('data-no-fullscreen') === "true") return;

        video.addEventListener('ended', () => {
            window.close();
        });
    };

    waitForElement('video', checkEnd);
})();
