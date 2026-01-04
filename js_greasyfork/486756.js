// ==UserScript==
// @name         智慧中小学快刷补丁
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  配合2024寒假脚本更加，解决失效
// @author       jh.y
// @match        https://basic.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firefoxchina.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486756/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%BF%AB%E5%88%B7%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/486756/%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%BF%AB%E5%88%B7%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ii = 0;
   setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var c_video = document.getElementsByTagName('video')[i]
            // 静音
            c_video.volume = 0

            
             c_video.playbackRate =2.0
             window.confirm=function()
            {
                return true;
            }
//
           for ( i = 1; i<240; i++ ) {

      let video = document.getElementsByTagName('video')
            for (let i=0; i<video.length; i++) {
        video[i].currentTime = video[i].duration
    }
     window.confirm=function()
            {
                return true;
            }
     }

            //如果视频被暂停
            if (c_video.paused) {
                c_video.play()
            }
        }
    }, 800)
})();
