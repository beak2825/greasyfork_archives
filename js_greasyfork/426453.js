// ==UserScript==
// @name         b站显示原图(lchzh ver.)
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  查看b站图片时自动去除webp等后缀
// @author       lchzh3473
// @match        *://*.hdslb.com/*@*
// @match        *://*.biliimg.com/*@*
// @icon         https://app.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426453/b%E7%AB%99%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE%28lchzh%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426453/b%E7%AB%99%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE%28lchzh%20ver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.href=location.href.replace(/@(((\d+)[WHSEPQOCwhsepqoc]|progressive|!(web-article-pic|web-space-index-myvideo))_?)*(\.(|webp|gif|png|jpg|jpeg|avif))?$/,"");
})();