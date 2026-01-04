// ==UserScript==
// @name         无能视频下载器 -999999
// @namespace    http://tampermonkey.net/
// @version      -999999
// @description  用于appgrowing-cn.youcloud.com 的视频下载器
// @author       贝贝
// @match        *://appgrowing-cn.youcloud.com/*
// @grant        GM_download
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/510379/%E6%97%A0%E8%83%BD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%20-999999.user.js
// @updateURL https://update.greasyfork.org/scripts/510379/%E6%97%A0%E8%83%BD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%20-999999.meta.js
// ==/UserScript==

function generateDownloadBtn(){

    const video = document.getElementsByTagName('video')[0];
    if(video == undefined){
       setTimeout(generateDownloadBtn, 1000);
    }else{
        const videoSrc = video.src;

        const downloadBtn = document.createElement('button');
        downloadBtn.innerText+="[点我下载视频]"

        downloadBtn.addEventListener("click",()=>{
            downloadBtn.innerText="正在准备下载"
            const fileName = videoSrc.substring(videoSrc.lastIndexOf('/') + 1, videoSrc.indexOf('.mp4'));

            GM_download(`${videoSrc}.mp4`, fileName);
        })

        document.body.insertBefore(downloadBtn,document.body.firstChild);
    }
}

(function() {
    'use strict';

    setTimeout(generateDownloadBtn(), 5000);

})();