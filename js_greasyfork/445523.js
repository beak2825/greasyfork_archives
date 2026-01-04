// ==UserScript==
// @name         TikTok网页自动播放
// @namespace    无
// @version      0.1
// @description  TikTok自动播放
// @author       Annie
// @match        https://www.tiktok.com/*
// @icon         https://www.tiktok.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445523/TikTok%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/445523/TikTok%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = f;
    function f() {
        var setInt = setInterval(function(){
            var DYvideo = document.querySelector("video");
            if(DYvideo){
                if(DYvideo.ended){
                    var element = document.getElementsByClassName("tiktok-2xqv0y-ButtonBasicButtonContainer-StyledVideoSwitchV2")[0];
                    if (element) element.click();
                }
            }
        },1)
    }
})();