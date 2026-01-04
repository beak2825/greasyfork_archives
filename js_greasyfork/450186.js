// ==UserScript==
// @name         慕课视频 网页全屏 画中画
// @namespace    https://github.com/maxmiku
// @version      0.1
// @description  此插件可以为慕课视频播放页的右上角添加 “画中画” 和 “网页全屏” 按钮,以实现视频画中画播放以及网页全屏功能.
// @author       MaxMiku
// @match        https://www.icourse163.org/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icourse163.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450186/%E6%85%95%E8%AF%BE%E8%A7%86%E9%A2%91%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%20%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/450186/%E6%85%95%E8%AF%BE%E8%A7%86%E9%A2%91%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%20%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let button = document.createElement("button");
    button.id="exp1";
    button.innerHTML="画中画";
    button.onclick=fastVedio;
    button.style="top:0;left:0px;position:fixed;z-index:9999;";
    document.body.append(button);

    let button1 = document.createElement("button");
    button1.id="exp2";
    button1.innerHTML="网页全屏";
    button1.onclick=fullVedio;
    button1.style="top:0;left:40px;position:fixed;z-index:9999;";
    document.body.append(button1);

    console.log("提前结束视频控件加载完成");
    function fastVedio(){
        document.querySelector("video").requestPictureInPicture();
    }
    function fullVedio(){
        let divm=document.querySelector(".mooc-video-player");
        divm.style.position="fixed";
        divm.style.top="0px";divm.style.left="0px";divm.style.height="100vh";divm.style.width="100vw";divm.style.zIndex="10000";
        let a1=document.querySelector(".m-nav-container");
        a1.style.visibility="hidden";
        a1=document.querySelector("#j-activityBanner");
        a1.style.visibility="hidden";
        a1=document.querySelector("#exp1");
        a1.style.visibility="hidden";
        a1=document.querySelector("#exp2");
        a1.style.visibility="hidden";
        document.querySelector("html").style.overflow="hidden";
        document.querySelector(".j-bigplaybtn").style.opacity=0;
    }
    // Your code here...
})();