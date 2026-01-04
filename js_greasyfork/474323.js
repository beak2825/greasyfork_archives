// ==UserScript==
// @name         大连理工大学-成绩导出至csv
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  https://github.com/JavaZeroo
// @author       JavaZero
// @match        http://jxgl.dlut.edu.cn/student/for-std/grade/sheet/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474323/%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6-%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA%E8%87%B3csv.user.js
// @updateURL https://update.greasyfork.org/scripts/474323/%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6-%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA%E8%87%B3csv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        const btn = document.createElement("button");
        btn.innerHTML = "导出当前页面所有成绩";
        btn.onclick = exportAllGradesToMergedCSV;

        const targetDiv = document.querySelector('.selectize-input.items.full.has-options.has-items');
        if (targetDiv) {
            targetDiv.parentNode.insertBefore(btn, targetDiv.nextSibling);
        } else {
            document.body.appendChild(btn);
        }
    }

    function tableToCSV(table, tableName, includeHeader) {
        let csv = [];
        for (let i = 0, row; row = table.rows[i]; i++) {
            let rowData = [];

            // Add a new column for the table name (semester name)
            if (i === 0) {
                rowData.push(JSON.stringify("学期"));  // Add header for the new column
            } else {
                rowData.push(JSON.stringify(tableName));
            }

            for (let j = 0, col; col = row.cells[j]; j++) {
                const courseNameDiv = col.querySelector('.course-name');
                const cellText = courseNameDiv ? courseNameDiv.innerText : col.innerText;
                rowData.push(JSON.stringify(cellText.replace(/\n/g, ' ')));
            }

            // Skip the header row for subsequent tables
            if (i === 0 && !includeHeader) {
                continue;
            }

            csv.push(rowData.join(','));
        }
        return csv.join('\n');
    }

    function exportAllGradesToMergedCSV() {
        const tables = document.querySelectorAll("table");
        if (tables.length === 0) {
            alert("没有找到表格！");
            return;
        }

        let all_csv = [];
        let includeHeader = true;  // Include header only for the first table

        tables.forEach((table, index) => {
            const rows = table.querySelectorAll('tr');
            if (rows.length <= 1) {
                return;
            }

            const semesterNameTag = table.closest('div').querySelector('.semesterName');
            const tableName = semesterNameTag ? semesterNameTag.innerText : "表格 " + (index + 1);

            const csv = tableToCSV(table, tableName, includeHeader);
            all_csv.push(csv);

            includeHeader = false;  // Exclude header for subsequent tables
        });

        const merged_csv = all_csv.join('\n');
        const blob = new Blob(["\ufeff" + merged_csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "所有成绩.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    setTimeout(addButton, 1000);
})();
