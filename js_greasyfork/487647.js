// ==UserScript==
// @name         Bilibili Live Player Mask Remover（去除B站直播间网页马赛克）
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Automatically removes the web player mask on live.bilibili.com（自动去除B站直播间马赛克）
// @author       Caleyuexing
// @match        https://live.bilibili.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487647/Bilibili%20Live%20Player%20Mask%20Remover%EF%BC%88%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%BD%91%E9%A1%B5%E9%A9%AC%E8%B5%9B%E5%85%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487647/Bilibili%20Live%20Player%20Mask%20Remover%EF%BC%88%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%BD%91%E9%A1%B5%E9%A9%AC%E8%B5%9B%E5%85%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the target element
    const removeMask = () => {
        const targetElement = document.querySelector('.web-player-module-area-mask');
        if (targetElement) {
            targetElement.remove();
            console.log('Removed web player mask.');
        }
    };

    // Call the function every second
    setInterval(removeMask, 1000);
})();
