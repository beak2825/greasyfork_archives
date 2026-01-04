// ==UserScript==
// @name         英为财情定投计算器
// @namespace    http://tampermonkey.net/
// @version      2025-07-10
// @description  英为财情定投计算器，用于写定投报告用，输入起止时间和定投金额，计算回报率等数据
// @author       meteor
// @match        https://cn.investing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=investing.com
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520482/%E8%8B%B1%E4%B8%BA%E8%B4%A2%E6%83%85%E5%AE%9A%E6%8A%95%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520482/%E8%8B%B1%E4%B8%BA%E8%B4%A2%E6%83%85%E5%AE%9A%E6%8A%95%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 延迟执行以确保 DOM 加载完成
    function initScript() {
        if (!document.body) {
            console.warn('document.body 未加载，稍后重试');
            setTimeout(initScript, 100);
            return;
        }

        const styleContent = `
            #calculateButton {
                position: fixed;
                top: 50px;
                right: 10px;
                z-index: 10000;
                background-color: #28a745;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
            #calculatorIframeOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: none;
            }
            #calculatorIframe {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 98%;
                height: 95%;
                border: none;
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = styleContent;
        document.head.appendChild(styleElement);

        const calculateButton = document.createElement('div');
        calculateButton.id = 'calculateButton';
        calculateButton.textContent = '计算';
        try {
            document.body.appendChild(calculateButton);
        } catch (e) {
            console.error('无法添加 calculateButton:', e);
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'calculatorIframeOverlay';
        const iframe = document.createElement('iframe');
        iframe.id = 'calculatorIframe';
        overlay.appendChild(iframe);
        try {
            document.body.appendChild(overlay);
        } catch (e) {
            console.error('无法添加 overlay:', e);
            return;
        }

        calculateButton.addEventListener('click', function () {
            iframe.srcdoc = `
                <!DOCTYPE html>
                <html style="background: aliceblue;">
                <head>
                    <meta charset="UTF-8">
                    <title>价格均值计算</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/9.0.1/bignumber.min.js"></script>
                    <script src="https://registry.npmmirror.com/echarts/5.5.1/files/dist/echarts.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
                    <style>
                        #chartContainer {
                            width: 1400px;
                            height: 1000px;
                        }
                        .input-group {
                            margin-bottom: 10px;
                        }
                        .input-group label {
                            display: inline-block;
                            width: 120px;
                        }
                    </style>
                    <script>
