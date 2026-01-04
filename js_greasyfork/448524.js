// ==UserScript==
// @name         小鹅通倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  小鹅通网站倍速播放视频
// @author       kakasearch
// @match        https://*.h5.xiaoeknow.com/*/course/video/*
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoeknow.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/448524/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/448524/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
 var tmp = setInterval(function(){
     let video = document.querySelector("video")
        if (video) {
            video.addEventListener("canplay",function(){
                setTimeout(function(){
                document.querySelector("video").play()

                },2000)

            })
            video.playbackRate = 3
                new ElegantAlertBox("正在倍速播放>__<")

        }
    },1000)

    // Your code here...
})();