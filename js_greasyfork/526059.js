// ==UserScript==
// @name         简道云表格数据提取
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在简道云列表页面显示并复制表格行的data-row-id和data-index值
// @author       You
// @match        *://*.jiandaoyun.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526059/%E7%AE%80%E9%81%93%E4%BA%91%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526059/%E7%AE%80%E9%81%93%E4%BA%91%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义右键菜单样式
    GM_addStyle(`
        .custom-context-menu {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            z-index: 99999;
            min-width: 200px;
            max-height: 600px;
            overflow-y: auto;
        }
        .menu-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }
        .menu-item:hover {
            background-color: #f5f5f5;
        }
        .copy-hint {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            display: none;
            z-index: 100000;
        }
    `);

    // 创建提示元素
    const hint = document.createElement('div');
    hint.className = 'copy-hint';
    document.body.appendChild(hint);

    // 获取列标题
    function getColumnTitles() {
        return Array.from(document.querySelectorAll('tr.table-header-row th'))
            .map(th => {
                const titleElement = th.querySelector('.title-text');
                return titleElement ? titleElement.textContent.trim() : '';
            })
            .filter(title => title);
    }

    // 显示提示信息
    function showHint(message) {
        hint.textContent = message;
        hint.style.display = 'block';
        setTimeout(() => {
            hint.style.display = 'none';
        }, 2000);
    }

    // 创建右键菜单
    function createContextMenu(data, columns) {
        const oldMenu = document.querySelector('.custom-context-menu');
        if (oldMenu) oldMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'custom-context-menu';

        const rowIdItem = document.createElement('div');
        rowIdItem.className = 'menu-item';
        rowIdItem.innerHTML = `<strong>data-row-id:</strong> ${data.rowId}`;
        rowIdItem.onclick = () => {
            GM_setClipboard(data.rowId);
            showHint('已复制 data-row-id');
        };
        menu.appendChild(rowIdItem);

        data.indices.forEach((value, index) => {
            if (!value) return;

            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            const columnName = columns[index] || `列${index + 1}`;
            menuItem.innerHTML = `<strong>${columnName}:</strong> ${value}`;

            menuItem.onclick = () => {
                GM_setClipboard(value);
                showHint(`已复制 ${columnName}`);
            };

            menu.appendChild(menuItem);
        });

        return menu;
    }

    // 右键点击处理
    document.addEventListener('contextmenu', function(event) {
        const targetRow = event.target.closest('tr.table-row');
        if (!targetRow) return;

        event.preventDefault();

        const columns = getColumnTitles();
        const data = {
            rowId: targetRow.dataset.rowId,
            indices: Array.from(targetRow.querySelectorAll('td:not(:first-child)'))
                      .map(td => td.dataset.index || '')
        };

        const menu = createContextMenu(data, columns);
        document.body.appendChild(menu);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let left = event.pageX;
        let top = event.pageY;

        if (left + menu.offsetWidth > viewportWidth) {
            left = viewportWidth - menu.offsetWidth;
        }
        if (top + menu.offsetHeight > viewportHeight) {
            top = viewportHeight - menu.offsetHeight;
        }

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    });

    // 点击其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-context-menu')) {
            const menu = document.querySelector('.custom-context-menu');
            if (menu) menu.remove();
        }
    });

})();
