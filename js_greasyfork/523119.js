// ==UserScript==
// @name         移除B站顶部搜索框内的占位符
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  移除B站顶部搜索框内的 placeholder 和 title 属性；同时阻止无输入时进行搜索操作时的跳转行为。
// @author       搞其他
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523119/%E7%A7%BB%E9%99%A4B%E7%AB%99%E9%A1%B6%E9%83%A8%E6%90%9C%E7%B4%A2%E6%A1%86%E5%86%85%E7%9A%84%E5%8D%A0%E4%BD%8D%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/523119/%E7%A7%BB%E9%99%A4B%E7%AB%99%E9%A1%B6%E9%83%A8%E6%90%9C%E7%B4%A2%E6%A1%86%E5%86%85%E7%9A%84%E5%8D%A0%E4%BD%8D%E7%AC%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 移除指定 input 元素的 placeholder 和 title 属性
    function removeAttributes(input) {
        // 检查 input 是否具有 nav-search-input 类
        if (input.classList.contains('nav-search-input')) {
            // 如果存在 placeholder 属性，则移除
            if (input.hasAttribute('placeholder')) {
                input.removeAttribute('placeholder');
            }
            // 如果存在 title 属性，则移除
            if (input.hasAttribute('title')) {
                input.removeAttribute('title');
            }
        }
    }

    // 监听指定 input 元素的属性变化，当 placeholder 或 title 属性变化时移除它们
    function observeInput(input) {
        // 检查 input 是否具有 nav-search-input 类
        if (input.classList.contains('nav-search-input')) {
            // 创建 MutationObserver 以监听属性变化
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // 如果发生的变化是 placeholder 或 title 属性，则移除
                    if (mutation.type === 'attributes' && (mutation.attributeName === 'placeholder' || mutation.attributeName === 'title')) {
                        removeAttributes(mutation.target);
                    }
                });
            });

            // 开始监听 input 的属性变化
            observer.observe(input, { attributes: true });
        }
    }

    // 阻止搜索框为空时的搜索操作
    function preventEmptySearchActions(searchInputSelector, searchButtonSelector) {
        // 获取搜索框和搜索按钮
        const searchInput = document.querySelector(searchInputSelector);
        const searchButton = document.querySelector(searchButtonSelector);

        // 如果搜索框存在且未绑定事件，则绑定事件
        if (searchInput && !searchInput.dataset.preventBound) {
            // 定义阻止空搜索的逻辑
            const preventEmptySearch = (e) => {
                if (searchInput.value.trim() === '') {
                    e.preventDefault(); // 阻止默认行为
                    e.stopImmediatePropagation(); // 阻止事件传播
                }
            };

            // 捕获阶段监听搜索框的回车事件
            searchInput.addEventListener(
                'keydown',
                (e) => {
                    if (e.key === 'Enter') {
                        preventEmptySearch(e);
                    }
                },
                true // 捕获阶段监听
            );

            // 标记搜索框已绑定事件
            searchInput.dataset.preventBound = true;
        }

        // 如果搜索按钮存在且未绑定事件，则绑定事件
        if (searchButton && !searchButton.dataset.preventBound) {
            // 捕获阶段监听搜索按钮的点击事件
            searchButton.addEventListener(
                'click',
                (e) => {
                    if (searchInput.value.trim() === '') {
                        e.preventDefault(); // 阻止默认行为
                        e.stopImmediatePropagation(); // 阻止事件传播
                    }
                },
                true // 捕获阶段监听
            );

            // 标记搜索按钮已绑定事件
            searchButton.dataset.preventBound = true;
        }
    }

    // 处理新增的节点
    function processAddedNodes(nodes) {
        const addedInputs = []; // 存储新增的搜索框
        const addedButtons = []; // 存储新增的搜索按钮

        // 遍历新增的节点
        nodes.forEach(function (node) {
            if (node.nodeType === 1) { // 确保是元素节点
                // 如果是搜索框，加入 addedInputs
                if (node.tagName.toLowerCase() === 'input' && node.classList.contains('nav-search-input')) {
                    addedInputs.push(node);
                }
                // 如果是搜索按钮，加入 addedButtons
                else if (node.tagName.toLowerCase() === 'div' && node.classList.contains('nav-search-btn')) {
                    addedButtons.push(node);
                }
                // 如果是其他容器，检查其子节点
                else {
                    node.querySelectorAll('input.nav-search-input').forEach((input) => addedInputs.push(input));
                    node.querySelectorAll('.nav-search-btn').forEach((button) => addedButtons.push(button));
                }
            }
        });

        // 处理新增的搜索框
        addedInputs.forEach((input) => {
            removeAttributes(input);
            observeInput(input);
        });

        // 处理新增的搜索按钮
        addedButtons.forEach(() => {
            preventEmptySearchActions('.nav-search-input', '.nav-search-btn');
        });
    }

    // 初始处理当前文档中所有 nav-search-input 类的 input 元素
    document.querySelectorAll('input.nav-search-input').forEach(function (input) {
        removeAttributes(input); // 移除属性
        observeInput(input); // 开始监听属性变化
    });

    // 添加阻止空搜索的逻辑
    preventEmptySearchActions('.nav-search-input', '.nav-search-btn');

    // 监听 DOM 变化以处理新添加的 nav-search-input 类的 input 和按钮
    const observer = new MutationObserver(function (mutations) {
        const addedNodes = []; // 存储新增的节点
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                addedNodes.push(node);
            });
        });
        processAddedNodes(addedNodes); // 批量处理新增节点
    });

    // 缩小监听范围（如果有特定容器）
    const targetContainer = document.querySelector('.nav-container') || document.body; // 替换为实际的容器选择器
    observer.observe(targetContainer, { childList: true, subtree: true });

    // 处理当前文档中的所有 iframe 元素
    function handleIframes() {
        document.querySelectorAll('iframe').forEach(function (iframe) {
            try {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                if (!iframeDocument) return;

                // 处理 iframe 中的搜索框
                const inputs = iframeDocument.querySelectorAll('input.nav-search-input');
                inputs.forEach(function (input) {
                    removeAttributes(input);
                    observeInput(input);
                });

                // 处理 iframe 中的搜索按钮
                const buttons = iframeDocument.querySelectorAll('.nav-search-btn');
                buttons.forEach(() => {
                    preventEmptySearchActions('.nav-search-input', '.nav-search-btn');
                });

                // 只在 iframe 中有动态内容时创建 observer
                if (!iframeDocument.body.dataset.observed) {
                    const iframeObserver = new MutationObserver(function (mutations) {
                        const addedNodes = [];
                        mutations.forEach(function (mutation) {
                            mutation.addedNodes.forEach(function (node) {
                                addedNodes.push(node);
                            });
                        });
                        processAddedNodes(addedNodes); // 批量处理新增节点
                    });

                    iframeObserver.observe(iframeDocument.body, { childList: true, subtree: true });
                    iframeDocument.body.dataset.observed = true; // 标记已观察
                }
            } catch (e) {
                console.error('无法访问 iframe:', e);
            }
        });
    }

    // 初始处理当前文档中的所有 iframe 元素
    handleIframes();
})();