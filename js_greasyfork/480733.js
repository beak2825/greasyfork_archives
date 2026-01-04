// ==UserScript==
// @name         选中即复制，match对应需要执行的网站
// @namespace    none
// @version      0.1
// @description  不需要按ctrl+c，选中即复制，match对应需要执行的网站。
// @author       ljy
// @match        *://blog.51cto.com/*
// @icon         https://blog.51cto.com/favicon.ico
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/480733/%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6%EF%BC%8Cmatch%E5%AF%B9%E5%BA%94%E9%9C%80%E8%A6%81%E6%89%A7%E8%A1%8C%E7%9A%84%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/480733/%E9%80%89%E4%B8%AD%E5%8D%B3%E5%A4%8D%E5%88%B6%EF%BC%8Cmatch%E5%AF%B9%E5%BA%94%E9%9C%80%E8%A6%81%E6%89%A7%E8%A1%8C%E7%9A%84%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("mouseup", function (e) {
        let text = window.getSelection().toString()
        navigator.clipboard.writeText(text);
    });
})();