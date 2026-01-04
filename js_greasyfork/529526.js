// ==UserScript==
// @name         个人待办事项清单
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  浏览器右下角的个人待办事项清单，支持多个清单管理，可双击编辑项目，右键菜单修改清单名称
// @author       Your Name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/529526/%E4%B8%AA%E4%BA%BA%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9%E6%B8%85%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529526/%E4%B8%AA%E4%BA%BA%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9%E6%B8%85%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在iframe中
    if (window.self !== window.top) {
        // 在iframe中，不执行脚本
        return;
    }

    // 使用固定的全局存储键，确保跨网站数据一致性
    const GLOBAL_STORAGE_KEY = 'global-todo-lists-data';

    // 获取用户主题设置
    let userThemePreference = GM_getValue('global-todo-theme-preference', 'auto');

    // 检测是否为暗色模式
    function isDarkMode() {
        // 如果用户选择了特定主题，则直接返回
        if (userThemePreference === 'dark') return true;
        if (userThemePreference === 'light') return false;

        // 自动模式下，检测系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }

        // 检测网站暗色模式 - 通过检查背景颜色
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        if (bodyBg) {
            const rgb = bodyBg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const brightness = (0.299 * parseInt(rgb[0]) + 0.587 * parseInt(rgb[1]) + 0.114 * parseInt(rgb[2])) / 255;
                return brightness < 0.5;
            }
        }

        // 检查是否有常见的暗色模式类
        return document.documentElement.classList.contains('dark') ||
               document.body.classList.contains('dark-mode') ||
               document.body.classList.contains('darkmode') ||
               document.body.classList.contains('dark-theme');
    }

    // 设置当前模式
    let darkMode = isDarkMode();

    // 获取主题颜色
    function getThemeColors(isDark) {
        // 通用颜色属性
        const baseColors = {
            btnBg: '#3498db',
            btnBgHover: '#2980b9',
            danger: isDark ? '#e74c3c' : '#ff6b6b'
        };

        // 特定主题颜色
        const themeSpecific = isDark ? {
            // 暗色模式颜色
            bg: '#2c2c2c',
            textPrimary: '#e0e0e0',
            textSecondary: '#a0a0a0',
            panelBg: '#333333',
            headerBg: '#2c3e50',
            itemBg: '#3a3a3a',
            itemBgHover: '#444444',
            itemBorder: '#484848',
            inputBg: '#444444',
            inputBorder: '#555555',
            listItemsBg: '#2a2a2a',
            borderColor: 'rgba(255,255,255,0.1)'
        } : {
            // 亮色模式颜色
            bg: 'white',
            textPrimary: '#333333',
            textSecondary: '#666666',
            panelBg: 'white',
            headerBg: '#3498db',
            itemBg: '#f5f5f5',
            itemBgHover: '#e8e8e8',
            itemBorder: '#f1f1f1',
            inputBg: 'white',
            inputBorder: '#ddd',
            listItemsBg: '#fafafa',
            borderColor: '#eee'
        };

        // 合并并返回所有颜色属性
        return {...baseColors, ...themeSpecific};
    }

    // 样式定义 - 根据当前模式使用不同的颜色变量
    let colors = getThemeColors(darkMode);

    // 获取定义好的CSS样式
    function getStyles(colors) {
        return `
            #todo-button {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                width: 32px;
                height: 32px;
                background-color: ${colors.btnBg};
                border-radius: 50% 0 0 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 16px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                transition: all 0.3s;
            }

            #todo-button:hover {
                transform: translateY(-50%) translateX(-5px);
                background-color: ${colors.btnBgHover};
            }

            #todo-panel {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 250px;
                max-height: 450px;
                background-color: ${colors.panelBg};
                border-radius: 8px;
                z-index: 9998;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid ${colors.itemBorder};
                transition: background-color 0.3s;
            }

            #todo-header {
                padding: 10px;
                background-color: ${colors.headerBg};
                color: white;
                font-weight: bold;
                font-size: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                transition: background-color 0.3s;
                position: relative;
            }

            #todo-header-link {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 24px;
                height: 24px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s;
            }

            #todo-header-link:hover {
                background-color: rgba(255, 255, 255, 0.4);
            }

            #todo-content {
                padding: 12px;
                overflow-y: auto;
                max-height: 400px;
                color: ${colors.textPrimary};
                transition: color 0.3s;
            }

            .todo-list-button {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 8px 10px;
                margin-bottom: 6px;
                background-color: ${colors.itemBg};
                border: none;
                border-radius: 4px;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
                color: ${colors.textPrimary};
            }

            .todo-list-button:hover {
                background-color: ${colors.itemBgHover};
            }

            .todo-list-items {
                margin-top: 8px;
                margin-bottom: 15px;
                display: none;
                background-color: ${colors.listItemsBg};
                border-radius: 4px;
                padding: 5px;
                transition: background-color 0.3s;
            }

            .todo-item {
                display: flex;
                align-items: center;
                padding: 6px 8px;
                border-bottom: 1px solid ${colors.itemBorder};
                user-select: none;
                transition: border-color 0.3s;
            }

            .todo-item input[type="checkbox"] {
                margin-right: 8px;
                min-width: 16px;
                min-height: 16px;
            }

            .todo-item span {
                flex-grow: 1;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: ${colors.textPrimary};
                transition: color 0.3s;
            }

            .todo-item button {
                background: none;
                border: none;
                color: ${colors.danger};
                cursor: pointer;
                margin-left: 5px;
                font-size: 16px;
                opacity: 0.5;
                transition: opacity 0.2s, color 0.3s;
            }

            .todo-item:hover button {
                opacity: 1;
            }

            .todo-items-container {
                margin-bottom: 10px;
                max-height: 250px;
                overflow-y: auto;
            }

            .add-item-form, #add-list-form {
                display: flex;
                margin-top: 8px;
                margin-bottom: 10px;
            }

            .add-item-form input, #add-list-form input {
                flex-grow: 1;
                padding: 6px 8px;
                border: 1px solid ${colors.inputBorder};
                background-color: ${colors.inputBg};
                color: ${colors.textPrimary};
                border-radius: 4px 0 0 4px;
                font-size: 13px;
                height: 16px;
                line-height: 16px;
                box-sizing: content-box;
                transition: border-color 0.3s, background-color 0.3s, color 0.3s;
            }

            .add-item-form button, #add-list-form button, .action-button {
                padding: 6px 10px;
                background-color: ${colors.btnBg};
                color: white;
                border: none;
                border-radius: 0 4px 4px 0;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .completed {
                text-decoration: line-through;
                color: ${colors.textSecondary};
                transition: color 0.3s;
            }

            .action-buttons {
                display: flex;
                gap: 8px;
                margin-top: 15px;
            }

            .action-button {
                flex: 1;
                border-radius: 4px;
                font-size: 12px;
            }

            .action-button:hover, .add-item-form button:hover, #add-list-form button:hover {
                background-color: ${colors.btnBgHover};
            }

            .delete-list-button {
                margin-top: 10px;
                padding: 6px;
                background-color: ${colors.danger};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                transition: all 0.2s;
                font-size: 13px;
            }

            .delete-list-button:hover {
                background-color: ${darkMode ? '#c0392b' : '#ff4f4f'};
            }

            .list-count {
                margin-left: 8px;
                background-color: ${colors.btnBg};
                color: white;
                border-radius: 10px;
                padding: 2px 6px;
                font-size: 11px;
                min-width: 18px;
                text-align: center;
                transition: background-color 0.3s;
            }

            #theme-toggle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding: 10px;
                background-color: ${colors.itemBg};
                border-radius: 4px;
                transition: background-color 0.3s;
            }

            #theme-toggle span {
                font-size: 13px;
                color: ${colors.textPrimary};
                transition: color 0.3s;
            }

            #theme-toggle select {
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid ${colors.inputBorder};
                background-color: ${colors.inputBg};
                color: ${colors.textPrimary};
                font-size: 13px;
                transition: border-color 0.3s, background-color 0.3s, color 0.3s;
            }

            .context-menu {
                position: fixed;
                background-color: ${colors.panelBg};
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                padding: 8px 0;
                z-index: 10000;
                display: none;
                min-width: 200px;
                max-width: 280px;
                border: 1px solid ${colors.borderColor};
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.2s, transform 0.2s, background-color 0.3s, border-color 0.3s;
            }

            .context-menu.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .context-menu button {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 10px 15px;
                text-align: left;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: ${colors.textPrimary};
                transition: background-color 0.2s, color 0.3s;
                position: relative;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .context-menu button:hover {
                background-color: ${colors.itemBgHover};
            }

            .context-menu-title {
                padding: 5px 15px 8px;
                margin-top: -5px;
                color: ${colors.textSecondary};
                font-size: 12px;
                border-bottom: 1px solid ${colors.borderColor};
                margin-bottom: 5px;
                transition: color 0.3s, border-color 0.3s;
            }

            .menu-icon {
                margin-right: 10px;
                font-size: 16px;
                color: ${colors.textSecondary};
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                transition: color 0.3s;
            }

            .title-text {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 180px;
                white-space: nowrap;
                display: inline-block;
            }

            /* 编辑模式的样式 */
            .todo-item.editing span {
                display: none;
            }

            .edit-input {
                flex-grow: 1;
                padding: 2px 4px;
                margin-right: 5px;
                border: 1px solid ${colors.inputBorder};
                background-color: ${colors.inputBg};
                color: ${colors.textPrimary};
                border-radius: 4px;
                font-size: 13px;
                height: 16px;
                line-height: 16px;
                box-sizing: content-box;
                display: none;
            }

            .todo-item.editing .edit-input {
                display: block;
            }

            /* 修改列表名称时的样式 */
            .list-edit-input {
                width: 100%;
                padding: 6px 8px;
                border: 1px solid ${colors.inputBorder};
                background-color: ${colors.inputBg};
                color: ${colors.textPrimary};
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
                margin-bottom: 8px;
            }
        `;
    }

    // 应用当前主题样式
    let styleElement = GM_addStyle(getStyles(colors));

    // 数据存储和获取
    const todoData = GM_getValue(GLOBAL_STORAGE_KEY, {});

    // 当前打开的清单名称
    let currentOpenedListName = null;

    // 全局元素引用
    let globalElements;

    // 通用函数：阻止事件冒泡
    function stopPropagation(e) {
        if (e) e.stopPropagation();
    }

    // 通用的添加事项函数（适用于添加清单和添加待办项）
    function handleAddFormSubmit(inputElement, submitHandler, e) {
        stopPropagation(e);
        const text = inputElement.value.trim();
        if (text) {
            submitHandler(text);
            inputElement.value = '';
            inputElement.focus();
        }
    }

    // 创建DOM元素
    function createElements() {
        // 创建主按钮
        const todoButton = document.createElement('div');
        todoButton.id = 'todo-button';
        todoButton.innerHTML = '✓';
        todoButton.title = '待办事项';
        document.body.appendChild(todoButton);

        // 创建面板
        const todoPanel = document.createElement('div');
        todoPanel.id = 'todo-panel';

        // 头部
        const todoHeader = document.createElement('div');
        todoHeader.id = 'todo-header';
        todoHeader.innerHTML = '待办事项清单';

        // 添加跳转按钮
        const headerLink = document.createElement('div');
        headerLink.id = 'todo-header-link';
        headerLink.innerHTML = '⟁';
        headerLink.title = '在新窗口中打开任务管理页面';
        headerLink.addEventListener('click', function(e) {
            e.stopPropagation();
            window.open('https://st.25ai.me/task-progress.html', '_blank');
        });
        todoHeader.appendChild(headerLink);

        // 内容区域
        const todoContent = document.createElement('div');
        todoContent.id = 'todo-content';

        // 添加到面板
        todoPanel.appendChild(todoHeader);
        todoPanel.appendChild(todoContent);
        document.body.appendChild(todoPanel);

        // 创建右键菜单
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        document.body.appendChild(contextMenu);

        return {
            button: todoButton,
            panel: todoPanel,
            content: todoContent,
            contextMenu: contextMenu
        };
    }

    // 初始化事件
    function initEvents(elements) {
        // 点击按钮显示面板
        elements.button.addEventListener('click', function(e) {
            elements.panel.style.display = elements.panel.style.display === 'flex' ? 'none' : 'flex';
            stopPropagation(e);

            // 如果显示面板，则更新内容
            if (elements.panel.style.display === 'flex') {
                updatePanelContent(elements);
            }
        });

        // 点击页面其他地方关闭面板和菜单
        document.addEventListener('click', function(e) {
            if (e.target.closest('#todo-panel') || e.target.closest('#todo-button')) {
                return;
            }

            // 关闭面板和菜单
            elements.panel.style.display = 'none';

            // 添加菜单渐隐效果
            if (elements.contextMenu.style.display === 'block') {
                elements.contextMenu.classList.remove('visible');
                setTimeout(() => {
                    elements.contextMenu.style.display = 'none';
                }, 200);
            } else {
                elements.contextMenu.style.display = 'none';
            }
        });

        // 阻止面板点击事件冒泡
        elements.panel.addEventListener('click', stopPropagation);

        // 右键点击主按钮
        elements.button.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            // 检查是否有清单
            const lists = Object.keys(todoData);
            if (lists.length === 0) {
                return; // 没有清单时不显示
            }

            // 获取按钮位置以便显示菜单
            const buttonRect = elements.button.getBoundingClientRect();

            // 显示右键菜单在按钮的左侧
            elements.contextMenu.style.display = 'block';
            elements.contextMenu.style.left = (buttonRect.left - elements.contextMenu.offsetWidth - 10) + 'px';
            elements.contextMenu.style.top = (buttonRect.top + buttonRect.height/2 - elements.contextMenu.offsetHeight/2) + 'px';

            // 清除旧菜单项
            elements.contextMenu.innerHTML = '';

            // 添加菜单标题
            const menuTitle = document.createElement('div');
            menuTitle.className = 'context-menu-title';
            menuTitle.innerHTML = '我的待办清单';
            elements.contextMenu.appendChild(menuTitle);

            // 添加清单到菜单
            lists.forEach(listName => {
                const menuItem = document.createElement('button');

                // 添加图标和文本容器
                const iconSpan = document.createElement('span');
                iconSpan.className = 'menu-icon';
                iconSpan.innerHTML = '📝';
                menuItem.appendChild(iconSpan);

                // 添加文本和省略号支持
                const textSpan = document.createElement('span');
                textSpan.className = 'title-text';
                textSpan.textContent = listName;
                menuItem.appendChild(textSpan);

                // 添加未完成项目计数
                const list = todoData[listName] || [];
                const uncompletedCount = list.filter(item => !item.completed).length;
                if (uncompletedCount > 0) {
                    const countSpan = document.createElement('span');
                    countSpan.className = 'list-count';
                    countSpan.textContent = uncompletedCount;
                    menuItem.appendChild(countSpan);
                }

                // 点击清单按钮事件
                menuItem.addEventListener('click', function(evt) {
                    stopPropagation(evt); // 阻止事件冒泡
                    openList(listName);
                    elements.panel.style.display = 'flex';
                    elements.contextMenu.style.display = 'none';
                    elements.contextMenu.classList.remove('visible');
                });
                elements.contextMenu.appendChild(menuItem);
            });

            // 添加动画效果
            setTimeout(() => {
                elements.contextMenu.classList.add('visible');
            }, 10);

            stopPropagation(e);
        });
    }

    // 更新面板内容
    function updatePanelContent(elements) {
        const content = elements.content;
        content.innerHTML = '';

        // 获取所有清单
        const lists = Object.keys(todoData);

        if (lists.length === 0) {
            // 如果没有清单，显示欢迎信息
            content.innerHTML = `<p style="color: ${colors.textSecondary}; font-size: 13px; text-align: center;">欢迎使用待办事项清单！<br>请创建您的第一个清单。</p>`;
        } else {
            // 显示所有清单
            lists.forEach(listName => {
                // 创建清单按钮
                const listButton = document.createElement('button');
                listButton.className = 'todo-list-button';

                // 添加文本容器
                const textSpan = document.createElement('span');
                textSpan.textContent = listName;
                listButton.appendChild(textSpan);

                // 添加未完成项目计数
                const list = todoData[listName] || [];
                const uncompletedCount = list.filter(item => !item.completed).length;
                if (uncompletedCount > 0) {
                    const countSpan = document.createElement('span');
                    countSpan.className = 'list-count';
                    countSpan.textContent = uncompletedCount;
                    listButton.appendChild(countSpan);
                }

                content.appendChild(listButton);

                // 创建清单内容区域
                const listItems = document.createElement('div');
                listItems.className = 'todo-list-items';
                listItems.setAttribute('data-list', listName);
                content.appendChild(listItems);

                // 清单按钮点击事件
                listButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // 阻止事件冒泡
                    toggleListItems(listName);
                });

                // 清单按钮右键点击事件
                listButton.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // 显示右键菜单
                    showListContextMenu(e, listName, elements);
                });
            });
        }

        // 添加新清单表单
        const addListForm = document.createElement('div');
        addListForm.id = 'add-list-form';
        addListForm.innerHTML = `
            <input type="text" placeholder="新建清单名称" />
            <button>添加</button>
        `;
        content.appendChild(addListForm);

        // 添加清单按钮事件
        const addListButton = addListForm.querySelector('button');
        const addListInput = addListForm.querySelector('input');

        // 添加新清单的处理函数
        function submitNewList(listName) {
            if (!todoData[listName]) {
                todoData[listName] = [];
                GM_setValue(GLOBAL_STORAGE_KEY, todoData);
                updatePanelContent(elements);

                // 确保面板保持打开状态
                elements.panel.style.display = 'flex';
            }
        }

        // 点击添加按钮
        addListButton.addEventListener('click', e => handleAddFormSubmit(addListInput, submitNewList, e));

        // 按下回车键
        addListInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAddFormSubmit(addListInput, submitNewList, e);
                e.preventDefault();
            }
        });

        // 添加导入导出按钮
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // 导出按钮
        const exportButton = document.createElement('button');
        exportButton.className = 'action-button';
        exportButton.textContent = '导出数据';
        exportButton.addEventListener('click', exportData);
        actionButtons.appendChild(exportButton);

        // 导入按钮
        const importButton = document.createElement('button');
        importButton.className = 'action-button';
        importButton.textContent = '导入数据';
        importButton.addEventListener('click', importData);
        actionButtons.appendChild(importButton);

        content.appendChild(actionButtons);

        // 添加主题切换控件
        const themeToggle = document.createElement('div');
        themeToggle.id = 'theme-toggle';

        const themeLabel = document.createElement('span');
        themeLabel.textContent = '主题设置:';
        themeToggle.appendChild(themeLabel);

        const themeSelect = document.createElement('select');
        const options = [
            { value: 'auto', text: '自动 (跟随系统/网站)' },
            { value: 'light', text: '亮色模式' },
            { value: 'dark', text: '暗色模式' }
        ];

        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            optionEl.selected = userThemePreference === option.value;
            themeSelect.appendChild(optionEl);
        });

        themeSelect.addEventListener('change', function() {
            userThemePreference = this.value;
            GM_setValue('global-todo-theme-preference', userThemePreference);

            // 更新主题
            darkMode = userThemePreference === 'dark' ||
                     (userThemePreference === 'auto' && isDarkMode());

            // 更新颜色方案和样式
            colors = getThemeColors(darkMode);
            styleElement.innerHTML = getStyles(colors);

            // 更新内容
            updatePanelContentKeepingState();
        });

        themeToggle.appendChild(themeSelect);
        content.appendChild(themeToggle);

        // 阻止表单和按钮事件冒泡
        addListForm.addEventListener('click', e => e.stopPropagation());
        actionButtons.addEventListener('click', e => e.stopPropagation());
    }

    // 导出数据
    function exportData() {
        const dataStr = JSON.stringify(todoData);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'todo-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // 导入数据
    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            const file = e.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = event => {
                try {
                    const importedData = JSON.parse(event.target.result);

                    // 验证导入的数据结构
                    if (typeof importedData === 'object') {
                        // 确认导入
                        if (confirm('确定要导入数据吗？这将覆盖当前的所有待办清单。')) {
                            Object.assign(todoData, importedData);
                            GM_setValue(GLOBAL_STORAGE_KEY, todoData);
                            updatePanelContent(globalElements);
                            alert('数据导入成功！');
                        }
                    } else {
                        alert('无效的数据格式！');
                    }
                } catch (error) {
                    alert('导入失败：' + error.message);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    // 切换显示/隐藏清单内容
    function toggleListItems(listName) {
        const allListItems = document.querySelectorAll('.todo-list-items');
        allListItems.forEach(item => {
            if (item.getAttribute('data-list') === listName) {
                const isDisplayed = item.style.display === 'block';
                item.style.display = isDisplayed ? 'none' : 'block';

                // 如果显示，则更新内容并保存当前打开的清单名称
                if (!isDisplayed) {
                    updateListItems(item, listName);
                    currentOpenedListName = listName;
                } else {
                    currentOpenedListName = null;
                }
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 直接打开指定清单（用于右键菜单）
    function openList(listName) {
        const allListItems = document.querySelectorAll('.todo-list-items');
        allListItems.forEach(item => {
            const isTarget = item.getAttribute('data-list') === listName;
            item.style.display = isTarget ? 'block' : 'none';

            if (isTarget) {
                updateListItems(item, listName);
                currentOpenedListName = listName;
            }
        });
    }

    // 更新清单项目
    function updateListItems(container, listName) {
        // 保存滚动位置 - 从 itemsContainer 获取
        const itemsContainer = container.querySelector('.todo-items-container');
        const scrollTop = itemsContainer ? itemsContainer.scrollTop : 0;

        container.innerHTML = '';

        // 获取清单中的所有项目
        let items = todoData[listName] || [];

        // 将已完成的项目排序到底部
        items.sort((a, b) => {
            if (a.completed === b.completed) {
                // 如果完成状态相同，按照创建时间排序
                return a.createdAt - b.createdAt;
            }
            // 完成的排在未完成的后面
            return a.completed ? 1 : -1;
        });

        // 创建待办事项列表容器
        const newItemsContainer = document.createElement('div');
        newItemsContainer.className = 'todo-items-container';
        container.appendChild(newItemsContainer);

        // 添加现有项目
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'todo-item';
            itemElement.setAttribute('data-index', index);

            // 复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.completed;
            itemElement.appendChild(checkbox);

            // 文本
            const span = document.createElement('span');
            span.textContent = item.text;
            if (item.completed) {
                span.className = 'completed';
            }
            itemElement.appendChild(span);

            // 添加编辑输入框（默认隐藏）
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = item.text;
            itemElement.appendChild(editInput);

            // 删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '×';
            itemElement.appendChild(deleteButton);

            newItemsContainer.appendChild(itemElement);

            // 复选框事件
            checkbox.addEventListener('change', function() {
                todoData[listName][index].completed = checkbox.checked;
                GM_setValue(GLOBAL_STORAGE_KEY, todoData);
                span.className = checkbox.checked ? 'completed' : '';

                // 记住这个清单是打开的并更新面板（会重排序项目）
                currentOpenedListName = listName;
                updatePanelContentKeepingState();
            });

            // 双击编辑功能
            span.addEventListener('dblclick', function(e) {
                stopPropagation(e);
                itemElement.classList.add('editing');
                editInput.focus();
                editInput.select();
            });

            // 编辑输入框失去焦点时保存
            editInput.addEventListener('blur', function() {
                finishEditing();
            });

            // 按下回车键保存
            editInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    finishEditing();
                    e.preventDefault();
                }
            });

            // 按下ESC键取消
            editInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    editInput.value = item.text; // 恢复原值
                    itemElement.classList.remove('editing');
                    e.preventDefault();
                }
            });

            // 完成编辑的函数
            function finishEditing() {
                const newText = editInput.value.trim();
                if (newText && newText !== item.text) {
                    todoData[listName][index].text = newText;
                    GM_setValue(GLOBAL_STORAGE_KEY, todoData);
                    span.textContent = newText;
                }
                itemElement.classList.remove('editing');
            }

            // 删除按钮事件
            deleteButton.addEventListener('click', function(e) {
                stopPropagation(e);

                todoData[listName].splice(index, 1);
                GM_setValue(GLOBAL_STORAGE_KEY, todoData);

                // 记住这个清单是打开的并更新面板
                currentOpenedListName = listName;
                updatePanelContentKeepingState();
            });

            // 阻止项目元素事件冒泡
            itemElement.addEventListener('click', stopPropagation);
        });

        // 添加项目表单
        const addItemForm = document.createElement('div');
        addItemForm.className = 'add-item-form';
        addItemForm.innerHTML = `
            <input type="text" placeholder="添加新待办事项" />
            <button>添加</button>
        `;
        container.appendChild(addItemForm);

        // 添加待办事项按钮事件
        const addItemButton = addItemForm.querySelector('button');
        const addItemInput = addItemForm.querySelector('input');

        // 自动聚焦输入框
        setTimeout(() => addItemInput.focus(), 10);

        // 阻止表单事件冒泡
        addItemForm.addEventListener('click', stopPropagation);

        // 添加新待办事项的处理函数
        function submitNewItem(itemText) {
            todoData[listName].push({
                text: itemText,
                completed: false,
                createdAt: new Date().getTime()
            });
            GM_setValue(GLOBAL_STORAGE_KEY, todoData);

            currentOpenedListName = listName;
            updatePanelContentKeepingState();

            // 重新聚焦新的输入框
            setTimeout(() => {
                const newInput = document.querySelector(`.todo-list-items[data-list="${listName}"] .add-item-form input`);
                if (newInput) newInput.focus();
            }, 10);
        }

        // 点击添加按钮
        addItemButton.addEventListener('click', e => handleAddFormSubmit(addItemInput, submitNewItem, e));

        // 按下回车键
        addItemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAddFormSubmit(addItemInput, submitNewItem, e);
                e.preventDefault();
            }
        });

        // 添加删除清单按钮
        const deleteListButton = document.createElement('button');
        deleteListButton.className = 'delete-list-button';
        deleteListButton.textContent = '删除此清单';

        deleteListButton.addEventListener('click', function(e) {
            stopPropagation(e);

            delete todoData[listName];
            GM_setValue(GLOBAL_STORAGE_KEY, todoData);

            if (currentOpenedListName === listName) {
                currentOpenedListName = null;
            }

            updatePanelContentKeepingState();
        });

        container.appendChild(deleteListButton);

        // 阻止容器事件冒泡
        container.addEventListener('click', stopPropagation);

        // 恢复滚动位置到 itemsContainer
        newItemsContainer.scrollTop = scrollTop;
    }

    // 显示清单的右键菜单
    function showListContextMenu(event, listName, elements) {
        const contextMenu = elements.contextMenu;

        // 计算菜单位置
        const x = event.clientX;
        const y = event.clientY;

        // 清空菜单内容
        contextMenu.innerHTML = '';

        // 添加菜单标题
        const menuTitle = document.createElement('div');
        menuTitle.className = 'context-menu-title';
        menuTitle.innerHTML = '清单操作';
        contextMenu.appendChild(menuTitle);

        // 添加重命名选项
        const renameButton = document.createElement('button');

        // 添加图标和文本
        const iconSpan = document.createElement('span');
        iconSpan.className = 'menu-icon';
        iconSpan.innerHTML = '✏️';
        renameButton.appendChild(iconSpan);

        const textSpan = document.createElement('span');
        textSpan.className = 'title-text';
        textSpan.textContent = '重命名清单';
        renameButton.appendChild(textSpan);

        renameButton.addEventListener('click', function(e) {
            e.stopPropagation();

            // 隐藏菜单
            contextMenu.style.display = 'none';
            contextMenu.classList.remove('visible');

            // 显示重命名对话框
            renameList(listName, elements);
        });

        contextMenu.appendChild(renameButton);

        // 添加删除选项
        const deleteButton = document.createElement('button');

        // 添加图标和文本
        const deleteIconSpan = document.createElement('span');
        deleteIconSpan.className = 'menu-icon';
        deleteIconSpan.innerHTML = '🗑️';
        deleteButton.appendChild(deleteIconSpan);

        const deleteTextSpan = document.createElement('span');
        deleteTextSpan.className = 'title-text';
        deleteTextSpan.textContent = '删除清单';
        deleteButton.appendChild(deleteTextSpan);

        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation();

            // 隐藏菜单
            contextMenu.style.display = 'none';
            contextMenu.classList.remove('visible');

            // 删除清单
            if (confirm(`确定要删除清单"${listName}"吗？`)) {
                delete todoData[listName];
                GM_setValue(GLOBAL_STORAGE_KEY, todoData);

                if (currentOpenedListName === listName) {
                    currentOpenedListName = null;
                }

                updatePanelContentKeepingState();
            }
        });

        contextMenu.appendChild(deleteButton);

        // 显示菜单
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';

        // 调整位置以确保在可视区域内
        const menuRect = contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (menuRect.right > viewportWidth) {
            contextMenu.style.left = (viewportWidth - menuRect.width - 10) + 'px';
        }

        if (menuRect.bottom > viewportHeight) {
            contextMenu.style.top = (viewportHeight - menuRect.height - 10) + 'px';
        }

        // 添加动画效果
        setTimeout(() => {
            contextMenu.classList.add('visible');
        }, 10);
    }

    // 重命名清单
    function renameList(oldName, elements) {
        const panel = elements.panel;

        // 创建重命名输入框
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = colors.panelBg;
        container.style.padding = '15px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        container.style.zIndex = '10001';
        container.style.width = '200px';

        // 添加标题
        const title = document.createElement('div');
        title.textContent = '重命名清单';
        title.style.marginBottom = '10px';
        title.style.fontWeight = 'bold';
        title.style.color = colors.textPrimary;
        container.appendChild(title);

        // 添加输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'list-edit-input';
        input.value = oldName;
        container.appendChild(input);

        // 添加按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.gap = '8px';
        container.appendChild(buttonContainer);

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.className = 'action-button';
        cancelButton.style.backgroundColor = '#999';
        cancelButton.style.flex = '1';
        buttonContainer.appendChild(cancelButton);

        // 确认按钮
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确定';
        confirmButton.className = 'action-button';
        confirmButton.style.flex = '1';
        buttonContainer.appendChild(confirmButton);

        // 添加到面板
        panel.appendChild(container);

        // 自动聚焦输入框
        setTimeout(() => input.focus(), 10);

        // 取消重命名
        function cancelRename() {
            panel.removeChild(container);
        }

        // 确认重命名
        function confirmRename() {
            const newName = input.value.trim();

            if (newName && newName !== oldName) {
                // 检查是否已存在同名清单
                if (todoData[newName]) {
                    alert('已存在同名清单！');
                    input.focus();
                    return;
                }

                // 重命名清单
                todoData[newName] = todoData[oldName];
                delete todoData[oldName];
                GM_setValue(GLOBAL_STORAGE_KEY, todoData);

                // 更新当前打开的清单名称
                if (currentOpenedListName === oldName) {
                    currentOpenedListName = newName;
                }

                // 更新面板
                updatePanelContentKeepingState();
            }

            // 移除输入框
            panel.removeChild(container);
        }

        // 事件监听
        cancelButton.addEventListener('click', cancelRename);
        confirmButton.addEventListener('click', confirmRename);

        // 按下回车键确认
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmRename();
                e.preventDefault();
            }
        });

        // 按下ESC键取消
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cancelRename();
                e.preventDefault();
            }
        });

        // 阻止事件冒泡
        container.addEventListener('click', e => e.stopPropagation());
    }

    // 更新面板内容的同时保持当前打开的清单状态
    function updatePanelContentKeepingState() {
        // 保存当前打开的清单的滚动位置
        let currentScrollTop = 0;
        if (currentOpenedListName) {
            const currentList = document.querySelector(`.todo-list-items[data-list="${currentOpenedListName}"]`);
            if (currentList) {
                const itemsContainer = currentList.querySelector('.todo-items-container');
                if (itemsContainer) {
                    currentScrollTop = itemsContainer.scrollTop;
                }
            }
        }

        // 确保面板保持打开状态
        globalElements.panel.style.display = 'flex';

        // 更新面板内容
        updatePanelContent(globalElements);

        // 如果有当前打开的清单，则重新打开它并恢复滚动位置
        if (currentOpenedListName) {
            const allListItems = document.querySelectorAll('.todo-list-items');
            allListItems.forEach(item => {
                if (item.getAttribute('data-list') === currentOpenedListName) {
                    item.style.display = 'block';
                    updateListItems(item, currentOpenedListName);
                    
                    // 恢复滚动位置
                    const itemsContainer = item.querySelector('.todo-items-container');
                    if (itemsContainer) {
                        itemsContainer.scrollTop = currentScrollTop;
                    }
                }
            });
        }
    }

    // 处理旧存储数据迁移
    function migrateOldData() {
        // 检查是否有旧数据
        const oldData = GM_getValue('todo-lists', null);
        if (oldData && Object.keys(oldData).length > 0) {
            // 读取现有的全局数据
            const globalData = GM_getValue(GLOBAL_STORAGE_KEY, {});
            
            // 合并数据（旧数据会覆盖全局数据中相同名称的清单）
            const mergedData = {...globalData, ...oldData};
            
            // 保存合并后的数据到全局存储
            GM_setValue(GLOBAL_STORAGE_KEY, mergedData);
            
            // 删除旧的存储键
            GM_deleteValue('todo-lists');
            
            // 如果用户刷新或关闭页面，也将迁移主题偏好设置
            const oldTheme = GM_getValue('todo-theme-preference', null);
            if (oldTheme) {
                GM_setValue('global-todo-theme-preference', oldTheme);
                GM_deleteValue('todo-theme-preference');
            }
            
            // 返回合并后的数据
            return mergedData;
        }
        
        // 如果没有旧数据，返回null
        return null;
    }

    // 初始化
    globalElements = createElements();
    initEvents(globalElements);
    
    // 尝试迁移旧数据
    const migratedData = migrateOldData();
    if (migratedData) {
        // 如果有迁移的数据，更新todoData引用
        Object.assign(todoData, migratedData);
    }
    
    updatePanelContent(globalElements);
})();