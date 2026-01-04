// ==UserScript==
// @name         人设培训网自动下一个视频脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本仅适用于 mooc1.cqrspx.cn 这个网址
// @author       gsc/hjj/ymj/hsa
// @match        *://mooc1.cqrspx.cn/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478191/%E4%BA%BA%E8%AE%BE%E5%9F%B9%E8%AE%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478191/%E4%BA%BA%E8%AE%BE%E5%9F%B9%E8%AE%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setInterval(check,3000)

})();


function check(){
    const duration = document.querySelector("video").duration;
    const currentTime = document.querySelector("video").currentTime;
    const paused = document.querySelector("video").paused;
    console.log("总时长：",duration,"当前时长:",currentTime,"是否暂停:",paused);
    if (paused){
        if(Number.isNaN(duration)){
            window.setTimeout(() => {
                console.log("点击播放")
                // window.top.frames[2].frames[0].document.querySelector('.vjs-big-play-button').click();
                let doc = window.top.document.querySelector('#qqqq').querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('.vjs-big-play-button')
                doc.click();
            },1000)
        }



        console.log("进入下一节")
        // const ss = document.getElementById('iframe').contentWindow;
        // const jj = ss.document.querySelector("iframe").contentWindow;
        // const button = jj.document.getElementById("prevNextFocusNext");
        //const button = document.getElementById("prevNextFocusNext")
        const button = window.top.document.querySelector("#prevNextFocusNext");
        console.log(button);

        console.log("点击下一页！");
        if(duration === currentTime){
            button.click();
        }
    }
}