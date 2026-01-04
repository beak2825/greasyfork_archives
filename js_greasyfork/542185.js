// ==UserScript==
// @name         美团同步数据插件
// @namespace    *://me.meituan.com/*
// @version      0.6
// @description  点击同步数据，内部使用
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542185/%E7%BE%8E%E5%9B%A2%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542185/%E7%BE%8E%E5%9B%A2%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const url_flag = false;
    const originalXHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function () {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // Override the open method to modify the URL or headers
        xhr.open = function (method, url, async, user, password) {
            if (url.includes('https://seariver.meituan.com/api/agent/v1/oversea/order/apt/pois')) {
                console.log('Intercepted XMLHttpRequest:', url);
                const url_flag = true;
            }
            originalOpen.apply(xhr, arguments);
        };
        xhr.send = function (body) {
                // Optionally, you can modify the request body here
                // console.log('Request body:', body);
                xhr.onload = function () {
                    if (xhr.responseText.includes('ohOrderId') && xhr.responseText.includes('acceptExpire') && !xhr.responseText.includes('webpackJsonp')) {
                        localStorage.setItem('meituanApiResponse', xhr.responseText)
                    }
                };
                originalSend.apply(xhr, arguments);
            };

        return xhr;
    };


    const checkAndAddButton = () => {
        // 获取嵌套的 iframe
        const iframe = document.getElementById('me-iframe-container');
        // 确保 iframe 存在并且已加载
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        } else {
            // 3秒后再次查找
            setTimeout(checkAndAddButton, 3000); // 3秒后再次执行
        }
        const retargetButtons = document.getElementsByClassName('text-left font-small');
        if (retargetButtons) {
            // 遍历列表，为每个按钮添加新按钮
            Array.from(retargetButtons).forEach((button, index) => {
                // 创建新的按钮
                // 检查目标按钮的右侧是否已经有了 "同步" 按钮
                if (!button.parentElement.querySelector('.sync-button')) {
                    // 创建新的按钮
                    const newButton = document.createElement('button');

                    newButton.textContent = ' 同步 ';
                    newButton.classList.add('btn', 'btn-sm', 'btn-primary', 'sync-button');

                    const orderId = button.querySelectorAll('span')[1].innerText.replace('订单号：', '');
                    newButton.value = orderId;

                    // 为新按钮添加点击事件
                    newButton.addEventListener('click', (arg) => {
                        const li_orderId = arg.currentTarget.value;
                        // 从 localStorage 获取数据
                        const apiResponse = JSON.parse(localStorage.getItem('meituanApiResponse'));
                        // 检查数据是否存在
                        if (apiResponse) {
                            // debugger;
                            // console.log('同步按钮点击，获取的响应数据:', li_orderId, apiResponse);
                            for (let i=0; i<apiResponse.data.data.length; ++i){
                                const api_orderID = apiResponse.data.data[i].orderId
                                if (li_orderId === api_orderID){
                                    console.log(apiResponse.data.data[i]);
                                    alert(api_orderID)
                                }
                            }
                        } else {
                            console.log('未找到存储的数据');
                        }
                    });
                    // 添加按钮
                    button.appendChild(newButton);
                } else {
                }
            });
        } else {
            // 3秒后再次查找
            setTimeout(checkAndAddButton, 3000); // 3秒后再次执行
        }
    };
    checkAndAddButton();

})();
