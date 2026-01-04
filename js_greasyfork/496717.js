// ==UserScript==
// @name         fixed github wiki sidebar
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  固定GitHub wiki 页面的sidebar 方便阅读跳转
// @author       Mrxn
// @homepage     https://mrxn.net/
// @match        https://github.com/*/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @icon         https://github.githubassets.com/favicons/favicon.png
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496717/fixed%20github%20wiki%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/496717/fixed%20github%20wiki%20sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.addEventListener("scroll", function() {
    var sidebar = document.querySelector("#wiki-content > div > div.Layout-sidebar");

    if (sidebar) {
        sidebar.style.position = "fixed";
        sidebar.style.top = "1px";
        sidebar.style.right = "0px";
        sidebar.style.width = "300px";
        sidebar.style.height = "100%";
        sidebar.style.overflowY = "auto";
    }
});
})();