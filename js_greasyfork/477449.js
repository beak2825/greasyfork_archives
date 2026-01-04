// ==UserScript==
// @name         通达信转东财分笔
// @namespace    http://your-namespace.com
// @version      1.01
// @description  通达信链接扩展
// @author       Beebon
// @match        https://quote.eastmoney.com/f1.html*
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/477449/%E9%80%9A%E8%BE%BE%E4%BF%A1%E8%BD%AC%E4%B8%9C%E8%B4%A2%E5%88%86%E7%AC%94.user.js
// @updateURL https://update.greasyfork.org/scripts/477449/%E9%80%9A%E8%BE%BE%E4%BF%A1%E8%BD%AC%E4%B8%9C%E8%B4%A2%E5%88%86%E7%AC%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    function createFloatingButton() {
        var button = document.createElement('button');
        button.id = 'chartDataButton';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '999999999';
        button.textContent = '获取图表';
        document.body.appendChild(button);
    }

    // 弹出 iframe 并显示图表
    function showChartInIframe(data) {
        var iframe = document.createElement('iframe');
        iframe.id = 'chart_frame';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        iframe.style.zIndex = '99999';
        iframe.srcdoc = '<html><body><script src="https://cdn.jsdelivr.net/npm/echarts@5.2.0/dist/echarts.min.js"></script><div id="chart" style="height: 600px;"></div></body></html>';
        document.body.appendChild(iframe);

        // 在 iframe 中显示图表
        var chartWindow = iframe.contentWindow;
        chartWindow.addEventListener('DOMContentLoaded', function() {
            var chartDiv = chartWindow.document.getElementById('chart');

            // 创建图表实例并显示数据
            var chart = chartWindow.echarts.init(chartDiv);

            // 准备 x 轴数据
            var xAxisData = data.map(function(item) {
                return item.time;
            });

            // 准备价格数据
            var priceData = data.map(function(item) {
                return item.price; // 对价格进行缩放处理
            });

            // 准备成交量数据
            var volumeData = data.map(function(item) {
                return {
                    value: item.volume,
                    itemStyle: {
                        color: item.status === 'price_down2' ? '#00ff00' : '#ff0000'
                    }
                };
            });

            // 配置图表选项
            var option = {
                grid: [
                    {
                        left: '10%',
                        right: '10%',
                        top: '10%',
                        height: '40%'
                    },
                    {
                        left: '10%',
                        right: '10%',
                        bottom: '10%',
                        height: '40%'
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisData,
                        gridIndex: 0
                    },
                    {
                        type: 'category',
                        data: xAxisData,
                        gridIndex: 1
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '价格',
                        scale: true,
                        gridIndex: 0
                    },
                    {
                        type: 'value',
                        name: '成交量',
                        gridIndex: 1
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        var dataIndex = params[0].dataIndex;
                        var price = priceData[dataIndex]; // 恢复原始价格
                        var vol = volumeData[dataIndex].value;
                        return '时间：' + params[0].name + '<br>价格：' + price + '<br>成交量：' + vol;
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                series: [
                    {
                        type: 'line',
                        data: priceData,
                        itemStyle: {
                            color: '#ff0000'
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        xAxisIndex: 0,
                        yAxisIndex: 0
                    },
                    {
                        type: 'bar',
                        data: volumeData,
                        itemStyle: {
                            color: function(params) {
                                return params.data.itemStyle.color;
                            }
                        },
                        xAxisIndex: 1,
                        yAxisIndex: 1
                    }
                ]
            };
            chart.setOption(option);

            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            // 创建关闭按钮
            var closeButton = iframeDocument.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.className = 'close-button';
            closeButton.style.position = 'fixed';
            closeButton.style.top = '10px';
            closeButton.style.left = '10px';
            closeButton.style.zIndex = '999999';

            // 监听关闭按钮的点击事件，关闭 iframe
            closeButton.addEventListener('click', function() {
                document.body.removeChild(iframe);
            });

            iframeDocument.body.appendChild(closeButton);

        });

        // 监听按键事件，按下 "Esc" 键关闭 iframe
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && iframe) {
                $('#chart_frame').remove()
            }
        });

    }

    // 获取图表数据
    function getChartData() {
        // 获取包含表格的 DIV 元素
        var divElement = $('.f1content'); // 替换为你的 DIV 元素的 ID

        // 获取 DIV 中的所有表格
        var tables = divElement.find('table');

        // 定义存储表格数据的数组
        var tableData = [];

        // 遍历每个表格
        tables.each(function() {
            var table = $(this);

            // 获取表格的所有行
            var rows = table.find('tr');

            // 如果表格没有记录，则跳过
            if (rows.length <= 1) {
                return;
            }

            // 遍历表格的每一行（跳过表头）
            rows.slice(1).each(function() {
                var row = $(this);
                var rowData = {};

                // 获取行中的每个单元格数据
                var cells = row.find('td');
                rowData.time = cells.eq(0).text().trim();
                rowData.price = parseFloat(cells.eq(1).find('span').eq(0).text().trim());
                rowData.status = cells.eq(2).find('span').eq(0).attr('class');
                rowData.volume = parseFloat(cells.eq(2).find('span').eq(0).text().trim());

                if (rowData.time === '') {
                    return true; // 跳过当前循环迭代
                }

                // 将行数据添加到数组中
                tableData.push(rowData);
            });
        });

        // 弹出 iframe 并显示图表
        showChartInIframe($('.sort input').eq(0).prop('checked') ? tableData.reverse() : tableData);
    }

    // 添加悬浮按钮，并绑定点击事件
    createFloatingButton();
    document.getElementById('chartDataButton').addEventListener('click', getChartData);

    // 替换URL
    var urlParams = new URLSearchParams(window.location.search);
    var newcode = urlParams.get('newcode');
    var name = urlParams.get('name');

    if (newcode && name) {
        var newcodeParts = newcode.split('.');
        var prefix = newcodeParts[0];
        var suffix = newcodeParts[1];

        if (prefix === '30') {
            prefix = '113';
        } else if (prefix === '29') {
            prefix = '114';
        } else if (prefix === '28') {
            prefix = '115';
        } else if (prefix === '66') {
            prefix = '225';
        }

        var nameNumber = name.match(/\d+/);
        if (nameNumber) {
            if(prefix==='115')
                suffix += nameNumber[0].substr(1);
            else
                suffix += nameNumber[0];
        }

        if(prefix === '113' || prefix === '114' || prefix === '115' || prefix === '225'){
            var newUrl = `https://quote.eastmoney.com/f1.html?newcode=${prefix}.${suffix}`
            window.location = newUrl;
        }
    }

})();