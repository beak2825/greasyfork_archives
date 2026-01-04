// ==UserScript==
// @name         Alt+E 触发画中画
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用 Alt+E 快捷键切换视频画中画模式
// @author       vk
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533946/Alt%2BE%20%E8%A7%A6%E5%8F%91%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/533946/Alt%2BE%20%E8%A7%A6%E5%8F%91%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', async (e) => {
        if (e.altKey && e.key.toLowerCase() === 'e') {
            const videos = document.querySelectorAll('video');
            if (videos.length === 0) {
                console.log('未找到视频元素');
                return;
            }

            let video = [...videos].find(v => !v.paused && !v.ended && v.readyState >= 2) || videos[0];

            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await video.requestPictureInPicture();
                }
            } catch (err) {
                console.error('切换画中画失败:', err);
            }
        }
    });
})();
