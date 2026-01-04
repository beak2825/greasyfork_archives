// ==UserScript==
// @name         切换标签页自动暂停视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  当从含有视频的标签页切换到其他标签页时，视频自动暂停播放。

// @author       coldboy775
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487109/%E5%88%87%E6%8D%A2%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/487109/%E5%88%87%E6%8D%A2%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==



(function() {
    'use strict';

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 当标签页不可见时
            const videos = document.getElementsByTagName('video');
            for (let video of videos) {
                if (!video.paused) {
                    video.pause(); // 暂停视频
                    video.setAttribute('data-was-playing', 'true');
                }
            }
        } else {
            // 当标签页再次可见时
            const videos = document.getElementsByTagName('video');
            for (let video of videos) {
                if (video.getAttribute('data-was-playing') === 'true') {
                    video.play(); // 恢复播放
                    video.removeAttribute('data-was-playing');
                }
            }
        }
    });
})();