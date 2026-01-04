// ==UserScript==
// @name         Pinterest环形收藏夹
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Pinterest详情页环形展开收藏夹
// @author       You
// @match        https://www.pinterest.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530059/Pinterest%E7%8E%AF%E5%BD%A2%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/530059/Pinterest%E7%8E%AF%E5%BD%A2%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 为环形菜单添加CSS样式
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .radial-menu-container {
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            width: 0;
            height: 0;
        }

        .radial-menu {
            position: absolute;
            width: 500px;
            height: 250px; /* 半高，因为是半圆 */
            border-radius: 250px 250px 0 0; /* 修改为上半部分为圆形，底部为直线 */
            /* 移除背景颜色和阴影效果 */
            background-color: transparent;
            box-shadow: none;
            pointer-events: auto;
            transform: translate(-50%, 0); /* 修改为向左平移一半，向下平移0 */
        }

        .radial-menu-item {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
            color: #333;
            transition: all 0.2s ease;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 5px;
            border-radius: 6px;
            background-color: rgba(255, 255, 255, 0.85);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .radial-menu-item:hover {
            background-color: rgba(230, 0, 35, 0.1);
            color: #e60023;
            transform: scale(1.05);
        }

        .radial-menu-center {
            position: absolute;
            width: 70px;
            height: 70px;
            background-color: #e60023;
            border-radius: 50%;
            left: 50%;
            bottom: 20px; /* 放在半圆的底部 */
            transform: translate(-50%, 0);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(230, 0, 35, 0.5);
            z-index: 2;
        }

        .radial-menu-ring {
            position: absolute;
            border-radius: 0 0 250px 250px; /* 下半圆 */
            border: 1px dashed rgba(200, 200, 200, 0.1);
            bottom: 0; /* 底部对齐 */
            left: 50%;
            transform: translateX(-50%);
            height: 50%; /* 半高 */
        }

        .radial-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            // 修改透明度为 70%
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            pointer-events: auto;
        }

        .radial-menu-item-icon {
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }

        .radial-menu-item-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 100%;
        }

        .radial-menu-item-name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 100%;
            font-size: 12px;
        }

        .radial-save-button {
            background-color: #efefef;
            border: none;
            border-radius: 20px;
            padding: 8px 12px;
            margin-left: 8px;
            color: #333;
            font-weight: bold;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .radial-save-button:hover {
            background-color: #e2e2e2;
        }

        .radial-save-icon {
            margin-right: 4px;
            width: 16px;
            height: 16px;
        }
    `;
    document.head.appendChild(styleElement);

    // 存储用户收藏夹的数组
    let userBoards = [];
    let menuVisible = false;
    let menuContainer = null;
    let overlayElement = null;
    let currentPinData = null;

    // 显示半圆形菜单的函数
    function showRadialMenu() {
        // 先获取用户的收藏夹
        fetchUserBoards().then(boards => {
            // 查找原始保存按钮
            const originSaveBtn = document.querySelector('button[aria-label="保存"]');
            if (!originSaveBtn) {
                console.log('未找到原始保存按钮');
                return;
            }

            // 获取原始保存按钮的位置
            const rect = originSaveBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const startY = rect.top;

            // 创建遮罩层
            overlayElement = document.createElement('div');
            overlayElement.className = 'radial-menu-overlay';
            overlayElement.addEventListener('click', hideRadialMenu);
            console.log('遮罩层元素创建:', overlayElement); // 添加日志输出
            document.body.appendChild(overlayElement);
            console.log('遮罩层元素添加到文档:', overlayElement); // 添加日志输出

            // 创建新的遮罩层（遮罩2）
            const overlayElement2 = document.createElement('div');
            overlayElement2.className = 'radial-menu-overlay2'; // 新的类名
            overlayElement2.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 可以根据需要调整样式
            overlayElement2.style.position = 'fixed';
            overlayElement2.style.top = '0';
            overlayElement2.style.left = '0';
            overlayElement2.style.right = '0';
            overlayElement2.style.bottom = '0';
            overlayElement2.style.zIndex = '9997'; // 确保在原有遮罩层之下
            overlayElement2.addEventListener('click', hideRadialMenu);
            document.body.appendChild(overlayElement2);

            // 创建菜单容器
            menuContainer = document.createElement('div');
            menuContainer.className = 'radial-menu-container';
            menuContainer.style.left = `${centerX}px`;
            menuContainer.style.top = `${startY}px`;

            // 创建半圆形菜单
            const radialMenu = document.createElement('div');
            radialMenu.className = 'radial-menu';

            // 创建指示环（半圆）
            createRing(radialMenu, 100, 100); // 第一圈，修改半径为100
            createRing(radialMenu, 220, 220); // 第二圈，修改半径为220
            createRing(radialMenu, 340, 340); // 第三圈，修改半径为340

            // 根据收藏夹数量自动分配半圆形布局
            distributeItemsInSemiCircle(radialMenu, boards);

            menuContainer.appendChild(radialMenu);
            document.body.appendChild(menuContainer);
            menuVisible = true;
        });
    }

    // 创建指示环（半圆）
    function createRing(parent, width, height) {
        const ring = document.createElement('div');
        ring.className = 'radial-menu-ring';
        ring.style.width = `${width}px`;
        ring.style.height = `${height / 2}px`; // 半高，形成半圆
        parent.appendChild(ring);
    }

    // 在半圆中分配项目
    function distributeItemsInSemiCircle(radialMenu, boards) {
        // 第一圈最多6个
        createItemsSemiCircle(radialMenu, boards, 0, Math.min(6, boards.length), 100, 50, 90);

        // 如果收藏夹数量大于6，第二圈最多10个
        if (boards.length > 6) {
            createItemsSemiCircle(radialMenu, boards, 6, Math.min(16, boards.length), 220, 50, 90);
        }

        // 如果收藏夹数量大于16，剩余的放在第三圈
        if (boards.length > 16) {
            createItemsSemiCircle(radialMenu, boards, 16, boards.length, 340, 50, 90);
        }
    }

    // 创建半圆形中的项目 - 调整角度计算为下半圆
    function createItemsSemiCircle(radialMenu, boards, startIdx, endIdx, radius, width, height) {
        const totalItems = endIdx - startIdx;

        for (let i = startIdx; i < endIdx; i++) {
            const board = boards[i];
            // 角度范围从0到π（上半圆）
            const angle = (Math.PI * (i - startIdx)) / totalItems;
            const posX = radius * Math.cos(angle);
            const posY = radius * Math.sin(angle);

            const item = document.createElement('div');
            item.className = 'radial-menu-item';

            const itemInner = document.createElement('div');
            itemInner.className = 'radial-menu-item-inner';

            // 移除添加图标的逻辑

            // 添加收藏夹名称
            const nameSpan = document.createElement('span');
            nameSpan.className = 'radial-menu-item-name';
            nameSpan.textContent = board.name;
            itemInner.appendChild(nameSpan);

            item.appendChild(itemInner);

            // 设置高度固定为12px
            height = 12;
            // 计算宽度，为标题显示完整的宽度加上5px，最小为60px
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.whiteSpace = 'nowrap';
            tempDiv.textContent = board.name;

            // 复制收藏夹名称的样式
            const style = window.getComputedStyle(nameSpan);
            tempDiv.style.fontFamily = style.fontFamily;
            tempDiv.style.fontSize = style.fontSize;
            tempDiv.style.fontWeight = style.fontWeight;
            tempDiv.style.padding = style.padding;

            document.body.appendChild(tempDiv);
            width = Math.max(60, tempDiv.offsetWidth + 5);
            document.body.removeChild(tempDiv);

            // 位置计算，对于下半圆形布局
            item.style.left = `${250 + posX - width / 2}px`;
            item.style.top = `${posY - height / 2}px`;
            item.style.width = `${width}px`;
            item.style.height = `${height}px`;

            // 计算旋转角度，使长边朝着圆心
            let rotationAngle = (angle - Math.PI / 2 + Math.PI / 2) * (180 / Math.PI);

            // 如果在圆心左侧，额外旋转180度
            if (posX < 0) {
                rotationAngle += 180;
            }

            item.style.transform = `rotate(${rotationAngle}deg)`;

            item.addEventListener('click', () => {
                console.log(`保存到"${board.name}"`);
                hideRadialMenu();

                // 保存收藏夹ID和名称
                const boardId = board.id;
                const boardName = board.name;

                // 使用新方法保存到指定收藏夹
                saveToBoard(boardId, boardName);
            });

            radialMenu.appendChild(item);
        }
    }

// 优化后的保存到指定收藏夹的函数
function saveToBoard(boardId, boardName) {
    console.log(`正在尝试保存到收藏夹: ${boardName} (ID: ${boardId})`);

    // 查找选择收藏夹的下拉按钮
    const boardSelectionButton = document.querySelector('[data-test-id="PinBetterSaveDropdown"]');
    if (!boardSelectionButton) {
        console.log('未找到收藏夹选择按钮');
        return;
    }

    // 模拟点击下拉按钮，打开收藏夹列表
    triggerMouseEvent(boardSelectionButton, "mousedown");
    triggerMouseEvent(boardSelectionButton, "mouseup");
    triggerMouseEvent(boardSelectionButton, "click");

    // 等待下拉菜单出现
    setTimeout(() => {
        // 查找所有收藏夹项目
        const boardItems = document.querySelectorAll('[data-test-id="boardWithoutSection"]');
        console.log(`找到${boardItems.length}个收藏夹项目`);

        for (const item of boardItems) {
            const titleEl = item.querySelector('.X8m.zDA');
            if (titleEl && titleEl.textContent === boardName) {
                console.log(`找到匹配的收藏夹: ${boardName}`);

                // 查找收藏夹后面的保存按钮
                let saveBtn = item.querySelector('button[aria-label="收藏按钮"], button[aria-label="Save"], button[aria-label="保存"]');

                if (!saveBtn) {
                    // 如果没找到，尝试查找收藏夹项目内的任何按钮
                    saveBtn = item.querySelector('button');
                }

                if (!saveBtn) {
                    // 如果仍然没找到，尝试查找可能包含保存功能的div元素
                    const divs = item.querySelectorAll('div[role="button"]');
                    for (const div of divs) {
                        if (div !== item) { // 避免选中整个收藏夹项目
                            saveBtn = div;
                            break;
                        }
                    }
                }

                if (saveBtn) {
                    console.log(`找到收藏夹 "${boardName}" 的按钮元素，点击它`);
                    // 在点击前先添加日志，输出找到的元素详情，有助于调试
                    console.log('找到的按钮元素:', saveBtn.outerHTML);
                    triggerMouseEvent(saveBtn, "mousedown");
                    triggerMouseEvent(saveBtn, "mouseup");
                    triggerMouseEvent(saveBtn, "click");
                    // 关闭下拉菜单
                    document.body.click();
                    return;
                } else {
                    console.log(`在收藏夹 "${boardName}" 中未找到保存按钮`);
                }
            }
        }

        console.log(`未找到匹配的收藏夹: ${boardName}`);
        // 关闭下拉菜单
        document.body.click();
    }, 500); // 适当增加等待时间确保菜单完全打开
}

    // 隐藏环形菜单的函数
    function hideRadialMenu() {
        if (menuContainer) {
            document.body.removeChild(menuContainer);
            menuContainer = null;
        }
        if (overlayElement) {
            document.body.removeChild(overlayElement);
            overlayElement = null;
        }
        // 新增：移除遮罩层2
        const overlayElement2 = document.querySelector('.radial-menu-overlay2');
        if (overlayElement2) {
            document.body.removeChild(overlayElement2);
        }
        menuVisible = false;
    }

    // 获取用户收藏夹的函数
    async function fetchUserBoards() {
        // 清空之前的收藏夹数据
        userBoards = [];

        // 查找选择收藏夹的下拉按钮
        const boardSelectionButton = document.querySelector('[data-test-id="PinBetterSaveDropdown"]');
        if (!boardSelectionButton) {
            console.log('未找到收藏夹选择按钮');
            return userBoards;
        }

        // 模拟点击下拉按钮，打开收藏夹列表
        triggerMouseEvent(boardSelectionButton, "mousedown");
        triggerMouseEvent(boardSelectionButton, "mouseup");
        triggerMouseEvent(boardSelectionButton, "click");

        // 等待下拉菜单出现（等待500ms）
        await new Promise(resolve => setTimeout(resolve, 500));

        // 查找所有收藏夹项目
        const boardItems = document.querySelectorAll('[data-test-id="boardWithoutSection"]');

        // 解析收藏夹数据
        boardItems.forEach(item => {
            // 查找收藏夹名称
            const titleEl = item.querySelector('.X8m.zDA');
            if (!titleEl) return;

            const boardName = titleEl.textContent;

            // 获取收藏夹ID（如果有）
            let boardId = "";
            // 尝试从data-test-id属性获取ID
            const testId = item.getAttribute('data-test-id');
            if (testId && testId.includes("board-row-")) {
                boardId = testId.replace("board-row-", "");
            }

            // 查找收藏夹图标（如果有）
            const iconEl = item.querySelector('img');
            const iconUrl = iconEl ? iconEl.src : null;

            const icon = iconUrl ? `<img src="${iconUrl}" width="16" height="16" style="border-radius: 4px;">` : null;
            console.log('收藏夹', boardName, '图标 URL:', iconUrl); // 添加日志输出

            userBoards.push({
                id: boardId,
                name: boardName,
                icon: icon,
                element: item
            });
        });

        // 关闭下拉菜单
        document.body.click();

        console.log(`找到${userBoards.length}个收藏夹`);

        // 如果没有找到收藏夹，创建一些测试数据
        if (userBoards.length === 0) {
            // 创建更多测试数据以测试多层环状布局
            const testBoards = [
                "个人资料", "美食", "旅行", "时尚", "艺术", "设计", "科技", "摄影",
                "健身", "家居", "手工", "园艺", "宠物", "电影", "音乐", "书籍",
                "动漫", "教育", "建筑", "美容", "汽车", "婚礼", "绘画", "户外",
                "游戏", "历史", "儿童", "节日", "引用", "灵感"
            ];

            testBoards.forEach((name, index) => {
                userBoards.push({
                    id: `test-${index}`,
                    name: name,
                    icon: null,
                    element: null
                });
            });
            console.log('未找到收藏夹，使用测试数据');
        }

        return userBoards;
    }

    // 用于触发鼠标事件的辅助函数
    function triggerMouseEvent(element, eventType) {
        const mouseEvent = document.createEvent("MouseEvents");
        mouseEvent.initEvent(eventType, true, true);
        element.dispatchEvent(mouseEvent);
    }

    // 添加环形保存按钮的函数，现在改为添加A按钮
    function addRadialSaveButton() {
        // 创建一个MutationObserver来监听DOM变化
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    // 查找原始保存按钮
                    const saveButtons = document.querySelectorAll('button[aria-label="保存"]:not([data-radial-menu])');

                    saveButtons.forEach(button => {
                        // 标记按钮为已处理
                        button.setAttribute('data-radial-menu', 'true');

                        // 创建A按钮
                        const radialButton = document.createElement('button');
                        radialButton.className = 'radial-save-button';
                        radialButton.innerHTML = `
                            <svg class="radial-save-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="#333" stroke-width="2" fill="none"/>
                                <path d="M6 12 L18 12 M12 6 L12 18" stroke="#333" stroke-width="2"/>
                            </svg>
                            A按钮
                        `;

                        // 添加点击事件
                        radialButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            // 显示半圆形菜单
                            showRadialMenu();

                            return false;
                        });

                        // 将A按钮添加到保存按钮旁边
                        const parent = button.parentNode;
                        if (parent && !parent.querySelector('.radial-save-button')) {
                            parent.appendChild(radialButton);
                        }
                    });
                }
            }
        });

        // 开始观察文档
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 检查脚本初始加载时已存在的按钮
        const existingSaveButtons = document.querySelectorAll('button[aria-label="保存"]:not([data-radial-menu])');
        existingSaveButtons.forEach(button => {
            button.setAttribute('data-radial-menu', 'true');

            // 创建A按钮
            const radialButton = document.createElement('button');
            radialButton.className = 'radial-save-button';
            radialButton.innerHTML = `
                <svg class="radial-save-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#333" stroke-width="2" fill="none"/>
                    <path d="M6 12 L18 12 M12 6 L12 18" stroke="#333" stroke-width="2"/>
                </svg>
                A按钮
            `;

            // 添加点击事件
            radialButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                // 获取按钮位置，从这里向上展开反向半圆菜单
                const rect = radialButton.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const startY = rect.top; // 使用按钮顶部作为菜单底部

                // 显示半圆形菜单
                showRadialMenu(centerX, startY);

                return false;
            });

            // 将A按钮添加到保存按钮旁边
            const parent = button.parentNode;
            if (parent && !parent.querySelector('.radial-save-button')) {
                parent.appendChild(radialButton);
            }
        });
    }

    // 初始化脚本
    function init() {
        console.log('Pinterest反向半圆形保存菜单脚本已初始化');

        // 添加环形保存按钮
        addRadialSaveButton();

        // 添加关闭菜单的键盘快捷键（Escape键）
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuVisible) {
                hideRadialMenu();
            }
        });
    }

    // 页面完全加载后运行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();