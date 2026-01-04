// ==UserScript==
// @name         雨情统计2.5
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  雨情统计并导出Excel（完整功能版）
// @icon         https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @author       brady.wang
// @match        http://10.194.22.247:81/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @require      https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/538828/%E9%9B%A8%E6%83%85%E7%BB%9F%E8%AE%A125.user.js
// @updateURL https://update.greasyfork.org/scripts/538828/%E9%9B%A8%E6%83%85%E7%BB%9F%E8%AE%A125.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const allowedUrl = 'http://10.194.22.247:81/';

    if (currentUrl.startsWith(allowedUrl)) {
        console.log("检测到目标网站，开始初始化...");

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

        // 智能导出核心逻辑（完整功能版）
        function exportToExcel(data) {
            const wb = XLSX.utils.book_new();
            const wsData = [];
            const totalItems = data.length;
            const useDualColumns = totalItems >= 20;
            let ws;

            if (useDualColumns) {
                // 双列布局模式
                const columns = Math.ceil(totalItems / 2);

                // 构建表头
                wsData.push([getTimeRange(), "", "", "", "", "", "", ""]);
                wsData.push(["序号", "站名", "降水量 (mm)", "雨强", "序号", "站名", "降水量 (mm)", "雨强"]);

                // 智能分列布局
                for (let i = 0; i < columns; i++) {
                    const row = [];

                    // 第一部分数据
                    if (i < totalItems) {
                        row[0] = i + 1;
                        row[1] = data[i].stationName;
                        row[2] = data[i].precipitation;
                        row[3] = data[i].intensity;
                    }

                    // 第二部分数据
                    const secondPartIndex = i + columns;
                    if (secondPartIndex < totalItems) {
                        row[4] = secondPartIndex + 1;
                        row[5] = data[secondPartIndex].stationName;
                        row[6] = data[secondPartIndex].precipitation;
                        row[7] = data[secondPartIndex].intensity;
                    }

                    wsData.push(row);
                }

                // 创建工作表并配置列宽
                ws = XLSX.utils.aoa_to_sheet(wsData);
                ws['!cols'] = [
                    { wch: 6 }, { wch: 30 }, { wch: 13 }, { wch: 13 },
                    { wch: 6 }, { wch: 30 }, { wch: 13 }, { wch: 13 }
                ];
            } else {
                // 单列布局模式
                wsData.push([getTimeRange(), "", "", ""]);
                wsData.push(["序号", "站名", "降水量 (mm)", "雨强"]);

                data.forEach((item, index) => {
                    wsData.push([
                        index + 1,
                        item.stationName,
                        item.precipitation,
                        item.intensity
                    ]);
                });

                // 创建工作表并配置列宽
                ws = XLSX.utils.aoa_to_sheet(wsData);
                ws['!cols'] = [
                    { wch: 6 }, { wch: 30 }, { wch: 15 }, { wch: 15 }
                ];
            }

            // 公共配置
            // 行高设置
            ws['!rows'] = [
                { hpt: 23 },   // 表头行高
                { hpt: 20 },   // 标题行高
                ...Array(Math.max(totalItems, 1)).fill({ hpt: 20 }) // 数据行高
            ];

            // 合并表头单元格
            const mergeRange = useDualColumns ?
                { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } } :
                { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } };

            ws['!merges'] = [mergeRange];

            // 样式配置（终极修复）
            const setHeaderStyle = (cellRef) => {
                const cell = ws[cellRef];
                if (cell) {
                    cell.s = {
                        font: { bold: true, sz: 14 },
                        alignment: {
                            horizontal: 'center',
                            vertical: 'center',
                            wrapText: true
                        }
                    };
                }
            };

            // 设置表头样式（遍历合并区域所有单元格）
            const mergeStartCol = mergeRange.s.c;
            const mergeEndCol = mergeRange.e.c;
            for (let c = mergeStartCol; c <= mergeEndCol; c++) {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c });
                setHeaderStyle(cellRef);
            }

            // 设置标题行样式
            const titleCells = useDualColumns ?
                ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2'] :
                ['A2', 'B2', 'C2', 'D2'];
            titleCells.forEach(cell => {
                if (ws[cell]) {
                    ws[cell].s = {
                        font: { bold: true },
                        alignment: {
                            horizontal: 'center',
                            vertical: 'center'
                        }
                    };
                }
            });

            // 设置序号列样式（文本格式+左对齐）
            const setSequenceStyle = (col) => {
                for (let row = 2; row <= wsData.length; row++) {
                    const cell = ws[`${col}${row}`];
                    if (cell) {
                        cell.z = '@';       // 设置为文本格式
                        cell.s = cell.s || {};
                        cell.s.alignment = {
                            ...cell.s.alignment,
                            horizontal: 'left'
                        };
                    }
                }
            };

            // 根据模式设置序号列
            if (useDualColumns) {
                setSequenceStyle('A');  // 双列模式第一部分
                setSequenceStyle('E');  // 双列模式第二部分
            } else {
                setSequenceStyle('A');  // 单列模式
            }

            // 添加到工作簿
            XLSX.utils.book_append_sheet(wb, ws, "雨情统计");

            // 生成文件名
            const fileName = `雨情统计_${getTimeRange().replace(/[\/:]/g, '-')}.xlsx`;

            // 导出文件
            XLSX.writeFile(wb, fileName);
        }

        // 创建导出按钮
        function createExportButton() {
            const btn = document.createElement('button');
            Object.assign(btn.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 10000,
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
            console.log("导出按钮已创建");
        }

        // 初始化
        window.onload = function() {
            createExportButton();
            console.log("脚本初始化完成");
        };
    } else {
        console.log("非目标网站，脚本未执行");
    }
})();