// ==UserScript==
// @name         去除TX视频水印
// @namespace    https://greasyfork.org/zh-CN/users/727363
// @version      0.2
// @description  新版TX视频在线播放功能去除水印
// @author       Zihao
// @icon         https://v.qq.com/favicon.ico
// @match        http*://v.qq.com/*
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/445428/%E5%8E%BB%E9%99%A4TX%E8%A7%86%E9%A2%91%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/445428/%E5%8E%BB%E9%99%A4TX%E8%A7%86%E9%A2%91%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    setTimeout(function (){
        document.querySelector('.txp-watermark').style.display='none';
        console.log("已去除腾讯视频水印");
    },1000 );
})();