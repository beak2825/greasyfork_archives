// ==UserScript==
// @name         Pionex Arbitrage Profit Estimator
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Calculate and display estimated arbitrage profit difference with clickable divs for target profit rates
// @match        https://www.pionex.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533895/Pionex%20Arbitrage%20Profit%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/533895/Pionex%20Arbitrage%20Profit%20Estimator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseValue(value) {
        return parseFloat(value.replace(/,/g, '')) || 0; // 去除千位分隔符
    }
    function simulateInput(element, value) {
        // 確保元素獲得焦點
        element.focus();
        // 選取文本
        element.select();
        // 刪除原有內容
        document.execCommand('selectAll', false, null); // 選取所有文本
        document.execCommand('delete', false, null); // 刪除選取的文本
        // 插入新值
        document.execCommand('insertText', false, value);

    }
    function calculateRequiredRowValue(targetRate, bottomValue, topValue) {
        const range = topValue - bottomValue;
        const fee = 0.0002;
        const netTransaction = 1 - fee * 2;
        let blocks = 0;
        let profit_rate_list = [];
        console.log(`range: ${range}`);
        // 計算每格的利潤率
        for (let n = 2; n < 1000; n++) { // 假設最多計算 1000 格
            //console.log(`網格數為: ${n}`);
            const avg_block_price = range / n ; // 每個網格的價格
            //console.log(`每個網格的價格: ${avg_block_price}`);
            //const blockProfit_rate_upper = ((topValue - (topValue- avg_block_price))/ (topValue- avg_block_price)) * netTransaction * 100; // 每格利潤率
            //const blockProfit_rate_lower = (((bottomValue + avg_block_price) - (bottomValue))/ bottomValue) * netTransaction * 100;
            const blockProfit_rate_upper = (avg_block_price/ (topValue- avg_block_price)) *netTransaction* 100 ; // 每格利潤率
            const blockProfit_rate_lower = (avg_block_price/ bottomValue) *netTransaction* 100 ;

            // 確保利潤率細過或等於 targetRate
            if (blockProfit_rate_upper <= targetRate || blockProfit_rate_lower <= targetRate ) {
                console.log(`網格數為: ${n}`);
                console.log(`每個網格的價格: ${avg_block_price}`);
                console.log(`利潤率上限: ${blockProfit_rate_upper}`);
                console.log(`利潤率下限: ${blockProfit_rate_lower}`);
                blocks = n ;
                break; // 找到滿足條件的格數後跳出
            }
        }
        if( blocks >=2){
            const block_price = range / blocks;
            for ( let n = 0 ; n <= blocks ; n++){
                const old_price = bottomValue + block_price * n;
                const new_price = bottomValue + block_price * (n + 1);
                const block_profit_rate = (( new_price - old_price) / old_price) *netTransaction* 100;
                profit_rate_list.push(block_profit_rate);
            }

        }
        //console.log(`利潤率列表: ${profit_rate_list}`); // 打印利潤率列表
        const avg_profit_rate = profit_rate_list.reduce((a, b) => a + b, 0) / profit_rate_list.length ;
        const profit_rate_max = Math.max(...profit_rate_list) || 0;
        const profit_rate_min = Math.min(...profit_rate_list) || 0;

        console.log(`平均利潤率: ${avg_profit_rate}`);
        console.log(`利潤率上限: ${profit_rate_max}`);
        console.log(`利潤率下限: ${profit_rate_min}`);
        return blocks; // 返回計算出的網格數
    }

    function setRowValue(rate) {
        const bottomInput = document.evaluate('//input[@placeholder="最低價(USDT)"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const topInput = document.evaluate('//input[@placeholder="最高價 (USDT)"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (bottomInput && topInput) {
            const bottomValue = parseValue(bottomInput.value);
            const topValue = parseValue(topInput.value);
            const requiredRows = calculateRequiredRowValue(rate, bottomValue, topValue);

            const rowInput = document.evaluate('//input[@placeholder="網格個數"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (rowInput) {
                simulateInput(rowInput, requiredRows); // 使用 simulateInput 更新網格數量
            }
        }
    }

    function createClickableDivs(referWrapDiv, existingProfitDiff) {
        const rates = [0.1, 0.2, 0.3, 0.4, 0.5];
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex'; // 使用 Flexbox 來並列顯示按鈕
        buttonContainer.style.marginTop = '10px';

        rates.forEach(rate => {
            const div = document.createElement('div');
            div.textContent = `${rate}%`;
            div.style.backgroundColor = 'black';
            div.style.color = 'white';
            div.style.padding = '5px 5px';
            div.style.margin = '0 2px';
            div.style.cursor = 'pointer';
            div.style.userSelect = 'none'; // 禁止選取文本

            div.onclick = function() {
                setRowValue(rate); // 獨立計算所需的 rowValue
            };

            buttonContainer.appendChild(div);
        });

        // 確保按鈕容器只創建一次
        if (!document.getElementById('profit-buttons-container')) {
            buttonContainer.id = 'profit-buttons-container';
            existingProfitDiff.parentNode.insertBefore(buttonContainer, existingProfitDiff.nextSibling); // 在 existingProfitDiff 之後插入
        }
    }

    function calculateProfitDifference() {
        const bottomInput = document.evaluate('//input[@placeholder="最低價(USDT)"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const topInput = document.evaluate('//input[@placeholder="最高價 (USDT)"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const rowInput = document.evaluate('//input[@placeholder="網格個數"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (bottomInput && topInput && rowInput) {
            const bottomValue = parseValue(bottomInput.value);
            const topValue = parseValue(topInput.value);
            const rowValue = parseInt(rowInput.value) || 1; // 避免除以零

            const profitDifference = (topValue - bottomValue) / rowValue;

            let referWrapDiv = document.evaluate('//div[contains(@class, "pi-input-refer-wrap") and .//div[contains(@class, "text-secondary text-sm font-r")]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (referWrapDiv) {
                let existingProfitDiff = document.getElementById('arbitrage-profit-difference');
                if (!existingProfitDiff) {
                    existingProfitDiff = document.createElement('div');
                    existingProfitDiff.id = 'arbitrage-profit-difference';
                    existingProfitDiff.className = 'pi-input-refer-wrap text-secondary text-sm font-r'; // 新的樣式
                    referWrapDiv.parentNode.insertBefore(existingProfitDiff, referWrapDiv.nextSibling); // 在 referWrapDiv 之後插入
                }

                // 更新顯示內容
                existingProfitDiff.textContent = `預估每次套利相差: ${profitDifference.toFixed(2)} USDT`;

                // 創建可點擊的 div
                createClickableDivs(referWrapDiv, existingProfitDiff);
            }
        }
    }

    // 每秒檢查一次
    setInterval(calculateProfitDifference, 1000);
})();