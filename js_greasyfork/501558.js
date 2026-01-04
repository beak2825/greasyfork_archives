// ==UserScript==
// @name         巨量百应循环讲解-鼠标模拟
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  通过模拟鼠标点击，实现解放双手，自动循环讲解，本脚本由AI编写
// @author       九思梦
// @match      https://buyin.jinritemai.com/dashboard/live/*
// @match      https://checkcps.com/*
// @match      https://zs.kwaixiaodian.com/page/helper
// @match      https://ark.xiaohongshu.com/live_center_control
// @match      https://channels.weixin.qq.com/platform/live/commodity/*
// @grant        none
// @run-at       document-start
// @license MIT

// @note    2024--7-22/改为'点击循环逻辑为：单击 → 等待7秒 → 单击 → 等待1秒'，
// @note    2024--7-31/增加支持小红书、视频号、快手（其实所有的都能支持，自行修改即可）
// @note    2024--7-23/如果加载不出来界面，多刷新几次，只能缩小窗口，不能关闭窗口，缩小窗口后要重新获取鼠标坐标
// @note    2024--7-22/似乎结束点击按钮没用，要停止点击需要刷新浏览器

// @downloadURL https://update.greasyfork.org/scripts/501558/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%BE%AA%E7%8E%AF%E8%AE%B2%E8%A7%A3-%E9%BC%A0%E6%A0%87%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/501558/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%BE%AA%E7%8E%AF%E8%AE%B2%E8%A7%A3-%E9%BC%A0%E6%A0%87%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mainUIVisible = true; // 用于控制UI界面的显示状态
    let clickIntervalId; // 用于存储点击间隔的定时器ID

    // 创建主UI界面
    let mainUI = document.createElement('div');
    mainUI.id = 'mouse-simulator-ui';
    mainUI.style.cssText = `
        position: fixed;
        top: 100px;
        left: 100px;
        width: 300px;
        height: 240px; /* 根据内容调整高度 */
        padding: 20px;
        background-color: #b0d5df;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        color: white;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        box-sizing: border-box;
        cursor: grab;
        user-select: none;
        overflow: hidden;
        display: ${mainUIVisible ? 'flex' : 'none'};
    `;
    document.body.appendChild(mainUI);

    // 实时鼠标位置显示
    let positionDisplay = document.createElement('div');
    positionDisplay.style.marginTop = '20px';
    positionDisplay.textContent = '当前鼠标位置：X - Y';
    mainUI.appendChild(positionDisplay);

    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        positionDisplay.textContent = `当前鼠标位置：X:${e.clientX}, Y:${e.clientY}`;
    });

    // 自定义模拟鼠标点击位置输入框
    let clickPositionX = createInputField('X');
    let clickPositionY = createInputField('Y');
    let inputsContainer = document.createElement('div');
    inputsContainer.style.display = 'flex';
    inputsContainer.style.justifyContent = 'space-between';
    inputsContainer.style.width = '100%';
    inputsContainer.appendChild(clickPositionX);
    inputsContainer.appendChild(clickPositionY);
    mainUI.appendChild(inputsContainer);

    // 开始和结束点击按钮
    let startButton = createButton('开始点击');
    let stopButton = createButton('结束点击', true);
    let buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.width = '100%';
    buttonsContainer.appendChild(startButton);
    buttonsContainer.appendChild(stopButton);
    mainUI.appendChild(buttonsContainer);

    // 隐藏/显示按钮
