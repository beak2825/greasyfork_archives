// ==UserScript==
// @name         X自動投稿スクリプト
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  0.1秒間隔でXに「悪殺会万歳」と投稿します
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538215/X%E8%87%AA%E5%8B%95%E6%8A%95%E7%A8%BF%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538215/X%E8%87%AA%E5%8B%95%E6%8A%95%E7%A8%BF%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const postText = "悪殺会万歳";
    const postInterval = 100; // 0.1 seconds in milliseconds

    function findTweetButton() {
        // X (Twitter) の新しいUIに対応するためのセレクタを試行錯誤する必要があります。
        // これはあくまで例であり、Xのアップデートにより変更される可能性があります。
        // 投稿ボタンを表す要素を探します。クラス名やaria-labelなどを手がかりにします。
        // 例: 'div[data-testid="tweetButtonInline"]' または 'a[data-testid="SideNav_NewTweet_Button"]' など
        // より確実にボタンを見つけるためには、要素の属性や構造をデベロッパーツールで確認してください。
        return document.querySelector('div[data-testid="tweetButtonInline"], a[data-testid="SideNav_NewTweet_Button"]');
    }

    function findTweetInputArea() {
        // ツイート入力エリアを表す要素を探します。data-testid属性などが手がかりになります。
        // 例: 'div[data-testid="tweetTextInput"]'
         return document.querySelector('div[data-testid="tweetTextInput"]');
    }

    function postTweet() {
        const tweetInput = findTweetInputArea();
        const tweetButton = findTweetButton();

        if (tweetInput) {
            // 入力エリアにテキストを設定
            // 多くのサイトでは input イベントなどをトリガーしないと UI が更新されないことがあります
            tweetInput.focus();
            document.execCommand('insertText', false, postText);

            // 入力があったことを X のスクリプトに認識させるためのイベントを発火させることも考えられますが、
            // execCommand でうまくいく場合もあります。

            // 投稿ボタンが見つかったらクリック
            if (tweetButton) {
                // ボタンが disabled になっていないか確認する必要があるかもしれません。
                // 投稿ボタンが有効になるのを待つロジックが必要になる場合があります。
                 setTimeout(() => { // 短い遅延を入れることで、テキスト入力が反映されるのを待つ
                     tweetButton.click();
                     console.log(`「${postText}」を投稿しました。`);
                 }, 100); // 例: 100ms 遅延
            } else {
                console.warn("投稿ボタンが見つかりませんでした。");
            }
        } else {
            console.warn("ツイート入力エリアが見つかりませんでした。");
        }
    }

    // 一定間隔で投稿関数を呼び出す
    // ページが完全にロードされてから開始することを推奨します
    window.addEventListener('load', () => {
        setInterval(postTweet, postInterval);
    });

})();
