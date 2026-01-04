// ==UserScript==
// @name         解除复制限制
// @name:zh-CN   解除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除网页复制限制，启用右键菜单
// @description:zh-CN  解除网页复制限制，启用右键菜单
// @author       焦灼
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531458/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531458/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除页面的复制限制
    function removeCopyRestrictions() {
        // 启用右键菜单
        document.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            return true;
        }, true);

        // 启用选择
        document.addEventListener('selectstart', function(e) {
            e.stopPropagation();
            return true;
        }, true);

        // 启用复制
        document.addEventListener('copy', function(e) {
            e.stopPropagation();
            return true;
        }, true);

        // 移除禁止复制的 CSS
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        // 移除元素的鼠标事件和复制限制
        function removeEventListeners(element) {
            if (!element) return;
            
            // 移除 oncontextmenu 属性
            element.oncontextmenu = null;
            
            // 移除 onselectstart 属性
            element.onselectstart = null;
            
            // 移除 oncopy 属性
            element.oncopy = null;
            
            // 移除 oncut 属性
            element.oncut = null;
            
            // 移除 onpaste 属性
            element.onpaste = null;
            
            // 移除 ondrag 属性
            element.ondrag = null;
            
            // 移除 ondragstart 属性
            element.ondragstart = null;
        }

        // 处理所有元素
        function processElements() {
            removeEventListeners(document);
            removeEventListeners(document.body);
            
            const elements = document.getElementsByTagName('*');
            for (let element of elements) {
                removeEventListeners(element);
            }
        }

        // 初始处理
        processElements();

        // 监听 DOM 变化
        const observer = new MutationObserver(() => {
            processElements();
        });

        // 开始监听
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 在页面加载开始时执行
    removeCopyRestrictions();
})();