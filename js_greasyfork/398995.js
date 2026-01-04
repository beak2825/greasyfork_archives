// ==UserScript==
// @name         FuckingTest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Wangxin
// @match        http://www.uooconline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398995/FuckingTest.user.js
// @updateURL https://update.greasyfork.org/scripts/398995/FuckingTest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function init() {
        document.getElementsByTagName('video')[0].volume = 0;
        document.getElementsByTagName('video')[0].playbackRate = 2;
        setInterval(function () {
        var videoButton = document.getElementsByClassName("vjs-big-play-button animated fadeIn")[0];
        videoButton.click()
    },1000);
    }

    setTimeout(init, 1000);




})();