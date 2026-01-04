// ==UserScript==
// @name         Bilibili直播去除弹幕栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove right content of live in bilibili.
// @author       Aiemu
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402591/Bilibili%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%99%A4%E5%BC%B9%E5%B9%95%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/402591/Bilibili%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%99%A4%E5%BC%B9%E5%B9%95%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var del = document.getElementById("aside-area-vm").remove();
    var main = document.getElementsByClassName("player-ctnr left-container p-relative z-player-ctnr");
    main[0].style.cssText = "width: 86%; margin-left: 7%;";
})();