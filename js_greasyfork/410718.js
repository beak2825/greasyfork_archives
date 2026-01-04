// ==UserScript==
// @name         微信公众号文章全屏显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mp.weixin.qq.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410718/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/410718/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dom1 = document.getElementsByClassName("qr_code_pc")[0];
    var dom2 = document.getElementsByClassName("rich_media_area_primary_inner")[0];
    dom1.parentNode.removeChild(dom1);
     dom2.classList.remove("rich_media_area_primary_inner");
    // Your code here...
})();