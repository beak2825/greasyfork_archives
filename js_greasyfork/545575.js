// ==UserScript==
// @name         江苏大学自动抢课脚本 v2.9 (最终设计版)
// @version      2.9.0
// @description  全新现代化日历定时UI，优化的图片背景和交互逻辑，提供极致操作体验。
// @author       ceilf, re-written and enhanced by Gemini
// @match        *://jwxt.ujs.edu.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_log
// @namespace https://greasyfork.org/users/1000648
// @downloadURL https://update.greasyfork.org/scripts/545575/%E6%B1%9F%E8%8B%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%AC%20v29%20%28%E6%9C%80%E7%BB%88%E8%AE%BE%E8%AE%A1%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545575/%E6%B1%9F%E8%8B%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%AC%20v29%20%28%E6%9C%80%E7%BB%88%E8%AE%BE%E8%AE%A1%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置与状态 ---
    const config = { /* ... 保持不变 ... */ targetCourseCode:GM_getValue("TARGET_COURSE_CODE",""),targetStartTime:GM_getValue("TARGET_START_TIME",""),checkInterval:2e3,maxAttempts:1e3,maxFailedAttempts:5 };
    let state = { /* ... 保持不变 ... */ isRunning:!1,isCountingDown:!1,countdownText:"--:--:--",attemptCount:0,failedAttempts:0,intervalId:null,countdownTimer:null,triedTeachingClasses:new Set,conflictedClasses:new Set,isSelecting:!1 };

    // --- 2. 日历与时间选择器管理器 ---
    const dateTimePicker = {
        element: null,
        currentDate: new Date(),
        selectedDate: null,
        init: function() {
            this.element = document.getElementById('grabber-datetime-picker');
            this.element.querySelector('#dtp-cancel').addEventListener('click', () => this.hide());
            this.element.querySelector('#dtp-confirm').addEventListener('click', () => this.confirm());
            this.element.querySelector('#dtp-prev-month').addEventListener('click', () => this.changeMonth(-1));
            this.element.querySelector('#dtp-next-month').addEventListener('click', () => this.changeMonth(1));
            this.element.querySelector('#calendar-body').addEventListener('click', (e) => this.selectDay(e));
        },
        show: function() {
            this.selectedDate = config.targetStartTime ? new Date(config.targetStartTime) : new Date();
            this.currentDate = new Date(this.selectedDate);
            this.render();
            this.element.style.display = 'flex';
            setTimeout(() => this.element.style.opacity = 1, 10);
        },
        hide: function() {
            this.element.style.opacity = 0;
            setTimeout(() => this.element.style.display = 'none', 300);
        },
        changeMonth: function(offset) {
            this.currentDate.setMonth(this.currentDate.getMonth() + offset);
            this.render();
        },
        selectDay: function(e) {
            if (e.target.classList.contains('day') && !e.target.classList.contains('empty')) {
                const day = parseInt(e.target.textContent, 10);
                this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                this.render();
            }
        },
        confirm: function() {
            const hour = document.getElementById('dtp-hour').value.padStart(2, '0');
            const minute = document.getElementById('dtp-minute').value.padStart(2, '0');
            const second = document.getElementById('dtp-second').value.padStart(2, '0');
            this.selectedDate.setHours(hour, minute, second);
            const formattedTime = `${this.selectedDate.getFullYear()}-${String(this.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.selectedDate.getDate()).padStart(2, '0')} ${hour}:${minute}:${second}`;
            
            GM_setValue('TARGET_START_TIME', formattedTime);
            config.targetStartTime = formattedTime;
            log(`定时已设置为: ${config.targetStartTime}`, 'success');
            stopGrabbing();
            startCountdown();
            this.hide();
        },
        render: function() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            
            document.getElementById('dtp-month-year').textContent = `${year}年 ${month + 1}月`;
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const calendarBody = document.getElementById('calendar-body');
            calendarBody.innerHTML = '';
            
            for (let i = 0; i < firstDay; i++) {
                calendarBody.innerHTML += `<div class="day empty"></div>`;
            }
            
            for (let i = 1; i <= daysInMonth; i++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'day';
                dayEl.textContent = i;
                if (this.selectedDate && i === this.selectedDate.getDate() && month === this.selectedDate.getMonth() && year === this.selectedDate.getFullYear()) {
                    dayEl.classList.add('selected');
                }
                calendarBody.appendChild(dayEl);
            }

            document.getElementById('dtp-hour').value = this.selectedDate.getHours();
            document.getElementById('dtp-minute').value = this.selectedDate.getMinutes();
            document.getElementById('dtp-second').value = this.selectedDate.getSeconds();
        }
    };

    // --- 3. 悬浮窗UI管理 (v2.9 最终设计) ---
    const ui = {
        panel: null, ball: null, logContainer: null,
        init: function() {
            this.injectCSS();
            this.createPanel();
            dateTimePicker.init();
            this.addEventListeners();
            setInterval(this.updateStatus, 500);
        },
        injectCSS: function() {
            const css = `
                :root { --accent-color: #00A2FF; }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                #grabber-panel, #grabber-ball { position: fixed; z-index: 9999; animation: fadeIn 0.4s ease-out; }
                #grabber-panel { bottom: 20px; right: 20px; width: 370px; border-radius: 18px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; overflow: hidden; }
                #grabber-bg-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; filter: brightness(0.8); }
                #grabber-bg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 10, 20, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2; }
                .grabber-content { position: relative; z-index: 3; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
                #grabber-header { padding: 8px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; }
                #grabber-header-title { display: flex; align-items: center; gap: 8px; }
                #header-logo { width: 30px; height: 30px; border-radius: 50%; }
                #grabber-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
                #grabber-minimize-btn { cursor: pointer; font-size: 24px; color: #aaa; padding: 0 8px; user-select: none; }
                #grabber-body { display: block; padding: 0 16px; }
                .status-group { background: rgba(255, 255, 255, 0.1); border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.2); padding: 5px 0; }
                .status-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; }
                .status-item-label { font-size: 14px; color: #ddd; }
                .status-item-value { font-size: 14px; font-weight: 600; color: #fff; }
                #grabber-controls { display: flex; gap: 12px; padding: 12px 16px; }
                #grabber-controls button { flex: 1; padding: 10px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 16px; background: rgba(255, 255, 255, 0.2); color: #fff; }
                #grabber-logs { max-height: 100px; overflow-y: auto; padding: 10px; margin: 0 16px 12px; background: rgba(0, 0, 0, 0.2); border-radius: 12px; font-size: 12px; }
                #grabber-ball { /* ... 保持不变 ... */ bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;cursor:pointer;box-shadow:0 5px 20px rgba(0,0,0,.3);background-size:cover;background-position:center;display:none;animation:pulse 2s infinite }
                /* --- Date Time Picker Styles --- */
                #grabber-datetime-picker { display: none; opacity: 0; transition: opacity 0.3s ease; position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(30,30,40,0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 10; flex-direction: column; justify-content: center; align-items: center; padding: 15px; }
                .dtp-header { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 10px; }
                .dtp-header button { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
                #dtp-month-year { font-size: 18px; font-weight: 600; }
                .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; width: 100%; text-align: center; }
                .week-day { font-size: 12px; color: #888; }
                .day { padding: 8px 0; border-radius: 50%; cursor: pointer; transition: background-color 0.2s; }
                .day:not(.empty):hover { background-color: rgba(255,255,255,0.2); }
                .day.selected { background-color: var(--accent-color); color: white; font-weight: bold; }
                .time-inputs { display: flex; gap: 10px; margin: 15px 0; align-items: center; }
                .time-inputs input { width: 50px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: white; text-align: center; border-radius: 5px; padding: 8px; font-size: 16px; }
                .dtp-actions { display: flex; gap: 10px; width: 100%; }
                .dtp-actions button { flex: 1; padding: 10px; border-radius: 8px; border: none; font-size: 16px; cursor: pointer; }
                #dtp-confirm { background-color: var(--accent-color); color: white; }
                #dtp-cancel { background-color: #555; color: white; }
            `;
            const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
        },
        createPanel: function() {
            const panel = document.createElement('div');
            panel.id = 'grabber-panel';
            panel.innerHTML = `
                <img id="grabber-bg-image" src="https://www.dmoe.cc/random.php">
                <div id="grabber-bg-overlay"></div>
                <div class="grabber-content">
                    <div id="grabber-header">
                        <div id="grabber-header-title">
                            <img id="header-logo" src="https://bed.djxs.xyz/file/BQACAgUAAyEGAASVl6k_AAIC_WgxL6hhgZCue4Vx_DDK2qMbmusVAALiFAAC9fSJVep4WzgN_S9WNgQ.png">
                            <h3>抢课助手</h3>
                        </div>
                        <span id="grabber-minimize-btn" title="最小化">－</span>
                    </div>
                    <div id="grabber-body">
                        <div class="status-group">
                             <div class="status-item"><span class="status-item-label">🚦 状态</span><span id="status-text" class="status-item-value">已停止</span></div>
                             <div class="status-item"><span class="status-item-label">🎯 目标课程</span><span id="course-code-text" class="status-item-value">未设置</span></div>
                             <div class="status-item"><span class="status-item-label">📊 尝试次数</span><span id="attempts-text" class="status-item-value">0</span></div>
                        </div>
                        <div class="status-group">
                             <div class="status-item">
                                <span class="status-item-label">⏰ 定时状态</span>
                                <span id="timer-status-text" class="status-item-value">未设置</span>
                             </div>
                             <button id="btn-set-timer" style="width:100%; background:none; border:none; color: var(--accent-color); padding:10px; cursor:pointer; font-size: 15px;">设置/修改定时</button>
                        </div>
                    </div>
                    <div id="grabber-logs"></div>
                    <div id="grabber-controls">
                        <button id="btn-start-grabber">开始</button>
                        <button id="btn-stop-grabber">停止</button>
                    </div>

                    <div id="grabber-datetime-picker">
                        <div class="dtp-header">
                            <button id="dtp-prev-month">‹</button>
                            <span id="dtp-month-year">2025年 8月</span>
                            <button id="dtp-next-month">›</button>
                        </div>
                        <div class="calendar-grid">
                            <div class="week-day">日</div><div class="week-day">一</div><div class="week-day">二</div><div class="week-day">三</div><div class="week-day">四</div><div class="week-day">五</div><div class="week-day">六</div>
                        </div>
                        <div id="calendar-body" class="calendar-grid"></div>
                        <div class="time-inputs">
                            <input id="dtp-hour" type="number" min="0" max="23"> :
                            <input id="dtp-minute" type="number" min="0" max="59"> :
                            <input id="dtp-second" type="number" min="0" max="59">
                        </div>
                        <div class="dtp-actions">
                            <button id="dtp-cancel">取消</button>
                            <button id="dtp-confirm">确认</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);
            // ... 创建悬浮球 ...
            const ball = document.createElement('div'); ball.id = 'grabber-ball'; ball.title = '展开抢课助手'; ball.style.backgroundImage = `url('https://bed.djxs.xyz/file/BQACAgUAAyEGAASVl6k_AAIC_WgxL6hhgZCue4Vx_DDK2qMbmusVAALiFAAC9fSJVep4WzgN_S9WNgQ.png')`; document.body.appendChild(ball);
            this.panel = panel; this.ball = ball; this.logContainer = panel.querySelector('#grabber-logs');
        },
        addEventListeners: function() { /* ... 保持不变 ... */ this.setupWindowInteractions(),this.panel.querySelector("#btn-start-grabber").addEventListener("click",startGrabbing),this.panel.querySelector("#btn-stop-grabber").addEventListener("click",stopGrabbing),this.panel.querySelector("#btn-set-timer").addEventListener("click",()=>dateTimePicker.show()) },
        setupWindowInteractions: function() { /* ... 保持不变 ... */ const e=this.panel.querySelector("#grabber-header"),t=this.panel.querySelector("#grabber-minimize-btn");t.addEventListener("click",(e=>{e.stopPropagation();const t=this.panel.getBoundingClientRect();this.panel.style.display="none",this.ball.style.display="block",this.ball.style.top=`${t.top}px`,this.ball.style.left=`${t.left}px`})),this.ball.addEventListener("click",(()=>{const e=this.ball.getBoundingClientRect();this.ball.style.display="none",this.panel.style.display="block",this.panel.style.top=`${e.top}px`,this.panel.style.left=`${e.left}px`}));const s=(e,t)=>{let s,a,n=!1;e.addEventListener("mousedown",(e=>{n=!0,s=e.clientX-t.getBoundingClientRect().left,a=e.clientY-t.getBoundingClientRect().top})),document.addEventListener("mousemove",(e=>{n&&(t.style.left=`${e.clientX-s}px`,t.style.top=`${e.clientY-a}px`,t.style.bottom="auto",t.style.right="auto")})),document.addEventListener("mouseup",(()=>{n=!1}))};s(e,this.panel),s(this.ball,this.ball) },
        updateStatus: function() {
            document.getElementById('status-text').textContent = state.isRunning ? '运行中' : (state.isCountingDown ? '倒计时中' : '已停止');
            document.getElementById('course-code-text').textContent = config.targetCourseCode || '未设置';
            document.getElementById('attempts-text').textContent = `${state.attemptCount} (失败: ${state.failedAttempts})`;
            document.getElementById('timer-status-text').textContent = state.isCountingDown ? state.countdownText : (config.targetStartTime || '未设置');
        },
        addLog: function(message, type) { /* ... 保持不变 ... */ if(this.logContainer){const e=document.createElement("p");e.className=`log-entry log-${type}`,e.textContent=message,this.logContainer.appendChild(e),this.logContainer.scrollTop=this.logContainer.scrollHeight,this.logContainer.children.length>100&&this.logContainer.removeChild(this.logContainer.firstChild)} }
    };

    // --- 4. 核心功能与控制函数 ---
    
    function log(message, type = 'info') { /* ... */ const e=new Date().toLocaleTimeString("en-GB");ui.addLog(`${e} | ${message}`,type) }
    function startGrabbing() { /* ... */ if(state.isRunning)return void log("脚本已在运行中!","warning");if(!config.targetCourseCode)return void alert("请先设置目标课程号!");log(`抢课脚本启动，目标: ${config.targetCourseCode}`,"success"),Object.assign(state,{isRunning:!0,attemptCount:0,failedAttempts:0,countdownText:"--:--:--"}),state.triedTeachingClasses.clear(),state.conflictedClasses.clear(),attemptGrabCourse(),state.intervalId=setInterval(attemptGrabCourse,config.checkInterval) }
    function stopGrabbing() { /* ... */ state.intervalId&&clearInterval(state.intervalId),state.countdownTimer&&clearInterval(state.countdownTimer),Object.assign(state,{isRunning:!1,isCountingDown:!1,countdownText:"--:--:--"}),log("抢课脚本已停止。","warning") }
    function startCountdown() { /* ... */ if(!state.isCountingDown){const e=new Date(config.targetStartTime);if(isNaN(e.getTime()))return void log("无效的定时时间","warning");state.isCountingDown=!0;const t=()=>{const s=e-new Date;s<=0?(log("时间到，开始抢课!","success"),stopGrabbing(),startGrabbing()):state.countdownText=`${String(Math.floor(s/36e5)).padStart(2,"0")}:${String(Math.floor(s%36e5/6e4)).padStart(2,"0")}:${String(Math.floor(s%6e4/1e3)).padStart(2,"0")}`};state.countdownTimer=setInterval(t,1e3),t()} }
    function clearTimerFromUI() { GM_setValue('TARGET_START_TIME', ''); config.targetStartTime = ''; stopGrabbing(); log('定时已清除。', 'warning'); }
    function setupMenu() {
        GM_registerMenuCommand('🚀 开始抢课', startGrabbing);
        GM_registerMenuCommand('⏹️ 停止脚本', stopGrabbing);
        GM_registerMenuCommand('--- 配置 ---', () => {});
        GM_registerMenuCommand('⚙️ 设置课程号', () => {
            const code = prompt('请输入目标课程号:', config.targetCourseCode);
            if (code) { GM_setValue('TARGET_COURSE_CODE', code.trim()); config.targetCourseCode = code.trim(); log(`课程号已设置为: ${config.targetCourseCode}`, 'success'); }
        });
        GM_registerMenuCommand('⏰ (菜单)设置定时', () => dateTimePicker.show());
        GM_registerMenuCommand('🧹 (菜单)清除定时', clearTimerFromUI);
    }
    // ... 其他核心业务逻辑函数保持不变，此处省略 ...
    function findAllTeachingClasses(){if(!config.targetCourseCode)return[];const e=[],t=document.querySelectorAll("table tbody tr");return t.forEach((t=>{const s=t.textContent||"";if(s.includes(config.targetCourseCode)&&s.includes("选课")&&!s.includes("退选")){const s=extractTeachingClassInfo(t);s&&e.push({row:t,info:s})}})),1===state.attemptCount&&log(`首次查找到 ${Array.from(new Map(e.map((e=>[e.info.id,e]))).values()).length} 个教学班`,"info"),Array.from(new Map(e.map((e=>[e.info.id,e]))).values())}
    function extractTeachingClassInfo(e){try{const t=e.querySelectorAll("td"),s=(e.textContent||"").replace(/\s+/g," ").trim(),a=s.match(/(\d+)\/(\d+)/),n=s.match(/【([\u4e00-\u9fa5]{2,4})】/)||Array.from(t).map((e=>e.textContent.trim())).find((e=>/^[\u4e00-\u9fa5]{2,4}$/.test(e))),o=s.match(/(星期[一二三四五六日][^星期]*)/g),c={className:`教学班-${n||"未知教师"}`,teacher:n?Array.isArray(n)?n[1]||n[0]:n:"未知教师",capacity:a?`${parseInt(a[1])}/${parseInt(a[2])}`:"0/0",timeInfo:o?o.join(" "):"未知时间"};return c.id=`${config.targetCourseCode}-${c.teacher}-${c.timeInfo}`,c}catch(e){return log(`解析教学班信息时出错: ${e.message}`,"error"),null}}
    function checkTeachingClassCapacity(e){const t=e.info.capacity.match(/^(\d+)\/(\d+)$/);return!!t&&parseInt(t[1])<parseInt(t[2])}
    function checkTimeConflictWarning(){return["上课时间与其他教学班有冲突","时间冲突"].some((e=>document.body.innerText.includes(e)))}
    function selectTeachingClass(e){if(!state.isSelecting&&!state.conflictedClasses.has(e.info.id)){log(`尝试选择: ${e.info.className} (${e.info.teacher})`,"info"),state.isSelecting=!0,state.triedTeachingClasses.add(e.info.id);const t=e.row.querySelector("button, a");t?(t.click(),setTimeout((()=>{var t;checkTimeConflictWarning()?(log(`时间冲突: ${e.info.className}`,"error"),state.conflictedClasses.add(e.info.id),null===(t=document.querySelector(".messager-button .l-btn, .modal-footer .btn"))||void 0===t||t.click()):(e.row.textContent||"").includes("退选")?(log(`选课成功: ${e.info.className}! 脚本已停止。`,"success"),GM_notification({title:"抢课成功！",text:`课程: ${config.targetCourseCode}\n教师: ${e.info.teacher}`,timeout:0}),stopGrabbing()):(log("请求已发送但未确认成功。","warning"),state.failedAttempts++),state.isSelecting=!1}),1500)):state.isSelecting=!1}}
    function attemptGrabCourse(){if(!state.isSelecting&&(state.attemptCount++,!(state.attemptCount>config.maxAttempts||state.failedAttempts>=config.maxFailedAttempts))){const e=findAllTeachingClasses();for(const t of e)if(checkTeachingClassCapacity(t)&&!state.triedTeachingClasses.has(t.info.id))return log(`发现有余量: ${t.info.className} [${t.info.capacity}]`,"success"),void selectTeachingClass(t);log("所有教学班均无余量或已尝试/冲突。","info")}else log("达到最大次数或失败次数，脚本停止。","error"),GM_notification({title:"抢课脚本已停止",text:"达到最大尝试或失败次数。"}),stopGrabbing()}

    function init() {
        setupMenu();
        ui.init();
        log('抢课助手 (v2.9) 已加载', 'info');
        if (config.targetStartTime && new Date(config.targetStartTime) > new Date()) { startCountdown(); }
    }

    // --- 启动脚本 ---
    init();

})();