// ==UserScript==
// @name         Huluuuuuuuuuu
// @namespace    https://twitter.com/rin_jugatla
// @version      0.1
// @description  Huluの新デザイン(20/4/7)で右クリック、左クリック系イベント禁止を回避する
// @author       rin_jugatla
// @match        https://www.hulu.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399818/Huluuuuuuuuuu.user.js
// @updateURL https://update.greasyfork.org/scripts/399818/Huluuuuuuuuuu.meta.js
// ==/UserScript==

(function() {
    // 左クリック系禁止解除
    // 参考
    // テキストがコピー不可のWebサイトでテキストをコピーする3つの方法
    // https://iwb.jp/disabled-text-copy-website/
    var css = '* { user-select: auto !important; }';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
    // 右クリック禁止解除
    // 参考
    // JavaScriptによる右クリックの禁止・禁止を解除する方法
    // https://qiita.com/awesam86/items/65255f1b034b43011a5a
    document.oncontextmenu = function () {return true;}
})();