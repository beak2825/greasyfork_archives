// ==UserScript==
// @name         AnkiWeb Deck Collapse
// @name:zh-CN   AnkiWeb Deck 折叠功能
// @namespace    https://github.com/deepseek-ai/DeepSeek-V3
// @version      1.0
// @description  Add collapse/expand functionality to AnkiWeb deck pages with hierarchical indentation.
// @description:zh-CN 在 AnkiWeb 的 deck 页面添加折叠/展开功能，并支持层级缩进。
// @author       DeepSeek-V3 | ovo
// @match        https://ankiweb.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527709/AnkiWeb%20Deck%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/527709/AnkiWeb%20Deck%20Collapse.meta.js
// ==/UserScript==

(function() {
    // 初始化函数
    function initializeDeckCollapse() {
        // 只在/decks路径下运行
        if (window.location.pathname !== '/decks') {
            return;
        }

        // 获取所有的deck行
        const deckRows = document.querySelectorAll('.row.light-bottom-border');

        // 用于存储每个deck的层级关系和子deck
        const deckMap = new Map();

        // 遍历每个deck行，构建层级关系
        deckRows.forEach((row, index) => {
            const button = row.querySelector('button');
            const textContent = button.textContent;

            // 计算空格数量来确定层级
            const indentLevel = (textContent.match(/^\s*/) || [''])[0].length;

            // 存储当前deck的层级和子deck
            deckMap.set(row, {
                indentLevel,
                children: [],
                isCollapsed: true // 默认收起
            });

            // 找到当前deck的父deck
            if (indentLevel > 0) {
                for (let i = index - 1; i >= 0; i--) {
                    const parentRow = deckRows[i];
                    const parentIndentLevel = deckMap.get(parentRow).indentLevel;

                    // 如果找到父deck
                    if (parentIndentLevel < indentLevel) {
                        deckMap.get(parentRow).children.push(row);
                        break;
                    }
                }
            }
        });

        // 遍历每个deck行，添加展开/收起按钮和缩进
        deckRows.forEach(row => {
            const { indentLevel, children } = deckMap.get(row);
            const button = row.querySelector('button');
            const deckName = button.textContent.trim();

            // 修改button的文本为deckName
            button.textContent = deckName;

            // 计算margin-left
            const marginLeft = Math.max((indentLevel - 4), 0) + 'em';

            // 如果当前deck有子deck，则添加展开/收起按钮
            if (children.length > 0) {
                // 创建展开/收起按钮
                const toggleButton = document.createElement('button');
                toggleButton.textContent = '+'; // 默认收起
                toggleButton.style.background = 'none';
                toggleButton.style.border = 'none';
                toggleButton.style.cursor = 'pointer';
                toggleButton.style.marginLeft = marginLeft; // 设置缩进

                // 检查localStorage中是否存储了该deck的展开状态
                const isCollapsed = localStorage.getItem(`deckCollapsed_${deckName}`) !== 'false';

                // 如果存储的状态是展开，则展开直接子deck
                if (!isCollapsed) {
                    toggleButton.textContent = '-';
                    toggleDirectChildren(row, false); // 展开直接子deck
                } else {
                    toggleDirectChildren(row, true); // 收起直接子deck
                }

                // 添加点击事件来切换展开/收起状态
                toggleButton.addEventListener('click', () => {
                    const isCollapsed = toggleButton.textContent === '+';
                    if (isCollapsed) {
                        toggleButton.textContent = '-';
                        toggleDirectChildren(row, false); // 展开直接子deck
                        localStorage.setItem(`deckCollapsed_${deckName}`, 'false');
                    } else {
                        toggleButton.textContent = '+';
                        toggleDirectChildren(row, true); // 收起直接子deck
                        localStorage.setItem(`deckCollapsed_${deckName}`, 'true');
                    }
                });

                // 将按钮插入到button之前
                button.parentNode.insertBefore(toggleButton, button);
            } else {
                // 最低层级deck，只设置margin-left
                button.style.marginLeft = marginLeft;
            }
        });

        // 切换直接子deck的显示状态
        function toggleDirectChildren(parentRow, isCollapsed) {
            const children = deckMap.get(parentRow).children;
            children.forEach(child => {
                child.style.display = isCollapsed ? 'none' : '';
            });
        }
    }

    // 监听点击事件，检测导航变化
    function observeNavigation() {
        document.body.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'A' && target.hostname === window.location.hostname) {
                // 如果点击的是当前站点的链接，重新初始化脚本
                reinitializeScript();
            }
        });
    }

    // 重新初始化脚本
    function reinitializeScript() {
        // 重新观察 DOM 变化
        observer.disconnect();
        observer.observe(document.body, {
            childList: true, // 观察子节点的变化
            subtree: true // 观察所有后代节点
        });
    }

    // 监听 DOM 变化
    const observer = new MutationObserver((mutationsList, observer) => {
        // 检查是否有动态内容加载
        const deckRows = document.querySelectorAll('.row.light-bottom-border');
        if (deckRows.length > 0) {
            // 停止观察，避免重复运行
            observer.disconnect();

            // 执行主逻辑
            initializeDeckCollapse();
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true, // 观察子节点的变化
        subtree: true // 观察所有后代节点
    });

    // 监听导航变化
    observeNavigation();
})();