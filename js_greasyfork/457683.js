// ==UserScript==
// @name         适配surface屏幕尺寸的哔咔漫画网站脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将surface go2适配了哔咔漫画，理论上可以自己调参数修改width的百分比
// @author       Le_le
// @run-at document-end
// @match        https://manhuabika.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuabika.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457683/%E9%80%82%E9%85%8Dsurface%E5%B1%8F%E5%B9%95%E5%B0%BA%E5%AF%B8%E7%9A%84%E5%93%94%E5%92%94%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457683/%E9%80%82%E9%85%8Dsurface%E5%B1%8F%E5%B9%95%E5%B0%BA%E5%AF%B8%E7%9A%84%E5%93%94%E5%92%94%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var bd;
    bd=document.getElementsByTagName("body")[0];
    //修改@media screen and (min-width: 1000px)的样式
    var style=document.createElement("style");
    style.innerHTML="@media screen and (max-width: 1000px){.modeset{width: 80%;}}";
    bd.appendChild(style);
    console.log("适配surface屏幕尺寸的哔咔漫画网站脚本已加载");
    
})();