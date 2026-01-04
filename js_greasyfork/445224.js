// ==UserScript==
// @name         中小学音乐教材音频下载
// @namespace    rymusic.taozhiyu.gitee.io
// @version      0.1
// @description  点击播放，右键下载
// @author       涛之雨
// @match        https://www.rymusic.art/*
// @icon         https://www.rymusic.art/k12/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445224/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E9%9F%B3%E4%B9%90%E6%95%99%E6%9D%90%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445224/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E9%9F%B3%E4%B9%90%E6%95%99%E6%9D%90%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
!function() {
    "use strict";
    window.oncontextmenu = function(e){
        e.preventDefault();
        var t = document.querySelector("#music-audio");
        t && function(e, t) {
            var n = document.createElement("a");
            n.href = e;
            n.setAttribute("download", t);
            n.style.display = "none";
            document.body.appendChild(n);
            n.click();
            document.body.removeChild(n);
        }(t.src, document.querySelector(".ant-modal-title").innerText);
    };
}();