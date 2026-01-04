// ==UserScript==
// @name         Flow Chat for YouTube Live自分用カスタム
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Chrome拡張機能のFlow Chat for YouTube Liveで上位チャットから全てのチャットにし、キャストボタンと右側のチャットを非表示にし、かつミニプレイヤーボタンをpip表示ボタンに切り替えます。
// @author       あるぱか
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530195/Flow%20Chat%20for%20YouTube%20Live%E8%87%AA%E5%88%86%E7%94%A8%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/530195/Flow%20Chat%20for%20YouTube%20Live%E8%87%AA%E5%88%86%E7%94%A8%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンを操作する関数
    function customizePlayerControls() {

        // 「テレビで見る」ボタンを非表示にする
        const remoteButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-remote-button.ytp-button");
        if (remoteButton && remoteButton.style.display !== 'none') {
            remoteButton.style.display = 'none';
            console.log("「テレビで見る」ボタンを非表示にしました！");
        }

        // ミニプレイヤーボタンを非表示にする
        const miniplayerButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-miniplayer-button.ytp-button");
        if (miniplayerButton && miniplayerButton.style.display !== 'none') {
            miniplayerButton.style.display = 'none';
            console.log("「ミニプレイヤー」ボタンを非表示にしました！");
        }

        // PIPボタンを表示する
        const pipButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-pip-button.ytp-button");
        if (pipButton && pipButton.style.display === 'none') {
            pipButton.style.display = '';
            console.log("「ピクチャーインピクチャー」ボタンを表示しました！");
        }

        // チャットボタン自動押し & 非表示
        const ytCtButton = document.querySelector("#show-hide-button > ytd-button-renderer > yt-button-shape > button");
        const pFBCYt = document.querySelector("#panels-full-bleed-container");
        if (ytCtButton && ytCtButton.classList.contains("yt-spec-button-shape-next--outline")) {
            // チャットボタン自動押し
            ytCtButton.click();
            if (pFBCYt.style.display !== "none") {
            document.querySelector("#chat-container").style.display = "none";
            pFBCYt.style.display = "none";
            console.log("チャット欄を非表示にしました！");
            }
        }

        // 概要欄のチャットボタン非表示
        const tcChatYt = document.querySelector("#teaser-carousel");
        if (tcChatYt && tcChatYt.style.display !== "none") {
            tcChatYt.style.display = "none";
            console.log("「ミニプレイヤー」ボタンを非表示にしました！");
        }

        // 上位チャット切り替え
        const cmYlchr = document.querySelector("#label-text");
        if (cmYlchr && (cmYlchr.innerText === "トップチャット" || cmYlchr.innerText === "上位のチャットのリプレイ")) {
            setTimeout(() => {
                document.querySelector("a.yt-simple-endpoint.style-scope.yt-dropdown-menu[aria-selected='false']").click();
                console.log("「上位チャット」から「チャット」に切り替えました！");
            }, "100");

        }

    }


    // デバウンス用のタイマー
    let debounceTimer;

    // MutationObserver を使って DOM の変更を監視
    const observer = new MutationObserver(() => {
        // デバウンス処理: 100ms 以内に複数の変更が発生した場合、最後の変更だけを処理する
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(customizePlayerControls, 100);
    });

    // 監視を開始
    observer.observe(document.body, {
        childList: true, // 子要素の変更を監視
        subtree: true // すべての子孫要素を監視
    });

    // 初期実行
    customizePlayerControls();


})();