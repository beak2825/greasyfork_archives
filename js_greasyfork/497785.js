// ==UserScript==
// @name         尤物丧志去弹窗
// @namespace    -
// @version      0.0.1
// @description  尤物丧志去弹窗，并设置可以滚动
// @author       夏河始溢
// @match        *://youwu.lol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youwu.lol
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497785/%E5%B0%A4%E7%89%A9%E4%B8%A7%E5%BF%97%E5%8E%BB%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/497785/%E5%B0%A4%E7%89%A9%E4%B8%A7%E5%BF%97%E5%8E%BB%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var flag = 0;
    var timer = setInterval(function () {
        flag++;
        document.body.style.setProperty('overflow', 'scroll', 'important');
        // 获取指定 class 名称的第一个 iframe 元素
        var iframeToDelete = document.querySelector('iframe.iv6bGFFrBm2OTsdCZq8K');

        // 检查是否找到了这个元素
        if (iframeToDelete) {
            // 如果找到了，则删除该元素
            iframeToDelete.parentElement.remove();
        }
        if (flag > 2) {
            clearInterval(timer);
        }
    }, 2000);
})();
