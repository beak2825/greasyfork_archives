// ==UserScript==
// @name         重庆理工大学自学考试视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  视频自动静音，第一次播放是需要手动点击开始，后面自动播放（暂停后也会继续播放）；http://cqlg.360xkw.com/gxplatform/gxlearningcenter/rebackVideo.html?subId=65639&videoId=117017&flag=2&seekTimes=0&id=121&type=491   其中seekTimes一定要设置为0
// @author       GongCJ
// @match        http://cqlg.360xkw.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436450/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436450/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    // 播放视频的区域
    var _vid = $("#live_video")[0];
    // 设置静音
    _vid.volume = 0;

    //每一秒检查
    setInterval(function () {
        //判断是否播放完毕
        if(_vid.currentTime>=_vid.duration){
            console.log('播放完毕自动播放下一个视频');
            $(".onLive").parent().next().find("a").click();
        }else if(_vid.paused){
            //未播放完毕时，检查是否暂停，暂停了继续播放
            console.log('暂停了，自动播放');
            _vid.playbackRate = 1;
            _vid.play();
        }
    }, 1000);
})();