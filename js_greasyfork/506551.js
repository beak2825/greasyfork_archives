// ==UserScript==
// @name         全显文字
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ShowAllText
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506551/%E5%85%A8%E6%98%BE%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/506551/%E5%85%A8%E6%98%BE%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载完成事件
    window.addEventListener('load', function() {
        // 在页面加载完成后5秒执行函数
        setTimeout(function() {
            // 获取文档中的所有元素
            var allElements = document.querySelectorAll('*');
            allElements.forEach(function(element) {
                // 移除指定的样式
                element.style.removeProperty('white-space');
                element.style.removeProperty('overflow');
                element.style.removeProperty('text-overflow');
                element.style.removeProperty('display');
            });
        }, 5000); // 5000毫秒 = 5秒
    });
})();