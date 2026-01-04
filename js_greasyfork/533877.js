// ==UserScript==
// @name         必应首页自定义背景图片
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  在首页添加配置按钮, 配置首页样式
// @author       Ctory-Nily
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/
// @match        https://cn.bing.com/
// @exclude      https://www.bing.com/search*
// @exclude      https://cn.bing.com/search*
// @exclude      https://www.bing.com/account*
// @exclude      https://cn.bing.com/account*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/533877/%E5%BF%85%E5%BA%94%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/533877/%E5%BF%85%E5%BA%94%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // 配置存储
    const CONFIG_KEY = 'bingBackgroundConfig';
    const POSITION_KEY = 'bingButtonPosition';
    const BG_IMAGE_KEY = 'bingCustomBackground'; // localStorage中的背景图片key

    // 默认配置
    const defaultConfig = {
        removehpTriviaOuter: true,
        removemusCard: true,
        removeVsDefault: true,
        removeFooter: true,
        theme: 'system'
    };

    // 默认按钮位置
    const defaultPosition = {
        left: '10px',
        top: 'auto',
        bottom: '10px',
        right: 'auto'
    };

    // 获取当前配置
    function getConfig() {
        const saved = GM_getValue(CONFIG_KEY, JSON.stringify(defaultConfig));
        return JSON.parse(saved);
    }

    // 获取按钮位置
    function getButtonPosition() {
        const saved = GM_getValue(POSITION_KEY, JSON.stringify(defaultPosition));
        return JSON.parse(saved);
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
        applyThemeConfig(config);
        applyConfig(config);
    }

    // 保存按钮位置
    function saveButtonPosition(position) {
        GM_setValue(POSITION_KEY, JSON.stringify(position));
    }

    // 获取背景图片
    function getBackgroundImage() {
        return localStorage.getItem(BG_IMAGE_KEY) || '';
    }

    // 保存背景图片
    function saveBackgroundImage(imageUrl) {
        if (imageUrl) {
            localStorage.setItem(BG_IMAGE_KEY, imageUrl);
        } else {
            localStorage.removeItem(BG_IMAGE_KEY);
        }
    }

    // 应用配置
    function applyThemeConfig(config) {
        applyTheme(config.theme);
    }

    function applyConfig(config) {
        // applyTheme(config.theme);

        const bgImage = getBackgroundImage();
        const imgCont = document.querySelector('.img_cont');
        const hpTopCover = document.querySelector('.hp_top_cover');

        if (bgImage) {
            if (imgCont) imgCont.style.backgroundImage = `url("${bgImage}")`;
            if (hpTopCover) hpTopCover.style.backgroundImage = `url("${bgImage}")`;
        }

        if (config.removehpTriviaOuter) {
            const musCard = document.querySelector('.musCard');
            if (musCard) musCard.remove();
        }

        if (config.removemusCard) {
            const hpTriviaOuter = document.querySelector('.hp_trivia_inner');
            if (hpTriviaOuter) hpTriviaOuter.remove();
        }

        if (config.removeVsDefault) {
            const vsDefault = document.getElementById('vs_default');
            if (vsDefault) vsDefault.remove();
        }

        if (config.removeFooter) {
            const footer = document.getElementById('footer');
            if (footer) footer.remove();
        }

        updateScrollContStyle(config.removemusCard);
    }

    // 应用主题
    function applyTheme(theme) {
        const root = document.documentElement;
        root.classList.remove('bing-theme-light', 'bing-theme-dark');

        let effectiveTheme = theme;
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (effectiveTheme === 'dark') {
            root.classList.add('bing-theme-dark');
        } else {
            root.classList.add('bing-theme-light');
        }
    }

    // 更新scroll_cont样式
    function updateScrollContStyle(removemusCard) {
        const scrollCont = document.getElementById('scroll_cont');
        if (scrollCont) {
            scrollCont.style.marginTop = removemusCard ? '47px' : '';
        }
    }

    // 添加CSS样式
    GM_addStyle(`
        :root.bing-theme-light {
            --bing-primary-color: #0078d4;
            --bing-bg-color: #ffffff;
            --bing-text-color: #000000;
            --bing-panel-bg: rgba(255, 255, 255, 0.95);
            --bing-panel-text: #333333;
            --bing-btn-hover: rgba(0, 0, 0, 0.1);
        }

        :root.bing-theme-dark {
            --bing-primary-color: #0078d4;
            --bing-bg-color: #1e1e1e;
            --bing-text-color: #ffffff;
            --bing-panel-bg: rgba(30, 30, 30, 0.95);
            --bing-panel-text: #ffffff;
            --bing-btn-hover: rgba(255, 255, 255, 0.1);
        }

        .bing-settings-btn {
            position: fixed;
            z-index: 99999;
            width: 40px;
            height: 40px;
            background: var(--bing-primary-color);
            border: none;
            border-radius: 50%;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            touch-action: none;
            user-select: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .bing-settings-btn:hover {
            background: #565656;
            transform: scale(1.1);
        }

        .bing-settings-btn.dragging {
            opacity: 0.8;
            transform: scale(1.1);
            cursor: grabbing;
        }

        .bing-settings-btn.panel-open {
            cursor: default;
        }

        .bing-settings-icon {
            width: 24px;
            height: 24px;
            color: white;
            pointer-events: none;
        }

        .bing-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100001;
            width: 80%;
            max-width: 400px;
            max-height: 90vh;
            overflow-y: auto;
            background: var(--bing-panel-bg);
            border-radius: 8px;
            padding: 15px;
            font-size: 14px;
            color: var(--bing-panel-text);
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            display: none;
            backdrop-filter: blur(10px);
        }

        .bing-settings-panel h3 {
            margin: 0 0 20px 0;
            font-size: 18px;
            text-align: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .bing-settings-section {
            margin-bottom: 20px;
        }

        .bing-settings-section h4 {
            margin: 0 0 10px 0;
            font-size: 15px;
        }

        .bing-settings-option {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }

        .bing-settings-option label {
            cursor: pointer;
        }

        .bing-settings-option input[type="checkbox"],
        .bing-settings-option select {
            margin-right: 10px;
        }
        .bing-settings-option button {
            padding: 5px;
        }

        .bing-settings-btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .bing-settings-btn-group button {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }

        .bing-settings-btn-primary {
            background: var(--bing-primary-color);
            color: white;
        }

        .bing-settings-btn-primary:hover {
            background: #106ebe;
        }

        .bing-settings-btn-secondary {
            background: var(--bing-btn-hover);
            color: var(--bing-panel-text);
        }

        .bing-settings-btn-secondary:hover {
            background: rgba(0, 0, 0, 0.2);
        }

        #bingBgFileInput {
            display: none;
        }

        .bing-theme-selector {
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            background: var(--bing-panel-bg);
            color: var(--bing-panel-text);
            font-size: 14px;
            width: 100%;
        }

        .bing-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 100000;
            display: none;
        }

        /* 添加这些样式到你的GM_addStyle部分 */
        .bing-settings-row {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .bing-settings-row h4 {
            margin: 0;
            min-width: 80px; /* 给标题固定宽度保持对齐 */
        }

        .bing-theme-selector {
            flex: 1;
        }

        .bing-button-group {
            display: flex;
            gap: 10px;
            flex: 1;
        }

        .bing-settings-btn-secondary {
            flex: 1;
            white-space: nowrap;
        }

        .bing-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            margin-right: 10px;
            vertical-align: middle;
        }

        .bing-switch input {
            display: none;
        }

        .bing-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }

        .bing-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .bing-slider {
            background-color: #0078d4 !important;
        }

        input:checked + .bing-slider:before {
            transform: translateX(26px);
        }

        /* 暗色主题适配 */
        :root.bing-theme-dark .bing-slider {
            background-color: #555;
        }

        /* 调整选项布局 */
        .bing-settings-option {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }

        /* 主题切换按钮样式 */
        .bing-theme-toggle {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--bing-panel-text);
        }

        .bing-theme-toggle svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .bing-theme-toggle:hover {
            opacity: 0.8;
        }

        .bing-title-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* 响应式调整 */
        @media (max-width: 600px) {
            .bing-settings-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .bing-setting-mobile-row {
                flex-direction: row !important;
                align-items: center;
            }

            .bing-settings-row h4 {
                min-width: auto;
            }

            .bing-button-group {
                width: 100%;
                flex-direction: column;
            }

            .bing-theme-selector,
            .bing-settings-btn-secondary {
                width: 100%;
                line-height: 30px;
            }
        }

        /* 添加媒体查询 */
        @media (max-width: 480px) {
            .bing-settings-panel {
                width: 80%;
                max-height: 80vh;
                padding: 10px;
            }

            .bing-settings-btn-group {
                flex-direction: column;
            }

            .bing-settings-btn-group button {
                width: 100%;
            }

            .bing-settings-section h4 {
                font-size: 14px;
            }

            .bing-settings-btn {
                width: 35px;
                height: 35px;
                inset: 350px auto auto 30px;
            }

            .bing-settings-icon {
                width: 30px;
                height: 30px;
            }
        }
    `);

    // 提示窗口
    function showSaveSuccess(message = "保存成功", duration = 1000) {
        const div = document.createElement("div");
        div.innerHTML = `✔ ${message}`;
        div.style.position = "fixed";
        div.style.top = "20%"; // 改为从顶部20%开始
        div.style.left = "50%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.zIndex = "9999";
        div.style.backgroundColor = "#4caf50";
        div.style.color = "white";
        div.style.padding = "12px 24px"; // 减小内边距
        div.style.borderRadius = "6px";
        div.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
        div.style.fontSize = "16px"; // 减小字体大小
        div.style.fontWeight = "bold";
        div.style.opacity = "1";
        div.style.transition = "opacity 0.5s ease-out";
        div.style.maxWidth = "80%"; // 限制最大宽度
        div.style.textAlign = "center";
        div.style.wordBreak = "break-word"; // 允许换行

        document.body.appendChild(div);

        setTimeout(() => {
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 500);
        }, duration);
    }

    // 创建设置按钮
    function createSettingsButton() {
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'bing-settings-btn';
        settingsBtn.title = 'Bing 背景配置';
        settingsBtn.innerHTML = `
            <svg class="bing-settings-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;

        const position = getButtonPosition();
        Object.keys(position).forEach(key => {
            if (position[key] !== 'auto') {
                settingsBtn.style[key] = position[key];
            }
        });

        document.body.appendChild(settingsBtn);
        return settingsBtn;
    }

    // 设置拖动功能
    function setupDrag(element) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX, startY;
        let lastX = 0, lastY = 0;
        let velocityX = 0, velocityY = 0;
        let animationFrame;
        let allowDrag = true;

        // 添加事件监听
        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            // 如果是触摸事件且有多点触控，则不处理
            if (e.touches && e.touches.length > 1) return;

            if (!allowDrag) return;

            // 记录点击位置
            const rect = element.getBoundingClientRect();
            const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            startX = clientX;
            startY = clientY;
            lastX = clientX;
            lastY = clientY;

            // 停止任何现有的惯性动画
            cancelAnimationFrame(animationFrame);
            velocityX = 0;
            velocityY = 0;

            // 开始拖动
            isDragging = true;
            element.classList.add('dragging');
            element.style.transition = 'none'; // 禁用过渡效果
            document.body.style.userSelect = 'none'; // 防止选中文本

            // 添加事件监听
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            // 如果是触摸事件且有多点触控，则不处理
            if (e.touches && e.touches.length > 1) return;

            if (!isDragging) return;
            e.preventDefault();

            // 获取当前位置
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

            // 计算速度（用于惯性效果）
            velocityX = clientX - lastX;
            velocityY = clientY - lastY;
            lastX = clientX;
            lastY = clientY;

            // 计算新位置
            let x = clientX - offsetX;
            let y = clientY - offsetY;

            // 边界约束
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            // 应用新位置
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        }

        function stopDrag(e) {
            if (!isDragging) return;

            // 清除拖动状态
            isDragging = false;
            element.classList.remove('dragging');
            document.body.style.userSelect = '';

            // 移除事件监听
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);

            // 检查是否是点击而非拖动
            const clientX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
            const clientY = e.type === 'mouseup' ? e.clientY : e.changedTouches[0].clientY;

            const movedX = Math.abs(clientX - startX);
            const movedY = Math.abs(clientY - startY);

            if (movedX < 5 && movedY < 5) {
                element.dispatchEvent(new MouseEvent('click'));
                return;
            }

            // 保存新位置
            const newPosition = {
                left: element.style.left,
                top: element.style.top,
                bottom: element.style.bottom,
                right: element.style.right
            };
            saveButtonPosition(newPosition);

            // 惯性效果
            const animate = () => {
                if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
                    element.style.transition = ''; // 恢复过渡效果
                    return;
                }

                let x = parseFloat(element.style.left) + velocityX;
                let y = parseFloat(element.style.top) + velocityY;

                // 边界约束
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));

                // 检查是否到达边界
                if (x <= 0 || x >= maxX) velocityX = 0;
                if (y <= 0 || y >= maxY) velocityY = 0;

                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                element.style.bottom = 'auto';
                element.style.right = 'auto';

                velocityX *= 0.95; // 摩擦力
                velocityY *= 0.95;

                animationFrame = requestAnimationFrame(animate);
            };

            animationFrame = requestAnimationFrame(animate);
        }

        // 公开方法以控制拖动
        return {
            setAllowDrag: (value) => {
                allowDrag = value;
                if (!value) {
                    element.classList.remove('dragging');
                    isDragging = false;
                }
            }
        };
    }

    // 创建设置面板
    function createSettingsPanel() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'bing-modal-overlay';

        // 创建面板
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'bing-settings-panel';
        settingsPanel.innerHTML = `
            <h3>
                <button class="bing-theme-toggle" id="bingThemeToggle" title="切换主题">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>
                <span>Bing 背景配置</span>
            </h3>

            <div class="bing-settings-section">
                <div class="bing-settings-row">
                    <h4>背景配置</h4>
                    <div class="bing-button-group">
                        <button id="bingUploadBgBtn" class="bing-settings-btn-secondary">上传背景</button>
                        <button id="bingResetBgBtn" class="bing-settings-btn-secondary">重置背景</button>
                    </div>
                </div>
            </div>

            <div class="bing-settings-section">
                <h4>元素配置</h4>
                <div class="bing-settings-option">
                    <label class="bing-switch">
                        <input type="checkbox" id="bingremovehpTriviaOuter">
                        <span class="bing-slider"></span>
                    </label>
                    <label for="bingremovehpTriviaOuter">移除问答卡片</label>
                </div>
                <div class="bing-settings-option">
                    <label class="bing-switch">
                        <input type="checkbox" id="bingremovemusCard">
                        <span class="bing-slider"></span>
                    </label>
                    <label for="bingremovemusCard">移除切换图片按钮</label>
                </div>
                <div class="bing-settings-option">
                    <label class="bing-switch">
                        <input type="checkbox" id="bingremoveVsDefault">
                        <span class="bing-slider"></span>
                    </label>
                    <label for="bingremoveVsDefault">移除设为主页按钮部分</label>
                </div>
                <div class="bing-settings-option">
                    <label class="bing-switch">
                        <input type="checkbox" id="bingremoveFooter">
                        <span class="bing-slider"></span>
                    </label>
                    <label for="bingremoveFooter">移除页脚</label>
                </div>
            </div>

            <div class="bing-settings-btn-group">
                <button id="bingSaveConfigBtn" class="bing-settings-btn-primary">保存配置</button>
                <button id="bingExportConfigBtn" class="bing-settings-btn-secondary">导出配置</button>
                <button id="bingImportConfigBtn" class="bing-settings-btn-secondary">导入配置</button>
                <button id="bingResetConfigBtn" class="bing-settings-btn-secondary">重置配置</button>
            </div>
        `;

        // 将面板添加到遮罩层
        overlay.appendChild(settingsPanel);
        document.body.appendChild(overlay);

        return {
            panel: settingsPanel,
            overlay: overlay
        };
    }

    // 初始化脚本
    async function init() {

        // 添加视口meta标签
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
            document.head.appendChild(meta);
        }

        // 等待页面加载完成
        await waitForPageLoad();

        // 创建UI元素
        const settingsBtn = createSettingsButton();
        const { panel: settingsPanel, overlay: modalOverlay } = createSettingsPanel();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'bingBgFileInput';
        fileInput.accept = 'image/*';
        document.body.appendChild(fileInput);

        // 设置拖动功能
        const dragController = setupDrag(settingsBtn);

        // 加载配置
        const currentConfig = getConfig();

        // 初始化UI状态
        document.getElementById('bingremovehpTriviaOuter').checked = currentConfig.removehpTriviaOuter;
        document.getElementById('bingremovemusCard').checked = currentConfig.removemusCard;
        document.getElementById('bingremoveVsDefault').checked = currentConfig.removeVsDefault;
        document.getElementById('bingremoveFooter').checked = currentConfig.removeFooter;

        // 应用配置
        applyThemeConfig(currentConfig);
        applyConfig(currentConfig);

        // 事件监听
        settingsBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'block';
            settingsPanel.style.display = 'block';
            settingsBtn.classList.add('panel-open');
            dragController.setAllowDrag(false);
        });

        // ESC键关闭面板
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.style.display === 'block') {
                closePanel();
            }
        });

        function closePanel() {
            modalOverlay.style.display = 'none';
            settingsPanel.style.display = 'none';
            settingsBtn.classList.remove('panel-open');
            dragController.setAllowDrag(true);
        }

        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closePanel();
            }
        });

        // 主题切换按钮功能
        const themeToggle = document.getElementById('bingThemeToggle');
        themeToggle.addEventListener('click', function() {
            const currentTheme = getConfig().theme;
            let newTheme;

            if (currentTheme === 'system') {
                newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
            } else {
                newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            }

            // 更新配置
            const config = getConfig();
            config.theme = newTheme;
            saveConfig(config);

            // 更新图标
            updateThemeToggleIcon(newTheme);
            applyTheme(newTheme);
        });

        // 更新主题切换图标
        function updateThemeToggleIcon(theme) {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            themeToggle.innerHTML = isDark ?
                `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>` :
                `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
        }

        // 初始化主题切换图标
        updateThemeToggleIcon(currentConfig.theme);

        document.getElementById('bingUploadBgBtn').addEventListener('click', function(e) {
            e.stopPropagation();

            // 在手机上，使用accept属性限制文件类型
            fileInput.accept = 'image/jpeg,image/png,image/webp';
            fileInput.capture = 'environment'; // 允许直接拍照上传

            fileInput.click();
        });

        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];

                // 可以保留一个初步的文件大小检查
                if (file.size > 5 * 1024 * 1024) { // 比如原始文件不超过5MB
                    alert('图片文件过大，请选择5MB以下的图片。脚本将尝试压缩。');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 2560; // 最大宽度
                        const MAX_HEIGHT = 1440; // 最大高度
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // 尝试使用 image/jpeg 或 image/webp 进行压缩
                        let compressedDataUrl = canvas.toDataURL('image/jpeg', 0.95); // 0.75 是压缩质量
                        console.log('Original size (approx Base64):', event.target.result.length);
                        console.log('Compressed size:', compressedDataUrl.length);

                        // 检查压缩后的大小是否仍然太大 (可选，但推荐)
                        // data:URL 长度大约是字节数的 4/3
                        if (compressedDataUrl.length > 3.5 * 1024 * 1024 * 4/3) { // 估算压缩后localStorage占用约3.5MB
                            alert('图片压缩后仍然过大，请尝试更小的图片或更高压缩率。');
                            // 可以尝试更低的质量或提示用户
                            // compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                            // if (compressedDataUrl.length > ...) return;
                            return;
                        }


                        try {

                            document.cookie = 'SRCHD=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
                            document.cookie = 'SRCHUID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
                            document.cookie = 'SRCHUSR=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';

                            saveBackgroundImage(compressedDataUrl); // 保存压缩后的图片
                            applyThemeConfig(getConfig());
                            applyConfig(getConfig());
                            showSaveSuccess('上传成功');
                        } catch (quotaError) {
                            if (quotaError.name === 'QuotaExceededError') {
                                alert('存储空间不足！即使压缩后图片仍然过大，请尝试更小的图片，或清理浏览器缓存后重试。');
                                // 考虑在这里提供清理旧背景的选项
                                // localStorage.removeItem(BG_IMAGE_KEY);
                            } else {
                                alert('发生未知错误: ' + quotaError.message);
                            }
                        } finally {
                            closePanel(); // 确保面板关闭
                        }
                    }
                    img.onerror = function() {
                        alert('无法加载图片文件。');
                        closePanel();
                    }
                    img.src = event.target.result; // 先将原始 FileReader 結果给 Image 对象
                }
                reader.onerror = function() {
                    alert('读取文件失败。');
                    closePanel();
                }
                reader.readAsDataURL(file); // 读取原始文件为 data URL
                this.value = ''; // 清空 file input
            }
        });

        document.getElementById('bingResetBgBtn').addEventListener('click', function() {
            if (confirm('确定要重置背景图片吗？')) {
                saveBackgroundImage('');
                applyThemeConfig(getConfig());
                applyConfig(getConfig());

                document.cookie = 'SRCHD=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
                document.cookie = 'SRCHUID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
                document.cookie = 'SRCHUSR=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';

                location.reload();
            }
        });

        document.getElementById('bingSaveConfigBtn').addEventListener('click', function() {
            const config = getConfig();
            config.removehpTriviaOuter = document.getElementById('bingremovehpTriviaOuter').checked;
            config.removemusCard = document.getElementById('bingremovemusCard').checked;
            config.removeVsDefault = document.getElementById('bingremoveVsDefault').checked;
            config.removeFooter = document.getElementById('bingremoveFooter').checked;
            saveConfig(config);
            closePanel();

            location.reload();
        });

        document.getElementById('bingExportConfigBtn').addEventListener('click', function() {
            const config = getConfig();
            const configStr = JSON.stringify(config);
            const blob = new Blob([configStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'bing_background_config.json';
            a.click();

            URL.revokeObjectURL(url);
        });

        document.getElementById('bingImportConfigBtn').addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = event => {
                    try {
                        const config = JSON.parse(event.target.result);
                        saveConfig(config);

                        location.reload();
                    } catch (err) {
                        alert('配置文件无效');
                    }
                };

                reader.readAsText(file);
            };

            input.click();
        });

        document.getElementById('bingResetConfigBtn').addEventListener('click', function() {
            if (confirm('确定要重置所有设置为默认值吗？')) {
                saveConfig(defaultConfig);
                saveBackgroundImage('');

                document.cookie = 'SRCHD=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
                document.cookie = 'SRCHUID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';
                document.cookie = 'SRCHUSR=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.bing.com';

                location.reload();
            }
        });

        // 永久监听并移除不需要的元素
        const observer = new MutationObserver(function() {
            const config = getConfig();
            // 监听并移除切换按钮
            if (config.removemusCard) {
                const musCard = document.querySelector('.musCard');
                if (musCard) musCard.remove();
            }

            // 监听并移除问答卡片
            if (config.removehpTriviaOuter) {
                const hpTriviaOuter = document.querySelector('.hp_trivia_inner_new');
                if (hpTriviaOuter) hpTriviaOuter.remove();
            }

            // 监听并移除搜索框下方按钮
            if (config.removeVsDefault) {
                const vsDefault = document.getElementById('vs_default');
                if (vsDefault) vsDefault.remove();
            }

            // 监听并移除页脚
            if (config.removeFooter) {
                const footer = document.getElementById('footer');
                if (footer) footer.remove();
            }

            // 重载配置
            applyConfig(currentConfig);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    init();
})();