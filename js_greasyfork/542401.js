// ==UserScript==
// @name         Bililive双人PK点击穿透
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监控页面中双人PK元素的添加，并使其点击穿透
// @author       Her0mAn
// @include      /^https:\/\/live\.bilibili\.com\/\d+(\?.*)?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542401/Bililive%E5%8F%8C%E4%BA%BAPK%E7%82%B9%E5%87%BB%E7%A9%BF%E9%80%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542401/Bililive%E5%8F%8C%E4%BA%BAPK%E7%82%B9%E5%87%BB%E7%A9%BF%E9%80%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // 等待目标元素出现
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    requestAnimationFrame(check);
                }
            }

            check();
        });
    }

    // 给元素添加样式
    function addPointerEventsNone(element) {
        element.style.pointerEvents = 'none';
        console.log('已为 universal-pk-double-pk 元素添加 pointer-events: none 样式');
    }

    // 处理已存在的元素
    function processExistingElements(container) {
        const existingElements = container.querySelectorAll('.universal-pk-double-pk');
        existingElements.forEach(element => {
            addPointerEventsNone(element);
        });
    }

    // 创建 MutationObserver 来监控 DOM 变化
    function createObserver(targetElement) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查添加的直接子节点
                mutation.addedNodes.forEach((node) => {
                    // 如果添加的是元素节点且包含目标类名
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        node.classList &&
                        node.classList.contains('universal-pk-double-pk')) {
                        console.log('检测到 universal-pk-double-pk 元素被添加');
                        addPointerEventsNone(node);
                    }
                });
            });
        });

        // 配置观察选项 - 只观察直接子节点
        const config = {
            childList: true,    // 观察直接子节点的变化
            subtree: false      // 不观察后代节点
        };

        // 开始观察
        observer.observe(targetElement, config);
        console.log('开始监控 universal-pk-box 元素的直接子节点变化');

        return observer;
    }

    // 主函数
    async function init() {
        try {
            console.log('脚本开始执行...');
            console.log('当前匹配的URL:', window.location.href);

            // 等待页面加载完成
            await waitForPageLoad();
            console.log('页面加载完成');

            // 等待目标容器元素出现
            const targetElement = await waitForElement('#universal-pk-vm.universal-pk-box');
            console.log('找到目标元素:', targetElement);

            // 先创建观察器，避免竞态条件
            const observer = createObserver(targetElement);

            // 然后处理已存在的元素
            processExistingElements(targetElement);

            // 可选：在页面卸载时清理观察器
            window.addEventListener('beforeunload', () => {
                observer.disconnect();
                console.log('观察器已断开连接');
            });

        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }

    // 启动脚本
    init();

})();