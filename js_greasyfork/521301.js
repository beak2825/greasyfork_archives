// ==UserScript==
// @name         智云学堂插件
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  自动解除 textarea 上的复制、粘贴、拖拽和文本选择限制
// @author       You
// @match        https://www.e100soft.com/aikc/*.asp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e100soft.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/521301/%E6%99%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521301/%E6%99%BA%E4%BA%91%E5%AD%A6%E5%A0%82%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textareaIds = ['messageInput', 'testNr'];

    // 定义需要移除的事件类型
    const eventsToRemove = ['copy', 'paste', 'selectstart', 'dragover', 'drop'];

    /**
     * 覆盖事件处理程序，阻止默认行为并停止事件传播
     * @param {HTMLElement} textarea - 目标 textarea 元素
     */
    function removeEventHandlers(textarea) {
        eventsToRemove.forEach(eventType => {
            // 移除内联事件处理程序
            textarea[eventType] = null;

            // 添加捕获阶段的空事件监听器，阻止后续处理
            textarea.addEventListener(eventType, function(event) {
                // 不调用 preventDefault 和 stopPropagation，允许默认行为
            }, true);
        });
        console.log(`已移除元素#${textarea.id}的事件监听器`);
    }

    /**
     * 拦截并允许默认行为，同时阻止事件进一步传播
     * @param {HTMLElement} textarea - 目标 textarea 元素
     */
    function interceptEvents(textarea) {
        eventsToRemove.forEach(eventType => {
            textarea.addEventListener(eventType, function(event) {
                event.stopImmediatePropagation();
                // 不调用 preventDefault，允许默认行为
            }, true);
        });
        console.log(`已拦截元素#${textarea.id}的事件`);
    }

    /**
     * 设置 textarea 元素，移除或拦截事件监听器，并添加内容变化监听
     * @param {HTMLElement} textarea - 目标 textarea 元素
     */
    function setupTextarea(textarea) {
        if (textarea) {
            // 方法一：覆盖事件处理程序
            removeEventHandlers(textarea);

            // 方法二：拦截事件并允许默认行为
            interceptEvents(textarea);

            // 添加内容变化监听
            textarea.addEventListener('input', function() {
                const textLength = textarea.value.length;
                window.time9 = textLength;
                console.log(`time9 已更新为: ${window.time9}`);
            });

            console.log(`已配置元素#${textarea.id}`);
        }
    }

    /**
     * 初始化处理现有的 textarea 元素
     */
    function initializeTextareas() {
        textareaIds.forEach(id => {
            const textarea = document.getElementById(id);
            if (textarea) {
                setupTextarea(textarea);
            }
        });
    }

    /**
     * 监听 DOM 变化，处理动态添加的 textarea 元素
     */
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'TEXTAREA' && textareaIds.includes(node.id)) {
                        setupTextarea(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('已开始监听 DOM 变化');
    }

    // 执行初始化
    initializeTextareas();
    observeDOMChanges();

    console.log('移除 textarea 事件监听器脚本已启动');
})();