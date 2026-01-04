// ==UserScript==
// @name         B站♥双击便捷举报/拉黑
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  双击网页空白区域直接模拟点击举报按钮
// @author       Zola
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496847/B%E7%AB%99%E2%99%A5%E5%8F%8C%E5%87%BB%E4%BE%BF%E6%8D%B7%E4%B8%BE%E6%8A%A5%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/496847/B%E7%AB%99%E2%99%A5%E5%8F%8C%E5%87%BB%E4%BE%BF%E6%8D%B7%E4%B8%BE%E6%8A%A5%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查双击事件是否在视频区域
    document.addEventListener('dblclick', function(event) {
        var videoElement = document.querySelector('video');
        if (videoElement && !videoElement.contains(event.target)) {
            // 如果双击事件不在视频元素内，模拟点击举报按钮
            var complaintButton = document.querySelector('div.video-complaint.video-toolbar-right-item.dropdown-item');
            if (complaintButton) {
                complaintButton.click();
            } else {
                console.error('未找到举报按钮');
            }
        }
    }, false);

})();
