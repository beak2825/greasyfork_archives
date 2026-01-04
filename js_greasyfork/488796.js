// ==UserScript==
// @name         300英雄分区取消马赛克
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove mosaic from web player
// @author       红鲤
// @match           https://live.bilibili.com/
// @match           *://live.bilibili.com/*
// @match           *://live.bilibili.com/1*
// @match           *://live.bilibili.com/2*
// @match           *://live.bilibili.com/3*
// @match           *://live.bilibili.com/4*
// @match           *://live.bilibili.com/5*
// @match           *://live.bilibili.com/6*
// @match           *://live.bilibili.com/7*
// @match           *://live.bilibili.com/8*
// @match           *://live.bilibili.com/9*
// @match           *://live.bilibili.com/blanc/1*
// @match           *://live.bilibili.com/blanc/2*
// @match           *://live.bilibili.com/blanc/3*
// @match           *://live.bilibili.com/blanc/4*
// @match           *://live.bilibili.com/blanc/5*
// @match           *://live.bilibili.com/blanc/6*
// @match           *://live.bilibili.com/blanc/7*
// @match           *://live.bilibili.com/blanc/8*
// @match           *://live.bilibili.com/blanc/9*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488796/300%E8%8B%B1%E9%9B%84%E5%88%86%E5%8C%BA%E5%8F%96%E6%B6%88%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488796/300%E8%8B%B1%E9%9B%84%E5%88%86%E5%8C%BA%E5%8F%96%E6%B6%88%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.onload = function() {
        setTimeout(function() {
            var mosaic = document.querySelector('.web-player-module-area-mask');
            if (mosaic) {
                mosaic.style.left = '1000%';
            }
        }, 5000);  // 5 seconds delay
    };
})();