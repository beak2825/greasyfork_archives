// ==UserScript==
// @name         bilibili视频加速
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用于https://www.bilibili.com/video/BV1ys411p7To哔哩哔哩的一个视频加速
// @author       You
// @match        http://time.tianqi.com/
// @match        https://www.bilibili.com/video/BV1ys411p7To
// @license      GPL License
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/475360/bilibili%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/475360/bilibili%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function(){
    "use strict"
    let rate = 4;
    //bilibili用视频加速
    // unsafeWindow.onload=function(){
    //     //在元素都加载完成后再监听video的播放时间,再进行倍速设置
    //     unsafeWindow.document.querySelector('video').onplay=function(){
    //         unsafeWindow.document.querySelector('video').playbackRate=rate;
    //     }
    // }
    document.querySelector('video').playbackRate=rate;


})();