// ==UserScript==
// @name         Markdown Copy Context
// @namespace    MCC
// @version      2024-10-31
// @description  コンテキストで実行。マークダウン用のリンクを作成してクリップボードにコピーする
// @author       GRY9
// @license      GRY9
// @match        https://*/*
// @match        https://*
// @match        http://*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.co.jp
// @run-at context-menu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514918/Markdown%20Copy%20Context.user.js
// @updateURL https://update.greasyfork.org/scripts/514918/Markdown%20Copy%20Context.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var md = "[" + document.title + "](" + location.href + ")";
    if(navigator.clipboard){
        navigator.clipboard.writeText(md);
    }
    else if(window.clipboardData){
        window.clipboardData.setData("Text" , md);
    }
    // Your code here...
})();