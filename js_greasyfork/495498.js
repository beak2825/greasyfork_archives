// ==UserScript==
// @name         百度网盘打开中文字幕
// @namespace    http://tampermonkey.net/
// @version      25.7.22
// @description  百度网盘播放视频时自动打开中文字幕
// @author       Run-os
// @match        https://pan.baidu.com/pfile/video?path=*.mp4*
// @match        https://pan.baidu.com/play/video#/video?path=*.mp4*
// @icon         https://th.bing.com/th?id=ODLS.039b3eb8-253e-4d80-8727-6e7d039c3891&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @homepage     https://scriptcat.org/zh-CN/script-show-page/3864/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495498/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495498/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

// 创建一个 div 元素作为提示框的容器
const message = document.createElement("div");
// 设置提示框的样式
message.style.position = "fixed";
message.style.top = "80%";
message.style.left = "50%";
message.style.transform = "translate(-50%, -50%)";
message.style.background = "#fff";
message.style.border = "1px solid #ccc";
message.style.padding = "20px";
message.style.borderRadius = "5px";
message.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
message.style.zIndex = "9999";
message.style.fontSize = "16px";
message.style.display = "none"; // 初始状态下不显示
// 将提示框添加到页面中
document.body.appendChild(message);

//提示框
function toast(text) {
    message.textContent = text;
    message.style.display = "block";
    setTimeout(function () {
        message.style.display = "none";
    }, 1000);
}

(function () {
    'use strict';

    const maxWaitTime = 60000; // 最多等待1分钟
    const intervalTime = 2000; // 每2秒检查一次
    const subtitleSelector = 'li.vp-video__control-bar--video-subtitles-select-item:nth-child(2)';

    const startTime = Date.now();

    const interval = setInterval(function () {
        const subtitleElement = document.querySelector(subtitleSelector);

        if (subtitleElement) {
            clearInterval(interval); // 停止检测
            subtitleElement.click();

            setTimeout(function () {
                // 重新查询元素以确保它仍然存在
                const checkedElement = document.querySelector(subtitleSelector);
                if (checkedElement && checkedElement.classList.contains('is-checked')) {
                    toast("⚡自动打开中文字幕成功😊");
                } else {
                    toast("⚡自动打开中文字幕失败😢");
                }
            }, 1000); // 点击后再等待1秒进行检查

        } else if (Date.now() - startTime > maxWaitTime) {
            clearInterval(interval); // 停止检测
            toast("⚡超时未找到指定的元素😢");
        }
    }, intervalTime);
})();
