// ==UserScript==
// @name         Hide Youtube shorts
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hide Youtuebe shorts
// @author       vhanla
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461568/Hide%20Youtube%20shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/461568/Hide%20Youtube%20shorts.meta.js
// ==/UserScript==

window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const shorts = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]')

            const reels = document.querySelectorAll('ytd-reel-shelf-renderer')
            try {
                for (let short of shorts) {
                    if (short) {
                        let op1 = short.closest('ytd-grid-video-renderer')
                        if (op1) op1.style.display="none"
                        let op2 = short.closest('ytd-video-renderer')
                        if (op2) op2.style.display="none"
                    }
                }
                for (let reel of reels) {
                    if (reel) {
                        reel.style.display="none"
                    }
                }
            } catch(e) {console.log(e)}
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};