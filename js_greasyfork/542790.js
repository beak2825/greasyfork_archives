// ==UserScript==
// @name         深圳大学体育场馆预约助手
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  【最终完全版】新增调试模式开关，适配多校区场地命名。12:30定时抢场，支持场地优先级，全自动提交。
// @author       Your Name
// @match        https://ehall.szu.edu.cn/qljfwapp/sys/lwSzuCgyy/index.do*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542790/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542790/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 全局常量与变量 ---
    const sportsByCampus = {
        "粤海校区": ["羽毛球", "足球", "排球", "网球", "篮球", "壁球", "一楼重量型健身", "二楼有氧健身", "游泳"],
        "丽湖校区": ["羽毛球", "排球", "网球", "篮球", "游泳", "乒乓球", "舞蹈", "桌球", "骑行"]
    };
    const TIME_SLOTS = [
        "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
        "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
        "20:00-21:00", "21:00-22:00"
    ];
    const TARGET_HOUR = 12;
    const TARGET_MINUTE = 30;
    const TARGET_SECOND = 0;

    let actionQueue = [];
    let observer = null;
    let statusElement = null;
    let countdownInterval = null;

    // --- 2. 样式定义 ---
    GM_addStyle(`
        #szu-helper-panel {
            position: fixed; top: 60px; right: 20px; width: 260px;
            background-color: #ffffff; border: 1px solid #e0e0e0;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999; padding: 20px;
            font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        #szu-helper-panel h3 {
            margin: 0 0 15px 0; font-size: 18px; color: #a20a47;
            text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;
        }
        .szu-helper-group { margin-bottom: 12px; }
        #szu-helper-panel label {
            display: block; margin-bottom: 6px; font-size: 14px; color: #333;
        }
        #szu-helper-panel select, #szu-helper-panel input[type="text"], #szu-helper-panel input[type="date"] {
            width: 100%; padding: 8px; border-radius: 4px; box-sizing: border-box;
            border: 1px solid #ccc; font-size: 14px;
        }
        #szu-helper-panel select:disabled { background-color: #f5f5f5; cursor: not-allowed; }
        #szu-helper-panel .helper-note { font-size: 11px; color: #999; margin-top: 4px; }
        #szu-helper-panel button {
            width: 100%; padding: 10px; margin-top: 10px; border: none;
            border-radius: 4px; background-color: #a20a47;
            color: white; font-size: 16px; cursor: pointer;
            transition: background-color 0.3s ease;
        }
        #szu-helper-panel button:hover { background-color: #8e093d; }
        #szu-helper-panel button:disabled { background-color: #ccc; cursor: not-allowed; }
        #szu-helper-status {
            margin-top: 12px; font-size: 12px; color: #666;
            text-align: center; min-height: 16px; line-height: 1.4;
        }
        .debug-switch { display: flex; align-items: center; justify-content: space-between; margin-top: 15px; }
        .debug-switch label { margin-bottom: 0; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #a20a47; }
        input:checked + .slider:before { transform: translateX(20px); }
    `);

    // --- 3. 创建操作面板 ---
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'szu-helper-panel';
        panel.innerHTML = `
            <h3>深大场馆助手 V9</h3>
            <div class="szu-helper-group">
                <label for="campus-select">① 选择校区</label>
                <select id="campus-select">
                    <option value="">-- 必须选择 --</option>
                    <option value="粤海校区">粤海校区</option>
                    <option value="丽湖校区">丽湖校区</option>
                </select>
            </div>
            <div class="szu-helper-group">
                <label for="sport-select">② 选择项目</label>
                <select id="sport-select" disabled><option>-- 先选校区 --</option></select>
            </div>
            <div class="szu-helper-group" id="court-group" style="display: none;">
                <label for="court-select">⑤ 选择场地</label>
                <input type="text" id="court-select" placeholder="例: A3 或 至畅1 (按顺序抢)">
                <div class="helper-note">用空格分隔，按顺序查找可用场地</div>
            </div>
            <div class="szu-helper-group">
                <label for="date-select">③ 选择日期</label>
                <input type="date" id="date-select">
            </div>
            <div class="szu-helper-group">
                <label for="time-select">④ 选择时间段</label>
                <select id="time-select"></select>
            </div>
            <button id="confirm-btn">一键预约</button>
            <div class="debug-switch">
                <label for="debug-mode">调试模式</label>
                <label class="switch">
                    <input type="checkbox" id="debug-mode">
                    <span class="slider"></span>
                </label>
            </div>
            <div id="szu-helper-status"></div>
        `;
        document.body.appendChild(panel);

        const elements = {
            campus: document.getElementById('campus-select'), sport: document.getElementById('sport-select'),
            date: document.getElementById('date-select'), time: document.getElementById('time-select'),
            courtGroup: document.getElementById('court-group'), court: document.getElementById('court-select'),
            btn: document.getElementById('confirm-btn'), debug: document.getElementById('debug-mode'),
        };
        statusElement = document.getElementById('szu-helper-status');

        // 绑定实时保存事件
        elements.campus.addEventListener('change', () => {
            GM_setValue('selectedCampus', elements.campus.value);
            updateSportsDropdown(elements);
            elements.sport.value = ''; GM_setValue('selectedSport', '');
            toggleCourtSelection(elements);
        });
        elements.sport.addEventListener('change', () => {
            GM_setValue('selectedSport', elements.sport.value);
            toggleCourtSelection(elements);
        });
        elements.date.addEventListener('change', () => GM_setValue('selectedDate', elements.date.value));
        elements.time.addEventListener('change', () => GM_setValue('selectedTime', elements.time.value));
        elements.court.addEventListener('input', () => GM_setValue('selectedCourt', elements.court.value));
        elements.debug.addEventListener('change', () => GM_setValue('debugMode', elements.debug.checked));

        elements.btn.addEventListener('click', () => handleConfirmClick(elements));

        populateTimeSlots(elements.time);
        loadSavedChoices(elements);
    }

    // --- 4. 动态更新与初始化 ---
    function toggleCourtSelection(elements) {
        if (elements.sport.value === '羽毛球') {
            elements.courtGroup.style.display = 'block';
        } else {
            elements.courtGroup.style.display = 'none';
        }
    }

    function updateSportsDropdown(elements) {
        const selectedCampus = elements.campus.value;
        const sports = sportsByCampus[selectedCampus] || [];
        elements.sport.innerHTML = '';
        if (selectedCampus) {
            elements.sport.disabled = false;
            elements.sport.add(new Option("-- 可选，不选则不点击 --", ""));
            sports.forEach(sport => elements.sport.add(new Option(sport, sport)));
        } else {
            elements.sport.disabled = true;
            elements.sport.add(new Option("-- 请先选校区 --", ""));
        }
    }

    function populateTimeSlots(timeSelect) {
        timeSelect.add(new Option("-- 可选，不选则不点击 --", ""));
        TIME_SLOTS.forEach(time => timeSelect.add(new Option(time, time)));
    }

    function loadSavedChoices(elements) {
        const savedCampus = GM_getValue('selectedCampus', '');
        if (savedCampus) {
            elements.campus.value = savedCampus;
            updateSportsDropdown(elements);
            elements.sport.value = GM_getValue('selectedSport', '');
        }

        const savedDate = GM_getValue('selectedDate');
        if (savedDate) {
            elements.date.value = savedDate;
        } else {
            const now = new Date();
            const targetTimeToday = new Date();
            targetTimeToday.setHours(TARGET_HOUR, TARGET_MINUTE, TARGET_SECOND, 0);
            let defaultDate = new Date();
            if (now < targetTimeToday) {
                defaultDate.setDate(defaultDate.getDate() + 1);
            }
            elements.date.value = defaultDate.toISOString().split('T')[0];
        }

        elements.time.value = GM_getValue('selectedTime', '');
        elements.court.value = GM_getValue('selectedCourt', '');
        elements.debug.checked = GM_getValue('debugMode', false);
        toggleCourtSelection(elements); // 初始化时检查是否显示场地选择
    }

    // --- 5. 核心逻辑：定时与瞬时操作 ---
    function handleConfirmClick(elements) {
        const now = new Date();
        const targetTimeToday = new Date();
        targetTimeToday.setHours(TARGET_HOUR, TARGET_MINUTE, TARGET_SECOND, 0);

        if (now < targetTimeToday && (now.getHours() < TARGET_HOUR || (now.getHours() === TARGET_HOUR && now.getMinutes() < TARGET_MINUTE))) {
            elements.btn.disabled = true;
            statusElement.textContent = '已进入定时抢场模式...';
            statusElement.style.color = 'blue';

            countdownInterval = setInterval(() => {
                const currentTime = new Date();
                const remaining = targetTimeToday.getTime() - currentTime.getTime();
                if (remaining <= 0) {
                    clearInterval(countdownInterval);
                    elements.btn.disabled = false;
                    statusElement.textContent = '时间到！开始执行预约...';
                    startBookingProcess(elements);
                } else {
                    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((remaining / 1000 / 60) % 60);
                    const seconds = Math.floor((remaining / 1000) % 60);
                    statusElement.innerHTML = `等待抢场...<br>剩余: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
            }, 1000);
        } else {
            startBookingProcess(elements);
        }
    }

    function startBookingProcess(elements) {
        const choices = {
            campus: elements.campus.value, sport: elements.sport.value,
            date: elements.date.value, time: elements.time.value,
            court: elements.court.value.trim(), debug: elements.debug.checked
        };

        if (!choices.campus) {
            statusElement.textContent = '⚠️ 请必须选择一个校区！';
            statusElement.style.color = 'orange';
            return;
        }

        actionQueue = [];
        actionQueue.push({
            description: `校区“${choices.campus}”`,
            find: () => Array.from(document.querySelectorAll('div.bh-btn.bh-btn-primary, div.campus-tab-default')).find(btn => btn.textContent.trim() === choices.campus)
        });

        if (choices.sport) {
            actionQueue.push({
                description: `项目“${choices.sport}”`,
                find: () => Array.from(document.querySelectorAll('div.frame-4, div.frame-44')).find(el => el.textContent.trim().includes(choices.sport))
            });
        }

        if (choices.date) {
            actionQueue.push({
                description: `日期“${choices.date}”`,
                find: () => document.querySelector(`label[for="${choices.date}"]`)
            });
        }

        if (choices.time) {
            actionQueue.push({
                description: `时间段“${choices.time}”`,
                find: () => document.querySelector(`label[for="${choices.time}"]`)
            });
        }

        if (choices.sport === '羽毛球' && choices.court) {
            actionQueue.push({
                description: `场地 (优先级: ${choices.court})`,
                find: () => findAvailableCourtByPriority(choices.court)
            });
        }

        if (!choices.debug) {
            actionQueue.push({
                description: '“提交预约”按钮',
                find: () => Array.from(document.querySelectorAll('button.bh-btn')).find(btn => btn.textContent.trim() === '提交预约')
            });
        }

        statusElement.textContent = '🚀 任务已启动，开始监控页面...';
        startObserver();
        processActionQueue();
    }

    function findAvailableCourtByPriority(priorityList) {
        const allCourtInputs = document.querySelectorAll('.rectangle-3 input[type="radio"][value*="羽毛球"]');
        if (allCourtInputs.length === 0) return null;

        const preferences = priorityList.trim().toUpperCase().split(/\s+/).filter(p => p);

        for (const pref of preferences) {
            const isAnyMode = (pref === 'ANY' || pref === '任意');
            for (const input of allCourtInputs) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (!label || !label.textContent.includes('(可预约)')) continue;

                if (isAnyMode) return label;

                const courtName = input.value.toUpperCase();
                if (courtName.includes(pref)) return label;
            }
        }
        return null;
    }

    function startObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => window.requestAnimationFrame(processActionQueue));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function processActionQueue() {
        if (actionQueue.length === 0) {
            if (observer) observer.disconnect();
            return;
        }

        const currentAction = actionQueue[0];
        const elementToClick = currentAction.find();

        if (elementToClick) {
            const style = window.getComputedStyle(elementToClick);
            if (style.display === 'none' || style.visibility === 'hidden') return;

            const text = elementToClick.textContent;
            if (text.includes('(已满员)') || text.includes('(无开放场地)')) {
                statusElement.textContent = `❌ ${currentAction.description} 不可预约，任务中止。`;
                statusElement.style.color = 'red';
                if (observer) observer.disconnect();
                actionQueue = [];
                return;
            }

            statusElement.textContent = `✅ 找到并点击 ${currentAction.description}`;
            statusElement.style.color = 'green';
            elementToClick.click();

            actionQueue.shift();

            if (actionQueue.length > 0) {
                statusElement.textContent = `...正在准备下一步: ${actionQueue[0].description}`;
            } else {
                statusElement.textContent = '🎉 所有操作已成功完成！';
                if (observer) observer.disconnect();
            }
        }
    }

    // --- 6. 脚本入口 ---
    window.addEventListener('load', createPanel);

})();
