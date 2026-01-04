// ==UserScript==
// @name         在标签页的右边打开所有链接
// @namespace    https://greasyfork.org/zh-CN/scripts/462069-%E5%9C%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%9A%84%E5%8F%B3%E8%BE%B9%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5
// @version      1.1
// @description  Open all links in new tab to the right，一个完全由chatgpt编写的脚本，任何人都可通过chatgpt维护该脚本。
// @license MIT
// @author       chatgpt
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462069/%E5%9C%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%9A%84%E5%8F%B3%E8%BE%B9%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/462069/%E5%9C%A8%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%9A%84%E5%8F%B3%E8%BE%B9%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        if (link.href.startsWith("javascript:")) {
            continue; // skip javascript links
        }
        link.addEventListener("click", function(event) {
            event.preventDefault();
            let newTab = window.open();
            newTab.opener = null;
            newTab.location.href = link.href;
            newTab.blur();
            window.focus();
        });
    }
})();