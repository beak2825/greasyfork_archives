// ==UserScript==
// @name         bilibili专栏去unable-reprint
// @namespace    https://dobby233liu.github.io
// @version      0.2
// @description  f it off
// @author       Dobby233Liu
// @match        *://*.bilibili.com/read/*
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/378304/bilibili%E4%B8%93%E6%A0%8F%E5%8E%BBunable-reprint.user.js
// @updateURL https://update.greasyfork.org/scripts/378304/bilibili%E4%B8%93%E6%A0%8F%E5%8E%BBunable-reprint.meta.js
// ==/UserScript==

const doElements = unsafeWindow.document.querySelectorAll(".article-holder.unable-reprint")
console.log(doElements)
var i = 0

function removeForce() {
    'use strict';
    for (i=0; i < doElements.length; i++) doElements[i].classList.remove("unable-reprint");
}

function revertAll() {
    'use strict';

    for (i=0; i < doElements.length; i++) doElements[i].classList.add("unable-reprint");
}

GM_registerMenuCommand("去unable-reprint", removeForce, '', '', 'j');
GM_registerMenuCommand("恢复", revertAll, '', '', 'j');

removeForce();