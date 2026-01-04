// ==UserScript==
// @name         [MWI]personal use
// @name:zh-CN   [银河奶牛]自用脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.28
// @description  个人脚本，适用于 Milky Way Idle 游戏
// @description:zh-CN 个人专用脚本，适用于 Milky Way Idle 游戏
// @author       deric
// @license      MIT
// @match        https://www.milkywayidle.com/game*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/542553/%5BMWI%5Dpersonal%20use.user.js
// @updateURL https://update.greasyfork.org/scripts/542553/%5BMWI%5Dpersonal%20use.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MWI_SCRIPT_VERSION = '0.1.14';

    // IndexedDB 封装
    const DB_NAME = 'mwi_personal_use_db';
    const DB_VERSION = 1;
    const STORE_NAME = 'kv';
    let dbPromise = null;
    function openDB() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            const req = window.indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = function(e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            req.onsuccess = function(e) {
                resolve(e.target.result);
            };
            req.onerror = function(e) {
                reject(e);
            };
        });
        return dbPromise;
    }
    async function idbGet(key) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => {
                console.error('idbGet error:', e);
                resolve(null);
            };
        });
    }
    async function idbSet(key, value) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = (e) => {
                console.error('idbSet error:', e);
                reject(req.error);
            };
        });
    }
    async function idbRemove(key) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(key);
            req.onsuccess = () => resolve();
            req.onerror = (e) => {
                console.error('idbRemove error:', e);
                reject(req.error);
            };
        });
    }

    // localStorage兼容迁移（仅首次）
    async function migrateLocalStorageToIDB() {
        if (window.localStorage && !(await idbGet('__migrated__'))) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                try {
                    await idbSet(key, value);
                } catch(e) {}
            }
            await idbSet('__migrated__', '1');
        }
    }
    migrateLocalStorageToIDB();

    // 用法替换示例：
    // await idbSet('key', value)
    // let v = await idbGet('key')
    // await idbRemove('key')

    // 下面所有localStorage.getItem/setItem/removeItem全部替换为await idbGet/idbSet/idbRemove

    async function showSettingPanel() {
        let exist = document.getElementById('mwiSettingPopup');
        if (exist) exist.remove();
        const popup = document.createElement('div');
        popup.id = 'mwiSettingPopup';
        popup.style.position = 'fixed';
        popup.style.top = '120px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'white';
        popup.style.border = '2px solid #888';
        popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
        popup.style.zIndex = 99999;
        popup.style.padding = '24px 32px';
        popup.style.minWidth = '300px';
        popup.innerHTML = `<div style='text-align:right;'><button id='closeMwiSettingPopup'>关闭</button></div><h3 style='margin:8px 0 16px 0;'>设置</h3>
            <div style='margin-bottom:12px;'>
                <label><input type='checkbox' id='mwiMonitorPlayer'/> 是否启动监控人数</label>
            </div>
            <div style='margin-bottom:12px;'>
                <label><input type='checkbox' id='mwiMonitorNetWorth'/> 是否启动监控净资产</label>
            </div>
            <div style='margin-bottom:12px;'>
                <label><input type='checkbox' id='mwiShowOrderTotalValue'/> 是否显示订单总价</label>
            </div>
            <div style='color:#888;font-size:12px;'>设置会自动保存</div>`;
        document.body.appendChild(popup);
        document.getElementById('closeMwiSettingPopup').onclick = async function() {
            popup.remove();
            await idbSet('mwiSettingPanelLastVersion', MWI_SCRIPT_VERSION);
        };
        // 初始化复选框状态
        document.getElementById('mwiMonitorPlayer').checked = (await idbGet('mwiMonitorPlayer')) !== 'false';
        document.getElementById('mwiMonitorNetWorth').checked = (await idbGet('mwiMonitorNetWorth')) === 'true';
        document.getElementById('mwiShowOrderTotalValue').checked = (await idbGet('mwiShowOrderTotalValue')) !== 'false';
        // 监听变更
        document.getElementById('mwiMonitorPlayer').onchange = async function() {
            try {
                await idbSet('mwiMonitorPlayer', this.checked.toString());
                console.log('设置已保存: mwiMonitorPlayer =', this.checked);
                // 触发自定义设置变更事件
                window.dispatchEvent(new CustomEvent('mwiSettingsChanged', { detail: { key: 'mwiMonitorPlayer' } }));
            } catch(e) {
                console.error('保存设置失败: mwiMonitorPlayer', e);
                showMwiTip('保存设置失败，请重试', 'error');
            }
        };
        document.getElementById('mwiMonitorNetWorth').onchange = async function() {
            try {
                await idbSet('mwiMonitorNetWorth', this.checked.toString());
                console.log('设置已保存: mwiMonitorNetWorth =', this.checked);
                // 触发自定义设置变更事件
                window.dispatchEvent(new CustomEvent('mwiSettingsChanged', { detail: { key: 'mwiMonitorNetWorth' } }));
            } catch(e) {
                console.error('保存设置失败: mwiMonitorNetWorth', e);
                showMwiTip('保存设置失败，请重试', 'error');
            }
        };
        document.getElementById('mwiShowOrderTotalValue').onchange = async function() {
            try {
                await idbSet('mwiShowOrderTotalValue', this.checked.toString());
                console.log('设置已保存: mwiShowOrderTotalValue =', this.checked);
                window.dispatchEvent(new Event('mwiShowOrderTotalValueChanged'));
            } catch(e) {
                console.error('保存设置失败: mwiShowOrderTotalValue', e);
                showMwiTip('保存设置失败，请重试', 'error');
            }
        };
    }

    // 你的代码写在这里

    async function savePlayerNumber() {
        const el = document.querySelector('div.Header_playerCount__1TDTK');
        if (!el) return;
        const number = parseInt(el.textContent.replace(/\D/g, ''), 10);
        if (isNaN(number)) {
            setTimeout(savePlayerNumber, 3000);
            return;
        }
        const now = new Date().toISOString();
        const data = { time: now, number };
        let arr = [];
        try {
            arr = JSON.parse(await idbGet('playernumber') || '[]');
            if (!Array.isArray(arr)) arr = [];
        } catch(e) { arr = []; }
        arr.push(data);
        await idbSet('playernumber', JSON.stringify(arr));
    }

    // 新增：根据当前网址获取key
    function getNetWorthKey() {
        const url = window.location.href;
        const match = url.match(/(\d{6})(?!.*\d)/);
        return match ? match[1] : 'default';
    }

    async function saveNetWorth() {
        const el = document.querySelector('#toggleNetWorth');
        if (!el) return;
        // 提取数字和单位
        const match = el.textContent.replace(/,/g, '').match(/([\d.]+)\s*([KMBT]?)/i);
        let number = null;
        if (match) {
            number = parseFloat(match[1]);
            const unit = match[2]?.toUpperCase();
            if (unit === 'K') number *= 1e3;
            else if (unit === 'M') number *= 1e6;
            else if (unit === 'B') number *= 1e9;
            else if (unit === 'T') number *= 1e12;
        }
        if (!number || isNaN(number)) {
            setTimeout(saveNetWorth, 3000);
            return;
        }
        const now = new Date().toISOString();
        const data = { time: now, number };
        let arr = [];
        const key = 'networth_' + getNetWorthKey();
        try {
            arr = JSON.parse(await idbGet(key) || '[]');
            if (!Array.isArray(arr)) arr = [];
        } catch(e) { arr = []; }
        arr.push(data);
        // 移除净资产记录上限限制
        // if(arr.length > 5000) arr = arr.slice(-5000);
        await idbSet(key, JSON.stringify(arr));
    }

    // 修改按钮显示逻辑，支持显示多条记录
    async function createShowButton() {
        if ((await idbGet('mwiMonitorPlayer')) === 'false') return;
        let target = document.querySelector("#root > div > div > div.GamePage_headerPanel__1T_cA > div > div.Header_leftHeader__PkRWX > div.Header_navLogoAndPlayerCount__2earI > div.Header_playerCount__1TDTK");
        if (!target) {
            target = document.querySelector("#root > div > div > div.GamePage_headerPanel__3uNKN > div > div.Header_leftHeader__PkRWX > div.Header_navLogoAndPlayerCount__2earI > div.Header_playerCount__1TDTK");
        }
        if (!target || document.getElementById('showPlayerNumberBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'showPlayerNumberBtn';
        btn.textContent = '显示玩家人数记录';
        btn.style.marginLeft = '8px';
        btn.style.background = 'rgb(69,71,113)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '4px 10px';
        btn.onclick = async function() {
            let data = await idbGet('playernumber');
            let arr = [];
            if (data) {
                try {
                    arr = JSON.parse(data);
                    if (!Array.isArray(arr)) arr = [];
                } catch(e) { arr = []; }
            }
            let rangeDays = parseInt(await idbGet('mwiPlayerNumberRangeDays')) || 1;
            const ranges = [1, 3, 7, 14, 30];
            let rangeBtns = '<div style="margin-bottom:8px;">';
            for(const d of ranges){
                rangeBtns += `<button class='rangeBtn' data-days='${d}' style='margin-right:4px;'>${d}天</button>`;
            }
            rangeBtns += '</div>';
            let html = rangeBtns;
            html += `<button id='managePlayerNumberBtn' style='margin-bottom:8px;'>管理</button>`;
            html += `<div id='chartContainer'></div>`;
            html += `<div id='managePlayerNumberPanel' style='display:none;margin-top:12px;background:rgb(69,71,113);color:#fff;padding:12px;border-radius:4px;'></div>`;
            let exist = document.getElementById('playerNumberPopup');
            if (exist) exist.remove();
            const popup = document.createElement('div');
            popup.id = 'playerNumberPopup';
            popup.style.position = 'fixed';
            popup.style.top = '80px';
            popup.style.left = '40px';
            popup.style.background = 'rgb(69,71,113)';
            popup.style.border = '2px solid #888';
            popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
            popup.style.zIndex = 9999;
            popup.style.padding = '16px';
            popup.style.maxHeight = '500px';
            popup.style.overflow = 'auto';
            popup.innerHTML = `<div style='text-align:right;'><button id='closePlayerNumberPopup' style='background:rgb(69,71,113);color:#fff;border:none;border-radius:4px;padding:4px 10px;'>关闭</button></div><div style='color:#fff;'>${html}</div>`;
            document.body.appendChild(popup);
            document.getElementById('closePlayerNumberPopup').onclick = function() {
                popup.remove();
            };
            document.getElementById('managePlayerNumberBtn').onclick = function() {
                const panel = document.getElementById('managePlayerNumberPanel');
                if(panel.style.display==='none'){
                    renderManagePanel();
                    panel.style.display='block';
                }else{
                    panel.style.display='none';
                }
            };
            function renderManagePanel(){
                const panel = document.getElementById('managePlayerNumberPanel');
                if(arr.length===0){
                    panel.innerHTML = '暂无记录';
                    return;
                }
                let html = `<button id='clearAllPlayerNumber' style='color:red;margin-bottom:8px;'>全部清空</button><br/>`;
                html += '<ul style="max-height:200px;overflow:auto;padding-left:0;">';
                arr.forEach((item,idx)=>{
                    html += `<li style='list-style:none;margin-bottom:4px;'>${item.time.replace('T',' ').slice(0,16)} - ${item.number} <button data-idx='${idx}' class='delPlayerNumberBtn' style='color:red;'>删除</button></li>`;
                });
                html += '</ul>';
                panel.innerHTML = html;
                panel.querySelectorAll('.delPlayerNumberBtn').forEach(btn=>{
                    btn.onclick = async function(){
                        arr.splice(parseInt(this.getAttribute('data-idx')),1);
                        await idbSet('playernumber', JSON.stringify(arr));
                        drawChart(rangeDays);
                    };
                });
                panel.querySelector('#clearAllPlayerNumber').onclick = async function(){
                    if(confirm('确定要清空所有记录吗？')){
                        arr.length=0;
                        await idbSet('playernumber', '[]');
                        renderManagePanel();
                        drawChart(rangeDays);
                    }
                };
            }
            function drawChart(days) {
                const now = Date.now();
                const ms = days * 24 * 60 * 60 * 1000;
                const filtered = arr.filter(item => {
                    const t = new Date(item.time).getTime();
                    return t >= now - ms;
                }).sort((a, b) => new Date(a.time) - new Date(b.time));
                const container = document.getElementById('chartContainer');
                if(filtered.length > 1){
                    container.innerHTML = `<canvas id='playerNumberChart' width='500' height='300' style='display:block;'></canvas>`;
                }else if(filtered.length === 1){
                    container.innerHTML = `仅有一条数据：${filtered[0].time} - ${filtered[0].number}`;
                    return;
                }else{
                    container.innerHTML = '暂无数据';
                    return;
                }
                setTimeout(() => {
                    const canvas = document.getElementById('playerNumberChart');
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const times = filtered.map(item => new Date(item.time));
                    const numbers = filtered.map(item => item.number);
                    let anchorTimes = [];
                    let anchorLabels = [];
                    const minTime = times[0].getTime();
                    const maxTime = times[times.length-1].getTime();
                    if(days <= 1){
                        let t = new Date(times[0]);
                        t.setMinutes(0,0,0);
                        while (t.getTime() <= maxTime) {
                            anchorTimes.push(new Date(t));
                            anchorLabels.push(`${t.getHours()}:00`);
                            t.setHours(t.getHours()+1);
                        }
                    } else {
                        let t = new Date(times[0]);
                        t.setHours(0,0,0,0);
                        while (t.getTime() <= maxTime) {
                            anchorTimes.push(new Date(t));
                            anchorLabels.push(`${t.getMonth()+1}-${t.getDate()}`);
                            t.setDate(t.getDate()+1);
                        }
                    }
                    // 计算合适的刻度单位
                    function calculateTicks(min, max) {
                        const range = max - min;
                        let tickUnit = 1;
                        
                        if (range >= 1000) {
                            tickUnit = 1000;
                        } else if (range >= 100) {
                            tickUnit = 100;
                        } else if (range >= 10) {
                            tickUnit = 10;
                        }
                        
                        // 调整min和max为tickUnit的整数倍
                        min = Math.floor(min / tickUnit) * tickUnit;
                        max = Math.ceil(max / tickUnit) * tickUnit;
                        
                        return { min, max, tickUnit };
                    }
                    
                    let minY = Math.min(...numbers);
                    let maxY = Math.max(...numbers);
                    const { min: adjustedMinY, max: adjustedMaxY, tickUnit } = calculateTicks(minY, maxY);
                    minY = adjustedMinY;
                    maxY = adjustedMaxY;
                    const padding = 55;
                    const w = canvas.width - padding*2;
                    const h = canvas.height - padding*2;
                    ctx.font = '12px sans-serif';
                    ctx.fillStyle = '#fff';
                    ctx.strokeStyle = '#fff';
                    const timeSpan = maxTime - minTime || 1;
                    ctx.strokeStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(padding, padding);
                    ctx.lineTo(padding, padding + h);
                    ctx.lineTo(padding + w, padding + h);
                    ctx.stroke();
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    // 根据刻度单位生成刻度
                    const stepCount = 5;
                    const stepValue = (maxY - minY) / stepCount;
                    
                    for(let i=0;i<=stepCount;i++){
                        const y = padding + h - h*i/stepCount;
                        const val = Math.round(minY + stepValue * i);
                        ctx.fillText(val, padding-5, y);
                        ctx.strokeStyle = '#eee';
                        ctx.beginPath();
                        ctx.moveTo(padding, y);
                        ctx.lineTo(padding+w, y);
                        ctx.stroke();
                    }
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    let anchorStep = 1;
                    if(anchorTimes.length > 10) anchorStep = Math.ceil(anchorTimes.length / 10);
                    for(let i=0;i<anchorTimes.length;i+=anchorStep){
                        const t = anchorTimes[i].getTime();
                        const x = padding + w*(t-minTime)/timeSpan;
                        ctx.fillStyle = '#fff';
                        ctx.fillText(anchorLabels[i], x, padding+h+5);
                    }
                    ctx.strokeStyle = '#007bff';
                    ctx.beginPath();
                    for(let i=0;i<numbers.length;i++){
                        const t = times[i].getTime();
                        const x = padding + w*(t-minTime)/timeSpan;
                        const y = padding + h - h*(numbers[i]-minY)/(maxY-minY||1);
                        if(i===0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.fillStyle = '#007bff';
                    for(let i=0;i<numbers.length;i++){
                        const t = times[i].getTime();
                        const x = padding + w*(t-minTime)/timeSpan;
                        const y = padding + h - h*(numbers[i]-minY)/(maxY-minY||1);
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, 2*Math.PI);
                        ctx.fill();
                    }
                }, 0);
            }
            drawChart(rangeDays);
            popup.querySelectorAll('.rangeBtn').forEach(btn => {
                btn.onclick = async function(){
                    const days = parseInt(this.getAttribute('data-days'));
                    await idbSet('mwiPlayerNumberRangeDays', days);
                    drawChart(days);
                    highlightRangeBtn(days);
                };
            });
        };
        if (target.nextSibling) {
            target.parentNode.insertBefore(btn, target.nextSibling);
        } else {
            target.parentNode.appendChild(btn);
        }
    }

    // 新增：显示净资产历史折线图按钮（分key）
    async function createShowNetWorthButton() {
        if ((await idbGet('mwiMonitorNetWorth')) !== 'true') return;
        const target = document.querySelector("#toggleNetWorth");
        if (!target || document.getElementById('showNetWorthBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'showNetWorthBtn';
        const key = getNetWorthKey();
        btn.textContent = '显示净资产记录';
        btn.style.marginLeft = '8px';
        btn.style.background = 'rgb(69,71,113)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '4px 10px';
        btn.onclick = async function() {
            const key = 'networth_' + getNetWorthKey();
            let data = await idbGet(key);
            let arr = [];
            if (data) {
                try {
                    arr = JSON.parse(data);
                    if (!Array.isArray(arr)) arr = [];
                } catch(e) { arr = []; }
            }
            let rangeDays = parseInt(await idbGet('mwiNetWorthRangeDays')) || 1;
            const ranges = [1, 3, 7, 14, 30];
            let rangeBtns = '<div style="margin-bottom:8px;">';
            for(const d of ranges){
                rangeBtns += `<button class='rangeBtnNet' data-days='${d}' style='margin-right:4px;'>${d}天</button>`;
            }
            rangeBtns += '</div>';
            let html = rangeBtns;
            html += `<button id='manageNetWorthBtn' style='margin-bottom:8px;'>管理</button>`;
            html += `<div id='chartNetContainer'></div>`;
            html += `<div id='manageNetWorthPanel' style='display:none;margin-top:12px;background:rgb(69,71,113);color:#fff;padding:12px;border-radius:4px;'></div>`;
            let exist = document.getElementById('netWorthPopup');
            if (exist) exist.remove();
            const popup = document.createElement('div');
            popup.id = 'netWorthPopup';
            popup.style.position = 'fixed';
            popup.style.top = '80px';
            popup.style.left = '40px';
            popup.style.background = 'rgb(69,71,113)';
            popup.style.border = '2px solid #888';
            popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
            popup.style.zIndex = 9999;
            popup.style.padding = '16px';
            popup.style.maxHeight = '500px';
            popup.style.overflow = 'visible';
            popup.innerHTML = `<div style='text-align:right;'><button id='closeNetWorthPopup' style='background:rgb(69,71,113);color:#fff;border:none;border-radius:4px;padding:4px 10px;'>关闭</button></div><h4 style='margin:8px 0 16px 0;color:#fff;'>净资产记录</h4><div style='color:#fff;'>${html}</div>`;
            document.body.appendChild(popup);
            document.getElementById('closeNetWorthPopup').onclick = function() {
                popup.remove();
            };
            document.getElementById('manageNetWorthBtn').onclick = function() {
                const panel = document.getElementById('manageNetWorthPanel');
                if(panel.style.display==='none'){
                    renderManagePanelNet();
                    panel.style.display='block';
                }else{
                    panel.style.display='none';
                }
            };
            async function renderManagePanelNet(){
                const panel = document.getElementById('manageNetWorthPanel');
                const key = 'networth_' + getNetWorthKey();
                let arr = [];
                try {
                    arr = JSON.parse(await idbGet(key) || '[]');
                    if (!Array.isArray(arr)) arr = [];
                } catch(e) { arr = []; }
                const rangeDays = parseInt(await idbGet('mwiNetWorthRangeDays')) || 1;
                if(arr.length===0){
                    panel.innerHTML = '暂无记录';
                    drawChart(rangeDays);
                    return;
                }
                let html = `<button id='clearAllNetWorth' style='color:red;margin-bottom:8px;'>全部清空</button><br/>`;
                html += '<ul style="max-height:200px;overflow:auto;padding-left:0;">';
                arr.forEach((item,idx)=>{
                    html += `<li style='list-style:none;margin-bottom:4px;'>${item.time.replace('T',' ').slice(0,16)} - ${Math.round(item.number/1e6)}M <button data-idx='${idx}' class='delNetWorthBtn' style='color:red;'>删除</button></li>`;
                });
                html += '</ul>';
                panel.innerHTML = html;
                panel.querySelectorAll('.delNetWorthBtn').forEach(btn=>{
                    btn.onclick = async function(){
                        const idx = parseInt(this.getAttribute('data-idx'));
                        arr.splice(idx,1);
                        await idbSet(key, JSON.stringify(arr));
                        renderManagePanelNet();
                    };
                });
                panel.querySelector('#clearAllNetWorth').onclick = async function(){
                    if(confirm('确定要清空所有记录吗？')){
                        arr = [];
                        await idbSet(key, '[]');
                        renderManagePanelNet();
                    }
                };
            }
            function drawChart(days) {
                const now = Date.now();
                const ms = days * 24 * 60 * 60 * 1000;
                const filtered = arr.filter(item => {
                    const t = new Date(item.time).getTime();
                    return t >= now - ms;
                }).sort((a, b) => new Date(a.time) - new Date(b.time));
                const container = document.getElementById('chartNetContainer');
                if(filtered.length > 1){
                    container.innerHTML = `<canvas id='netWorthChart' width='550' height='320' style='display:block;'></canvas>`;
                }else if(filtered.length === 1){
                    container.innerHTML = `仅有一条数据：${(filtered[0].time)} - ${Math.round(filtered[0].number/1e6)}M`;
                    return;
                }else{
                    container.innerHTML = '暂无数据';
                    return;
                }
                setTimeout(() => {
                    const canvas = document.getElementById('netWorthChart');
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const times = filtered.map(item => new Date(item.time));
                    const numbers = filtered.map(item => item.number/1e6);
                    let anchorTimes = [];
                    let anchorLabels = [];
                    const minTime = times[0].getTime();
                    const maxTime = times[times.length-1].getTime();
                    if(days <= 1){
                        let t = new Date(times[0]);
                        t.setMinutes(0,0,0);
                        while (t.getTime() <= maxTime) {
                            anchorTimes.push(new Date(t));
                            anchorLabels.push(`${t.getHours()}:00`);
                            t.setHours(t.getHours()+1);
                        }
                    } else {
                        let t = new Date(times[0]);
                        t.setHours(0,0,0,0);
                        while (t.getTime() <= maxTime) {
                            anchorTimes.push(new Date(t));
                            anchorLabels.push(`${t.getMonth()+1}-${t.getDate()}`);
                            t.setDate(t.getDate()+1);
                        }
                    }
                    // 计算合适的刻度单位
                    function calculateTicks(min, max) {
                        const range = max - min;
                        let tickUnit = 0.1; // 净资产以M为单位，所以基础单位小一些
                        
                        if (range >= 10000) {
                            tickUnit = 10000;
                        } else if (range >= 1000) {
                            tickUnit = 1000;
                        } else if (range >= 100) {
                            tickUnit = 100;
                        } else if (range >= 10) {
                            tickUnit = 10;
                        } else if (range >= 1) {
                            tickUnit = 1;
                        } else if (range >= 0.1) {
                            tickUnit = 0.1;
                        }
                        
                        // 调整min和max为tickUnit的整数倍
                        min = Math.floor(min / tickUnit) * tickUnit;
                        max = Math.ceil(max / tickUnit) * tickUnit;
                        
                        return { min, max, tickUnit };
                    }
                    
                    let minY = Math.min(...numbers);
                    let maxY = Math.max(...numbers);
                    const { min: adjustedMinY, max: adjustedMaxY } = calculateTicks(minY, maxY);
                    minY = adjustedMinY;
                    maxY = adjustedMaxY;
                    const padding = 55;
                    const w = canvas.width - padding*2;
                    const h = canvas.height - padding*2;
                    ctx.font = '12px sans-serif';
                    ctx.fillStyle = '#fff';
                    ctx.strokeStyle = '#fff';
                    const timeSpan = maxTime - minTime || 1;
                    ctx.strokeStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(padding, padding);
                    ctx.lineTo(padding, padding + h);
                    ctx.lineTo(padding + w, padding + h);
                    ctx.stroke();
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    // 根据范围生成合适的刻度数量
                    const stepCount = 5;
                    const stepValue = (maxY - minY) / stepCount;
                    
                    for(let i=0;i<=stepCount;i++){
                        const y = padding + h - h*i/stepCount;
                        const val = minY + stepValue * i;
                        // 根据值的大小决定显示格式
                        if (val >= 1) {
                            ctx.fillText(Math.round(val) + 'M', padding-5, y);
                        } else {
                            ctx.fillText(val.toFixed(1) + 'M', padding-5, y);
                        }
                        ctx.strokeStyle = '#eee';
                        ctx.beginPath();
                        ctx.moveTo(padding, y);
                        ctx.lineTo(padding+w, y);
                        ctx.stroke();
                    }
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    let anchorStep = 1;
                    if(anchorTimes.length > 10) anchorStep = Math.ceil(anchorTimes.length / 10);
                    for(let i=0;i<anchorTimes.length;i+=anchorStep){
                        const t = anchorTimes[i].getTime();
                        const x = padding + w*(t-minTime)/timeSpan;
                        ctx.fillStyle = '#fff';
                        ctx.fillText(anchorLabels[i], x, padding+h+5);
                    }
                    ctx.strokeStyle = '#28a745';
                    ctx.beginPath();
                    for(let i=0;i<numbers.length;i++){
                        const t = times[i].getTime();
                        const x = padding + w*(t-minTime)/timeSpan;
                        const y = padding + h - h*(numbers[i]-minY)/(maxY-minY||1);
                        if(i===0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    ctx.fillStyle = '#28a745';
                    for(let i=0;i<numbers.length;i++){
                        const t = times[i].getTime();
                        const x = padding + w*(t-minTime)/timeSpan;
                        const y = padding + h - h*(numbers[i]-minY)/(maxY-minY||1);
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, 2*Math.PI);
                        ctx.fill();
                    }
                }, 0);
            }
            drawChart(rangeDays);
            function highlightRangeBtnNet(days) {
                popup.querySelectorAll('.rangeBtnNet').forEach(btn => {
                    if(parseInt(btn.getAttribute('data-days')) === days){
                        btn.style.background = '#e0e0e0';
                    }else{
                        btn.style.background = '';
                    }
                });
            }
            highlightRangeBtnNet(rangeDays);
            popup.querySelectorAll('.rangeBtnNet').forEach(btn => {
                btn.onclick = async function(){
                    const days = parseInt(this.getAttribute('data-days'));
                    await idbSet('mwiNetWorthRangeDays', days);
                    drawChart(days);
                    highlightRangeBtnNet(days);
                };
            });
        };
        target.parentNode.appendChild(btn);
        showNetWorthDayCompare();
    }

    // 工具函数：带单位字符串转数字
    function parseNumberWithUnit(str) {
        const match = str.replace(/,/g, '').match(/([\d.]+)\s*([KMBT]?)/i);
        let num = null;
        if (match) {
            num = parseFloat(match[1]);
            const unit = match[2]?.toUpperCase();
            if (unit === 'K') num *= 1e3;
            else if (unit === 'M') num *= 1e6;
            else if (unit === 'B') num *= 1e9;
            else if (unit === 'T') num *= 1e12;
        }
        return num;
    }

    // 工具函数：大数字格式化为K/M/B，保留1位小数，无小数不显示
    function formatNumberWithUnit(num) {
        if (num >= 1e9) {
            let n = num / 1e9;
            return (n % 1 === 0 ? n : n.toFixed(1)) + 'B';
        } else if (num >= 1e6) {
            let n = num / 1e6;
            return (n % 1 === 0 ? n : n.toFixed(1)) + 'M';
        } else if (num >= 1e3) {
            let n = num / 1e3;
            return (n % 1 === 0 ? n : n.toFixed(1)) + 'K';
        } else {
            return num.toString();
        }
    }

    // 工具函数：最大值只显示到M为单位
    function formatNumberToM(num) {
        let n = num / 1e6;
        return (n % 1 === 0 ? n : n.toFixed(2)) + 'M';
    }

    // 优化：库存面板数字显示，超过1万显示为K，超过1百万显示为M，超过10亿显示为B，低于1万正常显示
    function formatNumberSmartUnit(num) {
        if (num >= 1e9) {
            let n = num / 1e9;
            return (n % 1 === 0 ? n : n.toFixed(2)) + 'B';
        } else if (num >= 1e6) {
            let n = num / 1e6;
            return (n % 1 === 0 ? n : n.toFixed(2)) + 'M';
        } else if (num >= 1e4) {
            let n = num / 1e3;
            return (n % 1 === 0 ? n : n.toFixed(1)) + 'K';
        } else {
            return num.toString();
        }
    }

    // 读取所有订单行的数量（取"/"后面的数字）
    function getAllOrderQuantities() {
        const nodes = document.querySelectorAll('div.MarketplacePanel_myListingsTableContainer__2s6pm > table > tbody > tr > td:nth-child(3) > div > div:nth-child(2)');
        const quantities = [];
        nodes.forEach(node => {
            const text = node.textContent.trim();
            const parts = text.split('/');
            if(parts.length === 2) {
                const qty = parseNumberWithUnit(parts[1]);
                if(!isNaN(qty)) quantities.push(qty);
            }
        });
        console.log('所有订单数量:', quantities);
        return quantities;
    }

    // 读取所有订单行的价格
    function getAllOrderPrices() {
        const nodes = document.querySelectorAll('td.MarketplacePanel_price__hIzrY > span');
        const prices = [];
        nodes.forEach(node => {
            const text = node.textContent.trim();
            const price = parseNumberWithUnit(text);
            if(!isNaN(price)) prices.push(price);
        });
        console.log('所有订单价格:', prices);
        return prices;
    }

    // 在每个订单价格下方插入总价值
    function showOrderTotalValues() {
        // 获取所有订单行
        const rows = document.querySelectorAll('div.MarketplacePanel_myListingsTableContainer__2s6pm > table > tbody > tr');
        rows.forEach(row => {
            // 获取数量
            const qtyNode = row.querySelector('td:nth-child(3) > div > div:nth-child(2)');
            let qty = 0;
            if(qtyNode) {
                const text = qtyNode.textContent.trim();
                const parts = text.split('/');
                if(parts.length === 2) {
                    qty = parseNumberWithUnit(parts[1]);
                }
            }
            // 获取价格
            const priceNode = row.querySelector('td.MarketplacePanel_price__hIzrY > span');
            let price = 0;
            if(priceNode) {
                const text = priceNode.textContent.trim();
                price = parseNumberWithUnit(text);
            }
            // 计算总价值
            const total = (!isNaN(qty) && !isNaN(price)) ? qty * price : 0;
            // 插入显示div
            if(priceNode) {
                // 避免重复插入
                if(priceNode.nextSibling && priceNode.nextSibling.className === 'orderTotalValue') return;
                const div = document.createElement('div');
                div.className = 'orderTotalValue';
                div.style.fontSize = '12px';
                div.style.color = '#28a745';
                div.textContent = `总价值：${formatNumberWithUnit(total)}`;
                priceNode.parentNode.appendChild(div);
            }
        });
    }

    // 读取仓库内所有物品及数量（初步实现，具体功能待定）
    function getWarehouseItems() {
        // 假设仓库表格选择器如下（如有变动可调整）：
        // 例：div.WarehousePanel_tableContainer__xxx > table > tbody > tr
        const rows = document.querySelectorAll('div.WarehousePanel_tableContainer__2Qw2d table tbody tr');
        const items = [];
        rows.forEach(row => {
            // 假设第1列为物品名，第2列为数量
            const nameCell = row.querySelector('td:nth-child(1)');
            const qtyCell = row.querySelector('td:nth-child(2)');
            if(nameCell && qtyCell) {
                const name = nameCell.textContent.trim();
                const qty = qtyCell.textContent.trim().replace(/,/g, '');
                items.push({ name, qty });
            }
        });
        console.log('仓库物品及数量:', items);
        return items;
    }

    // 重构：读取背包所有物品及数量（Inventory_items__6SXv0.script_buildScore_added.script_invSort_added）
    async function getInventoryItems() {
        const items = [];
        const itemDivs = document.querySelectorAll('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.Inventory_items__6SXv0.script_buildScore_added.script_invSort_added > div > div > div');
        itemDivs.forEach(div => {
            const svg = div.querySelector('div.Item_iconContainer__5z7j4 > svg');
            let name = '';
            let icon_url = '';
            if(svg) {
                name = svg.getAttribute('aria-label') || '';
                const use = svg.querySelector('use');
                if(use) {
                    icon_url = use.getAttribute('href') || '';
                    // 提取 # 后面的部分作为 icon 名称
                    if(icon_url.includes('#')) {
                        icon_url = icon_url.split('#')[1];
                    }
                }
            }
            // 新增：查找强化等级
            let enhance = '';
            // 兼容不同class写法，优先找Item_enhancementLevel__19g-e
            let enhanceDiv = div.querySelector('div.Item_enhancementLevel__19g-e');
            if (!enhanceDiv) {
                // 兜底：查找包含enhancementLevel的div
                enhanceDiv = Array.from(div.querySelectorAll('div')).find(d => d.className && d.className.includes('enhancementLevel'));
            }
            if (enhanceDiv) {
                enhance = enhanceDiv.textContent.trim();
            }
            // 拼接到名称
            let displayName = name;
            if (enhance) {
                displayName += enhance;
            }
            const countDiv = div.querySelector('div.Item_count__1HVvv');
            if(!countDiv) return;
            const txt = countDiv.textContent.trim();
            let qty = parseNumberWithUnit(txt);
            if(!qty || isNaN(qty)) return;
            // 查找物品种类
            let category = '';
            let parent = div.parentElement;
            while(parent && !category) {
                const labelDiv = parent.querySelector('div.Inventory_label__XEOAx > span.Inventory_categoryButton__35s1x');
                if(labelDiv) category = labelDiv.textContent.trim();
                parent = parent.parentElement;
            }
            if(name) items.push({ name: displayName, qty, category, icon_url, enhance: enhance || '' });
        });
        // 自定义日期格式化，确保月、日为两位数字
        const nowObj = new Date();
        const year = nowObj.getFullYear();
        const month = String(nowObj.getMonth() + 1).padStart(2, '0');
        const day = String(nowObj.getDate()).padStart(2, '0');
        const hours = String(nowObj.getHours()).padStart(2, '0');
        const minutes = String(nowObj.getMinutes()).padStart(2, '0');
        const now = `${year}/${month}/${day} ${hours}:${minutes}`;
        const key = 'inventory_' + getNetWorthKey();
        let arr = [];
        try {
            arr = JSON.parse(await idbGet(key) || '[]');
            if (!Array.isArray(arr)) arr = [];
        } catch(e) { arr = []; }
        arr.push({ time: now, items });
        // 只保留最新50条
        // 移除人数记录上限限制
        // if(arr.length > 50) arr = arr.slice(-50);
        await idbSet(key, JSON.stringify(arr));
        console.log('背包物品及数量:', items);
        return items;
    }

    // 修改定时器和延时调用，根据设置决定是否监控
    setInterval(async () => {
        if((await idbGet('mwiMonitorPlayer')) !== 'false') savePlayerNumber();
        if((await idbGet('mwiMonitorNetWorth')) === 'true') saveNetWorth();
    }, 30 * 60 * 1000);
    // 监听#toggleNetWorth出现后0.5秒再显示按钮
    function waitForNetWorthAndShowBtns() {
        const check = () => {
            const el = document.querySelector('#toggleNetWorth');
            if(el) {
    setTimeout(() => {
                    // 先插入玩家人数按钮，再插入净资产和库存按钮，避免被覆盖
        createShowButton();
        createShowNetWorthButton();
                    createShowInventoryHistoryButton();
                }, 500);
                return true;
            }
            return false;
        };
        if(!check()) {
            const observer = new MutationObserver(() => {
                if(check()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
    waitForNetWorthAndShowBtns();
    // 首次安装时默认开启所有功能
    (async () => {
        if ((await idbGet('mwiMonitorPlayer')) === null) {
            await idbSet('mwiMonitorPlayer', 'true');
        }
        if ((await idbGet('mwiMonitorNetWorth')) === null) {
            await idbSet('mwiMonitorNetWorth', 'true');
        }
        if ((await idbGet('mwiShowOrderTotalValue')) === null) {
            await idbSet('mwiShowOrderTotalValue', 'true');
        }
    })();
    // 自定义设置变更事件监听
    window.addEventListener('mwiSettingsChanged', async function(e) {
        const { key } = e.detail;
        if (key === 'mwiMonitorPlayer' || key === 'mwiMonitorNetWorth') {
            // 移除旧按钮
            const btn1 = document.getElementById('showPlayerNumberBtn');
            if (btn1) btn1.remove();
            const btn2 = document.getElementById('showNetWorthBtn');
            if (btn2) btn2.remove();
            // 重新判断并添加
            createShowButton();
            createShowNetWorthButton();
        }
    });

    // 监听TabPanel_hidden出现时自动显示订单总价值
    let orderTotalValueObserver = null;
    function observeOrderTabAndShowTotal() {
        if(orderTotalValueObserver) orderTotalValueObserver.disconnect();
        (async () => {
                if((await idbGet('mwiShowOrderTotalValue')) === 'false') return;
                orderTotalValueObserver = new MutationObserver(() => {
                    const tab = document.querySelector('div.TabPanel_tabPanel__tXMJF.TabPanel_hidden__26UM3');
                    if(tab) {
                        showOrderTotalValues();
                    }
                });
                orderTotalValueObserver.observe(document.body, { childList: true, subtree: true });
            })();
    }
    // 页面加载后自动监听
    setTimeout(() => {
        observeOrderTabAndShowTotal();
    }, 5000);
    // 响应设置变更
    window.addEventListener('mwiShowOrderTotalValueChanged', () => {
        observeOrderTabAndShowTotal();
        // 清理已显示的总价值
        document.querySelectorAll('.orderTotalValue').forEach(e=>e.remove());
    });
    // 首次安装时默认开启
    (async () => {
        if ((await idbGet('mwiShowOrderTotalValue')) === null) {
            await idbSet('mwiShowOrderTotalValue', 'true');
        }
    })();

    // 在"显示净资产记录"按钮左侧添加"显示库存记录"按钮
    function createShowInventoryHistoryButton() {
        const netBtn = document.getElementById('showNetWorthBtn');
        if (!netBtn || document.getElementById('showInventoryHistoryBtn')) return;
        // 按钮加载时保存一次库存
        getInventoryItems();
        const btn = document.createElement('button');
        btn.id = 'showInventoryHistoryBtn';
        btn.textContent = '显示库存记录';
        btn.style.marginRight = '8px';
        btn.style.background = 'rgb(69,71,113)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '4px 10px';
        btn.onclick = function() {
            getInventoryItems(); // 点击时保存一次库存
            showInventoryHistory();
        };
        netBtn.parentNode.insertBefore(btn, netBtn);
    }

    // 监听净资产按钮生成后插入库存按钮
    if (typeof observerInvBtn === 'undefined') {
        var observerInvBtn = new MutationObserver(() => {
            createShowInventoryHistoryButton();
        });
        observerInvBtn.observe(document.body, { childList: true, subtree: true });
    }

    // 显示库存记录弹窗（左侧时间点，右侧物品分类）
    async function showInventoryHistory() {
        const key = 'inventory_' + getNetWorthKey();
        let arr = [];
        try {
            arr = JSON.parse(await idbGet(key) || '[]');
            if (!Array.isArray(arr)) arr = [];
        } catch(e) { arr = []; }
        // 移除库存记录上限限制
        // arr = arr.slice(-300);
        let exist = document.getElementById('inventoryHistoryPopup');
        if (exist) exist.remove();
        const popup = document.createElement('div');
        popup.id = 'inventoryHistoryPopup';
        popup.style.position = 'fixed';
        popup.style.top = '120px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'rgb(69,71,113)';
        popup.style.border = '2px solid #888';
        popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
        popup.style.zIndex = 99999;
        popup.style.padding = '24px 32px';
        popup.style.minWidth = '600px';
        popup.innerHTML = `
        <div style='position:absolute;top:18px;right:24px;display:flex;flex-direction:row;align-items:flex-start;z-index:1;'>
            <button id='recordCurrentInventoryBtn' style='background:rgb(69,71,113);color:#fff;border:2px solid #28a745;border-radius:4px;padding:4px 10px;font-size:14px;cursor:pointer;margin-right:8px;'>记录当前库存</button>
            <button id='showChangedItemsBtn' style='background:#28a745;color:#fff;border:2px solid #28a745;border-radius:4px;padding:4px 10px;font-size:14px;cursor:pointer;margin-right:8px;'>显示变动物品</button>
            <button id='closeInventoryHistoryPopup' style='background:rgb(69,71,113);color:#fff;border:none;border-radius:4px;padding:4px 10px;'>关闭</button>
        </div>
        <h3 style='margin:0 0 12px 0;color:#fff;'>库存历史记录</h3>
        <div style='height:1px;width:100%;background:#3a3a5a;margin-bottom:12px;'></div>
        <div id='invHistoryPanel' style='display:flex;gap:24px;min-height:320px;'></div>`;
        document.body.appendChild(popup);
        document.getElementById('closeInventoryHistoryPopup').onclick = function() {
            popup.remove();
        };
        // 读取上次位置和尺寸
        let popupLeft = parseInt(await idbGet('mwiInvPopupLeft')) || window.innerWidth/2-320;
        let popupTop = parseInt(await idbGet('mwiInvPopupTop')) || 120;
        let popupWidth = parseInt(await idbGet('mwiInvPopupWidth')) || 640;
        let popupHeight = parseInt(await idbGet('mwiInvPopupHeight')) || 420;
        popup.style.left = popupLeft + 'px';
        popup.style.top = popupTop + 'px';
        popup.style.width = popupWidth + 'px';
        popup.style.height = popupHeight + 'px';
        popup.style.minWidth = '480px';
        popup.style.minHeight = '320px';
        popup.style.resize = 'none'; // 禁用原生resize
        popup.style.boxSizing = 'border-box';
        // 拖动功能
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        const dragHeader = popup.querySelector('h3');
        dragHeader.style.cursor = 'move';
        dragHeader.addEventListener('mousedown', function(e){
            isDragging = true;
            dragOffsetX = e.clientX - popup.offsetLeft;
            dragOffsetY = e.clientY - popup.offsetTop;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e){
            if(isDragging){
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;
                newLeft = Math.max(0, Math.min(window.innerWidth-popup.offsetWidth, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight-popup.offsetHeight, newTop));
                popup.style.left = newLeft + 'px';
                popup.style.top = newTop + 'px';
            }
        });
        document.addEventListener('mouseup', async function(e){
            if(isDragging){
                isDragging = false;
                await idbSet('mwiInvPopupLeft', parseInt(popup.style.left));
                await idbSet('mwiInvPopupTop', parseInt(popup.style.top));
                document.body.style.userSelect = '';
            }
        });
        // 右下角拖拽大小
        const resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '2px';
        resizeHandle.style.bottom = '2px';
        resizeHandle.style.width = '22px';
        resizeHandle.style.height = '22px';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.zIndex = '11';
        resizeHandle.innerHTML = `<svg width='22' height='22'><polyline points='6,20 20,20 20,6' style='fill:none;stroke:#28a745;stroke-width:3'/></svg>`;
        popup.appendChild(resizeHandle);
        let isResizing = false, resizeStartX=0, resizeStartY=0, startW=0, startH=0;
        resizeHandle.addEventListener('mousedown', function(e){
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            startW = popup.offsetWidth;
            startH = popup.offsetHeight;
            e.stopPropagation();
            document.body.style.userSelect = 'none';
            // 只监听window，避免多次绑定
            window.addEventListener('mousemove', doResize, true);
            window.addEventListener('mouseup', stopResize, true);
        });
        function doResize(e) {
            if (!isResizing) return;
            let newW = Math.max(340, startW + (e.clientX - resizeStartX));
            let newH = Math.max(260, startH + (e.clientY - resizeStartY));
            popup.style.width = newW + 'px';
            popup.style.height = newH + 'px';
            setPanelSize();
        }
        function stopResize(e) {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', doResize, true);
            window.removeEventListener('mouseup', stopResize, true);
            idbSet('mwiInvPopupWidth', parseInt(popup.style.width));
            idbSet('mwiInvPopupHeight', parseInt(popup.style.height));
        }
        // 让内容区自适应弹窗
        const invPanel = popup.querySelector('#invHistoryPanel');
        invPanel.style.height = (popupHeight-110) + 'px';
        invPanel.style.maxHeight = 'none';
        invPanel.style.minHeight = '180px';
        invPanel.style.flex = '1 1 auto';
        // 右侧内容区和左侧栏自适应
        const setPanelSize = () => {
            const h = popup.offsetHeight-110;
            const w = popup.offsetWidth;
            invPanel.style.height = h + 'px';
            // 左侧栏高度
            const leftCol = popup.querySelector('#invHistoryLeftCol');
            if(leftCol) {
                leftCol.style.maxHeight = h-10 + 'px';
                leftCol.style.height = h-10 + 'px';
            }
            // 右侧栏宽高
            const rightCol = popup.querySelector('#invHistoryRightCol');
            if(rightCol) {
                rightCol.style.maxHeight = h-10 + 'px';
                rightCol.style.height = h-10 + 'px';
                rightCol.style.width = (w-220) + 'px';
                rightCol.style.maxWidth = '';
            }
        };
        setPanelSize(); // 打开面板时立即自适应内容区和图标排列
        // 左侧时间点
        const panel = document.getElementById('invHistoryPanel');
        if(arr.length === 0) {
            panel.innerHTML = `<div style='color:#fff;'>暂无库存记录</div>`;
            return;
        }
        let selectedIdx = null; // 首次打开不选中任何记录
        // 处理日期分组
        const dateMap = {};
        arr.forEach((entry, idx) => {
            const dateStr = entry.time.split(' ')[0]; // 以空格分隔，取第一部分（日期）
            if(!dateMap[dateStr]) dateMap[dateStr] = [];
            dateMap[dateStr].push({entry, idx});
        });
        const allDates = Object.keys(dateMap).sort((a,b)=>b.localeCompare(a));
        let selectedDate = allDates[0];
        // 下拉栏HTML
        let dateSelectHtml = `<select id='invHistoryDateSelect' style='width:100%;margin-bottom:8px;padding:2px 6px;border-radius:4px;'>`;
        allDates.forEach(d=>{
            dateSelectHtml += `<option value='${d}'>${d}</option>`;
        });
        dateSelectHtml += `</select>`;
        // 生成左侧栏内容函数
        function renderLeftCol(dateStr, activeIdx) {
            let leftHtml = dateSelectHtml;
            // 新到旧排序，时间字符串降序
            const records = (dateMap[dateStr]||[]).slice().sort((a,b)=>b.entry.time.localeCompare(a.entry.time));
            records.forEach(({entry, idx}) => {
                // 拆分时间，修复显示问题
                const t = new Date(entry.time);
                const monthDay = `${(t.getMonth()+1).toString().padStart(2,'0')}/${t.getDate().toString().padStart(2,'0')}`;
                const hms = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`;
                let highlight = (idx === activeIdx) ? "background:#444;border-radius:4px;" : "";
                leftHtml += `<div class='invHistoryItem' data-idx='${idx}' style='margin-bottom:10px;border:1.5px solid #888;border-radius:6px;padding:4px 2px;background:rgba(255,255,255,0.04);${highlight}'>`;
                leftHtml += `<div class='invTimeBtn' data-idx='${idx}' style='padding:4px 6px;cursor:pointer;color:#fff;font-size:13px;line-height:1.2;text-align:center;'>`;
                leftHtml += `<div style='font-size:12px;'>${monthDay}</div><div style='font-size:11px;'>${hms}</div>`;
                leftHtml += `</div>`;
                leftHtml += `<div style='display:flex;gap:6px;justify-content:center;margin-top:2px;'>`;
                leftHtml += `<button class='invBtn1' data-idx='${idx}' style='background:rgb(69,71,113);color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;'>对比</button>`;
                leftHtml += `<button class='invBtn2' data-idx='${idx}' style='background:#d33;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;'>删除</button>`;
                leftHtml += `</div></div>`;
            });
            return leftHtml;
        }
        // 初始渲染，默认高亮最新一条
        let activeIdx = (dateMap[selectedDate] && dateMap[selectedDate].length) ? dateMap[selectedDate][0].idx : 0;
        let leftColHtml = `<div style='min-width:160px;max-height:400px;overflow:auto;border-right:1px solid #888;' id='invHistoryLeftCol'>`;
        leftColHtml += renderLeftCol(selectedDate, activeIdx);
        leftColHtml += `</div>`;
        panel.innerHTML = `<div>${leftColHtml}</div><div id='invHistoryRightCol' style='flex:1;overflow-y:auto;max-width:520px;max-height:400px;'></div>`;
        setPanelSize();
        // 渲染右侧内容，默认显示最新一条
        // renderRight(activeIdx); // 不再默认渲染右侧
        // 监听日期下拉栏切换
        panel.querySelector('#invHistoryDateSelect').onchange = function(){
            selectedDate = this.value;
            panel.querySelector('#invHistoryLeftCol').innerHTML = renderLeftCol(selectedDate, -1);
            // 不自动高亮和切换右侧
            bindLeftColEvents();
        };
        // 事件绑定函数
        function bindLeftColEvents() {
            panel.querySelectorAll('.invHistoryItem').forEach(itemDiv => {
                itemDiv.addEventListener('click', function(e) {
                    if (e.target.tagName === 'BUTTON') return;
                    const idx = parseInt(this.getAttribute('data-idx'));
                    panel.querySelector('#invHistoryLeftCol').innerHTML = renderLeftCol(selectedDate, idx);
                    renderRight(idx); // 修正：点击后显示右侧库存
                    bindLeftColEvents();
                });
            });
            // 对比按钮
            panel.querySelectorAll('.invBtn1').forEach(btn => {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    const idx = parseInt(this.getAttribute('data-idx'));
                    // 当前右侧显示的selectedIdx
                    const curIdx = selectedIdx;
                    if(idx === curIdx) return; // 对比自己无意义
                    const baseItems = arr[idx].items;
                    const curItems = arr[curIdx].items;
                    // 以物品名+分类为key（不含强化）
                    const getKey = item => (item.name||'')+'|'+(item.category||'');
                    // 构建分组：同名同类不同强化的物品分别统计
                    function groupByEnhance(items) {
                        const map = {};
                        items.forEach(item => {
                            const k = (item.name||'')+'|'+(item.category||'')+'|'+(item.enhance||'');
                            if (!map[k]) map[k] = { ...item };
                            else map[k].qty += item.qty;
                        });
                        return Object.values(map);
                    }
                    const baseMap = {};
                    groupByEnhance(baseItems).forEach(item=>{ baseMap[getKey(item)+(item.enhance||'')] = item; });
                    const curMap = {};
                    groupByEnhance(curItems).forEach(item=>{ curMap[getKey(item)+(item.enhance||'')] = item; });
                    // 分类分组（先用当前的）
                    const group = {};
                    groupByEnhance(curItems).forEach(item => {
                        const cat = item.category || '未分类';
                        if(!group[cat]) group[cat] = [];
                        group[cat].push(item);
                    });
                    // 把历史有但当前没有的物品也加进去
                    groupByEnhance(baseItems).forEach(item => {
                        const key = getKey(item)+(item.enhance||'');
                        if(!curMap[key]){
                            const cat = item.category || '未分类';
                            if(!group[cat]) group[cat] = [];
                            // 构造一个qty为0的当前物品，icon等用历史的
                            group[cat].push({
                                name: item.name,
                                category: item.category,
                                icon_url: item.icon_url,
                                qty: 0,
                                enhance: item.enhance,
                                _baseQty: item.qty // 方便后面diff
                            });
                        }
                    });
                    // 记录本次对比分组和diff
                    lastCompareData = { group, baseMap, getKey };
                    // 渲染
                    renderCompareGroup(group, baseMap, getKey, false);
                }
            });
            // 删除按钮
            panel.querySelectorAll('.invBtn2').forEach(btn => {
                btn.onclick = async function(e) {
                    e.stopPropagation();
                    const idx = parseInt(this.getAttribute('data-idx'));
                    showMwiConfirm('确定要删除该条库存历史记录吗？', async function(ok){
                        if(!ok) return;
                        arr.splice(idx, 1);
                        await idbSet(key, JSON.stringify(arr));
                        showInventoryHistory();
                    });
                }
            });
        }
        bindLeftColEvents();
        // 格式化图标URL的辅助函数
        function formatIconUrl(iconUrl) {
            // 如果已经是完整路径，直接返回
            if(iconUrl.includes('#') || iconUrl.includes('.')) {
                return iconUrl;
            }
            // 否则添加默认前缀和后缀
            return '/static/media/items_sprite.6d12eb9d.svg#' + iconUrl;
        }

        // 右侧渲染函数
        function renderRight(idx) {
            selectedIdx = idx;
            let rightHtml = '';
            const items = arr[selectedIdx].items;
            // 分类分组
            const group = {};
            items.forEach(item => {
                const cat = item.category || '未分类';
                if(!group[cat]) group[cat] = [];
                group[cat].push(item);
            });
            for(const cat in group) {
                rightHtml += `<div style='margin-bottom:18px;'><b style='color:#fff;'>${cat}</b><ul style='margin:8px 0 0 0;padding:0;display:flex;flex-wrap:wrap;gap:18px;max-width:100%;justify-content:flex-start;align-items:flex-start;'>`;
                group[cat].forEach(item => {
                    rightHtml += `<li style='list-style:none;position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;'>`;
                    if(item.icon_url) {
                            rightHtml += `<svg width='40' height='40' style='display:block;'><use href='${formatIconUrl(item.icon_url)}'></use></svg>`;
                        }
                    // 强化等级左上角
                    if(item.enhance) {
                        rightHtml += `<span style='position:absolute;left:-6px;top:-6px;font-size:13px;font-weight:bold;color:#fff;background:#28a745;padding:0 4px;border-radius:6px;'>${item.enhance}</span>`;
                    }
                    rightHtml += `<span style='position:absolute;right:0;bottom:0;background:rgba(0,0,0,0.7);color:#fff;font-size:13px;padding:0 4px;border-radius:8px 0 4px 0;'>${formatNumberSmartUnit(item.qty)}</span></li>`;
                });
                rightHtml += '</ul></div>';
            }
            panel.querySelector('#invHistoryRightCol').innerHTML = rightHtml;
            setPanelSize(); // 渲染后立即自适应
        }
        // 默认渲染最新一条
        // renderRight(0); // 不再默认渲染右侧
        setPanelSize(); // 内容生成后立即自适应
        // 默认高亮最新一条
        // panel.querySelectorAll('.invTimeBtn')[0].style.background = '#444'; // 注释掉
        // panel.querySelectorAll('.invTimeBtn')[0].style.borderRadius = '4px'; // 注释掉
        // 绑定按钮1对比功能
        let lastCompareData = null; // 存储上次对比渲染的分组和diff
        panel.querySelectorAll('.invBtn1').forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const idx = parseInt(this.getAttribute('data-idx'));
                // 当前右侧显示的selectedIdx
                const curIdx = selectedIdx;
                if(idx === curIdx) return; // 对比自己无意义
                const baseItems = arr[idx].items;
                const curItems = arr[curIdx].items;
                // 以物品名+分类为key（不含强化）
                const getKey = item => (item.name||'')+'|'+(item.category||'');
                // 构建分组：同名同类不同强化的物品分别统计
                function groupByEnhance(items) {
                    const map = {};
                    items.forEach(item => {
                        const k = (item.name||'')+'|'+(item.category||'')+'|'+(item.enhance||'');
                        if (!map[k]) map[k] = { ...item };
                        else map[k].qty += item.qty;
                    });
                    return Object.values(map);
                }
                const baseMap = {};
                groupByEnhance(baseItems).forEach(item=>{ baseMap[getKey(item)+(item.enhance||'')] = item; });
                const curMap = {};
                groupByEnhance(curItems).forEach(item=>{ curMap[getKey(item)+(item.enhance||'')] = item; });
                // 分类分组（先用当前的）
                const group = {};
                groupByEnhance(curItems).forEach(item => {
                    const cat = item.category || '未分类';
                    if(!group[cat]) group[cat] = [];
                    group[cat].push(item);
                });
                // 把历史有但当前没有的物品也加进去
                groupByEnhance(baseItems).forEach(item => {
                    const key = getKey(item)+(item.enhance||'');
                    if(!curMap[key]){
                        const cat = item.category || '未分类';
                        if(!group[cat]) group[cat] = [];
                        // 构造一个qty为0的当前物品，icon等用历史的
                        group[cat].push({
                            name: item.name,
                            category: item.category,
                            icon_url: item.icon_url,
                            qty: 0,
                            enhance: item.enhance,
                            _baseQty: item.qty // 方便后面diff
                        });
                    }
                });
                // 记录本次对比分组和diff
                lastCompareData = { group, baseMap, getKey };
                // 渲染
                renderCompareGroup(group, baseMap, getKey, false);
            }
        });
        // 渲染对比分组的函数，支持只显示有变动的物品
        function renderCompareGroup(group, baseMap, getKey, onlyChanged) {
            let rightHtml = '';
            for(const cat in group) {
                let items = group[cat];
                if(onlyChanged) {
                    items = items.filter(item => {
                        const baseQty = (baseMap[getKey(item)+(item.enhance||'')] && baseMap[getKey(item)+(item.enhance||'')].qty) || 0;
                        const diff = (item.qty||0) - baseQty;
                        return diff !== 0;
                    });
                    if(items.length === 0) continue;
                }
                rightHtml += `<div style='margin-bottom:18px;'><b style='color:#fff;'>${cat}</b><ul style='margin:8px 0 0 0;padding:0;display:flex;flex-wrap:wrap;gap:18px;max-width:100%;justify-content:flex-start;align-items:flex-start;'>`;
                items.forEach(item => {
                    rightHtml += `<li style='list-style:none;position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;'>`;
                    if(item.icon_url) {
                                rightHtml += `<svg width='40' height='40' style='display:block;'><use href='${formatIconUrl(item.icon_url)}'></use></svg>`;
                            }
                    // 强化等级左上角
                    if(item.enhance) {
                        rightHtml += `<span style='position:absolute;left:-6px;top:-6px;font-size:13px;font-weight:bold;color:#fff;background:#28a745;padding:0 4px;border-radius:6px;'>${item.enhance}</span>`;
                    }
                    // 数量
                    rightHtml += `<span style='position:absolute;right:0;bottom:0;background:rgba(0,0,0,0.7);color:#fff;font-size:13px;padding:0 4px;border-radius:8px 0 4px 0;'>${formatNumberSmartUnit(item.qty)}</span>`;
                    // 对比增减
                    const baseQty = (baseMap[getKey(item)+(item.enhance||'')] && baseMap[getKey(item)+(item.enhance||'')].qty) || 0;
                    const diff = (item.qty||0) - baseQty;
                    if(diff!==0){
                        rightHtml += `<span style='position:absolute;right:-8px;top:-8px;font-size:13px;font-weight:bold;color:${diff>0?'#28a745':'#d33'};background:rgba(0,0,0,0.85);padding:0 4px;border-radius:8px;'>${diff>0?'+':''}${formatNumberSmartUnit(diff)}</span>`;
                    }
                    rightHtml += `</li>`;
                });
                rightHtml += '</ul></div>';
            }
            panel.querySelector('#invHistoryRightCol').innerHTML = rightHtml;
            setPanelSize(); // 渲染后立即自适应
        }
        // 绑定"显示变动物品"按钮功能
        const showChangedBtn = document.getElementById('showChangedItemsBtn');
        let onlyShowChanged = false;
        showChangedBtn.onclick = function() {
            if(!lastCompareData) return;
            onlyShowChanged = !onlyShowChanged;
            renderCompareGroup(lastCompareData.group, lastCompareData.baseMap, lastCompareData.getKey, onlyShowChanged);
            showChangedBtn.textContent = onlyShowChanged ? '显示全部物品' : '显示变动物品';
        };
        // 绑定删除按钮功能
        panel.querySelectorAll('.invBtn2').forEach(btn => {
            btn.onclick = async function(e) {
                e.stopPropagation();
                const idx = parseInt(this.getAttribute('data-idx'));
                showMwiConfirm('确定要删除该条库存历史记录吗？', async function(ok){
                    if(!ok) return;
                    arr.splice(idx, 1);
                    await idbSet(key, JSON.stringify(arr));
                    showInventoryHistory();
                });
            }
        });
        // 绑定"记录当前库存"按钮功能
        document.getElementById('recordCurrentInventoryBtn').onclick = async function() {
            const items = await getInventoryItems();
            if(!items || items.length===0){
                showMwiTip('未检测到背包物品', false);
                return;
            }
            showMwiTip('已记录当前库存！', true);
            showInventoryHistory();
        };
        // 内部弹窗提示函数
        function showMwiTip(msg, success) {
            let tip = document.createElement('div');
            tip.style.position = 'fixed';
            tip.style.left = '50%';
            tip.style.top = '18%';
            tip.style.transform = 'translateX(-50%)';
            tip.style.background = 'rgba(60,60,60,0.85)';
            tip.style.color = '#fff';
            tip.style.fontSize = '18px';
            tip.style.padding = '18px 36px';
            tip.style.borderRadius = '10px';
            tip.style.zIndex = 100000;
            tip.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
            tip.style.textAlign = 'center';
            tip.textContent = msg;
            if(success) tip.style.border = '2px solid #28a745';
            else tip.style.border = '2px solid #d33';
            document.body.appendChild(tip);
            setTimeout(()=>{ tip.remove(); }, 1000);
        }

    }

    // 在"显示净资产记录"按钮左侧添加"显示库存记录"按钮
    function createShowInventoryHistoryButton() {
        const netBtn = document.getElementById('showNetWorthBtn');
        if (!netBtn || document.getElementById('showInventoryHistoryBtn')) return;
        // 按钮加载时保存一次库存
        getInventoryItems();
        const btn = document.createElement('button');
        btn.id = 'showInventoryHistoryBtn';
        btn.textContent = '显示库存记录';
        btn.style.marginRight = '8px';
        btn.style.background = 'rgb(69,71,113)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '4px 10px';
        btn.onclick = function() {
            getInventoryItems(); // 点击时保存一次库存
            showInventoryHistory();
        };
        netBtn.parentNode.insertBefore(btn, netBtn);
    }

    // 监听净资产按钮生成后插入库存按钮
    if (typeof observerInvBtn === 'undefined') {
        var observerInvBtn = new MutationObserver(() => {
            createShowInventoryHistoryButton();
        });
        observerInvBtn.observe(document.body, { childList: true, subtree: true });
    }

    // 已移除自动弹出设置面板的功能

    // Tampermonkey菜单始终注册"设置"按钮
    if (typeof GM_registerMenuCommand !== 'undefined') {
        setTimeout(() => {
            GM_registerMenuCommand('设置', showSettingPanel);
        }, 1000);
    }

    // 监听人数元素出现并有数字后，延迟3秒再执行相关操作（包括自动读取背包物品）
    let lastInitUrl = location.href;
    let playerCountInitObserver = null;
    function waitForPlayerCountAndInit() {
        if(playerCountInitObserver) playerCountInitObserver.disconnect();
        let inited = false;
        playerCountInitObserver = new MutationObserver(() => {
            const el = document.querySelector('div.Header_playerCount__1TDTK');
            if (el) {
                const number = parseInt(el.textContent.replace(/\D/g, ''), 10);
                if (!isNaN(number) && !inited) {
                    inited = true;
                    setTimeout(() => {
                        // 使用IndexedDB读取设置
                        (async () => {
                            if((await idbGet('mwiMonitorPlayer')) !== 'false') savePlayerNumber();
                            if((await idbGet('mwiMonitorNetWorth')) === 'true') saveNetWorth();
                        })();
                        // createShowButton(); // 删除自动调用
                        // createShowNetWorthButton(); // 删除自动调用
                        // getInventoryItems(); // 删除自动调用
                    }, 3000);
                    playerCountInitObserver.disconnect();
                }
            }
        });
        playerCountInitObserver.observe(document.body, { childList: true, subtree: true });
    }
    waitForPlayerCountAndInit();
    // 监听网址变化
    function onUrlChangeForPlayerCountInit() {
        if(location.href !== lastInitUrl) {
            lastInitUrl = location.href;
            waitForPlayerCountAndInit();
            waitForNetWorthAndShowBtns(); // 新增：切换账号后自动重建按钮
        }
    }
    window.addEventListener('popstate', onUrlChangeForPlayerCountInit);
    window.addEventListener('hashchange', onUrlChangeForPlayerCountInit);
    // 兼容部分SPA主动pushState
    let oldPushState = history.pushState;
    history.pushState = function() {
        oldPushState.apply(this, arguments);
        setTimeout(onUrlChangeForPlayerCountInit, 10);
    };

    // 在"显示净资产记录"按钮旁显示前一天结算净资产和当前差值
    async function showNetWorthDayCompare() {
        const btn = document.getElementById('showNetWorthBtn');
        if (!btn || document.getElementById('netWorthDayCompare')) return;
        const key = 'networth_' + getNetWorthKey();
        let arr = [];
        try {
            arr = JSON.parse(await idbGet(key) || '[]');
            if (!Array.isArray(arr)) arr = [];
        } catch(e) { arr = []; }
        if(arr.length < 2) return;
        const now = new Date();
        const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        const prevDayStart = today0 - 24 * 60 * 60 * 1000;
        const prevDayEnd = today0;
        const prevDayArr = arr.filter(item => {
            const t = new Date(item.time).getTime();
            return t >= prevDayStart && t < prevDayEnd && item.number;
        });
        if(prevDayArr.length === 0) return;
        // 按时间排序找到前一天的最后一条记录(结算值)
        const sortedPrevDayArr = [...prevDayArr].sort((a, b) => new Date(a.time) - new Date(b.time));
        const lastPrevDay = sortedPrevDayArr[sortedPrevDayArr.length - 1].number;
        // 读取当前净资产
        const el = document.querySelector('#toggleNetWorth');
        let currentNetWorth = 0;
        if (el) {
            const match = el.textContent.replace(/,/g, '').match(/([\d.]+)\s*([KMBT]?)/i);
            if (match) {
                currentNetWorth = parseFloat(match[1]);
                const unit = match[2]?.toUpperCase();
                if (unit === 'K') currentNetWorth *= 1e3;
                else if (unit === 'M') currentNetWorth *= 1e6;
                else if (unit === 'B') currentNetWorth *= 1e9;
                else if (unit === 'T') currentNetWorth *= 1e12;
            }
        }
        const diff = currentNetWorth - lastPrevDay;
        // 格式化
        const lastPrevDayStr = formatNumberToM(lastPrevDay);
        const diffStr = (diff>=0?'+':'') + formatNumberToM(diff);
        // 插入元素
        const span = document.createElement('span');
        span.id = 'netWorthDayCompare';
        span.style.marginLeft = '12px';
        span.style.fontSize = '13px';
        span.style.color = diff>=0 ? '#28a745' : '#d33';
        span.textContent = `前一天结算值：${lastPrevDayStr}  当前差值：${diffStr}`;
        btn.parentNode.insertBefore(span, btn.nextSibling);
    }

    // 在市场面板创建按钮1
    function createMarketButton1() {
        const target = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(2) > div > div.MarketplacePanel_buttonContainer__vJQud > button");
        if (!target || document.getElementById('marketButton1')) return;

        const btn = document.createElement('button');
        btn.id = 'marketButton1';
        btn.textContent = '挂单记录';
        btn.style.marginLeft = 'auto';
        btn.style.marginRight = '8px';
        btn.style.background = 'rgb(69,71,113)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '4px 10px';
        btn.style.fontSize = '14px';
        btn.onclick = function() {
            showTradeHistory();
        };

        target.parentNode.insertBefore(btn, target);
    }

    // 监听市场面板按钮容器出现
    if (typeof observerMarketBtn === 'undefined') {
        var observerMarketBtn = new MutationObserver(() => {
            createMarketButton1();
        });
        observerMarketBtn.observe(document.body, { childList: true, subtree: true });
    }

    // 监听市场交易按钮并记录交易信息
    function observeMarketTradeButton() {
        const tradeBtn = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7> div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.MarketplacePanel_modalContent__3YhCo > div.MarketplacePanel_postButtonContainer__3KOIO > button");
        if (!tradeBtn || tradeBtn.hasAttribute('data-mwi-trade-listener')) return;

        // 标记已添加监听器
        tradeBtn.setAttribute('data-mwi-trade-listener', 'true');

        tradeBtn.addEventListener('click', async function() {
            await recordTradeInfo();
        });
    }

    // 记录交易信息
    async function recordTradeInfo() {
        try {
            // 获取物品名称
            const itemIcon = document.querySelector("div.MarketplacePanel_itemContainer__2PwKY > div > div > div > div.Item_iconContainer__5z7j4 > svg");
            const itemName = itemIcon ? itemIcon.getAttribute('aria-label') : '未知物品';

            // 获取价格
            const priceInput = document.querySelector("div.MarketplacePanel_input__3h1Yt.MarketplacePanel_priceInput__1HWq2");
            const price = priceInput ? priceInput.textContent : '0';

            // 获取数量
            const quantityInput = document.querySelector("div.MarketplacePanel_input__3h1Yt > div > input");
            const quantity = quantityInput ? quantityInput.value : '0';

            // 获取交易类型
            const header = document.querySelector(" div.MarketplacePanel_header__yahJo");
            const tradeType = header ? header.textContent.trim() : '未知类型';

            // 当前时间
            const now = new Date().toISOString();

            // 构建交易记录
            const tradeRecord = {
                time: now,
                itemName: itemName,
                price: price,
                quantity: quantity,
                tradeType: tradeType
            };

            // 保存到IndexedDB
            const key = 'market_trades_' + getNetWorthKey();
            let trades = [];
            try {
                trades = JSON.parse(await idbGet(key) || '[]');
                if (!Array.isArray(trades)) trades = [];
            } catch(e) { trades = []; }

            trades.push(tradeRecord);
            // 只保留最新1000条记录
            // 移除交易记录上限限制
            // if(trades.length > 1000) trades = trades.slice(-1000);
            await idbSet(key, JSON.stringify(trades));

            console.log('交易记录已保存到IndexedDB:', tradeRecord);

        } catch(error) {
            console.error('记录交易信息时出错:', error);
        }
    }

    // 监听市场交易按钮出现
    if (typeof observerTradeBtn === 'undefined') {
        var observerTradeBtn = new MutationObserver(() => {
            observeMarketTradeButton();
        });
        observerTradeBtn.observe(document.body, { childList: true, subtree: true });
    }

    // 显示交易记录
    async function showTradeHistory() {
        const key = 'market_trades_' + getNetWorthKey();
        let trades = [];
        try {
            trades = JSON.parse(await idbGet(key) || '[]');
            if (!Array.isArray(trades)) trades = [];
        } catch(e) { trades = []; }

        // 按时间从新到旧排序交易记录
        trades.sort((a, b) => new Date(b.time) - new Date(a.time));

        // 生成HTML
        let html = '<div style="margin-bottom:12px;font-size:16px;font-weight:bold;color:#fff;">交易记录</div>';

        if(trades.length === 0) {
            html += '<div style="color:#ccc;text-align:center;padding:20px;">暂无交易记录</div>';
        } else {
            html += `<button id='clearAllTrades' style='color:red;margin-bottom:8px;background:none;border:none;cursor:pointer;'>全部清空</button><br/>`;
            html += '<div style="max-height:400px;overflow:auto;">';
            html += '<table style="width:100%;border-collapse:collapse;color:#fff;font-size:13px;">';
            html += '<thead><tr style="background:rgba(255,255,255,0.1);">';
            html += '<th style="padding:8px;text-align:left;border-bottom:1px solid #555;">时间</th>';
            html += '<th style="padding:8px;text-align:left;border-bottom:1px solid #555;">物品</th>';
            html += '<th style="padding:8px;text-align:left;border-bottom:1px solid #555;">价格</th>';
            html += '<th style="padding:8px;text-align:left;border-bottom:1px solid #555;">数量</th>';
            html += '<th style="padding:8px;text-align:left;border-bottom:1px solid #555;">类型</th>';
            html += '<th style="padding:8px;text-align:left;border-bottom:1px solid #555;">操作</th>';
            html += '</tr></thead><tbody>';

            trades.forEach((trade, idx) => {
                const time = new Date(trade.time).toLocaleString('zh-CN');
                const rowColor = idx % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)';
                html += `<tr style="background:${rowColor};">`;
                html += `<td style="padding:8px;border-bottom:1px solid #333;">${time}</td>`;
                html += `<td style="padding:8px;border-bottom:1px solid #333;">${trade.itemName}</td>`;
                html += `<td style="padding:8px;border-bottom:1px solid #333;">${trade.price}</td>`;
                html += `<td style="padding:8px;border-bottom:1px solid #333;">${trade.quantity}</td>`;
                html += `<td style="padding:8px;border-bottom:1px solid #333;">${trade.tradeType}</td>`;
                html += `<td style="padding:8px;border-bottom:1px solid #333;"><button data-idx='${idx}' class='delTradeBtn' style='color:red;background:none;border:none;cursor:pointer;font-size:12px;'>删除</button></td>`;
                html += '</tr>';
            });

            html += '</tbody></table></div>';
        }

        // 创建弹窗
        let exist = document.getElementById('tradeHistoryPopup');
        if (exist) exist.remove();

        const popup = document.createElement('div');
        popup.id = 'tradeHistoryPopup';
        popup.style.position = 'fixed';
        popup.style.top = '80px';
        popup.style.left = '40px';
        popup.style.background = 'rgb(69,71,113)';
        popup.style.border = '2px solid #888';
        popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
        popup.style.zIndex = 9999;
        popup.style.padding = '16px';
        popup.style.maxWidth = '800px';
        popup.style.maxHeight = '600px';
        popup.style.overflow = 'auto';
        popup.innerHTML = `<div style='text-align:right;margin-bottom:8px;'><button id='closeTradeHistoryPopup' style='background:rgb(69,71,113);color:#fff;border:none;border-radius:4px;padding:4px 10px;'>关闭</button></div>${html}`;

        document.body.appendChild(popup);

        // 关闭按钮
        document.getElementById('closeTradeHistoryPopup').onclick = function() {
            popup.remove();
        };

        // 单条删除
        popup.querySelectorAll('.delTradeBtn').forEach(btn => {
            btn.onclick = function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                showMwiConfirm('确定要删除这条交易记录吗？', async function(ok) {
                    if(!ok) return;
                    trades.splice(idx, 1);
                    await idbSet(key, JSON.stringify(trades));
                    showTradeHistory();
                });
            };
        });

        // 全部清空
        const clearAllBtn = popup.querySelector('#clearAllTrades');
        if(clearAllBtn) {
            clearAllBtn.onclick = function() {
                showMwiConfirm('确定要清空所有交易记录吗？', async function(ok) {
                    if(!ok) return;
                    await idbSet(key, '[]');
                    showTradeHistory();
                });
            };
        }
    }

    // 游戏内弹窗确认函数
    function showMwiConfirm(msg, callback) {
        let tip = document.createElement('div');
        tip.style.position = 'fixed';
        tip.style.left = '50%';
        tip.style.top = '22%';
        tip.style.transform = 'translateX(-50%)';
        tip.style.background = 'rgba(60,60,60,0.92)';
        tip.style.color = '#fff';
        tip.style.fontSize = '18px';
        tip.style.padding = '18px 36px';
        tip.style.borderRadius = '10px';
        tip.style.zIndex = 100000;
        tip.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
        tip.style.textAlign = 'center';
        tip.style.border = '2px solid #d33';
        tip.innerHTML = `<div style='margin-bottom:16px;'>${msg}</div><button id='mwiConfirmYes' style='background:#d33;color:#fff;border:none;border-radius:4px;padding:6px 22px;font-size:16px;cursor:pointer;margin-right:18px;'>删除</button><button id='mwiConfirmNo' style='background:#888;color:#fff;border:none;border-radius:4px;padding:6px 22px;font-size:16px;cursor:pointer;'>取消</button>`;
        document.body.appendChild(tip);
        document.getElementById('mwiConfirmYes').onclick = function(){
            tip.remove();
            callback(true);
        };
        document.getElementById('mwiConfirmNo').onclick = function(){
            tip.remove();
            callback(false);
        };
    }

    // 初始化相关localStorage替换
    (async function initMWISettings() {
        if (await idbGet('mwiMonitorPlayer') === null) {
            await idbSet('mwiMonitorPlayer', 'true');
        }
        if (await idbGet('mwiMonitorNetWorth') === null) {
            await idbSet('mwiMonitorNetWorth', 'true');
        }
        if (await idbGet('mwiShowOrderTotalValue') === null) {
            await idbSet('mwiShowOrderTotalValue', 'true');
        }
        // 在技能详情面板添加按钮
    function addButtonsToSkillActionDetail() {
        const target = document.querySelector('div.SkillActionDetail_notes__2je2F > div');
        if (!target || document.getElementById('mwiSkillButton1')) return;

        // 创建按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '12px';
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '8px';

        // 模拟输入的通用函数
        function simulateInput(value) {
            // 尝试多种选择器确保找到输入框
            let inputElement = document.querySelector('div.EnhancingPanel_skillActionDetailContainer__1pV1w > div > div > div.SkillActionDetail_inputs__2tnEq > div.SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl > div.SkillActionDetail_input__1G-kE > div > input');
            if (!inputElement) {
                inputElement = document.querySelector('input.SkillActionDetail_input__1G-kE');
            }
            if (!inputElement) return;

            // 激活输入框
            inputElement.focus();

            // 确保输入框被激活的延迟
            setTimeout(() => {
                // 先模拟用户按下删除键清除内容
                inputElement.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Delete',
                    code: 'Delete',
                    which: 46,
                    keyCode: 46,
                    bubbles: true,
                    cancelable: true
                }));
                inputElement.value = '';
                inputElement.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Delete',
                    code: 'Delete',
                    which: 46,
                    keyCode: 46,
                    bubbles: true,
                    cancelable: true
                }));
                // 触发输入事件以确认清空操作
                inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                inputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

                // 稍长延迟确保清空操作完成
                setTimeout(() => {
                    const valueStr = String(value);
                    // 根据位数选择不同的处理函数
                    if (valueStr.length > 1) {
                        handleMultiDigitInput(inputElement, valueStr);
                    } else {
                        handleSingleDigitInput(inputElement, valueStr);
                    }
                }, 100);
            }, 100);
        }

        // React输入触发工具函数
        function reactInputTriggerHack(inputElem, value) {
            let lastValue = inputElem.value;
            inputElem.value = value;
            let event = new Event("input", { bubbles: true });
            event.simulated = true;
            let tracker = inputElem._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            inputElem.dispatchEvent(event);
        }

        // 模拟输入值并触发React更新
        function simulateReactInput(inputElement, text) {
            // 先清空输入框
            const emptyValue = '';
            reactInputTriggerHack(inputElement, emptyValue);
            inputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

            // 延迟后设置实际值
            setTimeout(() => {
                reactInputTriggerHack(inputElement, text);
                inputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            }, 50);
        }

        // 处理单数字输入 (使用React触发方式)
        function handleSingleDigitInput(inputElement, digit) {
            setTimeout(() => {
                simulateReactInput(inputElement, digit);

                // 输入完成后直接模拟失去焦点事件
                setTimeout(() => {
                    inputElement.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
                }, 150); // 给输入操作一些时间完成
            }, 50);
        }

        // 处理多数字输入 (使用React触发方式)
        function handleMultiDigitInput(inputElement, value) {
            setTimeout(() => {
                simulateReactInput(inputElement, value);

                // 输入完成后直接模拟失去焦点事件
                setTimeout(() => {
                    inputElement.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
                }, 150); // 给输入操作一些时间完成
            }, 50);
        }

        // 创建按钮的通用函数
        function createButton(id, text, value) {
            const btn = document.createElement('button');
            btn.id = id;
            btn.textContent = text;
            btn.style.background = 'rgb(69,71,113)';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.padding = '4px 10px';
            btn.style.fontSize = '14px';
            btn.onclick = function() { simulateInput(value); };
            return btn;
        }

        // 按钮1
        const btn1 = createButton('mwiSkillButton1', '+5', 5);

        // 按钮2
        const btn2 = createButton('mwiSkillButton2', '+7', 7);

        // 按钮3
        const btn3 = createButton('mwiSkillButton3', '+10', 10);

        // 添加按钮到容器
        btnContainer.appendChild(btn1);
        btnContainer.appendChild(btn2);
        btnContainer.appendChild(btn3);

        // 添加容器到目标元素后
        target.parentNode.insertBefore(btnContainer, target.nextSibling);
    }

    // 监听技能详情面板出现
    if (typeof observerSkillActionDetail === 'undefined') {
        var observerSkillActionDetail = new MutationObserver(() => {
            addButtonsToSkillActionDetail();
        });
        observerSkillActionDetail.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化尝试添加按钮
    setTimeout(addButtonsToSkillActionDetail, 1000);


})();
})();