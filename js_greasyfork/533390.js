// ==UserScript==
// @name         卓大爷看库存
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  提取SKU数据并生成专业表格
// @author       卓大爷
// @match        https://www.temu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533390/%E5%8D%93%E5%A4%A7%E7%88%B7%E7%9C%8B%E5%BA%93%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/533390/%E5%8D%93%E5%A4%A7%E7%88%B7%E7%9C%8B%E5%BA%93%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选择器
    const SELECTORS = {
        dataTable: '#card-popup table',// 数据源表格
        cartButton: 'div._100Uy0HO',// 购物车按钮容器
        price: 'div._15o2bYpT span[style*="font-size:28px"]' // 价格元素
    };

    // 主函数
    function init() {
        const sourceTable = document.querySelector(SELECTORS.dataTable);
        if (!sourceTable) return;

        const tableData = parseTable(sourceTable);
        if (tableData.length > 0) {
            renderTable(tableData);
        }
    }

    // 解析源表格数据
    function parseTable(table) {
        return Array.from(table.querySelectorAll('tbody tr')).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                sku: cells[0].innerText.trim(),
                price: cells[1].innerText.trim(),
                supply: cells[2].innerText.trim(),
                stock: cells[3].innerText.trim()
            };
        });
    }

    // 生成表格
    function renderTable(data) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        const tableHTML = `
            <style>
                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: system-ui;
                }
                .custom-table th {
                    background: #FFEEE0;
                    color: #FF9400;
                    padding: 12px;
                    text-align: left;
                }
                .custom-table td {
                    padding: 10px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .custom-table tr:last-child td {
                    border-bottom: none;
                }
                .highlight-red {
                    color: #FF0000;
                    font-weight: bold;
                }
            </style>
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>商品</th>
                        <th>价格</th>
                        <th>预估供货价</th>
                        <th>库存</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.sku.replace('IPhone', 'iPhone').replace(' 】', ']')}</td>
                            <td>${item.price}</td>
                            <td>${item.supply}</td>
                            <td>${item.stock}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
        insertAfterCart(container);
    }

    // 插入到购物车区域下方
    function insertAfterCart(element) {
        const cartSection = document.querySelector(SELECTORS.cartButton);
        if (cartSection) {
            cartSection.parentNode.insertBefore(element, cartSection.nextElementSibling);
        }
    }

    // 启动逻辑
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector(SELECTORS.dataTable)) {
            observer.disconnect();
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 备用检测
    setTimeout(() => {
        if (!document.querySelector('.custom-table')) init();
    }, 3000);
})();