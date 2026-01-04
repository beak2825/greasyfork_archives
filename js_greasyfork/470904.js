// ==UserScript==
// @name         智慧教育摸鱼
// @namespace    Eucliwood
// @version      0.4
// @description  智慧教育解除不置顶就暂停的限制,自动静音,内部使用禁止外泄！
// @author       Eucliwood
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail?*
// @icon         https://basic.smartedu.cn/favicon.ico
// @grant        unsafeWindow
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/470904/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/470904/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("visibilitychange",(event)=>{
    event.stopImmediatePropagation();
    },true);
    setInterval(()=>{var main_video=document.querySelector("video");if(false==main_video.muted){main_video.volume=0;main_video.playbackRate="2";}if(true==main_video.paused){main_video.play()}},1000);
    // Your code here...
})();