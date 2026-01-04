// ==UserScript==
// @name         腾讯视频去除logo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除腾讯视频播放时右上角的logo，使用adblockplus进行拦截会导致网页崩溃。
// @author       张瓜皮
// @match        *://v.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478605/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4logo.user.js
// @updateURL https://update.greasyfork.org/scripts/478605/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var logo = document.querySelector('.txp-watermark');
    if (logo != null) {
        logo.remove();
        console.log("删除logo")
    }

    // 暂停广告去除。
    // 此处第一次暂停会出现广告，后面则不会
    // 推荐adblockplus添加规则：v.qq.com##div[data-role="creative-player-pause-layer"]
    // setTimeout( function(){
    //     document.querySelector("#player > div.txp_videos_container > video").addEventListener('pause', function () {//暂停开始执行的函数
    //         console.log('视频暂停')
    //         var ad = document.querySelector('div[data-role="creative-player-pause-layer"]');
    //         console.log(ad)
    //         if (ad != null) {
    //             ad.remove();
    //         }
    //     });
    // }, 3000 );

})();