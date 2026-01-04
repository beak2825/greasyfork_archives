// ==UserScript==
// @name         唯品会联盟实时订单采集器-crazyunix
// @namespace    http://tampermonkey.net/
// @version      2025.06.26.1
// @description  在唯品会联盟订单报表页面，采集订单数据并发送到指定接口，同时展示状态面板和日志，支持自动翻页、重试、手动控制等功能。
// @author       Your Name
// @match        https://union.vip.com/v/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vip.com
// @connect      ff.wxmob.cn
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/541490/%E5%94%AF%E5%93%81%E4%BC%9A%E8%81%94%E7%9B%9F%E5%AE%9E%E6%97%B6%E8%AE%A2%E5%8D%95%E9%87%87%E9%9B%86%E5%99%A8-crazyunix.user.js
// @updateURL https://update.greasyfork.org/scripts/541490/%E5%94%AF%E5%93%81%E4%BC%9A%E8%81%94%E7%9B%9F%E5%AE%9E%E6%97%B6%E8%AE%A2%E5%8D%95%E9%87%87%E9%9B%86%E5%99%A8-crazyunix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_API_URL = 'https://ff.wxmob.cn/api/market/report/data';
    const VIP_ORDER_API_KEYWORD = 'v2/order/list';
    const CUSTOM_HEADERS = { 'Content-Type': 'application/json' };
    const MAX_RETRY = 3;

    let globalStopFlag = false;
    let currentPage = 1;
    let sendSuccessCount = 0;
    let lastFailedData = null;

    // 1. 注入浮动状态面板
    const panel = document.createElement('div');
    panel.id = 'vip-order-panel';
    panel.style.cssText = `
        position: fixed; top: 100px; right: 20px; width: 300px; background: #f9f9f9;
        border: 1px solid #ccc; border-radius: 8px; padding: 12px; z-index: 9999;
        box-shadow: 0 0 10px rgba(0,0,0,0.2); font-size: 14px; font-family: sans-serif;
    `;
    panel.innerHTML = `
        <div id="panel-header" style="cursor: move; font-weight: bold; background: #eee; padding: 5px 10px; border-radius: 6px 6px 0 0;">
            📊 实时采集状态
            <button id="close-panel" style="float: right; color: red; border: none; background: none; font-weight: bold; cursor: pointer;">✖</button>
        </div>
        <div style="margin-top: 10px">
            <label>📇 Advertiser ID：</label>
            <input id="advertiser-id" type="text" placeholder="请输入广告主ID"
                style="width: 100%; padding: 4px; margin-top: 4px; border-radius: 4px; border: 1px solid #ccc;"/>
        </div>
        <div id="status-panel" style="margin: 10px 0;"></div>
        <div style="display: flex; justify-content: space-between;">
            <button id="stop-btn">🛑 停止</button>
            <button id="retry-btn">🔁 重试</button>
            <button id="resume-btn">▶️ 继续</button>
        </div>
        <div id="log-panel" style="margin-top: 10px; max-height: 200px; overflow-y: auto; background: #fff; padding: 6px; border: 1px solid #ddd;"></div>
    `;
    document.body.appendChild(panel);

    // 2. 拖动支持
    const drag = document.getElementById('panel-header');
    drag.onmousedown = function (e) {
        const offsetX = e.clientX - panel.offsetLeft;
        const offsetY = e.clientY - panel.offsetTop;
        document.onmousemove = function (e) {
            panel.style.left = e.clientX - offsetX + 'px';
            panel.style.top = e.clientY - offsetY + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    // 3. 控件绑定
    document.getElementById('stop-btn').onclick = () => globalStopFlag = true;
    document.getElementById('retry-btn').onclick = () => {
        if (lastFailedData) {
            globalStopFlag = false;
            sendDataWithRetry(lastFailedData, MAX_RETRY, tryAutoTurnPage);
        }
    };
    document.getElementById('resume-btn').onclick = () => {
        globalStopFlag = false;
        tryAutoTurnPage();
    };
    document.getElementById('close-panel').onclick = () => panel.style.display = 'none';

    function updateStatusPanel({ page, status, retriesLeft, error }) {
        document.getElementById('status-panel').innerHTML =
            `📄 第 ${page} 页<br/>状态: ${status}<br/>重试剩余: ${retriesLeft}<br/>错误: ${error}`;
    }

    function addTaskLog(text) {
        const log = document.getElementById('log-panel');
        const line = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        line.textContent = `[${timestamp}] ${text}`;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
        console.log(`[LOG][${timestamp}] ${text}`);
    }

    // 4. 劫持 XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._requestURL = url;
        return originalOpen.apply(this, arguments);
    };
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            if (this._requestURL && this._requestURL.includes(VIP_ORDER_API_KEYWORD)) {
                if (this.status === 200 && this.responseText) {
                    try {
                        const responseData = JSON.parse(this.responseText);
                        sendDataWithRetry(responseData, MAX_RETRY, tryAutoTurnPage);
                    } catch (e) {
                        console.error('解析 JSON 失败:', e);
                    }
                }
            }
        });
        return originalSend.apply(this, arguments);
    };

    function sendDataWithRetry(data, retries, callback) {
        const advertiserId = document.getElementById('advertiser-id')?.value?.trim();

        if (!advertiserId) {
            updateStatusPanel({ page: currentPage, status: '❌ 未填写广告主ID', retriesLeft: 0, error: '缺失ID' });
            addTaskLog('🚫 未发送：广告主ID为空');
            return;
        }

        lastFailedData = data;
        const headers = { ...CUSTOM_HEADERS, advertiserId };
        updateStatusPanel({ page: currentPage, status: '发送中...', retriesLeft: retries, error: '' });

        console.log(`🛰️ 正在发送第 ${currentPage} 页数据到 ${TARGET_API_URL}`);
        console.log(`添加的 header advertiserId=${advertiserId}`);

        GM_xmlhttpRequest({
            method: 'POST',
            url: TARGET_API_URL,
            headers,
            data: JSON.stringify(data),
            onload: function (resp) {
                if (resp.status >= 200 && resp.status < 300) {
                    sendSuccessCount++;
                    lastFailedData = null;
                    updateStatusPanel({ page: currentPage, status: '✅ 成功', retriesLeft: retries, error: '' });
                    addTaskLog(`✅ 第 ${currentPage} 页发送成功`);
                    callback && callback();
                } else {
                    retryOrFail(`HTTP状态 ${resp.status}`);
                }
            },
            onerror: () => retryOrFail('网络错误')
        });

        function retryOrFail(msg) {
            if (retries > 1) {
                updateStatusPanel({ page: currentPage, status: '重试中...', retriesLeft: retries - 1, error: msg });
                setTimeout(() => sendDataWithRetry(data, retries - 1, callback), 1500);
            } else {
                updateStatusPanel({ page: currentPage, status: '❌ 失败', retriesLeft: 0, error: msg });
                globalStopFlag = true;
                addTaskLog(`❌ 第 ${currentPage} 页失败：${msg}`);
                alert('❌ 数据发送失败，请检查接口或广告主ID');
            }
        }
    }

    function tryAutoTurnPage() {
        if (globalStopFlag) return;
        const nextBtn = document.querySelector('button.btn-next');
        if (!nextBtn) {
            console.warn('⚠️ 未找到翻页按钮');
            return;
        }
        if (nextBtn.disabled) {
            updateStatusPanel({ page: currentPage, status: '✅ 全部完成', retriesLeft: 0, error: '' });
            addTaskLog(`🎉 全部采集完成，成功 ${sendSuccessCount} 页`);
            alert('✅ 所有订单数据已采集完成！');
        } else {
            currentPage++;
            updateStatusPanel({ page: currentPage, status: '翻页中...', retriesLeft: MAX_RETRY, error: '' });
            // 👇 添加翻页延迟，1 秒后点击下一页
            setTimeout(() => {
                nextBtn.click();
            }, 1000);
        }
    }
})();
