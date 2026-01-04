
// ==UserScript==
// @name         DF BILIBILI VIDEO
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  pure video watching experience on bilibili.
// @author       Haiyang Wang
// @match        https://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/452343/DF%20BILIBILI%20VIDEO.user.js
// @updateURL https://update.greasyfork.org/scripts/452343/DF%20BILIBILI%20VIDEO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".right-container-inner").style.display="none";
    document.querySelector(".video-toolbar-v1").style.display="none";
    document.querySelector(".left-container-under-player").style.display="none";
    document.querySelector(".bili-header fixed-header").style.display="none";
    document.querySelector("bilibili-player-placeholder-bottom").style.display="none";
    //document.querySelector(".").style.display="none";

})();
