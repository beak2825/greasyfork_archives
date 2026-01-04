// ==UserScript==
// @name         禁用F1帮助窗口
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  chrome、edge等浏览器中F1会弹出帮助窗口，经常会误触，故禁用所有页面中的F1快捷键
// @author       forcier
// @match        *://*/*
// @license      MIT
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459524/%E7%A6%81%E7%94%A8F1%E5%B8%AE%E5%8A%A9%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/459524/%E7%A6%81%E7%94%A8F1%E5%B8%AE%E5%8A%A9%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==
(function () {
    "use strict";
    document.addEventListener("keydown", function (e) {
        "F1" == e.key && e.preventDefault();
    });
})();
