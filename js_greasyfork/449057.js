// ==UserScript==
// @name         16倍速间隔4秒视频播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习辅助
// @author       木叶的老芽
// @match        https://player.qlteacher.com/learning/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449057/16%E5%80%8D%E9%80%9F%E9%97%B4%E9%9A%944%E7%A7%92%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449057/16%E5%80%8D%E9%80%9F%E9%97%B4%E9%9A%944%E7%A7%92%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){

        document.getElementsByTagName('video')[0].playbackRate = 16;
        document.getElementsByTagName('video')[0].volume = 0;
        if(document.getElementsByTagName('video')[0].paused==true){

            document.getElementsByTagName('video')[0].play();
            console.log("播放视频");

            setTimeout(function(){
                if(document.getElementsByTagName('video')[0].paused==false){
                    document.getElementsByTagName('video')[0].pause()
                    console.log("暂停视频");
                }
            },4000);

        }

    },4000);
})();