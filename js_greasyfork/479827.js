// ==UserScript==
// @name         提交Card信息并检查结果
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取第一组class="card"信息、URL参数sp_no和固定code，提交到服务器，并根据响应提示保存结果。
// @author       YourName
// @match        https://aiqicha.baidu.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/479827/%E6%8F%90%E4%BA%A4Card%E4%BF%A1%E6%81%AF%E5%B9%B6%E6%A3%80%E6%9F%A5%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/479827/%E6%8F%90%E4%BA%A4Card%E4%BF%A1%E6%81%AF%E5%B9%B6%E6%A3%80%E6%9F%A5%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("https://aiqicha.baidu.com/s?q=")) {
        const button = document.createElement('button');
        button.textContent = '提交信息';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '10px';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';

        // 从URL中获取参数的函数
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        // 将对象转换为键值对的函数
        function encodeFormData(data) {
            return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        }

        // 发送POST请求的函数
        function sendPost(data) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://ued.iwanshang.cloud/index.php?m=Fsupport&a=api",
                data: encodeFormData(data),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    const result = JSON.parse(response.responseText);
                    if (result.status === 1) {
                        alert('保存成功');
                    } else {
                        alert('保存失败');
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    alert('请求失败，请检查网络连接或服务器状态');
                }
            });
        }

        function onButtonClick() {
            const firstCardElement = document.querySelector('.card');
            let extractedInfoArray = [];

            if (firstCardElement) {
                const titleElement = firstCardElement.querySelector('[data-log-an="s-componylist-item-click"]');
                if (titleElement && titleElement.title) {
                    extractedInfoArray.push(titleElement.title.trim());
                }

                const legalTxtElements = firstCardElement.querySelectorAll('.props .legal-txt');
                legalTxtElements.forEach(element => {
                    extractedInfoArray.push(element.textContent.trim());
                });

                console.log(extractedInfoArray);

                // 新数组，包含sp_no、data和code键
                const payload = {
                    sp_no: getQueryParam('sp_no'),
                    data: extractedInfoArray,
                    code: 'aiqicha' // 新增code键
                };

                sendPost(payload); // 发送POST请求
            } else {
                alert('没有找到Card元素！');
            }
        }

        button.addEventListener('click', onButtonClick);
        document.body.appendChild(button);
    }
})();
