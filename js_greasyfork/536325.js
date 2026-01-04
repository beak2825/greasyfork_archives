// ==UserScript==
// @name         ココナラ最終ログイン絶対時刻化
// @namespace    https://coconala.com/
// @version      0.1
// @description  ココナラユーザーページのステータス欄に最終ログイン時刻を追記します。
// @author       4y4m3
// @match        https://coconala.com/users/*
// @icon         https://www.google.com/s2/favicons?domain=coconala.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536325/%E3%82%B3%E3%82%B3%E3%83%8A%E3%83%A9%E6%9C%80%E7%B5%82%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E7%B5%B6%E5%AF%BE%E6%99%82%E5%88%BB%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/536325/%E3%82%B3%E3%82%B3%E3%83%8A%E3%83%A9%E6%9C%80%E7%B5%82%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E7%B5%B6%E5%AF%BE%E6%99%82%E5%88%BB%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function displayLastLogin() {
        // 最終ログインのタイムスタンプを取得
        const lastLoginTimestamp = window.__NUXT__?.state?.pages?.users?.user?.lastLoginedAt;

        // HTML要素を取得
        const targetElement = document.querySelector('div.c-userStatus');

        // タイムスタンプと対象要素が両方存在する場合のみ処理を実行
        if (lastLoginTimestamp && targetElement) {
            // タイムスタンプ(秒)をミリ秒に変換してDateオブジェクトを作成
            const dateObject = new Date(lastLoginTimestamp * 1000);

            // Dateオブジェクトを日付/時刻文字列に変換
            const formattedDateTime = dateObject.toLocaleString();

            // 対象要素のテキスト内容に、取得した時刻を追記
            targetElement.innerHTML += `${formattedDateTime}`;
        }
    }

    // 遅延実行
    setTimeout(displayLastLogin, 100);

})();