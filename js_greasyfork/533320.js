// ==UserScript==
// @name         自动跳转到下一个未播放的视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  视频播放结束后自动跳转到下一个未播放的视频
// @license      Proprietary
// @author       PASSIONYOUNGZ
// @match        https://sydw.hnu.edu.cn/course/*/task/*/show  // 修改为更通用的匹配
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533320/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%8B%E4%B8%80%E4%B8%AA%E6%9C%AA%E6%92%AD%E6%94%BE%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/533320/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%8B%E4%B8%80%E4%B8%AA%E6%9C%AA%E6%92%AD%E6%94%BE%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前页面的视频元素
    function getVideo() {
        return document.querySelector("video");
    }

    // 获取当前视频播放时间
    function getCurTime() {
        let video = getVideo();
        return video ? video.currentTime : 0;
    }

    // 获取视频总时长
    function getTotalTime() {
        let video = getVideo();
        return video ? video.duration : 0;
    }

    // 检查视频是否播放完毕
    function isPlayFinish() {
        return getCurTime() + 5 >= getTotalTime(); // 5秒内视为播放完成
    }

    // 查找目录中未解锁的视频链接
    function getNextUnwatchedVideoLink() {
        let taskItems = document.querySelectorAll(".task-item.task-content .mouse-enter.color-warning");
        if (taskItems.length > 0) {
            let nextVideoLink = taskItems[0].closest('li').querySelector('a.title').getAttribute('href');
            return nextVideoLink;
        }
        return null;
    }

    // 模拟跳转到下一个未播放的视频
    function goToNextVideo() {
        let nextVideoLink = getNextUnwatchedVideoLink();
        if (nextVideoLink) {
            console.log("正在跳转到下一个未播放的视频: " + nextVideoLink);
            window.location.href = nextVideoLink;  // 跳转到下一个视频
        } else {
            console.log("没有找到未播放的视频任务");
        }
    }

    // 视频播放完后执行跳转
    function checkVideoFinish() {
        let video = getVideo();
        if (!video) return;

        video.addEventListener('ended', function () {
            console.log("视频播放结束，准备跳转到下一个视频");
            goToNextVideo();  // 跳转到下一个未播放的视频
        });
    }

    // 页面加载完成后初始化检查
    window.addEventListener('load', function () {
        setTimeout(function () {
            checkVideoFinish();  // 延迟执行，确保视频元素已加载
        }, 1000);
    });

})();
