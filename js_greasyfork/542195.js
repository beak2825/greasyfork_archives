// ==UserScript==
// @name         启明星辰刷课程防暂停
// @namespace    hengyuan
// @version      0.3
// @description  防止启明星辰刷课程网页因最小化、失去焦点或长时间未操作而自动暂停
// @author       Devv & You
// @match        https://venusgroup.yunxuetang.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=venusgroup.yunxuetang.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542195/%E5%90%AF%E6%98%8E%E6%98%9F%E8%BE%B0%E5%88%B7%E8%AF%BE%E7%A8%8B%E9%98%B2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/542195/%E5%90%AF%E6%98%8E%E6%98%9F%E8%BE%B0%E5%88%B7%E8%AF%BE%E7%A8%8B%E9%98%B2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止最小化或失去焦点暂停
    // 强制设置 visibilityState 为 'visible'
    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        },
        configurable: false
    });

    // 强制设置 hidden 为 false
    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        },
        configurable: false
    });

    // 防止 visibilitychange 事件的触发
    document.addEventListener('visibilitychange', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
    }, true);

    // 防止因长时间未操作暂停
    let interval = 1 * 60 * 1000; // 每1分钟模拟一次鼠标移动
    let lastMove = Date.now();

    function simulateMouseMove() {
        let now = Date.now();
        if (now - lastMove > interval) {
            let event = new MouseEvent('mousemove', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'clientX': Math.random() * window.innerWidth,
                'clientY': Math.random() * window.innerHeight
            });
            document.dispatchEvent(event);
            lastMove = now;
        }
    }

    setInterval(simulateMouseMove, 60 * 1000); // 每分钟检查一次是否需要模拟鼠标移动
})();