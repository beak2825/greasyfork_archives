// ==UserScript==
// @name         GeekJack JPY to CNY Price Converter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  将 https://shop.geekjack.net/ 上的 JPY 价格转换为 CNY 近似价格并显示。
// @author       GitHub Copilot
// @license      MIT
// @match        https://shop.geekjack.net/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geekjack.net
// @downloadURL https://update.greasyfork.org/scripts/545931/GeekJack%20JPY%20to%20CNY%20Price%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/545931/GeekJack%20JPY%20to%20CNY%20Price%20Converter.meta.js
// ==/UserScript==

(function() {
    'use_strict';

    // 定义汇率
    const EXCHANGE_RATE = 20;

    // 用于格式化数字（添加千位分隔符）
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 用于处理价格转换的函数
    const convertPrice = (element) => {
        // 检查元素是否已被处理，或者其父元素是否也包含 .money (避免在已转换的元素上再次运行)
        if (element.dataset.cnyConverted || element.parentElement.closest('.money')) {
            return;
        }

        // 只处理包含 "¥" 的直接文本节点，避免处理我们自己添加的CNY价格
        const originalPriceText = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('¥'))?.textContent;

        if (!originalPriceText) {
            return;
        }

        const priceMatch = originalPriceText.match(/¥([\d,]+)/);

        if (priceMatch && priceMatch[1]) {
            // 移除逗号并转换为数字
            const jpyPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
            if (!isNaN(jpyPrice)) {
                // 计算CNY价格并四舍五入到整数
                const cnyPrice = Math.round(jpyPrice / EXCHANGE_RATE);
                // 格式化CNY价格，添加千位分隔符
                const formattedCnyPrice = formatNumberWithCommas(cnyPrice);

                // 创建一个新的 span 元素来显示CNY价格
                const cnyElement = document.createElement('span');
                cnyElement.textContent = ` (¥${formattedCnyPrice} CNY)`;
                cnyElement.style.color = 'gray';
                cnyElement.style.fontSize = 'inherit'; // 继承父级字体大小
                cnyElement.style.marginLeft = '4px';

                // 将CNY价格元素附加到原价格元素之后
                element.appendChild(cnyElement);
                // 标记该元素已转换
                element.dataset.cnyConverted = 'true';
            }
        }
    };

    // 查找并转换页面上所有价格
    const convertAllPrices = () => {
        // 使用您提供的 class="money" 作为选择器
        const priceElements = document.querySelectorAll('.money');
        priceElements.forEach(convertPrice);
    };

    // 页面加载完成后执行一次转换
    window.addEventListener('load', convertAllPrices);

    // 使用 MutationObserver 来监视DOM的变化，以便在新内容出现时也能转换价格。
    const observer = new MutationObserver((mutations) => {
        const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
        if (hasAddedNodes) {
            // 在DOM变化时，稍微延迟执行，以确保相关元素完全加载
            setTimeout(convertAllPrices, 500);
        }
    });

    // 配置并启动观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();