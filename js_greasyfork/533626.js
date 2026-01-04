// ==UserScript==
// @name         BGM Anime Time Set
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在BGM.tv的追番页面添加设置按钮，可以设置番剧的播放时间并排序
// @author       age
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/533626/BGM%20Anime%20Time%20Set.user.js
// @updateURL https://update.greasyfork.org/scripts/533626/BGM%20Anime%20Time%20Set.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const STORAGE_KEY = 'BGM_HOME_ANIME_TIME_SET_AGE';
    const SETTINGS_KEY = 'BGM_HOME_ANIME_TIME_SETTINGS_AGE';
    const EXPIRATION_DAYS = 200;
    const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    // 缓存DOM元素
    let cachedContainer = null;
    let cachedAnimeTimeData = null;
    let cachedSettings = null;

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        #Age-js01-button {
            margin-left: 5px;
            padding: 1px 5px;
            border-radius: 3px;
            border: none;
            font-size: 12px;
            cursor: pointer;
            background-color: #2e2e2e;
            color: #eee;
        }
        #Age-js01-button.past {
            background-color: #118FDD;
        }
        #Age-js01-button.future {
            background-color: #10C745;
        }
        #Age-js01-button.soon {
            background-color: #FF3333;
        }
        #Age-js01-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            font-size: 14px;
            background-color: #333;
            color: #fff;
            min-width: 300px;
        }
        #Age-js01-select, #Age-js01-time {
            padding: 3px;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
        }
        #Age-js01-time {
            margin-right: 8px;
        }
        #Age-js01-button-container {
            margin-top: 10px;
            text-align: right;
        }
        #Age-js01-save, #Age-js01-cancel, #Age-js01-clear {
            padding: 3px 8px;
            border-radius: 3px;
            border: none;
            font-size: 12px;
            cursor: pointer;
            background-color: #444;
            color: #fff;
        }
        #Age-js01-clear {
            margin-right: 8px;
        }
        #Age-js01-manager-button {
        margin-left: 1px;
        border-radius: 100px;
        border: none;
        font-size: 22px;
        cursor: pointer;
        background-color: #3f3e3f;
        color: #eee;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2px 6px;
        width: 25px;
        height: 40px;
        }
        #Age-js01-manager-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            background-color: #333;
            color: #fff;
            min-width: 300px;
            max-height: 80vh;
            overflow-y: auto;
        }
        #Age-js01-manager-modal h3 {
            margin-top: 0;
            border-bottom: 1px solid #555;
            padding-bottom: 5px;
        }
        #Age-js01-manager-modal button {
            padding: 3px 8px;
            border-radius: 3px;
            border: none;
            font-size: 12px;
            cursor: pointer;
            background-color: #444;
            color: #fff;
            margin: 5px;
        }
        #Age-js01-manager-modal-content {
            margin: 10px 0;
        }
        #Age-js01-storage-content {
            background-color: #444;
            padding: 10px;
            border-radius: 3px;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        #Age-js01-timezone-select {
            padding: 3px;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
            margin-left: 8px;
        }
        #Age-js01-show-style-select {
            padding: 3px;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
            margin-left: 8px;
        }

        html[data-theme='light'] #Age-js01-button {
            background-color: #f5f5f5;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-button.past {
            background-color: #AEEFFF;
        }
        html[data-theme='light'] #Age-js01-button.future {
            background-color: #AEFFB8;
        }
        html[data-theme='light'] #Age-js01-button.soon {
            background-color: #FFAAAA;
        }
        html[data-theme='light'] #Age-js01-dialog {
            background-color: white;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-select,
        html[data-theme='light'] #Age-js01-time,
        html[data-theme='light'] #Age-js01-timezone-select,
        html[data-theme='light'] #Age-js01-show-style-select {
            background-color: #fff;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-save,
        html[data-theme='light'] #Age-js01-cancel,
        html[data-theme='light'] #Age-js01-clear {
            background-color: #f5f5f5;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-manager-button {
            background-color: #fff;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-manager-modal {
            background-color: white;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-manager-modal h3 {
            border-bottom-color: #ddd;
        }
        html[data-theme='light'] #Age-js01-manager-modal button {
            background-color: #f5f5f5;
            color: #333;
        }
        html[data-theme='light'] #Age-js01-storage-content {
            background-color: #f5f5f5;
        }
    `;
    document.head.appendChild(style);

    // 数据存储操作
    function getAnimeTimeData() {
        if (cachedAnimeTimeData) return cachedAnimeTimeData;
        
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return {};

        try {
            const parsed = JSON.parse(data);
            // 检查并清理过期数据
            const now = new Date();
            const cleanedData = {};
            
            for (const [id, entry] of Object.entries(parsed)) {
                if (entry.expiresAt && new Date(entry.expiresAt) > now) {
                    cleanedData[id] = {
                        weekDay: entry.weekDay,
                        time: entry.time
                    };
                }
            }
            
            cachedAnimeTimeData = cleanedData;
            return cachedAnimeTimeData;
        } catch (e) {
            console.error('Failed to parse anime time data:', e);
            return {};
        }
    }

    function setAnimeTimeData(data) {
        const now = new Date();
        const storageData = {};
        
        // 保留现有的过期时间，只更新修改的条目
        const existingData = getAnimeTimeData();
        
        for (const [id, entry] of Object.entries(data)) {
            storageData[id] = {
                ...entry,
                // 如果条目已存在且未被修改，保留原过期时间
                expiresAt: existingData[id] && existingData[id].weekDay === entry.weekDay && existingData[id].time === entry.time 
                    ? existingData[id].expiresAt 
                    : new Date(now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
            };
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        cachedAnimeTimeData = data;
    }

    function getSettings() {
        if (cachedSettings) return cachedSettings;
        
        const settings = localStorage.getItem(SETTINGS_KEY);
        if (!settings) return getDefaultSettings();
        
        try {
            const parsed = JSON.parse(settings);
            cachedSettings = validateSettings(parsed);
            return cachedSettings;
        } catch (e) {
            console.error('Failed to parse settings:', e);
            return getDefaultSettings();
        }
    }

    function getDefaultSettings() {
        return { 
            setShow: true, 
            showStyleRed: 0,
            showStyleGreen: 0,
            showStyleBlue: 0 
        };
    }

    function validateSettings(settings) {
        // 确保设置存在且是有效范围内的数字
        if (typeof settings.showStyleRed !== 'number' || settings.showStyleRed < 0 || settings.showStyleRed > 3) {
            settings.showStyleRed = 0;
        }
        if (typeof settings.showStyleGreen !== 'number' || settings.showStyleGreen < 0 || settings.showStyleGreen > 5) {
            settings.showStyleGreen = 0;
        }
        if (typeof settings.showStyleBlue !== 'number' || settings.showStyleBlue < 0 || settings.showStyleBlue > 3) {
            settings.showStyleBlue = 0;
        }
        return settings;
    }

    function setSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        cachedSettings = settings;
    }

    // 主初始化函数
    function init() {
        cachedContainer = document.getElementById('cloumnSubjectInfo');
        if (!cachedContainer) return;

        // 添加管理按钮
        addManagerButton();

        // 初始化数据
        cachedAnimeTimeData = getAnimeTimeData();
        cachedSettings = getSettings();

        // 为每个番剧添加设置按钮
        addSetButtons();

        // 根据设置显示/隐藏SET按钮
        toggleSetButtons(cachedSettings.setShow);

        // 重新排序番剧列表
        sortAnimeList();
    }

    // 添加管理按钮
    function addManagerButton() {
        const prgManagerMode = document.getElementById('prgManagerMode');
        if (!prgManagerMode || document.getElementById('Age-js01-manager-button')) return;

        const managerButton = document.createElement('button');
        managerButton.id = 'Age-js01-manager-button';
        managerButton.innerHTML = '<div style="text-align:center;line-height:2;">⏰︎</div><div style="text-align:center;line-height:0;"></div>';
        managerButton.addEventListener('click', showManagerModal);
        prgManagerMode.appendChild(managerButton);
    }

    // 显示管理框
    function showManagerModal() {
        const modal = document.createElement('div');
        modal.id = 'Age-js01-manager-modal';
        
        modal.innerHTML = `
            <h3>时间管理</h3>
            <div id="Age-js01-manager-modal-content">
                <div>
                    <button id="Age-js01-auto-fetch">自动获取时间</button>
                    <select id="Age-js01-timezone-select">
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
                </div>
                <div style="margin-top: 15px;">
                    <h4>显示样式设置</h4>
                    <div>
                        <label for="Age-js01-show-style-red">红：</label>
                        <select id="Age-js01-show-style-red">
                            <option value="0">1小时内即将放送</option>
                            <option value="1">2小时内即将放送</option>
                            <option value="2">4小时内即将放送</option>
                            <option value="3">禁用</option>
                        </select>
                    </div>
                    <div style="margin-top: 5px;">
                        <label for="Age-js01-show-style-green">绿：</label>
                        <select id="Age-js01-show-style-green">
                            <option value="0">18小时内即将放送</option>
                            <option value="1">24小时内即将放送</option>
                            <option value="2">今天内即将放送</option>
                            <option value="3">明天6点前即将放送</option>
                            <option value="4">明天8点前即将放送</option>
                            <option value="5">禁用</option>
                        </select>
                    </div>
                    <div style="margin-top: 5px;">
                        <label for="Age-js01-show-style-blue">蓝：</label>
                        <select id="Age-js01-show-style-blue">
                            <option value="0">18小时内已经放送</option>
                            <option value="1">24小时内已经放送</option>
                            <option value="2">今天内已经放送</option>
                            <option value="3">禁用</option>
                        </select>
                    </div>
                </div>
                <button id="Age-js01-toggle-set">${cachedSettings.setShow ? '隐藏所有SET按钮' : '显示所有SET按钮'}</button>
                <div style="margin-top: 15px;">
                    <h4>存储内容 (${STORAGE_KEY})</h4>
                    <div id="Age-js01-storage-content" contenteditable="true">${JSON.stringify(getFullStorageData(), null, 2)}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <button id="Age-js01-save-storage">保存修改</button>
                <button id="Age-js01-close-manager">关闭</button>
            </div>
        `;

        // 设置当前显示样式
        modal.querySelector('#Age-js01-show-style-red').value = cachedSettings.showStyleRed;
        modal.querySelector('#Age-js01-show-style-green').value = cachedSettings.showStyleGreen;
        modal.querySelector('#Age-js01-show-style-blue').value = cachedSettings.showStyleBlue;

        document.body.appendChild(modal);

        // 使用事件委托处理模态框内的事件
        modal.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.id === 'Age-js01-auto-fetch') {
                autoFetchSchedule();
            } else if (target.id === 'Age-js01-toggle-set') {
                const newSettings = { ...cachedSettings, setShow: !cachedSettings.setShow };
                setSettings(newSettings);
                toggleSetButtons(newSettings.setShow);
                target.textContent = newSettings.setShow ? '隐藏所有SET按钮' : '显示所有SET按钮';
            } else if (target.id === 'Age-js01-save-storage') {
                try {
                    const newData = JSON.parse(document.getElementById('Age-js01-storage-content').textContent);
                    // 保留未修改条目的过期时间
                    const existingData = getFullStorageData();
                    const now = new Date();
                    
                    const mergedData = {};
                    for (const [id, entry] of Object.entries(newData)) {
                        mergedData[id] = {
                            ...entry,
                            expiresAt: existingData[id] && existingData[id].weekDay === entry.weekDay && existingData[id].time === entry.time
                                ? existingData[id].expiresAt
                                : new Date(now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
                        };
                    }
                    
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
                    cachedAnimeTimeData = getAnimeTimeData(); // 重新加载数据
                    addSetButtons();
                    sortAnimeList();
                    alert('保存成功');
                } catch (e) {
                    alert('保存失败: JSON格式错误');
                    console.error(e);
                }
            } else if (target.id === 'Age-js01-close-manager') {
                const newSettings = {
                    ...cachedSettings,
                    showStyleRed: parseInt(modal.querySelector('#Age-js01-show-style-red').value),
                    showStyleGreen: parseInt(modal.querySelector('#Age-js01-show-style-green').value),
                    showStyleBlue: parseInt(modal.querySelector('#Age-js01-show-style-blue').value)
                };
                setSettings(newSettings);
                addSetButtons();
                sortAnimeList();
                document.body.removeChild(modal);
            }
        });
    }

    // 获取完整的存储数据（包括过期时间）
    function getFullStorageData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    }

    // 自动获取时间表
    async function autoFetchSchedule() {
        if (!confirm('此操作将清空目前的时间表，是否继续？')) return;

        try {
            const subjectLinks = document.querySelectorAll('#cloumnSubjectInfo .infoWrapper_tv.hidden.clearit a[href^="/subject/"]');
            const subjectIds = new Set();

            subjectLinks.forEach(link => {
                const href = link.getAttribute('href');
                const match = href.match(/^\/subject\/(\d+)/);
                if (match && match[1]) subjectIds.add(match[1]);
            });

            if (subjectIds.size === 0) {
                alert('未找到任何动画条目ID');
                return;
            }

            const response = await fetch('https://raw.githubusercontent.com/zhollgit/bgm-onair/main/onair.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const newAnimeTimeData = {};
            const timezoneOffset = parseInt(document.getElementById('Age-js01-timezone-select')?.value || 8);
            const now = new Date();

            data.items.forEach(item => {
                const bangumiSite = item.sites.find(site => site.site === 'bangumi');
                if (bangumiSite?.id && subjectIds.has(bangumiSite.id) && item.begin) {
                    const beginDate = new Date(item.begin);
                    let adjustedHours = beginDate.getUTCHours() + timezoneOffset;
                    let adjustedDay = beginDate.getUTCDay();
                    
                    if (adjustedHours >= 24) {
                        adjustedHours -= 24;
                        adjustedDay = (adjustedDay + 1) % 7;
                    } else if (adjustedHours < 0) {
                        adjustedHours += 24;
                        adjustedDay = (adjustedDay - 1 + 7) % 7;
                    }
                    
                    const time = `${adjustedHours.toString().padStart(2, '0')}:${beginDate.getUTCMinutes().toString().padStart(2, '0')}`;
                    newAnimeTimeData[bangumiSite.id] = { 
                        weekDay: adjustedDay, 
                        time,
                        expiresAt: new Date(now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
                    };
                }
            });
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnimeTimeData));
            cachedAnimeTimeData = getAnimeTimeData();
            addSetButtons();
            sortAnimeList();

            const storageContent = document.getElementById('Age-js01-storage-content');
            if (storageContent) storageContent.textContent = JSON.stringify(newAnimeTimeData, null, 2);

            alert(`成功获取 ${Object.keys(newAnimeTimeData).length} 个番剧的时间数据`);
        } catch (error) {
            console.error('自动获取时间表失败:', error);
            alert('自动获取时间表失败: ' + error.message);
        }
    }

    // 切换SET按钮的显示/隐藏
    function toggleSetButtons(show) {
        document.querySelectorAll('#Age-js01-button').forEach(button => {
            const subjectId = button.getAttribute('data-subject-id');
            if (!cachedAnimeTimeData[subjectId]) {
                button.style.display = show ? '' : 'none';
            }
        });
    }

    // 添加设置按钮
    function addSetButtons() {
        const editLinks = cachedContainer.querySelectorAll('a.thickbox.l[id^="sbj_prg_"]:not([data-processed])');

        editLinks.forEach(editLink => {
            if (editLink.textContent.trim() === '[edit]') return;

            const subjectId = editLink.id.split('_')[2];
            editLink.setAttribute('data-processed', 'true');

            const setButton = document.createElement('button');
            setButton.id = 'Age-js01-button';
            setButton.setAttribute('data-subject-id', subjectId);
            
            if (cachedAnimeTimeData[subjectId]) {
                setButton.textContent = formatTimeData(cachedAnimeTimeData[subjectId]);
                const timeStatus = getTimeStatus(cachedAnimeTimeData[subjectId]);
                if (timeStatus) setButton.classList.add(timeStatus);
            } else {
                setButton.textContent = 'SET';
                if (!cachedSettings.setShow) setButton.style.display = 'none';
            }

            setButton.addEventListener('click', () => showTimeSettingDialog(subjectId, setButton));
            editLink.parentNode.insertBefore(setButton, editLink.nextSibling);
        });
    }

    // 获取时间状态
    function getTimeStatus(timeData) {
        const now = new Date();
        const today = now.getDay();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        const [hours, minutes] = timeData.time.split(':').map(Number);
        const targetDay = timeData.weekDay;

        let dayDiff = targetDay - today;
        if (dayDiff < -3) dayDiff += 7;
        else if (dayDiff > 3) dayDiff -= 7;

        const totalDiffHours = dayDiff * 24 + (hours - currentHours) + (minutes - currentMinutes) / 60;
        
        // 红色优先级最高
        if (cachedSettings.showStyleRed !== 3) {
            switch (cachedSettings.showStyleRed) {
                case 0: if (totalDiffHours >= 0 && totalDiffHours < 1) return 'soon'; break;
                case 1: if (totalDiffHours >= 0 && totalDiffHours < 2) return 'soon'; break;
                case 2: if (totalDiffHours >= 0 && totalDiffHours < 4) return 'soon'; break;
            }
        }
        
        // 然后检查绿色条件
        if (cachedSettings.showStyleGreen !== 5) {
            switch (cachedSettings.showStyleGreen) {
                case 0: if (totalDiffHours >= 0 && totalDiffHours < 18) return 'future'; break;
                case 1: if (totalDiffHours >= 0 && totalDiffHours < 24) return 'future'; break;
                case 2: if (dayDiff === 0 && totalDiffHours >= 0) return 'future'; break;
                case 3: if ((dayDiff === 0 && totalDiffHours >= 0) || (dayDiff === 1 && hours < 6)) return 'future'; break;
                case 4: if ((dayDiff === 0 && totalDiffHours >= 0) || (dayDiff === 1 && hours < 8)) return 'future'; break;
            }
        }
        
        // 最后检查蓝色条件
        if (cachedSettings.showStyleBlue !== 3) {
            switch (cachedSettings.showStyleBlue) {
                case 0: if (totalDiffHours >= -18 && totalDiffHours < 0) return 'past'; break;
                case 1: if (totalDiffHours >= -24 && totalDiffHours < 0) return 'past'; break;
                case 2: if (dayDiff === 0 && totalDiffHours < 0) return 'past'; break;
            }
        }
        
        return '';
    }

    // 显示时间设置对话框
    function showTimeSettingDialog(subjectId, button) {
        const dialog = document.createElement('div');
        dialog.id = 'Age-js01-dialog';

        const weekDaySelect = document.createElement('select');
        weekDaySelect.id = 'Age-js01-select';
        WEEK_DAYS.forEach((day, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = day;
            weekDaySelect.appendChild(option);
        });

        const timeInput = document.createElement('input');
        timeInput.id = 'Age-js01-time';
        timeInput.type = 'time';

        if (cachedAnimeTimeData[subjectId]) {
            weekDaySelect.value = cachedAnimeTimeData[subjectId].weekDay;
            timeInput.value = cachedAnimeTimeData[subjectId].time;
        }

        dialog.innerHTML = `
            <label>星期: </label>
            <select id="Age-js01-select">${WEEK_DAYS.map((day, i) => 
                `<option value="${i}">${day}</option>`).join('')}</select>
            <label style="margin-left:8px;">时间: </label>
            <input id="Age-js01-time" type="time" ${cachedAnimeTimeData[subjectId] ? 
                `value="${cachedAnimeTimeData[subjectId].time}"` : ''}>
            <div id="Age-js01-button-container">
                <button id="Age-js01-save">保存</button>
                <button id="Age-js01-clear">清除</button>
                <button id="Age-js01-cancel">取消</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // 事件处理
        dialog.addEventListener('click', (e) => {
            if (e.target.id === 'Age-js01-save') {
                const weekDay = parseInt(dialog.querySelector('#Age-js01-select').value);
                const time = dialog.querySelector('#Age-js01-time').value;

                if (!time) {
                    alert('请选择时间');
                    return;
                }

                // 获取当前存储的完整数据
                const fullData = getFullStorageData();
                const now = new Date();
                
                // 更新数据
                fullData[subjectId] = {
                    weekDay,
                    time,
                    expiresAt: new Date(now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
                };
                
                // 保存更新
                localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
                cachedAnimeTimeData = getAnimeTimeData();

                button.textContent = formatTimeData(cachedAnimeTimeData[subjectId]);
                button.className = 'Age-js01-button';
                const timeStatus = getTimeStatus(cachedAnimeTimeData[subjectId]);
                if (timeStatus) button.classList.add(timeStatus);

                sortAnimeList();
                document.body.removeChild(dialog);
            } else if (e.target.id === 'Age-js01-clear') {
                // 获取当前存储的完整数据
                const fullData = getFullStorageData();
                
                if (fullData[subjectId]) {
                    delete fullData[subjectId];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
                    cachedAnimeTimeData = getAnimeTimeData();

                    button.textContent = 'SET';
                    button.className = 'Age-js01-button';
                    sortAnimeList();
                }
                document.body.removeChild(dialog);
            } else if (e.target.id === 'Age-js01-cancel') {
                document.body.removeChild(dialog);
            }
        });
    }

    // 格式化时间数据显示
    function formatTimeData(timeData) {
        return `${WEEK_DAYS[timeData.weekDay]} ${timeData.time}`;
    }

    // 排序
    function sortAnimeList() {
        const wrapper = cachedContainer.querySelector('.infoWrapperContainer.infoWrapper_tv.hidden.clearit');
        if (!wrapper) return;

        const animeItems = Array.from(wrapper.querySelectorAll('.clearit.infoWrapper'));

        animeItems.sort((a, b) => {
            const aId = a.id.split('_')[1];
            const bId = b.id.split('_')[1];
            const aData = cachedAnimeTimeData[aId];
            const bData = cachedAnimeTimeData[bId];

            if (!aData && !bData) return 0;
            if (!aData) return 1;
            if (!bData) return -1;
            if (aData.weekDay !== bData.weekDay) return aData.weekDay - bData.weekDay;
            return aData.time.localeCompare(bData.time);
        });

        // 使用文档片段减少重绘
        const fragment = document.createDocumentFragment();
        animeItems.forEach(item => fragment.appendChild(item));
        wrapper.appendChild(fragment);
    }

    // 使用DOMContentLoaded而不是load事件，加快响应速度
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }
})();