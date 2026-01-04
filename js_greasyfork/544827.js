// ==UserScript==
// @name         每日总资产增长(DailyAssets)
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  记录每日总资产增长，图表中分别显示总资产、流动资产、非流动资产详情，数据存储在本地，可查看3、7、30、60、90、180天记录
// @author       Vicky718
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544827/%E6%AF%8F%E6%97%A5%E6%80%BB%E8%B5%84%E4%BA%A7%E5%A2%9E%E9%95%BF%28DailyAssets%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544827/%E6%AF%8F%E6%97%A5%E6%80%BB%E8%B5%84%E4%BA%A7%E5%A2%9E%E9%95%BF%28DailyAssets%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #deltaNetworthChartModal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 850px;
            max-width: 90vw;
            background: #1e1e1e;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.6);
            z-index: 9999;
            display: none;
            flex-direction: column;
        }
        #deltaNetworthChartModal.dragging {
            cursor: grabbing;
        }
        #deltaNetworthChartHeader {
            padding: 10px 15px;
            background: #333;
            color: white;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: default;
            user-select: none;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        #netWorthChartBody {
            padding: 15px;
        }
        #netWorthChart {
            width: 100%;
            height: 350px;
        }
        .asset-delta-display {
            text-align: left;
            color: #fff;
            font-size: 16px;
            margin: 0px 0;
        }
        .asset-delta-label {
            font-weight: bold;
            margin-right: 5px;
        }
        #showHistoryIcon {
            cursor: pointer;
            margin-left: 8px;
            font-size: 16px;
            display: inline-block;
            margin-top: 0px;
        }
        #chartOptionsContainer {
            padding: 10px;
            background: #252525;
            border-bottom: 1px;
            solid #333;
        }
        #chartDisplayOptions {
            display: none; /* 只隐藏显示选项部分 */
        }
        .chart-option {
            margin: 5px;
            display: inline-block;
        }
        .chart-option input {
            margin-right: 5px;
        }
        .chart-option label {
            cursor: pointer;
        }
        .positive-delta {
            color: #4CAF50;
            font-weight: bold;
        }
        .negative-delta {
            color: #F44336;
            font-weight: bold;
        }
        .neutral-delta {
            color: #9E9E9E;
            font-weight: bold;
        }
        .time-range-btn {
            padding: 5px 10px;
            background: #444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        }
        .time-range-btn:hover {
            background: #555;
        }
        .time-range-btn.active {
            background: #666;
            font-weight: bold;
        }
        #timeRangeOptions {
            margin-top: 8px;
            color: #fff;
        }
    `);

    // 工具函数：将带单位的字符串转为数字
    function parseFormattedNumber(str) {
        if (!str) return 0;
        const cleanStr = str.replace(/[^\d.,-]/g, '').replace(',', '.');
        const num = parseFloat(cleanStr);
        if (isNaN(num)) return 0;

        if (str.includes('B') || str.includes('b')) return num * 1e9;
        if (str.includes('M') || str.includes('m')) return num * 1e6;
        if (str.includes('K') || str.includes('k')) return num * 1e3;
        return num;
    }

    // 工具函数：将大数字格式化为带单位的字符串
    function formatLargeNumber(num) {
        const abs = Math.abs(num);
        let formatted;
/*         if (abs >= 1e9) {
            formatted = (num / 1e9).toFixed(2) + 'B';
        } else */
        if (abs >= 1e6) {
            formatted = (num / 1e6).toFixed(2) + 'M';
        } else if (abs >= 1e3) {
            formatted = (num / 1e3).toFixed(2) + 'K';
        } else {
            formatted = num.toFixed(2);
        }
        return formatted;
    }

    // 获取或初始化图表显示选项
    function getChartOptions() {
        const defaults = {
            showCurrent: true,
            showNonCurrent: true,
            showTotal: true,
            daysToShow: 30
        };
        const saved = GM_getValue('chartOptions', defaults);
        return {...defaults, ...saved};
    }

    // 保存图表显示选项
    function saveChartOptions(options) {
        GM_setValue('chartOptions', options);
    }

    window.kbd_calculateTotalNetworth = function kbd_calculateTotalNetworth(currentAssets, nonCurrentAssets, dom) {
        class AssetDataStore {
            constructor(storageKey = 'kbd_asset_data_v2', maxDays = 180, currentRole = 'default') {
                this.storageKey = storageKey;
                this.maxDays = maxDays;
                this.currentRole = currentRole;
                this.data = this.loadFromStorage();
            }

            setRole(roleId) {
                this.currentRole = roleId;
            }

            getRoleData() {
                if (!this.data[this.currentRole]) {
                    this.data[this.currentRole] = {};
                }
                return this.data[this.currentRole];
            }

            getTodayKey() {
                const now = new Date();
                const utcPlus8 = new Date(now.getTime() + 8 * 3600000);
                return utcPlus8.toISOString().split('T')[0];
            }

            getYesterdayKey() {
                const now = new Date();
                const yesterday = new Date(now.getTime() - 24 * 3600000);
                const utcPlus8 = new Date(yesterday.getTime() + 8 * 3600000);
                return utcPlus8.toISOString().split('T')[0];
            }

            loadFromStorage() {
                const raw = localStorage.getItem(this.storageKey);
                try {
                    return raw ? JSON.parse(raw) : {};
                } catch {
                    return {};
                }
            }

            saveToStorage() {
                localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            }

            setTodayValues(current, nonCurrent) {
                const roleData = this.getRoleData();
                const today = this.getTodayKey();
                roleData[today] = {
                    currentAssets: current,
                    nonCurrentAssets: nonCurrent,
                    totalAssets: current + nonCurrent,
                    timestamp: Date.now()
                };
                this.cleanupOldData();
                this.saveToStorage();
                console.log(`[DEBUG] 存储当日数据:
                   当前资产=${current},
                   非当前资产=${nonCurrent},
                   时间=${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

            }

            cleanupOldData() {
                const roleData = this.getRoleData();
                const keys = Object.keys(roleData).sort();
                const cutoff = Date.now() - (this.maxDays * 24 * 3600 * 1000);

                const newData = {};
                keys.forEach(key => {
                    if (roleData[key].timestamp > cutoff) {
                        newData[key] = roleData[key];
                    }
                });
                this.data[this.currentRole] = newData;
            }

            getTodayDeltas() {
                const roleData = this.getRoleData();
                const todayKey = this.getTodayKey();
                const yesterdayKey = this.getYesterdayKey();

                const todayData = roleData[todayKey] || { currentAssets: 0, nonCurrentAssets: 0, totalAssets: 0 };
                const yesterdayData = roleData[yesterdayKey] || { currentAssets: 0, nonCurrentAssets: 0, totalAssets: 0 };

                return {
                    currentDelta: todayData.currentAssets - yesterdayData.currentAssets,
                    nonCurrentDelta: todayData.nonCurrentAssets - yesterdayData.nonCurrentAssets,
                    totalDelta: todayData.totalAssets - yesterdayData.totalAssets,
                    totalRatio: yesterdayData.totalAssets > 0 ?
                        (todayData.totalAssets - yesterdayData.totalAssets) / yesterdayData.totalAssets * 100 : 0
                };
                console.log(`[DEBUG] 差值计算:
                   今日数据=${JSON.stringify(todayData)},
                   昨日数据=${JSON.stringify(yesterdayData)}`);
            }

            getHistoryData(days = 30) {
                const roleData = this.getRoleData();
                const cutoff = Date.now() - (days * 24 * 3600 * 1000);

                const filtered = Object.entries(roleData)
                    .filter(([_, data]) => data.timestamp > cutoff)
                    .sort(([a], [b]) => new Date(a) - new Date(b));

                return {
                    labels: filtered.map(([date]) => date),
                    currentAssets: filtered.map(([_, data]) => data.currentAssets),
                    nonCurrentAssets: filtered.map(([_, data]) => data.nonCurrentAssets),
                    totalAssets: filtered.map(([_, data]) => data.totalAssets)
                };
            }

            getAllRoles() {
                return Object.keys(this.data);
            }

            removeRole(roleId) {
                delete this.data[roleId];
                this.saveToStorage();
            }
        }

        const store = new AssetDataStore();
        let chart = null;

        const updateDisplay = (isFirst = false) => {
            const divElement = document.querySelector('.CharacterName_name__1amXp');
            const username = divElement?.querySelector('span')?.textContent || 'default';
            store.setRole(username);

            const totalAssets = currentAssets + nonCurrentAssets;
            store.setTodayValues(currentAssets, nonCurrentAssets);

            const deltas = store.getTodayDeltas();
            const formattedTotalDelta = formatLargeNumber(deltas.totalDelta);
            const totalDeltaClass = deltas.totalDelta > 0 ? 'positive-delta' :
                                  (deltas.totalDelta < 0 ? 'negative-delta' : 'neutral-delta');

            if (isFirst) {
                dom.insertAdjacentHTML('afterend', `
                    <div id="assetDeltaContainer" style="margin-top: 0px;">
                        <div class="asset-delta-display">
                            <span class="asset-delta-label">💰总资产增长:</span>
                            <span class="${totalDeltaClass}">${formattedTotalDelta}</span>
                            <span id="showHistoryIcon" title="显示详细资产历史图表">📊</span>
                        </div>
                    </div>
                `);

                // 创建弹窗
                const modal = document.createElement('div');
                modal.id = 'deltaNetworthChartModal';
                modal.innerHTML = `
                    <div id="deltaNetworthChartHeader">
                        <span>详细资产历史曲线 (v${GM_info.script.version})</span>
                        <span id="deltaNetworthChartCloseBtn" style="cursor:pointer;">❌</span>
                    </div>
                    <div id="chartOptionsContainer">
                        <div id="chartDisplayOptions">
                            <span style="margin-right:10px;font-weight:bold;">显示:</span>
                            <span class="chart-option">
                                <input type="checkbox" id="showCurrentOption" checked>
                                <label for="showCurrentOption">流动资产</label>
                            </span>
                            <span class="chart-option">
                                <input type="checkbox" id="showNonCurrentOption" checked>
                                <label for="showNonCurrentOption">非流动资产</label>
                            </span>
                            <span class="chart-option">
                                <input type="checkbox" id="showTotalOption" checked>
                                <label for="showTotalOption">总资产</label>
                            </span>
                        </div>
                        <div id="timeRangeOptions">
                            <span style="margin-right:10px;font-weight:bold;">时间范围:</span>
                            <button id="btn3Days" class="time-range-btn">3天</button>
                            <button id="btn7Days" class="time-range-btn">7天</button>
                            <button id="btn30Days" class="time-range-btn active">30天</button>
                            <button id="btn60Days" class="time-range-btn">60天</button>
                            <button id="btn90Days" class="time-range-btn">90天</button>
                            <button id="btn180Days" class="time-range-btn">180天</button>
                        </div>
                    </div>
                    <div id="netWorthChartBody">
                        <canvas id="netWorthChart"></canvas>
                    </div>
                `;
                document.body.appendChild(modal);

                // 初始化图表选项
                const options = getChartOptions();
                document.getElementById('showCurrentOption').checked = options.showCurrent;
                document.getElementById('showNonCurrentOption').checked = options.showNonCurrent;
                document.getElementById('showTotalOption').checked = options.showTotal;

                // 设置活动的时间范围按钮
                document.querySelectorAll('.time-range-btn').forEach(btn => {
                    if (btn.id === `btn${options.daysToShow}Days`) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });

                // 事件监听
                document.getElementById('showHistoryIcon').addEventListener('click', toggleModal);
                document.getElementById('deltaNetworthChartCloseBtn').addEventListener('click', hideModal);

                // 图表选项变化监听
                document.getElementById('showCurrentOption').addEventListener('change', updateChartVisibility);
                document.getElementById('showNonCurrentOption').addEventListener('change', updateChartVisibility);
                document.getElementById('showTotalOption').addEventListener('change', updateChartVisibility);

                // 时间范围按钮监听
                document.getElementById('btn3Days').addEventListener('click', () => updateChartTimeRange(3));
                document.getElementById('btn7Days').addEventListener('click', () => updateChartTimeRange(7));
                document.getElementById('btn30Days').addEventListener('click', () => updateChartTimeRange(30));
                document.getElementById('btn60Days').addEventListener('click', () => updateChartTimeRange(60));
                document.getElementById('btn90Days').addEventListener('click', () => updateChartTimeRange(90));
                document.getElementById('btn180Days').addEventListener('click', () => updateChartTimeRange(180));

                // 拖动功能
                setupDrag(modal);
            } else {
                const container = document.getElementById('assetDeltaContainer');
                if (container) {
                    container.innerHTML = `
                        <div class="asset-delta-display">
                            <span class="asset-delta-label">💰总资产增长:</span>
                            <span class="${totalDeltaClass}">${formattedTotalDelta}</span>
                            <span id="showHistoryIcon" title="显示详细资产历史图表">📊</span>
                        </div>
                    `;
                    document.getElementById('showHistoryIcon').addEventListener('click', toggleModal);
                }
            }
        };

        function toggleModal() {
            const modal = document.getElementById('deltaNetworthChartModal');
            if (modal.style.display === 'flex') {
                hideModal();
            } else {
                showModal();
            }
        }

        function showModal() {
            const modal = document.getElementById('deltaNetworthChartModal');
            modal.style.display = 'flex';

            if (!window.Chart) {
                loadChartLibrary().then(initializeChart);
            } else if (!chart) {
                initializeChart();
            } else {
                updateChart();
            }
        }

        function hideModal() {
            const modal = document.getElementById('deltaNetworthChartModal');
            modal.style.display = 'none';
            // 重置弹窗位置
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 850px;
                max-width: 90vw;
                background: #1e1e1e;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.6);
                z-index: 9999;
                display: none;
                flex-direction: column;
                `;
        }

        function loadChartLibrary() {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }

        function initializeChart() {
            const options = getChartOptions();
            const historyData = store.getHistoryData(options.daysToShow);

            const ctx = document.getElementById('netWorthChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: historyData.labels,
                    datasets: [
                        {
                            id: 'current',
                            label: '流动资产',
                            data: historyData.currentAssets,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            tension: 0.3,
                            fill: false,
                            hidden: !options.showCurrent
                        },
                        {
                            id: 'nonCurrent',
                            label: '非流动资产',
                            data: historyData.nonCurrentAssets,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            tension: 0.3,
                            fill: false,
                            hidden: !options.showNonCurrent
                        },
                        {
                            id: 'total',
                            label: '总资产',
                            data: historyData.totalAssets,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            tension: 0.3,
                            fill: false,
                            hidden: !options.showTotal
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 10
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.dataset.label || '';
                                    const value = formatLargeNumber(context.raw);
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                callback: (value) => formatLargeNumber(value)
                            }
                        }
                    }
                }
            });
        }

        function updateChart() {
            const options = getChartOptions();
            const historyData = store.getHistoryData(options.daysToShow);

            chart.data.labels = historyData.labels;
            chart.data.datasets[0].data = historyData.currentAssets;
            chart.data.datasets[1].data = historyData.nonCurrentAssets;
            chart.data.datasets[2].data = historyData.totalAssets;

            chart.update();
        }

        function updateChartVisibility() {
            const options = {
                showCurrent: document.getElementById('showCurrentOption').checked,
                showNonCurrent: document.getElementById('showNonCurrentOption').checked,
                showTotal: document.getElementById('showTotalOption').checked,
                daysToShow: getChartOptions().daysToShow
            };

            saveChartOptions(options);

            if (chart) {
                chart.data.datasets[0].hidden = !options.showCurrent;
                chart.data.datasets[1].hidden = !options.showNonCurrent;
                chart.data.datasets[2].hidden = !options.showTotal;
                chart.update();
            }
        }

        function updateChartTimeRange(days) {
            const options = getChartOptions();
            options.daysToShow = days;
            saveChartOptions(options);

            // 更新活动按钮样式
            document.querySelectorAll('.time-range-btn').forEach(btn => {
                if (btn.id === `btn${days}Days`) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            if (chart) {
                const historyData = store.getHistoryData(days);
                chart.data.labels = historyData.labels;
                chart.data.datasets[0].data = historyData.currentAssets;
                chart.data.datasets[1].data = historyData.nonCurrentAssets;
                chart.data.datasets[2].data = historyData.totalAssets;
                chart.update();
            }
        }

        function setupDrag(modal) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            modal.querySelector('#deltaNetworthChartHeader').addEventListener('mousedown', (e) => {
                isDragging = true;

                // 获取初始鼠标位置和弹窗位置
                startX = e.clientX;
                startY = e.clientY;
                // 获取当前弹窗位置（从样式或计算位置）
                const rect = modal.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                modal.classList.add('dragging');
                e.preventDefault(); // 防止文本选中
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    // 计算鼠标移动距离
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    // 应用新的位置
                    modal.style.left = `${initialLeft + dx}px`;
                    modal.style.top = `${initialTop + dy}px`;
                    modal.style.transform = 'none';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                modal.classList.remove('dragging');
            });
        }

        // 初始更新
        updateDisplay(true);
        setInterval(() => updateDisplay(false), 10 * 60 * 1000); // 每10分钟刷新
    };

    // 检查资产元素并运行脚本
    const checkAssetsAndRun = () => {
        // 获取各个组成部分的值
        const equippedNetworth = parseFormattedNumber(document.querySelector('#equippedNetworthAsk')?.textContent?.trim() || '0');
        const inventoryNetworth = parseFormattedNumber(document.querySelector('#inventoryNetworthAsk')?.textContent?.trim() || '0');
        const marketListingsNetworth = parseFormattedNumber(document.querySelector('#marketListingsNetworthAsk')?.textContent?.trim() || '0');
        const totalHouseScore = parseFormattedNumber(document.querySelector('#totalHouseScore')?.textContent?.trim() || '0');
        const abilityScore = parseFormattedNumber(document.querySelector('#abilityScore')?.textContent?.trim() || '0');

        // 计算新的资产值
        const currentAssets = equippedNetworth + inventoryNetworth + marketListingsNetworth;
        const nonCurrentAssets = totalHouseScore + abilityScore;

        const insertDom = document.getElementById('netWorthDetails');
        if (insertDom && !document.getElementById('assetDeltaContainer')) {
            window.kbd_calculateTotalNetworth?.(currentAssets, nonCurrentAssets, insertDom);

/*         const currentAssetsElement = document.querySelector('#currentAssets');
        const nonCurrentAssetsElement = document.querySelector('#nonCurrentAssets');

        if (currentAssetsElement && nonCurrentAssetsElement) {
            const currentAssets = parseFormattedNumber(currentAssetsElement.textContent.trim());
            const nonCurrentAssets = parseFormattedNumber(nonCurrentAssetsElement.textContent.trim());

            const insertDom = document.getElementById('netWorthDetails');
            if (insertDom && !document.getElementById('assetDeltaContainer')) {
                window.kbd_calculateTotalNetworth?.(currentAssets, nonCurrentAssets, insertDom);
            } */
        }
    };

    // 初始检查和定时检查
    checkAssetsAndRun();
    setInterval(checkAssetsAndRun, 5000);
})();