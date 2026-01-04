// ==UserScript==
// @name         去除模糊效果
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  仅仅针对https://bddxg.top/这个博客，因为是spa页面，所以进入别的页面你需要刷新一下才可以解除模糊效果
// @author       小废物
// @match        https://bddxg.top/article/*
// @match        https://bddxg.top/article/collect/%E6%94%B6%E9%9B%86%E7%AE%B1.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bddxg.top
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466572/%E5%8E%BB%E9%99%A4%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/466572/%E5%8E%BB%E9%99%A4%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(() => {
      var lines = document.getElementsByClassName("line");
        for (var i = 0; i < lines.length; i++) {
            lines[i].classList.add("has-focus");
        }

   }, 3000)
})();

