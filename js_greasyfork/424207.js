// ==UserScript==
// @name         AtCoder Editorial New Tab
// @namespace    https://github.com/HalsSC/
// @version      0.4
// @description  AtCoderの問題ページにある解説ボタンを新規タブで開くようにします。
// @author       HalsSC
// @match        https://atcoder.jp/contests/*/tasks/*
// @exclude      https://atcoder.jp/contests/*/tasks/*/editorial
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424207/AtCoder%20Editorial%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/424207/AtCoder%20Editorial%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    // 一部の変なコンテストや将来的な仕様変更により使えないかもしれないです＞＜
    var ele=document.getElementsByClassName("btn btn-default btn-sm")[0];
    ele.target="_blank";
    ele.rel="noopener noreferrer";
})();