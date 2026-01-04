// ==UserScript==
// @name         LQFaKa 订单统计 (按钮弹窗版 v0.4 - Fetch+XHR)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  通过按钮触发弹窗，显示拦截API响应(Fetch或XHR)统计的LQFaKa订单数据
// @author       KING
// @match        https://new.lqfaka.com/order*
// @match        https://new.lqfaka.com/index/order*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532009/LQFaKa%20%E8%AE%A2%E5%8D%95%E7%BB%9F%E8%AE%A1%20%28%E6%8C%89%E9%92%AE%E5%BC%B9%E7%AA%97%E7%89%88%20v04%20-%20Fetch%2BXHR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532009/LQFaKa%20%E8%AE%A2%E5%8D%95%E7%BB%9F%E8%AE%A1%20%28%E6%8C%89%E9%92%AE%E5%BC%B9%E7%AA%97%E7%89%88%20v04%20-%20Fetch%2BXHR%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("LQFaKa 订单统计脚本 v0.4 (Fetch+XHR) 开始运行");

    // --- 全局变量存储最新统计结果 ---
    let latestAmountStr = "N/A";
    let latestCount = 0;
    let latestApiTotal = "N/A";
    let dataReady = false;
    let lastErrorMessage = "";
    let statsButton = null; // Make button globally accessible within the IIFE
    let modalOverlay = null; // Make modal globally accessible

    // --- 更新按钮状态函数 ---
    function updateButtonStatus(ready, message = null) {
        if (statsButton) {
            if (ready) {
                statsButton.textContent = '查看统计';
                statsButton.disabled = false;
                statsButton.style.backgroundColor = '#28a745'; // Green for ready
                statsButton.style.color = 'white';
                 lastErrorMessage = ""; // Clear error on success
            } else {
                // 保留之前的错误信息，除非有新的 message
                if (message) lastErrorMessage = message;
                statsButton.textContent = message || '数据错误';
                statsButton.disabled = true;
                 statsButton.style.backgroundColor = '#dc3545'; // Red for error
                 statsButton.style.color = 'white';
            }
        }
    }

    // --- 处理从API获取的数据 ---
    function processOrderData(apiDataString) {
        console.log("尝试处理API数据:", apiDataString.substring(0, 200) + "..."); // Log first 200 chars
        try {
            const data = JSON.parse(apiDataString);
            console.log("成功解析订单 API JSON 数据:", data);

            if (data && data.code === 1 && data.data && Array.isArray(data.data.list)) {
                const orders = data.data.list;
                latestApiTotal = data.data.total;
                let calculatedAmount = 0;
                latestCount = orders.length;

                orders.forEach(order => {
                    const amount = parseFloat(order.total_amount);
                    if (!isNaN(amount)) {
                        calculatedAmount += amount;
                    }
                });
                latestAmountStr = calculatedAmount.toFixed(2);
                dataReady = true;
                console.log(`数据更新: 数量=${latestCount}, 金额=${latestAmountStr}, 总数=${latestApiTotal}`);
                updateButtonStatus(true); // Update button to ready state

            } else {
                console.warn("API 响应数据结构不符合预期或请求未成功:", data);
                lastErrorMessage = "无法从API响应中解析有效数据 (结构或code不符)。";
                // 不立即标记为错误，可能其他请求会成功
                // updateButtonStatus(false, "数据结构错误");
            }
        } catch (err) {
            console.error("解析订单 API JSON 数据时出错:", err);
            lastErrorMessage = "解析API响应JSON时出错: " + err.message;
             // 不立即标记为错误
            // updateButtonStatus(false, "数据解析错误");
        }
    }


    // --- 核心逻辑：拦截 fetch 请求 ---
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Handle url being a string or a Request object
        const requestInfo = arguments[0];
        const requestUrl = (typeof requestInfo === 'string') ? requestInfo : requestInfo.url;
        console.log(`[Fetch Intercept] 发起请求: ${requestUrl}`); // Log ALL fetch requests

        const fetchPromise = originalFetch.apply(this, arguments);

        fetchPromise.then(response => {
            console.log(`[Fetch Intercept] 收到响应: ${response.url}, Status: ${response.status}`);
            // 检查是否是我们关心的 API 请求的响应
            if (response.url.includes('/shopApi/Order/list')) {
                console.log("[Fetch Intercept] 检测到目标订单 API 响应:", response.url);
                const clonedResponse = response.clone();
                clonedResponse.text().then(textData => { // Get text first for reliable parsing
                     processOrderData(textData); // Process the data
                 }).catch(err => {
                    console.error("[Fetch Intercept] 读取响应体时出错:", err);
                     lastErrorMessage = "读取Fetch响应体失败: " + err.message;
                     updateButtonStatus(false, "读取响应失败");
                 });
            }
        }).catch(err => {
            console.error("[Fetch Intercept] Fetch 请求失败:", err);
             lastErrorMessage = "Fetch请求失败: " + err.message;
             updateButtonStatus(false, "请求失败");
        });

        return fetchPromise;
    };


    // --- 核心逻辑：拦截 XMLHttpRequest 请求 ---
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._requestMethod = method; // Store method and url on the xhr object itself
        this._requestUrl = url;
        console.log(`[XHR Intercept] Open: ${method} ${url}`); // Log XHR open
        return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        const xhr = this; // Capture 'this' context
        console.log(`[XHR Intercept] Send: ${xhr._requestUrl}`);

        const originalOnReadyStateChange = xhr.onreadystatechange;

        xhr.onreadystatechange = function() {
             // Log all readyState changes for debugging
             // console.log(`[XHR Intercept] ReadyStateChange: ${xhr._requestUrl}, State: ${xhr.readyState}, Status: ${xhr.status}`);

            if (xhr.readyState === 4) { // DONE
                console.log(`[XHR Intercept] ReadyState 4 for: ${xhr._requestUrl}, Status: ${xhr.status}`); // Log when done
                if (xhr._requestUrl && xhr._requestUrl.includes('/shopApi/Order/list')) {
                     if (xhr.status === 200) {
                         console.log("[XHR Intercept] 检测到目标订单 API 响应 (status 200):", xhr._requestUrl);
                         processOrderData(xhr.responseText); // Process the response text
                     } else {
                         console.warn(`[XHR Intercept] 目标 API 响应状态非 200: ${xhr.status}`);
                         lastErrorMessage = `目标 API [${xhr._requestUrl}] 响应状态: ${xhr.status}`;
                         updateButtonStatus(false, `API状态 ${xhr.status}`);
                     }
                }
            }

            // Call original listener if it exists
            if (originalOnReadyStateChange) {
                try {
                    originalOnReadyStateChange.apply(xhr, arguments);
                } catch (err) {
                     console.error("[XHR Intercept] 调用原始 onreadystatechange 出错:", err);
                }
            }
        };

        try {
             return originalXhrSend.apply(this, arguments);
        } catch (err) {
             console.error("[XHR Intercept] 调用原始 send 出错:", err);
             lastErrorMessage = "调用原始XHR send失败: " + err.message;
             updateButtonStatus(false, "XHR Send错误");
             throw err; // Re-throw error
        }
    };


    // --- 创建和管理按钮 ---
    function createButton() {
        if (document.getElementById('show-stats-button')) return; // Avoid creating duplicates

        statsButton = document.createElement('button');
        statsButton.id = 'show-stats-button';
        statsButton.textContent = '脚本加载中...'; // Initial text
        statsButton.disabled = true;
        statsButton.addEventListener('click', showStatsModal);

        // Basic styles (GM_addStyle applied later)
         statsButton.style.position = 'fixed';
         statsButton.style.bottom = '60px';
         statsButton.style.right = '10px';
         statsButton.style.zIndex = '9998';
         statsButton.style.padding = '8px 15px';
         statsButton.style.backgroundColor = '#6c757d'; // Grey loading color
         statsButton.style.color = 'white';
         statsButton.style.border = 'none';
         statsButton.style.borderRadius = '5px';
         statsButton.style.cursor = 'not-allowed';
         statsButton.style.fontSize = '14px';
         statsButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
         statsButton.style.transition = 'background-color 0.3s, color 0.3s, opacity 0.3s';


        document.body.appendChild(statsButton);
        // Update text slightly after adding to DOM to confirm execution
        setTimeout(() => {
            // 只有在数据尚未就绪时才更新为“等待数据”
            if (!dataReady && statsButton && statsButton.textContent === '脚本加载中...') {
                 statsButton.textContent = '等待数据...';
                 statsButton.style.cursor = 'not-allowed';
                 statsButton.style.backgroundColor = '#ffc107'; // Yellow for waiting
                 statsButton.style.color = '#333';
            }
        }, 500); // Give it half a second
    }

    // --- 创建和管理弹窗 ---
    function createModal() {
        if (document.getElementById('stats-overlay')) return; // Avoid duplicates

        modalOverlay = document.createElement('div');
        modalOverlay.id = 'stats-overlay';
        // Styles added via GM_addStyle

        const modalBox = document.createElement('div');
        modalBox.id = 'stats-modal';

        const closeButton = document.createElement('button');
        closeButton.id = 'stats-close-btn';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', hideStatsModal);

        const modalContent = document.createElement('div');
        modalContent.id = 'stats-content';
        modalContent.innerHTML = '请稍候...';

        modalBox.appendChild(closeButton);
        modalBox.appendChild(modalContent);
        modalOverlay.appendChild(modalBox);

        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                hideStatsModal();
            }
        });

        document.body.appendChild(modalOverlay);
    }

    function showStatsModal() {
        const contentElement = document.getElementById('stats-content');
        if (!contentElement) {
            console.error("无法找到弹窗内容元素 #stats-content");
            return;
        };

        if (dataReady) {
            contentElement.innerHTML = `
                <h3>订单统计 (最近加载)</h3>
                <p>订单数量： <strong>${latestCount}</strong> 单</p>
                <p>订单总额： <strong>¥ ${latestAmountStr}</strong></p>
                <p class="api-total">API报告的总订单数(所有分页)： <strong>${latestApiTotal}</strong></p>
            `;
        } else {
             contentElement.innerHTML = `
                <h3>订单统计</h3>
                <p>尚未成功加载和处理订单数据。</p>
                ${lastErrorMessage ? `<p style="color:red; font-weight:bold;">最后错误：${lastErrorMessage}</p>` : ''}
                <p>请尝试刷新页面、进行搜索或点击筛选/翻页来触发数据加载。</p>
                <p style="font-size:0.8em; color:#999;">(请同时检查浏览器控制台 F12 获取详细信息)</p>
            `;
        }
        if (modalOverlay) {
            modalOverlay.style.display = 'flex';
        }
    }

    function hideStatsModal() {
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    }

    // --- 添加样式 ---
    function addStyles() {
        GM_addStyle(`
            #show-stats-button:disabled {
                opacity: 0.7;
            }
            #show-stats-button:not(:disabled):hover {
                filter: brightness(90%);
            }
            /* Modal Styles */
            #stats-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6); display: none; /* Initial hide */
                justify-content: center; align-items: center; z-index: 10000;
            }
            #stats-modal {
                background-color: white; padding: 25px; border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); min-width: 280px;
                max-width: 90%; position: relative; text-align: left; line-height: 1.6;
            }
            #stats-close-btn {
                position: absolute; top: 5px; right: 10px; background: none;
                border: none; font-size: 24px; font-weight: bold;
                color: #888; cursor: pointer; padding: 5px; line-height: 1;
            }
            #stats-close-btn:hover { color: #333; }
            #stats-content h3 {
                 margin-top: 0; margin-bottom: 15px; color: #333;
                 border-bottom: 1px solid #eee; padding-bottom: 10px;
             }
             #stats-content p { margin: 8px 0; color: #555; }
             #stats-content strong { color: #0056b3; font-weight: bold; }
             #stats-content .api-total {
                 margin-top: 15px; padding-top: 10px;
                 border-top: 1px solid #eee; font-size: 0.9em; color: #6c757d;
             }
        `);
    }

    // --- 初始化 ---
    // Waits for body element before adding UI elements
    function onBodyExists(callback) {
        if (document.body) {
            callback();
        } else {
            // Fallback for browsers that might not support observing documentElement for body add
            const observer = new MutationObserver(mutations => {
                if (document.body) {
                    observer.disconnect();
                    callback();
                }
            });
             // Observe documentElement or document directly for body addition
            observer.observe(document.documentElement || document, { childList: true, subtree: true });
        }
    }

    onBodyExists(() => {
         console.log("Body element存在, 创建UI元素。");
         addStyles(); // Add styles first
         createButton();
         createModal();
         console.log("UI元素创建完毕。拦截器应该已设置。");
    });

})();