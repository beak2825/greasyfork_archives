// ==UserScript==
// @name         Binance Futures Price Display Updated with Dynamic Update and Decimal Adjustment
// @namespace    http://tampermonkey.net/
// @version      0.62
// @description  Display current price from Binance Futures in the bottom right corner of the page, with dynamic update for new symbols and adjusted decimals.
// @author       YourName
// @match        https://www.binance.com/*futures/*
// @grant        none
// @run-at       document_end
// @downloadURL https://update.greasyfork.org/scripts/490346/Binance%20Futures%20Price%20Display%20Updated%20with%20Dynamic%20Update%20and%20Decimal%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/490346/Binance%20Futures%20Price%20Display%20Updated%20with%20Dynamic%20Update%20and%20Decimal%20Adjustment.meta.js
// ==/UserScript==

const symbolTickSizes = {
    "BTCUSDT": 0.10,
    "ETHUSDT": 0.01,
    "BCHUSDT": 0.01,
    "XRPUSDT": 0.0001,
    "EOSUSDT": 0.001,
    "LTCUSDT": 0.01,
    "TRXUSDT": 0.00001,
    "ETCUSDT": 0.001,
    "LINKUSDT": 0.001,
    "XLMUSDT": 0.00001,
    "ADAUSDT": 0.00010,
    "XMRUSDT": 0.01,
    "DASHUSDT": 0.01,
    "ZECUSDT": 0.01,
    "XTZUSDT": 0.001,
    "BNBUSDT": 0.010,
    "ATOMUSDT": 0.001,
    "ONTUSDT": 0.0001,
    "IOTAUSDT": 0.0001,
    "BATUSDT": 0.0001,
    "VETUSDT": 0.000001,
    "NEOUSDT": 0.001,
    "QTUMUSDT": 0.001,
    "IOSTUSDT": 0.000001,
    "THETAUSDT": 0.0001,
    "ALGOUSDT": 0.0001,
    "ZILUSDT": 0.00001,
    "KNCUSDT": 0.00010,
    "ZRXUSDT": 0.0001,
    "COMPUSDT": 0.01,
    "OMGUSDT": 0.0001,
    "DOGEUSDT": 0.000010,
    "SXPUSDT": 0.0001,
    "KAVAUSDT": 0.0001,
    "BANDUSDT": 0.0001,
    "RLCUSDT": 0.0001,
    "WAVESUSDT": 0.0001,
    "MKRUSDT": 0.10,
    "SNXUSDT": 0.001,
    "DOTUSDT": 0.001,
    "DEFIUSDT": 0.1,
    "YFIUSDT": 1,
    "BALUSDT": 0.001,
    "CRVUSDT": 0.001,
    "TRBUSDT": 0.001,
    "RUNEUSDT": 0.0010,
    "SUSHIUSDT": 0.0001,
    "SRMUSDT": 0.0001,
    "EGLDUSDT": 0.010,
    "SOLUSDT": 0.0010,
    "ICXUSDT": 0.0001,
    "STORJUSDT": 0.0001,
    "BLZUSDT": 0.00001,
    "UNIUSDT": 0.0010,
    "AVAXUSDT": 0.0010,
    "FTMUSDT": 0.000100,
    "HNTUSDT": 0.0010,
    "ENJUSDT": 0.00010,
    "FLMUSDT": 0.0001,
    "TOMOUSDT": 0.0001,
    "RENUSDT": 0.00001,
    "KSMUSDT": 0.010,
    "NEARUSDT": 0.0010,
    "AAVEUSDT": 0.010,
    "FILUSDT": 0.001,
    "RSRUSDT": 0.000001,
    "LRCUSDT": 0.00010,
    "MATICUSDT": 0.00010,
    "OCEANUSDT": 0.00010,
    "CVCUSDT": 0.00001,
    "BELUSDT": 0.00010,
    "CTKUSDT": 0.00010,
    "AXSUSDT": 0.00100,
    "ALPHAUSDT": 0.00001,
    "ZENUSDT": 0.001,
    "SKLUSDT": 0.00001,
    "GRTUSDT": 0.00001,
    "1INCHUSDT": 0.0001,
    "CHZUSDT": 0.00001,
    "SANDUSDT": 0.00010,
    "ANKRUSDT": 0.000010,
    "BTSUSDT": 0.00001,
    "LITUSDT": 0.001,
    "UNFIUSDT": 0.001,
    "REEFUSDT": 0.000001,
    "RVNUSDT": 0.00001,
    "SFPUSDT": 0.0001,
    "XEMUSDT": 0.0001,
    "BTCSTUSDT": 0.001,
    "COTIUSDT": 0.00001,
    "CHRUSDT": 0.0001,
    "MANAUSDT": 0.0001,
    "ALICEUSDT": 0.001,
    "HBARUSDT": 0.00001,
    "ONEUSDT": 0.00001,
    "LINAUSDT": 0.00001,
    "STMXUSDT": 0.00001,
    "DENTUSDT": 0.000001,
    "CELRUSDT": 0.00001,
    "HOTUSDT": 0.000001,
    "MTLUSDT": 0.0001,
    "OGNUSDT": 0.0001,
    "NKNUSDT": 0.00001,
    "SCUSDT": 0.000001,
    "DGBUSDT": 0.00001,
    "1000SHIBUSDT": 0.000001,
    "BAKEUSDT": 0.0001,
    "GTCUSDT": 0.001,
    "BTCDOMUSDT": 0.1,
    "IOTXUSDT": 0.00001,
    "AUDIOUSDT": 0.0001,
    "RAYUSDT": 0.001,
    "C98USDT": 0.0001,
    "MASKUSDT": 0.0010,
    "ATAUSDT": 0.0001,
    "DYDXUSDT": 0.001,
    "1000XECUSDT": 0.00001,
    "GALAUSDT": 0.00001,
    "CELOUSDT": 0.001,
    "ARUSDT": 0.001,
    "KLAYUSDT": 0.0001,
    "ARPAUSDT": 0.00001,
    "CTSIUSDT": 0.0001,
    "LPTUSDT": 0.001,
    "ENSUSDT": 0.001,
    "PEOPLEUSDT": 0.00001,
    "ANTUSDT": 0.001,
    "ROSEUSDT": 0.00001,
    "DUSKUSDT": 0.00001,
    "FLOWUSDT": 0.001,
    "IMXUSDT": 0.0001,
    "API3USDT": 0.0001,
    "GMTUSDT": 0.00010,
    "APEUSDT": 0.0001,
    "WOOUSDT": 0.00001,
    "FTTUSDT": 0.0001,
    "JASMYUSDT": 0.000001,
    "DARUSDT": 0.0001,
    "GALUSDT": 0.00010,
    "OPUSDT": 0.0001000,
    "INJUSDT": 0.001000,
    "STGUSDT": 0.0001000,
    "FOOTBALLUSDT": 0.01000,
    "SPELLUSDT": 0.0000001,
    "1000LUNCUSDT": 0.0000100,
    "LUNA2USDT": 0.0001000,
    "LDOUSDT": 0.000100,
    "CVXUSDT": 0.001000,
    "ICPUSDT": 0.001000,
    "APTUSDT": 0.00100,
    "QNTUSDT": 0.010000,
    "BLUEBIRDUSDT": 0.00100,
    "FETUSDT": 0.0001000,
    "FXSUSDT": 0.001000,
    "HOOKUSDT": 0.000100,
    "MAGICUSDT": 0.000100,
    "TUSDT": 0.0000100,
    "RNDRUSDT": 0.000100,
    "HIGHUSDT": 0.000100,
    "MINAUSDT": 0.0001000,
    "ASTRUSDT": 0.0000100,
    "AGIXUSDT": 0.0001000,
    "PHBUSDT": 0.0001000,
    "GMXUSDT": 0.010000,
    "CFXUSDT": 0.0000100,
    "STXUSDT": 0.0001000,
    "COCOSUSDT": 0.001000,
    "BNXUSDT": 0.000100,
    "ACHUSDT": 0.0000010,
    "SSVUSDT": 0.010000,
    "CKBUSDT": 0.0000010,
    "PERPUSDT": 0.000100,
    "TRUUSDT": 0.0000100,
    "LQTYUSDT": 0.000100,
    "USDCUSDT": 0.0000010,
    "IDUSDT": 0.0001000,
    "ARBUSDT": 0.000100,
    "JOEUSDT": 0.0001000,
    "TLMUSDT": 0.0000010,
    "AMBUSDT": 0.0000010,
    "LEVERUSDT": 0.0000001,
    "RDNTUSDT": 0.0000100,
    "HFTUSDT": 0.0001000,
    "XVSUSDT": 0.001000,
    "BLURUSDT": 0.0001000,
    "EDUUSDT": 0.0001000,
    "IDEXUSDT": 0.0000100,
    "SUIUSDT": 0.000100,
    "1000PEPEUSDT": 0.0000001,
    "1000FLOKIUSDT": 0.000100,
    "UMAUSDT": 0.001000,
    "RADUSDT": 0.000100,
    "KEYUSDT": 0.0000010,
    "COMBOUSDT": 0.000100,
    "NMRUSDT": 0.010000,
    "MAVUSDT": 0.0001000,
    "MDTUSDT": 0.0000100,
    "XVGUSDT": 0.0000010,
    "WLDUSDT": 0.0001000,
    "PENDLEUSDT": 0.0001000,
    "ARKMUSDT": 0.0001000,
    "AGLDUSDT": 0.0001000,
    "YGGUSDT": 0.0001000,
    "DODOXUSDT": 0.0000010,
    "BNTUSDT": 0.0001000,
    "OXTUSDT": 0.0000100,
    "SEIUSDT": 0.0001000,
    "CYBERUSDT": 0.001000,
    "HIFIUSDT": 0.0001000,
    "ARKUSDT": 0.0001000,
    "FRONTUSDT": 0.0001000,
    "GLMRUSDT": 0.0001000,
    "BICOUSDT": 0.0001000,
    "STRAXUSDT": 0.0001000,
    "LOOMUSDT": 0.0000100,
    "BIGTIMEUSDT": 0.0001000,
    "BONDUSDT": 0.001000,
    "ORBSUSDT": 0.0000100,
    "STPTUSDT": 0.0000100,
    "WAXPUSDT": 0.0000100,
    "BSVUSDT": 0.01000,
    "RIFUSDT": 0.0000100,
    "POLYXUSDT": 0.0000100,
    "GASUSDT": 0.001000,
    "POWRUSDT": 0.0001000,
    "SLPUSDT": 0.0000010,
    "TIAUSDT": 0.0001000,
    "SNTUSDT": 0.0000100,
    "CAKEUSDT": 0.0001000,
    "MEMEUSDT": 0.0000010,
    "TWTUSDT": 0.000100,
    "TOKENUSDT": 0.0000100,
    "ORDIUSDT": 0.001000,
    "STEEMUSDT": 0.000010,
    "BADGERUSDT": 0.001000,
    "ILVUSDT": 0.01000,
    "NTRNUSDT": 0.000100,
    "MBLUSDT": 0.0000010,
    "KASUSDT": 0.0000100,
    "BEAMXUSDT": 0.0000010,
    "1000BONKUSDT": 0.0000010,
    "PYTHUSDT": 0.0001000,
    "SUPERUSDT": 0.0001000,
    "USTCUSDT": 0.0000100,
    "ONGUSDT": 0.0000100,
    "ETHWUSDT": 0.001000,
    "JTOUSDT": 0.000100,
    "1000SATSUSDT": 0.0000001,
    "AUCTIONUSDT": 0.001000,
    "1000RATSUSDT": 0.0000100,
    "ACEUSDT": 0.000100,
    "MOVRUSDT": 0.001000,
    "NFPUSDT": 0.0001000,
    "AIUSDT": 0.000010,
    "XAIUSDT": 0.0001000,
    "WIFUSDT": 0.0001000,
    "MANTAUSDT": 0.0001000,
    "ONDOUSDT": 0.0001000,
    "LSKUSDT": 0.000100,
    "ALTUSDT": 0.0000100,
    "JUPUSDT": 0.0001000,
    "ZETAUSDT": 0.000100,
    "RONINUSDT": 0.000100,
    "DYMUSDT": 0.001000,
    "OMUSDT": 0.0000100,
    "PIXELUSDT": 0.0001000,
    "STRKUSDT": 0.0001000,
    "MAVIAUSDT": 0.0001000,
    "GLMUSDT": 0.0001000,
    "PORTALUSDT": 0.0001000,
    "TONUSDT": 0.0001000,
    "AXLUSDT": 0.0001000,
    "MYROUSDT": 0.0000100,
    "METISUSDT": 0.0100,
    "AEVOUSDT": 0.0010000,
    "VANRYUSDT": 0.0000100,
    "ENAUSDT": 0.00100,
    "BOMEUSDT": 0.0000010,
    "ETHFIUSDT": 0.0010000
};


