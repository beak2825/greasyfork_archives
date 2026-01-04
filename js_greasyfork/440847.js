// ==UserScript==
// @name         极客时间本地网页优化
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动展开极客时间本地网页的评论，并嵌入音频（需要开启允许访问文件网址）
// @author       You
// @match        file:///*/*
// @include      file:///*/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440847/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%9C%AC%E5%9C%B0%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440847/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%9C%AC%E5%9C%B0%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
     document.querySelectorAll("ul>li>div").forEach(e=>{
         var divs = e.getElementsByTagName("div");
         for (let div of divs) {
             div.style.display = "block";
         }
     });
    document.getElementsByTagName("base")[0].remove();
    var str = location.href;
    var arr = str.split("/");
    var file_path = arr[arr.length - 1];
    var mp3 = file_path.replace(".html", ".mp3");
    var m4a = file_path.replace(".html", ".m4a");

    // 将audio添加到首部
    var audio = document.createElement("audio");
    audio.volume=0.2;
    audio.setAttribute("controls", "");
    audio.style.position = "sticky";
    audio.style.top = "80px";
    //audio.style.margin = "0 auto";
    audio.style.display = "block";
    audio.setAttribute("id", "mp3-player");

    var app = document.getElementById("app");
    app.insertBefore(audio, app.firstElementChild);
    // 添加MP3
    var sourceMp3 = document.createElement("source");
    sourceMp3.setAttribute("src", mp3);
    sourceMp3.setAttribute("type", "audio/mpeg");
    sourceMp3.autoplay=false;
    // 添加M4a
    var sourceM4a = document.createElement("source");
    sourceM4a.setAttribute("src", m4a);
    sourceM4a.setAttribute("type", "audio/mpeg");
    sourceM4a.autoplay=false;

    audio.appendChild(sourceMp3);
    audio.appendChild(sourceM4a);
    audio.autoplay=false;

    // 解除复制限制
    var eles = document.getElementsByTagName('*');
    for (var i=0; i < eles.length; i++){
        eles[i].style.userSelect = 'text';
    }

    document.title=document.querySelector("h1").innerText;
})();