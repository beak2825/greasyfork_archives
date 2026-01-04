// ==UserScript==
// @name         学堂在线刷课脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  学堂在线刷课脚本，自动静音和二倍速，只有刷课的功能。
// @author       Saafo
// @license      LGPL-3.0-only
// @match        https://next.xuetangx.com/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402127/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/402127/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
(async function() {
    'use strict';
    await sleep(1000);
    var courses = document.getElementsByClassName("noScore");
    var currentCourse = "";
    var j = 0;
    for(j = 0;j< courses.length;j++){
        if(courses[j].parentElement.getAttribute("class") == "title active"){
            currentCourse = courses[j];
            break;
        }
    }
    await sleep(2000);
    var isVideo = false;

    for(let i = 0;i< 50000;i++){
        if(document.getElementsByClassName("xt_video_player_common_icon").length != 0){
            document.getElementsByClassName("xt_video_player_common_icon")[0].click();//静音
            document.getElementsByClassName("xt_video_player_common_list")[0].children[0].click();//二倍速
            isVideo = true;
            break;
        }
    }
    if(!isVideo){
        courses[j+1].click();//跳到下一个视频
        await sleep(500);
        window.location.reload();
    }

    if(currentCourse != ""){
        //开始等待
        var timeBlock = document.getElementsByClassName("xt_video_player_current_time_display")[0].textContent;
        var currentTimeRaw = timeBlock.split(' / ')[0];
        var timeLengthRaw = timeBlock.split(' / ')[1];
        var currentTime = (+currentTimeRaw.split(':')[0])*3600 + (+currentTimeRaw.split(':')[1])*60 + (+currentTimeRaw.split(':')[2]);
        var timeLength = (+timeLengthRaw.split(':')[0])*3600 + (+timeLengthRaw.split(':')[1])*60 + (+timeLengthRaw.split(':')[2]);
        await sleep((timeLength - currentTime)*500);
        courses[j+1].click();//跳到下一个视频
        console.log('开始刷课');
        await sleep(500);
        window.location.reload();
    }else{
        alert("出错，脚本已经停止运行。")
    }
    // Your code here...
})();