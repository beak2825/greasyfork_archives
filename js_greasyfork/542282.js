// ==UserScript==
// @name         携程同步数据插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Intercept the response of the scrollOrderList API and log it to the console
// @match        https://www.vipdlt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542282/%E6%90%BA%E7%A8%8B%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542282/%E6%90%BA%E7%A8%8B%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Override XMLHttpRequest to intercept the response
    const originalXHR = XMLHttpRequest;
    XMLHttpRequest = function () {
        const xhr = new originalXHR();

        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // Intercept open method to check for specific URL
        xhr.open = function (method, url, async, user, password) {
            this._url = url;  // Save the URL for later comparison
            originalOpen.call(this, method, url, async, user, password);
        };

        // Intercept send method to capture the response
        xhr.send = function (data) {
            // Check if the URL matches the scrollOrderList API

            if (this._url && this._url.includes('api/scrollOrderList')) {
                const onloadBackup = xhr.onload;
                xhr.onload = function () {
                    try {
                        //console.log('Intercepted API Response:', xhr.responseText);

                        if (xhr.status === 200 && xhr.responseText.includes('infoBos') && xhr.responseText.includes('channelOrderId') && !xhr.responseText.includes('webpackJsonp')) {
                            //debugger;
                            const apiResponse = JSON.parse(localStorage.getItem('meituanApiResponse'));
                            if (apiResponse){
                                const infoBos = JSON.parse(xhr.responseText).data.infoBos;
                                // 防止重复的 channelOrderId 被添加
                                const existingChannelOrderIds = new Set(apiResponse.data.infoBos.map(item => item.channelOrderId));

                                // 过滤掉已经存在的 infoBos
                                const uniqueInfoBos = infoBos.filter(item => !existingChannelOrderIds.has(item.channelOrderId));

                                // 将去重后的 infoBos 合并到 apiResponse 中
                                apiResponse.data.infoBos = apiResponse.data.infoBos.concat(uniqueInfoBos);
                                //debugger;

                                // 更新 localStorage
                                localStorage.setItem('meituanApiResponse', JSON.stringify(apiResponse));
                            }else{
                                localStorage.setItem('meituanApiResponse', xhr.responseText);
                            }
                        }
                    } catch (e) {
                        console.error('Error processing the response:', e);
                    }
                    if (onloadBackup) onloadBackup.call(xhr);
                };
            }
            originalSend.call(this, data);
        };

        return xhr;
    };

    const checkAndAddButton = () => {
        // 获取嵌套的 iframe
        const tabOrderList = document.getElementById('tabOrderList');
        if (!tabOrderList) return;
        const retargetButtons = tabOrderList.getElementsByClassName('hoteltr');
        if (retargetButtons.length > 0) {
            // 遍历列表，为每个按钮添加新按钮
            Array.from(retargetButtons).forEach((button) => {
                let tdList = button.getElementsByClassName('supplier')[0].querySelectorAll('td');
                let lastTd = tdList[tdList.length - 1];
                if (lastTd && !lastTd.querySelector('.sync-button')) {
                    // debugger;
                    // 获取所有的 d-form-item 元素
                    let formItems = button.getElementsByClassName('table-inline')[0].getElementsByClassName('d-form-item');
                    // 获取每个 d-form-item 元素的文本内容并拼接为一个字符串
                    let concatenatedText = Array.from(formItems)
                        .map(item => item.textContent.trim())  // 获取文本并去除空格
                        .join(' ');  // 使用空格连接文本
                    const newButton = document.createElement('button');
                    newButton.value = concatenatedText;
                    newButton.textContent = ' 同步 ';
                    newButton.classList.add('btn', 'btn-sm', 'btn-primary', 'sync-button');

                    // 为新按钮添加点击事件
                    newButton.addEventListener('click', (arg) => {
                        // debugger;
                        const li_orderId = arg.currentTarget.value;
                        // 从 localStorage 获取数据
                        const apiResponse = JSON.parse(localStorage.getItem('meituanApiResponse'));
                        // 检查数据是否存在
                        if (apiResponse) {
                            // debugger;
                            // console.log('同步按钮点击，获取的响应数据:', li_orderId, apiResponse);
                            for (let i=0; i<apiResponse.data.infoBos.length; ++i){
                                const api_orderID = apiResponse.data.infoBos[i].channelOrderId
                                if (li_orderId === api_orderID){
                                    console.log(apiResponse.data.infoBos[i]);
                                    alert(api_orderID)
                                }
                            }
                        } else {
                            console.log('未找到存储的数据');
                        }
                    });
                    lastTd.appendChild(newButton);
                }
            });
        }
    };
    // 监听 tabOrderList 的变化
    const observer = new MutationObserver(checkAndAddButton);
    const config = {childList: true, subtree: true};
    const tabOrderList = document.getElementById('tabOrderList');
    if (tabOrderList) {
        observer.observe(tabOrderList, config);  // 观察 tabOrderList 元素
        // 初始加载时执行一次
        checkAndAddButton();
    }


})();
