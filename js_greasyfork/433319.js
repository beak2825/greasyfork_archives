// ==UserScript==
// @name         Make Zoom skipping function skip 5s only
// @name:zh-TW   Zoom錄像快進跳轉10秒變5秒
// @name:zh-CN   Zoom录像快进跳转10秒变5秒
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Add buttons for skipping 5s or backing 5s while watching zoom recordings
// @description:zh-tw 添加跳轉到前後5秒的按鈕
// @description:zh-cn 添加跳转到前后5秒的按钮
// @author       You
// @match        *.zoom.us/rec/play/*
// @icon         https://www.google.com/s2/favicons?domain=zoom.us
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433319/Make%20Zoom%20skipping%20function%20skip%205s%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/433319/Make%20Zoom%20skipping%20function%20skip%205s%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const step = 5

    function tenSto5S(){
        document.getElementsByClassName("vjs-step-wrapper")[0].children[1].innerHTML = "5 second"
    }


    function addBtn(){
        const video = document.getElementsByTagName("video")[0];
        const bar = document.getElementsByClassName("vjs-extend-control")[0];

        const back5s = document.createElement("div");
        const go5s = document.createElement("div");


        back5s.innerHTML = "<5s";
        go5s.innerHTML = ">5s";

        back5s.style["margin-right"] = "10px";
        go5s.style["margin-right"] = "10px";

        back5s.style["cursor"] = "pointer";
        go5s.style["cursor"] = "pointer";



        bar.prepend(go5s);
        bar.prepend(back5s);
        
        go5s.onclick = () => {
            video.currentTime += 5;
        }

        back5s.onclick = () => {
            video.currentTime -= 5;
        }

    }

    function delayabit(){  // pending... maybe using try catch
        setTimeout(()=>{
            addBtn();
            tenSto5S();
        }, 5000);
    }

    window.addEventListener("load", delayabit, false);
    
    document.onkeydown = (event) => {
        var theVideo = document.getElementsByTagName('video')[0];
        
        event = event || window.event;
        
        if(event.keyCode == '37'){
            event.preventDefault();
            theVideo.currentTime += 5
        }
        
        else if(event.keyCode == '39'){
            event.preventDefault();
            theVideo.currentTime -= 5
        }
        
        /* else if(event.keyCode == '32'){
            console.log("space bar pressed")
            //event.preventDefault();
            if(theVideo.paused){
                theVideo.play()
            }
            else{
                theVideo.pause()
            }
        } */
            
            
    }


})();