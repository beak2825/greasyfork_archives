// ==UserScript==
// @name         better player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://202.38.196.89/cache/*
// @match        http://s.cnmooc.org/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29226/better%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/29226/better%20player.meta.js
// ==/UserScript==

var video=document.getElementsByTagName('video')[0];

video.onclick=function(){
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
};


window.addEventListener('keydown',function(e) {
    var v=video.volume;
    if(e.keyCode==39) // SPACE
    {
        video.currentTime+=5;
    }
    else if (e.keyCode==37){
        video.currentTime-=5;
    }
    else if (e.keyCode==38){
        v+=0.05;
    }
    else if (e.keyCode==40){
        v-=0.05;
    }
    
    if(v>1)video.volume=1;
    else if(v<0)video.volume=0;
    else video.volume=v;
    },true);
