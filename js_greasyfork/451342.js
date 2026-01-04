// ==UserScript==
// @name         E学
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  E学视频不暂停
// @author       You
// @match        https://elearning.tcsasac.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tcsasac.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451342/E%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/451342/E%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>{
        let play = document.querySelector(".vjs-icon-placeholder")
        if (play){
            play.click();
        }
        document.querySelector(".vjs-control-text").click();
        let video = document.querySelector("video");
        if (video && !video.name){
            video.muted = 'true';
            video.name = 'silence';
        }
    },3000)
})();