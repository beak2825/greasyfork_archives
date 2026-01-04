// ==UserScript==
// @name         定时提醒工具
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  提供定时提醒、倒计时功能，并支持自定义提醒事件。用户可以设置每日重复的提醒事件，每个事件在同一时间只会提醒一次；倒计时功能允许用户设置一个倒计时，时间到后会提醒用户。
// @author       wll
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/508670/%E5%AE%9A%E6%97%B6%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/508670/%E5%AE%9A%E6%97%B6%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultReminders = [
        { event: '喝水', time: '09:00', type: 'daily' },
        { event: '休息一下', time: '10:30', type: 'daily' },
        { event: '吃午饭', time: '12:00', type: 'daily' },
        { event: '喝水', time: '14:00', type: 'daily' },
        { event: '休息一下', time: '15:30', type: 'daily' },
        { event: '吃晚饭', time: '18:00', type: 'daily' },
        { event: '运动', time: '19:00', type: 'daily' },
    ];

    function loadReminders() {
        const savedReminders = GM_getValue('reminders');
        return savedReminders || defaultReminders;
    }

    function saveReminders(reminders) {
        GM_setValue('reminders', reminders);
    }

    function loadButtonPosition() {
        const position = GM_getValue('buttonPosition');
        return position || { top: '10px', left: '10px' };
    }

    function saveButtonPosition(position) {
        GM_setValue('buttonPosition', position);
    }

    function loadButtonVisibility() {
        return GM_getValue('buttonVisibility', true);
    }

    function saveButtonVisibility(visibility) {
        GM_setValue('buttonVisibility', visibility);
    }

    const settingsHTML = `
        <div id="reminder-settings" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 350px; background: white; border: 1px solid #ccc; padding: 20px; z-index: 10000; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">定时提醒设置</h3>
                <button id="close-settings" style="background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
            </div>
            <div id="reminder-list" style="max-height: 200px; overflow-y: auto; margin-top: 10px; padding-right: 15px;"></div>
            <div style="text-align: center; margin-top: 10px;">
                <button id="add-reminder">添加提醒</button>
            </div>
            <hr>
            <h3>倒计时功能</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <input type="number" id="countdown-minutes" placeholder="分钟数" style="width: 80px;">
                <button id="start-countdown">开始倒计时</button>
            </div>
        </div>
        <button id="open-settings" style="position: fixed; width: 60px; height: 30px; z-index: 10000;">设置</button>
    `;

    document.body.insertAdjacentHTML('beforeend', settingsHTML);

    const buttonPosition = loadButtonPosition();
    const openSettingsButton = document.getElementById('open-settings');
    openSettingsButton.style.top = buttonPosition.top;
    openSettingsButton.style.left = buttonPosition.left;

    const buttonVisibility = loadButtonVisibility();
    openSettingsButton.style.display = buttonVisibility ? 'block' : 'none';

    GM_addStyle(`
        #reminder-settings input, #reminder-settings select, #reminder-settings button {
            margin: 5px 0;
        }
        #reminder-list div {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        #reminder-list div .event, #reminder-list div .time {
            margin-right: 10px;
            flex-grow: 1;
        }
        #reminder-list div .type {
            flex-grow: 2;
            margin-right: 10px;
        }
        #reminder-list div button {
            flex-grow: 0;
        }
    `);

    function loadReminderList() {
        const reminders = loadReminders();
        const reminderList = document.getElementById('reminder-list');
        reminderList.innerHTML = '';
        reminders.forEach((reminder, index) => {
            const reminderDiv = document.createElement('div');
            reminderDiv.innerHTML = `
                <input type="text" value="${reminder.event}" data-index="${index}" class="event" style="width: 80px;">
                <input type="time" value="${reminder.time}" data-index="${index}" class="time" style="width: 80px;">
                <select data-index="${index}" class="type" style="width: 100px;">
                    <option value="once" ${reminder.type === 'once' ? 'selected' : ''}>提醒一次</option>
                    <option value="daily" ${reminder.type === 'daily' ? 'selected' : ''}>每天提醒</option>
                </select>
                <button data-index="${index}" class="delete-reminder" style="width: 50px;">删除</button>
            `;
            reminderList.appendChild(reminderDiv);
        });
    }

    function autoSaveReminder() {
        const reminders = [];
        document.querySelectorAll('#reminder-list div').forEach(div => {
            const event = div.querySelector('.event').value;
            const time = div.querySelector('.time').value;
            const type = div.querySelector('.type').value;
            if (event.trim() !== '') {
                reminders.push({ event, time, type });
            }
        });
        saveReminders(reminders);
    }

    function showSettings() {
        document.getElementById('reminder-settings').style.display = 'block';
        loadReminderList();
    }

    function hideSettings() {
        document.getElementById('reminder-settings').style.display = 'none';
    }

    document.getElementById('open-settings').addEventListener('click', (e) => {
        e.stopPropagation();
        const settingsDiv = document.getElementById('reminder-settings');
        if (settingsDiv.style.display === 'none') {
            showSettings();
        } else {
            hideSettings();
        }
    });

    document.getElementById('close-settings').addEventListener('click', hideSettings);

    window.addEventListener('click', (event) => {
        const settingsDiv = document.getElementById('reminder-settings');
        if (settingsDiv.style.display !== 'none' && !settingsDiv.contains(event.target) && event.target !== openSettingsButton) {
            hideSettings();
        }
    });

    GM_registerMenuCommand('显示/隐藏提醒设置按钮', () => {
        const currentVisibility = openSettingsButton.style.display === 'block';
        openSettingsButton.style.display = currentVisibility ? 'none' : 'block';
        saveButtonVisibility(!currentVisibility);
    });

    function makeElementDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        el.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";

            saveButtonPosition({ top: el.style.top, left: el.style.left });
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makeElementDraggable(openSettingsButton);

    document.getElementById('add-reminder').addEventListener('click', () => {
        const reminders = loadReminders();
        const now = new Date();
        const currentTime = now.toTimeString().substr(0, 5);
        reminders.push({ event: '', time: currentTime, type: 'daily' });
        saveReminders(reminders);
        loadReminderList();
    });

    document.getElementById('reminder-list').addEventListener('input', autoSaveReminder);

    document.getElementById('reminder-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-reminder')) {
            e.stopPropagation();
            const index = e.target.getAttribute('data-index');
            const reminders = loadReminders();
            reminders.splice(index, 1);
            saveReminders(reminders);
            loadReminderList();
        }
    });

    const notifiedTimes = new Set();

    function checkAndNotify() {
        const now = new Date();
        const currentTime = now.toTimeString().substr(0, 5);
        let reminders = loadReminders();

        reminders.forEach(reminder => {
            if (currentTime === reminder.time && !notifiedTimes.has(reminder.time + reminder.event)) {
                if (reminder.event.trim() !== '') {
                    GM_notification({
                        title: '定时提醒',
                        text: `该${reminder.event}了!`,
                        timeout: 10000,
                        onclick: () => {
                            console.log(`你点击了${reminder.event}提醒`);
                        }
                    });
                    notifiedTimes.add(reminder.time + reminder.event);
                }
            }
        });

        // Remove entries from notifiedTimes set to avoid memory issues
        notifiedTimes.forEach(key => {
            if (!reminders.some(reminder => reminder.time + reminder.event === key && reminder.time === currentTime)) {
                notifiedTimes.delete(key);
            }
        });
    }

    setInterval(() => {
        notifiedTimes.clear();
    }, 60000);

    document.getElementById('start-countdown').addEventListener('click', () => {
        const minutes = parseInt(document.getElementById('countdown-minutes').value, 10);
        if (!isNaN(minutes) && minutes > 0) {
            GM_notification({
                title: '倒计时提醒',
                text: `倒计时${minutes}分钟开始!`,
                timeout: 5000
            });
            hideSettings();
            setTimeout(() => {
                GM_notification({
                    title: '倒计时提醒',
                    text: `倒计时${minutes}分钟结束!`,
                    timeout: 10000
                });
            }, minutes * 60000);
        } else {
            alert('请输入有效的分钟数');
        }
    });

    setInterval(checkAndNotify, 1000);
    checkAndNotify();
})();
