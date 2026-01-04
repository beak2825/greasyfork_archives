// ==UserScript==
// @name         Zacks网球场预定小助手(浏览器插件)
// @namespace    http://zacks.com.cn/
// @version      0.1.1
// @description  显示场地状态
// @author       claude89757
// @match        *://*.ydmap.cn/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518322/Zacks%E7%BD%91%E7%90%83%E5%9C%BA%E9%A2%84%E5%AE%9A%E5%B0%8F%E5%8A%A9%E6%89%8B%28%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518322/Zacks%E7%BD%91%E7%90%83%E5%9C%BA%E9%A2%84%E5%AE%9A%E5%B0%8F%E5%8A%A9%E6%89%8B%28%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = (...args) => {
        console.log('%c[预订助手]', 'color: #1890ff', ...args);
    };

    function injectCode() {
        log('开始注入代码');

        const script = document.createElement('script');
        script.textContent = '(' + function() {
            const log = function(...args) {
                console.log('%c[预订助手]', 'color: #1890ff', ...args);
            };

            // 默认查询间隔时间（秒）
            let CHECK_INTERVAL = 180;

            // 查询间隔选项（秒）
            const CHECK_INTERVAL_OPTIONS = {
                '2分钟': 120,
                '3分钟': 180,
                '5分钟': 300,
                '10分钟': 600
            };

            // 统计数据对象
            const statistics = {
                runCount: 0,
                totalSlots: 0,
                availableSlots: 0,
                matchedSlots: 0,
                notificationCount: 0,
                venueCount: 0
            };

            // 声音控制状态
            const soundControl = {
                enabled: true
            };

            // 时间范围控制
            const timeRangeControl = {
                startTime: '18:00',
                endTime: '22:00'
            };

            // 场地名称映射表
            let venueMap = {};
            // 时间段配置
            let timeSlotConfig = [];
            // 场地列表
            let venueList = [];
            // 开放时间
            let openTime = 0;
            let closeTime = 0;

            // 将时间字符串转换为分钟数
            const timeToMinutes = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };

            // 创建弹窗显示场地状态
            function showVenueStatus(bookedSlots) {
                log('[状态更新] 开始更新', { 数据条数: bookedSlots.length });

                if (!openTime || !closeTime || venueList.length === 0) {
                    log('[状态更新] 缺少开放时间或场地列表');
                    return;
                }

                // 生成所有可能的时间段
                const generateTimeSlots = (startTimestamp, endTimestamp, intervalMinutes) => {
                    const slots = [];
                    const intervalMillis = intervalMinutes * 60 * 1000;
                    for (let time = startTimestamp; time < endTimestamp; time += intervalMillis) {
                        slots.push({
                            startTime: time,
                            endTime: time + intervalMillis
                        });
                    }
                    return slots;
                };

                // 使用开放时间生成时间段
                const allSlots = [];
                const intervalMinutes = 30; // 时间间隔30分钟

                venueList.forEach(venueId => {
                    // 生成场地的所有时间段
                    const timeSlots = generateTimeSlots(openTime, closeTime, intervalMinutes);

                    timeSlots.forEach(slot => {
                        allSlots.push({
                            venueId: venueId,
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            booked: false
                        });
                    });
                });

                // 更新统计中的场地数量
                statistics.venueCount = venueList.length;

                // 创建已预订时间段的映射
                const bookedSlotsMap = {};
                bookedSlots.forEach(slot => {
                    if (!bookedSlotsMap[slot.venueId]) {
                        bookedSlotsMap[slot.venueId] = [];
                    }
                    bookedSlotsMap[slot.venueId].push({
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    });
                });

                // 标记已预订的时间段
                allSlots.forEach(slot => {
                    const bookings = bookedSlotsMap[slot.venueId] || [];
                    for (const booking of bookings) {
                        if (slot.endTime > booking.startTime && slot.startTime < booking.endTime) {
                            slot.booked = true;
                            break;
                        }
                    }
                });

                statistics.totalSlots = allSlots.length;

                // 过滤可用的时间段
                const availableSlots = allSlots.filter(slot => !slot.booked);

                statistics.availableSlots = availableSlots.length;

                // 过滤符合时间范围的可用时间段
                const startMinutes = timeToMinutes(timeRangeControl.startTime);
                const endMinutes = timeToMinutes(timeRangeControl.endTime);

                const matchedSlots = [];
                const unmatchedSlots = [];

                availableSlots.forEach(slot => {
                    const slotStartTime = new Date(slot.startTime);
                    const slotMinutes = slotStartTime.getHours() * 60 + slotStartTime.getMinutes();

                    if (slotMinutes >= startMinutes && slotMinutes < endMinutes) {
                        matchedSlots.push(slot);
                    } else {
                        unmatchedSlots.push(slot);
                    }
                });

                statistics.matchedSlots = matchedSlots.length;

                // 更新场地信息显示
                const venueInfoContainer = document.getElementById('venue-info');
                if (venueInfoContainer) {
                    let venueInfoHTML = '';

                    if (matchedSlots.length > 0) {
                        venueInfoHTML += `<div style="font-weight: bold; margin-bottom: 8px;">符合时间范围的可预订场地：</div>`;
                        venueInfoHTML += matchedSlots.map(slot => {
                            const startTimeStr = new Date(slot.startTime).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const endTimeStr = new Date(slot.endTime).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const venueName = venueMap[slot.venueId] || `场地${slot.venueId}`;
                            const status = '可预订';

                            return `
                                <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px; border: 1px solid #e8e8e8;">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="color: #333; font-weight: bold;">${venueName}</span>
                                        <span style="color: #52c41a">${status}</span>
                                    </div>
                                    <div style="color: #666; margin-top: 4px;">
                                        时间：${startTimeStr} - ${endTimeStr}
                                    </div>
                                </div>
                            `;
                        }).join('');
                    } else {
                        venueInfoHTML += '<div style="text-align: center; color: #999; margin-bottom: 8px;">暂无符合时间范围的可预订场地</div>';
                    }

                    // 显示不符合时间范围的可预订场地
                    if (unmatchedSlots.length > 0) {
                        venueInfoHTML += `<div style="font-weight: bold; margin-bottom: 8px; margin-top: 16px;">不符合时间范围的可预订场地（用于调试）：</div>`;
                        venueInfoHTML += unmatchedSlots.map(slot => {
                            const startTimeStr = new Date(slot.startTime).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const endTimeStr = new Date(slot.endTime).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const venueName = venueMap[slot.venueId] || `场地${slot.venueId}`;
                            const status = '可预订（不在时间范围内）';

                            return `
                                <div style="margin-bottom: 8px; padding: 8px; background: #fafafa; border-radius: 4px; border: 1px solid #e8e8e8;">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="color: #333; font-weight: bold;">${venueName}</span>
                                        <span style="color: #d9d9d9">${status}</span>
                                    </div>
                                    <div style="color: #999; margin-top: 4px;">
                                        时间：${startTimeStr} - ${endTimeStr}
                                    </div>
                                </div>
                            `;
                        }).join('');
                    }

                    venueInfoContainer.innerHTML = venueInfoHTML;

                    // 发送通知和播放声音
                    if (matchedSlots.length > 0 && Notification.permission === "granted") {
                        matchedSlots.forEach(slot => {
                            const startTimeStr = new Date(slot.startTime).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const endTimeStr = new Date(slot.endTime).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            const venueName = venueMap[slot.venueId] || `场地${slot.venueId}`;

                            const notificationOptions = {
                                body: `${venueName}\n可预订时间段：${startTimeStr} - ${endTimeStr}`,
                                icon: "/favicon.ico"
                            };
                            new Notification("【Zacks网球场预定小助手】", notificationOptions);
                        });
                        playNotificationSound();
                        statistics.notificationCount += matchedSlots.length;
                    }
                }

                // 更新统计信息
                statistics.runCount++;
            }

            // 创建状态弹窗函数
            function createStatusModal() {
                // 创建弹窗容器
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 9999;
                    min-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                `;

                // 创建标题容器
                const titleContainer = document.createElement('div');
                titleContainer.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                `;

                const title = document.createElement('h2');
                title.textContent = 'Zacks网球场预定小助手（插件版）';
                title.style.margin = '0';
                title.style.fontSize = '20px';

                const countdown = document.createElement('span');
                countdown.style.cssText = `
                    color: #999;
                    font-size: 14px;
                `;

                titleContainer.appendChild(title);
                titleContainer.appendChild(countdown);
                modal.appendChild(titleContainer);

                // 添加时间范围和巡检周期选择容器
                const settingsContainer = document.createElement('div');
                settingsContainer.style.cssText = `
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #f0f5ff;
                    border-radius: 4px;
                `;

                const settingsTitle = document.createElement('div');
                settingsTitle.textContent = '场地时间范围设置 & 巡检周期';
                settingsTitle.style.cssText = 'margin-bottom: 10px; font-weight: bold;';
                settingsContainer.appendChild(settingsTitle);

                const settingsInputContainer = document.createElement('div');
                settingsInputContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `;

                // 创建开始时间选择
                const startTimeInput = document.createElement('input');
                startTimeInput.type = 'time';
                startTimeInput.value = timeRangeControl.startTime;
                startTimeInput.min = '07:00';
                startTimeInput.max = '23:00';
                startTimeInput.style.cssText = `
                    padding: 4px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                `;
                startTimeInput.onchange = () => {
                    timeRangeControl.startTime = startTimeInput.value;
                };

                // 创建结束时间选择
                const endTimeInput = document.createElement('input');
                endTimeInput.type = 'time';
                endTimeInput.value = timeRangeControl.endTime;
                endTimeInput.min = '07:00';
                endTimeInput.max = '23:00';
                endTimeInput.style.cssText = startTimeInput.style.cssText;
                endTimeInput.onchange = () => {
                    timeRangeControl.endTime = endTimeInput.value;
                };

                // 建巡检周期选择
                const intervalSelect = document.createElement('select');
                intervalSelect.style.cssText = `
                    padding: 4px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                `;
                for (const [label, value] of Object.entries(CHECK_INTERVAL_OPTIONS)) {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = label;
                    intervalSelect.appendChild(option);
                }
                intervalSelect.value = CHECK_INTERVAL;
                intervalSelect.onchange = () => {
                    CHECK_INTERVAL = parseInt(intervalSelect.value, 10);
                    restartCheckInterval();
                };

                settingsInputContainer.appendChild(document.createTextNode('从'));
                settingsInputContainer.appendChild(startTimeInput);
                settingsInputContainer.appendChild(document.createTextNode('到'));
                settingsInputContainer.appendChild(endTimeInput);
                settingsInputContainer.appendChild(document.createTextNode('巡检周期'));
                settingsInputContainer.appendChild(intervalSelect);
                settingsContainer.appendChild(settingsInputContainer);
                modal.appendChild(settingsContainer);

                // 创建统计信息容器
                const statsContainer = document.createElement('div');
                statsContainer.style.cssText = `
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #f5f5f5;
                    border-radius: 4px;
                `;

                statsContainer.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 10px;">统计信息</div>
                    <ul style="list-style: none; padding: 0; margin: 0; color: #333;">
                        <li>已运行次数：${statistics.runCount} 次</li>
                        <li>巡检场地数量：${statistics.venueCount} 个</li>
                        <li>可预订的时间段：${statistics.matchedSlots} 个</li>
                        <li>已发送通知：${statistics.notificationCount} 次</li>
                    </ul>
                `;
                modal.appendChild(statsContainer);

                // 添加场地信息显示区域
                const venueInfoContainer = document.createElement('div');
                venueInfoContainer.id = 'venue-info';
                venueInfoContainer.style.cssText = `
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #f6ffed;
                    border-radius: 4px;
                    max-height: 300px;
                    overflow-y: auto;
                `;
                venueInfoContainer.innerHTML = '<div style="text-align: center; color: #999;">暂无符合条件的场地</div>';
                modal.appendChild(venueInfoContainer);

                // 添加定时任务状态显示
                const taskStatus = document.createElement('div');
                taskStatus.style.cssText = `
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #fffbe6;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #666;
                `;

                const taskCountdown = document.createElement('div');
                const nextCheckTime = document.createElement('div');

                taskStatus.appendChild(taskCountdown);
                taskStatus.appendChild(nextCheckTime);
                modal.appendChild(taskStatus);

                // 添加描述信息容器
                const descContainer = document.createElement('div');
                descContainer.style.cssText = `
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #e6f7ff;
                    border-radius: 4px;
                    color: #666;
                    font-size: 14px;
                    line-height: 1.5;
                `;
                descContainer.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 10px;">小助手说明：</div>
                    <ul style="list-style: disc; padding-left: 20px; margin: 0;">
                        <li>自动查询周期：每 ${CHECK_INTERVAL} 秒查询一次</li>
                        <li>运行时长：8 小时后自动关闭</li>
                        <li>发现可预订场地时会自动发送系统通知</li>
                        <li>仅通知可预订场地，不支持自动订场，请勿滥用</li>
                    </ul>
                `;
                modal.appendChild(descContainer);

                // 添加作者信息
                const authorInfo = document.createElement('div');
                authorInfo.style.cssText = `
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    color: #666;
                    font-size: 14px;
                    line-height: 1.5;
                `;
                authorInfo.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 10px;">作者信息：</div>
                    <ul style="list-style: none; padding-left: 0; margin: 0;">
                        <li>邮箱：<a href="mailto:claude89757@gmail.com">claude89757@gmail.com</a></li>
                        <li>微信：claude89757</li>
                    </ul>
                `;
                modal.appendChild(authorInfo);

                // 更新统计信息的函数
                function updateStats() {
                    statsContainer.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 10px;">统计信息</div>
                        <ul style="list-style: none; padding: 0; margin: 0; color: #333;">
                            <li>已运行次数：${statistics.runCount} 次</li>
                            <li>巡检场地数量：${statistics.venueCount} 个</li>
                            <li>可预订的时间段：${statistics.matchedSlots} 个</li>
                            <li>已发送通知：${statistics.notificationCount} 次</li>
                        </ul>
                    `;
                }

                // 存储所有定时器的ID
                const timers = {
                    countdown: null,
                    taskStatus: null,
                    stats: null
                };

                // 关闭弹窗函数
                const closeModal = () => {
                    if (document.body.contains(modal)) {
                        // 清除所有定时器
                        clearInterval(timers.stats);
                        clearTimeout(timers.countdown);
                        clearTimeout(timers.taskStatus);
                        clearInterval(window.checkInterval); // 清除主定时查询任务

                        // 移除弹窗
                        document.body.removeChild(modal);

                        // 移除按钮容器
                        const buttonContainer = document.querySelector('#test-sound-button') && document.querySelector('#test-sound-button').parentElement;
                        if (buttonContainer) {
                            buttonContainer.remove();
                        }

                        log('[系统] 已停止所有定时任务');
                    }
                };

                // 倒计时更新函数
                let remainingSeconds = 28800;
                const updateCountdown = () => {
                    const hours = Math.floor(remainingSeconds / 3600);
                    const minutes = Math.floor((remainingSeconds % 3600) / 60);
                    const seconds = remainingSeconds % 60;
                    countdown.textContent = `${hours}小时${minutes}分${seconds}秒后自动关闭`;
                    if (remainingSeconds > 0) {
                        remainingSeconds--;
                        timers.countdown = setTimeout(updateCountdown, 1000);
                    }
                };

                // 定时任务状态更新函数
                let taskRemainingSeconds = CHECK_INTERVAL;
                const updateTaskStatus = () => {
                    if (!document.body.contains(modal)) return;

                    taskCountdown.textContent = `距离下次查询还有：${taskRemainingSeconds} 秒`;
                    nextCheckTime.textContent = `下次查询时间：${new Date(Date.now() + taskRemainingSeconds * 1000).toLocaleTimeString()}`;

                    if (taskRemainingSeconds > 0) {
                        taskRemainingSeconds--;
                        timers.taskStatus = setTimeout(updateTaskStatus, 1000);
                    } else {
                        taskRemainingSeconds = CHECK_INTERVAL;
                        timers.taskStatus = setTimeout(updateTaskStatus, 1000);
                    }
                };

                // 启动统计信息更新定时器
                timers.stats = setInterval(updateStats, 1000);

                // 启动倒计时显示
                updateCountdown();
                updateTaskStatus();

                // 添加关闭按钮
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '关闭小助手';
                closeBtn.style.cssText = `
                    padding: 6px 15px;
                    background: #1890ff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    display: block;
                    margin: 0 auto;
                `;

                closeBtn.onclick = closeModal;
                modal.appendChild(closeBtn);

                // 确保在添加到body之前所有元素都已经正确添加到modal中
                document.body.appendChild(modal);

                // 8小时后自动关闭 (28800000毫秒)
                setTimeout(closeModal, 28800000);
            }

            // 在脚本初始化时请求通知权限
            function requestNotificationPermission() {
                if (Notification.permission !== "granted") {
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                            log('[通知权限] 通知权限已授予');
                        } else {
                            log('[通知权限] 通知权限被拒绝');
                        }
                    });
                } else {
                    log('[通知权限] 通知权限已授予');
                }
            }

            // 播放通知声音
            function playNotificationSound() {
                if (!soundControl.enabled) {
                    log('[声音通知] 声音已禁用');
                    return;
                }

                const audio = new Audio('https://ws.stream.qqmusic.qq.com/C400004GoXJd3h7s9N.m4a?guid=488327575&vkey=CD36A32A75F8D9347CB9C6B9E3255F0D247557B57641D13DCEEA9AC789A57180900386ACE588237776C016B601C405B8C581FD784E38B1C6&uin=&fromtag=120032');
                audio.play().then(() => {
                    log('[声音通知] 声音播放成功');
                }).catch(error => {
                    log('[声音通知] 声音播放失败:', error);
                });
            }

            // 查找Vue实例的函数
            function findVueInstance() {
                const elements = document.querySelectorAll('*');
                for (const el of elements) {
                    if (el.__vue__) {
                        const vm = el.__vue__;
                        if (vm.onSelect || vm.$refs.scheduleTable) {
                            log('找到目标Vue实例');
                            return vm;
                        }
                        if (vm.$children) {
                            for (const child of vm.$children) {
                                if (child.onSelect || child.$refs.scheduleTable) {
                                    log('在子组件中找到目标Vue实例');
                                    return child;
                                }
                            }
                        }
                    }
                }
                return null;
            }

            // 劫持组件方法
            function hackComponent(vm) {
                if (!vm || vm._hacked) return;

                const scheduleTable = vm.$refs.scheduleTable || vm;

                // 保存原始方法
                const originalMethods = {
                    isAvailable: scheduleTable.isAvailable,
                    isAvailableStatic: scheduleTable.isAvailableStatic,
                    check: scheduleTable.check,
                    loadSchaduleServerData: scheduleTable.loadSchaduleServerData
                };

                // 劫持方法
                const methods = {
                    isAvailable: () => true,
                    isAvailableStatic: () => true,
                    check: async() => true
                };

                // 应用劫持
                Object.keys(methods).forEach(key => {
                    if (scheduleTable[key]) {
                        scheduleTable[key] = methods[key].bind(scheduleTable);
                    }
                });

                // 劫持计算属性
                Object.defineProperty(scheduleTable, 'canNext', {
                    get: () => true,
                    configurable: true
                });

                vm._hacked = true;
                log('组件劫持完成');
            }

            // 添加声音控制按钮
            function addSoundButton() {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;

                // 测试声音按钮
                const playSoundButton = document.createElement('button');
                playSoundButton.id = 'test-sound-button';
                playSoundButton.textContent = '测试通知声音';
                playSoundButton.style.cssText = `
                    padding: 6px 15px;
                    background: #1890ff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                `;

                // 声音开关按钮
                const toggleSoundButton = document.createElement('button');
                toggleSoundButton.id = 'toggle-sound-button';
                toggleSoundButton.style.cssText = `
                    padding: 6px 15px;
                    background: #52c41a;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                `;

                // 更新按钮文本的函数
                const updateToggleButtonText = () => {
                    toggleSoundButton.textContent = soundControl.enabled ? '声音提醒：开' : '声音提醒：关';
                    toggleSoundButton.style.background = soundControl.enabled ? '#52c41a' : '#ff4d4f';
                };

                playSoundButton.onclick = () => {
                    playNotificationSound();
                };

                toggleSoundButton.onclick = () => {
                    soundControl.enabled = !soundControl.enabled;
                    updateToggleButtonText();
                    log('[声音控制] 声音提醒已' + (soundControl.enabled ? '开启' : '关闭'));
                };

                // 初始化按钮文本
                updateToggleButtonText();

                buttonContainer.appendChild(toggleSoundButton);
                buttonContainer.appendChild(playSoundButton);

                // 等待 DOM 加载完成后再添加按钮
                if (document.body) {
                    document.body.appendChild(buttonContainer);
                } else {
                    document.addEventListener('DOMContentLoaded', () => {
                        document.body.appendChild(buttonContainer);
                    });
                }
            }

            // 监听请求的函数
            function monitorRequests() {
                const originalOpen = XMLHttpRequest.prototype.open;
                const originalSend = XMLHttpRequest.prototype.send;

                // 添加定时任务函数
                function scheduleCheck() {
                    const today = new Date();
                    const timeStr = today.toLocaleTimeString();

                    log(`[定时任务] ${timeStr} 开始执行场地查询...`);

                    // 查找Vue实例
                    const vm = findVueInstance();
                    if (!vm) {
                        log('[定时任务] 未找到Vue实例，跳过查询');
                        return;
                    }

                    // 使用原有的请求方法
                    try {
                        // 获取原始请求方法
                        const originRequest = vm.$refs.scheduleTable && vm.$refs.scheduleTable.loadSchaduleServerData;

                        if (typeof originRequest === 'function') {
                            log('[定时任务] 使用原有请求方法');
                            originRequest.call(vm.$refs.scheduleTable, () => {
                                log('[定时任务] 请求完成回调');
                            });
                        } else {
                            log('[定时任务] 未找到原有请求方法');
                        }
                    } catch (error) {
                        log('[定时任务] 执行出错:', error);
                    }
                }

                // 设置定时任务，并将定时器ID存储在window对象中
                log(`[系统] 启动定时查询任务 (间隔：${CHECK_INTERVAL} 秒)`);
                window.checkInterval = setInterval(() => {
                    scheduleCheck();
                    if (window.taskRemainingSeconds !== undefined) {
                        window.taskRemainingSeconds = CHECK_INTERVAL;
                    }
                }, CHECK_INTERVAL * 1000);

                // 重新启动定时任务函数
                function restartCheckInterval() {
                    if (window.checkInterval) {
                        clearInterval(window.checkInterval);
                    }
                    log(`[系统] 重启定时查询任务 (间隔：${CHECK_INTERVAL} 秒)`);
                    window.checkInterval = setInterval(() => {
                        scheduleCheck();
                        if (window.taskRemainingSeconds !== undefined) {
                            window.taskRemainingSeconds = CHECK_INTERVAL;
                        }
                    }, CHECK_INTERVAL * 1000);
                }

                // 保持原有的请求监听代码
                XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                    if (url.includes('/pub/sport/venue/getVenueOrderList')) {
                        this._isVenueOrderRequest = true;
                        log('[请求监听] 检测到场地状态查询请求:', { method, url });
                    }
                    if (url.includes('/pub/sport/venue/getSportVenueConfig')) {
                        this._isVenueConfigRequest = true;
                        log('[请求监听] 检测到场地配置请求:', { method, url });
                    }
                    return originalOpen.call(this, method, url, ...rest);
                };

                XMLHttpRequest.prototype.send = function(body) {
                    if (this._isVenueOrderRequest || this._isVenueConfigRequest) {
                        log('[请求监听] 发送请求数据:', body ? JSON.parse(body) : null);

                        this.addEventListener('load', function() {
                            try {
                                const response = JSON.parse(this.responseText);
                                if (this._isVenueConfigRequest) {
                                    log('[请求监听] 收到场地配置响应');
                                    if (response.data) {
                                        if (response.data.venueResponses) {
                                            response.data.venueResponses.forEach(venue => {
                                                venueMap[venue.venueId] = venue.venueName;
                                            });
                                            venueList = response.data.venueResponses.map(v => v.venueId);
                                            log('[请求监听] 更新场地名称映射表:', venueMap);
                                            log('[请求监听] 更新场地列表:', venueList);
                                        }
                                        if (response.data.venueTimeSlotResponses) {
                                            timeSlotConfig = response.data.venueTimeSlotResponses;
                                            log('[请求监听] 更新时间段配置:', timeSlotConfig);

                                            // 设置开放时间
                                            const startTimes = timeSlotConfig.map(slot => slot.startTime);
                                            const endTimes = timeSlotConfig.map(slot => slot.endTime);
                                            openTime = Math.min(...startTimes);
                                            closeTime = Math.max(...endTimes);
                                            log('[请求监听] 更新开放时间:', { openTime: new Date(openTime).toLocaleTimeString(), closeTime: new Date(closeTime).toLocaleTimeString() });
                                        }
                                    }
                                } else if (this._isVenueOrderRequest) {
                                    log('[请求监听] 收到场地状态响应:', {
                                        code: response.code,
                                        message: response.message,
                                        场地数量: response.data ? (response.data.length || 0) : 0
                                    });

                                    if (response.data && response.data.length >= 0) {
                                        if (!window.__modalCreated) {
                                            log('[请求监听] 首次加载，创建弹窗');
                                            window.__modalCreated = true;
                                            createStatusModal();
                                        }
                                        showVenueStatus(response.data);
                                    }
                                }
                            } catch (err) {
                                log('[请求监听] 处理响应失败:', err);
                            }
                        });
                    }
                    return originalSend.call(this, body);
                };

                // 在开始监听请求之前添加按钮
                addSoundButton();
            }

            // 定时检查并劫持组件
            const hackInterval = setInterval(() => {
                const vm = findVueInstance();
                if (vm) {
                    hackComponent(vm);
                    if (vm._hacked) {
                        clearInterval(hackInterval);
                    }
                }
            }, 1000);

            // 开始监听请
            monitorRequests();

            // 在脚本初始化时请求通知权限
            requestNotificationPermission();
        } + ')();';

        // 注入样式
        const style = document.createElement('style');
        style.textContent = `
            .schedule-table td,
            .schedule-table td.col-booking-disabled,
            .schedule-table td.noBook,
            .schedule-table td.expired {
                cursor: default !important;
                opacity: 1 !important;
                pointer-events: none !important;
                background-color: white !important;
            }

            .schedule-table td.col-scheduled {
                background-color: #ffccc7 !important;
            }

            .primary-button,
            .primary-button[disabled] {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                pointer-events: none !important;
                background: #ccc !important;
            }
        `;

        (document.head || document.documentElement).appendChild(script);
        (document.head || document.documentElement).appendChild(style);

        log('代码注入完成');
    }

    injectCode();
})();