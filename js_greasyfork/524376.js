// ==UserScript==
// @name         霹雳霹雳内部直播去水印
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  内部直播去水印
// @author       TGSAN
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524376/%E9%9C%B9%E9%9B%B3%E9%9C%B9%E9%9B%B3%E5%86%85%E9%83%A8%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/524376/%E9%9C%B9%E9%9B%B3%E9%9C%B9%E9%9B%B3%E5%86%85%E9%83%A8%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function () {
        const style = document.createElement('style');
        style.innerHTML = ".live-player-ctnr #web-player__bottom-bar__container + div, .live-player-ctnr video + div { display: none !important; }";
        document.getElementsByTagName('head')[0].appendChild(style);
    });
})();