// ==UserScript==
// @name         bilibili专栏去不能选择
// @namespace    http://blog.gfdsa.net/
// @version      0.1
// @description  让专栏文章可以选择文字
// @author       youxiachai
// @match        *://*.bilibili.com/read/*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/382522/bilibili%E4%B8%93%E6%A0%8F%E5%8E%BB%E4%B8%8D%E8%83%BD%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/382522/bilibili%E4%B8%93%E6%A0%8F%E5%8E%BB%E4%B8%8D%E8%83%BD%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

var docElements = unsafeWindow.document.querySelectorAll(".unable-reprint")
var i = 0

function removeForce() {
    'use strict';
     for (var unableReprint of docElements) {
         unableReprint.classList.remove("unable-reprint")
     }
}

function revertAll() {
    'use strict';
     for (var reprint of docElements) {
         reprint.classList.add("unable-reprint")
     }
}

GM_registerMenuCommand("可以选择文字", removeForce, '', '', 'j');
GM_registerMenuCommand("不可以选择文字", revertAll, '', '', 'j');