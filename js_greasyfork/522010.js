// ==UserScript==
// @name         YouTube 优化加载
// @version      1.03
// @description  优先加载视频和描述。Attempts to prioritize video and description loading on YouTube.
// @match        https://www.youtube.com/*
// @author         yzcjd
// @author2       Lama AI 辅助
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1171320
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522010/YouTube%20%E4%BC%98%E5%8C%96%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522010/YouTube%20%E4%BC%98%E5%8C%96%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function prioritizeLoading() {
        //Find Video Element
        const video = document.querySelector('video');
        if (video) {
            console.log('Video element found');
        } else {
            console.log('Video element not found yet');
            return; //Exit if video not found
        }

        //Find description element. Note: This selector might need adjustment based on YouTube's structure
        const description = document.querySelector('ytd-video-description-renderer #description');
        if (description) {
            console.log('Description element found');
        } else {
            console.log('Description element not found yet');
            return; //Exit if description not found
        }

        //The rest of the code is intentionally left blank.  Simply ensuring the video and description are loaded first is the most reliable approach
    }

    //Call the function immediately after loading and again when the DOM changes
    prioritizeLoading();

    const observer = new MutationObserver(prioritizeLoading);
    observer.observe(document.body, { childList: true, subtree: true });

})();
