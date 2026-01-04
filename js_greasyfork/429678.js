// ==UserScript==
// @name        博客园代码字体大小设置 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Monn
// @description 2021/7/21上午10:26:31
// 博客园字体大小
// @downloadURL https://update.greasyfork.org/scripts/429678/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/429678/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==
(function () {
   // 'use strict';
    var pre = $(".cnblogs_code pre");
    var span = $(".cnblogs_code span");
    var p = $(".cnblogs_code p");
    pre.css("cssText", 'font-family: Courier New!important;font-size: 15px!important;word-wrap: break-word;white-space: pre-wrap;'
    );
    span.css("cssText",
        'font-family: Courier New !important;font-size: 15px!important;line-height: "1.5!important;'
    );
    p.css("cssText",
        'font-family: Courier New !important;font-size: 15px!important;line-height: "1.5!important;'
    );
    // Your code here...
})();