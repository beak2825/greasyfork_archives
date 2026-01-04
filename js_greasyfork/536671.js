// ==UserScript==
// @name         FuckNoCopy
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  移除页面的复制限制，取消所有复制后添加的版权申明，理论上支持所有网站，包含知乎，CSDN等页面。本脚本仅解除了技术上的复制限制，请在合理的范围内使用，尊重内容版权，不要未经授权使用或传播他人作品。
// @author       zheng-kun@foxmail.com
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @require      https://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @exclude      *://localhost:*/*
// @downloadURL https://update.greasyfork.org/scripts/536671/FuckNoCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/536671/FuckNoCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 不展示登录框
    GM_addStyle(".passport-login-container{display:none!important;}");
    // 解除代码块的选中限制
    GM_addStyle("#content_views pre code {user-select: text!important;}");


    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(() => {
        // 检测并移除所有 copy 事件监听器
        document.querySelectorAll('*').forEach(element => {
            const eventListeners = element['eventListeners'];
            if (eventListeners && eventListeners.copy) {
                eventListeners.copy.forEach(listener => {
                    element.removeEventListener('copy', listener.listener);
                });
            }
        });
    });

    // 开始监听 document 的 DOM 变化
    observer.observe(document, { childList: true, subtree: true });

    // 重新绑定自定义的 copy 事件监听器
    document.addEventListener('copy', function(event) {
        event.preventDefault(); // 阻止默认行为
        const selection = window.getSelection().toString();
        if (selection) {
            event.clipboardData.setData('text/plain', selection);
        }
    }, { capture: true }); // 使用捕获阶段，确保优先执行



    function replaceAllCopy() {
        document.querySelectorAll('*').forEach(item => {
            item.oncopy = function(e) {
                e.stopPropagation();
                e.preventDefault(); // 阻止默认行为
            };
        });
    }

    // 在文档加载完成后移除一次
    document.addEventListener('DOMContentLoaded', function() {
        replaceAllCopy()
    });

    // 每隔 5 秒移除一次
    setInterval(replaceAllCopy, 5000);
})();