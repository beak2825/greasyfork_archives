// ==UserScript==
// @name         930mh自动回顶
// @namespace    hoothin
// @version      0.1
// @description  在亲亲漫画翻页浏览时自动返回页首
// @author       hoothin
// @match        http://www.930mh.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/34364/930mh%E8%87%AA%E5%8A%A8%E5%9B%9E%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/34364/930mh%E8%87%AA%E5%8A%A8%E5%9B%9E%E9%A1%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var next=document.querySelector(".img_land_next");
    if(next){
        next.addEventListener("click", function(){
            unsafeWindow.scrollTo(0, 0);
        });
    }
    var prev=document.querySelector(".img_land_prev");
    if(prev){
        prev.addEventListener("click", function(){
            unsafeWindow.scrollTo(0, 0);
        });
    }
})();