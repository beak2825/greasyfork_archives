// ==UserScript==
// @name:en         [MWI]Inventory Category Price Calculator
// @name            [银河奶牛]库存分类价格汇总显示
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-inventory-category-price-calculator
// @version         1.0.7
// @description:en  Calculate and display total prices for each category in inventory
// @description     计算并显示库存中每个分类的总价格
// @author          shenhuanjie
// @license         MIT
// @match           https://www.milkywayidle.com/game*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           none
// @homepage        https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-inventory-category-price-calculator
// @supportURL      https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-inventory-category-price-calculator
// @downloadURL https://update.greasyfork.org/scripts/535455/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%93%E5%AD%98%E5%88%86%E7%B1%BB%E4%BB%B7%E6%A0%BC%E6%B1%87%E6%80%BB%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535455/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%93%E5%AD%98%E5%88%86%E7%B1%BB%E4%BB%B7%E6%A0%BC%E6%B1%87%E6%80%BB%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断用户语言环境
    const isChinese = navigator.language.includes('zh');

    const messages = {
        zh: {
            scriptStarted: '库存分类价格计算器已启动',
            dataRefreshed: '数据已刷新'
        },
        en: {
            scriptStarted: 'Inventory Category Price Calculator has been started',
            dataRefreshed: 'Data has been refreshed'
        }
    };

    function getMessage(key, replacements = {}) {
        const lang = isChinese ? 'zh' : 'en';
        let message = messages[lang][key];
        for (const [placeholder, value] of Object.entries(replacements)) {
            message = message.replace(`{${placeholder}}`, value);
        }
        return message;
    }

    console.log(getMessage('scriptStarted'));

    // 初始化数据
    let categoryPrices = {};
    let originalCategoryNames = new Set();

    // 安全获取类名列表的函数
    function getClassList(element) {
        if (typeof element.className === 'string') {
            return element.className.split(' ');
        } else if (element.className && typeof element.className.baseVal === 'string') {
            return element.className.baseVal.split(' ');
        }
        return [];
    }

    // 解析价格字符串（支持 K/M/B 后缀）
    function parsePrice(priceStr, countValue = '') {
        if (!priceStr && !countValue) return 0;

        // 处理输入字符串
        const inputStr = countValue || priceStr;
        const cleanStr = inputStr.replace(/[^0-9.kKMB]/gi, '');
        if (!cleanStr) return 0;

        // 解析数字部分
        let multiplier = 1;
        let numStr = cleanStr;

        // 处理单位（大小写不敏感）
        const unit = cleanStr.slice(-1).toUpperCase();
        if (unit === 'K' || unit === 'k') {
            multiplier = 1000;
            numStr = cleanStr.slice(0, -1);
        } else if (unit === 'M') {
            multiplier = 1000000;
            numStr = cleanStr.slice(0, -1);
        } else if (unit === 'B') {
            multiplier = 1000000000;
            numStr = cleanStr.slice(0, -1);
        }

        const num = parseFloat(numStr);
        return isNaN(num) ? 0 : num * multiplier;
    }

    // 数字格式化函数（移除货币符号）
    function formatNumber(value) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    // 提取原始分类名称
    function extractOriginalCategories() {
        originalCategoryNames.clear();
        const labelElements = document.querySelectorAll(`[class^="Inventory_label__"] span`);
        labelElements.forEach(label => {
            const text = label.textContent;
            const category = text.includes('：') ? text.split('：')[0] : text;
            originalCategoryNames.add(category);
        });
    }

    // 主处理函数
    function processInventoryData() {
        // 提取原始分类名称
        extractOriginalCategories();

        // 重置数据
        categoryPrices = {};

        // 获取所有带有 class 属性的元素
        const elements = document.querySelectorAll('[class]');

        // 遍历所有元素，检查它们的类名
        elements.forEach(element => {
            getClassList(element).forEach(className => {
                if (className.startsWith('Item_itemContainer__')) {
                    const priceElement = element.querySelector('#script_stack_price');
                    const price = priceElement ? priceElement.textContent : '0';
                    const inventoryItemGridElement = element.closest('[class^="Inventory_itemGrid__"]');
                    const labelElement = inventoryItemGridElement?.querySelector('[class^="Inventory_label__"] span');

                    // 获取原始分类名称
                    let category = '未知分类';
                    if (labelElement) {
                        const text = labelElement.textContent;
                        category = text.includes('：') ? text.split('：')[0] : text;
                    }

                    // 检查物品类型
                    const isCowbell = element.querySelector('svg[aria-label="牛铃"]') !== null;
                    const isGoldCoin = element.querySelector('svg[aria-label="金币"]') !== null;
                    const isD1Coin = element.querySelector('svg[aria-label="奇幻代币"]') !== null;

                    // 获取价格
                    let parsedPrice = 0;
                    if (isGoldCoin) {
                        // 如果是金币，使用以 Item_count__ 开头的类中的值
                        const countElement = element.querySelector('[class^="Item_count__"]');
                        const countValue = countElement ? countElement.textContent : '';
                        parsedPrice = parsePrice('', countValue);
                    } else {
                        // 其他物品使用 script_stack_price 中的值
                        parsedPrice = parsePrice(price);
                    }

                    // 累加价格（排除牛铃）
                    if (parsedPrice > 0 && originalCategoryNames.has(category) && !isCowbell && !isD1Coin) {
                        categoryPrices[category] = (categoryPrices[category] || 0) + parsedPrice;
                    }
                }
            });
        });

        // 更新分类标签
        const labelElements = document.querySelectorAll(`[class^="Inventory_label__"] span`);
        labelElements.forEach(label => {
            const text = label.textContent;
            const category = text.includes('：') ? text.split('：')[0] : text;

            if (originalCategoryNames.has(category)) {
                const value = categoryPrices[category] || 0;
                label.textContent = value > 0 ? `${category}：${formatNumber(value)}` : category;
            }
        });

        // console.log(getMessage('dataRefreshed'));
    }

    // 初始处理
    processInventoryData();

    // 添加点击事件监听
    document.addEventListener('click', processInventoryData);
})();