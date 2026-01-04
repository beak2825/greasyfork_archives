// ==UserScript==
// @name         腾讯视频去水印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去水印，顺带去掉暂停全屏广告
// @author       Simon
// @include      *://v.qq.com/x/cover/*
// @include      *://v.qq.com/x/page/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431792/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/431792/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let intID1 = setInterval(() => {
    var a=document.getElementsByClassName("txp-watermark");
    var ad=document.getElementsByClassName("txp_full_screen_pause-close");
                if (a.length > 0) {
                    a[0].remove();
                    var b=document.getElementsByClassName("txp_waterMark_pic");
                    a[0].removeChild(b[0]);
                }
                if (ad.length >0){
                    ad[0].click();
                }
            }, 1000);
    // Your code here...
})();