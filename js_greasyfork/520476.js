// ==UserScript==
// @name         东方财富计算股票周均值
// @namespace    http://tampermonkey.net/
// @version      2024-12-12v4
// @description  东方财富计算股票周均值，收盘价和周均值数据excel导出
// @author       meteor
// @match        https://quote.eastmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eastmoney.com
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520476/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E8%AE%A1%E7%AE%97%E8%82%A1%E7%A5%A8%E5%91%A8%E5%9D%87%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/520476/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E8%AE%A1%E7%AE%97%E8%82%A1%E7%A5%A8%E5%91%A8%E5%9D%87%E5%80%BC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Add styles for the floating button and iframe
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
            width: 80%;
            height: 80%;
            border: none;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = styleContent;
    document.head.appendChild(styleElement);

    // Create the floating button
    const calculateButton = document.createElement('div');
    calculateButton.id = 'calculateButton';
    calculateButton.textContent = '计算';
    document.body.appendChild(calculateButton);

    // Create the overlay and iframe elements
    const overlay = document.createElement('div');
    overlay.id = 'calculatorIframeOverlay';
    const iframe = document.createElement('iframe');
    iframe.id = 'calculatorIframe';
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);

    // Add listener for button to toggle iframe visibility
    calculateButton.addEventListener('click', function() {
        // Handle iframe loading of your HTML content
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html style=" background: aliceblue; ">
            <head>
                <meta charset="UTF-8">
                <title>价格均值计算</title>
                <script src="https://registry.npmmirror.com/echarts/5.5.1/files/dist/echarts.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
                <style>
                    #chartContainer {
                        width: 1000px;
                        height:1000px;
                    }
                </style>
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const secid =  window.top.quotecode??window.top.quotedata.quotecode;

                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
                        const currentDay = ('0' + currentDate.getDate()).slice(-2);
                        const formattedCurrentDate = \`\${currentYear}\${currentMonth}\${currentDay}\`;

                        const url = \`https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=\${secid}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=101&fqt=1&beg=0&end=\${formattedCurrentDate}&smplmt=2924&lmt=1000000&_=1733926144977\`;
console.log(url)
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
 console.log(data)
                                const klines = data.data.klines;
                                window.klines = klines;
                                populateYearSelect(klines);
                                document.getElementById("yearSelect").addEventListener("change", calculateAverage);
                            })
                           // .catch(error => {
                           //     alert("数据获取失败: " + error);
                           // });

                        function populateYearSelect(klines) {
                            let yearSet = new Set();
                            klines.forEach(entry => {
                                let parts = entry.split(",");
                                let date = new Date(parts[0]);
                                yearSet.add(date.getFullYear());
                            });

                            let yearSelect = document.getElementById("yearSelect");
                            yearSelect.innerHTML = ''; // 清空之前的选项
                               let option = document.createElement("option");
                                option.value = "未选择";
                                option.textContent = "未选择";
                                yearSelect.appendChild(option);

                            yearSet.forEach(year => {
                                let option = document.createElement("option");
                                option.value = year;
                                option.textContent = year;
                                yearSelect.appendChild(option);
                            });
                        }

                        function calculateAverage() {
                            let tableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
                            tableBody.innerHTML = ""; // Clear the table

                            let klines = Array.from(window.klines);
                            let selectedYear = parseInt(document.getElementById("yearSelect").value);

                            let weekData = {};
                            let dailyData = []; // To collect daily data
                            klines.forEach(entry => {
                                let parts = entry.split(",");
                                let date = new Date(parts[0]);
                                let year = date.getFullYear();
                                let closePrice = parseFloat(parts[2]);

                                dailyData.push({ date: parts[0], close: closePrice });

                                let weekNumber = getWeekNumber(date);
                                let yearWeekKey = \`\${year}-\${weekNumber}\`;

                                if (!weekData[yearWeekKey]) {
                                    weekData[yearWeekKey] = { year: year, week: weekNumber, prices: [] };
                                }
                                weekData[yearWeekKey].prices.push(closePrice);
                            });

                            let chartData = [];
                            Object.keys(weekData).forEach(yearWeekKey => {
                                let data = weekData[yearWeekKey];
                                let sum = data.prices.reduce((acc, val) => acc + val, 0);
                                let average = sum / data.prices.length;

                                // Populate table only for the selected year
                                if (data.year === selectedYear) {
                                    let row = document.createElement("tr");
                                    let weekCell = document.createElement("td");
                                    let averageCell = document.createElement("td");

                                    weekCell.textContent = \`第\${data.week}周\`;
                                    averageCell.textContent = average.toFixed(3);

                                    row.appendChild(weekCell);
                                    row.appendChild(averageCell);

                                    tableBody.appendChild(row);
                                }

                                chartData.push({
                                    year: data.year,
                                    week: data.week,
                                    average: average
                                });
                            });

                            drawChart(chartData.filter(data => data.year === selectedYear));

                            document.getElementById("exportBtn").onclick = function() {
                                exportToExcel(dailyData, chartData);
                            };
                        }

                        function getWeekNumber(date) {
                            let startOfYear = new Date(date.getFullYear(), 0, 1);
                            let days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
                            return Math.ceil((days + startOfYear.getDay() + 1) / 7);
                        }

                        function drawChart(chartData) {
                            let chartDom = document.getElementById('chartContainer');
                            let myChart = echarts.init(chartDom);

                            let option = {
                                title: {
                                    text: '每周价格均值'
                                },
                                tooltip: {},
                                xAxis: {
                                    type: 'category',
                                    data: chartData.map(data => \`第\${data.week}周\`)
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [{
                                    data: chartData.map(data => data.average),
                                    type: 'line'
                                }]
                            };

                            myChart.setOption(option);
                        }

                        function exportToExcel(dailyData, chartData) {
                            let workbook = XLSX.utils.book_new();

                            // Create the first sheet with daily data
                            let dailySheetData = [['日期', '收盘价']];
                            dailyData.forEach(item => dailySheetData.push([item.date, item.close]));
                            let dailySheet = XLSX.utils.aoa_to_sheet(dailySheetData);
                            XLSX.utils.book_append_sheet(workbook, dailySheet, '每日价格');

                            // Create the second sheet with weekly average data
                            let weeklySheetData = [['年份', '周数', '均价']];
                            chartData.forEach(item => weeklySheetData.push([item.year, item.week, item.average.toFixed(3)]));
                            let weeklySheet = XLSX.utils.aoa_to_sheet(weeklySheetData);
                            XLSX.utils.book_append_sheet(workbook, weeklySheet, '每周均值');

                            // Export Excel file
                            XLSX.writeFile(workbook, '价格数据.xlsx');
                        }

                    });
                </script>
            </head>
            <body>
                <h1>价格均值计算</h1>
        <label for="yearSelect">选择年份:</label>
    <select id="yearSelect"></select><br>
                <button id="exportBtn">导出 Excel</button>

                <h2>结果</h2>
                <table id="resultTable" border="1" style=" display: inline-block; ">
                    <thead>
                        <tr>
                            <th>周数</th>
                            <th>均值</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>

                <div id="chartContainer" style=" display: inline-block; "></div>
            </body>
            </html>
        `;
        overlay.style.display = 'block';
    });

    // Add listener to close the iframe overlay on click outside
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });

})();