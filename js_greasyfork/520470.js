// ==UserScript==
// @name         周数据统计生成器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  生成本周数据统计表格
// @author       You
// @license MIT
// @match        *://km.sankuai.com/collabpage/2634271591
// @grant        GM_xmlhttpRequest
// @connect      common-faas.vip.sankuai.com
// @downloadURL https://update.greasyfork.org/scripts/520470/%E5%91%A8%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520470/%E5%91%A8%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let weekPicker;
    let dateRangeDisplay;
    let button;

    // 等待 DOM 元素加载的辅助函数
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`等待元素 ${selector} 超时`));
                    return;
                }

                setTimeout(checkElement, 100);
            };

            checkElement();
        });
    }

    // 主函数
    async function init() {
        try {
            // 等待目标容器加载
            await waitForElement('.ProseMirror');

            // 创建控制面板
            const controlPanel = document.createElement('div');
            controlPanel.style.position = 'fixed';
            controlPanel.style.right = '20px';
            controlPanel.style.bottom = '20px';
            controlPanel.style.zIndex = '9999';
            controlPanel.style.backgroundColor = 'white';
            controlPanel.style.padding = '15px';
            controlPanel.style.borderRadius = '4px';
            controlPanel.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,.1)';
            controlPanel.style.display = 'flex';
            controlPanel.style.gap = '10px';
            controlPanel.style.alignItems = 'center';

            // 创建日期范围显示器（只读）
            dateRangeDisplay = document.createElement('input');
            dateRangeDisplay.type = 'text';
            dateRangeDisplay.readOnly = true;
            dateRangeDisplay.style.padding = '8px 30px 8px 8px';
            dateRangeDisplay.style.borderRadius = '4px';
            dateRangeDisplay.style.border = '1px solid #dcdfe6';
            dateRangeDisplay.style.width = '220px';
            dateRangeDisplay.style.backgroundColor = '#fff';
            dateRangeDisplay.style.cursor = 'pointer';

            // 创建周选择器
            weekPicker = document.createElement('input');
            weekPicker.type = 'week';
            weekPicker.style.position = 'absolute';
            weekPicker.style.width = '100%';
            weekPicker.style.height = '100%';
            weekPicker.style.top = '0';
            weekPicker.style.left = '0';
            weekPicker.style.opacity = '0';
            weekPicker.style.cursor = 'pointer';
            weekPicker.style.zIndex = '1';

            // 创建日期选择器容器
            const datePickerContainer = document.createElement('div');
            datePickerContainer.style.position = 'relative';
            datePickerContainer.style.cursor = 'pointer';

            // 创建按钮
            button = document.createElement('button');
            button.textContent = '生成报表';
            button.style.padding = '8px 16px';
            button.style.backgroundColor = '#409eff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';

            // 添加日历图标
            const calendarIcon = document.createElement('div');
            calendarIcon.innerHTML = '📅';
            calendarIcon.style.position = 'absolute';
            calendarIcon.style.right = '8px';
            calendarIcon.style.top = '50%';
            calendarIcon.style.transform = 'translateY(-50%)';
            calendarIcon.style.pointerEvents = 'none';

            datePickerContainer.appendChild(dateRangeDisplay);
            datePickerContainer.appendChild(calendarIcon);
            datePickerContainer.appendChild(weekPicker);

            // 修改点击事件监听器，将其添加到容器上
            datePickerContainer.addEventListener('click', () => {
                weekPicker.showPicker();
            });

            // 周选择器变化事件
            weekPicker.addEventListener('change', (event) => {
                const selectedWeek = event.target.value;
                if (selectedWeek) {
                    getDateRange(selectedWeek);
                }
            });

            // 点击日期范围显示器时触发周选择器
            dateRangeDisplay.addEventListener('click', () => {
                weekPicker.showPicker();
            });

            // 按钮点击事件
            button.addEventListener('click', async () => {
                if (!weekPicker.value) {
                    alert('请先选择周');
                    return;
                }

                try {
                    button.disabled = true;
                    button.textContent = '数据加载中...';
                    button.style.backgroundColor = '#a0cfff';

                    const dates = getDateRange(weekPicker.value);
                    if (!dates) {
                        throw new Error('日期范围无效');
                    }

                    const data = await request(
                        `https://common-faas.vip.sankuai.com/api/db/findConversion?startTime=${dates.lastWeekStart}&endTime=${dates.thisWeekEnd}`
                    );

                    const processedData = processData(data);
                    const tableHtml = generateTable(processedData);

                    const container = document.querySelector('.ProseMirror');
                    // 保留标题元素
                    const titleElement = container.querySelector('.pk-title');
                    const subtitleElement = container.querySelector('.subtitle-widget');
                    if (container) {
                        // 清空其他内容
                        container.innerHTML = '';
                        // 重新添加标题元素
                        if (titleElement) container.appendChild(titleElement);
                        if (subtitleElement) container.appendChild(subtitleElement);
                        container.insertAdjacentHTML('beforeend', tableHtml);
                    } else {
                        alert('未找到目标容器');
                    }
                } catch (error) {
                    console.error('获取或处理数据失败:', error);
                    alert('获取数据失败: ' + error.message);
                } finally {
                    button.disabled = false;
                    button.textContent = '生成报表';
                    button.style.backgroundColor = '#409eff';
                }
            });

            // 鼠标悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#66b1ff';
            });

            button.addEventListener('mouseout', () => {
                if (!button.disabled) {
                    button.style.backgroundColor = '#409eff';
                }
            });

            // 设置默认周
            setDefaultWeek();

            // 添加到控制面板
            controlPanel.appendChild(datePickerContainer);
            controlPanel.appendChild(button);
            document.body.appendChild(controlPanel);
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 获取日期范围
function getDateRange(weekStr) {
    if (!weekStr) return null;

    // 解析周选择器的值 (格式: 2024-W01)
    const [year, week] = weekStr.split('-W');
    const firstDayOfYear = new Date(parseInt(year), 0, 1);
    const firstWeekday = firstDayOfYear.getDay() || 7;

    // 计算选定周的周五（作为开始日期）
    const thisWeekStart = new Date(firstDayOfYear);
    thisWeekStart.setDate(1 - firstWeekday + (parseInt(week) - 1) * 7 - 2); // -2 是为了从周一往前推到上周五
    thisWeekStart.setHours(0, 0, 0, 0);

    // 计算选定周的下周四（作为结束日期）
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    thisWeekEnd.setHours(23, 59, 59, 999);

    // 计算上周的日期范围（上上周五到上周四）
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    lastWeekStart.setHours(0, 0, 0, 0);

    const lastWeekEnd = new Date(thisWeekEnd);
    lastWeekEnd.setDate(thisWeekEnd.getDate() - 7);
    lastWeekEnd.setHours(23, 59, 59, 999);

    // 显示日期范围（周五到下周四）
    dateRangeDisplay.value = `${formatDate(thisWeekStart)} ~ ${formatDate(thisWeekEnd)}`;

    return {
        thisWeekStart: formatDateTime(thisWeekStart),
        thisWeekEnd: formatDateTime(thisWeekEnd),
        lastWeekStart: formatDateTime(lastWeekStart),
        lastWeekEnd: formatDateTime(lastWeekEnd)
    };
}

