// ==UserScript==
// @name         I-Ready Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicks next on iready when you hit enter, also speeds up video to custom speed. Videos may also be skipped.
// @author       Alan Yu
// @grant        none
// @include      https://login.i-ready.com/*
// @include      https://cdn.i-ready.com/*
// @downloadURL https://update.greasyfork.org/scripts/431389/I-Ready%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/431389/I-Ready%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(e){
        if(e.key == "Enter"){
            document.querySelector('#doneButton').click();
        }
    }
    window.oldvid = 0;
    setInterval(function(){
        var vid = document.querySelector("video");
        if(!((vid == null)||(window.oldvid == vid))){
            try{
                vid.playbackRate = parseInt(prompt("Playback speed of video?"));
                window.oldvid = vid;
                vid.setAttribute("controls", "true");
                var btn = document.createElement("button");
                btn.innerText = "Skip";
                btn.style.position = "absolute";
                btn.style.top = "10px";
                btn.style.left = "10px";
                vid.parentElement.parentElement.parentElement.parentElement.appendChild(btn);
                var btn2 = document.createElement("button");
                btn2.innerText = "Change Speed";
                btn2.style.position = "absolute";
                btn2.style.top = "50px";
                btn2.style.left = "10px";
                vid.parentElement.parentElement.parentElement.parentElement.appendChild(btn2);
                window.vid = vid;
                window.btn = btn;
                window.btn2 = btn2;
                btn.onclick = function(){
                    vid.currentTime = vid.duration;
                    this.remove();
                }
                btn2.onclick = function(){
                    try{
                        vid.playbackRate = parseInt(prompt("Playback speed of video?"));
                    }
                    catch{
                        alert("INVALID");
                    }
                }
                vid.onended = function(){
                    btn.remove();
                    btn2.remove();
                }
            }
            catch{
                alert("INVALID");
            }
        }
    },100);
    window.diagnostic_next = setInterval(function(){
        try{
            document.getElementById("survey-no-label").click();
            document.querySelector('[name="Continue"]').click();
        }
        catch{}
    }, 100);
    window.start_lesson = setInterval(function(){
        try{
            document.querySelector('[aria-label="Open Lesson"]').click();
        }
        catch{}
        try{
            var go_button = document.querySelector("button");
            if(go_button.innerText == "GO!"){
                go_button.click();
            }
        }
        catch{}
    }, 100);
    window.next_button = setInterval(function(){
        try{
            document.getElementsByClassName("unlock-button")[0].click();
        }
        catch{}
    }, 100);
})();