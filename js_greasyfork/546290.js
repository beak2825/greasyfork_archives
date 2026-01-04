// ==UserScript==
// @name         GMGN追踪者统计分析
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  监听gmgn.ai的持仓者API，提供追踪者数据分析和可视化
// @author       Assistant
// @match        https://gmgn.ai/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546290/GMGN%E8%BF%BD%E8%B8%AA%E8%80%85%E7%BB%9F%E8%AE%A1%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/546290/GMGN%E8%BF%BD%E8%B8%AA%E8%80%85%E7%BB%9F%E8%AE%A1%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局数据存储
    let followerData = null;
    let currentToken = null;
    let currentUrl = window.location.href;

    // 工具函数：格式化数字为K/M/B单位
    function formatNumber(num) {
        if (num === 0) return '$0';
        const absNum = Math.abs(num);
        const sign = num < 0 ? '-' : '';

        if (absNum >= 1e9) {
            return sign + '$' + (absNum / 1e9).toFixed(1) + 'B';
        } else if (absNum >= 1e6) {
            return sign + '$' + (absNum / 1e6).toFixed(1) + 'M';
        } else if (absNum >= 1e3) {
            return sign + '$' + (absNum / 1e3).toFixed(1) + 'K';
        }
        return sign + '$' + absNum.toFixed(2);
    }

    // 工具函数：格式化百分比
    function formatPercentage(num) {
        return (num * 100).toFixed(3) + '%';
    }

    // 数据管理器
    class FollowerDataManager {
        constructor() {
            this.data = null;
            this.stats = null;
        }

        setData(data) {
            this.data = data;
            this.calculateStats();
            this.updateButtonState();
        }

        calculateStats() {
            if (!this.data || !this.data.list) {
                this.stats = null;
                return;
            }

            const holders = this.data.list;
            this.stats = {
                totalAddresses: holders.length, // 所有持有过的地址数
                totalHolders: holders.filter(h => h.amount_percentage >= 0.00001).length, // 0.001%以上认为未清仓
                profitableHolders: holders.filter(h => h.profit > 0).length,
                lossHolders: holders.filter(h => h.profit < 0).length,
                totalHoldingPercentage: holders.reduce((sum, h) => sum + h.amount_percentage, 0),
                // 所有追踪者数据（包括已清仓的）
                chartData: holders
                    .sort((a, b) => b.amount_percentage - a.amount_percentage)
                    .map(h => ({
                        address: h.address,
                        percentage: h.amount_percentage,
                        profit: h.profit,
                        profitRate: (h.profit_change || 0) * 100,
                        netflow: h.netflow_usd,
                        sellAmount: h.sell_amount_cur || 0,
                        balance: h.balance,
                        walletTag: h.wallet_tag_v2 || '',
                        hasHolding: h.amount_percentage >= 0.00001,
                        avgCost: h.avg_cost || 0,
                        avgSold: h.avg_sold || 0
                    })),
                // 只有持仓的地址用于饼图
                pieChartData: holders
                    .filter(h => h.amount_percentage >= 0.00001)
                    .sort((a, b) => b.amount_percentage - a.amount_percentage)
                    .map(h => ({
                        address: h.address,
                        percentage: h.amount_percentage,
                        profit: h.profit,
                        profitRate: (h.profit_change || 0) * 100,
                        netflow: h.netflow_usd,
                        sellAmount: h.sell_amount_cur || 0,
                        balance: h.balance,
                        walletTag: h.wallet_tag_v2 || '',
                        avgCost: h.avg_cost || 0,
                        avgSold: h.avg_sold || 0
                    }))
            };
        }

        clearData() {
            this.data = null;
            this.stats = null;
            this.updateButtonState();
        }

        updateButtonState() {
            const button = document.querySelector('#follower-stats-button');
            if (button) {
                if (this.stats && this.stats.totalHolders > 0) {
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                    button.title = `点击查看 ${this.stats.totalHolders} 个追踪者数据分析`;
                } else {
                    button.style.opacity = '0.5';
                    button.style.pointerEvents = 'none';
                    button.title = '暂无追踪者数据';
                }
            }
        }

        getStats() {
            return this.stats;
        }
    }

    const dataManager = new FollowerDataManager();

    // API拦截器
    function setupAPIInterception() {
        // 拦截fetch请求
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            const url = args[0];

            if (typeof url === 'string' && url.includes('/vas/api/v1/token_holders/') && url.includes('following=true')) {
                try {
                    const clone = response.clone();
                    const data = await clone.json();
                    if (data.code === 0 && data.data && data.data.list) {
                        dataManager.setData(data.data);
                        // 提取代币地址
                        const tokenMatch = url.match(/token_holders\/sol\/([^?]+)/);
                        if (tokenMatch) {
                            currentToken = tokenMatch[1];
                        }
                    }
                } catch (e) {
                    console.log('解析追踪者数据失败:', e);
                }
            }

            return response;
        };

        // 拦截XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            if (this._url && this._url.includes('/vas/api/v1/token_holders/') && this._url.includes('following=true')) {
                const originalOnReadyStateChange = this.onreadystatechange;
                this.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data.code === 0 && data.data && data.data.list) {
                                dataManager.setData(data.data);
                                const tokenMatch = this._url.match(/token_holders\/sol\/([^?]+)/);
                                if (tokenMatch) {
                                    currentToken = tokenMatch[1];
                                }
                            }
                        } catch (e) {
                            console.log('解析追踪者数据失败:', e);
                        }
                    }
                    if (originalOnReadyStateChange) {
                        return originalOnReadyStateChange.apply(this, arguments);
                    }
                };
            }
            return originalSend.apply(this, args);
        };
    }

    // 创建按钮
    function createFollowerStatsButton() {
        const button = document.createElement('div');
        button.id = 'follower-stats-button';
        button.className = 'h-[28px] flex items-center text-[12px] font-medium cursor-pointer bg-btn-secondary p-6px rounded-6px gap-2px text-text-200 hover:text-text-100';
        button.style.opacity = '0.5';
        button.style.pointerEvents = 'none';
        button.title = '暂无追踪者数据';

        button.innerHTML = `
            <svg width="12px" height="12px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M8 2C4.691 2 2 4.691 2 8s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10.5c-2.481 0-4.5-2.019-4.5-4.5S5.519 3.5 8 3.5 12.5 5.519 12.5 8 10.481 12.5 8 12.5z"/>
                <path d="M8 5.5c-1.381 0-2.5 1.119-2.5 2.5S6.619 10.5 8 10.5 10.5 9.381 10.5 8 9.381 5.5 8 5.5zm0 3.5c-0.551 0-1-0.449-1-1s0.449-1 1-1 1 0.449 1 1-0.449 1-1 1z"/>
            </svg>
            追踪者分析
        `;

        button.addEventListener('click', () => {
            const stats = dataManager.getStats();
            if (stats && stats.totalHolders > 0) {
                showStatsModal(stats);
            }
        });

        return button;
    }

    // 甜甜圈图组件
    function createPieChart(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const size = 280;
        const center = size / 2;
        const outerRadius = size * 0.4;
        const innerRadius = size * 0.25; // 内圆半径，创建空心效果

        // 计算总和用于百分比计算
        const total = data.reduce((sum, item) => sum + item.percentage, 0);

        let currentAngle = -90; // 从顶部开始
        const segments = [];

        // 只显示前10个最大的持仓者，其他合并为"其他"
        const displayData = data.slice(0, 10);
        const otherData = data.slice(10);

        if (otherData.length > 0) {
            const otherSum = otherData.reduce((sum, item) => sum + item.percentage, 0);
            displayData.push({
                address: 'Others',
                percentage: otherSum,
                profit: otherData.reduce((sum, item) => sum + item.profit, 0),
                profitRate: 0,
                netflow: otherData.reduce((sum, item) => sum + item.netflow, 0),
                sellAmount: otherData.reduce((sum, item) => sum + item.sellAmount, 0),
                isOther: true
            });
        }

        // 生成颜色
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
            '#c7ecee'
        ];

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.style.cursor = 'pointer';

        displayData.forEach((item, index) => {
            const percentage = item.percentage / total;
            const angle = percentage * 360;

            if (angle < 0.1) return; // 跳过太小的片段

            const startAngle = currentAngle * Math.PI / 180;
            const endAngle = (currentAngle + angle) * Math.PI / 180;

            // 外圆弧点
            const outerX1 = center + outerRadius * Math.cos(startAngle);
            const outerY1 = center + outerRadius * Math.sin(startAngle);
            const outerX2 = center + outerRadius * Math.cos(endAngle);
            const outerY2 = center + outerRadius * Math.sin(endAngle);

            // 内圆弧点
            const innerX1 = center + innerRadius * Math.cos(startAngle);
            const innerY1 = center + innerRadius * Math.sin(startAngle);
            const innerX2 = center + innerRadius * Math.cos(endAngle);
            const innerY2 = center + innerRadius * Math.sin(endAngle);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // 创建甜甜圈形状的路径
            const pathData = [
                `M ${outerX1} ${outerY1}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}`,
                `L ${innerX2} ${innerY2}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
                'Z'
            ].join(' ');

            path.setAttribute('d', pathData);
            path.setAttribute('fill', colors[index % colors.length]);
            path.setAttribute('stroke', '#1a1a1a');
            path.setAttribute('stroke-width', '2');
            path.style.transition = 'all 0.3s ease';
            path.style.transformOrigin = `${center}px ${center}px`;

            // 添加悬停效果
            path.addEventListener('mouseenter', (e) => {
                path.style.transform = 'scale(1.05)';
                path.style.filter = 'brightness(1.1)';
                showTooltip(e, item);
            });

            path.addEventListener('mouseleave', () => {
                path.style.transform = 'scale(1)';
                path.style.filter = 'brightness(1)';
                hideTooltip();
            });

            path.addEventListener('mousemove', (e) => {
                updateTooltipPosition(e);
            });

            svg.appendChild(path);
            currentAngle += angle;
        });

        // 中心文字
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', center);
        centerText.setAttribute('y', center - 8);
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('dominant-baseline', 'middle');
        centerText.setAttribute('fill', '#fff');
        centerText.setAttribute('font-size', '14');
        centerText.setAttribute('font-weight', 'bold');
        centerText.textContent = '总持仓占比';

        const centerValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerValue.setAttribute('x', center);
        centerValue.setAttribute('y', center + 12);
        centerValue.setAttribute('text-anchor', 'middle');
        centerValue.setAttribute('dominant-baseline', 'middle');
        centerValue.setAttribute('fill', '#4ecdc4');
        centerValue.setAttribute('font-size', '16');
        centerValue.setAttribute('font-weight', 'bold');
        centerValue.textContent = formatPercentage(total);

        svg.appendChild(centerText);
        svg.appendChild(centerValue);

        container.innerHTML = '';
        container.appendChild(svg);
    }

    // 工具提示
    let tooltip = null;

    function showTooltip(event, data) {
        hideTooltip();

        tooltip = document.createElement('div');
        tooltip.className = 'follower-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                ${data.isOther ? '其他持仓者' : `${data.address.substring(0, 8)}...`}
                ${data.walletTag ? `<span class="wallet-tag">${data.walletTag}</span>` : ''}
            </div>
            <div class="tooltip-row">
                <span>持仓占比:</span>
                <span class="tooltip-value">${formatPercentage(data.percentage)}</span>
            </div>
            <div class="tooltip-row">
                <span>总利润:</span>
                <span class="tooltip-value ${data.profit >= 0 ? 'profit-positive' : 'profit-negative'}">${formatNumber(data.profit)}</span>
            </div>
            <div class="tooltip-row">
                <span>利润率:</span>
                <span class="tooltip-value ${data.profitRate >= 0 ? 'profit-positive' : 'profit-negative'}">${data.profitRate.toFixed(2)}%</span>
            </div>
            <div class="tooltip-row">
                <span>净流入:</span>
                <span class="tooltip-value">${formatNumber(data.netflow)}</span>
            </div>
            <div class="tooltip-row">
                <span>总卖出:</span>
                <span class="tooltip-value">${formatNumber(data.sellAmount)}</span>
            </div>
        `;

        document.body.appendChild(tooltip);
        updateTooltipPosition(event);
    }

    function updateTooltipPosition(event) {
        if (!tooltip) return;

        const rect = tooltip.getBoundingClientRect();
        let x = event.clientX + 10;
        let y = event.clientY + 10;

        // 确保工具提示不会超出视口
        if (x + rect.width > window.innerWidth) {
            x = event.clientX - rect.width - 10;
        }
        if (y + rect.height > window.innerHeight) {
            y = event.clientY - rect.height - 10;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    // 复制地址功能
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('地址已复制到剪贴板');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('地址已复制到剪贴板');
        } catch (err) {
            showNotification('复制失败，请手动复制');
        }
        document.body.removeChild(textArea);
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'follower-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // 创建用户列表项
    function createUserListItem(user, index) {
        const profitClass = user.profit >= 0 ? 'profit-positive' : 'profit-negative';
        const itemClass = user.hasHolding ? '' : ' no-holding';
        return `
            <div class="user-list-item${itemClass}" data-index="${index}">
                <div class="address-column">
                    <div class="address-display" onclick="copyAddressWithAnimation(this, '${user.address}')" title="点击复制地址: ${user.address}">
                        ${user.address.substring(0, 6)}...${user.address.substring(user.address.length - 4)}
                    </div>
                </div>
                <div class="price-column">
                    <div class="price-buy" title="平均买价">${user.avgCost && user.avgCost > 0 ? '$' + user.avgCost.toFixed(6) : '-'}</div>
                    <div class="price-sell" title="平均卖价">${user.avgSold && user.avgSold > 0 ? '$' + user.avgSold.toFixed(6) : '-'}</div>
                </div>
                <div class="profit-column">
                    <div class="profit-amount ${profitClass}">${formatNumber(user.profit)}</div>
                    <div class="profit-rate ${profitClass}">${user.profitRate.toFixed(2)}%</div>
                </div>
                <div class="challenge-column">
                    <button class="challenge-btn" onclick="window.open('https://gmgn.ai/sol/address/${user.address}', '_blank')" title="跳转到该用户">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                            <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    // 模态框
    function showStatsModal(stats) {
        // 创建用户列表HTML
        const userListHTML = stats.chartData.map((user, index) => createUserListItem(user, index)).join('');

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'follower-modal-overlay';
        modal.innerHTML = `
            <div class="follower-modal">
                <div class="modal-header">
                    <h2>追踪者数据分析</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="stats-summary">
                        <div class="stat-item">
                            <div class="stat-value">${stats.totalAddresses}</div>
                            <div class="stat-label">总地址数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.totalHolders}</div>
                            <div class="stat-label">未清仓地址</div>
                        </div>
                        <div class="stat-item profit">
                            <div class="stat-value">${stats.profitableHolders}</div>
                            <div class="stat-label">盈利地址</div>
                        </div>
                        <div class="stat-item loss">
                            <div class="stat-value">${stats.lossHolders}</div>
                            <div class="stat-label">亏损地址</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <div class="chart-title">持仓分布图</div>
                        <div class="chart-content">
                            <div class="user-list-container">
                                <div class="user-list-header">
                                    <div class="header-address">地址</div>
                                    <div class="header-price">平均买价/平均卖价</div>
                                    <div class="header-profit">收益</div>
                                    <div class="header-challenge">跳转</div>
                                </div>
                                <div class="user-list" id="user-list">
                                    ${userListHTML}
                                </div>
                            </div>
                            <div class="chart-right">
                                <div id="pie-chart-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加关闭事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 将复制函数挂载到window上，供内联事件使用
        window.copyToClipboard = copyToClipboard;

        document.body.appendChild(modal);

        // 添加地址点击复制功能
        window.copyAddressWithAnimation = function(element, address) {
            // 复制地址
            copyToClipboard(address);

            // 添加点击动画
            element.classList.add('address-clicked');
            setTimeout(() => {
                element.classList.remove('address-clicked');
            }, 300);
        };

        // 创建饼图（使用有持仓的数据）
        setTimeout(() => {
            if (stats.pieChartData && stats.pieChartData.length > 0) {
                createPieChart(stats.pieChartData, 'pie-chart-container');
            } else {
                console.log('没有有效的饼图数据:', stats);
            }
        }, 100);
    }

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 模态框样式 */
            .follower-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            }

            .follower-modal {
                background: #1a1a1a;
                border-radius: 12px;
                width: 90%;
                max-width: 1000px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideIn 0.3s ease;
                border: 1px solid #333;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #333;
                background: #222;
            }

            .modal-header h2 {
                color: #fff;
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .modal-close {
                background: none;
                border: none;
                color: #999;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.2s ease;
            }

            .modal-close:hover {
                background: #333;
                color: #fff;
            }

            .modal-content {
                padding: 24px;
                overflow-y: auto;
                max-height: calc(90vh - 80px);
            }

            .stats-summary {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-bottom: 32px;
            }

            .stat-item {
                text-align: center;
                padding: 16px;
                background: #2a2a2a;
                border-radius: 8px;
                border: 1px solid #333;
                min-width: 0;
            }

            .stat-item.profit {
                border-color: #4ecdc4;
                background: linear-gradient(135deg, #2a2a2a, #1f3a3a);
            }

            .stat-item.loss {
                border-color: #ff6b6b;
                background: linear-gradient(135deg, #2a2a2a, #3a1f1f);
            }

            .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #fff;
                margin-bottom: 4px;
            }

            .stat-item.profit .stat-value {
                color: #4ecdc4;
            }

            .stat-item.loss .stat-value {
                color: #ff6b6b;
            }

            .stat-label {
                font-size: 12px;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .chart-container {
                text-align: center;
            }

            .chart-title {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 20px;
            }

            .chart-content {
                display: flex;
                gap: 20px;
                align-items: flex-start;
                height: 400px;
            }

            .user-list-container {
                flex: 0 0 50%;
                min-width: 0;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .user-list-header {
                display: grid;
                grid-template-columns: 1fr 100px 90px 50px;
                gap: 6px;
                padding: 8px 12px;
                background: #2a2a2a;
                border-radius: 8px 8px 0 0;
                border: 1px solid #333;
                font-size: 11px;
                font-weight: 600;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                flex-shrink: 0;
            }

            .header-address {
                text-align: left;
            }

            .header-price {
                text-align: center;
            }

            .header-profit {
                text-align: center;
            }

            .header-challenge {
                text-align: center;
            }

            .user-list {
                flex: 1;
                overflow-y: auto;
                border: 1px solid #333;
                border-top: none;
                border-radius: 0 0 8px 8px;
                background: #1e1e1e;
                min-height: 0;
            }

            .user-list::-webkit-scrollbar {
                width: 6px;
            }

            .user-list::-webkit-scrollbar-track {
                background: #2a2a2a;
            }

            .user-list::-webkit-scrollbar-thumb {
                background: #4ecdc4;
                border-radius: 3px;
            }

            .user-list::-webkit-scrollbar-thumb:hover {
                background: #45b7d1;
            }

            .user-list-item {
                display: grid;
                grid-template-columns: 1fr 100px 90px 50px;
                gap: 6px;
                padding: 8px 12px;
                border-bottom: 1px solid #333;
                align-items: center;
                transition: all 0.2s ease;
            }

            .user-list-item.no-holding {
                opacity: 0.4;
                background: #1a1a1a;
            }

            .user-list-item.no-holding:hover {
                opacity: 0.6;
                background: #202020;
            }

            .user-list-item:hover {
                background: #252525;
            }

            .user-list-item:last-child {
                border-bottom: none;
            }

            .challenge-column {
                display: flex;
                justify-content: center;
            }

            .challenge-btn {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 4px;
                background: linear-gradient(135deg, #4ecdc4, #45b7d1);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                box-shadow: 0 1px 4px rgba(76, 205, 196, 0.3);
            }

            .challenge-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(76, 205, 196, 0.4);
            }

            .challenge-btn:active {
                transform: translateY(0);
            }

            .price-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }

            .price-buy {
                font-size: 10px;
                color: #4ecdc4;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            }

            .price-sell {
                font-size: 10px;
                color: #ff9f43;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            }

            .user-list-item.no-holding .price-buy,
            .user-list-item.no-holding .price-sell {
                opacity: 0.6;
            }

            .profit-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }

            .profit-amount {
                font-size: 14px;
                font-weight: 600;
            }

            .profit-rate {
                font-size: 12px;
                opacity: 0.8;
            }

            .address-column {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }

            .address-display {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 11px;
                color: #fff;
                background: #333;
                padding: 6px 10px;
                border-radius: 4px;
                border: 1px solid #444;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
            }

            .address-display:hover {
                background: #4ecdc4;
                color: #000;
                transform: translateY(-1px);
            }

            .address-display.address-clicked {
                animation: addressClickAnimation 0.3s ease;
            }

            @keyframes addressClickAnimation {
                0% {
                    transform: scale(1);
                    background: #4ecdc4;
                }
                50% {
                    transform: scale(1.1);
                    background: #45b7d1;
                }
                100% {
                    transform: scale(1);
                    background: #4ecdc4;
                }
            }

            .chart-right {
                flex: 0 0 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            }

            #pie-chart-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }

            /* 通知样式 */
            .follower-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4ecdc4;
                color: #000;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(76, 205, 196, 0.3);
                z-index: 10002;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }

            .follower-notification.show {
                opacity: 1;
                transform: translateX(0);
            }

            /* 工具提示样式 */
            .follower-tooltip {
                position: fixed;
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 12px;
                z-index: 10001;
                max-width: 280px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                pointer-events: none;
                animation: tooltipIn 0.2s ease;
            }

            .tooltip-header {
                color: #fff;
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .wallet-tag {
                background: #4ecdc4;
                color: #000;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }

            .tooltip-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
                font-size: 12px;
            }

            .tooltip-row span:first-child {
                color: #999;
            }

            .tooltip-value {
                color: #fff;
                font-weight: 500;
            }

            .profit-positive {
                color: #4ecdc4 !important;
            }

            .profit-negative {
                color: #ff6b6b !important;
            }

            /* 动画 */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes tooltipIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .follower-modal {
                    width: 95%;
                    margin: 20px;
                    max-width: none;
                }

                .stats-summary {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .stat-item {
                    min-width: auto;
                    padding: 12px;
                }

                .modal-content {
                    padding: 16px;
                }

                .chart-content {
                    flex-direction: column;
                    gap: 16px;
                    height: auto;
                }

                .chart-right {
                    flex: none;
                }

                .user-list-container {
                    flex: none;
                    height: 250px;
                }

                .user-list-header {
                    grid-template-columns: 1fr 70px 60px 35px;
                    gap: 3px;
                    padding: 6px 8px;
                    font-size: 9px;
                }

                .user-list-item {
                    grid-template-columns: 1fr 70px 60px 35px;
                    gap: 3px;
                    padding: 6px 8px;
                }

                .challenge-btn {
                    width: 24px;
                    height: 24px;
                }

                .address-display {
                    font-size: 9px;
                    padding: 4px 6px;
                }

                .profit-amount {
                    font-size: 12px;
                }

                .profit-rate {
                    font-size: 10px;
                }

                #pie-chart-container svg {
                    width: 250px;
                    height: 250px;
                }

                .follower-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    transform: translateY(-100%);
                }

                .follower-notification.show {
                    transform: translateY(0);
                }
            }

            /* 按钮悬停效果增强 */
            #follower-stats-button {
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            #follower-stats-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(76, 205, 196, 0.2);
            }

            #follower-stats-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.5s ease;
            }

            #follower-stats-button:hover::before {
                left: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    // 监控URL变化
    function monitorUrlChange() {
        const observer = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                dataManager.clearData();
                currentToken = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听popstate事件
        window.addEventListener('popstate', () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                dataManager.clearData();
                currentToken = null;
            }
        });
    }

    // 插入按钮到页面
    function insertButton() {
        const buttonContainer = document.querySelector('.flex.absolute.top-0.right-0.gap-8px.pl-4px');
        if (buttonContainer && !document.querySelector('#follower-stats-button')) {
            const button = createFollowerStatsButton();
            buttonContainer.insertBefore(button, buttonContainer.firstChild);
        }
    }

    // 初始化
    function init() {
        addStyles();
        setupAPIInterception();
        monitorUrlChange();

        // 等待页面加载后插入按钮
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(insertButton, 1000);
            });
        } else {
            setTimeout(insertButton, 1000);
        }

        // 定期检查按钮是否存在，如果不存在则重新插入
        setInterval(() => {
            if (document.querySelector('.flex.absolute.top-0.right-0.gap-8px.pl-4px') &&
                !document.querySelector('#follower-stats-button')) {
                insertButton();
            }
        }, 2000);
    }

    // 启动脚本
    init();

    console.log('GMGN追踪者统计分析脚本已加载');
})();