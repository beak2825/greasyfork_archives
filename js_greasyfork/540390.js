// ==UserScript==
// @name         防止切屏检测 (ks.html)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  阻止 ks.html 页面检测用户是否切换了浏览器标签或窗口。
// @author       AI Assistant
 // @license      MIT
// @match        file:///d:/1122/ks.html
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540390/%E9%98%B2%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B%20%28kshtml%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540390/%E9%98%B2%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B%20%28kshtml%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即停止事件传播，阻止页面上其他脚本监听到这些事件
    const stopEvent = function(e) {
        e.stopImmediatePropagation();
    };

    // 在捕获阶段监听事件，确保我们的脚本最先执行
    window.addEventListener('blur', stopEvent, true);
    window.addEventListener('focusout', stopEvent, true);
    document.addEventListener('visibilitychange', stopEvent, true);

    // 伪装 document 的可见性状态，使其一直为 'visible'
    try {
        Object.defineProperty(document, 'visibilityState', {
            value: 'visible',
            writable: false,
            configurable: true
        });
    } catch (e) {
        console.log('Failed to redefine visibilityState', e);
    }

    // 伪装 document.hidden 属性，使其一直为 false
    try {
        Object.defineProperty(document, 'hidden', {
            value: false,
            writable: false,
            configurable: true
        });
    } catch (e) {
        console.log('Failed to redefine hidden', e);
    }

    // 覆盖旧版浏览器可能使用带前缀的属性
    ['webkit', 'moz', 'ms'].forEach(prefix => {
        const propVisibility = prefix + 'VisibilityState';
        const propHidden = prefix + 'Hidden';
        try {
            Object.defineProperty(document, propVisibility, {
                value: 'visible',
                writable: false,
                configurable: true
            });
        } catch (e) {}
        try {
            Object.defineProperty(document, propHidden, {
                value: false,
                writable: false,
                configurable: true
            });
        } catch (e) {}
    });

})();