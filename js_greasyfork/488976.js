// ==UserScript==
// @name        去除b站炉石马赛克
// @namespace   com.xky.userscript
// @match       https://live.bilibili.com/*
// @grant       none
// @version     1.0
// @author      xky
// @description 去除b站炉石马赛克。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488976/%E5%8E%BB%E9%99%A4b%E7%AB%99%E7%82%89%E7%9F%B3%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488976/%E5%8E%BB%E9%99%A4b%E7%AB%99%E7%82%89%E7%9F%B3%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==


{
    setTimeout(() => {
        const mask = document.getElementById('web-player-module-area-mask-panel');
        mask.style.display='none';
    }, 2000)
}
