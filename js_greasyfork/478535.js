// ==UserScript==
// @name         进度跳转
// @namespace    yournamespace
// @version      0.1
// @description  按数字键跳转视频进度条百分比
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478535/%E8%BF%9B%E5%BA%A6%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478535/%E8%BF%9B%E5%BA%A6%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        const keyCode = event.keyCode || event.which;

        if (keyCode >= 48 && keyCode <= 57) {
            const video = document.querySelector('video');

            if (video && !isNaN(video.duration)) {
                const percentage = (keyCode - 48) * 10;
                const targetTime = (percentage / 100) * video.duration;

                video.currentTime = targetTime;
            }
        }
    });
})();


(function() {
    'use strict';

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了 Shift 键
        const isShiftPressed = event.shiftKey;

        // 获取当前活动的视频元素
        const video = document.querySelector('video');

        if (!video) {
            return; // 如果没有找到视频元素，则不执行任何操作
        }

        // 检查按下的键并执行相应操作
        switch (event.key) {
            case 'j':
                if (isShiftPressed) {
                } else {
                    // j 后退 12 秒
                    video.currentTime -= 12;
                }
                break;
            case 'l':
                if (isShiftPressed) {
                } else {
                    // l 前进 12 秒
                    video.currentTime += 12;
                }
                break;
            default:
                break;
        }
    });
})();