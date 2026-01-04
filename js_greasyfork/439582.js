// ==UserScript==
// @name         bilibili  获取时间戳URL，以便对照视频记录文字内容
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  按 t 就能复制带时间戳的 URL的 markdown连接了
// @author       不知名网友
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439582/bilibili%20%20%E8%8E%B7%E5%8F%96%E6%97%B6%E9%97%B4%E6%88%B3URL%EF%BC%8C%E4%BB%A5%E4%BE%BF%E5%AF%B9%E7%85%A7%E8%A7%86%E9%A2%91%E8%AE%B0%E5%BD%95%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/439582/bilibili%20%20%E8%8E%B7%E5%8F%96%E6%97%B6%E9%97%B4%E6%88%B3URL%EF%BC%8C%E4%BB%A5%E4%BE%BF%E5%AF%B9%E7%85%A7%E8%A7%86%E9%A2%91%E8%AE%B0%E5%BD%95%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keypress', function(e){
        console.log(e);
        if(e.keyCode === 116) {
            e.preventDefault();
            console.log(e.target.value);
            var time = document.querySelectorAll('.bilibili-player-video-time-now')[0].innerHTML;
            var timeYMSArr=time.split(':');
            var joinTimeStr='00h00m00s';
            if(timeYMSArr.length===3){
                 joinTimeStr=timeYMSArr[0]+'h'+timeYMSArr[1]+'m'+timeYMSArr[2]+'s';
            }else if(timeYMSArr.length===2){
                 joinTimeStr=timeYMSArr[0]+'m'+timeYMSArr[1]+'s';
            }
            var burl = window.location.href;
            burl= burl.split('?')[0]+'?t=';
            if (navigator.clipboard) {
                navigator.clipboard.writeText('[xxx]('+burl+joinTimeStr+')');
            }
        }
    })
    // Your code here...
})();
