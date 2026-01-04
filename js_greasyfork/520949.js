// ==UserScript==
// @name            哔哩哔哩番剧助手 | Bilibili Bangumi Assistant
// @namespace       http://tampermonkey.net/
// @version         3.2
// @description     自动跳过片头片尾，支持自定义快进秒数和播放速度记忆功能，使观看体验更加流畅。
// @description-en  Automatically skip opening and ending sequences, support customizable fast-forward seconds and playback speed memory for a smoother viewing experience.
// @author          MarySue
// @match           *://*.bilibili.com/bangumi/play/ep*
// @grant           none
// @run-at          document-end
// @license         GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520949/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E5%8A%A9%E6%89%8B%20%7C%20Bilibili%20Bangumi%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/520949/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E5%8A%A9%E6%89%8B%20%7C%20Bilibili%20Bangumi%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户自定义块开始 -----------------------------------------------
    const userSettings = {
        settings: [
            {
                pattern: '^https?://(www\\.)?bilibili\\.com/bangumi/play/ep\\d+', // 匹配带有可变ep编号的URL
                titlePattern: /柯南/, // 包含"柯南"
                introDuration: 99, // 片头时长 (秒)
                outroDuration: 0, // 片尾时长 (秒)
                forwardSeconds: 80, // 快进秒数
                forwardKey: 'KeyK', // 快进快捷键
                playbackSpeedKeys: {
                    slowDown: 'KeyA', // 慢速热键
                    reset: 'KeyS', // 重置速度热键
                    speedUp: 'KeyD' // 快速热键
                },
                playbackSpeedSteps: {
                    decreaseStep: 0.1, // 每次按下慢速热键减少的速度
                    increaseStep: 0.1 // 每次按下快速热键增加的速度
                }
            }
        ],
        defaultSetting: {
            introDuration: 0,
            outroDuration: 0,
            forwardSeconds: 0,
            forwardKey: 'Space',
            playbackSpeedKeys: {
                slowDown: null, // 默认无慢速热键
                reset: null, // 默认无重置速度热键
                speedUp: null // 默认无快速热键
            },
            playbackSpeedSteps: {
                decreaseStep: 0.1,
                increaseStep: 0.1
            }
        }
    };
    // 用户自定义块结束 --------------------------------------------

    // 获取当前页面对应的设置
    function getSettingsForPage(userSettings) {
        let pageUrl = window.location.href;
        let pageTitle = document.title; // 获取页面标题

        for (let setting of userSettings.settings) {
            if (new RegExp(setting.pattern).test(pageUrl) && new RegExp(setting.titlePattern).test(pageTitle)) {
                return setting;
            }
        }
        return userSettings.defaultSetting;
    }

    // 使用 MutationObserver 动态检测视频元素加载
    function waitForVideoElement(callback) {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                callback(video);
                observer.disconnect(); // 找到视频后停止观察
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 应用跳过逻辑到视频元素上
    function applySkipLogic(videoElement, settings) {
        let originalDuration = videoElement.duration;
        let userSeeking = false;

        videoElement.addEventListener('loadedmetadata', () => {
            originalDuration = videoElement.duration;
        });

        videoElement.addEventListener('seeking', () => {
            userSeeking = true;
        });

        videoElement.addEventListener('seeked', () => {
            userSeeking = false;
        });

        videoElement.addEventListener('timeupdate', () => {
            if (!userSeeking && videoElement.currentTime < settings.introDuration) {
                videoElement.currentTime = settings.introDuration;
            } else if (!userSeeking && originalDuration - videoElement.currentTime < settings.outroDuration) {
                videoElement.currentTime = originalDuration - settings.outroDuration;
            }
        });
    }

    // 监听键盘事件以实现快进
    function setupKeyboardShortcut(settings) {
        document.addEventListener('keydown', event => {
            if (event.code === settings.forwardKey) {
                const video = document.querySelector('video');
                if (video) {
                    video.currentTime += settings.forwardSeconds;
                }
            }
        });
    }

    // 处理播放速度控制的函数
    function setupPlaybackSpeedControl(videoElement, settings) {
        let lastPlaybackRate = parseFloat(localStorage.getItem('lastPlaybackRate')) || 1.0;
        let hasReset = false; // 跟踪是否已经恢复过默认速度
        let previousPlaybackRate = lastPlaybackRate;

        videoElement.playbackRate = lastPlaybackRate;

        function changePlaybackSpeed(event) {
            if (event.code === settings.playbackSpeedKeys.slowDown) {
                lastPlaybackRate -= settings.playbackSpeedSteps.decreaseStep;
                lastPlaybackRate = parseFloat(lastPlaybackRate.toFixed(2));
                if (lastPlaybackRate < 0.1) { lastPlaybackRate = 0.1; }
                videoElement.playbackRate = lastPlaybackRate;
                localStorage.setItem('lastPlaybackRate', lastPlaybackRate);
                hasReset = false; // 更新播放速度时重置标志
            } else if (event.code === settings.playbackSpeedKeys.speedUp) {
                lastPlaybackRate += settings.playbackSpeedSteps.increaseStep;
                lastPlaybackRate = parseFloat(lastPlaybackRate.toFixed(2));
                videoElement.playbackRate = lastPlaybackRate;
                localStorage.setItem('lastPlaybackRate', lastPlaybackRate);
                hasReset = false; // 更新播放速度时重置标志
            } else if (event.code === settings.playbackSpeedKeys.reset) {
                if (!hasReset) {
                    // 第一次按下恢复默认速度并保存当前速度
                    previousPlaybackRate = lastPlaybackRate;
                    videoElement.playbackRate = 1.0;
                    lastPlaybackRate = 1.0;
                    localStorage.setItem('lastPlaybackRate', lastPlaybackRate);
                    hasReset = true;
                } else {
                    // 再次按下恢复之前的播放速度
                    videoElement.playbackRate = previousPlaybackRate;
                    lastPlaybackRate = previousPlaybackRate;
                    localStorage.setItem('lastPlaybackRate', lastPlaybackRate);
                    hasReset = false;
                }
            }
        }

        document.addEventListener('keydown', changePlaybackSpeed);
    }

    // 初始化
    let settingsForPage = getSettingsForPage(userSettings);

    // 确保脚本在页面完全加载后执行，并等待视频元素加载完成
    waitForVideoElement((video) => {
        if (settingsForPage !== userSettings.defaultSetting) { // 只有当URL和title都匹配时才应用逻辑
            applySkipLogic(video, settingsForPage);
            setupKeyboardShortcut(settingsForPage);
            setupPlaybackSpeedControl(video, settingsForPage);
        }
    });

    // 监听 video 元素的播放状态以恢复播放速度
    function restorePlaybackSpeedOnNewVideo() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                let lastPlaybackRate = parseFloat(localStorage.getItem('lastPlaybackRate')) || 1.0;
                video.playbackRate = lastPlaybackRate;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    restorePlaybackSpeedOnNewVideo(); // 在页面加载时启动恢复播放速度的监听
})();

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.