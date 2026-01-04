// ==UserScript==
// @name         TikTok Preserve Scroll on Back
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevent TikTok from auto-scrolling to top when returning from a video
// @author       You
// @match        https://www.tiktok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541613/TikTok%20Preserve%20Scroll%20on%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/541613/TikTok%20Preserve%20Scroll%20on%20Back.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCROLL_KEY = 'tiktok_scroll_position';

    // Save scroll when video is about to open
    const observer = new MutationObserver(() => {
        const isVideoPage = window.location.pathname.includes('/video/');
        const alreadySaved = sessionStorage.getItem(SCROLL_KEY + '_saved');

        //sessionStorage.setItem(SCROLL_KEY, window.scrollY);
        //sessionStorage.setItem(SCROLL_KEY + '_saved', 'true');
        if (window.scrollY == 0 && sessionStorage.getItem(SCROLL_KEY + '_saved')) {
            const savedScroll = sessionStorage.getItem(SCROLL_KEY);
            //console.log(savedScroll);
            window.scrollTo(0, savedScroll);
            //console.log("this line should be executiong", window.scrollY);
        }
        //if (isVideoPage && !alreadySaved) {
          //  sessionStorage.setItem(SCROLL_KEY, window.scrollY);
         //   sessionStorage.setItem(SCROLL_KEY + '_saved', 'true');
        //} else if (!isVideoPage && alreadySaved) {
         //   sessionStorage.removeItem(SCROLL_KEY + '_saved');
        //}
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Restore scroll when coming back
    window.addEventListener('load', () => {
        const savedScroll = sessionStorage.getItem(SCROLL_KEY);
        if (savedScroll !== null) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScroll, 10));
                sessionStorage.removeItem(SCROLL_KEY);
            }, 100); // Wait a bit for feed to load
        }
        setInterval(() => {
            if (window.scrollY != 0) {
                console.log('we are here');
               sessionStorage.setItem(SCROLL_KEY + '_saved', 'true');
               sessionStorage.setItem(SCROLL_KEY, window.scrollY);
            }
        },1000)
    });
})();
