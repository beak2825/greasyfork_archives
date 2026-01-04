// ==UserScript==
// @name         配合使用
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  （仅自动播放、静音）
// @author       You
// @match        https://www.zxx.edu.cn/*
// @match        https://www.zgzjzj.com/*
// @match        https://basic.smartedu.cn/*
// @grant        none
// @license      You
// @downloadURL https://update.greasyfork.org/scripts/502192/%E9%85%8D%E5%90%88%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/502192/%E9%85%8D%E5%90%88%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //document.querySelector('video').play();
    //current_video.volume = 0
    // Your code here...
    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            // 静音
            current_video.volume = 0
            document.querySelector('video').playbackRate = 1;

            // 如果视频被暂停
            if (current_video.paused) {
                current_video.play()
            }

            var di3 = document.querySelector("div > div.fish-modal-wrap > div > div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button")
            var di1 = document.querySelector("#vjs_video_20757 > div:nth-child(11) > div > div.fish-modal-wrap > div > div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button")
            var di2 = document.querySelector("#zxxcontent > div.index-module_container_4pMtL > div > div > micro-app > micro-app-body > div:nth-child(3) > div > div.fish-modal-wrap > div > div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button")
            if(di1){
                di1.click()
            }
            if(di2){
                di2.click()
            }
            if(di3){
                di3.click()
            }
        }
    }, 1000)
})();