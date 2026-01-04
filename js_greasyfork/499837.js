// ==UserScript==
// @name         🥇【好医生小助手】全网唯一真实免费|无人值守|自动静音|自动联播
// @namespace    https://cmechina.net/
// @version      1.7
// @description  自动播放视频
// @author       韦同学
// @match        *.cmechina.net/cme/study2.jsp?course_id=202401007786&courseware_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499837/%F0%9F%A5%87%E3%80%90%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E7%9C%9F%E5%AE%9E%E5%85%8D%E8%B4%B9%7C%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%7C%E8%87%AA%E5%8A%A8%E8%81%94%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/499837/%F0%9F%A5%87%E3%80%90%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E7%9C%9F%E5%AE%9E%E5%85%8D%E8%B4%B9%7C%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%7C%E8%87%AA%E5%8A%A8%E8%81%94%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handleVideo = () => {
        const videoElement = document.querySelector("video");
        if (videoElement) {
            videoElement.muted = true;
            videoElement.playbackRate = 1; // 设置默认倍速为1倍
            videoElement.play().catch(error => {
                console.error('视频播放失败:', error);
            });
            videoElement.addEventListener('ended', playNextVideo);
        } else {
            console.log('没有找到视频元素');
            setTimeout(handleVideo, 2000); // 重试
        }
    };

    const playNextVideo = () => {
        const lis = document.querySelectorAll("ul.s_r_ml > li");
        const activeElement = document.querySelector("li.active");

        if (!activeElement) {
            console.log('没有找到当前播放的视频元素');
            return;
        }

        let index = Array.from(lis).findIndex(li => li === activeElement);

        if (index + 1 < lis.length) {
            index += 1;
            setTimeout(() => {
                lis[index].querySelector("a").click();
            }, 5000); // 延迟5秒再点击下一个视频
        } else {
            console.log('已经是最后一个课程');
        }
    };

    window.addEventListener('load', () => {
        setTimeout(handleVideo, 3000); // 等待3秒确保页面加载完成
    });

})();