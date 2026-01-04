// ==UserScript==
// @name         自动翻页脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  自动翻页刷帖脚本
// @author       ikunycj
// @match        *://*/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522795/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522795/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.hasRun) {
        return; // 如果脚本已运行过，则直接退出
    }
    window.hasRun = true;


    let time = 0;
    let intervalId = null; // 保存 setInterval 的 ID
    let isRunning = false; // 脚本运行状态
    let isMinimized = false; // 弹窗是否最小化
    let lastPosition = { top: '10px', left: 'auto', right: '10px' }; // 记录弹窗位置

    // 默认设置
    let scrollFrequency = 3000; // 滚动频率（默认 3000ms）
    let scrollLimit = 60; // 滚动次数限制（默认 60 次）

    // 创建控制弹窗
    function createControlDialog() {
        // 检查是否已经存在 dialog，避免重复创建
        let existingDialog = document.getElementById('control-dialog');
        if (existingDialog) {
            existingDialog.remove(); // 清除已有的对话框
        }

        // 创建弹窗
        const dialog = document.createElement('div');
        dialog.style.width = '280px';
        dialog.style.position = 'fixed';
        dialog.style.top = lastPosition.top;
        dialog.style.right = lastPosition.right;
        dialog.style.left = lastPosition.left;
        dialog.style.padding = '20px';
        dialog.style.backgroundColor = '#f4f4f4';
        dialog.style.border = '1px solid #ccc';
        dialog.style.borderRadius = '5px';
        dialog.style.zIndex = '99999';
        dialog.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        dialog.style.cursor = 'move'; // 鼠标拖动手势
        dialog.id = 'control-dialog';

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.marginBottom = '10px';
        titleBar.style.cursor = 'move'; // 鼠标拖动手势

        const title = document.createElement('h3');
        title.innerText = '自动翻页脚本';
        title.style.margin = '0';
        title.style.fontSize = '16px';
        titleBar.appendChild(title);

        // 最小化按钮
        const minimizeButton = document.createElement('button');
        minimizeButton.innerText = '—'; // 最小化符号
        minimizeButton.style.backgroundColor = '#007BFF';
        minimizeButton.style.color = 'white';
        minimizeButton.style.border = 'none';
        minimizeButton.style.borderRadius = '3px';
        minimizeButton.style.padding = '5px 10px';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.onclick = function () {
            toggleMinimize(dialog);
        };
        titleBar.appendChild(minimizeButton);

        dialog.appendChild(titleBar);

        // 创建信息展示区域
        const statusText = document.createElement('p');
        statusText.id = 'script-status';
        statusText.innerText = '当前状态：未运行';
        statusText.style.margin = '10px 0';
        statusText.style.fontSize = '14px';
        dialog.appendChild(statusText);

        // 创建翻滚次数展示区域
        const timeDisplay = document.createElement('p');
        timeDisplay.id = 'scroll-time';
        timeDisplay.innerText = `已翻滚次数：${time}`;
        timeDisplay.style.margin = '10px 0';
        timeDisplay.style.fontSize = '14px';
        dialog.appendChild(timeDisplay);

        // 滚动频率输入框
        const frequencyLabel = document.createElement('label');
        frequencyLabel.innerText = '滚动频率（毫秒）：';
        frequencyLabel.style.display = 'block';
        frequencyLabel.style.margin = '10px 0 5px';
        dialog.appendChild(frequencyLabel);

        const frequencyInput = document.createElement('input');
        frequencyInput.type = 'number';
        frequencyInput.value = scrollFrequency;
        frequencyInput.style.width = '100%';
        frequencyInput.style.padding = '5px';
        frequencyInput.style.marginBottom = '10px';
        frequencyInput.style.boxSizing = 'border-box';
        dialog.appendChild(frequencyInput);

        // 滚动次数限制输入框
        const limitLabel = document.createElement('label');
        limitLabel.innerText = '滚动次数限制：';
        limitLabel.style.display = 'block';
        limitLabel.style.margin = '10px 0 5px';
        dialog.appendChild(limitLabel);

        const limitInput = document.createElement('input');
        limitInput.type = 'number';
        limitInput.value = scrollLimit;
        limitInput.style.width = '100%';
        limitInput.style.padding = '5px';
        limitInput.style.marginBottom = '10px';
        limitInput.style.boxSizing = 'border-box';
        dialog.appendChild(limitInput);

        // 保存设置按钮
        const saveButton = document.createElement('button');
        saveButton.innerText = '保存设置';
        saveButton.style.marginRight = '10px';
        saveButton.style.padding = '5px 10px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.backgroundColor = '#007BFF';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '3px';

        saveButton.onclick = function saveSeeting () {
            saveSettings(frequencyInput,limitInput);
            showToast('设置已保存！');
        };
        dialog.appendChild(saveButton);

        // 创建启动/停止切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.innerText = '启动脚本';
        toggleButton.style.marginRight = '10px';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backgroundColor = '#4CAF50';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';

        toggleButton.onclick = function () {
            if (!isRunning) {
                saveSettings(frequencyInput,limitInput);
                startScrolling();
                isRunning = true;
                updateStatus('运行中'); // 更新状态显示
                showToast('启动成功');
                toggleButton.innerText = '停止脚本'; // 更新按钮文字
                toggleButton.style.backgroundColor = '#f44336'; // 更新按钮颜色
            } else {
                stopScrolling();
                isRunning = false;
                updateStatus('未运行'); // 更新状态显示
                showToast('关闭成功');
                toggleButton.innerText = '启动脚本'; // 更新按钮文字
                toggleButton.style.backgroundColor = '#4CAF50'; // 更新按钮颜色
            }
        };
        dialog.appendChild(toggleButton);

        // 创建重置状态按钮
        const resetButton = document.createElement('button');
        resetButton.innerText = '重置状态';
        resetButton.style.padding = '5px 10px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.backgroundColor = '#FF9800';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '3px';

        resetButton.onclick = function () {
            stopScrolling(); // 停止当前滚动
            time = 0; // 重置时间
            updateScrollTime(time); // 更新显示的滚动次数
            updateStatus('未运行'); // 更新状态显示
            showToast('状态已重置！'); // 弹出提示
            toggleButton.innerText = '启动脚本';
            toggleButton.style.backgroundColor = '#4CAF50'; // 更新按钮颜色
        };

        dialog.appendChild(resetButton);

        // 添加弹窗到页面
        document.body.appendChild(dialog);

        // 启用拖拽功能
        enableDrag(dialog);
    }

    // 保存设置函数
    function saveSettings(frequencyInput, limitInput) {
        scrollFrequency = parseInt(frequencyInput.value) || 3000;
        scrollLimit = parseInt(limitInput.value) || 60;
    }

    function startScrolling() {
        if (intervalId !== null) return; // 如果已经在运行，避免重复启动

        intervalId = setInterval(() => {
            if (time < scrollLimit) {
                time += 1;
                window.scrollBy(0, window.innerHeight); // 滚动一个视口高度
                updateScrollTime(time); // 实时更新翻滚次数
            } else {
                stopScrolling(); // 达到翻滚限制后自动停止
                updateStatus(`已结束，共翻页 ${time} 次`); // 更新状态为已结束

                // 更新按钮状态为 "运行结束"
                const toggleButton = document.querySelector('#control-dialog button:nth-child(9)');
                if (toggleButton) {
                    toggleButton.innerText = '运行结束';
                }
            }
        }, scrollFrequency); // 使用用户设置的滚动频率
    }

    // 停止滚动功能
    function stopScrolling() {
        clearInterval(intervalId); // 清除定时器
        intervalId = null;
        isRunning = false; // 标记状态为未运行
        updateStatus(`已暂停，当前翻页次数：${time}`); // 显示当前暂停状态
    }

    // 更新状态显示
    function updateStatus(status) {
        const statusText = document.getElementById('script-status');
        if (statusText) {
            statusText.innerText = `当前状态：${status}`;
        }
    }

    // 更新翻滚次数显示
    function updateScrollTime(scrollTime) {
        const timeDisplay = document.getElementById('scroll-time');
        if (timeDisplay) {
            timeDisplay.innerText = `已翻滚次数：${scrollTime}`;
        }
    }

    // 显示消息提示
    function showToast(message) {
        const dialog = document.getElementById('control-dialog'); // 获取对话框
        if (!dialog) return;

        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'absolute'; // 相对对话框定位
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)'; // 居中显示
        toast.style.backgroundColor = '#007BFF';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        toast.style.zIndex = '10000';
        toast.style.fontSize = '14px';
        dialog.appendChild(toast); // 将消息提示添加到对话框中

        setTimeout(() => {
            toast.remove();
        }, 1000); // 秒后自动消失
    }

    // 启用弹窗拖拽
    function enableDrag(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
                element.style.right = 'auto'; // 清除自动靠右的样式
                element.style.bottom = 'auto'; // 清除自动靠下的样式
            }
        }

        function onMouseUp() {
            isDragging = false;
            // 更新位置记录
            lastPosition.top = element.style.top;
            lastPosition.left = element.style.left;
            lastPosition.right = element.style.right;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 切换最小化状态
    function toggleMinimize(dialog) {
        if (!isMinimized) {
            // 缩小为小球
            lastPosition = {
                top: dialog.style.top,
                left: dialog.style.left,
                right: dialog.style.right,
            }; // 保存弹窗位置

            dialog.style.width = '50px';
            dialog.style.height = '50px';
            dialog.style.borderRadius = '50%';
            dialog.style.overflow = 'hidden';
            dialog.style.padding = '0';
            dialog.innerHTML = ''; // 清空内容

            // 添加恢复按钮
            const restoreButton = document.createElement('button');
            restoreButton.innerText = '+';
            restoreButton.style.width = '100%';
            restoreButton.style.height = '100%';
            restoreButton.style.border = 'none';
            restoreButton.style.backgroundColor = '#007BFF';
            restoreButton.style.color = 'white';
            restoreButton.style.fontSize = '20px';
            restoreButton.style.cursor = 'pointer';

            restoreButton.onclick = function () {
                toggleMinimize(dialog); // 恢复弹窗
            };

            dialog.appendChild(restoreButton);
            isMinimized = true;
        } else {
            // 恢复弹窗
            dialog.style.width = 'auto';
            dialog.style.height = 'auto';
            dialog.style.borderRadius = '5px';
            dialog.style.padding = '20px';
            dialog.style.top = lastPosition.top;
            dialog.style.left = lastPosition.left;
            dialog.style.right = lastPosition.right;
            dialog.innerHTML = ''; // 清空内容

            createControlDialog(); // 重新加载弹窗内容
            isMinimized = false;
        }
    }

    // 创建控制弹窗
    createControlDialog();
})();
