// ==UserScript==
// @name         GMGN交易者数据导出
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  监听GMGN.ai交易者数据并提供Excel导出功能
// @author       You
// @match        https://gmgn.ai/sol/token/*
// @match        https://gmgn.ai/eth/token/*
// @match        https://gmgn.ai/bsc/token/*
// @match        https://gmgn.ai/base/token/*
// @match        https://gmgn.ai/arb/token/*
// @match        https://gmgn.ai/op/token/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545292/GMGN%E4%BA%A4%E6%98%93%E8%80%85%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545292/GMGN%E4%BA%A4%E6%98%93%E8%80%85%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tradersData = [];
    let currentCA = '';
    let currentChain = '';

    // 直接在最外层拦截 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            if (isTargetTraderApi(url)) {
                console.log('[GMGN交易者] 拦截请求:', url);
                const originalOnload = xhr.onload;
                xhr.onload = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            if (data.code === 0 && data.data?.list) {
                                processTraderData(data.data.list);
                            }
                        } catch (e) {
                            console.warn('[GMGN交易者] 处理失败:', e);
                        }
                    }
                    originalOnload?.apply(this, arguments);
                };
            }
            return originalOpen.apply(this, arguments);
        };
        return xhr;
    };

    function isTargetTraderApi(url) {
        if (typeof url !== 'string') return false;
        return url.includes('/vas/api/v1/token_traders/');
    }

    // 处理交易者数据的函数
    function processTraderData(newData) {
        const existingAddresses = new Set(tradersData.map(trader => trader.address));

        // 添加新的交易者数据
        newData.forEach(trader => {
            if (trader.address && !existingAddresses.has(trader.address)) {
                tradersData.push(trader);
            } else if (trader.address && existingAddresses.has(trader.address)) {
                // 更新现有交易者数据
                const existingIndex = tradersData.findIndex(t => t.address === trader.address);
                if (existingIndex !== -1) {
                    tradersData[existingIndex] = trader;
                }
            }
        });

        console.log(`GMGN本次获取 ${newData.length} 条数据，总计 ${tradersData.length} 条交易者数据`);
        updateDownloadButton();
    }

    // 从URL中提取CA地址和链网络
    function extractCAFromURL() {
        const url = window.location.pathname;
        const match = url.match(/\/(\w+)\/token\/(?:\w+_)?([A-Za-z0-9]+)$/);
        if (match) {
            const chain = match[1];
            const ca = match[2];
            return { chain, ca };
        }
        return null;
    }

    // 清空数据并更新当前监听目标
    function resetData() {
        tradersData = [];
        const urlInfo = extractCAFromURL();
        if (urlInfo) {
            currentCA = urlInfo.ca;
            currentChain = urlInfo.chain;
            console.log(`开始监听新的CA: ${currentChain}/${currentCA}`);
        }
    }

    // 格式化金额为$xxxK/M/B格式
    function formatCurrency(value) {
        if (!value || value === 0) return '$0';

        const absValue = Math.abs(value);
        let formattedValue;
        let suffix;

        if (absValue >= 1000000000) {
            formattedValue = (value / 1000000000).toFixed(1);
            suffix = 'B';
        } else if (absValue >= 1000000) {
            formattedValue = (value / 1000000).toFixed(1);
            suffix = 'M';
        } else if (absValue >= 1000) {
            formattedValue = (value / 1000).toFixed(1);
            suffix = 'K';
        } else {
            formattedValue = value.toFixed(2);
            suffix = '';
        }

        // 移除不必要的.0
        if (formattedValue.endsWith('.0')) {
            formattedValue = formattedValue.slice(0, -2);
        }

        return `$${formattedValue}${suffix}`;
    }

    // 格式化时间戳
    function formatTimestamp(timestamp) {
        if (!timestamp) return '-';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('zh-CN');
    }

    // 计算持仓时间（小时）
    function calculateHoldingTime(startTime, endTime) {
        if (!startTime || !endTime) return '-';
        const hours = Math.round((endTime - startTime) / 3600);
        return hours > 0 ? `${hours}小时` : '-';
    }

    // 导出Excel数据
    function exportToExcel() {
        if (tradersData.length === 0) {
            alert('没有获取到交易者数据，请切换到【交易者】tab页或重新刷新网页');
            return;
        }

        const headers = ['交易者地址', 'SOL余额', '总买入', '总卖出', '平均买价', '平均卖价', '总利润', '利润率', '持仓时间', '最后活跃'];

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(',') + '\n';

        // 按总利润降序排序
        const sortedTradersData = [...tradersData].sort((a, b) => (b.profit || 0) - (a.profit || 0));

        sortedTradersData.forEach(trader => {
            const row = [
                trader.address || '-',
                (parseFloat(trader.native_balance) / 1000000000).toFixed(2) || '0.00',
                formatCurrency(trader.buy_volume_cur || 0),
                formatCurrency(trader.sell_volume_cur || 0),
                trader.avg_cost?.toFixed(8) || '0',
                trader.avg_sold?.toFixed(8) || '0',
                formatCurrency(trader.profit || 0),
                ((trader.profit_change || 0) * 100).toFixed(2) + '%',
                calculateHoldingTime(trader.start_holding_at, trader.end_holding_at),
                formatTimestamp(trader.last_active_timestamp)
            ];
            csvContent += row.join(',') + '\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `gmgn_traders_${currentChain}_${currentCA}_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`成功导出 ${tradersData.length} 条交易者数据`);
    }

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('div');
        button.className = 'h-[28px] flex items-center text-[12px] font-medium cursor-pointer bg-btn-secondary p-6px rounded-6px gap-2px text-text-200 hover:text-text-100';
        button.id = 'gmgn-export-button';
        button.innerHTML = `
            <svg width="12px" height="12px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M8.35343 15.677L13.881 7.19356C14.098 6.86024 14.01 6.40976 13.684 6.1877C13.5677 6.10833 13.431 6.066 13.2912 6.06606H8.94507V0.725344C8.94507 0.324837 8.62782 0 8.23639 0C7.99931 0 7.77814 0.121166 7.64658 0.322951L2.11903 8.80644C1.902 9.13976 1.99001 9.59 2.31579 9.8123C2.43216 9.89175 2.56893 9.93416 2.70883 9.93417H7.05494V15.2747C7.05494 15.6752 7.37219 16 7.76362 16C8.0007 16 8.2221 15.8788 8.35343 15.677Z"></path>
            </svg>
            导出交易者数据
        `;

        button.addEventListener('click', exportToExcel);
        return button;
    }

    // 更新下载按钮状态
    function updateDownloadButton() {
        const button = document.getElementById('gmgn-export-button');
        if (button) {
            if (tradersData.length > 0) {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
                button.title = `点击导出 ${tradersData.length} 条交易者数据`;
                console.log(`按钮状态已更新，数据量: ${tradersData.length}`);
            } else {
                button.style.opacity = '0.6';
                button.style.pointerEvents = 'none';
                button.title = '没有数据，请切换到交易者tab页';
            }
        } else {
            // 如果按钮还不存在，但有数据了，尝试创建按钮
            if (tradersData.length > 0) {
                console.log('数据已获取但按钮不存在，尝试插入按钮');
                setTimeout(() => {
                    insertDownloadButton();
                }, 500);
            }
        }
    }

    // 插入下载按钮到页面
    function insertDownloadButton() {
        const targetDiv = document.querySelector('.flex.absolute.top-0.right-0.gap-8px.pl-4px');
        const existingButton = document.getElementById('gmgn-export-button');

        if (targetDiv && !existingButton) {
            const downloadButton = createDownloadButton();
            targetDiv.insertBefore(downloadButton, targetDiv.firstChild);
            console.log('下载按钮已插入');
            // 插入后立即更新按钮状态
            updateDownloadButton();
        } else if (!targetDiv) {
            console.log('目标容器不存在，无法插入按钮');
        } else if (existingButton) {
            console.log('按钮已存在，更新状态');
            updateDownloadButton();
        }
    }

    // 监听页面变化
    function observePageChanges() {
        let lastUrl = location.href;
        let lastCA = currentCA;

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            const currentUrl = location.href;
            const urlInfo = extractCAFromURL();
            const newCA = urlInfo ? urlInfo.ca : '';

            // URL变化或CA变化时重置数据
            if (currentUrl !== lastUrl || newCA !== lastCA) {
                lastUrl = currentUrl;
                lastCA = newCA;
                console.log(`页面变化检测 - URL: ${currentUrl}, CA: ${newCA}`);
                console.log('重置交易者数据');
                resetData();

                // 延迟插入按钮，等待页面加载
                setTimeout(() => {
                    insertDownloadButton();
                }, 2000);
            }

            // 检查是否需要重新插入按钮
            if (!document.getElementById('gmgn-export-button')) {
                setTimeout(() => {
                    insertDownloadButton();
                }, 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 同时监听浏览器历史变化（前进/后退按钮）
        window.addEventListener('popstate', function() {
            const urlInfo = extractCAFromURL();
            const newCA = urlInfo ? urlInfo.ca : '';
            if (newCA !== currentCA) {
                console.log(`浏览器历史变化 - 新CA: ${newCA}, 旧CA: ${currentCA}`);
                console.log('重置交易者数据');
                resetData();
                setTimeout(() => {
                    insertDownloadButton();
                }, 2000);
            }
        });
    }

    // 初始化函数 - 在document-start阶段执行
    function init() {
        console.log('GMGN交易者数据导出插件已在document-start阶段启动');

        // 立即设置当前页面的CA和链信息
        resetData();

        // 等待DOM完全加载后执行DOM相关操作
        function waitForDOM() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        insertDownloadButton();
                        observePageChanges();
                    }, 2000);
                });
            } else {
                setTimeout(() => {
                    insertDownloadButton();
                    observePageChanges();
                }, 2000);
            }
        }

        // 如果DOM已经存在，立即执行；否则等待
        if (document.documentElement) {
            waitForDOM();
        } else {
            // 极早阶段，连documentElement都不存在，使用更底层的监听
            const observer = new MutationObserver((mutations, obs) => {
                if (document.documentElement) {
                    obs.disconnect();
                    waitForDOM();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }
    }

    // 在document-start阶段立即执行
    init();

})();