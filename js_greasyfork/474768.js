// ==UserScript==
// @name         在新标签页打开链接
// @namespace    yournamespace
// @version      1.0
// @description  将所有链接在新标签页中打开
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474768/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474768/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    function openLinksInNewTab() {
        var links = document.links;
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute('target', '_blank');
        }
    }

    openLinksInNewTab();
})();