// ==UserScript==
// @name         给哔哩哔哩（B站）添加一个智能悬浮按钮
// @namespace    RANRAN
// @version      1.0.5
// @description  适用于改善WEB端哔哩哔哩的“稍后再看”功能。添加一个指定BV号跳转按钮，可自定义按钮文字和颜色；可拖拽、记忆位置、边缘半隐藏；右键悬浮按钮打开设置面板，左键直接跳转，且视频页自动点击“跳转播放”。
// @author       Gemini
// @match        *://*.bilibili.com/*
// @exclude      *://player.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543824/%E7%BB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%99%BA%E8%83%BD%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/543824/%E7%BB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%99%BA%E8%83%BD%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 统一管理所有设置 ---
    const SETTINGS_KEY = 'custom_bilibili_button_settings_v6';
    const defaultSettings = {
        bv: '', text: 'BV', color: '#fb7299', autoJump: true,
        position: { top: '200px', left: '95%' }
    };
    let settings = Object.assign({}, defaultSettings, GM_getValue(SETTINGS_KEY, {}));

    // 1. 添加样式 (包含浅色和深色两套主题)
    GM_addStyle(`
        /* 悬浮按钮 (通用) */
        .bv-jumper-button {
            position: fixed; width: 50px; height: 50px; border-radius: 50%; display: flex;
            justify-content: center; align-items: center; font-size: 16px; font-weight: bold;
            cursor: pointer; z-index: 99998; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            user-select: none; transition: all 0.3s ease-in-out;
        }
        .bv-jumper-button:hover { opacity: 1 !important; transform: scale(1.05) !important; }

        /* --- 设置面板 浅色主题 (默认) --- */
        .settings-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);
            z-index: 100000; display: flex; justify-content: center; align-items: center;
        }
        .settings-panel {
            font-family: sans-serif; background: #fff; border-radius: 8px;
            padding: 20px 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .settings-panel h3 { margin-top: 0; margin-bottom: 20px; text-align: center; color: #212121; }
        .settings-panel .form-group { margin-bottom: 15px; }
        .settings-panel label { display: block; margin-bottom: 5px; font-size: 14px; color: #333; }
        .settings-panel input[type="text"] {
            width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #ccc;
            border-radius: 4px; font-size: 14px; background-color: #fff; color: #212121;
        }
        .settings-panel .color-group { display: flex; align-items: center; gap: 10px; }
        .settings-panel input[type="color"] { width: 50px; height: 35px; padding: 2px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; }
        .settings-panel .checkbox-group { display: flex; align-items: center; user-select: none; }
        .settings-panel .checkbox-group label { margin: 0 0 0 8px; cursor: pointer; }
        .settings-panel input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }
        .settings-panel .button-group { text-align: right; margin-top: 20px; }
        .settings-panel button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-left: 10px; transition: background-color 0.2s; }
        .settings-panel .save-btn { background-color: #00a1d6; color: white; }
        .settings-panel .save-btn:hover { background-color: #00b5e5; }
        .settings-panel .cancel-btn { background-color: #e7e7e7; color: #333; }
        .settings-panel .cancel-btn:hover { background-color: #ddd; }

        /* --- 设置面板 深色主题 (当 .dark 类存在时应用) --- */
        .dark .settings-panel { background: #2f2f2f; }
        .dark .settings-panel h3, .dark .settings-panel label { color: #e0e0e0; }
        .dark .settings-panel input[type="text"] {
            background-color: #222; color: #eee; border: 1px solid #555;
        }
        .dark .settings-panel .cancel-btn { background-color: #555; color: #eee; }
        .dark .settings-panel .cancel-btn:hover { background-color: #666; }
    `);

    // 2. 创建按钮并应用设置
    const jumpButton = document.createElement('div');
    jumpButton.className = 'bv-jumper-button';
    document.body.appendChild(jumpButton);
    function getContrastYIQ(hexcolor){ hexcolor = hexcolor.replace("#", ""); const r = parseInt(hexcolor.substr(0,2),16); const g = parseInt(hexcolor.substr(2,2),16); const b = parseInt(hexcolor.substr(4,2),16); const yiq = ((r*299)+(g*587)+(b*114))/1000; return (yiq >= 128) ? '#000000' : '#FFFFFF'; }
    function applySettings() { jumpButton.innerText = settings.text; jumpButton.style.backgroundColor = settings.color; jumpButton.style.color = getContrastYIQ(settings.color); jumpButton.style.top = settings.position.top; jumpButton.style.left = settings.position.left; updateButtonTitle(); }

    // --- 拖拽、吸附与位置记忆逻辑 (无改动) ---
    let isDragging = false, hasMoved = false, dragStartX, dragStartY;
    jumpButton.addEventListener('mousedown', (e) => { if (e.button !== 0) return; isDragging = true; hasMoved = false; jumpButton.style.opacity = '1'; jumpButton.style.transform = 'scale(1.05)'; jumpButton.style.transition = 'none'; const rect = jumpButton.getBoundingClientRect(); dragStartX = e.clientX - rect.left; dragStartY = e.clientY - rect.top; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); });
    function onMouseMove(e) { if (!isDragging) return; const newLeft = e.clientX - dragStartX; const newTop = e.clientY - dragStartY; if (!hasMoved && (Math.abs(newLeft - jumpButton.offsetLeft) > 5 || Math.abs(newTop - jumpButton.offsetTop) > 5)) { hasMoved = true; } jumpButton.style.left = `${newLeft}px`; jumpButton.style.top = `${newTop}px`; }
    function onMouseUp() { if (!isDragging) return; isDragging = false; jumpButton.style.transition = 'all 0.3s ease-in-out'; snapToEdge(true); document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }
    function snapToEdge(shouldSavePosition) { const rect = jumpButton.getBoundingClientRect(); const winWidth = window.innerWidth; const winHeight = window.innerHeight; let finalLeft = rect.left; let finalTop = rect.top; if (finalTop < 0) finalTop = 0; if (finalTop > winHeight - rect.height) finalTop = winHeight - rect.height; if (rect.left + rect.width / 2 < winWidth / 2) { finalLeft = 0; jumpButton.style.transform = `translateX(-50%)`; } else { finalLeft = winWidth - rect.width; jumpButton.style.transform = `translateX(50%)`; } jumpButton.style.opacity = '0.5'; jumpButton.style.top = `${finalTop}px`; jumpButton.style.left = `${finalLeft}px`; if (shouldSavePosition) { settings.position = { top: jumpButton.style.top, left: jumpButton.style.left }; GM_setValue(SETTINGS_KEY, settings); } }

    // --- 核心功能：跳转、右键设置 (无改动) ---
    jumpButton.addEventListener('click', (e) => { if (hasMoved) { e.stopPropagation(); return; } if (settings.bv) { window.open(`https://www.bilibili.com/video/${settings.bv}`, '_blank'); } else { showSettingsPanel(); } });
    jumpButton.addEventListener('contextmenu', (e) => { e.preventDefault(); showSettingsPanel(); });
    function updateButtonTitle() { jumpButton.title = settings.bv ? `左键跳转到: ${settings.bv}\n右键打开设置` : '还未设置BV号\n右键打开设置'; }

    // --- 设置面板功能 (核心修改点) ---
    function showSettingsPanel() {
        if (document.querySelector('.settings-modal-overlay')) return;
        const modalHTML = `
            <div class="settings-panel">
                <h3>悬浮按钮设置</h3>
                <div class="form-group"> <label for="setting-bv">跳转BV号:</label> <input type="text" id="setting-bv" placeholder="例如：BV1fb4y1d7iA"> </div>
                <div class="form-group color-group">
                    <div> <label for="setting-text">按钮文字:</label> <input type="text" id="setting-text" maxlength="3"> </div>
                    <div> <label for="setting-color">颜色:</label> <input type="color" id="setting-color"> </div>
                </div>
                <div class="form-group checkbox-group"> <input type="checkbox" id="setting-autojump"> <label for="setting-autojump">自动点击“跳转播放”</label> </div>
                <div class="button-group"> <button class="cancel-btn">取消</button> <button class="save-btn">保存</button> </div>
            </div>
        `;
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'settings-modal-overlay';

        // --- 核心修改：侦测并应用深色模式 ---
        if (document.body.hasAttribute('dark')) {
            modalOverlay.classList.add('dark');
        }

        modalOverlay.innerHTML = modalHTML;
        document.body.appendChild(modalOverlay);

        // 填充数据
        document.getElementById('setting-bv').value = settings.bv;
        document.getElementById('setting-text').value = settings.text;
        document.getElementById('setting-color').value = settings.color;
        document.getElementById('setting-autojump').checked = settings.autoJump;

        // 绑定事件
        const saveBtn = modalOverlay.querySelector('.save-btn');
        const cancelBtn = modalOverlay.querySelector('.cancel-btn');
        saveBtn.onclick = () => {
            settings.bv = document.getElementById('setting-bv').value.trim();
            settings.text = document.getElementById('setting-text').value.trim() || 'BV';
            settings.color = document.getElementById('setting-color').value;
            settings.autoJump = document.getElementById('setting-autojump').checked;
            GM_setValue(SETTINGS_KEY, settings);
            applySettings();
            document.body.removeChild(modalOverlay);
        };
        cancelBtn.onclick = () => document.body.removeChild(modalOverlay);
        modalOverlay.onclick = (e) => { if (e.target === modalOverlay) document.body.removeChild(modalOverlay); };
    }

    // --- 初始化和自动点击功能 ---
    applySettings();
    setTimeout(() => snapToEdge(false), 200);
    if (settings.autoJump && window.location.href.includes('/video/BV')) {
        const clickInterval = setInterval(() => {
            const jumpToPlayButton = document.evaluate("//span[contains(text(), '跳转播放')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (jumpToPlayButton) { jumpToPlayButton.click(); clearInterval(clickInterval); }
        }, 500);
        setTimeout(() => clearInterval(clickInterval), 15000);
    }
})();