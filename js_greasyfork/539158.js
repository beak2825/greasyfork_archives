// ==UserScript==
// @name         小红书展开回复按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在小红书网页右下角添加一个悬浮按钮，点击后展开所有评论
// @author       公众号：阿虚同学
// @match        https://www.xiaohongshu.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539158/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B1%95%E5%BC%80%E5%9B%9E%E5%A4%8D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/539158/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B1%95%E5%BC%80%E5%9B%9E%E5%A4%8D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    const button = document.createElement('button');
    button.innerText = '展开回复';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#ff2442';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

    // 添加点击事件监听
    button.addEventListener('click', function() {
        document.querySelectorAll('div.show-more').forEach(function(element) {
            element.click();
        });
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();