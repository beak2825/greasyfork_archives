// ==UserScript==
// @name         自動コメント投稿（0.01秒間隔）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTubeのコメント欄を自動でアクティブにし、0.01秒ごとに「test」というコメントを自動投稿します。
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539396/%E8%87%AA%E5%8B%95%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%8A%95%E7%A8%BF%EF%BC%88001%E7%A7%92%E9%96%93%E9%9A%94%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539396/%E8%87%AA%E5%8B%95%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%8A%95%E7%A8%BF%EF%BC%88001%E7%A7%92%E9%96%93%E9%9A%94%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // コメント投稿関数
    function postComment() {
        // コメント入力欄を探す
        const commentInput = document.querySelector('#contenteditable-root');

        if (commentInput) {
            // コメント入力欄をアクティブにする (クリックイベントをシミュレート)
            commentInput.click();

            // しばらく待ってからテキストを入力（クリック後のDOM更新を考慮）
            setTimeout(() => {
                // コメントテキストを設定
                commentInput.textContent = '荒らし舐めてんのか？俺はガチ犯罪者やぞ？';

                // 入力イベントを発火させて、YouTubeにテキストが入力されたことを認識させる
                const inputEvent = new Event('input', { bubbles: true });
                commentInput.dispatchEvent(inputEvent);

                // 投稿ボタンを探す
                const sendButton = document.querySelector('#submit-button button');

                if (sendButton && !sendButton.disabled) {
                    // 投稿ボタンをクリック
                    sendButton.click();
                    console.log('コメントを投稿しました。');
                } else {
                    // 投稿ボタンが無効な場合や見つからない場合
                    console.log('投稿ボタンが見つからないか無効です。');
                }
            }, 50); // 50ms待機
        } else {
            console.log('コメント入力欄が見つかりません。');
        }
    }

    // ページ読み込み完了後に処理を開始
    window.addEventListener('load', () => {
        // 0.01秒 (10ミリ秒) 間隔でコメント投稿関数を繰り返し実行
        setInterval(postComment, 10);
    });
})();