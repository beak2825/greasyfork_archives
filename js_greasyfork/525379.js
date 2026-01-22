// ==UserScript==
// @name         全国统一规范电子税务局税号填写辅助工具
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  在电子税务局旁边显示一个小窗口，方便登录与切换不同的企业，支持批量添加和制表符分隔导入
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

    // 判断是否为登录页面或切换企业页面
    const isLoginPage = window.location.href.includes('login?redirect_uri');
    const isIdentitySwitchPage = window.location.href.includes('identitySwitch');
    
    // 定义全局变量
    let isEditMode = false;
    let lastSelectedItem = GM_getValue('lastSelectedItem', null);
    let originalWidth = null;
    let windowWidth = GM_getValue('windowWidth', 450); // 统一窗口宽度
    let isAutoFillAccount = GM_getValue('isAutoFillAccount', false);
    let accountInfo = GM_getValue('accountInfo', null);
    let isCollapsed = GM_getValue('isCollapsed', false);
    let isInitialLoad = true; // 标记是否为初始加载
    let maxRowsPerPage = GM_getValue('maxRowsPerPage', 10); // 每页最大行数，默认为10
    let currentPage = 1; // 当前页码
    let isPaginationEnabled = GM_getValue('isPaginationEnabled', true); // 分页功能开关，默认为启用
    let displayMode = GM_getValue('displayMode', 'both'); // 显示模式：'login' 仅登录窗口，'switch' 仅切换窗口，'both' 两者都显示
    let showItemNumbers = GM_getValue('showItemNumbers', false); // 展示序号开关，默认为禁用
    let markedItems = GM_getValue('markedItems', []); // 标记的公司列表
    // 拖动相关变量
    let draggedItem = null;
    let initialY = 0;
    let initialOffsetY = 0;
    
    // 根据显示模式决定是否在当前页面显示辅助工具
    let shouldShowTool = false;
    if (displayMode === 'both') {
        shouldShowTool = isLoginPage || isIdentitySwitchPage;
    } else if (displayMode === 'login') {
        shouldShowTool = isLoginPage;
    } else if (displayMode === 'switch') {
        shouldShowTool = isIdentitySwitchPage;
    }
    
    if (!shouldShowTool) return;

    // 创建浮窗元素并设置样式
    const createFloatWindow = () => {
        const floatWindow = document.createElement('div');
        Object.assign(floatWindow.style, {
            position: 'fixed',
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
            background: '#fff',
            border: '1px solid #ccc',
            borderRight: 'none', // 贴边处不显示边框
            padding: '15px',
            borderRadius: '8px 0 0 8px',
            boxShadow: '0 4px 8px rgba(0,0,0,.1)',
            fontFamily: 'Arial,sans-serif',
            zIndex: 10000,
            overflow: 'hidden', // 关键：收起时切割内容
            boxSizing: 'border-box', // 关键：确保宽度包含边框
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
        
        // 检查是否为开启/关闭类型的按钮
        const isToggleButton = text === '开启' || text === '关闭';
        
        // 根据按钮类型和状态设置颜色
        let backgroundColor;
        if (isToggleButton) {
            // 开启状态为蓝色，关闭状态为红色
            backgroundColor = text === '开启'? '#007BFF' : '#dc3545';
        } else {
            // 其他按钮使用原有逻辑
            backgroundColor = isDelete? '#dc3545' : '#007BFF';
        }
        
        const styles = {
            marginRight: '5px',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            background: backgroundColor,
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
            let hoverColor;
            if (isToggleButton) {
                // 开启状态悬停为深蓝色，关闭状态悬停为深红色
                hoverColor = button.textContent === '开启'? '#0056b3' : '#c82333';
            } else {
                // 其他按钮使用原有逻辑
                hoverColor = isDelete? '#c82333' : '#0056b3';
            }
            button.style.background = hoverColor;
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        
        button.addEventListener('mouseout', () => {
            let originalColor;
            if (isToggleButton) {
                // 恢复到开启/关闭状态的颜色
                originalColor = button.textContent === '开启'? '#007BFF' : '#dc3545';
            } else {
                // 其他按钮使用原有逻辑
                originalColor = isDelete? '#dc3545' : '#007BFF';
            }
            button.style.background = originalColor;
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
        floatWindow.style.border = 'none'; // 宽度为0时去掉边框，消除白边
    } else {
        floatWindow.style.width = windowWidth + 'px';
    }

    // 渲染带分页的企业列表
    function renderItemsWithPagination() {
        const savedItems = GM_getValue('autoFillItems', []);
        
        // 清空现有列表
        itemList.innerHTML = '';
        
        let currentItems = savedItems;
        let totalPages = 1;
        
        // 如果启用了分页功能
        if (isPaginationEnabled) {
            // 计算分页信息
            const totalItems = savedItems.length;
            totalPages = Math.ceil(totalItems / maxRowsPerPage);
            const startIndex = (currentPage - 1) * maxRowsPerPage;
            const endIndex = startIndex + maxRowsPerPage;
            currentItems = savedItems.slice(startIndex, endIndex);
        }
        
        // 渲染企业
        currentItems.forEach((item, index) => {
            const itemDiv = addItemToWindow(item.content, item.note, itemList);
            // 设置序号
            if (showItemNumbers) {
                // 查找序号元素（第二个子元素，因为第一个是dragContainer）
                const children = itemDiv.children;
                let numberSpan = null;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].tagName === 'SPAN') {
                        numberSpan = children[i];
                        break;
                    }
                }
                if (numberSpan) {
                    // 计算实际序号（考虑当前页码）
                    const actualIndex = (currentPage - 1) * maxRowsPerPage + index + 1;
                    numberSpan.textContent = actualIndex + '.';
                }
            }
        });
        
        // 如果当前处于编辑模式，显示编辑和删除按钮
        if (isEditMode) {
            setTimeout(() => {
                const items = document.querySelectorAll('.tax-item');
                items.forEach((item, index) => {
                    const dragContainer = item.querySelector('.drag-container');
                    const editBtn = item.querySelector('.edit-btn');
                    const deleteBtn = item.querySelector('.delete-btn');
                    
                    if (dragContainer) dragContainer.style.display = 'flex';
                    if (editBtn) editBtn.style.display = 'inline-block';
                    if (deleteBtn) deleteBtn.style.display = 'inline-block';
                    
                    if (dragContainer) dragContainer.style.opacity = '1';
                    if (editBtn) editBtn.style.opacity = '1';
                    if (deleteBtn) deleteBtn.style.opacity = '1';
                    
                    const textSpan = item.querySelector('span');
                    if (textSpan) textSpan.style.cursor = 'default';
                });
            }, 100);
        }
        
        // 渲染分页控件（仅当启用分页功能时）
        renderPaginationControls(totalPages);
    }

    // 加载已保存的税号内容
    renderItemsWithPagination();

    // 收起/展开功能
    function toggleCollapse() {
        isCollapsed = !isCollapsed;
        GM_setValue('isCollapsed', isCollapsed);

        if (isCollapsed) {
            // 收起状态逻辑
            // 先隐藏内容，避免内容在动画过程中可见
            mainContent.style.display = 'none';
            
            // 立即移除边框，避免动画过程中出现白条
            floatWindow.style.border = 'none';
            
            // 然后开始宽度动画
            floatWindow.style.width = '0px';
            floatWindow.style.padding = '0';
            
            // 更新按钮状态
            toggleCollapseButton.innerHTML = '≪';
            toggleCollapseButton.style.right = '0';
        } else {
            // 展开状态逻辑
            // 先设置边框，但暂时设为透明
            floatWindow.style.border = '1px solid transparent';
            floatWindow.style.borderRight = 'none';
            
            // 开始宽度动画
            floatWindow.style.width = windowWidth + 'px';
            floatWindow.style.padding = '15px';
            
            // 延迟显示内容和边框，确保动画流畅
            setTimeout(() => {
                // 显示内容
                mainContent.style.display = 'block';
                
                // 显示边框
                floatWindow.style.border = '1px solid #ccc';
                floatWindow.style.borderRight = 'none';
            }, 100);
            
            // 更新按钮状态
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

        // 存储多组企业数据的数组
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
        addInputBtn.innerHTML = '<span>+</span> 添加更多企业';
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
                groupTitle.textContent = `企业 ${index + 1}`;
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
                noteInput.placeholder = '请输入名称';
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
                    deleteGroupBtn.textContent = '删除该企业';
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

            // 批量添加完成后重新渲染带分页的列表
            setTimeout(() => {
                renderItemsWithPagination();
            }, validItems.length * 100 + 100);

            // 关闭模态框
            modal.style.opacity = '0';
            modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
                alert(`批量添加成功！共添加 ${validItems.length} 家企业`);
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
        
        // 分页设置区域
        const paginationSettings = document.createElement('div');
        paginationSettings.style.display = 'flex';
        paginationSettings.style.flexDirection = 'column';
        paginationSettings.style.gap = '10px';
        
        const paginationTitle = document.createElement('div');
        paginationTitle.style.fontWeight = 'bold';
        paginationTitle.textContent = '分页设置';
        paginationSettings.appendChild(paginationTitle);

        // 分页功能开关
        const paginationSwitchContainer = document.createElement('div');
        paginationSwitchContainer.style.display = 'flex';
        paginationSwitchContainer.style.alignItems = 'center';
        paginationSwitchContainer.style.justifyContent = 'space-between';
        
        const paginationSwitchLabel = document.createElement('span');
        paginationSwitchLabel.textContent = '启用分页功能';
        paginationSwitchContainer.appendChild(paginationSwitchLabel);
        
        const paginationSwitch = createButton(
            isPaginationEnabled? '开启' : '关闭',
            () => togglePagination(paginationSwitch),
            isPaginationEnabled? false : true,
            { padding: '5px 15px' }
        );
        paginationSwitchContainer.appendChild(paginationSwitch);
        paginationSettings.appendChild(paginationSwitchContainer);

        const maxRowsContainer = document.createElement('div');
        maxRowsContainer.style.display = 'flex';
        maxRowsContainer.style.alignItems = 'center';
        maxRowsContainer.style.justifyContent = 'space-between';
        maxRowsContainer.style.display = isPaginationEnabled? 'flex' : 'none';
        
        const maxRowsLabel = document.createElement('span');
        maxRowsLabel.textContent = '每页最大行数';
        maxRowsContainer.appendChild(maxRowsLabel);
        
        const maxRowsInput = document.createElement('input');
        maxRowsInput.type = 'number';
        maxRowsInput.min = '1';
        maxRowsInput.max = '50';
        maxRowsInput.value = maxRowsPerPage;
        maxRowsInput.style.width = '80px';
        maxRowsInput.style.padding = '5px';
        maxRowsInput.style.border = '1px solid #ccc';
        maxRowsInput.style.borderRadius = '3px';
        maxRowsContainer.appendChild(maxRowsInput);
        
        paginationSettings.appendChild(maxRowsContainer);

        const saveMaxRowsButton = createButton('保存设置', () => {
            const newValue = parseInt(maxRowsInput.value);
            if (newValue >= 1 && newValue <= 50) {
                maxRowsPerPage = newValue;
                GM_setValue('maxRowsPerPage', maxRowsPerPage);
                
                // 保存成功提示
                saveMaxRowsButton.textContent = '已保存！';
                saveMaxRowsButton.style.background = '#28a745';
                
                // 重新渲染企业列表
                setTimeout(() => {
                    currentPage = 1; // 重置到第一页
                    renderItemsWithPagination();
                }, 500);
                
                // 恢复按钮状态
                setTimeout(() => {
                    saveMaxRowsButton.textContent = '保存设置';
                    saveMaxRowsButton.style.background = '#007BFF';
                }, 1500);
            } else {
                alert('请输入1-50之间的数值');
            }
        });
        saveMaxRowsButton.style.display = isPaginationEnabled? 'block' : 'none';
        paginationSettings.appendChild(saveMaxRowsButton);

        // 将分页设置区域添加到模态窗口中
        modal.appendChild(paginationSettings);

        // 序号显示设置区域
        const numberSettings = document.createElement('div');
        numberSettings.style.display = 'flex';
        numberSettings.style.flexDirection = 'column';
        numberSettings.style.gap = '10px';
        
        const numberTitle = document.createElement('div');
        numberTitle.style.fontWeight = 'bold';
        numberTitle.textContent = '序号显示设置';
        numberSettings.appendChild(numberTitle);

        // 序号显示开关
        const numberSwitchContainer = document.createElement('div');
        numberSwitchContainer.style.display = 'flex';
        numberSwitchContainer.style.alignItems = 'center';
        numberSwitchContainer.style.justifyContent = 'space-between';
        
        const numberSwitchLabel = document.createElement('span');
        numberSwitchLabel.textContent = '启用序号显示';
        numberSwitchContainer.appendChild(numberSwitchLabel);
        
        const numberSwitch = createButton(
            showItemNumbers? '开启' : '关闭',
            () => toggleNumberDisplay(numberSwitch),
            showItemNumbers? false : true,
            { padding: '5px 15px' }
        );
        numberSwitchContainer.appendChild(numberSwitch);
        numberSettings.appendChild(numberSwitchContainer);

        // 将序号设置区域添加到模态窗口中
        modal.appendChild(numberSettings);

        // 序号显示切换函数
        function toggleNumberDisplay(switchButton) {
            showItemNumbers =!showItemNumbers;
            switchButton.textContent = showItemNumbers? '开启' : '关闭';
            switchButton.style.background = showItemNumbers? '#007BFF' : '#dc3545';
            GM_setValue('showItemNumbers', showItemNumbers);

            // 重新渲染企业列表
            setTimeout(() => {
                renderItemsWithPagination();
            }, 500);
        }

        // 分页功能切换函数
        function togglePagination(switchButton) {
            isPaginationEnabled =!isPaginationEnabled;
            switchButton.textContent = isPaginationEnabled? '开启' : '关闭';
            switchButton.style.background = isPaginationEnabled? '#007BFF' : '#dc3545';
            GM_setValue('isPaginationEnabled', isPaginationEnabled);

            // 显示/隐藏每页最大行数设置
            maxRowsContainer.style.display = isPaginationEnabled? 'flex' : 'none';
            saveMaxRowsButton.style.display = isPaginationEnabled? 'block' : 'none';

            // 重新渲染企业列表
            setTimeout(() => {
                renderItemsWithPagination();
            }, 500);
        }

        // 显示模式设置区域
        const displayModeSettings = document.createElement('div');
        displayModeSettings.style.display = 'flex';
        displayModeSettings.style.flexDirection = 'column';
        displayModeSettings.style.gap = '10px';
        
        const displayModeTitle = document.createElement('div');
        displayModeTitle.style.fontWeight = 'bold';
        displayModeTitle.textContent = '显示模式设置';
        displayModeSettings.appendChild(displayModeTitle);

        const displayModeContainer = document.createElement('div');
        displayModeContainer.style.display = 'flex';
        displayModeContainer.style.flexDirection = 'column';
        displayModeContainer.style.gap = '8px';
        
        // 创建显示模式选项
        const createDisplayModeOption = (value, label) => {
            const optionContainer = document.createElement('div');
            optionContainer.style.display = 'flex';
            optionContainer.style.alignItems = 'center';
            optionContainer.style.gap = '8px';
            
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = 'displayMode';
            radioButton.value = value;
            radioButton.checked = displayMode === value;
            radioButton.style.cursor = 'pointer';
            
            const optionLabel = document.createElement('span');
            optionLabel.textContent = label;
            optionLabel.style.cursor = 'pointer';
            
            // 点击标签也能选中单选按钮
            optionLabel.addEventListener('click', () => {
                radioButton.checked = true;
            });
            
            optionContainer.appendChild(radioButton);
            optionContainer.appendChild(optionLabel);
            return optionContainer;
        };
        
        // 添加三个显示模式选项
        displayModeContainer.appendChild(createDisplayModeOption('both', '登录与切换窗口全部显示'));
        displayModeContainer.appendChild(createDisplayModeOption('login', '仅登录窗口显示'));
        displayModeContainer.appendChild(createDisplayModeOption('switch', '仅切换窗口显示'));
        
        displayModeSettings.appendChild(displayModeContainer);

        // 保存显示模式设置按钮
        const saveDisplayModeButton = createButton('保存显示模式设置', () => {
            const selectedOption = document.querySelector('input[name="displayMode"]:checked');
            if (selectedOption) {
                displayMode = selectedOption.value;
                GM_setValue('displayMode', displayMode);
                
                // 保存成功提示
                saveDisplayModeButton.textContent = '已保存！';
                saveDisplayModeButton.style.background = '#28a745';
                
                // 恢复按钮状态
                setTimeout(() => {
                    saveDisplayModeButton.textContent = '保存显示模式设置';
                    saveDisplayModeButton.style.background = '#007BFF';
                }, 1500);
            }
        });
        displayModeSettings.appendChild(saveDisplayModeButton);

        modal.appendChild(displayModeSettings);

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

        // 创建序号元素
        const numberSpan = document.createElement('span');
        numberSpan.style.marginRight = '10px';
        numberSpan.style.fontWeight = 'bold';
        numberSpan.style.color = '#666';
        numberSpan.style.minWidth = '20px';
        numberSpan.style.textAlign = 'center';
        numberSpan.style.display = showItemNumbers? 'inline-block' : 'none';
        itemDiv.appendChild(numberSpan);

        const textSpan = document.createElement('span');
        textSpan.textContent = note;
        textSpan.style.flexGrow = 1;
        textSpan.style.overflow = 'hidden';
        textSpan.style.textOverflow = 'ellipsis';
        textSpan.style.whiteSpace = 'nowrap';
        textSpan.style.flexBasis = '0'; // 确保文本区域能够充分利用可用空间
        itemDiv.appendChild(textSpan);

        // 创建编辑和删除按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.width = 'auto'; // 宽度自适应
        buttonContainer.style.minWidth = isEditMode? '80px' : '0'; // 编辑模式下设置最小宽度，非编辑模式下最小宽度为0
        buttonContainer.style.whiteSpace = 'nowrap'; // 防止按钮换行

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
                GM_setValue('lastSelectedItem', lastSelectedItem);
            }, 500);
        });

        itemDiv.addEventListener('mouseover', () => {
            if (itemDiv.dataset.content!== lastSelectedItem) {
                itemDiv.style.background = '#f9f9f9';
            }
        });

        itemDiv.addEventListener('mouseout', () => {
            // 如果不是标记状态，恢复默认背景
            if (!markedItems.includes(content)) {
                itemDiv.style.background = '#fff';
            }
        });

        // 右键菜单功能
        itemDiv.addEventListener('contextmenu', function(e) {
            // 阻止默认右键菜单和事件冒泡
            e.preventDefault();
            e.stopPropagation();
            
            // 创建右键菜单
            const contextMenu = document.createElement('div');
            Object.assign(contextMenu.style, {
                position: 'fixed',
                top: `${e.clientY}px`,
                left: `${e.clientX}px`,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                zIndex: '999999', // 使用更高的z-index确保菜单显示在最前面
                padding: '5px 0',
                minWidth: '120px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px'
            });
            
            // 创建菜单项
            const createMenuItem = (text, clickHandler) => {
                const menuItem = document.createElement('div');
                menuItem.textContent = text;
                Object.assign(menuItem.style, {
                    padding: '8px 12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                });
                
                menuItem.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f0f0f0';
                });
                
                menuItem.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });
                
                menuItem.addEventListener('click', function() {
                    clickHandler();
                    if (document.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                });
                
                return menuItem;
            };
            
            // 检查当前公司是否已标记
            const isMarked = markedItems.includes(content);
            
            // 添加菜单项
            if (!isMarked) {
                contextMenu.appendChild(createMenuItem('标记', () => markItem(content, itemDiv)));
            } else {
                contextMenu.appendChild(createMenuItem('取消标记', () => unmarkItem(content, itemDiv)));
            }
            
            contextMenu.appendChild(createMenuItem('取消所有标记', () => unmarkAllItems()));
            
            // 添加菜单到页面
            document.body.appendChild(contextMenu);
            
            // 点击页面其他地方关闭菜单
            const closeContextMenu = function() {
                if (document.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
                document.removeEventListener('click', closeContextMenu);
                document.removeEventListener('contextmenu', closeContextMenu);
            };
            
            // 立即添加事件监听器
            setTimeout(() => {
                document.addEventListener('click', closeContextMenu);
                document.addEventListener('contextmenu', closeContextMenu);
            }, 0);
        });

        // 检查并应用标记状态
        if (markedItems.includes(content)) {
            itemDiv.style.background = '#fff3cd';
            itemDiv.style.borderLeft = '3px solid #ffc107';
        }

        itemDiv.dataset.content = content;
        container.appendChild(itemDiv);

        // 设置拖动功能
        setupDragItem(itemDiv, dragButton);
        return itemDiv;
    }

    // 设置拖动功能
    function setupDragItem(itemDiv, dragButton) {
        let isDragging = false;
        const dragContainer = dragButton.parentElement;
        let originalRect = null;
        let originalIndex = 0;
        let initialOffsetY = 0;

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

            // 计算鼠标相对于元素的初始偏移量
            initialOffsetY = e.clientY - originalRect.top;

            // 添加平滑过渡效果
            draggedItem.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // 拖动样式
            draggedItem.style.opacity = '0.9';
            draggedItem.style.transform = 'scale(1.02)';
            draggedItem.style.zIndex = '10001';
            draggedItem.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            draggedItem.style.background = '#f0f7ff';
            draggedItem.style.borderRadius = '4px';
            draggedItem.style.margin = '5px 0';
            draggedItem.style.position = 'absolute';
            draggedItem.style.width = `${originalRect.width}px`;
            draggedItem.style.left = `${originalRect.left}px`;
            draggedItem.style.top = `${originalRect.top}px`;
            draggedItem.style.pointerEvents = 'none';

            // 创建占位符
            const placeholder = document.createElement('div');
            placeholder.className = 'drag-placeholder';
            placeholder.style.height = `${originalRect.height}px`;
            placeholder.style.opacity = '0';
            placeholder.style.backgroundColor = '#e9ecef';
            placeholder.style.borderRadius = '4px';
            placeholder.style.margin = '5px 0';
            placeholder.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            itemDiv.parentNode.insertBefore(placeholder, itemDiv);
            itemDiv.placeholder = placeholder;

            // 占位符淡入动画
            setTimeout(() => {
                placeholder.style.opacity = '0.5';
            }, 50);
            
            // 拖动元素淡出动画
            setTimeout(() => {
                draggedItem.style.opacity = '0.8';
            }, 100);
        });

        // 拖动结束
        document.addEventListener('mouseup', () => {
            if (!isDragging ||!isEditMode ||!draggedItem) return;

            // 拖动元素淡入动画
            draggedItem.style.opacity = '1';
            draggedItem.style.transform = 'scale(1)';
            draggedItem.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            draggedItem.style.pointerEvents = 'auto';
            
            // 占位符淡出动画
            if (draggedItem.placeholder) {
                draggedItem.placeholder.style.opacity = '0';
            }

            // 延迟恢复样式和移动元素，让动画完成
            setTimeout(() => {
                draggedItem.classList.remove('dragging');
                // 恢复样式
                draggedItem.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                draggedItem.style.transform = '';
                draggedItem.style.zIndex = '';
                draggedItem.style.boxShadow = '';
                draggedItem.style.background = '';
                draggedItem.style.borderRadius = '';
                draggedItem.style.margin = '';
                draggedItem.style.position = '';
                draggedItem.style.width = '';
                draggedItem.style.left = '';
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
            }, 300);
        });

        // 鼠标移动时处理拖动
        document.addEventListener('mousemove', (e) => {
            if (!isDragging ||!isEditMode ||!draggedItem) return;

            e.preventDefault();

            // 计算新位置，确保元素跟随鼠标指针
            const listRect = itemList.getBoundingClientRect();
            const newTop = e.clientY - initialOffsetY;

            // 应用新位置
            draggedItem.style.transition = 'none';
            draggedItem.style.top = `${newTop}px`;

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

    // 标记公司
    function markItem(content, itemDiv) {
        if (!markedItems.includes(content)) {
            markedItems.push(content);
            GM_setValue('markedItems', markedItems);
            
            // 应用标记样式
            itemDiv.style.background = '#fff3cd';
            itemDiv.style.borderLeft = '3px solid #ffc107';
        }
    }

    // 取消标记公司
    function unmarkItem(content, itemDiv) {
        const index = markedItems.indexOf(content);
        if (index!== -1) {
            markedItems.splice(index, 1);
            GM_setValue('markedItems', markedItems);
            
            // 移除标记样式
            itemDiv.style.background = '#fff';
            itemDiv.style.borderLeft = 'none';
        }
    }

    // 取消所有标记
    function unmarkAllItems() {
        markedItems = [];
        GM_setValue('markedItems', markedItems);
        
        // 移除所有公司的标记样式
        const items = document.querySelectorAll('.tax-item');
        items.forEach(item => {
            item.style.background = '#fff';
            item.style.borderLeft = 'none';
        });
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
            const buttonContainer = item.querySelector('.action-buttons');

            if (isEditMode) {
                setTimeout(() => {
                    dragContainer.style.display = 'flex';
                    editBtn.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                    dragContainer.style.opacity = '0';
                    editBtn.style.opacity = '0';
                    deleteBtn.style.opacity = '0';

                    // 编辑模式下设置按钮容器最小宽度
                    if (buttonContainer) {
                        buttonContainer.style.minWidth = '80px';
                    }

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

                // 非编辑模式下设置按钮容器最小宽度为0
                if (buttonContainer) {
                    buttonContainer.style.minWidth = '0';
                }

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

            // 退出编辑模式后重新渲染列表，更新序号
            setTimeout(() => {
                renderItemsWithPagination();
            }, 300);
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
                
                // 编辑完成后重新渲染带分页的列表
                setTimeout(() => {
                    renderItemsWithPagination();
                }, 300);

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
            
            // 删除完成后重新渲染带分页的列表
            renderItemsWithPagination();
        }, 300);
    }

    // 更新条目顺序
    function updateItemOrder() {
        // 获取当前页面上显示的公司
        const displayedItems = Array.from(document.querySelectorAll('.tax-item'));
        const displayedItemContents = displayedItems.map(item => item.dataset.content);
        
        // 获取所有公司数据
        const allItems = GM_getValue('autoFillItems', []);
        
        // 创建一个映射，方便查找公司数据
        const itemMap = new Map();
        allItems.forEach(item => {
            itemMap.set(item.content, item);
        });
        
        // 首先添加当前页面上显示的公司（按当前顺序）
        const newItemOrder = [];
        displayedItems.forEach(item => {
            const content = item.dataset.content;
            if (itemMap.has(content)) {
                newItemOrder.push(itemMap.get(content));
                itemMap.delete(content);
            }
        });
        
        // 然后添加剩余的公司（保持原有顺序）
        allItems.forEach(item => {
            if (itemMap.has(item.content)) {
                newItemOrder.push(item);
                itemMap.delete(item.content);
            }
        });
        
        // 保存排序后的所有公司数据
        GM_setValue('autoFillItems', newItemOrder);
    }

    // 导入数据
    function importData() {
        const importModal = document.createElement('div');
        Object.assign(importModal.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: '#fff', border: '1px solid #ccc', padding: '20px', borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10001, display: 'flex',
            flexDirection: 'column', gap: '10px', width: '500px', opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
            background: 'rgba(0,0,0,0.5)', zIndex: 10000, opacity: '0', transition: 'opacity 0.3s ease'
        });
        document.body.appendChild(overlay);

        setTimeout(() => { importModal.style.opacity = '1'; overlay.style.opacity = '0.5'; }, 10);

        const importInfo = document.createElement('div');
        importInfo.style.cssText = 'font-size:13px; color:#666; margin-bottom:5px;';
        importInfo.innerHTML = '支持格式：<br>1. <b>Excel/文本直粘：</b>税号 [空格或制表符] 备注（每行一个）<br>2. <b>旧版格式：</b>税号,备注;税号,备注';
        importModal.appendChild(importInfo);

        const dataTextarea = document.createElement('textarea');
        dataTextarea.placeholder = '请粘贴数据...';
        dataTextarea.style.cssText = 'padding:8px; border:1px solid #ccc; border-radius:3px; height:200px; font-family:monospace;';
        importModal.appendChild(dataTextarea);

        const confirmButton = createButton('确认导入', () => {
            const dataStr = dataTextarea.value.trim();
            if (!dataStr) { alert('数据不能为空'); return; }

            try {
                let importedItems = [];
                // 自动识别：如果包含分号且不含换行，按旧格式解析；否则按行解析
                if (dataStr.includes(';') && !dataStr.includes('\n')) {
                    dataStr.split(';').forEach(raw => {
                        const parts = raw.split(/[,，]/); // 兼容中英文逗号
                        if (parts.length >= 2) importedItems.push({ content: parts[0].trim(), note: parts[1].trim() });
                    });
                } else {
                    dataStr.split(/\r?\n/).forEach(line => {
                        if (!line.trim()) return;
                        // 尝试匹配制表符、多个空格或逗号作为分隔符
                        const parts = line.split(/\t|\s{2,}|[,，]/);
                        const content = parts[0]?.trim();
                        const note = parts.slice(1).join(' ').trim(); // 备注可能包含空格
                        if (content && note) importedItems.push({ content, note });
                    });
                }

                if (importedItems.length === 0) throw new Error('未能识别有效数据，请检查分隔符');

                // 更新存储并刷新界面
                const existing = GM_getValue('autoFillItems', []);
                const newList = [...existing, ...importedItems];
                GM_setValue('autoFillItems', newList);

                // 导入完成后重新渲染带分页的列表
                setTimeout(() => {
                    renderItemsWithPagination();
                    alert(`成功导入 ${importedItems.length} 条数据！`);
                    closeModal();
                }, 100);
            } catch (e) { alert('导入失败: ' + e.message); }
        });

        const closeModal = () => {
            importModal.style.opacity = '0'; overlay.style.opacity = '0';
            setTimeout(() => { [importModal, overlay].forEach(el => el.remove()); }, 300);
        };

        importModal.appendChild(confirmButton);
        importModal.appendChild(createButton('取消', closeModal, true));
        overlay.onclick = closeModal;
        document.body.appendChild(importModal);
    }

    // 渲染分页控件
    function renderPaginationControls(totalPages) {
        // 检查是否已存在分页控件容器，如果存在则清空
        let paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination-container';
            Object.assign(paginationContainer.style, {
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                flexWrap: 'wrap'
            });
            mainContent.appendChild(paginationContainer);
        } else {
            paginationContainer.innerHTML = '';
        }
        
        // 如果分页功能未启用或只有一页，不显示分页控件
        if (!isPaginationEnabled || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        // 上一页按钮
        const prevButton = createButton('上一页', () => {
            if (currentPage > 1) {
                currentPage--;
                renderItemsWithPagination();
            }
        }, false, { padding: '4px 10px', fontSize: '12px' });
        prevButton.disabled = currentPage === 1;
        if (prevButton.disabled) {
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
            prevButton.removeEventListener('click', prevButton.onclick);
        }
        paginationContainer.appendChild(prevButton);
        
        // 页码按钮
        const maxVisiblePages = 5; // 最大显示的页码数
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // 调整起始页码，确保显示足够的页码
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 第一页按钮（如果当前页范围不包含第一页）
        if (startPage > 1) {
            const firstPageButton = createButton('1', () => {
                currentPage = 1;
                renderItemsWithPagination();
            }, false, { padding: '4px 8px', fontSize: '12px' });
            paginationContainer.appendChild(firstPageButton);
            
            if (startPage > 2) {
                const ellipsis1 = document.createElement('span');
                ellipsis1.textContent = '...';
                ellipsis1.style.margin = '0 5px';
                paginationContainer.appendChild(ellipsis1);
            }
        }
        
        // 中间页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = createButton(i.toString(), () => {
                currentPage = i;
                renderItemsWithPagination();
            }, false, { 
                padding: '4px 8px', 
                fontSize: '12px',
                background: i === currentPage ? '#28a745' : '#007BFF'
            });
            paginationContainer.appendChild(pageButton);
        }
        
        // 最后一页按钮（如果当前页范围不包含最后一页）
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis2 = document.createElement('span');
                ellipsis2.textContent = '...';
                ellipsis2.style.margin = '0 5px';
                paginationContainer.appendChild(ellipsis2);
            }
            
            const lastPageButton = createButton(totalPages.toString(), () => {
                currentPage = totalPages;
                renderItemsWithPagination();
            }, false, { padding: '4px 8px', fontSize: '12px' });
            paginationContainer.appendChild(lastPageButton);
        }
        
        // 下一页按钮
        const nextButton = createButton('下一页', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderItemsWithPagination();
            }
        }, false, { padding: '4px 10px', fontSize: '12px' });
        nextButton.disabled = currentPage === totalPages;
        if (nextButton.disabled) {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
            nextButton.removeEventListener('click', nextButton.onclick);
        }
        paginationContainer.appendChild(nextButton);
        
        // 页码信息
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `第 ${currentPage}/${totalPages} 页`;
        pageInfo.style.marginLeft = '10px';
        pageInfo.style.fontSize = '12px';
        pageInfo.style.color = '#666';
        paginationContainer.appendChild(pageInfo);
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