// ==UserScript==
// @name         temu扩展base
// @namespace    http://tampermonkey.net/
// @version      2024.08.10.4
// @description  temu页面扩展的通用脚本，也是必不可少的基础脚本，通用的设置和功能放在这里
// @author       You
// @match        https://seller.kuajingmaihuo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuajingmaihuo.com
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503075/temu%E6%89%A9%E5%B1%95base.user.js
// @updateURL https://update.greasyfork.org/scripts/503075/temu%E6%89%A9%E5%B1%95base.meta.js
// ==/UserScript==

const nav='base';
const API_UNREAD_MSG = '/bg/quick/api/merchant/msgBox/unreadMsgDetail';
const API_READ_MSG = '/bg/quick/api/merchant/msgBox/read';
var API_OPTIONS = {};

const API_REJECT_PRICES = '/marvel-mms/cn/api/kiana/gmp/bg/magneto/api/price/adjust/price-reduce-popup-click';
const API_ADJUST_POPUP = '/marvel-mms/cn/api/kiana/gmp/bg/magneto/api/price/priceAdjust/gmpReducePricePopup';
const API_ADJUST_POPUP_2 = '/marvel-mms/cn/api/kiana/gmp/bg/magneto/api/ams/price/priceAdjust/gmpReducePricePopupV2';


function readAllMsg(msgIds){
    if(!msgIds || msgIds.length === 0) return;
    msgIds.forEach(msgId =>{
        var options = {
            ...API_OPTIONS,
            method: "POST",
            body: JSON.stringify({msgId:msgId}),
        };
        window.originalFetch(API_READ_MSG, options);
    });

    msgIds = [];
    localStorage.removeItem(API_UNREAD_MSG);
}


function rejectAllPrices(orderIds){
    if(!orderIds || orderIds.length === 0) return;
    var options = {
        ...API_OPTIONS,
        method: "POST",
        body: JSON.stringify({
            createTime: Date.now(),
            maxOrderId: Math.max(...orderIds),
            popUpType: 3,
            rejectOrderIdList:orderIds
        }),
    };
    window.originalFetch(API_REJECT_PRICES, options);

    orderIds = [];
    localStorage.removeItem(API_ADJUST_POPUP);
}


function rejectAllPricesV2(orderIds, batchId){
    if(!orderIds || orderIds.length === 0) return;
    var options = {
        ...API_OPTIONS,
        method: "POST",
        body: JSON.stringify({
            batchId: batchId,
            passNum: 0,
            popUpType: 3,
            rejectNum: orderIds.length,
            rejectOrderIdList:orderIds
        }),
    };
    window.originalFetch(API_REJECT_PRICES, options);

    orderIds = [];
    localStorage.removeItem(API_ADJUST_POPUP_2);
}


function cleanScreen(){
    queryAndRemove('div[data-testid="beast-core-modal-mask"]');
    queryAndRemove('div[data-testid="beast-core-modal"]');
    //queryAndRemove('div[class^="auto-apply"]');
    //queryAndRemove('div[data-testid="beast-core-portal"]');
}

function queryAndRemove(selector){
    // remove DOM directly
    var dom = document.querySelector(selector);
    if(dom){
        dom.remove();
    }
}

