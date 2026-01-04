// ==UserScript==
// @name         gig广投文档和视频加速及后台播放自动确认弹框
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  文档20倍加速、视频加速，后台多开播放,20分钟自动点击弹出确认框
// @author       風逸飛
// @match        http*://www.giged.cn/*
// @match        http*://gt-h5.giged.cn:9003/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516064/gig%E5%B9%BF%E6%8A%95%E6%96%87%E6%A1%A3%E5%92%8C%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%8F%8A%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/516064/gig%E5%B9%BF%E6%8A%95%E6%96%87%E6%A1%A3%E5%92%8C%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%8F%8A%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 计时器管理器
    const timers = {
        timeouts: [],
        intervals: []
    };

    const minInterval = 100;
    let timerSpeed = 1;

    // 保存原始的 setTimeout 和 setInterval 函数
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalClearTimeout = window.clearTimeout;
    const originalClearInterval = window.clearInterval;

    // 创建控制面板
    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '10px';
        controlPanel.style.right = '10px';
        controlPanel.style.backgroundColor = '#fff';
        controlPanel.style.border = '1px solid #000';
        controlPanel.style.padding = '10px';
        controlPanel.style.zIndex = 9999;
        controlPanel.style.maxHeight = '200px'; // 设置最大高度
        controlPanel.style.overflow = 'auto'; // 允许滚动
        controlPanel.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.5)"; // 添加阴影以提升可见性
        controlPanel.style.fontSize = '12px';

        // 文档加速部分
        const docSpeedRow = document.createElement('div');
        const speedLabel = document.createElement('label');
        speedLabel.textContent = '文档加速: ';
        docSpeedRow.appendChild(speedLabel);

        const speedCheckbox = document.createElement('input');
        speedCheckbox.type = 'checkbox';
        speedCheckbox.id = 'speedCheckbox';
        speedCheckbox.onclick = function() {
            timerSpeed = this.checked ? 20 : 1;
            updateTimers();
        };
        docSpeedRow.appendChild(speedCheckbox);

        const speedCheckboxLabel = document.createElement('label');
        speedCheckboxLabel.htmlFor = 'speedCheckbox';
        speedCheckboxLabel.textContent = '20';
        docSpeedRow.appendChild(speedCheckboxLabel);

        // 将文档加速部分添加到控制面板
        controlPanel.appendChild(docSpeedRow);

        // 视频速度控制部分
        const videoSpeedRow = document.createElement('div');
        const videoSpeedLabel = document.createElement('label');
        videoSpeedLabel.textContent = '视频速度: ';
        videoSpeedRow.appendChild(videoSpeedLabel);

        const videoSpeedInput = document.createElement('input');
        videoSpeedInput.id = 'video-speed';
        videoSpeedInput.type = 'number';
        videoSpeedInput.min = '1';
        videoSpeedInput.max = '16';
        videoSpeedInput.step = '1';
        videoSpeedInput.value = '5'; // 默认值为5倍速
        videoSpeedInput.addEventListener('input', function() {
            const speed = parseFloat(this.value);
            const video = document.querySelector('video');
            if (video) {
                video.playbackRate = speed > 0 ? speed : 1; // 确保速度为正数
            }
        });

        videoSpeedRow.appendChild(videoSpeedInput);

        // 将视频速度控制部分添加到控制面板
        controlPanel.appendChild(videoSpeedRow);

        document.body.appendChild(controlPanel);
    }

    // 更新所有计时器
    function updateTimers() {
        timers.timeouts.forEach(timer => {
            originalClearTimeout(timer.id);
            const newTimeout = Math.max(timer.originalTimeout / timerSpeed, minInterval);
            timer.id = originalSetTimeout(timer.callback, newTimeout);
        });
        timers.intervals.forEach(timer => {
            originalClearInterval(timer.id);
            const newInterval = Math.max(timer.originalTimeout / timerSpeed, minInterval);
            timer.id = originalSetInterval(timer.callback, newInterval);
        });
    }

    // 劫持 setTimeout 和 setInterval
    window.setTimeout = function(callback, timeout) {
        const id = originalSetTimeout(callback, Math.max(timeout / timerSpeed, minInterval));
        timers.timeouts.push({ id, callback, originalTimeout: timeout });
        return id;
    };
    window.setInterval = function(callback, timeout) {
        const id = originalSetInterval(callback, Math.max(timeout / timerSpeed, minInterval));
        timers.intervals.push({ id, callback, originalTimeout: timeout });
        return id;
    };

    // 劫持 clearTimeout 和 clearInterval
    window.clearTimeout = function(id) {
        originalClearTimeout(id);
        timers.timeouts = timers.timeouts.filter(timer => timer.id !== id);
    };
    window.clearInterval = function(id) {
        originalClearInterval(id);
        timers.intervals = timers.intervals.filter(timer => timer.id !== id);
    };

    // 屏蔽 visibilitychange 和 storage 事件
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' || type === 'storage') {
            console.log('Blocked ' + type + ' event listener');
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 等待视频元素并设置默认播放速度
    function waitForVideo() {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = 5; // 默认播放速度为5倍速
        } else {
            setTimeout(waitForVideo, 100); // 每100毫秒检查一次视频元素
        }
    }

    // 检查并自动点击“确定”按钮
    function checkAndClickButton() {
        setTimeout(() => {
            // 使用更具体的选择器查找按钮
            var button = document.querySelector('button.el-button.el-button--default.el-button--small.el-button--primary span');
            if (button && button.textContent.trim() === '确定') {
                console.log("找到“确定”按钮，正在点击..."); // 调试信息
                button.closest('button').click(); // 点击父按钮元素
                return true;
            }
            console.log("没有找到“确定”按钮。");
            return false;
        }, 100); // 延迟执行
    }

    // 使用 MutationObserver 监控 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 当有子节点变化时检查并点击按钮
            if (mutation.type === 'childList') {
                checkAndClickButton();
            }
        });
    });

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查
    setInterval(checkAndClickButton, 1000); // 每秒检查一次


    // 创建控制面板和启动视频检查
    createControlPanel();
    waitForVideo();
})();
