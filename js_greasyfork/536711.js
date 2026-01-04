// ==UserScript==
// @name         自动点击菜单
// @namespace    http://tampermonkey.net/
// @version      1.47.2
// @description  自动点击菜单，支持按ID、类名、文本、位置自动点击，可设定执行次数
// @author       YuoHira
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js
// @downloadURL https://update.greasyfork.org/scripts/536711/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/536711/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

// --- css.js ---
const AUTO_CLICK_MENU_CSS = `
    /* ====== 主题变量 ====== */
    :root {
        --macaron-blue1: #7ecfff; /* 马卡龙主蓝 */
        --macaron-blue2: #aee2ff; /* 马卡龙浅蓝 */
        --macaron-bg: #fafdff;    /* 背景淡蓝 */
        --macaron-border: #e0e6ed;/* 边框灰蓝 */
        --macaron-text: #2d3a4a;  /* 主要字体色 */
        --macaron-shadow: 0 4px 24px 0 rgba(126,207,255,0.18); /* 柔和阴影 */
    }

    /* ====== 菜单主容器 ====== */
    .yuohira-container {
        /* 渐变淡蓝背景，圆角，柔和阴影 */
        background: linear-gradient(135deg, #eaf6ff 0%, #fafdff 100%);
        border: none;
        border-radius: 16px;
        padding: 22px 24px 18px 24px;
        box-shadow: var(--macaron-shadow);
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 320px;
        max-width: 95vw;
        transition: box-shadow 0.2s, transform 0.15s;
    }
    .yuohira-container:hover {
        box-shadow: 0 8px 32px 0 rgba(126,207,255,0.28);
        transform: scale(1.015);
    }

    /* ====== 菜单标题 ====== */
    .yuohira-title {
        color: var(--macaron-blue1);
        font-family: 'Segoe UI', 'PingFang SC', 'Arial', sans-serif;
        font-size: 21px;
        font-weight: bold;
        margin-bottom: 18px;
        letter-spacing: 1px;
    }

    /* ====== 通用按钮 ====== */
    .yuohira-button {
        /* 渐变蓝背景，圆角，阴影，动效 */
        background: linear-gradient(90deg, var(--macaron-blue1) 0%, var(--macaron-blue2) 100%);
        border: none;
        color: #fff;
        border-radius: 9px;
        padding: 8px 22px;
        cursor: pointer;
        font-size: 16px;
        margin: 7px 10px;
        font-weight: 500;
        box-shadow: 0 2px 8px 0 rgba(126,207,255,0.13);
        transition: background 0.2s, color 0.2s, filter 0.2s, transform 0.13s;
        outline: none;
    }
    .yuohira-button:hover {
        filter: brightness(1.09);
        transform: scale(1.06);
    }
    .yuohira-button:active {
        filter: brightness(0.98);
        transform: scale(0.96);
    }

    /* ====== 右上角小圆球（菜单开关） ====== */
    .yuohira-toggle-button {
        background: linear-gradient(135deg, var(--macaron-blue1) 60%, var(--macaron-blue2) 100%);
        border: none;
        color: #fff;
        border-radius: 50%;
        padding: 0;
        cursor: pointer;
        font-size: 20px;
        width: 38px;
        height: 38px;
        position: fixed;
        top: 18px;
        right: 18px;
        z-index: 10001;
        opacity: 0.85;
        box-shadow: 0 2px 8px 0 rgba(126,207,255,0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s, background 0.2s, transform 0.13s;
    }
    .yuohira-toggle-button:hover {
        opacity: 1;
        transform: scale(1.12);
    }
    .yuohira-toggle-button:active {
        transform: scale(0.92);
    }

    /* ====== 输入框和下拉框 ====== */
    .yuohira-input {
        /* 渐变淡蓝背景，圆角，阴影，动效 */
        border: 1.5px solid var(--macaron-blue1);
        border-radius: 8px;
        padding: 7px 12px;
        margin: 7px 10px;
        background: linear-gradient(90deg, #fafdff 60%, #eaf6ff 100%);
        color: var(--macaron-text);
        font-size: 15px;
        outline: none;
        box-shadow: 0 1.5px 6px 0 rgba(126,207,255,0.13);
        transition: border 0.2s, box-shadow 0.2s, transform 0.13s;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        position: relative;
    }
    .yuohira-input:focus, .yuohira-input:hover {
        /* 深蓝高亮描边，阴影增强，缩放 */
        border-color: #3fa6e8;
        box-shadow: 0 3px 14px 0 rgba(126,207,255,0.22);
        transform: scale(1.045);
    }
    /* 下拉框专属美化，自定义蓝色箭头 */
    select.yuohira-input {
        background: #fff url('data:image/svg+xml;utf8,<svg fill="%237ecfff" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"/></svg>') no-repeat right 10px center/18px 18px;
        padding-right: 36px;
        cursor: pointer;
        min-width: 80px;
    }
    select.yuohira-input::-ms-expand {
        display: none;
    }

    /* ====== 输入项整体包裹 ====== */
    .yuohira-input-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        position: relative;
        padding-bottom: 18px;
        background: none;
        border-radius: 0;
    }

    /* ====== 进度条 ====== */
    .yuohira-progress-bar {
        height: 5px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(90deg, var(--macaron-blue1), var(--macaron-blue2));
        border-radius: 2.5px;
        transition: width 0.3s;
    }

    /* ====== 警告提示 ====== */
    .yuohira-warning {
        color: #3fa6e8;
        font-size: 12px;
        position: absolute;
        left: 0;
        bottom: -13px;
        width: 100%;
        text-align: left;
        z-index: 2;
        pointer-events: none;
        font-weight: 500;
    }

    /* ====== 屏幕取点遮罩 ====== */
    .yuohira-crosshair-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 99999;
        pointer-events: auto;
        background: rgba(126,207,255, 0.08);
    }
    .yuohira-crosshair-line {
        position: absolute;
        background: var(--macaron-blue2);
        z-index: 999999;
    }
    .yuohira-crosshair-label {
        position: absolute;
        background: var(--macaron-blue1);
        color: #fff;
        font-size: 13px;
        padding: 3px 8px;
        border-radius: 4px;
        z-index: 999999;
        pointer-events: none;
        transform: translateY(-150%);
        font-weight: 500;
    }
`;

