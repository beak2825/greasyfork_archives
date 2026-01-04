// ==UserScript==
// @name         华为iLearningX刷课脚本 auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  华为iLearningX挂课脚本，自动静音拉动进度条，测一测会自动跳过，需要手动写
// @author       otifik
// @match        https://ilearningx.huawei.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huawei.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455209/%E5%8D%8E%E4%B8%BAiLearningX%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/455209/%E5%8D%8E%E4%B8%BAiLearningX%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20auto.meta.js
// ==/UserScript==

//测一测自动跳过，自己手动写一下吧~如果没点到自己手动点一下，脚本可能中途中断，需要手动刷新一下页面
(function() {
    'use strict';

    // Your code here...
    document.onreadystatechange = function(){
        if(document.readyState == 'complete'){
            //get next button
            var nextBtnG = document.getElementsByClassName("sequence-nav-button button-next");
            //get course list on tabbar
            var courseList = document.getElementById("sequence-list");
            console.log(courseList);
            //get course length
            var length = courseList.getElementsByTagName('li').length;
            console.log(length);
            var ivideoG = document.getElementsByClassName("vjs-tech");
            //judge whether videos'number is 0
            var flag = 0;
            if(ivideoG.length == 0){
                flag = 1;
            }
            //judge whether it's a test
            if(flag == 1){
                setTimeout(function() {
                    nextBtnG[0].click();
                    console.log("auto click!");
                },2000);
            }else {
                //loop
                for(let i = 1;i<length+1;i++){
                    //console.log("start execute ",i);
                    if(flag == 0){
                        setTimeout(function (){
                            var ivideo = document.getElementsByClassName("vjs-tech")[0];
                            ivideo.muted = true;
                            console.log("start handle video",i);
                            //ivideo.setAttribute("muted","muted");
                            ivideo.play();
                        },5000+(i-1)*15000);
                        setTimeout(function (){
                            var ivideo = document.getElementsByClassName("vjs-tech")[0];
                            console.log("start jump!",i);
                            var dur = ivideo.duration;
                            ivideo.currentTime = dur - 1;
                            console.log("end jump!",i);
                            console.log("end handle video");
                        },10000+(i-1)*15000);
                    }
                    setTimeout(function() {
                        //console.log("end execute ",i);
                        if(i!=length){
                            console.log("next video!");
                            console.log(courseList.getElementsByTagName("button")[i]);
                            courseList.getElementsByTagName("button")[i].click();
                        }else {
                            nextBtnG[0].click();
                            console.log("auto click!");
                        }
                        //nextBtnG[0].click();
                        //console.log("auto click!");
                    },15000*i);
                }
                //setTimeout(function() {
                //    nextBtnG[0].click();
                //    console.log("auto click!");
                //},20000*length);
            }
        }
    }
})();