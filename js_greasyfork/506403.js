// ==UserScript==
// @name         Misskey リアクションするとき検索しやすく
// @namespace    https://yyya-nico.co/
// @version      1.0.1
// @description  リアクションボタンをクリックで絵文字検索欄にフォーカスをします。
// @author       yyya_nico
// @license      MIT License
// @match        https://misskey.backspace.fm/
// @match        https://misskey.flowers/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=misskey.flowers
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506403/Misskey%20%E3%83%AA%E3%82%A2%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%99%E3%82%8B%E3%81%A8%E3%81%8D%E6%A4%9C%E7%B4%A2%E3%81%97%E3%82%84%E3%81%99%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/506403/Misskey%20%E3%83%AA%E3%82%A2%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%99%E3%82%8B%E3%81%A8%E3%81%8D%E6%A4%9C%E7%B4%A2%E3%81%97%E3%82%84%E3%81%99%E3%81%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', e => {
        if (e.target.closest('.xviCy') && e.target.querySelector('.ti-plus')) {
            document.querySelector('input.search')?.focus();
        }
    });
})();