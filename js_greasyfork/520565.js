// ==UserScript==
// @name         N奈飞工厂去广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除N奈飞工厂(https://www.netflixgc.com/)的广告
// @author       You
// @match        https://www.netflixgc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflixgc.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520565/N%E5%A5%88%E9%A3%9E%E5%B7%A5%E5%8E%82%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/520565/N%E5%A5%88%E9%A3%9E%E5%B7%A5%E5%8E%82%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 动态注入CSS, 优先隐藏目标元素
    const style = document.createElement('style');
    style.textContent = `
    .ec-ad-double, .ds-adif-b1, .ec-tutu {
    display: none !important;
    }
    `;
    document.head.appendChild(style);

    // 精确处理：等待页面加载后确保隐藏
    window.addEventListener('load', function() {
        const ads = document.getElementsByClassName('ec-ad-double');
        Array.from(ads).forEach(ele => {
            ele.style.display = 'none';
        })
    })
    // Your code here...
})();