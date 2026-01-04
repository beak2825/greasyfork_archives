// ==UserScript==
// @name         weihl_test
// @namespace    http://tampermonkey.net/
// @version      V0.1
// @description  open one's eyes to see the world.
// @author       weihule
// @match        https://pmos.sd.sgcc.com.cn:18080/trade/main/index.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/512556/weihl_test.user.js
// @updateURL https://update.greasyfork.org/scripts/512556/weihl_test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doMYExport() {
        let iframe = document.getElementsByClassName('container-fluid')[2].querySelector('iframe');
        console.log('进入 iframe 时未报错')

        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        console.log('这里也没报错')

        setTimeout(function() {
            let dialog_header = iframeDocument.getElementsByClassName('modal-dialog modal-lg')[1].getElementsByClassName('modal-content')[0].getElementsByClassName('modal-header')[0];
            dialog_header.getElementsByClassName('close')[0].click();
        }, 3000);

        // 定位数据表单控件
        iframeDocument.getElementsByClassName('dataTables_scroll')[0]
        let table = iframeDocument.querySelector('.dataTables_scrollBody table');
        let headers = [];
        let headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent.trim());
        });
        let table_data = [];
        let rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let rowData = [];
            let cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            table_data.push(rowData);
        });

        console.log('表头:', headers);
        console.log('数据:', table_data);

        table_data = JSON.stringify(table_data)

        console.log('---数据:', table_data);
        const data2 = {"key": "value","key1": "value","key11": "value"};
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://192.168.1.76:8000/",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data:table_data,
            onload: function(response){
                console.log("请求成功");
                console.log(response.responseText);
            },
            onerror: function(response){
            console.log("请求失败");
            }
        });
    }

    function addButton() {
        let iframe = document.getElementsByClassName('container-fluid')[2].querySelector('iframe');
        if (!iframe) return;

        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDocument) return;

        let targetParentDiv = iframeDocument.getElementsByClassName('paper-top');
        let secondChildDiv = iframeDocument.getElementsByClassName('fbutton paperBut');

        if (!targetParentDiv.length ||!secondChildDiv.length) return;

        // 创建新的 div
        let newDiv = iframeDocument.createElement('div');
        newDiv.className = 'customDiv';
        newDiv.style.marginTop = '5px';
        // newDiv.style.width = '90px';

        const button = iframeDocument.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-primary hover';
        button.textContent = '导出-MY';

        // 添加点击事件监听器
        button.addEventListener('click', doMYExport);

        // 将按钮添加到新创建的 div 中
        newDiv.appendChild(button);

        targetParentDiv[0].insertBefore(newDiv, secondChildDiv[0]);
    }

    window.addEventListener('load', function() {
        addButton();

        setInterval(() => {
            let iframe = document.getElementsByClassName('container-fluid')[2].querySelector('iframe');
            if (!iframe) return;
    
            let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) return;
    
            let targetElement = iframeDocument.getElementsByClassName('customDiv');
            if (targetElement.length === 0){
                console.log("需要添加")
                addButton()
            }
            else{
                console.log("无需添加")
            }
        }, 1000);
    
    });
})();