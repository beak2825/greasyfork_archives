// ==UserScript==
// @name         dilidili flash to html5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  把dilidili的Flash播放器替换为HTML5播放器
// @author       Hugo16
// @match        http://www.dilidili.wang/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376514/dilidili%20flash%20to%20html5.user.js
// @updateURL https://update.greasyfork.org/scripts/376514/dilidili%20flash%20to%20html5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 引用js和css
    let jsSrc = document.createElement("script");
    jsSrc.src = "https://vjs.zencdn.net/7.4.1/video.js";
    document.head.appendChild(jsSrc);
    let jsSrc1 = document.createElement("script");
    jsSrc1.src = "https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js";
    document.head.appendChild(jsSrc1);
    let cssSrc = document.createElement("link");
    cssSrc.rel = "stylesheet";
    cssSrc.href = 'https://vjs.zencdn.net/7.0.0/video-js.css';
    document.head.appendChild(cssSrc);
    // 稍微改下样式
    let newStyle = document.createElement("style");
    newStyle.innerText = ".video-js .vjs-big-play-button {top: 50%;left: 50%;transform: translate(-50%,-50%);}";
    document.head.appendChild(newStyle);

    // 找到原播放器
    let originalVideoWrap = document.getElementsByClassName("player_main");

    if (originalVideoWrap) {

        // 获取视频地址
        let videoSrc = originalVideoWrap[0].children[0].attributes["src"].value;
        videoSrc = videoSrc.split("=")[1];

        // 不是m3u8的就不改
        if (videoSrc.slice(-4) != "m3u8") {
            return;
        }

        // 新的video
        let newVideo = document.createElement("video");
        newVideo.setAttribute("id", "newVideo");
        newVideo.width = originalVideoWrap[0].clientWidth;
        newVideo.height = originalVideoWrap[0].clientHeight;
        newVideo.className = "video-js vjs-default-skin";
        newVideo.setAttribute("controls", true);

        let newSource = document.createElement("source");
        newSource.src = videoSrc
        newSource.setAttribute("type", "application/x-mpegURL");
        newVideo.appendChild(newSource);

        // 替换播放器
        originalVideoWrap[0].replaceChild(newVideo, originalVideoWrap[0].children[0]);

        // js加载完毕后运行播放器
        jsSrc.onload = function () {
            let player = videojs('newVideo');
            player.play();
        }
    }
})();
