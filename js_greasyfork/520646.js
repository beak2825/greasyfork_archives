// ==UserScript==
// @name         自定义 Bilibili 视频片头片尾的跳过时间 | Video Skipper for Bilibili
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skip video intros and endings with customizable durations on Bilibili.
// @author       MarySue
// @match        *://*.bilibili.com/bangumi/play/ep*
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520646/%E8%87%AA%E5%AE%9A%E4%B9%89%20Bilibili%20%E8%A7%86%E9%A2%91%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E7%9A%84%E8%B7%B3%E8%BF%87%E6%97%B6%E9%97%B4%20%7C%20Video%20Skipper%20for%20Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/520646/%E8%87%AA%E5%AE%9A%E4%B9%89%20Bilibili%20%E8%A7%86%E9%A2%91%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E7%9A%84%E8%B7%B3%E8%BF%87%E6%97%B6%E9%97%B4%20%7C%20Video%20Skipper%20for%20Bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户自定义块开始 -----------------------------------------------
    const userSettings = {
        settings: [
            {
                pattern: '^https?://(www\\.)?bilibili\\.com/bangumi/play/ep\\d+', // 匹配带有可变ep编号的URL
                introDuration: 95, // 片头时长 (秒)
                outroDuration: 0, // 片尾时长 (秒)
                forwardSeconds: 80, // 快进秒数
                forwardKey: 'KeyK' // 快进快捷键
            }
        ],
        defaultSetting: {
            introDuration: 0,
            outroDuration: 0,
            forwardSeconds: 0,
            forwardKey: 'Space'
        }
    };
    // 用户自定义块结束 --------------------------------------------

    // 获取当前页面对应的设置
    function getSettingsForPage(userSettings) {
        let pageUrl = window.location.href;
        for (let setting of userSettings.settings) {
            if (new RegExp(setting.pattern).test(pageUrl)) {
                return setting;
            }
        }
        return userSettings.defaultSetting;
    }

    // 应用跳过逻辑到视频元素上
    function applySkipLogic(videoElement, settings) {
        let originalDuration = videoElement.duration;
        let userSeeking = false;

        videoElement.addEventListener('loadedmetadata', () => {
            originalDuration = videoElement.duration;
        });

        // 监听用户是否正在拖动进度条
        videoElement.addEventListener('seeking', () => {
            userSeeking = true;
        });

        // 监听拖动完成
        videoElement.addEventListener('seeked', () => {
            userSeeking = false;
        });

        videoElement.addEventListener('timeupdate', () => {
            if (!userSeeking && videoElement.currentTime < settings.introDuration) {
                // 如果不是用户手动操作且当前时间小于片头时长，则跳过片头
                videoElement.currentTime = settings.introDuration;
            } else if (!userSeeking && originalDuration - videoElement.currentTime < settings.outroDuration) {
                // 如果不是用户手动操作且接近片尾，则跳过片尾
                videoElement.currentTime = originalDuration - settings.outroDuration;
            }
        });
    }

    // 监听键盘事件以实现快进
    function setupKeyboardShortcut(settings) {
        document.addEventListener('keydown', event => {
            if (event.code === settings.forwardKey) {
                let video = document.querySelector('video');
                if (video) {
                    video.currentTime += settings.forwardSeconds;
                }
            }
        });
    }

    // 动态检测视频元素的加载
    function waitForVideoElement(callback) {
        let intervalId = setInterval(() => {
            let video = document.querySelector('video');
            if (video) {
                clearInterval(intervalId);
                callback(video);
            }
        }, 500); // 每500毫秒检查一次
    }

    // 初始化
    let settingsForPage = getSettingsForPage(userSettings);

    // 确保脚本在页面完全加载后执行，并等待视频元素加载完成
    waitForVideoElement((video) => {
        applySkipLogic(video, settingsForPage);
        setupKeyboardShortcut(settingsForPage);
    });
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