// ==UserScript==
// @name         哔哩哔哩漫画全屏沉浸
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  删除漫画界面左右的悬浮图标，获得极致的全屏漫画体验
// @author       Sakura-ushio
// @license      MIT
// @match        https://manga.bilibili.com/mc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492497/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%BC%AB%E7%94%BB%E5%85%A8%E5%B1%8F%E6%B2%89%E6%B5%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/492497/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%BC%AB%E7%94%BB%E5%85%A8%E5%B1%8F%E6%B2%89%E6%B5%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        console.log("Run hideElements");

        // var ele1 = document.evaluate("/html/body/div[1]/div/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // var ele2 = document.evaluate("/html/body/div[1]/div/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        var ele1 = document.getElementsByClassName('floating-left p-absolute info-layer')[0];
        var ele2 = document.getElementsByClassName('floating-buttons p-absolute info-layer')[0];

        if (ele1 != null)
            ele1.style.display = 'none';
        if (ele2 != null)
            ele2.style.display = 'none';

    }

    // 定义一个循环执行函数
    function runRepeatedly() {
        hideElements(); // 第一次执行
        setInterval(hideElements, 300);
    }

    // 等待网页完成加载
    window.addEventListener('load', runRepeatedly, false);
})();
