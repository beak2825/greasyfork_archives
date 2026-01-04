// ==UserScript==
// @name         PlayerSpeeder
// @namespace    http://lmzyzylkh.net/
// @version      0.5
// @description  PlayerSpeeder for Tampermonkey
// @author       lmzyzylkh
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://code.jquery.com/jquery-3.6.1.min.js
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/456103/PlayerSpeeder.user.js
// @updateURL https://update.greasyfork.org/scripts/456103/PlayerSpeeder.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    //'use strict';
    let keys_dict = {'1':'1','2':'2','3':'3','4':'4','5':'0.5','6':'0.1','7':'0.75','8':'2.5','9':'1.5'};
    if (keys_dict[event.key]) {
        var player = document.querySelector('video');
        // console.log(event.key, keys_dict[event.key]);
        tips_video_speed(keys_dict[event.key]);
        player.playbackRate=keys_dict[event.key];
    }
  });

function tips_video_speed(speed){
    var get_tips_div = $("#tips_div");
    if(get_tips_div.val() == undefined){
        var tips_div = '<div id="tips_div" style="border-radius: 20px;'+
        'background:#000;'+
        'width: 120px;'+
        'height: 40px;'+
        'position:fixed;'+
        'left:50%; top:50%;'+
        'margin-left:-60px;'+
        'margin-top:-20px;'+
        'text-align:center;'+
        'line-height:40px;'+
        'font-size:20px;'+
        'color:#FFF;'+
        'opacity:0.8;'+
        'z-index:9999999999;">⨉'+speed+'</div>';
        var player = document.querySelector('video');
        $(player.parentElement).append(tips_div)
        $("#tips_div").animate({opacity:"0.8"},1000).animate({opacity:"0"},500);
    }else{
        if(!get_tips_div.is(":animated")){
            get_tips_div.text("⨉"+speed);
            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},1000).animate({opacity:"0"},500);
        }else{
            get_tips_div.stop(true, true);
            get_tips_div.text("⨉"+speed);
            get_tips_div.css("opacity","0.8").animate({opacity:"0.8"},1000).animate({opacity:"0"},500);
        }
    }
}


//youtube
//document.querySelector("#movie_player > div.html5-video-container > video").playbackRate=2

//bilibili
//document.querySelector('video').playbackRate = 3
