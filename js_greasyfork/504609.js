// ==UserScript==
// @name         Extract Multiple Presentation Info with Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a button to extract ID, date, and name from multiple presentations on webpage
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504609/Extract%20Multiple%20Presentation%20Info%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/504609/Extract%20Multiple%20Presentation%20Info%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractInfo() {
        let presentations = document.querySelectorAll('.presentations-list__card-wrapper');
        let tableData = [];
        presentations.forEach(presentation => {
            let name = presentation.querySelector('.__presentation-name.pag-body-text')?.textContent.trim() || 'Not found';
            
            let dateTimeElement = presentation.querySelector('.__card-time-display.single');
            let date = dateTimeElement ? dateTimeElement.textContent.trim().replace(/\s+/g, ' ') : 'Not found';
            
            let idElement = presentation.querySelector('.__presentation-number span');
            let id = idElement ? idElement.textContent.replace('PRESENTATION ID ', '').trim() : 'Not found';
            tableData.push({ id, date, name });
        });

        // 创建表格HTML
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        tableHTML += '<tr><th>ID</th><th>Date and Time</th><th>Name</th></tr>';
        
        tableData.forEach(row => {
            tableHTML += `<tr><td>${row.id}</td><td>${row.date}</td><td>${row.name}</td></tr>`;
        });
        
        tableHTML += '</table>';

        // 创建一个新窗口来显示表格
        let newWindow = window.open('', 'Presentation Info', 'width=800,height=600,scrollbars=yes');
        newWindow.document.body.innerHTML = tableHTML;
        
        // 在控制台也打印信息
        console.table(tableData);
    }

    // 创建并添加按钮
    function addButton() {
        let button = document.createElement('button');
        button.textContent = 'Extract Presentation Info';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', extractInfo);
        document.body.appendChild(button);
    }

    // 在页面加载完成后添加按钮
    window.addEventListener('load', addButton);
})();