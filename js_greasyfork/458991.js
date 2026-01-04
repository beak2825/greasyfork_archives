// ==UserScript==
// @name         去除wiki百科引用上标
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除wiki百科引用上标 js小白自用 配合自动朗读
// @author       iSocr
// @match        *://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @copyright    iSocr 2023-01-28
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/458991/%E5%8E%BB%E9%99%A4wiki%E7%99%BE%E7%A7%91%E5%BC%95%E7%94%A8%E4%B8%8A%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/458991/%E5%8E%BB%E9%99%A4wiki%E7%99%BE%E7%A7%91%E5%BC%95%E7%94%A8%E4%B8%8A%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
var supTags = document.querySelectorAll("sup");
for (var i = 0; i < supTags.length; i++) {supTags[i].remove();}
})();