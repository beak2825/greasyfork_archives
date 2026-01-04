// ==UserScript==
// @name         安徽继续教育课程学习视频倍速自动下个章节
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  继续教育在线刷课自动下个章节（修复倍速播放问题）
// @author       李志航
// @match        https://*/*
// @icon         https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541708/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%AA%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/541708/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%AA%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.indexOf('https://main.ahjxjy.cn/study/html') > -1){
        console.log("自动跳转下个章节监听已开启！");
        alert("自动跳转下个章节监听已开启！\n请点击页面任意位置激活视频禁音2倍速播放功能");

        let userInteracted = false;
        let videoSpeedSet = false;

        // 视频倍速设置功能
        const setVideoSpeed = () => {
            const video = document.querySelector('video');
            if (video && !videoSpeedSet) {
                try {
                    // 先静音播放以避免自动播放限制
                    video.muted = true;
                    video.play()
                        .then(() => {
                            video.playbackRate = 2;
                            console.log('视频已设置为 2 倍速播放');
                            videoSpeedSet = true;
                        })
                        .catch(e => console.error('静音播放失败:', e));
                } catch (e) {
                    console.error('设置倍速失败:', e);
                }
            }
        };

        // 用户交互检测
        const handleUserInteraction = () => {
            if (!userInteracted) {
                userInteracted = true;
                console.log("用户已交互，激活视频播放功能");
                setVideoSpeed();
                // 移除监听防止重复触发
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('keydown', handleUserInteraction);
            }
        };

        // 添加用户交互监听
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        // 章节跳转检测
        const checkNextButton = setInterval(() => {
            const buttons = document.querySelectorAll('.btn-green');

            if (buttons.length === 1) {
                console.log("该章节已学习完成，自动跳转下一章节。");
                buttons[0].click();
            } else if (buttons.length === 0) {
                console.log("未监听到下一章节按钮，继续监听...");
            } else {
                console.warn("发现多个下一章节按钮，请手动操作");
                alert("发现多个下一章节按钮，请手动操作！");
            }
        }, 3000);

        // 视频检测（应对动态加载）
        const videoCheck = setInterval(() => {
            if (document.querySelector('video') && userInteracted && !videoSpeedSet) {
                setVideoSpeed();
            }
        }, 1000);
    }
})();