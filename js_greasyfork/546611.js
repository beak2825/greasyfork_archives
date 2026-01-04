// ==UserScript==
// @name         ECharts 时间重映射按钮（带日期时间选择器）
// @namespace    http://tampermonkey.net/
// @version      2025-07-30
// @description  在图表页面注入按钮和时间选择器以修改横坐标时间范围
// @author       tqyao
// @match        http://weixin.lwbsq.com/historydata
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lwbsq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546611/ECharts%20%E6%97%B6%E9%97%B4%E9%87%8D%E6%98%A0%E5%B0%84%E6%8C%89%E9%92%AE%EF%BC%88%E5%B8%A6%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E9%80%89%E6%8B%A9%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546611/ECharts%20%E6%97%B6%E9%97%B4%E9%87%8D%E6%98%A0%E5%B0%84%E6%8C%89%E9%92%AE%EF%BC%88%E5%B8%A6%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E9%80%89%E6%8B%A9%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForChartAndInject() {
        const container = document.getElementById('curve_data');
        const echartsReady = typeof echarts !== 'undefined';

        if (container && echartsReady && echarts.getInstanceByDom(container)) {
            injectControls();
        } else {
            setTimeout(waitForChartAndInject, 500);
        }
    }

    function injectControls() {
        // 创建悬浮容器
        const box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.bottom = '100px';
        box.style.right = '20px';
        box.style.zIndex = '9999';
        box.style.background = 'white';
        box.style.border = '1px solid #ccc';
        box.style.padding = '10px';
        box.style.borderRadius = '10px';
        box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        box.style.fontSize = '14px';

        // 创建起始时间选择器
        const startInput = document.createElement('input');
        startInput.type = 'datetime-local';
        startInput.style.marginBottom = '6px';
        startInput.style.display = 'block';
        startInput.id = 'tmk-start-time';

        // 创建结束时间选择器
        const endInput = document.createElement('input');
        endInput.type = 'datetime-local';
        endInput.style.marginBottom = '6px';
        endInput.style.display = 'block';
        endInput.id = 'tmk-end-time';

        // 设置默认值（当前日期 ±1天）
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const toInputFormat = d =>
            `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

        startInput.value = toInputFormat(new Date(now.getTime() - 86400000));
        endInput.value = toInputFormat(now);

        // 创建按钮
        const btn = document.createElement('button');
        btn.textContent = '应用时间范围';
        btn.style.padding = '6px 12px';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';

        btn.onclick = function () {
            const newStart = startInput.value.replace('T', ' ') + ':00';
            const newEnd = endInput.value.replace('T', ' ') + ':00';
            if (newStart && newEnd) {
                updateXAxisTimeRange(newStart, newEnd);
            }
        };

        box.appendChild(startInput);
        box.appendChild(endInput);
        box.appendChild(btn);
        document.body.appendChild(box);

        console.log('✅ 时间控制器已注入');
    }

    function updateXAxisTimeRange(newStart, newEnd) {
        var container = document.getElementById('curve_data');
        if (!container) {
            console.error('找不到容器 #curve_data');
            return;
        }

        var myChart = echarts.getInstanceByDom(container);
        if (!myChart) {
            console.error('未获取到 ECharts 实例');
            return;
        }

        var option = myChart.getOption();

        var allTimestamps = [];
        option.series.forEach(function (s) {
            s.data.forEach(function (point) {
                allTimestamps.push(point[0]);
            });
        });

        var oldMin = Math.min(...allTimestamps);
        var oldMax = Math.max(...allTimestamps);
        var newMin = new Date(newStart).getTime();
        var newMax = new Date(newEnd).getTime();

        if (isNaN(newMin) || isNaN(newMax) || newMin >= newMax) {
            alert('起止时间不合法，请检查格式或顺序！');
            return;
        }

        function mapTime(oldTs) {
            var ratio = (oldTs - oldMin) / (oldMax - oldMin);
            return newMin + ratio * (newMax - newMin);
        }

        option.series.forEach(function (s) {
            s.data = s.data.map(function (point) {
                if (Array.isArray(point) && typeof point[0] === 'number') {
                    point[0] = mapTime(point[0]);
                }
                return point;
            });
        });

        function formatDate(ts) {
            var d = new Date(ts);
            var yyyy = d.getFullYear();
            var MM = String(d.getMonth() + 1).padStart(2, '0');
            var dd = String(d.getDate()).padStart(2, '0');
            var hh = String(d.getHours()).padStart(2, '0');
            var mm = String(d.getMinutes()).padStart(2, '0');
            //var ss = String(d.getSeconds()).padStart(2, '0');
            //return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
            return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
        }

        var newMinStr = formatDate(newMin);
        var newMaxStr = formatDate(newMax);

        if (option.title && option.title[0] && option.title[0].subtext) {
            option.title[0].subtext = option.title[0].subtext.replace(
                /时间范围:[^\n]+/,
                `时间范围:${newMinStr} 到 ${newMaxStr}`
            );
        }

        myChart.setOption(option, true);

        console.log(`✅ 图表横坐标时间已重映射至：[${newMinStr}] - [${newMaxStr}]`);
        alert('图表时间范围修改成功！');
    }

    waitForChartAndInject();
})();
