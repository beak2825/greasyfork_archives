// ==UserScript==
// @name         Automatically remove YouTube live pinning (2 seconds)
// @name:zh-TW   自動移除 YouTube 直播置頂(2秒)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自動移除 YouTube 直播聊天室的置頂Banner訊息
// @description:zh-TW  自動移除 YouTube 直播聊天室的置頂Banner訊息
// @author       HsiaoChoco & CK
// @match        https://www.youtube.com/live_chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540166/Automatically%20remove%20YouTube%20live%20pinning%20%282%20seconds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540166/Automatically%20remove%20YouTube%20live%20pinning%20%282%20seconds%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBanners() {
        // 找出包含置頂Banner的容器
        const bannerContainer = document.getElementById('visible-banners');
        if (bannerContainer) {
            bannerContainer.remove();
            console.log('已移除 YouTube 置頂 Banner');
        }
    }

    // 2秒掃描一次
    setInterval(removeBanners, 2000);
})();
