// ==UserScript==
// @name         bilibili禁止弹出弹幕点赞
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网页端弹幕点赞挺烦的，看不少人讨厌这个功能，就把自用脚本的相关部分上传一下
// @author       Yui
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420533/bilibili%E7%A6%81%E6%AD%A2%E5%BC%B9%E5%87%BA%E5%BC%B9%E5%B9%95%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/420533/bilibili%E7%A6%81%E6%AD%A2%E5%BC%B9%E5%87%BA%E5%BC%B9%E5%B9%95%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
function rm(){$('.bilibili-player-dm-tip-wrap').remove()}
function tt(){var a=document.getElementsByTagName("body")[0];var a2=document.createElement("a");a.appendChild(a2);a2.innerHTML='净<br>化'
a2.id='biliguna';a2.style.position = "fixed";a2.style.left = "0px";a2.style.top = "500px";a2.style.opacity=0.20;a2.onclick=rm;rm()};setTimeout(tt,3000)
})();