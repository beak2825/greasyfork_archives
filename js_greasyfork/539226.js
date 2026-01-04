// ==UserScript==
// @name         气象工具集成包（完整版）
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  完整整合三个独立脚本功能（最终版）
// @icon         https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @author       brady
// @license MIT
// @match        http://10.194.22.247:81/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/539226/%E6%B0%94%E8%B1%A1%E5%B7%A5%E5%85%B7%E9%9B%86%E6%88%90%E5%8C%85%EF%BC%88%E5%AE%8C%E6%95%B4%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539226/%E6%B0%94%E8%B1%A1%E5%B7%A5%E5%85%B7%E9%9B%86%E6%88%90%E5%8C%85%EF%BC%88%E5%AE%8C%E6%95%B4%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 依赖检查 ===
    if (typeof jQuery === 'undefined') {
        console.error('❌ 致命错误：jQuery 加载失败，请检查网络连接！');
        return;
    }
    if (typeof XLSX === 'undefined') {
        console.error('❌ 致命错误：SheetJS 加载失败，请检查网络连接！');
        return;
    }

    // === 脚本1：导出降雨到Excel（完整保留）===
    (function() {
        const currentUrl = window.location.href;
        const allowedUrl = 'http://10.194.22.247:81/';

        if (currentUrl.startsWith(allowedUrl)) {
            // 雨强判断逻辑
            function getRainfallIntensity(precipitation) {
                const value = parseFloat(precipitation);
                if (value >= 100) return "特大暴雨";
                if (value >= 50) return "大暴雨";
                if (value >= 25) return "暴雨";
                if (value >= 15) return "大雨";
                if (value >= 5) return "中雨";
                if (value >= 0.1) return "小雨";
                return "无降水";
            }

            // 数据提取
            function extractData() {
                const table = document.querySelector('table[border="1"]');
                if (!table) {
                    console.error("未找到目标表格");
                    return [];
                }

                const data = [];
                table.querySelectorAll('tr').forEach(row => {
                    const cols = row.querySelectorAll('td');
                    cols.forEach(col => {
                        const buttons = col.querySelectorAll('input[type="button"]');
                        buttons.forEach(button => {
                            const stationName = button.value;
                            const precipitationCell = col.nextElementSibling;
                            const precipitation = precipitationCell?.textContent?.trim() || '';

                            if (stationName && precipitation && parseFloat(precipitation) > 0) {
                                data.push({
                                    stationName,
                                    precipitation,
                                    intensity: getRainfallIntensity(precipitation)
                                });
                            }
                        });
                    });
                });
                return data;
            }

            // 时间格式化
            function formatDate(dateString) {
                const date = new Date(dateString);
                return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日${String(date.getHours()).padStart(2, '0')}时${String(date.getMinutes()).padStart(2, '0')}分`;
            }

            // 生成时间范围标题
            function getTimeRange() {
                const startDate = document.getElementById('star_date').value;
                const endDate = document.getElementById('end_date').value;
                const hours = Math.floor((new Date(endDate) - new Date(startDate)) / 36e5);
                return `理县过去${hours}小时降水量（${formatDate(startDate)}～${formatDate(endDate)}）`;
            }

            // 智能导出核心逻辑
            function exportToExcel(data) {
                const wb = XLSX.utils.book_new();
                const wsData = [];
                const totalItems = data.length;
                const useDualColumns = totalItems >= 20;
                let ws;

                if (useDualColumns) {
                    const columns = Math.ceil(totalItems / 2);
                    wsData.push([getTimeRange(), "", "", "", "", "", "", ""]);
                    wsData.push(["序号", "站名", "降水量 (mm)", "雨强", "序号", "站名", "降水量 (mm)", "雨强"]);

                    for (let i = 0; i < columns; i++) {
                        const row = [];
                        if (i < totalItems) {
                            row[0] = i + 1;
                            row[1] = data[i].stationName;
                            row[2] = data[i].precipitation;
                            row[3] = getRainfallIntensity(data[i].precipitation);
                        }
                        if (i + columns < totalItems) {
                            row[4] = i + columns + 1;
                            row[5] = data[i + columns].stationName;
                            row[6] = data[i + columns].precipitation;
                            row[7] = getRainfallIntensity(data[i + columns].precipitation);
                        }
                        wsData.push(row);
                    }

                    ws = XLSX.utils.aoa_to_sheet(wsData);
                    ws['!cols'] = [
                        { wch: 6 }, { wch: 30 }, { wch: 13 }, { wch: 13 },
                        { wch: 6 }, { wch: 30 }, { wch: 13 }, { wch: 13 }
                    ];
                } else {
                    wsData.push([getTimeRange(), "", "", ""]);
                    wsData.push(["序号", "站名", "降水量 (mm)", "雨强"]);
                    data.forEach((item, index) => {
                        wsData.push([
                            index + 1,
                            item.stationName,
                            item.precipitation,
                            getRainfallIntensity(item.precipitation)
                        ]);
                    });
                    ws = XLSX.utils.aoa_to_sheet(wsData);
                    ws['!cols'] = [
                        { wch: 6 }, { wch: 30 }, { wch: 15 }, { wch: 15 }
                    ];
                }

                ws['!rows'] = [
                    { hpt: 23 },
                    { hpt: 20 },
                    ...Array(Math.max(totalItems, 1)).fill({ hpt: 20 })
                ];

                const mergeRange = useDualColumns ?
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } } :
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } };

                ws['!merges'] = [mergeRange];

                XLSX.utils.book_append_sheet(wb, ws, "雨情统计");
                XLSX.writeFile(wb, `雨情统计_${getTimeRange().replace(/[\/:]/g, '-')}.xlsx`);
            }

            // 创建导出按钮
            function createExportButton() {
                const btn = document.createElement('button');
                Object.assign(btn.style, {
                    position: 'fixed',
                    zIndex: 10002,
                    right: '20px',
                    top: '10px',
                    padding: '10px 20px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                });

                btn.textContent = '导出雨情数据';
                btn.onclick = () => {
                    const data = extractData();
                    if (data.length === 0) {
                        alert('未检测到有效降水数据！');
                        return;
                    }
                    exportToExcel(data);
                };

                document.body.appendChild(btn);
            }

            // 初始化
            window.onload = function() {
                createExportButton();
            };
        }
    })();

    // === 脚本2：1H雨量短信（完整保留）===
    (function() {
        const btn = document.createElement('button');
        btn.textContent = '1H雨量超过10mm短信内容';
        Object.assign(btn.style, {
            position: 'fixed',
            zIndex: 10001,
            right: '280px',
            top: '10px',
            padding: '10px 20px',
            background: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        });

        btn.addEventListener('click', () => {
            const stations = [];
            let maxStation = { name: '', rain: 0 };
            let xianchengRain = 0;

            document.querySelectorAll('#table table:first-child tr[bgcolor="#FFFFFF"]').forEach(row => {
                Array.from(row.cells).forEach((cell, i) => {
                    if (i % 2 === 0 && cell.querySelector('input')) {
                        const stationName = cell.querySelector('input').value;
                        const rainValue = parseFloat(cell.nextElementSibling.textContent);

                        stations.push({ name: stationName, rain: rainValue });

                        if (rainValue > maxStation.rain) {
                            maxStation = { name: stationName, rain: rainValue };
                        }

                        if (stationName.includes('理县县城')) {
                            xianchengRain = rainValue;
                        }
                    }
                });
            });

            // 生成动态弹窗内容
            function showDynamicModal(stations, maxStation, xianchengRain) {
                const now = new Date();
                const today = formatChineseDate(now);
                const yesterday = formatChineseDate(new Date(now.getTime() - 86400000));
                const currentHour = now.getHours();

                const overLimit = stations.filter(s => s.rain >= 10);
                const hasOver10 = overLimit.length > 0;

                let title = "1H降雨超过10mm短信通报";
                let stationList = "";
                let forecast = "";

                if (hasOver10) {
                    stationList = overLimit
                        .sort((a, b) => b.rain - a.rain)
                        .map(s => `${s.name}${s.rain}毫米`)
                        .join('，');

                    forecast = overLimit.length > 1 ?
                        '个别乡镇有短时强降水' :
                        '个别乡镇可能出现短时强降水';
                } else {
                    title = "无站点雨量超过10毫米（模板参考如下）";
                    stationList = "下孟乡10毫米，上孟乡塔斯村10毫米";
                    forecast = "个别乡镇有短时强降水";
                }

                const content = `
                    <div style="
                        background: white;
                        padding: 25px 30px;
                        border-radius: 8px;
                        width: 800px;
                        max-width: 95%;
                        position: relative;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    ">
                        <h2 style="color: #D32F2F; margin: 0 0 18px 0; font-size: 18px; text-align: center;">
                            ${title}
                        </h2>
                        <p style="line-height: 1.7; margin: 0; white-space: pre-line; font-size: 14px;">
${yesterday}${currentHour}时雨量现报：我县过去1小时降水量，${stationList}。
预计未来三小时，多云间阴天有小雨到中雨，${forecast}，请注意防范。
                        </p>
                        <span class="close-btn">×</span>
                    </div>
                `;

                createModal(content);
            }

            function createModal(content) {
                const mask = document.createElement('div');
                mask.className = 'modal-mask';
                mask.innerHTML = content;

                mask.querySelector('.close-btn').addEventListener('click', () => mask.remove());
                mask.addEventListener('click', (e) => e.target === mask && mask.remove());

                document.body.appendChild(mask);
            }

            // 中文日期格式化函数
            function formatChineseDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}年${month}月${day}日`;
            }

            showDynamicModal(stations, maxStation, xianchengRain);
        });

        document.body.appendChild(btn);
    })();

    // === 脚本3：08H雨量快报（完整保留）===
    (function() {
        const btn = document.createElement('button');
        btn.textContent = '08H-08H快报';
        Object.assign(btn.style, {
            position: 'fixed',
            zIndex: 10000,
            right: '150px',
            top: '10px',
            padding: '10px 20px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        });

        btn.addEventListener('click', () => {
            const stations = [];
            let maxStation = { name: '', rain: 0 };
            let xianchengRain = 0;

            document.querySelectorAll('#table table:first-child tr[bgcolor="#FFFFFF"]').forEach(row => {
                Array.from(row.cells).forEach((cell, i) => {
                    if (i % 2 === 0 && cell.querySelector('input')) {
                        const stationName = cell.querySelector('input').value;
                        const rainValue = parseFloat(cell.nextElementSibling.textContent);

                        stations.push({ name: stationName, rain: rainValue });

                        if (rainValue > maxStation.rain) {
                            maxStation = { name: stationName, rain: rainValue };
                        }

                        if (stationName.includes('理县县城')) {
                            xianchengRain = rainValue;
                        }
                    }
                });
            });

            function showFastReportModal(maxStation, xianchengRain) {
                const now = new Date();
                const today = formatChineseDate(now);
                const yesterday = formatChineseDate(new Date(now.getTime() - 86400000));

                const content = `
                    <div style="
                        background: white;
                        padding: 25px 30px;
                        border-radius: 8px;
                        width: 800px;
                        max-width: 95%;
                        position: relative;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    ">
                        <h2 style="color: #D32F2F; margin: 0 0 18px 0; font-size: 18px; text-align: center;">
                            气象快报
                        </h2>
                        <p style="line-height: 1.7; margin: 0; white-space: pre-line; font-size: 14px;">
${yesterday}08时～${today}08时，
我县普降小雨到中雨，最大雨量出现在<strong>${maxStation.name}</strong>（${maxStation.rain}毫米），${xianchengRain > 0 ? `县城降水${xianchengRain}毫米` : '县城无降水'}。
                        </p>
                        <span class="close-btn">×</span>
                    </div>
                `;

                createModal(content);
            }

            function createModal(content) {
                const mask = document.createElement('div');
                mask.className = 'modal-mask';
                mask.innerHTML = content;

                mask.querySelector('.close-btn').addEventListener('click', () => mask.remove());
                mask.addEventListener('click', (e) => e.target === mask && mask.remove());

                document.body.appendChild(mask);
            }

            // 中文日期格式化函数
            function formatChineseDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}年${month}月${day}日`;
            }

            showFastReportModal(maxStation, xianchengRain);
        });

        document.body.appendChild(btn);
    })();

    // === 公共样式 ===
    const style = document.createElement('style');
    style.textContent = `
        .modal-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.4);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            cursor: pointer;
            font-size: 20px;
            color: #666;
            transition: color 0.2s;
        }
        .close-btn:hover {
            color: #000;
        }
    `;
    document.head.appendChild(style);
})();