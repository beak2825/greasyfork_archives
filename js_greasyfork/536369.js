// ==UserScript==
// @name         AsterDex一键买入卖出 - 增强版
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在AsterDex交易平台实现一键买入后立即卖出的功能（增强错误处理和日志记录）
// @author       @dami
// @match        https://www.asterdex.com/en/futures/v1/*
// @match        https://www.asterdex.com/*/futures/v1/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      www.asterdex.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536369/AsterDex%E4%B8%80%E9%94%AE%E4%B9%B0%E5%85%A5%E5%8D%96%E5%87%BA%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536369/AsterDex%E4%B8%80%E9%94%AE%E4%B9%B0%E5%85%A5%E5%8D%96%E5%87%BA%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        defaultLeverage: 100,         // 默认杠杆倍数
        defaultQuantity: 0.018,       // 默认交易数量
        buttonPosition: {             // 按钮位置
            top: '100px',
            right: '20px'
        },
        buttonStyle: {                // 按钮样式
            background: '#fcd535',
            color: '#000',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: '9999',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        },
        // 强制设置面板样式，确保文字可见
        panelStyle: {
            background: '#fff',
            color: '#000',            // 确保文字颜色为黑色
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            zIndex: '9998',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            width: '200px',
            fontSize: '14px'          // 添加字体大小
        },
        // 输入框样式
        inputStyle: {
            width: '100%',
            padding: '5px',
            boxSizing: 'border-box',
            color: '#000',            // 确保输入文字为黑色
            background: '#fff',       // 确保背景为白色
            border: '1px solid #ccc', // 添加边框
            borderRadius: '3px',      // 圆角边框
            fontSize: '14px'          // 设置字体大小
        },
        // 标签样式
        labelStyle: {
            display: 'block',
            marginBottom: '5px',
            color: '#000',            // 确保标签文字为黑色
            fontWeight: 'bold',       // 加粗标签文字
            fontSize: '14px'          // 设置字体大小
        },
        // 调试模式 - 启用详细日志记录
        debugMode: true
    };

    // 日志记录函数
    function logDebug(...args) {
        if (CONFIG.debugMode) {
            console.log('[AsterDex脚本]', ...args);
            GM_log('[AsterDex脚本]', ...args);
        }
    }

    // 添加全局变量存储捕获的CSRF令牌
    let cachedCsrfToken = null;

    // 从网络请求中捕获CSRF令牌
    function captureCSRFFromNetworkRequests() {
        logDebug('开始从网络请求中捕获CSRF令牌');

        // 创建XHR请求拦截器
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        // 拦截XHR请求头
        XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
            if (name.toLowerCase() === 'csrftoken' || name.toLowerCase() === 'x-csrf-token') {
                logDebug('从XHR请求头中捕获CSRF令牌:', value.substring(0, 4) + '**');
                cachedCsrfToken = value;
            }
            return originalSetRequestHeader.apply(this, arguments);
        };

        // 拦截fetch请求
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (options && options.headers) {
                const headers = options.headers;
                if (headers instanceof Headers) {
                    const csrfToken = headers.get('csrftoken') || headers.get('x-csrf-token');
                    if (csrfToken) {
                        logDebug('从Fetch请求头中捕获CSRF令牌:', csrfToken.substring(0, 4) + '**');
                        cachedCsrfToken = csrfToken;
                    }
                } else if (typeof headers === 'object') {
                    const csrfToken = headers['csrftoken'] || headers['x-csrf-token'] ||
                                     headers['CSRFToken'] || headers['X-CSRF-Token'];
                    if (csrfToken) {
                        logDebug('从Fetch请求头中捕获CSRF令牌:', csrfToken.substring(0, 4) + '**');
                        cachedCsrfToken = csrfToken;
                    }
                }
            }
            return originalFetch.apply(this, arguments);
        };

        // 不立即重置拦截器，让它持续捕获

        return null; // 初始返回null，捕获到后会设置cachedCsrfToken
    }

    // 修改获取CSRF Token函数
    function getCsrfToken() {
        try {
            // 首先检查是否已捕获到令牌
            if (cachedCsrfToken) {
                logDebug('使用已捕获的CSRF令牌:', cachedCsrfToken.substring(0, 4) + '****');
                return cachedCsrfToken;
            }

            // 尝试从cookies获取（原有方法，保留作为备选）
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'csrftoken') {
                    logDebug('从cookies获取CSRF令牌:', value.substring(0, 4) + '****');
                    return value;
                }
            }

            // 尝试从HTML中获取令牌
            const metaToken = document.querySelector('meta[name="csrf-token"]');
            if (metaToken) {
                const token = metaToken.getAttribute('content');
                logDebug('从META标签获取CSRF令牌:', token.substring(0, 4) + '****');
                return token;
            }

            // 尝试从localStorage或sessionStorage获取
            const localToken = localStorage.getItem('csrftoken') || sessionStorage.getItem('csrftoken');
            if (localToken) {
                logDebug('从Storage获取CSRF令牌:', localToken.substring(0, 4) + '****');
                return localToken;
            }

            // 如果还未开始网络捕获，启动它
            if (!window.csrfCaptureStarted) {
                window.csrfCaptureStarted = true;
                captureCSRFFromNetworkRequests();
                logDebug('已启动CSRF令牌网络捕获');
            }

            logDebug('警告: 未找到CSRF令牌');
            return '';
        } catch (error) {
            logDebug('获取CSRF令牌时出错:', error);
            return '';
        }
    }

    // 创建交易按钮
    function createTradeButton() {
        // 创建侧边栏容器
        const sidePanel = document.createElement('div');
        sidePanel.id = 'trade-side-panel';
        sidePanel.style.position = 'fixed';
        sidePanel.style.top = '140px';
        sidePanel.style.right = '-180px'; // 初始位置在屏幕外
        sidePanel.style.transition = 'right 0.3s ease-in-out';
        sidePanel.style.width = '180px';
        sidePanel.style.zIndex = '9998';
        sidePanel.style.display = 'flex';
        sidePanel.style.flexDirection = 'column';

        // 创建标签
        const tabElement = document.createElement('div');
        tabElement.id = 'side-panel-tab';
        tabElement.textContent = '交易助手';
        tabElement.style.position = 'absolute';
        tabElement.style.left = '-40px';
        tabElement.style.top = '0';
        tabElement.style.width = '40px';
        tabElement.style.height = '100px';
        tabElement.style.background = '#fcd535';
        tabElement.style.color = '#000';
        tabElement.style.borderRadius = '4px 0 0 4px';
        tabElement.style.display = 'flex';
        tabElement.style.alignItems = 'center';
        tabElement.style.justifyContent = 'center';
        tabElement.style.fontWeight = 'bold';
        tabElement.style.writingMode = 'vertical-lr';
        tabElement.style.textOrientation = 'mixed';
        tabElement.style.cursor = 'pointer';
        tabElement.style.boxShadow = '-2px 0 5px rgba(0,0,0,0.1)';
        tabElement.style.zIndex = '9999';

        sidePanel.appendChild(tabElement);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.background = '#fff';
        buttonContainer.style.padding = '10px';
        buttonContainer.style.borderRadius = '4px 0 0 4px';
        buttonContainer.style.boxShadow = '-2px 0 5px rgba(0,0,0,0.2)';

        // 创建交易按钮
        const button = document.createElement('button');
        button.id = 'one-click-trade-button';
        button.textContent = '一键买入卖出';
        button.style.width = '100%';
        button.style.padding = '10px 15px';
        button.style.marginBottom = '10px';

        // 应用按钮样式
        Object.keys(CONFIG.buttonStyle).forEach(key => {
            if (key !== 'position' && key !== 'top' && key !== 'right') { // 排除位置相关属性
                button.style[key] = CONFIG.buttonStyle[key];
            }
        });

        // 添加点击事件
        button.addEventListener('click', executeOneClickTrade);

        buttonContainer.appendChild(button);

        // 创建配置面板内容
        const configContent = document.createElement('div');
        configContent.innerHTML = `
            <h3 style="margin-top: 10px; margin-bottom: 10px; color: #000;">交易配置</h3>
            <div style="margin-bottom: 10px;">
                <label id="qty-label" style="display: block; margin-bottom: 5px; color: #000; font-weight: bold;">交易数量:</label>
                <input type="number" id="trade-quantity" value="${CONFIG.defaultQuantity}" step="0.001">
            </div>
            <div style="margin-bottom: 10px;">
                <label id="leverage-label" style="display: block; margin-bottom: 5px; color: #000; font-weight: bold;">杠杆倍数:</label>
                <input type="number" id="trade-leverage" value="${CONFIG.defaultLeverage}" min="1" max="125">
            </div>
            <div style="margin-bottom: 10px;">
                <label id="symbol-label" style="display: block; margin-bottom: 5px; color: #000; font-weight: bold;">交易对:</label>
                <input type="text" id="trade-symbol" value="BTCUSDT">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; color: #000; font-weight: bold;">
                    <input type="checkbox" id="debug-mode" ${CONFIG.debugMode ? 'checked' : ''}>
                    调试模式
                </label>
            </div>
        `;

        buttonContainer.appendChild(configContent);
        sidePanel.appendChild(buttonContainer);

        document.body.appendChild(sidePanel);

        // 添加鼠标悬停和离开事件
        sidePanel.addEventListener('mouseenter', function() {
            sidePanel.style.right = '0px';
        });

        sidePanel.addEventListener('mouseleave', function() {
            sidePanel.style.right = '-180px';
        });

        // 应用输入框样式
        const applyInputStyles = () => {
            const inputs = sidePanel.querySelectorAll('input[type="number"], input[type="text"]');
            inputs.forEach(input => {
                Object.keys(CONFIG.inputStyle).forEach(key => {
                    input.style[key] = CONFIG.inputStyle[key];
                });
            });
        };

        // 确保样式应用到所有输入框
        setTimeout(applyInputStyles, 100);

        // 添加调试模式切换事件
        const debugCheckbox = document.getElementById('debug-mode');
        if (debugCheckbox) {
            debugCheckbox.addEventListener('change', function() {
                CONFIG.debugMode = this.checked;
                logDebug('调试模式已' + (CONFIG.debugMode ? '启用' : '禁用'));
            });
        }

        logDebug('交易按钮和配置面板已创建');
    }

    // 获取用户身份信息
    function getUserInfo() {
        try {
            // 尝试从localStorage中获取用户信息
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsedInfo = JSON.parse(userInfo);
                logDebug('从localStorage获取到用户信息', parsedInfo.userId || '未知ID');
                return parsedInfo;
            }
            return null;
        } catch (error) {
            logDebug('获取用户信息出错:', error);
            return null;
        }
    }

    // 获取当前页面上显示的交易对
    function getCurrentSymbol() {
        try {
            // 尝试从URL中提取交易对
            const url = window.location.href;
            const match = url.match(/\/futures\/v1\/([A-Z0-9]+)/i);
            if (match && match[1]) {
                return match[1];
            }

            // 尝试从页面元素中获取交易对信息
            const symbolElements = document.querySelectorAll('h1, h2, .symbol, [data-symbol]');
            for (let elem of symbolElements) {
                if (elem.textContent && /[A-Z]{2,10}\/[A-Z]{2,5}|[A-Z]{2,10}USDT/.test(elem.textContent)) {
                    const symbolText = elem.textContent.match(/([A-Z]{2,10}\/[A-Z]{2,5}|[A-Z]{2,10}USDT)/)[0];
                    return symbolText.replace('/', '');
                }
                if (elem.getAttribute('data-symbol')) {
                    return elem.getAttribute('data-symbol');
                }
            }

            return 'BTCUSDT'; // 默认
        } catch (error) {
            logDebug('获取当前交易对出错:', error);
            return 'BTCUSDT'; // 默认
        }
    }

    // 生成随机客户端订单ID
    function generateClientOrderId() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'web_AD_';
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // 获取当前时间戳
    function getTimestamp() {
        return Date.now();
    }

    // 执行买入请求
    function executeBuyOrder(symbol, quantity) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCsrfToken();
            const clientOrderId = generateClientOrderId();
            const timestamp = getTimestamp();

            if (!csrfToken) {
                return reject(new Error('CSRF令牌获取失败，请重新登录'));
            }

            logDebug(`准备执行买入: 交易对=${symbol}, 数量=${quantity}, 订单ID=${clientOrderId}`);

            const requestData = {
                "symbol": symbol,
                "clientOrderId": clientOrderId,
                "placeType": "order-form",
                "positionSide": "BOTH",
                "reduceOnly": false,
                "side": "BUY",
                "quantity": quantity,
                "type": "MARKET",
                "timestamp": timestamp
            };

            logDebug('买入请求数据:', JSON.stringify(requestData));

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.asterdex.com/bapi/futures/v1/private/future/order/place-order',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
                    'clienttype': 'web',
                    'content-type': 'application/json',
                    'csrftoken': csrfToken,
                    'origin': 'https://www.asterdex.com',
                    'referer': `https://www.asterdex.com/en/futures/v1/${symbol}`,
                    'x-requested-with': 'XMLHttpRequest', // 添加额外的请求头
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors'
                },
                data: JSON.stringify(requestData),
                withCredentials: true,
                timeout: 10000, // 10秒超时
                onload: function(response) {
                    logDebug('买入订单响应状态:', response.status);
                    logDebug('买入订单响应头:', response.responseHeaders);

                    try {
                        const data = JSON.parse(response.responseText);
                        logDebug('买入订单详细响应:', data);

                        if (data && (data.code === 0 || data.code === '000000' || data.success === true)) {
                            resolve(data);
                        } else {
                            const errorMsg = data.msg || data.message || '未知错误';
                            logDebug('买入订单API错误:', errorMsg, data);
                            reject(new Error(`买入订单失败: ${errorMsg} (错误码: ${data.code})`));
                        }
                    } catch (e) {
                        logDebug('解析买入响应失败:', e.message, response.responseText);
                        reject(new Error(`解析买入响应失败: ${e.message}`));
                    }
                },
                onerror: function(error) {
                    logDebug('买入请求网络错误:', error);
                    reject(new Error(`买入请求网络错误: ${error.message || '连接失败'}`));
                },
                ontimeout: function() {
                    logDebug('买入请求超时');
                    reject(new Error('买入请求超时，请检查网络连接'));
                }
            });
        });
    }

    // 执行卖出请求
    function executeSellOrder(symbol, quantity, leverage) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCsrfToken();
            const clientOrderId = generateClientOrderId();
            const timestamp = getTimestamp();

            if (!csrfToken) {
                return reject(new Error('CSRF令牌获取失败，请重新登录'));
            }

            logDebug(`准备执行卖出: 交易对=${symbol}, 数量=${quantity}, 杠杆=${leverage}, 订单ID=${clientOrderId}`);

            const requestData = {
                "symbol": symbol,
                "clientOrderId": clientOrderId,
                "leverage": leverage,
                "type": "MARKET",
                "side": "SELL",
                "quantity": quantity,
                "positionSide": "BOTH",
                "reduceOnly": true,
                "newOrderRespType": "RESULT",
                "placeType": "position",
                "timestamp": timestamp
            };

            logDebug('卖出请求数据:', JSON.stringify(requestData));

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://www.asterdex.com/bapi/futures/v1/private/future/order/place-order',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
                    'clienttype': 'web',
                    'content-type': 'application/json',
                    'csrftoken': csrfToken,
                    'origin': 'https://www.asterdex.com',
                    'referer': `https://www.asterdex.com/en/futures/v1/${symbol}`,
                    'x-requested-with': 'XMLHttpRequest', // 添加额外的请求头
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors'
                },
                data: JSON.stringify(requestData),
                withCredentials: true,
                timeout: 10000, // 10秒超时
                onload: function(response) {
                    logDebug('卖出订单响应状态:', response.status);
                    logDebug('卖出订单响应头:', response.responseHeaders);

                    try {
                        const data = JSON.parse(response.responseText);
                        logDebug('卖出订单详细响应:', data);

                        if (data && (data.code === 0 || data.code === '000000' || data.success === true)) {
                            resolve(data);
                        } else {
                            const errorMsg = data.msg || data.message || '未知错误';
                            logDebug('卖出订单API错误:', errorMsg, data);
                            reject(new Error(`卖出订单失败: ${errorMsg} (错误码: ${data.code})`));
                        }
                    } catch (e) {
                        logDebug('解析卖出响应失败:', e.message, response.responseText);
                        reject(new Error(`解析卖出响应失败: ${e.message}`));
                    }
                },
                onerror: function(error) {
                    logDebug('卖出请求网络错误:', error);
                    reject(new Error(`卖出请求网络错误: ${error.message || '连接失败'}`));
                },
                ontimeout: function() {
                    logDebug('卖出请求超时');
                    reject(new Error('卖出请求超时，请检查网络连接'));
                }
            });
        });
    }

    // 检查账户状态
    function checkAccountStatus(symbol) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCsrfToken();

            if (!csrfToken) {
                return reject(new Error('CSRF令牌获取失败，请重新登录'));
            }

            logDebug(`检查账户状态: 交易对=${symbol}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.asterdex.com/bapi/futures/v1/private/future/account/balance`,
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'clienttype': 'web',
                    'csrftoken': csrfToken,
                    'origin': 'https://www.asterdex.com',
                    'referer': `https://www.asterdex.com/en/futures/v1/${symbol}`
                },
                withCredentials: true,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        logDebug('账户状态响应:', data);

                        if (data && data.code === 0) {
                            resolve(data);
                        } else {
                            const errorMsg = data.msg || '账户状态检查失败';
                            logDebug('账户状态检查错误:', errorMsg);
                            // 这里我们不拒绝，而是继续执行，因为这只是额外检查
                            resolve({error: errorMsg});
                        }
                    } catch (e) {
                        logDebug('解析账户状态响应失败:', e.message);
                        // 这里我们不拒绝，而是继续执行，因为这只是额外检查
                        resolve({error: '解析账户状态响应失败'});
                    }
                },
                onerror: function(error) {
                    logDebug('账户状态请求错误:', error);
                    // 这里我们不拒绝，而是继续执行，因为这只是额外检查
                    resolve({error: '账户状态请求错误'});
                }
            });
        });
    }

    // 显示通知
    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '4px';
        notification.style.color = '#fff';
        notification.style.background = isSuccess ? '#4CAF50' : '#F44336';
        notification.style.zIndex = '10000';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.fontSize = '14px';  // 设置字体大小
        notification.style.fontWeight = 'bold'; // 加粗文字
        notification.textContent = message;

        document.body.appendChild(notification);

        // 记录通知
        logDebug(`显示通知: ${message} (${isSuccess ? '成功' : '失败'})`);

        // 3秒后移除通知
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // 执行一键交易流程
    async function executeOneClickTrade() {
        try {
            // 获取配置值
            const quantityInput = document.getElementById('trade-quantity');
            const leverageInput = document.getElementById('trade-leverage');
            const symbolInput = document.getElementById('trade-symbol');

            const quantity = parseFloat(quantityInput.value);
            const leverage = parseInt(leverageInput.value);
            let symbol = symbolInput.value;

            // 验证输入
            if (isNaN(quantity) || quantity <= 0) {
                throw new Error('请输入有效的交易数量');
            }

            if (isNaN(leverage) || leverage < 1 || leverage > 125) {
                throw new Error('请输入有效的杠杆倍数(1-125)');
            }

            if (!symbol || symbol.trim() === '') {
                // 尝试自动获取当前页面的交易对
                symbol = getCurrentSymbol();
                if (symbol) {
                    symbolInput.value = symbol;
                    logDebug(`自动获取交易对: ${symbol}`);
                } else {
                    throw new Error('请输入有效的交易对');
                }
            }

            // 按钮状态更新
            const button = document.getElementById('one-click-trade-button');
            button.disabled = true;
            button.textContent = '交易进行中...';
            button.style.opacity = '0.7';

            // 检查账户状态（可选）
            logDebug('检查账户状态...');
            try {
                const accountStatus = await checkAccountStatus(symbol);
                if (accountStatus.error) {
                    logDebug('账户状态检查警告:', accountStatus.error);
                } else {
                    logDebug('账户状态检查通过');
                }
            } catch (statusError) {
                logDebug('账户状态检查错误:', statusError);
                // 我们不因为这个检查失败而终止交易流程
            }

            // 执行买入
            logDebug(`执行买入: ${symbol}, 数量: ${quantity}`);
            showNotification(`正在执行买入订单: ${symbol}, 数量: ${quantity}...`, true);
            const buyResult = await executeBuyOrder(symbol, quantity);
            logDebug('买入成功:', buyResult);
            showNotification(`买入成功: ${symbol}, 数量: ${quantity}`, true);

            // 小延迟以确保服务器处理完成
            logDebug('等待500毫秒后执行卖出...');
            await new Promise(resolve => setTimeout(resolve, 500));

            // 买入成功后立即卖出
            logDebug(`执行卖出: ${symbol}, 数量: ${quantity}, 杠杆: ${leverage}`);
            showNotification(`正在执行卖出订单: ${symbol}, 数量: ${quantity}...`, true);
            const sellResult = await executeSellOrder(symbol, quantity, leverage);
            logDebug('卖出成功:', sellResult);

            // 显示成功通知
            showNotification(`一键交易完成: ${symbol} 买入并卖出成功!`, true);

        } catch (error) {
            logDebug('交易执行错误:', error);
            showNotification(`交易失败: ${error.message}`, false);
        } finally {
            // 恢复按钮状态
            const button = document.getElementById('one-click-trade-button');
            button.disabled = false;
            button.textContent = '一键买入卖出';
            button.style.opacity = '1';
        }
    }

    // 修改样式覆盖函数
    function injectStyleOverrides() {
        const style = document.createElement('style');
        style.innerHTML = `
            #trade-side-panel {
                color: #000 !important;
                z-index: 99998 !important;
            }

            #side-panel-tab {
                color: #000 !important;
                background: #fcd535 !important;
                font-weight: bold !important;
                z-index: 99999 !important;
            }

            #one-click-trade-button {
                color: #000 !important;
                background: #fcd535 !important;
                font-weight: bold !important;
                font-size: 14px !important;
                z-index: 9999 !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
            }

            #trade-side-panel h3,
            #trade-side-panel label {
                color: #000 !important;
                font-weight: bold !important;
            }

            #trade-side-panel input[type="number"],
            #trade-side-panel input[type="text"] {
                color: #000 !important;
                background: #fff !important;
                border: 1px solid #ccc !important;
                width: 100% !important;
                padding: 5px !important;
                box-sizing: border-box !important;
                border-radius: 3px !important;
            }
        `;
        document.head.appendChild(style);
        logDebug('样式覆盖已注入');
    }

    // 修改onPageLoad函数，移除对createConfigPanel的调用
    function onPageLoad() {
        console.log('AsterDex一键买入卖出增强脚本开始加载');

        // 立即开始捕获CSRF令牌
        captureCSRFFromNetworkRequests();
        window.csrfCaptureStarted = true;
        logDebug('已启动CSRF令牌网络捕获');

        // 等待页面元素加载
        const checkInterval = setInterval(() => {
            // 检查页面是否已经完全加载
            if (document.readyState === 'complete') {
                clearInterval(checkInterval);

                // 页面加载完成，添加交易按钮
                setTimeout(() => {
                    injectStyleOverrides(); // 先注入样式覆盖
                    createTradeButton(); // 现在这个函数同时创建按钮和配置面板
                    console.log('AsterDex一键买入卖出增强脚本已加载完成');
                    logDebug('脚本初始化完成');
                }, 1500); // 等待1.5秒确保页面完全渲染
            }
        }, 500);
    }

    // 初始化
    onPageLoad();
})();