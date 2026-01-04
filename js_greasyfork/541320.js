// ==UserScript==
// @name         东油教务系统预览下学期课表
// @namespace    https://jwgl.webvpn.nepu.edu.cn/
// @version      4.2
// @description  在东油教务系统课程主页面，点击悬浮按钮，在独立的弹窗面板中一键获取并生成可视化课程表。支持按周次查看，自动处理时间冲突，界面美化，固定显示无法排入的课程（并显示其周次）。
// @author       cat3399 & AI Assistant
// @match        https://jwgl.webvpn.nepu.edu.cn/new/welcome.page
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      jwgl.webvpn.nepu.edu.cn
// @license      MIT
// @icon         https://bkimg.cdn.bcebos.com/pic/4bed2e738bd4b31cbe08739d80d6277f9e2ff8e4?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080
// @downloadURL https://update.greasyfork.org/scripts/541320/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%A2%84%E8%A7%88%E4%B8%8B%E5%AD%A6%E6%9C%9F%E8%AF%BE%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541320/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%A2%84%E8%A7%88%E4%B8%8B%E5%AD%A6%E6%9C%9F%E8%AF%BE%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. 创建触发按钮 ---
    const openButton = document.createElement('button');
    openButton.textContent = '生成课表';
    openButton.id = 'cs-open-panel-button';
    document.body.appendChild(openButton);

    GM_addStyle(`
        #cs-open-panel-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99998;
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px; /* 圆角按钮 */
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            transition: all 0.2s ease-in-out;
        }
        #cs-open-panel-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
            background-color: #0069d9;
        }
    `);

    openButton.addEventListener('click', showSchedulePanel);

    // --- 2. 创建课表面板的核心函数 ---
    function showSchedulePanel() {
        if (document.getElementById('cs-panel-host')) {
            document.getElementById('cs-panel-host').style.display = 'block';
            return;
        }

        const panelHost = document.createElement('div');
        panelHost.id = 'cs-panel-host';
        document.body.appendChild(panelHost);

        const shadowRoot = panelHost.attachShadow({ mode: 'open' });

        const panelHTML = `
            <div class="cs-panel-container">
                <div class="cs-panel-header" id="cs-panel-header">
                    <span class="cs-panel-title">东油一键生成课表</span>
                    <button class="cs-panel-close-btn" id="cs-panel-close-btn">×</button>
                </div>
                <div class="cs-panel-body">
                    <div id="schedule-controls-custom">
                        <label for="semester-select-custom">选择学期:</label>
                        <select id="semester-select-custom"></select>
                        <button id="generate-schedule-btn-custom">一键生成课表</button>

                        <div id="week-selector-container" style="margin-left: auto; display: none; align-items: center; gap: 10px;">
                            <button id="prev-week-btn" title="上一周">←</button>
                            <label for="week-select-custom">当前周次:</label>
                            <select id="week-select-custom"></select>
                            <button id="next-week-btn" title="下一周">→</button>
                        </div>
                    </div>
                    <div id="schedule-display-area">
                        <div id="schedule-status">请选择学期后点击生成按钮。</div>
                    </div>
                    <!-- 用于永久显示无法排入课程的容器 -->
                    <div id="unplaced-courses-section"></div>
                </div>
            </div>
        `;

        const panelCSS = `
            /* 面板基础样式 */
            .cs-panel-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 95%;
                max-width: 1100px;
                height: 90vh;
                background-color: #fdfdfd;
                border-radius: 12px;
                box-shadow: 0 8px 40px rgba(0,0,0,0.15);
                z-index: 99999;
                display: flex;
                flex-direction: column;
                font-family: 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
            }
            .cs-panel-header {
                background-color: #f7f7f7;
                padding: 12px 20px;
                cursor: move;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
            }
            .cs-panel-title { font-weight: 600; color: #333; font-size: 16px; }
            .cs-panel-close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #999; line-height: 1; padding: 0 5px;}
            .cs-panel-close-btn:hover { color: #000; }
            .cs-panel-body {
                padding: 20px;
                color: #333;
                overflow-y: auto;
                flex-grow: 1;
                background-color: #fff;
            }
            .cs-panel-body::-webkit-scrollbar { width: 8px; }
            .cs-panel-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
            .cs-panel-body::-webkit-scrollbar-thumb:hover { background: #bbb; }

            /* --- 控件与课表样式优化 --- */
            #schedule-controls-custom { margin-bottom: 20px; display: flex; align-items: center; gap: 15px; }
            #semester-select-custom, #week-select-custom { padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 14px; background-color: #fff; }
            #generate-schedule-btn-custom { padding: 8px 20px; font-size: 14px; color: #fff; background-color: #d9534f; border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; font-weight: 500;}
            #generate-schedule-btn-custom:hover { background-color: #c9302c; }
            #prev-week-btn, #next-week-btn { padding: 8px 12px; font-size: 14px; cursor: pointer; border-radius: 6px; border: 1px solid #ccc; background-color: #f0f0f0;}
            #prev-week-btn:disabled, #next-week-btn:disabled { cursor: not-allowed; opacity: 0.5; }

            #schedule-table-custom { width: 100%; border-collapse: collapse; table-layout: fixed; background-color: #fff; }
            #schedule-table-custom th, #schedule-table-custom td { border: 1px solid #e0e0e0; padding: 6px; text-align: center; font-size: 12px; line-height: 1.5; vertical-align: top; min-height: 90px; }
            #schedule-table-custom th { background-color: #f9fafb; font-weight: 600; color: #444; height: 40px; }
            #schedule-table-custom .time-header { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
            #schedule-table-custom .time-details { font-size: 11px; color: #666; }

            /* 分割行样式 */
            #schedule-table-custom .break-cell {
                height: 5px;
                line-height: 5px;
                background-color: #f8f9fa;
                font-size: 12px;
                color: #888;
                font-weight: 500;
                border-left: 1px solid #e0e0e0;
                border-right: 1px solid #e0e0e0;
            }

            #schedule-table-custom td.has-conflict { background-color: #fff3f3 !important; }
            .course-block {
                margin-bottom: 5px;
                padding: 8px;
                border-radius: 6px;
                color: #fff;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .course-item { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
            .teacher-item, .location-item, .week-item { font-size: 11px; opacity: 0.9; }
            .location-item { margin-top: 2px; }
            .week-item { font-style: italic; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 4px; }

            .conflict-separator {
                border: 0;
                border-top: 1px dashed #e74c3c;
                margin: 4px 0;
                position: relative;
            }
            .conflict-separator::after {
                content: '冲突';
                position: absolute;
                top: -9px;
                left: 50%;
                transform: translateX(-50%);
                background: #fff3f3;
                color: #d9534f;
                font-size: 10px;
                padding: 0 4px;
                border-radius: 4px;
            }

            /* 无法排入课程容器样式 */
            #unplaced-courses-section { margin-top: 20px; }
            #unplaced-courses-container-custom { padding: 15px; border: 1px solid #ffc107; background-color: #fffbe6; border-radius: 8px; }
            #unplaced-courses-container-custom h3 { margin-top: 0; color: #d9534f; font-size: 16px;}
            #unplaced-courses-container-custom li { margin-bottom: 5px; color: #555; }
            #unplaced-courses-container-custom li strong { color: #333; }
            #unplaced-courses-container-custom .week-info { color: #0066cc; font-style: italic; }

            #schedule-status { font-size: 16px; color: #888; text-align: center; padding: 40px; }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = panelCSS;

        const template = document.createElement('template');
        template.innerHTML = panelHTML;

        shadowRoot.appendChild(styleElement);
        shadowRoot.appendChild(template.content.cloneNode(true));

        const semesterSelect = shadowRoot.getElementById('semester-select-custom');
        const currentYear = new Date().getFullYear();
        for (let year = currentYear + 1; year >= 2020; year--) {
            semesterSelect.add(new Option(`${year-1}-${year} 第二学期 (春)`, `${year-1}02`));
            semesterSelect.add(new Option(`${year-1}-${year} 第一学期 (秋)`, `${year-1}01`));
        }

        const generateBtn = shadowRoot.getElementById('generate-schedule-btn-custom');
        generateBtn.addEventListener('click', () => generateCourseSchedule(shadowRoot));

        const closeBtn = shadowRoot.getElementById('cs-panel-close-btn');
        closeBtn.addEventListener('click', () => {
             panelHost.style.display = 'none';
        });

        // 拖拽功能
        const header = shadowRoot.getElementById('cs-panel-header');
        const container = shadowRoot.querySelector('.cs-panel-container');
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('cs-panel-close-btn')) return;
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            header.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
            container.style.transform = 'none';
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.userSelect = 'auto';
        });
    }

    // --- 3. 辅助函数 (颜色生成器) ---
    const colorCache = {};
    const generateColor = (str) => {
        if (colorCache[str]) return colorCache[str];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = hash % 360;
        const s = 60;
        const l = 75;
        const color = `hsl(${h}, ${s}%, ${l}%)`;
        const fontColor = l > 60 ? '#333333' : '#FFFFFF';
        colorCache[str] = { background: color, font: fontColor };
        return colorCache[str];
    };

    // --- 4. 核心API请求与数据处理函数 ---
    function generateCourseSchedule(shadowRoot) {
        const semester = shadowRoot.getElementById('semester-select-custom').value;
        const displayDiv = shadowRoot.getElementById('schedule-display-area');
        displayDiv.innerHTML = `<div id="schedule-status">正在获取 ${semester} 学期课程列表...</div>`;
        shadowRoot.getElementById('week-selector-container').style.display = 'none';
        shadowRoot.getElementById('unplaced-courses-section').innerHTML = '';

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://jwgl.webvpn.nepu.edu.cn/xskktzd!getDataList.action`,
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" },
            data: `xnxqdm=${semester}&page=1&rows=100`,
            onload: function (response) {
                if (response.status !== 200) {
                    displayDiv.innerHTML = `<div id="schedule-status">错误：获取课程列表失败，状态码 ${response.status}</div>`;
                    return;
                }
                try {
                    const courseListData = JSON.parse(response.responseText);
                    if (!courseListData || !courseListData.rows || courseListData.rows.length === 0) {
                        displayDiv.innerHTML = `<div id="schedule-status">该学期没有查询到课程。</div>`;
                        return;
                    }
                    processCourseDetails(courseListData.rows, semester, shadowRoot);
                } catch (e) {
                     displayDiv.innerHTML = `<div id="schedule-status">解析课程列表失败，请确认您已登录教务系统。</div>`;
                     console.error("解析JSON失败:", e, response.responseText);
                }
            },
            onerror: function (error) {
                displayDiv.innerHTML = `<div id="schedule-status">网络错误！请检查是否已登录教务系统或网络连接是否正常。</div>`;
                console.error("获取课程列表时发生网络错误:", error);
            }
        });
    }

    function processCourseDetails(courses, semester, shadowRoot) {
        const statusDiv = shadowRoot.querySelector('#schedule-status') || shadowRoot.getElementById('schedule-display-area').appendChild(document.createElement('div'));
        statusDiv.id = 'schedule-status';
        statusDiv.innerText = `获取到 ${courses.length} 门课程，正在查询详细安排...`;

        let completedCount = 0;
        const allCourseData = [];
        const promises = courses.map(course => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://jwgl.webvpn.nepu.edu.cn/xskktzd!getZhouli.action?kcrwdm=${course.kcrwdm}&xnxqdm=${semester}`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" },
                    data: 'page=1&rows=200',
                    onload: function (response) {
                        completedCount++;
                        statusDiv.innerText = `正在查询详细安排... (${completedCount}/${courses.length})`;
                        if (response.status === 200) {
                            const details = JSON.parse(response.responseText);
                            allCourseData.push({ ...course, scheduleDetails: details.rows });
                        } else {
                            allCourseData.push({ ...course, scheduleDetails: [], error: `请求失败, status: ${response.status}` });
                        }
                        resolve();
                    },
                    onerror: function () {
                        completedCount++;
                        statusDiv.innerText = `正在查询详细安排... (${completedCount}/${courses.length})`;
                        allCourseData.push({ ...course, scheduleDetails: [], error: '网络错误' });
                        resolve();
                    }
                });
            });
        });

        Promise.all(promises).then(() => {
            setupAndRenderSchedule(allCourseData, shadowRoot);
        });
    }

    // --- 5. 【重构】设置周次选择并渲染课表的函数 ---
    function setupAndRenderSchedule(allCourseData, shadowRoot) {
        // --- 5.1 【修改】一次性计算并渲染无法排入的课程，并提取周次信息 ---
        const unplacedCourses = [];
        const unplacedCourseNames = new Set();
        allCourseData.forEach(course => {
            if (unplacedCourseNames.has(course.kcmc)) return; // 避免重复添加同名课程

            const hasValidSchedule = course.scheduleDetails && course.scheduleDetails.some(d => d.xq && d.jcdm2);

            if (!hasValidSchedule) {
                // 【新增】如果课程无法排入，尝试提取其周次信息
                let weeks = [];
                if (course.scheduleDetails && course.scheduleDetails.length > 0) {
                    weeks = course.scheduleDetails
                        .map(d => parseInt(d.zc, 10))
                        .filter(w => !isNaN(w));
                }
                const uniqueWeeks = [...new Set(weeks)];
                const formattedWeeks = uniqueWeeks.length > 0 ? formatWeeks(uniqueWeeks) : '';

                unplacedCourses.push({
                    name: course.kcmc,
                    teacher: course.teaxm,
                    reason: '无有效的星期/节次信息',
                    weeks: formattedWeeks // 存储格式化后的周次
                });
                unplacedCourseNames.add(course.kcmc);
            }
        });

        if (unplacedCourses.length > 0) {
            const unplacedContainer = shadowRoot.getElementById('unplaced-courses-section');
            const containerDiv = document.createElement('div');
            containerDiv.id = 'unplaced-courses-container-custom';
            let unplacedHtml = '<h3>无法自动排入课表的课程</h3><ul>';
            unplacedCourses.forEach(course => {
                // 【修改】在显示时，检查并附加周次信息
                const weekInfo = course.weeks ? `<span class="week-info"> (周次: ${course.weeks})</span>` : '';
                unplacedHtml += `<li><strong>${course.name}</strong> (${course.teacher}) - 原因: ${course.reason}${weekInfo}</li>`;
            });
            unplacedHtml += '</ul>';
            containerDiv.innerHTML = unplacedHtml;
            unplacedContainer.appendChild(containerDiv);
        }

        // --- 5.2 计算最大周数并设置周次选择器 ---
        let maxWeek = 0;
        allCourseData.forEach(course => {
            course.scheduleDetails?.forEach(detail => {
                const weekNum = parseInt(detail.zc, 10);
                if (!isNaN(weekNum) && weekNum > maxWeek) {
                    maxWeek = weekNum;
                }
            });
        });
        if (maxWeek === 0) maxWeek = 20;

        const weekSelectorContainer = shadowRoot.getElementById('week-selector-container');
        const weekSelect = shadowRoot.getElementById('week-select-custom');
        const prevBtn = shadowRoot.getElementById('prev-week-btn');
        const nextBtn = shadowRoot.getElementById('next-week-btn');

        weekSelect.innerHTML = '';
        for (let i = 1; i <= maxWeek; i++) {
            weekSelect.add(new Option(`第 ${i} 周`, i));
        }

        shadowRoot.allCourseData = allCourseData;
        shadowRoot.maxWeek = maxWeek;

        weekSelect.onchange = () => {
            const selectedWeek = parseInt(weekSelect.value, 10);
            displayWeek(selectedWeek, shadowRoot);
        };
        prevBtn.onclick = () => {
            let currentWeek = parseInt(weekSelect.value, 10);
            if (currentWeek > 1) {
                currentWeek--;
                weekSelect.value = currentWeek;
                displayWeek(currentWeek, shadowRoot);
            }
        };
        nextBtn.onclick = () => {
            let currentWeek = parseInt(weekSelect.value, 10);
            if (currentWeek < shadowRoot.maxWeek) {
                currentWeek++;
                weekSelect.value = currentWeek;
                displayWeek(currentWeek, shadowRoot);
            }
        };

        weekSelectorContainer.style.display = 'flex';
        displayWeek(1, shadowRoot);
    }

    // --- 6. 根据指定周次显示课表的函数 ---
    function displayWeek(week, shadowRoot) {
        const allCourseData = shadowRoot.allCourseData;
        const displayDiv = shadowRoot.getElementById('schedule-display-area');
        displayDiv.innerHTML = '';

        const scheduleMatrix = Array(6).fill(0).map(() => Array(7).fill(0).map(() => []));
        const processedClasses = new Set();

        allCourseData.forEach(course => {
            if (!course.scheduleDetails) return;

            const weeklyDetails = course.scheduleDetails.filter(d => parseInt(d.zc, 10) === week);

            if (weeklyDetails.length > 0) {
                 weeklyDetails.forEach(detail => {
                    if (!detail.xq || !detail.jcdm2) return;

                    const day = parseInt(detail.xq, 10) - 1;
                    const periods = detail.jcdm2.split(',').map(p => parseInt(p, 10));
                    const classKey = `${course.kcmc}_${detail.teaxms}_${detail.jxcdmc}_${day}_${periods.join(',')}`;

                    if (!processedClasses.has(classKey)) {
                        const rowMap = { 1:0, 2:0, 3:1, 4:1, 5:2, 6:2, 7:3, 8:3, 9:4, 10:4, 11:5, 12:5 };
                        const rowIndex = rowMap[periods[0]];
                        if (rowIndex !== undefined && day >= 0 && day < 7) {
                            scheduleMatrix[rowIndex][day].push({
                                name: course.kcmc,
                                teacher: detail.teaxms,
                                location: detail.jxcdmc,
                            });
                            processedClasses.add(classKey);
                        }
                    }
                });
            }
        });

        const table = document.createElement('table');
        table.id = 'schedule-table-custom';
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        ['时间', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'].forEach(h => headerRow.insertCell().textContent = h);

        const tbody = table.createTBody();
        const timeSlots = [
            { label: '上午 1-2节', time: '08:00-09:35' }, { label: '上午 3-4节', time: '09:55-11:30' },
            { label: '下午 5-6节', time: '13:30-15:05' }, { label: '下午 7-8节', time: '15:25-17:00' },
            { label: '晚上 9-10节', time: '18:00-19:35' }, { label: '晚上 11-12节', time: '19:55-21:30' },
        ];

        for (let i = 0; i < 6; i++) {
            const row = tbody.insertRow();
            row.insertCell().innerHTML = `<div class="time-header">${timeSlots[i].label}</div><div class="time-details">${timeSlots[i].time}</div>`;
            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();
                const coursesInCell = scheduleMatrix[i][j];

                if (coursesInCell.length > 0) {
                    if (coursesInCell.length > 1) cell.classList.add('has-conflict');
                    coursesInCell.forEach((course, index) => {
                        const courseDiv = document.createElement('div');
                        courseDiv.className = 'course-block';
                        const colors = generateColor(course.name);
                        courseDiv.style.backgroundColor = colors.background;
                        courseDiv.style.color = colors.font;

                        courseDiv.innerHTML = `
                            <div class="course-item">${course.name}</div>
                            <div class="teacher-item">${course.teacher}</div>
                            <div class="location-item">@ ${course.location}</div>`;
                        cell.appendChild(courseDiv);

                        if (coursesInCell.length > 1 && index < coursesInCell.length - 1) {
                            const separator = document.createElement('hr');
                            separator.className = 'conflict-separator';
                            cell.appendChild(separator);
                        }
                    });
                }
            }
            if (i === 1 || i === 3) {
                const breakRow = tbody.insertRow();
                const breakCell = breakRow.insertCell();
                breakCell.colSpan = 8;
                breakCell.className = 'break-cell';
                breakCell.textContent = '————';
            }
        }
        displayDiv.appendChild(table);
        displayDiv.insertAdjacentHTML('beforeend', `<div style="padding-top: 5px;"><small>注：根据 学习任务 生成，具体请以学校通知为准。当前仅显示第 ${week} 周课程。</small></div>`);

        updateWeekControls(week, shadowRoot);
    }

    // --- 7. 更新周次选择控件状态的函数 ---
    function updateWeekControls(currentWeek, shadowRoot) {
        const weekSelect = shadowRoot.getElementById('week-select-custom');
        const prevBtn = shadowRoot.getElementById('prev-week-btn');
        const nextBtn = shadowRoot.getElementById('next-week-btn');
        const maxWeek = shadowRoot.maxWeek;

        weekSelect.value = currentWeek;
        prevBtn.disabled = (currentWeek <= 1);
        nextBtn.disabled = (currentWeek >= maxWeek);
    }

    // --- 8. 格式化周数显示的辅助函数 ---
    function formatWeeks(weeks) {
        if (!weeks || weeks.length === 0) return '';
        if (weeks.length === 1) return `${weeks[0]}`;

        weeks.sort((a, b) => a - b);
        const ranges = [];
        let start = weeks[0];
        let end = weeks[0];

        for (let i = 1; i < weeks.length; i++) {
            if (weeks[i] === end + 1) {
                end = weeks[i];
            } else {
                ranges.push(start === end ? `${start}` : `${start}-${end}`);
                start = end = weeks[i];
            }
        }
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        return ranges.join(',');
    }

})();
