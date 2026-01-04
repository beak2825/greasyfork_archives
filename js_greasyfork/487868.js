// ==UserScript==
// @name         返回网页顶部
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  返回网页顶部!
// @author       BL
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      1.0
// @downloadURL https://update.greasyfork.org/scripts/487868/%E8%BF%94%E5%9B%9E%E7%BD%91%E9%A1%B5%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487868/%E8%BF%94%E5%9B%9E%E7%BD%91%E9%A1%B5%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 创建返回顶部按钮
    var backToTopButton = document.createElement('button');
    backToTopButton.textContent = '返回顶部';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.display = 'none';
    backToTopButton.style.zIndex = '99';
    backToTopButton.style.padding = '10px';
    backToTopButton.style.border = 'none';
    backToTopButton.style.backgroundColor = '#555';
    backToTopButton.style.color = 'white';
    backToTopButton.style.cursor = 'pointer';

    // 将按钮添加到body中
    document.body.appendChild(backToTopButton);

    // 监听滚动事件
    window.onscroll = function() {
        // 检查用户是否已滚动超过一定距离
        if (window.pageYOffset > 200) {
            // 如果已滚动，显示按钮
            backToTopButton.style.display = 'block';
        } else {
            // 否则隐藏按钮
            backToTopButton.style.display = 'none';
        }
    };

    // 监听按钮点击事件
    backToTopButton.onclick = function() {
        // 使用window.scrollTo方法平滑滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
})();