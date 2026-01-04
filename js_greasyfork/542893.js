// ==UserScript==
// @name         AGSV股票自动挂单买卖（带日志面板）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  根据设定的价格条件自动买入、卖出、借入和归还股票，并在页面上显示日志面板
// @author       AGSV骄阳
// @match        https://stock.agsvpt.cn/*
// @grant        GM_xmlhttpRequest
// @icon         https://stock.agsvpt.cn/plugins/stock/favicon.svg
// @downloadURL https://update.greasyfork.org/scripts/542893/AGSV%E8%82%A1%E7%A5%A8%E8%87%AA%E5%8A%A8%E6%8C%82%E5%8D%95%E4%B9%B0%E5%8D%96%EF%BC%88%E5%B8%A6%E6%97%A5%E5%BF%97%E9%9D%A2%E6%9D%BF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542893/AGSV%E8%82%A1%E7%A5%A8%E8%87%AA%E5%8A%A8%E6%8C%82%E5%8D%95%E4%B9%B0%E5%8D%96%EF%BC%88%E5%B8%A6%E6%97%A5%E5%BF%97%E9%9D%A2%E6%9D%BF%EF%BC%89.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    /*** 日志面板模块 ***/
    (function createLogPanel() {
        const logPanel = document.createElement("div");
        logPanel.id = "logPanel";
        logPanel.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            background: rgba(0,0,0,0.85);
            color: #0f0;
            font-size: 12px;
            font-family: monospace;
            padding: 4px;
            z-index: 99999;
        `;
        document.body.appendChild(logPanel);

        function writeLog(type, args) {
            const msg = Array.from(args).map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" ");
            const line = document.createElement("div");
            line.style.whiteSpace = "pre-wrap";
            if (type === "warn") line.style.color = "yellow";
            if (type === "error") line.style.color = "red";
            if (type === "log") line.style.color = "#0f0";
            line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logPanel.appendChild(line);
            logPanel.scrollTop = logPanel.scrollHeight; // 自动滚动到底部
        }

        // 代理 console 输出
        const rawLog = console.log;
        const rawWarn = console.warn;
        const rawError = console.error;

        console.log = function () {
            writeLog("log", arguments);
            rawLog.apply(console, arguments);
        };
        console.warn = function () {
            writeLog("warn", arguments);
            rawWarn.apply(console, arguments);
        };
        console.error = function () {
            writeLog("error", arguments);
            rawError.apply(console, arguments);
        };
    })();

    // ======================== 以下是你的原始脚本逻辑 ========================
    // API基础URL
    const API_BASE_URL = 'https://stock.agsvpt.cn/api';
    const CONFIG = {
        STOCK_INFO_URL: `${API_BASE_URL}/stocks/info`, // 股票信息请求的URL
        TOKEN_KEY: 'auth_token', // 存储token的键名
    };

    // 获取当前时间的字符串（上海时区）
    function getCurrentTime() {
        const now = new Date();
        const offset = 8; // 上海时区偏移量（UTC+8）
        const localTime = new Date(now.getTime() + offset * 60 * 60 * 1000); // 调整为上海时间
        return localTime.toISOString().replace('T', ' ').substring(0, 19); // 格式化为 'YYYY-MM-DD HH:MM:SS'
    }

    // 自动弹出设置框，获取用户输入的交易参数
    const userInput = await createInputDialog();
    if (!userInput) return; // 如果用户取消，则退出

    main(userInput); // 进入主逻辑

    // 创建输入对话框以获取用户的交易设置
    function createInputDialog() {
        return new Promise((resolve) => {
            const dialogHtml = `
                <div id="inputDialog" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; border:1px solid #ccc; z-index:1000;">
                    <h2>设置股票交易参数</h2>
                    <label for="operationMode">选择交易模式:</label>
                    <select id="operationMode">
                        <option value="trade">本金模式</option>
                        <option value="borrow">借入模式</option>
                    </select><br><br>

                    <label for="stockCode">股票代码:</label>
                    <select id="stockCode">
                        <option value="TSLA">TSLA</option>
                        <option value="AAPL">AAPL</option>
                        <option value="GOOGL">GOOGL</option>
                    </select><br><br>

                    <div id="tradeSettings">
                        <label for="buyPrice">买入价格:</label>
                        <input type="number" id="buyPrice" value="1500" step="0.01"><br><br>

                        <label for="sellPrice">卖出价格:</label>
                        <input type="number" id="sellPrice" value="1800" step="0.01"><br><br>

                        <label for="buyQuantity">买入数量:</label>
                        <input type="number" id="buyQuantity" value="10000" min="1"><br><br>

                        <label for="sellQuantity">卖出数量:</label>
                        <input type="number" id="sellQuantity" value="10000" min="1"><br><br>
                    </div>

                    <div id="borrowSettings" style="display:none;">
                        <label for="borrowPrice">借入价格:</label>
                        <input type="number" id="borrowPrice" value="1800" step="0.01"><br><br>

                        <label for="returnPrice">归还价格:</label>
                        <input type="number" id="returnPrice" value="1600" step="0.01"><br><br>

                        <label for="borrowQuantity">借入数量:</label>
                        <input type="number" id="borrowQuantity" value="10000" min="1"><br><br>
                    </div>

                    <label for="checkInterval">检查间隔 (秒):</label>
                    <input type="number" id="checkInterval" value="30" min="1"><br><br>

                    <button id="submitBtn">确认</button>
                    <button id="cancelBtn">取消</button>
                </div>
                <div id="overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"></div>
            `;

            // 将对话框HTML插入到页面中
            document.body.insertAdjacentHTML('beforeend', dialogHtml);

            // 根据操作模式显示相应的设置
            const operationModeSelect = document.getElementById('operationMode');
            operationModeSelect.onchange = function () {
                const tradeSettings = document.getElementById('tradeSettings');
                const borrowSettings = document.getElementById('borrowSettings');

                if (operationModeSelect.value === 'trade') {
                    tradeSettings.style.display = 'block'; // 显示本金模式设置
                    borrowSettings.style.display = 'none'; // 隐藏借入模式设置
                } else {
                    tradeSettings.style.display = 'none'; // 隐藏本金模式设置
                    borrowSettings.style.display = 'block'; // 显示借入模式设置
                }
            };

            // 确认按钮事件
            document.getElementById('submitBtn').onclick = function () {
                const operationMode = document.getElementById('operationMode').value; // 获取操作模式
                const stockCode = document.getElementById('stockCode').value; // 获取股票代码
                const buyPrice = parseFloat(document.getElementById('buyPrice').value); // 获取买入价格
                const sellPrice = parseFloat(document.getElementById('sellPrice').value); // 获取卖出价格
                const borrowPrice = parseFloat(document.getElementById('borrowPrice').value); // 获取借入价格
                const returnPrice = parseFloat(document.getElementById('returnPrice').value); // 获取归还价格
                const buyQuantity = parseInt(document.getElementById('buyQuantity').value, 10); // 获取买入数量
                const sellQuantity = parseInt(document.getElementById('sellQuantity').value, 10); // 获取卖出数量
                const borrowQuantity = parseInt(document.getElementById('borrowQuantity').value, 10); // 获取借入数量
                const checkInterval = parseInt(document.getElementById('checkInterval').value, 10) * 1000; // 转换为毫秒

                // 输入验证
                if (operationMode === 'trade' &&
                    (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(buyQuantity) || isNaN(sellQuantity) ||
                        buyQuantity <= 0 || sellQuantity <= 0)) {
                    alert('请输入有效的买入和卖出价格及数量');
                    return;
                }

                if (operationMode === 'borrow' &&
                    (isNaN(borrowPrice) || isNaN(returnPrice) || isNaN(borrowQuantity) ||
                        borrowQuantity <= 0)) {
                    alert('请输入有效的借入和归还价格及数量');
                    return;
                }

                // 关闭对话框并返回用户输入
                document.getElementById('inputDialog').remove();
                document.getElementById('overlay').remove();
                resolve({
                    operationMode,
                    stockCode,
                    buyPrice,
                    sellPrice,
                    borrowPrice,
                    returnPrice,
                    buyQuantity,
                    sellQuantity,
                    borrowQuantity,
                    checkInterval
                });
            };

            // 取消按钮事件
            document.getElementById('cancelBtn').onclick = function () {
                document.getElementById('inputDialog').remove();
                document.getElementById('overlay').remove();
                resolve(null);
            };
        });
    }

    // 获取当前股票价格
    async function getCurrentPrice(stockCode) {
        const url = `${CONFIG.STOCK_INFO_URL}?code=${stockCode}`; // 股票信息请求
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.TOKEN_KEY) // 使用本地存储中的token
                }
            });

            if (!response.ok) {
                throw new Error('网络响应不正常');
            }

            // 解析响应数据
            const data = await response.json();
            const stockInfo = data.find(stock => stock.code === stockCode); // 查找对应的股票信息
            return stockInfo ? stockInfo.price : undefined; // 返回价格
        } catch (error) {
            console.error(`[${getCurrentTime()}] 获取当前价格时发生错误:`, error); // 打印错误信息时附加时间
            return undefined; // 发生错误返回undefined
        }
    }

    // 获取当前可借入的订单信息
    async function getBorrowOrders(stockCode) {
        const url = `${API_BASE_URL}/user/leveraged`; // 获取借入订单的API URL
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.TOKEN_KEY) // 使用本地存储中的token
                }
            });

            if (!response.ok) {
                throw new Error('获取借入订单失败');
            }

            // 解析响应数据
            const data = await response.json();
            return data; // 返回借入订单信息
        } catch (error) {
            console.error(`[${getCurrentTime()}] 获取借入订单时发生错误:`, error); // 打印错误信息时附加时间
            return [];
        }
    }

    // 借入股票的函数
    async function borrowStock(stockCode, quantity) {
        const url = `${API_BASE_URL}/stocks/${stockCode}/borrow`; // 借入股票的API URL
        try {
            const response = await fetch(url, {
                method: 'POST', // 使用POST方法
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.TOKEN_KEY), // 认证token
                    'Content-Type': 'application/json' // 请求体格式为JSON
                },
                body: JSON.stringify({ quantity }) // 请求体内容
            });

            if (!response.ok) {
                throw new Error('借入请求失败');
            }
            console.log(`[${getCurrentTime()}] 成功借入 ${quantity} 股 ${stockCode}`); // 打印成功信息时附加时间
        } catch (error) {
            console.error(`[${getCurrentTime()}] 借入股票时发生错误:`, error); // 打印错误信息时附加时间
        }
    }

    // 归还股票的函数
    async function returnStock(stockCode, quantity, orderId) {
        const url = `${API_BASE_URL}/stocks/${stockCode}/repay`; // 归还股票的API URL
        try {
            const response = await fetch(url, {
                method: 'POST', // 使用POST方法
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.TOKEN_KEY), // 认证token
                    'Content-Type': 'application/json' // 请求体格式为JSON
                },
                body: JSON.stringify({ order_id: orderId, quantity }) // 请求体内容
            });

            if (!response.ok) {
                throw new Error('归还请求失败');
            }
            console.log(`[${getCurrentTime()}] 成功归还 ${quantity} 股 ${stockCode}`); // 打印成功信息时附加时间
        } catch (error) {
            console.error(`[${getCurrentTime()}] 归还股票时发生错误:`, error); // 打印错误信息时附加时间
        }
    }

    // 买入股票的函数
    async function buyStock(stockCode, quantity) {
        const url = `${API_BASE_URL}/stocks/${stockCode}/buy`; // 买入股票的API URL
        try {
            const response = await fetch(url, {
                method: 'POST', // 使用POST方法
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.TOKEN_KEY), // 认证token
                    'Content-Type': 'application/json' // 请求体格式为JSON
                },
                body: JSON.stringify({ quantity }) // 请求体内容
            });

            if (!response.ok) {
                throw new Error('买入请求失败');
            }
            console.log(`[${getCurrentTime()}] 成功买入 ${quantity} 股 ${stockCode}`); // 打印成功信息时附加时间
        } catch (error) {
            console.error(`[${getCurrentTime()}] 买入股票时发生错误:`, error); // 打印错误信息时附加时间
        }
    }

    // 卖出股票的函数
    async function sellStock(stockCode, quantity) {
        const url = `${API_BASE_URL}/stocks/${stockCode}/sell`; // 卖出股票的API URL
        try {
            const response = await fetch(url, {
                method: 'POST', // 使用POST方法
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(CONFIG.TOKEN_KEY), // 认证token
                    'Content-Type': 'application/json' // 请求体格式为JSON
                },
                body: JSON.stringify({ quantity }) // 请求体内容
            });

            if (!response.ok) {
                throw new Error('卖出请求失败');
            }
            console.log(`[${getCurrentTime()}] 成功卖出 ${quantity} 股 ${stockCode}`); // 打印成功信息时附加时间
        } catch (error) {
            console.error(`[${getCurrentTime()}] 卖出股票时发生错误:`, error); // 打印错误信息时附加时间
        }
    }

    // 主逻辑函数，根据用户输入进行操作
    async function main(userInput) {
        const {
            operationMode,
            stockCode,
            buyPrice,
            sellPrice,
            borrowPrice,
            returnPrice,
            buyQuantity,
            sellQuantity,
            borrowQuantity,
            checkInterval
        } = userInput;

        let lastActionTime = 0; // 用于限制操作频率
        const actionCooldown = 60000; // 操作间隔时间 (60秒)

        while (true) {
            try {
                const currentPrice = await getCurrentPrice(stockCode); // 获取当前价格

                // 在获取当前价格时输出当前设定的模式、价格和数量
                if (currentPrice !== undefined) {
                    console.log(`[${getCurrentTime()}] 当前价格: ${currentPrice}`);
                    console.log(`[${getCurrentTime()}] 当前设定: 交易模式: ${operationMode}, ` +
                        (operationMode === 'trade' ? `买入价格: ${buyPrice}, 卖出价格: ${sellPrice}, 买入数量: ${buyQuantity}, 卖出数量: ${sellQuantity}` :
                        `借入价格: ${borrowPrice}, 归还价格: ${returnPrice}, 借入数量: ${borrowQuantity}`));
                } else {
                    console.warn(`[${getCurrentTime()}] 无法获取 ${stockCode} 的当前价格`); // 如果当前价格获取失败，打印警告信息
                }

                if (currentPrice !== undefined) {
                    const currentTime = Date.now();
                    if (currentTime - lastActionTime < actionCooldown) {
                        console.warn(`[${getCurrentTime()}] 系统限制1分钟交易一次，请稍后再试`); // 提示用户
                    } else {
                        if (operationMode === 'trade') {
                            // 本金模式
                            if (currentPrice <= buyPrice) {
                                await buyStock(stockCode, buyQuantity); // 触发买入操作
                                lastActionTime = currentTime; // 更新操作时间
                            } else if (currentPrice >= sellPrice) {
                                await sellStock(stockCode, sellQuantity); // 触发卖出操作
                                lastActionTime = currentTime; // 更新操作时间
                            }
                        } else if (operationMode === 'borrow') {
                            // 借入模式
                            if (currentPrice >= borrowPrice) {
                                await borrowStock(stockCode, borrowQuantity); // 触发借入操作
                                lastActionTime = currentTime; // 更新操作时间
                            } else if (currentPrice <= returnPrice) {
                                let borrowOrders = await getBorrowOrders(stockCode); // 获取当前借入订单
                                borrowOrders = borrowOrders.data;
                                const todayDateStr = new Date(Date.now()).toLocaleDateString('zh-CN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                if (borrowOrders.length > 0) {
                                    for (const order of borrowOrders) {
                                        if (order.code != stockCode) {
                                            continue;
                                        }
                                        const orderId = order.id; // 获取每一个借入订单ID
                                        const num = order.shares;
                                        const orderDateStr = new Date(order.time).toLocaleDateString('zh-CN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });
                                        if (orderDateStr == todayDateStr) {
                                            console.log(`[${getCurrentTime()}] 订单ID ${orderId} 的 ${num} 股 ${stockCode} 尚未到可归还时间`);
                                            continue;
                                        }
                                        await returnStock(stockCode, num, orderId); // 触发归还操作
                                        console.log(`[${getCurrentTime()}] 归还订单ID ${orderId} 的 ${num} 股 ${stockCode}`); // 打印归还成功信息
                                        console.log("单次逻辑仅归还一条订单, 等待下个循环");
                                        break;
                                    }
                                    lastActionTime = currentTime; // 更新操作时间
                                } else {
                                    console.warn(`[${getCurrentTime()}] 没有可归还的借入订单`); // 如果没有可归还的订单，打印警告信息
                                }
                            }
                        }
                    }
                }

                await new Promise(resolve => setTimeout(resolve, checkInterval)); // 根据设定的间隔检查价格
            } catch (error) {
                console.error(`[${getCurrentTime()}] 发生错误:`, error); // 发生错误时打印错误信息
                await new Promise(resolve => setTimeout(resolve, checkInterval)); // 遇到错误时也延迟检查
            }
        }
    }
})();
