// ==UserScript==
// @name         企鹅标注关灯
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  为了护眼，将网页背景设置为黑色。功能参考的https://github.com/slc3a2/dimmer
// @author       jiyao
// @match        https://qlabel.tencent.com/*
// @match        https://yuewen.cn/*
// @match        https://tencent.github.io/*
// @match        https://www.latexlive.com/
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520681/%E4%BC%81%E9%B9%85%E6%A0%87%E6%B3%A8%E5%85%B3%E7%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/520681/%E4%BC%81%E9%B9%85%E6%A0%87%E6%B3%A8%E5%85%B3%E7%81%AF.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';
    $("html").css({
        "filter": "invert(0.9) hue-rotate(180deg)",
        "transition": "filter 0.8s",
        "background-color": "#fff"
    });

     $("html img").each(function(){
         $(this).css({
             "filter": "invert(100) hue-rotate(180deg)",
             "transition": "filter 0.8s",
             "background-color": "#fff"
         });
     });

    $("html video").each(function(){
         $(this).css({
             "filter": "invert(100) hue-rotate(180deg)",
             "transition": "filter 0.8s",
             "background-color": "#fff"
         });
     });
})();