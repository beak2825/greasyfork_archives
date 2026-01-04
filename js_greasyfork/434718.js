// ==UserScript==
// @name         Glamourdresser去滤镜
// @namespace    CheeseEco
// @version      0.2
// @description  去掉Glamourdresser的高斯模糊滤镜。
// @author       CheeseEco
// @match      https://www.glamourdresser.com/*
// @icon         https://www.google.com/s2/favicons?domain=glamourdresser.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434718/Glamourdresser%E5%8E%BB%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/434718/Glamourdresser%E5%8E%BB%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var len=document.getElementsByTagName("img").length;
    for(var i=0;i<len;i++){
        document.getElementsByTagName("img")[i].style.cssText += 'filter: none !important';
    }
})();