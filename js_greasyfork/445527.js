// ==UserScript==
// @name         抖音_南瓜淘效期导出
// @namespace    manji
// @license      manji
// @version      0.0.1
// @description  效期导出脚本
// @match        http://www.nanguatao.com/#/merchantCenter/inventoryExpiry
// @author       You
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/445527/%E6%8A%96%E9%9F%B3_%E5%8D%97%E7%93%9C%E6%B7%98%E6%95%88%E6%9C%9F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445527/%E6%8A%96%E9%9F%B3_%E5%8D%97%E7%93%9C%E6%B7%98%E6%95%88%E6%9C%9F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 插入导出按钮
    let  titleElement = document.querySelector(".subtitle");
    titleElement.innerHTML += `<button id = 'getOuterExcel'>导出EXCEL</button>`;


    // html table js 导出excel表格
    document.querySelector("#getOuterExcel").addEventListener('click', function() {
        function base64 (content) {
            return window.btoa(unescape(encodeURIComponent(content)));         
        }
        function exportOffice(tableID){
                var type = 'excel';
                var table = document.querySelector(tableID);
                var excelContent = table.innerHTML;

                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += "<table>";
                excelFile += excelContent;
                excelFile += "</table>";
                excelFile += "</body>";
                excelFile += "</html>";
                var base64data = "base64," + base64(excelFile);
                switch(type){
                    case 'excel':
                        window.open('data:application/vnd.ms-'+type+';'+base64data);
                    break;
                    case 'powerpoint':
                        window.open('data:application/vnd.ms-'+type+';'+base64data);
                    break;
                }
        };  

        // 执行导出函数
        exportOffice('.v-table-rightview');
    });



    // Your code here...
})();