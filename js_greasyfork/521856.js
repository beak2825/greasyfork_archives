// ==UserScript==
// @license MIT
// @name         OKX Cumulative Position Profit Chart
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在 OKX 页面插入一个悬浮在底部的曲线图，绘制每个标的的累计收益曲线
// @author       Kearns
// @match        https://www.okx.com/zh-hans/balance/report-center/unified/position-history
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521856/OKX%20Cumulative%20Position%20Profit%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/521856/OKX%20Cumulative%20Position%20Profit%20Chart.meta.js
// ==/UserScript==

// @require      https://cdn.jsdelivr.net/npm/chart.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns
// @require      https://cdn.jsdelivr.net/npm/dayjs
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation

(function () {
    'use strict';

    // 插入悬浮 Chart 容器到页面
    function insertFloatingChartContainer() {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = "30%"; // 高度占页面的四分之一
        container.style.backgroundColor = "rgba(255, 255, 255, 1)";
        container.style.boxShadow = "0px -2px 5px rgba(0, 0, 0, 0.2)";
        container.style.zIndex = "1000";
        container.style.padding = "0px";
        container.style.borderTop = "1px solid #ddd";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";

        container.innerHTML = `
            <h2 style="margin: 5px 0;">持仓累计收益曲线（按标的）</h2>
            <div id="chartContainer" style="width: 95%; height: 100%; margin: 0 auto;">
                <canvas id="positionHistoryChart" style="flex-grow: 1;"></canvas>
            </div>
        `;

        document.body.appendChild(container);
        return true;
    }

    // 获取数据并绘制图表
    async function fetchAndDrawChart(dataList, ts) {
        if (dataList === undefined) {
            dataList = []
        }
        if (ts === undefined) {
            ts = Date.now()
        }
        try {
            const apiUrl = "https://www.okx.com/priapi/v5/account/history-positions";
            //https://www.okx.com/priapi/v5/account/history-positions?sortType=1&_start=1734883200000&after=1735114512295&limit=100&t=1735197872921
            const params = {
                sortType: 1,
                _start: Date.now() - 3 * 24 * 60 * 60 * 1000,
                after: ts,
                limit: 100
            };
            const query = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join("&");
            GM_xmlhttpRequest({
                method: "GET",
                url: `${apiUrl}?${query}`,
                headers: {
                    "Content-Type": "application/json",
                },
                onload: function (response) {
                    const data = JSON.parse(response.responseText);

                    if (data.code !== "0" || !data.data) {
                        console.error("Failed to fetch data:", data.msg);
                        return;
                    }
                    dataList = dataList.concat(data.data);
                    if (data.data.length > 0) {
                        fetchAndDrawChart(dataList, data.data[data.data.length - 1].uTime)
                    } else {
                        const processedData = processData(dataList.sort((a, b) => a.uTime - b.uTime));
                        drawChart(processedData);
                    }
                },
                onerror: function () {
                    console.error("Failed to fetch data from OKX API.");
                },
            });
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    }

    // 数据处理函数
    function processData(data) {
        console.log(data)
        const labels = [];
        const groupedData = {};

        data.forEach(item => {
            item.uTime = parseInt(item.uTime)
            if (!labels.includes(item.uTime)) {
                console.log(typeof item.uTime)
                labels.push(item.uTime);
            }

            if (!groupedData[item.instId]) {
                groupedData[item.instId] = {
                    label: item.instId,
                    data: [],
                    pointRadius: 0,
                    cumulative: 0, // 累计收益初始值
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                        Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 1)`,
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    tension: 0.1,
                };
            }

            // 更新累计收益
            groupedData[item.instId].cumulative += parseFloat(item.realizedPnl);
            groupedData[item.instId].data.push({y: groupedData[item.instId].cumulative, x: item.uTime});
        });
        return {
            labels: labels.sort((a, b) => a - b),
            datasets: Object.values(groupedData).map((item) => {
            item.data = item.data.sort((a, b) => a.x - b.x)
            return item
        })
        };
    }

    // 绘制图表函数
    function drawChart({ labels, datasets }) {
        const ctx = document.getElementById("positionHistoryChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    annotation: {
                    annotations: {
                        zeroLine: {
                            type: 'line',
                            yMin: 0, // Y 轴起点
                            yMax: 0, // Y 轴终点
                            borderColor: 'red',
                            borderWidth: 2,
                            borderDash: [6, 6], // 虚线样式
                            label: {
                                enabled: true,
                                content: 'Y=0',
                                position: 'end',
                                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                                color: 'black'
                            }
                        }
                    }
                }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        type: 'time', // 时间轴
                        time: {
                            unit: 'hour', // 以天为单位显示
                            tooltipFormat: 'MM-dd HH:mm:ss' // 鼠标悬停格式
                        }
                    },
                },
            },
            plugins: ['customLine']
        });
    }

    // 初始化脚本
    function init() {
        if (insertFloatingChartContainer()) {
            fetchAndDrawChart();
        }
    }

    init();
})();
