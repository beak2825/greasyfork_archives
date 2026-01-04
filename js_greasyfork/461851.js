// ==UserScript==
// @name         隐藏 B 站直播间礼物栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏 B 站直播间礼物栏, 防止全屏时展示礼物栏
// @author       gjh
// @match        *://live.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461851/%E9%9A%90%E8%97%8F%20B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/461851/%E9%9A%90%E8%97%8F%20B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer
    var chenruiNMSL = function() {
        var giftBar = document.querySelector('#full-screen-interactive-wrap')
        if (giftBar != null) {
            giftBar.remove()
        }
        clearInterval(timer)
    }
    timer = setInterval(chenruiNMSL, 5000)
})();