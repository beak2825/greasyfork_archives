// ==UserScript==
// @name         pornhub自动续播
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  自动选择下方第一个视频续播
// @author       You
// @match        https://www.pornhub.com/view_video.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487720/pornhub%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/487720/pornhub%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    // Your code here...
    function checkAndPerformActions() {
        let process = document.querySelector("div.mgp_progressHandle").style.left;
        if(document.querySelector("#hd-leftColVideoPage").style.width === ''){
            document.querySelector("#hd-leftColVideoPage").style.width = '150%';
        }
        if(process === '100%'){
            document.querySelector("div.video-wrapper.js-relatedRecommended.js-relatedVideos.relatedVideos.original > ul > li > div > div > a").click();
        }
    }
    window.onload = setTimeout(setInterval(checkAndPerformActions, 5000), 10000);
})();