// ==UserScript==
// @name         deepseek标签页标题同步对话标题
// @namespace    http://tampermonkey.net/
// @version      2025-6-16-14-43
// @description  根据当前对话的标题设置当前标签页的标题
// @author       cyrusyxx
// @match        *://chat.deepseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539583/deepseek%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E5%90%8C%E6%AD%A5%E5%AF%B9%E8%AF%9D%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/539583/deepseek%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%A0%87%E9%A2%98%E5%90%8C%E6%AD%A5%E5%AF%B9%E8%AF%9D%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找包含 b64fb9ae 类的 div
        const targetDiv = document.querySelector('div.b64fb9ae');

        if (targetDiv) {
            // 在目标 div 中查找 c08e6e93 类的子元素
            const contentDiv = targetDiv.querySelector('div.c08e6e93');

            if (contentDiv && contentDiv.textContent.trim()) {
                // 设置页面标题为找到的文本内容
                document.title = contentDiv.textContent.trim();
                console.log('标题已更新为: ', document.title);
            }
        } else {
            console.log('未找到包含 b64fb9ae 类的 div 元素');
        }
    });

    // 可选：添加 MutationObserver 以监听动态内容变化
    const observer = new MutationObserver(function(mutations) {
        const targetDiv = document.querySelector('div.b64fb9ae');
        if (targetDiv) {
            const contentDiv = targetDiv.querySelector('div.c08e6e93');
            if (contentDiv && contentDiv.textContent.trim()) {
                document.title = contentDiv.textContent.trim();
            }
        }
    });

    // 开始观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();