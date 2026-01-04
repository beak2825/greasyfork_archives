// ==UserScript==
// @name         B站收藏夹显示收藏时间
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在左上角显示哔哩哔哩收藏夹时间
// @author       lzypddzz
// @match        *://space.bilibili.com/*/favlist*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522170/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%98%BE%E7%A4%BA%E6%94%B6%E8%97%8F%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/522170/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%98%BE%E7%A4%BA%E6%94%B6%E8%97%8F%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    // 在页面左上角显示收藏时间和标题汇总
    function displayFavSummary(medias) {
        // 创建或获取汇总容器
        let summaryContainer = document.querySelector('.fav-summary-container');
        if (!summaryContainer) {
            summaryContainer = document.createElement('div');
            summaryContainer.className = 'fav-summary-container';
            summaryContainer.style.position = 'fixed';
            summaryContainer.style.top = '10px';
            summaryContainer.style.left = '10px';
            summaryContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            summaryContainer.style.padding = '10px';
            summaryContainer.style.borderRadius = '5px';
            summaryContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            summaryContainer.style.maxHeight = '300px'; // 最大高度
            summaryContainer.style.overflowY = 'auto'; // 添加滚动条
            summaryContainer.style.width = '300px'; // 宽度
            summaryContainer.style.zIndex = '9999';

            const header = document.createElement('h3');
            header.textContent = '收藏时间汇总';
            summaryContainer.appendChild(header);

            const list = document.createElement('ul');
            summaryContainer.appendChild(list);

            document.body.appendChild(summaryContainer);
        }

        const list = summaryContainer.querySelector('ul');
        list.innerHTML = ''; // 清空之前的内容

        medias.forEach(({ title, fav_time }) => {
            const listItem = document.createElement('li');
            const formattedTime = formatTimestamp(fav_time);
            listItem.textContent = `${title} - 收藏时间: ${formattedTime}`;
            list.appendChild(listItem);
        });
    }

    // 拦截网络请求，捕获收藏夹数据
    function interceptNetworkRequests() {
        const originalFetch = window.fetch;

        window.fetch = async function (...args) {
            const response = await originalFetch.apply(this, args);
            const clone = response.clone();

            const url = args[0];
            if (url.includes('/x/v3/fav/resource/list')) {
                clone.json().then((data) => {
                    const medias = data?.data?.medias;
                    if (medias) {
                        displayFavSummary(medias);
                    }
                }).catch((err) => console.error('解析收藏列表响应失败:', err));
            }

            return response;
        };
    }

    // 初始化拦截器
    interceptNetworkRequests();
})();