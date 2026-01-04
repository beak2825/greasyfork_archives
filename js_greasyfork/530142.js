// ==UserScript==
// @name         Discord Mobile Swipe Fix (iOS対応 + サーバーサイドバー)
// @namespace    https://discord.com/
// @version      1.9
// @description  iOSの戻る/進むスワイプを無効化し、左スワイプでサーバーサイドバーを開く
// @author       あなたの名前
// @license      MIT
// @match        *://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530142/Discord%20Mobile%20Swipe%20Fix%20%28iOS%E5%AF%BE%E5%BF%9C%20%2B%20%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%83%90%E3%83%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530142/Discord%20Mobile%20Swipe%20Fix%20%28iOS%E5%AF%BE%E5%BF%9C%20%2B%20%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%83%90%E3%83%BC%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    // スクロールの干渉を防ぐため、CSSを適用
    const style = document.createElement("style");
    style.innerHTML = `
        html {
            overscroll-behavior: none !important; /* iOSの戻る/進むジェスチャーを無効化 */
            touch-action: none !important; /* 画面端のスワイプをブロック */
        }
        body {
            overflow: auto !important; /* スクロールを有効化 */
            -webkit-overflow-scrolling: touch !important; /* iOSのスムーズスクロール */
        }
    `;
    document.head.appendChild(style);

    document.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;

        // 画面端（50px以内）のスワイプを無効化（iOSの戻る/進む防止）
        if (startX < 50 || startX > window.innerWidth - 50) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener("touchmove", function (e) {
        if (!isSwiping) return;

        let diffX = e.touches[0].clientX - startX;
        let diffY = e.touches[0].clientY - startY;

        // 縦スクロールを許可（横スクロールのみ制御）
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isSwiping = false;
            return;
        }

        // 左スワイプ（サーバーサイドバーを開く）
        if (diffX < -50) {
            console.log("左スワイプ → サーバーサイドバーを表示");
            openServerSidebar();
            e.preventDefault();
        }

        // 右スワイプ（戻る/進むを防止）
        if (diffX > 50) {
            console.log("右スワイプを無効化");
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener("touchend", function () {
        isSwiping = false;
    });

    // 追加のイベントリスナーでスワイプを完全ブロック
    window.addEventListener("wheel", function (e) {
        e.preventDefault();
    }, { passive: false });

    window.addEventListener("gesturestart", function (e) {
        e.preventDefault();
    });

    // サーバーサイドバーを開く関数
    function openServerSidebar() {
        let sidebarButton = document.querySelector('[aria-label="サーバー サイドバー"]');
        if (sidebarButton) {
            console.log("サーバーサイドバーを開く");
            sidebarButton.click();
        } else {
            console.log("サーバーサイドバーのボタンが見つかりません！");
        }
    }

    // サーバーサイドバーのボタンを監視して、ページの変更にも対応
    const observer = new MutationObserver(() => {
        let sidebarButton = document.querySelector('[aria-label="サーバー サイドバー"]');
        if (sidebarButton) {
            console.log("サーバーサイドバーのボタンが検出されました！");
            observer.disconnect(); // 一度検出したら監視を終了
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
