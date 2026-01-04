// ==UserScript==
// @name         大管加资源占用视角任务甘特图显示
// @namespace    http://tampermonkey.net/
// @version      V1.4
// @description  优化对不同普通任务的适配
// @author       月夜箫声
// @match        https://www.erplus.co/web/pc-link/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.erplus.co
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/541426-大管加资源占用视角任务甘特图显示
// @downloadURL https://update.greasyfork.org/scripts/541426/%E5%A4%A7%E7%AE%A1%E5%8A%A0%E8%B5%84%E6%BA%90%E5%8D%A0%E7%94%A8%E8%A7%86%E8%A7%92%E4%BB%BB%E5%8A%A1%E7%94%98%E7%89%B9%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/541426/%E5%A4%A7%E7%AE%A1%E5%8A%A0%E8%B5%84%E6%BA%90%E5%8D%A0%E7%94%A8%E8%A7%86%E8%A7%92%E4%BB%BB%E5%8A%A1%E7%94%98%E7%89%B9%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        #ganttContainer {
            position: fixed;
            top: 0px;
            right: 0px;
            width: 100%;
            height: 100vh;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            z-index: 9999;
            overflow: auto;
            font-family: Arial, sans-serif;
            display: none;
            font-size: 12px;
        }
        #ganttHeader {
            display: block;
            position: fixed;
            height: 40px;
            top: 0px;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding-bottom: 5px;
            padding-top: 10px;
        }
        #ganttTitle {
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
        .close-btn {
            position: fixed;
            top: 30px;
            right: 10px;
            padding: 8px 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* 基础阴影 */
        }
        .close-btn:hover {
            color: #f44336;
        }
        #ganttControls {
            display: block;
            position: fixed;
            height: 25px;
            top: 40px;
            gap: 8px;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        .control-btn {
            padding: 4px 8px;
            margin-right: 10px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .control-btn:hover {
            background: #e0e0e0;
        }
        .control-btn.active {
            background: #4CAF50;
            color: white;
            border-color: #388E3C;
        }
        .selectAssignee {
            background: #f5f5f5;
            padding: 5px 8px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .dateSelect{
            margin: 0px 10px;
            padding: 2px;
            border: 1px solid #ccc;
            borderRadius: 3px;
            width: 120px;
        }
        .fetchBtn{
                padding: 5px 12px;
                background-color: #5cb3cc;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                z-index: 9999;
                font-size: 12px;
                box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 基础阴影 */
        }
        .dateText{
        font-size: 12px;
        }
        #ganttView {
            position: fixed;
            display: block;
            /*height: 25px;*/
            top: 70px;
            width: 100%;
            height: calc(100vh - 70px);
            overflow: auto;
        }
        .gantt-table {
            border-collapse: collapse;
            max-width: 10000%;
            /*min-width: 800px;*/
            background: white;
            /*table-layout: fixed;*/
        }
        .gantt-table th {
            background: #f0f4f8;
            padding: 5px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            position: sticky;
            top: 0;
            z-index: 10;
            font-weight: bold;
            /*overflow: hidden;*/
            text-overflow: ellipsis;
        }
        .gantt-table td {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            vertical-align: middle;
            height: 28px;
            /*position: relative;*/
        }
        .task-bar {
            /*height: 20px;*/
            border-radius: 3px;
            background: #64B5F6;
            display: flex;
            align-items: center;
            padding: 0 4px;
            color: white;
            font-size: 12px;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* 基础阴影 */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            position: absolute;
            top: 2px;
            bottom: 2px;
            z-index: 2;
        }
        .task-bar.priority-high {
            background: linear-gradient(90deg, #ad6598, #a35c8f);
        }
        .task-bar.priority-medium {
            background: linear-gradient(90deg, #FF5252, #FF1744);
        }
        .task-bar.priority-low {
            background: linear-gradient(90deg, #FFB74D, #FF9800);
        }
        .task-bar.completed {
            background: linear-gradient(90deg, #81C784, #4CAF50);
        }
        .assignee-cell {
            background: #e3f2fd;
            font-weight: bold;
            font-size:12px;
            text-align: center;
            position: sticky;
            left: 0;
            z-index: 12;
            /*border-right: 1px solid #ddd;*/
            box-shadow: 1px 0 0 0 #ddd inset;
            width: 60px !important;
            min-width: 60px !important;
        }
        .project-cell {
            background: #e8f5e9;
            text-align: center;
            position: sticky;
            left: 60px;
            z-index: 11;
            /*border-right: 1px solid #ddd;*/
            box-shadow: 1px 0 0 0 #ddd inset;
            width: 140px !important;
            min-width: 140px !important;
            line-height: 1.2;
        }
        .date-header- {
            width: 80px;
            text-align: center;
            /*border-right: 1px solid #ddd;*/
            box-shadow: 1px 0 0 0 #ddd inset;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .date-header-weekend {
            width: 80px;
            background: #f0c9cf !important;
            text-align: center;
            /*border-right: 1px solid #e0e0e0;*/
            box-shadow: 1px 0 0 0 #ddd inset;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .date-header-today {
            width: 80px;
            background: #f8d86a !important;
            text-align: center;
            /*border-right: 1px solid #e0e0e0;*/
            box-shadow: 1px 0 0 0 #ddd inset;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .date-label-primary{
            width: 70px;
            margin: 0 auto;
        }
        .date-label-secondary{
            width: 70px;
            margin: 0 auto;
        }
        .timeline-cell {
            padding: 0 !important;
            overflow: hidden;
            /*border-right: 1px solid #f0f0f0;*/
            box-shadow: 1px 0 0 0 #ddd inset;
        }
        .timeline-cell:last-child {
            border-right: none;
        }
        .timeline-container {
            position: relative;
            overflow: hidden;
            height: 100%;
            width: 100%;
        }
        .time-scale {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
        }
        .time-segment {
            flex: 1;
            border-right: 1px dashed #e0e0e0;
            position: relative;
        }
        .time-label {
            position: absolute;
            top: -20px;
            font-size: 9px;
            color: #666;
            white-space: nowrap;
        }
        .month-header {
            text-align: center;
            font-weight: bold;
            background: #e8f5e9;
            font-size: 11px;
        }
        .today-marker {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #F44336;
            z-index: 2;
        }
        .tooltip_cont {
            position: absolute;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 100;
            max-width: 300px;
            pointer-events: none;
            display: none;
            line-height: 1.4;
        }
        .no-tasks {
            padding: 10px;
            text-align: center;
            color: #757575;
            font-style: italic;
            font-size: 12px;
        }
        .compact-row {
            height: 15px !important;
            max-height: 15px !important;
        }
        .task-name {
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .row-highlight {
            background-color: #f5f5f5 !important;
        }
        .error-message {
            color: red;
            padding: 10px;
            text-align: center;
            font-weight: bold;
        }

        @media (max-width: 1600px) {
            .date-header { min-width: 30px; }
            .task-bar { font-size: 12px; }
        }
        @media (max-width: 1400px) {
            .date-header { min-width: 25px; }
        }
    `);
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout); // 清除之前的定时器
            timeout = setTimeout(() => {
                func.apply(this, args); // 执行函数
            }, wait); // 等待一段时间后执行
        };
    }
    // 创建甘特图容器
    const ganttContainer = document.createElement('div');
    ganttContainer.id = 'ganttContainer';

    // 创建甘特图头部
    const ganttHeader = document.createElement('div');
    ganttHeader.id = 'ganttHeader';

    const ganttTitle = document.createElement('div');
    ganttTitle.id = 'ganttTitle';
    ganttTitle.textContent = '任务甘特图';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '关闭';
    closeBtn.onclick = () => {
        ganttContainer.style.display = 'none';
    };

    ganttHeader.appendChild(ganttTitle);
    ganttHeader.appendChild(closeBtn);
    ganttContainer.appendChild(ganttHeader);

    // 创建控制面板
    const controls = document.createElement('div');
    controls.id = 'ganttControls';

    const dayBtn = document.createElement('button');
    dayBtn.className = 'control-btn active';
    dayBtn.textContent = '日视图';
    dayBtn.dataset.view = 'day';

    const weekBtn = document.createElement('button');
    weekBtn.className = 'control-btn';
    weekBtn.textContent = '周视图';
    weekBtn.dataset.view = 'week';

    const monthBtn = document.createElement('button');
    monthBtn.className = 'control-btn';
    monthBtn.textContent = '月视图';
    monthBtn.dataset.view = 'month';

    controls.appendChild(dayBtn);
    controls.appendChild(weekBtn);
    controls.appendChild(monthBtn);
    ganttContainer.appendChild(controls);

    // 创建甘特图视图容器
    const ganttView = document.createElement('div');
    ganttView.id = 'ganttView';
    ganttContainer.appendChild(ganttView);

    // 创建工具提示
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip_cont';
    ganttContainer.appendChild(tooltip);

    // 添加到页面
    document.body.appendChild(ganttContainer);

    // 创建小球容器
    const ballContainer = document.createElement('div');
    ballContainer.textContent = '展/收';
    ballContainer.style.cssText = `
    position: fixed;
    top: 50%;
    text-align: center;
    line-height: 40px;
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: white;
    right: -40px;
    width: 50px;
    height: 40px;
    background: linear-gradient(90deg, #f8d86a, #ebb10d);
    box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.3); /* 基础阴影 */
    border-radius: 20px 0 0 20px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: right 0.3s;
`;

    // 创建展开后的容器
    const expandedContainer = document.createElement('div');
    expandedContainer.style.cssText = `
    position: fixed;
    top: 50%;
    right: -200px; // 默认收起
    width: 200px;
    padding: 8px 12px;
    background: linear-gradient(90deg, #11659a, #144a74);
    box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.3); /* 基础阴影 */
    color: white;
    border-radius: 10px;
    z-index: 9999;
    font-size: 12px;
    transition: right 0.3s, visibility 0.3s, opacity 0.3s;
    visibility: hidden; // 默认隐藏
    opacity: 0; // 默认透明
`;

    // 设置默认值为今日日期
    let nowToday = new Date();
    let year = nowToday.getFullYear();
    let month = String(nowToday.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    let day = String(nowToday.getDate()).padStart(2, '0');
    // 创建开始日期输入框
    const startDateLabel = document.createElement('label');
    startDateLabel.textContent = '开始日期: ';
    startDateLabel.className = 'dateText';
    startDateLabel.htmlFor = 'startDate';
    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'startDate';
    startDateInput.className = 'dateSelect';
    startDateInput.value = `${year}-${month}-${day}`;

    nowToday.setDate(nowToday.getDate() + 30);
    year = nowToday.getFullYear();
    month = String(nowToday.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    day = String(nowToday.getDate()).padStart(2, '0');
    // 创建结束日期输入框
    const endDateLabel = document.createElement('label');
    endDateLabel.textContent = '结束日期: ';
    endDateLabel.className = 'dateText';
    endDateLabel.htmlFor = 'endDate';
    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'endDate';
    endDateInput.className = 'dateSelect';
    endDateInput.value = `${year}-${month}-${day}`;

    // 创建获取数据按钮
    const fetchBtn = document.createElement('button');
    fetchBtn.id = 'fetchDataBtn';
    fetchBtn.className = 'fetchBtn';
    fetchBtn.textContent = '显示甘特图';

    // 将元素添加到展开后的容器中
    expandedContainer.appendChild(startDateLabel);
    expandedContainer.appendChild(startDateInput);
    expandedContainer.appendChild(endDateLabel);
    expandedContainer.appendChild(endDateInput);
    expandedContainer.appendChild(fetchBtn);

    // 将展开后的容器添加到网页的 body 中
    document.body.appendChild(expandedContainer);

    // 将小球容器添加到网页的 body 中
    document.body.appendChild(ballContainer);

    // 在创建元素后添加全局点击事件监听
    document.addEventListener('click', function(event) {
        // 检查点击是否发生在展开容器或小球内部
        const isClickInside = expandedContainer.contains(event.target) ||
              ballContainer.contains(event.target);

        // 如果点击发生在外部且当前是展开状态，则收起容器
        if (isExpanded && !isClickInside) {
            expandedContainer.style.right = '-500px';
            expandedContainer.style.visibility = 'hidden';
            expandedContainer.style.opacity = '0';
            ballContainer.style.right = '-40px';
            isExpanded = false;
        }
    });

    // 使用防抖函数处理鼠标悬停事件
    const handleMouseOver = debounce(() => {
        ballContainer.style.right = '0'; // 小球向左滑动，露出部分
    }, 10); // 等待 100 毫秒后执行，避免频繁触发

    const handleMouseOut = debounce(() => {
        ballContainer.style.right = '-40px'; // 小球回到原位
    }, 10); // 等待 100 毫秒后执行，避免频繁触发

    // 小球的鼠标悬停和离开事件
    ballContainer.addEventListener('mouseover', handleMouseOver); // 使用 mouseover
    ballContainer.addEventListener('mouseout', handleMouseOut); // 使用 mouseout

    // 小球的点击事件：展开后的容器显示，小球隐藏
    let isExpanded = false; // 用于跟踪展开状态
    ballContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到document
        if (!isExpanded) { // 如果当前未展开
            expandedContainer.style.right = '0'; // 展开容器
            expandedContainer.style.visibility = 'visible'; // 显示容器
            expandedContainer.style.opacity = '1'; // 不透明
            ballContainer.style.right = '-40px'; // 小球继续向左滑动，完全隐藏
            isExpanded = true; // 标记为已展开
        } else { // 如果当前已展开，点击则收起
            expandedContainer.style.right = '-500px'; // 收起容器
            expandedContainer.style.visibility = 'hidden'; // 隐藏容器
            expandedContainer.style.opacity = '0'; // 透明
            ballContainer.style.right = '0'; // 小球回到原位
            isExpanded = false; // 标记为未展开
        }
    });

    // 小球的拖拽事件
    let isDragging = false;
    let offsetY = 0;
    ballContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetY = e.clientY - ballContainer.offsetTop; // 计算偏移量
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newTop = e.clientY - offsetY; // 计算新的位置
            ballContainer.style.top = newTop + 'px'; // 更新位置
            expandedContainer.style.top = newTop + 'px'; // 同步展开后的容器位置
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false; // 停止拖拽
    });

    // 全局变量
    let tasksData = [];
    let contactsData = [];
    let projectsMap = new Map();
    let currentView = 'day';
    // 创建用户字典，id:用户信息完整字典
    const contactMap = new Map();
    // 设置天颗粒度表头宽度
    let dayHeaderWidth = 80;
    // 设置周颗粒度表头宽度
    let weekHeaderWidth = 200;
    // 设置月颗粒度表头宽度
    let monthHeaderWidth = 400;
    var startDate,endDate
    var minDate,maxDate,MINDATE,MAXDATE

    // 计算传入两个日期的天数差
    function daysBetween(date1, date2) {
        // 确保输入是Date对象
        if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
            throw new Error('Input must be Date objects');
        }

        // 将两个日期的时间部分重置为0
        const startDate = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const endDate = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

        // 计算两个日期之间的毫秒差值的绝对值
        const diff = Math.abs(startDate.getTime() - endDate.getTime());

        // 将毫秒差值转换为天数并四舍五入到最接近的整数
        const daysDiff = Math.round(diff / (24 * 60 * 60 * 1000));

        return daysDiff;
    }

    // 判断日期是否为今日
    function isToday(someDate) {
        const today = new Date();
        if (currentView === 'day') {
            return (
                someDate.getFullYear() === today.getFullYear() &&
                someDate.getMonth() === today.getMonth() &&
                someDate.getDate() === today.getDate()
            );
        } else if (currentView === 'week') {
            const day = today.getDay()
            const today_temp = today.getDate() - day + (day === 0 ? -6 : 1);
            today.setDate(today_temp)
            return (
                someDate.getFullYear() === today.getFullYear() &&
                someDate.getMonth() === today.getMonth() &&
                someDate.getDate() === today.getDate()
            );
        } else if (currentView === 'month') {
            return someDate.getMonth()===today.getMonth()
        }
    }

    // 从 cookie 中获取 token
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // 获取联系人数据（增强错误处理）
    function fetchContacts(token) {
        return new Promise((resolve, reject) => {
            const url = 'https://www.erplus.co/api/v1/contacts?hasDeleted=1';

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*',
                    'DNT': '1',
                    'Referer': window.location.href
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const contacts = JSON.parse(response.responseText);
                            resolve(contacts);
                        } catch (e) {
                            reject('联系人数据解析失败: ' + e.message);
                        }
                    } else {
                        reject(`联系人请求失败，状态码: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('网络错误: ' + error);
                }
            });
        });
    }

    // 获取任务数据（增强错误处理）
    function fetchTasks(token,startDate,endDate) {
        return new Promise((resolve, reject) => {
            const url = `https://www.erplus.co/task/v1/programs/resources?type=0&state=2&startDate=${startDate}&endDate=${endDate}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*',
                    'DNT': '1',
                    'Referer': window.location.href
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.erpCode === "000") {
                                resolve(data.erpData);
                            } else {
                                reject(`任务请求失败: ${data.erpMsg}`);
                            }
                        } catch (e) {
                            reject('任务数据解析失败: ' + e.message);
                        }
                    } else {
                        reject(`任务请求失败，状态码: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('网络错误: ' + error);
                }
            });
        });
    }

    // 获取元素引用
    // 注意：这里需要再次获取，因为元素是在上面代码中创建并添加到DOM的
    const scriptStartDateInput = document.getElementById('startDate');
    const scriptEndDateInput = document.getElementById('endDate');
    // 按钮点击事件
    fetchBtn.addEventListener('click', async function() {
        startDate = scriptStartDateInput.value;
        endDate = scriptEndDateInput.value;

        // 检查用户是否选择了日期
        if (!startDate) {
            alert('请选择开始日期！');
            return;
        }
        if (!endDate) {
            alert('请选择结束日期！');
            return;
        }

        // 验证日期范围是否有效
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        if (startDateTime > endDateTime) {
            alert('开始日期不能晚于结束日期！请重新选择。');
            return;
        }
        minDate = startDateTime
        maxDate = endDateTime
        MINDATE = minDate
        MAXDATE = maxDate
        fetchBtn.textContent = '加载中...';
        fetchBtn.disabled = true;

        // 清空前一次的渲染结果
        ganttView.innerHTML = '';

        const loadingText = document.createElement('div');
        loadingText.textContent = '加载中，请稍候...';
        loadingText.style.textAlign = 'center';
        loadingText.style.padding = '20px';
        ganttView.appendChild(loadingText);

        // 获取 token
        const token = getCookie('token');

        if (!token) {
            alert('未找到 token，请先登录');
            resetButton();
            ganttView.innerHTML = '<div class="error-message">未找到token，请先登录</div>';
            return;
        }

        try {
            // 并行获取联系人和任务数据
            [contactsData, tasksData] = await Promise.all([
                fetchContacts(token),
                fetchTasks(token,startDate,endDate)
            ]);

            // 处理任务数据
            processTasks();

            // 显示甘特图
            renderGanttChart();
            ganttContainer.style.display = 'block';

        } catch (error) {
            console.error('加载失败:', error);
            ganttView.innerHTML = `<div class="error-message">加载失败: ${error}</div>`;
        } finally {
            resetButton();
            // **关键部分**：数据加载完成后，隐藏展开后的容器并显示小球
            expandedContainer.style.right = '-500px'; // 收起容器
            expandedContainer.style.visibility = 'hidden'; // 隐藏容器
            expandedContainer.style.opacity = '0'; // 透明
            ballContainer.style.right = '-30px'; // 小球回到原位显示在侧边栏
            isExpanded = false; // 标记为未展开状态
        }
    });

    // 重置按钮状态
    function resetButton() {
        fetchBtn.textContent = '显示甘特图';
        fetchBtn.disabled = false;
    }

    // 处理任务数据
    function processTasks() {
        if (contactsData && Array.isArray(contactsData)) {
            contactsData.forEach(contact => {
                // 用户数据存在且有id值
                if (contact && contact.id) {
                    contactMap.set(contact.id, contact);
                }
            });
        }

        // 创建项目映射表
        projectsMap.clear(); // projectsMap{项目ID:项目名称}
        if (tasksData && Array.isArray(tasksData)) {
            tasksData.forEach(task => {
                if (task && task.programId && task.showPrefix) {
                    projectsMap.set(task.programId, task.showPrefix);
                }else if (task && task.programId===0) {
                    projectsMap.set(task.programId, '普通任务');
                }

                // 添加负责人信息
                if (task.assignerId) {
                    task.assigner = contactMap.get(task.assignerId) || null;
                }

                // 创建任务开始日期对象（带校验）
                if (task.firstStartTime) {
                    try {
                        task.startDateObj = new Date(task.firstStartTime);
                        if (isNaN(task.startDateObj.getTime())) {
                            task.startDateObj = null;
                        }
                    } catch (e) {
                        task.startDateObj = null;
                    }
                } else {
                    task.startDateObj = null;
                }
                // 创建任务截止日期对象（带校验）
                if (task.dueTime) {
                    try {
                        task.endDateObj = new Date(task.dueTime);
                        if (isNaN(task.endDateObj.getTime())) {
                            task.endDateObj = null;
                        }
                    } catch (e) {
                        task.endDateObj = null;
                    }
                } else {
                    task.endDateObj = null;
                }
            });
        }
    }


    // 优化时间轴标签格式
    function formatDateLabel(date, viewType, isSecondary = false) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if (viewType === 'day') {
            if (isSecondary) {
                // 返回日期
                return `${day}`;
            } else {
                // 返回年月
                return `${year}年${month}月`;
            }
        } else if (viewType === 'week') {
            if (isSecondary) {
                // 返回周一到周日的日期范围
                const weekEnd = new Date(date);
                weekEnd.setDate(date.getDate() + 6);
                return `${date.getDate()}-${weekEnd.getDate()}`;
            } else {
                // 返回年月
                return `${year}年${month}月`;
            }
        } else if (viewType === 'month') {
            if (isSecondary) {
                // 返回月份
                return `${month}月`;
            } else {
                // 返回年份
                return `${year}年`;
            }
        }
        return '';
    }

    // 生成时间轴表头
    function generateDateHeaders(minDate, maxDate) {
        const headers = [];
        // 设定起始日期
        let currentDate = new Date(minDate);

        // 重置为周一开始
        if (currentView === 'week') {
            // 获取最小日期是星期几
            const day = currentDate.getDay();
            // 确保每周从周一开始
            const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
            currentDate.setDate(diff);
            minDate.setDate(diff);
            //console.log('周处理-开始日期改为:', minDate);
        }else if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth(),1);
            minDate.setMonth(minDate.getMonth(),1);
            //console.log('月处理-开始日期改为:', minDate);
        }

        // 生成日期范围
        while (currentDate <= maxDate) {
            const date = new Date(currentDate);

            if (currentView === 'day') {
                headers.push({
                    date: new Date(date),
                    primaryLabel: formatDateLabel(date, 'day'), // 顶部显示年月
                    secondaryLabel: formatDateLabel(date, 'day', true),// 底部显示日期
                    isWeekend: date.getDay() === 0 || date.getDay() === 6,
                    isToday:isToday(date),
                });
                // 更新起始日期
                currentDate.setDate(currentDate.getDate() + 1);
            }
            else if (currentView === 'week') {
                headers.push({
                    date: new Date(date),
                    primaryLabel: formatDateLabel(date, 'week'),
                    secondaryLabel: formatDateLabel(date, 'week', true),
                    isWeekend: false,
                    isToday:isToday(date),
                });
                // 更新起始日期，同时更新 maxDate
                const nextWeek = new Date(currentDate);
                nextWeek.setDate(currentDate.getDate() + 7);
                if (nextWeek > maxDate) {
                    // 如果下一周的第一天超过了 maxDate，更新 maxDate 为当前周的最后一天
                    //maxDate = new Date(currentDate);
                    maxDate.setDate(currentDate.getDate() + 6); // 设置为当前周的最后一天
                    //console.log('周处理-结束日期改为:', maxDate);
                }
                currentDate.setDate(currentDate.getDate() + 7);
            }
            else if (currentView === 'month') {
                headers.push({
                    date: new Date(date),
                    primaryLabel: formatDateLabel(date, 'month'),
                    secondaryLabel: formatDateLabel(date, 'month', true),
                    isWeekend: false,
                    isToday:isToday(date),
                });
                // 更新起始日期，同时更新 maxDate
                const nextMonth = new Date(currentDate);
                nextMonth.setMonth(currentDate.getMonth() + 1);
                if (nextMonth > maxDate) {
                    // 如果下个月的第一天超过了 maxDate，更新 maxDate 为当前月的最后一天
                    maxDate.setMonth(currentDate.getMonth()+1, 0); // 设置为当前月的最后一天
                    //console.log('月处理-结束日期改为:', maxDate);
                }
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
        return headers;
    }
    var elementCreated = false;

    // 渲染甘特图
    function renderGanttChart() {
        ganttView.innerHTML = ''; // 清除加载中提示

        minDate = new Date(minDate);
        maxDate = new Date(maxDate);
        let totalDuration // 用于计算总时长

        // 按负责人分组,将该负责人所有负责任务遍历出来放到tasks列表里，再与负责人名绑定，放到tasksByAssignee字典里{负责人ID:{assignee:负责人名，tasks:[任务列表]}}
        const tasksByAssignee = new Map();
        const optionAssignee = new Array();
        if (tasksData && Array.isArray(tasksData)) {
            tasksData.forEach(task => {
                if (task.assignerId) {
                    const assigneeId = task.assignerId;
                    if (!tasksByAssignee.has(assigneeId)) {
                        optionAssignee.push({value:task.assigner.name,text:task.assigner.name})
                        tasksByAssignee.set(assigneeId, {
                            assignee: task.assigner,
                            tasks: []
                        });
                    }

                    tasksByAssignee.get(assigneeId).tasks.push(task);
                }
            });
        }

        // 如果没有任务
        if (tasksByAssignee.size === 0) {
            const noTasks = document.createElement('div');
            noTasks.className = 'no-tasks';
            noTasks.textContent = '没有找到任务数据';
            ganttView.appendChild(noTasks);
            return;
        }

        // 创建<select>元素
        if (!elementCreated) {
            const selectElement = document.createElement('select');
            selectElement.className = 'selectAssignee';
            elementCreated = true;
            selectElement.setAttribute('name', 'exampleSelect'); // 设置名称属性（可选）
            // 添加change事件监听器
            selectElement.addEventListener('change', function() {
                // 当用户改变选择时执行的代码
                renderGanttChart();
            });

            // 遍历选项列表并创建<option>元素
            optionAssignee.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', option.value); // 设置值属性
                optionElement.textContent = option.text; // 设置显示文本
                selectElement.appendChild(optionElement); // 将<option>添加到<select>中
            });

            // 将生成的<select>元素添加到页面的指定位置（例如body中）
            controls.appendChild(selectElement);
        }


        // 创建甘特图表格
        const table = document.createElement('table');
        table.className = 'gantt-table';

        // 创建表头行
        // const headerRow = document.createElement('tr');
        // 创建表头 - 第一行 (年月/年)
        const yearHeaderRow = document.createElement('tr');

        // 负责人表头
        const assigneeHeader = document.createElement('th');
        assigneeHeader.className = 'assignee-cell';
        assigneeHeader.textContent = '负责人';
        assigneeHeader.style='z-index: 21;'
        yearHeaderRow.appendChild(assigneeHeader);

        // 项目表头
        const projectHeader = document.createElement('th');
        projectHeader.className = 'project-cell';
        projectHeader.textContent = '项目';
        projectHeader.style='z-index: 20;'
        yearHeaderRow.appendChild(projectHeader);


        // 获取日期表头数据列表，列表里罗列所有范围内的日期字典
        // 字典格式{date: 日期,primaryLabel: 第一行年月,secondaryLabel: 第二行日期,isWeekend: 是否为周六日}
        const dateHeaders = generateDateHeaders(minDate, maxDate);
        // console.log('generateDateHeaders调用后开始日期:', minDate);
        // console.log('generateDateHeaders调用后结束日期:', maxDate);

        // 添加日期表头
        dateHeaders.forEach(header => {
            const dateCell = document.createElement('th');
            // 周六日、本日本周本月颜色特殊设定
            dateCell.className = `date-header-${header.isToday ? 'today' : header.isWeekend ? 'weekend' : ''}`;
            if (currentView==='day'){
                dateCell.style=`width:${dayHeaderWidth}px`
            } else if (currentView==='week'){
                dateCell.style=`width:${weekHeaderWidth}px`
            } else if (currentView==='month'){
                dateCell.style=`width:${monthHeaderWidth}px`
            }

            const primaryLabel = document.createElement('div');
            primaryLabel.className = 'date-label-primary';
            primaryLabel.textContent = header.primaryLabel;
            dateCell.appendChild(primaryLabel);

            const secondaryLabel = document.createElement('div');
            secondaryLabel.className = 'date-label-secondary';
            secondaryLabel.textContent = header.secondaryLabel;
            dateCell.appendChild(secondaryLabel);

            yearHeaderRow.appendChild(dateCell);
        });

        table.appendChild(yearHeaderRow);

        // 添加任务行
        let rowIndex = 0;

        // 遍历每个负责人,tasksByAssignee字典里{负责人ID:{assignee:负责人名，tasks:[任务列表]}}
        for (const [assigneeId, assigneeGroup] of tasksByAssignee) {
            const selectElement = document.querySelector('select[name="exampleSelect"]');
            const selectedValue = selectElement.value;
            if (assigneeGroup.assignee.name!==selectedValue){
                continue
            }
//             console.log('计算任务位置前开始日期:', minDate);
//             console.log('计算任务位置前结束日期:', maxDate);
            // 按项目分组任务
            const tasksByProject = new Map(); // tasksByProject字典里{项目ID:{projectName:项目名，tasks:[任务列表]}}
            if (assigneeGroup.tasks && Array.isArray(assigneeGroup.tasks)) {
                assigneeGroup.tasks.forEach(task => {
                    if (task) {//task.programId
                        const projectId = task.programId;
                        // projectsMap{项目ID:项目名称}
                        const projectName = projectsMap.get(projectId) || '未知项目';

                        if (!tasksByProject.has(projectId)) {
                            tasksByProject.set(projectId, {
                                projectName: projectName,
                                tasks: []
                            });
                        }

                        tasksByProject.get(projectId).tasks.push(task);
                    }
                });
            }

            // 计算负责人总行数
            const totalRowsForAssignee = Array.from(tasksByProject.values()).reduce(
                (total, project) => total + project.tasks.length, 0
            );

            // 创建负责人单元格（只创建一次）
            let assigneeCellCreated = false;

            // 遍历每个项目
            for (const [projectId, projectGroup] of tasksByProject) {
                // 获取该项目的所有任务列表
                const projectTasks = projectGroup.tasks;

                // 遍历项目中的每个任务
                for (let taskIndex = 0; taskIndex < projectTasks.length; taskIndex++) {
                    const task = projectTasks[taskIndex];
                    const taskRow = document.createElement('tr');
                    taskRow.className = 'compact-row';
                    if (rowIndex % 2 === 0) {
                        taskRow.classList.add('row-highlight');
                    }
                    // 负责人单元格 - 只在第一行创建
                    if (!assigneeCellCreated) {
                        const assigneeCell = document.createElement('td');
                        assigneeCell.className = 'assignee-cell';
                        assigneeCell.rowSpan = totalRowsForAssignee;
                        assigneeCell.textContent = assigneeGroup.assignee ? assigneeGroup.assignee.name : '未知';
                        if (assigneeGroup.assignee && assigneeGroup.assignee.departmentName) {
                            assigneeCell.innerHTML += `<div style="font-size:10px;color:#666;">${assigneeGroup.assignee.departmentName}</div>`;
                        }
                        taskRow.appendChild(assigneeCell);
                        assigneeCellCreated = true;
                    }

                    // 项目单元格 - 只在项目第一行创建
                    if (taskIndex === 0) {
                        const projectCell = document.createElement('td');
                        projectCell.className = 'project-cell';
                        projectCell.rowSpan = projectTasks.length;
                        projectCell.textContent = projectGroup.projectName;
                        taskRow.appendChild(projectCell);
                    }

                    // 时间轴单元格
                    const timelineCell = document.createElement('td');
                    timelineCell.className = 'timeline-cell';
                    timelineCell.colSpan = dateHeaders.length; // 占据整个时间轴区域

                    // 创建时间轴容器
                    const taskTimelineContainer = document.createElement('div');
                    taskTimelineContainer.className = 'timeline-container';
                    taskTimelineContainer.style.position = 'relative';
                    taskTimelineContainer.style.height = '100%';

                    // 添加时间刻度（背景）
                    const taskTimeScale = document.createElement('div');
                    taskTimeScale.className = 'time-scale';

                    dateHeaders.forEach(scale => {
                        const segment = document.createElement('div');
                        segment.className = 'time-segment';
                        segment.style.width = `${scale.position - (taskTimeScale.children.length > 0 ? dateHeaders[taskTimeScale.children.length - 1].position : 0)}%`;
                        segment.style.borderRight = '1px dashed #e0e0e0';
                        taskTimeScale.appendChild(segment);
                    });

                    taskTimelineContainer.appendChild(taskTimeScale);

                    // 添加任务条（带日期校验）
                    if (task.startDateObj instanceof Date &&
                        task.endDateObj instanceof Date &&
                        !isNaN(task.startDateObj.getTime()) &&
                        !isNaN(task.endDateObj.getTime())) {

                        // 计算任务位置
                        const taskStart = Math.max(task.startDateObj, minDate);
                        const taskEnd = Math.min(task.endDateObj, maxDate);
//                         console.log('计算任务位置后开始日期:', minDate);
//                         console.log('计算任务位置后结束日期:', maxDate);

                        const viewportWidth = document.documentElement.clientWidth;
//                         console.log('视口宽度:', viewportWidth);
                        var dateWidth = viewportWidth - 200
//                         console.log('时间范围初始宽度:', dateWidth);
                        const dateNum = dateHeaders.length
                        // console.log('时间格子数量:', dateNum);
                        const minHeaderWidth = 80
                        if (currentView==='day'){
                            if (dateNum*dayHeaderWidth<=dateWidth){
                                dateWidth = dateNum*dayHeaderWidth
                            }else{
                                dateWidth = dateNum*minHeaderWidth
                            }
                        } else if (currentView==='week'){
                            if (dateNum*weekHeaderWidth<=dateWidth){
                                dateWidth = dateNum*weekHeaderWidth
                            }else if (dateWidth/dateNum<minHeaderWidth){
                                dateWidth = dateNum*minHeaderWidth
                            }
                        } else if (currentView==='month'){
                            if (dateNum*monthHeaderWidth<=dateWidth){
                                dateWidth = dateNum*monthHeaderWidth
                            }else if (dateWidth/dateNum<minHeaderWidth){
                                dateWidth = dateNum*minHeaderWidth
                            }
                        }
                        // console.log('任务条计算前的范围开始日期:', minDate);
                        // console.log('任务条计算前的范围结束日期:', maxDate);
                        totalDuration = daysBetween(maxDate,minDate); // 更新周或月视图调整后的总时长
                        const startPercent = daysBetween(new Date(taskStart),minDate) / (totalDuration+1);
                        const widthPercent = (daysBetween(new Date(taskEnd),new Date(taskStart))+1) / (totalDuration+1);
                        // console.log('范围格子:', totalDuration);
                        // console.log('开始-最小:', daysBetween(new Date(taskStart),minDate));

                        // console.log('结束-最小:', daysBetween(new Date(taskEnd),minDate));
                        // console.log('长度格子:', widthPercent);
                        if (widthPercent > 0) {
                            const taskBar = document.createElement('div');
                            taskBar.className = 'task-bar';
                            taskBar.textContent = task.topic || '任务';
                            // console.log('任务名:', task.topic);
                            // console.log('时间范围计算后宽度:', dateWidth);
                            taskBar.style.left = `${startPercent*dateWidth}px`;
                            // console.log('任务起始点位置:', startPercent*dateWidth);
                            taskBar.style.width = `${widthPercent*dateWidth}px`;
                            // console.log('任务宽度:', widthPercent*dateWidth);

                            // 设置优先级样式
                            if (task.priority === 6) taskBar.classList.add('priority-high');
                            else if (task.priority === 5) taskBar.classList.add('priority-medium');
                            else if (task.priority === 4) taskBar.classList.add('priority-low');

                            // 设置完成状态
                            if (task.status === 3) taskBar.classList.add('completed');

                            // 添加悬停提示
                            taskBar.onmouseenter = (e) => {
                                let taskStatus
                                if (task.status === 1){
                                    taskStatus = '进行中'
                                } else if (task.status === 2){
                                    taskStatus = '执行中'
                                } else if (task.status === 3){
                                    taskStatus = '已完成'
                                }

                                tooltip.innerHTML = `
                                    <div><strong>${task.topic || '无任务名称'}</strong></div>
                                    <div>负责人: ${assigneeGroup.assignee ? assigneeGroup.assignee.name : '未知'}</div>
                                    <div>创建人: ${task.createId ? contactMap.get(task.createId).name : '未知'}</div>
                                    <div>项目: ${projectGroup.projectName}</div>
                                    <div>开始: ${task.firstStartTime || '未知'}</div>
                                    <div>结束: ${task.dueTime || '未知'}</div>
                                    <div>状态: ${taskStatus || '未知'}</div>
                                    <div>优先级: ${task.priority === 4 ? '重要' : task.priority === 5 ? '军令如山' : task.priority === 6 ? '覆水难收' : '普通'}</div>
                                    <div>进度: ${task.progress || 0}%</div>
                                `;
                                tooltip.style.display = 'block';
//                                 tooltip.style.left = `${e.clientX + 10}px`;
//                                 tooltip.style.top = `${e.clientY + 10}px`;
                                // 确保提示牌在视口范围内
                                updateTooltipPosition(e);
                            };

                            taskBar.onmouseleave = () => {
                                tooltip.style.display = 'none';
                            };

                            taskBar.onmousemove = (e) => {
//                                 tooltip.style.left = `${e.clientX + 10}px`;
//                                 tooltip.style.top = `${e.clientY + 10}px`;
                                updateTooltipPosition(e);
                            };
                            // 确保提示牌在视口范围内
                            function updateTooltipPosition(e) {
                                // 获取提示牌的尺寸
                                const tooltipRect = tooltip.getBoundingClientRect();
                                const tooltipWidth = tooltipRect.width;
                                const tooltipHeight = tooltipRect.height;

                                // 获取视口尺寸
                                const viewportWidth = window.innerWidth;
                                const viewportHeight = window.innerHeight;

                                // 计算默认位置（鼠标右下角）
                                let left = e.clientX + 10;
                                let top = e.clientY + 10;

                                // 水平方向：如果超出右边界，向左调整
                                if (left + tooltipWidth > viewportWidth) {
                                    left = e.clientX - tooltipWidth - 10;
                                }

                                // 垂直方向：如果超出下边界，向上调整
                                if (top + tooltipHeight > viewportHeight) {
                                    top = e.clientY - tooltipHeight - 10;
                                }

                                // 确保不会超出左边界
                                if (left < 0) {
                                    left = 10;
                                }

                                // 确保不会超出上边界
                                if (top < 0) {
                                    top = 10;
                                }

                                // 应用位置
                                tooltip.style.left = `${left}px`;
                                tooltip.style.top = `${top}px`;
                            }
                            taskTimelineContainer.appendChild(taskBar);
                        }
                    }

                    timelineCell.appendChild(taskTimelineContainer);
                    taskRow.appendChild(timelineCell);

                    table.appendChild(taskRow);
                    rowIndex++;
                }
            }

            ganttView.appendChild(table);
        }