let toggleButton = createButton('显示界面');
toggleButton.style.position = 'fixed';
toggleButton.style.top = '50px';
toggleButton.style.right = '10px';
toggleButton.style.zIndex = '10001';
toggleButton.style.width = '120px'; // 设置按钮宽度为120px
toggleButton.style.height = '50px'; // 设置按钮高度为50px
toggleButton.style.fontSize = '16px'; // 根据需要调整字体大小以适应按钮大小
document.body.appendChild(toggleButton);
toggleButton.addEventListener('click', function() {
    mainUIVisible = !mainUIVisible;
    mainUI.style.display = mainUIVisible ? 'flex' : 'none';
    toggleButton.textContent = mainUIVisible ? '隐藏界面' : '显示界面';
});

    // 拖拽功能
    let isDragging = false;
    let dragStartX, dragStartY, uiStartX, uiStartY;

    // 为拖拽添加mousedown事件监听器
    mainUI.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = mainUI.getBoundingClientRect();
        dragStartX = e.clientX - rect.left;
        dragStartY = e.clientY - rect.top;
        uiStartX = window.scrollX + rect.left;
        uiStartY = window.scrollY + rect.top;
    });

    // 为document添加mousemove事件监听器
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let newLeft = e.clientX - dragStartX + window.scrollX;
            let newTop = e.clientY - dragStartY + window.scrollY;

            // 限制窗口在浏览器视窗范围内
            newLeft = Math.max(0, Math.min(window.innerWidth - mainUI.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - mainUI.offsetHeight, newTop));

            mainUI.style.left = `${newLeft}px`;
            mainUI.style.top = `${newTop}px`;
        }
    });

    // 为document添加mouseup事件监听器
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

   // 模拟点击逻辑
    function startClickSequence() {
        const x = clickPositionX.valueAsNumber || 0;
        const y = clickPositionY.valueAsNumber || 0;

        if (x && y) {
            startButton.disabled = true;
            stopButton.disabled = false;

            click(); // 执行第一次点击

            function click() {
                triggerMouseEvent(x, y); // 触发点击事件
                clickIntervalId = setTimeout(function() {
                    triggerMouseEvent(x, y); // 7秒后再次点击
                    setTimeout(function() {
                        triggerMouseEvent(x, y); // 1秒后再次点击
                        click(); // 然后再次循环
                    }, 1000);
                }, 7000);
            }
        } else {
            alert('请填写X和Y坐标！');
        }
    }

    function stopClickSequence() {
        clearTimeout(clickIntervalId); // 清除定时器
        clickIntervalId = null;
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    startButton.addEventListener('click', startClickSequence);
    stopButton.addEventListener('click', stopClickSequence);

    // 触发鼠标点击事件
    function triggerMouseEvent(x, y) {
        let event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        let element = document.elementFromPoint(x, y) || document.body;
        element.dispatchEvent(event);
    }

   // 辅助函数：创建输入框
function createInputField(placeholder) {
    let input = document.createElement('input');
    input.type = 'number';
    input.placeholder = placeholder;
    input.style.cssText = `
        width: calc(50% - 10px);
        padding: 10px;
        margin: 10px;
        font-size: 14px;
        text-align: center;
        background-color: white; /* 设置输入框的背景颜色为白色 */
        color: black; /* 设置输入框内文本的颜色为黑色 */
        border: 1px solid gray; /* 可选：添加边框以增强视觉效果 */
        border-radius: 5px; /* 可选：添加边框圆角 */
    `;
    return input;
}

    // 辅助函数：创建按钮
    function createButton(title, disabled) {
        let button = document.createElement('button');
        button.textContent = title;
        button.style.cssText = `
            width: 45%;
            padding: 10px;
            margin: 2%;
            font-size: 14px;
            background-color: #b2bbbe;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        if (disabled) {
            button.disabled = true;
        }
        return button;
    }

    // 添加描述点击循环逻辑的文字
let loopDescription = document.createElement('div');
loopDescription.style.cssText = `
    margin-top: auto; /* 将文本推至底部 */
    font-size: 14px; /* 文本大小 */
    text-align: center; /* 文本居中对齐 */
    color: black; /* 文本颜色 */
`;
loopDescription.textContent = '点击循环逻辑为：单击 → 等待7秒 → 单击 → 等待1秒';
mainUI.appendChild(loopDescription);

})();