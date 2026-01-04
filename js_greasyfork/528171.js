// ==UserScript==
// @name         复制拦截
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用系统弹窗的复制控制方案
// @author       百合是人类文明的瑰宝
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528171/%E5%A4%8D%E5%88%B6%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/528171/%E5%A4%8D%E5%88%B6%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储配置
    const isAutoMode = GM_getValue('copyAutoMode', false);
    let copyLock = false;

    // 创建菜单项
    GM_registerMenuCommand('📱 切换自动复制', () => {
        const newMode = !GM_getValue('copyAutoMode', false);
        GM_setValue('copyAutoMode', newMode);
        GM_notification({
            text: `自动复制已${newMode ? '启用' : '关闭'}`,
            timeout: 2000
        });
    });

    // 解除事件限制
    const nativeAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const blockEvents = ['copy','cut','contextmenu','selectstart','touchstart'];
        if(blockEvents.includes(type)){
            const wrapper = e => {
                e.stopImmediatePropagation();
                return listener(e);
            };
            return nativeAddEventListener.call(this, type, wrapper, options);
        }
        return nativeAddEventListener.apply(this, arguments);
    };

    // 处理复制操作
    document.addEventListener('copy', function(e) {
        if(copyLock || isAutoMode) return;
        
        e.preventDefault();
        const selection = window.getSelection().toString();
        
        // 三星原生弹窗交互
        const confirmCopy = confirm(`检测到复制操作\n\n"${selection.slice(0,30)}..."\n\n允许复制吗？`);
        
        if(confirmCopy) {
            copyLock = true;
            e.clipboardData.setData('text/plain', selection);
            setTimeout(() => copyLock = false, 500);
        }
    }, true);

    // 强制解除CSS限制
    const styleWatcher = setInterval(() => {
        ['user-select','-webkit-user-select'].forEach(prop => {
            document.body.style.setProperty(prop, 'auto', 'important');
        });
    }, 800);
    
    // 清理定时器
    document.addEventListener('DOMContentLoaded', () => {
        clearInterval(styleWatcher);
    }, {once: true});
})();