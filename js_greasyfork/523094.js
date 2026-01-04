// ==UserScript==
// @name         闲鱼商品行情计算
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  计算闲鱼搜索结果页上商品的价格均值、中位数、去除极值后的均值，并在页面左侧显示结果
// @author       yitong2333
// @match        https://www.goofish.com/search*
// @license      MIT
// @icon         https://ts3.cn.mm.bing.net/th?id=ODLS.926d4c1b-8117-4eb0-ba9d-5d557466c78c&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @homepageURL  https://greasyfork.org/zh-CN/scripts/523094
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523094/%E9%97%B2%E9%B1%BC%E5%95%86%E5%93%81%E8%A1%8C%E6%83%85%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/523094/%E9%97%B2%E9%B1%BC%E5%95%86%E5%93%81%E8%A1%8C%E6%83%85%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并显示一个固定位置的小窗口
    const createWindow = () => {
        const windowDiv = document.createElement('div');
        windowDiv.style.position = 'fixed';
        windowDiv.style.left = '10px';
        windowDiv.style.top = '100px';
        windowDiv.style.padding = '10px';
        windowDiv.style.backgroundColor = '#fff';
        windowDiv.style.border = '1px solid #ccc';
        windowDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        windowDiv.style.zIndex = '9999';
        windowDiv.style.fontSize = '14px';
        windowDiv.style.color = '#333';
        windowDiv.style.maxWidth = '200px';
        windowDiv.style.borderRadius ='10px';
        windowDiv.style.transition = 'all 0.3s ease';

        // 在窗口中添加标题
        const title = document.createElement('h4');
        title.textContent = '闲鱼商品行情计算';
        title.style.margin = '0';
        title.style.fontSize = '16px';
        title.style.color = '#1E90FF';
        windowDiv.appendChild(title);

        // 创建显示结果的区域
        const content = document.createElement('div');
        content.id = 'price-stats';
        windowDiv.appendChild(content);

        // 将小窗口添加到页面
        document.body.appendChild(windowDiv);
    };

    // 更新小窗口中的价格统计信息
    const updateWindow = (averagePrice, medianPrice, averageWithoutOutliers) => {
        const contentDiv = document.getElementById('price-stats');
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div style="color: #32CD32;">均值: ¥${averagePrice.toFixed(0)}</div>
                <div style="color: #FFA500;">中位数: ¥${medianPrice.toFixed(0)}</div>
                <div style="color: #DC143C;">去除极值后的均值: ¥${averageWithoutOutliers.toFixed(0)}</div>
            `;
        }
    };

    // 等待页面加载完成
    setTimeout(() => {
        let prices = [];

        // 获取所有 React 组件中的价格
        try {
            const allProducts = window.__reactProps$pdmiyuep7an;

            if (allProducts && Array.isArray(allProducts.children)) {
                allProducts.children.forEach(item => {
                    if (item && item.props && item.props.soldPrice) {
                        const price = parseFloat(item.props.soldPrice);
                        if (!isNaN(price)) {
                            prices.push(price);
                        }
                    }
                });
            }
        } catch (error) {
            console.log('无法从 __reactProps$pdmiyuep7an 获取价格数据:', error);
        }

        // 如果没有通过 React 获取价格，尝试从页面中其他元素获取
        if (prices.length === 0) {
            const priceElements = document.querySelectorAll('.number--NKh1vXWM');  // 根据实际的类名进行修改
            priceElements.forEach(element => {
                const priceText = element.textContent.trim().replace('￥', '').replace(',', '');  // 清理价格文本
                const price = parseFloat(priceText);
                if (!isNaN(price)) {
                    prices.push(price);
                }
            });
        }

        // 如果没有价格数据，提醒并退出
        if (prices.length === 0) {
            console.log('未找到有效的价格');
            return;
        }

        // 计算均值
        const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

        // 计算中位数
        const sortedPrices = prices.slice().sort((a, b) => a - b);
        let medianPrice;
        const midIndex = Math.floor(sortedPrices.length / 2);
        if (sortedPrices.length % 2 === 0) {
            medianPrice = (sortedPrices[midIndex - 1] + sortedPrices[midIndex]) / 2;
        } else {
            medianPrice = sortedPrices[midIndex];
        }

        // 计算去除极值后的均值
        const pricesWithoutOutliers = sortedPrices.slice(1, sortedPrices.length - 1);  // 去掉最小和最大值
        const averageWithoutOutliers = pricesWithoutOutliers.reduce((a, b) => a + b, 0) / pricesWithoutOutliers.length;

        // 显示小窗口并更新结果
        createWindow();
        updateWindow(averagePrice, medianPrice, averageWithoutOutliers);

    }, 3000);  // 等待 3 秒后执行脚本，确保页面加载完成
})();
