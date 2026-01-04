// ==UserScript==
// @name         自动填充教务系统评价表格
// @namespace    https://wvpn.ahu.edu.cn/
// @version      0.2
// @description  自动填充表格内容
// @author       ayajirinko
// @match        https://wvpn.ahu.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498403/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BB%B7%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/498403/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BB%B7%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并添加按钮的函数
    function createButton() {
        var button = document.createElement('button');
        button.innerHTML = '自动填充表格';
        button.style.marginLeft = '10px';

        // 定义点击按钮时执行的操作
        button.onclick = fillTable;

        // 将按钮添加到表格标题行
        var headerRow = document.querySelector('#DataGrid1 .datelisthead td:last-child');
        if (headerRow) {
            headerRow.appendChild(button);
        }
    }

    // 填充表格的函数
    function fillTable() {
        document.querySelectorAll('#DataGrid1 select').forEach((select, index) => {
            if (index === 0) {
                select.selectedIndex = 1;
            } else {
                select.selectedIndex = 2;
            }
        });
    }
    
     createButton();
})();
