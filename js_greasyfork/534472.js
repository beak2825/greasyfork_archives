// ==UserScript==
// @name         批量打開 reddit 的 r/udemyfreeebies 連結（原生JS版）
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  使用原生 JS 批量打開連結，保存進度。原本的 vue 版會被 CSP 擋。
// @license      GPL-3.0
// @match        https://www.reddit.com/r/udemyfreeebies/*
// @grant        GM_registerMenuCommand
// @author       twozwu
// @downloadURL https://update.greasyfork.org/scripts/534472/%E6%89%B9%E9%87%8F%E6%89%93%E9%96%8B%20reddit%20%E7%9A%84%20rudemyfreeebies%20%E9%80%A3%E7%B5%90%EF%BC%88%E5%8E%9F%E7%94%9FJS%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534472/%E6%89%B9%E9%87%8F%E6%89%93%E9%96%8B%20reddit%20%E7%9A%84%20rudemyfreeebies%20%E9%80%A3%E7%B5%90%EF%BC%88%E5%8E%9F%E7%94%9FJS%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

let links = [];
let currentIndex = 0;
let perClick = parseInt(localStorage.getItem('defaultPerClick')) || 15;
let indexKey = parseInt(localStorage.getItem('indexKey')) || 0;
let controlVisible = false;
let statusText = '';

function createPanel() {
    if (document.getElementById('bulk-opener-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'bulk-opener-panel';
    panel.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #fff;
        border: 2px solid #ccc;
        border-radius: 12px;
        padding: 15px;
        z-index: 9999;
        font-family: sans-serif;
        width: 260px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    `;
    panel.innerHTML = `
        <h3 style="margin-top: 0;">🔗 批量開啟設定</h3>
        <div>
            <label>每批數量：
                <input type="number" id="perClickInput" value="${perClick}" min="1" style="width:4rem;">
            </label>
        </div>
        <div style="margin-top: 6px;">
            <label>從第
                <input type="number" id="indexKeyInput" value="${indexKey}" style="width:auto;">
                個開始
            </label>
            <small style="display:block;color:#666;">（預設為上次進度）</small>
        </div>
        <div style="margin-top:10px;">
            <button id="runBtn">🚀 開始</button>
            <button id="closeBtn" style="float:right;">❌</button>
        </div>
        <div id="controlDiv" style="margin-top:15px; display:none;">
            <p id="statusText">${statusText}</p>
            <button id="continueBtn">▶️ 繼續</button>
            <button id="stopBtn">🛑 停止</button>
        </div>
    `;
    document.body.appendChild(panel);

    // 綁定事件
    document.getElementById('closeBtn').addEventListener('click', () => {
        panel.remove();
    });

    document.getElementById('runBtn').addEventListener('click', runOpener);
    document.getElementById('continueBtn').addEventListener('click', openBatch);
    document.getElementById('stopBtn').addEventListener('click', stopBatch);
}

function gatherLinks() {
    links = [];
    document.querySelectorAll('.text-neutral-content ul li a').forEach(a => {
        if (a.href) links.push(a.href);
    });
    if (links.length === 0) {
        alert("⚠️ 找不到連結！");
    }
}

function updateStatus() {
    const controlDiv = document.getElementById('controlDiv');
    const statusP = document.getElementById('statusText');
    if (currentIndex >= links.length) {
        alert("✅ 所有連結已打開完畢！");
        controlDiv.style.display = 'none';
        indexKey = 0;
        localStorage.removeItem('indexKey');
    } else {
        statusP.textContent = `已打開 ${currentIndex} / ${links.length}，繼續下一批？`;
        controlDiv.style.display = 'block';
    }
}

function openBatch() {
    const perClickInput = document.getElementById('perClickInput');
    perClick = parseInt(perClickInput.value) || 15;

    const end = Math.min(currentIndex + perClick, links.length);
    for (let i = currentIndex; i < end; i++) {
        const win = window.open(links[i], "_blank", "noopener,noreferrer");
        if (win) {
            win.blur();
            window.focus();
        }
    }
    currentIndex = end;
    indexKey = end;
    localStorage.setItem('indexKey', end.toString());
    updateStatus();
}

function runOpener() {
    const perClickInput = document.getElementById('perClickInput');
    const indexKeyInput = document.getElementById('indexKeyInput');

    perClick = parseInt(perClickInput.value) || 15;
    indexKey = parseInt(indexKeyInput.value) || 0;

    localStorage.setItem('defaultPerClick', perClick.toString());
    currentIndex = indexKey;

    gatherLinks();
    controlVisible = true;
    openBatch();
}

function stopBatch() {
    alert("⏹️ 已停止，進度已保存");
}

// GM 菜單命令
GM_registerMenuCommand("📂 開啟連結設定面板", createPanel);
