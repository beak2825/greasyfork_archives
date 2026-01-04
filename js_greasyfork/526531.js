// ==UserScript==
// @name         Jira Bug Copier
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在Jira Bug清单页面一键复制Jira Bug信息
// @author       ChangXiaoqiang
// @match        *://*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526531/Jira%20Bug%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/526531/Jira%20Bug%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .copy-button {
            background: #0052CC;
            color: white;
            border: none;
            border-radius: 2px;
            padding: 0px 4px;
            font-size: 9px;
            cursor: pointer;
            margin-left: 4px;
            height: 16px;
            line-height: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }

        .copy-button:active {
            background: #0747A6;
        }
    `;
    document.head.appendChild(style);

    // 添加辅助函数：从指定行中获取 Bug Link
    function getBugLink(row) {
        // 尝试直接从第一列获取第二个链接（绝大多数情况下 Bug ID 就在这里）
        let link = row.querySelector('td:first-child a:nth-of-type(2)');
        if (link) {
            console.log("【辅助函数】通过 td:first-child a:nth-of-type(2) 找到 Bug Link:", link);
            return link;
        }
        // 如果上面方式未命中，则尝试获取所有 a.issue-link 的第一个（可能是备用方案）
        link = row.querySelector('a.issue-link');
        if (link) {
            console.log("【辅助函数】通过 a.issue-link 找到 Bug Link:", link);
            return link;
        }
        return null;
    }

    // 添加按钮的主函数
    function addCopyButtons() {
        // 获取 bug 列表的所有行（同时考虑页面 DOM 和 issuetable-web-component 内的 Shadow DOM）
        let bugRows = Array.from(document.querySelectorAll('tr[class*="issuerow"]'));
        const issuetable = document.querySelector('issuetable-web-component');
        if (issuetable && issuetable.shadowRoot) {
            bugRows = bugRows.concat(Array.from(issuetable.shadowRoot.querySelectorAll('tr[class*="issuerow"]')));
        }

        if (bugRows.length === 0) {
            // 如果没有找到行,等待100ms后重试
            setTimeout(addCopyButtons, 100);
            return;
        }

        bugRows.forEach(row => {
            // 检查是否已经添加过按钮
            if (row.querySelector('.copy-button')) {
                return;
            }

            // 创建拷贝按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = '拷贝';

            copyButton.addEventListener('click', () => {
                // 直接调用辅助函数从当前行提取 Bug Link
                const bugLink = getBugLink(row);
                if (!bugLink) {
                    console.error("无法找到 Bug Link，请检查 DOM 结构：", row.innerHTML);
                    return;
                }
                // 尝试从元素中获取 Bug ID
                let bugId = bugLink.textContent.trim();
                if (!bugId) {
                    // 如果 textContent 为空，则使用 data-issue-key 或 title 属性作为备用
                    bugId = bugLink.getAttribute("data-issue-key") || bugLink.getAttribute("title") || "";
                    console.log("【辅助函数】使用属性获取 Bug ID:", bugId);
                }
                if (!bugId) {
                    console.error("无法获取到 Bug ID，请检查 Bug Link 元素:", bugLink);
                    return;
                }

                // 获取标题
                const title = row.querySelector('td[class*="summary"] a.issue-link').textContent.trim();

                // 获取严重度
                const severity = row.querySelector('td[class*="customfield_11982"]').textContent.trim();

                // 组合文本 - 严重度用[]标记
                const textToCopy = `[${severity}] ${bugId} ${title}`;

                // 拷贝到剪贴板
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyButton.textContent = '已拷贝!';
                    setTimeout(() => {
                        copyButton.textContent = '拷贝';
                    }, 1000);
                });
            });

            // 将按钮添加到行中
            const firstCell = row.querySelector('td');
            if (firstCell) {
                firstCell.appendChild(copyButton);
            }
        });
    }

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        addCopyButtons();
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始调用
    addCopyButtons();
})();