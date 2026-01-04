// ==UserScript==
// @license MIT
// @name         A君 - 悬浮菜单 - 脚本管理工具
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  添加悬浮菜单，支持脚本管理功能
// @author       Your name
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527326/A%E5%90%9B%20-%20%E6%82%AC%E6%B5%AE%E8%8F%9C%E5%8D%95%20-%20%E8%84%9A%E6%9C%AC%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/527326/A%E5%90%9B%20-%20%E6%82%AC%E6%B5%AE%E8%8F%9C%E5%8D%95%20-%20%E8%84%9A%E6%9C%AC%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 数据结构定义
    const scriptData = {
        groups: GM_getValue('scriptGroups', [])
    };

    // 替换所有的 localStorage 操作
    function saveData() {
        GM_setValue('scriptGroups', scriptData.groups);
    }

    // 更新样式
    const style = document.createElement('style');
    style.textContent = `
        .floating-btn {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            cursor: move;
            user-select: none;
            border-radius: 16px;
            color: #1c1c1e;
            font-size: 15px;
            min-width: 32px;
            text-align: center;
            transition: all 0.3s;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
            border: 1px solid rgba(0, 0, 0, 0.08);
            font-weight: 500;
        }

        .floating-btn:hover {
            background: rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
        }

        .right-drawer {
            position: fixed;
            top: 0;
            right: -540px;
            width: 540px;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9999;
            border-radius: 16px 0 0 16px;
        }

        .tree-node-content {
            display: flex;
            align-items: center;
            height: 44px;
            cursor: pointer;
            padding: 0 20px;
            margin: 4px 0;
            border-radius: 10px;
            font-size: 15px;
        }

        .tree-node-content:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .script-actions button {
            padding: 4px 8px;
            font-size: 13px;
            color: #007AFF;
            background: transparent;
            border: none;
            cursor: pointer;
            margin-left: 8px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .script-actions button:hover {
            background: rgba(0, 122, 255, 0.1);
        }

        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dialog {
            background: rgba(255, 255, 255, 0.98);
            padding: 28px;
            border-radius: 20px;
            min-width: 420px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .dialog-header {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #1c1c1e;
        }

        .dialog-content {
            margin-bottom: 28px;
        }

        .dialog input, .dialog textarea {
            width: 100%;
            padding: 14px;
            margin-bottom: 16px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            font-size: 15px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.2s;
        }

        .dialog input:focus, .dialog textarea:focus {
            outline: none;
            border-color: #007AFF;
            background: rgba(255, 255, 255, 0.95);
        }

        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
        }

        .dialog-btn {
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }

        .dialog-btn.primary {
            background: #007AFF;
            color: white;
        }

        .dialog-btn.primary:hover {
            background: #0066CC;
        }

        .dialog-btn.default {
            background: rgba(0, 0, 0, 0.05);
            color: #1c1c1e;
        }

        .dialog-btn.default:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        #searchInput {
            height: 44px;
            background: rgba(0, 0, 0, 0.04);
            border: none;
            border-radius: 12px;
            padding: 0 18px;
            font-size: 15px; 
        }

        #searchBtn {
            height: 40px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            font-size: 14px;
            transition: all 0.2s;
        }

        #searchBtn:hover {
            background: #0066CC;
        }

        .action-btn.delete {
            color: #FF3B30;
        }

        .action-btn.delete:hover {
            background: rgba(255, 59, 48, 0.1);
        }

        .action-btn.run {
            color: #34C759;
        }

        .action-btn.run:hover {
            background: rgba(52, 199, 89, 0.1);
        }

        .expand-icon {
            display: flex;
            align-items: center;
            margin-right: 8px;
            transition: transform 0.2s;
        }

        .icon {
            display: inline-flex;
            align-items: center;
            margin-right: 8px;
            opacity: 0.8;
        }

        .script-actions {
            opacity: 0;
            transition: opacity 0.2s;
        }

        .tree-node-content:hover .script-actions {
            opacity: 1;
        }

        .action-btn {
            padding: 6px 12px;
            font-size: 14px;
            background: transparent;
            border: none;
            cursor: pointer;
            margin-left: 8px;
            border-radius: 8px;
            transition: all 0.2s;
            color: #007AFF;
            font-weight: 500;
        }

        .tree-node-children {
            margin-left: 28px;
        }

        #addGroupBtn {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            margin-bottom: 16px;
            color: #007AFF;
            background: rgba(0, 122, 255, 0.1);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            width: auto;
        }

        #addGroupBtn:hover {
            background: rgba(0, 122, 255, 0.15);
        }

        #addGroupBtn i {
            font-size: 18px;
            margin-right: 8px;
        }

        .node-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            font-weight: 450;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮按钮
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'floating-btn';
    floatingBtn.innerHTML = '我的工具';

    // Add new styles for hover panel and toast
const additionalStyles = `

