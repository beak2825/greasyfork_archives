// ==UserScript==
// @name         知识星球帖子自动展开
// @namespace    https://axutongxue.com/
// @version      0.4
// @license      MIT
// @description  自动处理动态加载内容，智能保持帖子展开状态
// @author       无与伦比
// @match        https://wx.zsxq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526212/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/526212/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用WeakSet记录已处理元素（内存安全）
    const processed = new WeakSet();

    // 智能点击控制器
    function smartClick(element) {
        // 三重安全校验
        if (!element ||
            getComputedStyle(element).display === 'none' ||
            processed.has(element)) return;

        // 通过按钮文本精准识别
        const text = element.textContent.trim();
        if (!/展[开示]/.test(text)) return;

        // 执行模拟点击
        element.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        // 标记已处理（即使点击后变成"收起"按钮也不会重复操作）
        processed.add(element);
    }

    // 主处理函数
    function processExpanding() {
        document.querySelectorAll('p.showAll').forEach(smartClick);
    }

    // 防抖观察器配置
    let observerLock = false;
    const observer = new MutationObserver(mutations => {
        if (observerLock) return;
        observerLock = true;

        // 智能延迟处理
        setTimeout(() => {
            processExpanding();
            observerLock = false;
        }, 300); // 延迟时间适配主流SPA加载速度
    });

    // 初始化
    window.addEventListener('load', () => {
        // 首屏立即处理
        processExpanding();

        // 监听动态内容
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 针对单页应用的hashchange处理
        window.addEventListener('hashchange', processExpanding);
    });

    // 保险策略（可选启用）
    // window.addEventListener('scroll', () => {
    //     setTimeout(processExpanding, 500);
    // });
})();