// ==UserScript==
// @name         隐藏生意参谋淘宝后台水印
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  隐藏淘宝后台店铺水印，包含退款页面，申诉页面，生意参谋
// @author       yuensui
// @match        https://sycm.taobao.com/*
// @match        https://myseller.taobao.com/home.htm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497037/%E9%9A%90%E8%97%8F%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E6%B7%98%E5%AE%9D%E5%90%8E%E5%8F%B0%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/497037/%E9%9A%90%E8%97%8F%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E6%B7%98%E5%AE%9D%E5%90%8E%E5%8F%B0%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 隐藏退款页面水印
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'watermark-container { visibility: hidden !important;}';
    document.getElementsByTagName('head')[0].appendChild(style);
    // 隐藏申诉页面水印
   var theHead = document.head || document.getElementsByTagName('head')[0];
   style.appendChild(document.createTextNode('#water-marker-container{background-image:none !important;background-attachment:scroll;background-position-x:0;background-position-y:0;background-repeat:repeat;color:transparent;background-clip:text}'));
   theHead.appendChild(style);
    //隐藏生意参谋页面水印
   style.appendChild(document.createTextNode('#yd-watermark-gs7o69{background-image:none !important;background-attachment:scroll;background-position-x:0;background-position-y:0;background-repeat:repeat;color:transparent;background-clip:text}'));
   theHead.appendChild(style);
})();