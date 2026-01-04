// ==UserScript==
// @name         X 親ツイートにランダムな数字を付けて自動返信
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Xの親ツイートにランダムな数字を付けて50回自動返信する
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538776/X%20%E8%A6%AA%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AB%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%81%AA%E6%95%B0%E5%AD%97%E3%82%92%E4%BB%98%E3%81%91%E3%81%A6%E8%87%AA%E5%8B%95%E8%BF%94%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/538776/X%20%E8%A6%AA%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AB%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%81%AA%E6%95%B0%E5%AD%97%E3%82%92%E4%BB%98%E3%81%91%E3%81%A6%E8%87%AA%E5%8B%95%E8%BF%94%E4%BF%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let replyCount = 0;
    const maxReplies = 250;

    // 返信ボタンを探してクリックする関数
    function findAndClickReplyButton() {
        const replyButton = document.querySelector('[data-testid="reply"]');
        if (replyButton) {
            replyButton.click();
            return true;
        }
        return false;
    }

    // 返信テキストエリアに内容を入力してツイートする関数
    function typeAndTweetReply() {
        const replyTextArea = document.querySelector('[data-testid="tweetTextarea_0"]');
        const tweetButton = document.querySelector('[data-testid="tweetButton"]');

        if (replyTextArea && tweetButton) {
            const randomNum = Math.floor(Math.random() * 1000000);
            replyTextArea.focus(); // フォーカスを当てる
            document.execCommand('insertText', false, `Random: ${randomNum}`); // テキストを挿入

            // テキストエリアの値が更新されたことを確認 (少し待つ)
            setTimeout(() => {
                 if (tweetButton && !tweetButton.disabled) {
                    tweetButton.click();
                    replyCount++;
                    console.log(`Replied ${replyCount} times.`);
                    // 次の返信のために元のツイートページに戻るなど、適切な処理が必要
                    // 例えば、リロードや前のページに戻るなど
                    // ここでは簡単のため、少し待ってから次の処理へ
                    setTimeout(checkAndReply, 5000); // 5秒待ってから次の返信を試みる
                } else {
                    console.log("Tweet button is disabled or not found after typing. Retrying...");
                    setTimeout(typeAndTweetReply, 1000); // ボタンが有効になるまでリトライ
                }
            }, 100); // テキスト挿入後に少し待つ
            return true;
        }
        console.log("Reply textarea or tweet button not found.");
        return false;
    }

    // 返信プロセスを開始する関数
    function startReplyProcess() {
        if (replyCount >= maxReplies) {
            console.log("Finished sending 50 replies.");
            return;
        }

        console.log("Attempting to find reply button...");
        if (findAndClickReplyButton()) {
            console.log("Reply button clicked. Waiting for textarea...");
            // 返信フォームが表示されるのを待つ
            setTimeout(typeAndTweetReply, 2000); // 2秒待つ (環境によって調整が必要)
        } else {
            console.log("Reply button not found. Are you on a tweet's detail page?");
             // 返信ボタンが見つからない場合、少し待ってから再試行するか、
             // ツイート詳細ページに遷移するなど、適切な処理が必要
             setTimeout(checkAndReply, 5000); // 5秒待ってから再試行
        }
    }

    // ページの状態を確認し、返信を開始する関数
    function checkAndReply() {
        if (replyCount < maxReplies) {
            startReplyProcess();
        } else {
             console.log("Finished sending 50 replies.");
        }
    }

    console.log("X Auto Reply Script Loaded.");

    // スクリプト実行開始トリガー
    // ページが完全にロードされた後、または特定のイベントで開始
    // ここでは簡単な例として、ページロード後に開始
    // より頑強にするには、特定の要素が出現するのを待つ必要があります
     window.addEventListener('load', () => {
         console.log("Window loaded. Starting reply process...");
         // ページ構造が安定するまで少し待つ
         setTimeout(checkAndReply, 3000); // 3秒待つ
     });

     // URLが変わったときにも対応する場合
     let lastUrl = location.href;
     new MutationObserver(() => {
         const url = location.href;
         if (url !== lastUrl) {
             lastUrl = url;
             console.log("URL changed. Checking for new tweet page.");
             // 新しいツイートページに遷移した可能性があるため、少し待ってから開始
             setTimeout(checkAndReply, 3000);
         }
     }).observe(document, { subtree: true, childList: true });


    // 必要に応じて、手動で開始するボタンなどを追加しても良い
    // 例：
    // const startButton = document.createElement('button');
    // startButton.textContent = 'Start Auto Reply';
    // startButton.style.position = 'fixed';
    // startButton.style.top = '10px';
    // startButton.style.right = '10px';
    // startButton.style.zIndex = '10000';
    // document.body.appendChild(startButton);
    // startButton.addEventListener('click', checkAndReply);


})();