// ==UserScript==
// @name         多选链接复制器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  多选页面链接并复制，使用Ctrl+Shift+X激活，Enter复制，Esc退出
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530310/%E5%A4%9A%E9%80%89%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530310/%E5%A4%9A%E9%80%89%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isSelectMode = false;
    let selectedLinks = new Set();
    let originalStyles = new Map();

    // 自定义样式
    GM_addStyle(`
        .link-highlight {
            outline: 2px solid #ff0000 !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
        #status-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-family: Arial;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
        }
    `);

    function createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'status-indicator';
        indicator.style.display = 'none';
        document.body.appendChild(indicator);
    }

    function toggleSelectMode(enable) {
        isSelectMode = enable;
        const indicator = document.getElementById('status-indicator');
        if (enable) {
            indicator.textContent = `选择模式中 (已选 ${selectedLinks.size} 个链接)`;
            indicator.style.display = 'block';
            document.body.style.cursor = 'pointer';
        } else {
            indicator.style.display = 'none';
            document.body.style.cursor = 'default';
            clearSelection();
        }
    }

    function handleLinkClick(e) {
        if (!isSelectMode) return;

        e.preventDefault();
        e.stopPropagation();

        const link = e.target.closest('a');
        if (!link) return;

        if (selectedLinks.has(link)) {
            selectedLinks.delete(link);
            restoreStyle(link);
        } else {
            selectedLinks.add(link);
            saveAndHighlight(link);
        }

        updateIndicator();
    }

    function saveAndHighlight(link) {
        originalStyles.set(link, {
            outline: link.style.outline,
            backgroundColor: link.style.backgroundColor
        });
        link.classList.add('link-highlight');
    }

    function restoreStyle(link) {
        link.classList.remove('link-highlight');
        const original = originalStyles.get(link);
        if (original) {
            link.style.outline = original.outline;
            link.style.backgroundColor = original.backgroundColor;
        }
    }

    function clearSelection() {
        selectedLinks.forEach(link => restoreStyle(link));
        selectedLinks.clear();
        originalStyles.clear();
        updateIndicator();
    }

    function updateIndicator() {
        const indicator = document.getElementById('status-indicator');
        if (indicator) {
            indicator.textContent = `选择模式中 (已选 ${selectedLinks.size} 个链接)`;
        }
    }

    function copyLinks() {
        const links = Array.from(selectedLinks)
        .map(link => link.href)
        .filter(href => href && href !== '#')
        .join('\n');

        if (links) {
            GM_setClipboard(links);
            GM_notification({
                title: '复制成功',
                text: `已复制 ${selectedLinks.size} 个链接`,
                timeout: 2000
            });
        }
        toggleSelectMode(false);
    }

    function handleKeyDown(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            toggleSelectMode(true);
        } else if (isSelectMode) {
            if (e.key === 'Escape') {
                toggleSelectMode(false);
            } else if (e.key === 'Enter') {
                copyLinks();
            }
        }
    }

    function showInstructions() {
        const msg = `📌 使用说明：

🛠 操作快捷键：
▸ 激活选择模式：Ctrl + Shift + X
▸ 确认复制链接：Enter
▸ 退出选择模式：Esc

🖱 选择方式：
▸ 点击链接进行多选
▸ 再次点击已选链接取消选择
▸ 自动过滤无效链接

📋 复制格式：
每行一个完整URL
自动跳过空链接和锚点

🔧 兼容性：
支持绝大多数现代网站
自动适配动态加载内容`;
        alert(msg);
        /*         GM_notification({
            title: '多选链接复制器 使用说明',
            text: msg,
            timeout: 5000,
            silent: true
        }); */
    }

    function initialize() {
        createIndicator();
        document.addEventListener('click', handleLinkClick, true);
        document.addEventListener('keydown', handleKeyDown);

        // 注册用户菜单
        GM_registerMenuCommand('📖 显示使用说明', showInstructions);
        GM_registerMenuCommand('🚀 立即开始选择 (Ctrl+Shift+X)', () => toggleSelectMode(true));
    }

    initialize();
})();