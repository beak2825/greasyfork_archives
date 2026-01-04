// ==UserScript==
// @name         Ex_蒜法编程
// @namespace    http://tampermonkey.net/
// @version      2024-03-24.3
// @description  Make your OJ more special!
// @author       _xEr_
// @match        *://120.27.108.47/*
// @icon         https://cdn.luogu.com.cn/upload/image_hosting/svtp31z5.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490718/Ex_%E8%92%9C%E6%B3%95%E7%BC%96%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490718/Ex_%E8%92%9C%E6%B3%95%E7%BC%96%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    var s = '<div style="margin: 12.5px ; font-size: 1.3em; font-weight: 600; ">蒜法编程</div>';
    var w = document.querySelector('#menu > div > div > ol.nav__list.nav__list--main.clearfix > li:nth-child(1) > a');
    w.innerHTML=s;

    if(window.location.pathname=='/'){
        s = '<p style="font-weight: 600; color: green;">首页</p>';
        w = document.querySelector('#menu > div > div > ol.nav__list.nav__list--main.clearfix > li:nth-child(2) > a');
    }
    w.innerHTML=s;
    // 
})();