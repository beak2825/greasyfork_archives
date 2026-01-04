// ==UserScript==
// @name         Not For VIP百度网盘视频播放30s限制解除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Not For VIP自动处理百度网盘视频播放30s限制
// @author       MANBO
// @match        https://pan.baidu.com/s*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537057/Not%20For%20VIP%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE30s%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/537057/Not%20For%20VIP%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE30s%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isVideoProcessed = false;

    // 处理视频元素
    function processVideoElement() {
        if (isVideoProcessed) return;

        // 移除试看提示元素
        const startTipElement = document.querySelector('div.video-start-tip');
        if (startTipElement) {
            startTipElement.remove();
            console.log('已移除试看提示元素');
        }

        // 处理视频播放器
        const videoElements = document.querySelectorAll("#html5player_html5_api");
        if (videoElements.length > 0) {
            try {
                let video = videoElements[0];
                video.controls = "true";
                video.pause = null;
                document.querySelectorAll("#html5player > div.vjs-control-bar")[0].style.display = "none";
                document.querySelectorAll("#video-wrap-outer > div.video-overlay-iframe")[0].style.display = "none";
                isVideoProcessed = true;
                console.log('已处理视频元素');
            } catch (error) {
                console.error('处理视频元素时出错:', error);
            }
        }
    }

    // 主检查函数
    function mainCheck() {
        processVideoElement();

        // 如果视频处理完成，停止检查
        if (isVideoProcessed) {
            clearInterval(checkInterval);
        }
    }

    // 每500毫秒检查一次
    const checkInterval = setInterval(mainCheck, 500);
})();

