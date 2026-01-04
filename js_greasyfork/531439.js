// ==UserScript==
// @name         meme模拟器
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Monitor box with input, button, and display on gmgn.ai
// @author       nians
// @match        https://gmgn.ai/*/token/*
// @grant        none
// @license MIT
// @license
// @downloadURL https://update.greasyfork.org/scripts/531439/meme%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531439/meme%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 根据URL确定货币单位
    const getCurrencyUnit = () => {
        const url = window.location.href;
        if (url.includes('https://gmgn.ai/sol/token/')) return 'SOL';
        if (url.includes('https://gmgn.ai/bsc/token/')) return 'BNB';
        if (url.includes('https://gmgn.ai/eth/token/')) return 'ETH';
        if (url.includes('https://gmgn.ai/base/token/')) return 'ETH';
        if (url.includes('https://gmgn.ai/tron/token/')) return 'TRX';
        return 'Unknown';
    };

    const currencyUnit = getCurrencyUnit();

    // 创建容器
    const container = document.createElement('div');
    container.id = 'monitorBox';
    document.body.appendChild(container);

    // 添加样式
    const styles = `
        #monitorBox {
            position: fixed;
            top: 60%;
            right: 81%;
            width: 280px;
            height: 350px;
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 9999;
            color: #fff;
            font-family: 'Courier New', monospace;
        }

        #monitorInput, #monitorButton, #monitorDisplay, #closeButton {
            width: 100%;
            box-sizing: border-box;
            border: none;
            border-radius: 8px;
            padding: 10px;
            font-size: 14px;
        }

        #monitorInput {
            background: #333;
            color: #fff;
            outline: none;
        }

        #monitorButton {
            background: #007bff;
            color: #fff;
            cursor: pointer;
            transition: background 0.3s;
        }

        #monitorButton:hover {
            background: #0056b3;
        }

        #monitorDisplay {
            background: #444;
            color: #0f0;
            height: 120px;
            overflow-y: auto;
            resize: none;
            font-family: 'Courier New', monospace;
            text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }

        #buttonContainer {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        #channelButton, #authorButton, #closeButton {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 8px;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
            transition: transform 0.2s, box-shadow 0.2s;
            text-align: center;
            text-decoration: none;
        }

        #channelButton {
            background: #87CEEB;
        }

        #authorButton {
            background: #FFB6C1;
        }

        #closeButton {
            background: #ff0000;
            margin-top: 10px;
        }

        #channelButton:hover, #authorButton:hover, #closeButton:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        #channelButton:active, #authorButton:active, #closeButton:active {
            transform: translateY(0);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 创建输入框
    const input = document.createElement('input');
    input.id = 'monitorInput';
    input.placeholder = `请输入购买金额 (${currencyUnit})...`;
    container.appendChild(input);

    // 创建货币单位标签
    const currencyLabel = document.createElement('span');
    currencyLabel.textContent = ` ${currencyUnit}`;
    currencyLabel.style.color = '#fff';
    currencyLabel.style.position = 'absolute';
    currencyLabel.style.right = '30px';
    currencyLabel.style.top = '25px';
    container.appendChild(currencyLabel);

    // 创建按钮
    const button = document.createElement('button');
    button.id = 'monitorButton';
    button.textContent = '购买';
    container.appendChild(button);

    // 创建显示框
    const display = document.createElement('textarea');
    display.id = 'monitorDisplay';
    display.readOnly = true;
    display.placeholder = '显示收益...';
    container.appendChild(display);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
    container.appendChild(buttonContainer);

    // 创建频道按钮
    const channelButton = document.createElement('a');
    channelButton.id = 'channelButton';
    channelButton.textContent = '频道';
    channelButton.href = 'https://t.me/pumpadd';
    channelButton.target = '_blank';
    buttonContainer.appendChild(channelButton);

    // 创建作者按钮
    const authorButton = document.createElement('a');
    authorButton.id = 'authorButton';
    authorButton.textContent = '作者';
    authorButton.href = 'https://t.me/nians26';
    authorButton.target = '_blank';
    buttonContainer.appendChild(authorButton);

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.textContent = '关闭模拟';
    container.appendChild(closeButton);

    // 数据存储
    let purchaseData = {
        amount: 0,
        initialMarketCap: 0,
        tokenName: '',
        currentMarketCap: 0,
        solPrice: 0
    };

    let updateInterval = null;

    // 转换市值单位
    function parseMarketCap(text) {
        text = text.replace('$', '');
        if (text.includes('K')) return parseFloat(text.replace('K', '')) * 1000;
        if (text.includes('M')) return parseFloat(text.replace('M', '')) * 1000000;
        if (text.includes('B')) return parseFloat(text.replace('B', '')) * 1000000000;
        return parseFloat(text);
    }

    // 获取市场和代币名称的函数
    function getMarketData() {
        try {
            const marketCapElement = document.querySelector('div.css-b5f2qn');
            const tokenNameElement = document.querySelector('p.css-1jhlptf');
            const solPriceElement = document.querySelector('div.css-1czhozd');

            if (!marketCapElement) throw new Error('无法找到市值元素 (div.css-b5f2qn)');
            if (!tokenNameElement) throw new Error('无法找到代币名称元素 (p.css-1jhlptf)');
            if (!solPriceElement) throw new Error('无法找到SOL价格元素 (div.css-1czhozd)');

            const marketCapText = marketCapElement.textContent.trim();
            const tokenNameText = tokenNameElement.textContent.trim();
            const solPriceText = solPriceElement.textContent.trim();

            const marketCap = parseMarketCap(marketCapText);
            const tokenName = tokenNameText;

            const solPriceMatch = solPriceText.match(/\$[\d.]+/);
            if (!solPriceMatch) throw new Error(`无法解析${currencyUnit}价格\n市值原始文本: "${marketCapText}"\n代币名称原始文本: "${tokenNameText}"\n${currencyUnit}价格原始文本: "${solPriceText}"`);

            const solPrice = parseFloat(solPriceMatch[0].replace('$', ''));
            if (isNaN(solPrice)) throw new Error(`${currencyUnit}价格解析结果不是有效数字: "${solPriceMatch[0]}"\n市值原始文本: "${marketCapText}"\n代币名称原始文本: "${tokenNameText}"\n${currencyUnit}价格原始文本: "${solPriceText}"`);

            return { marketCap, tokenName, solPrice };
        } catch (error) {
            display.value = `错误: ${error.message}`;
            return null;
        }
    }

    // 计算收益百分比
    function calculateProfit(initialCap, currentCap) {
        const change = ((currentCap - initialCap) / initialCap) * 100;
        return change.toFixed(2);
    }

    // 计算USD收益
    function calculateUSDProfit(amount, solPrice, profitPercent) {
        const usdInvested = amount * solPrice;
        const profit = (usdInvested * profitPercent) / 100;
        return profit.toFixed(2);
    }

    // 更新显示
    function updateDisplay() {
        if (purchaseData.amount > 0) {
            const data = getMarketData();
            if (data) {
                purchaseData.currentMarketCap = data.marketCap;
                purchaseData.solPrice = data.solPrice || 0;
                const profitPercent = calculateProfit(purchaseData.initialMarketCap, purchaseData.currentMarketCap);
                const usdProfit = purchaseData.solPrice > 0
                    ? calculateUSDProfit(purchaseData.amount, purchaseData.solPrice, profitPercent)
                    : "未知 (-50%)";

                const formatMarketCap = (cap) => {
                    if (cap >= 1000000000) return (cap / 1000000000).toFixed(2) + 'B';
                    if (cap >= 1000000) return (cap / 1000000).toFixed(2) + 'M';
                    if (cap >= 1000) return (cap / 1000).toFixed(2) + 'K';
                    return cap.toFixed(2);
                };

                const initialCapFormatted = formatMarketCap(purchaseData.initialMarketCap);
                const currentCapFormatted = formatMarketCap(purchaseData.currentMarketCap);

                display.value = `购买的市值为: $${initialCapFormatted}\n当前的市值为: $${currentCapFormatted}\n本次模拟收益为: $${usdProfit} (${profitPercent}%)`;
            }
        }
    }

    // 按钮点击事件
    button.addEventListener('click', () => {
        const inputValue = parseFloat(input.value.trim());
        if (inputValue && inputValue > 0) {
            const data = getMarketData();
            if (data) {
                purchaseData.amount = inputValue;
                purchaseData.initialMarketCap = data.marketCap;
                purchaseData.tokenName = data.tokenName;
                purchaseData.currentMarketCap = data.marketCap;
                purchaseData.solPrice = data.solPrice;
                display.value = `购买 ${data.tokenName}\n金额: ${inputValue} ${currencyUnit}\n市值: $${data.marketCap}`;

                if (updateInterval) clearInterval(updateInterval);
                updateInterval = setInterval(updateDisplay, 5000);
            }
        } else {
            display.value = '请输入有效金额！';
        }
    });

    // 关闭按钮事件
    closeButton.addEventListener('click', () => {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        purchaseData = {
            amount: 0,
            initialMarketCap: 0,
            tokenName: '',
            currentMarketCap: 0,
            solPrice: 0
        };
        input.value = '';
        display.value = '模拟已关闭';
    });
})();