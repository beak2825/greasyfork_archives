// ==UserScript==
// @name         Cool Papers Calendar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display a calendar showing paper reading progress on papers.cool/arxiv
// @author       WeiHongliang
// @match        https://papers.cool/arxiv/cs.CL,cs.LG,cs.AI,cs.CV*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535726/Cool%20Papers%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/535726/Cool%20Papers%20Calendar.meta.js
// ==/UserScript==
// 导航到特定进度
    function navigateToProgress(input) {
        console.log(`尝试导航到进度: ${input}`);

        // 获取总论文数
        const totalPapers = getTotalPapersCount();
        let targetPaperIndex = -1;

        // 检查输入是百分比还是论文序号
        if (input.includes('%')) {
            // 百分比输入
            const percent = parseInt(input.replace('%', ''));
            if (!isNaN(percent) && percent >= 0 && percent <= 100) {
                targetPaperIndex = Math.ceil(totalPapers * percent / 100);
                if (targetPaperIndex > 0) targetPaperIndex -= 1; // 转为0基索引
                console.log(`百分比 ${percent}% 对应论文索引: ${targetPaperIndex + 1}/${totalPapers}`);
            }
        } else {
            // 直接输入论文序号
            const paperNumber = parseInt(input);
            if (!isNaN(paperNumber) && paperNumber > 0 && paperNumber <= totalPapers) {
                targetPaperIndex = paperNumber - 1; // 转为0基索引
                console.log(`直接导航到论文: ${paperNumber}/${totalPapers}`);
            }
        }

        if (targetPaperIndex >= 0) {
            scrollToTargetPaper(targetPaperIndex + 1); // 转回1基索引进行导航
            return true; // 导航成功
        } else {
            if (input !== '0') { // 忽略导航到第0篇的警告
                alert(`请输入有效的进度值（1-${totalPapers}或0%-100%）`);
            }
            return false; // 导航失败
        }
    }

    // 滚动到目标论文位置
    function scrollToTargetPaper(targetNumber) {
        // 首先尝试查找目标论文元素
        let targetPaper = null;
        let allVisible = false;

        // 检查目标论文是否已加载
        function findTargetPaper() {
            const papers = document.querySelectorAll('.panel.paper');
            console.log(`当前已加载 ${papers.length} 篇论文`);

            for (const paper of papers) {
                const titleLink = paper.querySelector('a[title]');
                if (titleLink) {
                    const titleAttr = titleLink.getAttribute('title');
                    const match = titleAttr?.match(/(\d+)\/\d+/);
                    if (match && parseInt(match[1]) === targetNumber) {
                        targetPaper = paper;
                        console.log(`找到目标论文 #${targetNumber}:`, paper);
                        return true;
                    }
                }

                // 尝试通过索引元素找到目标
                const indexEl = paper.querySelector('.index');
                if (indexEl && indexEl.textContent.includes(`#${targetNumber}`)) {
                    targetPaper = paper;
                    console.log(`通过索引找到目标论文 #${targetNumber}:`, paper);
                    return true;
                }
            }

            // 检查是否所有论文都已加载
            const lastPaper = papers[papers.length - 1];
            if (lastPaper) {
                const titleLink = lastPaper.querySelector('a[title]');
                if (titleLink) {
                    const titleAttr = titleLink.getAttribute('title');
                    const match = titleAttr?.match(/(\d+)\/(\d+)/);
                    if (match && parseInt(match[1]) === parseInt(match[2])) {
                        allVisible = true;
                        console.log('所有论文已加载完毕');
                        return false;
                    }
                }
            }

            return false;
        }

        // 尝试直接查找
        if (findTargetPaper()) {
            // 找到目标，滚动到位置
            targetPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightPaper(targetPaper);
            return;
        }

        // 如果没有找到，需要滚动加载更多
        function loadMoreAndFind() {
            if (allVisible) {
                alert(`无法找到论文 #${targetNumber}，请检查输入值是否正确。`);
                return;
            }

            if (findTargetPaper()) {
                // 找到目标，滚动到位置
                targetPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                highlightPaper(targetPaper);
                return;
            }

            // 滚动到页面底部以加载更多论文
            window.scrollTo(0, document.body.scrollHeight);

            // 等待新内容加载后再次尝试
            setTimeout(loadMoreAndFind, 800);
        }

        showTemporaryMessage(`正在定位论文 #${targetNumber}...`);
        loadMoreAndFind();
    }

    // 高亮显示目标论文
    function highlightPaper(paperElement) {
        // 保存原始样式
        const originalBackground = paperElement.style.backgroundColor;
        const originalTransition = paperElement.style.transition;

        // 应用高亮样式
        paperElement.style.transition = 'background-color 1s';
        paperElement.style.backgroundColor = '#ffffd0';

        // 添加目标标记
        const targetMarker = document.createElement('div');
        targetMarker.textContent = '→';
        targetMarker.style.position = 'absolute';
        targetMarker.style.left = '-20px';
        targetMarker.style.top = '50%';
        targetMarker.style.transform = 'translateY(-50%)';
        targetMarker.style.fontSize = '20px';
        targetMarker.style.color = '#ff4500';
        targetMarker.style.fontWeight = 'bold';

        // 确保论文元素有相对定位
        if (window.getComputedStyle(paperElement).position === 'static') {
            paperElement.style.position = 'relative';
        }

        paperElement.appendChild(targetMarker);

        // 2秒后恢复原样
        setTimeout(() => {
            paperElement.style.backgroundColor = originalBackground;

            // 5秒后移除标记
            setTimeout(() => {
                if (paperElement.contains(targetMarker)) {
                    paperElement.removeChild(targetMarker);
                }
            }, 3000);
        }, 2000);

        // 记录当前位置
        savePaperClick(parseInt(paperElement.querySelector('a[title]')?.getAttribute('title')?.match(/(\d+)\/\d+/)?.[1] || '1') - 1, getTotalPapersCount());
    }    // 在页面加载时添加的全局函数

    // 从URL中获取当前日期或使用当前日期
    function getCurrentDateFromUrl() {
        // 尝试直接从URL中查找date参数
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');

        if (dateParam) {
            return dateParam;
        }

        // 如果URL中没有date参数，尝试从页面内容中提取日期
        const dateEl = document.querySelector('.date');
        if (dateEl && dateEl.textContent) {
            // 检查文本内容是否符合日期格式YYYY-MM-DD
            const dateMatch = dateEl.textContent.match(/\d{4}-\d{2}-\d{2}/);
            if (dateMatch) {
                return dateMatch[0];
            }
        }

        // 如果无法从URL或页面内容中提取日期，检查URL本身是否包含日期格式
        const urlDateMatch = window.location.href.match(/\d{4}-\d{2}-\d{2}/);
        if (urlDateMatch) {
            return urlDateMatch[0];
        }

        // 如果以上方法都失败，使用当前日期
        return formatDate(new Date());
    }

    // 格式化日期为YYYY-MM-DD格式
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 获取日期的进度信息
    function getProgressForDate(dateStr) {
        const progressData = GM_getValue('paperProgress', {});
        const dateProgress = progressData[dateStr];

        // 如果有进度数据并且是新格式，返回详细信息
        if (dateProgress && typeof dateProgress === 'object') {
            return dateProgress;
        }
        // 如果是旧格式（仅百分比）
        else if (dateProgress) {
            return {
                percent: dateProgress,
                current: 0,
                total: 0,
                lastUpdated: null
            };
        }
        // 如果没有进度数据
        else {
            return {
                percent: 0,
                current: 0,
                total: 0,
                lastUpdated: null
            };
        }
    }

    // 从页面获取总论文数量
    function getTotalPapersCount() {
        // 首先尝试从页面中查找"Total: XXX"格式的文本
        const infoText = document.querySelector('.info')?.textContent || '';
        const totalMatch = infoText.match(/Total:\s*(\d+)/);

        if (totalMatch && totalMatch[1]) {
            return parseInt(totalMatch[1], 10);
        }

        // 如果找不到，尝试使用论文元素数量
        const papers = document.querySelectorAll('.panel.paper, .arxiv-result, div.paper, article, .paper-item');
        if (papers.length > 0) {
            // 查找具有索引值的第一篇论文，提取总数
            const firstPaperTitleLink = papers[0].querySelector('a[title]');
            if (firstPaperTitleLink) {
                const titleAttr = firstPaperTitleLink.getAttribute('title');
                const titleMatch = titleAttr?.match(/(\d+)\/(\d+)/);
                if (titleMatch && titleMatch[2]) {
                    return parseInt(titleMatch[2], 10);
                }
            }

            return papers.length;
        }

        // 默认返回值
        return 100;
    }

    // 标记当前日期为已完成
    function markAsComplete() {
        // 获取当前日期
        const dateStr = getCurrentDateFromUrl();

        // 获取总论文数量
        const totalPapers = getTotalPapersCount();

        console.log(`手动标记 ${dateStr} 为已完成，总论文数: ${totalPapers}`);

        // 保存完成状态
        const progressData = GM_getValue('paperProgress', {});
        progressData[dateStr] = {
            percent: 100,
            current: totalPapers,
            total: totalPapers,
            lastUpdated: new Date().toISOString(),
            manuallyCompleted: true
        };
        GM_setValue('paperProgress', progressData);

        // 立即更新当前日期的显示
        updateCurrentDateDisplay(dateStr);

        // 显示简短的成功提示，2秒后自动消失
        showTemporaryMessage(`已标记 ${dateStr} 为已完成！`);
    }

    // 显示临时消息提示
    function showTemporaryMessage(message) {
        // 检查是否已存在消息框，如果有则移除
        const existingMsg = document.getElementById('temp-message');
        if (existingMsg) {
            document.body.removeChild(existingMsg);
        }

        // 创建消息框
        const msgBox = document.createElement('div');
        msgBox.id = 'temp-message';
        msgBox.style.position = 'fixed';
        msgBox.style.bottom = '20px';
        msgBox.style.left = '50%';
        msgBox.style.transform = 'translateX(-50%)';
        msgBox.style.backgroundColor = '#4caf50';
        msgBox.style.color = 'white';
        msgBox.style.padding = '10px 20px';
        msgBox.style.borderRadius = '4px';
        msgBox.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        msgBox.style.zIndex = '10000';
        msgBox.style.fontWeight = 'bold';
        msgBox.style.fontSize = '14px';
        msgBox.style.textAlign = 'center';
        msgBox.textContent = message;

        // 添加到页面
        document.body.appendChild(msgBox);

        // 2秒后自动移除
        setTimeout(() => {
            if (msgBox.parentNode) {
                document.body.removeChild(msgBox);
            }
        }, 2000);
    }

    // 立即更新当前日期的显示
    function updateCurrentDateDisplay(dateStr) {
        // 获取当前显示的年月
        const headerText = document.querySelector('.calendar-header div').textContent;
        const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月",
                           "七月", "八月", "九月", "十月", "十一月", "十二月"];

        const monthName = headerText.split(' ')[0];
        const year = parseInt(headerText.split(' ')[1]);
        const month = monthNames.indexOf(monthName);

        // 解析日期字符串
        const dateParts = dateStr.split('-');
        const targetYear = parseInt(dateParts[0]);
        const targetMonth = parseInt(dateParts[1]) - 1; // 月份从0开始
        const targetDay = parseInt(dateParts[2]);

        // 检查当前日期是否在显示的月份中
        if (targetYear === year && targetMonth === month) {
            console.log(`更新日历中 ${year}年${month+1}月${targetDay}日 的显示`);

            // 查找日期对应的单元格
            const dayCells = document.querySelectorAll('.calendar-day');
            dayCells.forEach(cell => {
                const dayNumber = cell.querySelector('.day-number');
                if (dayNumber && parseInt(dayNumber.textContent) === targetDay) {
                    // 清除旧的内容
                    while (cell.childNodes.length > 1) { // 保留日期数字元素
                        if (cell.childNodes[1] !== dayNumber) {
                            cell.removeChild(cell.childNodes[1]);
                        } else {
                            if (cell.childNodes[2]) {
                                cell.removeChild(cell.childNodes[2]);
                            }
                        }
                    }

                    // 移除所有类
                    cell.classList.remove('no-progress', 'partial-progress', 'complete-progress');

                    // 设置为完成状态
                    cell.classList.add('complete-progress');

                    // 更新标题提示
                    const totalPapers = getTotalPapersCount();
                    cell.title = `已完成: 100%（${totalPapers}篇论文）（手动标记）`;

                    // 添加百分比显示
                    const percentDiv = document.createElement('div');
                    percentDiv.className = 'progress-percent';
                    percentDiv.textContent = '100%';
                    cell.appendChild(percentDiv);

                    // 添加总数信息
                    const totalDiv = document.createElement('div');
                    totalDiv.className = 'progress-total';
                    totalDiv.textContent = `${totalPapers}/${totalPapers}`;
                    cell.appendChild(totalDiv);

                    // 添加手动完成的✓标记
                    const checkmarkDiv = document.createElement('div');
                    checkmarkDiv.style.position = 'absolute';
                    checkmarkDiv.style.top = '2px';
                    checkmarkDiv.style.right = '2px';
                    checkmarkDiv.style.fontSize = '10px';
                    checkmarkDiv.style.color = '#fff';
                    checkmarkDiv.style.fontWeight = 'bold';
                    checkmarkDiv.textContent = '✓';
                    cell.appendChild(checkmarkDiv);

                    console.log('已更新日历单元格显示:', cell);
                    return;
                }
            });
        } else {
            // 如果当前日期不在显示的月份中，更新整个日历
            console.log(`当前日期 ${dateStr} 不在显示的月份中，更新整个日历UI`);
            updateCalendarUI();
        }
    }

