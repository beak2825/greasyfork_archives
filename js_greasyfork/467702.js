// ==UserScript==
// @name         导出百度结果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Export Baidu search results to Excel
// @author       You
// @match        https://www.baidu.com/s?*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467702/%E5%AF%BC%E5%87%BA%E7%99%BE%E5%BA%A6%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/467702/%E5%AF%BC%E5%87%BA%E7%99%BE%E5%BA%A6%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createExportButton() {
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出到 Excel';
        exportButton.style.position = 'fixed';
        exportButton.style.top = '10px';
        exportButton.style.right = '10px';
        exportButton.style.zIndex = '9999';
        exportButton.onclick = exportToExcel;
        document.body.appendChild(exportButton);
    }

    function exportToExcel() {
        const searchResults = document.querySelectorAll('.c-title');
        //let csvContent = '标题,链接,摘要\n';
        let csvContent = '';

        searchResults.forEach(result => {
            // const title = result.querySelector('a').textContent.trim().replace(/,/g, '，');
            const link = result.querySelector('a').href;
            //const summary = result.querySelector('.c-abstract') ? result.querySelector('.c-abstract').textContent.trim().replace(/,/g, '，') : '';

            //csvContent += `"${title}","${link}","${summary}"\n`;
            csvContent += `"${link}"\n`;
        });

        const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvContent);
        const link = document.createElement("a");
        link.href = uri;
        link.download =  "数据表.csv";
        link.click();

        //const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // GM_download(csvBlob, 'baidu_search_results.csv');
    }

    createExportButton();
})();
