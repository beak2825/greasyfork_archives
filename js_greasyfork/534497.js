// ==UserScript==
// @name         Bangumi 标签提取器(T键复制)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取 Bangumi 页面上的动画标签，按T键复制到剪贴板
// @author       You
// @match        https://bangumi.tv/subject/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534497/Bangumi%20%E6%A0%87%E7%AD%BE%E6%8F%90%E5%8F%96%E5%99%A8%28T%E9%94%AE%E5%A4%8D%E5%88%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534497/Bangumi%20%E6%A0%87%E7%AD%BE%E6%8F%90%E5%8F%96%E5%99%A8%28T%E9%94%AE%E5%A4%8D%E5%88%B6%29.meta.js
// ==/UserScript==

(function() {
   'use strict';
    let tagResult = '';
    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 获取所有 a 元素
        const allLinks = document.querySelectorAll('a');
        // 用于存储找到的标签内容
        const tagContents = [];
        // 遍历所有 a 元素
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            // 检查 href 是否以 /anime/tag/ 开头
            if (href && href.startsWith('/anime/tag/')) {
                // 查找 a 元素中的 span 元素
                const spanElement = link.querySelector('span');
                // 如果找到了 span 元素并且有内容，则添加到结果数组中
                if (spanElement && spanElement.textContent) {
                    tagContents.push(spanElement.textContent.trim());
                }
            }
        });
        // 将所有标签内容用英文逗号连接并输出到控制台
        tagResult = tagContents.join(',');
        console.log('提取的标签：', tagResult);
    });
    // 添加键盘事件监听，按下T键时复制标签到剪贴板
    document.addEventListener('keydown', function(e) {
        // 检查是否按下T键，并且不是在输入框中
        if (e.key === 'T' || e.key === 't') {
            const activeElement = document.activeElement;
            const isInput = activeElement.tagName === 'INPUT' ||
                           activeElement.tagName === 'TEXTAREA' ||
                           activeElement.isContentEditable;
            if (!isInput && tagResult) {
                // 使用GM_setClipboard复制到剪贴板
                GM_setClipboard(tagResult);
                console.log('已复制标签到剪贴板：', tagResult);
                // 可选：显示一个临时提示
                const notification = document.createElement('div');
                notification.textContent = '已复制标签到剪贴板';
                notification.style.cssText = 'position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.7);color:white;padding:10px;border-radius:4px;z-index:9999';
                document.body.appendChild(notification);
                // 2秒后移除提示
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 2000);
            }
        }
    });
})();