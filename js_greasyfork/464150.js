// ==UserScript==
// @name         DaxuexiTerminator 青年大学习终结者[2023-4 Update]
// @namespace    https://minecreeper.top/
// @version      0.1
// @description  直接跳过青年大学习的视频
// @author       MineCreeper-矿井小帕
// @match        *://h5.cyol.com/special/daxuexi/*
// @grant        none
// @run-at       document-idle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464150/DaxuexiTerminator%20%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E7%BB%88%E7%BB%93%E8%80%85%5B2023-4%20Update%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/464150/DaxuexiTerminator%20%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E7%BB%88%E7%BB%93%E8%80%85%5B2023-4%20Update%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".rightTop").appendChild(document.createElement("div"))
    var k = document.querySelector(".rightTop").children[4]
    k.className = "line3"
    k.innerHTML = "<b>进入</b>视频<b>播放</b>后，即可<b>自动</b>跳过视频"
    var id = setInterval(function(){
        var finish = false;
        if(document.querySelector("iframe").contentWindow.document.querySelector(".txp_videos_container > video")!=undefined && !finish) {
            if(document.querySelector("iframe").contentWindow.document.querySelector(".txp_videos_container > video").currentTime > 1 && document.querySelector("iframe").contentWindow.document.querySelector(".txp_videos_container > video").currentTime < 10) {
                document.querySelector("iframe").contentWindow.document.querySelector(".txp_videos_container > video").currentTime = 1000;
                document.querySelector(".rightTop").removeChild(k);
            }
        }
    },100)
})();