// ==UserScript==
// @name         RRWeb 测试录制工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  使用rrweb录制网页操作，方便测试同学快速定位问题
// @author       RRWeb Recorder Team
// @match        *://*/*
// @grant        none
// @license MIT
// @require https://cdn.jsdelivr.net/npm/rrweb@1.1.7/dist/rrweb.min.js
// @supportURL   https://github.com/your-username/rrweb-recorder/issues
// @homepageURL  https://github.com/your-username/rrweb-recorder
// @downloadURL https://update.greasyfork.org/scripts/539705/RRWeb%20%E6%B5%8B%E8%AF%95%E5%BD%95%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539705/RRWeb%20%E6%B5%8B%E8%AF%95%E5%BD%95%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 录制相关变量
    let isRecording = false;
    let stopRecording = null;
    let events = [];
    let startTime = null;

    // 创建悬浮按钮
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'rrweb-recorder-btn';
        button.innerHTML = `
            <div class="recorder-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="8"/>
                </svg>
            </div>
            <span class="recorder-text">开始录制</span>
        `;

        // 样式
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 120px;
            height: 50px;
            background: #4CAF50;
            color: white;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            user-select: none;
            gap: 8px;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        // 点击事件
        button.addEventListener('click', toggleRecording);

        document.body.appendChild(button);
        return button;
    }

    // 切换录制状态
    function toggleRecording() {
        if (isRecording) {
            stopRecordingSession();
        } else {
            startRecordingSession();
        }
    }

    // 开始录制
    function startRecordingSession() {
        if (typeof rrweb === 'undefined') {
            showNotification('rrweb库加载失败，请刷新页面重试', 'error');
            return;
        }

        events = [];
        startTime = Date.now();
        isRecording = true;

        try {
            stopRecording = rrweb.record({
                emit(event) {
                    events.push(event);
                },
                checkoutEveryNms: 10 * 1000, // 每10秒创建一个检查点
                maskTextSelector: '[data-sensitive]', // 遮蔽敏感文本
                maskInputOptions: {
                    password: true,
                    email: false,
                    text: false
                }
            });

            updateButtonState();
            showNotification('开始录制...', 'success');
        } catch (error) {
            console.error('录制启动失败:', error);
            showNotification('录制启动失败: ' + error.message, 'error');
            isRecording = false;
        }
    }

    // 停止录制
    function stopRecordingSession() {
        if (stopRecording) {
            stopRecording();
            stopRecording = null;
        }

        isRecording = false;
        updateButtonState();

        if (events.length > 0) {
            showNotification('录制完成，准备下载...', 'success');
            downloadRecording();
        } else {
            showNotification('没有录制到任何事件', 'warning');
        }
    }

    // 更新按钮状态
    function updateButtonState() {
        const button = document.getElementById('rrweb-recorder-btn');
        const icon = button.querySelector('.recorder-icon svg circle');
        const text = button.querySelector('.recorder-text');

        if (isRecording) {
            button.style.background = '#f44336';
            text.textContent = '停止录制';
            icon.style.animation = 'pulse 1.5s infinite';

            // 添加脉冲动画
            if (!document.getElementById('rrweb-pulse-style')) {
                const style = document.createElement('style');
                style.id = 'rrweb-pulse-style';
                style.textContent = `
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            button.style.background = '#4CAF50';
            text.textContent = '开始录制';
            icon.style.animation = 'none';
        }
    }

    // 下载录制文件
    function downloadRecording() {
        const recordingData = {
            events: events,
            startTime: startTime,
            endTime: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(recordingData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        `;

        // 根据类型设置颜色
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }
        }, 3000);
    }

    // 等待页面加载完成后初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 检查rrweb是否加载
        if (typeof rrweb === 'undefined') {
            console.warn('rrweb库未加载，等待加载...');
            setTimeout(init, 1000);
            return;
        }

        createFloatingButton();
        console.log('RRWeb录制工具已加载');
    }

    // 启动初始化
    init();

    // 页面卸载时停止录制
    window.addEventListener('beforeunload', () => {
        if (isRecording) {
            stopRecordingSession();
        }
    });

})();
