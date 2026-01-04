// ==UserScript==
// @name         定时点击下载苹果存档
// @namespace    http://tampermonkey.net/
// @version      2025-05-15 update 2
// @description  使用苹果数据隐私创建你的数据备份时，如果你的照片很多，下载的文件就很多，挨个点击会费力。这个脚本就是帮助你自动定时点击。下载单个文件的时长就是需要设置的点击间隔时长。
// @author       You
// @match        https://privacy.apple.com/account
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536175/%E5%AE%9A%E6%97%B6%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E8%8B%B9%E6%9E%9C%E5%AD%98%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/536175/%E5%AE%9A%E6%97%B6%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E8%8B%B9%E6%9E%9C%E5%AD%98%E6%A1%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建控制面板
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #fff;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 9999;
    `;

    // 允许面板宽度可调整
    panel.style.resize = 'horizontal';
    panel.style.overflow = 'auto';
    panel.style.minWidth = '220px';
    panel.style.maxWidth = '600px';

    // 添加输入框用于设置间隔时间
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = '300';
    intervalInput.min = '1';
    intervalInput.style.width = '90px';
    intervalInput.style.marginRight = '10px';

    // 添加输入框用于设置起始位置
    const startPosInput = document.createElement('input');
    startPosInput.type = 'number';
    startPosInput.value = '0';
    startPosInput.min = '0';
    startPosInput.style.width = '90px';
    startPosInput.style.marginRight = '10px';

    // 添加输入框用于设置每批点击数量
    const batchCountInput = document.createElement('input');
    batchCountInput.type = 'number';
    batchCountInput.value = '3';
    batchCountInput.min = '1';
    batchCountInput.style.width = '90px';
    batchCountInput.style.marginRight = '10px';

    // 添加输入框用于设置每次点击间隔
    const clickDelayInput = document.createElement('input');
    clickDelayInput.type = 'number';
    clickDelayInput.value = '15000';
    clickDelayInput.min = '0';
    clickDelayInput.style.width = '90px';
    clickDelayInput.style.marginRight = '10px';

    // 添加当前位置显示
    const currentPosDisplay = document.createElement('div');
    currentPosDisplay.style.marginTop = '5px';
    currentPosDisplay.textContent = '当前位置: 0';

    // 添加开始按钮
    const startButton = document.createElement('button');
    startButton.textContent = '开始';
    startButton.style.marginRight = '10px';

    // 添加停止按钮
    const stopButton = document.createElement('button');
    stopButton.textContent = '停止';
    stopButton.disabled = true;

    // 将元素添加到面板中
    panel.appendChild(document.createTextNode('间隔秒数: '));
    panel.appendChild(intervalInput);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(document.createTextNode('起始位置: '));
    panel.appendChild(startPosInput);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(document.createTextNode('每批点击数量: '));
    panel.appendChild(batchCountInput);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(document.createTextNode('每次点击间隔(ms): '));
    panel.appendChild(clickDelayInput);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(currentPosDisplay);
    panel.appendChild(document.createElement('br'));
    panel.appendChild(startButton);
    panel.appendChild(stopButton);
    document.body.appendChild(panel);

    let intervalId = null;
    let currentPosition = 0;

    // 记录所有 setTimeout 任务ID
    let pendingTimeouts = [];

    // 读取 sessionStorage 配置
    const savedInterval = sessionStorage.getItem('apple_down_interval');
    const savedStartPos = sessionStorage.getItem('apple_down_startPos');
    const savedBatchCount = sessionStorage.getItem('apple_down_batchCount');
    const savedClickDelay = sessionStorage.getItem('apple_down_clickDelay');
    if (savedInterval !== null) intervalInput.value = savedInterval;
    if (savedStartPos !== null) startPosInput.value = savedStartPos;
    if (savedBatchCount !== null) batchCountInput.value = savedBatchCount;
    if (savedClickDelay !== null) clickDelayInput.value = savedClickDelay;

    // 输入框变动时保存配置
    intervalInput.addEventListener('input', () => {
        sessionStorage.setItem('apple_down_interval', intervalInput.value);
    });
    startPosInput.addEventListener('input', () => {
        sessionStorage.setItem('apple_down_startPos', startPosInput.value);
    });
    batchCountInput.addEventListener('input', () => {
        sessionStorage.setItem('apple_down_batchCount', batchCountInput.value);
    });
    clickDelayInput.addEventListener('input', () => {
        sessionStorage.setItem('apple_down_clickDelay', clickDelayInput.value);
    });

    // 点击下载按钮的函数
    function clickDownloadButtons() {
        const buttons = document.querySelectorAll('.archive-download-table button.button-link.download-button-link');
        if (currentPosition >= buttons.length) {
            stopAutoClick(); // 如果已经点完所有按钮，就停止
            return;
        }
        // 每次点击 batchCountInput.value 个按钮
        const batchCount = parseInt(batchCountInput.value, 10) || 1;
        const clickDelay = parseInt(clickDelayInput.value, 10) || 0;
        for (let i = 0; i < batchCount && currentPosition < buttons.length; i++) {
            ((btnIdx, delayIdx) => {
                const timeoutId = setTimeout(() => {
                    buttons[btnIdx].click();
                    // 执行后移除该timeoutId
                    pendingTimeouts = pendingTimeouts.filter(id => id !== timeoutId);
                    showPendingTimeouts(); // 立即刷新显示
                }, clickDelay * delayIdx);
                pendingTimeouts.push(timeoutId);
            })(currentPosition, i);
            currentPosition++;
        }
        currentPosDisplay.textContent = `当前位置: ${currentPosition}`;
        // 显示当前等待的 setTimeout 数量
        showPendingTimeouts();
    }

    // 显示当前等待的 setTimeout 任务ID列表
    function showPendingTimeouts() {
        let info = document.getElementById('pendingTimeoutsInfo');
        if (!info) {
            info = document.createElement('div');
            info.id = 'pendingTimeoutsInfo';
            info.style.fontSize = '12px';
            info.style.color = '#888';
            info.style.marginTop = '2px';
            currentPosDisplay.parentNode.insertBefore(info, currentPosDisplay.nextSibling);
        }
        if (pendingTimeouts.length === 0) {
            info.textContent = '无等待中的点击任务';
        } else {
            info.textContent = `等待中的点击任务ID: [${pendingTimeouts.join(', ')}]`;
        }
    }

    // 开始自动点击
    function startAutoClick() {
        const interval = parseInt(intervalInput.value, 10) * 1000; // 转换为毫秒
        if (interval < 1000) {
            alert('间隔时间不能小于1秒！');
            return;
        }

        currentPosition = parseInt(startPosInput.value, 10);
        clickDownloadButtons();

        intervalId = setInterval(clickDownloadButtons, interval);
        startButton.disabled = true;
        stopButton.disabled = false;
        intervalInput.disabled = true;
        startPosInput.disabled = true;
        batchCountInput.disabled = true;
        clickDelayInput.disabled = true;
    }

    // 停止自动点击
    function stopAutoClick() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        // 清理所有未执行的 setTimeout
        pendingTimeouts.forEach(id => clearTimeout(id));
        pendingTimeouts = [];
        showPendingTimeouts();
        startButton.disabled = false;
        stopButton.disabled = true;
        intervalInput.disabled = false;
        startPosInput.disabled = false;
        batchCountInput.disabled = false;
        clickDelayInput.disabled = false;
    }

    // 美化输入框和按钮样式
    const inputStyle = `
        padding: 4px 8px;
        border: 1px solid #bbb;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        margin-bottom: 4px;
        transition: border-color 0.2s;
    `;
    [intervalInput, startPosInput, batchCountInput, clickDelayInput].forEach(input => {
        input.style.cssText += inputStyle;
        input.addEventListener('focus', () => input.style.borderColor = '#007aff');
        input.addEventListener('blur', () => input.style.borderColor = '#bbb');
    });
    const buttonStyle = `
        padding: 6px 18px;
        border: none;
        border-radius: 4px;
        background: linear-gradient(90deg, #007aff 60%, #00c6fb 100%);
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        margin-bottom: 4px;
        transition: background 0.2s, opacity 0.2s;
    `;
    [startButton, stopButton].forEach(btn => {
        btn.style.cssText += buttonStyle;
        btn.addEventListener('mouseenter', () => btn.style.opacity = '0.85');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
    });
    stopButton.style.background = 'linear-gradient(90deg, #ff3b30 60%, #ff7e5f 100%)';

    // 添加事件监听器
    startButton.addEventListener('click', startAutoClick);
    stopButton.addEventListener('click', stopAutoClick);

    [startButton, stopButton].forEach(btn => {
        const updateDisabledStyle = () => {
            // 只在禁用时加样式，启用时恢复原始样式
            if (btn.disabled) {
                btn.classList.add('apple-down-disabled-btn');
            } else {
                btn.classList.remove('apple-down-disabled-btn');
            }
        };
        updateDisabledStyle();
        const observer = new MutationObserver(updateDisabledStyle);
        observer.observe(btn, { attributes: true, attributeFilter: ['disabled'] });
    });
    // 用 class 控制禁用样式，避免样式累加导致按钮无法恢复
    const style = document.createElement('style');
    style.textContent = `
        .apple-down-disabled-btn {
            background: #ccc !important;
            color: #fff !important;
            cursor: not-allowed !important;
            opacity: 0.7 !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);
})();