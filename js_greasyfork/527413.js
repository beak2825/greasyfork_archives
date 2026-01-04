// ==UserScript==
// @name         heck.ai 净化
// @namespace    http://tampermonkey.net/
// @version      2025-02-19
// @description  移除指定div之后的所有内容
// @author       You
// @match        https://heck.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wenxiaobai.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527413/heckai%20%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527413/heckai%20%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkAndRemove = () => {
        // 使用更灵活的选择器
        const target = document.querySelector(
            'body > div[class*="relative"][class*="flex"]'
        );

        if (target) {
            console.log('找到目标元素，开始清理...');
            let next;
            while((next = target.nextElementSibling) !== null) {
                next.remove();
            }
            // 同时清理父级可能存在的干扰元素
            target.parentNode.querySelectorAll('script, style').forEach(el => {
                if(el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) {
                    el.remove();
                }
            });
        } else {
            console.warn('未找到目标元素，10秒后重试...');
            setTimeout(checkAndRemove, 1000);
        }
    }

    // 初始执行 + 定期检查
    checkAndRemove();
    setInterval(checkAndRemove, 30000);
})();