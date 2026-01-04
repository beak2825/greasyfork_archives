// ==UserScript==
// @name         Tabcut 商品榜导出工具
// @namespace    https://tabcut.com/
// @version      1.0
// @description  抓取商品榜单数据并导出为CSV
// @author       ChatGPT
// @match        https://www.tabcut.com/zh-CN/ranking/goods*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539592/Tabcut%20%E5%95%86%E5%93%81%E6%A6%9C%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539592/Tabcut%20%E5%95%86%E5%93%81%E6%A6%9C%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function exportCSV(data, filename = "tabcut_goods.csv") {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(h => `"${(row[h] || '').replace(/"/g, '""')}"`);
            csvRows.push(values.join(','));
        }

        const csv = csvRows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        a.click();
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '📥 导出榜单数据';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 16px';
        btn.style.background = '#4caf50';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        btn.addEventListener('click', extractData);
        document.body.appendChild(btn);
    }

    async function extractData() {
        const cards = document.querySelectorAll('.ranking-goods-item');
        const result = [];

        if (cards.length === 0) {
            alert('⚠️ 未找到任何商品项，请确保榜单已加载');
            return;
        }

        for (const card of cards) {
            try {
                const title = card.querySelector('.goods-name')?.innerText.trim() || '';
                const shop = card.querySelector('.shop-name')?.innerText.trim() || '';
                const price = card.querySelector('.price')?.innerText.trim() || '';
                const sales = card.querySelector('.sales')?.innerText.trim() || '';
                const link = card.querySelector('a')?.href || '';

                result.push({
                    商品名: title,
                    店铺: shop,
                    价格: price,
                    销量: sales,
                    链接: link
                });
            } catch (e) {
                console.error("❌ 抓取出错：", e);
            }
        }

        if (result.length) {
            exportCSV(result);
        } else {
            alert('❌ 未提取到任何商品数据');
        }
    }

    window.addEventListener('load', () => {
        // 等待页面渲染完成
        setTimeout(() => {
            createButton();
        }, 2000);
    });
})();
