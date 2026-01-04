// ==UserScript==
// @name         Anime Schedule Countdown
// @namespace    age
// @author      age
// @version      1.1.1
// @description  Anime schedule countdown display with auto-fetch from API
// @license      MIT
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/532724/Anime%20Schedule%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/532724/Anime%20Schedule%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储键名
    const STORAGE_KEY = 'BGM_TV_ANIME_TIMELINE_AGE';
    const SETTINGS_KEY = 'BGM_TV_ANIME_TIMELINE_SETTING_AGE';
    // 默认时区 UTC+8
    let currentTimezone = 8;
    // 当前编辑的索引，-1表示新增
    let currentEditIndex = -1;
    // 是否显示已播放动画
    let showPlayedAnime = false;
    // 默认显示数量
    let displayCount = 3;

    const style = document.createElement('style');
    style.textContent = `
        #anime-schedule-container {
            width: 93%;
            background: rgba(33,33, 33, 0.6);
            border-radius: 10px;
            padding: 10px;
            color: white;
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            margin-bottom: 8px;
            transform-origin: top;
            transform: scaleY(0);
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transition: max-height 1.2s ease, opacity 1.2s ease;
        }

        html[data-theme='light'] #anime-schedule-container {
            background: rgba(240, 240, 240, 0.6);
            color: #333;
        }

        #anime-schedule-container.show {
            max-height: 500px;
            transform: scaleY(1);
            opacity: 1;
        }

        #anime-schedule-countdown {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
            color: #ff9e9e;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

       html[data-theme='light']  #anime-schedule-countdown {
            color: #dd9e9e;
        }

        .anime-schedule-item {
            font-size: 13px;
            margin-bottom: 6px;
            line-height: 1.4;
            opacity: 0.9;
        }

        .anime-schedule-item:nth-child(2) {
            opacity: 0.9;
            font-weight: bold;
        }

        .anime-schedule-item:nth-child(3) {
            opacity: 0.9;
        }

        .anime-schedule-item:nth-child(4) {
            opacity: 0.9;
        }

        .anime-schedule-completed {
            font-size: 13px;
            margin-bottom: 6px;
            line-height: 1.4;
            color: #c0c0c0;
            opacity: 0.7;
        }

        html[data-theme='light'] .anime-schedule-completed {
            color: #909090;
        }

        .anime-schedule-timeline {
            height: 1px;
            background-color: #555;
            margin: 8px 0;
            width: 100%;
        }

        #anime-schedule-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        #anime-schedule-modal.show {
            opacity: 1;
            pointer-events: auto;
        }

        #anime-schedule-modal-content {
            background: rgba(40, 40, 40, 0.95);
            border-radius: 10px;
            padding: 20px;
            width: 300px;
            max-width: 90%;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
            position: relative;
        }

        /* 添加屏幕高度较低时的样式 */
        @media (max-height: 600px) {
            #anime-schedule-modal-content {
                max-height: 90vh;
                overflow-y: auto;
                align-items: flex-start;
                margin-top: 20px;
                margin-bottom: 20px;
            }
        }

        @media (max-width: 528px) {
            #anime-schedule-container {
                width: 95%;
            }
        }

        #anime-schedule-modal-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #ff9e9e;
            text-align: center;
        }

        .anime-schedule-form-group {
            margin-bottom: 15px;
        }

        .anime-schedule-form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
        }

        div.anime-schedule-form-group > label {
            color: #ff9e9e;
        }

        .anime-schedule-form-group select {
            width: 100%;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #555;
            background: rgba(30, 30, 30, 0.8);
            color: white;
        }

        .anime-schedule-form-group input {
            width: 94%;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #555;
            background: rgba(30, 30, 30, 0.8);
            color: white;
        }

        #anime-schedule-time-inputs {
            display: flex;
            gap: 10px;
        }

        #anime-schedule-time-inputs input {
            flex: 1;
        }

        #anime-schedule-schedule-list {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 15px;
            background: rgba(30, 30, 30, 0.7);
            padding: 10px;
            border-radius: 5px;
        }

        .anime-schedule-schedule-item {
            padding: 8px;
            border-bottom: 1px solid #444;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            color: write;
        }

        .anime-schedule-schedule-item:hover {
            background: rgba(50, 50, 50, 0.7);
        }

        .anime-schedule-schedule-item span {
            color: white;
            flex-grow: 1;
        }

        .anime-schedule-schedule-item:last-child {
            border-bottom: none;
        }

        .anime-schedule-delete-btn {
            background: none;
            border: none;
            color: #ff6b6b;
            cursor: pointer;
            font-size: 16px;
            padding: 0 5px;
        }

        .anime-schedule-edit-btn {
            background: none;
            border: none;
            color: #6b8cff;
            cursor: pointer;
            font-size: 14px;
            padding: 0 5px;
            margin-top: -3px;
        }

        #anime-schedule-add-btn {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
            transition: background 0.2s;
        }

        #anime-schedule-add-btn:hover {
            background: #ff5252;
        }

        #anime-schedule-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #aaa;
            font-size: 32px;
            cursor: pointer;
        }

        #anime-schedule-button-container {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        #anime-schedule-auto-fetch-btn {
            background: #6b8cff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
            flex: 40%;
        }

        #anime-schedule-timezone-select {
            background: #6bff8c;
            color: white;
            border: none;
            padding: 8px 5px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
            flex: 30%;
            text-align: center;
        }

        .show-played-toggle {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            font-size: 14px;
            color: #aaa;
        }

        .show-played-toggle .toggle-circle {
            width: 16px;
            height: 16px;
            border: 2px solid #aaa;
            border-radius: 50%;
            position: relative;
        }

        .show-played-toggle .toggle-circle.filled {
            background-color: #ff9e9e;
            border-color: #ff9e9e;
        }

        #anime-schedule-display-count {
            background: #ff9e9e;
            color: white;
            border: none;
            padding: 8px 5px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
            flex: 30%;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    function waitForContainer() {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                // 检查是否是窄屏移动端
                const isNarrowScreen = window.matchMedia('(max-width: 528px)').matches;
                let targetContainer;

                if (isNarrowScreen) {
                    targetContainer = document.getElementById('columnHomeA');
                } else {
                    targetContainer = document.getElementById('columnHomeB');
                }

                if (targetContainer) {
                    clearInterval(checkInterval);
                    resolve(targetContainer);
                }
            }, 500);
        });
    }

    // 加载设置
    function loadSettings() {
        const settings = localStorage.getItem(SETTINGS_KEY);
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                if (parsed.played !== undefined) {
                    showPlayedAnime = parsed.played === "True";
                }
                if (parsed.size !== undefined) {
                    displayCount = parseInt(parsed.size);
                    // Ensure display count is within 2-8 range
                    if (displayCount < 2) displayCount = 2;
                    if (displayCount > 8) displayCount = 8;
                }
            } catch (e) {
                console.error('Failed to parse settings:', e);
            }
        }
    }

    // 保存设置
    function saveSettings() {
        const settings = {
            played: showPlayedAnime ? "True" : "False",
            size: displayCount.toString()
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    // 切换显示已播放动画
    function toggleShowPlayed() {
        showPlayedAnime = !showPlayedAnime;
        saveSettings();
        updateCountdown();
        updateToggleButton();
    }

    // 更新切换按钮状态
    function updateToggleButton() {
        const toggleCircle = document.querySelector('.show-played-toggle .toggle-circle');
        if (toggleCircle) {
            toggleCircle.classList.toggle('filled', showPlayedAnime);
        }
    }

    // 更新显示数量
    function updateDisplayCount() {
        const countSelect = document.getElementById('anime-schedule-display-count');
        if (countSelect) {
            displayCount = parseInt(countSelect.value);
            saveSettings();
            updateCountdown();
        }
    }

    async function initialize() {
        const targetContainer = await waitForContainer();
        loadSettings();

        // 初始化
        const container = document.createElement('div');
        container.id = 'anime-schedule-container';
        container.innerHTML = `
            <div id="anime-schedule-countdown">
                <span>00:00</span>
                <div class="show-played-toggle">
                    <span>显示已放送</span>
                    <div class="toggle-circle ${showPlayedAnime ? 'filled' : ''}"></div>
                </div>
            </div>
            <div class="anime-schedule-item">加载中...</div>
            <div class="anime-schedule-item"></div>
            <div class="anime-schedule-item"></div>
            <div class="anime-schedule-timeline"></div>
            <div id="anime-schedule-completed-container"></div>
        `;
        const isNarrowScreen = window.matchMedia('(max-width: 528px)').matches;
        if (isNarrowScreen) {
            // 如果是窄屏，插入到 columnHomeA 的顶部
            targetContainer.insertBefore(container, targetContainer.firstChild);
        } else {
            // 如果是宽屏，插入到 columnHomeB 的顶部
            targetContainer.insertBefore(container, targetContainer.firstChild);
        }

        // 添加动画效果
        setTimeout(() => {
            container.classList.add('show');
        }, 50);

        // 添加切换按钮事件
        const toggleButton = container.querySelector('.show-played-toggle');
        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止事件冒泡触发容器点击事件
            showPlayedAnime = !showPlayedAnime;
            saveSettings();
            updateToggleButton();
            updateCountdown(); // 立即刷新显示
        });

        // 初始化设置框
        const modal = document.createElement('div');
        modal.id = 'anime-schedule-modal';
        modal.innerHTML = `
            <div id="anime-schedule-modal-content">
                <button id="anime-schedule-close-btn">×</button>
                <div id="anime-schedule-modal-title">添加动画时间</div>
                <div id="anime-schedule-button-container">
                    <button id="anime-schedule-auto-fetch-btn">自动获取时间</button>
                    <select id="anime-schedule-timezone-select">
                        <option value="-12">UTC-12</option>
                        <option value="-11">UTC-11</option>
                        <option value="-10">UTC-10</option>
                        <option value="-9">UTC-9</option>
                        <option value="-8">UTC-8</option>
                        <option value="-7">UTC-7</option>
                        <option value="-6">UTC-6</option>
                        <option value="-5">UTC-5</option>
                        <option value="-4">UTC-4</option>
                        <option value="-3">UTC-3</option>
                        <option value="-2">UTC-2</option>
                        <option value="-1">UTC-1</option>
                        <option value="0">UTC±0</option>
                        <option value="1">UTC+1</option>
                        <option value="2">UTC+2</option>
                        <option value="3">UTC+3</option>
                        <option value="4">UTC+4</option>
                        <option value="5">UTC+5</option>
                        <option value="6">UTC+6</option>
                        <option value="7">UTC+7</option>
                        <option value="8" selected>UTC+8</option>
                        <option value="9">UTC+9</option>
                        <option value="10">UTC+10</option>
                        <option value="11">UTC+11</option>
                        <option value="12">UTC+12</option>
                    </select>
                    <select id="anime-schedule-display-count">
                        <option value="2" ${displayCount === 2 ? 'selected' : ''}>显示2部</option>
                        <option value="3" ${displayCount === 3 ? 'selected' : ''}>显示3部</option>
                        <option value="4" ${displayCount === 4 ? 'selected' : ''}>显示4部</option>
                        <option value="5" ${displayCount === 5 ? 'selected' : ''}>显示5部</option>
                        <option value="6" ${displayCount === 6 ? 'selected' : ''}>显示6部</option>
                        <option value="7" ${displayCount === 7 ? 'selected' : ''}>显示7部</option>
                        <option value="8" ${displayCount === 8 ? 'selected' : ''}>显示8部</option>
                    </select>
                </div>
                <div id="anime-schedule-schedule-list"></div>
                <div class="anime-schedule-form-group">
                    <label for="anime-schedule-day">星期</label>
                    <select id="anime-schedule-day">
                        <option value="0">周日</option>
                        <option value="1">周一</option>
                        <option value="2">周二</option>
                        <option value="3">周三</option>
                        <option value="4">周四</option>
                        <option value="5">周五</option>
                        <option value="6">周六</option>
                    </select>
                </div>
                <div class="anime-schedule-form-group">
                    <label>时间</label>
                    <div id="anime-schedule-time-inputs">
                        <input type="number" id="anime-schedule-hour" min="0" max="23" placeholder="时" value="20">
                        <input type="number" id="anime-schedule-minute" min="0" max="59" placeholder="分" value="00">
                    </div>
                </div>
                <div class="anime-schedule-form-group">
                    <label for="anime-schedule-name">动画名称</label>
                    <input type="text" id="anime-schedule-name" placeholder="输入动画名称">
                </div>
                <button id="anime-schedule-add-btn">添加</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 获取当前存储的时间表
        function getSchedule() {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        // 保存时间表
        function saveSchedule(schedule) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
        }

        // 删除时间表项
        function deleteScheduleItem(index) {
            const schedule = getSchedule();
            schedule.splice(index, 1);
            saveSchedule(schedule);
            updateScheduleList();
            updateCountdown();
        }

        // 重置
        function resetForm() {
            document.getElementById('anime-schedule-day').value = '0';
            document.getElementById('anime-schedule-hour').value = '20';
            document.getElementById('anime-schedule-minute').value = '00';
            document.getElementById('anime-schedule-name').value = '';
            document.getElementById('anime-schedule-add-btn').textContent = '添加';
            currentEditIndex = -1;
        }

        // 添加或更新时间
        function addOrUpdateSchedule() {
            const day = parseInt(document.getElementById('anime-schedule-day').value);
            const hour = parseInt(document.getElementById('anime-schedule-hour').value);
            const minute = parseInt(document.getElementById('anime-schedule-minute').value);
            const name = document.getElementById('anime-schedule-name').value.trim();

            if (!name) {
                alert('请输入动画名称');
                return;
            }

            const schedule = getSchedule();

            if (currentEditIndex >= 0) {
                // 更新现有项
                schedule[currentEditIndex] = { day, hour, minute, name };
            } else {
                // 添加新项
                schedule.push({ day, hour, minute, name });
            }

            // 按时间排序
            schedule.sort((a, b) => {
                if (a.day !== b.day) return a.day - b.day;
                if (a.hour !== b.hour) return a.hour - b.hour;
                return a.minute - b.minute;
            });

            saveSchedule(schedule);
            updateScheduleList();
            updateCountdown();
            resetForm();
        }

        // 编辑时间表项
        function editScheduleItem(index) {
            const schedule = getSchedule();
            if (index >= 0 && index < schedule.length) {
                const item = schedule[index];
                document.getElementById('anime-schedule-day').value = item.day;
                document.getElementById('anime-schedule-hour').value = item.hour;
                document.getElementById('anime-schedule-minute').value = item.minute;
                document.getElementById('anime-schedule-name').value = item.name;
                document.getElementById('anime-schedule-add-btn').textContent = '更新';
                currentEditIndex = index;
            }
        }

        // 更新时间表列表显示
        function updateScheduleList() {
            const schedule = getSchedule();
            const listEl = document.getElementById('anime-schedule-schedule-list');

            if (schedule.length === 0) {
                listEl.innerHTML = '<div class="anime-schedule-schedule-item">暂无时间表</div>';
                return;
            }

            const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            listEl.innerHTML = schedule.map((item, index) => {
                const time = `${item.hour.toString().padStart(2, '0')}:${item.minute.toString().padStart(2, '0')}`;
                return `
                    <div class="anime-schedule-schedule-item" data-index="${index}">
                        <span>${days[item.day]} ${time} - ${item.name}</span>
                        <button class="anime-schedule-edit-btn" data-index="${index}">✎</button>
                        <button class="anime-schedule-delete-btn" data-index="${index}">×</button>
                    </div>
                `;
            }).join('');

            document.querySelectorAll('.anime-schedule-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    deleteScheduleItem(index);
                });
            });

            // 添加编辑按钮
            document.querySelectorAll('.anime-schedule-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    editScheduleItem(index);
                });
            });

            // 添加点击整行编辑
            document.querySelectorAll('.anime-schedule-schedule-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('anime-schedule-delete-btn') &&
                        !e.target.classList.contains('anime-schedule-edit-btn')) {
                        const index = parseInt(item.dataset.index);
                        editScheduleItem(index);
                    }
                });
            });
        }

        // 计算距离下一个动画的时间
        function calculateTimeUntilNextAnime() {
            const now = new Date();
            const currentDay = now.getDay(); // 0 (周日) 到 6 (周六)
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            const schedule = getSchedule();
            if (schedule.length === 0) return null;

            // 找到下一个即将播放的动画
            let nextAnime = null;
            let nextAnimeDiff = Infinity;
            let nextAnimeIndex = -1;

            // 存储已完成播放的动画
            const completedAnime = [];

            for (let i = 0; i < schedule.length; i++) {
                const item = schedule[i];

                let diff = (item.day - currentDay) * 24 * 60 +
                          (item.hour - currentHour) * 60 +
                          (item.minute - currentMinute);

                // 如果是今天已经播放过的动画，加入已完成列表
                if (diff < 0 && diff > -18 * 60) {
                    completedAnime.push(item);
                }

                if (diff > 150 * 60 && diff < 168 * 60) {
                    completedAnime.push(item);
                }

                // 如果本周已经过了这个时间，看下周的
                if (diff < 0) diff += 7 * 24 * 60;

                if (diff < nextAnimeDiff) {
                    nextAnimeDiff = diff;
                    nextAnime = item;
                    nextAnimeIndex = i;
                }
            }

            // 找到接下来要放送的动画
            const upcomingAnime = [];
            for (let i = 0; i < displayCount; i++) {
                const index = (nextAnimeIndex + i) % schedule.length;
                upcomingAnime.push(schedule[index]);
            }

            return {
                nextAnime,
                nextAnimeDiff,
                upcomingAnime,
                completedAnime
            };
        }

        // 更新倒计时显示
        function updateCountdown() {
            const result = calculateTimeUntilNextAnime();
            const countdownEl = document.getElementById('anime-schedule-countdown');
            const itemsContainer = document.getElementById('anime-schedule-container');
            const completedContainer = document.getElementById('anime-schedule-completed-container');
            const timelineEl = document.querySelector('.anime-schedule-timeline');

            const existingItems = itemsContainer.querySelectorAll('.anime-schedule-item');
            existingItems.forEach(item => item.remove());

            if (!result || !result.nextAnime) {
                countdownEl.querySelector('span').textContent = '00:00';
                const noScheduleItem = document.createElement('div');
                noScheduleItem.className = 'anime-schedule-item';
                noScheduleItem.textContent = '没有设置时间表';
                itemsContainer.insertBefore(noScheduleItem, timelineEl);
                completedContainer.innerHTML = '';
                timelineEl.style.display = 'none';
                return;
            }

            const { nextAnime, nextAnimeDiff, upcomingAnime, completedAnime } = result;
            const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            // 更新倒计时
            const hours = Math.floor(nextAnimeDiff / 60);
            const minutes = nextAnimeDiff % 60;
            countdownEl.querySelector('span').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            // 创建并添加新的项目元素
            upcomingAnime.forEach((item, index) => {
                const timeStr = `${days[item.day]} ${item.hour.toString().padStart(2, '0')}:${item.minute.toString().padStart(2, '0')}`;
                const itemEl = document.createElement('div');
                itemEl.className = 'anime-schedule-item';
                itemEl.textContent = `${timeStr} - ${item.name}`;

                // 第一个项目加粗
                if (index === 0) {
                    itemEl.style.fontWeight = 'bold';
                }

                itemsContainer.insertBefore(itemEl, timelineEl);
            });

            // 更新已完成播放的动画
            if (completedAnime && completedAnime.length > 0) {
                timelineEl.style.display = showPlayedAnime ? 'block' : 'none';
                completedContainer.innerHTML = '';

                // 按时间排序（从早到晚）
                completedAnime.sort((a, b) => {
                    if (a.hour !== b.hour) return a.hour - b.hour;
                    return a.minute - b.minute;
                });

                if (showPlayedAnime) {
                    // 添加已完成的动画
                    completedAnime.forEach(item => {
                        const timeStr = `${days[item.day]} ${item.hour.toString().padStart(2, '0')}:${item.minute.toString().padStart(2, '0')}`;
                        const completedEl = document.createElement('div');
                        completedEl.className = 'anime-schedule-completed';
                        completedEl.textContent = `${timeStr} - ${item.name}`;
                        completedContainer.appendChild(completedEl);
                    });
                }
            } else {
                timelineEl.style.display = 'none';
                completedContainer.innerHTML = '';
            }
        }

        // 自动获取动画时间表
        async function autoFetchSchedule() {
            if (!confirm('此操作将清空目前的时间表，是否继续？')) {
                return;
            }

            // 获取当前选择的时区
            currentTimezone = parseInt(document.getElementById('anime-schedule-timezone-select').value);

            // 获取页面中的条目ID
            const subjectLinks = document.querySelectorAll('#cloumnSubjectInfo .infoWrapper_tv.hidden.clearit a[href^="/subject/"]');
            const subjectIds = new Set();

            subjectLinks.forEach(link => {
                const href = link.getAttribute('href');
                const match = href.match(/^\/subject\/(\d+)/);
                if (match && match[1]) {
                    subjectIds.add(match[1]);
                }
            });

            if (subjectIds.size === 0) {
                alert('未找到任何动画条目ID');
                return;
            }

            try {
                // 从GitHub获取时间表数据
                const response = await fetch('https://raw.githubusercontent.com/zhollgit/bgm-onair/main/onair.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const newSchedule = [];

                // 处理API返回的数据
                data.items.forEach(item => {
                    // 查找bangumi站点ID
                    const bangumiSite = item.sites.find(site => site.site === 'bangumi');
                    if (bangumiSite && bangumiSite.id && subjectIds.has(bangumiSite.id)) {
                        if (item.begin) {
                            const beginDate = new Date(item.begin);
                            // 根据设置的时区调整时间
                            beginDate.setHours(beginDate.getHours() + currentTimezone);

                            const day = beginDate.getUTCDay(); // 0-6 (周日到周六)
                            const hour = beginDate.getUTCHours();
                            const minute = beginDate.getUTCMinutes();

                            // 获取中文名称或使用原标题
                            let name = item.title;
                            if (item.titleTranslate && item.titleTranslate['zh-Hans'] && item.titleTranslate['zh-Hans'].length > 0) {
                                name = item.titleTranslate['zh-Hans'][0];
                            }

                            newSchedule.push({
                                day,
                                hour,
                                minute,
                                name
                            });
                        }
                    }
                });

                if (newSchedule.length === 0) {
                    alert('未找到匹配的时间表数据');
                    return;
                }

                // 保存新的时间表
                saveSchedule(newSchedule);
                updateScheduleList();
                updateCountdown();
                alert(`成功获取 ${newSchedule.length} 个动画的时间表`);

                // 添加"测试内容"动画
                setTimeout(() => {
                    // 设置表单值
                    document.getElementById('anime-schedule-day').value = '1'; // 周一
                    document.getElementById('anime-schedule-hour').value = '12';
                    document.getElementById('anime-schedule-minute').value = '30';
                    document.getElementById('anime-schedule-name').value = '测试内容';

                    // 添加新时间
                    addOrUpdateSchedule();

                    // 删除刚添加的"测试内容"
                    setTimeout(() => {
                        const schedule = getSchedule();
                        const testIndex = schedule.findIndex(item => item.name === '测试内容');
                        if (testIndex !== -1) {
                            deleteScheduleItem(testIndex);
                        }
                    }, 500);
                }, 500);
            } catch (error) {
                console.error('获取时间表失败:', error);
                alert('获取时间表失败: ' + error.message);
            }
        }

        container.addEventListener('click', (e) => {
            // 防止点击切换按钮时触发
            if (!e.target.closest('.show-played-toggle')) {
                document.getElementById('anime-schedule-modal').classList.add('show');
                resetForm();
                updateScheduleList();
            }
        });

        document.getElementById('anime-schedule-close-btn').addEventListener('click', () => {
            document.getElementById('anime-schedule-modal').classList.remove('show');
            resetForm();
        });

        document.getElementById('anime-schedule-add-btn').addEventListener('click', addOrUpdateSchedule);

        document.getElementById('anime-schedule-auto-fetch-btn').addEventListener('click', autoFetchSchedule);

        document.getElementById('anime-schedule-display-count').addEventListener('change', updateDisplayCount);

        // 初始化并开始定时更新
        updateCountdown();
        setInterval(updateCountdown, 60000); // 每分钟更新一次
    }

    initialize();
})();