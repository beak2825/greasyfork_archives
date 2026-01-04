// ==UserScript==
// @name         关闭B站评论区
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭B站所有视频底下的评论区
// @author       空指针
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451753/%E5%85%B3%E9%97%ADB%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/451753/%E5%85%B3%E9%97%ADB%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==
var run
(function() {
    'use strict';
    run = setInterval(
        removeReply,500
    )
    removeReply();
})();

function removeReply(){
    var reply = document.getElementsByClassName("reply-warp")[0];
    var nav = document.getElementsByClassName("nav-bar")[0];
    if(reply == undefined){
     return;
    }
    clearInterval(run);
    reply.remove();
    nav.innerHTML = '<span style="font-size: 20px;font-weight: 600;" >评论关闭捏，好好享受视频吧😋</span>';
}