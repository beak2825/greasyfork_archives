// ==UserScript==
// @name         文亮网课次数破解
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  破解网课0次问题
// @author       jjb
// @match        http://www.wenliangwk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424378/%E6%96%87%E4%BA%AE%E7%BD%91%E8%AF%BE%E6%AC%A1%E6%95%B0%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/424378/%E6%96%87%E4%BA%AE%E7%BD%91%E8%AF%BE%E6%AC%A1%E6%95%B0%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    myPlay()
    videoClick();
    function videoClick(){
        try{
            document.getElementsByTagName("video")[0].onclick = function (){
                var playBtn = document.getElementsByClassName("prism-play-btn")[0]
                var isPlaying = playBtn.classList.length === 1 ? false : true;
                if (isPlaying) {
                    player.pause();

                }else {
                    player.play()
                }
            }
        }catch(error){}

    }
    function myPlay() {
        player.off("playing")
        var div = document.getElementsByClassName("box")[0];
        div.parentNode.removeChild(div);
        player.on('playing',function(e) {
            if(player.getStatus()=='play' | player.getStatus()=='loading'){
                if(stid!=null && stid!=undefined && stid!="" && "au_ye"==au){
                    player.play();
                }else if(cookie_time!=null && (Date.parse(new Date())-cookie_time)/60000>10 && play_count>0){
                    player.play();
                }else if(cookie_time!=null && (Date.parse(new Date())-cookie_time)/60000<=10 && play_count>0){
                    player.play();
                    return false;
                }else{
                    player.play();
                }
                flag=setInterval(shuiyin, 6000);
                player.on("ended", function(){
                    clearInterval(flag);
                });
            }else{
                player.on('ended',function(e) {
                    confirmBoxE("试听结束");
                });
            }
        })
    }
    // Your code here...
})();