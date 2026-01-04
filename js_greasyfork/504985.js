// ==UserScript==
// @name         Custom Bilibili Auto Follow/Unfollow
// @namespace    https://github.com/Larch4/Custom-Bilibili-Auto-Follow-Unfollow
// @version      5.5
// @description  A script to automatically follow/unfollow on Bilibili with enhanced UI and controls.
// @author       Larch4
// @match        https://space.bilibili.com/*
// @grant        none
// @license      GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/504985/Custom%20Bilibili%20Auto%20FollowUnfollow.user.js
// @updateURL https://update.greasyfork.org/scripts/504985/Custom%20Bilibili%20Auto%20FollowUnfollow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FOLLOW_INTERVAL_DEFAULT = 2000; // 关注时间间隔（默认2秒）
    const UNFOLLOW_INTERVAL_DEFAULT = 2000; // 取消关注时间间隔（默认2秒）

    let timeoutId = null;
    let isRunning = false;
    let useRandomInterval = true; // 是否使用随机间隔
    let followUnfollowTimeout = null; // 关注/取消关注的定时器
    let modalCheckInterval = null; // 弹窗检查的定时器
    let followInterval = FOLLOW_INTERVAL_DEFAULT;
    let unfollowInterval = UNFOLLOW_INTERVAL_DEFAULT;

