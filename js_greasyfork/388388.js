// ==UserScript==
// @name         [kesai]记忆播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  很多在线播放器刷新页面后又从头开始播放，这个用来实现记忆播放功能
// @author       kesai
// @match        https://bde4.com/play/*
// @match        https://v.youku.com/*
// @match        https://movie.douban.com/trailer*
// @match        https://www.iqiyi.com/*
// @match        http://www.iqiyi.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/388388/%5Bkesai%5D%E8%AE%B0%E5%BF%86%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/388388/%5Bkesai%5D%E8%AE%B0%E5%BF%86%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    class VideoInfo {
        constructor(url, curTime, lastTime) {
            this.url = url; //播放视频所在url
            this.curTime = curTime; //视频上次播放到的位置            
        }
    }


    const isDebug = true;
    window.onload = function() {
        var video = document.getElementsByTagName("video")[0];
        debugInfo(video);
        var btn = $("<button type='button' style='position:fixed;left:10px;bottom:50px;height:30px;width:100px;border:none;color:#fff;background:#333333;cursor:pointer;'  title='我太菜了，无法自动记忆播放就点这个吧'>记忆播放</>")
        $("body").append(btn);

        btn.click(function() {
            playByMemory();
        });
    }



    function playByMemory() {
        let videoInfoArray = GM_getValue('videoInfoArray');

        debugInfo("videoInfoArray:")
        debugInfo(videoInfoArray);

        let videoInfo = videoInfoArray.find((videoInfo) => (videoInfo.url == window.location.href));
        if (videoInfo != null || videoInfo != undefined) {
            setCurrentTime(videoInfo.curTime);
        }
    }

    function setCurrentTime(t) {

        debugInfo('setCurrentTime:' + t)

        var video = document.getElementsByTagName("video")[0];
        video.currentTime = (t === null || t === undefined) ? 0 : t;
    }

    function getCurrentTime() {
        var video = document.getElementsByTagName("video")[0];
        return video.currentTime;
    }

    function saveCurrentTime() {
        debugger;
        var video = document.getElementsByTagName("video")[0];

        var videoInfoArray = GM_getValue('videoInfoArray');
        if (videoInfoArray === null || videoInfoArray === undefined || videoInfoArray.length <= 0)
            videoInfoArray = new Array();

        let videoInfo = videoInfoArray.find((videoInfo) => (videoInfo.url == window.location.href));
        if (videoInfo === null || videoInfo === undefined) {
            videoInfo = new VideoInfo(window.location.href, video.currentTime);
            videoInfoArray.push(videoInfo);
        } else {
            videoInfo.curTime = video.currentTime;
        }
        //if (videoInfoArray.length > 50) videoInfoArray.shift(); //最多不超过50条记录
        while (videoInfoArray.length > 25) videoInfoArray.shift(); //最多不超过50条记录
        GM_setValue('videoInfoArray', videoInfoArray);
        debugInfo('saveCurrentTime:' + video.currentTime);
    }


    window.onbeforeunload = function() {
        saveCurrentTime();
    }

    window.onunload = function() {
        saveCurrentTime();
    }

    function debugInfo(info) {
        if (isDebug) console.log(info)
    }

})();