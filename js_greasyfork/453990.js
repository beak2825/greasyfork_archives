// ==UserScript==
// @name         AtCoder Custom Default Submissions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AtCoderのすべての提出の絞り込み、並び替え設定のデフォルトを設定します。本スクリプトのデフォルトは言語Rust, 結果AC, コード長の昇順に並び替えです。
// @author       hayatroid
// @include      https://atcoder.jp/contests/*
// @downloadURL https://update.greasyfork.org/scripts/453990/AtCoder%20Custom%20Default%20Submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/453990/AtCoder%20Custom%20Default%20Submissions.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const lang = 'Rust';
    const taskPage = location.href.match(/tasks\/(.+?)$/);
    let task = '';
    if (taskPage && taskPage[1]) {
        task = taskPage[1];
    }
    const params = {
        'f.Task': task,
        'f.LanguageName': lang,
        'f.Status': 'AC',
        'orderBy': 'source_length',
    };
    const esc = encodeURIComponent;
    const querystring = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    const links = document.querySelectorAll('#contest-nav-tabs a');
    for (let i = 0; i < links.length; i++) {
        const href = links[i].getAttribute('href');
        if (href && href.endsWith('submissions')) {
            links[i].setAttribute('href', `${href}?${querystring}`);
        }
    }
})();