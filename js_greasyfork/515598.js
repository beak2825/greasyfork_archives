// ==UserScript==
// @name         复制号码
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动复制手机号并显示姓名
// @author       Your Name
// @match        https://crm.amh-group.com/crm-sales-workbench/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515598/%E5%A4%8D%E5%88%B6%E5%8F%B7%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/515598/%E5%A4%8D%E5%88%B6%E5%8F%B7%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #startButton {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px;
            background-color: green;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        }
        #toggleButton {
            position: absolute;
            top: 10px;
            right: 150px; /* 调整位置以避免重叠 */
            padding: 10px;
            background-color: orange;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        }
        #dataDisplay {
            position: absolute;
            left: 10px;
            top: 10px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
            max-width: 300px;
            max-height: 1600px;
            overflow-y: auto;
            resize: both;
            cursor: default;
            display: none; /* 默认隐藏 */
        }
        #dataTable {
            width: 100%;
            border-collapse: collapse;
        }
        #dataTable th, #dataTable td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
        }
        #dataTable th {
            background-color: #f2f2f2;
            cursor: move;
        }
        .highlight {
            background-color: blue !important;
            color: white !important;
        }
    `);

    // 创建开始按钮
    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = '开始';
    document.body.appendChild(startButton);

    // 创建关闭/开启按钮
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    toggleButton.textContent = '开启'; // 初始为开启
    document.body.appendChild(toggleButton);

    // 创建数据展示区域
    const dataDisplay = document.createElement('div');
    dataDisplay.id = 'dataDisplay';
    dataDisplay.innerHTML = '<table id="dataTable"><tr><th>姓名</th><th>手机号</th></tr></table>';
    document.body.appendChild(dataDisplay);

    // 保存姓名到行映射
    const nameToRow = new Map();
    const uniquePhones = new Set(); // 存储已粘贴的手机号

    // 点击开始按钮的事件
    startButton.onclick = function() {
        const rows = document.querySelectorAll('.el-table__row');
        const dataTable = document.getElementById('dataTable');

        // 清空表格内容
        dataTable.innerHTML = '<tr><th>姓名</th><th>手机号</th></tr>'; // 清空表头
        nameToRow.clear(); // 清空映射
        uniquePhones.clear(); // 清空已粘贴手机号集合

        rows.forEach(row => {
            const name = row.querySelector('.el-table_1_column_4 .cell span')?.textContent.trim();
            const phoneButton = row.querySelector('.el-table_1_column_1 .cell button');

            if (name && !nameToRow.has(name)) { // 确保姓名唯一
                // 在表格中添加姓名和手机号（手机号为空）
                const newRow = dataTable.insertRow();
                const nameCell = newRow.insertCell(0);
                const phoneCell = newRow.insertCell(1);
                nameCell.textContent = name;
                phoneCell.textContent = ''; // 手机号列为空

                // 保存姓名和行数的映射
                nameToRow.set(name, newRow);
            }
        });
    };

    // 监听复制手机号按钮的点击事件
    document.addEventListener('click', async function(event) {
        const target = event.target.closest('button'); // 获取最近的按钮

        if (target && target.textContent.includes('复制手机号')) {
            // 高亮按钮
            target.classList.add('highlight');
            setTimeout(() => {
                target.classList.remove('highlight');
            }, 1500); // 1.5秒后移除高亮

            // 模拟复制手机号操作
            setTimeout(async () => {
                const phone = await navigator.clipboard.readText(); // 获取剪切板内容
                const name = target.closest('.el-table__row').querySelector('.el-table_1_column_4 .cell span')?.textContent.trim();

                // 检查手机号是否是11位数字
                if (/^\d{11}$/.test(phone) && name && nameToRow.has(name)) {
                    if (!uniquePhones.has(phone)) { // 检查手机号是否已经粘贴过
                        const phoneCell = nameToRow.get(name).cells[1]; // 获取手机号单元格
                        phoneCell.textContent = phone; // 填充手机号
                        uniquePhones.add(phone); // 将手机号加入集合
                    }
                }
            }, 100); // 延迟以确保手机号已复制
        }
    });

    // 切换显示面板
    toggleButton.onclick = () => {
        if (dataDisplay.style.display === 'none') {
            dataDisplay.style.display = 'block'; // 显示数据面板
            toggleButton.textContent = '关闭'; // 改为“关闭”
        } else {
            dataDisplay.style.display = 'none'; // 隐藏数据面板
            toggleButton.textContent = '开启'; // 改为“开启”
        }
    };

    // 拖动功能
    let isDragging = false;
    let dragStartX;
    let dragStartY;
    let panelStartX;
    let panelStartY;

    // 允许在姓名单元格位置拖动面板
    dataDisplay.addEventListener('mousedown', function(e) {
        const target = e.target.closest('th');
        if (target && target.textContent === '姓名') {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = dataDisplay.getBoundingClientRect();
            panelStartX = rect.left;
            panelStartY = rect.top;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            dataDisplay.style.left = `${panelStartX + dx}px`;
            dataDisplay.style.top = `${panelStartY + dy}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
})();