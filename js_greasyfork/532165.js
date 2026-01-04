// ==UserScript==
// @name         B站精准跳转控制器Pro自动跳过片头片尾
// @namespace    bilibili
// @version      8.0.3
// @description  【终极完美版】跳过片头片尾+拖拽+隐藏
// @author       终极解决方案版
// @match        *://www.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532165/B%E7%AB%99%E7%B2%BE%E5%87%86%E8%B7%B3%E8%BD%AC%E6%8E%A7%E5%88%B6%E5%99%A8Pro%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532165/B%E7%AB%99%E7%B2%BE%E5%87%86%E8%B7%B3%E8%BD%AC%E6%8E%A7%E5%88%B6%E5%99%A8Pro%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE.meta.js
// ==/UserScript==

const DEFAULT_OP = GM_getValue('opTime', 90);
const DEFAULT_ED = GM_getValue('edTime', 45);

let isDragging = false;
let startX = 0, startY = 0;
let hideTimer = null;

GM_addStyle(`
    #bili-ctrl-panel {
        position: fixed;
        z-index: 2147483647;
        background: rgba(30,30,30,0.95);
        border-radius: 16px;
        padding: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        backdrop-filter: blur(12px);
        top: 20px;
        right: 20px;
        cursor: move;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 1;
        transform: translate(0, 0);
    }
    .ctrl-hidden {
        opacity: 0 !important;
        transform: translateY(20px) !important;
        pointer-events: none;
    }
    .ctrl-row {
        display: flex;
        gap: 10px;
        margin: 8px 0;
    }
    .ctrl-input {
        width: 80px;
        padding: 8px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 8px;
        color: #fff;
        text-align: center;
    }
    .ctrl-btn {
        background: linear-gradient(135deg, #00a1d6, #fb7299);
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: all 0.3s;
        flex: 1;
        white-space: nowrap;
    }
    .ctrl-btn:hover {
        opacity: 0.9;
        transform: scale(0.98);
    }
`);

function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'bili-ctrl-panel';
    panel.innerHTML = `
        <div class="ctrl-row">
            <input type="number" class="ctrl-input" id="op-input"
                   value="${DEFAULT_OP}" min="1" max="600">
            <button class="ctrl-btn" id="apply-op">跳过片头</button>
        </div>
        <div class="ctrl-row">
            <input type="number" class="ctrl-input" id="ed-input"
                   value="${DEFAULT_ED}" min="1" max="600">
            <button class="ctrl-btn" id="apply-ed">跳过片尾</button>
        </div>
        <button class="ctrl-btn" id="hide-panel" style="margin-top:12px;">暂时隐藏</button>
    `;
    return panel;
}

function setupDrag(panel) {
    panel.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input')) return;
        isDragging = true;
        startX = e.clientX - panel.offsetLeft;
        startY = e.clientY - panel.offsetTop;
        panel.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX - startX;
        const y = e.clientY - startY;

        panel.style.left = `${Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x))}px`;
        panel.style.top = `${Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y))}px`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        panel.style.transition = 'all 0.5s';
    });
}

function main() {
    const panel = createControlPanel();
    document.body.appendChild(panel);
    setupDrag(panel);

    // 隐藏功能
    panel.querySelector('#hide-panel').addEventListener('click', () => {
        clearTimeout(hideTimer);
        panel.classList.add('ctrl-hidden');
        hideTimer = setTimeout(() => {
            panel.classList.remove('ctrl-hidden');
        }, 5000);
    });

    // 配置保存功能
    panel.querySelector('#apply-op').addEventListener('click', () => {
        const value = parseInt(panel.querySelector('#op-input').value);
        if (!isNaN(value)) GM_setValue('opTime', value);
    });
    panel.querySelector('#apply-ed').addEventListener('click', () => {
        const value = parseInt(panel.querySelector('#ed-input').value);
        if (!isNaN(value)) GM_setValue('edTime', value);
    });

    // 核心跳转逻辑
    setInterval(() => {
        const video = document.querySelector('video');
        if (video?.readyState > 2) {
            const opTime = GM_getValue('opTime', 90);
            const edTime = GM_getValue('edTime', 45);

            if (video.currentTime < opTime) video.currentTime = opTime;
            if (video.duration - video.currentTime < edTime) video.currentTime = video.duration - 1;
        }
    }, 1500);
}

// 安全初始化
if (document.readyState === 'complete') {
    main();
} else {
    window.addEventListener('load', main);
}