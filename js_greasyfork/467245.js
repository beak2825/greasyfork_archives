// ==UserScript==
// @name         ChatGPT一键返回顶部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击按钮返回页面顶部。
// @author       LShang
// @license MIT
// @match        https://chat.openai.com/*
// @match        https://chat.zhile.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467245/ChatGPT%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/467245/ChatGPT%E4%B8%80%E9%94%AE%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    var css = `
    #scrollToTopBtn {
        position: fixed;
        right: 20px;
        top: 20px;
        z-index: 9999;
        font-size: 18px;
        border: none;
        outline: none;
        background-color: #555;
        color: white;
        cursor: pointer;
        padding: 15px;
        border-radius: 4px;
    }
    #scrollToTopBtn:hover {
        background-color: #444;
    }
    `;

    // 创建样式元素
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 创建按钮元素
    var btn = document.createElement('button');
    btn.id = 'scrollToTopBtn';
    btn.textContent = 'Top';
    document.body.appendChild(btn);

    // 添加平滑滚动效果
    function smoothScrollTop(element) {
        var y = element.scrollTop;
        var step = Math.max(y / 10, 10);
        if (y > 0) {
            element.scrollTop = y - step;
            window.requestAnimationFrame(function() {
                smoothScrollTop(element);
            });
        }
    }

    // 为按钮添加点击事件
    btn.addEventListener('click', function() {
        var element = document.querySelector('#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div');
        smoothScrollTop(element);
    });
})();
