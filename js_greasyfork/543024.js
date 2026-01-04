// ==UserScript==
// @name         M-team 色盲辅助
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在m-team.cc网站根据颜色添加用户头衔
// @author       You
// @match        https://m-team.cc/*
// @match        https://*.m-team.cc/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543024/M-team%20%E8%89%B2%E7%9B%B2%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/543024/M-team%20%E8%89%B2%E7%9B%B2%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 颜色和对应标签的配置字典
    const COLOR_LABELS = {
        'rgb(51, 51, 51)': '[小卒1]',
        'rgb(218, 165, 32)': '[捕頭2]',
        'rgb(0, 139, 139)': '[知縣3]',
        'rgb(0, 191, 255)': '[通判4]',
        'rgb(139, 0, 139)': '[知州5]',
        'rgb(72, 61, 139)': '[府丞6]',
        'rgb(255, 140, 0)': '[府尹7]',
        'rgb(0, 100, 0)': '[總督8]',
        'rgb(236, 56, 78)': '[大臣9]',
        'rgb(0, 159, 0)': '[VIP]',
        'rgb(220, 20, 60)': '[職人]',
        'rgb(28, 198, 213)': '[巡查]',
        'rgb(100, 149, 237)': '[總版]',
        'rgb(75, 0, 130)': '[總管]',
        'rgb(160, 82, 45)': '[維護開發員]',
        'rgb(139, 0, 0)': '[站長]',
        'rgb(156, 67, 67)': '[候選管理]',
        'rgb(88, 55, 55)': '[波菜管理]',
    };

    // 处理单个span元素
    function processSpan(span) {
        const computedStyle = window.getComputedStyle(span);
        const color = computedStyle.color;

        // 检查颜色是否在配置中
        if (COLOR_LABELS.hasOwnProperty(color)) {
            // 检查是否仅包含一个strong子元素
            const strongElements = span.querySelectorAll('strong');
            if (strongElements.length === 1 && span.children.length === 1) {
                const strong = strongElements[0];
                const label = COLOR_LABELS[color];

                // 检查是否已经添加过标签，避免重复添加
                if (!strong.textContent.includes(label)) {
                    strong.textContent += label;
                }

                // 保存原始用户名和等级信息到span的data属性中，供tooltip使用
                if (!span.dataset.originalUsername) {
                    span.dataset.originalUsername = strong.textContent.replace(label, '');
                    span.dataset.userLevel = label;
                }
            }
        }
    }

    // 处理tooltip元素
    function processTooltip(tooltip) {
        // 查找tooltip中的文本内容
        const textNodes = [];
        const walker = document.createTreeWalker(
            tooltip,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }

        // 遍历所有用户等级，看tooltip文本是否包含用户名
        for (const [color, label] of Object.entries(COLOR_LABELS)) {
            // 查找页面上对应颜色的span元素
            const spans = document.querySelectorAll('span');
            spans.forEach(span => {
                const computedStyle = window.getComputedStyle(span);
                if (computedStyle.color === color && span.dataset.originalUsername) {
                    const username = span.dataset.originalUsername;
                    const userLevel = span.dataset.userLevel;

                    // 检查tooltip是否包含这个用户名
                    textNodes.forEach(textNode => {
                        if (textNode.textContent.includes(username) && !textNode.textContent.includes(userLevel)) {
                            // 在tooltip中添加等级信息
                            textNode.textContent = textNode.textContent.replace(username, username + userLevel);
                        }
                    });
                }
            });
        }
    }

    // 创建一个全局的用户名-等级映射
    const usernameToLevel = new Map();

    // 更新用户名映射
    function updateUsernameMap() {
        const spans = document.querySelectorAll('span');
        spans.forEach(span => {
            const computedStyle = window.getComputedStyle(span);
            const color = computedStyle.color;

            if (COLOR_LABELS.hasOwnProperty(color)) {
                const strongElements = span.querySelectorAll('strong');
                if (strongElements.length === 1 && span.children.length === 1) {
                    const strong = strongElements[0];
                    const label = COLOR_LABELS[color];
                    const username = strong.textContent.replace(label, '');

                    if (username && !usernameToLevel.has(username)) {
                        usernameToLevel.set(username, label);
                    }
                }
            }
        });
    }

    // 转义正则表达式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 处理tooltip的新方法 - 使用全局映射
    function processTooltipWithMapping(tooltip) {
        if (!tooltip || tooltip.dataset.processed) return;

        // 标记已处理，避免重复处理
        tooltip.dataset.processed = 'true';

        // 延迟处理，确保tooltip内容完全加载
        setTimeout(() => {
            const walker = document.createTreeWalker(
                tooltip,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.trim()) {
                    let text = node.textContent;
                    let modified = false;

                    // 检查所有已知用户名
                    for (const [username, level] of usernameToLevel) {
                        if (text.includes(username) && !text.includes(level)) {
                            // 转义用户名中的特殊字符，避免正则表达式错误
                            const escapedUsername = escapeRegExp(username);
                            text = text.replace(new RegExp(escapedUsername, 'g'), username + level);
                            modified = true;
                        }
                    }

                    if (modified) {
                        node.textContent = text;
                    }
                }
            }
        }, 50);
    }

    // 处理所有符合条件的span元素和tooltip
    function processAllElements() {
        // 处理用户名span元素
        const spans = document.querySelectorAll('span');
        spans.forEach(processSpan);

        // 更新用户名映射
        updateUsernameMap();

        // 处理已存在的tooltip元素
        const tooltipSelectors = [
            '[role="tooltip"]',
            '.tooltip',
            '.ant-tooltip',
            '.rc-tooltip',
            '[aria-describedby]',
            '.tippy-content',
            '[data-tooltip]'
        ];

        tooltipSelectors.forEach(selector => {
            const tooltips = document.querySelectorAll(selector);
            tooltips.forEach(processTooltipWithMapping);
        });

        // 也处理可能是tooltip容器的div
        const possibleTooltips = document.querySelectorAll('div[style*="position: absolute"], div[style*="position: fixed"]');
        possibleTooltips.forEach(tooltip => {
            // 简单检查是否可能是tooltip（包含用户名相关文本）
            if (tooltip.textContent && tooltip.textContent.length < 200) {
                processTooltipWithMapping(tooltip);
            }
        });
    }

    // 初始处理
    processAllElements();

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;
        let shouldProcessTooltip = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否有新增的节点
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 如果新增的是span元素或包含这些元素
                        if (node.tagName === 'SPAN' || node.querySelector('span')) {
                            shouldProcess = true;
                        }

                        // 检查是否是tooltip相关元素
                        if (node.hasAttribute('role') && node.getAttribute('role') === 'tooltip' ||
                            node.className && (node.className.includes('tooltip') ||
                                               node.className.includes('ant-tooltip') ||
                                               node.className.includes('rc-tooltip')) ||
                            node.hasAttribute('aria-describedby') ||
                            (node.style && (node.style.position === 'absolute' || node.style.position === 'fixed')) ||
                            node.querySelector('[role="tooltip"]') ||
                            node.querySelector('.tooltip, .ant-tooltip, .rc-tooltip, .tippy-content')) {
                            shouldProcessTooltip = true;
                        }
                    }
                }
            }
        });

        if (shouldProcess) {
            // 延迟处理用户名span
            setTimeout(processAllElements, 100);
        }

        if (shouldProcessTooltip) {
            // 立即处理tooltip，因为它们通常是临时的
            setTimeout(() => {
                // 更新映射
                updateUsernameMap();

                // 处理新出现的tooltip
                const tooltipSelectors = [
                    '[role="tooltip"]:not([data-processed])',
                    '.tooltip:not([data-processed])',
                    '.ant-tooltip:not([data-processed])',
                    '.rc-tooltip:not([data-processed])',
                    '[aria-describedby]:not([data-processed])',
                    '.tippy-content:not([data-processed])',
                    '[data-tooltip]:not([data-processed])'
                ];

                tooltipSelectors.forEach(selector => {
                    const tooltips = document.querySelectorAll(selector);
                    tooltips.forEach(processTooltipWithMapping);
                });

                // 处理新的绝对定位元素
                const newTooltips = document.querySelectorAll('div[style*="position: absolute"]:not([data-processed]), div[style*="position: fixed"]:not([data-processed])');
                newTooltips.forEach(tooltip => {
                    if (tooltip.textContent && tooltip.textContent.length < 200) {
                        processTooltipWithMapping(tooltip);
                    }
                });
            }, 10);
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('M-team 颜色标签添加器已启动');
})();