(function() {
    'use strict';

    // 为日历添加样式
    GM_addStyle(`
        #progress-calendar {
            position: fixed;
            top: 10px;
            right: 50px; /* 将日历从右边缘移开一些距离 */
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            padding-bottom: 30px; /* 底部增加padding，为右下角的关闭按钮留出空间 */
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            max-width: 350px;
            /* 防止翻译影响 */
            translate: none !important;
            transform: none !important;
            font-style: normal !important;
            font-weight: normal !important;
            text-align: left !important;
        }
        #temp-message {
            animation: fadeInOut 2s ease-in-out;
            /* 防止翻译影响 */
            translate: none !important;
            transform: translateX(-50%) !important;
            font-style: normal !important;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 20px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, 20px); }
        }
        /* 确保所有日历元素不受翻译影响 */
        .calendar-header, .calendar-grid, .calendar-day-header, .calendar-day,
        .day-number, .progress-percent, .progress-total,
        .complete-button, .progress-navigator, .progress-input, .nav-button {
            translate: none !important;
            transform: none !important;
            font-style: normal !important;
            text-transform: none !important;
        }
        /* 修复翻译后可能的布局问题 */
        .calendar-grid {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
        }
        .calendar-day {
            width: 40px !important;
            height: 40px !important;
        }
        .calendar-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            align-items: center;
        }
        .calendar-header button {
            border: none;
            background: #f0f0f0;
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
        }
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
        }
        .calendar-day {
            width: 40px;
            height: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
            font-size: 11px;
            position: relative;
            overflow: hidden;
        }
        .day-number {
            font-weight: bold;
            position: absolute;
            top: 2px;
            left: 4px;
            font-size: 10px;
        }
        .progress-percent {
            font-size: 10px;
            font-weight: bold;
        }
        .progress-total {
            font-size: 8px;
            opacity: 0.8;
        }
        .progress-navigator {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            text-align: center;
        }
        .progress-input {
            width: 60px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            text-align: center;
            margin-right: 5px;
        }
        .nav-button {
            padding: 5px 10px;
            background-color: #2196f3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .nav-button:hover {
            background-color: #0b7dda;
        }
        .calendar-day-header {
            font-weight: bold;
            text-align: center;
            font-size: 12px;
        }
        .no-progress {
            background-color: #f0f0f0;
        }
        .partial-progress {
            background-color: #ffeb3b;
        }
        .complete-progress {
            background-color: #4caf50;
            color: white;
        }
        .current-day {
            border: 2px solid #2196f3;
        }
        .progress-info {
            font-size: 12px;
            margin-top: 10px;
            text-align: center;
        }
        .toggle-calendar {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9998;
            background: #2196f3;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
    `);

    // 当DOM加载完成时初始化
    window.addEventListener('load', initialize);

    function initialize() {
        // 检查是否在相关页面上
        if (window.location.href.includes('papers.cool/arxiv')) {
            console.log('初始化论文阅读进度日历插件...');

            // 创建展开/折叠按钮
            createToggleButton();

            // 创建日历
            createCalendar();

            // 添加论文链接的点击监听器
            addPaperClickListeners();

            // 记录初始状态
            const totalPapers = getTotalPapersCount();
            console.log(`检测到总论文数: ${totalPapers}`);
            console.log('当前URL:', window.location.href);
            console.log('当前日期:', getCurrentDateFromUrl());

            // 检查是否需要滚动到上次的阅读进度
            checkAndScrollToLastProgress();

            // 定期重新初始化点击监听器，以捕获动态加载的内容
            setInterval(() => {
                console.log('重新初始化点击监听器...');
                addPaperClickListeners();
            }, 60000); // 每分钟检查一次
        }
    }

    // 检查并滚动到上次的阅读进度
    function checkAndScrollToLastProgress() {
        const lastNavigation = GM_getValue('last_navigation', null);
        if (!lastNavigation) return;

        // 检查是否是最近导航（30秒内）且标记了需要滚动到进度位置
        const currentTime = new Date().getTime();
        const isRecent = (currentTime - lastNavigation.timestamp) < 30000; // 30秒内

        if (isRecent && lastNavigation.shouldScrollToProgress && lastNavigation.progress && lastNavigation.progress.current > 0) {
            console.log(`检测到最近导航记录，将滚动到进度: ${lastNavigation.progress.current}/${lastNavigation.progress.total}`);

            // 延迟一些时间等待页面完全加载
            setTimeout(() => {
                // 滚动到进度位置
                navigateToProgress(lastNavigation.progress.current.toString());

                // 清除导航记录，避免重复滚动
                GM_setValue('last_navigation', null);

                console.log('已清除导航记录');
            }, 1500); // 延迟1.5秒
        } else {
            // 清除过期的导航记录
            if (!isRecent) {
                GM_setValue('last_navigation', null);
                console.log('清除过期的导航记录');
            }
        }
    }

    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-calendar';
        toggleButton.textContent = 'C';
        toggleButton.title = '显示/隐藏阅读进度日历';

        toggleButton.addEventListener('click', () => {
            const calendar = document.getElementById('progress-calendar');
            if (calendar.style.display === 'none') {
                calendar.style.display = 'block';
                toggleButton.style.display = 'none';
            } else {
                calendar.style.display = 'none';
            }
        });

        document.body.appendChild(toggleButton);
    }

    function createCalendar() {
        const calendarDiv = document.createElement('div');
        calendarDiv.id = 'progress-calendar';
        calendarDiv.className = 'notranslate'; // 防止翻译
        calendarDiv.setAttribute('translate', 'no'); // 防止翻译

        // 获取页面的日期，如果URL中有日期，则使用该日期；否则使用当前日期
        const urlDateStr = getCurrentDateFromUrl();
        let calendarDate;

        if (urlDateStr) {
            // 解析URL中的日期
            const dateParts = urlDateStr.split('-');
            if (dateParts.length === 3) {
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // 月份从0开始
                const day = parseInt(dateParts[2]);
                calendarDate = new Date(year, month, day);
                console.log(`使用URL中的日期初始化日历: ${urlDateStr}`);
            } else {
                calendarDate = new Date();
            }
        } else {
            calendarDate = new Date();
        }

        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();

        // 日历头部
        const header = document.createElement('div');
        header.className = 'calendar-header notranslate';
        header.setAttribute('translate', 'no');

        const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月",
                           "七月", "八月", "九月", "十月", "十一月", "十二月"];

        header.innerHTML = `
            <button id="prev-month" class="notranslate" translate="no">&lt;</button>
            <div class="notranslate" translate="no">${monthNames[month]} ${year}</div>
            <button id="next-month" class="notranslate" translate="no">&gt;</button>
        `;

        calendarDiv.appendChild(header);

        // 添加星期头部
        const dayGrid = document.createElement('div');
        dayGrid.className = 'calendar-grid notranslate';
        dayGrid.setAttribute('translate', 'no');

        const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header notranslate';
            dayHeader.setAttribute('translate', 'no');
            dayHeader.textContent = day;
            dayGrid.appendChild(dayHeader);
        });

        // 计算月份第一天和总天数
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 为月份第一天前的日子添加空单元格
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'notranslate';
            emptyDay.setAttribute('translate', 'no');
            dayGrid.appendChild(emptyDay);
        }

        // 添加带有进度指示器的日子
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day notranslate';
            dayCell.setAttribute('translate', 'no');

            // 添加日期数字
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number notranslate';
            dayNumber.setAttribute('translate', 'no');
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);

            // 将日期格式化为YYYY-MM-DD
            const dateStr = formatDate(new Date(year, month, day));

            // 获取这个日期的进度
            const progress = getProgressForDate(dateStr);

            // 添加进度显示
            if (progress.percent > 0) {
                // 添加进度百分比
                const percentDiv = document.createElement('div');
                percentDiv.className = 'progress-percent notranslate';
                percentDiv.setAttribute('translate', 'no');
                percentDiv.textContent = `${progress.percent}%`;
                dayCell.appendChild(percentDiv);

                // 添加总数信息
                if (progress.total > 0) {
                    const totalDiv = document.createElement('div');
                    totalDiv.className = 'progress-total notranslate';
                    totalDiv.setAttribute('translate', 'no');
                    totalDiv.textContent = `${progress.current}/${progress.total}`;
                    dayCell.appendChild(totalDiv);
                }
            }

            // 根据进度应用适当的类
            if (progress.percent === 0) {
                dayCell.classList.add('no-progress');
            } else if (progress.percent < 100) {
                dayCell.classList.add('partial-progress');
                dayCell.title = `进度: ${progress.percent}%（${progress.current}/${progress.total}篇论文）`;
            } else {
                dayCell.classList.add('complete-progress');
                dayCell.title = `已完成: 100%（${progress.total}篇论文）`;
            }

            // 标记当前显示的日期（如果与URL中的日期匹配）
            if (day === calendarDate.getDate() && month === calendarDate.getMonth() && year === calendarDate.getFullYear()) {
                dayCell.classList.add('current-day');
                dayCell.title = (dayCell.title ? dayCell.title + ' (当前页面日期)' : '当前页面日期');
            }

            // 同时标记今天的日期（如果在当月）
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                // 今天的日期用蓝色边框标出，但不覆盖current-day的样式
                if (!dayCell.classList.contains('current-day')) {
                    dayCell.style.border = '2px solid #2196f3';
                    dayCell.title = (dayCell.title ? dayCell.title + ' (今天)' : '今天');
                }
            }

            // 添加点击事件以导航到该日期
            dayCell.addEventListener('click', () => {
                navigateToDate(dateStr);
            });

            dayGrid.appendChild(dayCell);
        }

        calendarDiv.appendChild(dayGrid);

        // 添加进度信息
        const progressInfo = document.createElement('div');
        progressInfo.className = 'progress-info notranslate';
        progressInfo.setAttribute('translate', 'no');
        progressInfo.innerHTML = `
            <div class="notranslate" translate="no">灰色: 未阅读</div>
            <div class="notranslate" translate="no">黄色: 部分阅读</div>
            <div class="notranslate" translate="no">绿色: 已完成</div>
        `;
        calendarDiv.appendChild(progressInfo);

        // 添加完成按钮
        const completeButtonContainer = document.createElement('div');
        completeButtonContainer.className = 'complete-button-container notranslate';
        completeButtonContainer.setAttribute('translate', 'no');
        completeButtonContainer.style.textAlign = 'center';
        completeButtonContainer.style.marginTop = '10px';

        const completeButton = document.createElement('button');
        completeButton.id = 'mark-complete-button';
        completeButton.textContent = '标记当前日期为已完成';
        completeButton.className = 'complete-button notranslate';
        completeButton.setAttribute('translate', 'no');
        completeButton.style.backgroundColor = '#4caf50';
        completeButton.style.color = 'white';
        completeButton.style.border = 'none';
        completeButton.style.padding = '8px 15px';
        completeButton.style.borderRadius = '4px';
        completeButton.style.cursor = 'pointer';
        completeButton.style.fontWeight = 'bold';
        completeButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        completeButton.onclick = function() {
            console.log('完成按钮被点击');
            markAsComplete();
            return false;
        };

        completeButton.addEventListener('mouseover', () => {
            completeButton.style.backgroundColor = '#45a049';
            completeButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        completeButton.addEventListener('mouseout', () => {
            completeButton.style.backgroundColor = '#4caf50';
            completeButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });

        completeButtonContainer.appendChild(completeButton);
        calendarDiv.appendChild(completeButtonContainer);

        // 添加进度导航
        const progressNavigator = document.createElement('div');
        progressNavigator.className = 'progress-navigator notranslate';
        progressNavigator.setAttribute('translate', 'no');

        const navigatorLabel = document.createElement('div');
        navigatorLabel.className = 'notranslate';
        navigatorLabel.setAttribute('translate', 'no');
        navigatorLabel.textContent = '直接导航到进度位置:';
        navigatorLabel.style.marginBottom = '5px';
        progressNavigator.appendChild(navigatorLabel);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'notranslate';
        inputContainer.setAttribute('translate', 'no');

        // 创建输入框 - 可以输入论文号或百分比
        const progressInput = document.createElement('input');
        progressInput.type = 'text';
        progressInput.placeholder = '输入位置';
        progressInput.className = 'progress-input notranslate';
        progressInput.setAttribute('translate', 'no');
        inputContainer.appendChild(progressInput);

        // 创建导航按钮
        const navButton = document.createElement('button');
        navButton.textContent = '跳转';
        navButton.className = 'nav-button notranslate';
        navButton.setAttribute('translate', 'no');
        navButton.id = 'progress-nav-button';
        inputContainer.appendChild(navButton);
        progressNavigator.appendChild(inputContainer);

        // 添加导航提示
        const navHint = document.createElement('div');
        navHint.className = 'notranslate';
        navHint.setAttribute('translate', 'no');
        navHint.style.fontSize = '10px';
        navHint.style.marginTop = '5px';
        navHint.style.color = '#666';
        navHint.textContent = '输入数字(如20)或百分比(如20%)';
        progressNavigator.appendChild(navHint);

        calendarDiv.appendChild(progressNavigator);

        // 添加页面日期信息
        if (urlDateStr) {
            const dateInfo = document.createElement('div');
            dateInfo.className = 'date-info notranslate';
            dateInfo.setAttribute('translate', 'no');
            dateInfo.style.fontSize = '10px';
            dateInfo.style.marginTop = '8px';
            dateInfo.style.color = '#666';
            dateInfo.style.textAlign = 'center';
            dateInfo.textContent = `当前页面日期: ${urlDateStr}`;
            calendarDiv.appendChild(dateInfo);
        }

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'notranslate calendar-close-btn';
        closeButton.setAttribute('translate', 'no');
        closeButton.style.position = 'absolute';
        closeButton.style.bottom = '5px'; // 放在底部
        closeButton.style.right = '5px'; // 放在右侧
        closeButton.style.background = '#f44336'; // 红色背景
        closeButton.style.color = 'white'; // 白色文字
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%'; // 圆形按钮
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.style.lineHeight = '16px'; // 调整文字垂直居中
        closeButton.style.textAlign = 'center';
        closeButton.style.zIndex = '10000'; // 确保在最上层
        closeButton.style.display = 'flex';
        closeButton.style.justifyContent = 'center';
        closeButton.style.alignItems = 'center';
        closeButton.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';

        closeButton.addEventListener('click', () => {
            calendarDiv.style.display = 'none';
            document.querySelector('.toggle-calendar').style.display = 'flex';
        });

        // 添加鼠标悬停效果
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#d32f2f'; // 深红色
        });

        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#f44336'; // 恢复原来的红色
        });

        calendarDiv.appendChild(closeButton);

        // 将日历添加到页面
        document.body.appendChild(calendarDiv);

        // 为导航按钮添加事件监听器
        document.getElementById('prev-month').addEventListener('click', () => {
            navigateMonth(-1);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            navigateMonth(1);
        });

        // 确保完成按钮正常工作
        document.getElementById('mark-complete-button').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('完成按钮被点击 (addEventListener)');
            markAsComplete();
        });

        // 为进度导航按钮添加事件监听器
        document.getElementById('progress-nav-button').addEventListener('click', function() {
            const inputValue = progressInput.value.trim();
            if (inputValue) {
                navigateToProgress(inputValue);
            }
        });

        // 为进度输入框添加回车键事件
        progressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const inputValue = progressInput.value.trim();
                if (inputValue) {
                    navigateToProgress(inputValue);
                }
            }
        });
    }

    function navigateMonth(offset) {
        // 获取日历头部显示的月份和年份
        const headerText = document.querySelector('.calendar-header div').textContent;
        const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月",
                           "七月", "八月", "九月", "十月", "十一月", "十二月"];

        const currentMonthName = headerText.split(' ')[0];
        const currentYear = parseInt(headerText.split(' ')[1]);
        const currentMonth = monthNames.indexOf(currentMonthName);

        // 计算新的月份和年份
        let newMonth = currentMonth + offset;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        // 更新日历头部显示
        const header = document.querySelector('.calendar-header div');
        header.textContent = `${monthNames[newMonth]} ${newYear}`;

        // 重建日历天数
        updateCalendarDays(newYear, newMonth);

        // BUGFIX: The following line was causing the issue and has been removed.
        // updateCurrentDateDisplay(getCurrentDateFromUrl());
        // updateCalendarDays already handles rendering the current page's date correctly
        // if it's in the newly displayed month.
    }
    function updateCalendarDays(year, month) {
        const dayGrid = document.querySelector('.calendar-grid');

        // 移除所有现有的日期单元格
        while (dayGrid.children.length > 7) { // 保留星期头部
            dayGrid.removeChild(dayGrid.lastChild);
        }

        // 计算月份第一天和总天数
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const totalPapers = getTotalPapersCount(); // 获取最新的总论文数
        // 获取当前页面的日期
        const currentDateStr = getCurrentDateFromUrl(); // 获取当前页面的日期字符串
        let currentDate = null;
        if(currentDateStr){
            const dateParts = currentDateStr.split('-');
            currentDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        }

        // 为月份第一天前的日子添加空单元格
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'notranslate';
            emptyDay.setAttribute('translate', 'no');
            dayGrid.appendChild(emptyDay);
        }

        // 添加带有进度指示器的日子
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day notranslate';
            dayCell.setAttribute('translate', 'no');

            // 添加日期数字
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number notranslate';
            dayNumber.setAttribute('translate', 'no');
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);

            // 将日期格式化为YYYY-MM-DD
            const dateStr = formatDate(new Date(year, month, day));

            // 获取这个日期的进度
            const progress = getProgressForDate(dateStr);

            // 添加进度显示
            if (progress.percent > 0) {
                // 添加进度百分比
                const percentDiv = document.createElement('div');
                percentDiv.className = 'progress-percent notranslate';
                percentDiv.setAttribute('translate', 'no');
                percentDiv.textContent = `${progress.percent}%`;
                dayCell.appendChild(percentDiv);

                // 添加总数信息
                if (progress.total > 0) {
                    const totalDiv = document.createElement('div');
                    totalDiv.className = 'progress-total notranslate';
                    totalDiv.setAttribute('translate', 'no');
                    totalDiv.textContent = `${progress.current}/${progress.total}`;
                    dayCell.appendChild(totalDiv);
                }

                // 如果是手动完成的，添加一个✓标记
                if (progress.manuallyCompleted) {
                    const checkmarkDiv = document.createElement('div');
                    checkmarkDiv.style.position = 'absolute';
                    checkmarkDiv.style.top = '2px';
                    checkmarkDiv.style.right = '2px';
                    checkmarkDiv.style.fontSize = '10px';
                    checkmarkDiv.style.color = '#fff';
                    checkmarkDiv.style.fontWeight = 'bold';
                    checkmarkDiv.textContent = '✓';
                    dayCell.appendChild(checkmarkDiv);
                }
            }

            // 移除现有的进度类
            dayCell.classList.remove('no-progress', 'partial-progress', 'complete-progress', 'current-day');

            // 根据进度应用适当的类
            if (progress.percent === 0) {
                dayCell.classList.add('no-progress');
                dayCell.title = '';
            } else if (progress.percent < 100) {
                dayCell.classList.add('partial-progress');
                dayCell.title = `进度: ${progress.percent}%（${progress.current}/${progress.total}篇论文）`;
            } else {
                dayCell.classList.add('complete-progress');
                dayCell.title = `已完成: 100%（${progress.total}篇论文）`;
                if (progress.manuallyCompleted) {
                    dayCell.title += '（手动标记）';
                }
            }

            // 标记当前日期
            if (currentDate && day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayCell.classList.add('current-day');
                dayCell.title = (dayCell.title ? dayCell.title + ' (当前页面日期)' : '当前页面日期');
            }

            // 添加点击事件以导航到该日期
            dayCell.addEventListener('click', () => {
                navigateToDate(dateStr);
            });

            dayGrid.appendChild(dayCell);
        }
    }

    function navigateToDate(dateStr) {
        // 保存跳转前的当前日期，用于对比是否需要滚动到进度位置
        const currentDateStr = getCurrentDateFromUrl();
        const isChangingDate = (currentDateStr !== dateStr);

        // 保存进度信息以便后续使用
        const progressData = GM_getValue('paperProgress', {});
        const progress = progressData[dateStr] || { percent: 0, current: 0, total: 0 };

        // 从URL中提取当前类别或使用默认值
        let categories = 'cs.CL,cs.LG,cs.AI,cs.CV';
        const match = window.location.pathname.match(/\/arxiv\/([^?]+)/);
        if (match && match[1]) {
            categories = match[1];
        }

        // 构建导航URL
        const newUrl = `https://papers.cool/arxiv/${categories}?date=${dateStr}&sort=1`;

        // 存储跳转信息，用于页面加载后自动滚动
        GM_setValue('last_navigation', {
            date: dateStr,
            timestamp: new Date().getTime(),
            progress: progress,
            shouldScrollToProgress: isChangingDate && progress.current > 0
        });

        console.log(`导航到 ${dateStr}，进度: ${progress.percent}%（${progress.current}/${progress.total}）`);

        // 导航到特定日期的URL
        window.location.href = newUrl;
    }

    // 从页面获取总论文数量
    function getTotalPapersCount() {
        // 首先尝试从页面中查找"Total: XXX"格式的文本
        const infoText = document.querySelector('.info')?.textContent || '';
        const totalMatch = infoText.match(/Total:\s*(\d+)/);

        if (totalMatch && totalMatch[1]) {
            return parseInt(totalMatch[1], 10);
        }

        // 如果找不到，尝试使用论文元素数量
        const papers = document.querySelectorAll('.panel.paper, .arxiv-result, div.paper, article, .paper-item');
        if (papers.length > 0) {
            // 查找具有索引值的第一篇论文，提取总数
            const firstPaperTitleLink = papers[0].querySelector('a[title]');
            if (firstPaperTitleLink) {
                const titleAttr = firstPaperTitleLink.getAttribute('title');
                const titleMatch = titleAttr?.match(/(\d+)\/(\d+)/);
                if (titleMatch && titleMatch[2]) {
                    return parseInt(titleMatch[2], 10);
                }
            }

            return papers.length;
        }

        // 默认返回值
        return 100;
    }
    var _coolPapers_globalPaperClickHandler = null;
    // Replace the existing addPaperClickListeners function with this:
    function addPaperClickListeners() {
        // If a handler from a previous call to this function exists, remove it.
        if (_coolPapers_globalPaperClickHandler) {
            document.removeEventListener('click', _coolPapers_globalPaperClickHandler);
        }

        // Define the actual event handling logic.
        // This function will be (re)assigned to _coolPapers_globalPaperClickHandler each time addPaperClickListeners is called.
        _coolPapers_globalPaperClickHandler = function(e) {
            const clickedElement = e.target;
            // Find the closest ancestor anchor tag
            const linkElement = clickedElement.closest('a');

            if (!linkElement) {
                return; // Not a click on or within a link
            }

            let paperId = '';
            const linkId = linkElement.id || '';
            // Use getAttribute('href') as linkElement.href can be the fully resolved URL
            const linkHref = linkElement.getAttribute('href') || '';
            const linkClassName = (typeof linkElement.className === 'string') ? linkElement.className : '';

            // --- Step 1: Try to extract paperId ---

            // Priority 1: Links with IDs like "prefix-PAPERID" (e.g., "pdf-2505.05410", "kimi-2505.05410")
            const idPrefixes = ['pdf-', 'kimi-', 'title-', 'copy-', 'rel-'];
            for (const prefix of idPrefixes) {
                if (linkId.startsWith(prefix)) {
                    paperId = linkId.substring(prefix.length);
                    break;
                }
            }

            // Priority 2: Links with href containing a paper ID pattern (e.g., arXiv abstract or PDF links)
            if (!paperId && linkHref) {
                const hrefMatch = linkHref.match(/(\d{4}\.\d{4,5}(v\d+)?)/); // Matches patterns like 2505.05410 or 1234.56789v2
                if (hrefMatch && hrefMatch[1]) {
                    paperId = hrefMatch[1];
                }
            }

            // --- Step 2: If paperId found, find the paper panel and its index ---
            if (paperId) {
                const allPaperPanels = document.querySelectorAll('.panel.paper, .arxiv-result, div.paper, article, .paper-item');
                let paperPanelElement = null;
                let domOrderIndex = -1;

                // Find the specific paper panel by its ID (which should be the paperId)
                for (let i = 0; i < allPaperPanels.length; i++) {
                    if (allPaperPanels[i].id === paperId) {
                        paperPanelElement = allPaperPanels[i];
                        domOrderIndex = i;
                        break;
                    }
                }

                if (paperPanelElement) {
                    let officialIndex = -1; // 0-based index

                    // Try to get the "official" index (e.g., "1/293") from the panel content
                    // This is typically on the main link to the ArXiv abstract page
                    const mainAbstractLink = paperPanelElement.querySelector('h2.title a[href*="arxiv.org/abs/"][title]');
                    if (mainAbstractLink && mainAbstractLink.title) {
                        const titleMatch = mainAbstractLink.title.match(/^(\d+)\s*\/\s*\d+$/); // Matches "N/M"
                        if (titleMatch && titleMatch[1]) {
                            officialIndex = parseInt(titleMatch[1], 10) - 1; // Convert to 0-based
                        }
                    }

                    // Fallback: Try to get index from a child span.index element (e.g. "#1")
                    if (officialIndex === -1) {
                        const indexSpan = paperPanelElement.querySelector('span.index');
                        if (indexSpan && indexSpan.textContent) {
                            const spanMatch = indexSpan.textContent.match(/#(\d+)/);
                            if (spanMatch && spanMatch[1]) {
                                officialIndex = parseInt(spanMatch[1], 10) - 1; // Convert to 0-based
                            }
                        }
                    }

                    const indexToSave = (officialIndex !== -1) ? officialIndex : domOrderIndex;

                    if (indexToSave !== -1) {
                        console.log(`Cool Papers Calendar: Clicked paper ID ${paperId} (link: ${linkId || linkClassName || linkHref}), determined index ${indexToSave + 1}`);
                        savePaperClick(indexToSave, getTotalPapersCount());

                        // Optional: Visual feedback on the paper panel
                        const originalBg = paperPanelElement.style.backgroundColor;
                        paperPanelElement.style.backgroundColor = '#ffff99'; // Light yellow feedback
                        setTimeout(() => {
                            if (paperPanelElement) paperPanelElement.style.backgroundColor = originalBg;
                        }, 500);
                    } else {
                        console.warn(`Cool Papers Calendar: Could not determine a valid index for paper ID ${paperId}.`);
                    }
                    return; // Processed this click.
                } else {
                    console.log(`Cool Papers Calendar: Paper panel for ID ${paperId} not found. Link:`, linkElement);
                }
            }

            // --- Step 3: Fallback for links without direct paperId, but inside a paper panel ---
            // (e.g., author links)
            const containingPanel = linkElement.closest('.panel.paper, .arxiv-result, div.paper, article, .paper-item');
            if (containingPanel) {
                let panelIndex = -1;
                // Try to get index from panel's main abstract link title
                const mainAbstractLink = containingPanel.querySelector('h2.title a[href*="arxiv.org/abs/"][title]');
                if (mainAbstractLink && mainAbstractLink.title) {
                    const titleMatch = mainAbstractLink.title.match(/^(\d+)\s*\/\s*\d+$/);
                    if (titleMatch && titleMatch[1]) {
                        panelIndex = parseInt(titleMatch[1], 10) - 1;
                    }
                }
                // Fallback: try from span.index
                if (panelIndex === -1) {
                    const indexSpan = containingPanel.querySelector('span.index');
                    if (indexSpan && indexSpan.textContent) {
                        const spanMatch = indexSpan.textContent.match(/#(\d+)/);
                        if (spanMatch && spanMatch[1]) {
                            panelIndex = parseInt(spanMatch[1], 10) - 1;
                        }
                    }
                }
                // Fallback: DOM order of all panels
                if (panelIndex === -1) {
                    const allPanels = document.querySelectorAll('.panel.paper, .arxiv-result, div.paper, article, .paper-item');
                    panelIndex = Array.from(allPanels).indexOf(containingPanel);
                }

                if (panelIndex !== -1) {
                    console.log(`Cool Papers Calendar: Clicked link inside paper panel (DOM index ${panelIndex + 1}). Link:`, linkElement);
                    savePaperClick(panelIndex, getTotalPapersCount());
                    // Optional: Visual feedback
                    const originalBg = containingPanel.style.backgroundColor;
                    containingPanel.style.backgroundColor = '#ffffcc';
                    setTimeout(() => {
                        if (containingPanel) containingPanel.style.backgroundColor = originalBg;
                    }, 500);
                    return; // Processed this click.
                }
            }
            // If we reach here, the click was on a link, but we couldn't associate it with a paper progress.
            // console.log('Cool Papers Calendar: Clicked link not associated with a paper for progress tracking:', linkElement);
        }; // End of _coolPapers_globalPaperClickHandler definition

        // Add the newly defined handler to the document
        document.addEventListener('click', _coolPapers_globalPaperClickHandler);

        console.log('Cool Papers Calendar: Global paper click listener attached/updated.');
    }
    function savePaperClick(paperIndex, totalPapers) {
        // 从URL中提取日期或使用当前日期
        let dateStr = getCurrentDateFromUrl();

        // 计算进度（位置/总数）
        const progress = Math.round(((paperIndex + 1) / totalPapers) * 100);

        console.log(`点击了第 ${paperIndex + 1}/${totalPapers} 篇论文，进度 ${progress}%，日期 ${dateStr}`);

        // 保存这个日期的详细进度信息
        const progressData = GM_getValue('paperProgress', {});

        // 检查是否已存在数据，如果没有或者新进度比老进度更高，则更新
        const existingData = progressData[dateStr];
        let shouldUpdate = false;

        if (!existingData) {
            shouldUpdate = true;
        } else if (existingData.percent < progress) {
            shouldUpdate = true;
        } else if (existingData.current < paperIndex + 1) {
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            progressData[dateStr] = {
                percent: progress,
                current: paperIndex + 1,
                total: totalPapers,
                lastUpdated: new Date().toISOString()
            };

            // 如果是手动完成的，保留该标志
            if (existingData && existingData.manuallyCompleted) {
                progressData[dateStr].manuallyCompleted = true;
            }

            GM_setValue('paperProgress', progressData);

            // 更新日历UI
            updateCalendarUI();

            console.log(`✅ 更新了 ${dateStr} 的进度： ${progress}%（${paperIndex + 1}/${totalPapers}）`);
        } else {
            console.log(`❌ 不更新进度，因为当前进度 ${existingData.percent}%（${existingData.current}/${existingData.total}）已经更高`);
        }

        // 在控制台显示当前保存的所有进度数据（调试用）
        console.log('当前所有日期的进度数据:', progressData);
    }

    function getCurrentDateFromUrl() {
        // 尝试从URL中提取日期
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');

        if (dateParam) {
            return dateParam;
        } else {
            // 如果没有日期参数，使用当前日期
            return formatDate(new Date());
        }
    }

    function getProgressForDate(dateStr) {
        const progressData = GM_getValue('paperProgress', {});
        const dateProgress = progressData[dateStr];

        // 如果有进度数据并且是新格式，返回详细信息
        if (dateProgress && typeof dateProgress === 'object') {
            return dateProgress;
        }
        // 如果是旧格式（仅百分比）
        else if (dateProgress) {
            return {
                percent: dateProgress,
                current: 0,
                total: 0,
                lastUpdated: null
            };
        }
        // 如果没有进度数据
        else {
            return {
                percent: 0,
                current: 0,
                total: 0,
                lastUpdated: null
            };
        }
    }

    function updateCalendarUI() {
        // 获取所有日期单元格
        const dayCells = document.querySelectorAll('.calendar-day');

        dayCells.forEach(cell => {
            const dayNumber = cell.querySelector('.day-number');
            if (dayNumber) {
                const day = parseInt(dayNumber.textContent);
                if (!isNaN(day)) {
                    // 从日历头部获取当前月份和年份
                    const headerText = document.querySelector('.calendar-header div').textContent;
                    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月",
                                       "七月", "八月", "九月", "十月", "十一月", "十二月"];

                    const monthName = headerText.split(' ')[0];
                    const year = parseInt(headerText.split(' ')[1]);
                    const month = monthNames.indexOf(monthName);

                    // 格式化日期
                    const dateStr = formatDate(new Date(year, month, day));

                    // 获取这个日期的进度
                    const progress = getProgressForDate(dateStr);

                    // 清除现有的进度显示
                    const oldPercent = cell.querySelector('.progress-percent');
                    if (oldPercent) {
                        cell.removeChild(oldPercent);
                    }

                    const oldTotal = cell.querySelector('.progress-total');
                    if (oldTotal) {
                        cell.removeChild(oldTotal);
                    }

                    // 移除任何现有的✓标记
                    const oldCheckmark = cell.querySelector('div[style*="position: absolute"]');
                    if (oldCheckmark) {
                        cell.removeChild(oldCheckmark);
                    }

                    // 添加新的进度显示
                    if (progress.percent > 0) {
                        // 添加进度百分比
                        const percentDiv = document.createElement('div');
                        percentDiv.className = 'progress-percent';
                        percentDiv.textContent = `${progress.percent}%`;
                        cell.appendChild(percentDiv);

                        // 添加总数信息
                        if (progress.total > 0) {
                            const totalDiv = document.createElement('div');
                            totalDiv.className = 'progress-total';
                            totalDiv.textContent = `${progress.current}/${progress.total}`;
                            cell.appendChild(totalDiv);
                        }

                        // 如果是手动完成的，添加一个✓标记
                        if (progress.manuallyCompleted) {
                            const checkmarkDiv = document.createElement('div');
                            checkmarkDiv.style.position = 'absolute';
                            checkmarkDiv.style.top = '2px';
                            checkmarkDiv.style.right = '2px';
                            checkmarkDiv.style.fontSize = '10px';
                            checkmarkDiv.style.color = '#fff';
                            checkmarkDiv.style.fontWeight = 'bold';
                            checkmarkDiv.textContent = '✓';
                            cell.appendChild(checkmarkDiv);
                        }
                    }

                    // 移除现有的进度类
                    cell.classList.remove('no-progress', 'partial-progress', 'complete-progress');

                    // 根据进度应用适当的类
                    if (progress.percent === 0) {
                        cell.classList.add('no-progress');
                        cell.title = '';
                    } else if (progress.percent < 100) {
                        cell.classList.add('partial-progress');
                        cell.title = `进度: ${progress.percent}%（${progress.current}/${progress.total}篇论文）`;
                    } else {
                        cell.classList.add('complete-progress');
                        cell.title = `已完成: 100%（${progress.total}篇论文）`;
                        if (progress.manuallyCompleted) {
                            cell.title += '（手动标记）';
                        }
                    }

                    // 检查是否为当前日期
                    const currentDate = new Date();
                    if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                        cell.classList.add('current-day');
                        cell.title = (cell.title ? cell.title + ' (今天)' : '今天');
                    }
                }
            }
        });
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
})();