// ==UserScript==
// @name         B站复制粘贴去掉小尾巴
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除B站文字复制粘贴后带有作者、链接和出处的小尾巴
// @author       Ink
// @match        *.bilibili.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438078/B%E7%AB%99%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8E%BB%E6%8E%89%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/438078/B%E7%AB%99%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8E%BB%E6%8E%89%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll('*')].forEach(item=>{
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    });
})();
