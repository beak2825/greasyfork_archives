// ==UserScript==
// @name         Everyday Profit
// @namespace    http://tampermonkey.net/
// @version      2025.09.16.1
// @description  记录每日净资产并计算增长 + 单位识别 + 历史图表弹窗，需要安装MWITools，数据存储在本地，保留30天记录
// @author       VictoryWinWinWin
// @match        https://www.milkywayidle.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543837/Everyday%20Profit.user.js
// @updateURL https://update.greasyfork.org/scripts/543837/Everyday%20Profit.meta.js
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
            width: 800px;
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
            cursor: move;
            user-select: none;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        #netWorthChartBody {
            padding: 15px;
        }
        #netWorthChart {
            width: 100%;
            height: 300px;
        }
        #showHistoryBtn {
            display: inline-block;
            padding: 6px 12px;
            margin: 10px 0;
            font-size: 16px;
            background: #444;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
        #showHistoryBtn:hover {
            background: #666;
        }
    `);

    // 工具函数：将带单位的字符串（如 1.5M, 3.2K）转为数字
    function parseFormattedNumber(str) {
        const cleanStr = str.replace(/[^\d.,-]/g, '').replace(',', '.');
        const num = parseFloat(cleanStr);
        if (isNaN(num)) return 0;

        if (str.includes('B') || str.includes('b')) return num * 1e9;
        if (str.includes('M') || str.includes('m')) return num * 1e6;
        if (str.includes('K') || str.includes('k')) return num * 1e3;
        return num;
    }

    // 工具函数：将大数字格式化为带单位的字符串（如 2.5M）
    function formatLargeNumber(num) {
        const abs = Math.abs(num);
        let formatted;
        if (abs >= 1e9) {
            formatted = (num / 1e9).toFixed(2) + 'B';
        } else if (abs >= 1e6) {
            formatted = (num / 1e6).toFixed(2) + 'M';
        } else if (abs >= 1e3) {
            formatted = (num / 1e3).toFixed(2) + 'K';
        } else {
            formatted = num.toString();
        }
        return formatted;
    }

    window.kbd_calculateTotalNetworth = function kbd_calculateTotalNetworth(totalNetworth, dom) {
        class DailyDataStore {
            constructor(storageKey = 'kbd_calc_data', maxDays = 30, currentRole = 'default') {
                this.storageKey = storageKey;
                this.maxDays = maxDays;
                this.currentRole = currentRole; // 当前操作的角色
                this.data = this.loadFromStorage();
            }

            // ✅ 设置当前角色
            setRole(roleId) {
                this.currentRole = roleId;
            }

            // ✅ 获取当前角色的数据对象
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
                console.log(`${this.storageKey} 数据已成功保存到本地存储。`);
            }

            setTodayValue(value) {
                const roleData = this.getRoleData();
                const today = this.getTodayKey();
                roleData[today] = value;
                this.cleanupOldData(); // 清理当前角色的旧数据
                this.saveToStorage();
            }

            cleanupOldData() {
                const roleData = this.getRoleData();
                const keys = Object.keys(roleData).sort();
                const today = this.getTodayKey();
                const indexToday = keys.indexOf(today);

                if (indexToday !== -1) {
                    const startIdx = Math.max(0, indexToday - this.maxDays + 1);
                    const newKeys = keys.slice(startIdx, indexToday + 1);
                    const newData = {};
                    newKeys.forEach(key => {
                        newData[key] = roleData[key];
                    });
                    this.data[this.currentRole] = newData;
                }
            }

            getTodayDelta() {
                const roleData = this.getRoleData();
                const todayKey = this.getTodayKey();
                const yesterdayKey = this.getYesterdayKey();

                const todayValue = roleData[todayKey] || 0;
                const yesterdayValue = roleData[yesterdayKey] || 0;

                return todayValue - yesterdayValue;
            }

            getHistoryData() {
                const roleData = this.getRoleData();
                const sorted = Object.entries(roleData).sort(([a], [b]) => new Date(a) - new Date(b));
                const labels = sorted.map(([date]) => date);
                const values = sorted.map(([, value]) => value);
                return { labels, values };
            }

            // ✅ 获取所有角色列表
            getAllRoles() {
                return Object.keys(this.data);
            }

            // ✅ 删除某个角色的数据
            removeRole(roleId) {
                delete this.data[roleId];
                this.saveToStorage();
            }
        }

        const injectDeltaScript = (isFirst = true) => {
            const store = new DailyDataStore();
            const divElement = document.querySelector('.CharacterName_name__1amXp');
            const username = divElement.querySelector('span').textContent;
            console.log(username);
            store.setRole(username)

            function filterHistoryData(days) {
                // 获取当前用户名
                const username = divElement.querySelector('span').textContent;

                // 如果没有传用户名，返回空数据
                if (!username) {
                    return { labels: [], values: [] };
                }
                const now = new Date();
                const cutoff = new Date();
                cutoff.setDate(now.getDate() - days);

                // 获取该用户的数据对象
                const userData = store.data[username];
                
                // 如果用户不存在或无数据，返回空
                if (!userData) {
                    return { labels: [], values: [] };
                }

                // 将用户的 { date: value } 转为数组并按日期排序
                const sorted = Object.entries(userData).sort(([a], [b]) => new Date(a) - new Date(b));

                // 过滤出最近 days 天的数据    
                const filtered = sorted.filter(([date]) => new Date(date) >= cutoff);

                // 提取 labels（日期）和 values（金额）
                const labels = filtered.map(([date]) => date);
                const values = filtered.map(([, value]) => value);
                return { labels, values };
            }

            store.setTodayValue(totalNetworth);

            const delta = store.getTodayDelta();
            const formattedDelta = formatLargeNumber(delta);
            const color = delta > 0 ? 'green' : (delta < 0 ? 'red' : 'gray');

            if (isFirst) {
                dom.insertAdjacentHTML(
                    'afterend',
                    `
                    <div id="deltaNetworthDiv" style="text-align:left;color:#fff;font-size:20px;margin:10px 0;">
                        <span style="font-weight:bold;">💰今日盈亏: </span>
                        <span style="color:${color};font-weight:bold;">${formattedDelta}</span>
                        <span id="showHistoryIcon" style="cursor:pointer; margin-left:8px; font-size:18px;">📊</span>
                    </div>
                `

                );

                // 创建弹窗
                const modal = document.createElement('div');
                modal.id = 'deltaNetworthChartModal';

                modal.innerHTML = `
                    <div id="deltaNetworthChartHeader">
                        <span>净资产历史曲线</span>
                        <span id="deltaNetworthChartCloseBtn" style="cursor:pointer;">❌</span>
                    </div>
                    <div id="deltaNetworthChartControls" style="padding: 10px; text-align:center;">
                        <button id="btn7Days" style="margin: 5px; padding: 6px 12px; background: #444; color: white; border: none; border-radius: 4px;">7天</button>
                        <button id="btn30Days" style="margin: 5px; padding: 6px 12px; background: #444; color: white; border: none; border-radius: 4px;">30天</button>
                    </div>
                    <div id="netWorthChartBody">
                        <canvas id="netWorthChart"></canvas>
                    </div>
                `;

                document.body.appendChild(modal);

                // const showBtn = document.getElementById('showHistoryBtn');
                const modalDiv = document.getElementById('deltaNetworthChartModal');
                const closeBtn = document.getElementById('deltaNetworthChartCloseBtn');

                let chartLoaded = false;

                function showModal() {
                    modalDiv.style.display = 'flex';
                    if (!chartLoaded) {
                        let chart = null; // 👈 定义 chart 变量，用于后续更新

                        const { labels, values } = store.getHistoryData();
                        const script = document.createElement('script');
                        script.src = 'https://unpkg.com/chart.js@3.9.1/dist/chart.min.js';
                        // 在使用 Chart.js 前检查
                        if (typeof Chart == 'undefined') {
                            console.error('Chart.js 未加载，图表无法渲染。');
                        }                        
                        script.onload = () => {
                            chart = new Chart(document.getElementById('netWorthChart'), {
                                type: 'line',
                                data: {
                                    labels,
                                    datasets: [{
                                        label: '净资产历史',
                                        data: values,
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        tension: 0.3,
                                        fill: false
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    plugins: {
                                        legend: { display: true },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => formatLargeNumber(context.raw)
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
                            chartLoaded = true;
                            document.getElementById('btn7Days').onclick = () => {
                                const { labels, values } = filterHistoryData(7);
                                chart.data.labels = labels;
                                chart.data.datasets[0].data = values;
                                chart.update();
                            };

                            document.getElementById('btn30Days').onclick = () => {
                                const { labels, values } = filterHistoryData(30);
                                chart.data.labels = labels;
                                chart.data.datasets[0].data = values;
                                chart.update();
                            };
                        };
                        document.head.appendChild(script);
                    }
                }

                function hideModal() {
                    modalDiv.style.display = 'none';
                }

                document.getElementById('showHistoryIcon').addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止事件冒泡（如有需要）
                    if (modalDiv.style.display === 'flex') {
                        hideModal();
                    } else {
                        showModal();
                    }
                });

                closeBtn.addEventListener('click', hideModal);

                // 拖动功能
                let isDragging = false, offsetX, offsetY;

                modalDiv.querySelector('#deltaNetworthChartHeader').addEventListener('mousedown', (e) => {
                    isDragging = true;
                    offsetX = e.clientX - modalDiv.offsetLeft;
                    offsetY = e.clientY - modalDiv.offsetTop;
                });

                document.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        modalDiv.style.left = `${e.clientX - offsetX}px`;
                        modalDiv.style.top = `${e.clientY - offsetY}px`;
                    }
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
            } else {
                store.setTodayValue(totalNetworth);
                const delta = store.getTodayDelta(totalNetworth);
                const deltaDom = document.getElementById('deltaNetworthDiv');
                if (deltaDom) {
                    const formattedDelta = formatLargeNumber(delta);
                    const color = delta > 0 ? 'green' : (delta < 0 ? 'red' : 'gray');
                    deltaDom.innerHTML = `
                        <span style="font-weight:bold;">💰今日增长: </span>
                        <span style="color:${color};font-weight:bold;">${formattedDelta}</span>
                        <span id="showHistoryIcon" style="cursor:pointer; margin-left:8px; font-size:18px;">📊</span>
                    `;
                }
            }
        };

        injectDeltaScript();
        setInterval(() => injectDeltaScript(false), 10 * 60 * 1000); // 每10分钟刷新
    };

    // 监听 Networth 的 DOM 元素是否出现
    const checkNetworthAndRun = () => {
        const networthDisplay = document.querySelector('#toggleNetWorth');
        if (networthDisplay) {
            const textContent = networthDisplay.textContent.trim();
            const totalNetworth = parseFormattedNumber(textContent);

            const insertDom = document.getElementById('netWorthDetails');
            if (insertDom && !document.getElementById('deltaNetworthDiv')) {
                window.kbd_calculateTotalNetworth?.(totalNetworth, insertDom);
            }
        }
    };

    // 初始检查
    checkNetworthAndRun();

    // 定时检查（页面可能动态加载）
    setInterval(checkNetworthAndRun, 5000);
})();