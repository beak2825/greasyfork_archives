// ==UserScript==
// @name         e-words広告ブロッカーブロッカー回避
// @namespace    @yudai1204
// @version      0.1
// @description  e-wordsで広告ブロッカーを入れていると下部にうざいバナーが表示されるのを回避します
// @author       You
// @match        https://e-words.jp/*
// @icon         https://e-words.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446009/e-words%E5%BA%83%E5%91%8A%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%E5%9B%9E%E9%81%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/446009/e-words%E5%BA%83%E5%91%8A%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%E5%9B%9E%E9%81%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("forvisitors").style.visibility="hidden";
})();