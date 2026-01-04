// ==UserScript==
// @name         ChatGPT返回顶部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用↑符号的返回顶部按钮，并尝试滚动所有可能的滚动容器
// @author       Hill
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494636/ChatGPT%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494636/ChatGPT%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建返回顶部的按钮
    var btnTop = document.createElement('button');
    btnTop.innerText = '↑'; // 使用“↑”符号
    btnTop.style.position = 'fixed';
    btnTop.style.top = '20px';
    btnTop.style.right = '20px';
    btnTop.style.padding = '10px';
    btnTop.style.zIndex = '1000';
    btnTop.style.cursor = 'pointer';
    btnTop.style.fontSize = '24px'; // 调整字体大小以增大箭头

    // 点击事件处理函数，尝试滚动所有可能的滚动容器
    btnTop.onclick = function() {
        var scrollableElements = document.querySelectorAll('html, body, div');
        scrollableElements.forEach(function(elem) {
            if (elem.scrollHeight > elem.clientHeight) { // 检查元素是否具有滚动条
                try {
                    elem.scrollTo({top: 0, behavior: 'smooth'});
                    console.log('尝试滚动元素:', elem);
                } catch (error) {
                    console.error('滚动元素错误:', error);
                }
            }
        });
    };

    // 将按钮添加到页面上
    document.body.appendChild(btnTop);

    console.log('返回顶部按钮已创建并就绪');
})();
