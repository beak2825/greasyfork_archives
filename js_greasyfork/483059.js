// ==UserScript==
// @name         BatchDownload4797199246
// @namespace    http://47.97.199.246/
// @version      1.11
// @description  batch download function for private website
// @author       sheep
// @match        http://47.97.199.246/exam/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483059/BatchDownload4797199246.user.js
// @updateURL https://update.greasyfork.org/scripts/483059/BatchDownload4797199246.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //alert("helloworld");

    function addMyIdea() {

        // 找到表单
        var form = document.getElementById('w0');

        // 遍历表格中的每一行
        const tableRows = document.querySelectorAll('table.table tbody tr');
        tableRows.forEach(row => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            const firstCell = row.insertCell(0); // 在每行的最前面插入一个单元格
            firstCell.appendChild(checkbox);
        });


        // 找到表格头部
        var tableHead = document.querySelector('table.table thead');

        // 找到第一个th元素
        var firstTh = tableHead.querySelector('th');

        // 设置colspan属性为2
        firstTh.colSpan = 2;

        // 创建全选复选框
        var selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'checkbox';

        // 将全选复选框添加到第一个th中
        firstTh.insertBefore(selectAllCheckbox, firstTh.firstChild);

        // 获取表格中所有的复选框
        var checkboxes = document.querySelectorAll('table.table tbody .checkbox');

        // 给全选复选框添加点击事件处理逻辑
        selectAllCheckbox.addEventListener('click', function () {
            // 获取全选复选框的状态
            var isChecked = selectAllCheckbox.checked;

            // 遍历所有的复选框，设置它们的状态与全选复选框一致
            checkboxes.forEach(function (checkbox) {
                checkbox.checked = isChecked;
            });
        });

        // 创建下载按钮
        var downloadButton = document.createElement('button');
        downloadButton.textContent = '下载';
        downloadButton.type = 'button'; // 或者 'submit'，根据你的需求
        downloadButton.className = 'btn btn-primary radius mb-5 mr-5'; // 添加指定的类名，并增加右边的 margin
        form.appendChild(downloadButton);

        downloadButton.addEventListener('click', function () {
            // 获取所有已勾选的复选框
            var checkedCheckboxes = document.querySelectorAll('table.table tbody .checkbox:checked');

            // 遍历已勾选的复选框，获取对应的 data-key
            var selectedDataKeys = Array.from(checkedCheckboxes).map(function (checkbox) {
                var rowData = checkbox.closest('tr');
                return rowData.getAttribute('data-key');
            });

            // 递归下载函数
            function downloadRecursive(index) {
                if (index < selectedDataKeys.length) {
                    var dataKey = selectedDataKeys[index];
                    var downloadLink = 'http://47.97.199.246/exam/down-exam?id=' + dataKey;

                    // 执行下载操作
                    window.location.href = downloadLink;

                    // 递归调用，处理下一个链接
                    setTimeout(function () {
                        downloadRecursive(index + 1);
                    }, 300); // 延迟1秒，可以根据需求调整
                }
            }

            // 开始递归下载
            downloadRecursive(0);
        });

        // Remove data-confirm attribute
        var elements = document.querySelectorAll('[data-confirm]');
        elements.forEach(function (element) {
            element.removeAttribute('data-confirm');
        });

    }

    addMyIdea();

})();
