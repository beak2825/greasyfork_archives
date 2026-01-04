// ==UserScript==
// @name         Openrec チャット欄透明化 (全画面時のみ)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Openrec の全画面表示時にのみチャットを透明（見えなく）するユーザースクリプトです。
// @match        https://www.openrec.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529182/Openrec%20%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E6%AC%84%E9%80%8F%E6%98%8E%E5%8C%96%20%28%E5%85%A8%E7%94%BB%E9%9D%A2%E6%99%82%E3%81%AE%E3%81%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529182/Openrec%20%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E6%AC%84%E9%80%8F%E6%98%8E%E5%8C%96%20%28%E5%85%A8%E7%94%BB%E9%9D%A2%E6%99%82%E3%81%AE%E3%81%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全画面表示かどうかを判定し、チャットの透明度を更新する関数
    const updateChatVisibility = () => {
        const chatContainers = document.querySelectorAll('.movie-page-chat-aside');
        chatContainers.forEach(el => {
            if (document.fullscreenElement) {
                // 全画面時：チャットを透明にする
                el.style.opacity = '0';
                // 必要に応じてクリック等のイベントも無効化
                // el.style.pointerEvents = 'none';
            } else {
                // 全画面でない場合：元の状態に戻す
                el.style.opacity = '';
                // el.style.pointerEvents = '';
            }
        });
    };

    // 全画面状態の変化を監視
    document.addEventListener('fullscreenchange', updateChatVisibility);

    // DOM の変化にも対応するため MutationObserver を利用
    const observer = new MutationObserver(() => {
        updateChatVisibility();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 初回チェック
    updateChatVisibility();
})();