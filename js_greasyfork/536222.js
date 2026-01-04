// ==UserScript==
// @name         PT批量打开种子详情链接（全选版）
// @namespace    http://tampermonkey.net/
// @author       shun
// @version      1.2
// @description  在PT站点表格行后添加复选框，且在表头添加全选功能，支持多选后在新窗口批量打开种子详情链接
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536222/PT%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%A7%8D%E5%AD%90%E8%AF%A6%E6%83%85%E9%93%BE%E6%8E%A5%EF%BC%88%E5%85%A8%E9%80%89%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536222/PT%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%A7%8D%E5%AD%90%E8%AF%A6%E6%83%85%E9%93%BE%E6%8E%A5%EF%BC%88%E5%85%A8%E9%80%89%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加选择列样式
    const style = document.createElement('style');
    style.textContent = `
        table.torrents tr td:last-child {
            width: 60px;
            text-align: center;
            vertical-align: middle;
        }
        #bulkOpenBtn {
            margin: 10px;
            padding: 8px 16px;
            cursor: pointer;
        }
        .select-all {
            cursor: pointer;
            position: relative;
            top: 2px;
        }
    `;
    document.head.appendChild(style);

    // 等待表格加载
    const init = () => {
        const table = document.querySelector('table.torrents');
        if (!table) return;

        // 添加表头全选列
        const headerRow = table.querySelector('tr:first-child');
        if (!headerRow.querySelector('td:last-child').textContent.includes('全选')) {
            const th = document.createElement('td');
            th.className = 'colhead';
            th.innerHTML = `<input type="checkbox" class="select-all"> 全选`;
            headerRow.appendChild(th);
        }

        // 为数据行添加复选框
        const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));
        rows.slice(0, -1).forEach(row => {
            if (!row.querySelector('input[type="checkbox"]:not(.select-all)')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                const td = document.createElement('td');
                td.className = 'rowfollow';
                td.appendChild(checkbox);
                row.appendChild(td);
            }
        });

        // 添加批量操作按钮
        if (!document.getElementById('bulkOpenBtn')) {
            const tbody = table.querySelector('tbody');
            const buttonRow = document.createElement('tr');
            const buttonCell = document.createElement('td');
            buttonCell.colSpan = headerRow.cells.length;
            buttonCell.style.textAlign = 'center';

            const button = document.createElement('button');
            button.id = 'bulkOpenBtn';
            button.textContent = '批量打开选中链接';
            button.onclick = handleBulkOpen;

            buttonCell.appendChild(button);
            buttonRow.appendChild(buttonCell);
            tbody.appendChild(buttonRow);
        }

        // 绑定全选事件
        const selectAll = document.querySelector('.select-all');
        if (selectAll) {
            selectAll.onclick = function() {
                const checkboxes = document.querySelectorAll('table.torrents tr:not(:first-child) input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            };
        }
    };

    // 处理批量打开
    const handleBulkOpen = () => {
        const checkboxes = document.querySelectorAll('table.torrents input[type="checkbox"]:checked:not(.select-all)');
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const link = row.querySelector('a[href^="details.php?id="]');
            if (link) window.open(link.href, '_blank');
        });
    };

    // 初始化执行
    setTimeout(init, 500);
    // 监听DOM变化
    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });
})();