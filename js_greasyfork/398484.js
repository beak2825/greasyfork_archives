// ==UserScript==
// @name          优课联盟uooc助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://cce.org.uooconline.com/home/learn/*
// @match        *://www.uooc.net.cn/home/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398484/%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9Fuooc%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398484/%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9Fuooc%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

//初始化
    function init() {
        document.getElementsByTagName('video')[0].volume = 0;
        document.getElementsByTagName('video')[0].playbackRate = 10;
        setInterval(function () {
            document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-paused')[0].click();
        }, 1000);
    }

    setTimeout(init, 1000);

   


})();
