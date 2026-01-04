// ==UserScript==
// @name         独播库专用视频快捷键倍速控制器
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  独播库专用视频快捷键倍速播放器快进、快退、音量调节、倍速播放、暂停控制添加自定义网址等功能。可以自定义设置控制按键，快进快退秒数，倍速播放倍速等。并显示通知
// @author       NB888
// @match        https://www.duboku.tv/*
// @match        https://w.duboku.io/*
// @match        https://v.duboku.io/*
// @match        https://tv.gboku.com/*
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      Proprietary - Only for personal use, no modifications or redistributions allowed. 
//               The code may not be modified, copied, distributed, or used for derivative works without explicit permission.
// @downloadURL https://update.greasyfork.org/scripts/528653/%E7%8B%AC%E6%92%AD%E5%BA%93%E4%B8%93%E7%94%A8%E8%A7%86%E9%A2%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528653/%E7%8B%AC%E6%92%AD%E5%BA%93%E4%B8%93%E7%94%A8%E8%A7%86%E9%A2%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取并设置默认值
    const defaults = {
        fastForwardSeconds: 10, // 快进秒数
        fastRewindSeconds: 10, // 快退秒数
        volumeChange: 5, // 音量增量
        pauseKey: "Space", // 暂停和恢复的键
        forwardKey: "ArrowRight", // 快进的键
        rewindKey: "ArrowLeft", // 快退的键
        volumeUpKey: "ArrowUp", // 音量增加的键
        volumeDownKey: "ArrowDown", // 音量减少的键
        playbackRate: 2.0, // 倍速播放默认值
        enabledSites: "u.duboku.io", // 默认生效的网站
    };

    // 从存储中读取自定义设置
    const getSettings = () => {
        return {
            fastForwardSeconds: GM_getValue('fastForwardSeconds', defaults.fastForwardSeconds),
            fastRewindSeconds: GM_getValue('fastRewindSeconds', defaults.fastRewindSeconds),
            volumeChange: GM_getValue('volumeChange', defaults.volumeChange),
            pauseKey: GM_getValue('pauseKey', defaults.pauseKey),
            forwardKey: GM_getValue('forwardKey', defaults.forwardKey),
            rewindKey: GM_getValue('rewindKey', defaults.rewindKey),
            volumeUpKey: GM_getValue('volumeUpKey', defaults.volumeUpKey),
            volumeDownKey: GM_getValue('volumeDownKey', defaults.volumeDownKey),
            playbackRate: GM_getValue('playbackRate', defaults.playbackRate),
            enabledSites: GM_getValue('enabledSites', defaults.enabledSites),
        };
    };

    // 保存设置到存储
    const saveSettings = (key, value) => {
        GM_setValue(key, value);
    };

    // 显示快进/快退/倍速播放提示
    const showPlaybackHint = (message, direction = 'forward') => {
        const video = document.querySelector('video');
        if (!video) return;

        const hint = document.createElement('div');
        hint.style.position = 'absolute';
        hint.style.top = '50%';
        hint.style.left = '50%';
        hint.style.transform = 'translate(-50%, -50%)';
        hint.style.width = direction === 'playbackRate' || direction === 'playbackRateRewind' ? '72px' : '88px'; // 快进快退提示增大 10%
        hint.style.height = direction === 'playbackRate' || direction === 'playbackRateRewind' ? '72px' : '88px'; // 快进快退提示增大 10%
        hint.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
        hint.style.borderRadius = '50%';
        hint.style.display = 'flex';
        hint.style.flexDirection = 'column';
        hint.style.alignItems = 'center';
        hint.style.justifyContent = 'center';
        hint.style.zIndex = '10000';

        // 添加 3 个三角形
        const triangles = document.createElement('div');
        triangles.style.display = 'flex';
        triangles.style.gap = '5px';
        for (let i = 0; i < 3; i++) {
            const triangle = document.createElement('div');
            triangle.style.width = '0';
            triangle.style.height = '0';
            triangle.style.borderTop = '8px solid transparent';
            triangle.style.borderBottom = '8px solid transparent';
            if (direction === 'rewind' || direction === 'playbackRateRewind') {
                triangle.style.borderRight = '12px solid white'; // 向左倒的三角形
            } else {
                triangle.style.borderLeft = '12px solid white'; // 向右倒的三角形
            }
            triangles.appendChild(triangle);
        }
        hint.appendChild(triangles);

        // 添加秒数提示
        const text = document.createElement('div');
        text.style.color = 'white';
        text.style.fontSize = '14px';
        text.style.marginTop = '5px';
        text.innerText = message;
        hint.appendChild(text);

        video.parentElement.appendChild(hint);

        // 如果是倍速播放提示，设置闪烁效果
        if (direction === 'playbackRate' || direction === 'playbackRateRewind') {
            let isVisible = true;
            const blinkInterval = setInterval(() => {
                hint.style.opacity = isVisible ? '0' : '1';
                isVisible = !isVisible;
            }, 200); // 0.2秒闪烁一次

            // 返回提示元素和闪烁间隔，以便在按键松开时清除
            return { hint, blinkInterval };
        } else {
            // 0.5秒后消失
            setTimeout(() => {
                hint.remove();
            }, 500);
            return null;
        }
    };

    // 显示保存成功提示
    const showSaveSuccessHint = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const hint = document.createElement('div');
        hint.style.position = 'absolute';
        hint.style.top = '50%';
        hint.style.left = '50%';
        hint.style.transform = 'translate(-50%, -50%)';
        hint.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
        hint.style.color = 'white';
        hint.style.padding = '10px';
        hint.style.borderRadius = '5px';
        hint.style.fontSize = '16px';
        hint.style.zIndex = '10000';
        hint.innerText = '保存成功';

        video.parentElement.appendChild(hint);

        // 0.5秒后消失
        setTimeout(() => {
            hint.remove();
        }, 500);
    };

    // 显示音量提示
    const showVolumeHint = (volume) => {
        const video = document.querySelector('video');
        if (!video) return;

        const hint = document.createElement('div');
        hint.style.position = 'absolute';
        hint.style.top = '50%';
        hint.style.left = '50%';
        hint.style.transform = 'translate(-50%, -50%)';
        hint.style.width = '60px';
        hint.style.height = '40px';
        hint.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
        hint.style.borderRadius = '5px';
        hint.style.display = 'flex';
        hint.style.alignItems = 'center';
        hint.style.justifyContent = 'center';
        hint.style.zIndex = '10000';

        const text = document.createElement('div');
        text.style.color = 'white';
        text.style.fontSize = '16px';
        text.innerText = `${Math.round(volume * 100)}%`;
        hint.appendChild(text);

        video.parentElement.appendChild(hint);

        // 0.5秒后消失
        setTimeout(() => {
            hint.remove();
        }, 500);
    };

    // 显示暂停图标
    const showPauseIcon = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const pauseIcon = document.createElement('div');
        pauseIcon.style.position = 'absolute';
        pauseIcon.style.top = '50%';
        pauseIcon.style.left = '50%';
        pauseIcon.style.transform = 'translate(-50%, -50%)';
        pauseIcon.style.width = '60px';
        pauseIcon.style.height = '60px';
        pauseIcon.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
        pauseIcon.style.borderRadius = '50%';
        pauseIcon.style.display = 'flex';
        pauseIcon.style.alignItems = 'center';
        pauseIcon.style.justifyContent = 'center';
        pauseIcon.style.zIndex = '10000';

        const triangle = document.createElement('div');
        triangle.style.width = '0';
        triangle.style.height = '0';
        triangle.style.borderTop = '15px solid transparent';
        triangle.style.borderBottom = '15px solid transparent';
        triangle.style.borderLeft = '25px solid white';
        triangle.style.transform = 'translateX(3px)'; // 向右偏移

        pauseIcon.appendChild(triangle);
        video.parentElement.appendChild(pauseIcon);

        // 监听播放事件，移除图标
        const onPlay = () => {
            pauseIcon.remove();
            video.removeEventListener('play', onPlay);
        };
        video.addEventListener('play', onPlay);
    };

    // 长按快进/快退倍速播放
    let isKeyHeld = false;
    let playbackHint = null; // 存储倍速播放提示

    const startKeyHold = (video, direction, settings) => {
        if (isKeyHeld) return;
        isKeyHeld = true;

        // 设置播放速度
        video.playbackRate = settings.playbackRate;
        playbackHint = showPlaybackHint(`${settings.playbackRate}倍速`, direction === 'rewind' ? 'playbackRateRewind' : 'playbackRate');
    };

    const stopKeyHold = (video) => {
        if (!isKeyHeld) return;
        isKeyHeld = false;
        video.playbackRate = 1.0; // 恢复默认播放速度

        // 清除倍速播放提示
        if (playbackHint) {
            clearInterval(playbackHint.blinkInterval);
            playbackHint.hint.remove();
            playbackHint = null;
        }
    };

    // 事件监听器：绑定快捷键事件
    let currentKeyListener = null; // 用于存储当前的事件监听器
    const bindKeys = (settings) => {
        // 移除旧的事件监听器
        if (currentKeyListener) {
            document.removeEventListener('keydown', currentKeyListener);
            document.removeEventListener('keyup', currentKeyListener);
        }

        // 创建新的事件监听器
        currentKeyListener = (event) => {
            const video = document.querySelector('video');
            if (!video) return;

            // 阻止页面滚动行为
            if (event.key === settings.volumeUpKey || event.key === settings.volumeDownKey) {
                event.preventDefault();
            }

            switch (event.key) {
                case settings.pauseKey: // 空格键暂停/恢复
                    if (event.type === 'keydown') {
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                            showPauseIcon(); // 显示暂停图标
                        }
                    }
                    break;
                case settings.forwardKey: // 快进
                    if (event.type === 'keydown') {
                        if (event.repeat) {
                            startKeyHold(video, 'forward', settings);
                        } else {
                            video.currentTime += settings.fastForwardSeconds;
                            showPlaybackHint(`快进 ${settings.fastForwardSeconds} 秒`, 'forward');
                        }
                    } else if (event.type === 'keyup') {
                        stopKeyHold(video);
                    }
                    break;
                case settings.rewindKey: // 快退
                    if (event.type === 'keydown') {
                        if (event.repeat) {
                            startKeyHold(video, 'rewind', settings);
                        } else {
                            video.currentTime -= settings.fastRewindSeconds;
                            showPlaybackHint(`快退 ${settings.fastRewindSeconds} 秒`, 'rewind');
                        }
                    } else if (event.type === 'keyup') {
                        stopKeyHold(video);
                    }
                    break;
                case settings.volumeUpKey: // 音量增加
                    if (event.type === 'keydown') {
                        video.volume = Math.min(1, video.volume + settings.volumeChange / 100);
                        showVolumeHint(video.volume);
                    }
                    break;
                case settings.volumeDownKey: // 音量减少
                    if (event.type === 'keydown') {
                        video.volume = Math.max(0, video.volume - settings.volumeChange / 100);
                        showVolumeHint(video.volume);
                    }
                    break;
            }
        };

        // 绑定新的事件监听器
        document.addEventListener('keydown', currentKeyListener);
        document.addEventListener('keyup', currentKeyListener);
    };

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
        if (isFullscreen) {
            console.log('进入全屏模式');
        } else {
            console.log('退出全屏模式');
        }
    });

    // 创建设置面板
    const createSettingsPanel = () => {
        const settings = getSettings();
        const panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.background = 'rgba(0, 0, 0, 0.7)';
        panel.style.color = '#fff';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '10000';
        panel.innerHTML = `
            <h3>自定义视频控制</h3>
            <label>快进秒数: <input type="number" id="fastForwardSeconds" value="${settings.fastForwardSeconds}" /></label><br>
            <label>快退秒数: <input type="number" id="fastRewindSeconds" value="${settings.fastRewindSeconds}" /></label><br>
            <label>音量增量: <input type="number" id="volumeChange" value="${settings.volumeChange}" /></label><br>
            <label>倍速播放: <input type="number" id="playbackRate" value="${settings.playbackRate}" step="0.1" /></label><br>
            <label>暂停/恢复键: <input type="text" id="pauseKey" value="${settings.pauseKey}" readonly /></label><br>
            <label>快进键: <input type="text" id="forwardKey" value="${settings.forwardKey}" readonly /></label><br>
            <label>快退键: <input type="text" id="rewindKey" value="${settings.rewindKey}" readonly /></label><br>
            <label>音量加键: <input type="text" id="volumeUpKey" value="${settings.volumeUpKey}" readonly /></label><br>
            <label>音量减键: <input type="text" id="volumeDownKey" value="${settings.volumeDownKey}" readonly /></label><br>
            <label>生效网站: <textarea id="enabledSites" rows="3">${settings.enabledSites}</textarea></label><br>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="saveSettings" style="background-color: green; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">保存设置</button>
                <button id="exitSettings" style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">退出设置</button>
            </div>
        `;

        // 只在视频区域显示面板
        const videoArea = document.querySelector('video');
        if (videoArea) {
            videoArea.parentElement.appendChild(panel);
        }

        // 为输入框绑定按键监听
        const keyInputs = panel.querySelectorAll('input[type="text"]');
        keyInputs.forEach(input => {
            input.addEventListener('click', () => {
                input.value = '按下按键...';
                const keyListener = (event) => {
                    event.preventDefault();
                    input.value = event.key;
                    document.removeEventListener('keydown', keyListener);
                };
                document.addEventListener('keydown', keyListener);
            });
        });

        // 保存设置
        document.getElementById('saveSettings').addEventListener('click', () => {
            // 保存用户设置
            saveSettings('fastForwardSeconds', parseInt(document.getElementById('fastForwardSeconds').value));
            saveSettings('fastRewindSeconds', parseInt(document.getElementById('fastRewindSeconds').value));
            saveSettings('volumeChange', parseInt(document.getElementById('volumeChange').value));
            saveSettings('playbackRate', parseFloat(document.getElementById('playbackRate').value));
            saveSettings('pauseKey', document.getElementById('pauseKey').value);
            saveSettings('forwardKey', document.getElementById('forwardKey').value);
            saveSettings('rewindKey', document.getElementById('rewindKey').value);
            saveSettings('volumeUpKey', document.getElementById('volumeUpKey').value);
            saveSettings('volumeDownKey', document.getElementById('volumeDownKey').value);
            saveSettings('enabledSites', document.getElementById('enabledSites').value);

            // 显示保存成功提示
            showSaveSuccessHint();

            // 重新绑定事件监听器
            const updatedSettings = getSettings();
            bindKeys(updatedSettings);

            // 关闭设置面板
            panel.remove();
        });

        // 退出设置
        document.getElementById('exitSettings').addEventListener('click', () => {
            panel.remove(); // 关闭设置面板
        });
    };

    // 在 Tampermonkey 扩展菜单中注册设置按钮
    GM_registerMenuCommand("打开设置", () => {
        createSettingsPanel();
    });

    // 检查当前网站是否在生效网站列表中
    const settings = getSettings();
    const enabledSites = settings.enabledSites.split('\n').map(site => site.trim());
    const currentSite = window.location.hostname;

    if (enabledSites.includes(currentSite)) {
        bindKeys(settings);
    }
})();