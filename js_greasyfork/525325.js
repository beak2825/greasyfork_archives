// ==UserScript==
// @name         抖音-防止抖音网页版因长时间未操作而自动暂停
// @namespace    hengyuan
// @license      MIT
// @version      0.2
// @description  防止抖音网页版因长时间未操作而自动暂停
// @author       Devv
// @match        https://www.douyin.com/*
// @match        https://live.douyin.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525325/%E6%8A%96%E9%9F%B3-%E9%98%B2%E6%AD%A2%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E5%9B%A0%E9%95%BF%E6%97%B6%E9%97%B4%E6%9C%AA%E6%93%8D%E4%BD%9C%E8%80%8C%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/525325/%E6%8A%96%E9%9F%B3-%E9%98%B2%E6%AD%A2%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E5%9B%A0%E9%95%BF%E6%97%B6%E9%97%B4%E6%9C%AA%E6%93%8D%E4%BD%9C%E8%80%8C%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval = 1 * 60 * 1000; // 每1分钟模拟一次鼠标移动
    let lastMove = Date.now();

    function simulateMouseMove() {
        let now = Date.now();
        if (now - lastMove > interval) {
            let event = new MouseEvent('mousemove', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'clientX': Math.random() * window.innerWidth,
                'clientY': Math.random() * window.innerHeight
            });
            document.dispatchEvent(event);
            lastMove = now;
        }
    }

    setInterval(simulateMouseMove, 60 * 1000); // 每分钟检查一次是否需要模拟鼠标移动
})();