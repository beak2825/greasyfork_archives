// ==UserScript==
// @name         GMGN.ai 前排标注查询工具
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  获取GMGN.ai前100持仓者的MemeRadar标注信息
// @author       专业油猴脚本开发者
// @match        https://gmgn.ai/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      plugin.chaininsight.vip
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544203/GMGNai%20%E5%89%8D%E6%8E%92%E6%A0%87%E6%B3%A8%E6%9F%A5%E8%AF%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544203/GMGNai%20%E5%89%8D%E6%8E%92%E6%A0%87%E6%B3%A8%E6%9F%A5%E8%AF%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[标注查询] MemeRadar标注查询工具已启动');

    // 全局变量
    let currentCA = ''; // 当前代币合约地址
    let currentChain = ''; // 当前链网络
    let topHolders = []; // 前排持仓者地址列表
    let tagData = []; // 标注数据
    let isDataReady = false; // 数据是否就绪
    let isFetchingTags = false; // 是否正在获取标注
    let hasInterceptedTags = false; // 是否已拦截到标注数据
    let hasInterceptedHolders = false; // 是否已拦截到持仓者数据
    let interceptedCA = ''; // 已拦截的CA地址

    // 链网络映射
    const chainMapping = {
        'sol': 'Solana',
        'eth': 'Ethereum',
        'base': 'Base',
        'bsc': 'bsc',
        // tron 不支持
    };

    // 立即设置XHR拦截
    setupXhrInterception();

    // DOM加载完成后初始化UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        setTimeout(initializeUI, 100);
    }

    /**
     * 设置XHR请求拦截
     */
    function setupXhrInterception() {
        console.log('[请求拦截] 开始设置token_holders请求拦截');

        // 避免重复设置
        if (window._memeradarInterceptionSetup) {
            console.log('[请求拦截] 检测到已存在拦截设置，跳过重复设置');
            return;
        }

        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            const url = this._url;

            // 监听token_holders请求
            if (url && url.includes('/vas/api/v1/token_holders/')) {
                // 解析链网络和CA地址
                const urlMatch = url.match(/\/token_holders\/([^\/]+)\/([^?]+)/);
                if (!urlMatch) {
                    console.warn('[请求拦截] ⚠️无法解析token_holders URL:', url);
                    return originalSend.apply(this, arguments);
                }

                const chain = urlMatch[1];
                const ca = urlMatch[2];

                // 检查是否已经拦截过这个CA
                if (hasInterceptedHolders && interceptedCA === ca) {
                    console.log(`[请求拦截] 📋已拦截过CA ${ca} 的持仓者数据，跳过重复拦截`);
                    return originalSend.apply(this, arguments);
                }

                console.log('[请求拦截] 🎯捕获到token_holders请求:', url);
                console.log(`[数据解析] 链网络: ${chain}, CA地址: ${ca}`);

                // 检查CA是否变化
                if (currentCA && currentCA !== ca) {
                    console.log('[数据重置] 检测到CA地址变化，清除所有数据');
                    resetAllData();
                }

                currentChain = chain;
                currentCA = ca;
                console.log('currentChain', currentChain);
                console.log('currentCA', currentCA);

                this.addEventListener('load', function() {
                    if (this.status === 200) {
                        console.log('[请求拦截] ✅token_holders请求成功');
                        try {
                            const response = JSON.parse(this.responseText);
                            if (response.code === 0 && response.data && response.data.list) {
                                processTokenHolders(response.data.list);
                                // 标记已拦截成功
                                hasInterceptedHolders = true;
                                interceptedCA = ca;
                                console.log(`[拦截完成] ✅已完成CA ${ca} 的持仓者数据拦截，后续请求将被跳过`);
                            } else {
                                console.warn('[数据处理] ⚠️token_holders返回数据格式异常:', response);
                            }
                        } catch (error) {
                            console.error('[数据处理] ❌解析token_holders响应失败:', error);
                        }
                    } else {
                        console.error('[请求拦截] ❌token_holders请求失败，状态码:', this.status);
                    }
                });
            }

            // 监听wallet_tags_v2请求
            if (url && url.includes('/api/v0/util/query/wallet_tags_v2')) {
                // 检查是否已经拦截过标注数据（针对当前CA）
                if (hasInterceptedTags && currentCA) {
                    console.log(`[请求拦截] 📋已拦截过CA ${currentCA} 的标注数据，跳过重复拦截`);
                    return originalSend.apply(this, arguments);
                }

                console.log('[请求拦截] 🎯捕获到wallet_tags_v2请求:', url);

                this.addEventListener('load', function() {
                    if (this.status === 200) {
                        console.log('[请求拦截] ✅wallet_tags_v2请求成功');
                        try {
                            const response = JSON.parse(this.responseText);
                            console.log('[标注拦截] wallet_tags_v2响应数据:', response);

                            if (response.code === 0 && response.data) {
                                console.log('[标注拦截] ✅成功拦截到标注数据，开始处理');

                                // 确保有持仓者数据才处理
                                if (topHolders && topHolders.length > 0) {
                                    processInterceptedTagData(response.data);
                                    hasInterceptedTags = true;
                                    updateButtonState();
                                    console.log('[标注拦截] ✅标注数据处理完成，已更新按钮状态');
                                } else {
                                    console.warn('[标注拦截] ⚠️持仓者数据尚未准备，延迟处理标注数据');
                                    // 保存标注数据，等待持仓者数据准备完成
                                    window._pendingTagData = response.data;
                                }
                            } else {
                                console.warn('[数据处理] ⚠️wallet_tags_v2返回数据格式异常:', response);
                                console.log('[数据处理] 响应码:', response.code, '消息:', response.msg);
                            }
                        } catch (error) {
                            console.error('[数据处理] ❌解析wallet_tags_v2响应失败:', error);
                        }
                    } else {
                        console.error('[请求拦截] ❌wallet_tags_v2请求失败，状态码:', this.status);
                    }
                });

                this.addEventListener('error', function(error) {
                    console.error('[请求拦截] ❌wallet_tags_v2网络请求错误:', error);
                });
            }

            return originalSend.apply(this, arguments);
        };

        window._memeradarInterceptionSetup = true;
        console.log('[请求拦截] ✅XHR拦截设置完成');
    }

    /**
     * 处理持仓者数据
     */
    function processTokenHolders(holdersList) {
        console.log(`[数据处理] 开始处理持仓者列表，总数量: ${holdersList.length}`);

        // 提取前100个地址
        topHolders = holdersList.slice(0, 100).map(holder => holder.address);
        isDataReady = true;

        console.log(`[数据处理] ✅已提取前${topHolders.length}个持仓者地址`);
        console.log('[数据处理] 前5个地址示例:', topHolders.slice(0, 5));

        // 检查是否有待处理的标注数据
        if (window._pendingTagData) {
            console.log('[数据处理] 🔄发现待处理的标注数据，开始处理');
            processInterceptedTagData(window._pendingTagData);
            hasInterceptedTags = true;
            window._pendingTagData = null; // 清除待处理数据
            console.log('[数据处理] ✅待处理标注数据处理完成');
        }

        // 更新按钮状态
        updateButtonState();
    }

    /**
     * 处理拦截到的标注数据
     */
    function processInterceptedTagData(responseData) {
        console.log('[拦截数据] 开始处理拦截到的标注数据');

        if (!responseData || !responseData.walletTags) {
            console.warn('[拦截数据] 响应数据格式异常');
            return;
        }

        // 创建地址到标注的映射
        const tagMap = {};
        responseData.walletTags.forEach(wallet => {
            tagMap[wallet.address] = {
                count: wallet.count || 0,
                tags: wallet.tags ? wallet.tags.map(tag => tag.tagName) : [],
                expertTags: wallet.expertTags ? wallet.expertTags.map(tag => tag.tagName) : []
            };
        });

        // 为所有地址创建完整的标注数据
        tagData = topHolders.map(address => {
            const walletTags = tagMap[address] || { count: 0, tags: [], expertTags: [] };
            return {
                address: address,
                tagCount: walletTags.count,
                tags: walletTags.tags,
                expertTags: walletTags.expertTags
            };
        });

        // 按标注数量降序排序
        tagData.sort((a, b) => b.tagCount - a.tagCount);

        console.log(`[拦截数据] ✅处理完成，共${tagData.length}个地址，有标注的地址：${tagData.filter(w => w.tagCount > 0).length}个`);
    }

    /**
     * 重置所有数据
     */
    function resetAllData() {
        console.log('[数据重置] 🔄开始重置所有数据和拦截状态');

        currentCA = '';
        currentChain = '';
        topHolders = [];
        tagData = [];
        isDataReady = false;
        isFetchingTags = false;
        hasInterceptedTags = false;
        hasInterceptedHolders = false;
        interceptedCA = '';

        // 清除待处理的标注数据
        if (window._pendingTagData) {
            window._pendingTagData = null;
        }

        console.log('[数据重置] ✅所有数据和拦截状态已重置，可开始新一轮拦截');
    }

    /**
     * 初始化UI界面
     */
    function initializeUI() {
        console.log('[UI初始化] 开始初始化用户界面');
        addStyles();
        setupUI();
        console.log('[UI初始化] ✅用户界面初始化完成');
    }

    /**
     * 添加CSS样式
     */
    function addStyles() {
        GM_addStyle(`
            .memeradar-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 6px 12px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-right: 8px;
                min-width: 80px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
            }

            .memeradar-btn:disabled {
                background: #94a3b8;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            .memeradar-btn.fetching {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                animation: pulse 2s infinite;
            }
            .memeradar-btn.ready {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .memeradar-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100000;
            }
            .memeradar-modal-content {
                background-color: #1e293b !important;
                border-radius: 8px !important;
                width: 80% !important;
                max-width: 800px !important;
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
            .memeradar-modal-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 16px !important;
                padding: 0 !important;
            }
            .memeradar-modal-title {
                font-size: 18px !important;
                font-weight: 600 !important;
                color: white !important;
                margin: 0 !important;
            }
            .memeradar-modal-subtitle {
                color: #94a3b8 !important;
                font-size: 14px !important;
            }
            .memeradar-header-actions {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .memeradar-export-btn {
                background: #3b82f6 !important;
                color: white !important;
                border: none !important;
                padding: 6px 12px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 14px !important;
            }
            .memeradar-export-btn:hover {
                background: #2563eb !important;
            }
            .memeradar-modal-close {
                background: none !important;
                border: none !important;
                color: #94a3b8 !important;
                font-size: 20px !important;
                cursor: pointer !important;
                padding: 5px !important;
                line-height: 1 !important;
                width: 30px !important;
                height: 30px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .memeradar-modal-close:hover {
                color: #ff4444 !important;
                background-color: rgba(255, 255, 255, 0.1) !important;
                border-radius: 4px !important;
            }
            .memeradar-analysis-summary {
                margin-bottom: 16px;
                padding: 12px;
                background-color: #263238;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .memeradar-summary-stats {
                display: flex;
                gap: 20px;
            }
            .memeradar-stat-item {
                display: flex;
                align-items: baseline;
            }
            .memeradar-stat-label {
                color: #94a3b8;
                margin-right: 5px;
            }
            .memeradar-stat-value {
                font-weight: 600;
                color: #3b82f6;
            }
            .memeradar-result-item {
                background-color: #334155;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .memeradar-wallet-info {
                flex: 1;
            }
            .memeradar-wallet-address {
                color: #3b82f6;
                font-family: monospace;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 4px;
            }
            .memeradar-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            .memeradar-tag {
                background: rgba(59, 130, 246, 0.2);
                color: #93c5fd;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 12px;
            }
            .memeradar-expert-tag {
                background: rgba(249, 115, 22, 0.2);
                color: #fb923c;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 12px;
            }
            .memeradar-tag-count {
                color: #10b981;
                font-weight: 600;
                margin-left: 12px;
                min-width: 40px;
                text-align: center;
            }
            .memeradar-modal-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 18px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
            }

            .memeradar-modal-body {
                padding: 12px;
                /* 移除滾動條，自適應內容高度 */
                overflow: visible;
                /* 性能優化 */
                contain: layout style paint;
                transform: translateZ(0);
            }
            .memeradar-stats {
                background: rgba(59, 130, 246, 0.1);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 6px;
                padding: 10px;
                margin-bottom: 12px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            .memeradar-stat-item {
                text-align: center;
            }
            .memeradar-stat-label {
                color: #94a3b8;
                font-size: 10px;
                margin-bottom: 2px;
            }
            .memeradar-stat-value {
                color: #3b82f6;
                font-size: 16px;
                font-weight: 600;
            }
            .memeradar-export-btn {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 3px;
                height: 28px;
                box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
            }

            .memeradar-wallets-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                /* 表格性能優化 */
                table-layout: fixed;
                contain: layout style paint;
                transform: translateZ(0);
                /* 進一步性能優化 */
                will-change: auto;
                backface-visibility: hidden;
            }
            .memeradar-wallets-table th {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                padding: 8px 6px;
                text-align: left;
                font-weight: 600;
                font-size: 10px;
                border-bottom: 1px solid rgba(59, 130, 246, 0.3);
                position: sticky;
                top: 0;
                z-index: 10;
            }
            .memeradar-wallets-table th:first-child {
                width: 45%;
            }
            .memeradar-wallets-table th:nth-child(2) {
                width: 10%;
                text-align: center;
            }
            .memeradar-wallets-table th:last-child {
                width: 45%;
            }
            .memeradar-wallets-table td {
                padding: 6px;
                border-bottom: 1px solid rgba(100, 116, 139, 0.2);
                vertical-align: top;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
            }
            .memeradar-wallets-table tr:nth-child(even) td {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%);
            }
            .memeradar-wallet-address {
                font-family: 'Courier New', monospace;
                color: #e2e8f0;
                font-size: 13px;
                cursor: pointer;
                padding: 2px 4px;
                background: rgba(15, 23, 42, 0.8);
                border-radius: 3px;
                word-break: break-all;
                display: inline-block;
                width: 100%;
            }
            .memeradar-tag-count {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: 600;
                box-shadow: 0 1px 2px rgba(245, 158, 11, 0.3);
                display: inline-block;
            }
            .memeradar-tags-container {
                display: flex;
                flex-wrap: wrap;
                gap: 2px;
                line-height: 1.3;
            }
            .memeradar-tag {
                background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(192, 132, 252, 0.3);
            }
            .memeradar-expert-tag {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
                position: relative;
            }
            .memeradar-expert-tag::before {
                content: "⭐";
                margin-right: 2px;
            }
            .memeradar-no-tags {
                color: #94a3b8;
                font-style: italic;
                font-size: 10px;
            }
            .memeradar-loading {
                text-align: center;
                padding: 40px;
                color: #94a3b8;
            }
            .memeradar-error {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.2);
                color: #ef4444;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 14px;
            }
        `);
    }

    /**
     * 设置UI界面
     */
    function setupUI() {
        const observer = new MutationObserver(() => {
            const targetContainer = document.querySelector('.flex.overflow-x-auto.overflow-y-hidden.scroll-smooth.w-full');
            if (targetContainer && !targetContainer.querySelector('#memeradar-btn')) {
                injectButton(targetContainer);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 注入按钮到页面
     */
    function injectButton(container) {
        const button = document.createElement('button');
        button.id = 'memeradar-btn';
        button.className = 'memeradar-btn';
        button.textContent = '获取前排标注';

        container.insertAdjacentElement('afterbegin', button);

        button.addEventListener('click', handleButtonClick);
        console.log('[UI注入] ✅前排标注按钮已注入');
    }

    /**
     * 处理按钮点击事件
     */
    async function handleButtonClick() {
        const button = document.getElementById('memeradar-btn');

        if (isFetchingTags) {
            console.log('[按钮点击] 正在获取标注中，忽略点击');
            return;
        }

        // 检查数据是否就绪
        if (!isDataReady || !topHolders.length) {
            showErrorModal('数据尚未就绪', '请等待页面加载完成，或刷新页面重试。\n\n可能原因：\n1. 页面数据还在加载中\n2. 网络请求被拦截失败\n3. 当前页面不是代币详情页');
            return;
        }

        // 检查链网络是否支持
        if (!chainMapping[currentChain]) {
            showErrorModal('不支持的链网络', `当前链网络 "${currentChain}" 暂不支持标注查询。\n\n支持的链网络：\n• Solana (sol)\n• Ethereum (eth)\n• Base (base)\n• BSC (bsc)`);
            return;
        }

        // 如果已有标注数据（无论是拦截的还是API获取的），直接显示
        if (tagData.length > 0) {
            showTagsModal();
            return;
        }

        // 调试信息：显示当前状态
        console.log('[按钮点击] 当前数据状态检查:');
        console.log('  hasInterceptedTags:', hasInterceptedTags);
        console.log('  tagData.length:', tagData.length);
        console.log('  topHolders.length:', topHolders.length);
        console.log('  window._pendingTagData:', !!window._pendingTagData);

        // 如果已拦截到标注数据但还没处理完成，提示用户稍等
        if (hasInterceptedTags && tagData.length === 0) {
            showErrorModal('数据处理中', '已检测到标注数据，正在处理中，请稍候...');
            return;
        }

        // 开始通过API获取标注数据
        isFetchingTags = true;
        button.className = 'memeradar-btn fetching';
        button.textContent = '获取中...';

        try {
            console.log(`[API获取] 开始通过API获取${topHolders.length}个地址的标注信息`);
            await fetchWalletTags();

            button.className = 'memeradar-btn ready';
            button.textContent = '查看标注';

            console.log('[API获取] ✅标注数据获取完成');
            showTagsModal();

        } catch (error) {
            console.error('[API获取] ❌获取标注数据失败:', error);
            showErrorModal('获取失败', `标注数据获取失败：${error.message}\n\n请检查网络连接或稍后重试。`);

            button.className = 'memeradar-btn';
            button.textContent = '获取前排标注';
        } finally {
            isFetchingTags = false;
        }
    }

    /**
     * 获取钱包标注数据
     */
    async function fetchWalletTags() {
        const chainName = chainMapping[currentChain];
        const requestData = {
            walletAddresses: topHolders,
            chain: chainName
        };

        console.log(`[API请求] 发送标注查询请求，链网络: ${chainName}, 地址数量: ${topHolders.length}`);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://plugin.chaininsight.vip/api/v0/util/query/wallet_tags_v2',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(requestData),
                timeout: 30000,
                onload: function(response) {
                    console.log(`[API响应] 状态码: ${response.status}`);

                    if (response.status !== 200) {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('[API响应] 响应数据:', data);

                        if (data.code !== 0) {
                            reject(new Error(data.msg || `API错误码: ${data.code}`));
                            return;
                        }

                        processTagData(data.data);
                        resolve();

                    } catch (error) {
                        console.error('[API响应] JSON解析失败:', error);
                        reject(new Error('响应数据解析失败'));
                    }
                },
                onerror: function(error) {
                    console.error('[API请求] 网络请求失败:', error);
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    console.warn('[API请求] 请求超时');
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    /**
     * 处理标注数据
     */
    function processTagData(responseData) {
        console.log('[数据处理] 开始处理标注数据');

        if (!responseData || !responseData.walletTags) {
            console.warn('[数据处理] 响应数据格式异常');
            tagData = [];
            return;
        }

        // 创建地址到标注的映射
        const tagMap = {};
        responseData.walletTags.forEach(wallet => {
            tagMap[wallet.address] = {
                count: wallet.count || 0,
                tags: wallet.tags ? wallet.tags.map(tag => tag.tagName) : [],
                expertTags: wallet.expertTags ? wallet.expertTags.map(tag => tag.tagName) : []
            };
        });

        // 为所有地址创建完整的标注数据
        tagData = topHolders.map(address => {
            const walletTags = tagMap[address] || { count: 0, tags: [], expertTags: [] };
            return {
                address: address,
                tagCount: walletTags.count,
                tags: walletTags.tags,
                expertTags: walletTags.expertTags
            };
        });

        // 按标注数量降序排序
        tagData.sort((a, b) => b.tagCount - a.tagCount);

        console.log(`[数据处理] ✅处理完成，共${tagData.length}个地址，有标注的地址：${tagData.filter(w => w.tagCount > 0).length}个`);
    }

    /**
     * 更新按钮状态
     */
    function updateButtonState() {
        const button = document.getElementById('memeradar-btn');
        if (!button) return;

        if (!isDataReady) {
            button.disabled = true;
            button.textContent = '等待数据...';
            button.className = 'memeradar-btn';
        } else if (hasInterceptedTags && tagData.length > 0) {
            // 已拦截到标注数据，可直接查看
            button.disabled = false;
            button.textContent = '查看标注';
            button.className = 'memeradar-btn ready';
        } else if (tagData.length > 0) {
            // 已获取标注数据，可查看
            button.disabled = false;
            button.textContent = '查看标注';
            button.className = 'memeradar-btn ready';
        } else {
            // 需要获取标注数据
            button.disabled = false;
            button.textContent = '获取前排标注';
            button.className = 'memeradar-btn';
        }
    }

    /**
     * 显示错误弹窗
     */
    function showErrorModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'memeradar-modal';
        modal.innerHTML = `
            <div class="memeradar-modal-content" style="max-width: 500px;">
                <div class="memeradar-modal-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <h3 class="memeradar-modal-title">${title}</h3>
                    <button class="memeradar-modal-close">&times;</button>
                </div>
                <div class="memeradar-modal-body">
                    <div style="color: #e2e8f0; line-height: 1.6; white-space: pre-line;">${message}</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        modal.querySelector('.memeradar-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * 分批渲染錢包列表（大數據量優化）
     */
    function renderWalletsBatched(walletsList, walletsWithTags) {
        const BATCH_SIZE = 50;
        let currentIndex = 0;
        
        // 創建錢包行的函數（分批渲染用）
        function createWalletRowBatch(wallet) {
            return createWalletRow(wallet);
        }
        
        // 分批渲染函數
        function renderBatch() {
            const fragment = document.createDocumentFragment();
            const endIndex = Math.min(currentIndex + BATCH_SIZE, walletsWithTags.length);
            
            for (let i = currentIndex; i < endIndex; i++) {
                const walletRow = createWalletRowBatch(walletsWithTags[i]);
                fragment.appendChild(walletRow);
            }
            
            walletsList.appendChild(fragment);
            currentIndex = endIndex;
            
            // 如果還有未渲染的項目，繼續下一批
            if (currentIndex < walletsWithTags.length) {
                // 使用 requestAnimationFrame 確保不阻塞主線程
                requestAnimationFrame(renderBatch);
            } else {
                console.log('[性能優化] 分批渲染完成');
                // 渲染完成後添加事件委託
                setupWalletListEvents(walletsList);
            }
        }
        
        // 開始渲染
        renderBatch();
    }
    
    /**
     * 創建錢包表格行
     */
    function createWalletRow(wallet) {
        const resultItem = document.createElement('div');
        resultItem.className = 'memeradar-result-item';
        
        // 錢包信息容器
        const walletInfo = document.createElement('div');
        walletInfo.className = 'memeradar-wallet-info';
        
        // 錢包地址
        const walletAddress = document.createElement('div');
        walletAddress.className = 'memeradar-wallet-address';
        walletAddress.title = '點擊複製地址';
        walletAddress.textContent = wallet.address;
        walletAddress.dataset.address = wallet.address;
        
        // 標籤容器
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'memeradar-tags';
        
        // 添加專業玩家標籤
        if (wallet.expertTags && wallet.expertTags.length > 0) {
            wallet.expertTags.forEach(tag => {
                const expertTag = document.createElement('span');
                expertTag.className = 'memeradar-expert-tag';
                expertTag.textContent = tag;
                tagsContainer.appendChild(expertTag);
            });
        }
        
        // 添加普通標籤
        wallet.tags.forEach(tag => {
            const regularTag = document.createElement('span');
            regularTag.className = 'memeradar-tag';
            regularTag.textContent = tag;
            tagsContainer.appendChild(regularTag);
        });
        
        // 标注數量
        const tagCount = document.createElement('div');
        tagCount.className = 'memeradar-tag-count';
        tagCount.textContent = wallet.tagCount;
        
        // 組裝
        walletInfo.appendChild(walletAddress);
        walletInfo.appendChild(tagsContainer);
        resultItem.appendChild(walletInfo);
        resultItem.appendChild(tagCount);
        
        return resultItem;
    }

    /**
     * 設置錢包列表事件委託
     */
    function setupWalletListEvents(walletsList) {
        walletsList.addEventListener('click', (e) => {
            const addressElement = e.target.closest('.memeradar-wallet-address');
            if (addressElement) {
                const address = addressElement.dataset.address;
                navigator.clipboard.writeText(address).then(() => {
                    const originalColor = addressElement.style.color;
                    const originalBg = addressElement.style.background;
                    
                    addressElement.style.color = '#10b981';
                    addressElement.style.background = 'rgba(16, 185, 129, 0.1)';
                    
                    setTimeout(() => {
                        addressElement.style.color = originalColor;
                        addressElement.style.background = originalBg;
                    }, 1000);
                }).catch(err => {
                    console.warn('[複製失敗]', err);
                });
            }
        });
    }

    /**
     * 显示标注数据弹窗
     */
    function showTagsModal() {
        console.log('[界面显示] 显示标注数据弹窗');

        // 只显示有标注的钱包（包括有专业玩家标注的）
        const walletsWithTags = tagData.filter(w => w.tagCount > 0 || (w.expertTags && w.expertTags.length > 0));
        const hasTagsCount = walletsWithTags.length;
        const totalTags = walletsWithTags.reduce((sum, w) => sum + w.tagCount, 0);
        const expertTaggedAddressCount = walletsWithTags.filter(w => w.expertTags && w.expertTags.length > 0).length;

        const modal = document.createElement('div');
        modal.className = 'memeradar-modal';
        modal.innerHTML = `
            <div class="memeradar-modal-content">
                <div class="memeradar-modal-header">
                    <h3 class="memeradar-modal-title">前排标注信息<span class="memeradar-modal-subtitle"> - ${currentCA.slice(0, 8)}...${currentCA.slice(-6)}</span></h3>
                    <div class="memeradar-header-actions">
                        <button class="memeradar-export-btn" id="export-excel-btn">📊 導出Excel</button>
                        <button class="memeradar-modal-close">×</button>
                    </div>
                </div>
                <div class="memeradar-analysis-summary">
                    <div class="memeradar-summary-stats">
                        <div class="memeradar-stat-item">
                            <div class="memeradar-stat-label">总地址數:</div>
                            <div class="memeradar-stat-value">${tagData.length}</div>
                        </div>
                        <div class="memeradar-stat-item">
                            <div class="memeradar-stat-label">有标注地址:</div>
                            <div class="memeradar-stat-value">${hasTagsCount}</div>
                        </div>
                        <div class="memeradar-stat-item">
                            <div class="memeradar-stat-label">总标注數:</div>
                            <div class="memeradar-stat-value">${totalTags}</div>
                        </div>
                        <div class="memeradar-stat-item">
                            <div class="memeradar-stat-label">专业玩家标注地址數:</div>
                            <div class="memeradar-stat-value">${expertTaggedAddressCount}</div>
                        </div>
                    </div>
                </div>
                ${walletsWithTags.length === 0 ?
                    '<div class="memeradar-loading">📝 暂无标注数据</div>' :
                    '<div id="wallets-list"></div>'
                }
            </div>
        `;

        document.body.appendChild(modal);

        // 填充钱包列表 - 只显示有标注的钱包（卡片版本）
        if (walletsWithTags.length === 0) {
            return; // 無數據時直接返回
        }
        
        const walletsList = modal.querySelector('#wallets-list');
        
        // 大數據量時使用分批渲染，提升性能
        const BATCH_SIZE = 100;
        const shouldUseBatchRendering = walletsWithTags.length > BATCH_SIZE;
        
        if (shouldUseBatchRendering) {
            console.log(`[性能優化] 檢測到${walletsWithTags.length}個錢包項目，啟用分批渲染`);
            renderWalletsBatched(walletsList, walletsWithTags);
            return;
        }
        
        // 使用DocumentFragment批量操作，避免多次DOM重排
        const fragment = document.createDocumentFragment();
        
        // 批量创建所有钱包行
        const walletRows = walletsWithTags.map(wallet => {
            return createWalletRow(wallet);
        });
        
        // 批量添加到fragment
        walletRows.forEach(row => fragment.appendChild(row));
        
        // 一次性添加到DOM
        walletsList.appendChild(fragment);
        
        // 設置事件委託
        setupWalletListEvents(walletsList);

        // 绑定导出Excel按钮事件
        const exportBtn = modal.querySelector('#export-excel-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToExcel);
        }

        // 绑定关闭事件
        const closeModal = () => {
            if (modal && modal.parentNode) {
                document.body.removeChild(modal);
            }
        };

        // 關閉按鈕事件
        const closeBtn = modal.querySelector('.memeradar-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });
        }

        // 背景點擊關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC 鍵關閉
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * 导出数据到Excel
     */
    function exportToExcel() {
        try {
            console.log('[Excel导出] 开始导出标注数据');

            // 只导出有标注的地址（包括专业玩家标注）
            const walletsWithTags = tagData.filter(wallet => wallet.tagCount > 0 || (wallet.expertTags && wallet.expertTags.length > 0));
            console.log(`[Excel导出] 过滤后数据：总地址${tagData.length}个，有标注${walletsWithTags.length}个`);

            if (walletsWithTags.length === 0) {
                alert('没有找到有标注的地址，无法导出Excel文件');
                return;
            }

            // 准备Excel数据 - 只包含有标注的地址
            const excelData = walletsWithTags.map((wallet, index) => ({
                '排名': index + 1,
                '钱包地址': wallet.address,
                '标注数量': wallet.tagCount,
                '标签列表': wallet.tags.join(', '),
                '专业玩家打标': (wallet.expertTags && wallet.expertTags.length > 0) ? wallet.expertTags.join('，') : ''
            }));

            // 创建工作簿
            const wb = XLSX.utils.book_new();

            // 创建标注数据工作表
            const ws = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, "标注数据");

            // 生成文件名
            const now = new Date();
            const timeStr = now.toISOString().slice(0, 19).replace(/[:\-T]/g, '');
            const caShort = currentCA.slice(0, 8) + '...' + currentCA.slice(-6);
            const fileName = `${timeStr}-前排标注-${caShort}.xlsx`;

            // 下载文件
            XLSX.writeFile(wb, fileName);

            console.log(`[Excel导出] ✅Excel文件导出成功: ${fileName}，包含${walletsWithTags.length}个有标注地址`);

            // 显示成功提示
            const exportBtn = document.getElementById('export-excel-btn');
            if (exportBtn) {
                const originalText = exportBtn.innerHTML;
                exportBtn.innerHTML = '✅ 导出成功';
                exportBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                setTimeout(() => {
                    exportBtn.innerHTML = originalText;
                    exportBtn.style.background = '';
                }, 2000);
            }

        } catch (error) {
            console.error('[Excel导出] ❌导出失败:', error);
            alert('Excel导出失败: ' + error.message);
        }
    }

    // 页面切换监听 - 精确检测CA地址变化
    let lastUrl = location.href;
    let lastCA = '';

    function checkCAChange() {
        const url = location.href;

        // 提取当前URL中的CA地址 - 支持多链
        let urlCA = '';
        const caMatch = url.match(/\/(sol|eth|bsc|base|tron)\/([A-Za-z0-9]{32,})/);
        if (caMatch) {
            urlCA = caMatch[2]; // CA地址
            // 也可以获取链网络: caMatch[1]
        }

        // 检查CA是否变化
        if (lastCA && lastCA !== urlCA && urlCA) {
            console.log(`[页面切换] 🔄检测到CA地址变化: ${lastCA} → ${urlCA}`);
            console.log(`[页面切换] 完整URL变化: ${lastUrl} → ${url}`);
            resetAllData();
            updateButtonState();
            lastCA = urlCA;
            lastUrl = url;
            return true;
        } else if (urlCA && !lastCA) {
            // 首次进入代币页面
            console.log(`[页面切换] 🎯首次进入代币页面: ${urlCA}`);
            lastCA = urlCA;
            lastUrl = url;
            return false;
        } else if (!urlCA && lastCA) {
            // 离开代币页面
            console.log(`[页面切换] 🚪离开代币页面: ${lastCA}`);
            resetAllData();
            updateButtonState();
            lastCA = '';
            lastUrl = url;
            return true;
        } else if (url !== lastUrl) {
            // URL变化但CA未变化（如参数变化）
            console.log(`[页面切换] 📝URL变化但CA未变（${urlCA || '无CA'}）: ${url}`);
            lastUrl = url;
            return false;
        }

        return false;
    }

    // 监听页面变化
    new MutationObserver(() => {
        checkCAChange();
    }).observe(document, { subtree: true, childList: true });

    // 监听浏览器前进后退
    window.addEventListener('popstate', () => {
        setTimeout(checkCAChange, 100); // 延迟检查，确保URL已更新
    });

    // 初始化检查
    checkCAChange();

    console.log(`
🏷️ MemeRadar前排标注查询工具 v2.3 已启动
📋 v2.3优化更新:
   • 📈 Excel导出优化 - 只导出有标注的地址，精简数据
   • 🎯 智能数据过滤 - 避免导出无价值的空标注数据
   • ⚠️ 异常处理增强 - 无标注数据时给出友好提示

📋 v2.2重大优化:
   • 🎯 智能单次拦截 - token_holders成功后不再重复拦截
   • 🔄 精确CA切换检测 - 支持多链地址变化监听
   • 🚪 智能页面状态管理 - 进入/离开代币页面自动处理
   • 📊 减少不必要拦截 - 大幅提升性能和稳定性
   • 🛡️ 防重复请求机制 - 避免资源浪费

📋 核心功能:
   • 🎯 智能拦截token_holders和wallet_tags_v2 API
   • 🌐 支持多链网络 (SOL/ETH/BSC/BASE/TRON)
   • 🏷️ 获取前100持仓者标注信息
   • 📊 优雅的数据展示界面 (只显示有标注地址)
   • 📈 精简的Excel数据导出功能 (仅含有标注地址)
   • 🔄 精确的CA切换检测和状态重置

🔍 监听状态: 已启用
📍 当前页面: ${window.location.href}
    `);

})();