// ==UserScript==
// @name         动漫花园标题过滤器
// @name:zh-CN   动漫花园标题过滤器
// @name:zh-TW   動漫花園標題過濾器
// @name:en      DMHY Title Filter
// @namespace    https://github.com/xkbkx5904
// @version      0.1
// @description  为动漫花园增加标题过滤功能，支持正则表达式和复杂过滤规则
// @description:zh-CN  为动漫花园增加标题过滤功能，支持正则表达式、简繁体匹配和复杂过滤规则
// @description:zh-TW  為動漫花園增加標題過濾功能，支持正則表達式、簡繁體匹配和複雜過濾規則
// @description:en  Add title filtering functionality to DMHY, supporting regex, Chinese variants matching and complex filtering rules
// @author       xkbkx5904
// @match        https://share.dmhy.org/*
// @icon         https://share.dmhy.org/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// @license      MIT
// @run-at       document-start
// @supportURL   https://github.com/xkbkx5904/dmhy-filter/issues
// @homepageURL  https://github.com/xkbkx5904/dmhy-filter
// @downloadURL https://update.greasyfork.org/scripts/523960/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E6%A0%87%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523960/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E6%A0%87%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElements() {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                const quickSearch = document.querySelector('.quick_search');
                const table = document.querySelector('#topic_list');
                
                if (quickSearch && table) {
                    obs.disconnect();
                    resolve({ quickSearch, table });
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });

            // 立即检查元素是否已存在
            const quickSearch = document.querySelector('.quick_search');
            const table = document.querySelector('#topic_list');
            if (quickSearch && table) {
                observer.disconnect();
                resolve({ quickSearch, table });
            }
        });
    }

    // 缓存 OpenCC 实例
    const converters = {
        toTraditional: null,
        toSimplified: null
    };

    // 初始化转换器
    function initConverters() {
        if (!converters.toTraditional || !converters.toSimplified) {
            converters.toTraditional = OpenCC.Converter({ from: 'cn', to: 'twp' });
            converters.toSimplified = OpenCC.Converter({ from: 'tw', to: 'cn' });
        }
    }

    // 过滤标题
    function filterTitles(keywords, table) {
        if (!keywords || !keywords.trim()) {
            // 如果关键词为空，显示所有行
            Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
                row.style.display = '';
            });
            return;
        }

        // 确保转换器已初始化
        initConverters();

        // 分割多个过滤条件（支持中英文分号）
        const filterGroups = keywords
            .split(/[;；]/)
            .map(group => group.trim())
            .filter(Boolean);

        const tbody = table.querySelector('tbody');
        const fragment = document.createDocumentFragment();
        const rows = Array.from(tbody.children);

        // 从 DOM 中移除所有行
        rows.forEach(row => tbody.removeChild(row));

        // 在 fragment 中处理行
        rows.forEach(row => {
            const title = row.querySelector('.title').textContent;
            
            // 生成标题的简繁体变体
            const titleVariants = [
                title.toLowerCase(),
                converters.toTraditional(title).toLowerCase(),
                converters.toSimplified(title).toLowerCase()
            ];

            // 检查是否满足所有过滤组中的至少一个条件
            const matchesAllGroups = filterGroups.every(group => {
                // 检查是否是正则表达式
                if (group.startsWith('/') && group.endsWith('/') && group.length > 2) {
                    try {
                        const regex = new RegExp(group.slice(1, -1), 'i');
                        return titleVariants.some(variant => regex.test(variant));
                    } catch (e) {
                        console.warn('Invalid regex:', group);
                        // 如果正则表达式无效，将其作为普通文本搜索
                        return titleVariants.some(variant => 
                            variant.includes(group.toLowerCase())
                        );
                    }
                }
                
                // 处理普通关键词（支持 OR 操作符 |）
                const terms = group.split('|').map(term => term.trim()).filter(Boolean);
                
                // 生成每个关键词的简繁体变体
                const termVariants = terms.flatMap(term => [
                    term.toLowerCase(),
                    converters.toTraditional(term).toLowerCase(),
                    converters.toSimplified(term).toLowerCase()
                ]);

                // 检查标题变体是否包含任何关键词变体
                return titleVariants.some(titleVariant =>
                    termVariants.some(termVariant =>
                        titleVariant.includes(termVariant)
                    )
                );
            });

            row.style.display = matchesAllGroups ? '' : 'none';
            fragment.appendChild(row);
        });

        // 一次性将所有行添加回 DOM
        tbody.appendChild(fragment);
    }

    // 设置 UI
    function setupUI({ quickSearch, table }) {
        // 创建过滤器输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入过滤条件（不区分简繁体字、支持正则）';
        input.title = `过滤语法说明：
1. 分号（;或；）表示"与"，优先级高于"或"，例如：
   1080p|2160p；简体|繁体
   表示：(1080p或2160p) 且 (简体或繁体)

2. 竖线（|）表示"或"，在分号分隔的每组条件内生效，例如：
   简体|繁体；1080p|2160p；HEVC|x265
   表示：(简体或繁体) 且 (1080p或2160p) 且 (HEVC或x265)

3. 支持正则表达式，使用 /pattern/ 格式：
   /\\[第\\d+集\\]/；1080p
   表示：(标题含[第n集]) 且 (含1080p)

示例组合：HEVC|x265；简体；/\\[01-24集\\]/
匹配说明：必须同时满足以下条件：
1. 包含HEVC或x265
2. 包含简体（或簡體）
3. 包含[01-24集]格式的集数`;
        
        // 复制原始搜索框的属性
        input.className = 'quick_input ac_input';
        input.setAttribute('maxlength', '50');
        input.setAttribute('x-webkit-speech', '');
        input.setAttribute('lang', 'zh-tw');
        input.setAttribute('x-webkit-grammar', 'builtin:translate');
        input.setAttribute('autocomplete', 'off');

        // 创建包装容器以对齐
        const wrapper = document.createElement('span');
        wrapper.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 10px;
            white-space: nowrap;
        `;

        // 组装并添加到页面
        wrapper.appendChild(input);
        quickSearch.appendChild(wrapper);

        // 调整输入框宽度
        function adjustInputWidth() {
            const originalInput = quickSearch.querySelector('#keyword');
            if (originalInput) {
                // 复制原始搜索框的所有计算样式
                const computedStyle = window.getComputedStyle(originalInput);
                input.style.cssText = Array.from(computedStyle)
                    .filter(prop => !prop.startsWith('margin'))
                    .map(prop => `${prop}: ${computedStyle.getPropertyValue(prop)}`)
                    .join(';');
                
                // 设置宽度
                input.style.width = computedStyle.width;
                
                // 保持自定义的 margin
                input.style.marginLeft = '10px';
            }
        }

        // 创建 ResizeObserver 来监听原始搜索框的大小变化
        const resizeObserver = new ResizeObserver(() => {
            adjustInputWidth();
        });

        // 监听原始搜索框的大小变化
        const originalInput = quickSearch.querySelector('#keyword');
        if (originalInput) {
            resizeObserver.observe(originalInput);
        }

        // 初始调整
        adjustInputWidth();

        // 监听窗口大小变化
        window.addEventListener('resize', adjustInputWidth);

        // 添加防抖处理
        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                // 规范化分号显示
                const value = e.target.value;
                const normalizedValue = value.replace(/;/g, '；');
                if (value !== normalizedValue) {
                    input.value = normalizedValue;
                }
                filterTitles(value, table);
            }, 300);
        });
    }

    // 初始化
    async function initialize() {
        try {
            const elements = await waitForElements();
            if (!elements.quickSearch || !elements.table) {
                throw new Error('Required elements not found');
            }
            setupUI(elements);
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
