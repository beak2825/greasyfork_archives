// ==UserScript==
// @name         tiktok like a video
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  tiktok like a video when you click on number 0, click again to remove it
// @author       egycoder
// @match        https://www.tiktok.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/539908/tiktok%20like%20a%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/539908/tiktok%20like%20a%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', (event) => {
        if (event.key === '0') {
            const btns = document.querySelectorAll('.css-67yy18-ButtonActionItem.e1hk3hf90');
            const likes = [];
            for (const btn of btns) {
                if (btn.ariaLabel?.includes('Like')) {
                    likes.push(btn);
                }
            }
            likes.pop();
            likes.pop().click();
        }
    });
})();