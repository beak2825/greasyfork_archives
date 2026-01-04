// ==UserScript==
// @name         关闭定时弹窗
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在学习网站中关闭定时出现的弹窗
// @author       saitenasuk
// @match        https://learn.courshare.cn/*
// @license         MIT
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/493346/%E5%85%B3%E9%97%AD%E5%AE%9A%E6%97%B6%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/493346/%E5%85%B3%E9%97%AD%E5%AE%9A%E6%97%B6%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video = document.querySelector("#container_media > video")

    setInterval(function() {
         var confirmButton = document.querySelector('.layui-layer-btn0');
        // 如果找到了确认按钮，就点击它
        if (confirmButton) {
            confirmButton.click();
            console.log("已自动点击确认按钮");
        }else{
            console.log("未找到按钮");
        }
        if (video) {
            // 判断视频是否在播放
            if (!video.paused && !video.ended) {
                console.log("视频正在播放");
            }
        }else{
            console.log("未找到视频");
        }
    }, 5000);
    // Your code here...
})();