function getInstrumentId() {
    // 优先尝试从第一个路径获取 instrument_id
    try {
        const instrumentIdFromForecast = top.__NEXT_DATA__.props.pageProps.state.forecastStore.forecast.instrument_id;
        if (instrumentIdFromForecast) {
            return instrumentIdFromForecast;
        }
    } catch (e) {
        console.error('从 forecastStore 获取 instrument_id 失败:', e);
        // 不返回，继续尝试第二个路径
    }

    // 如果第一个路径没有找到或者出错，尝试从第二个路径获取
    try {
        const instrumentIdFromRouter = window.next.router.components['/equities/[...equity]'].props.pageProps.state.pageInfoStore.identifiers.instrument_id;
        if (instrumentIdFromRouter) {
            return instrumentIdFromRouter;
        }
    } catch (e) {
        console.error('从 router components 获取 instrument_id 失败:', e);
    }

    // 如果两个路径都无法获取，则返回 null
    return null;
}

                        function getWeekNumber(date) {
                            const onejan = new Date(date.getFullYear(), 0, 1);
                            const dayOffset = (date.getDay() + 6) % 7; // ISO day of the week
                            const startDayOffset = (onejan.getDay() + 6) % 7;
                            return Math.floor(((date - onejan) / (24 * 60 * 60 * 1000) + startDayOffset) / 7) + 1;
                        }

                        document.addEventListener('DOMContentLoaded', function() {
                            const iframeWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                            const chartContainer = document.getElementById('chartContainer');
                            if (chartContainer) {
                                chartContainer.style.width = (iframeWidth < 1400 ? 1400 : iframeWidth) + 'px';
                            }

                            function fetchData() {
                                const instrumentId = getInstrumentId();
                                if (!instrumentId) {
                                    alert('无法获取 instrument_id');
                                    return;
                                }

                                // 强制获取160周的数据
                                const url = \`https://api.investing.com/api/financialdata/\${instrumentId}/historical/chart/?interval=P1W&pointscount=160\`;

                                fetch(url, {
                                    method: 'GET',
                                    headers: {
                                        'accept': '*/*',
                                        'accept-encoding': 'gzip, deflate, br, zstd',
                                        'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6,ru;q=0.5',
                                        'cache-control': 'no-cache',
                                        'content-type': 'application/json',
                                        'domain-id': 'cn',
                                        'origin': 'https://cn.investing.com',
                                        'pragma': 'no-cache',
                                        'priority': 'u=1, i',
                                        'referer': 'https://cn.investing.com/',
                                        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                                        'sec-ch-ua-mobile': '?0',
                                        'sec-ch-ua-platform': '"Windows"',
                                        'sec-fetch-dest': 'empty',
                                        'sec-fetch-mode': 'cors',
                                        'sec-fetch-site': 'same-site',
                                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                                    }
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log('Success:', data);
                                    const klines = data.data.map(entry => ({
                                        date: entry[0], // 时间戳（毫秒）
                                        close: new BigNumber(entry[4]) // 收盘价
                                    }));
                                    window.allKlines = klines; // 存储所有获取到的数据
                                    calculateAndDraw();
                                })
                                .catch(error => {
                                    console.error('Fetch error:', error);
                                    alert('获取数据失败: ' + error.message);
                                });
                            }

                            document.getElementById("fetchDataBtn").addEventListener("click", fetchData);
                            document.getElementById("calculateBtn").addEventListener("click", calculateAndDraw); // 为新按钮添加事件监听

                            function calculateAndDraw() {
                                const BigNumber = window.BigNumber;
                                const investmentAmount = new BigNumber(document.getElementById("investmentAmount").value);
                                const startWeekOffset = parseInt(document.getElementById("startWeekOffset").value);
                                const durationWeeks = parseInt(document.getElementById("durationWeeks").value);

                                if (isNaN(investmentAmount) || investmentAmount.lte(0)) {
                                    alert("请输入有效的定投金额。");
                                    return;
                                }
                                if (isNaN(startWeekOffset) || startWeekOffset < 0 || startWeekOffset > 159) {
                                    alert("请输入有效的定投开始周数 (0-159)。");
                                    return;
                                }
                                if (isNaN(durationWeeks) || durationWeeks <= 0 || (startWeekOffset + durationWeeks) > 160) {
                                    alert("请输入有效的定投持续周数，且开始周数加持续周数不能超过160周。");
                                    return;
                                }

                                if (!window.allKlines || window.allKlines.length === 0) {
                                    alert("请先点击 '获取数据' 按钮。");
                                    return;
                                }

                                let klines = Array.from(window.allKlines);
                                klines.sort((a, b) => a.date - b.date); // 按时间戳排序

                                // 截取指定范围的数据
                                const startIndex = klines.length - 1 - startWeekOffset - (durationWeeks - 1);
                                const endIndex = klines.length - 1 - startWeekOffset;

                                if (startIndex < 0 || endIndex >= klines.length || startIndex > endIndex) {
                                    alert("设定的定投开始周数和持续周数超出了可获取的历史数据范围。请调整。");
                                    return;
                                }

                                const filteredKlines = klines.slice(startIndex, endIndex + 1);

                                let tableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
                                tableBody.innerHTML = "";

                                let weekData = {};
                                filteredKlines.forEach(entry => {
                                    let date = new Date(entry.date);
                                    let year = date.getFullYear();
                                    let weekNumber = getWeekNumber(date);
                                    let closePrice = entry.close;

                                    const key = \`\${year}-\${weekNumber}\`;
                                    if (!weekData[key]) {
                                        weekData[key] = { year, week: weekNumber, prices: [] };
                                    }
                                    weekData[key].prices.push(closePrice);
                                });

                                let accumulatedShares = new BigNumber(0);
                                let totalPrincipal = new BigNumber(0);
                                let chartData = [];
                                Object.entries(weekData).forEach(([key, data], index) => {
                                    let sum = data.prices.reduce((acc, val) => acc.plus(val), new BigNumber(0));
                                    let average = sum.dividedBy(data.prices.length);

                                    let sharesPurchased = investmentAmount.dividedBy(average);
                                    accumulatedShares = accumulatedShares.plus(sharesPurchased);
                                    totalPrincipal = totalPrincipal.plus(investmentAmount);

                                    let npv = accumulatedShares.times(average);
                                    let returnRate = totalPrincipal.isZero() ? new BigNumber(0) : npv.minus(totalPrincipal).dividedBy(totalPrincipal).times(100);

                                    let row = document.createElement("tr");
                                    let serialCell = document.createElement("td");
                                    let yearCell = document.createElement("td");
                                    let weekCell = document.createElement("td");
                                    let averageCell = document.createElement("td");
                                    let sharesCell = document.createElement("td");
                                    let totalSharesCell = document.createElement("td");
                                    let npvCell = document.createElement("td");
                                    let principalCell = document.createElement("td");
                                    let returnRateCell = document.createElement("td");

                                    serialCell.textContent = index + 1;
                                    yearCell.textContent = data.year;
                                    weekCell.textContent = \`第\${data.week}周\`;
                                    averageCell.textContent = average.toFixed(8);
                                    sharesCell.textContent = sharesPurchased.toFixed(8);
                                    totalSharesCell.textContent = accumulatedShares.toFixed(8);
                                    npvCell.textContent = npv.toFixed(8);
                                    principalCell.textContent = totalPrincipal.toFixed(8);
                                    returnRateCell.textContent = returnRate.toFixed(2) + '%';

                                    row.appendChild(serialCell);
                                    row.appendChild(yearCell);
                                    row.appendChild(weekCell);
                                    row.appendChild(averageCell);
                                    row.appendChild(sharesCell);
                                    row.appendChild(totalSharesCell);
                                    row.appendChild(npvCell);
                                    row.appendChild(principalCell);
                                    row.appendChild(returnRateCell);

                                    tableBody.appendChild(row);

                                    chartData.push({
                                        week: \`\${data.year}年第\${data.week}周\`,
                                        average: average.toNumber(),
                                        sharesPurchased: sharesPurchased.toNumber(),
                                        accumulatedShares: accumulatedShares.toNumber(),
                                        npv: npv.toNumber(),
                                        principal: totalPrincipal.toNumber(),
                                        returnRate: returnRate.toNumber()
                                    });
                                });

                                function calculateMovingAverageCost(data, weeks) {
                                    if (data.length < weeks) {
                                        return Array(data.length).fill(null);
                                    }
                                    return data.map((_, index, array) => {
                                        if (index < weeks - 1) { // 修正：前几周不计算
                                            return null;
                                        }
                                        const slice = array.slice(index - weeks + 1, index + 1);
                                        const totalShares = slice.reduce((sum, item) => {
                                            return sum.plus(new BigNumber(item.sharesPurchased));
                                        }, new BigNumber(0));
                                        if (totalShares.isZero()) {
                                            return null;
                                        }
                                        const totalCost = new BigNumber(weeks).times(investmentAmount);
                                        return totalCost.dividedBy(totalShares).toNumber();
                                    });
                                }

                                const ma28 = calculateMovingAverageCost(chartData, 28);
                                const ma48 = calculateMovingAverageCost(chartData, 48);
                                const ma72 = calculateMovingAverageCost(chartData, 72);

                                drawChart(chartData, ma28, ma48, ma72);

                                document.getElementById("exportBtn").onclick = function() {
                                    exportToExcel(chartData);
                                };
                            }

                            function drawChart(chartData, ma28, ma48, ma72) {
                                let chartDom = document.getElementById('chartContainer');
                                let myChart = echarts.init(chartDom);

                                let option = {
                                    title: {
                                        text: '每周价格与投资'
                                    },
                                    tooltip: {
                                        trigger: 'axis'
                                    },
                                    legend: {
                                        data: ['均价', '净现值', '总本金', '回报率', '28周平均成本', '48周平均成本', '72周平均成本'],
                                        selected: {
                                            '均价': true,
                                            '净现值': true,
                                            '总本金': true,
                                            '回报率': true,
                                            '28周平均成本': false,
                                            '48周平均成本': false,
                                            '72周平均成本': false
                                        }
                                    },
                                    xAxis: {
                                        type: 'category',
                                        data: chartData.map(data => data.week)
                                    },
                                    yAxis: [
                                        {
                                            type: 'value',
                                            name: '价格',
                                            position: 'left'
                                        },
                                        {
                                            type: 'value',
                                            name: '金额',
                                            position: 'right'
                                        },
                                        {
                                            type: 'value',
                                            name: '回报率',
                                            position: 'right',
                                            offset: 80
                                        }
                                    ],
                                    series: [
                                        {
                                            name: '均价',
                                            data: chartData.map(data => data.average),
                                            type: 'line',
                                            yAxisIndex: 0,
                                            itemStyle: {color: 'blue'}
                                        },
                                        {
                                            name: '净现值',
                                            data: chartData.map(data => data.npv),
                                            type: 'line',
                                            yAxisIndex: 1,
                                            itemStyle: {color: 'green'}
                                        },
                                        {
                                            name: '总本金',
                                            data: chartData.map(data => data.principal),
                                            type: 'line',
                                            yAxisIndex: 1,
                                            itemStyle: {color: 'red'}
                                        },
                                        {
                                            name: '回报率',
                                            data: chartData.map(data => data.returnRate),
                                            type: 'line',
                                            yAxisIndex: 2,
                                            itemStyle: {color: 'purple'}
                                        },
                                        {
                                            name: '28周平均成本',
                                            data: ma28,
                                            type: 'line',
                                            yAxisIndex: 0,
                                            itemStyle: {color: '#FF8C00'},
                                            lineStyle: {type: 'dashed'} //虚线
                                        },
                                        {
                                            name: '48周平均成本',
                                            data: ma48,
                                            type: 'line',
                                            yAxisIndex: 0,
                                            itemStyle: {color: '#9370DB'},
                                            lineStyle: {type: 'dashed'} //虚线
                                        },
                                        {
                                            name: '72周平均成本',
                                            data: ma72,
                                            type: 'line',
                                            yAxisIndex: 0,
                                            itemStyle: {color: '#20B2AA'},
                                            lineStyle: {type: 'dashed'} //虚线
                                        }
                                    ]
                                };

                                myChart.setOption(option);
                            }

                            function exportToExcel(chartData) {
                                let workbook = XLSX.utils.book_new();
                                let weeklySheetData = [['投资周数', '年份', '周数', '均价', '投资股份', '累计股份', '净现值', '总本金', '投资回报率']];
                                chartData.forEach((item, index) => weeklySheetData.push([index + 1, item.week.split('年')[0], item.week.split('第')[1].replace('周', ''), item.average.toFixed(8), item.sharesPurchased.toFixed(8), item.accumulatedShares.toFixed(8), item.npv.toFixed(8), item.principal.toFixed(8), item.returnRate.toFixed(2) + '%']));
                                let weeklySheet = XLSX.utils.aoa_to_sheet(weeklySheetData);
                                XLSX.utils.book_append_sheet(workbook, weeklySheet, '每周投资数据');
                                XLSX.writeFile(workbook, '价格与投资数据.xlsx');
                            }
                        });
                    </script>
                </head>
                <body>
                    <h1>价格均值与投资计算</h1>

                    <div class="input-group">
                        <label for="investmentAmount">定投金额:</label>
                        <input type="number" id="investmentAmount" value="100">
                    </div>
                    <div class="input-group">
                        <label for="startWeekOffset">倒推开始周数 (0-159):</label>
                        <input type="number" id="startWeekOffset" value="0" min="0" max="159">
                    </div>
                    <div class="input-group">
                        <label for="durationWeeks">定投持续周数 (1-160):</label>
                        <input type="number" id="durationWeeks" value="10" min="1" max="160">
                    </div>

                    <button id="fetchDataBtn">获取数据 (强制160周)</button>
                    <button id="calculateBtn">计算并绘图</button>
                    <button id="exportBtn">导出 Excel</button>

                    <h2>结果</h2>
                    <table id="resultTable" border="1" style="display: inline-block;">
                        <thead>
                            <tr>
                                <th>投资周数</th>
                                <th>年份</th>
                                <th>周数</th>
                                <th>均价 (美元)</th>
                                <th>投资股份</th>
                                <th>累计股份</th>
                                <th>净现值 (美元)</th>
                                <th>总本金 (美元)</th>
                                <th>投资回报率 (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <div id="chartContainer" style="display: inline-block;"></div>
                </body>
                </html>
            `;
            overlay.style.display = 'block';
        });

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    }

    // 监听 DOMContentLoaded 或延迟执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initScript();
    } else {
        document.addEventListener('DOMContentLoaded', initScript);
    }
})();