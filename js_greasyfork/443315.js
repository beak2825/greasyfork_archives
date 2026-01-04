// ==UserScript==
// @name         饭团影视去除底部广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  饭团影视pc网站去除底部广告
// @author       Levan
// @match        https://fantuan.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantuan.tv
// @grant        Levan
// @downloadURL https://update.greasyfork.org/scripts/443315/%E9%A5%AD%E5%9B%A2%E5%BD%B1%E8%A7%86%E5%8E%BB%E9%99%A4%E5%BA%95%E9%83%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/443315/%E9%A5%AD%E5%9B%A2%E5%BD%B1%E8%A7%86%E5%8E%BB%E9%99%A4%E5%BA%95%E9%83%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     $('.none').empty();
    setTimeout(()=>{
        $('#note').css('display','none');
    }, 1100);
})();