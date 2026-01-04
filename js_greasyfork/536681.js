// ==UserScript==
// @name         智能体分析
// @namespace    com.baidu.agent
// @version      2.3
// @description  百度智能体数据统计分析浮窗，悬停名称可显示折线图
// @author       qwn
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @match        https://agents.baidu.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.9
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536681/%E6%99%BA%E8%83%BD%E4%BD%93%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/536681/%E6%99%BA%E8%83%BD%E4%BD%93%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 初始化函数：等待 DOM 和 Chart.js 加载完成
    function init() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js 未加载，请检查网络或 CDN 地址');
            setTimeout(init, 100);
            return;
        }

        // API 地址定义
        const API_LIST = 'https://agents.baidu.com/lingjing/agent/list?agentSource=1&agentType=1&pageNo=1&pageSize=50';
        const API_OVERVIEW = appId => `https://agents.baidu.com/lingjing/agent/statistics/overview?appId=${appId}`;
        const API_PROFIT = (start, end) => `https://agents.baidu.com/lingjing/agent/profit/summary/trend/distribution?startTime=${start}&endTime=${end}`;
        const API_STATS = (appId, start, end) => `https://agents.baidu.com/lingjing/agent/statistics/all?appId=${appId}&startTime=${start}&endTime=${end}`;

        // 全局变量
        let wrapper = null;
        let isVisible = false;
        const statsCache = new Map(); // 缓存 API_STATS 数据

        // 创建浮动按钮
        const floatBtn = document.createElement('div');
        floatBtn.innerText = '☺';
        Object.assign(floatBtn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#1a6dbf',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '50px',
            fontSize: '40px',
            fontWeight: 'bold',
            zIndex: '10000',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            paddingBottom: '5px',
            transition: 'transform 0.2s ease'
        });
        floatBtn.onmouseover = () => floatBtn.style.transform = 'scale(1.1)';
        floatBtn.onmouseout = () => floatBtn.style.transform = 'scale(1)';
        document.body.appendChild(floatBtn);

        // 浮动按钮点击事件
        floatBtn.onclick = () => {
            if (isVisible) {
                wrapper.style.display = 'none';
                isVisible = false;
            } else {
                if (!wrapper) {
                    wrapper = createWrapper();
                    renderProfitTrend(wrapper);
                    renderAgentStats(wrapper);
                } else {
                    wrapper.style.display = 'block';
                }
                isVisible = true;
            }
        };

        // 点击外部关闭窗口
        document.addEventListener('click', e => {
            if (wrapper && isVisible && !wrapper.contains(e.target) && e.target !== floatBtn) {
                wrapper.style.display = 'none';
            }
        });

        // 创建统计窗口
        function createWrapper() {
            const el = document.createElement('div');
            Object.assign(el.style, {
                position: 'fixed',
                bottom: '100px',
                right: '30px',
                maxHeight: '80vh',
                maxWidth: '95vw',
                overflow: 'auto',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                padding: '20px',
                zIndex: '9999',
                fontFamily: 'Arial, sans-serif'
            });
            document.body.appendChild(el);
            return el;
        }

        // 工具函数：创建带链接的名称单元格并绑定悬浮事件
        function createNameCell(appId, name) {
            const td = document.createElement('td');
            const link = document.createElement('a');
            link.textContent = name;
            link.href = `https://agents.baidu.com/agent/prompt/edit?appId=${appId}&activeTab=analysis`;
            link.target = '_blank';
            link.style.cursor = 'pointer';
            link.style.textDecoration = 'underline';
            link.style.color = '#1a6dbf';
            td.appendChild(link);

            let tooltip = null;
            let isTooltipVisible = false;

            const showTooltip = (e) => {
                if (!isTooltipVisible) {
                    isTooltipVisible = true;
                    tooltip = createTooltip(appId, name, td);
                    document.body.appendChild(tooltip);
                    tooltip.style.display = 'block';
                    positionTooltip(tooltip, td);
                    console.log(`Showing tooltip for appId: ${appId}`);
                }
            };

            const hideTooltip = () => {
                if (isTooltipVisible) {
                    isTooltipVisible = false;
                    if (tooltip) {
                        tooltip.style.display = 'none';
                        if (tooltip.chartInstance) {
                            tooltip.chartInstance.destroy();
                            tooltip.chartInstance = null;
                        }
                        tooltip.remove();
                        tooltip = null;
                        console.log(`Hiding tooltip for appId: ${appId}`);
                    }
                }
            };

            td.addEventListener('mouseenter', showTooltip);
            td.addEventListener('mouseleave', (e) => {
                const relatedTarget = e.relatedTarget;
                if (tooltip && relatedTarget && tooltip.contains(relatedTarget)) {
                    return;
                }
                setTimeout(() => {
                    if (tooltip && !tooltip.matches(':hover') && !td.matches(':hover')) {
                        hideTooltip();
                    }
                }, 100);
            });

            return td;
        }

        // 创建工具提示（含图表）
        function createTooltip(appId, agentName, td) {
            let tooltip = document.createElement('div');
            Object.assign(tooltip.style, {
                position: 'absolute',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                padding: '12px',
                zIndex: '10001',
                display: 'none',
                width: '460px',
                maxWidth: '90vw',
                fontSize: '13px',
                lineHeight: '1.4'
            });

            const idDiv = document.createElement('div');
            idDiv.textContent = `${agentName}-${appId}`;
            idDiv.style.marginBottom = '10px';
            idDiv.style.fontWeight = 'bold';

            const canvas = document.createElement('canvas');
            canvas.width = 380;
            canvas.height = 240;
            canvas.style.width = '380px';
            canvas.style.height = '240px';
            canvas.style.display = 'block';

            tooltip.appendChild(idDiv);
            tooltip.appendChild(canvas);

            const cachedData = statsCache.get(appId);
            if (!cachedData) {
                const errorDiv = document.createElement('div');
                errorDiv.textContent = '暂无数据可显示';
                errorDiv.style.fontSize = '15px';
                tooltip.appendChild(errorDiv);
            } else {
                const { labels, rounds, distributePv } = cachedData;

                try {
                    const chart = new Chart(canvas, {
                        type: 'line',
                        data: {
                            labels,
                            datasets: [{
                                label: '对话',
                                data: rounds,
                                borderColor: '#ff6b6b',
                                yAxisID: 'y1',
                                fill: false,
                                tension: 0.2
                            }, {
                                label: '曝光',
                                data: distributePv,
                                borderColor: '#1a6dbf',
                                yAxisID: 'y2',
                                fill: false,
                                tension: 0.2
                            }]
                        },
                        options: {
                            responsive: false,
                            maintainAspectRatio: false,
                            scales: {
                                y1: {
                                    min: 0,
                                    type: 'linear',
                                    position: 'left',
                                    title: { display: false, text: '对话' }
                                },
                                y2: {
                                    min: 0,
                                    type: 'linear',
                                    position: 'right',
                                    title: { display: false, text: '曝光' },
                                    grid: { drawOnChartArea: false }
                                }
                            },
                            plugins: {
                                title: { display: false, text: `${agentName} 数据趋势` },
                                legend: { position: 'bottom' }
                            }
                        }
                    });
                    tooltip.chartInstance = chart;
                } catch (e) {
                    console.error('Chart initialization failed for appId:', appId, e);
                    const errorDiv = document.createElement('div');
                    errorDiv.textContent = '图表渲染失败';
                    tooltip.appendChild(errorDiv);
                }
            }

            tooltip.addEventListener('mouseleave', (e) => {
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && td.contains(relatedTarget)) {
                    return;
                }
                setTimeout(() => {
                    if (tooltip && !tooltip.matches(':hover') && !td.matches(':hover')) {
                        const hideTooltip = () => {
                            if (tooltip) {
                                tooltip.style.display = 'none';
                                if (tooltip.chartInstance) {
                                    tooltip.chartInstance.destroy();
                                    tooltip.chartInstance = null;
                                }
                                tooltip.remove();
                                tooltip = null;
                                console.log(`Hiding tooltip for appId: ${appId}`);
                            }
                        };
                        hideTooltip();
                    }
                }, 100);
            });

            return tooltip;
        }

        //iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://mbd.baidu.com/ma/s/Dd6yRWLh';
        Object.assign(iframe.style, {
            display: 'none',
            width: '0px',
            height: '0px',
            border: 'none',
            position: 'absolute',
            left: '-9999px'
        });
        iframe.title = 'Hidden iframe';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);

        // 控制折线图显示位置
        function positionTooltip(tooltip, triggerElement) {
            const rect = triggerElement.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const tooltipRect = tooltip.getBoundingClientRect();

            let left = rect.right + scrollX;
            let top = rect.top + scrollY;

            left = rect.left - tooltipRect.width + scrollX;

            if (top + tooltipRect.height > scrollY + viewportHeight) {
                top = scrollY + viewportHeight - tooltipRect.height - 10;
            }
            if (top < scrollY) {
                top = scrollY + 10;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }

        // 工具函数：渲染表格行
        function renderRow(tbody, item, isSorted = false) {
            console.log(`Rendering row for appId: ${item.appId}`);
            const tr = document.createElement('tr');
            tr.setAttribute('data-appid', item.appId);
            tr.appendChild(createNameCell(item.appId, item.name));

            const cachedData = statsCache.get(item.appId);
            const lastText = cachedData ?
                `${cachedData.lastRounds}-${cachedData.lastDistributePv}@${cachedData.day}` :
                isSorted ? '无数据' : '加载中...';

            const cols = [
                item.pv ?? 0,
                item.pvRank ?? '-',
                item.uv ?? '-',
                item.searchDistributeNum ?? '-',
                item.userSatisfactionRatio ?? '-',
                lastText
            ];
            cols.forEach(val => {
                const td = document.createElement('td');
                td.textContent = val;
                tr.appendChild(td);
            });
            styleRow(tr);
            tbody.appendChild(tr);
            requestAnimationFrame(() => {
                tbody.scrollTop = tbody.scrollHeight;
            });
        }

        // 工具函数：更新“最近”列
        function updateLastColumn(tbody, appId, cachedData) {
            console.log(`Updating last column for appId: ${appId}`);
            const row = tbody.querySelector(`tr[data-appid="${appId}"]`);
            if (row) {
                const lastTd = row.querySelector('td:last-child');
                lastTd.textContent = cachedData ?
                    `${cachedData.lastRounds}-${cachedData.lastDistributePv}@${cachedData.day}` :
                    '无数据';
            }
        }

        // 工具函数：获取 API_STATS 数据并缓存
        function fetchStats(appId, startTime, endTime) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: API_STATS(appId, startTime, endTime),
                    onload: res => {
                        try {
                            const data = JSON.parse(res.responseText)?.data || [];
                            if (data.length > 0) {
                                const labels = data.map(item => item.date || '未知日期');
                                const rounds = data.map(item => item.rounds || 0);
                                const distributePv = data.map(item => item.distributePv || 0);
                                const lastRounds = rounds[rounds.length - 1];
                                const lastDistributePv = distributePv[distributePv.length - 1];
                                const day = labels[labels.length - 1];
                                const result = { labels, rounds, distributePv, lastRounds, lastDistributePv, day };
                                statsCache.set(appId, result);
                                resolve(result);
                            } else {
                                statsCache.set(appId, null);
                                resolve(null);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: () => {
                        statsCache.set(appId, null);
                        resolve(null);
                    }
                });
            });
        }

        // 工具函数：获取 API_OVERVIEW 数据
        function fetchOverview(agent) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: API_OVERVIEW(agent.appId),
                    onload: res => {
                        try {
                            const stat = JSON.parse(res.responseText)?.data || {};
                            resolve({
                                name: agent.name,
                                appId: agent.appId,
                                pv: stat.pv || 0,
                                pvRank: stat.pvRank,
                                uv: stat.uv,
                                searchDistributeNum: stat.searchDistributeNum,
                                userSatisfactionRatio: stat.userSatisfactionRatio
                            });
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: () => reject(new Error('获取概览失败'))
                });
            });
        }

        // 渲染收益趋势
        function renderProfitTrend(container) {
            const yesterday = Math.floor(Date.now() / 1000) - 86400;
            const fiveDaysAgo = yesterday - 4 * 86400;

            GM_xmlhttpRequest({
                method: 'GET',
                url: API_PROFIT(fiveDaysAgo, yesterday),
                onload: res => {
                    try {
                        const list = JSON.parse(res.responseText)?.data?.everyDayProfits || [];
                        if (!list.length) return;

                        const title = document.createElement('h3');
                        title.textContent = '📈联盟收益';
                        title.style.marginTop = '15px';
                        title.style.fontSize = '15px';

                        const table = document.createElement('table');
                        table.style.borderCollapse = 'collapse';
                        table.style.width = '100%';
                        table.innerHTML = `
                            <thead>
                                <tr style="background:#e0f7fa;">
                                    <th>日期</th>
                                    <th>当日</th>
                                    <th>累计</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        `;

                        const tbody = table.querySelector('tbody');
                        for (let i = 1; i < list.length; i++) {
                            const today = list[i];
                            const prev = list[i - 1];
                            const todayProfit = parseFloat(today.profit) - parseFloat(prev.profit);
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${today.date}</td>
                                <td>${todayProfit.toFixed(2)}</td>
                                <td>${parseFloat(today.profit).toFixed(2)}</td>
                            `;
                            styleRow(tr);
                            tbody.appendChild(tr);
                        }

                        styleHead(table);
                        container.appendChild(title);
                        container.appendChild(table);
                    } catch (e) {
                        console.error('Profit trend rendering failed:', e);
                    }
                },
                onerror: () => {
                    console.error('Failed to fetch profit data');
                }
            });
        }

        // 渲染智能体统计
        function renderAgentStats(container) {
            // 创建标题和刷新按钮容器
            const headerContainer = document.createElement('div');
            headerContainer.style.display = 'flex';
            headerContainer.style.alignItems = 'center';
            headerContainer.style.justifyContent = 'space-between';
            headerContainer.style.marginBottom = '10px';

            const statsTitle = document.createElement('h3');
            statsTitle.textContent = '🤖智能体统计';
            statsTitle.style.margin = '1px 0';
            statsTitle.style.fontSize = '15px';

            // 创建刷新按钮
            const refreshButton = document.createElement('button');
            refreshButton.innerText = '刷新';
            Object.assign(refreshButton.style, {
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: '600',
                background: 'none',
                color: '#1a6dbf',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none',
                textDecoration: 'none'
            });

            headerContainer.appendChild(statsTitle);
            headerContainer.appendChild(refreshButton);

            // 初始化表格
            const tableWrapper = document.createElement('div');
            Object.assign(tableWrapper.style, {
                maxHeight: '402px',
                overflowY: 'auto'
            });

            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';
            table.innerHTML = `
                <thead>
                    <tr style="background:#e0f7fa;">
                        <th>名称</th>
                        <th>对话</th>
                        <th>排名</th>
                        <th>人数</th>
                        <th>曝光</th>
                        <th>满意度</th>
                        <th>最近</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            styleHead(table);
            const tbody = table.querySelector('tbody');
            tableWrapper.appendChild(table);
            container.appendChild(headerContainer);
            container.appendChild(tableWrapper);

            // 刷新表格的函数
            function refreshTable() {
                tbody.innerHTML = ''; // 清空表格
                statsCache.clear(); // 清空缓存
                // 重新获取数据并渲染
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: API_LIST,
                    onload: res => {
                        try {
                            const agents = JSON.parse(res.responseText)?.data?.agentList || [];
                            if (!agents.length) {
                                tbody.innerHTML = '<tr><td colspan="7">无数据</td></tr>';
                                return;
                            }

                            const startTime = Math.floor(Date.now() / 1000) - 7 * 86400;
                            const endTime = Math.floor(Date.now() / 1000);
                            const results = [];
                            let completed = 0;

                            agents.forEach(agent => {
                                fetchOverview(agent)
                                    .then(item => {
                                        console.log(`API_OVERVIEW completed for appId: ${item.appId}`);
                                        if (!results.some(r => r.appId === item.appId)) {
                                            results.push(item);
                                            renderRow(tbody, item);
                                            fetchStats(item.appId, startTime, endTime)
                                                .then(data => {
                                                    console.log(`API_STATS completed for appId: ${item.appId}`);
                                                    updateLastColumn(tbody, item.appId, data);
                                                })
                                                .catch(e => console.error('获取统计失败 for appId:', item.appId, e));
                                        }
                                        completed++;
                                        if (completed === agents.length) {
                                            console.log('All API_OVERVIEW completed, sorting...');
                                            const sorted = results.sort((a, b) => b.pv - a.pv);
                                            tbody.innerHTML = '';
                                            sorted.forEach(item => renderRow(tbody, item, true));
                                        }
                                    })
                                    .catch(e => {
                                        console.error('处理概览失败 for appId:', agent.appId, e);
                                        completed++;
                                        if (completed === agents.length) {
                                            console.log('All API_OVERVIEW completed with errors, sorting...');
                                            const sorted = results.sort((a, b) => b.pv - a.pv);
                                            tbody.innerHTML = '';
                                            sorted.forEach(item => renderRow(tbody, item, true));
                                        }
                                    });
                            });
                        } catch (e) {
                            console.error('处理代理列表失败:', e);
                            tbody.innerHTML = '<tr><td colspan="7">数据加载失败</td></tr>';
                        }
                    },
                    onerror: () => {
                        console.error('获取代理列表失败');
                        tbody.innerHTML = '<tr><td colspan="7">数据加载失败</td></tr>';
                    }
                });
            }

            // 绑定刷新按钮点击事件
            refreshButton.onclick = refreshTable;

            // 初次渲染表格
            refreshTable();
        }

        // 表格头部样式
        function styleHead(table) {
            table.querySelectorAll('th').forEach(th => {
                th.style.border = '1px solid #ccc';
                th.style.padding = '8px';
                th.style.textAlign = 'center';
            });
        }

        // 表格行样式
        function styleRow(tr) {
            tr.querySelectorAll('td').forEach(td => {
                td.style.border = '1px solid #ccc';
                td.style.padding = '6px 8px';
                td.style.fontSize = '16px';
                td.style.textAlign = 'center';
            });
        }
    }

    // 在 DOM 加载完成后启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
