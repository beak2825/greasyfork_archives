// ==UserScript==
// @name         Hulu Japan Auto Skip Intro & Next Episode
// @namespace    https://hulu.jp/
// @version      3.2
// @description  Hulu Japanの「本編へスキップ」ボタンとカウントダウン表示後の「次の動画」ボタンを自動でクリック（Alt + C でオン/オフ切り替え可）
// @author       まぃ (Mai)
// @match        *://www.hulu.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530667/Hulu%20Japan%20Auto%20Skip%20Intro%20%20Next%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/530667/Hulu%20Japan%20Auto%20Skip%20Intro%20%20Next%20Episode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = true; // スクリプトの有効/無効フラグ
    let lastClickTime = 0; // 前回クリック時刻
    const cooldown = 500; // 次のクリックまでの待機時間（ミリ秒）

    // 本編スキップボタンをクリックする関数
    function skipIntro() {
        const skipButton = document.querySelector('.opening-skip.show, .opening-skip');
        if (skipButton && !skipButton.classList.contains('hidden')) {
            console.log("本編へスキップ ボタンをクリックしました");
            skipButton.click();
        }
    }

    // 「次の動画」ボタンをクリックする関数
    function playNextEpisode() {
        const now = Date.now();
        if (now - lastClickTime < cooldown) return; // クールダウン中はスキップ

        const upNext = document.querySelector('.next-episode .upNextin');
        const nextButton = document.querySelector('.next-episode .play-link');

        if (upNext && nextButton && !nextButton.classList.contains('disabled')) {
            console.log("カウントダウン表示を検出。次の動画をクリックします。");
            nextButton.click();
            lastClickTime = now;
        }
    }

    function checkAndClickButtons() {
        if (!isEnabled) return;
        skipIntro();
        playNextEpisode();
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                checkAndClickButtons();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(checkAndClickButtons, 1000);

    // Alt + C でオン/オフ切り替え
    window.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'c' || e.key === 'C')) {
            isEnabled = !isEnabled;
            console.log(`Hulu Auto Skip スクリプトは ${isEnabled ? '有効' : '無効'} になりました。`);
        }
    });
})();
