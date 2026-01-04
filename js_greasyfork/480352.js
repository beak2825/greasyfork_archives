// ==UserScript==
// @name         GzswdxAutoPlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  广州市干部培训网络学院课程视频自动继续播放。
// @author       LeeFreud
// @match        https://gzgbjy.gzswdx.gov.cn/page.html
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gzswdx.gov.cn
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480352/GzswdxAutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/480352/GzswdxAutoPlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function playVideo(){
        let video = document.querySelector("div.course-player-pattern > div > div > div > div > div > div > video");
        if (video.paused){
            video.play();
            console.log("已自动播放。");
        }
    }
    function playNextVideo(){
        let progress = document.querySelector("div.chapter-content > div.tab-content-desc.desc-item-sel > div > div > div.el-progress__text");
        let nextVideo = document.querySelector("div.chapter-content > div.tab-content-desc.desc-item-sel").nextElementSibling.querySelector("div > div > div.el-progress__text");
        if (progress.innerHTML == "100"){
            nextVideo.click();
        }
    }
    function autoPlay(){
        playVideo();
        playNextVideo();
    }
    console.log("自动检查功能加载完成。");
    setInterval(autoPlay,2000);
})();