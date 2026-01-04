// ==UserScript==
// @name         Booth 价格换算（JPY -> CNY）
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/vikiboss/booth-price-cny
// @version      3.4
// @description  在 Booth 平台上显示日元换算后的人民币价格，0 显示"免费"并添加下划线
// @author       Viki <hi@viki.moe> (https://github.com/vikiboss)
// @match        https://booth.pm/*
// @match        https://*.booth.pm/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      60s.viki.moe
// @connect      60s-api.viki.moe
// @downloadURL https://update.greasyfork.org/scripts/532153/Booth%20%E4%BB%B7%E6%A0%BC%E6%8D%A2%E7%AE%97%EF%BC%88JPY%20-%3E%20CNY%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532153/Booth%20%E4%BB%B7%E6%A0%BC%E6%8D%A2%E7%AE%97%EF%BC%88JPY%20-%3E%20CNY%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CACHE_KEY = 'jpy_to_cny_rate';
    const CACHE_DATE_KEY = 'jpy_to_cny_date';
    const DEFAULT_RATE = 0.05; // 默认汇率 1:20
    const PROCESSED_MARK = 'data-jpy-processed';
    const ZERO_PRICE_MARK = 'data-zero-price';

    // 全局变量
    let exchangeRate = DEFAULT_RATE;
    let debugMode = false; // 调试模式，设为false减少日志输出

    // 日志输出
    function log(message, data) {
        if (debugMode) {
            console.log(`[JPY2CNY] ${message}`, data || '');
        }
    }

    // 获取今天的日期字符串 YYYY-MM-DD
    function getTodayString() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    // 解析价格
    function parsePrice(price) {
        return parseFloat(price.replace(/[,\s]/g, ''));
    }

    // 格式化人民币金额
    function formatCNY(jpy, isZero) {
        if (isZero) {
            return '免费';
        }
        return `${Math.round(jpy * exchangeRate*100) / 100} CNY`;
    }

    // 添加CSS样式
    function addGlobalStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            [${ZERO_PRICE_MARK}="true"] {
                text-decoration: underline;
                text-decoration-style: solid;
                text-decoration-color: #ff9900;
                text-decoration-thickness: 2px;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 获取汇率（带缓存）
    async function getExchangeRate() {
        const cachedRate = GM_getValue(CACHE_KEY);
        const cachedDate = GM_getValue(CACHE_DATE_KEY);
        const todayString = getTodayString();

        // 如果缓存有效且是今天的数据，直接使用缓存
        if (cachedRate && cachedDate === todayString) {
            log(`使用缓存汇率: ${cachedRate}`);
            return cachedRate;
        }

        // 尝试获取新汇率
        return new Promise((resolve) => {
            log('开始请求汇率API...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://60s-api.viki.moe/v2/exchange_rate?currency=jpy',
                timeout: 5000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const cnyRate = data?.data?.rates?.find(r => r.currency === 'CNY')?.rate;

                        if (cnyRate) {
                            log(`获取到新汇率: ${cnyRate}`);
                            GM_setValue(CACHE_KEY, cnyRate);
                            GM_setValue(CACHE_DATE_KEY, todayString);
                            resolve(cnyRate);
                        } else {
                            resolve(cachedRate || DEFAULT_RATE);
                        }
                    } catch (error) {
                        resolve(cachedRate || DEFAULT_RATE);
                    }
                },
                onerror: function() {
                    resolve(cachedRate || DEFAULT_RATE);
                }
            });
        });
    }

    // 处理文本节点中的价格
    function processTextNode(node) {
 if (node.nodeType !== Node.TEXT_NODE) return false;

    const text = node.nodeValue;
    if (!text || text.trim() === '') return false;

    // 防止重复处理，检查是否已包含CNY或免费字样
    if (text.includes('CNY') || text.includes('免费')) return false;

    // 修复后的正则表达式和处理逻辑
    const patterns = [
        // 匹配 "数字 JPY" 格式
        {
            regex: /(\d[\d,]+|\d+)\s*JPY/gi,
            process: function(text) {
                return text.replace(/(\d[\d,]+|\d+)\s*JPY/gi, function(match) {
                    // 提取纯数字部分
                    const priceDigits = match.replace(/[^\d]/g, '');
                    const jpyValue = parseFloat(priceDigits);
                    const isZero = jpyValue === 0;

                    // 标记零价格，供后续添加样式
                    node._hasZeroPrice = isZero;
                    node._price = jpyValue;

                    return `${match} (${formatCNY(jpyValue, isZero)})`;
                });
            }
        },
        // 匹配 "¥数字" 格式 - 修复了正则表达式
        {
            regex: /¥\s*(\d[\d,]*)/g, // 改为与替换正则一致
            process: function(text) {
                return text.replace(/¥\s*(\d[\d,]*)/g, function(match, digits) {
                    // 提取纯数字部分
                    const priceDigits = digits.replace(/[,\s]/g, '');
                    const jpyValue = parseFloat(priceDigits);
                    const isZero = jpyValue === 0;

                    // 标记零价格，供后续添加样式
                    node._hasZeroPrice = isZero;
                    node._price = jpyValue;

                    return `${match}（${formatCNY(jpyValue, isZero)}）`;
                });
            }
        }
    ];

        let newText = text;
        let modified = false;

        // 依次尝试每个匹配模式
        for (const pattern of patterns) {
            if (pattern.regex.test(text)) {
                // 使用分离的处理函数改变文本
                const processed = pattern.process(text);
                newText = processed;
                modified = true;
                break;
            }
        }

        // 如果文本被修改，更新节点并设置样式
        if (modified) {
            node.nodeValue = newText;

            // 找到合适的父元素进行缩放和样式设置
            let parent = findAppropriateParent(node);

            if (parent) {
                // 应用变换和样式
                applyStyles(parent, node._hasZeroPrice);

                // 存储价格信息，用于后续检查
                parent._priceInfo = {
                    isZero: node._hasZeroPrice,
                    price: node._price
                };

                return true;
            }
        }

        return false;
    }

    // 查找适合应用样式的父元素
    function findAppropriateParent(node) {
        if (!node || !node.parentElement) return null;

        // 从当前节点开始向上查找
        let parent = node.parentElement;

        // 跳过简单的内联元素
        while (parent && ['SPAN', 'STRONG', 'B', 'I', 'EM'].includes(parent.tagName) &&
              parent.childNodes.length === 1) {
            parent = parent.parentElement;
        }

        // 检查是否已有之前处理过的父元素
        let current = parent;
        while (current) {
            if (current.hasAttribute(PROCESSED_MARK)) {
                // 更新已处理元素的零价格状态
                updateZeroPriceStatus(current, node._hasZeroPrice);
                return current;
            }
            current = current.parentElement;
        }

        return parent;
    }

    // 更新元素的零价格状态
    function updateZeroPriceStatus(element, isZero) {
        if (isZero) {
            element.setAttribute(ZERO_PRICE_MARK, 'true');
        } else {
            element.removeAttribute(ZERO_PRICE_MARK);
        }
    }

    // 应用样式到元素
    function applyStyles(element, isZero) {
        if (!element.hasAttribute(PROCESSED_MARK)) {
            element.setAttribute(PROCESSED_MARK, 'true');
            element.style.transform = 'scale(0.8)';
            element.style.transformOrigin = 'left center';

            // 确保正确显示
            if (getComputedStyle(element).display === 'inline') {
                element.style.display = 'inline-block';
            }
        }

        // 设置零价格标记
        updateZeroPriceStatus(element, isZero);
    }

    // 处理DOM元素
    function processElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        // 跳过不需要处理的元素
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(element.tagName)) {
            return;
        }

        // 使用TreeWalker查找所有文本节点
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 过滤掉空文本节点
                    return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                }
            },
            false
        );

        const nodesToProcess = [];
        let textNode;
        while (textNode = walker.nextNode()) {
            nodesToProcess.push(textNode);
        }

        // 处理收集到的文本节点
        nodesToProcess.forEach(processTextNode);
    }

    // 设置DOM变化监听器
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // 处理新添加的节点
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            processElement(node);
                        } else if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
                            processTextNode(node);
                        }
                    });
                }
                // 处理文本变化
                else if (mutation.type === 'characterData') {
                    // 如果文本节点变化，重新处理
                    processTextNode(mutation.target);

                    // 找到处理过这个节点的父元素，检查并更新状态
                    let parent = mutation.target.parentElement;
                    while (parent) {
                        if (parent._priceInfo) {
                            const oldState = parent._priceInfo.isZero;
                            const newState = mutation.target._hasZeroPrice;

                            // 如果零价格状态改变，更新样式
                            if (oldState !== newState) {
                                updateZeroPriceStatus(parent, newState);
                                parent._priceInfo.isZero = newState;
                            }
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // 初始化函数
    async function init() {
        try {
            // 添加全局样式
            addGlobalStyle();

            // 获取汇率
            exchangeRate = await getExchangeRate();
            log(`使用汇率: ${exchangeRate}`);

            // 处理当前页面
            processElement(document.body);

            // 设置监听器
            observeDOM();
        } catch (error) {
            log(`初始化错误: ${error.message}`, error);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
