// ==UserScript==
// @name         Add Trailing Slash to Narou URL
// @namespace    haaarug
// @version      1.2
// @description  なろうの小説トップページのURLが「/n0001a」「/n0001a/?p=1」のとき「/n0001a/」へリダイレクトする。
// @license      CC0
// @match        https://ncode.syosetu.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538399/Add%20Trailing%20Slash%20to%20Narou%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/538399/Add%20Trailing%20Slash%20to%20Narou%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);

    // クエリが ?p=1 のとき → クエリ削除してそのままリダイレクト（スラッシュは追加しない）
    if (url.search === '?p=1') {
        url.search = '';
        window.location.replace(url.toString());
        return;
    }

    // クエリがない ＆ pathname がスラッシュで終わっていないとき → スラッシュ追加
    if (!url.search && !url.pathname.endsWith('/')) {
        url.pathname += '/';
        window.location.replace(url.toString());
    }

    // それ以外（クエリがある or スラッシュ付き）は何もしない
})();
