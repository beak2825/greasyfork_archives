// ==UserScript==
// @name         当前页打开
// @namespace    https://rachpt.cn/
// @version      0.0.1
// @description  B站当前页面打开, 用于
// @author       rachpt
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475506/%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/475506/%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('a').forEach(i=>i.setAttribute("target","_self"))
})();