// ==UserScript==
// @name         异世界动漫进度条隐藏
// @namespace    http://tampermonkey.net/
// @version      2024-03-18
// @description  异世界动漫进度条隐藏（仅适用bf.mmiku.net域名的播放器）
// @author       wanara
// @run-at       document-idle
// @match        https://bf.mmiku.net/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lldm.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490200/%E5%BC%82%E4%B8%96%E7%95%8C%E5%8A%A8%E6%BC%AB%E8%BF%9B%E5%BA%A6%E6%9D%A1%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/490200/%E5%BC%82%E4%B8%96%E7%95%8C%E5%8A%A8%E6%BC%AB%E8%BF%9B%E5%BA%A6%E6%9D%A1%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            setTimeout(() => {
                console.log(document.querySelector(".art-layer"));
                document.querySelector(".art-layer").remove();
            }, 3000);
        }
    }
})();