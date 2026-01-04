// ==UserScript==
// @name         lit.link最小フォントサイズ変更
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  lit.linkの文字ちっさ問題対策
// @author       makichama / makipom
// @match        http*://lit.link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518663/litlink%E6%9C%80%E5%B0%8F%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%82%B5%E3%82%A4%E3%82%BA%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/518663/litlink%E6%9C%80%E5%B0%8F%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%82%B5%E3%82%A4%E3%82%BA%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const minFontSize = 12; // こちらの値を調整して、一番見えやすいようにしてください

    document.querySelectorAll('*').forEach(function(element) {
        element.style.fontSize = minFontSize + 'px';
    });
      Array.prototype.forEach.call(document.getElementsByTagName("*"), function(e){e.style.fontFamily ="メイリオ"}); // カッコの中のフォントを好きなフォントファミリーの名前に変えてください。デフォルトは皆が大好きな古き良きメイリオです
})();