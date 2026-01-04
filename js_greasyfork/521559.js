// ==UserScript==
// @name         WhatsApp Web 输入法 ESC 键优化
// @name:en      WhatsApp Web IME ESC Key Fix
// @namespace    https://greasyfork.org/zh-CN/users/3001-hanjian-wu
// @version      0.1
// @description  修复 WhatsApp Web 中文输入法 ESC 键冲突问题
// @description:en  Fix ESC key conflict with IME input in WhatsApp Web
// @author       RoyWU
// @match        https://web.whatsapp.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521559/WhatsApp%20Web%20%E8%BE%93%E5%85%A5%E6%B3%95%20ESC%20%E9%94%AE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521559/WhatsApp%20Web%20%E8%BE%93%E5%85%A5%E6%B3%95%20ESC%20%E9%94%AE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', function(event) {
        // 检查是否是 ESC 键
        if (event.key === 'Escape') {
            // 检查当前是否有 IME 输入
            const isIMEInput = event.isComposing || event.keyCode === 229;
            
            // 如果是 IME 输入状态，阻止事件传播
            if (isIMEInput) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }, true); // 使用捕获阶段
})();
