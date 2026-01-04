// ==UserScript==
// @name         coca 解除不能选中（复制）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  coca 解除不能选中（复制）1
// @author       You
// @match        https://www.english-corpora.org/coca/
// @icon         https://www.google.com/s2/favicons?domain=english-corpora.org
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/493528/coca%20%E8%A7%A3%E9%99%A4%E4%B8%8D%E8%83%BD%E9%80%89%E4%B8%AD%EF%BC%88%E5%A4%8D%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493528/coca%20%E8%A7%A3%E9%99%A4%E4%B8%8D%E8%83%BD%E9%80%89%E4%B8%AD%EF%BC%88%E5%A4%8D%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

function disen_sel() {
    debugger
    document.getElementsByName("x1")[0].contentWindow.document.onselectstart = new Function("return true")
    document.getElementsByName("x2")[0].contentWindow.document.onselectstart = new Function("return true")
    document.getElementsByName("x3")[0].contentWindow.document.onselectstart = new Function("return true")
    document.getElementsByName("x4")[0].contentWindow.document.onselectstart = new Function("return true")
}

(function() {
    'use strict';
    loader =()=>{return false;}
    setInterval(disen_sel, 1000);
    //Your code here ...
})();


