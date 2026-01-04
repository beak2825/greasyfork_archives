// ==UserScript==
// @name         Universal Video Skipper | 全站通用跳过片头片尾自定义时长
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skip video intros and endings with customizable durations on multiple websites.
// @author       MarySue
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520647/Universal%20Video%20Skipper%20%7C%20%E5%85%A8%E7%AB%99%E9%80%9A%E7%94%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/520647/Universal%20Video%20Skipper%20%7C%20%E5%85%A8%E7%AB%99%E9%80%9A%E7%94%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户自定义块开始 -----------------------------------------------
    const userSettings = {
        settings: [
            {
                pattern: '^https?://(www\\.)?bilibili\\.com/bangumi/play/ep\\d+', // 匹配带有可变ep编号的Bilibili番剧 URL
                introDuration: 95, // 片头时长 (秒)
                outroDuration: 0, // 片尾时长 (秒)
                forwardSeconds: 80, // 快进秒数
                forwardKey: 'KeyK' // 快进快捷键
            },
/*
           {
               pattern: '^https?://v\\.qq\\.com/x/cover/[a-zA-Z0-9]+/([a-zA-Z0-9]+)\\.html$', // 匹配带有可变video ID的腾讯视频URL
               introDuration: 60, // 示例片头时长 (秒)，请根据实际情况调整
               outroDuration: 10, // 示例片尾时长 (秒)，请根据实际情况调整
               forwardSeconds: 30, // 示例快进秒数，请根据实际情况调整
               forwardKey: 'KeyL' // 示例快进快捷键，请根据实际情况调整
           }
*/
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