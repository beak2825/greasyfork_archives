// ==UserScript==
// @name         Kemono自動複製mega&gdrive
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  自動複製mega&gdrive，需使用下載器下載
// @author       114514
// @match        https://kemono.su/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540713/Kemono%E8%87%AA%E5%8B%95%E8%A4%87%E8%A3%BDmegagdrive.user.js
// @updateURL https://update.greasyfork.org/scripts/540713/Kemono%E8%87%AA%E5%8B%95%E8%A4%87%E8%A3%BDmegagdrive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // —— 建立控制面板 ——
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: rgba(0,0,0,0.6); padding: 8px; border-radius: 6px;
        z-index: 9999; display: flex; flex-wrap: wrap; gap: 6px;
    `;
    document.body.appendChild(panel);

    // 按鈕產生器
    function makeBtn(label) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = `
            padding:4px 8px; cursor:pointer;
            background:#444; color:#fff;
            border:none; border-radius:4px;
        `;
        return btn;
    }

    // —— 面板按鈕 ——
    const btnStart = makeBtn('開始');
    const btnTime  = makeBtn('時間');
    panel.append(btnStart, btnTime);

    // 方向設定（加入 key 欄位）
    const directions = {
        left:  { label: '←', key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
        right: { label: '→', key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
        up:    { label: '↑', key: 'ArrowUp',    code: 'ArrowUp',    keyCode: 38 },
        down:  { label: '↓', key: 'ArrowDown',  code: 'ArrowDown',  keyCode: 40 },
    };
    let currentDir = 'left';
    const dirBtns = {};
    for (let dir in directions) {
        const b = makeBtn(directions[dir].label);
        b.dataset.dir = dir;
        b.addEventListener('click', () => setDirection(dir));
        panel.appendChild(b);
        dirBtns[dir] = b;
    }

    // 服務開關：MEGA / Drive
    let megaEnabled  = true;
    let driveEnabled = true;
    const btnMega = makeBtn('MEGA');
    const btnGD   = makeBtn('GD');
    btnMega.addEventListener('click', () => toggleService('mega'));
    btnGD  .addEventListener('click', () => toggleService('drive'));
    panel.append(btnMega, btnGD);

    // —— UI 更新 ——
    function updateDirUI() {
        for (let d in dirBtns) {
            dirBtns[d].style.background = (d === currentDir ? '#0a84ff' : '#444');
        }
    }
    function updateSvcUI() {
        btnMega.style.background = megaEnabled  ? '#0a84ff' : '#444';
        btnGD  .style.background = driveEnabled ? '#0a84ff' : '#444';
    }

    function setDirection(dir) {
        if (directions[dir]) {
            currentDir = dir;
            updateDirUI();
            console.log(`🔀 方向切換為：${directions[dir].label}`);
        }
    }
    function toggleService(svc) {
        if (svc === 'mega')  megaEnabled  = !megaEnabled;
        if (svc === 'drive') driveEnabled = !driveEnabled;
        updateSvcUI();
        console.log(`🔄 ${svc==='mega'?'MEGA':'Drive'} 自動複製：${(svc==='mega'?megaEnabled:driveEnabled) ? '啟用' : '停用'}`);
    }

    updateDirUI();
    updateSvcUI();

    // —— 核心功能 ——
    function sendArrow({ key, code, keyCode }) {
        const evt = new KeyboardEvent('keydown', {
            key, code, keyCode, which: keyCode, bubbles: true
        });
        document.dispatchEvent(evt);
    }

    function copyAllLinks(selector, label) {
        const nodes = document.querySelectorAll(selector);
        if (!nodes.length) return;
        const urls = Array.from(nodes)
            .map(a => a.href)
            .filter((u,i,arr) => arr.indexOf(u) === i);
        const text = urls.join('\n');
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
        } else {
            navigator.clipboard.writeText(text).catch(console.error);
        }
        console.log(`✅ 複製 ${label} ${urls.length} 筆`);
    }
    function copyAllMega()  { copyAllLinks('a[href*="mega.nz"][href*="#"]','MEGA'); }
    function copyAllDrive(){ copyAllLinks('a[href*="drive.google.com"]','Drive'); }

    // 自動週期：依服務開關與方向設定來執行
    let intervalMs = 5000, timerId = null;
    function tick() {
        if (megaEnabled)  copyAllMega();
        if (driveEnabled) copyAllDrive();
        sendArrow(directions[currentDir]);
    }

    // —— 綁定事件 ——
    btnStart.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            btnStart.textContent = '開始';
        } else {
            timerId = setInterval(tick, intervalMs);
            btnStart.textContent = '停止';
        }
    });
    btnTime.addEventListener('click', () => {
        const sec = parseFloat(prompt('請輸入間隔秒數（>0）：', (intervalMs/1000).toString()));
        if (!isNaN(sec) && sec > 0) {
            intervalMs = sec * 1000;
            if (timerId) {
                clearInterval(timerId);
                timerId = setInterval(tick, intervalMs);
            }
            alert(`已設定間隔：${sec} 秒`);
        } else {
            alert('輸入錯誤，請輸入大於0的數字');
        }
    });

})();
