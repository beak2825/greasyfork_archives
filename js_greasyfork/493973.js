// ==UserScript==
// @name         哔哩哔哩音频单声道化
// @namespace    qwq0
// @version      0.1
// @description  舒适的使用耳机观看左右声道响度不同的视频
// @author       QwQ~
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493973/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9F%B3%E9%A2%91%E5%8D%95%E5%A3%B0%E9%81%93%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493973/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9F%B3%E9%A2%91%E5%8D%95%E5%A3%B0%E9%81%93%E5%8C%96.meta.js
// ==/UserScript==

setTimeout(function ()
{
    "use strict";

    /**
     * @type {HTMLDivElement}
     */
    let videoHolder = null;
    /**
     * @type {HTMLVideoElement}
     */
    let video = null;

    let audioContext = new AudioContext();

    /**
     * @type {MediaElementAudioSourceNode}
     */
    let mediaSource = null;

    let middleNode = audioContext.createChannelMerger(1);
    middleNode.connect(audioContext.destination);

    setInterval(() =>
    {
        let nowVideoHolder = document.getElementsByClassName("bilibili-player-video")[0] ||
            document.getElementsByClassName("bpx-player-video-wrap")[0] ||
            document.getElementById("live-player") ||
            document.getElementsByClassName("container-video")[0];

        if (!nowVideoHolder)
            return;

        let nowVideo = nowVideoHolder.getElementsByTagName("video")[0];
        if (nowVideo && video != nowVideo)
        {
            videoHolder = nowVideoHolder;
            video = nowVideo;

            mediaSource = audioContext.createMediaElementSource(video);
            mediaSource.connect(middleNode);
            console.log("[哔哩哔哩音频单声道化]", "已单声道化当前播放的视频")
        }
    }, 1000);
}, 500);