// ==UserScript==
// @name         移除播放前跳转
// @namespace    missav
// @version      2024-06-08
// @description  点击播放前总是打开新的标签页，此脚本移除跳转行为，可以直接播放
// @author       You
// @match        https://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/497419/%E7%A7%BB%E9%99%A4%E6%92%AD%E6%94%BE%E5%89%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/497419/%E7%A7%BB%E9%99%A4%E6%92%AD%E6%94%BE%E5%89%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function(){
        let tagetEle = document.querySelector(".plyr").parentNode;
        tagetEle.removeAttribute("@click")
        tagetEle.removeAttribute('@keyup.space.window');
    });
})();