.hover-panel {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 5px; /* 减小间隔距离 */
    padding-bottom: 5px; /* 添加底部内边距 */
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 12px;
    min-width: 200px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: none;
}

/* 添加一个透明的连接区域 */
.hover-panel::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 10px;
    background: transparent;
}


.group-section {
    margin-bottom: 12px;
}

.group-title {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.script-button {
    display: block;
    width: 100%;
    padding: 8px 12px;
    margin: 4px 0;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    color: #333;
    transition: all 0.2s;
}

.script-button:hover {
    background: rgba(0, 122, 255, 0.1);
    color: #007AFF;
}

.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
`;

// Add the styles to the existing style element
style.textContent += additionalStyles;

// Create hover panel
const hoverPanel = document.createElement('div');
hoverPanel.className = 'hover-panel';

// Add hover events to floating button
floatingBtn.addEventListener('mouseenter', () => {
    updateHoverPanel();
    hoverPanel.style.display = 'block';
});

floatingBtn.addEventListener('mouseleave', (e) => {
    // Check if mouse is moving to hover panel
    const toElement = e.relatedTarget;
    if (!hoverPanel.contains(toElement)) {
        hoverPanel.style.display = 'none';
    }
});

hoverPanel.addEventListener('mouseleave', () => {
    hoverPanel.style.display = 'none';
});

// Function to show toast message
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Function to update hover panel content
function updateHoverPanel() {
    hoverPanel.innerHTML = scriptData.groups.map(group => `
        <div class="group-section">
            <div class="group-title">${group.name}</div>
            ${group.scripts.map(script => `
                <button class="script-button" data-script-id="${script.id}">
                    ${script.name}
                </button>
            `).join('')}
        </div>
    `).join('');

    // Add click events to script buttons
    hoverPanel.querySelectorAll('.script-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const scriptId = e.target.dataset.scriptId;
            const script = findScript(scriptId);
            if (script) {
                try {
                    const scriptFunc = new Function(script.content);
                    const result = scriptFunc();
                    showToast(`脚本 "${script.name}" 执行成功${result ? ': ' + result : ''}`);
                } catch (error) {
                    showToast(`脚本 "${script.name}" 执行失败: ${error.message}`, 'error');
                    console.error('Script execution error:', error);
                }
            }
        });
    });
}

// Add hover panel to floating button
floatingBtn.appendChild(hoverPanel);

    // 从GM_getValue获取保存的位置
    const savedPosition = GM_getValue('floatingBtnPosition', {});
    if (savedPosition.left) floatingBtn.style.left = savedPosition.left;
    if (savedPosition.top) floatingBtn.style.top = savedPosition.top;
    if (savedPosition.right) floatingBtn.style.right = savedPosition.right;
    if (savedPosition.bottom) floatingBtn.style.bottom = savedPosition.bottom;

    // 添加拖动功能
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;

    floatingBtn.addEventListener('mousedown', function(e) {
        if (e.button === 0) { // 只响应左键
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = floatingBtn.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            floatingBtn.style.transition = 'none';
            e.preventDefault();
        }
    });
    // 修改悬停相关的事件处理逻辑
floatingBtn.addEventListener('mouseenter', () => {
    updateHoverPanel();
    hoverPanel.style.display = 'block';
});
floatingBtn.addEventListener('mouseleave', (e) => {
    // 添加延时检查，避免面板消失太快
    setTimeout(() => {
        const toElement = e.relatedTarget;
        if (!hoverPanel.contains(toElement) && document.activeElement !== hoverPanel) {
            // 检查鼠标是否在面板区域内
            const rect = hoverPanel.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;

            if (!(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)) {
                hoverPanel.style.display = 'none';
            }
        }
    }, 100);
});

// 修改悬停面板的鼠标离开事件
hoverPanel.addEventListener('mouseleave', (e) => {
    // 检查鼠标是否移动到了悬浮按钮上
    const toElement = e.relatedTarget;
    if (!floatingBtn.contains(toElement)) {
        hoverPanel.style.display = 'none';
    }
});

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;

        const maxX = window.innerWidth - floatingBtn.offsetWidth;
        const maxY = window.innerHeight - floatingBtn.offsetHeight;

        floatingBtn.style.left = Math.min(Math.max(0, newLeft), maxX) + 'px';
        floatingBtn.style.top = Math.min(Math.max(0, newTop), maxY) + 'px';
        floatingBtn.style.right = 'auto';
        floatingBtn.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            floatingBtn.style.transition = 'all 0.3s';

            const position = {
                left: floatingBtn.style.left,
                top: floatingBtn.style.top,
                right: 'auto',
                bottom: 'auto'
            };
            GM_setValue('floatingBtnPosition', position);
        }
    });

    // 创建右侧抽屉
    const drawer = document.createElement('div');
    drawer.className = 'right-drawer';

    // 添加抽屉头部
    const drawerHeader = document.createElement('header');
    drawerHeader.innerHTML = `
        <div style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid #ddd;">
            <span style="flex:1;font-size:16px;">脚本管理</span>
            <button class="close-drawer" style="background:none;border:none;cursor:pointer;font-size:20px;">×</button>
        </div>
    `;
    drawer.appendChild(drawerHeader);

    // 添加抽屉内容
    const drawerContent = document.createElement('div');
    drawerContent.style.cssText = `
        height: calc(100% - 57px);
        padding: 16px 0;
        overflow-y: auto;
    `;
    drawerContent.innerHTML = `
        <div style="margin:0 20px;">
            <div style="display:flex;align-items:center;margin-bottom:10px;">
                <input type="text" placeholder="请输入脚本名称" id="searchInput" style="flex:1;height:40px;padding:0 12px;border:1px solid #dcdfe6;border-radius:4px;">
                <button id="searchBtn" style="margin-left:12px;height:40px;padding:0 15px;background:#1890ff;color:white;border:none;border-radius:4px;cursor:pointer;">搜 索</button>
            </div>
            <button id="addGroupBtn" style="padding:4px 0;color:#409eff;background:none;border:none;cursor:pointer;font-size:12px;">
                <i style="margin-right:4px;">+</i>新建脚本组
            </button>
            <div id="scriptTree"></div>
        </div>
    `;
    drawer.appendChild(drawerContent);

    // 添加到页面
    document.body.appendChild(floatingBtn);
    document.body.appendChild(drawer);

    // 添加右键菜单事件
    floatingBtn.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        drawer.style.right = '0';
    });

    // 关闭抽屉
    const closeBtn = drawer.querySelector('.close-drawer');
    closeBtn.addEventListener('click', function() {
        drawer.style.right = '-540px';
    });

    // 点击抽屉外部关闭
    document.addEventListener('click', function(e) {
        if (!drawer.contains(e.target) && !floatingBtn.contains(e.target)) {
            drawer.style.right = '-540px';
        }
    });

    // 添加创建对话框的函数
    function createDialog({ title, content, onConfirm, onCancel }) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog-overlay';
        dialog.innerHTML = `
            <div class="dialog">
                <div class="dialog-header">${title}</div>
                <div class="dialog-content">${content}</div>
                <div class="dialog-footer">
                    <button class="dialog-btn default" id="cancelBtn">取消</button>
                    <button class="dialog-btn primary" id="confirmBtn">确定</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 添加事件监听
        dialog.querySelector('#cancelBtn').onclick = () => {
            onCancel && onCancel();
            dialog.remove();
        };

        dialog.querySelector('#confirmBtn').onclick = () => {
            onConfirm && onConfirm(dialog);
            dialog.remove();
        };

        return dialog;
    }

    // 添加新建脚本组的处理函数
    function handleAddGroup() {
        createDialog({
            title: '新建脚本组',
            content: `
                <div style="margin-bottom: 8px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">脚本组名称</label>
                    <input type="text" placeholder="请输入脚本组名称" id="groupNameInput">
                </div>
            `,
            onConfirm: (dialog) => {
                const groupName = dialog.querySelector('#groupNameInput').value.trim();
                if (!groupName) {
                    alert('请输入脚本组名称');
                    return;
                }

                const newGroup = {
                    id: Date.now(),
                    name: groupName,
                    scripts: [],
                    expanded: true
                };

                scriptData.groups.push(newGroup);
                saveData(); // 使用新的保存方法
                renderScriptTree();
            }
        });
    }

    // 修改渲染脚本树的函数
    function renderScriptTree(searchText = '') {
        const treeContainer = document.querySelector('#scriptTree');
        if (!treeContainer) return;

        const filteredGroups = scriptData.groups.map(group => {
            // 深拷贝组对象
            const filteredGroup = {...group};
            if (searchText) {
                // 过滤符合搜索条件的脚本
                filteredGroup.scripts = group.scripts.filter(script =>
                    script.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    script.content?.toLowerCase().includes(searchText.toLowerCase())
                );
                // 如果组内有匹配的脚本，则显示组
                return filteredGroup.scripts.length > 0 ? filteredGroup : null;
            }
            return filteredGroup;
        }).filter(Boolean);

        treeContainer.innerHTML = filteredGroups.map(group => `
            <div class="tree-node" data-group-id="${group.id}">
                <div class="tree-node-content">
                    <i class="expand-icon" style="transform: rotate(${group.expanded ? '90deg' : '0deg'})">
                       <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                    </i>
                    <span class="node-label">
                        <span>
                            <i class="icon folder-icon">
                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6h-8l-1.41-1.41C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 9.79V14H9c-.55 0-1-.45-1-1s.45-1 1-1h3v-1.79c0-.45.54-.67.85-.35l2.79 2.79c.2.2.2.51 0 .71l-2.79 2.79a.5.5 0 0 1-.85-.36z" fill="currentColor"/></svg>
                            </i>
                            ${group.name}
                        </span>
                        <span class="script-actions">
                            <button class="action-btn edit-group-btn" data-group-id="${group.id}">修改</button>
                            <button class="action-btn delete delete-group-btn" data-group-id="${group.id}">删除</button>
                            <button class="action-btn add-script-btn" data-group-id="${group.id}">添加脚本</button>
                        </span>
                    </span>
                </div>
                <div class="tree-node-children" style="display: ${group.expanded ? 'block' : 'none'}">
                    ${group.scripts.map(script => `
                        <div class="tree-node script-item" data-script-id="${script.id}">
                            <div class="tree-node-content">
                                <span class="node-label">
                                    <span>
                                        <i class="icon script-icon">
                                           <svg  viewBox="0 0 24 24"  width="16" height="16"   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><g fill="none"><path d="M3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25zm9 3.25a.75.75 0 0 1 .75.75v6A1.75 1.75 0 0 1 11 18H9.75a.75.75 0 0 1 0-1.5H11a.25.25 0 0 0 .25-.25v-6A.75.75 0 0 1 12 9.5zm2 1.75c0-.966.784-1.75 1.75-1.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0 1 16.25 18h-1.5a.75.75 0 0 1 0-1.5h1.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25h-.5A1.75 1.75 0 0 1 14 12.75v-1.5z" fill="currentColor"></path></g></svg>
                                        </i>
                                        ${script.name}
                                    </span>
                                    <span class="script-actions">
                                        <button class="action-btn edit-script-btn" data-script-id="${script.id}">修改</button>
                                        <button class="action-btn delete delete-script-btn" data-script-id="${script.id}">删除</button>
                                        <button class="action-btn run run-script-btn" data-script-id="${script.id}">执行</button>
                                    </span>
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        addTreeEventListeners();
    }

    // 修改事件监听函数，添加修改、删除和执行功能
    function addTreeEventListeners() {
        // 展开/折叠图标点击事件
        document.querySelectorAll('.expand-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const groupNode = e.target.closest('.tree-node');
                const childrenContainer = groupNode.querySelector('.tree-node-children');
                const groupId = groupNode.dataset.groupId;
                const group = scriptData.groups.find(g => g.id.toString() === groupId);

                group.expanded = !group.expanded;
                childrenContainer.style.display = group.expanded ? 'block' : 'none';
                icon.style.transform = `rotate(${group.expanded ? '90deg' : '0deg'})`;

                saveData();
            });
        });

        // 添加脚本按钮点击事件
        document.querySelectorAll('.add-script-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.groupId;
                handleAddScript(groupId);
            });
        });

        // 修改脚本组
        document.querySelectorAll('.edit-group-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.groupId;
                const group = scriptData.groups.find(g => g.id.toString() === groupId);
                if (group) {
                    createDialog({
                        title: '修改脚本组',
                        content: `
                            <input type="text" placeholder="请输入脚本组名称" id="groupNameInput" value="${group.name}">
                        `,
                        onConfirm: (dialog) => {
                            const newName = dialog.querySelector('#groupNameInput').value.trim();
                            if (!newName) {
                                alert('请输入脚本组名称');
                                return;
                            }
                            group.name = newName;
                            saveData();
                            renderScriptTree();
                        }
                    });
                }
            });
        });

        // 删除脚本组
        document.querySelectorAll('.delete-group-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.groupId;
                const group = scriptData.groups.find(g => g.id.toString() === groupId);
                if (group) {
                    if (confirm(`确定要删除脚本组"${group.name}"吗？其下所有脚本都将被删除。`)) {
                        scriptData.groups = scriptData.groups.filter(g => g.id.toString() !== groupId);
                        saveData();
                        renderScriptTree();
                    }
                }
            });
        });

        // 修改脚本
        document.querySelectorAll('.edit-script-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scriptId = e.target.dataset.scriptId;
                const script = findScript(scriptId);
                if (script) {
                    createDialog({
                        title: '修改脚本',
                        content: `
                            <div style="margin-bottom: 15px;">
                                <input type="text" placeholder="请输入脚本名称" id="scriptNameInput" value="${script.name}">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <textarea placeholder="请输入脚本内容" id="scriptContentInput" style="width: 100%; min-height: 100px; padding: 8px;">${script.content}</textarea>
                            </div>
                            <div>
                                <textarea placeholder="请输入脚本描述" id="scriptDescInput" style="width: 100%; min-height: 60px; padding: 8px;">${script.description || ''}</textarea>
                            </div>
                        `,
                        onConfirm: (dialog) => {
                            const name = dialog.querySelector('#scriptNameInput').value.trim();
                            const content = dialog.querySelector('#scriptContentInput').value.trim();
                            const description = dialog.querySelector('#scriptDescInput').value.trim();

                            if (!name || !content) {
                                alert('请输入脚本名称和内容');
                                return;
                            }

                            script.name = name;
                            script.content = content;
                            script.description = description;
                            saveData();
                            renderScriptTree();
                        }
                    });
                }
            });
        });

        // 删除脚本
        document.querySelectorAll('.delete-script-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scriptId = e.target.dataset.scriptId;
                const script = findScript(scriptId);
                if (script && confirm(`确定要删除脚本"${script.name}"吗？`)) {
                    scriptData.groups.forEach(group => {
                        group.scripts = group.scripts.filter(s => s.id.toString() !== scriptId);
                    });
                    saveData();
                    renderScriptTree();
                }
            });
        });

        // 执行脚本
        document.querySelectorAll('.run-script-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scriptId = e.target.dataset.scriptId;
                const script = findScript(scriptId);
                if (script) {
                    try {
                        // 使用 Function 构造器创建一个新的函数作用域来执行脚本
                        const scriptFunc = new Function(script.content);
                        scriptFunc();
                    } catch (error) {
                        alert(`脚本执行出错：${error.message}`);
                        console.error('脚本执行错误:', error);
                    }
                }
            });
        });
    }

    // 辅助函数：查找脚本
    function findScript(scriptId) {
        for (const group of scriptData.groups) {
            const script = group.scripts.find(s => s.id.toString() === scriptId);
            if (script) return script;
        }
        return null;
    }

    // 添加脚本的处理函数
    function handleAddScript(groupId) {
        createDialog({
            title: '添加脚本',
            content: `
                <div style="margin-bottom: 15px;">
                    <input type="text" placeholder="请输入脚本名称" id="scriptNameInput">
                </div>
                <div style="margin-bottom: 15px;">
                    <textarea placeholder="请输入脚本内容" id="scriptContentInput" style="width: 100%; min-height: 100px; padding: 8px;"></textarea>
                </div>
                <div>
                    <textarea placeholder="请输入脚本描述" id="scriptDescInput" style="width: 100%; min-height: 60px; padding: 8px;"></textarea>
                </div>
            `,
            onConfirm: (dialog) => {
                const name = dialog.querySelector('#scriptNameInput').value.trim();
                const content = dialog.querySelector('#scriptContentInput').value.trim();
                const description = dialog.querySelector('#scriptDescInput').value.trim();

                if (!name || !content) {
                    alert('请输入脚本名称和内容');
                    return;
                }

                const group = scriptData.groups.find(g => g.id.toString() === groupId);
                if (group) {
                    group.scripts.push({
                        id: Date.now(),
                        name,
                        content,
                        description
                    });
                    saveData();
                    renderScriptTree();
                }
            }
        });
    }

    // 搜索功能
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');

    searchBtn.addEventListener('click', () => {
        const searchText = searchInput.value.trim();
        renderScriptTree(searchText);
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const searchText = searchInput.value.trim();
            renderScriptTree(searchText);
        }
    });

    // 绑定新建脚本组按钮的点击事件
    const addGroupBtn = document.querySelector('#addGroupBtn');
    addGroupBtn.addEventListener('click', handleAddGroup);

    // 初始渲染脚本树
    renderScriptTree();

    // ... 其他脚本管理相关函数 ...

})();