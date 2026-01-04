// ==UserScript==
// @name         Siki Video Playrate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  siki学院视频，播放速度保持上一次选择
// @author       Jeffssss
// @match        *://service-cdn.qiqiuyun.net/js-sdk/video-player/*/player.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sikiedu.com
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455850/Siki%20Video%20Playrate.user.js
// @updateURL https://update.greasyfork.org/scripts/455850/Siki%20Video%20Playrate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        var vid = window.document.querySelector("video");
        vid.addEventListener('ratechange',function() {
            unsafeWindow.console.log ("播放速率修改");
            unsafeWindow.console.log (window.document.querySelector("video").playbackRate);
            GM_setValue('siki_video_rate', window.document.querySelector("video").playbackRate);
            unsafeWindow.console.log ("存储的速率" + GM_getValue('siki_video_rate', 2));
        });
        vid.addEventListener('play',function() {
            unsafeWindow.console.log ("开始播放了");
            unsafeWindow.console.log (window.document.querySelector("video").playbackRate);
            window.document.querySelector("video").playbackRate = GM_getValue('siki_video_rate', 2);
            unsafeWindow.console.log (window.document.querySelector("video").playbackRate);
        });
    }
})();