// ==UserScript==
// @name         网易云音乐歌单封面图快速提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击封面图即可
// @author       ZeroingIn
// @match        https://music.163.com/*
// @icon         https://www.google.com/s2/favicons?domain=163.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427660/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E5%8D%95%E5%B0%81%E9%9D%A2%E5%9B%BE%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427660/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%AD%8C%E5%8D%95%E5%B0%81%E9%9D%A2%E5%9B%BE%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        // 获取图片标签
        const images = document.querySelectorAll(".u-cover-dj img")
        const imgOuterHTML = images[0].outerHTML
        // 获取封面图url并去除缩略图参数
        const imgSrc = (images[0].src).split('?')[0]
        // 给封面图加上点击在新窗口打开封面图的功能
        document.querySelector('.msk').outerHTML=`<a href="${imgSrc}" target="_blank" class="msk"></a>`
    }, false);
})();