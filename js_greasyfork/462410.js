// ==UserScript==
// @name         B站视频快进快退
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用脚本，用于 B 站视频快进快退
// @author       Taugge
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462410/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80.user.js
// @updateURL https://update.greasyfork.org/scripts/462410/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E5%BF%AB%E9%80%80.meta.js
// ==/UserScript==

(function() {

    let videoEl = null;
    // Your code here...
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 188 || e.keyCode === 190) {
            if (!videoEl) {
                videoEl = document.querySelector('video');
            }
            if (videoEl) {
                videoEl.currentTime += (e.keyCode === 188 ? -20 : 20);
            }
        }
    });

})();