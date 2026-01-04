// ==UserScript==
// @name         微信读书30天阅读挑战打卡记录（本地版）
// @version      0.24
// @description  记录30天阅读挑战的打卡情况，自动统计阅读时长，数据保存在本地，显示日期、挑战周期、进度条及周分布，仅在页面激活时计时，每分钟更新一次，无需刷新
// @icon         https://i.miji.bid/2025/03/15/560664f99070e139e28703cf92975c73.jpeg
// @author       Grok
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/529179/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A630%E5%A4%A9%E9%98%85%E8%AF%BB%E6%8C%91%E6%88%98%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95%EF%BC%88%E6%9C%AC%E5%9C%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529179/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A630%E5%A4%A9%E9%98%85%E8%AF%BB%E6%8C%91%E6%88%98%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95%EF%BC%88%E6%9C%AC%E5%9C%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 常量定义 =====
    const TOTAL_DAYS = 30;
    const TOTAL_GOAL_HOURS = 30;
    const CHART_BLUE = '#30AAFD';
    const CALENDAR_DAYS = 30;

    // ===== 数据初始化 =====
    let challengeData = JSON.parse(localStorage.getItem('challengeData')) || {
        startDate: new Date().toISOString().split('T')[0],
        completedDays: Array(TOTAL_DAYS).fill(false),
        dailyReadingTimes: Array(TOTAL_DAYS).fill(0)
    };
    let startTime = null;
    let isPageActive = document.hasFocus();
    const hideOnScrollDown = GM_getValue('hideOnScrollDown', true);
    let globalTooltip = null;
    let eventListeners = [];
    let intervalId = null;
    let todayReadingElement = null; // 保存“今日阅读”元素的引用

    // ===== 时间记录相关函数 =====
    function recordReadingTime() {
        if (!startTime || !isPageActive) return;
        console.log('recordReadingTime triggered'); // 调试日志
        try {
            const endTime = Date.now();
            const sessionTime = (endTime - startTime) / 1000 / 60;
            const todayIndex = Math.min(
                Math.floor((new Date() - new Date(challengeData.startDate)) / (1000 * 60 * 60 * 24)),
                TOTAL_DAYS - 1
            );

            if (todayIndex < 0) return;

            challengeData.dailyReadingTimes[todayIndex] += sessionTime;
            challengeData.completedDays[todayIndex] = challengeData.dailyReadingTimes[todayIndex] >= 30;
            localStorage.setItem('challengeData', JSON.stringify(challengeData));
            startTime = Date.now();
            updateTodayReadingTime(todayIndex);
        } catch (e) {
            console.error('记录阅读时长失败：', e);
        }
    }

    // ===== 更新“今日阅读”时间显示 =====
    function updateTodayReadingTime(todayIndex) {
        console.log('updateTodayReadingTime called'); // 调试日志
        try {
            const todayReadingMinutes = challengeData.dailyReadingTimes[todayIndex];
            const todayReadingHours = Math.floor(todayReadingMinutes / 60);
            const todayReadingMins = Math.floor(todayReadingMinutes % 60);
            const todayReadingTime = `📖 今日阅读：${todayReadingHours}小时${todayReadingMins}分钟`;

            if (todayReadingElement) {
                todayReadingElement.textContent = todayReadingTime;
            } else {
                console.warn('todayReadingElement 未找到，重建 UI');
                createChallengeUI();
            }
        } catch (e) {
            console.error('更新今日阅读时间失败：', e);
            createChallengeUI();
        }
    }

    // ===== 页面激活状态监听 =====
    function handlePageActive() {
        if (document.hasFocus() && document.visibilityState === 'visible') {
            if (!isPageActive) {
                console.log('页面激活，开始计时');
                startTime = Date.now();
                isPageActive = true;
                if (!intervalId) {
                    intervalId = setInterval(recordReadingTime, 60 * 1000);
                    console.log('定时器已启动，ID:', intervalId);
                }
            }
        }
    }

    function handlePageInactive() {
        if (!document.hasFocus() || document.visibilityState === 'hidden') {
            if (isPageActive) {
                console.log('页面失活，暂停计时');
                recordReadingTime();
                startTime = null;
                isPageActive = false;
                if (intervalId) {
                    clearInterval(intervalId);
                    console.log('定时器已清除，ID:', intervalId);
                    intervalId = null;
                }
            }
        }
    }

    // ===== 工具函数 =====
    function formatDate(date) {
        return date.toISOString().split('T')[0].replace(/-/g, '/');
    }

    function formatFullDateWithDay(date) {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const formattedDate = formatDate(date);
        const dayOfWeek = weekdays[date.getDay()];
        return `${formattedDate} ${dayOfWeek}`;
    }

    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        return `${hours}小时${mins}分钟`;
    }

    function calculateTotalTime() {
        try {
            const totalMinutes = challengeData.dailyReadingTimes.reduce((sum, time) => sum + (time || 0), 0);
            const goalMinutes = TOTAL_GOAL_HOURS * 60;
            const totalHours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;

            const remainingTotalMinutes = Math.max(0, goalMinutes - totalMinutes);
            const remainingHours = Math.floor(remainingTotalMinutes / 60);
            const remainingMins = Math.floor(remainingTotalMinutes % 60);

            const daysPassed = Math.min(
                Math.floor((new Date() - new Date(challengeData.startDate)) / (1000 * 60 * 60 * 24)) + 1,
                TOTAL_DAYS
            );
            const avgMinutes = daysPassed > 0 ? totalMinutes / daysPassed : 0;

            return {
                total: `${totalHours}小时${Math.floor(remainingMinutes)}分钟`,
                remaining: `${remainingHours}小时${remainingMins}分钟`,
                isGoalReached: remainingTotalMinutes === 0,
                average: `${Math.floor(avgMinutes / 60)}小时${Math.floor(avgMinutes % 60)}分钟`
            };
        } catch (e) {
            console.error('计算总时长失败：', e);
            return { total: '0小时0分钟', remaining: '30小时0分钟', isGoalReached: false, average: '0小时0分钟' };
        }
    }

    function getWeeklyReadingTimes() {
        try {
            const today = new Date();
            const currentDay = today.getDay();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

            const weeklyTimes = Array(7).fill(0);
            const weeklyDates = [];
            let weeklyTotalMinutes = 0;

            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);
                const dayIndex = Math.floor((day - new Date(challengeData.startDate)) / (1000 * 60 * 60 * 24));
                weeklyDates.push(day);
                if (dayIndex >= 0 && dayIndex < TOTAL_DAYS) {
                    weeklyTimes[i] = challengeData.dailyReadingTimes[dayIndex] || 0;
                    weeklyTotalMinutes += weeklyTimes[i];
                }
            }

            return {
                times: weeklyTimes,
                dates: weeklyDates,
                total: `${Math.floor(weeklyTotalMinutes / 60)}小时${Math.floor(weeklyTotalMinutes % 60)}分钟`
            };
        } catch (e) {
            console.error('获取周数据失败：', e);
            return { times: Array(7).fill(0), dates: Array(7).fill(new Date()), total: '0小时0分钟' };
        }
    }

    // ===== UI 创建函数 =====
    function createChallengeUI() {
        try {
            const existingUI = document.getElementById('challenge-container');
            if (existingUI) existingUI.remove();

            if (!document.body) {
                console.warn('document.body 未加载，跳过 UI 创建');
                return;
            }

            const container = document.createElement('div');
            container.id = 'challenge-container';
            container.style.cssText = `
                position: fixed; top: 50px; left: 70px;
                background: rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(10px);
                color: #333; padding: 15px; z-index: 10000;
                width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border: 1px solid rgba(221, 221, 221, 0.5); border-radius: 8px; font-size: 14px;
                transition: opacity 0.3s ease;
                overflow: visible;
                opacity: 1;
            `;

            const totalTime = calculateTotalTime();
            const weeklyData = getWeeklyReadingTimes();
            const startDate = new Date(challengeData.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + TOTAL_DAYS - 1);
            const todayIndex = Math.min(
                Math.floor((new Date() - new Date(challengeData.startDate)) / (1000 * 60 * 60 * 24)),
                TOTAL_DAYS - 1
            );
            const todayReadingMinutes = todayIndex >= 0 ? challengeData.dailyReadingTimes[todayIndex] : 0;
            const todayReadingHours = Math.floor(todayReadingMinutes / 60);
            const todayReadingMins = Math.floor(todayReadingMinutes % 60);
            const todayReadingTime = `${todayReadingHours}小时${todayReadingMins}分钟`;
            const maxWeeklyMinutes = Math.max(...weeklyData.times, 1);
            const maxDailyMinutes = Math.max(...challengeData.dailyReadingTimes, 1);

            const calendarRows = Math.ceil(CALENDAR_DAYS / 6);
            const calendarHTML = Array.from({ length: CALENDAR_DAYS }, (_, i) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const day = date.getDate();
                const isWithinChallenge = i < TOTAL_DAYS;
                const fullDateWithDay = formatFullDateWithDay(date);
                return `
                    <div class="calendar-cell" data-date="${fullDateWithDay}" style="width: 28px; height: 28px; background-color: ${isWithinChallenge && challengeData.completedDays[i] ? '#30AAFD' : '#ebedf0'}; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: ${isWithinChallenge && challengeData.completedDays[i] ? '#fff' : '#666'};">
                        ${day}
                    </div>`;
            }).join('');

            const dailyChartHTML = Array.from({ length: TOTAL_DAYS }, (_, i) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const minutes = challengeData.dailyReadingTimes[i] || 0;
                const heightPercentage = (minutes / maxDailyMinutes) * 100;
                const fullDateWithDay = formatFullDateWithDay(date);
                return `
                    <div style="flex: 1; background: #ebedf0; border-radius: 2px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" class="chart-bar" data-minutes="${minutes}" data-date="${fullDateWithDay}">
                        <div style="width: 100%; height: ${heightPercentage}%; background: ${CHART_BLUE}; border-radius: 2px; transition: height 0.3s ease;"></div>
                    </div>`;
            }).join('');

            const weeklyChartHTML = weeklyData.times.map((minutes, i) => {
                const date = weeklyData.dates[i];
                const heightPercentage = (minutes / maxWeeklyMinutes) * 100;
                const fullDateWithDay = formatFullDateWithDay(date);
                return `
                    <div style="flex: 1; background: #ebedf0; border-radius: 2px; display: flex; flex-direction: column; justify-content: flex-end; position: relative;" class="chart-bar" data-minutes="${minutes}" data-date="${fullDateWithDay}">
                        <div style="width: 100%; height: ${heightPercentage}%; background: ${CHART_BLUE}; border-radius: 2px; transition: height 0.3s ease;"></div>
                    </div>`;
            }).join('');

            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h1 style="font-size: 1.2em; margin: 0; color: #333;">30天阅读挑战</h1>
                    <div style="position: relative; display: inline-block;">
                        <button style="background: none; border: none; font-size: 1em; color: ${CHART_BLUE}; cursor: pointer; padding: 0;">ℹ️</button>
                        <div class="info-tooltip" style="display: none; position: absolute; top: 100%; right: 0; background: rgba(51, 51, 51, 0.9); color: #fff; padding: 6px 10px; font-size: 0.85em; border-radius: 4px; z-index: 2147483647; box-shadow: 0 2px 4px rgba(0,0,0,0.2); line-height: 1.4; width: 220px; text-align: left;">
                            <div>【挑战时间】：根据每次重置时日期计算</div>
                            <div>【时长更新】：激活阅读页面时开始计时，每分钟更新一次（60秒内切出页面则重新计时）</div>
                            <div>【状态更新】：当天完成30min更新状态（官方5min）</div>
                            <div>【本周期目标时长】：30天总时长需达30小时</div>
                            <div>【日均阅读】：计算挑战周期内的日平均时长</div>
                        </div>
                    </div>
                </div>
                <div style="font-size: 1em; color: #666; margin-top: 10px;">
                    <div>🏅 挑战时间：</div>
                    <div>\u00A0\u00A0\u00A0\u00A0 ${formatDate(startDate)} 至 ${formatDate(endDate)}</div>
                </div>
                <div style="font-size: 1em; color: #666; margin-top: 10px; text-align: left;">
                    <div>⌚ 本周期目标时长：</div>
                    <div>\u00A0\u00A0\u00A0\u00A0 ${totalTime.total} / 还需${totalTime.remaining}</div>
                </div>
                ${totalTime.isGoalReached ? `
                    <div style="font-size: 1em; color: ${CHART_BLUE}; margin-top: 10px; text-align: left;">
                        🎉 已达成目标时长
                    </div>
                ` : ''}
                <div style="display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(${calendarRows}, 1fr); gap: 4px; margin-top: 10px; width: 100%;">
                    ${calendarHTML}
                </div>
                <div id="today-reading" style="font-size: 1em; color: ${CHART_BLUE}; margin-top: 10px; text-align: left;">
                    📖 今日阅读：${todayReadingTime}
                </div>
                <div style="font-size: 1em; color: #666; margin-top: 10px; text-align: left;">
                    📚 日均阅读：${totalTime.average}
                </div>
                <div style="margin-top: 10px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 6px; text-align: left;">
                        📊 本周阅读总时长：${weeklyData.total}
                    </div>
                    <div style="display: flex; gap: 2px; height: 100px; width: 100%; padding: 5px; background: #fff; border-radius: 4px; position: relative;" id="weeklyChart">
                        ${weeklyChartHTML}
                    </div>
                </div>
                <div style="margin-top: 5px;">
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 6px; text-align: left;">
                        📈 本周期阅读分布
                    </div>
                    <div style="display: flex; gap: 2px; height: 100px; width: 100%; padding: 5px; background: #fff; border-radius: 4px; position: relative;" id="dailyChart">
                        ${dailyChartHTML}
                    </div>
                </div>
            `;

            eventListeners.forEach(({ element, type, listener }) => {
                element.removeEventListener(type, listener);
            });
            eventListeners = [];

            if (!globalTooltip) {
                globalTooltip = document.createElement('div');
                globalTooltip.className = 'tooltip';
                globalTooltip.style.cssText = `
                    display: none; position: fixed;
                    background: rgba(51, 51, 51, 0.9); color: #fff;
                    padding: 6px 10px; font-size: 0.9em; border-radius: 4px;
                    white-space: pre-wrap; z-index: 2147483647;
                    pointer-events: none; transform: translateX(-50%);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    line-height: 1.4;
                `;
                document.body.appendChild(globalTooltip);
            } else {
                globalTooltip.style.display = 'none';
            }

            document.body.appendChild(container);

            // 保存“今日阅读”元素的引用
            todayReadingElement = document.getElementById('today-reading');
            console.log('todayReadingElement 初始化:', todayReadingElement);

            const dailyChart = container.querySelector('#dailyChart');
            const weeklyChart = container.querySelector('#weeklyChart');
            const calendarCells = container.querySelectorAll('.calendar-cell');
            const infoButton = container.querySelector('button');
            const infoTooltip = container.querySelector('.info-tooltip');

            const showInfoListener = () => infoTooltip.style.display = 'block';
            const hideInfoListener = () => infoTooltip.style.display = 'none';
            infoButton.addEventListener('mouseover', showInfoListener);
            infoButton.addEventListener('mouseout', hideInfoListener);
            eventListeners.push({ element: infoButton, type: 'mouseover', listener: showInfoListener });
            eventListeners.push({ element: infoButton, type: 'mouseout', listener: hideInfoListener });

            function setupChartBars(chart, bars) {
                if (!chart) return;
                bars.forEach((bar) => {
                    const mouseoverListener = (e) => {
                        const minutes = parseFloat(bar.getAttribute('data-minutes')) || 0;
                        const dateWithDay = bar.getAttribute('data-date');
                        globalTooltip.textContent = `${dateWithDay}\n${formatTime(minutes)}`;
                        globalTooltip.style.display = 'block';
                        const rect = bar.getBoundingClientRect();
                        globalTooltip.style.left = `${rect.left + rect.width / 2}px`;
                        globalTooltip.style.top = `${rect.top - globalTooltip.offsetHeight - 5}px`;
                    };
                    const mouseoutListener = () => {
                        globalTooltip.style.display = 'none';
                    };
                    const mousemoveListener = (e) => {
                        const rect = bar.getBoundingClientRect();
                        globalTooltip.style.left = `${rect.left + rect.width / 2}px`;
                        globalTooltip.style.top = `${rect.top - globalTooltip.offsetHeight - 5}px`;
                    };
                    bar.addEventListener('mouseover', mouseoverListener);
                    bar.addEventListener('mouseout', mouseoutListener);
                    bar.addEventListener('mousemove', mousemoveListener);
                    eventListeners.push({ element: bar, type: 'mouseover', listener: mouseoverListener });
                    eventListeners.push({ element: bar, type: 'mouseout', listener: mouseoutListener });
                    eventListeners.push({ element: bar, type: 'mousemove', listener: mousemoveListener });
                });
            }

            function setupCalendarCells(cells) {
                cells.forEach((cell) => {
                    const mouseoverListener = (e) => {
                        const fullDateWithDay = cell.getAttribute('data-date');
                        globalTooltip.textContent = fullDateWithDay;
                        globalTooltip.style.display = 'block';
                        const rect = cell.getBoundingClientRect();
                        globalTooltip.style.left = `${rect.left + rect.width / 2}px`;
                        globalTooltip.style.top = `${rect.top - globalTooltip.offsetHeight - 5}px`;
                    };
                    const mouseoutListener = () => {
                        globalTooltip.style.display = 'none';
                    };
                    const mousemoveListener = (e) => {
                        const rect = cell.getBoundingClientRect();
                        globalTooltip.style.left = `${rect.left + rect.width / 2}px`;
                        globalTooltip.style.top = `${rect.top - globalTooltip.offsetHeight - 5}px`;
                    };
                    cell.addEventListener('mouseover', mouseoverListener);
                    cell.addEventListener('mouseout', mouseoutListener);
                    cell.addEventListener('mousemove', mousemoveListener);
                    eventListeners.push({ element: cell, type: 'mouseover', listener: mouseoverListener });
                    eventListeners.push({ element: cell, type: 'mouseout', listener: mouseoutListener });
                    eventListeners.push({ element: cell, type: 'mousemove', listener: mousemoveListener });
                });
            }

            setupChartBars(dailyChart, dailyChart?.querySelectorAll('.chart-bar') || []);
            setupChartBars(weeklyChart, weeklyChart?.querySelectorAll('.chart-bar') || []);
            setupCalendarCells(calendarCells);

            requestAnimationFrame(() => {
                container.style.height = `${container.scrollHeight}px`;
            });

        } catch (e) {
            console.error('创建 UI 失败：', e);
        }
    }

    // ===== 重置功能 =====
    function resetChallenge() {
        if (confirm('确定要重置挑战吗？所有打卡记录将清空！')) {
            challengeData = {
                startDate: new Date().toISOString().split('T')[0],
                completedDays: Array(TOTAL_DAYS).fill(false),
                dailyReadingTimes: Array(TOTAL_DAYS).fill(0)
            };
            localStorage.setItem('challengeData', JSON.stringify(challengeData));
            createChallengeUI();
        }
    }

    // ===== 初始化和事件监听 =====
    function initialize() {
        if (!document.body) {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    observer.disconnect();
                    setup();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            return;
        }
        setup();
    }

    function setup() {
        let attempts = 0;
        const maxAttempts = 5;

        function tryCreateUI() {
            createChallengeUI();
            if (!document.getElementById('challenge-container') && attempts < maxAttempts) {
                attempts++;
                setTimeout(tryCreateUI, 100 * attempts);
            }
        }

        tryCreateUI();

        window.addEventListener('focus', handlePageActive);
        window.addEventListener('blur', handlePageInactive);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                handlePageActive();
            } else {
                handlePageInactive();
            }
        });

        handlePageActive();

        window.addEventListener('beforeunload', recordReadingTime);

        const observer = new MutationObserver(() => {
            if (!document.getElementById('challenge-container')) {
                createChallengeUI();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        GM_registerMenuCommand('重置挑战', resetChallenge);

        GM_registerMenuCommand(`下拉时UI: ${hideOnScrollDown ? '🙈 隐藏' : '👁️ 显示'}`, () => {
            GM_setValue('hideOnScrollDown', !hideOnScrollDown);
            location.reload();
        });

        let windowTop = 0;
        let isVisible = true;
        window.addEventListener('scroll', () => {
            let scrollS = window.scrollY;
            let container = document.getElementById('challenge-container');

            if (!container) return;

            if (scrollS > windowTop && scrollS > 50 && hideOnScrollDown) {
                if (isVisible) {
                    container.style.opacity = '0';
                    isVisible = false;
                    if (globalTooltip) globalTooltip.style.display = 'none';
                }
            } else {
                if (!isVisible) {
                    container.style.opacity = '1';
                    isVisible = true;
                }
            }
            windowTop = scrollS;
        });
    }

    initialize();
})();