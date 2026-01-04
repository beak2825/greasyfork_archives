// ==UserScript==
// @name         2048论坛自动滚动和度盘检测
// @namespace    http://tampermonkey.net/
// @version      2024-11-11
// @description  打开帖子自动滚动到正文部分，并且自动执行检测附件
// @author       xanta
// @match        https://hjd2048.com/2048/read.php?tid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hjd2048.com
// @homepageURL  https://github.com/blkot
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496524/2048%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%92%8C%E5%BA%A6%E7%9B%98%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496524/2048%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%92%8C%E5%BA%A6%E7%9B%98%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function scrollToMainPost() {
        const mainPostContent = document.querySelector('.t5');
        if (mainPostContent) {
            mainPostContent.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function autoCheckpan() {
        if (typeof JQ !== 'undefined') {
            // Select all elements with ID starting with 'checkpan'
            JQ('[id^=checkpan]').each(function() {
                JQ(this).click();
            });
        } else {
            console.log('JQ not found.');
        }

    }

    function autoHideAnnouncement() {
        let cateThread = document.querySelector("#cate_thread");
        if (cateThread) {
            cateThread.style.display = "none";
        }
    }


    window.addEventListener('load', scrollToMainPost);
    window.addEventListener('load', autoCheckpan);
    window.addEventListener('load', autoHideAnnouncement);

})();