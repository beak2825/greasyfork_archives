// ==UserScript==
// @name         phpMyAdmin数据一键复制
// @namespace    https://github.com/DravenTJU/Click-to-Copy-phpMyAdmin
// @source       git@github.com:DravenTJU/Click-to-Copy-phpMyAdmin.git
// @version      1.1
// @description  为phpMyAdmin数据表添加一键复制功能
// @author       Draven
// @match        */phpmyadmin/*
// @match        */pma/*
// @grant        GM_addStyle
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/523843/phpMyAdmin%E6%95%B0%E6%8D%AE%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523843/phpMyAdmin%E6%95%B0%E6%8D%AE%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .copy-btn {
            position: absolute;
            display: none;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
            opacity: 0.9;
        }
        .copy-btn:hover {
            opacity: 1;
        }
        .copy-success {
            background: #2196F3 !important;
        }
        td[data-decimals] {
            position: relative;
        }
    `);

    // 创建复制按钮
    function createCopyButton() {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = '复制';
        return btn;
    }

    // 复制文本到剪贴板
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (err) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    }

    // 显示复制成功动画
    function showCopySuccess(btn) {
        btn.classList.add('copy-success');
        btn.textContent = '已复制';
        setTimeout(() => {
            btn.classList.remove('copy-success');
            btn.textContent = '复制';
        }, 1000);
    }

    // 主函数
    function init() {
        // 移除旧的复制按钮（如果存在）
        const oldBtn = document.querySelector('.copy-btn');
        if (oldBtn) {
            oldBtn.remove();
        }

        const copyBtn = createCopyButton();
        document.body.appendChild(copyBtn);

        // 监听表格单元格的鼠标事件
        document.addEventListener('mouseover', function(e) {
            const td = e.target.closest('td[data-decimals]'); // 只匹配带有data-decimals属性的单元格
            if (!td || !td.textContent.trim()) return;

            const rect = td.getBoundingClientRect();
            copyBtn.style.display = 'block';
            copyBtn.style.top = `${window.scrollY + rect.bottom - 10}px`;
            copyBtn.style.left = `${window.scrollX + rect.left + 5}px`;

            copyBtn.onclick = async function(e) {
                e.stopPropagation();
                const success = await copyToClipboard(td.textContent.trim());
                if (success) {
                    showCopySuccess(copyBtn);
                }
            };
        });

        // 鼠标离开时隐藏按钮并重置样式
        document.addEventListener('mouseout', function(e) {
            if (!e.target.closest('td[data-decimals]')) {
                copyBtn.style.display = 'none';
                copyBtn.classList.remove('copy-success'); // 移除成功状态样式
                copyBtn.textContent = '复制'; // 重置按钮文本
            }
        });
    }

    // 创建 MutationObserver 监听数据表变化
    function observeTableChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // 检查是否有新的 td[data-decimals] 元素添加
                const hasNewDataCell = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 && (
                        node.matches('td[data-decimals]') ||
                        node.querySelector('td[data-decimals]')
                    );
                });

                if (hasNewDataCell) {
                    init();
                    break;
                }
            }
        });

        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            observeTableChanges();
        });
    } else {
        init();
        observeTableChanges();
    }
})();