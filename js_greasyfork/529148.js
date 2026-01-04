// ==UserScript==
// @name         删除Bilibili插件警告提示（使用CSS隐藏）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  通过注入CSS隐藏含有特定警告文本的div元素，避免页面闪烁（不隐藏整个页面）
// @author       Timk
// @match        *://www.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529148/%E5%88%A0%E9%99%A4Bilibili%E6%8F%92%E4%BB%B6%E8%AD%A6%E5%91%8A%E6%8F%90%E7%A4%BA%EF%BC%88%E4%BD%BF%E7%94%A8CSS%E9%9A%90%E8%97%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529148/%E5%88%A0%E9%99%A4Bilibili%E6%8F%92%E4%BB%B6%E8%AD%A6%E5%91%8A%E6%8F%90%E7%A4%BA%EF%BC%88%E4%BD%BF%E7%94%A8CSS%E9%9A%90%E8%97%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 预先注入CSS规则，用于隐藏含有特定类的元素
    const style = document.createElement('style');
    style.textContent = `.bili-plugin-warning { display: none !important; }`;
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.documentElement.appendChild(style);
    }

    // 2. 定义需要匹配的警告文本
    const warningText = "检测到您的页面展示可能受到浏览器插件影响，建议您将当前页面加入插件白名单，以保障您的浏览体验～";

    // 3. 检查所有<p>标签，匹配文本内容，并为其父级div添加隐藏类
    function markWarning() {
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.textContent.trim() === warningText) {
                const parentDiv = p.parentElement;
                if (parentDiv && parentDiv.tagName.toLowerCase() === 'div' && !parentDiv.classList.contains('bili-plugin-warning')) {
                    parentDiv.classList.add('bili-plugin-warning');
                    console.log("已标记警告提示对应的div元素为隐藏");
                }
            }
        });
    }

    // 4. 初始化函数：先执行一次检查，然后设置MutationObserver实时监控DOM变化
    function init() {
        markWarning();
        const observer = new MutationObserver(markWarning);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 5. 在DOM加载完成后执行初始化操作
    window.addEventListener('DOMContentLoaded', init);
})();
