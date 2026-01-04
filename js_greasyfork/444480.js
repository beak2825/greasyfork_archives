// ==UserScript==
// @name         隐藏B站视频播放中的推荐视频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  寸金难买寸光阴
// @author       You
// @match        *://www.bilibili.com/video*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444480/%E9%9A%90%E8%97%8FB%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B8%AD%E7%9A%84%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/444480/%E9%9A%90%E8%97%8FB%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B8%AD%E7%9A%84%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //window.addEventListener('load', ()=>{
        const newStyle = document.createElement("style")
        newStyle.innerHTML = `
        .r-con {
            visibility: hidden;
        }

        .bpx-player-ending-panel{
            display: none !important;
        }

        `
        document.head.appendChild(newStyle)
        localStorage.setItem("recommend_auto_play", "close")
    //})


    var intv = setInterval(()=>{
        var rcon = document.getElementsByClassName("right-container")[0]
        var rconLis = rcon.childNodes
        if(rcon != void 0){
            clearInterval(intv)
            setTimeout(()=>{
                rcon.style.visibility = "visible"
                while(rconLis.length != 2){
                     rconLis[rconLis.length-1].remove()
                 }
            }, 5000)
        }
    }, 300)
    // Your code here...
})();