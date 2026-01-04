// ==UserScript==
// @name         AtCoder Custom Default Submissions
// @namespace    https://github.com/ktny
// @version      1.5
// @description  AtCoderのすべての提出の絞り込み、並び替え設定のデフォルトを設定します。本スクリプトのデフォルトは言語C++, 結果AC, コード長の昇順に並び替えです。
// @author       ktnyori
// @license      MIT
// @include      https://atcoder.jp/contests/*
// @downloadURL https://update.greasyfork.org/scripts/393705/AtCoder%20Custom%20Default%20Submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/393705/AtCoder%20Custom%20Default%20Submissions.meta.js
// ==/UserScript==
(function () {
    'use strict';
    /**********************************************
     * langsの中から自分が使用する言語に変更してください
     * ex) C#, Python3, Rust, Java
    ***********************************************/
    const lang = 'C++';
    // 問題ページにいるときは問題番号での絞り込みも追加
    const taskPage = location.href.match(/tasks\/(.+?)$/);
    let task = '';
    if (taskPage && taskPage[1]) {
        task = taskPage[1];
    }
    const params = {
        'f.Task': task,
        'f.LanguageName': lang,
        // AC, WA, TLE, MLE, RE, CE, QLE, OLE, IE, WJ, WR, Judging
        'f.Status': 'AC',
        // source_length, time_consumption, memory_consumption, score
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
