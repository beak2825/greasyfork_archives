// ==UserScript==
// @name         闪电快速查询 手动版本
// @namespace    qxj
// @version      2.8.9
// @description  修复按钮挤压问题，移除多余尺寸样式，保持自然布局，设置时间查询区域宽度为430px
// @license      MIT
// @author       brady
// @match        *://10.194.17.234/*
// @icon         https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542516/%E9%97%AA%E7%94%B5%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%AF%A2%20%E6%89%8B%E5%8A%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542516/%E9%97%AA%E7%94%B5%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%AF%A2%20%E6%89%8B%E5%8A%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数（仅保留必要样式，移除可能导致挤压的设置）
    const config = {
        sidebarButtonStyle: `
            padding: 8px 10px;
            background: #409EFF;
            color: white;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            border: none;
            margin-bottom: 8px;
            display: block;
            width: 100%;
        `,
        sidebarButtonHoverStyle: `
            background: #66b1ff;
            transform: translateX(2px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `,
        sidebarStyle: `
            position: fixed;
            left: 10px;
            top: 434px;
            width: 110px;
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

    // 核心修改：设置时间查询区域宽度为430px，移除所有可能导致挤压的样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 面板基础样式：设置固定宽度430px，保留必要布局 */
        .radar-light.tip-panel {
            display: flex;
            align-items: center;
            padding: 0px;
            box-sizing: border-box;
            width: 430px; /* 核心修改：设置固定宽度430px */
            min-width: 430px; /* 确保最小宽度也是430px */
        }
        
        /* 时间选择区：自适应宽度 */
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
        
        /* 按钮区：自然排列 */
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
        
        /* 侧边栏样式保持不变 */
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
    `;
    document.head.appendChild(style);

    // 等待元素出现
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

    // 格式化日期为 YYYY-MM-DD HH:mm:ss
    function formatDateTime(date) {
        const pad = n => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // 直接设置时间范围并自动查询
    function setTimeRange(minutes) {
        const now = new Date();
        const endTime = new Date(now);
        const startTime = new Date(now.getTime() - minutes * 60 * 1000);
        
        console.log(`设置时间范围: ${minutes}分钟 (${formatDateTime(startTime)} 至 ${formatDateTime(endTime)})`);
        
        // 设置开始时间输入框的值
        setDateTimeInputValue('选择开始时间', formatDateTime(startTime));
        
        // 设置结束时间输入框的值
        setDateTimeInputValue('选择结束时间', formatDateTime(endTime));
        
        // 点击查询按钮
        setTimeout(() => {
            const queryBtn = document.querySelector('div.radar-light.tip-panel .btn:first-child');
            if (queryBtn) {
                queryBtn.click();
                console.log(`已执行查询: ${minutes}分钟范围`);
            }
        }, 300);
    }

    // 直接设置输入框的值
    function setDateTimeInputValue(placeholder, value) {
        const input = document.querySelector(`input[placeholder="${placeholder}"]`);
        if (!input) {
            console.warn(`未找到输入框: ${placeholder}`);
            return;
        }
        
        // 找到Vue实例并直接设置值
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
        
        // 如果Vue方法失败，则直接设置输入框值并触发事件
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`通过DOM设置: ${placeholder} = ${value}`);
    }

    // 深度查找Vue实例
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

    // 重新组织时间选择器布局
    function reorganizeTimeBox(timeBox) {
        // 避免重复处理
        if (timeBox.querySelector('.date-time-separator')) return;
        
        const startPicker = timeBox.querySelector('.date-time-choose:first-child');
        const endPicker = timeBox.querySelector('.date-time-choose:last-child');
        
        if (startPicker && endPicker) {
            // 插入"至"分隔符（替换原有"-"）
            const separator = document.createElement('span');
            separator.className = 'date-time-separator';
            separator.textContent = '至';
            
            // 在开始和结束选择器之间插入分隔符
            startPicker.parentNode.insertBefore(separator, endPicker);
        }
    }

    // 重新组织按钮布局
    function reorganizeButtons(timeBox) {
        if (timeBox.querySelector('.btn-container')) return;
        
        const buttons = document.querySelectorAll('.radar-light.tip-panel .btn');
        
        if (buttons.length >= 1) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            
            const primaryRow = document.createElement('div');
            primaryRow.className = 'primary-buttons-row';
            
            // 保留前两个按钮（查询和隐藏）
            if (buttons.length > 0) {
                const queryButton = buttons[0];
                queryButton.classList.add('primary-btn');
                // 阻止事件冒泡
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
            
            // 移除其他按钮
            for (let i = 2; i < buttons.length; i++) {
                buttons[i].remove();
            }
            
            btnContainer.appendChild(primaryRow);
            timeBox.appendChild(btnContainer);
        }
    }

    // 创建侧边栏快捷按钮
    function createSidebar() {
        if (document.querySelector('.time-shortcut-sidebar')) return;
        
        const sidebar = document.createElement('div');
        sidebar.className = 'time-shortcut-sidebar';
        
        config.shortcuts.forEach(shortcut => {
            const btn = document.createElement('button');
            btn.className = 'sidebar-time-btn';
            btn.textContent = shortcut.label;
            btn.title = `设置${shortcut.label.replace('M','分钟').replace('H','小时')}时间范围`;
            btn.onclick = () => setTimeRange(shortcut.minutes);
            sidebar.appendChild(btn);
        });
        
        document.body.appendChild(sidebar);
        console.log('侧边栏快捷按钮已创建');
    }

    // 主函数 - 重组布局并添加按钮
    function setupPanel(panel) {
        const timeBox = panel.querySelector('.time-box');
        if (timeBox) {
            reorganizeTimeBox(timeBox);
            reorganizeButtons(timeBox);
        }
    }

    // 初始化函数
    function init() {
        // 监听闪电按钮点击
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
        
        // 检查面板是否已存在
        waitForElement('div.radar-light.tip-panel', (panel) => {
            setupPanel(panel);
            createSidebar();
        });
        
        console.log('闪电查询快捷按钮脚本已加载 (v2.8.9 - 设置宽度430px)');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();