(function() {
    'use strict';

    // 全局变量存储选中的金额
    let selectedAmount = 100; // 默认值或初始值

    // 创建面板
    const panel = document.createElement('div');
    panel.style = 'position: fixed; bottom: 50%; left: 50%; transform: translate(-50%, 50%); background: rgba(255, 255, 255, 0.9); border: 1px solid black; padding: 20px; z-index: 10000; font-size: 16px; display: flex; flex-direction: column; align-items: center; cursor: move; width: 300px; height: 725px; overflow: hidden;';
    panel.style.boxSizing = 'border-box'; // 确保元素的尺寸计算方式包括内容、内边距和边框
    document.body.appendChild(panel);

    // 创建可拖动功能
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    panel.onmousedown = function(e) {
        if (e.target !== panel) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = panel.offsetLeft;
        startTop = panel.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault(); // 防止默认元素拖动行为
    };

    function onMouseMove(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        panel.style.left = startLeft + deltaX + 'px';
        panel.style.top = startTop + deltaY + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    let lastSymbol = null;
    let ws = null;

    function extractSymbol() {
        const paths = location.pathname.split('/');
        const futuresIndex = paths.findIndex(path => path.toLowerCase() === 'futures');
        if (futuresIndex !== -1 && futuresIndex + 1 < paths.length) {
            return paths[futuresIndex + 1].toUpperCase();
        }
        return null;
    }

    function subscribeToSymbol(symbol) {
        if (symbol === lastSymbol) return;
        lastSymbol = symbol;

        if (ws) {
            ws.close();
            ws = null;
        }

        const wsUrl = `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`;
        ws = new WebSocket(wsUrl);

        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const price = parseFloat(data.p).toFixed(8); // 解析价格并保留小数位

            // Binance的时间戳是以毫秒为单位的
            const serverTime = data.E; // 事件的时间戳
            const localTime = Date.now(); // 本地时间戳，也是以毫秒为单位
            const delay = localTime - serverTime; // 计算延迟，单位毫秒

            updatePriceDisplay(symbol, price, delay); // 更新价格显示，并传递延迟参数
        };

        ws.onerror = function(event) {
            console.error('WebSocket error for symbol', symbol, event);
        };

        console.log(`Subscribed to ${symbol}`);
    }

    function getDecimalPlaces(tickSize) {
        if (tickSize === 0) return 0; // 如果tickSize为0，则直接返回0
        const tickSizeStr = tickSize.toString();
        // 处理科学记数法
        if (tickSizeStr.includes("e-")) {
            return parseInt(tickSizeStr.split("e-")[1], 10);
        }
        // 正常小数
        const decimalPart = tickSizeStr.split(".")[1];
        return decimalPart ? decimalPart.length : 0;
    }

    function monitorUrlChange() {
        const currentSymbol = extractSymbol();
        subscribeToSymbol(currentSymbol);
    }

    monitorUrlChange();

    let lastUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            monitorUrlChange();
        }
    }, 1000);

    window.onbeforeunload = function() {
        if (ws) {
            ws.close();
        }
    };

    // 修改或新增函数
    function updatePriceDisplay(symbol, price, delay) {
        let containerDiv = document.getElementById('pricePanel');
        if (!containerDiv) {
            containerDiv = document.createElement('div');
            containerDiv.id = 'pricePanel';
            panel.appendChild(containerDiv);
        }

        const tickSize = symbolTickSizes[symbol] || 0.01;
        const decimalPlaces = getDecimalPlaces(tickSize);

        // Ensuring container is empty before filling it again
        containerDiv.innerHTML = '';

        // Adding price entries above current price
        for (let i = 10; i >= 1; i--) {
            const priceIncrement = price * (1 + i / 1000);
            createPriceEntry(containerDiv, priceIncrement.toFixed(decimalPlaces), 'increment', i);
        }

        // Adding current price
        const currentPriceDiv = document.createElement('div');
        currentPriceDiv.textContent = `${symbol}: $${parseFloat(price).toFixed(decimalPlaces)}`;
        currentPriceDiv.style.color = 'black'; // 设置当前价格的文本颜色为不透明的黑色
        currentPriceDiv.style.fontSize = '20px'; // 设置当前价格的字体大小
        containerDiv.appendChild(currentPriceDiv);

        // Adding price entries below current price
        for (let i = 1; i <= 10; i++) {
            const priceDecrement = price * (1 - i / 1000);
            createPriceEntry(containerDiv, priceDecrement.toFixed(decimalPlaces), 'decrement', -i); // 使用负索引
        }

        // 添加延迟信息显示
        const delayDisplay = document.createElement('div');
        delayDisplay.textContent = `延迟: ${delay}毫秒`;
        delayDisplay.style.color = 'black'; // 设置延迟信息的文本颜色为不透明的黑色
        containerDiv.appendChild(delayDisplay);
    }

    // 创建金额选项按钮
    function createAmountButtons(container) {
        const amounts = [100, 500, 1000, 2000];

        const amountButtonsDiv = document.createElement('div');
        amountButtonsDiv.id = 'amountButtons';
        amountButtonsDiv.style.display = 'flex';
        amountButtonsDiv.style.justifyContent = 'space-between';
        amountButtonsDiv.style.width = '100%';
        amountButtonsDiv.style.marginTop = '10px'; // 按钮上边距
        amountButtonsDiv.style.marginBottom = '10px'; // 按钮下边距

        amounts.forEach(amount => {
            const button = document.createElement('button');
            button.textContent = `$${amount}`;
            button.style.width = '60px'; // 按钮宽度
            button.style.height = '30px'; // 按钮高度
            button.style.fontSize = '14px'; // 按钮字体大小
            button.style.cursor = 'pointer'; // 鼠标样式为指针
            button.onclick = function() {
                handleAmountSelection(amount);
            };
            amountButtonsDiv.appendChild(button);
        });

        container.appendChild(amountButtonsDiv);
    }

    // 处理金额选项的选择
    function handleAmountSelection(amount) {
        selectedAmount = amount; // 更新全局变量的值

        const amountButtonsDiv = document.getElementById('amountButtons');
        if (!amountButtonsDiv) return;

        // 遍历所有按钮，取消选中状态
        const buttons = amountButtonsDiv.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.backgroundColor = ''; // 清除按钮背景颜色
        });

        // 设置选中按钮的背景颜色
        const selectedButton = Array.from(buttons).find(button => button.textContent === `$${amount}`);
        if (selectedButton) {
            selectedButton.style.backgroundColor = 'lightblue';
        }

        // 在此处执行选中金额后的逻辑，例如发送订单等
        console.log(`Selected amount: $${amount}`);
    }

    function createPriceEntry(container, price, type, index) {
        const entryDiv = document.createElement('div');
        entryDiv.style.display = 'flex';
        entryDiv.style.justifyContent = 'space-between';
        entryDiv.style.width = '100%';
        entryDiv.style.margin = '2px 0';

        // Buy button
        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.style.width = '70px'; // 按钮宽度
        buyButton.style.height = '25px'; // 按钮高度
        buyButton.style.fontSize = '12px'; // 按钮字体大小
        buyButton.style.cursor = 'pointer'; // 鼠标样式为指针
        buyButton.setAttribute('data-type', 'buy'); // 设置data-type属性
        buyButton.setAttribute('data-index', index); // 设置data-index属性
        buyButton.onclick = function() {
            sendOrder('buy', price);
            buyButton.classList.add('clicked');
            setTimeout(() => buyButton.classList.remove('clicked'), 100);
        };
        entryDiv.appendChild(buyButton);

        // Price display
        const priceDiv = document.createElement('div');
        priceDiv.textContent = price;
        priceDiv.style.width = '130px'; // 价格显示宽度
        priceDiv.style.height = '25px'; // 价格显示高度与按钮一致
        priceDiv.style.textAlign = 'center'; // 文字居中
        priceDiv.style.color = 'black'; // 价格数字颜色为黑色
        priceDiv.style.fontSize = '16px'; // 文字大小
        entryDiv.appendChild(priceDiv);

        // Sell button
        const sellButton = document.createElement('button');
        sellButton.textContent = 'Sell';
        sellButton.style.width = '70px'; // 按钮宽度
        sellButton.style.height = '25px'; // 按钮高度
        sellButton.style.fontSize = '12px'; // 按钮字体大小
        sellButton.style.cursor = 'pointer'; // 鼠标样式为指针
        sellButton.setAttribute('data-type', 'sell'); // 设置data-type属性
        sellButton.setAttribute('data-index', index); // 设置data-index属性
        sellButton.onclick = function() {
            sendOrder('sell', price);
            sellButton.classList.add('clicked');
            setTimeout(() => sellButton.classList.remove('clicked'), 100);
        };
        entryDiv.appendChild(sellButton);

        container.appendChild(entryDiv);
    }

    // 创建金额选项按钮
    createAmountButtons(panel);

    // 全局定义快捷键映射
    const keyMap = {
        '1': { type: 'buy', index: 1 },
        '2': { type: 'buy', index: 2 },
        '3': { type: 'buy', index: 3 },
        '4': { type: 'buy', index: 4 },
        '5': { type: 'buy', index: 5 },
        '6': { type: 'sell', index: 1 },
        '7': { type: 'sell', index: 2 },
        '8': { type: 'sell', index: 3 },
        '9': { type: 'sell', index: 4 },
        '0': { type: 'sell', index: 5 },
        'Shift+1': { type: 'buy', index: -1 },
        'Shift+2': { type: 'buy', index: -2 },
        'Shift+3': { type: 'buy', index: -3 },
        'Shift+4': { type: 'buy', index: -4 },
        'Shift+5': { type: 'buy', index: -5 },
        'Shift+6': { type: 'sell', index: -1 },
        'Shift+7': { type: 'sell', index: -2 },
        'Shift+8': { type: 'sell', index: -3 },
        'Shift+9': { type: 'sell', index: -4 },
        'Shift+0': { type: 'sell', index: -5 },
    };

    // 统一的事件监听器
    document.addEventListener('keydown', function(event) {
        const key = event.shiftKey ? 'Shift+' + event.key : event.key;
        const action = keyMap[key];
        if (action) {
            const type = action.type;
            const index = action.index;
            const button = document.querySelector(`button[data-type="${type}"][data-index="${index}"]`);
            if (button) {
                button.click();
                button.style.backgroundColor = 'yellow'; // 提供点击视觉反馈
                setTimeout(() => {
                    button.style.backgroundColor = ''; // 恢复原样
                }, 100);
            }
        }
    });

    // 发送订单函数
    function sendOrder(type, price) {
        const amount = selectedAmount; // 使用全局变量获取选中的金额值
        const orderType = type;

        console.log(`Sending order: ${orderType} at ${price} with amount ${amount}`);

        // 发送请求到服务器
        fetch('https://run.mocky.io/v3/5b3aeb03-7fdf-489d-926e-07ed22fec354', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price,
                amount,
                type: orderType,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order successful:', data);
            // 这里可以添加一些成功提交订单后的行为
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
})();
