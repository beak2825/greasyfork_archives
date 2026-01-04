// ==UserScript==
// @name         uniqueitemtrad
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  在编年史传奇物品旁添加交易集市跳转，仅支持国际服
// @author       Azure
// @match        https://poedb.tw/tw/*
// @match        https://poedb.tw/cn/*
// @match        https://poe2db.tw/tw/*
// @match        https://poe2db.tw/cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poedb.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539586/uniqueitemtrad.user.js
// @updateURL https://update.greasyfork.org/scripts/539586/uniqueitemtrad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getWebsiteData(reslink) {
        const response = await fetch(reslink);
        const html = await response.text();
        const parser = new DOMParser();
        const virtualDoc = parser.parseFromString(html, 'text/html');
        const linkHref = virtualDoc.querySelector('table.table.table-hover.table-striped.mb-0 tr:first-child a').href;
        return linkHref;
    }

    // 页面完全加载后执行
    window.addEventListener('load', function() {
        // 获取class为'flex-grow-1 ms-2'的元素内部的class为'uniqueitem'的元素
        let uniqueItems = document.querySelectorAll('.flex-grow-1.ms-2 .uniqueitem');

        const hostname = window.location.hostname;
        let poe1 = hostname.toLowerCase().includes('poedb');

        if (uniqueItems.length > 0) {
            uniqueItems.forEach(function(item, index) {
                let itemname = item.getAttribute('href');
                const tradeLink = document.createElement('a');
                // 绑定点击事件
                tradeLink.addEventListener('click', async (event) => {
                    // 阻止 a 标签的默认跳转行为
                    event.preventDefault();
                    var reslink = itemname.replace('/tw/','/us/');
                    reslink = reslink.replace('/cn/','/us/');
                    reslink = (poe1 ? `https://poedb.tw` : `https://poe2db.tw`) + reslink;

                    try {
                        // 调用异步函数 getWebsiteData 并等待其结果
                        const market = await getWebsiteData(reslink);
                        window.open(market, '_blank')
                    } catch (error) {
                        // 处理可能发生的错误，例如网络请求失败
                        console.error('获取数据失败:', error);
                    }
                });

                tradeLink.textContent = '查看市集';
                tradeLink.className = 'trade-link';
                tradeLink.style= "font-size: 11px; margin-left: 8px;";
                item.appendChild(tradeLink);
            });
        }

        // 物品详情页
        let marketplace = document.querySelector("div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(2)");
        const detailtradeLink = document.createElement('a');
        // 绑定点击事件
        detailtradeLink.addEventListener('click', async (event) => {
            // 阻止 a 标签的默认跳转行为
            event.preventDefault();
            var reslink = document.URL.replace('/tw/','/us/');
            reslink = reslink.replace('/cn/','/us/');

            try {
                // 调用异步函数 getWebsiteData 并等待其结果
                const market = await getWebsiteData(reslink);
                window.open(market, '_blank')
            } catch (error) {
                // 处理可能发生的错误，例如网络请求失败
                console.error('获取数据失败:', error);
            }
        });

        detailtradeLink.textContent = '国际服市集';
        detailtradeLink.className = 'trade-link';
        detailtradeLink.style= "font-size: 16px; margin-left: 8px; cursor: pointer;";
        marketplace.appendChild(detailtradeLink);
    }, false);
})();