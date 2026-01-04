// ==UserScript==
// @name         CCMTV_FastExamineeSelecor
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  CCMTV_FastExamineeSelecor 1.0
// @author       青年桥东
// @match        https://yunjxs.ccmtv.cn/admin.php/union/common/Select_user_sddxqlyy/index/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488349/CCMTV_FastExamineeSelecor.user.js
// @updateURL https://update.greasyfork.org/scripts/488349/CCMTV_FastExamineeSelecor.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // 根据selector获取姓名输入框（#title）
    var nameInput = document.querySelector('#title');
    // 动态监测姓名输入框的变化，当姓名输入框内容发生变化时，执行回调函数
    nameInput.addEventListener('input', function() {
        // 如果姓名输入框内的内容达到7个字符，点击按钮
        if (nameInput.value.length === 7) {
            // 根据selector获取查询按钮（.btn-primary）
            var searchButton = document.querySelector('#search');
            // 点击查询按钮
            searchButton.click();
            // 根据selector获取表格
            var table = document.querySelector('#transferTable > div > div:nth-child(1) > div > div.layui-table-box > div.layui-table-body.layui-table-main > table > tbody');
            // 延迟1秒钟
            setTimeout(function() {
                // 如果表格只有一行
                if (table.children.length === 1) {
                    // 根据selector获取第一行的复选框
                    var firstCheckbox = document.querySelector('#transferTable > div > div:nth-child(1) > div > div.layui-table-box > div.layui-table-fixed.layui-table-fixed-l > div.layui-table-body > table > tbody > tr > td > div > div');
                    // 点击第一行的按钮
                    firstCheckbox.click();
                    // 根据selector获取添加按钮
                    var addButton = document.querySelector('#transferTable > div > div:nth-child(2) > div > button.left_table_1.layui-btn.btn.left > i');
                    // 点击添加按钮
                    addButton.click();
                    // 清空姓名输入框
                    nameInput.value = '';
                }
            }, 1000);
        }
    });
})();