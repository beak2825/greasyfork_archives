// ==UserScript==
// @name         关闭爱奇艺暂停广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭暂停时视频中心的弹窗广告
// @author       xuanxiaomai
// @match        https://www.iqiyi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqiyi.com
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441821/%E5%85%B3%E9%97%AD%E7%88%B1%E5%A5%87%E8%89%BA%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/441821/%E5%85%B3%E9%97%AD%E7%88%B1%E5%A5%87%E8%89%BA%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var ad_close = document.querySelector(".cupid-pause-close")
        if (ad_close){
            ad_close.click()
        }
    },1000);
})();