(function(){

// --- AutoClickMenu.js ---
// == 自动点击菜单主控类 ==
// 负责菜单的创建、样式注入、数据持久化、菜单项管理、自动点击主循环、动画、窗口拖动与位置保存等
class AutoClickMenu {
    /**
     * 构造函数，初始化主流程
     * - 记录当前页面URL
     * - 读取自动点击开关状态
     * - 初始化菜单项列表
     * - 启动初始化流程
     */
    constructor() {
        this.currentUrl = window.location.origin; // 当前页面域名，用于数据隔离
        this.autoClickEnabled = GM_getValue(`${this.currentUrl}_autoClickEnabled`, false); // 自动点击开关
        this.lastUpdateTime = new Map(); // 记录每个菜单项的上次点击时间
        this.menuItems = []; // 菜单项对象列表
        this.init();
    }

    /**
     * 初始化主流程，页面加载后执行
     * - 注入样式
     * - 创建菜单容器和小圆球
     * - 恢复上次保存的位置
     * - 添加各类按钮和输入区
     * - 加载本地保存的菜单项
     * - 启动自动点击主循环
     */
    init() {
        window.onload = () => {
            this.createStyles(); // 注入样式
            this.menuContainer = this.createMenuContainer(); // 创建菜单主容器
            this.toggleButton = new ToggleButton(this).createElement(); // 创建右上角小圆球
            document.body.appendChild(this.menuContainer);
            document.body.appendChild(this.toggleButton);
            // 恢复上次保存的位置（如有）
            const savedPos = GM_getValue('yuohira_menu_position', null);
            if (savedPos && typeof savedPos.top === 'number' && typeof savedPos.right === 'number') {
                this.menuContainer.style.top = savedPos.top + 'px';
                this.menuContainer.style.right = savedPos.right + 'px';
                this.toggleButton.style.top = savedPos.top + 'px';
                this.toggleButton.style.right = savedPos.right + 'px';
            }
            this.addMenuTitle(this.menuContainer); // 添加标题
            // 保存按钮，保存菜单项和位置
            this.saveButton = this.addButton(this.menuContainer, '保存', 'yuohira-button', (e) => {
                e.stopPropagation();
                this.saveData();
                // 保存当前位置
                const top = parseInt(this.menuContainer.style.top) || 10;
                const right = parseInt(this.menuContainer.style.right) || 10;
                GM_setValue('yuohira_menu_position', { top, right });
            });
            // 重置位置按钮
            this.resetButton = this.addButton(this.menuContainer, '重置位置', 'yuohira-button', (e) => {
                e.stopPropagation();
                this.menuContainer.style.top = '10px';
                this.menuContainer.style.right = '10px';
                this.toggleButton.style.top = '10px';
                this.toggleButton.style.right = '10px';
            });
            // 新增菜单项按钮
            this.addButtonElement = this.addButton(this.menuContainer, '+', 'yuohira-button', (e) => {
                e.stopPropagation();
                this.addInputField();
            });
            // 自动点击开关按钮
            this.toggleAutoClickButton = this.addButton(this.menuContainer, this.autoClickEnabled ? '暂停' : '开始', 'yuohira-button', (e) => {
                e.stopPropagation();
                this.autoClickEnabled = !this.autoClickEnabled;
                this.toggleAutoClickButton.innerText = this.autoClickEnabled ? '暂停' : '开始';
                GM_setValue(`${this.currentUrl}_autoClickEnabled`, this.autoClickEnabled);
            });
            // 输入区容器
            this.inputContainer = document.createElement('div');
            this.menuContainer.appendChild(this.inputContainer);
            this.loadSavedData(); // 加载本地保存的菜单项
            this.applyAutoClick(); // 启动自动点击主循环
        };
    }

    /**
     * 注入样式到页面
     */
    createStyles() {
        const style = document.createElement('style');
        style.innerHTML = AUTO_CLICK_MENU_CSS;
        document.head.appendChild(style);
    }

    /**
     * 创建菜单主容器
     * @returns {HTMLDivElement} 菜单容器元素
     */
    createMenuContainer() {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'yuohira-container';
        menuContainer.style.position = 'fixed';
        menuContainer.style.top = '10px';
        menuContainer.style.right = '10px';
        menuContainer.style.zIndex = '10000';
        menuContainer.style.display = 'none';
        menuContainer.style.opacity = '0';
        menuContainer.style.transform = 'translateY(-20px)';
        document.body.appendChild(menuContainer);
        // 阻止冒泡，防止误触页面其它元素
        menuContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        return menuContainer;
    }

    /**
     * 添加菜单标题
     * @param {HTMLElement} container 目标容器
     */
    addMenuTitle(container) {
        const menuTitle = document.createElement('h3');
        menuTitle.innerText = '自动点击菜单';
        menuTitle.className = 'yuohira-title';
        container.appendChild(menuTitle);
    }

    /**
     * 添加按钮
     * @param {HTMLElement} container 按钮父容器
     * @param {string} text 按钮文本
     * @param {string} className 按钮样式类
     * @param {function} onClick 点击回调
     * @returns {HTMLButtonElement}
     */
    addButton(container, text, className, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.className = className;
        button.addEventListener('click', onClick);
        container.appendChild(button);
        return button;
    }

    /**
     * 加载本地保存的菜单项配置
     */
    loadSavedData() {
        const savedData = GM_getValue(this.currentUrl, []);
        savedData.forEach(item => {
            this.addInputField(item.type, item.value, item.enabled, item.interval, item.count);
        });
    }

    /**
     * 保存当前菜单项配置到本地
     */
    saveData() {
        const data = this.menuItems.map(item => item.getData());
        GM_setValue(this.currentUrl, data);
    }

    /**
     * 新增一个菜单项输入区
     * @param {string} type 目标类型
     * @param {string} value 目标值
     * @param {boolean} enabled 是否启用
     * @param {number} interval 间隔
     * @param {number} count 执行次数
     */
    addInputField(type = 'id', value = '', enabled = false, interval = 1000, count = -1) {
        const menuItem = new MenuItem(type, value, enabled, interval, this, count);
        this.menuItems.push(menuItem);
        this.inputContainer.appendChild(menuItem.createElement());
    }

    /**
     * 自动点击主循环，定时遍历所有启用的菜单项并执行点击
     */
    applyAutoClick() {
        const autoClick = () => {
            if (this.autoClickEnabled && this.menuItems.some(item => item.isEnabled())) {
                const currentTime = Date.now();
                this.menuItems.forEach(item => item.autoClick(currentTime, this.lastUpdateTime));
            }
            requestAnimationFrame(autoClick);
        };
        requestAnimationFrame(autoClick);
    }

    /**
     * 展开菜单，带动画
     */
    showMenu() {
        if (!this.menuContainer) return;
        this.menuContainer.style.display = 'block';
        this.menuContainer.style.overflow = 'hidden';
        // 先测量内容高度
        this.menuContainer.style.maxHeight = 'none';
        const fullHeight = this.menuContainer.scrollHeight;
        this.menuContainer.style.maxHeight = '0px';
        anime({
            targets: this.menuContainer,
            opacity: [0, 1],
            translateY: [-20, 0],
            maxHeight: [0, fullHeight],
            duration: 450,
            easing: 'easeOutCubic',
            update: anim => {
                // 防止高度动画卡住
                this.menuContainer.style.maxHeight = this.menuContainer.style.maxHeight;
            },
            complete: () => {
                this.menuContainer.style.opacity = '1';
                this.menuContainer.style.transform = 'translateY(0)';
                this.menuContainer.style.maxHeight = 'none';
                this.menuContainer.style.overflow = '';
            }
        });
    }

    /**
     * 收起菜单，带动画
     */
    hideMenu() {
        if (!this.menuContainer) return;
        const fullHeight = this.menuContainer.scrollHeight;
        this.menuContainer.style.overflow = 'hidden';
        this.menuContainer.style.maxHeight = fullHeight + 'px';
        anime({
            targets: this.menuContainer,
            opacity: [1, 0],
            translateY: [0, -20],
            maxHeight: [fullHeight, 0],
            duration: 350,
            easing: 'easeInCubic',
            complete: () => {
                this.menuContainer.style.display = 'none';
                this.menuContainer.style.opacity = '0';
                this.menuContainer.style.transform = 'translateY(-20px)';
                this.menuContainer.style.maxHeight = '0px';
                this.menuContainer.style.overflow = '';
            }
        });
    }
}

// --- MenuItem.js ---
// == 菜单项配置类（MenuItem）==
// 负责单个自动点击目标的输入、启用、间隔、次数、进度、选取等功能
class MenuItem {
    /**
     * 构造函数
     * @param {string} type 目标类型（id/class/text/position）
     * @param {string} value 目标值
     * @param {boolean} enabled 是否启用
     * @param {number} interval 间隔时间
     * @param {AutoClickMenu} menu 主菜单实例
     * @param {number} count 执行次数，-1为无限
     */
    constructor(type, value, enabled, interval, menu, count = -1) {
        this.type = type;
        this.value = value;
        this.enabled = enabled;
        this.interval = interval;
        this.menu = menu;
        this.count = (typeof count === "number" ? count : -1);
    }

    /**
     * 创建菜单项输入区 DOM 元素，包含类型选择、目标输入、启用/暂停、间隔、次数、进度、警告、删除等
     * @returns {HTMLDivElement}
     */
    createElement() {
        const MIN_INTERVAL = 1;
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'yuohira-input-wrapper';

        // 下拉选择目标类型
        this.select = document.createElement('select');
        const optionId = document.createElement('option');
        optionId.value = 'id';
        optionId.innerText = 'ID';
        const optionClass = document.createElement('option');
        optionClass.value = 'class';
        optionClass.innerText = '类名';
        const optionText = document.createElement('option');
        optionText.value = 'text';
        optionText.innerText = '文本';
        const optionPosition = document.createElement('option');
        optionPosition.value = 'position';
        optionPosition.innerText = '位置';
        this.select.appendChild(optionId);
        this.select.appendChild(optionClass);
        this.select.appendChild(optionText);
        this.select.appendChild(optionPosition);
        this.select.value = this.type;
        this.select.className = 'yuohira-input';
        inputWrapper.appendChild(this.select);

        // 目标输入框
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.value = this.value;
        this.input.className = 'yuohira-input';
        this.input.placeholder = 'ID/类名/文本/坐标';
        inputWrapper.appendChild(this.input);

        // 选取按钮（支持屏幕取点/元素高亮）
        this.selectButton = document.createElement('button');
        this.selectButton.innerText = '选取';
        this.selectButton.className = 'yuohira-button';
        this.selectButton.addEventListener('click', (e) => this.selectElement(e));
        inputWrapper.appendChild(this.selectButton);

        // 类型切换时，动态调整输入提示和按钮状态
        this.select.addEventListener('change', () => {
            if (this.select.value === 'text') {
                this.selectButton.disabled = true;
                this.selectButton.style.backgroundColor = '#d3d3d3';
                this.selectButton.style.borderColor = '#a9a9a9';
                this.input.placeholder = '请输入文本';
            } else if (this.select.value === 'position') {
                this.selectButton.disabled = false;
                this.selectButton.style.backgroundColor = '';
                this.selectButton.style.borderColor = '';
                this.input.placeholder = '点击"选取"后屏幕定位';
            } else {
                this.selectButton.disabled = false;
                this.selectButton.style.backgroundColor = '';
                this.selectButton.style.borderColor = '';
                this.input.placeholder = '请输入ID/类名';
            }
        });

        // 初始禁用选取按钮（文本模式）
        if (this.type === 'text') {
            this.selectButton.disabled = true;
            this.selectButton.style.backgroundColor = '#d3d3d3';
            this.selectButton.style.borderColor = '#a9a9a9';
        }

        // 启用/暂停按钮
        this.toggleInputClickButton = document.createElement('button');
        this.toggleInputClickButton.className = 'yuohira-button toggle-input-click-button';
        this.toggleInputClickButton.innerText = this.enabled ? '暂停' : '开始';
        this.toggleInputClickButton.setAttribute('data-enabled', this.enabled);
        this.toggleInputClickButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isEnabled = this.toggleInputClickButton.innerText === '开始';
            this.toggleInputClickButton.innerText = isEnabled ? '暂停' : '开始';
            this.toggleInputClickButton.setAttribute('data-enabled', isEnabled);
            this.warningMsg && (this.warningMsg.style.display = 'none');
        });
        inputWrapper.appendChild(this.toggleInputClickButton);

        // 间隔输入区
        const intervalWrapper = document.createElement('div');
        intervalWrapper.style.position = 'relative';
        intervalWrapper.style.display = 'inline-block';
        intervalWrapper.style.width = '100px';
        intervalWrapper.style.padding = '0px 140px 0px 0px';

        this.intervalInput = document.createElement('input');
        this.intervalInput.type = 'number';
        this.intervalInput.value = this.interval;
        this.intervalInput.className = 'yuohira-input';
        this.intervalInput.placeholder = '间隔';
        this.intervalInput.style.paddingRight = '10px';
        this.intervalInput.style.width = '100px';
        this.intervalInput.min = MIN_INTERVAL;
        this.intervalInput.addEventListener('input', () => {
            let val = parseInt(this.intervalInput.value, 10) || 0;
            if (val < MIN_INTERVAL) {
                val = MIN_INTERVAL;
                this.intervalInput.value = MIN_INTERVAL;
            }
            this.interval = val;
        });
        intervalWrapper.appendChild(this.intervalInput);

        // 间隔单位
        const intervalSuffix = document.createElement('span');
        intervalSuffix.innerText = 'ms';
        intervalSuffix.style.color = '#0099cc';
        intervalSuffix.style.position = 'absolute';
        intervalSuffix.style.right = '2px';
        intervalSuffix.style.top = '50%';
        intervalSuffix.style.transform = 'translateY(-50%)';
        intervalSuffix.style.pointerEvents = 'none';
        intervalSuffix.style.zIndex = '1';
        intervalWrapper.appendChild(intervalSuffix);

        inputWrapper.appendChild(intervalWrapper);

        // ==== 新增：执行次数输入框 ====
        this.countInput = document.createElement('input');
        this.countInput.type = 'number';
        this.countInput.value = this.count;
        this.countInput.className = 'yuohira-input';
        this.countInput.style.width = '60px';
        this.countInput.style.marginLeft = '8px';
        this.countInput.placeholder = '-1为无限';
        this.countInput.title = '执行次数，-1为无限';
        this.countInput.addEventListener('input', () => {
            let val = parseInt(this.countInput.value, 10);
            if (isNaN(val)) val = -1;
            this.count = val;
        });
        inputWrapper.appendChild(this.countInput);

        // 次数单位
        const countLabel = document.createElement('span');
        countLabel.innerText = '次';
        countLabel.style.color = '#0099cc';
        countLabel.style.marginLeft = '2px';
        inputWrapper.appendChild(countLabel);
        // ==== 新增结束 ====

        // 进度条
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'yuohira-progress-bar';
        inputWrapper.appendChild(this.progressBar);

        // 警告信息
        this.warningMsg = document.createElement('div');
        this.warningMsg.className = 'yuohira-warning';
        this.warningMsg.style.display = 'none';
        inputWrapper.appendChild(this.warningMsg);

        // 删除按钮
        const removeButton = document.createElement('button');
        removeButton.innerText = '-';
        removeButton.className = 'yuohira-button';
        removeButton.addEventListener('click', () => {
            inputWrapper.remove();
            this.menu.menuItems = this.menu.menuItems.filter(item => item !== this);
        });
        inputWrapper.appendChild(removeButton);

        return inputWrapper;
    }

    /**
     * 选取目标元素或屏幕坐标
     * @param {Event} event
     */
    selectElement(event) {
        event.stopPropagation();
        if (this.select.value === 'position') {
            // 显示全屏十字准星
            this.showCrosshairSelector();
            return;
        }
        document.body.style.cursor = 'crosshair';
        this.selectButton.disabled = true;

        // 悬浮提示框
        const hoverBox = document.createElement('div');
        hoverBox.style.position = 'fixed';
        hoverBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        hoverBox.style.color = 'white';
        hoverBox.style.padding = '5px';
        hoverBox.style.borderRadius = '5px';
        hoverBox.style.pointerEvents = 'none';
        hoverBox.style.zIndex = '10002';
        document.body.appendChild(hoverBox);

        // 鼠标移动时高亮元素并显示提示
        const mouseMoveHandler = (e) => {
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            elements.forEach((el) => {
                el.style.outline = '2px solid red';
            });
            document.addEventListener('mouseout', () => {
                elements.forEach((el) => {
                    el.style.outline = '';
                });
            });

            hoverBox.style.left = `${e.clientX + 10}px`;
            hoverBox.style.top = `${e.clientY + 10}px`;
            if (this.select.value === 'id' && elements[0].id) {
                hoverBox.innerText = `ID: ${elements[0].id}`;
            } else if (this.select.value === 'class' && elements[0].className) {
                hoverBox.innerText = `Class: ${elements[0].className}`;
            } else {
                hoverBox.innerText = '无ID或类名';
            }
        };

        // 点击选中目标
        const clickHandler = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const selectedElement = e.target;
            if (this.select.value === 'id' && selectedElement.id) {
                this.input.value = selectedElement.id;
            } else if (this.select.value === 'class' && selectedElement.className) {
                this.input.value = selectedElement.className;
            }
            document.body.style.cursor = 'default';
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('click', clickHandler, true);
            this.selectButton.disabled = false;
            document.body.removeChild(hoverBox);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('click', clickHandler, true);
    }

    /**
     * 屏幕取点模式，显示全屏遮罩和十字准星，点击后写入坐标
     */
    showCrosshairSelector() {
        // 创建全屏遮罩和十字准星
        const overlay = document.createElement('div');
        overlay.className = 'yuohira-crosshair-overlay';

        // 横线
        const hLine = document.createElement('div');
        hLine.className = 'yuohira-crosshair-line';
        hLine.style.height = '1px';
        hLine.style.width = '100vw';
        hLine.style.top = '50%';
        hLine.style.left = '0';
        hLine.style.background = '#e74c3c';

        // 竖线
        const vLine = document.createElement('div');
        vLine.className = 'yuohira-crosshair-line';
        vLine.style.width = '1px';
        vLine.style.height = '100vh';
        vLine.style.left = '50%';
        vLine.style.top = '0';
        vLine.style.background = '#e74c3c';

        // 坐标显示
        const label = document.createElement('div');
        label.className = 'yuohira-crosshair-label';
        label.innerText = '点击以选取位置';
        label.style.left = '50%';
        label.style.top = '50%';

        overlay.appendChild(hLine);
        overlay.appendChild(vLine);
        overlay.appendChild(label);
        document.body.appendChild(overlay);

        // 鼠标移动时更新准星位置和坐标
        const moveHandler = (e) => {
            hLine.style.top = `${e.clientY}px`;
            vLine.style.left = `${e.clientX}px`;
            label.style.left = `${e.clientX + 10}px`;
            label.style.top = `${e.clientY + 10}px`;
            label.innerText = `X: ${e.clientX}, Y: ${e.clientY}`;
        };

        overlay.addEventListener('mousemove', moveHandler);

        // 点击写入坐标
        const clickHandler = (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.input.value = `${e.clientX},${e.clientY}`;
            document.body.removeChild(overlay);
            overlay.removeEventListener('mousemove', moveHandler);
            overlay.removeEventListener('click', clickHandler);
        };
        overlay.addEventListener('click', clickHandler);
    }

    /**
     * 根据文本查找页面元素
     * @param {string} text
     * @returns {Element[]}
     */
    findElementsByText(text) {
        const elements = document.querySelectorAll('*');
        const matchingElements = [];
        elements.forEach(element => {
            if (element.textContent.trim() === text) {
                matchingElements.push(element);
            }
        });
        return matchingElements;
    }

    /**
     * 获取当前菜单项的所有配置数据
     * @returns {Object}
     */
    getData() {
        return {
            type: this.select.value,
            value: this.input.value,
            enabled: this.toggleInputClickButton.getAttribute('data-enabled') === 'true',
            interval: parseInt(this.intervalInput.value, 10),
            count: parseInt(this.countInput.value, 10)
        };
    }

    /**
     * 判断当前菜单项是否启用
     * @returns {boolean}
     */
    isEnabled() {
        return this.toggleInputClickButton.getAttribute('data-enabled') === 'true';
    }

    /**
     * 模拟鼠标点击目标元素
     * @param {Element} element
     */
    simulateMouseClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y };

        element.dispatchEvent(new PointerEvent('pointerdown', opts));
        element.dispatchEvent(new MouseEvent('mousedown', opts));
        element.dispatchEvent(new PointerEvent('pointerup', opts));
        element.dispatchEvent(new MouseEvent('mouseup', opts));
        element.dispatchEvent(new MouseEvent('click', opts));
    }

    /**
     * 自动点击主逻辑，定时查找目标并点击，支持次数、进度、异常提示
     * @param {number} currentTime 当前时间戳
     * @param {Map} lastUpdateTime 上次更新时间Map
     */
    autoClick(currentTime, lastUpdateTime) {
        if (typeof this.count !== 'number') this.count = -1;
        if (this.count === 0) return;
        if (!this.isEnabled()) return;

        const lastTime = lastUpdateTime.get(this) || 0;
        const elapsedTime = currentTime - lastTime;

        if (elapsedTime >= this.interval) {
            let elements = [];
            let inputVal = (this.input.value || '').trim();
            let clicked = false;
            if (this.select.value === 'id') {
                if (inputVal) {
                    elements = Array.from(document.querySelectorAll(`#${CSS.escape(inputVal)}`));
                }
            } else if (this.select.value === 'class') {
                if (inputVal) {
                    elements = Array.from(document.getElementsByClassName(inputVal));
                }
            } else if (this.select.value === 'text') {
                if (inputVal) {
                    elements = this.findElementsByText(inputVal);
                }
            } else if (this.select.value === 'position') {
                const pos = inputVal.split(',');
                if (pos.length === 2) {
                    const x = parseInt(pos[0].trim(), 10);
                    const y = parseInt(pos[1].trim(), 10);
                    if (!isNaN(x) && !isNaN(y)) {
                        const el = document.elementFromPoint(x, y);

                        if (el && !this.menu.menuContainer.contains(el)) {
                            elements = [el];
                        }
                    }
                }
            }

            if (this.select.value !== 'position') {
                elements.forEach(element => {
                    if (!this.menu.menuContainer.contains(element)) {
                        this.simulateMouseClick(element);
                        clicked = true;
                    }
                });
            } else if (elements.length > 0) {
                this.simulateMouseClick(elements[0]);
                clicked = true;
            }

            // 点击成功后减少次数
            if (clicked && this.count > 0) {
                this.count--;
                this.countInput.value = this.count;
            }

            // 异常提示处理
            if (this.select.value !== 'position') {
                if (inputVal && elements.length === 0) {
                    this.warningMsg.innerText = '未找到目标元素';
                    this.warningMsg.style.display = 'block';
                } else {
                    this.warningMsg.style.display = 'none';
                }
            } else {
                this.warningMsg.style.display = 'none';
            }
            this.progressBar.style.width = '100%';
            lastUpdateTime.set(this, currentTime);
        } else {
            let percent = (1 - elapsedTime / this.interval) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            this.progressBar.style.width = `${percent}%`;
        }
    }
}

