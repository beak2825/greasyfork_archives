// ==UserScript==
// @name         全国统一规范电子税务局税号填写辅助工具
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  在电子税务局旁边显示一个小窗口，方便登录与切换不同的公司，支持批量添加和制表符分隔导入
// @author       Herohub
// @match        https://*.chinatax.gov.cn:8443/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525379/%E5%85%A8%E5%9B%BD%E7%BB%9F%E4%B8%80%E8%A7%84%E8%8C%83%E7%94%B5%E5%AD%90%E7%A8%8E%E5%8A%A1%E5%B1%80%E7%A8%8E%E5%8F%B7%E5%A1%AB%E5%86%99%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525379/%E5%85%A8%E5%9B%BD%E7%BB%9F%E4%B8%80%E8%A7%84%E8%8C%83%E7%94%B5%E5%AD%90%E7%A8%8E%E5%8A%A1%E5%B1%80%E7%A8%8E%E5%8F%B7%E5%A1%AB%E5%86%99%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断是否为登录页面或切换公司页面，若都不是则直接退出脚本执行
    const isLoginPage = window.location.href.includes('login?redirect_uri');
    const isIdentitySwitchPage = window.location.href.includes('identitySwitch');
    if (!isLoginPage &&!isIdentitySwitchPage) return;

    // 创建浮窗元素并设置样式
    const createFloatWindow = () => {
        const floatWindow = document.createElement('div');
        Object.assign(floatWindow.style, {
            position: 'fixed',
            top: '50%',
            right: '0', // 贴紧右侧
            transform: 'translateY(-50%)',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '8px 0 0 8px', // 左侧圆角，右侧直角
            boxShadow: '0 4px 8px rgba(0,0,0,.1)',
            fontFamily: 'Arial,sans-serif',
            zIndex: 10000,
            overflow: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' // 更平滑的宽度变化动画
        });
        return floatWindow;
    };

    const floatWindow = createFloatWindow();
    document.body.appendChild(floatWindow);

    // 创建左侧调整宽度的手柄
    const leftResizeHandle = document.createElement('div');
    Object.assign(leftResizeHandle.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '5px',
        height: '100%',
        cursor: 'ew-resize',
        background: 'transparent',
        zIndex: 10,
        display: 'none',
        transition: 'background 0.2s ease'
    });
    leftResizeHandle.title = '拖动调整宽度';
    floatWindow.appendChild(leftResizeHandle);

    // 创建按钮元素并设置样式和点击事件
    const createButton = (text, clickHandler, isDelete = false, customStyles = {}) => {
        const button = document.createElement('button');
        const styles = {
            marginRight: '5px',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            background: isDelete? '#dc3545' : '#007BFF',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
           ...customStyles
        };
        Object.assign(button.style, styles);
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        // 鼠标悬停效果
        button.addEventListener('mouseover', () => {
            button.style.background = isDelete? '#c82333' : '#0056b3';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = isDelete? '#dc3545' : '#007BFF';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        return button;
    };

    // 创建拖动按钮
    const createDragButton = () => {
        const dragButton = document.createElement('button');
        Object.assign(dragButton.style, {
            marginRight: '5px',
            padding: '2px 6px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            background: '#f8f9fa',
            color: '#6c757d',
            cursor: 'grab',
            fontSize: '12px',
            transition: 'all 0.2s ease'
        });
        dragButton.innerHTML = '☰'; // 汉堡图标作为拖动指示器
        dragButton.title = '拖动调整顺序';

        // 拖动时改变样式
        dragButton.addEventListener('mousedown', () => {
            dragButton.style.cursor = 'grabbing';
            dragButton.style.background = '#e9ecef';
            dragButton.style.transform = 'scale(1.1)';
        });

        dragButton.addEventListener('mouseup', () => {
            dragButton.style.cursor = 'grab';
            dragButton.style.background = '#f8f9fa';
            dragButton.style.transform = 'scale(1)';
        });

        dragButton.addEventListener('mouseover', () => {
            if (dragButton.style.cursor!== 'grabbing') {
                dragButton.style.background = '#e9ecef';
                dragButton.style.transform = 'scale(1.05)';
            }
        });

        dragButton.addEventListener('mouseout', () => {
            if (dragButton.style.cursor!== 'grabbing') {
                dragButton.style.background = '#f8f9fa';
                dragButton.style.transform = 'scale(1)';
            }
        });

        return dragButton;
    };

    // 定义全局变量
    let isEditMode = false;
    let lastSelectedItem = GM_getValue('lastSelectedItem', null);
    let originalWidth = null;
    let windowWidth = GM_getValue('windowWidth', 450); // 统一窗口宽度
    let isAutoFillAccount = GM_getValue('isAutoFillAccount', false);
    let accountInfo = GM_getValue('accountInfo', null);
    let isCollapsed = GM_getValue('isCollapsed', false);
    let isInitialLoad = true; // 标记是否为初始加载
    // 拖动相关变量
    let draggedItem = null;
    let initialY = 0;
    let initialOffsetY = 0;

    // 收起/展开按钮
    const toggleCollapseButton = document.createElement('div');
    Object.assign(toggleCollapseButton.style, {
        position: 'fixed',
        right: isCollapsed? '0' : windowWidth + 'px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '80px',
        background: '#2196F3',
        color: '#ffffff',
        border: '2px solid #0b7dda',
        borderRadius: '8px 0 0 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '-3px 0 6px rgba(0,0,0,0.2)',
        zIndex: 9999,
        fontSize: '24px',
        fontWeight: 'bold',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: '1',
        pointerEvents: 'auto'
    });

    // 根据存储的状态设置初始箭头
    toggleCollapseButton.innerHTML = isCollapsed? '≪' : '≫';
    toggleCollapseButton.addEventListener('click', toggleCollapse);

    // 添加悬停效果
    toggleCollapseButton.addEventListener('mouseover', () => {
        toggleCollapseButton.style.background = '#0b7dda';
        toggleCollapseButton.style.transform = `translateY(-50%) scale(1.1)`;
    });

    toggleCollapseButton.addEventListener('mouseout', () => {
        toggleCollapseButton.style.background = '#2196F3';
        toggleCollapseButton.style.transform = 'translateY(-50%) scale(1)';
    });

    document.body.appendChild(toggleCollapseButton);

    // 主内容容器
    const mainContent = document.createElement('div');
    // 根据存储的状态设置初始显示
    mainContent.style.display = isCollapsed? 'none' : 'block';
    floatWindow.appendChild(mainContent);

    // 添加按钮
    const addButton = createButton('添加', addItem);
    mainContent.appendChild(addButton);

    // 编辑/完成按钮
    let editToggleButton = createButton('编辑', toggleEditMode);
    mainContent.appendChild(editToggleButton);

    // 设置按钮（新增）
    const settingsButton = createButton('设置', openSettingsWindow);
    mainContent.appendChild(settingsButton);

    // 导入按钮
    const importButton = createButton('导入', importData);
    importButton.style.display = 'none';
    mainContent.appendChild(importButton);

    // 导出按钮
    const exportButton = createButton('导出', exportData);
    exportButton.style.display = 'none';
    mainContent.appendChild(exportButton);

    // 分割线
    const separator = document.createElement('hr');
    separator.style.cssText = 'margin:15px 0;border:none;border-top:1px solid #e0e0e0';
    mainContent.appendChild(separator);

    // 内容列表容器
    const itemList = document.createElement('div');
    itemList.className = 'item-list-container';
    itemList.style.transition = 'all 0.2s ease';
    mainContent.appendChild(itemList);

    // 设置左侧调整功能
    setupLeftResizeFunctionality();

    // 初始应用收起状态样式
    if (isCollapsed) {
        floatWindow.style.width = '0px';
        floatWindow.style.padding = '0';
    } else {
        floatWindow.style.width = windowWidth + 'px';
    }

    // 加载已保存的税号内容
    const savedItems = GM_getValue('autoFillItems', []);
    savedItems.forEach(item => {
        addItemToWindow(item.content, item.note, itemList);
    });

    // 收起/展开功能
    function toggleCollapse() {
        isCollapsed =!isCollapsed;
        GM_setValue('isCollapsed', isCollapsed);

        if (isCollapsed) {
            mainContent.style.display = 'none';
            floatWindow.style.width = '0px';
            floatWindow.style.padding = '0';
            toggleCollapseButton.innerHTML = '≪';
            toggleCollapseButton.style.right = '0';
        } else {
            mainContent.style.display = 'block';
            floatWindow.style.width = windowWidth + 'px';
            floatWindow.style.padding = '15px';
            toggleCollapseButton.innerHTML = '≫';
            toggleCollapseButton.style.right = windowWidth + 'px';
        }
    }

    // 左侧边缘调整宽度功能
    function setupLeftResizeFunctionality() {
        let isResizing = false;
        let startX, startWidth;

        leftResizeHandle.addEventListener('mousedown', (e) => {
            if (!isEditMode || isCollapsed) return;

            isResizing = true;
            startX = e.clientX;
            startWidth = parseFloat(getComputedStyle(floatWindow).width);

            document.body.style.cursor = 'ew-resize';
            floatWindow.style.transition = 'none';
            leftResizeHandle.style.background = 'rgba(0, 123, 255, 0.3)';

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });

        function resize(e) {
            if (!isResizing) return;
            e.preventDefault();

            const widthDiff = startX - e.clientX;
            const newWidth = Math.max(400, startWidth + widthDiff);

            floatWindow.style.width = `${newWidth}px`;

            if (!isCollapsed) {
                toggleCollapseButton.style.right = newWidth + 'px';
            }
        }

        function stopResize() {
            isResizing = false;
            document.body.style.cursor = '';
            floatWindow.style.transition = '';
            leftResizeHandle.style.background = 'transparent';

            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);

            windowWidth = parseFloat(getComputedStyle(floatWindow).width);
            GM_setValue('windowWidth', windowWidth);
        }
    }

    // 添加新条目函数
    function addItem() {
        const modal = createAddModal();
        document.body.appendChild(modal);
    }

    // 支持批量添加的模态框
    function createAddModal() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '350px',
            maxHeight: '70vh',
            overflowY: 'auto',
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.95)',
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加模态框背景遮罩
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(overlay);

        // 触发动画
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
            overlay.style.opacity = '0.5';
        }, 10);

        // 存储多组公司数据的数组
        const addFormItems = [{ taxNumber: '', note: '' }];
        // 输入框组容器（用于动态渲染）
        const inputGroupsContainer = document.createElement('div');
        inputGroupsContainer.style.display = 'flex';
        inputGroupsContainer.style.flexDirection = 'column';
        inputGroupsContainer.style.gap = '10px';
        modal.appendChild(inputGroupsContainer);

        // +号添加按钮
        const addInputBtn = document.createElement('button');
        Object.assign(addInputBtn.style, {
            padding: '6px 12px',
            border: '1px dashed #007BFF',
            borderRadius: '3px',
            background: 'transparent',
            color: '#007BFF',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
        });
        addInputBtn.innerHTML = '<span>+</span> 添加更多公司';
        // +号按钮悬停效果
        addInputBtn.addEventListener('mouseover', () => {
            addInputBtn.style.background = 'rgba(0, 123, 255, 0.05)';
            addInputBtn.style.borderStyle = 'solid';
        });
        addInputBtn.addEventListener('mouseout', () => {
            addInputBtn.style.background = 'transparent';
            addInputBtn.style.borderStyle = 'dashed';
        });
        // +号按钮点击事件：新增输入框组
        addInputBtn.addEventListener('click', () => {
            addFormItems.push({ taxNumber: '', note: '' });
            renderInputGroups();
            modal.scrollTop = modal.scrollHeight;
        });
        modal.appendChild(addInputBtn);

        // 渲染输入框组（根据addFormItems数组动态生成）
        function renderInputGroups() {
            inputGroupsContainer.innerHTML = '';
            
            addFormItems.forEach((item, index) => {
                // 单个输入框组容器
                const inputGroup = document.createElement('div');
                Object.assign(inputGroup.style, {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '10px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '5px'
                });

                // 组标题
                const groupTitle = document.createElement('div');
                groupTitle.style.fontSize = '13px';
                groupTitle.style.color = '#666';
                groupTitle.style.marginBottom = '2px';
                groupTitle.textContent = `公司 ${index + 1}`;
                inputGroup.appendChild(groupTitle);

                // 税号输入框
                const taxNumberInput = document.createElement('input');
                taxNumberInput.placeholder = '请输入税号';
                taxNumberInput.value = item.taxNumber;
                taxNumberInput.style.padding = '8px';
                taxNumberInput.style.border = '1px solid #ccc';
                taxNumberInput.style.borderRadius = '3px';
                taxNumberInput.style.transition = 'border-color 0.2s ease';
                // 同步输入值到数组
                taxNumberInput.addEventListener('input', (e) => {
                    addFormItems[index].taxNumber = e.target.value.trim();
                });
                taxNumberInput.addEventListener('focus', () => {
                    taxNumberInput.style.borderColor = '#007BFF';
                    taxNumberInput.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
                });
                taxNumberInput.addEventListener('blur', () => {
                    taxNumberInput.style.borderColor = '#ccc';
                    taxNumberInput.style.boxShadow = 'none';
                });
                inputGroup.appendChild(taxNumberInput);

                // 备注输入框
                const noteInput = document.createElement('input');
                noteInput.placeholder = '请输入备注（如公司名称）';
                noteInput.value = item.note;
                noteInput.style.padding = '8px';
                noteInput.style.border = '1px solid #ccc';
                noteInput.style.borderRadius = '3px';
                noteInput.style.transition = 'border-color 0.2s ease';
                // 同步输入值到数组
                noteInput.addEventListener('input', (e) => {
                    addFormItems[index].note = e.target.value.trim();
                });
                noteInput.addEventListener('focus', () => {
                    noteInput.style.borderColor = '#007BFF';
                    noteInput.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
                });
                noteInput.addEventListener('blur', () => {
                    noteInput.style.borderColor = '#ccc';
                    noteInput.style.boxShadow = 'none';
                });
                inputGroup.appendChild(noteInput);

                // 删除输入框组按钮（至少保留1组）
                if (addFormItems.length > 1) {
                    const deleteGroupBtn = document.createElement('button');
                    Object.assign(deleteGroupBtn.style, {
                        padding: '3px 8px',
                        border: 'none',
                        borderRadius: '3px',
                        background: '#dc3545',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px',
                        alignSelf: 'flex-end',
                        transition: 'background 0.2s ease'
                    });
                    deleteGroupBtn.textContent = '删除此公司';
                    deleteGroupBtn.addEventListener('mouseover', () => {
                        deleteGroupBtn.style.background = '#c82333';
                    });
                    deleteGroupBtn.addEventListener('mouseout', () => {
                        deleteGroupBtn.style.background = '#dc3545';
                    });
                    // 删除逻辑
                    deleteGroupBtn.addEventListener('click', () => {
                        addFormItems.splice(index, 1);
                        renderInputGroups();
                    });
                    inputGroup.appendChild(deleteGroupBtn);
                }

                inputGroupsContainer.appendChild(inputGroup);
            });
        }

        // 初始渲染1组输入框
        renderInputGroups();

        // 确认批量添加按钮
        const confirmButton = createButton('确认批量添加', () => {
            // 验证所有输入组（税号和备注都不能为空）
            const validItems = addFormItems.filter(item => item.taxNumber && item.note);
            const invalidCount = addFormItems.length - validItems.length;

            if (invalidCount > 0) {
                alert(`有 ${invalidCount} 组数据未填写完整（税号和备注都不能为空），请检查后重试！`);
                return;
            }

            // 批量保存到本地存储
            const existingItems = GM_getValue('autoFillItems', []);
            const newItems = [...existingItems,...validItems];
            GM_setValue('autoFillItems', newItems);

            // 批量添加到窗口列表（带动画）
            validItems.forEach((item, i) => {
                setTimeout(() => {
                    addItemToWindow(item.taxNumber, item.note, itemList);
                }, i * 100);
            });

            // 关闭模态框
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
                alert(`批量添加成功！共添加 ${validItems.length} 家公司`);
            }, 300);
        });
        modal.appendChild(confirmButton);

        const cancelButton = createButton('取消', () => {
            // 关闭动画
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            }, 300);
        }, true);
        modal.appendChild(cancelButton);

        // 点击遮罩关闭模态框
        overlay.addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            }, 300);
        });

        return modal;
    }

    // 打开设置窗口（新增）
    function openSettingsWindow() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '350px',
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.95)',
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加模态框背景遮罩
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(overlay);

        // 标题
        const title = document.createElement('h3');
        title.style.margin = '0';
        title.style.paddingBottom = '10px';
        title.style.borderBottom = '1px solid #eee';
        title.textContent = '系统设置';
        modal.appendChild(title);

        // 触发动画
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
            overlay.style.opacity = '0.5';
        }, 10);

        // 账号自动填充设置区域
        const accountSettings = document.createElement('div');
        accountSettings.style.display = 'flex';
        accountSettings.style.flexDirection = 'column';
        accountSettings.style.gap = '10px';
        
        const accountTitle = document.createElement('div');
        accountTitle.style.fontWeight = 'bold';
        accountTitle.textContent = '账号密码自动填充';
        accountSettings.appendChild(accountTitle);

        // 自动填充开关
        const autoFillSwitchContainer = document.createElement('div');
        autoFillSwitchContainer.style.display = 'flex';
        autoFillSwitchContainer.style.alignItems = 'center';
        autoFillSwitchContainer.style.justifyContent = 'space-between';
        
        const switchLabel = document.createElement('span');
        switchLabel.textContent = '启用账号密码自动填充';
        autoFillSwitchContainer.appendChild(switchLabel);
        
        const accountAutoFillSwitch = createButton(
            isAutoFillAccount? '开启' : '关闭',
            () => toggleAccountAutoFill(accountAutoFillSwitch),
            isAutoFillAccount? false : true,
            { padding: '5px 15px' }
        );
        autoFillSwitchContainer.appendChild(accountAutoFillSwitch);
        accountSettings.appendChild(autoFillSwitchContainer);

        // 账号密码输入区域（仅当开启时显示）
        const accountCredentials = document.createElement('div');
        accountCredentials.style.display = isAutoFillAccount? 'flex' : 'none';
        accountCredentials.style.flexDirection = 'column';
        accountCredentials.style.gap = '10px';
        accountCredentials.style.padding = '10px';
        accountCredentials.style.background = '#f8f9fa';
        accountCredentials.style.borderRadius = '5px';

        const accountInput = document.createElement('input');
        accountInput.placeholder = '请输入账号';
        accountInput.value = accountInfo?.account || '';
        accountInput.style.padding = '8px';
        accountInput.style.border = '1px solid #ccc';
        accountInput.style.borderRadius = '3px';
        accountInput.addEventListener('focus', () => {
            accountInput.style.borderColor = '#007BFF';
            accountInput.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        });
        accountInput.addEventListener('blur', () => {
            accountInput.style.borderColor = '#ccc';
            accountInput.style.boxShadow = 'none';
        });
        accountCredentials.appendChild(accountInput);

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = '请输入密码';
        passwordInput.value = accountInfo?.password || '';
        passwordInput.style.padding = '8px';
        passwordInput.style.border = '1px solid #ccc';
        passwordInput.style.borderRadius = '3px';
        passwordInput.addEventListener('focus', () => {
            passwordInput.style.borderColor = '#007BFF';
            passwordInput.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        });
        passwordInput.addEventListener('blur', () => {
            passwordInput.style.borderColor = '#ccc';
            passwordInput.style.boxShadow = 'none';
        });
        accountCredentials.appendChild(passwordInput);

        // 保存账号密码按钮
        const saveAccountBtn = createButton('保存账号密码', () => {
            const account = accountInput.value.trim();
            const password = passwordInput.value.trim();
            if (!account ||!password) {
                alert('账号和密码都不能为空，请重新输入。');
                return;
            }
            accountInfo = { account, password };
            GM_setValue('accountInfo', accountInfo);
            
            // 保存成功提示
            saveAccountBtn.textContent = '已保存！';
            saveAccountBtn.style.background = '#28a745';
            
            // 自动填充到页面
            setTimeout(() => {
                const accountInputOnPage = findElementInIframes('input[placeholder="居民身份证号码/手机号码/用户名"]') ||
                                         findElementInIframes('input.el-input__inner[placeholder="居民身份证号码/手机号码/用户名"]');
                const passwordInputOnPage = findElementInIframes('input[placeholder="个人用户密码"]') ||
                                          findElementInIframes('input.el-input__inner[placeholder="个人用户密码"]');
                if (accountInputOnPage) {
                    accountInputOnPage.value = account;
                    triggerInputEvents(accountInputOnPage);
                }
                if (passwordInputOnPage) {
                    passwordInputOnPage.value = password;
                    triggerInputEvents(passwordInputOnPage);
                }
                
                // 恢复按钮状态
                setTimeout(() => {
                    saveAccountBtn.textContent = '保存账号密码';
                    saveAccountBtn.style.background = '#007BFF';
                }, 1500);
            }, 500);
        });
        accountCredentials.appendChild(saveAccountBtn);

        accountSettings.appendChild(accountCredentials);
        modal.appendChild(accountSettings);

        // 按钮区域
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
        
        const closeButton = createButton('关闭', () => {
            // 关闭动画
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            }, 300);
        }, true);
        buttonContainer.appendChild(closeButton);
        modal.appendChild(buttonContainer);

        // 点击遮罩关闭模态框
        overlay.addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            }, 300);
        });

        document.body.appendChild(modal);

        // 二级窗口内的自动填充切换函数
        function toggleAccountAutoFill(switchButton) {
            isAutoFillAccount =!isAutoFillAccount;
            switchButton.textContent = isAutoFillAccount? '开启' : '关闭';
            switchButton.style.background = isAutoFillAccount? '#007BFF' : '#dc3545';
            GM_setValue('isAutoFillAccount', isAutoFillAccount);

            // 显示/隐藏账号密码输入区域
            accountCredentials.style.display = isAutoFillAccount? 'flex' : 'none';

            if (isAutoFillAccount) {
                // 如果开启且没有账号信息，提示用户输入
                if (!accountInfo || (!accountInfo.account &&!accountInfo.password)) {
                    setTimeout(() => {
                        accountInput.focus();
                    }, 300);
                } else {
                    // 自动填充到页面
                    setTimeout(() => {
                        const accountInputOnPage = findElementInIframes('input[placeholder="居民身份证号码/手机号码/用户名"]') ||
                                               findElementInIframes('input.el-input__inner[placeholder="居民身份证号码/手机号码/用户名"]');
                        const passwordInputOnPage = findElementInIframes('input[placeholder="个人用户密码"]') ||
                                                findElementInIframes('input.el-input__inner[placeholder="个人用户密码"]');
                        if (accountInputOnPage) {
                            accountInputOnPage.value = accountInfo.account;
                            triggerInputEvents(accountInputOnPage);
                        }
                        if (passwordInputOnPage) {
                            passwordInputOnPage.value = accountInfo.password;
                            triggerInputEvents(passwordInputOnPage);
                        }
                    }, 500);
                }
            } else {
                // 关闭时清空页面上的账号密码
                accountInfo = null;
                GM_setValue('accountInfo', null);
                const accountInputOnPage = findElementInIframes('input[placeholder="居民身份证号码/手机号码/用户名"]') ||
                                           findElementInIframes('input.el-input__inner[placeholder="居民身份证号码/手机号码/用户名"]');
                const passwordInputOnPage = findElementInIframes('input[placeholder="个人用户密码"]') ||
                                            findElementInIframes('input.el-input__inner[placeholder="个人用户密码"]');
                if (accountInputOnPage) {
                    accountInputOnPage.value = '';
                    triggerInputEvents(accountInputOnPage);
                }
                if (passwordInputOnPage) {
                    passwordInputOnPage.value = '';
                    triggerInputEvents(passwordInputOnPage);
                }
            }
        }
    }

    // 辅助函数：查找包含特定文本的元素
    function findElementWithText(container, selector, text) {
        const elements = container.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.trim().toLowerCase().includes(text.trim().toLowerCase())) {
                return elements[i];
            }
        }
        return null;
    }

    // 在主文档和 iframe 中查找元素
    function findElementInIframes(selector, text = null) {
        // 先在主文档中查找
        let element;
        if (text) {
            element = findElementWithText(document, selector, text);
        } else {
            element = document.querySelector(selector);
        }

        if (element) return element;

        // 再在所有 iframe 中查找
        const iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                const doc = iframes[i].contentDocument;
                if (text) {
                    element = findElementWithText(doc, selector, text);
                } else {
                    element = doc.querySelector(selector);
                }
                if (element) {
                    return element;
                }
            } catch (e) {
                console.log('跨域iframe无法访问，已跳过:', e);
                continue;
            }
        }
        return null;
    }

    // 将新条目添加到窗口列表中
    function addItemToWindow(content, note, container) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'tax-item';
        Object.assign(itemDiv.style, {
            padding: '8px 0',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
            transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '5px',
            opacity: '0',
            transform: 'translateY(5px)'
        });

        // 触发淡入动画
        setTimeout(() => {
            itemDiv.style.opacity = '1';
            itemDiv.style.transform = 'translateY(0)';
        }, 50);

        // 创建拖动按钮容器（默认隐藏）
        const dragContainer = document.createElement('div');
        dragContainer.className = 'drag-container';
        dragContainer.style.display = 'none';
        const dragButton = createDragButton();
        dragContainer.appendChild(dragButton);
        itemDiv.appendChild(dragContainer);

        const textSpan = document.createElement('span');
        textSpan.textContent = note;
        textSpan.style.flexGrow = 1;
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap';
        itemDiv.appendChild(textSpan);

        // 创建编辑和删除按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';
        buttonContainer.style.display = 'flex';

        // 编辑按钮
        const editBtn = createButton(
            '编辑',
            () => editItem(itemDiv, content, note),
            false,
            { padding: '3px 8px', fontSize: '12px', marginRight: '3px' }
        );
        editBtn.className = 'edit-btn';
        editBtn.style.display = 'none';

        // 删除按钮
        const deleteBtn = createButton(
            '删除',
            () => deleteItem(itemDiv, content),
            true,
            { padding: '3px 8px', fontSize: '12px' }
        );
        deleteBtn.className = 'delete-btn';
        deleteBtn.style.display = 'none';

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);
        itemDiv.appendChild(buttonContainer);

        // 点击条目文本区域填充税号
        textSpan.addEventListener('click', () => {
            if (isEditMode) return;

            setTimeout(() => {
                // 查找税号输入框
                let taxInput = findElementInIframes('input[placeholder="统一社会信用代码/纳税人识别号"]') ||
                               findElementInIframes('input.el-input__inner[placeholder="统一社会信用代码/纳税人识别号"]');

                if (!taxInput) {
                    if (isLoginPage) {
                        taxInput = findElementInIframes('input.el-input__inner', '统一社会信用代码/纳税人识别号') ||
                                  findElementInIframes('input.el-input__inner');
                    } else if (isIdentitySwitchPage) {
                        taxInput = findElementInIframes('input.el-input__inner', '统一社会信用代码/纳税人识别号') ||
                                  findElementInIframes('input.el-input__inner', '请输入纳税人识别号') ||
                                  findElementInIframes('input.el-input__inner');
                    }
                }

                if (taxInput) {
                    taxInput.value = content;
                    triggerInputEvents(taxInput);

                    // 自动点击查询、确定和切换按钮
                    setTimeout(() => {
                        let actionButton = findElementInIframes('button.el-button.el-button--primary', '查询');
                        if (!actionButton) {
                            actionButton = findElementInIframes('button.el-button.el-button--primary', '确定');
                        }

                        if (actionButton) {
                            actionButton.click();
                            console.log(`已点击${actionButton.textContent.trim()}按钮`);

                            // 检查切换按钮
                            setTimeout(() => {
                                const findAllSwitchButtons = () => {
                                    const findAllElementsByText = (container, selector, text) => {
                                        const elements = container.querySelectorAll(selector);
                                        const result = [];
                                        for (let i = 0; i < elements.length; i++) {
                                            if (elements[i].textContent.trim().toLowerCase().includes(text.trim().toLowerCase())) {
                                                result.push(elements[i]);
                                            }
                                        }
                                        return result;
                                    };

                                    let switchButtons = findAllElementsByText(document, 'button.el-button.el-button--text', '切换');
                                    const iframes = document.querySelectorAll('iframe');
                                    for (let i = 0; i < iframes.length; i++) {
                                        try {
                                            const doc = iframes[i].contentDocument;
                                            const iframeButtons = findAllElementsByText(doc, 'button.el-button.el-button--text', '切换');
                                            switchButtons = switchButtons.concat(iframeButtons);
                                        } catch (e) {
                                            console.log('跨域iframe无法访问，已跳过:', e);
                                            continue;
                                        }
                                    }
                                    return switchButtons;
                                };

                                let switchButtons = findAllSwitchButtons();
                                const maxChecks = 20;
                                const checkInterval = 500;
                                let checkCount = 0;

                                const checkTimer = setInterval(() => {
                                    checkCount++;
                                    switchButtons = findAllSwitchButtons();

                                    if (switchButtons.length === 1) {
                                        clearInterval(checkTimer);
                                        switchButtons[0].click();
                                        console.log('已点击切换按钮（检测到唯一切换按钮）');

                                        setTimeout(() => {
                                            const confirmButton = findElementInIframes('button.el-button.el-button--primary', '确定');
                                            if (confirmButton) {
                                                confirmButton.click();
                                                console.log('已点击确定按钮');
                                            }
                                        }, 500);
                                    } else if (switchButtons.length === 0) {
                                        console.log('未找到切换按钮');
                                        if (checkCount >= maxChecks) {
                                            clearInterval(checkTimer);
                                            console.log('超过最大检查次数，停止检测切换按钮');
                                        }
                                    } else {
                                        console.log(`找到${switchButtons.length}个切换按钮，继续等待...（第${checkCount}/${maxChecks}次检查）`);
                                        if (checkCount >= maxChecks) {
                                            clearInterval(checkTimer);
                                            console.log('超过最大检查次数，未检测到唯一的切换按钮，停止操作');
                                        }
                                    }
                                }, checkInterval);

                                if (switchButtons.length === 1) {
                                    clearInterval(checkTimer);
                                    switchButtons[0].click();
                                    console.log('已点击切换按钮（检测到唯一切换按钮）');

                                    setTimeout(() => {
                                        const confirmButton = findElementInIframes('button.el-button.el-button--primary', '确定');
                                        if (confirmButton) {
                                            confirmButton.click();
                                            console.log('已点击确定按钮');
                                        }
                                    }, 500);
                                } else if (switchButtons.length === 0) {
                                    console.log('初始检查未找到切换按钮，开始循环检测');
                                } else {
                                    console.log(`初始检查找到${switchButtons.length}个切换按钮，开始循环检测`);
                                }
                            }, 500);
                        } else {
                            console.log('未找到查询或确定按钮');
                        }
                    }, 500);
                } else {
                    console.error('未找到纳税人识别号输入框，请检查页面元素。');
                }

                // 自动填充账号密码
                if (isAutoFillAccount && accountInfo) {
                    const accountInput = findElementInIframes('input[placeholder="居民身份证号码/手机号码/用户名"]') ||
                                       findElementInIframes('input.el-input__inner[placeholder="居民身份证号码/手机号码/用户名"]');
                    const passwordInput = findElementInIframes('input[placeholder="个人用户密码"]') ||
                                        findElementInIframes('input.el-input__inner[placeholder="个人用户密码"]');
                    if (accountInput) {
                        accountInput.value = accountInfo.account;
                        triggerInputEvents(accountInput);
                    }
                    if (passwordInput) {
                        passwordInput.value = accountInfo.password;
                        triggerInputEvents(passwordInput);
                    }
                }

                clearSelection();
                itemDiv.style.background = '#e0f7fa';
                lastSelectedItem = content;
                GM_setValue('lastSelectedItem', lastSelectedItem);
            }, 500);
        });

        itemDiv.addEventListener('mouseover', () => {
            if (itemDiv.dataset.content!== lastSelectedItem) {
                itemDiv.style.background = '#f9f9f9';
            }
        });

        itemDiv.addEventListener('mouseout', () => {
            if (itemDiv.dataset.content!== lastSelectedItem) {
                itemDiv.style.background = '#fff';
            }
        });

        itemDiv.dataset.content = content;
        container.appendChild(itemDiv);

        // 设置拖动功能
        setupDragItem(itemDiv, dragButton);

        if (content === lastSelectedItem) {
            itemDiv.style.background = '#e0f7fa';
        }

        return itemDiv;
    }

    // 设置拖动功能
    function setupDragItem(itemDiv, dragButton) {
        let isDragging = false;
        const dragContainer = dragButton.parentElement;
        let originalRect = null;
        let originalIndex = 0;

        // 拖动开始
        dragButton.addEventListener('mousedown', (e) => {
            if (!isEditMode) return;
            e.stopPropagation();

            originalRect = itemDiv.getBoundingClientRect();
            const items = Array.from(itemList.querySelectorAll('.tax-item'));
            originalIndex = items.indexOf(itemDiv);

            isDragging = true;
            draggedItem = itemDiv;
            draggedItem.classList.add('dragging');

            initialY = e.clientY;
            initialOffsetY = e.clientY - originalRect.top;

            // 拖动样式
            draggedItem.style.opacity = '0.9';
            draggedItem.style.transform = 'scale(1.02)';
            draggedItem.style.zIndex = '10001';
            draggedItem.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            draggedItem.style.background = '#f0f7ff';
            draggedItem.style.borderRadius = '4px';
            draggedItem.style.margin = '5px 0';
            draggedItem.style.position = 'relative';
            draggedItem.style.width = `${originalRect.width}px`;

            // 创建占位符
            const placeholder = document.createElement('div');
            placeholder.className = 'drag-placeholder';
            placeholder.style.height = `${originalRect.height}px`;
            placeholder.style.opacity = '0.3';
            placeholder.style.backgroundColor = '#e9ecef';
            placeholder.style.borderRadius = '4px';
            placeholder.style.margin = '5px 0';
            placeholder.style.transition = 'all 0.2s ease';
            itemDiv.parentNode.insertBefore(placeholder, itemDiv);
            itemDiv.placeholder = placeholder;

            setTimeout(() => {
                draggedItem.style.opacity = '0';
            }, 10);
        });

        // 拖动结束
        document.addEventListener('mouseup', () => {
            if (!isDragging ||!isEditMode ||!draggedItem) return;

            draggedItem.classList.remove('dragging');
            // 恢复样式
            draggedItem.style.opacity = '';
            draggedItem.style.transform = '';
            draggedItem.style.zIndex = '';
            draggedItem.style.boxShadow = '';
            draggedItem.style.background = '';
            draggedItem.style.borderRadius = '';
            draggedItem.style.margin = '';
            draggedItem.style.position = '';
            draggedItem.style.width = '';
            draggedItem.style.top = '';

            // 移动元素到占位符位置
            if (draggedItem.placeholder && draggedItem.placeholder.parentNode) {
                draggedItem.placeholder.parentNode.insertBefore(draggedItem, draggedItem.placeholder);
                draggedItem.placeholder.parentNode.removeChild(draggedItem.placeholder);
            }

            // 重置状态
            isDragging = false;
            draggedItem.placeholder = null;
            draggedItem = null;

            // 更新顺序
            updateItemOrder();
        });

        // 鼠标移动时处理拖动
        document.addEventListener('mousemove', (e) => {
            if (!isDragging ||!isEditMode ||!draggedItem) return;

            e.preventDefault();

            // 计算新位置
            const listRect = itemList.getBoundingClientRect();
            const newTop = e.clientY - listRect.top - initialOffsetY;

            // 限制拖动范围
            if (newTop > 0 && newTop < listRect.height - draggedItem.offsetHeight) {
                draggedItem.style.top = `${newTop}px`;
            }

            // 确定放置位置
            const afterElement = getDragAfterElement(itemList, e.clientY);
            if (afterElement && afterElement!== draggedItem.placeholder) {
                itemList.insertBefore(draggedItem.placeholder, afterElement);
            } else if (!afterElement && draggedItem.placeholder.nextSibling) {
                itemList.appendChild(draggedItem.placeholder);
            }
        });

        // 辅助函数：确定拖动元素应该放置在哪个元素后面
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.tax-item:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    // 触发输入框事件
    function triggerInputEvents(input) {
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        const blurEvent = new Event('blur', { bubbles: true });
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
        input.dispatchEvent(blurEvent);
    }

    // 清除选中状态
    function clearSelection() {
        const items = itemList.querySelectorAll('.tax-item');
        items.forEach(item => {
            if (item.dataset.content!== lastSelectedItem) {
                item.style.background = '#fff';
            }
        });
    }

    // 切换编辑模式
    function toggleEditMode() {
        isEditMode =!isEditMode;

        editToggleButton.textContent = isEditMode? '完成' : '编辑';

        const items = document.querySelectorAll('.tax-item');

        items.forEach((item, index) => {
            const dragContainer = item.querySelector('.drag-container');
            const editBtn = item.querySelector('.edit-btn');
            const deleteBtn = item.querySelector('.delete-btn');

            if (isEditMode) {
                setTimeout(() => {
                    dragContainer.style.display = 'flex';
                    editBtn.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                    dragContainer.style.opacity = '0';
                    editBtn.style.opacity = '0';
                    deleteBtn.style.opacity = '0';

                    setTimeout(() => {
                        dragContainer.style.opacity = '1';
                        editBtn.style.opacity = '1';
                        deleteBtn.style.opacity = '1';
                    }, 50);
                }, index * 50);
            } else {
                dragContainer.style.opacity = '0';
                editBtn.style.opacity = '0';
                deleteBtn.style.opacity = '0';

                setTimeout(() => {
                    dragContainer.style.display = 'none';
                    editBtn.style.display = 'none';
                    deleteBtn.style.display = 'none';
                }, 200);
            }

            const textSpan = item.querySelector('span');
            textSpan.style.cursor = isEditMode? 'default' : 'pointer';
        });

        if (isEditMode) {
            importButton.style.display = 'inline-block';
            exportButton.style.display = 'inline-block';
            importButton.style.opacity = '0';
            exportButton.style.opacity = '0';

            setTimeout(() => {
                importButton.style.opacity = '1';
                exportButton.style.opacity = '1';
            }, 100);
        } else {
            importButton.style.opacity = '0';
            exportButton.style.opacity = '0';

            setTimeout(() => {
                importButton.style.display = 'none';
                exportButton.style.display = 'none';
            }, 200);
        }

        leftResizeHandle.style.display = isEditMode? 'block' : 'none';
    }

    // 编辑条目
    function editItem(itemDiv, oldContent, oldNote) {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '300px',
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.95)',
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加模态框背景遮罩
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(overlay);

        // 触发动画
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
            overlay.style.opacity = '0.5';
        }, 10);

        const taxNumberInput = document.createElement('input');
        taxNumberInput.value = oldContent;
        taxNumberInput.style.padding = '8px';
        taxNumberInput.style.border = '1px solid #ccc';
        taxNumberInput.style.borderRadius = '3px';
        taxNumberInput.style.transition = 'border-color 0.2s ease';
        taxNumberInput.addEventListener('focus', () => {
            taxNumberInput.style.borderColor = '#007BFF';
            taxNumberInput.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        });
        taxNumberInput.addEventListener('blur', () => {
            taxNumberInput.style.borderColor = '#ccc';
            taxNumberInput.style.boxShadow = 'none';
        });
        modal.appendChild(taxNumberInput);

        const noteInput = document.createElement('input');
        noteInput.value = oldNote;
        noteInput.style.padding = '8px';
        noteInput.style.border = '1px solid #ccc';
        noteInput.style.borderRadius = '3px';
        noteInput.style.transition = 'border-color 0.2s ease';
        noteInput.addEventListener('focus', () => {
            noteInput.style.borderColor = '#007BFF';
            noteInput.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        });
        noteInput.addEventListener('blur', () => {
            noteInput.style.borderColor = '#ccc';
            noteInput.style.boxShadow = 'none';
        });
        modal.appendChild(noteInput);

        const confirmButton = createButton('确认', () => {
            const newContent = taxNumberInput.value.trim();
            const newNote = noteInput.value.trim();
            if (!newContent ||!newNote) {
                alert('税号和备注都不能为空，请重新输入。');
                return;
            }

            // 编辑动画
            itemDiv.style.opacity = '0.5';
            setTimeout(() => {
                const textSpan = itemDiv.querySelector('span');
                textSpan.textContent = newNote;
                itemDiv.dataset.content = newContent;

                const items = GM_getValue('autoFillItems', []);
                const index = items.findIndex(item => item.content === oldContent);
                if (index!== -1) {
                    items[index] = { content: newContent, note: newNote };
                    GM_setValue('autoFillItems', items);
                }

                itemDiv.style.opacity = '1';

                // 关闭模态框
                modal.style.opacity = '0';
                modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.removeChild(overlay);
                }, 300);
            }, 200);
        });
        modal.appendChild(confirmButton);

        const cancelButton = createButton('取消', () => {
            // 关闭动画
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            }, 300);
        }, true);
        modal.appendChild(cancelButton);

        // 点击遮罩关闭模态框
        overlay.addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            }, 300);
        });

        document.body.appendChild(modal);
        return modal;
    }

    // 删除条目
    function deleteItem(itemDiv, content) {
        // 删除动画
        itemDiv.style.opacity = '0';
        itemDiv.style.transform = 'translateY(10px)';
        itemDiv.style.height = itemDiv.offsetHeight + 'px';
        itemDiv.style.overflow = 'hidden';
        itemDiv.style.margin = '0';

        setTimeout(() => {
            const items = GM_getValue('autoFillItems', []);
            const newItems = items.filter(item => item.content!== content);
            GM_setValue('autoFillItems', newItems);
            itemList.removeChild(itemDiv);
            if (content === lastSelectedItem) {
                lastSelectedItem = null;
                GM_setValue('lastSelectedItem', null);
            }
        }, 300);
    }

    // 更新条目顺序
    function updateItemOrder() {
        const items = Array.from(document.querySelectorAll('.tax-item'));
        const newItemOrder = items.map(item => {
            const note = item.querySelector('span').textContent;
            const content = item.dataset.content;
            return { content, note };
        });
        GM_setValue('autoFillItems', newItemOrder);
    }

    // 导入数据（支持逗号分隔和制表符分隔格式）
    function importData() {
        const importModal = document.createElement('div');
        Object.assign(importModal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '500px',  // 加宽以适应长文本
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.95)',
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加模态框背景遮罩
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(overlay);

        // 触发动画
        setTimeout(() => {
            importModal.style.opacity = '1';
            importModal.style.transform = 'translate(-50%, -50%) scale(1)';
            overlay.style.opacity = '0.5';
        }, 10);

        // 导入说明
        const importInfo = document.createElement('div');
        importInfo.style.fontSize = '13px';
        importInfo.style.color = '#666';
        importInfo.style.marginBottom = '5px';
        importInfo.innerHTML = '支持两种格式：<br>1. 税号,备注;税号,备注（逗号分隔，分号换行）<br>2. 税号\t备注（制表符分隔，每行一条）';
        importModal.appendChild(importInfo);

        const dataTextarea = document.createElement('textarea');
        dataTextarea.placeholder = '请输入要导入的数据...';
        dataTextarea.style.padding = '8px';
        dataTextarea.style.border = '1px solid #ccc';
        dataTextarea.style.borderRadius = '3px';
        dataTextarea.style.height = '200px';  // 加高以容纳更多数据
        dataTextarea.style.transition = 'border-color 0.2s ease';
        dataTextarea.style.fontFamily = 'monospace';  // 等宽字体更适合看分隔符
        dataTextarea.addEventListener('focus', () => {
            dataTextarea.style.borderColor = '#007BFF';
            dataTextarea.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        });
        dataTextarea.addEventListener('blur', () => {
            dataTextarea.style.borderColor = '#ccc';
            dataTextarea.style.boxShadow = 'none';
        });
        importModal.appendChild(dataTextarea);

        const confirmButton = createButton('确认导入', () => {
            const dataStr = dataTextarea.value.trim();
            if (!dataStr) {
                alert('导入数据不能为空，请重新输入。');
                return;
            }
            try {
                const importedItems = [];
                
                // 先按行分割（兼容Windows和Unix换行符）
                const lines = dataStr.split(/\r\n|\n|\r/);
                
                // 检查是否包含分号（传统格式）
                if (dataStr.includes(';')) {
                    // 处理传统格式：税号,备注;税号,备注
                    const items = dataStr.split(';');
                    items.forEach((item, index) => {
                        if (!item.trim()) return;
                        
                        const [content, note] = item.split(',');
                        if (content && note) {
                            importedItems.push({ 
                                content: content.trim(), 
                                note: note.trim() 
                            });
                        } else {
                            throw new Error(`第${index + 1}条数据格式错误，应为"税号,备注"`);
                        }
                    });
                } else {
                    // 处理新格式：制表符分隔，每行一条
                    lines.forEach((line, index) => {
                        if (!line.trim()) return;
                        
                        // 按制表符分割
                        const [content, note] = line.split('\t');
                        if (content && note) {
                            importedItems.push({ 
                                content: content.trim(), 
                                note: note.trim() 
                            });
                        } else {
                            throw new Error(`第${index + 1}行数据格式错误，应为"税号\t备注"（制表符分隔）`);
                        }
                    });
                }

                if (importedItems.length === 0) {
                    throw new Error('未识别到有效数据，请检查格式');
                }

                // 清空现有条目动画
                const existingItems = document.querySelectorAll('.tax-item');
                existingItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(10px)';

                        if (index === existingItems.length - 1) {
                            setTimeout(() => {
                                itemList.innerHTML = '';
                                GM_setValue('autoFillItems', importedItems);
                                importedItems.forEach((item, i) => {
                                    setTimeout(() => {
                                        addItemToWindow(item.content, item.note, itemList);
                                    }, i * 80);
                                });
                                alert(`数据导入成功！共导入 ${importedItems.length} 条记录`);

                                // 关闭模态框
                                importModal.style.opacity = '0';
                                importModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    document.body.removeChild(importModal);
                                    document.body.removeChild(overlay);
                                }, 300);
                            }, 300);
                        }
                    }, index * 50);
                });
            } catch (error) {
                alert(`数据导入失败：${error.message}`);
            }
        });
        importModal.appendChild(confirmButton);

        const cancelButton = createButton('取消', () => {
            // 关闭模态框
            importModal.style.opacity = '0';
            importModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(importModal);
                document.body.removeChild(overlay);
            }, 300);
        }, true);
        importModal.appendChild(cancelButton);

        // 点击遮罩关闭模态框
        overlay.addEventListener('click', () => {
            importModal.style.opacity = '0';
            importModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(importModal);
                document.body.removeChild(overlay);
            }, 300);
        });

        document.body.appendChild(importModal);
    }

    // 导出数据
    function exportData() {
        const items = GM_getValue('autoFillItems', []);
        const dataStr = items.map(item => `${item.content}\t${item.note}`).join('\n'); // 导出为制表符格式
        const exportModal = document.createElement('div');
        Object.assign(exportModal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '500px',
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.95)',
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加模态框背景遮罩
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(overlay);

        // 触发动画
        setTimeout(() => {
            exportModal.style.opacity = '1';
            exportModal.style.transform = 'translate(-50%, -50%) scale(1)';
            overlay.style.opacity = '0.5';
        }, 10);

        // 导出说明
        const exportInfo = document.createElement('div');
        exportInfo.style.fontSize = '13px';
        exportInfo.style.color = '#666';
        exportInfo.style.marginBottom = '5px';
        exportInfo.textContent = '导出格式：税号\t备注（制表符分隔，可直接用于导入）';
        exportModal.appendChild(exportInfo);

        const dataTextarea = document.createElement('textarea');
        dataTextarea.value = dataStr;
        dataTextarea.readOnly = true;
        dataTextarea.style.padding = '8px';
        dataTextarea.style.border = '1px solid #ccc';
        dataTextarea.style.borderRadius = '3px';
        dataTextarea.style.height = '200px';
        dataTextarea.style.fontFamily = 'monospace'; // 等宽字体
        exportModal.appendChild(dataTextarea);

        const copyButton = createButton('复制数据', () => {
            dataTextarea.select();
            document.execCommand('copy');

            // 复制反馈
            copyButton.textContent = '已复制！';
            copyButton.style.background = '#28a745';
            setTimeout(() => {
                copyButton.textContent = '复制数据';
                copyButton.style.background = '#007BFF';
            }, 1500);
        });
        exportModal.appendChild(copyButton);

        const closeButton = createButton('关闭', () => {
            // 关闭模态框
            exportModal.style.opacity = '0';
            exportModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(exportModal);
                document.body.removeChild(overlay);
            }, 300);
        }, true);
        exportModal.appendChild(closeButton);

        // 点击遮罩关闭模态框
        overlay.addEventListener('click', () => {
            exportModal.style.opacity = '0';
            exportModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(exportModal);
                document.body.removeChild(overlay);
            }, 300);
        });

        document.body.appendChild(exportModal);
    }

    // 自动填充账号密码（如果开启）
    if (isAutoFillAccount && accountInfo) {
        setTimeout(() => {
            const accountInput = findElementInIframes('input[placeholder="居民身份证号码/手机号码/用户名"]') ||
                               findElementInIframes('input.el-input__inner[placeholder="居民身份证号码/手机号码/用户名"]');
            const passwordInput = findElementInIframes('input[placeholder="个人用户密码"]') ||
                                findElementInIframes('input.el-input__inner[placeholder="个人用户密码"]');
            if (accountInput) {
                accountInput.value = accountInfo.account;
                triggerInputEvents(accountInput);
            }
            if (passwordInput) {
                passwordInput.value = accountInfo.password;
                triggerInputEvents(passwordInput);
            }
        }, 500);
    }

})();