// 确保在 DOM 加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 格式化日期（年-月-日）
    function formatDate(date) {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    // 格式化日期时间（年-月-日 时:分:秒）
    function formatDateTime(date) {
        const pad = (num) => String(num).padStart(2, '0');
        return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // 设置默认周为当前周期
function setDefaultWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0是周日，1-6是周一到周六
    const start = new Date(now);

    // 如果今天是周四之前（包括周四），那么当前周期的开始时间是上周五
    // 如果今天是周五之后，那么当前周期的开始时间是这周五
    if (dayOfWeek <= 4) { // 周四及之前
        start.setDate(now.getDate() - (dayOfWeek + 3)); // +3 是为了回到上周五
    } else { // 周五及之后
        start.setDate(now.getDate() - (dayOfWeek - 4)); // -4 是为了到这周五
    }

    const year = start.getFullYear();
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil((((start - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    weekPicker.value = `${year}-W${String(week).padStart(2, '0')}`;
    getDateRange(weekPicker.value);
}
        // 判断日期是否在指定的日期范围内
    function isInDateRange(date, startDate, endDate) {
        return date >= startDate && date <= endDate;
    }

    function request(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json'
                },
                responseType: 'json',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = typeof response.response === 'string'
                                ? JSON.parse(response.response)
                                : response.response;
                            resolve(data);
                        } catch (e) {
                            reject(new Error('JSON解析失败: ' + e.message));
                        }
                    } else {
                        reject(new Error('请求失败: ' + response.status));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败: ' + (error.message || '未知错误')));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    function calculateDailyMetrics(items) {
        return {
            total_rows: items.filter(row => row.type === 10 || (row.type === 8 && row.status > 0)).length,
            status_3_rows: items.filter(row => row.intent_status === 1).length,
            status_6_rows: items.filter(row => row.intent_status === 2).length,
            status_8_rows: items.filter(row => {
                if (row.customer_service !== 1) return false;

                if (!row.intention) return true;

                try {
                    const intention = JSON.parse(row.intention);
                    if (row.intention == 'null') return row.intent_status == 0
                    return intention.round == "0" && intention.intentType != "1";
                } catch (e) {
                    console.error('解析intention失败:', e, row);
                    return true; // 如果解析失败，视为直接转人工
                }
            }).length,
            status_18_rows: items.filter(row => row.act_status === 1).length,
            status_4_rows: items.filter(row => row.act_type === 2).length,
            status_5_rows: items.filter(row => row.act_type === 1).length,
            type_12_rows: items.filter(row => row.act_type === 1 && row.act_status === 1).length,
            type_11_rows: items.filter(row => row.act_type === 2 && row.act_status === 1).length
        };
    }



    function calculateMetrics(data) {
        const thisWeekRate = data.thisWeek.denominator ? (data.thisWeek.numerator / data.thisWeek.denominator) * 100 : 0;
        const lastWeekRate = data.lastWeek.denominator ? (data.lastWeek.numerator / data.lastWeek.denominator) * 100 : 0;
        const chainRatio = lastWeekRate ? ((thisWeekRate - lastWeekRate) / lastWeekRate) * 100 : 0;

        return {
            thisWeekRate: thisWeekRate.toFixed(2) + '%',
            lastWeekRate: lastWeekRate.toFixed(2) + '%',
            chainRatio: (chainRatio > 0 ? '+' : '') + chainRatio.toFixed(2) + '%'
        };
    }

    function processData(data) {


        const dates = getDateRange(weekPicker.value);
        if (!dates) return null;

        const thisWeekStart = new Date(dates.thisWeekStart);
        const thisWeekEnd = new Date(dates.thisWeekEnd);
        const lastWeekStart = new Date(dates.lastWeekStart);
        const lastWeekEnd = new Date(dates.lastWeekEnd);

        const thisWeekData = calculateDailyMetrics(data.filter(item => {
            const date = new Date(parseInt(item.start_time));
            return isInDateRange(date, thisWeekStart, thisWeekEnd);
        }));

        const lastWeekData = calculateDailyMetrics(data.filter(item => {
            const date = new Date(parseInt(item.start_time));
            return isInDateRange(date, lastWeekStart, lastWeekEnd);
        }));

        return {
            "问题识别准确率(窄)": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.status_3_rows - thisWeekData.status_8_rows,
                        denominator: thisWeekData.total_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.status_3_rows - lastWeekData.status_8_rows,
                        denominator: lastWeekData.total_rows
                    }
                }),
                displayNumerator: `意图识别成功数: ${thisWeekData.status_3_rows}\n直接转人工: ${thisWeekData.status_8_rows}`,
                displayDenominator: `会话唤起总数: ${thisWeekData.total_rows}`
            },

            "问题识别准确率(宽)": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.status_3_rows - thisWeekData.status_8_rows,
                        denominator: thisWeekData.total_rows - thisWeekData.status_8_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.status_3_rows - lastWeekData.status_8_rows,
                        denominator: lastWeekData.total_rows - lastWeekData.status_8_rows
                    }
                }),
                displayNumerator: `意图识别成功数: ${thisWeekData.status_3_rows}\n直接转人工: ${thisWeekData.status_8_rows}`,
                displayDenominator: `会话唤起总数: ${thisWeekData.total_rows}\n直接转人工: ${thisWeekData.status_8_rows}`
            },

            "问题求解成功率": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.status_18_rows,
                        denominator: thisWeekData.status_3_rows - thisWeekData.status_8_rows + thisWeekData.status_6_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.status_18_rows,
                        denominator: lastWeekData.status_3_rows - lastWeekData.status_8_rows + lastWeekData.status_6_rows
                    }
                }),
                displayNumerator: `成功求解次数: ${thisWeekData.status_18_rows}`,
                displayDenominator: `意图识别成功数: ${thisWeekData.status_3_rows}\n直接转人工: ${thisWeekData.status_8_rows}\n意图识别失败数: ${thisWeekData.status_6_rows}`
            },

            "问题闭环率(窄)": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.status_18_rows,
                        denominator: thisWeekData.total_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.status_18_rows,
                        denominator: lastWeekData.total_rows
                    }
                }),
                displayNumerator: `成功求解次数: ${thisWeekData.status_18_rows}`,
                displayDenominator: `会话唤起总数: ${thisWeekData.total_rows}`
            },

            "问题闭环率(宽)": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.status_18_rows,
                        denominator: thisWeekData.total_rows - thisWeekData.status_8_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.status_18_rows,
                        denominator: lastWeekData.total_rows - lastWeekData.status_8_rows
                    }
                }),
                displayNumerator: `成功求解次数: ${thisWeekData.status_18_rows}`,
                displayDenominator: `会话唤起总数: ${thisWeekData.total_rows}\n直接转人工: ${thisWeekData.status_8_rows}`
            },

            "Function求解率": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.type_12_rows,
                        denominator: thisWeekData.status_5_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.type_12_rows,
                        denominator: lastWeekData.status_5_rows
                    }
                }),
                displayNumerator: `Function成功求解数: ${thisWeekData.type_12_rows}`,
                displayDenominator: `Function求解次数: ${thisWeekData.status_5_rows}`
            },

            "知识求解率": {
                ...calculateMetrics({
                    thisWeek: {
                        numerator: thisWeekData.type_11_rows,
                        denominator: thisWeekData.status_4_rows
                    },
                    lastWeek: {
                        numerator: lastWeekData.type_11_rows,
                        denominator: lastWeekData.status_4_rows
                    }
                }),
                displayNumerator: `知识成功求解数: ${thisWeekData.type_11_rows}`,
                displayDenominator: `知识求解次数: ${thisWeekData.status_4_rows}`
            }
        };
    }

    function getFormula(key) {
        const formulas = {
            "问题识别准确率(窄)": "问题识别准确率 = 意图识别成功数 - 直接转人工 / 会话唤起总数",
            "问题识别准确率(宽)": "问题识别准确率 = 意图识别成功数 - 直接转人工 / 会话唤起总数 - 直接转人工",
            "问题求解成功率": "问题成功求解率 = 成功求解次数 / 意图识别成功数 - 直接转人工 + 意图识别失败数",
            "问题闭环率(窄)": "问题闭环率 = 成功求解次数 / 会话唤起总数",
            "问题闭环率(宽)": "问题闭环率 = 成功求解次数 / 会话唤起总数 - 直接转人工",
            "Function求解率": "Function求解率 = Function成功求解数 / Function求解次数",
            "知识求解率": "知识求解率 = 知识成功求解数 / 知识求解次数"
        };
        return formulas[key] || "";
    }

    function generateTable(data) {
        let html = `
            <table border="1" style="border-collapse: collapse; margin: 10px; width: 100%;">
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px;">转化率类别</th>
                    <th style="padding: 8px;">本周转化率</th>
                    <th style="padding: 8px;">上周转化率</th>
                    <th style="padding: 8px;">转化率环比</th>
                    <th style="padding: 8px;">分子</th>
                    <th style="padding: 8px;">分母</th>
                    <th style="padding: 8px;">转化率计算公式</th>
                </tr>`;

        // 处理常规行
        Object.entries(data).forEach(([key, value]) => {
            html += `
                <tr>
                    <td style="padding: 8px;">${key}</td>
                    <td style="padding: 8px;">${value.thisWeekRate}</td>
                    <td style="padding: 8px;">${value.lastWeekRate}</td>
                    <td style="padding: 8px;">${value.chainRatio}</td>
                    <td style="padding: 8px; white-space: pre-wrap;">${value.displayNumerator.split('\n').join('<br>')}</td>
                    <td style="padding: 8px; white-space: pre-wrap;">${value.displayDenominator.split('\n').join('<br>')}</td>
                    <td style="padding: 8px;">${getFormula(key)}</td>
                </tr>`;
        });

         // 处理特殊行：入库知识数/总数
        html += `
            <tr>
                <td style="padding: 8px;">入库知识数 / 总数</td>
                <td colspan="6" style="padding: 8px; text-align: center;">/ 1460 (待认证数量: 0)</td>
            </tr>`;

        // 处理特殊行：服务人次
        html += `
            <tr>
                <td style="padding: 8px;">服务人次</td>
                <td colspan="6" style="padding: 8px; text-align: center;">?</td>
            </tr>`;

        html += '</table>';
        return html;
    }

})();