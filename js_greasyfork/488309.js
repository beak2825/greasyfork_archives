// ==UserScript==
// @name         河北工程大学继续教育-视频播放
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  视频自动播放下一个
// @author       xiajie
// @match        https://*.edu-edu.com/page/client*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu-edu.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/488309/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/488309/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    var check = setInterval(function(){
        var len = $('.video-box video').length;
        if(len > 0){
            console.log('检测到视频');
            $('.chain-broadcast .ivu-switch').click();
            clearInterval(check);
            videoPlay();
            videoStatus()
        }
    },1000);

    function videoPlay(){
        window.myVid = $('.video-box video')[0];
        myVid.muted = true;
        myVid.play();
        //myVid.playbackRate = 2;
    }

    function videoStatus(){
        setTimeout(function() {
            window.location.reload();
        }, 60*55*1000);
        setInterval(function(){
            window.myVid = $('.video-box video')[0];
            myVid.muted = true;
            //myVid.playbackRate = 2;
            var status = myVid.paused;
            if(status == true){
                myVid.play();
            }
        },3000)
    }

})();