// ==UserScript==
// @name         妇幼营养与健康在线培训及考核倍速播放
// @namespace    http://tampermonkey.net/
// @version      2024-11-26
// @description  妇幼营养与健康在线培训及考核里面培训视频的倍速播放
// @author       You
// @match        https://mchtracourse.chinawch.org.cn/videoPlay/play?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinawch.org.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518908/%E5%A6%87%E5%B9%BC%E8%90%A5%E5%85%BB%E4%B8%8E%E5%81%A5%E5%BA%B7%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%8F%8A%E8%80%83%E6%A0%B8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/518908/%E5%A6%87%E5%B9%BC%E8%90%A5%E5%85%BB%E4%B8%8E%E5%81%A5%E5%BA%B7%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%8F%8A%E8%80%83%E6%A0%B8%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(() => {
        setTimeout(() => {

            const $ = window.$;

            const __PLAYER__ = document.querySelector(`#${$('video')[0].id}`);

            // 设置初始播放速度为 16
            __PLAYER__.playbackRate = 16;

            const customInterval = setInterval("courseyunRecord()", 3000);

            // 监听视频播放进度
            __PLAYER__.addEventListener('timeupdate', function () {

                // 防止视频暂停
                __PLAYER__.play();

                const currentTime = __PLAYER__.currentTime; // 当前播放时间
                const duration = __PLAYER__.duration; // 视频总时长

                // 如果剩余时间小于 10 秒，恢复正常播放速度
                if (duration - currentTime <= 15) {
                    __PLAYER__.playbackRate = 1; // 恢复正常速度

                    // 取消轮询
                    clearInterval(customInterval);

                    courseyunRecord();
                }
            });
        }, 3000);
    });
})();


