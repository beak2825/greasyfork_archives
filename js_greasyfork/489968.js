// ==UserScript==
// @name         聯X電腦免登入看片
// @namespace    https://greasyfork.org/zh-TW/scripts/489968
// @version      0.2
// @description  進到想看的影片，按下網頁左上角的"Watch"按鈕
// @author       Artin
// @license MIT
// @match        https://www.lccnet.tv/pages/watch.aspx*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/489968/%E8%81%AFX%E9%9B%BB%E8%85%A6%E5%85%8D%E7%99%BB%E5%85%A5%E7%9C%8B%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/489968/%E8%81%AFX%E9%9B%BB%E8%85%A6%E5%85%8D%E7%99%BB%E5%85%A5%E7%9C%8B%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 按下按鈕時執行的函數
    function copyVideoID() {
        // 獲取當前網址
        var currentURL = window.location.href;
        // 提取影片ID
        var videoID = currentURL.match(/v=([^&]+)/);
        if (videoID && videoID.length > 1) {
            videoID = videoID[1];
            // 生成新網址
            var newURL = 'https://www.lccnet.tv/vod1/' + videoID + '/default.mp4';
            // 複製到剪貼板
            var tempInput = document.createElement("input");
            tempInput.style = "position: absolute; left: -1000px; top: -1000px";
            tempInput.value = newURL;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            // 在新分頁開啟
            window.open(newURL, '_blank');
        } else {
            alert('Unable to find video ID.');
        }
    }

    function addButton() {
        // 添加複製連結按鈕
        var button = document.createElement('button');
        button.innerHTML = 'Watch';
        button.style.position = 'fixed';
        button.style.top = '40px';
        button.style.left = '40px';
        button.style.zIndex = '9999';
        button.onclick = copyVideoID;
        document.body.appendChild(button);
    }
    addButton();
})();