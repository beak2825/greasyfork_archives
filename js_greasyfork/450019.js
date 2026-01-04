// ==UserScript==
// @name         阿里云盘F键全屏
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Press F to fullscreen your vide of aliyundrive
// @author       SORAGINKO
// @match        https://www.aliyundrive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @run-at       document-body 
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450019/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98F%E9%94%AE%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/450019/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98F%E9%94%AE%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function(e) { //MDN已不推薦用key.down
        if (e.keyCode == 70) { //70是F鍵的鍵代碼
            toggleFullScreen();
  }
}, false);

    function toggleFullScreen() {
        var video = document.querySelector(".video-previewer-container--3N0eI"); //video即需要全屏的元素，放在函數裏獲取是因爲點開視頻前和點開視頻後URL並不會改變，若是在函數一開始就獲取需要全屏的元素則會出現video爲null而調用全屏API失败
        if (!document.fullscreenElement) {
            video.requestFullscreen(); //如果全屏元素不存在，則啓動全屏
        } else {
            document.exitFullscreen(); //如果不存在全屏元素，則退出全屏
        }
    }

    // Your code here...
})();