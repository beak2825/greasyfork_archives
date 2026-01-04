// ==UserScript==
// @name         极客时间本地网页优化
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动展开极客时间本地网页的评论，并嵌入音频（需要开启允许访问文件网址）
// @author       You
// @match        file:///*/*
// @include      file:///*/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440823/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%9C%AC%E5%9C%B0%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440823/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E6%9C%AC%E5%9C%B0%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
     document.querySelectorAll("ul>li>div").forEach(e=>{
         var comment = e.children[1];
         if (comment.children[0] != undefined) {
             comment.style.display = "block";
         }
     });
    document.getElementsByTagName("base")[0].remove();
    var str = location.href;
    var arr = str.split("/");
    var file_path = arr[arr.length - 1];
    var mp3 = file_path.replace(".html", ".mp3");

    // 将audio添加到首部
    var audio = document.createElement("audio");
    audio.setAttribute("controls", "");
    audio.style.position = "relative";
    audio.style.top = "80px";
    audio.style.margin = "0 auto";
    audio.style.display = "block";
    audio.setAttribute("id", "mp3-player");

    var app = document.getElementById("app");
    app.insertBefore(audio, app.firstElementChild);
    // 添加MP3
    var sourceMp3 = document.createElement("source");
    sourceMp3.setAttribute("src", mp3);
    sourceMp3.setAttribute("type", "audio/mpeg");
    sourceMp3.autoplay=false;

    audio.appendChild(sourceMp3);
    audio.autoplay=false;

    document.title=document.querySelector("h1").innerText;
    // Your code here...
})();