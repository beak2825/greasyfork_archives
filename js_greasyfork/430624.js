// ==UserScript==
// @name         隐藏黑白直播弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏黑白直播弹幕; 画面占满空间；去除竞猜。
// @author       You
// @match        https://www.heibaizhibo.com/*
// @icon         https://www.google.com/s2/favicons?domain=segmentfault.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430624/%E9%9A%90%E8%97%8F%E9%BB%91%E7%99%BD%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/430624/%E9%9A%90%E8%97%8F%E9%BB%91%E7%99%BD%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("#live > div.boxright1").style.display = "none"
    document.querySelector("#livetop").style.marginRight = 0
    document.querySelector("#go-other > div.video-box > div:nth-child(3) > div.guessForm").style.display = "none"
})();