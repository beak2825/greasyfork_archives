// ==UserScript==
// @name         Markdown Code Block Line Checker 过滤空行
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add checkboxes to each line of a markdown code block and count checked lines, excluding empty lines.
// @author       You
// @match        http://172.30.14.69/*
// @grant        none
// @code         javascript
// @downloadURL https://update.greasyfork.org/scripts/500928/Markdown%20Code%20Block%20Line%20Checker%20%E8%BF%87%E6%BB%A4%E7%A9%BA%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/500928/Markdown%20Code%20Block%20Line%20Checker%20%E8%BF%87%E6%BB%A4%E7%A9%BA%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCheckboxes(codeBlock) {
        const lines = codeBlock.innerHTML.split('\n'); // 过滤掉空行

        // 创建一个容器来包裹代码块
        const container = document.createElement('div');
        container.className = 'code-container';

        // 仅为非空行创建复选框和代码行
        lines.forEach((line, lineIndex) => {
            const lineContainer = document.createElement('div');
            lineContainer.className = 'line-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'line-checkbox';
            checkbox.dataset.line = lineIndex;

            const lineText = document.createElement('span');
            lineText.className = 'line-text';
            lineText.innerHTML = line;
            if (line.trim() === ''){
              checkbox.disabled = true;
            }
            lineContainer.appendChild(checkbox);
            lineContainer.appendChild(lineText);
            container.appendChild(lineContainer);
        });

        // 替换原代码块
        codeBlock.innerHTML = '';
        codeBlock.appendChild(container);

        // 创建统计区域
        const stats = document.createElement('div');
        stats.className = 'code-stats';
        const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
        stats.innerHTML = `总行数: ${nonEmptyLines}, 已勾选: 0, 比例: 0% , 判断结果: false`;

        // 插入统计区域
        container.insertAdjacentElement('beforebegin', stats);

        // 复选框事件监听
        container.addEventListener('change', () => {
            const checkedCount = container.querySelectorAll('.line-checkbox:checked').length;
            const result = (checkedCount / nonEmptyLines * 100).toFixed(2);
            stats.innerHTML = `总行数: ${nonEmptyLines}, 已勾选: ${checkedCount}, 比例: ${result}% , 判断结果: ${result>=50}`;
        });
    }

    function init() {
        const codeBlocks = document.querySelectorAll('.vuepress-markdown-body pre code');
        codeBlocks.forEach(codeBlock => addCheckboxes(codeBlock));
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', () => {
        init();

        // 观察 DOM 变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const codeBlocks = node.querySelectorAll('.vuepress-markdown-body pre code');
                            codeBlocks.forEach(codeBlock => addCheckboxes(codeBlock));
                        }
                    });
                }
            });
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    });
})();