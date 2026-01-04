// ==UserScript==
// @name         烟草网络学院多开自动点击确认
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  实现网络学院多开，同时播放
// @author       HX
// @match        https://mooc.ctt.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506714/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%A4%9A%E5%BC%80%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/506714/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%A4%9A%E5%BC%80%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

// 定义提示框样式
    const style = `
        #toast {
            visibility: hidden;
            min-width: 250px;
            margin-left: -125px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 10px;
            padding: 16px;
            position: fixed;
            z-index: 1000;
            left: 50%; /* 横向居中 */
            top: 20px; /* 距离顶部20px */
            font-size: 17px;
            white-space: nowrap;
            font-weight: bold; /* 字体加粗 */
        }
    `;

    // 添加样式到文档头
    const head = document.head || document.getElementsByTagName('head')[0];
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(style));
    head.appendChild(styleElement);

    // 定义提示框内容
    const toastContent = "最多同时打开5个窗口！";

    // 创建提示框元素
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = toastContent;
    toast.style.visibility = 'hidden'; // 默认不显示
    document.body.appendChild(toast);

    // 显示提示框的函数
    function showToast() {
        toast.style.visibility = 'visible'; // 显示提示框
        setTimeout(function() {
            toast.style.visibility = 'hidden'; // 2秒后隐藏提示框
        }, 4000); // 设置2秒后执行
    }

    // 页面加载完成后自动显示提示框
    window.onload = function() {
        showToast();
    };

(function() {
    'use strict';
    // 延时1.8秒后定义app变量
    setTimeout(function() {
        //window.app = {}; // 定义app变量并初始化为空对象
        app = {};
    }, 1800);

    // 循环点击ID为'D398btn-ok'的按钮
    setInterval(function() {
        var button1 = document.getElementById('D398btn-ok');
        var button2 = document.getElementById('D399btn-ok');
        if (button1) {
            button1.click();
            console.log('Button1 clicked.');
        }else if(button2){
            button2.click();
            console.log('Button2 clicked.');
        }
    }, 10000); // 每隔1000毫秒（1秒）执行一次
})();