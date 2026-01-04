// ==UserScript==
// @name         隐藏日报首页弹窗信息
// @namespace    http://tampermonkey.net/
// @version      2025-07-03
// @description  隐藏指定站点的弹窗!
// @author       HeHa
// @match        *://db.winjoinit.com:12479/*
// @icon         http://db.winjoinit.com:12479/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541609/%E9%9A%90%E8%97%8F%E6%97%A5%E6%8A%A5%E9%A6%96%E9%A1%B5%E5%BC%B9%E7%AA%97%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/541609/%E9%9A%90%E8%97%8F%E6%97%A5%E6%8A%A5%E9%A6%96%E9%A1%B5%E5%BC%B9%E7%AA%97%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找多个目标元素的函数
    function findTargetElements() {
        const elementsToHide = [];

        // 查找对话框元素
        const dialogWrappers = document.querySelectorAll('.el-dialog__wrapper');
        for (const element of dialogWrappers) {
            if (element.getAttribute('style')?.includes('z-index: 2001')) {
                elementsToHide.push(element);
            }
        }

        // 查找模态框元素
        const modals = document.querySelectorAll('.v-modal');
        for (const element of modals) {
            if (element.getAttribute('style')?.includes('z-index: 2000')) {
                elementsToHide.push(element);
            }
        }

        return elementsToHide;
    }

    // 主执行函数
    function hideElements() {
        const targets = findTargetElements();

        if (targets.length > 0) {
            targets.forEach(element => {
                // 添加 display:none 样式
                element.style.display = 'none';
            });
            console.log(`${targets.length}个元素已隐藏`);
        }
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    // 初始执行一次
    hideElements();
})();