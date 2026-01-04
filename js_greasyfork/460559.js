// ==UserScript==
// @name         更改亚马逊广告模块宽度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更改网页中模块的宽度
// @author       Alan

// @match        https://*.amazon.com/*
// @match        https://advertising.amazon.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460559/%E6%9B%B4%E6%94%B9%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8A%E6%A8%A1%E5%9D%97%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/460559/%E6%9B%B4%E6%94%B9%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8A%E6%A8%A1%E5%9D%97%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更改模块宽度的函数
    function changeWidth() {
        // 获取要更改宽度的元素
        let element = document.getElementById('J_AACChromePivotNav');
        // 设置宽度
        element.style.width = '55px'; // 你可以将500px替换成你想要的宽度
    }

    // 在页面加载完成后执行更改宽度的函数
    window.addEventListener('load', function() {
        changeWidth();
    });
})();
