// ==UserScript==
// @license      MIT
// @name         Bilibili 学习定时暂停脚本
// @namespace    https://example.com
// @version      1.1
// @description  每隔一段时间自动暂停 Bilibili 视频，让用户思考/休息，然后继续播放。支持用户自定义设置。
// @match        https://www.bilibili.com/video/*
// @match        https://libe.bilibili.com/*
// @match        https://www.bilibili.com/list/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/522562/Bilibili%20%E5%AD%A6%E4%B9%A0%E5%AE%9A%E6%97%B6%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522562/Bilibili%20%E5%AD%A6%E4%B9%A0%E5%AE%9A%E6%97%B6%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const defaultSettings = {
        enabled: true,         // 脚本是否启用
        period: 300,           // 每隔多少秒暂停一次（默认300秒）
        pauseTime: 60          // 暂停多长时间后恢复播放（默认60秒）
    };

    // 获取用户设置或使用默认设置
    let settings = {
        enabled: GM_getValue('enabled', defaultSettings.enabled),
        period: GM_getValue('period', defaultSettings.period),
        pauseTime: GM_getValue('pauseTime', defaultSettings.pauseTime)
    };

    // 保存设置
    function saveSettings() {
        GM_setValue('enabled', settings.enabled);
        GM_setValue('period', settings.period);
        GM_setValue('pauseTime', settings.pauseTime);
    }

    // 注册设置菜单
    GM_registerMenuCommand('Bilibili 自动暂停设置', () => {
        // 创建设置界面
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.padding = '20px';
        container.style.zIndex = '10000';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        container.style.borderRadius = '8px';

        // 创建表单内容
        container.innerHTML = `
            <h2>Bilibili 自动暂停设置</h2>
            <label>
                <input type="checkbox" id="enabled" ${settings.enabled ? 'checked' : ''}>
                启用脚本
            </label>
            <br><br>
            <label>
                暂停周期 (秒):
                <input type="number" id="period" value="${settings.period}" min="10" style="width: 80px;">
            </label>
            <br><br>
            <label>
                暂停时长 (秒):
                <input type="number" id="pauseTime" value="${settings.pauseTime}" min="5" style="width: 80px;">
            </label>
            <br><br>
            <button id="saveSettings">保存</button>
            <button id="closeSettings">取消</button>
        `;

        document.body.appendChild(container);

        // 处理保存按钮
        container.querySelector('#saveSettings').addEventListener('click', () => {
            settings.enabled = container.querySelector('#enabled').checked;
            settings.period = parseInt(container.querySelector('#period').value, 10);
            settings.pauseTime = parseInt(container.querySelector('#pauseTime').value, 10);

            // 验证输入
            if (isNaN(settings.period) || settings.period < 10) {
                alert('暂停周期必须是一个大于等于10的数字。');
                return;
            }
            if (isNaN(settings.pauseTime) || settings.pauseTime < 5) {
                alert('暂停时长必须是一个大于等于5的数字。');
                return;
            }

            saveSettings();
            alert('设置已保存！');
            document.body.removeChild(container);
            location.reload(); // 自动刷新页面以应用新设置
        });

        // 处理取消按钮
        container.querySelector('#closeSettings').addEventListener('click', () => {
            document.body.removeChild(container);
        });
    });

    // 如果脚本被禁用，则不执行
    if (!settings.enabled) {
        console.log("Bilibili 自动暂停脚本已禁用。");
        return;
    }

    // 将秒转换为毫秒
    const periodMs = settings.period * 1000;
    const pauseTimeMs = settings.pauseTime * 1000;

    // 定时器变量
    let intervalId = null;
    let timeoutId = null;

    // 检查视频元素并设置定时暂停
    function setupAutoPause() {
        let video = document.querySelector('video');

        if (video) {
            if (!intervalId) {
                intervalId = setInterval(() => {
                    if (!video.paused) {
                        console.log("执行自动暂停...");
                        video.pause();

                        // 暂停 pauseTime 毫秒后恢复播放
                        timeoutId = setTimeout(() => {
                            console.log("结束暂停，恢复播放...");
                            video.play();
                        }, pauseTimeMs);
                    }
                }, periodMs);
                console.log("自动暂停定时器已启动。");
            }
        } else {
            // 如果找不到视频元素，清除定时器
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                console.log("视频元素不存在，已清除自动暂停定时器。");
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        }
    }

    // 监听页面变化，确保视频元素加载完成后设置定时器
    const observer = new MutationObserver(setupAutoPause);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始调用
    setupAutoPause();

})();
