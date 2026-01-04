// ==UserScript==  
// @name         抓取网页数据并导出为CSV  
// @namespace    http://tampermonkey.net/  
// @version      0.1  
// @description  抓取指定网页上的数据并导出为CSV文件  
// @author       广州三组向也  
// @match        https://admin.netshort.com/put/statistics/material
// @grant        none  
// @downloadURL https://update.greasyfork.org/scripts/515181/%E6%8A%93%E5%8F%96%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E5%B9%B6%E5%AF%BC%E5%87%BA%E4%B8%BACSV.user.js
// @updateURL https://update.greasyfork.org/scripts/515181/%E6%8A%93%E5%8F%96%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E5%B9%B6%E5%AF%BC%E5%87%BA%E4%B8%BACSV.meta.js
// ==/UserScript==    
  
(function() {  
    'use strict';  
  
    // 抓取数据的函数（需要根据网页结构进行调整）  
    function fetchData() {  
        var rows = []; // 存储数据的数组  
  
        // 假设数据在表格中，我们可以通过遍历表格行来获取数据  
        var table = document.querySelector('table.your-table-class'); // 替换为实际的表格选择器  
        if (table) {  
            var headers = []; // 存储表头的数组  
            var headerRow = table.rows[0]; // 假设第一行是表头  
            if (headerRow) {  
                for (var i = 0; i < headerRow.cells.length; i++) {  
                    headers.push(headerRow.cells[i].textContent.trim()); // 获取表头文本并添加到数组中  
                }  
            }  
  
            // 遍历表格的其余行以获取数据  
            for (var j = 1; j < table.rows.length; j++) {  
                var row = table.rows[j];  
                var dataRow = []; // 存储当前行数据的数组  
                for (var k = 0; k < row.cells.length; k++) {  
                    dataRow.push(row.cells[k].textContent.trim()); // 获取单元格文本并添加到数组中  
                }  
                rows.push(dataRow); // 将当前行数据添加到数据数组中  
            }  
        }  
  
        return { headers: headers, rows: rows }; // 返回包含表头和数据的对象  
    }  
  
    // 导出数据为CSV格式的函数  
    function exportToCSV(data) {  
        var csvContent = "data:text/csv;charset=utf-8,"  
                + data.headers.join(",") + "\n"; // 添加表头  
  
        // 遍历数据行并添加到CSV内容中  
        data.rows.forEach(function(row) {  
            csvContent += row.join(",") + "\n";  
        });  
  
        var encodedUri = encodeURI(csvContent);  
        var link = document.createElement("a");  
        link.setAttribute("href", encodedUri);  
        link.setAttribute("download", "data.csv"); // 设置下载的文件名  
        document.body.appendChild(link);  
        link.click(); // 触发点击事件以下载文件  
        document.body.removeChild(link); // 移除链接元素  
    }  
  
    // 抓取数据并导出为CSV  
    var data = fetchData();  
    exportToCSV(data);  
})();