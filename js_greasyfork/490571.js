// ==UserScript==
// @name         ツイ消し閲覧
// @namespace    https://twitter.com/mochimkchiking
// @version      1.0
// @description  Twitterで削除されたツイートを閲覧した際に自動でWebArchiveのページへのタブを開く
// @author       わらピもち
// @match        https://twitter.com/*
// @grant        none
// @license      CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/490571/%E3%83%84%E3%82%A4%E6%B6%88%E3%81%97%E9%96%B2%E8%A6%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/490571/%E3%83%84%E3%82%A4%E6%B6%88%E3%81%97%E9%96%B2%E8%A6%A7.meta.js
// ==/UserScript==
(function() {
    'use strict';

        // 削除されたツイートのページかどうかを判定する関数
        function isDeletedTweetPage() {
            const pageContent = document.body.innerText;
            return pageContent.includes('このページは存在しません。他のページを検索してみましょう。') || pageContent.includes('凍結されたアカウントによるポストです。');
        }

        // 3秒後に実行する
        setTimeout(function() {
            // 現在のページが削除されたツイートのページかどうかチェック
            if (isDeletedTweetPage()) {
                // 削除されたツイートのページの場合、ウェブ・アーカイブのurlを取得
                const href = window.location.href;
                const webArchiveUrl = `https://web.archive.org/web/0/${href}`;

                // ウェブアーカイブのページを新しいタブで開く
                window.open(webArchiveUrl, '_blank');
            }
        }, 3000); // 2.5秒後に実行
})();