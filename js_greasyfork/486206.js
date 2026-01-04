// ==UserScript==
// @name        1kkk.com 界面优化
// @namespace   1kkk Scripts
// @match       *://*.1kkk.com/*
// @grant       none
// @version     1.1
// @author      忙里偷闲
// @license MIT
// @description 2024/2/1 下午3:28:16
// @downloadURL https://update.greasyfork.org/scripts/486206/1kkkcom%20%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486206/1kkkcom%20%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function () {
    'use strict';
    window.onload = setInterval(() => {
       $(".view-comment").remove();
       $("#lb-win").remove();

    }, 1000);
    window.onscroll = () => {
       $("#lb-win").remove();
        $(".view-comment").remove();
    }
})();