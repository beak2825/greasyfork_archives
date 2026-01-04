// ==UserScript==
// @name         bilibili auto triple
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  对辛苦制作视频的up主的鼓励吧。脚本会在你看了视频总时长的40%以上， 并且当前进度条大于80%时会认为你喜欢这个视频， 并进行三连。
// @author       Luo Shiheng
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391888/bilibili%20auto%20triple.user.js
// @updateURL https://update.greasyfork.org/scripts/391888/bilibili%20auto%20triple.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let videoDom, timeLine
    const getInfo= () =>{
        const urlNormal = location.pathname.split("/")[2]
        const videoAV = urlNormal.startsWith("av") && urlNormal.replace("av", "")
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
        if(currentTime >= timeLine * 0.8){
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
    window.onload = ()=>{
        videoDom = document.querySelector("video")
        timeLine = videoDom.duration
        setTimeout(startFunc, timeLine * 400)
    }
})();