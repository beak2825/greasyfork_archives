// ==UserScript==
// @name         学习通视频防止暂停
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一个简单的学习通脚本，打开就可以阻止学习通课程视频在鼠标移出窗口后自动暂停，方便视频后台播放
// @author       Shuang
// @match        https://mooc1.chaoxing.com/mycourse/*
// @iconURL      https://mooc2-ans.chaoxing.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536292/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/536292/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截所有事件监听器的添加
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'mouseout') {
            console.warn('[脚本拦截] 已阻止 mouseout 事件监听器');
            return;
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    // 移除已存在的 onmouseout 属性绑定
    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('*').forEach(element => {
            element.onmouseout = null;
        });
    });

    // 双重保障：阻止事件传播
    document.addEventListener('mouseout', e => {
        e.stopImmediatePropagation();
    }, true);

})();