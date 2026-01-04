// ==UserScript==
// @name         福建江夏学院教务平台学生评价自动输入
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在福建江夏学院教学管理信息服务平台上自动设置具有特定属性的输入框值，并提供手动按钮和自动消失提示
// @author       YourName
// @match        *://jwxt.fjjxu.edu.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516432/%E7%A6%8F%E5%BB%BA%E6%B1%9F%E5%A4%8F%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E5%B9%B3%E5%8F%B0%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/516432/%E7%A6%8F%E5%BB%BA%E6%B1%9F%E5%A4%8F%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E5%B9%B3%E5%8F%B0%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    GM_addStyle(`
        #autoSetValueButton {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        }
    `);

    // 创建按钮并添加到页面
    var button = document.createElement('button');
    button.id = 'autoSetValueButton';
    button.textContent = '自动输入';
    document.body.appendChild(button);

    // 自动设置输入框值的函数
    function autoSetValue() {
        // 查找所有具有特定属性的输入框
        const inputs = document.querySelectorAll('input[data-zdfz="100"]');

        // 将所有输入框的值设置为100
        inputs.forEach(input => {
            input.value = 100;
        });

        // 显示自动消失的提示
        showAutoDisappearingAlert('请手动点击提交按钮。', 5000);
    }

    // 绑定按钮点击事件
    button.onclick = autoSetValue;

    // 显示自动消失的提示函数
    function showAutoDisappearingAlert(message, duration) {
        var alertBox = document.createElement('div');
        alertBox.id = 'autoDisappearingAlert';
        alertBox.style = `
            position: fixed;
            top: 20px;
            right: 10px;
            padding: 10px 20px;
            background-color: #FF6F75;
            color: white;
            border-radius: 5px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        `;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        // 显示提示
        setTimeout(function() {
            alertBox.style.opacity = 1;
        }, 10);

        // 隐藏提示
        setTimeout(function() {
            alertBox.style.opacity = 0;
            setTimeout(function() {
                alertBox.remove();
            }, 500); // 等待透明度变化完成后移除元素
        }, duration);
    }
})();