// --- ToggleButton.js ---
// == 菜单右上角小圆球（ToggleButton）==
// 负责菜单的显示/隐藏切换、拖动窗口、动效等
class ToggleButton {
    /**
     * 构造函数
     * @param {AutoClickMenu} menu 主菜单实例
     */
    constructor(menu) {
        this.menu = menu;
    }

    /**
     * 创建小圆球 DOM 元素，并绑定点击/拖动等事件
     * @returns {HTMLButtonElement}
     */
    createElement() {
        const toggleButton = document.createElement('button');
        toggleButton.innerText = '>';
        toggleButton.className = 'yuohira-toggle-button';
        // 固定定位，初始位置与菜单一致
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = this.menu.menuContainer.style.top || '10px';
        toggleButton.style.right = this.menu.menuContainer.style.right || '10px';
        toggleButton.style.zIndex = '10001';
        toggleButton.style.width = '15px';
        toggleButton.style.height = '15px';
        toggleButton.style.fontSize = '10px';
        toggleButton.style.textAlign = 'center';
        toggleButton.style.lineHeight = '15px';
        toggleButton.style.padding = '0';
        toggleButton.style.boxSizing = 'border-box';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';

        document.body.appendChild(toggleButton);

        // 点击切换菜单显隐，带缩放动画
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // 按钮缩放动画（anime.js，更丝滑）
            anime.remove(toggleButton);
            anime({
                targets: toggleButton,
                scale: [1, 1.18, 0.95, 1],
                duration: 320,
                easing: 'easeInOutCubic'
            });
            if (this.menu.menuContainer.style.display === 'none') {
                this.menu.showMenu();
                toggleButton.innerText = '<';
            } else {
                this.menu.hideMenu();
                toggleButton.innerText = '>';
            }
        });

        // 拖动功能：按住小圆球可拖动菜单和小圆球整体
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let offsetToCenterX = 0, offsetToCenterY = 0;
        let startTop = 0, startRight = 0;
        const btnRect = () => toggleButton.getBoundingClientRect();
        toggleButton.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // 只响应左键
            isDragging = true;
            document.body.style.userSelect = 'none';
            toggleButton.style.cursor = 'move';
            this.menu.menuContainer.style.transition = 'none';
            toggleButton.style.transition = 'none';
            // 记录鼠标到小圆球中心的偏移
            const rect = btnRect();
            offsetToCenterX = e.clientX - (rect.left + rect.width / 2);
            offsetToCenterY = e.clientY - (rect.top + rect.height / 2);
            // 记录当前 top/right
            startTop = rect.top;
            startRight = window.innerWidth - rect.right;
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            // 让小圆球中心跟随鼠标
            let newCenterX = e.clientX - offsetToCenterX;
            let newCenterY = e.clientY - offsetToCenterY;
            // 计算新 top/right
            let btnWidth = btnRect().width;
            let btnHeight = btnRect().height;
            let newTop = newCenterY - btnHeight / 2;
            let newRight = window.innerWidth - (newCenterX + btnWidth / 2);
            // 限制范围：上下左右都要有 10px 间距
            const minTop = 10;
            const minRight = 10;
            const maxTop = window.innerHeight - this.menu.menuContainer.offsetHeight - 10;
            const maxRight = window.innerWidth - 60 - 10;
            newTop = Math.max(minTop, Math.min(maxTop, newTop));
            newRight = Math.max(minRight, Math.min(maxRight, newRight));
            this.menu.menuContainer.style.top = newTop + 'px';
            this.menu.menuContainer.style.right = newRight + 'px';
            toggleButton.style.top = newTop + 'px';
            toggleButton.style.right = newRight + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                toggleButton.style.cursor = '';
                this.menu.menuContainer.style.transition = '';
                toggleButton.style.transition = '';
            }
        });

        return toggleButton;
    }
}

// --- index.js ---
// == 自动点击菜单入口 ==
// 仅负责实例化主控类，启动脚本
'use strict';
new AutoClickMenu();

})();