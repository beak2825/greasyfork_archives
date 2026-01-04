// ==UserScript==
// @name         阻止网页视频自动暂停
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  删除网页中的 blur 和 visibilitychange 事件监听器，防止视频暂停或网页限制后台播放。
// @author       you
// @match        *://*/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547031/%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/547031/%E9%98%BB%E6%AD%A2%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽 window/document 的 onblur/onvisibilitychange
    Object.defineProperty(window, 'onblur', { set: () => {}, get: () => null });
    Object.defineProperty(window, 'onvisibilitychange', { set: () => {}, get: () => null });
    Object.defineProperty(document, 'onvisibilitychange', { set: () => {}, get: () => null });

    // 劫持 addEventListener
    const rawAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'blur' || type === 'visibilitychange') {
            console.log('[Tampermonkey] 阻止事件监听:', type);
            return; // 不注册这类事件
        }
        return rawAddEventListener.call(this, type, listener, options);
    };

    // 劫持 removeEventListener 防止报错
    const rawRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (type === 'blur' || type === 'visibilitychange') {
            return; // 假装已经移除了
        }
        return rawRemoveEventListener.call(this, type, listener, options);
    };

    // 清理已绑定的事件（如果脚本注入稍晚）
    window.addEventListener('DOMContentLoaded', () => {
        window.onblur = null;
        document.onvisibilitychange = null;
    });

})();
