// ==UserScript==
// @name         Acfun-hls
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @version      3.1.1
// @description  Acfun跳转到M3U8地址，需配合Chrome浏览器的扩展HLS-Playback使用
// @author       zwb83925462
// @match        https://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/player/*
// @grant        unsafeWindow
// @run-at       document-end
// @license      CC
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438373/Acfun-hls.user.js
// @updateURL https://update.greasyfork.org/scripts/438373/Acfun-hls.meta.js
// ==/UserScript==
'use strict';
(function(){
    //acfun
    if (location.hostname == 'www.acfun.cn') {
        var oldurl="old",newurl="new";
        document.addEventListener("mousedown", function() {
            oldurl=location.pathname;
        });
        document.addEventListener("mouseup", function() {
            setTimeout(loop,1000);
        });
        function loop() {
            if (unsafeWindow.videoInfo?.currentVideoInfo?.ksPlayJson == undefined) {
                setTimeout(loop, 500);
            }
            newurl=location.pathname;
            if (oldurl == newurl){
                if(document.querySelector("video").paused){
                    console.info(newurl.substring(newurl.lastIndexOf("/")+1));
                }
            } else {
                var ksjs=JSON.parse(unsafeWindow.videoInfo?.currentVideoInfo?.ksPlayJson);
                var acdata = ksjs.adaptationSet[0].representation;
                var acvid=newurl.substring(newurl.lastIndexOf("/")+1);
                var idelement=`<span style="color:deeppink;margin:0 1vw">${acvid}>></span>`;
                if (location.pathname.indexOf("v") == 1) {
                    document.querySelector("#movie-player").innerHTML=idelement;
                    document.querySelector("#movie-player").style.height = "fit-content";
                    document.querySelector("#movie-player").align = "center";
                } else {
                    document.querySelector("#player").innerHTML=idelement;
                    document.querySelector("#player").align = "center";
                }
                acdata.forEach(function (item, r) {
                    var uhd = item.qualityLabel;
                    var ddiv = document.createElement("a");
                    ddiv.style.color = "#11AA11";
                    ddiv.style.font = "caption";
                    ddiv.style.margin = "0 2vw";
                    ddiv.id = "hls" + r;
                    ddiv.href = item.url;
                    ddiv.innerText = "#" + uhd;
                    ddiv.target = "_blank";
                    if (location.pathname.indexOf("v") == 1) {
                        document.querySelector("#movie-player").appendChild(ddiv);
                    } else {
                        document.querySelector("#player").appendChild(ddiv);
                    }
                });
            }
        }
        loop();
    }
})();