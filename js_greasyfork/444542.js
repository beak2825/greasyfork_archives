// ==UserScript==
// @name         自动播放网课
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  网课视频自动播放下一级
// @author       ELLIE
// @include      http://cqkj.360xkw.com/s.html*
// @include      http://cqkj.360xkw.com/s.html*
// @icon         https://img1.baidu.com/it/u=2298832174,71113162&fm=26&fmt=auto
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444542/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444542/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // 获取视频播放元素
    window.onload = function () {
        const video = document.getElementById("live_video");
        // 监听播放完成时间
        video.addEventListener('ended', delayTheNextOne);

        function delayTheNextOne() {
            setTimeout(function () {
                // 获取播放列表元素
                const list = document.getElementsByClassName("layui-colla-content layui-show")[0].children[0].children;
                // 是否触发点击事件
                let isClick = false;
                // 遍历元素，获取正在播放的视频
                for (let i = 0; i < list.length; i++) {
                    let li = list[i];
                    let temp = li.children[0];
                    // 获取到正在播放的视频
                    if ('isVideo onLive' === temp.className) {
                        // 设置点击下一个视频
                        isClick = true;
                        continue;
                    }
                    // 点击下一个视频
                    if (isClick) {
                        isClick = false;
                        temp.click();
                        return;
                    }
                }
            }, Math.random() * 3000 + 3000)
        }
    }
})();