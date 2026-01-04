// ==UserScript==
// @name         bilibili auto triple
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       cjq
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-end
// @description  b站50%自动三连
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436211/bilibili%20auto%20triple.user.js
// @updateURL https://update.greasyfork.org/scripts/436211/bilibili%20auto%20triple.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let videoDom, timeLine
    const getInfo= () =>{
        const urlNormal = location.pathname.split("/")[2]
        //const videoAV = urlNormal.startsWith("av") && urlNormal.replace("av", "")
        const videoAV = window.aid;
        let value = "; " + document.cookie;
        let parts = value.split("; bili_jct=");
        if (parts.length === 2 && videoAV){
            return {userId:parts.pop().split(";").shift(), av:videoAV};
        } else{
            return false
        }
    }

    const autoFunc= e =>{
        const {currentTime} = e.target
        if(currentTime >= timeLine * 0.5){
            console.log("like")
            videoDom.removeEventListener("timeupdate", autoFunc)
            let xhr = new XMLHttpRequest();
            xhr.open("POST", 'https://api.bilibili.com/x/web-interface/archive/like/triple', true);
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
            xhr.withCredentials = true
            if(getInfo()){
                console.log(getInfo())
                xhr.send(`aid=${getInfo().av}&csrf=${getInfo().userId}`);
                let tripleBox = [...document.querySelector(".ops").children]
                tripleBox.map((res, index)=>{
                    if(index < 3){
                        res.classList.add("on")
                    }
                })
            }
        }
    }

    const startFunc= ()=>{
        console.log("begin listen", timeLine)
        if(addEventListener){
            videoDom.addEventListener("timeupdate", autoFunc)
        }

    }
    window.onload = ()=>{}

    console.log("auto triple on~")

    var timerId=setInterval(function(){
        videoDom=document.querySelector("video");
        console.log(videoDom);
        if(videoDom!=undefined && videoDom!=''){
            //setTimeout(startFunc, timeLine * 400)
            timeLine = videoDom.duration
            startFunc();
            clearInterval(timerId);
        }
    },500);


})();