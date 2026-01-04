// ==UserScript==
// @name         自动触发Bilibili网页全屏
// @namespace    http://your-namespace.com
// @version      1.0
// @description  自动触发Bilibili网页全屏按钮并添加快捷键 "V" 触发全屏
// @author       Your Name
// @match        https://www.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489468/%E8%87%AA%E5%8A%A8%E8%A7%A6%E5%8F%91Bilibili%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489468/%E8%87%AA%E5%8A%A8%E8%A7%A6%E5%8F%91Bilibili%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function triggerFullscreen() {
        var fullscreenButton = document.querySelector('.bpx-player-ctrl-web');

        if (fullscreenButton) {
            fullscreenButton.click();
            clearInterval(checkInterval);
            addShortcut();
        }
    }

    function addShortcut() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'v' || event.key === 'V') {
                triggerFullscreen();
            }
        });
    }

    // 定时检查目标元素是否可用
    var checkInterval = setInterval(triggerFullscreen, 1000); // 每秒检查一次

})();