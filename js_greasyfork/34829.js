// ==UserScript==
// @name         V2EX新标签打开帖子
// @namespace    undefined
// @version      0.77
// @description  让V2EX论坛点击帖子可以打开新标签
// @author       法爷
// @match        *://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34829/V2EX%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/34829/V2EX%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('a').forEach(item => {
        if(/^\/t\/\d+/.test(item.pathname)||/^\/member\//.test(item.pathname)) {
            item.setAttribute('target','_blank');
        }
    });
})();