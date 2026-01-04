// ==UserScript==
// @name         Geforce Now Ad Blocker
// @namespace    GeforceNowAdBlocker
// @version      0.3
// @description  Geforce now ad blocker! Mutes, and hides video, and continues to play ads even when you're not on the website! Dm me on discord if it breaks at ._._.dustin
// @author       Dustin
// @match        https://play.geforcenow.com/*
// @icon         https://play.geforcenow.com/mall/assets/img/GFN_logo1024_v2.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489935/Geforce%20Now%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/489935/Geforce%20Now%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

 Object.defineProperty(document, 'hidden', { get: () => false });

    function checkForVideo() {
        const video = document.getElementById('preStreamVideo');
        if (video) {
            video.style.width = '0.1px';
            video.style.height = '0.1px';
            video.muted = true;
            const observer = new MutationObserver(() => {
                if (!document.contains(video)) {
                    alert("Ads finished playing!");
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    const interval = setInterval(() => {
        if (document.getElementById('preStreamVideo')) {
            clearInterval(interval);
            checkForVideo();
        }
    }, 1000);
})();
