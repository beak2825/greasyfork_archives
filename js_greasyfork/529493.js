// ==UserScript==
// @name         个人待办事项清单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  浏览器右下角的个人待办事项清单，支持多个清单管理
// @author       Your Name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529493/%E4%B8%AA%E4%BA%BA%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9%E6%B8%85%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529493/%E4%B8%AA%E4%BA%BA%E5%BE%85%E5%8A%9E%E4%BA%8B%E9%A1%B9%E6%B8%85%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取用户主题设置
    let userThemePreference = GM_getValue('todo-theme-preference', 'auto');

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
            // 将背景颜色转换为RGB值并判断亮度
            const rgb = bodyBg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                // 计算亮度 (0.299*R + 0.587*G + 0.114*B)
                const brightness = (0.299 * parseInt(rgb[0]) + 0.587 * parseInt(rgb[1]) + 0.114 * parseInt(rgb[2])) / 255;
                return brightness < 0.5; // 亮度小于0.5认为是暗色模式
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

    // 样式定义 - 根据当前模式使用不同的颜色变量
    let colors = getThemeColors(darkMode);

    function getThemeColors(isDark) {
        return isDark ? {
            // 暗色模式颜色
            bg: '#2c2c2c',
            textPrimary: '#e0e0e0',
            textSecondary: '#a0a0a0',
            btnBg: '#3498db',
            btnBgHover: '#2980b9',
            panelBg: '#333333',
            headerBg: '#2c3e50',
            itemBg: '#3a3a3a',
            itemBgHover: '#444444',
            itemBorder: '#484848',
            inputBg: '#444444',
            inputBorder: '#555555',
            danger: '#e74c3c',
            listItemsBg: '#2a2a2a',
            borderColor: 'rgba(255,255,255,0.1)'
        } : {
            // 亮色模式颜色
            bg: 'white',
            textPrimary: '#333333',
            textSecondary: '#666666',
            btnBg: '#3498db',
            btnBgHover: '#2980b9',
            panelBg: 'white',
            headerBg: '#3498db',
            itemBg: '#f5f5f5',
            itemBgHover: '#e8e8e8',
            itemBorder: '#f1f1f1',
            inputBg: 'white',
            inputBorder: '#ddd',
            danger: '#ff6b6b',
            listItemsBg: '#fafafa',
            borderColor: '#eee'
        };
    }

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

            .add-item-form {
                display: flex;
                margin-top: 8px;
                margin-bottom: 10px;
            }

            .add-item-form input {
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

            .add-item-form button {
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

            #add-list-form {
                display: flex;
                margin-top: 20px;
            }

            #add-list-form input {
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

            #add-list-form button {
                padding: 6px 10px;
                background-color: ${colors.btnBg};
                color: white;
                border: none;
                border-radius: 0 4px 4px 0;
                cursor: pointer;
                transition: background-color 0.3s;
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

            .context-menu button:active {
                background-color: ${darkMode ? '#555555' : '#eaeaea'};
            }

            .context-menu .list-count {
                margin-left: auto;
                background-color: ${colors.btnBg};
                color: white;
                border-radius: 12px;
                padding: 3px 8px;
                font-size: 12px;
                min-width: 20px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                transition: background-color 0.3s;
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

            .context-menu .title-text {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 180px;
                white-space: nowrap;
                display: inline-block;
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

            .context-menu button:hover .menu-icon {
                color: ${colors.btnBg};
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

            .action-buttons {
                display: flex;
                gap: 8px;
                margin-top: 15px;
            }

            .action-button {
                flex: 1;
                padding: 6px;
                background-color: ${colors.btnBg};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }

            .action-button:hover {
                background-color: ${colors.btnBgHover};
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
        `;
    }

    // 应用当前主题样式
    let styleElement = GM_addStyle(getStyles(colors));

    // 数据存储和获取
    const todoData = GM_getValue('todo-lists', {});

    // 当前打开的清单名称
    let currentOpenedListName = null;

    // 全局元素引用
    let globalElements;

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
            e.stopPropagation();

            // 如果显示面板，则更新内容
            if (elements.panel.style.display === 'flex') {
                updatePanelContent(elements);
            }
        });

        // 点击页面其他地方关闭面板和菜单
        document.addEventListener('click', function(e) {
            // 检查点击目标是否在面板内或是否是待办按钮
            // 如果是，则不关闭面板
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
        elements.panel.addEventListener('click', function(e) {
            e.stopPropagation();
        });

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
                    evt.stopPropagation(); // 阻止事件冒泡
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

            e.stopPropagation();
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

        // 添加新清单的函数
        function addNewList(e) {
            if (e) e.stopPropagation(); // 阻止事件冒泡

            const listName = addListInput.value.trim();
            if (listName) {
                // 创建新清单
                if (!todoData[listName]) {
                    todoData[listName] = [];
                    GM_setValue('todo-lists', todoData);
                    updatePanelContent(elements);
                    addListInput.value = '';

                    // 确保面板保持打开状态
                    elements.panel.style.display = 'flex';
                }
            }
        }

        // 点击添加按钮
        addListButton.addEventListener('click', addNewList);

        // 按下回车键
        addListInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNewList(e);
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
        exportButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            exportData();
        });
        actionButtons.appendChild(exportButton);

        // 导入按钮
        const importButton = document.createElement('button');
        importButton.className = 'action-button';
        importButton.textContent = '导入数据';
        importButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            importData();
        });
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
            GM_setValue('todo-theme-preference', userThemePreference);

            // 更新主题
            darkMode = userThemePreference === 'dark' ||
                     (userThemePreference === 'auto' && isDarkMode());

            // 更新颜色方案
            colors = getThemeColors(darkMode);

            // 更新样式
            styleElement.innerHTML = getStyles(colors);

            // 更新内容
            updatePanelContentKeepingState();
        });

        themeToggle.appendChild(themeSelect);
        content.appendChild(themeToggle);

        // 阻止表单事件冒泡
        addListForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 阻止操作按钮事件冒泡
        actionButtons.addEventListener('click', function(e) {
            e.stopPropagation();
        });
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

            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = event => {
                try {
                    const importedData = JSON.parse(event.target.result);

                    // 验证导入的数据结构
                    if (typeof importedData === 'object') {
                        // 确认导入
                        if (confirm('确定要导入数据吗？这将覆盖当前的所有待办清单。')) {
                            Object.assign(todoData, importedData);
                            GM_setValue('todo-lists', todoData);
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
        // 保存滚动位置
        const scrollTop = container.scrollTop;

        container.innerHTML = '';

        // 获取清单中的所有项目
        const items = todoData[listName] || [];

        // 创建待办事项列表容器
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'todo-items-container';
        container.appendChild(itemsContainer);

        // 添加现有项目 - 保持原顺序，新添加的项目会在尾部
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'todo-item';
            itemElement.setAttribute('data-index', index);

            // 复选框 - 放在最前面
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

            // 删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '×';
            itemElement.appendChild(deleteButton);

            itemsContainer.appendChild(itemElement);

            // 复选框事件
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation(); // 阻止事件冒泡

                todoData[listName][index].completed = checkbox.checked;
                GM_setValue('todo-lists', todoData);
                if (checkbox.checked) {
                    span.className = 'completed';
                } else {
                    span.className = '';
                }

                // 记住这个清单是打开的
                currentOpenedListName = listName;

                // 更新主面板内容，保持当前打开的清单状态
                updatePanelContentKeepingState();
            });

            // 删除按钮事件
            deleteButton.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡

                todoData[listName].splice(index, 1);
                GM_setValue('todo-lists', todoData);

                // 记住这个清单是打开的
                currentOpenedListName = listName;

                // 更新主面板内容，保持当前打开的清单状态
                updatePanelContentKeepingState();
            });

            // 阻止项目元素事件冒泡
            itemElement.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // 添加项目表单 - 移到待办事项列表后面
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
        setTimeout(() => {
            addItemInput.focus();
        }, 10);

        // 阻止表单事件冒泡
        addItemForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 添加新待办事项的功能
        function addNewItem(e) {
            if (e) e.stopPropagation(); // 阻止事件冒泡

            const itemText = addItemInput.value.trim();
            if (itemText) {
                // 添加新待办事项到列表尾部
                todoData[listName].push({
                    text: itemText,
                    completed: false,
                    createdAt: new Date().getTime()
                });
                GM_setValue('todo-lists', todoData);

                // 记住这个清单是打开的
                currentOpenedListName = listName;

                // 更新主面板内容，保持当前打开的清单状态
                updatePanelContentKeepingState();

                // 清空输入框
                addItemInput.value = '';

                // 自动聚焦输入框
                setTimeout(() => {
                    const newInput = document.querySelector(`.todo-list-items[data-list="${listName}"] .add-item-form input`);
                    if (newInput) {
                        newInput.focus();
                    }
                }, 10);
            }
        }

        // 点击添加按钮
        addItemButton.addEventListener('click', addNewItem);

        // 按下回车键
        addItemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNewItem(e);
                e.preventDefault();
            }
        });

        // 添加删除清单按钮
        const deleteListButton = document.createElement('button');
        deleteListButton.className = 'delete-list-button';
        deleteListButton.textContent = '删除此清单';

        deleteListButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡

            // 直接删除，不需要确认
            delete todoData[listName];
            GM_setValue('todo-lists', todoData);

            // 如果删除的是当前打开的清单，则重置当前打开的清单
            if (currentOpenedListName === listName) {
                currentOpenedListName = null;
            }

            // 更新主面板内容，保持当前打开的清单状态
            updatePanelContentKeepingState();
        });

        container.appendChild(deleteListButton);

        // 阻止容器事件冒泡
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 恢复滚动位置
        container.scrollTop = scrollTop;
    }

    // 更新面板内容的同时保持当前打开的清单状态
    function updatePanelContentKeepingState() {
        // 确保面板保持打开状态
        globalElements.panel.style.display = 'flex';

        // 更新面板内容
        updatePanelContent(globalElements);

        // 如果有当前打开的清单，则重新打开它
        if (currentOpenedListName) {
            const allListItems = document.querySelectorAll('.todo-list-items');
            allListItems.forEach(item => {
                if (item.getAttribute('data-list') === currentOpenedListName) {
                    item.style.display = 'block';
                    updateListItems(item, currentOpenedListName);
                }
            });
        }
    }

    // 初始化
    globalElements = createElements();
    initEvents(globalElements);
    updatePanelContent(globalElements);

    console.log('待办事项清单脚本已加载');
})();