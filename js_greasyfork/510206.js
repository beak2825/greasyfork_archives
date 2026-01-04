// ==UserScript==
// @name         temu订单号跳转链接
// @namespace    http://tampermonkey.net/
// @version      2024-09-27
// @description  批量复制违规信息里的订单号进行查询，也可以批量将订单号转为超链接
// @author       You
// @match        https://agentseller.temu.com/mmsos/mall-appeal.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510206/temu%E8%AE%A2%E5%8D%95%E5%8F%B7%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/510206/temu%E8%AE%A2%E5%8D%95%E5%8F%B7%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

const nav = "orderHref";


// 使用正则表达式查找符合格式的字符串
const regex = /PO-\d{3}-\d+/g;
// 处理匹配的函数
function processMatches() {
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
        const textContent = element.textContent;
        const matches = textContent.match(regex);

        if (matches && element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            matches.forEach(orderNumber => {
                const link = document.createElement('a');
                link.href = `https://agentseller.temu.com/mmsos/orders.html?fulfillmentMode=0&pageNumber=1&pageSize=20&queryType=2&sortType=2&parentOrderSnList=${orderNumber}&timeZone=UTC%2B8&parentAfterSalesTag=0&orderStatusFilterExtension=0&sellerNoteLabelList=&packageAbnormalTypeList=`;
                link.textContent = orderNumber;
                link.target = '_blank'; // 在新窗口打开链接
                console.log(link);


                // 替换原元素的内容
                element.innerHTML = '';
                element.appendChild(link);
            });
        }
    });
}

function copyMatches() {
    const elements = document.querySelectorAll('*');
    const orderNumbers = [];
    elements.forEach(element => {
        const textContent = element.textContent;
        const matches = textContent.match(regex);

        if (matches && element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            orderNumbers.push(matches[0]);
        }
    });
    console.log(orderNumbers);
    GM_setClipboard(orderNumbers.join(','));
}

(function() {
    'use strict';

    // 创建一个新的style元素
    const styleElement = document.createElement('style');

    // 定义按钮样式
    styleElement.textContent = `
        .custom-button-container-${nav} {
            position: absolute;
            top: 10px;
            left: 50%;
            /*background-color: #f1f3ff;*/
            z-index: 9999;
            padding: 10px;
        }
        .custom-button-${nav} {
            background-color: #fb7701;
            border-radius: 3px;
            border: none;
            color: white;
            padding: 10px 20px;
            margin-right: 8px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            cursor: pointer;
        }
        .floating-div-${nav} {
            visibility: hidden;
            position: absolute;
            top: 80px;
            right: 24px;
            width: 400px;
            background-color: #fb7701d9;
            border: none;
            border-radius: 5px;
            color: white;
            padding: 10px 20px;
            z-index: 10 !important;
        }
        .custom-row-${nav} {
            padding: 10px 0;
        }
        .visible-${nav} {
            visibility: visible;
        }
    `;

    // 将style元素添加到页面头部
    document.head.appendChild(styleElement);


    // 所有扩展按钮的集合
    var buttonContainer = document.createElement("div");
    buttonContainer.className = `custom-button-container-${nav}`;
    document.body.appendChild(buttonContainer);



    //===============↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓订单超链接↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓============================


    // 创建按钮元素
    var buttonOrderHref = document.createElement("button");

    // 设置按钮文本
    buttonOrderHref.innerHTML = "订单超链接";

    // 添加点击事件处理程序
    buttonOrderHref.addEventListener("click", function() {
        processMatches();
    });
    // 添加样式，使按钮浮动在页面上方
    buttonOrderHref.className = `custom-button-${nav}`; // 应用定义的样式类

    // 将按钮添加到页面的某个元素中（这里添加到 buttonContainer 元素中）
    buttonContainer.appendChild(buttonOrderHref);
    //===============↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑订单超链接↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑============================

    //===============↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓复制所有订单↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓============================


    // 创建按钮元素
    var buttonCopyOrders = document.createElement("button");

    // 设置按钮文本
    buttonCopyOrders.innerHTML = "复制所有订单号";

    // 添加点击事件处理程序
    buttonCopyOrders.addEventListener("click", function() {
        copyMatches();
    });
    // 添加样式，使按钮浮动在页面上方
    buttonCopyOrders.className = `custom-button-${nav}`; // 应用定义的样式类

    // 将按钮添加到页面的某个元素中（这里添加到 buttonContainer 元素中）
    buttonContainer.appendChild(buttonCopyOrders);
    //===============↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑复制所有订单↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑============================
})();