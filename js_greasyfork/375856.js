// ==UserScript==
// @name         make coursera subtitle better look and add forward and backword time control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将英文字幕显示在视频下方，并且鼠标悬浮/离开字幕视频暂停/继续播放，鼠标点击字幕视频暂停可以和剪切板查单词一起用，并且可以通过左箭头和右箭头按钮进行调整看的进度
// @author       babybing666
// @match        https://www.coursera.org/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375856/make%20coursera%20subtitle%20better%20look%20and%20add%20forward%20and%20backword%20time%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/375856/make%20coursera%20subtitle%20better%20look%20and%20add%20forward%20and%20backword%20time%20control.meta.js
// ==/UserScript==

var flag=1;

function changesub(){
    var title = document.querySelector(".rc-PageHeaderControls");
    var element = document.querySelector(".rc-Phrase.active");
    var element1 = document.querySelector(".rc-InteractiveTranscript");
    var videocontrol = document.querySelector("#c-video_html5_api");
    if(flag){
        var video = document.querySelector(".video-container");
        if(element){
            title.style.display="none";
            element1.style.display = "none";
            var newnode = document.createElement('div');
            newnode.textContent=element.textContent;
            newnode.style.textAlign = "center";
            newnode.className="newSubtitle";
            newnode.onmouseleave = function(){videocontrol.play();};
            newnode.onclick=function(){
                videocontrol.pause();
                newnode.onmouseleave = "";};
            };
            newnode.onmouseover = function(){
                videocontrol.pause();
                newnode.onmouseleave = function(){videocontrol.play();};
            };
            videocontrol.onkeypress=function(e){
                if (e.keyCode == '37') {
                    //left arrow
                    videocontrol.currentTime=videocontrol.currentTime - 0.1;}
                else if (e.keyCode == '39') {
                    //right arrow
                    videocontrol.currentTime=videocontrol.currentTime + 0.1;}
            };
            video.after(newnode);
            flag = 0;
    }
    else {
        var newsub=document.querySelector('.newSubtitle');
        if(newsub){
        newsub.textContent=element.textContent;}
        else{flag=1;}
    }


}

setInterval(changesub,30);
