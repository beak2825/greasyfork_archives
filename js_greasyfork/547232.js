// ==UserScript==
// @name         GMGN 净买入追踪器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  追踪和计算净买入地址数据
// @match        https://gmgn.ai/*
// @match        https://www.gmgn.ai/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547232/GMGN%20%E5%87%80%E4%B9%B0%E5%85%A5%E8%BF%BD%E8%B8%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547232/GMGN%20%E5%87%80%E4%B9%B0%E5%85%A5%E8%BF%BD%E8%B8%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let isRecording = false;
    let tradeData = new Map(); // 存储交易数据 {maker: {buyAmount: 0, sellAmount: 0, netBuying: 0}}
    let currentCaAddress = null;
    let totalTradesProcessed = 0; // 总处理交易数量
    
    // 检查是否为有效的代币页面
    function isValidTokenPage() {
        const url = window.location.href;
        const pattern = /^https:\/\/gmgn\.ai\/(sol|base|tron|eth|bsc)\/token\//;
        return pattern.test(url);
    }
    
    // 动态添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
    .net-buying-tracker-buttons {
        display: flex;
        margin-right: 8px;
        border: 1px solid rgb(75 85 99);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .net-buying-btn {
        height: 24px;
        display: flex;
        align-items: center;
        text-sm: true;
        color: rgb(156 163 175);
        cursor: pointer;
        padding: 4px 12px;
        background: transparent;
        border: none;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        position: relative;
        white-space: nowrap;
        border-right: 1px solid rgb(75 85 99);
    }
    
    .net-buying-btn:last-child {
        border-right: none;
    }
    
    .net-buying-btn:hover:not(:disabled) {
        background: rgb(55 65 81);
        color: rgb(243 244 246);
    }
    
    .net-buying-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .net-buying-btn.active {
        background: rgb(37 99 235);
        color: white;
        border-color: rgb(37 99 235);
    }
    
    .net-buying-btn.recording {
        background: rgb(220 38 38);
        color: white;
        border-color: rgb(220 38 38);
    }
    
    .net-buying-btn .recording-dot {
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        margin-left: 4px;
        animation: pulse 1.5s ease-in-out infinite alternate;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        100% { opacity: 0.3; }
    }
    
    /* 弹窗样式 */
    .net-buying-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .net-buying-modal-content {
        background-color: #1e293b !important;
        border-radius: 8px !important;
        width: 80% !important;
        max-width: 900px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        padding: 20px !important;
        color: white !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        margin: 0 !important;
        z-index: 100000 !important;
        box-sizing: border-box !important;
        min-height: auto !important;
        min-width: 300px !important;
        pointer-events: auto !important;
    }
    
    .net-buying-modal-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 16px !important;
        padding: 0 !important;
    }
    
    .net-buying-modal-title {
        font-size: 18px !important;
        font-weight: 600 !important;
        color: white !important;
        margin: 0 !important;
    }
    
    .net-buying-modal-close {
        background: none !important;
        border: none !important;
        color: #94a3b8 !important;
        font-size: 20px !important;
        cursor: pointer !important;
        padding: 5px !important;
        line-height: 1 !important;
        width: auto !important;
        height: auto !important;
        min-width: 30px !important;
        min-height: 30px !important;
    }
    
    .net-buying-modal-close:hover {
        color: #ff4444 !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px !important;
    }
    
    .net-buying-summary {
        margin-bottom: 16px;
        padding: 12px;
        background-color: #263238;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .net-buying-stats {
        display: flex;
        gap: 20px;
    }
    
    .net-buying-stat-item {
        display: flex;
        align-items: baseline;
    }
    
    .net-buying-stat-label {
        color: #94a3b8;
        margin-right: 5px;
    }
    
    .net-buying-stat-value {
        font-weight: 600;
        color: #3b82f6;
    }
    
    .net-buying-export-btn {
        background-color: #10b981 !important;
        color: white !important;
        border: none !important;
        padding: 8px 16px !important;
        border-radius: 6px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
    }
    
    .net-buying-export-btn:hover {
        background-color: #059669 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3) !important;
    }
    
    .net-buying-result-item {
        background-color: #334155;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 12px;
    }
    
    .net-buying-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .net-buying-result-rank {
        font-size: 14px;
        color: #94a3b8;
        font-weight: 600;
        min-width: 30px;
    }
    
    .net-buying-result-address {
        font-weight: 600;
        word-break: break-all;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s ease;
        background-color: #475569;
        flex: 1;
        min-width: 200px;
        color: #00ff88;
        font-family: monospace;
    }
    
    .net-buying-result-address:hover {
        background-color: #64748b;
        transform: translateY(-1px);
    }
    
    .net-buying-detail-section {
        margin-bottom: 12px;
    }
    
    .net-buying-section-title {
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
        margin-bottom: 8px;
    }
    
    .net-buying-detail-grid {
        display: grid;
        grid-template-columns: 80px 1fr 80px 1fr 80px 1fr;
        gap: 4px 8px;
        align-items: start;
        font-size: 12px;
    }
    
    .net-buying-detail-label {
        color: #94a3b8;
        font-size: 12px;
        padding: 2px 0;
        align-self: start;
    }
    
    .net-buying-detail-value {
        font-size: 12px;
        color: #e2e8f0;
        padding: 2px 0;
        word-break: break-word;
        line-height: 1.4;
    }
    
    .net-buying-value-highlight {
        color: #3b82f6;
        font-weight: 600;
    }
    
    .net-buying-value-positive {
        color: #00ff88 !important;
    }
    
    .net-buying-address-jump-btn {
        background-color: #10b981;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 500;
        margin-left: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
        border: none;
    }
    
    .net-buying-address-jump-btn:hover {
        background-color: #059669;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
    }
    `;
    
    // 只在有效的代币页面添加样式
    if (isValidTokenPage()) {
        document.head.appendChild(style);
    }
    
    // 数字格式化函数
    function formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';
        
        const isNegative = num < 0;
        const absNum = Math.abs(num);
        
        let formatted;
        if (absNum >= 1000000000) {
            formatted = (absNum / 1000000000).toFixed(2) + 'B';
        } else if (absNum >= 1000000) {
            formatted = (absNum / 1000000).toFixed(2) + 'M';
        } else if (absNum >= 1000) {
            formatted = (absNum / 1000).toFixed(2) + 'K';
        } else {
            formatted = absNum.toFixed(2);
        }
        
        return isNegative ? '-' + formatted : formatted;
    }
    
    // 提取CA地址和网络
    function extractCaAndNetwork(url) {
        const match = url.match(/\/vas\/api\/v1\/token_trades\/([^\/]+)\/([^\/\?]+)/);
        if (match) {
            return {
                network: match[1],
                ca: match[2]
            };
        }
        return null;
    }
    
    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (isRecording && typeof url === 'string' && url.includes('/vas/api/v1/token_trades/')) {
            console.log('[净买入追踪] 拦截到交易请求:', url);
            return originalFetch.apply(this, arguments)
                .then(response => {
                    if (response.ok) {
                        processTradeResponse(response.clone(), url);
                    }
                    return response;
                });
        }
        return originalFetch.apply(this, arguments);
    };
    
    // 拦截XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            if (isRecording && typeof url === 'string' && url.includes('/vas/api/v1/token_trades/')) {
                console.log('[净买入追踪] 拦截到XHR交易请求:', url);
                const originalOnload = xhr.onload;
                xhr.onload = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        processTradeResponse(xhr.responseText, url);
                    }
                    originalOnload?.apply(this, arguments);
                };
            }
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };
    
    // 处理交易响应数据
    function processTradeResponse(response, url) {
        try {
            const dataPromise = typeof response === 'string' ?
                Promise.resolve(JSON.parse(response)) :
                response.json();
                
            dataPromise.then(data => {
                if (data.code === 0 && data.data && data.data.history) {
                    // 提取CA地址
                    const urlInfo = extractCaAndNetwork(url);
                    if (urlInfo) {
                        currentCaAddress = urlInfo.ca;
                    }
                    
                    // 处理交易数据
                    data.data.history.forEach(trade => {
                        recordTrade(trade);
                    });
                    
                    console.log('[净买入追踪] 本次处理了', data.data.history.length, '条交易记录');
                    console.log('[净买入追踪] 累计处理交易:', totalTradesProcessed, '条');
                    console.log('[净买入追踪] 唯一地址数量:', tradeData.size, '个');
                }
            }).catch(e => {
                console.error('[净买入追踪] 解析响应失败:', e);
            });
        } catch (e) {
            console.error('[净买入追踪] 处理响应错误:', e);
        }
    }
    
    // 记录交易数据
    function recordTrade(trade) {
        const { maker, event, amount_usd } = trade;
        
        if (!maker || !event || !amount_usd) return;
        
        // 累计总交易数
        totalTradesProcessed++;
        
        if (!tradeData.has(maker)) {
            tradeData.set(maker, {
                buyAmount: 0,
                sellAmount: 0,
                netBuying: 0,
                totalTrades: 0
            });
        }
        
        const userData = tradeData.get(maker);
        userData.totalTrades++;
        
        if (event === 'buy') {
            userData.buyAmount += parseFloat(amount_usd);
        } else if (event === 'sell') {
            userData.sellAmount += parseFloat(amount_usd);
        }
        
        userData.netBuying = userData.buyAmount - userData.sellAmount;
    }
    
    // 计算净买入数据
    function calculateNetBuying() {
        const netBuyingAddresses = [];
        
        tradeData.forEach((data, maker) => {
            if (data.netBuying > 0) {
                netBuyingAddresses.push({
                    address: maker,
                    buyAmount: data.buyAmount,
                    sellAmount: data.sellAmount,
                    netBuying: data.netBuying,
                    totalTrades: data.totalTrades
                });
            }
        });
        
        // 按净买入量降序排列
        netBuyingAddresses.sort((a, b) => b.netBuying - a.netBuying);
        
        return netBuyingAddresses;
    }
    
    // 创建结果弹窗
    function createResultModal(netBuyingData) {
        // 移除已存在的弹窗
        const existingModal = document.querySelector('.net-buying-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'net-buying-modal';
        
        modal.innerHTML = `
            <div class="net-buying-modal-content">
                <div class="net-buying-modal-header">
                    <div class="net-buying-modal-title">📈 净买入地址分析 (共${netBuyingData.length}个地址)</div>
                    <button class="net-buying-modal-close">&times;</button>
                </div>
                <div class="net-buying-summary">
                    <div class="net-buying-stats">
                        <div class="net-buying-stat-item">
                            <span class="net-buying-stat-label">净买入地址:</span>
                            <span class="net-buying-stat-value">${netBuyingData.length}</span>
                        </div>
                        <div class="net-buying-stat-item">
                            <span class="net-buying-stat-label">总交易数:</span>
                            <span class="net-buying-stat-value">${totalTradesProcessed}</span>
                        </div>
                        <div class="net-buying-stat-item">
                            <span class="net-buying-stat-label">唯一地址:</span>
                            <span class="net-buying-stat-value">${tradeData.size}</span>
                        </div>
                    </div>
                    <button id="net-buying-export-btn" class="net-buying-export-btn" title="导出Excel">📊 导出Excel</button>
                </div>
                <div id="net-buying-results-list"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 填充结果列表
        const resultsList = document.getElementById('net-buying-results-list');
        netBuyingData.forEach((item, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'net-buying-result-item';
            resultItem.innerHTML = `
                <div class="net-buying-result-header">
                    <div class="net-buying-result-rank">#${index + 1}</div>
                    <div class="net-buying-result-address" title="点击复制地址">${item.address}</div>
                    <a href="https://gmgn.ai/sol/address/${item.address}" target="_blank" class="net-buying-address-jump-btn" title="查看钱包详情">详情</a>
                </div>
                <div class="net-buying-compact-details">
                    <div class="net-buying-detail-section">
                        <div class="net-buying-section-title">交易信息</div>
                        <div class="net-buying-detail-grid">
                            <span class="net-buying-detail-label">买入额:</span>
                            <span class="net-buying-detail-value net-buying-value-positive">$${formatNumber(item.buyAmount)}</span>
                            <span class="net-buying-detail-label">卖出额:</span>
                            <span class="net-buying-detail-value">$${formatNumber(item.sellAmount)}</span>
                            <span class="net-buying-detail-label">净买入:</span>
                            <span class="net-buying-detail-value net-buying-value-highlight">$${formatNumber(item.netBuying)}</span>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加地址复制功能
            const addressElement = resultItem.querySelector('.net-buying-result-address');
            addressElement.addEventListener('click', () => {
                navigator.clipboard.writeText(item.address).then(() => {
                    addressElement.style.backgroundColor = '#16a34a';
                    addressElement.style.color = 'white';
                    setTimeout(() => {
                        addressElement.style.backgroundColor = '';
                        addressElement.style.color = '';
                    }, 1000);
                });
            });
            
            resultsList.appendChild(resultItem);
        });
        
        // ESC键关闭处理函数
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', escKeyHandler);
        
        // 关闭弹窗函数
        function closeModal() {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escKeyHandler);
            // 关闭弹窗后重置数据和按钮状态
            resetData();
            updateButtonStates();
        }
        
        // 绑定导出Excel按钮事件
        const exportBtn = modal.querySelector('#net-buying-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportToExcel(netBuyingData);
            });
        }
        
        // 绑定关闭按钮事件
        modal.querySelector('.net-buying-modal-close').addEventListener('click', closeModal);
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Excel导出功能
    function exportToExcel(data) {
        try {
            const worksheetData = [];
            
            // 添加标题行
            worksheetData.push(['排名', '地址', '买入金额(USD)', '卖出金额(USD)', '净买入(USD)', '交易次数']);
            
            // 添加数据行
            data.forEach((item, index) => {
                worksheetData.push([
                    index + 1,
                    item.address,
                    item.buyAmount.toFixed(2),
                    item.sellAmount.toFixed(2),
                    item.netBuying.toFixed(2),
                    item.totalTrades || 0
                ]);
            });
            
            // 创建工作簿
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);
            
            // 设置列宽
            const colWidths = [
                {wch: 6},   // 排名
                {wch: 45},  // 地址
                {wch: 15},  // 买入金额
                {wch: 15},  // 卖出金额
                {wch: 15},  // 净买入
                {wch: 10}   // 交易次数
            ];
            ws['!cols'] = colWidths;
            
            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, '净买入地址');
            
            // 生成文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `净买入地址_${currentCaAddress ? currentCaAddress.slice(0, 8) : 'data'}_${timestamp}.xlsx`;
            
            // 下载文件
            XLSX.writeFile(wb, fileName);
            
            // 显示成功提示
            const exportBtn = document.querySelector('#net-buying-export-btn');
            if (exportBtn) {
                const originalText = exportBtn.textContent;
                exportBtn.textContent = '✅ 导出成功';
                exportBtn.style.backgroundColor = '#059669';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.style.backgroundColor = '';
                }, 2000);
            }
            
        } catch (error) {
            console.error('Excel导出失败:', error);
            alert('导出失败，请检查浏览器控制台了解详情');
        }
    }
    
    // 重置数据
    function resetData() {
        tradeData.clear();
        currentCaAddress = null;
        totalTradesProcessed = 0;
        isRecording = false;
        console.log('[净买入追踪] 数据已重置');
    }
    
    // 更新按钮状态
    function updateButtonStates() {
        const recordBtn = document.getElementById('net-buying-record-btn');
        const calculateBtn = document.getElementById('net-buying-calculate-btn');
        const resetBtn = document.getElementById('net-buying-reset-btn');
        
        if (!recordBtn || !calculateBtn || !resetBtn) return;
        
        if (isRecording) {
            recordBtn.textContent = '录入中';
            recordBtn.className = 'net-buying-btn recording';
            recordBtn.innerHTML = '录入中<span class="recording-dot"></span>';
            calculateBtn.disabled = true;
        } else {
            recordBtn.textContent = '录入';
            recordBtn.className = 'net-buying-btn';
            recordBtn.innerHTML = '录入';
            calculateBtn.disabled = tradeData.size === 0;
        }
    }
    
    // 创建按钮组
    function createButtonGroup() {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'net-buying-tracker-buttons';
        buttonGroup.innerHTML = `
            <button id="net-buying-record-btn" class="net-buying-btn">录入</button>
            <button id="net-buying-calculate-btn" class="net-buying-btn" disabled>计算</button>
            <button id="net-buying-reset-btn" class="net-buying-btn">重置</button>
        `;
        
        // 绑定事件
        const recordBtn = buttonGroup.querySelector('#net-buying-record-btn');
        const calculateBtn = buttonGroup.querySelector('#net-buying-calculate-btn');
        const resetBtn = buttonGroup.querySelector('#net-buying-reset-btn');
        
        recordBtn.addEventListener('click', () => {
            isRecording = !isRecording;
            updateButtonStates();
            console.log('[净买入追踪] 录入状态:', isRecording ? '开启' : '关闭');
        });
        
        calculateBtn.addEventListener('click', () => {
            if (tradeData.size > 0) {
                isRecording = false;
                updateButtonStates();
                const netBuyingData = calculateNetBuying();
                createResultModal(netBuyingData);
                console.log('[净买入追踪] 计算结果:', netBuyingData.length, '个净买入地址');
            }
        });
        
        resetBtn.addEventListener('click', () => {
            resetData();
            updateButtonStates();
        });
        
        return buttonGroup;
    }
    
    // 监听DOM变化，插入按钮
    const observer = new MutationObserver(() => {
        const targetTablist = document.querySelector('div[role="tablist"][aria-orientation="horizontal"].chakra-tabs__tablist.css-mm231k');
        if (targetTablist && !document.querySelector('.net-buying-tracker-buttons')) {
            const buttonGroup = createButtonGroup();
            const children = targetTablist.children;
            if (children.length >= 2) {
                // 插入到第二个子元素之前
                targetTablist.insertBefore(buttonGroup, children[1]);
            } else {
                // 如果子元素不足两个，就追加到末尾
                targetTablist.appendChild(buttonGroup);
            }
            console.log('[净买入追踪] 按钮组已插入到chakra-tabs__tablist');
        }
    });
    
    // 初始化
    function initialize() {
        // 立即检查一次
        const targetTablist = document.querySelector('div[role="tablist"][aria-orientation="horizontal"].chakra-tabs__tablist.css-mm231k');
        if (targetTablist && !document.querySelector('.net-buying-tracker-buttons')) {
            const buttonGroup = createButtonGroup();
            const children = targetTablist.children;
            if (children.length >= 2) {
                // 插入到第二个子元素之前
                targetTablist.insertBefore(buttonGroup, children[1]);
            } else {
                // 如果子元素不足两个，就追加到末尾
                targetTablist.appendChild(buttonGroup);
            }
            console.log('[净买入追踪] 按钮组已插入到chakra-tabs__tablist');
        }
        
        // 开始监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
    
    // 启动 - 只在有效的代币页面启动
    if (isValidTokenPage()) {
        if (document.readyState === 'complete') {
            initialize();
        } else {
            window.addEventListener('DOMContentLoaded', initialize);
        }
        console.log('[净买入追踪] 脚本已加载');
    } else {
        console.log('[净买入追踪] 当前页面不是代币页面，脚本未启动');
    }
})();