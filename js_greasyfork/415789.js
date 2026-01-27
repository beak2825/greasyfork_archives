// ==UserScript==
// @name         🔥🔥🔥B站视频下载解析 - 2026 最新 - BILIBILI Download
// @namespace    https://peanutdl.com/zh/bilibili
// @version      1.0.7
// @description  快速解析B站视频，可直接下载MP4格式B站视频。
// @author       xbeibeix.com
// @match        https://www.bilibili.com/video/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415789/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E8%A7%A3%E6%9E%90%20-%202026%20%E6%9C%80%E6%96%B0%20-%20BILIBILI%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/415789/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E8%A7%A3%E6%9E%90%20-%202026%20%E6%9C%80%E6%96%B0%20-%20BILIBILI%20Download.meta.js
// ==/UserScript==

(function () {
    var style = document.createElement('style');
    style.innerHTML =`.custom-btn{width:130px;height:40px;color:#fff;border-radius:5px;padding:10px 25px;font-family:'Lato',sans-serif;font-weight:500;background:transparent;cursor:pointer;transition:all 0.3s ease;position:relative;display:inline-block;box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),7px 7px 20px 0px rgba(0,0,0,.1),4px 4px 5px 0px rgba(0,0,0,.1);outline:none;}.btn-3{background:rgb(0,172,238);background:linear-gradient(0deg,rgba(0,172,238,1) 0%,rgba(2,126,251,1) 100%);width:130px;height:40px;line-height:42px;padding:0;border:none;}.btn-3 span{position:relative;display:block;width:100%;height:100%;}.btn-3:before,.btn-3:after{position:absolute;content:"";right:0;top:0;background:rgba(2,126,251,1);transition:all 0.3s ease;}.btn-3:before{height:0%;width:2px;}.btn-3:after{width:0%;height:2px;}.btn-3:hover{background:transparent;box-shadow:none;}.btn-3:hover:before{height:100%;}.btn-3:hover:after{width:100%;}.btn-3 span:hover{color:rgba(2,126,251,1);}.btn-3 span:before,.btn-3 span:after{position:absolute;content:"";left:0;bottom:0;background:rgba(2,126,251,1);transition:all 0.3s ease;}.btn-3 span:before{width:2px;height:0%;}.btn-3 span:after{width:0%;height:2px;}.btn-3 span:hover:before{height:100%;}.btn-3 span:hover:after{width:100%;}`;
    document.head.appendChild(style);
    $("body").append('<div style="left: 10px;bottom: 10px;z-index: 9999;position: fixed;padding:5px;text-align:center;"><button class="custom-btn btn-3" id="go"><span>获取视频</span></button></div>');
    $("#go").click(function () {
        var patt1 = new RegExp("(BV|av)[a-zA-Z0-9]*"); var bvid = patt1.exec(window.location.href);
        var tempwindow = window.open("_blank");
        tempwindow.location = "https://peanutdl.com/zh/bilibili?monkey=" + bvid[0]
    })
})();
