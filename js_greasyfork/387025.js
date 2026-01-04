// ==UserScript==
// @name         汽车之家论坛图片原图显示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  View Autohome Source Photo
// @author       Jack Yang
// @match        https://*.autoimg.cn/album/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387025/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/387025/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.indexOf("820_") > 0) {
        location.href = document.location.href.replace(/820_/, "");
    }
})();