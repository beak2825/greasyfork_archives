// ==UserScript==
// @name         YouTube评论精选固定
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTube评论区精选滚动条
// @author       Aoki
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480837/YouTube%E8%AF%84%E8%AE%BA%E7%B2%BE%E9%80%89%E5%9B%BA%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/480837/YouTube%E8%AF%84%E8%AE%BA%E7%B2%BE%E9%80%89%E5%9B%BA%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    var css = '{display:none !important;height:0 !important}';
    css += '::-webkit-scrollbar-thumb{background-color: #888;border-radius: 4px;}';
    css += '::-webkit-scrollbar-thumb:hover{background-color: #555;}';
    css += '::-webkit-scrollbar-track{background-color: #f5f5f5;}';
    css += '::-webkit-scrollbar-track:hover{background-color: #ddd;}';
    css += '#sections{overflow: scroll;height: 70rem;}';
    css += '#secondary{overflow: scroll;height: 80rem;}';
    css += '::-webkit-scrollbar{width: 8px;background-color: #f5f5f5;}';

    loadStyle(css)
    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
})();
