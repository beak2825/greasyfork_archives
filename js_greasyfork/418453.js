// ==UserScript==
// @name         bilibili_jumper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @description  bilibili播放完视频后的5秒跳转让我等的郁闷，本脚本可以直接取消，方便你看完视频就点赞。
// @downloadURL https://update.greasyfork.org/scripts/418453/bilibili_jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/418453/bilibili_jumper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
       var md=$("video:nth-child(1)")[0]
       md.addEventListener("ended",function(){         document.getElementsByClassName("bilibili-player-electric-panel-jump-content")[0].click();    })
    }, 10000);
    /*$(document).ready(function () {
      var md=$("video:nth-child(1)")[0]
      md.addEventListener("ended",function(){         document.getElementsByClassName("bilibili-player-electric-panel-jump-content")[0].click();    })
    })*/

    // Your code here...
})();