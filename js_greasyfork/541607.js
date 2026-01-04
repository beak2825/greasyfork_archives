// ==UserScript==
// @name         双色胶囊计时器（含运行状态自动同步）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  红绿胶囊计时器，数字自适应，运行/暂停状态全标签页同步，新开页面自动跟随计时
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541607/%E5%8F%8C%E8%89%B2%E8%83%B6%E5%9B%8A%E8%AE%A1%E6%97%B6%E5%99%A8%EF%BC%88%E5%90%AB%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541607/%E5%8F%8C%E8%89%B2%E8%83%B6%E5%9B%8A%E8%AE%A1%E6%97%B6%E5%99%A8%EF%BC%88%E5%90%AB%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = '__tm_pill_timer_fullsync_v1__';
    // 默认数据结构，计数数字和运行状态分开
    const defaultData = {
        red: { value: 0, running: false },
        green: { value: 0, running: false }
    };

    // 读取本地数据
    function getStored() {
        let d = defaultData;
        try {
            let str = localStorage.getItem(STORAGE_KEY);
            if (str) d = Object.assign({}, d, JSON.parse(str));
        } catch(e) {}
        // 补充类型安全
        if(typeof d.red !== "object" || typeof d.red.value !== "number") d.red = { value: 0, running: false };
        if(typeof d.green !== "object" || typeof d.green.value !== "number") d.green = { value: 0, running: false };
        return d;
    }
    // 存储到本地
    function setStored(obj) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    }

    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
    .tm-pill-timer-container {
        position: fixed;
        right: 40px;
        bottom: 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 18px;
        z-index: 999999;
        font-family: 'Segoe UI', Arial, sans-serif;
        user-select: none;
    }
    .tm-pill-timers-col {
        display: flex;
        flex-direction: column;
        gap: 14px;
        align-items: flex-end;
    }
    .tm-pill-timer {
        min-width: 80px;
        padding: 0 24px;
        height: 42px;
        background: #ee5555;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.18rem;
        font-weight: bold;
        font-variant-numeric: tabular-nums;
        letter-spacing: 2px;
        box-shadow: 0 2.5px 12px rgba(0,0,0,0.10);
        border: 2.6px solid rgba(0,0,0,0.10);
        cursor: pointer;
        transition: box-shadow 0.18s, background 0.16s;
        outline: none;
        user-select: text;
    }
    .tm-pill-timer.green {
        background: #36c24b;
    }
    .tm-pill-timer.active {
        box-shadow: 0 0 0 4px #3338;
        background: linear-gradient(90deg, rgba(54,194,75,0.85), rgba(54,194,75,1));
    }
    .tm-pill-timer.red.active {
        background: linear-gradient(90deg, rgba(238,85,85,0.88), #ee5555);
    }
    .tm-pill-reset-btn {
        margin-top: 10px;
        background: #eee;
        color: #333;
        font-size: 1rem;
        border-radius: 18px;
        border: none;
        padding: 7px 18px;
        cursor: pointer;
        box-shadow: 0 1px 5px rgba(0,0,0,0.06);
        transition: background 0.18s;
        outline: none;
        align-self: flex-end;
    }
    .tm-pill-reset-btn:hover {
        background: #fad7d7;
        color: #b20a0a;
    }
    `;
    document.head.appendChild(style);

    // DOM
    const container = document.createElement('div');
    container.className = 'tm-pill-timer-container';
    container.innerHTML = `
        <div class="tm-pill-timers-col">
            <div class="tm-pill-timer red" id="tm-pill-timer-1">00:00:00</div>
            <div class="tm-pill-timer green" id="tm-pill-timer-2">00:00:00</div>
        </div>
        <button class="tm-pill-reset-btn">清零</button>
    `;
    document.body.appendChild(container);

    // 工具
    function secToHMS(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return (
            (h<10?'0':'')+h+':'+
            (m<10?'0':'')+m+':'+
            (s<10?'0':'')+s
        );
    }

    // 计时器对象
    function createTimer(domElem, storeKey, colorClass) {
        let timer = getStored();
        let running = !!timer[storeKey].running;
        let value = +timer[storeKey].value || 0;
        let interval = null;
        function updateView() {
            domElem.textContent = secToHMS(value);
            if (running) domElem.classList.add('active');
            else domElem.classList.remove('active');
        }
        function start() {
            if (!running) {
                running = true;
                updateView();
                updateStored('running', true);
                interval = setInterval(() => {
                    value++;
                    updateStored('value', value);
                    updateView();
                }, 1000);
            }
        }
        function stop() {
            if (running) {
                running = false;
                updateView();
                updateStored('running', false);
                if(interval) { clearInterval(interval); interval = null; }
            }
        }
        function updateStored(attr, dat) {
            // 存储一次完整对象
            let now = getStored();
            now[storeKey][attr] = dat;
            if(attr==='value') value = dat;
            if(attr==='running') running = dat;
            setStored(now);
        }
        function toggle() {
            running ? stop() : start();
        }
        function reset() {
            stop();
            value = 0;
            updateStored('value', 0);
            updateStored('running', false);
            updateView();
        }
        function syncFromStorage() {
            const s = getStored();
            let newVal = +s[storeKey].value || 0;
            let shouldRunning = !!s[storeKey].running;
            value = newVal;
            updateView();
            if (shouldRunning && !running) {
                start();
            } else if (!shouldRunning && running) {
                stop();
            }
        }
        // 初始化
        updateView();
        if (running) start();

        domElem.onclick = toggle;
        return { reset, syncFromStorage, getValue:()=>value, setValue:(v)=>{value=v;updateView();}, isRunning:()=>running, updateView, start, stop };
    }

    // 实例&事件绑定
    const timer1 = createTimer(document.getElementById('tm-pill-timer-1'), 'red', 'red');
    const timer2 = createTimer(document.getElementById('tm-pill-timer-2'), 'green', 'green');

    container.querySelector('.tm-pill-reset-btn').onclick = function(){
        timer1.reset();
        timer2.reset();
        setStored(JSON.stringify(defaultData));
    };

    // ---- 多标签同步 ----
    window.addEventListener('storage', function(e){
        if(e.key === STORAGE_KEY && e.newValue){
            // 同步两个定时器
            timer1.syncFromStorage();
            timer2.syncFromStorage();
        }
    });

    // 定期兜底同步
    setInterval(() => {
        timer1.syncFromStorage();
        timer2.syncFromStorage();
    }, 2000);
    window.addEventListener('beforeunload', ()=>{
        // 最后时刻刷一次（避免关闭丢状态）
        let s = getStored();
        s.red.value = timer1.getValue();
        s.green.value = timer2.getValue();
        setStored(s);
    });

})();
