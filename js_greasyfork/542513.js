// ==UserScript==
// @name         闪电快速查询 自动监控版
// @namespace    qxj
// @version      3.1.2
// @description  优化自动监控功能，每个按钮可独立控制监控状态，调整侧边栏布局
// @license      MIT
// @author       brady
// @match        *://10.194.17.234/*
// @icon         https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542513/%E9%97%AA%E7%94%B5%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%AF%A2%20%E8%87%AA%E5%8A%A8%E7%9B%91%E6%8E%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542513/%E9%97%AA%E7%94%B5%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%AF%A2%20%E8%87%AA%E5%8A%A8%E7%9B%91%E6%8E%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数（重点调整了侧边栏和按钮样式）
    const config = {
        // 监控频率（分钟）
        monitorFrequency: 1,
        
        // 按钮基础样式 - 调整为更紧凑的布局
        sidebarButtonStyle: `
            padding: 8px 0;
            background: #409EFF;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            border: none;
            display: block;
            width: 100%;
        `,
        monitorButtonStyle: `
            padding: 8px 0;
            background: #67C23A;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            border: none;
            display: block;
            width: 100%;
        `,
        stopButtonStyle: `
            padding: 8px 0;
            background: #F56C6C;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            border: none;
            display: block;
            width: 100%;
        `,
        monitorButtonActiveStyle: `
            background: #85ce61;
            box-shadow: 0 0 5px rgba(103, 194, 58, 0.5);
        `,
        monitorButtonInactiveStyle: `
            background: #BFC2C5;
            cursor: not-allowed;
        `,
        sidebarButtonHoverStyle: `
            background: #66b1ff;
            transform: translateX(2px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `,
        // 侧边栏样式 - 调整宽度适配一行布局
        sidebarStyle: `
            position: fixed;
            left: 10px;
            top: 434px;
            width: 260px; /* 加宽以容纳一行布局 */
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            padding: 10px;
            z-index: 9999;
            transition: all 0.3s;
        `,
        shortcuts: [
            {label: '5分钟', minutes: 5},
            {label: '30分钟', minutes: 30},
            {label: '1小时', minutes: 60},
            {label: '3小时', minutes: 180}
        ]
    };

    // 全局变量 - 自动监控状态（保持不变）
    let autoMonitor = {
        active: false,
        timer: null,
        currentShortcutIndex: -1
    };

    // 设置时间查询区域宽度和侧边栏按钮样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 时间查询区域样式（保持不变） */
        .radar-light.tip-panel {
            display: flex;
            align-items: center;
            padding: 0px;
            box-sizing: border-box;
            width: 430px;
            min-width: 430px;
        }
        
        .time-box {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
        }
        
        .date-time-choose {
            min-width: 110px;
            margin-bottom: 0;
        }
        
        .date-time-choose .el-input__inner {
            min-width: 110px;
            padding: 0 0px;
        }
        
        .btn-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            padding: 0;
        }
        
        .primary-buttons-row {
            display: flex;
            gap: 8px;
        }
        
        .primary-btn {
            margin: 0;
            padding: 0px 0px;
            white-space: nowrap;
        }
        
        /* 侧边栏样式调整 - 重点优化一行布局 */
        .time-shortcut-sidebar {
            ${config.sidebarStyle}
        }
        .sidebar-time-btn {
            ${config.sidebarButtonStyle}
        }
        .sidebar-time-btn:hover {
            ${config.sidebarButtonHoverStyle}
        }
        .sidebar-time-btn:active {
            transform: translateX(1px);
        }
        .monitor-btn {
            ${config.monitorButtonStyle}
        }
        .monitor-btn.stop {
            ${config.stopButtonStyle}
        }
        .monitor-btn.inactive {
            ${config.monitorButtonInactiveStyle}
        }
        .monitor-btn:disabled {
            opacity: 0.7;
            pointer-events: none;
        }
        /* 行布局容器 - 关键调整 */
        .shortcut-row {
            display: flex;
            gap: 10px; /* 按钮之间的间距 */
            margin-bottom: 8px; /* 行与行之间的间距 */
            align-items: center;
            width: 100%; /* 确保占满侧边栏宽度 */
        }
        .time-btn-wrapper {
            flex: 1; /* 时间按钮占1份宽度 */
        }
        .monitor-btn-wrapper {
            flex: 1; /* 监控按钮占1份宽度 */
        }
    `;
    document.head.appendChild(style);

    // 格式化日期（保持不变）
    function formatDateTime(date) {
        const pad = n => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // 设置时间范围（保持不变）
    function setTimeRange(minutes) {
        const now = new Date();
        const endTime = new Date(now);
        const startTime = new Date(now.getTime() - minutes * 60 * 1000);
        
        console.log(`设置时间范围: ${minutes}分钟 (${formatDateTime(startTime)} 至 ${formatDateTime(endTime)})`);
        
        setDateTimeInputValue('选择开始时间', formatDateTime(startTime));
        setDateTimeInputValue('选择结束时间', formatDateTime(endTime));
        
        setTimeout(() => {
            const queryBtn = document.querySelector('div.radar-light.tip-panel .btn:first-child');
            if (queryBtn) {
                queryBtn.click();
                console.log(`已执行查询: ${minutes}分钟范围`);
            }
        }, 300);
    }

    // 设置输入框值（保持不变）
    function setDateTimeInputValue(placeholder, value) {
        const input = document.querySelector(`input[placeholder="${placeholder}"]`);
        if (!input) {
            console.warn(`未找到输入框: ${placeholder}`);
            return;
        }
        
        const vueInstance = findVueInstance(input);
        if (vueInstance && vueInstance.$emit) {
            try {
                vueInstance.$emit('input', value);
                vueInstance.$emit('change', value);
                console.log(`通过Vue实例设置: ${placeholder} = ${value}`);
                return true;
            } catch (e) {
                console.warn(`Vue实例设置失败: ${e.message}`);
            }
        }
        
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`通过DOM设置: ${placeholder} = ${value}`);
    }

    // 查找Vue实例（保持不变）
    function findVueInstance(element) {
        const vueKeys = ['__vue__', '__vue_app__', '_vue_'];
        let current = element;
        
        while (current) {
            for (const key of vueKeys) {
                if (current[key]) return current[key];
            }
            current = current.parentElement;
        }
        
        if (window.__VUE_APPS__ && window.__VUE_APPS__.length > 0) {
            return window.__VUE_APPS__[0];
        }
        
        return null;
    }

    // 重新组织时间选择器布局（保持不变）
    function reorganizeTimeBox(timeBox) {
        if (timeBox.querySelector('.date-time-separator')) return;
        
        const startPicker = timeBox.querySelector('.date-time-choose:first-child');
        const endPicker = timeBox.querySelector('.date-time-choose:last-child');
        
        if (startPicker && endPicker) {
            const separator = document.createElement('span');
            separator.className = 'date-time-separator';
            separator.textContent = '至';
            startPicker.parentNode.insertBefore(separator, endPicker);
        }
    }

    // 重新组织按钮布局（保持不变）
    function reorganizeButtons(timeBox) {
        if (timeBox.querySelector('.btn-container')) return;
        
        const buttons = document.querySelectorAll('.radar-light.tip-panel .btn');
        
        if (buttons.length >= 1) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            
            const primaryRow = document.createElement('div');
            primaryRow.className = 'primary-buttons-row';
            
            if (buttons.length > 0) {
                const queryButton = buttons[0];
                queryButton.classList.add('primary-btn');
                queryButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                primaryRow.appendChild(queryButton);
            }
            
            if (buttons.length > 1) {
                const hideButton = buttons[1];
                hideButton.classList.add('primary-btn');
                hideButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                primaryRow.appendChild(hideButton);
            }
            
            for (let i = 2; i < buttons.length; i++) {
                buttons[i].remove();
            }
            
            btnContainer.appendChild(primaryRow);
            timeBox.appendChild(btnContainer);
        }
    }

    // 启动自动监控（保持不变）
    function startAutoMonitor(index, minutes) {
        if (autoMonitor.active) {
            stopAutoMonitor();
        }
        
        autoMonitor.active = true;
        autoMonitor.currentShortcutIndex = index;
        
        setTimeRange(minutes);
        
        const interval = config.monitorFrequency * 60 * 1000;
        autoMonitor.timer = setInterval(() => {
            console.log(`[自动监控] 执行 ${minutes}分钟查询 (频率: ${config.monitorFrequency}分钟)`);
            setTimeRange(minutes);
        }, interval);
        
        updateMonitorButtons(index);
        
        console.log(`已启动自动监控: ${minutes}分钟查询, 频率: ${config.monitorFrequency}分钟`);
    }

    // 停止自动监控（保持不变）
    function stopAutoMonitor() {
        if (autoMonitor.timer) {
            clearInterval(autoMonitor.timer);
        }
        
        autoMonitor.active = false;
        autoMonitor.currentShortcutIndex = -1;
        
        updateMonitorButtons(-1);
        
        console.log('自动监控已停止');
    }

    // 更新监控按钮状态（保持不变）
    function updateMonitorButtons(activeIndex) {
        const monitorButtons = document.querySelectorAll('.monitor-btn');
        
        monitorButtons.forEach((btn, index) => {
            btn.classList.remove('stop', 'inactive');
            btn.disabled = false;
            
            if (activeIndex === -1) {
                btn.textContent = '开始监控';
            } else if (index === activeIndex) {
                btn.classList.add('stop');
                btn.textContent = '停止监控';
            } else {
                btn.classList.add('inactive');
                btn.textContent = '开始监控';
                btn.disabled = true;
            }
        });
    }

    // 创建侧边栏快捷按钮（优化一行布局）
    function createSidebar() {
        if (document.querySelector('.time-shortcut-sidebar')) return;
        
        const sidebar = document.createElement('div');
        sidebar.className = 'time-shortcut-sidebar';
        
        // 直接循环创建行，每行包含一个时间按钮和一个监控按钮
        config.shortcuts.forEach((shortcut, index) => {
            // 每行容器（取消嵌套的container，直接用row作为行容器）
            const row = document.createElement('div');
            row.className = 'shortcut-row'; // 核心：使用flex布局的行容器
            
            // 时间按钮
            const timeBtnWrapper = document.createElement('div');
            timeBtnWrapper.className = 'time-btn-wrapper';
            const timeBtn = document.createElement('button');
            timeBtn.className = 'sidebar-time-btn';
            timeBtn.textContent = shortcut.label;
            timeBtn.title = `设置${shortcut.label}时间范围`;
            timeBtn.onclick = () => {
                setTimeRange(shortcut.minutes);
            };
            timeBtnWrapper.appendChild(timeBtn);
            
            // 监控按钮
            const monitorBtnWrapper = document.createElement('div');
            monitorBtnWrapper.className = 'monitor-btn-wrapper';
            const monitorBtn = document.createElement('button');
            monitorBtn.className = 'monitor-btn';
            monitorBtn.textContent = '开始监控';
            monitorBtn.title = `每${config.monitorFrequency}分钟自动查询${shortcut.label}数据`;
            monitorBtn.onclick = () => {
                if (autoMonitor.active && autoMonitor.currentShortcutIndex === index) {
                    stopAutoMonitor();
                } else {
                    startAutoMonitor(index, shortcut.minutes);
                }
            };
            monitorBtnWrapper.appendChild(monitorBtn);
            
            // 将两个按钮放入同一行
            row.appendChild(timeBtnWrapper);
            row.appendChild(monitorBtnWrapper);
            
            // 行直接放入侧边栏
            sidebar.appendChild(row);
        });
        
        document.body.appendChild(sidebar);
        updateMonitorButtons(-1); // 初始化按钮状态
        console.log('侧边栏快捷按钮已创建（一行布局）');
    }

    // 等待元素出现（保持不变）
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(check, 500);
            }
        }
        
        check();
    }

    // 重组布局（保持不变）
    function setupPanel(panel) {
        const timeBox = panel.querySelector('.time-box');
        if (timeBox) {
            reorganizeTimeBox(timeBox);
            reorganizeButtons(timeBox);
        }
    }

    // 初始化函数（保持不变）
    function init() {
        const lightningBtn = document.querySelector('div.left-nav.active span');
        if (lightningBtn) {
            lightningBtn.addEventListener('click', () => {
                setTimeout(() => {
                    const panel = document.querySelector('div.radar-light.tip-panel');
                    if (panel) setupPanel(panel);
                    createSidebar();
                }, 300);
            });
        }
        
        waitForElement('div.radar-light.tip-panel', (panel) => {
            setupPanel(panel);
            createSidebar();
        });
        
        console.log('闪电查询快捷按钮脚本已加载 (v3.1.2 - 一行布局优化)');
    }

    // 页面加载完成后初始化（保持不变）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    window.addEventListener('beforeunload', function() {
        if (autoMonitor.active) {
            stopAutoMonitor();
        }
    });
})();