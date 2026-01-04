// ==UserScript==
// @name         考勤数据增强插件
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  统计迟到次数及加班次数
// @author       luc
// @match        http://it.maxvisioncloud.com:52800/maxhome/KQ/UserKq
// @icon         http://maxvision.eicp.net:52800/maxhome/ui/images/kaoqin.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516227/%E8%80%83%E5%8B%A4%E6%95%B0%E6%8D%AE%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/516227/%E8%80%83%E5%8B%A4%E6%95%B0%E6%8D%AE%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (options && options.method === 'POST' && url.includes('getdataByuser')) {
            return originalFetch(url, options).then(response => {
                response.clone().json().then(data => {
                    processData(data);
                });
                return response;
            });
        }
        return originalFetch(url, options);
    };

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function(method, url) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, arguments);
        };

        xhr.send = function(data) {
            if (this._method === 'POST' && this._url.includes('getdataByuser')) {
                xhr.addEventListener('load', function() {
                    const responseData = JSON.parse(xhr.responseText);
                    processData(responseData);
                });
            }
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    function processData(data) {
        let countFirstTimeAfter0830 = 0;
        let countAfter1930 = 0;
        let countAfter2030 = 0;
        let totalLateMinutes = 0;
        let lateCount = 0;

        const kqData = data.KQ;

        kqData.forEach(item => {
            const firstTime = item.firstTime;
            const lastTime = item.lastTime;

            if (firstTime) {
                const [firstHour, firstMinute] = firstTime.split(':').map(Number);
                if (firstHour > 8 || (firstHour === 8 && firstMinute > 30)) {
                    countFirstTimeAfter0830++;
                }
            }

            if (lastTime) {
                const [lastHour, lastMinute] = lastTime.split(':').map(Number);
                if (lastHour > 19 || (lastHour === 19 && lastMinute > 30)) {
                    countAfter1930++;
                }

                if (lastHour > 20 || (lastHour === 20 && lastMinute > 30)) {
                    countAfter2030++;
                    // 如果lastTime大于20:30，则不再计入19:30之后的统计
                    countAfter1930--;
                }
            }
        });

        setTimeout(() => {
            const lateElements = document.querySelectorAll('.layui-table-cell');

            lateElements.forEach(element => {
                const lateText = element.textContent.trim();
                if (lateText.includes('迟到')) {
                    lateCount++;
                    const minutesMatch = lateText.match(/迟到(\d+)分钟/);
                    if (minutesMatch) {
                        const minutes = parseInt(minutesMatch[1], 10);
                        totalLateMinutes += minutes;
                    }
                }
            });

            displayStats(countFirstTimeAfter0830, countAfter1930, countAfter2030, lateCount, totalLateMinutes);
        }, 1000);
    }

    function displayStats(firstTimeCount, after1930Count, after2030Count, lateCount, totalLateMinutes) {
        const layuiRowElement = document.querySelector('.layui-row');

        const existingStats = document.querySelector('.attendance-stats');
        if (existingStats) {
            existingStats.remove();
        }

        const statsHTML = `
            <div class="attendance-stats">
                <span style="margin-left: 50px; margin-right: 15px;">迟到：<strong style="font-weight: bold; color: red;">${lateCount}</strong> 次 (<strong style="font-weight: bold; color: red;">${totalLateMinutes}</strong> 分钟)</span>
                <span style="margin-left: 15px; margin-right: 15px;">加班至19:30以后：<strong style="font-weight: bold; color: red;">${after1930Count}</strong> 次</span>
                <span style="margin-left: 15px; margin-right: 15px;">加班至20:30以后：<strong style="font-weight: bold; color: red;">${after2030Count}</strong> 次</span>
            </div>
        `;

        if (layuiRowElement) {
            layuiRowElement.insertAdjacentHTML('beforebegin', statsHTML);
        } else {
            console.log('未找到 class="layui-row" 元素');
        }
    }

})();
