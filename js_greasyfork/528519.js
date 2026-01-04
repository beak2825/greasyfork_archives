// ==UserScript==
// @name         Yahooニュース記事タイトルをDuckDuckGoで検索
// @namespace    https://github.com/Kdroidwin/Yahoo-DuckDuckGo-/
// @version      1.0
// @description  Yahooニュースの特定の画像をクリックすると記事タイトルをDuckDuckGoで検索（元のリンク無効化）
// @author       kdroidwin
// @license GPL-3.0 license
// @match        *://news.yahoo.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528519/Yahoo%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E8%A8%98%E4%BA%8B%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92DuckDuckGo%E3%81%A7%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/528519/Yahoo%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E8%A8%98%E4%BA%8B%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92DuckDuckGo%E3%81%A7%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchTab = null; // 既存の検索タブを管理

    // クリックを無効化し検索する対象の画像
    let imgSelectors = [
        'img[src*="s.yimg.jp/images/news/cobranding/"]',
        'img[src*="s.yimg.jp/images/news-cpm/logo/"]'
    ];

    function setupSearchFeature() {
        document.querySelectorAll(imgSelectors.join(', ')).forEach(img => {
            img.style.cursor = 'pointer'; // クリックできるように
            img.addEventListener('click', function(event) {
                event.preventDefault(); // 元のリンク遷移を防ぐ
                event.stopPropagation(); // 親要素のクリックイベントも防ぐ

                let title = document.title.replace(' - Yahoo!ニュース', '');
                let searchUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(title);

                if (searchTab && !searchTab.closed) {
                    // 既存の検索タブがあればURLを更新
                    searchTab.location.href = searchUrl;
                    searchTab.focus();
                } else {
                    // 新規タブを開く
                    searchTab = window.open(searchUrl, '_blank');
                }
            }, true); // キャプチャリングフェーズで実行
        });
    }

    // 初回実行
    setupSearchFeature();

    // 動的に追加された要素にも適用するための監視
    let observer = new MutationObserver(setupSearchFeature);
    observer.observe(document.body, { childList: true, subtree: true });
})();
