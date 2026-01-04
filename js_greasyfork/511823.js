// ==UserScript==
// @name         D-2SOL Table Sorter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  给D-2SOL网站的表格添加排序功能，带箭头指示器和双向排序
// @match        https://d2sol.999394.xyz/D-2SOL-100SOL*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511823/D-2SOL%20Table%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/511823/D-2SOL%20Table%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .sort-arrow::after {
            content: ' \\25B2';  /* 上箭头 */
            color: #999;
        }
        .sort-arrow.desc::after {
            content: ' \\25BC';  /* 下箭头 */
        }
    `;
    document.head.appendChild(style);

    // 等待页面加载完成
    window.addEventListener('load', function() {
        const table = document.querySelector('table');
        const headers = table.querySelectorAll('th');
        const tbody = table.querySelector('tbody');

        // 给可排序的列添加点击事件
        const sortableColumns = [3, 4, 5, 6, 7]; // SOL余额, 持币价值, 总价值, 胜率, 盈亏的索引
        sortableColumns.forEach(index => {
            headers[index].style.cursor = 'pointer';
            headers[index].classList.add('sort-arrow');
            headers[index].addEventListener('click', () => sortTable(index));
        });

        function sortTable(columnIndex) {
            const isNumeric = columnIndex !== 4; // 除了"持币价值"列，其他都按数字排序
            const isDescending = headers[columnIndex].classList.contains('desc');

            // 重置所有箭头
            headers.forEach(header => header.classList.remove('desc'));

            // 设置当前列的箭头
            if (!isDescending) {
                headers[columnIndex].classList.add('desc');
            }

            const rows = Array.from(tbody.querySelectorAll('tr'));

            rows.sort((a, b) => {
                let aValue = a.cells[columnIndex].textContent.trim();
                let bValue = b.cells[columnIndex].textContent.trim();

                if (isNumeric) {
                    aValue = parseFloat(aValue.replace(/[^\d.-]/g, '')) || 0;
                    bValue = parseFloat(bValue.replace(/[^\d.-]/g, '')) || 0;
                    return isDescending ? aValue - bValue : bValue - aValue;
                } else {
                    return isDescending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
            });

            // 重新插入排序后的行
            rows.forEach(row => tbody.appendChild(row));
        }
    });
})();