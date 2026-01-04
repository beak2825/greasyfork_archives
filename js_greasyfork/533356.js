// ==UserScript==
// @name         Metabase数据可视化工具
// @namespace    http://tampermonkey.net/
// @version      3.3.1
// @description  现代化嵌入式数据可视化工具
// @author       流清露
// @match        *://ops.q1.com/metabase*
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/533355/1574026/d3jsorgd3v6minjs.js
// @connect      ops.q1.com
// @downloadURL https://update.greasyfork.org/scripts/533356/Metabase%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/533356/Metabase%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =================================================
       常量和全局变量定义
    =================================================== */
    const TARGET_PATTERN = /\/metabase\/api\/embed\/dashboard\/([^\/]+)\/dashcard\/(\d+)\/card\/(\d+)(?:\.json)?/;
    let capturedUrl = null;
    let checkInterval = null;
    let currentData = null;
    let originalContentWrapper = null;

    /* =================================================
       样式配置
       后续扩展时可统一在这里添加修改
    =================================================== */
    const styles = {
        container: `
            width: 100%; height: 78vh;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
            padding: 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            display: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `,
        nav: `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            border-bottom: 1px solid #f0f2f5;
        `,
        refreshBtn: `
            padding: 8px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            color: #4dabf7;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
        `,
        closeBtn: `
            background: #fff0f6;
            color: #f06595;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `,
        toggleBtn: `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 12px 24px;
            background: #1990ff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            z-index: 1000000;
            box-shadow: 0 4px 12px rgba(77, 171, 247, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
        `,
        tab: `
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            background: #f8f9fa;
            color: #868e96;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        `,
        tabActive: `
            background: #1990ff;
            color: white;
        `
    };

    // 通用的动画样式（可统一添加）
    const globalCSS = `
        .viz-tab:hover {
            background: #f1f3f5;
            color: #495057;
        }
        .viz-tab[active] {
            background: #4dabf7 !important;
            color: white !important;
            box-shadow: 0 2px 8px rgba(77, 171, 247, 0.3);
        }
        @keyframes slideIn {
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        /* 美化滚动条 */
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4dabf7 #f1f3f5;
        }
    `;
    injectGlobalStyle(globalCSS);

    /* =================================================
       DOM节点创建
       将主要UI容器、按钮、导航等组件抽离成单独函数
    =================================================== */
    // 创建主容器
    const container = createElement('div', { id: 'metabase-viz-container', style: styles.container });
    // 导航栏
    const nav = createElement('div', { style: styles.nav });
    // 刷新按钮
    const refreshBtn = createElement('button', { style: styles.refreshBtn, innerHTML: '<svg viewBox="0 0 24 24" width="20" height="20" style="fill:currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>' });
    // 关闭按钮
    const closeBtn = createElement('button', { style: styles.closeBtn, innerHTML: '&times;' });
    // 选项卡容器
    const tabContainer = createElement('div', { style: 'display: flex; gap: 8px; left: 5%; position: absolute;' });
    // 内容区域
    const contentArea = createElement('div', { style: 'position: relative; min-height: 400px; transition: opacity 0.3s ease;' });
    // 切换视图按钮
    const toggleBtn = createElement('button', { style: styles.toggleBtn, textContent: '数据视图' });

    // 整合导航栏与容器
    nav.append(refreshBtn, tabContainer, closeBtn);
    container.append(nav, contentArea);

    /* =================================================
       辅助函数
    =================================================== */
    // 创建DOM元素的简易封装
    function createElement(tag, { id, style, innerHTML, textContent } = {}) {
        const el = document.createElement(tag);
        if (id) el.id = id;
        if (style) el.style.cssText = style;
        if (innerHTML) el.innerHTML = innerHTML;
        if (textContent) el.textContent = textContent;
        return el;
    }

    // 注入全局样式
    function injectGlobalStyle(css) {
        const styleTag = document.createElement('style');
        styleTag.textContent = css;
        document.head.appendChild(styleTag);
    }

    // 加载器组件（加载动画）
    function createLoader() {
        return createElement('div', {
            style: `
                border: 2px solid #f3f3f3;
                border-top: 2px solid #4dabf7;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
                margin-left: 8px;
            `
        });
    }

    // 创建选项卡按钮
    function createTab(label, active = false) {
        const tab = createElement('button', { style: styles.tab, textContent: label });
        tab.classList.add('viz-tab');
        if (active) tab.style.cssText += styles.tabActive;
        return tab;
    }

    // 设置活跃的选项卡样式
    function setActiveTab(activeTab) {
        document.querySelectorAll('.viz-tab').forEach(tab => {
            if (tab === activeTab) {
                tab.style.cssText += styles.tabActive;
            } else {
                tab.style.background = 'transparent';
                tab.style.color = '#666';
            }
        });
    }

    /* =================================================
       UI渲染模块
    =================================================== */
    function renderUI() {
        // 清空旧的选项卡和内容
        tabContainer.innerHTML = '';
        contentArea.innerHTML = '';

        // 创建选项卡（可扩展更多tab）
        const tableTab = createTab('数据表格', true);
        const BarchartTab = createTab('设计师消耗图');
        const LinechartTab = createTab('按日消耗图');
        tabContainer.append(tableTab, BarchartTab, LinechartTab);

        // 创建内容区域模块
        const tableContent = createTable(currentData.rows, currentData.cols, 20);
        const BarchartContent = createBarChart(currentData.rows);
        const LinechartContent = createLineChart(currentData.rows);

        // 绑定选项卡点击事件
        tableTab.onclick = () => {
            setActiveTab(tableTab);
            contentArea.innerHTML = '';
            contentArea.appendChild(tableContent);
        };

        BarchartTab.onclick = () => {
            setActiveTab(BarchartTab);
            contentArea.innerHTML = '';
            contentArea.appendChild(BarchartContent);
        };

        LinechartTab.onclick = () => {
            setActiveTab(LinechartTab);
            contentArea.innerHTML = '';
            contentArea.appendChild(LinechartContent);
        };

        // 默认加载表格视图
        setActiveTab(tableTab);
        contentArea.appendChild(tableContent);
    }

    // 表格生成函数
    // 表格生成函数（添加了分页功能）  
    function createTable(rows, cols, pageSize) {
        // 外部容器，包括表格和分页控件
        const wrapper = createElement('div', {
            style: `
                max-height: 60vh;
                overflow-y: auto;
                border-radius: 12px;
                position: relative;
            `
        });
        // 给容器添加自定义滚动条样式
        wrapper.classList.add('custom-scrollbar');

        // 用于存放表格的容器（方便重新渲染表格内容）
        const tableContainer = document.createElement('div');

        // 当前页和总页数
        let currentPage = 1;
        const totalPages = Math.ceil(rows.length / pageSize);

        // 渲染指定页的表格
        function renderTablePage(page) {
            tableContainer.innerHTML = ''; // 清空旧表格内容

            // 创建 table 元素
            const table = createElement('table', {
                style: `
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin-top: 16px;
                    font-size: 14px;
                `
            });

            // 表头
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            cols.forEach(col => {
                const th = createElement('th', {
                    textContent: col.display_name,
                    style: `
                        padding: 16px;
                        background: #f8f9fa;
                        color: #495057;
                        font-weight: 600;
                        position: sticky;
                        top: 0;
                        backdrop-filter: blur(4px);
                    `
                });
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // 表体：只渲染当前页的数据
            const tbody = document.createElement('tbody');
            // 计算当前页起始和结束的行号
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, rows.length);

            for (let rowIndex = startIndex; rowIndex < endIndex; rowIndex++) {
                const row = rows[rowIndex];
                const tr = document.createElement('tr');
                // 设置行的背景色，并加入过渡动画效果
                tr.style.cssText = `
                    transition: background 0.2s ease;
                    background: ${rowIndex % 2 === 0 ? '#fff' : '#f8f9fa'};
                `;
                row.forEach((cell, index) => {
                    // // 处理特殊字段格式
                    if ([11,12,13,14,15,16,17,18,19].includes(index)) {
                        cell = (cell * 100).toFixed(1) + "%" ;
                    } 
                    const td = createElement('td', {
                        textContent: (cell !== null && cell !== undefined) ? cell : '-',
                        style: `
                            padding: 14px;
                            border-bottom: 1px solid #f1f3f5;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        `
                    });
                    // 针对特定列设置特殊样式
                    if ([8,9,10,11,12,13,14,15,16,17,18,19,20].includes(index)) {
                        td.style.color = '#4dabf7';
                        td.style.fontWeight = '500';
                    }
                    tr.appendChild(td);
                });
                // 鼠标悬浮事件
                tr.onmouseenter = () => { tr.style.background = '#f1f3f5'; };
                tr.onmouseleave = () => { tr.style.background = rowIndex % 2 === 0 ? '#fff' : '#f8f9fa'; };
                tbody.appendChild(tr);
            }

            table.appendChild(thead);
            table.appendChild(tbody);
            tableContainer.appendChild(table);
        }

        // 分页控件
        const paginationControls = document.createElement('div');
        paginationControls.style.cssText = `
            margin-top: 10px;
            text-align: center;
        `;

        // 更新分页控件按钮状态和页码显示
        function updatePaginationControls() {
            paginationControls.innerHTML = ''; // 清空旧控件内容

            // 上一页按钮
            const prevButton = document.createElement('button');
            prevButton.textContent = '上一页';
            prevButton.disabled = currentPage === 1;
            prevButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTablePage(currentPage);
                    updatePaginationControls();
                }
            };
            paginationControls.appendChild(prevButton);

            // 当前页信息
            const pageInfo = document.createElement('span');
            pageInfo.textContent = ` ${currentPage} / ${totalPages} `;
            pageInfo.style.margin = '0 10px';
            paginationControls.appendChild(pageInfo);

            // 下一页按钮
            const nextButton = document.createElement('button');
            nextButton.textContent = '下一页';
            nextButton.disabled = currentPage === totalPages;
            nextButton.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTablePage(currentPage);
                    updatePaginationControls();
                }
            };
            paginationControls.appendChild(nextButton);
        }

        // 渲染初始的页面内容和分页控件
        renderTablePage(currentPage);
        updatePaginationControls();

        // 将表格和分页控件添加到外部容器中
        wrapper.appendChild(tableContainer);
        wrapper.appendChild(paginationControls);
        return wrapper;
    }

    // 柱状图生成函数
    function createBarChart(rows) {
        const chartContainer = createElement('div', {
            style: `
                margin-top: 24px;
                padding: 24px;
                background: #f8f9fa;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `
        });
    
        // 创建控制面板
        const controlPanel = createElement('div', {
            style: `
                display: flex;
                gap: 24px;
                padding: 16px;
                border-bottom: 2px solid #e9ecef;
                margin-bottom: 24px;
            `
        });
    
        // 创建复选框函数
        const createCheckbox = (defaultChecked) => {
            const checkbox = createElement('input', {
                type: 'checkbox',
                style: `
                    margin-right: 8px;
                    transform: scale(1.2);
                    vertical-align: middle;
                `
            });
            checkbox.checked = defaultChecked;
            return checkbox;
        };
    
        const excludeCheck = createCheckbox(true);
        const excludeLabel = createElement('label', {
            textContent: '排除"other"的数据',
            style: 'display: flex; align-items: center;'
        });
        excludeLabel.prepend(excludeCheck);
    
        const showAllCheck = createCheckbox(false);
        const showAllLabel = createElement('label', {
            textContent: '显示所有设计师',
            style: 'display: flex; align-items: center;'
        });
        showAllLabel.prepend(showAllCheck);
    
        const refreshBtn = createElement('button', {
            textContent: '刷新图表',
            style: `
                padding: 8px 16px;
                background: #4dabf7;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                margin-left: auto;
            `
        });
    
        controlPanel.append(excludeLabel, showAllLabel, refreshBtn);
        chartContainer.appendChild(controlPanel);
    
        const allowedDesigners = ['LQL', 'ZMD', 'XXQ', 'LYQ', 'XFY', 'WZY', 'CZM', 'WZG', 'WD'];
    
        const renderChart = () => {
            while (chartContainer.lastChild !== controlPanel) {
                chartContainer.removeChild(chartContainer.lastChild);
            }
    
            const excludeOther = excludeCheck.checked;
            const showAllDesigners = showAllCheck.checked;
    
            const designerStats = {};
            rows.forEach(row => {
                const creativePerson = row[4];
                const designer = row[5];
                const cost = parseFloat(row[8]);

                if (!designer || !cost) return;
    
                if (excludeOther && creativePerson && /other/i.test(creativePerson)) return;
                if (!showAllDesigners && !allowedDesigners.includes(designer)) return;
    
                if (designer && !isNaN(cost)) {
                    designerStats[designer] = (designerStats[designer] || 0) + cost;
                }
            });
    
            const sortedStats = Object.entries(designerStats)
                .map(([name, total]) => ({
                    name,
                    total: total.toFixed(1),
                    originalTotal: total
                }))
                .sort((a, b) => b.originalTotal - a.originalTotal);
    
            const maxValue = Math.max(...sortedStats.map(s => s.originalTotal)) || 1;
    
            sortedStats.forEach((item, index) => {
                const barWrapper = createElement('div', {
                    className: 'bar-row',
                    style: `
                        display: flex;
                        align-items: center;
                        margin: 16px 0;
                        opacity: 0;
                        transform: translateX(-20px);
                        animation: slideIn 0.4s ease ${index * 0.1}s forwards;
                    `
                });
    
                const label = createElement('div', {
                    textContent: item.name,
                    style: `
                        width: 120px;
                        font-weight: 500;
                        color: #343a40;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `
                });
    
                const barContainer = createElement('div', {
                    style: `
                        flex: 1;
                        height: 12px;
                        background: #e9ecef;
                        border-radius: 6px;
                        margin: 0 16px;
                        overflow: hidden;
                        position: relative;
                    `
                });
    
                const percentage = (item.originalTotal / maxValue) * 100;
    
                const bar = createElement('div', {
                    style: `
                        width: 0;
                        height: 100%;
                        background: linear-gradient(90deg, #69db7c, #4dabf7);
                        border-radius: 6px;
                        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s;
                    `
                });
    
                setTimeout(() => {
                    bar.style.width = `${percentage}%`;
                }, 50);
    
                const value = createElement('div', {
                    textContent: item.total,
                    style: `
                        width: 80px;
                        text-align: right;
                        font-weight: 600;
                        color: #4dabf7;
                        font-feature-settings: 'tnum';
                    `
                });

                barContainer.appendChild(bar);
                barWrapper.append(label, barContainer, value);
                chartContainer.appendChild(barWrapper);
            });

        };
    
        renderChart();
    
        let debounceTimer;
        refreshBtn.addEventListener('click', () => {
            clearTimeout(debounceTimer);
            refreshBtn.textContent = '刷新中...';
            debounceTimer = setTimeout(() => {
                renderChart();
                refreshBtn.textContent = '刷新图表';
            }, 300);
        });
 
        return chartContainer;
    }
    
    // 折线图生成函数
    function createLineChart(rows) {
        const chartContainer = createElement('div', {
            style: `
                margin: 24px;
                padding: 24px;
                background: #f8f9fa;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `
        });
    
        const controlPanel = createElement('div', {
            style: `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-bottom: 2px solid #e9ecef;
                margin-bottom: 24px;
                flex-wrap: wrap;
                gap: 16px;
            `
        });
    
        const createCheckbox = (labelText, checked) => {
            const checkbox = createElement('input', {
                type: 'checkbox',
                checked: checked,
                style: 'transform: scale(1.2); margin-right: 8px;'
            });
            const label = createElement('label', {
                textContent: labelText,
                style: 'display: flex; align-items: center;'
            });
            label.prepend(checkbox);
            return { checkbox, label };
        };
    
        const [excludeCheck, cumulativeCheck] = [
            createCheckbox('排除"other"的数据', true),
            createCheckbox('累计消耗模式', false)
        ];
    
        cumulativeCheck.checkbox.checked = false;
    
        const refreshBtn = createElement('button', {
            textContent: '刷新图表',
            style: `
                padding: 8px 16px;
                background: #4dabf7;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                margin-left: auto;
            `
        });
    
        controlPanel.append(
            excludeCheck.label,
            cumulativeCheck.label,
            refreshBtn
        );
        chartContainer.appendChild(controlPanel);
    
        const svg = d3.select(chartContainer)
            .append('svg')
            .attr('width', '100%')
            .attr('height', 400)
            .style('overflow', 'visible');
    
        const legend = createElement('div', {
            style: `
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                padding: 16px;
                background: white;
                border-radius: 8px;
                margin-top: 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            `
        });
        chartContainer.appendChild(legend);
    
        const designerConfig = {
            allowed: ['LQL', 'ZMD', 'XXQ', 'LYQ', 'XFY', 'WZY', 'CZM', 'WZG', 'WD'],
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF8C42', '#7C5AC2', '#5D768C', '#E05D44']
        };
    
        let isInitialized = false;
    
        function renderChart() {
            svg.selectAll('*').remove();
            legend.innerHTML = '';
    
            const excludeOther = excludeCheck.checkbox.checked;
            const isCumulative = cumulativeCheck.checkbox.checked;
    
            const dataMap = {};
            const dateSet = new Set();
            const colorMap = {};
    
            designerConfig.allowed.forEach((d, i) => colorMap[d] = designerConfig.colors[i]);
    
            rows.forEach(row => {
                const rdate = row[0];
                const creativePerson = row[4];
                const designer = row[5];
                const cost = parseFloat(row[8]);
                
                const date = rdate.replace(/-/g, '/');

                if (excludeOther && creativePerson && /other/i.test(creativePerson)) return;
                if (!designer || isNaN(cost)) return;
    
                dateSet.add(date);
                dataMap[designer] = dataMap[designer] || {};
                dataMap[designer][date] = (dataMap[designer][date] || 0) + cost;
            });
    
            const dates = Array.from(dateSet).sort((a, b) => new Date(a) - new Date(b));
            if (dates.length === 0) return;
    
            const series = designerConfig.allowed
                .filter(d => dataMap[d])
                .map(designer => {
                    const dataPoints = dates.map(date => ({
                        date,
                        value: dataMap[designer][date] || 0
                    }));
    
                    if (isCumulative) {
                        let sum = 0;
                        return dataPoints.map(dp => ({
                            date: dp.date,
                            value: (sum += dp.value)
                        }));
                    }
                    return dataPoints;
                })
                .map((data, i) => ({
                    name: designerConfig.allowed[i],
                    color: colorMap[designerConfig.allowed[i]],
                    data: data
                }));
    
            const timeExtent = d3.extent(dates, d => new Date(d));
            const timeSpan = timeExtent[1] - timeExtent[0];
            let tickCount = dates.length;
    
            const margin = { top: 40, right: 60, bottom: 60, left: 60 };
            const width = svg.node().clientWidth - margin.left - margin.right;
            const height = svg.node().clientHeight - margin.top - margin.bottom;
    
            const xScale = d3.scaleTime()
                .domain(timeExtent)
                .range([0, width]);
    
            const yMax = d3.max(series, s => d3.max(s.data, d => d.value)) || 0;
            const yScale = d3.scaleLinear()
                .domain([0, yMax * 1.2])
                .range([height, 0]);
    
            const xAxis = d3.axisBottom(xScale)
                .ticks(tickCount)
                .tickFormat(d3.timeFormat('%m-%d'));
    
            svg.append('g')
                .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
                .call(xAxis);
    
            const yAxis = d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(d3.format('.0f'));
    
            svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .call(yAxis);
    
            const line = d3.line()
                .x(d => xScale(new Date(d.date)) + margin.left)
                .y(d => yScale(d.value) + margin.top)
                .curve(d3.curveMonotoneX);
    
            series.forEach(s => {
                const path = svg.append('path')
                    .datum(s.data)
                    .attr('fill', 'none')
                    .attr('stroke', s.color)
                    .attr('stroke-width', 2.5)
                    .attr('opacity', 0.7)
                    .attr('d', line);
    
                const legendItem = createElement('div', {
                    style: `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: 4px;
                    `
                });
    
                const colorBox = createElement('div', {
                    style: `
                        width: 16px;
                        height: 16px;
                        background: ${s.color};
                        border-radius: 3px;
                    `
                });
    
                legendItem.append(colorBox, document.createTextNode(s.name));
                legend.appendChild(legendItem);
    
                const highlight = () => {
                    path.attr('stroke-width', 4).attr('opacity', 1);
                    legendItem.style.fontWeight = 'bold';
                };
    
                const unhighlight = () => {
                    path.attr('stroke-width', 2.5).attr('opacity', 0.7);
                    legendItem.style.fontWeight = 'normal';
                };
    
                path.on('mouseenter', highlight).on('mouseleave', unhighlight);
                legendItem.addEventListener('mouseenter', highlight);
                legendItem.addEventListener('mouseleave', unhighlight);
            });
    
            isInitialized = true;
        }
    
        const debounce = (func, delay) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        };
    
        const debouncedRender = debounce(renderChart, 300);
    
        [excludeCheck.checkbox, cumulativeCheck.checkbox].forEach(input => {
            input.addEventListener('change', () => {
                debouncedRender();
            });
        });
    
        refreshBtn.addEventListener('click', () => {
            isInitialized = false;
            svg.selectAll('*').remove();
            renderChart();
        });
    
        // 不执行初始渲染，等待用户点击“刷新图表”
        return chartContainer;
    }
   
    // 辅助函数
    function createElement(tag, props) {
        const isSVG = ['svg', 'g', 'path'].includes(tag);
        const element = isSVG 
            ? document.createElementNS('http://www.w3.org/2000/svg', tag)
            : document.createElement(tag);
    
        if (props) {
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'style' && typeof value === 'string') {
                    element.setAttribute('style', value); // 支持 style 字符串形式
                } else if (key === 'textContent') {
                    element.textContent = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value; // ✅ 这里做修改
                } else if (key === 'append') {
                    element.append(...value);
                } else if (isSVG && key === 'transform') {
                    element.setAttribute('transform', value);
                } else if (key in element) {
                    element[key] = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
        }
    
        return element;
    }

    // 错误提示组件
    function showError(message) {
        contentArea.innerHTML = '';
        const errorBox = createElement('div', {
            textContent: message,
            style: `
                color: #dc3544; padding: 20px;
                border: 1px solid #f5c6cb;
                background: #f8d7da; border-radius: 5px;
                margin-top: 20px;
            `
        });
        contentArea.appendChild(errorBox);
    }

    /* =================================================
       数据请求模块
    =================================================== */
    // 拦截XHR请求（捕获Metabase数据请求）
    function setupXHRInterceptor() {
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            const match = url.match(TARGET_PATTERN);
            if (match) {
                // 生成新URL：插入/json并保留参数
                capturedUrl = `/metabase/api/embed/dashboard/${match[1]}/dashcard/${match[2]}/card/${match[3]}/json${url.split('?')[1] ? `?${url.split('?')[1]}` : ''}`;
                console.log('重构后的目标URL:', capturedUrl);
                XMLHttpRequest.prototype.open = origOpen; // 恢复原生方法
            }
            origOpen.apply(this, arguments);
        };
    }

    // 监控目标请求是否出现，若出现则获取数据
    function startMonitoring() {
        setupXHRInterceptor();
        clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            if (capturedUrl) {
                clearInterval(checkInterval);
                fetchData();
            }
        }, 500);
    }

    // 数据获取
    function fetchData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: capturedUrl,
            headers: { "Content-Type": "application/json" },
            responseType: "blob",
            onload: (response) => {
                try {
                    const reader = new FileReader();
                    reader.onload = function() {
                        const text = reader.result;
                        const rawData = JSON.parse(text); 
                        const cols = [
                            "日期", "素材名称", "投放日期(G3)", "素材前缀(G3)", 
                            "创意人(G3)", "设计师(G3)", "产出日期(G3)", "媒体", 
                            "消耗", "展示", "点击", "点击率", "首日ROI", "7日ROI", 
                            "30日ROI", "60日ROI", "90日ROI", "180日ROI", "360日ROI", 
                            "激活转化率", "cpm", "次日留存率", "广告系列名"
                        ];
                        
                        const rows = rawData.map(item => {
                            return cols.map(col => {
                                let value = item[col];
                                if (typeof value === "string" && value.endsWith("%")) {
                                    value = parseFloat(value.replace("%", "")) / 100;
                                }
                                if (value === "/") value = null;
                                return value;
                            });
                        });
                        
                        currentData = { rows, cols: cols.map(name => ({ display_name: name })) };
    
                        renderUI(); // 用预处理后的数据渲染
                    };
                    reader.readAsText(response.response);
                } catch (e) {
                    showError(`解析失败：${e.message}`);
                }
            },
            onerror: (err) => {
                showError(`请求失败：${err.status} ${err.statusText}`);
            }
        });
    }

    // 刷新数据
    function reloadData() {
        if (capturedUrl) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '加载中...';
            GM_xmlhttpRequest({
                method: "GET",
                url: capturedUrl,
                onload: (response) => {
                    refreshBtn.disabled = false;
                    refreshBtn.textContent = '↺ 刷新数据';
                    try {
                        currentData = JSON.parse(response.responseText).data;
                        renderUI();
                    } catch (e) {
                        showError(`刷新失败：${e.message}`);
                    }
                },
                onerror: (err) => {
                    refreshBtn.disabled = false;
                    refreshBtn.textContent = '↺ 刷新数据';
                    showError(`请求失败：${err.status} ${err.statusText}`);
                }
            });
        }
    }

    /* =================================================
       事件绑定模块
    =================================================== */
    // 刷新按钮的样式及事件（鼠标悬停效果）
    refreshBtn.onmouseenter = () => {
        refreshBtn.style.transform = 'rotate(90deg) scale(1.1)';
        refreshBtn.style.boxShadow = '0 2px 8px rgba(77, 171, 247, 0.2)';
    };
    refreshBtn.onmouseleave = () => {
        refreshBtn.style.transform = 'none';
        refreshBtn.style.boxShadow = 'none';
    };
    refreshBtn.onclick = reloadData;

    // 关闭按钮，恢复原始内容
    closeBtn.onclick = () => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        setTimeout(() => {
            container.style.display = 'none';
            originalContentWrapper.style.display = 'block';
        }, 300);
        toggleBtn.textContent = '数据视图';
    };

    // 切换视图按钮
    toggleBtn.onclick = function () {
        if (container.style.display === 'none') {
            originalContentWrapper.style.display = 'none';
            container.style.display = 'block';
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 10);
            toggleBtn.textContent = '原始视图';
            // 若已捕获请求但数据尚未加载，则加载数据
            if (capturedUrl && !currentData) fetchData();
        } else {
            container.style.opacity = '0';
            container.style.transform = 'translateY(10px)';
            setTimeout(() => {
                container.style.display = 'none';
                originalContentWrapper.style.display = 'block';
                toggleBtn.textContent = '数据视图';
            }, 300);
        }
    };

    // 绑定Metabase的刷新按钮（根据页面结构反复尝试绑定）
    (function bindMetabaseRefresh() {
        const mbRefresh = document.querySelector('.P9ZvT');
        if (mbRefresh) {
            mbRefresh.addEventListener('click', () => {
                capturedUrl = null;
                startMonitoring();
                closeBtn.onclick();
            });
        } else {
            setTimeout(bindMetabaseRefresh, 500);
        }
    })();

    /* =================================================
       初始化：将原始内容与主容器整合
    =================================================== */
    function initializeContainer() {
        const targetContainer = document.querySelectorAll('.emotion-tdlyzt')[1];
        if (!targetContainer) {
            setTimeout(initializeContainer, 500);
            return;
        }
        // 移动原始内容
        originalContentWrapper = document.createElement('div');
        originalContentWrapper.className = 'original-content-wrapper';
        while (targetContainer.firstChild) {
            originalContentWrapper.appendChild(targetContainer.firstChild);
        }
        targetContainer.appendChild(originalContentWrapper);
        targetContainer.appendChild(container);
        document.body.appendChild(toggleBtn);
    }

    /* =================================================
       脚本启动入口
    =================================================== */
    initializeContainer();
    startMonitoring();
})();
