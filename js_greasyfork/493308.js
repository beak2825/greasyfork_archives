// ==UserScript==
// @name         926.tv 刪除浮水印、解決進度條遮擋影片
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  刪除浮水印、解決進度條遮擋影片
// @match        *://play.926.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=926.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493308/926tv%20%E5%88%AA%E9%99%A4%E6%B5%AE%E6%B0%B4%E5%8D%B0%E3%80%81%E8%A7%A3%E6%B1%BA%E9%80%B2%E5%BA%A6%E6%A2%9D%E9%81%AE%E6%93%8B%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/493308/926tv%20%E5%88%AA%E9%99%A4%E6%B5%AE%E6%B0%B4%E5%8D%B0%E3%80%81%E8%A7%A3%E6%B1%BA%E9%80%B2%E5%BA%A6%E6%A2%9D%E9%81%AE%E6%93%8B%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.wzhref').remove();
    document.querySelector('#a1').style.height = "80%";
    let interval = setInterval(() => {
        if (document.querySelector('video')) {
            document.querySelector('video').style.height = "calc(100% - 45px)"
            clearInterval(interval);
        }
    }, 100)
})();