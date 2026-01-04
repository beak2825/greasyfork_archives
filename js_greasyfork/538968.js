// ==UserScript==
// @name         视频快捷键控制器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为页面中的视频添加播放快捷键 (加速 Z, 快进 X, 快退 C - 可配置)。支持自定义快捷键和播放速度。
// @author       xxjxt
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538968/%E8%A7%86%E9%A2%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538968/%E8%A7%86%E9%A2%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 全局变量
    let currentVideoElement = null;
    let isShortcutKeyPressed = { accelerate: false };
    let observer = null;
 
    // 快捷键设置
    const defaultSettings = {
        accelerationRate: 3,
        skipTime: 5,
        keys: {
            accelerate: 'z',
            forward: 'x',
            backward: 'c'
        }
    };
 
    // 获取设置
    function getSettings() {
        return {
            accelerationRate: parseFloat(GM_getValue('accelerationRate', defaultSettings.accelerationRate)),
            skipTime: parseFloat(GM_getValue('skipTime', defaultSettings.skipTime)),
            keys: {
                accelerate: GM_getValue('accelerateKey', defaultSettings.keys.accelerate),
                forward: GM_getValue('forwardKey', defaultSettings.keys.forward),
                backward: GM_getValue('backwardKey', defaultSettings.keys.backward)
            }
        };
    }
 
    // 保存设置
    function saveSettings(settings) {
        GM_setValue('accelerationRate', settings.accelerationRate);
        GM_setValue('skipTime', settings.skipTime);
        GM_setValue('accelerateKey', settings.keys.accelerate);
        GM_setValue('forwardKey', settings.keys.forward);
        GM_setValue('backwardKey', settings.keys.backward);
    }
 
    // 查找视频元素
    function findVideoElement() {
        const videos = document.querySelectorAll('video.jw-video, video');
        if (videos.length === 0) return null;
 
        let bestVideo = null;
        let maxSize = 0;
 
        videos.forEach((video) => {
            if (video.offsetParent === null) return;
 
            const rect = video.getBoundingClientRect();
            if (rect.width < 100 || rect.height < 100) return;
 
            if (video.classList.contains('jw-video')) {
                 bestVideo = video;
                 return;
            }
 
            const currentSize = rect.width * rect.height;
            if (currentSize > maxSize) {
                maxSize = currentSize;
                bestVideo = video;
            }
        });
 
        if (!bestVideo && videos.length > 0) {
             for(let video of videos) {
                 if(video.readyState > 0 || video.currentSrc) {
                     bestVideo = video;
                     break;
                 }
             }
             if(!bestVideo) bestVideo = videos[0];
         }
 
        return bestVideo;
    }
 
    // 设置快捷键监听
    function setupShortcuts() {
        if (document.body.dataset.shortcutListenersAttached === 'true') {
            return;
        }
 
        document.addEventListener('keydown', (e) => {
            if (!currentVideoElement || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
 
            const key = e.key.toLowerCase();
            const keys = getSettings().keys;
            let preventDefault = false;
 
            if (key === keys.accelerate) {
                if (!isShortcutKeyPressed.accelerate) {
                    if(currentVideoElement.playbackRate !== getSettings().accelerationRate) {
                       currentVideoElement.playbackRate = getSettings().accelerationRate;
                    }
                    isShortcutKeyPressed.accelerate = true;
                }
                preventDefault = true;
            }
            else if (key === keys.forward) {
                currentVideoElement.currentTime += getSettings().skipTime;
                preventDefault = true;
            }
            else if (key === keys.backward) {
                currentVideoElement.currentTime -= getSettings().skipTime;
                preventDefault = true;
            }
 
            if (preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
 
        document.addEventListener('keyup', (e) => {
            if (!currentVideoElement) return;
 
            const key = e.key.toLowerCase();
            const keys = getSettings().keys;
 
            if (key === keys.accelerate && isShortcutKeyPressed.accelerate) {
                 if (currentVideoElement.playbackRate === getSettings().accelerationRate) {
                    currentVideoElement.playbackRate = 1.0;
                 }
                 isShortcutKeyPressed.accelerate = false;
            }
        });
 
        document.body.dataset.shortcutListenersAttached = 'true';
    }
 
    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand("设置快捷键", () => {
            const settings = getSettings();
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 10px;">
                    <h3 style="margin-top: 0;">视频快捷键设置</h3>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">加速倍率 (默认: 3)</label>
                        <input type="number" id="accelerationRate" value="${settings.accelerationRate}" min="1" max="16" step="0.1" style="width: 100%; padding: 5px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">快进/快退时间 (秒) (默认: 5)</label>
                        <input type="number" id="skipTime" value="${settings.skipTime}" min="1" max="60" step="1" style="width: 100%; padding: 5px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">加速快捷键 (默认: z)</label>
                        <input type="text" id="accelerateKey" value="${settings.keys.accelerate}" maxlength="1" style="width: 100%; padding: 5px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">快进快捷键 (默认: x)</label>
                        <input type="text" id="forwardKey" value="${settings.keys.forward}" maxlength="1" style="width: 100%; padding: 5px;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">快退快捷键 (默认: c)</label>
                        <input type="text" id="backwardKey" value="${settings.keys.backward}" maxlength="1" style="width: 100%; padding: 5px;">
                    </div>
                </div>
            `;
 
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 9999;
                min-width: 300px;
            `;
            dialog.innerHTML = html;
 
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
            `;
 
            const buttons = document.createElement('div');
            buttons.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 15px;
            `;
 
            const saveButton = document.createElement('button');
            saveButton.textContent = '保存';
            saveButton.style.cssText = `
                padding: 8px 16px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
 
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                padding: 8px 16px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
 
            buttons.appendChild(cancelButton);
            buttons.appendChild(saveButton);
            dialog.appendChild(buttons);
 
            document.body.appendChild(overlay);
            document.body.appendChild(dialog);
 
            const closeDialog = () => {
                document.body.removeChild(overlay);
                document.body.removeChild(dialog);
            };
 
            cancelButton.onclick = closeDialog;
            saveButton.onclick = () => {
                const newSettings = {
                    accelerationRate: parseFloat(document.getElementById('accelerationRate').value),
                    skipTime: parseFloat(document.getElementById('skipTime').value),
                    keys: {
                        accelerate: document.getElementById('accelerateKey').value.toLowerCase(),
                        forward: document.getElementById('forwardKey').value.toLowerCase(),
                        backward: document.getElementById('backwardKey').value.toLowerCase()
                    }
                };
 
                // 验证设置
                if (isNaN(newSettings.accelerationRate) || newSettings.accelerationRate < 1 || newSettings.accelerationRate > 16) {
                    alert('加速倍率必须在1-16之间');
                    return;
                }
                if (isNaN(newSettings.skipTime) || newSettings.skipTime < 1 || newSettings.skipTime > 60) {
                    alert('快进/快退时间必须在1-60秒之间');
                    return;
                }
                if (!newSettings.keys.accelerate || !newSettings.keys.forward || !newSettings.keys.backward) {
                    alert('快捷键不能为空');
                    return;
                }
 
                saveSettings(newSettings);
                alert('设置已保存！');
                closeDialog();
            };
 
            // 点击遮罩层关闭
            overlay.onclick = closeDialog;
        });
    }
 
    // 初始化脚本
    function initialize() {
        registerMenuCommands();
 
        const observerCallback = (mutations, obs) => {
            const newlyFoundVideo = findVideoElement();
 
            if (newlyFoundVideo) {
                if (newlyFoundVideo !== currentVideoElement) {
                    currentVideoElement = newlyFoundVideo;
                    setupShortcuts();
                }
            }
            else {
                if (currentVideoElement) {
                    currentVideoElement = null;
                    isShortcutKeyPressed.accelerate = false;
                }
            }
        };
 
        if (observer) {
            return;
        }
        observer = new MutationObserver(observerCallback);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        setTimeout(() => {
            observerCallback(null, observer);
        }, 500);
    }
 
    // 运行初始化
    if (window.requestIdleCallback) {
        window.requestIdleCallback(initialize, { timeout: 2500 });
    } else {
        setTimeout(initialize, 1000);
    }
 
    // 页面卸载清理
    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        currentVideoElement = null;
    });
 
})();