//         // 添加今日标记
//         const today = new Date();
//         if (today >= minDate && today <= maxDate) {
//             const todayPercent = ((today - minDate) / totalDuration) * 100;

//             const todayMarker = document.createElement('div');
//             todayMarker.className = 'today-marker';
//             todayMarker.style.left = `${todayPercent}%`;
//             todayMarker.style.position = 'fixed';
//             todayMarker.style.top = '60px';
//             todayMarker.style.height = '100%';

//             const timelineContainer = ganttContainer.querySelector('#ganttView'); //.timeline-container
//             if (timelineContainer) {
//                 timelineContainer.appendChild(todayMarker);

//                 // 添加今日标签
//                 const todayLabel = document.createElement('div');
//                 todayLabel.textContent = '今日';
//                 todayLabel.style.position = 'fixed';
//                 todayLabel.style.top = '40px';
//                 todayLabel.style.left = `${todayPercent}%`;
//                 todayLabel.style.transform = 'translateX(-50%)';
//                 todayLabel.style.background = '#F44336';
//                 todayLabel.style.color = 'white';
//                 todayLabel.style.padding = '1px 6px';
//                 todayLabel.style.borderRadius = '8px';
//                 todayLabel.style.fontSize = '9px';
//                 timelineContainer.appendChild(todayLabel);
//             }
//        }

        // 添加缩放控制
//         const zoomContainer = document.createElement('div');
//         zoomContainer.style.marginTop = '10px';
//         zoomContainer.style.display = 'flex';
//         zoomContainer.style.alignItems = 'center';
//         zoomContainer.style.gap = '10px';

//         const zoomLabel = document.createElement('span');
//         zoomLabel.textContent = '缩放:';
//         zoomLabel.style.fontSize = '12px';
//         zoomContainer.appendChild(zoomLabel);

//         const zoomSlider = document.createElement('input');
//         zoomSlider.type = 'range';
//         zoomSlider.min = '50';
//         zoomSlider.max = '150';
//         zoomSlider.value = '100';
//         zoomSlider.style.width = '100px';
//         zoomSlider.addEventListener('input', function() {
//             const scale = this.value / 100;
//             table.style.transform = `scale(${scale})`;
//             table.style.transformOrigin = 'left top';
//         });
//         zoomContainer.appendChild(zoomSlider);

//         ganttView.appendChild(zoomContainer);
        minDate = MINDATE
        maxDate = MAXDATE
     }

    // 视图切换事件
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            renderGanttChart();
        });
    });
})();