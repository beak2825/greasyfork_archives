// ==UserScript==
// @name         学习通自动播放视频
// @namespace    adog
// @version      1.0
// @description  仅支持任务点全为视频的自动播放，静音播放，自动连播,自动下一个任务点
// @author       a6op
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474765/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/474765/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    findtask();
        var timefind=setInterval(function(){
                if(document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe").length-1].contentWindow.document.getElementsByClassName("vjs-progress-holder vjs-slider vjs-slider-horizontal")[0].getAttribute("aria-valuenow") == 100){
                        findtask();
                };
            },10000);
    function findtask(){
        setTimeout(function(){
            document.getElementsByClassName("catalog_points_yi prevTips")[0].parentNode.children[0].click();
        },1000);
        playvideo();
        setTimeout(function(){
            if(document.getElementsByClassName("catalog_points_yi prevTips").length==0){clearInterval(timefind);}
        },1000);
    };
    function playvideo(){
        var videolist=0;
        var timeplay=setInterval(function(){
            if(videolist>=document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe").length){clearInterval(timeplay);};
            if(document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-attach-ct")[videolist].className !="ans-attach-ct ans-job-finished"){
                    setTimeout(function(){
                        document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[videolist].contentWindow.document.getElementById("video").children[0].muted=true;
                    },3000);
                    setTimeout(function(){
                        document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[videolist].contentWindow.document.getElementById("video").children[0].play();
                    },3000);
                }
            else
            {videolist++;}
            },3000);
    };
})();