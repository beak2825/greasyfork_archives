// ==UserScript==
// @name         bilibili 洗脑循环自动播放修复
// @namespace    www.papercomment.tech
// @version      0.0.1
// @description  修复bilibili列表视频洗脑循环开启后跳转开头不会自动开始播放，代码完全由Chatgpt4生成，代码样例参考(https://greasyfork.org/zh-CN/scripts/386069-bilibili-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE)
// @author       myself
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/watchlater/*
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/476401/bilibili%20%E6%B4%97%E8%84%91%E5%BE%AA%E7%8E%AF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/476401/bilibili%20%E6%B4%97%E8%84%91%E5%BE%AA%E7%8E%AF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoPlay = true;
    let wasPlaying = false;

    function play(target) {
        setTimeout(() => { target.play(); }, 1000);
    }

    function checkAutoPlayCondition() {
        let loopCheckbox = document.querySelector('.bpx-player-ctrl-setting-loop .bui-switch-input');
        let videoAnchor = document.querySelector('video');

        if (videoAnchor && loopCheckbox) {
            if (videoAnchor.currentTime <= 5) {
                wasPlaying = true;
            }
            if (autoPlay && wasPlaying && loopCheckbox.checked && videoAnchor.readyState === 1 && videoAnchor.currentTime <= 5) {
                play(videoAnchor);
            }
        }
    }

    function checkStatus() {
        let videoAnchor = document.querySelector('video');

        if (videoAnchor) {
            videoAnchor.addEventListener('ended', function() {
                setTimeout(() => {  // 添加延时
                    wasPlaying = true;
                    checkAutoPlayCondition();
                }, 500);  // 延时500毫秒
            });
        }
    }

    // 初始化
    checkStatus();

    // 由于可能存在 AJAX 加载，也可以在合适的时机重新执行 checkStatus
    // 例如，可以监听某个 DOM 元素的变化来重新执行 checkStatus

})();










