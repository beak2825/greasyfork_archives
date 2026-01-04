// ==UserScript==
// @name         芯参数解除限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏该网站的登陆提示以及移除模糊样式
// @author       icanye
// @match        https://www.xincanshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421299/%E8%8A%AF%E5%8F%82%E6%95%B0%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/421299/%E8%8A%AF%E5%8F%82%E6%95%B0%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".zheceng").remove();
    document.querySelector("[class*='denglutishi']").style.display="none";
    document.querySelectorAll(".paofenjietu").forEach(T=>T.style.filter="blur(0px)");
    document.querySelectorAll("#chart-wrapper").forEach(T=>T.style.filter="blur(0px)");
})();