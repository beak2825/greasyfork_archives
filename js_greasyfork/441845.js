// ==UserScript==
// @name         关闭暂停广告
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  关闭暂停时视频中心的弹窗广告(爱奇艺、腾讯)
// @author       xuanxiaomai
// @match        https://www.iqiyi.com/*
// @match        https://v.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqiyi.com
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441845/%E5%85%B3%E9%97%AD%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/441845/%E5%85%B3%E9%97%AD%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var iqy_ad_close = document.querySelector(".cupid-pause-close")
        var tx_ad_close = document.querySelector(".txp_zt_video_close")
        if (iqy_ad_close){
            iqy_ad_close.click()
        }
        if (tx_ad_close){
            tx_ad_close.click()
        }
    },1000);
})();