// ==UserScript==
// @name         Bilibili专栏点击头图获得头图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Dobby233Liu
// @match        https://www.bilibili.com/read/cv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378303/Bilibili%E4%B8%93%E6%A0%8F%E7%82%B9%E5%87%BB%E5%A4%B4%E5%9B%BE%E8%8E%B7%E5%BE%97%E5%A4%B4%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/378303/Bilibili%E4%B8%93%E6%A0%8F%E7%82%B9%E5%87%BB%E5%A4%B4%E5%9B%BE%E8%8E%B7%E5%BE%97%E5%A4%B4%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var thing = document.querySelectorAll(".banner-img-holder")[0];
    thing.onclick = function(e){
        e.preventDefault();
        window.open(window.original.banner_url);
    }
    thing.style.cursor = "pointer";
})();