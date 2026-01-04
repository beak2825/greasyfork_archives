// ==UserScript==
// @name         Focus Daily Dictation
// @namespace    http://tampermonkey.net/
// @version      25.3.1
// @description  Auto-scroll to the dictation element near the top
// @author       clane
// @match        https://dailydictation.com/exercises/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529160/Focus%20Daily%20Dictation.user.js
// @updateURL https://update.greasyfork.org/scripts/529160/Focus%20Daily%20Dictation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function scrollToTarget() {
        // 精确选择包含min-height:400px的row元素
        const target = document.querySelector('.row[style*="min-height: 400px"]');
        if (!target) return false;

        // 计算固定顶栏高度（如果有）
        const header = document.querySelector('header, .fixed-top');
        const offset = header ? header.offsetHeight : 0;

        // 滚动到目标位置
        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
        });
        return true;
    }

    // 立即尝试执行
    if (!scrollToTarget()) {
        // 设置观察者检测动态加载
        const observer = new MutationObserver(() => scrollToTarget());
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // 10秒后停止观察（防止长期占用资源）
        setTimeout(() => observer.disconnect(), 10000);
    }
})();