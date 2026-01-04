// ==UserScript==
// @name         隐藏 B 站直播间全部礼物栏（包括全屏非全屏）
// @namespace    
// @version      1.0
// @description  现有脚本都只能隐藏全屏礼物栏，故重写了一个隐藏所有礼物的，如果要送礼，手动关闭脚本即可
// @author       rain
// @match        *://live.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522679/%E9%9A%90%E8%97%8F%20B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%85%A8%E9%83%A8%E7%A4%BC%E7%89%A9%E6%A0%8F%EF%BC%88%E5%8C%85%E6%8B%AC%E5%85%A8%E5%B1%8F%E9%9D%9E%E5%85%A8%E5%B1%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522679/%E9%9A%90%E8%97%8F%20B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%85%A8%E9%83%A8%E7%A4%BC%E7%89%A9%E6%A0%8F%EF%BC%88%E5%8C%85%E6%8B%AC%E5%85%A8%E5%B1%8F%E9%9D%9E%E5%85%A8%E5%B1%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer
    var block1 = function() {
        var giftBarFullScreen = document.querySelector('#full-screen-interactive-wrap')
        if (giftBarFullScreen != null) {
            giftBarFullScreen.remove()
        }
        var giftItems = document.querySelectorAll('.gift-item');
        giftItems.forEach(function(giftItem) {
            if (giftItem.className.includes('gift-id')) {
                giftItem.remove();
            }
        });

        clearInterval(timer)
    }
    timer = setInterval(block1, 5000)
})();