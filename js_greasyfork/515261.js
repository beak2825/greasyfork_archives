// ==UserScript==
// @name         エロアニメ折りたたみフィルター
// @namespace    http://tampermonkey.net/
// @version      0.6
// @license       adsamalu4kia
// @description  特定のワードが含まれる記事を折りたたむ
// @match        http://blog-mougenda.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515261/%E3%82%A8%E3%83%AD%E3%82%A2%E3%83%8B%E3%83%A1%E6%8A%98%E3%82%8A%E3%81%9F%E3%81%9F%E3%81%BF%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/515261/%E3%82%A8%E3%83%AD%E3%82%A2%E3%83%8B%E3%83%A1%E6%8A%98%E3%82%8A%E3%81%9F%E3%81%9F%E3%81%BF%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 折りたたむ対象のワードリスト
    const targetWords = ["エロアニメ", "OVA", "THE ANIMATION"];

    // 記事の要素を取得
    const articles = document.querySelectorAll('article.article');

    articles.forEach(article => {
        // 記事タイトルと本文のテキストを取得
        const titleText = article.querySelector('.article-title')?.textContent || "";
        const bodyText = article.querySelector('.article-body-inner')?.textContent || "";

        // タイトルまたは本文にターゲットワードが含まれているかを確認
        const containsTargetWord = targetWords.some(word => titleText.includes(word) || bodyText.includes(word));

        if (containsTargetWord) {
            // 折りたたみ処理（display: noneで完全に非表示）
            article.style.display = "none";

            // ボタンを作成して「表示」オプションを追加
            const toggleButton = document.createElement('button');
            toggleButton.textContent = "表示";
            toggleButton.style.cursor = "pointer";
            toggleButton.onclick = () => {
                // 記事の表示・非表示を切り替え
                if (article.style.display === "none") {
                    article.style.display = "block";
                    toggleButton.textContent = "折りたたむ";
                } else {
                    article.style.display = "none";
                    toggleButton.textContent = "表示";
                }
            };

            // ボタンを記事の前に追加
            article.parentNode.insertBefore(toggleButton, article);
        }
    });
})();
