// ==UserScript==
// @name         网页快速打印软件
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  帮助用户实现快速打印，在任意网页上添加一个悬浮且可拖动的打印按钮。功能：自动折叠、菜单控制、位置和状态记忆。优点：易用性强、提高效率、可自定义、跨页面持久化、快速打印。
// @author       wll
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/509470/%E7%BD%91%E9%A1%B5%E5%BF%AB%E9%80%9F%E6%89%93%E5%8D%B0%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/509470/%E7%BD%91%E9%A1%B5%E5%BF%AB%E9%80%9F%E6%89%93%E5%8D%B0%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isButtonVisible = true;
    let isCollapsed = false;
    let draggedFromRight = false;

    // 加载按钮的位置信息
    async function loadButtonPosition() {
        const left = await GM_getValue('printButtonLeft', '0px');
        const top = await GM_getValue('printButtonTop', '50%');
        const right = await GM_getValue('printButtonRight', '');
        isCollapsed = await GM_getValue('printButtonIsCollapsed', false);
        draggedFromRight = await GM_getValue('printButtonDraggedFromRight', false);
        return { left, top, right, isCollapsed, draggedFromRight };
    }

    // 创建按钮
    const button = document.createElement('div');
    button.textContent = '打印';
    button.style.position = 'fixed';
    button.style.transform = 'translateY(-50%)';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    button.style.transition = 'left 0.3s, right 0.3s, width 0.3s, height 0.3s, padding 0.3s';

    // 创建拖动标识
    const dragIndicator = document.createElement('div');
    dragIndicator.style.position = 'absolute';
    dragIndicator.style.top = '0';
    dragIndicator.style.right = '0';
    dragIndicator.style.bottom = '0';
    dragIndicator.style.left = '0';
    dragIndicator.style.border = '2px dashed #fff';
    dragIndicator.style.borderRadius = '5px';
    dragIndicator.style.display = 'none';

    button.appendChild(dragIndicator);
    document.body.appendChild(button);

    loadButtonPosition().then((position) => {
        button.style.top = position.top;
        button.style.left = position.draggedFromRight ? '' : position.left;
        button.style.right = position.draggedFromRight ? '0px' : position.right;

        // 恢复折叠状态
        if (position.isCollapsed) {
            collapseButton();
        }
    });

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;
    let autoCollapseTimeout;

    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
        clearTimeout(autoCollapseTimeout);
        expandButton();
        dragIndicator.style.display = 'block';

        // 防止选中网页其他信息
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // 确保按钮不会超出网页边框
            newX = Math.max(0, Math.min(newX, window.innerWidth - button.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - button.offsetHeight));

            button.style.left = `${newX}px`;
            button.style.right = ''; // 清除右边的属性
            button.style.top = `${newY}px`;

            // 判断是否从右边拖动
            draggedFromRight = newX > (window.innerWidth - button.offsetWidth) / 2;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            saveButtonPosition();
            startAutoCollapseTimer();
            dragIndicator.style.display = 'none';
        }
    });

    // 自动折叠功能
    function startAutoCollapseTimer() {
        clearTimeout(autoCollapseTimeout);
        autoCollapseTimeout = setTimeout(() => {
            collapseButton();
        }, 5000);
    }

    function collapseButton() {
        const rect = button.getBoundingClientRect();
        if (rect.left + rect.width / 2 < window.innerWidth / 2) {
            button.style.left = '0px';
            button.style.right = '';
            button.style.width = '20px';
            button.style.height = '40px';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.borderRadius = '0 20px 20px 0'; // 改为向右的半圆
            button.style.textAlign = 'center';
            button.innerHTML = '&#x25B6;'; // 右箭头
        } else {
            button.style.right = '0px';
            button.style.left = '';
            button.style.width = '20px';
            button.style.height = '40px';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.borderRadius = '20px 0 0 20px'; // 改为向左的半圆
            button.style.textAlign = 'center';
            button.innerHTML = '&#x25C0;'; // 左箭头
        }
        isCollapsed = true;
        saveButtonPosition();
    }

    function expandButton(isFromMouseEnter = false) {
        if (isCollapsed) {
            button.style.width = '';
            button.style.height = '';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.borderRadius = '5px';
            button.textContent = '打印';
            if (isFromMouseEnter) {
                const rect = button.getBoundingClientRect();
                if (rect.left === 0) {
                    button.style.left = '0px';
                    button.style.right = '';
                } else if (rect.right === 0) {
                    button.style.right = '0px';
                    button.style.left = '';
                }
            }
            isCollapsed = false;
        }
    }

    button.addEventListener('mouseenter', () => {
        clearTimeout(autoCollapseTimeout);
        if (isCollapsed) {
            expandButton(true);
        }
    });

    button.addEventListener('mouseleave', () => {
        startAutoCollapseTimer();
    });

    // 打印功能
    button.addEventListener('click', (e) => {
        if (!isDragging) { // 只有在未拖动时才执行打印
            window.print();
        }
    });

    // 保存按钮位置信息
    async function saveButtonPosition() {
        await GM_setValue('printButtonLeft', button.style.left);
        await GM_setValue('printButtonTop', button.style.top);
        await GM_setValue('printButtonRight', button.style.right);
        await GM_setValue('printButtonIsCollapsed', isCollapsed);
        await GM_setValue('printButtonDraggedFromRight', draggedFromRight);
    }

    // 初始化自动折叠计时器
    startAutoCollapseTimer();

    // 注册菜单命令
    GM_registerMenuCommand('显示/隐藏打印按钮', toggleButtonVisibility);

    async function toggleButtonVisibility() {
        isButtonVisible = !isButtonVisible;
        button.style.display = isButtonVisible ? 'block' : 'none';
        if (isButtonVisible) {
            const position = await loadButtonPosition();
            button.style.top = position.top;
            button.style.left = position.draggedFromRight ? '' : position.left;
            button.style.right = position.draggedFromRight ? '0px' : position.right;

            // 恢复折叠状态
            if (position.isCollapsed) {
                collapseButton();
            }
        }
    }
})();
