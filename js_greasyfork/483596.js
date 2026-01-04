// ==UserScript==
// @name         steam创意工坊模糊化图片显示 Wallpaper Engine：壁纸引擎
// @namespace    
// @version      2024-01-01
// @description  steam创意工坊 Wallpaper Engine：壁纸引擎 18+ 模糊化图片显示 前提是你能看到18+内容 ；
// @author       yydy777
// @match       *://steamcommunity.com/*
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/483596/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E6%A8%A1%E7%B3%8A%E5%8C%96%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%20Wallpaper%20Engine%EF%BC%9A%E5%A3%81%E7%BA%B8%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/483596/steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E6%A8%A1%E7%B3%8A%E5%8C%96%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%20Wallpaper%20Engine%EF%BC%9A%E5%A3%81%E7%BA%B8%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll(".ugc.has_adult_content");

    Array.from(elements).forEach(function(element) {
        element.classList.remove("has_adult_content");
    });

})();