// ==UserScript==
// @name         产品SKU多国定价显示器
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  在商品编辑页显示不同子SKU在不同国家的定价状况，全站显示悬浮窗，URL变化自动更新，并自动捕获AUTH_TOKEN。妈的，又他妈的升级了，这次引入了汇率获取、人民币转换，并支持国家白名单/黑名单过滤！现在列表页也能显示所有SKU的价格了，而且能自动识别表格内容变化并刷新！
// @author       混世魔王导师
// @match        https://haihuiselling.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545796/%E4%BA%A7%E5%93%81SKU%E5%A4%9A%E5%9B%BD%E5%AE%9A%E4%BB%B7%E6%98%BE%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545796/%E4%BA%A7%E5%93%81SKU%E5%A4%9A%E5%9B%BD%E5%AE%9A%E4%BB%B7%E6%98%BE%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    let currentAuthToken = "Waiting for token..."; // 用于存储捕获到的Token
    let dynamicSkuColumnSelector = null; // 用于存储动态识别到的SKU列选择器 (产品编辑页)
    let dynamicOperationColumnSelector = null; // 用于存储动态识别到的操作列选择器 (产品列表页)
    let exchangeRatesMap = {}; // 用于存储汇率信息 { 'USD': 7.1888, 'GBP': 9.6549, ... }
    let tableContentObserver = null; // 持久化的MutationObserver，用于监听表格内容变化

    // 妈的，这个函数是用来等元素出现的，别他妈的再问我为什么表格没加载出来了！
    function waitForElement(selector, timeout = 10000, interval = 100) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`操！等待元素超时：${selector}`));
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

    // --- 用户配置 ---
    // 妈的，这里是国家显示过滤配置！

    // countryFilterMode: 'none' (不过滤), 'whitelist' (白名单，只显示列表中的国家), 'blacklist' (黑名单，隐藏列表中的国家)
    const countryFilterMode = 'whitelist'; // 默认不过滤，如果你想过滤，改成 'whitelist' 或 'blacklist'
    // countryFilterList: 过滤的国家代码列表，用逗号分隔，例如 ['US', 'CA', 'MX']
    const countryFilterList = ['US', 'CA', 'MX']; // 妈的，把你想过滤的国家代码写这里！

    // 妈的，国家代码到全名的映射表，别他妈的再问我为什么没有全名了！
    const countryNames = {
        'US': '美国',
        'CA': '加拿大',
        'MX': '墨西哥',
        'GB': '英国',
        'DE': '德国',
        'FR': '法国',
        'IT': '意大利',
        'ES': '西班牙',
        'NL': '荷兰',
        'SE': '瑞典',
        'PL': '波兰',
        'SA': '沙特阿拉伯',
        'JP': '日本',
        'AU': '澳大利亚',
        'AE': '阿联酋',
        'SG': '新加坡',
        'IN': '印度',
        'BR': '巴西',
        'ZH': '中国', // 假设'ZH'是产品价格对象中中国的国家代码
        'KR': '韩国',
        'RU': '俄罗斯',
        'PH': '菲律宾', // ISO国家代码 for Philippines
        'MY': '马来西亚',
        'TW': '中国台湾', // ISO国家代码 for Taiwan
        'ID': '印度尼西亚', // ISO国家代码 for Indonesia
        'TH': '泰国',
        'VN': '越南',
        'CO': '哥伦比亚',
        'CL': '智利',
        'AR': '阿根廷',
        'HU': '匈牙利',
        'CZ': '捷克',
        'TR': '土耳其',
        'BG': '保加利亚',
        'DK': '丹麦',
        'NO': '挪威',
        'EG': '埃及',
        'NZ': '新西兰',
        'HK': '中国香港',
        'CNH': '离岸人民币', // 如果CNH作为国家键出现在产品价格对象中，则保留
        // 如果有新的国家，你他妈的自己往这里加！
    };

    // 菜鸟，首先创建悬浮窗，让用户知道脚本在运行
    createStatusWindow();

    // 监听URL变化
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('操！URL变了：', location.href);
            // URL变化时，重置所有动态选择器，强制重新识别
            dynamicSkuColumnSelector = null;
            dynamicOperationColumnSelector = null;
            processCurrentPage();
        }
    }, 500); // 每0.5秒检查一次URL变化

    // 页面加载时也处理一次
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始处理');
        // 确保在页面加载时也重置选择器，以防缓存了旧的
        dynamicSkuColumnSelector = null;
        dynamicOperationColumnSelector = null;
        processCurrentPage();
    });

    // --- Token 自动捕获逻辑 ---
    // 拦截 setRequestHeader 以获取 token
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        if (name.toLowerCase() === 'token' && value) {
            if (currentAuthToken !== value) { // 只有当token发生变化时才更新
                currentAuthToken = value;
                console.log('操！AUTH_TOKEN 自动捕获到了：', currentAuthToken);
                updateTokenDisplay(); // 捕获到新Token时更新显示
                // 捕获到新Token后，立即尝试获取汇率和定价数据
                processCurrentPage();
            }
        }
        originalSetRequestHeader.apply(this, arguments);
    };

    // 创建状态悬浮窗
    function createStatusWindow() {
        // 移除旧的状态窗口（如果有）
        const oldWindow = document.getElementById('pricingStatusWindow');
        if (oldWindow) oldWindow.remove();

        // 创建新窗口
        const statusWindow = document.createElement('div');
        statusWindow.id = 'pricingStatusWindow';
        statusWindow.innerHTML = `
            <div class="header">
                <span>产品定价显示器</span>
                <button class="close-btn">✖</button>
            </div>
            <div class="content">
                <p id="pricingMessage">脚本正在运行...</p>
                <div class="status">状态: <span id="pricingStatusText" class="ready">就绪</span></div>
                <div class="token-status">Token: <span id="currentTokenDisplay">Waiting...</span></div>
            </div>
        `;
        document.body.appendChild(statusWindow);

        // 添加样式
        GM_addStyle(`
            #pricingStatusWindow {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 280px;
                background-color: rgba(40, 44, 52, 0.95);
                border: 1px solid #61dafb;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #f0f0f0;
                overflow: hidden;
                backdrop-filter: blur(5px);
            }
            #pricingStatusWindow .header {
                background-color: #20232a;
                padding: 10px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #61dafb;
            }
            #pricingStatusWindow .header span {
                font-weight: bold;
                color: #61dafb;
            }
            #pricingStatusWindow .close-btn {
                background: none;
                border: none;
                color: #f0f0f0;
                font-size: 18px;
                cursor: pointer;
                padding: 0 5px;
            }
            #pricingStatusWindow .close-btn:hover {
                color: #61dafb;
            }
            #pricingStatusWindow .content {
                padding: 15px;
            }
            #pricingStatusWindow .content p {
                margin: 8px 0;
                line-height: 1.4;
            }
            #pricingStatusWindow .status {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px dashed #444;
                font-size: 13px;
            }
            #pricingStatusWindow .ready {
                color: #4caf50;
                font-weight: bold;
            }
            #pricingStatusWindow .working {
                color: #ffc107;
                font-weight: bold;
            }
            #pricingStatusWindow .error {
                color: #f44336;
                font-weight: bold;
            }
            #pricingStatusWindow .token-status {
                margin-top: 10px;
                font-size: 12px;
                color: #bbb;
                word-break: break-all; /* 防止长token溢出 */
            }
            #pricingStatusWindow .token-status #currentTokenDisplay {
                color: #61dafb;
                font-weight: bold;
            }
            /* 以下是用于横向显示SKU定价的样式 */
            .horizontal-pricing-container {
                font-size: 12px;
                color: #333;
                background-color: transparent;
                border: none;
                padding: 0;
                border-radius: 0;
                box-shadow: none;
                word-break: normal;
            }
            .no-data-message {
                color: #9E9E9E;
                font-style: italic;
                font-size: 12px;
                text-align: center;
            }

            /* 新增样式：用于显示定价信息的新行 */
            .pricing-info-row {
                background-color: #f9f9f9;
                border-bottom: 1px solid #eee;
            }
            .pricing-info-row:last-of-type {
                border-bottom: none;
            }
            .pricing-info-cell {
                padding: 8px 15px;
                text-align: left;
            }
            .pricing-info-cell .horizontal-pricing-container {
                margin-top: 0;
                font-size: 13px;
                color: #555;
                background-color: transparent;
                border: none;
                padding: 0;
                border-radius: 0;
                box-shadow: none;

                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .pricing-info-cell .horizontal-pricing-container .country-price-item {
                background-color: #e0f7fa;
                color: #00796b;
                padding: 4px 10px;
                border-radius: 5px;
                border: 1px solid #b2ebf2;
                font-weight: normal;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                display: inline-flex;
                align-items: center;
            }
            /* 妈的，这里把粗体去掉了，因为你他妈的不要了 */
            .pricing-info-cell .horizontal-pricing-container .country-price-item strong {
                color: #004d40;
                margin-right: 4px;
                font-weight: normal; /* 改为 normal */
            }
            .pricing-info-cell .no-data-message {
                margin-top: 0;
                text-align: left;
                padding: 6px 10px;
                background-color: #f0f0f0;
                border: 1px dashed #ccc;
                border-radius: 6px;
            }
            /* 新增样式：用于产品列表页多变体显示 */
            .variant-pricing-block {
                margin-bottom: 10px; /* 变体块之间的间距 */
                padding-bottom: 8px;
                border-bottom: 1px dashed #e0e0e0; /* 变体块之间的分隔线 */
            }
            .variant-pricing-block:last-of-type {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
            .variant-pricing-block .variant-name {
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
                font-size: 14px;
            }
        `);


        // 关闭按钮功能
        statusWindow.querySelector('.close-btn').addEventListener('click', () => {
            statusWindow.style.display = 'none';
        });

        // 初始更新Token显示
        updateTokenDisplay();
    }

    // 更新状态窗口消息
    function updateStatus(message, type = 'ready') {
        const statusWindow = document.getElementById('pricingStatusWindow');
        if (!statusWindow) return;

        const messageElement = statusWindow.querySelector('#pricingMessage'); // 找到消息元素
        const statusTextElement = statusWindow.querySelector('#pricingStatusText'); // 找到状态文本元素

        if (messageElement) {
            messageElement.innerHTML = message; // 只更新消息文本
        }

        if (statusTextElement) {
            statusTextElement.className = type; // 更新状态文本的类名
            statusTextElement.textContent = type === 'ready' ? '就绪' :
                                          type === 'working' ? '处理中' : '错误';
        }

        // 确保状态窗口可见
        statusWindow.style.display = 'block';
        updateTokenDisplay(); // 每次更新状态时也更新Token显示
    }

    // 更新Token显示
    function updateTokenDisplay() {
        const tokenDisplayElement = document.getElementById('currentTokenDisplay');
        if (tokenDisplayElement) {
            tokenDisplayElement.textContent = currentAuthToken.length > 10 ?
                                               currentAuthToken.substring(0, 10) + '...' :
                                               currentAuthToken;
            tokenDisplayElement.title = currentAuthToken; // 完整Token作为title显示
        }
    }

    // 从URL中提取产品ID (仅用于产品编辑页)
    function getProductIdFromUrl() {
        const hash = window.location.hash;
        const match = hash.match(/\/editProduct\/(\d+)\//);
        return match ? match[1] : null;
    }

    // 获取汇率信息
    function fetchExchangeRates() {
        return new Promise((resolve, reject) => {
            if (currentAuthToken === "Waiting for token..." || currentAuthToken === "Not Found") {
                console.warn('操！无法获取汇率：Token缺失。');
                reject('Token缺失');
                return;
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://haihuiselling.com/api/rateController/getRate",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "token": currentAuthToken
                },
                data: JSON.stringify({}),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 200 && data.data) {
                            exchangeRatesMap = {}; // 清空旧的汇率
                            data.data.forEach(rate => {
                                if (rate.currencyCode && rate.exchangeRate !== undefined) {
                                    exchangeRatesMap[rate.currencyCode] = rate.exchangeRate;
                                }
                            });
                            console.log('操！汇率信息已更新：', exchangeRatesMap);
                            resolve();
                        } else {
                            console.error('操！获取汇率失败:', data.message || '未知错误');
                            updateStatus(`获取汇率失败: ${data.message || '未知错误'}`, 'error');
                            reject(data.message || '未知错误');
                        }
                    } catch (e) {
                        console.error('操！解析汇率JSON失败:', e);
                        updateStatus(`解析汇率数据失败：${e.message}`, 'error');
                        reject(e);
                    }
                },
                onerror: function(response) {
                    console.error('操！汇率API请求失败:', response);
                    updateStatus(`汇率请求失败！状态码: ${response.status}`, 'error');
                    reject(response);
                }
            });
        });
    }

    // 获取产品编辑页的定价数据
    function fetchPricingDataForEditPage(productId) {
        if (currentAuthToken === "Waiting for token..." || currentAuthToken === "Not Found") {
            updateStatus(`产品ID: ${productId} 的数据请求失败：Token缺失`, 'error');
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://haihuiselling.com/api/productController/getVariantInfoById",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json, text/plain, */*",
                "token": currentAuthToken
            },
            data: JSON.stringify({ id: parseInt(productId) }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    updateStatus(`产品ID: ${productId} 的数据加载成功`, 'ready');
                    handleEditPageTableDisplay(data); // 调用处理编辑页表格的函数
                } catch (e) {
                    console.error('解析JSON失败:', e);
                    updateStatus(`产品ID: ${productId} 的数据解析失败：${e.message}`, 'error');
                }
            },
            onerror: function(response) {
                console.error('API请求失败:', response);
                updateStatus(`产品ID: ${productId} 的请求失败！状态码: ${response.status}，${response.statusText || '网络错误或CORS问题'}`, 'error');
                if (response.status === 401 || response.status === 403) {
                    updateStatus(`产品ID: ${productId} 的请求失败！Token可能已过期或无效，请刷新页面或重新登录。`, 'error');
                }
            }
        });
    }

    // 动态识别SKU列的函数 (仅用于产品编辑页)
    function getSkuColumnSelector() {
        if (dynamicSkuColumnSelector) {
            return dynamicSkuColumnSelector;
        }

        const tableHeader = document.querySelector('.el-table__header');
        if (!tableHeader) {
            console.warn('操！表格头部 (.el-table__header) 还没加载出来，无法动态识别SKU列。');
            return null;
        }

        const headerCells = tableHeader.querySelectorAll('th .cell');
        const keywords = ['颜色', '变体标识', 'SKU', 'Variant', 'Name', 'Color', 'Item'];

        for (const cell of headerCells) {
            const headerText = cell.textContent.trim();
            for (const keyword of keywords) {
                if (headerText.includes(keyword)) {
                    const thElement = cell.closest('th');
                    if (thElement) {
                        const classMatch = thElement.className.match(/el-table_\d+_column_\d+/);
                        if (classMatch) {
                            dynamicSkuColumnSelector = '.' + classMatch[0] + ' .cell';
                            console.log('操！动态识别到SKU列选择器：', dynamicSkuColumnSelector, '基于标题:', headerText);
                            return dynamicSkuColumnSelector;
                        } else {
                            console.warn('操！找到匹配关键词的表头，但其父级<th>没有预期的el-table_X_column_Y类名:', thElement);
                        }
                    }
                }
            }
        }
        console.warn('操！未能动态识别SKU列，所有关键词都试过了，表头结构可能又变了！');
        return null;
    }

    // 动态识别“操作”列的函数 (仅用于产品列表页)
    function getOperationColumnSelector() {
        if (dynamicOperationColumnSelector) {
            return dynamicOperationColumnSelector; // 如果已经识别过，直接返回
        }

        // 在固定右侧的表头中查找“操作”列
        const fixedTableHeader = document.querySelector('.el-table__fixed-right .el-table__fixed-header-wrapper');
        if (!fixedTableHeader) {
            console.warn('操！固定右侧表格头部 (.el-table__fixed-right .el-table__fixed-header-wrapper) 还没加载出来，无法动态识别操作列。');
            return null;
        }

        const headerCells = fixedTableHeader.querySelectorAll('th .cell');
        for (const cell of headerCells) {
            if (cell.textContent.trim() === '操作') {
                const thElement = cell.closest('th');
                if (thElement) {
                    const classMatch = thElement.className.match(/el-table_\d+_column_\d+/);
                    if (classMatch) {
                        dynamicOperationColumnSelector = '.' + classMatch[0] + ' .cell'; // 构造完整的选择器
                        console.log('操！动态识别到操作列选择器：', dynamicOperationColumnSelector, '基于标题:', cell.textContent.trim());
                        return dynamicOperationColumnSelector;
                    } else {
                        console.warn('操！找到操作列的表头，但其父级<th>没有预期的el-table_X_column_Y类名:', thElement);
                    }
                }
            }
        }
        console.warn('操！未能动态识别操作列，固定表头结构可能又变了！');
        return null; // 动态识别失败
    }

    // 核心处理产品编辑页行数据的函数
    function processEditPageTableRows(skuRows, data) {
        if (data.code === 200 && data.data && data.data.variants) {
            const variantsData = data.data.variants;

            if (!dynamicSkuColumnSelector) {
                getSkuColumnSelector();
            }

            if (!dynamicSkuColumnSelector) {
                console.error('操！无法确定SKU列的选择器，无法继续处理。可能是表头还没加载或结构大变。');
                updateStatus('操！无法识别SKU列，请检查页面结构或联系混世魔王导师！', 'error');
                return;
            }

            skuRows.forEach(row => {
                let skuNameElement = null;
                skuNameElement = row.querySelector(dynamicSkuColumnSelector);

                if (!skuNameElement || !skuNameElement.textContent.trim()) {
                    console.warn('操！主SKU选择器失败或内容为空，尝试备用方案。行:', row, '主选择器:', dynamicSkuColumnSelector);
                    const fallbackSkuElement1 = row.querySelector('.el-table__cell:nth-child(1) .cell');
                    const fallbackSkuElement2 = row.querySelector('.el-table__cell:nth-child(2) .cell');

                    if (fallbackSkuElement1 && fallbackSkuElement1.textContent.trim()) {
                        skuNameElement = fallbackSkuElement1;
                        console.warn('操！使用第一列作为备用SKU名称。');
                    } else if (fallbackSkuElement2 && fallbackSkuElement2.textContent.trim()) {
                        skuNameElement = fallbackSkuElement2;
                        console.warn('操！使用第二列作为备用SKU名称。');
                    } else {
                        console.warn('操！所有SKU名称元素查找尝试都失败了，跳过此行:', row);
                        return;
                    }
                }

                const skuName = skuNameElement.textContent.trim();
                let contentHtml = '';
                const matchedVariant = variantsData.find(v => v.variantTag && v.variantTag.trim() === skuName);

                if (matchedVariant) {
                    const productPriceObject = matchedVariant.productPriceObject || {};
                    const priceEntries = [];

                    const preferredCountries = ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'PL', 'SA', 'JP', 'AU', 'AE', 'SG', 'IN', 'BR', 'ZH'];
                    const sortedCountries = [];

                    preferredCountries.forEach(country => {
                        if (productPriceObject.hasOwnProperty(country)) {
                            sortedCountries.push(country);
                        }
                    });

                    Object.keys(productPriceObject).forEach(country => {
                        if (!sortedCountries.includes(country)) {
                            sortedCountries.push(country);
                        }
                    });

                    if (sortedCountries.length > 0) {
                        sortedCountries.forEach(countryCode => {
                            let shouldDisplay = true;
                            if (countryFilterMode === 'whitelist' && countryFilterList.length > 0) {
                                shouldDisplay = countryFilterList.includes(countryCode);
                            } else if (countryFilterMode === 'blacklist' && countryFilterList.length > 0) {
                                shouldDisplay = !countryFilterList.includes(countryCode);
                            }

                            if (shouldDisplay) {
                                const priceInfo = productPriceObject[countryCode];
                                if (priceInfo && priceInfo.value !== undefined && priceInfo.currency) {
                                    const countryFullName = countryNames[countryCode] || countryCode;
                                    let cnyEquivalent = '汇率未知';

                                    if (priceInfo.currency === 'CNY' || priceInfo.currency === 'CNH') {
                                        cnyEquivalent = parseFloat(priceInfo.value).toFixed(2);
                                    } else if (exchangeRatesMap[priceInfo.currency] !== undefined) {
                                        const rate = exchangeRatesMap[priceInfo.currency];
                                        cnyEquivalent = (parseFloat(priceInfo.value) * rate).toFixed(2);
                                    }
                                    priceEntries.push(`<span class="country-price-item">${countryFullName} / ${priceInfo.currency} ${parseFloat(priceInfo.value).toFixed(2)} / ${cnyEquivalent} CNY</span>`);
                                }
                            }
                        });
                    }

                    if (priceEntries.length > 0) {
                        contentHtml = `<div class="horizontal-pricing-container">${priceEntries.join('')}</div>`;
                    } else {
                        contentHtml = `<div class="no-data-message">无定价数据或被过滤</div>`;
                    }
                } else {
                    console.log(`SKU: ${skuName} 没有找到对应的定价数据。`);
                    contentHtml = `<div class="no-data-message">无定价数据</div>`;
                }
                insertPricingRow(row, contentHtml); // 使用辅助函数插入行
            });

            updateStatus(`产品ID: ${data.data.id} 的所有SKU定价数据已加载并显示`, 'ready');

        } else {
            updateStatus(`API返回错误！代码: ${data.code || '无'}, 消息: ${data.message || '未知错误'}`, 'error');
        }
    }

    // 处理产品编辑页的表格显示
    function handleEditPageTableDisplay(data) {
        const tableBodySelector = '.el-table__body-wrapper tbody';
        let tableBody = document.querySelector(tableBodySelector);
        let skuRows = tableBody ? tableBody.querySelectorAll('.el-table__row') : [];
        let tableHeader = document.querySelector('.el-table__header');

        if (skuRows.length === 0 || !tableHeader || !tableBody) {
            console.log('操！编辑页初始没找到El-Table的SKU行或表头/表体，尝试等待DOM加载...');
            updateStatus('编辑页初始未找到SKU行或表头/表体，等待页面加载...', 'working');

            waitForElement(tableBodySelector).then(foundTableBody => {
                tableBody = foundTableBody; // 更新 tableBody 引用
                skuRows = tableBody.querySelectorAll('.el-table__row');
                tableHeader = document.querySelector('.el-table__header'); // 重新检查表头
                if (skuRows.length > 0 && tableHeader) {
                    console.log('操！通过轮询找到了El-Table的SKU行和表头/表体，开始处理。');
                    processEditPageTableRows(skuRows, data);
                    setupTableContentObserver(tableBody); // 设置持久化监听器
                } else {
                    updateStatus('操！找到表格体但SKU行或表头仍缺失，页面结构可能异常！', 'error');
                }
            }).catch(error => {
                console.error('操！等待编辑页表格超时或出错:', error.message);
                updateStatus(`操！等待编辑页表格超时：${error.message}`, 'error');
            });
            return;
        }

        // 如果初始就找到了，直接处理
        processEditPageTableRows(skuRows, data);
        setupTableContentObserver(tableBody); // 设置持久化监听器
    }

    // 遍历产品列表页的每一行，获取并显示定价
    function processSummaryTableRows(productRows) {
        let processedCount = 0;
        let totalProducts = productRows.length;

        if (totalProducts === 0) {
            updateStatus('产品列表为空，无数据可显示。', 'ready');
            return;
        }

        // 获取操作列的选择器
        const operationColSelector = getOperationColumnSelector();
        if (!operationColSelector) {
            updateStatus('操！无法识别操作列，无法获取产品ID！', 'error');
            return;
        }

        // 获取固定右侧表格的 tbody
        const fixedRightBody = document.querySelector('.el-table__fixed-right .el-table__fixed-body-wrapper tbody');
        if (!fixedRightBody) {
            console.error('操！未找到固定右侧表格体，无法获取操作链接。');
            updateStatus('操！未找到固定右侧表格体，无法获取产品ID！', 'error');
            return;
        }

        productRows.forEach((row, index) => {
            // 找到主表格行对应的固定右侧表格行
            const fixedRightRow = fixedRightBody.children[index];
            if (!fixedRightRow) {
                console.warn('操！未找到主表格行对应的固定右侧表格行，跳过此行:', row);
                processedCount++;
                if (processedCount === totalProducts) {
                    updateStatus('部分产品定价数据加载失败，请检查控制台', 'error');
                }
                return;
            }

            // 在固定右侧表格行中查找操作链接
            const editLink = fixedRightRow.querySelector(operationColSelector + ' a[href*="/editProduct/"]');
            if (editLink) {
                const hrefMatch = editLink.href.match(/\/editProduct\/(\d+)\//);
                const productId = hrefMatch ? hrefMatch[1] : null;

                if (productId) {
                    // 检查当前行后面是否已经有我们插入的价格行，有的话先删掉，避免重复
                    const existingPricingRow = row.nextElementSibling;
                    if (existingPricingRow && existingPricingRow.classList.contains('pricing-info-row')) {
                        existingPricingRow.remove();
                    }

                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://haihuiselling.com/api/productController/getVariantInfoById",
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                            "Accept": "application/json, text/plain, */*",
                            "token": currentAuthToken
                        },
                        data: JSON.stringify({ id: parseInt(productId) }),
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                updateSummaryRowPricing(row, data); // 更新特定行
                            } catch (e) {
                                console.error(`操！解析产品ID ${productId} 的JSON失败:`, e);
                                const errorHtml = `<div class="no-data-message" style="color: #f44336;">获取定价失败: ${e.message}</div>`;
                                insertPricingRow(row, errorHtml);
                            } finally {
                                processedCount++;
                                if (processedCount === totalProducts) {
                                    updateStatus('所有产品定价数据已加载并显示', 'ready');
                                }
                            }
                        },
                        onerror: function(response) {
                            console.error(`操！产品ID ${productId} 的API请求失败:`, response);
                            const errorMsg = response.status === 401 || response.status === 403 ?
                                             'Token可能已过期或无效' :
                                             `状态码: ${response.status}`;
                            const errorHtml = `<div class="no-data-message" style="color: #f44336;">获取定价失败: ${errorMsg}</div>`;
                            insertPricingRow(row, errorHtml);
                            processedCount++;
                            if (processedCount === totalProducts) {
                                updateStatus('部分产品定价数据加载失败，请检查控制台', 'error');
                            }
                        }
                    });
                } else {
                    console.warn('操！未能从操作链接中提取产品ID，跳过此行:', row);
                    processedCount++;
                    if (processedCount === totalProducts) {
                        updateStatus('部分产品定价数据加载失败，请检查控制台', 'error');
                    }
                }
            } else {
                console.warn('操！产品行没有找到操作链接（在固定右侧表格中），跳过此行:', row);
                processedCount++;
                if (processedCount === totalProducts) {
                    updateStatus('部分产品定价数据加载失败，请检查控制台', 'error');
                }
            }
        });
    }

    // 更新产品列表页单行定价显示
    function updateSummaryRowPricing(productRow, data) {
        let contentHtml = '';
        if (data.code === 200 && data.data && data.data.variants && data.data.variants.length > 0) {
            let allVariantsHtml = [];
            data.data.variants.forEach(variant => {
                const variantTag = variant.variantTag || '未知变体';
                const productPriceObject = variant.productPriceObject || {};
                const priceEntries = [];

                const preferredCountries = ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'PL', 'SA', 'JP', 'AU', 'AE', 'SG', 'IN', 'BR', 'ZH'];
                const sortedCountries = [];

                preferredCountries.forEach(country => {
                    if (productPriceObject.hasOwnProperty(country)) {
                        sortedCountries.push(country);
                    }
                });

                Object.keys(productPriceObject).forEach(country => {
                    if (!sortedCountries.includes(country)) {
                        sortedCountries.push(country);
                    }
                });

                if (sortedCountries.length > 0) {
                    sortedCountries.forEach(countryCode => {
                        let shouldDisplay = true;
                        if (countryFilterMode === 'whitelist' && countryFilterList.length > 0) {
                            shouldDisplay = countryFilterList.includes(countryCode);
                        } else if (countryFilterMode === 'blacklist' && countryFilterList.length > 0) {
                            shouldDisplay = !countryFilterList.includes(countryCode);
                        }

                        if (shouldDisplay) {
                            const priceInfo = productPriceObject[countryCode];
                            if (priceInfo && priceInfo.value !== undefined && priceInfo.currency) {
                                const countryFullName = countryNames[countryCode] || countryCode;
                                let cnyEquivalent = '汇率未知';

                                if (priceInfo.currency === 'CNY' || priceInfo.currency === 'CNH') {
                                    cnyEquivalent = parseFloat(priceInfo.value).toFixed(2);
                                } else if (exchangeRatesMap[priceInfo.currency] !== undefined) {
                                    const rate = exchangeRatesMap[priceInfo.currency];
                                    cnyEquivalent = (parseFloat(priceInfo.value) * rate).toFixed(2);
                                }
                                priceEntries.push(`<span class="country-price-item">${countryFullName} / ${priceInfo.currency} ${parseFloat(priceInfo.value).toFixed(2)} / ${cnyEquivalent} CNY</span>`);
                            }
                        }
                    });
                }

                if (priceEntries.length > 0) {
                    allVariantsHtml.push(`
                        <div class="variant-pricing-block">
                            <div class="variant-name">${variantTag}:</div>
                            <div class="horizontal-pricing-container">${priceEntries.join('')}</div>
                        </div>
                    `);
                } else {
                    allVariantsHtml.push(`
                        <div class="variant-pricing-block">
                            <div class="variant-name">${variantTag}:</div>
                            <div class="no-data-message">无定价数据或被过滤</div>
                        </div>
                    `);
                }
            });
            contentHtml = allVariantsHtml.join('');
        } else {
            contentHtml = `<div class="no-data-message">无定价数据 (产品无变体或API返回异常)</div>`;
        }
        insertPricingRow(productRow, contentHtml);
    }

    // 辅助函数：插入定价信息行
    function insertPricingRow(targetRow, contentHtml) {
        const newPricingRow = document.createElement('tr');
        newPricingRow.classList.add('pricing-info-row');

        const newPricingCell = document.createElement('td');
        const table = targetRow.closest('table');
        if (table) {
            // 获取主表格的列数，确保colspan覆盖整个宽度
            const mainTableHeader = document.querySelector('.el-table__header-wrapper thead');
            if (mainTableHeader) {
                const colCount = mainTableHeader.querySelectorAll('th').length;
                newPricingCell.colSpan = colCount > 0 ? colCount : 9; // 至少是9，以防万一
            } else {
                newPricingCell.colSpan = 9; // 默认9列
            }
        } else {
            newPricingCell.colSpan = 9; // 默认9列
        }
        newPricingCell.classList.add('pricing-info-cell');
        newPricingCell.innerHTML = contentHtml;
        newPricingRow.appendChild(newPricingCell);

        targetRow.insertAdjacentElement('afterend', newPricingRow);
    }

    // Function to set up or re-configure the persistent observer for table content changes
    function setupTableContentObserver(targetBodyElement) {
        // Disconnect existing observer if any
        if (tableContentObserver) {
            tableContentObserver.disconnect();
            tableContentObserver = null;
        }

        if (targetBodyElement) {
            tableContentObserver = new MutationObserver((mutations) => {
                // 检查变动是否是实际的子节点列表变化，并且不是我们自己插入的定价行
                const relevantMutation = mutations.some(mutation =>
                    mutation.type === 'childList' &&
                    mutation.target === targetBodyElement &&
                    (Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && !node.classList.contains('pricing-info-row')) ||
                     Array.from(mutation.removedNodes).some(node => node.nodeType === 1 && !node.classList.contains('pricing-info-row')))
                );

                if (relevantMutation) {
                    console.log('操！表格内容变化，重新处理页面。');
                    // 防抖处理，避免短时间内多次触发
                    clearTimeout(window._pricingRefreshTimeout);
                    window._pricingRefreshTimeout = setTimeout(() => {
                        // 重新处理当前页面，这会清除旧的定价行并重新获取数据
                        processCurrentPage();
                    }, 200); // 200毫秒防抖
                }
            });
			// 处理产品列表页的逻辑
    function handleCommoditySummaryPage() {
        const tableBodySelector = '.el-table__body-wrapper tbody';
        let tableBody = document.querySelector(tableBodySelector);
        let productRows = tableBody ? tableBody.querySelectorAll('.el-table__row') : [];

        if (productRows.length === 0 || !tableBody) {
            console.log('操！产品列表页初始没找到表格内容，尝试等待DOM加载...');
            updateStatus('产品列表页初始未找到表格内容，等待页面加载...', 'working');

            waitForElement(tableBodySelector).then(foundTableBody => {
                tableBody = foundTableBody; // 更新 tableBody 引用
                productRows = tableBody.querySelectorAll('.el-table__row');
                if (productRows.length > 0) {
                    console.log('操！通过轮询找到了产品列表表格内容，开始处理。');
                    updateStatus('产品列表表格已加载，正在获取定价数据...', 'working'); // 新增状态更新
                    processSummaryTableRows(productRows);
                    setupTableContentObserver(tableBody); // 设置持久化监听器
                } else {
                    updateStatus('操！找到表格体但产品行仍缺失，页面结构可能异常！', 'error');
                    console.error('操！找到表格体但产品行仍缺失，页面结构可能异常！'); // 新增日志
                }
            }).catch(error => {
                console.error('操！等待产品列表表格超时或出错:', error.message);
                updateStatus(`操！等待产品列表表格超时：${error.message}`, 'error');
            });
            return;
        }
        // 如果初始就找到了，直接处理
        console.log('操！产品列表页初始已找到表格内容，开始处理。'); // 新增日志
        updateStatus('产品列表表格已加载，正在获取定价数据...', 'working'); // 新增状态更新
        processSummaryTableRows(productRows);
        setupTableContentObserver(tableBody); // 设置持久化监听器
    }


            // 仅观察 tbody 的直接子元素（即表格行）的增删
            tableContentObserver.observe(targetBodyElement, { childList: true, subtree: false });
            console.log('操！持久化MutationObserver 已设置在表格体上，监听内容变化。');
        } else {
            console.warn('操！未找到表格体元素，无法设置持久化MutationObserver。');
        }
    } // setupTableContentObserver 函数到此结束，妈的，别再把其他函数塞进来了！

    // 处理产品列表页的逻辑，这个函数他妈的应该独立出来！
    function handleCommoditySummaryPage() {
        const tableBodySelector = '.el-table__body-wrapper tbody';
        let tableBody = document.querySelector(tableBodySelector);
        let productRows = tableBody ? tableBody.querySelectorAll('.el-table__row') : [];

        if (productRows.length === 0 || !tableBody) {
            console.log('操！产品列表页初始没找到表格内容，尝试等待DOM加载...');
            updateStatus('产品列表页初始未找到表格内容，等待页面加载...', 'working');

            waitForElement(tableBodySelector).then(foundTableBody => {
                tableBody = foundTableBody; // 更新 tableBody 引用
                productRows = tableBody.querySelectorAll('.el-table__row');
                if (productRows.length > 0) {
                    console.log('操！通过轮询找到了产品列表表格内容，开始处理。');
                    updateStatus('产品列表表格已加载，正在获取定价数据...', 'working'); // 新增状态更新
                    processSummaryTableRows(productRows);
                    setupTableContentObserver(tableBody); // 设置持久化监听器
                } else {
                    updateStatus('操！找到表格体但产品行仍缺失，页面结构可能异常！', 'error');
                    console.error('操！找到表格体但产品行仍缺失，页面结构可能异常！'); // 新增日志
                }
            }).catch(error => {
                console.error('操！等待产品列表表格超时或出错:', error.message);
                updateStatus(`操！等待产品列表表格超时：${error.message}`, 'error');
            });
            return;
        }
        // 如果初始就找到了，直接处理
        console.log('操！产品列表页初始已找到表格内容，开始处理。'); // 新增日志
        updateStatus('产品列表表格已加载，正在获取定价数据...', 'working'); // 新增状态更新
        processSummaryTableRows(productRows);
        setupTableContentObserver(tableBody); // 设置持久化监听器
    }

    // 主处理函数，根据当前URL判断页面类型并执行相应逻辑，妈的，这才是核心！
    async function processCurrentPage() {
        updateStatus('正在识别页面类型并处理...', 'working');
        // 清除所有之前插入的定价行，避免重复，不然他妈的会堆一堆！
        document.querySelectorAll('.pricing-info-row').forEach(row => row.remove());

        // 确保在处理前获取最新汇率，没汇率你他妈的算个屁！
        try {
            await fetchExchangeRates();
            updateStatus('汇率已更新，正在处理页面...', 'working');
        } catch (error) {
            console.error('操！获取汇率失败，可能影响定价显示:', error);
            updateStatus(`获取汇率失败: ${error.message || '未知错误'}，继续处理页面...`, 'error');
            // 即使汇率失败也尝试继续，但会显示“汇率未知”
        }

        const productId = getProductIdFromUrl();
        if (productId) {
            console.log('操！当前是产品编辑页，产品ID:', productId);
            updateStatus(`正在获取产品ID: ${productId} 的定价数据...`, 'working');
            fetchPricingDataForEditPage(productId);
        } else if (location.href.includes('haihuiselling.com/#/box/conmmoditySummary')) {
            console.log('操！当前是产品列表页。');
            updateStatus('正在获取产品列表页的定价数据...', 'working');
            handleCommoditySummaryPage(); // 调用产品列表页处理函数
        } else {
            console.log('操！当前页面不是产品编辑页也不是产品列表页，不处理定价。');
            updateStatus('当前页面无需处理定价。', 'ready');
            // 如果有旧的Observer，在这里断开它，免得他妈的瞎折腾
            if (tableContentObserver) {
                tableContentObserver.disconnect();
                tableContentObserver = null;
                console.log('操！非产品页，已断开表格内容监听器。');
            }
        }
    }
})(); // 妈的，整个脚本到此结束！
