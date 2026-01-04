// ==UserScript==
// @name         武汉理工大学获取成绩表格
// @namespace    http://tampermonkey.net/
// @version      2024-09-08
// @license      MIT
// @description  提取教务处中的成绩为表格并进行下载，适用地址：http://202.114.50.130/Score/login.do*
// @author      LiuShen
// @match        http://202.114.50.130/Score/login.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50.130
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507404/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%8E%B7%E5%8F%96%E6%88%90%E7%BB%A9%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/507404/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%8E%B7%E5%8F%96%E6%88%90%E7%BB%A9%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加导出按钮
    function addExportButton() {
        const btn = document.createElement('button');
        btn.textContent = '导出成绩表格';
        btn.style.position = 'fixed';
        btn.style.bottom = '86px';
        btn.style.right = '30px';
        btn.style.zIndex = '1000';
        btn.style.padding = '10px';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', () => {
            const table = document.querySelector('.grid table');
            if (table) {
                const csv = tableToCSV(table);
                downloadCSV(csv);
            } else {
                alert('找不到表格');
            }
        });

        document.body.appendChild(btn);
    }

    // 将表格转换为CSV格式
    function tableToCSV(table) {
        let tbody = document.querySelector('.grid');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        const head = rows[0];
        let cellhead = head.querySelectorAll('th div');
        let headData = Array.from(cellhead).map(cellhead => cellhead.textContent.trim());
        let data = [];
        data.push(headData);
        data.join('\n');
        rows.forEach((row, index) => {
            if (index === 0) return;
            let cells = row.querySelectorAll('td div');
            let rowData = Array.from(cells).map(cell => cell.textContent.trim());
            data.push(rowData);
            data.join('\n');
        });
        return data.join('\n');
    }

    // 下载CSV文件
    function downloadCSV(csv) {
        const csvFile = new Blob([csv], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.download = '成绩表格.csv';
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // 运行函数
    addExportButton();
})();
