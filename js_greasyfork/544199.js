// ==UserScript==
// @name         AtCoder Title Changer
// @name:ja      AtCoder タイトル変更
// @namespace    paruma184
// @version      0.1
// @description  Change the title of AtCoder contest problems.
// @description:ja AtCoderの問題ページのタイトルにコンテスト名を追加します。
// @author       paruma184
// @match        https://atcoder.jp/contests/*/tasks/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544199/AtCoder%20Title%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/544199/AtCoder%20Title%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const parts = url.split('/');
    const contestName = parts[4];

    const originalTitle = document.title;

    document.title = `${contestName.toUpperCase()} ${originalTitle}`;
})();
