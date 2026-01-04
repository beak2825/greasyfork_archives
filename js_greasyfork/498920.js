// ==UserScript==
// @name         hello world
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  new ss
// @author       CZY©大帅哥
// @match         *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @license           Apache-2.0
// @require     https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498920/hello%20world.user.js
// @updateURL https://update.greasyfork.org/scripts/498920/hello%20world.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("创建按钮前");

    console.log('1111');
    //储存上传文件的账号和密码
    var user_pwd_list = []
    // 创建一个新的按钮元素
    var button = document.createElement('button');
    //下载按钮
    var button_xz = document.createElement('button');
    //下一个,点击之后自动输入账户密码
    var button_next = document.createElement('button');
    //获取body
    let my_body = document.querySelector('body');
    //获取登录按钮
    var submit_btn = document.querySelector('.ant-btn ant-btn-primary');
    button.innerHTML = '上传EXCEL文件';
    button.style.position = 'fixed';
    button.style.display = 'block'
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = 9999;
    button.style.backgroundColor = '#007bff'; // 添加背景色以便观察
    button.style.color = '#ffffff'; // 文字颜色
    button.style.padding = '10px 20px'; // 内边距
    button.style.border = 'none'; // 移除边框
    button.style.cursor = 'pointer'; // 鼠标悬停时变为手型
    //下载按钮
    button_xz.innerHTML = '下载EXCEL文件';
    button_xz.style.position = 'fixed';
    button_xz.style.display = 'block'
    button_xz.style.top = '60px';
    button_xz.style.left = '10px';
    button_xz.style.zIndex = 9999;
    button_xz.style.backgroundColor = '#007bff'; // 添加背景色以便观察
    button_xz.style.color = '#ffffff'; // 文字颜色
    button_xz.style.padding = '10px 20px'; // 内边距
    button_xz.style.border = 'none'; // 移除边框
    button_xz.style.cursor = 'pointer'; // 鼠标悬停时变为手型
    button_xz.onclick = function () {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet([["账号", "密码"], ["张三", "111"]]);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Excel模板.xlsx');
    };
    //
    button_next.innerHTML = '下一个';
    button_next.style.position = 'fixed';
    button_next.style.display = 'block'
    button_next.style.top = '60px';
    button_next.style.left = '220px';
    button_next.style.zIndex = 9999;
    button_next.style.backgroundColor = '#007bff'; // 添加背景色以便观察
    button_next.style.color = '#ffffff'; // 文字颜色
    button_next.style.padding = '10px 20px'; // 内边距
    button_next.style.border = 'none'; // 移除边框
    button_next.style.cursor = 'pointer'; // 鼠标悬停时变为手型
    //
    // 为按钮添加点击事件监听器
    button.addEventListener('click', function () {
        console.log('按钮被点击了！');
        // 在这里添加你想在点击按钮时执行的其他操作

        // 将按钮添加到页面的body中
        console.log("创建按钮后");
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xls,.xlsx';
        input.onchange = function (e) {
            //console.log(e);
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                user_pwd_list = sheetData;
                // 数据现在是数组形式，你可以进一步处理它，比如转换为特定的字典格式
                //console.log(sheetData);
                //console.log(...sheetData);
                for (let a of sheetData) {
                    //console.log(a)
                }
                console.log(user_pwd_list)
            };
            reader.readAsBinaryString(file);
        };
        input.click();

    });
    console.log(user_pwd_list)
    //检查按钮是否被点击
    let timer_submit;//提交
    let timer_accut;//账号
    let timer_pwd;//密码
    var elementToClick;
    console.log(elementToClick);
    //定义一个函数去查找是否有按钮可以去登录
    function checkbtn_sub() {
        elementToClick = document.querySelector('.ant-btn-primary');
        console.log("1111111111111111111111111111111");
        console.log(elementToClick);
        if (elementToClick) {
            // 如果找到了元素，则模拟点击
            elementToClick.click();
            clearInterval(timer_submit);
            return
        }
    }

    timer_submit = setInterval(checkbtn_sub, 1000);
    // 等待文档加载完成
    window.addEventListener('DOMContentLoaded', function () {

    });
    //document.body.appendChild(button);
    my_body.insertBefore(button, my_body.children[0]);
    my_body.insertBefore(button_xz, my_body.children[0]);
    my_body.insertBefore(button_next, my_body.children[0]);
    body.uns


})();