// ==UserScript==
// @name         携程航班信息提取器
// @name:en      Ctrip Flight Info Extractor
// @namespace    https://greasyfork.org/users/[your-username]
// @version      1.2
// @description  支持所有主流浏览器的携程航班信息提取器，一键复制航班信息
// @description:en  Extract and copy flight information from Ctrip with one click
// @author       Senpou
// @license      MIT
// @match        https://flights.ctrip.com/online/list/*
// @match        http://flights.ctrip.com/online/list/*
// @match        https://m.ctrip.com/html5/flight/swift/domestic/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521961/%E6%90%BA%E7%A8%8B%E8%88%AA%E7%8F%AD%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521961/%E6%90%BA%E7%A8%8B%E8%88%AA%E7%8F%AD%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .flight-extractor-btn {
            position: fixed;
            top: 50%;
            right: 80px;
            transform: translateY(-50%);
            z-index: 9999;
            padding: 10px 20px;
            background-color: #2681ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .flight-extractor-btn:hover {
            background-color: #1666d4;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .copy-flight-btn {
            margin: 5px 0;
            padding: 4px 6px;
            background-color: #2681ff;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
            width: auto;
            min-width: 40px;
            height: 24px;
            line-height: 16px;
            display: inline-block;
        }
        .copy-flight-btn:hover {
            background-color: #1666d4;
        }
    `);

    // 跨浏览器复制函数
    function copyToClipboard(text) {
        // 方法1: 使用 GM_setClipboard (Tampermonkey API)
        if (typeof GM_setClipboard !== 'undefined') {
            try {
                GM_setClipboard(text);
                return true;
            } catch (error) {
                console.error('GM_setClipboard 失败:', error);
            }
        }

        // 方法2: 使用 navigator.clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            try {
                navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                console.error('Clipboard API 失败:', error);
            }
        }

        // 方法3: 传统的 execCommand 方法
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            // 确保在所有浏览器中都不可见
            textarea.style.cssText = 'position:fixed;pointer-events:none;z-index:-9999;opacity:0;';
            document.body.appendChild(textarea);

            // 适配移动设备
            if (navigator.userAgent.match(/ipad|iphone/i)) {
                textarea.contentEditable = true;
                textarea.readOnly = false;
                
                const range = document.createRange();
                range.selectNodeContents(textarea);
                
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                textarea.setSelectionRange(0, 999999);
            } else {
                textarea.select();
            }

            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            return successful;
        } catch (error) {
            console.error('execCommand 失败:', error);
            return false;
        }
    }

    // 提取航班信息的主函数
    async function extractFlightInfo() {
        try {
            const flightCards = document.querySelectorAll('.flight-item');
            
            flightCards.forEach(card => {
                addCopyButton(card);
            });

        } catch (error) {
            console.error('提取航班信息时出错:', error);
        }
    }

    // 添加复制按钮到单个航班卡片
    function addCopyButton(card) {
        if (safeQuerySelector(card, '.copy-flight-btn')) {
            return;
        }

        try {
            const flightNoText = safeQuerySelector(card, '.plane-No')?.textContent.trim();
            const flightNo = flightNoText?.match(/^[A-Z0-9]+/)?.[0];
            const departTime = safeQuerySelector(card, '.depart-box .time')?.textContent.trim();
            const arriveTime = safeQuerySelector(card, '.arrive-box .time')?.textContent.trim()
                .replace(/\s*\+\d+天\s*/, '');
            const departAirport = safeQuerySelector(card, '.depart-box .airport')?.textContent.trim();
            const arriveAirport = safeQuerySelector(card, '.arrive-box .airport')?.textContent.trim();

            if (flightNo && departAirport && arriveAirport) {
                const info = `${flightNo} ${departTime}-${arriveTime} ${departAirport}-${arriveAirport}`;
                
                const priceArea = safeQuerySelector(card, '.flight-price');
                if (priceArea) {
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'copy-flight-btn';
                    copyBtn.textContent = '复制信息';
                    
                    // 使用 touchend 事件支持移动设备
                    const handleCopy = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (copyToClipboard(info)) {
                            copyBtn.textContent = '已复制';
                            setTimeout(() => {
                                copyBtn.textContent = '复制信息';
                            }, 1000);
                        } else {
                            copyBtn.textContent = '复制失败';
                            setTimeout(() => {
                                copyBtn.textContent = '复制信息';
                            }, 1000);
                        }
                    };

                    // 同时支持点击和触摸
                    copyBtn.addEventListener('click', handleCopy);
                    copyBtn.addEventListener('touchend', handleCopy);
                    
                    priceArea.insertAdjacentElement('beforebegin', copyBtn);
                }
            }
        } catch (error) {
            console.error('处理航班卡片时出错:', error);
        }
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.classList?.contains('flight-item')) {
                            addCopyButton(node);
                        }
                        // 检查子元素
                        const flightCards = node.querySelectorAll?.('.flight-item');
                        if (flightCards) {
                            flightCards.forEach(card => addCopyButton(card));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理滚动事件
    function handleScroll() {
        extractFlightInfo();
    }

    // 添加兼容性检查和降级处理
    function checkBrowserCompatibility() {
        // 检查可选链操作符
        if (typeof window.MutationObserver === 'undefined') {
            console.warn('当前浏览器不支持 MutationObserver，将使用轮询方式');
            // 使用 setInterval 作为降级方案
            setInterval(extractFlightInfo, 2000);
            return false;
        }
        return true;
    }

    // 修改 initialize 函数
    function initialize() {
        // 添加兼容性检查
        const isModernBrowser = checkBrowserCompatibility();
        
        // 检查并记录可用的复制方法
        console.log('复制功能支持情况：', {
            'GM_setClipboard': typeof GM_setClipboard !== 'undefined',
            'Clipboard API': !!(navigator.clipboard && window.isSecureContext),
            'execCommand': typeof document.execCommand === 'function'
        });

        // 初始处理已有的航班卡片
        extractFlightInfo();
        
        // 根据浏览器支持情况选择监听方式
        if (isModernBrowser) {
            // 监听页面变化
            observePageChanges();
            // 添加滚动监听（使用 passive 选项提高性能）
            window.addEventListener('scroll', debounce(handleScroll, 200), { passive: true });
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 添加安全的选择器查询
    function safeQuerySelector(element, selector) {
        try {
            return element.querySelector(selector);
        } catch (error) {
            console.error('选择器查询失败:', error);
            return null;
        }
    }

    // 确保在 DOM 准备好后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})(); 