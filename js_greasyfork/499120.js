// ==UserScript==
// @name         未经授权不许复制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在网页上添加一个小圆点来控制网页的复制请求。
// @author       半猪人捞尸
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499120/%E6%9C%AA%E7%BB%8F%E6%8E%88%E6%9D%83%E4%B8%8D%E8%AE%B8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/499120/%E6%9C%AA%E7%BB%8F%E6%8E%88%E6%9D%83%E4%B8%8D%E8%AE%B8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将元素添加到 DOM 中
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.right = '10px';
    dot.style.top = '50%';
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = 'red';
    dot.style.opacity = '0.5';
    dot.style.zIndex = '999999';
    document.body.appendChild(dot);

    let isCopyAllowed = false;

    // 截取复制请求
    document.addEventListener('copy', function(e) {
        if (!isCopyAllowed) {
            e.preventDefault();
        }
    }, true);

    // 点击事件处理程序
    dot.addEventListener('click', function() {
        isCopyAllowed = !isCopyAllowed;
        dot.style.backgroundColor = isCopyAllowed ? 'green' : 'red'; // 切换颜色
    });
})();