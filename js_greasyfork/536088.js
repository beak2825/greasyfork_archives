// ==UserScript==
// @name         问题元素自动处理
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  【自己用的】自动移除视频随机出现的问题
// @author       (●￣(ｴ)￣●)
// @match        *://zzzj.zyk.yxlearning.com/learning/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536088/%E9%97%AE%E9%A2%98%E5%85%83%E7%B4%A0%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/536088/%E9%97%AE%E9%A2%98%E5%85%83%E7%B4%A0%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndHandleElement() {
        // 检测目标问题元素（带特定样式的div）
        const questionElement = document.querySelector('div.bplayer-question-wrap[style="display: flex;"]');

        if (questionElement) {
            // 检测到元素时执行删除操作
            questionElement.remove();
            console.log('已检测并删除问题元素');

            // 2秒后尝试点击播放按钮
            setTimeout(() => {
                const playButton = document.querySelector('span.icon.bplayer-play-btn');
                if (playButton) {
                    playButton.click();
                    console.log('已点击视频播放按钮');
                } else {
                    console.log('未找到播放按钮，无法执行点击');
                }
            }, 2000);
        } else {
            console.log('未检测到问题元素，继续等待下次检测');
        }
    }

    // 首次立即执行检测（避免初始等待5秒）
    checkAndHandleElement();

    // 每5秒循环执行检测（5000毫秒=5秒）
    setInterval(checkAndHandleElement, 5000);
})();