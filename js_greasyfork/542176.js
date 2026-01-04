// ==UserScript==
// @name         千川表格导出脚本
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  通过最精确的CSS父级选择器，定位并导出千川右侧滑出面板中的素材表格。
// @author       观澜微信11208596
// @license MIT
// @match        https://qianchuan.jinritemai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542176/%E5%8D%83%E5%B7%9D%E8%A1%A8%E6%A0%BC%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542176/%E5%8D%83%E5%B7%9D%E8%A1%A8%E6%A0%BC%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('【千川导出脚本 v7.0 终极定位版】已加载。');

    // ===================================================================================
    // 核心函数 - 采用最精准的CSS选择器
    // ===================================================================================
    function downloadPreciseTable() {
        // **核心定位逻辑：直接通过父级+子级的CSS选择器，一步到位找到目标表格**
        // 这句话的意思是：“找到那个在 class='ovui-drawer__wrap' 元素内部的 class='qc-table' 元素”
        const targetTable = document.querySelector('.ovui-drawer__wrap .qc-table');

        // 检查是否找到了这个独一无二的表格
        if (!targetTable) {
            alert('错误：未能定位到右侧面板中的表格！\n\n请确认您已经点击计划，并打开了那个显示素材数据的详情面板。');
            console.log('【千川脚本】未能通过选择器 ".ovui-drawer__wrap .qc-table" 找到目标表格。');
            return;
        }

        console.log('【千川脚本】通过终极定位策略找到目标表格，开始提取数据...');

        const csvData = [];

        // --- 数据提取与生成CSV的逻辑 (这部分已验证是正确的，无需修改) ---
        // 1. 提取表头
        const headerRows = targetTable.querySelectorAll('.ovui-table__head-wrapper thead tr');
        headerRows.forEach(headerRow => {
            const rowData = [];
            headerRow.querySelectorAll('th').forEach((cell, index) => {
                if (index === 0 && cell.querySelector('.chx-col')) return; // 精准跳过复选框列
                rowData.push(`"${cell.innerText.trim().replace(/\s*\n\s*/g, ' ')}"`);
            });
            if (rowData.join('').trim()) csvData.push(rowData.join(','));
        });

        // 2. 提取数据行
        const dataRows = targetTable.querySelectorAll('.ovui-table__body-wrapper tbody tr');
        dataRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;
            const rowData = [];
            try {
                // 按顺序精确提取每一列
                const videoCell = cells[1];
                const videoName = videoCell.querySelector('.oc-typography-value-int')?.innerText || '';
                const videoId = videoCell.querySelector('.info-id')?.innerText || '';
                const videoTag = videoCell.querySelector('.oc-tag-text')?.innerText || '';
                rowData.push(`"${[videoName, videoId, videoTag].filter(Boolean).join(' / ')}"`);

                rowData.push(`"${cells[2].innerText.trim()}"`); // 操作
                rowData.push(`"${cells[3].innerText.trim()}"`); // 素材类型

                const statusText = cells[4].querySelector('.list-style-color-success')?.innerText || '';
                const suggestionText = cells[4].querySelector('.oc-typography-cursor')?.innerText || '';
                rowData.push(`"${[statusText, suggestionText].filter(Boolean).join(' - ')}"`);

                const productName = cells[5].querySelector('.qc-typography')?.innerText || '';
                const productId = cells[5].querySelector('.id_str')?.innerText || '';
                rowData.push(`"${[productName, productId].filter(Boolean).join(' / ')}"`);

                rowData.push(`"${cells[6].innerText.trim()}"`); // 标签

                for (let i = 7; i < cells.length; i++) {
                    rowData.push(`"${cells[i].innerText.trim().replace(/\s*\n\s*/g, ' ')}"`);
                }
                csvData.push(rowData.join(','));
            } catch (e) {
                console.error('【千川脚本】提取某行数据时出错:', e, row);
            }
        });

        // 3. 下载CSV
        if (csvData.length <= 1) {
            alert('未能从表格中提取到任何数据行。请检查表格是否为空。');
            return;
        }
        const csvContent = "\uFEFF" + csvData.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '千川素材数据导出-最终版.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- 按钮注入逻辑 (无需修改) ---
    function addExportButton() {
        const buttonId = 'export-csv-button-gemini-v7';
        if (document.getElementById(buttonId)) return;
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出详情页表格';
        exportButton.id = buttonId;
        exportButton.style.position = 'fixed';
        exportButton.style.top = '150px';
        exportButton.style.right = '30px';
        exportButton.style.zIndex = '999999';
        exportButton.style.padding = '12px 20px';
        exportButton.style.backgroundColor = '#1677ff'; // 换回蓝色
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '8px';
        exportButton.style.cursor = 'pointer';
        exportButton.style.fontSize = '14px';
        exportButton.style.fontWeight = 'bold';
        exportButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        exportButton.addEventListener('click', downloadPreciseTable);
        document.body.appendChild(exportButton);
    }

    setInterval(() => {
        if (document.body) addExportButton();
    }, 1000);

})();