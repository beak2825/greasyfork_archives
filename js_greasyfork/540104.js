// ==UserScript==
// @name         YouTube自動コメント投稿
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTubeのコメント欄を自動でアクティブにし、0.01秒ごとにコメントを自動投稿します。
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/540104/YouTube%E8%87%AA%E5%8B%95%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%8A%95%E7%A8%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/540104/YouTube%E8%87%AA%E5%8B%95%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%8A%95%E7%A8%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // コメント投稿を自動で開始するか (trueで開始, falseで手動)
    const autoStartComment = true;

    // コメントの内容
    const baseComment = 'ゆっくりKで検索';

    // コメント投稿間隔 (ミリ秒)
    const postInterval = 10; // 0.01秒

    // コメント投稿を停止するか (trueで停止)
    let stopPosting = false;

    function activateCommentInput() {
        // コメント入力欄を見つけてクリック
        // YouTubeの構造が変わる可能性があるため、セレクタは適宜調整してください。
        // 一般的なコメント入力欄のセレクタ例
        const commentInputSelector = 'ytd-comment-simplebox-renderer #placeholder-area, ytd-comment-simplebox-renderer #contenteditable-root';
        const commentInput = $(commentInputSelector);

        if (commentInput.length > 0) {
            commentInput.click();
            console.log('コメント入力欄をアクティブにしました。');
            return true;
        }
        console.log('コメント入力欄が見つかりませんでした。');
        return false;
    }

    function postComment() {
        if (stopPosting) {
            console.log('コメント投稿が停止されました。');
            return;
        }

        const commentBox = $('#contenteditable-root'); // アクティブになった後の実際の入力フィールド
        const sendButton = $('#submit-button button'); // 送信ボタン

        if (commentBox.length > 0 && sendButton.length > 0) {
            // ランダムな数字を追加
            const randomSuffix = Math.floor(Math.random() * 10000); // 例: 0から9999までのランダムな整数
            const fullComment = baseComment + ' ' + randomSuffix;

            // コメントを入力
            commentBox.text(fullComment);
            // イベントを発火させて、入力が認識されるようにする（場合による）
            commentBox.trigger('input');

            // 送信ボタンがアクティブになるのを待つ
            // 少し待つ必要がある場合があります
            setTimeout(() => {
                if (!sendButton.prop('disabled')) {
                    sendButton.click();
                    console.log('コメントを投稿しました: ' + fullComment);
                } else {
                    console.log('送信ボタンが非アクティブです。');
                }
            }, 100); // 100ミリ秒待つ例

        } else {
            console.log('コメント入力欄または送信ボタンが見つかりません。コメント投稿を停止します。');
            stopPosting = true; // 見つからない場合は停止
        }
    }

    // コメント投稿を開始する関数
    function startCommentPosting() {
        if (activateCommentInput()) {
            // 入力欄がアクティブになったら、一定間隔で投稿を開始
            // コメント欄が完全にロードされるまで少し待つ必要がある場合があります
            setTimeout(() => {
                setInterval(postComment, postInterval);
            }, 1000); // 1秒待つ例
        } else {
             console.log('コメント投稿を開始できませんでした。');
        }
    }

    // ページのロード完了を待つ
    $(window).on('load', function() {
        console.log('ページがロードされました。');
        if (autoStartComment) {
            // YouTubeの動的なコンテンツ読み込みを考慮して、少し遅延させてから開始
            setTimeout(startCommentPosting, 3000); // 3秒後に開始
        } else {
            console.log('自動コメント投稿は無効になっています。');
            // 必要に応じて、手動で開始するためのボタンなどを追加できます。
        }
    });

    // コメント投稿を停止する手動トリガー（デバッグ用など）
    // コンソールで `stopPosting = true;` を実行することで停止できます。
})();
