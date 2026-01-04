// ==UserScript==
// @name         奥鹏，自动上课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         http://learn.open.com.cn/StudentCenter/CourseWare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404672/%E5%A5%A5%E9%B9%8F%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/404672/%E5%A5%A5%E9%B9%8F%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var check = setInterval(main, 250);

    function main() {
        if (window.require == null || window.jQuery == null) { return; };
        clearInterval(check);
        // 这里执行比较快，需要延迟执行
        setTimeout(listtree, 10000);
    }
    var loop;
    function checkTime() {
        console.log('视频时长---->');
        loop = setInterval(function () {
            //视频时长
            var durationObj = $('.duration');
            var currentObj = $('.current-time');
            if (durationObj.length > 0 && currentObj.length > 0) {
                let duration = durationObj[0].textContent;
                let current = currentObj[0].textContent;
                console.log(duration);
                console.log(current);
                console.log(duration == current);
                console.log('-----------')
                if (duration == current) {
                    console.log('-->视屏已经播放完毕');
                    //重新加载课程
                    top.window.location.reload();
                    return true;
                }
            }
        }, 5000);
    }

    //课程表点击
    function listtree() {
        console.log('课程表点击--->');
        //学习中的课程
        var halftree = $("li.resource").children("i.half_play");
        //未开始学习的课程
        var ultree = $("li.resource").children("i.not_play");
        // console.log(halftree);
        // console.log('------')
        // console.log(ultree);
        if (halftree.length != 0) {
        // if (false) {
            $(halftree[0]).siblings("a").click();
            $("div #outter").click();
        } else {
            $(ultree[0]).siblings("a").click();
            $("div #outter").click();
        }
        setVideoOption();
        checkTime();
    }


    function setVideoOption() {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            //静音
            current_video.volume = 0
            //倍速
            current_video.playbackRate = 2.0
        }
    }



})();