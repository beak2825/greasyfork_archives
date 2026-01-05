// ==UserScript==
// @name         NGA新标签打开帖子
// @namespace    undefined
// @version      0.7
// @description  让NGA论坛点击帖子可以打开新标签
// @author       法爷
// @match        *://*.ngacn.cc/*
// @match        *://*.nga.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28867/NGA%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/28867/NGA%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('a.topic').forEach(item => item.setAttribute('target','_blank'));
})();