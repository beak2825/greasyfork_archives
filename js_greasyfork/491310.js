// ==UserScript==
// @name         移除超星学习通课程页面的鼠标检测
// @namespace    Ladland
// @version      1.0
// @description  自动删除页面上所有mouseout事件侦听器
// @author       Ladland
// @match        *://mooc1.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491310/%E7%A7%BB%E9%99%A4%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%BC%A0%E6%A0%87%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491310/%E7%A7%BB%E9%99%A4%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%BC%A0%E6%A0%87%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重写EventTarget的addEventListener方法
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'mouseout') {
            console.log('阻止mouseout事件侦听器添加:', listener);
            // 不执行添加mouseout事件侦听器的操作
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 重写EventTarget的removeEventListener方法
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (type === 'mouseout') {
            console.log('阻止mouseout事件侦听器移除:', listener);
            // 不执行移除mouseout事件侦听器的操作
            return;
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    // 获取页面上所有元素
    const elements = document.querySelectorAll('*');
    // 遍历元素，移除mouseout事件侦听器
    elements.forEach(element => {
        const listeners = getEventListeners(element).mouseout;
        if (listeners) {
            listeners.forEach(listener => {
                element.removeEventListener('mouseout', listener.listener);
            });
        }
    });
})();