(function() {
    'use strict';

//     // Hook into the open method of XMLHttpRequest
//     const originalOpen = XMLHttpRequest.prototype.open;
//     XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
//         this._url = url; // Store the URL of the request
//         return originalOpen.apply(this, arguments);
//     };

//     // Hook into the send method of XMLHttpRequest
//     const originalSend = XMLHttpRequest.prototype.send;
//     XMLHttpRequest.prototype.send = function(body) {
//         console.log('xhr:', this._url);
//         // Add an event listener for the readystatechange event
//         this.addEventListener('readystatechange', function() {
//             if (this.readyState === 4 && this._url === API_ENDPOINT) { // Request is complete
//                 console.log('XHR Request URL:', this._url);
//                 console.log('XHR Request Method:', this._method);
//                 console.log('XHR Request Body:', body);
//                 console.log('XHR Response Status:', this.status);
//                 console.log('XHR Response Text:', this.responseText);

//                 localStorage.setItem(this._url, this.responseText);
//             }
//         });
//         return originalSend.apply(this, arguments);
//     };



//     // 重写fetch函数
//     const originalFetch = window.fetch;
//     window.fetch = function(url, options) {
//         // 在这里添加你想要执行的逻辑，例如记录Fetch请求
//         // console.log('Fetch Request:', url, options);

//         // 判断请求是否匹配特定路径
//         if (url.endsWith('bg-visage-mms/product/skc/pageQuery')) {
//             console.log('get a new query:', url);
//         }

//         // 调用原始的fetch函数
//         return originalFetch.apply(this, arguments);
//     };

    if (!window.originalFetch) {
        window.originalFetch = window.fetch;
    }

    window.fetch = function(url, options) {
        const fetchEvent = new CustomEvent('beforeFetch', {
            detail: { url, options }
        });
        window.dispatchEvent(fetchEvent);

        return window.originalFetch.apply(this, arguments).then(response => {
            const fetchResponseEvent = new CustomEvent('fetchResponse', {
                detail: { url, response: response.clone() }
            });
            window.dispatchEvent(fetchResponseEvent);
            return response;
        });
    };

    window.addEventListener('beforeFetch', function(e) {
        const { url, options } = e.detail;
        if (url.endsWith(API_UNREAD_MSG)) {
            API_OPTIONS = options;
        }
    });

    window.addEventListener('fetchResponse', function(e) {
        const { url, response } = e.detail;
        if (url.endsWith(API_UNREAD_MSG) || url.endsWith(API_ADJUST_POPUP) || url.endsWith(API_ADJUST_POPUP_2)) {
            const [baseUrl, path] = url.split(/(?<=https:\/\/[^\/]+)\//);
            console.log({baseUrl, path});
            response.json().then(data => {
                localStorage.setItem(`/${path}`, JSON.stringify(data));
                console.log(`Stored /${path} data:`, data);
            });
        }
    });


    // 创建一个新的style元素
    const styleElement = document.createElement('style');

    // 定义按钮样式
    styleElement.textContent = `
        .custom-button-container-${nav} {
            position: absolute;
            top: 10px;
            left: 10px;
            /*background-color: #f1f3ff;*/
            z-index: 9999;
            padding: 10px;
        }
        .custom-button-${nav} {
            background-color: #0f37ff;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            cursor: pointer;
        }
        .custom-button-round-${nav} {
            background-color: #0f37ff;
            border: none;
            color: white;
            padding: 10px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            cursor: pointer;
            border-radius: 50%;
            font-family: STKaiti;
            margin: 0px 2px;
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

    //===============↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓暴力清理页面弹窗↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓============================


    // 创建按钮元素
    var buttonExportSubOrders = document.createElement("button");

    // 设置按钮文本
    buttonExportSubOrders.innerHTML = "净";

    // 添加点击事件处理程序
    buttonExportSubOrders.addEventListener("click", function() {
        // 从 localStorage 中读取数据
        const savedDataStr = localStorage.getItem(API_UNREAD_MSG);
        const savedData = JSON.parse(savedDataStr);

        const rawData = savedData.result.unreadPopMsg;
        console.log("rawData:", rawData);

        // 特殊处理
        const parsedData = [];
        rawData.forEach(row => {
            const { id, ...filteredObject } = row;
            parsedData.push(id);
        });

        readAllMsg(parsedData);

        console.log("localstrorage data:", {parsedData});

        cleanScreen();
    });
    // 添加样式，使按钮浮动在页面上方
    buttonExportSubOrders.className = `custom-button-round-${nav}`; // 应用定义的样式类

    // 将按钮添加到页面的某个元素中（这里添加到 buttonContainer 元素中）
    buttonContainer.appendChild(buttonExportSubOrders);
    //===============↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑暴力清理页面弹窗↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑============================

    //===============↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓一键拒绝降价↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓============================


    // 创建按钮元素
    var buttonRejectPrices = document.createElement("button");

    // 设置按钮文本
    buttonRejectPrices.innerHTML = "呸";

    // 添加点击事件处理程序
    buttonRejectPrices.addEventListener("click", function() {
        // 从 localStorage 中读取数据
        const savedDataStr = localStorage.getItem(API_ADJUST_POPUP);
        const savedData = JSON.parse(savedDataStr);

        const rawData = savedData?.result?.popUpOthers?.adjustList;
        console.log("rawData:", rawData);

        // 特殊处理
        var parsedData = [];
        rawData?.forEach(row => {
            const { priceOrderSn, ...filteredObject } = row;
            parsedData.push(Number(priceOrderSn.slice(3)));
        });

        rejectAllPrices(parsedData);

        console.log("localstrorage data:", {parsedData});


        // 从 localStorage 中读取数据
        const savedDataStr2 = localStorage.getItem(API_ADJUST_POPUP_2);
        const savedData2 = JSON.parse(savedDataStr2);

        const popUpContent = savedData2?.result?.popUpContent;
        const rawData2 = popUpContent?.adjustList;
        console.log("rawData2:", rawData2);

        // 特殊处理
        parsedData = [];
        rawData2?.forEach(row => {
            const { priceOrderSn, ...filteredObject } = row;
            parsedData.push(Number(priceOrderSn.slice(3)));
        });

        rejectAllPricesV2(parsedData, popUpContent?.batchId);

        console.log("localstrorage data2:", {parsedData});


        cleanScreen();
    });
    // 添加样式，使按钮浮动在页面上方
    buttonRejectPrices.className = `custom-button-round-${nav}`; // 应用定义的样式类

    // 将按钮添加到页面的某个元素中（这里添加到 buttonContainer 元素中）
    buttonContainer.appendChild(buttonRejectPrices);
    //===============↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑一键拒绝降价↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑============================

})();