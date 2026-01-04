// ==UserScript==
// @name         ×印押す押すくん
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ×ボタンを押しやすく
// @author       icchi
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528414/%C3%97%E5%8D%B0%E6%8A%BC%E3%81%99%E6%8A%BC%E3%81%99%E3%81%8F%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/528414/%C3%97%E5%8D%B0%E6%8A%BC%E3%81%99%E6%8A%BC%E3%81%99%E3%81%8F%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ×ボタンを大きくするためのCSSスタイルを追加
    const style = document.createElement('style');
    style.innerHTML = `
        .ignore {
            font-size: 20px !important; /* アイコンを大きく */
            padding: 0px !important;   /* ボタンの余白を広げる */
            display: inline-block !important; /* インラインで表示 */
            text-align: center !important; /* 中央寄せ */
        }
        .ignore i {
            font-size: inherit !important; /* アイコンもボタンのサイズに合わせる */
        }
    `;
    document.head.appendChild(style);

})();