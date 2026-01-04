// ==UserScript==
// @name         ulearning自动挂机
// @version      0.3
// @description  为了2021习概网课
// @author       nku100
// @match        https://ua.ulearning.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/190286
// @downloadURL https://update.greasyfork.org/scripts/434034/ulearning%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/434034/ulearning%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function autoPlay() {
        var interval = setInterval(function () {
        var video = document.getElementsByTagName("video")[0];
        var play = document.getElementsByClassName("mejs__overlay-play")[0];
        var next_page_btn = document.getElementsByClassName("next-page-btn")[0];
        var continue_btn = document.getElementsByClassName("btn-submit")[0];
        //获取element
        if(continue_btn){
            continue_btn.click();
        }
        video.setMuted(true);
        if (video.getPaused()) {
            play.click();
        }
        if (video.duration - video.currentTime < 2) {
            next_page_btn.click();
        }
        }, 1000);
  }
    setTimeout(function () {
    try {
        autoPlay();
    } catch (e) {
        console.log(e);
    }
    }, 1000);
})();
