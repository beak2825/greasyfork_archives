// ==UserScript==
// @name         隐藏百度热搜-hide baidu hotspot
// @namespace    http://tampermonkey.net/
// @version      2025.11.28
// @description  hide baidu hotspot
// @author       mattpower-tongyi
// @match        https://www.baidu.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528098/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C-hide%20baidu%20hotspot.user.js
// @updateURL https://update.greasyfork.org/scripts/528098/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C-hide%20baidu%20hotspot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即注入CSS样式, 在DOM解析前就隐藏目标元素, 防止页面闪烁
    const style = document.createElement('style');  // 创建style元素
    style.textContent = '#content_right { display: none !important; }';  // 设置CSS规则
    (document.head || document.documentElement).appendChild(style);  // 注入到页面

    // 使用MutationObserver监控DOM变化, 在元素出现时立即移除
    const observer = new MutationObserver(function(mutations) {  // 创建DOM变化观察器
        const element = document.getElementById('content_right');
        if (element) {
            element.remove();  // 移除元素
            observer.disconnect();  // 元素已移除, 停止观察
        }
    });

    // 在document可用时开始观察
    if (document.documentElement) {
        observer.observe(document.documentElement, {
            childList: true,  // 监控子节点变化
            subtree: true     // 监控所有后代节点
        });
    } else {
        // 如果documentElement还不存在, 等待它出现后再开始观察
        document.addEventListener('DOMContentLoaded', function() {
            const element = document.getElementById('content_right');
            if (element) {
                element.remove();
            }
        });
    }
})();