function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'bilibili-auto-follow-panel';
    panel.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background-color: #fff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        color: #333; padding: 15px; border-radius: 10px; z-index: 10000;
        display: flex; flex-direction: column; align-items: stretch; width: 240px;
        font-family: Arial, sans-serif; transition: max-height 0.3s ease, opacity 0.3s ease; /* 添加过渡效果 */
        overflow: hidden; max-height: 400px; /* 初始的最大高度 */
        opacity: 1; /* 初始不透明 */
    `;

    panel.innerHTML = `
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; text-align: center; color: #00a1d6;">
            Bilibili 自动关注脚本
            <button id="foldButton" style="
                background-color: #00a1d6; color: #fff; border: none; padding: 6px 10px;
                border-radius: 6px; cursor: pointer; font-size: 14px; transition: background-color 0.3s; align-self: center; margin-bottom: 0px; margin-left: 20px;">展开</button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <button id="toggleButton" style="
                flex: 1; background-color: #00a1d6; color: #fff; border: none; padding: 8px 12px;
                border-radius: 6px; cursor: pointer; font-size: 14px; transition: background-color 0.3s;
            ">开始</button>
            <span id="statusText" style="flex: 1; margin-left: 105px; font-size: 14px; color: #666;">未运行</span>
        </div>

        <div id="additionalContent" style="max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.5s ease, opacity 0.5s ease;">
            <div style="margin-bottom: 10px; display: flex; flex-direction: column;">
                <label>关注间隔（秒）：</label>
                <input id="followIntervalInput" type="number" min="1" value="${FOLLOW_INTERVAL_DEFAULT / 1000}" style="
                    width: 95%; padding: 5px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;
                ">
            </div>
            <div style="margin-bottom: 10px; display: flex; flex-direction: column;">
                <label>取消关注间隔（秒）：</label>
                <input id="unfollowIntervalInput" type="number" min="1" value="${UNFOLLOW_INTERVAL_DEFAULT / 1000}" style="
                    width: 95%; padding: 5px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;
                ">
            </div>

        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <input id="useRandomInterval" type="checkbox" checked style="margin-right: 9px;">
                <label for="useRandomInterval" style="font-size: 14px; color: #333; cursor: pointer;">
                    使用随机时间间隔
                </label>
        </div>


            <div id="logContainer" style="
                max-height: 120px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; margin-top: 10px; border-radius: 4px;
                font-size: 12px; color: #333; background-color: #f9f9f9;
            "></div>
        </div>

        <div id="errorMessage" style="color: red; font-size: 12px; margin-top: 10px;"></div>
    `;

    document.body.appendChild(panel);
    makePanelDraggable(panel);

    const toggleButton = panel.querySelector('#toggleButton');
    toggleButton.addEventListener('click', toggleScript);

    const foldButton = panel.querySelector('#foldButton');
    const additionalContent = panel.querySelector('#additionalContent');
    let isFolded = true;  // 初始状态为折叠

    foldButton.addEventListener('click', () => {
        if (isFolded) {
            additionalContent.style.maxHeight = '400px'; // 设置合适的高度以显示完整内容
            additionalContent.style.opacity = '1'; // 设为完全不透明
            foldButton.textContent = '收缩';
        } else {
            additionalContent.style.maxHeight = '0';
            additionalContent.style.opacity = '0';
            foldButton.textContent = '展开';
        }
        isFolded = !isFolded;
    });

    // 绑定按钮和复选框事件
    document.getElementById('toggleButton').addEventListener('click', toggleScript);
    document.getElementById('useRandomInterval').addEventListener('change', toggleRandomInterval);

    panel.querySelector('#followIntervalInput').addEventListener('input', (e) => {
        followInterval = parseInt(e.target.value, 10) * 1000;
    });
    panel.querySelector('#unfollowIntervalInput').addEventListener('input', (e) => {
        unfollowInterval = parseInt(e.target.value, 10) * 1000;
    });

    return {
        toggleButton,
        statusText: panel.querySelector('#statusText'),
        errorMessage: panel.querySelector('#errorMessage'),
        logContainer: panel.querySelector('#logContainer')
    };
}

function makePanelDraggable(panel) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    panel.addEventListener('mousedown', (e) => {
        // 检查点击的元素，如果是按钮、文本或输入框，则不启动拖动
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SPAN' || e.target.tagName === 'INPUT') return;

        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left; // 使用 getBoundingClientRect() 获取准确的左偏移量
        offsetY = e.clientY - panel.getBoundingClientRect().top;  // 使用 getBoundingClientRect() 获取准确的顶部偏移量
        e.preventDefault();

        // 添加事件监听器
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            // 只有在拖动过程中才修改面板的位置
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false;
            // 移除事件监听器
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }
}

    function toggleScript() {
        if (isRunning) {
            stopAutoFollowUnfollow();
        } else {
            startAutoFollowUnfollow();
        }
        isRunning = !isRunning;
    }

    function startAutoFollowUnfollow() {
        toggleFollowState(1); // 开始时默认进入关注状态
        modalCheckInterval = setInterval(removeModal, 1000); // 启动弹窗检查定时器
        updateUI('暂停', '#f25d8e', '运行中');
    }
    
    function stopAutoFollowUnfollow() {
        clearTimeout(followUnfollowTimeout);
        clearInterval(modalCheckInterval); // 清除弹窗检查定时器
        updateUI('开始', '#00a1d6', '未运行');
    }    

    function removeModal() {
        const modal = document.querySelector('.modal-container');
        if (modal) {
            modal.remove();
        }
    }

    // 切换随机间隔选项
    function toggleRandomInterval() {
        useRandomInterval = document.getElementById('useRandomInterval').checked;
    }

    function updateUI(buttonText, buttonColor, statusTextValue) {
        const toggleButton = document.getElementById('toggleButton');
        const statusText = document.getElementById('statusText');
        toggleButton.textContent = buttonText;
        toggleButton.style.backgroundColor = buttonColor;
        statusText.textContent = statusTextValue;
    }

    function toggleFollowState(action) {
        followOrUnfollow(action);
        const nextAction = action === 0 ? 1 : 0;
        const delay = getInterval(action === 0 ? unfollowInterval : followInterval); // 使用随机间隔
    
        followUnfollowTimeout = setTimeout(() => toggleFollowState(nextAction), delay);
    }    

    function followOrUnfollow(action) {
        try {
            let button;
            if (action === 0) {  // 取消关注
                const dropdown = document.querySelector('.be-dropdown.h-f-btn.h-unfollow');
                if (dropdown) {
                    const dropdownMenu = dropdown.querySelector('.be-dropdown-menu');
                    if (dropdownMenu && dropdownMenu.style.display === 'none') {
                        dropdownMenu.style.display = 'block';  // 显示菜单
                    }

                    button = dropdownMenu ? Array.from(dropdownMenu.querySelectorAll('.be-dropdown-item'))
                        .find(item => item.textContent.trim() === '取消关注') : null;
                }
            } else {  // 关注
                button = document.querySelector(".h-f-btn.h-follow");
            }

            if (button && button.offsetParent !== null) {
                button.click();
                logMessage(`已${action === 0 ? '取消关注' : '关注'}一个UP主`);
            } else {
                showErrorMessage(`未找到${action === 1 ? '' : '取消'}关注按钮`);
            }
        } catch (error) {
            showErrorMessage("执行关注/取消关注时出错: " + error.message);
        }
    }

    function getInterval(baseInterval) {
        let interval = useRandomInterval ? baseInterval + Math.random() * 1000 : baseInterval;
        console.log(`当前间隔时间: ${interval} 毫秒`); // 输出当前间隔时间
        return interval;
    }

    function logMessage(message) {
        const logContainer = document.getElementById('logContainer');
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function showErrorMessage(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            setTimeout(() => {
                errorMessage.textContent = '';
            }, 3000);
        }
    }   

    const { toggleButton, statusText, errorMessage, logContainer } = createPanel();
})();
