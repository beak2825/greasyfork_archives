// ==UserScript==
// @name         Youtube shorts autoskip
// @namespace    http://tampermonkey.net/
// @version      2025-05-01
// @description  Auto skip shorts when video ends
// @author       kkrow
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @noframes
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534337/Youtube%20shorts%20autoskip.user.js
// @updateURL https://update.greasyfork.org/scripts/534337/Youtube%20shorts%20autoskip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        try {
            document
                .querySelectorAll('.video-stream.html5-main-video')
                .forEach((player) => {
                if (player && player.loop) {
                    player.loop = false;
                    player.addEventListener(
                        'ended',
                        function () {
                            const nextButton = document.getElementById(
                                'navigation-button-down'
                            );
                            if (nextButton) {
                                nextButton.querySelector('button')?.click();
                            }
                        },
                        { once: true }
                    );
                }
            });
        } catch (e) {
            console.error('[Tampermonkey] Error in Youtube shorts autoskip:', e);
        }
    }, 1000);
})();