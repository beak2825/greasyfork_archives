// ==UserScript==
// @name         ひまわり動画保管庫サムネイル縮小
// @namespace    https://greasyfork.org/ja/users/1441620-crawler
// @version      1.2
// @description  サムネイル画像を縮小する
// @author       crawler
// @match        https://kyuzerogo.sakura.ne.jp/s_flower/s_flower.php
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528566/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A%E5%8B%95%E7%94%BB%E4%BF%9D%E7%AE%A1%E5%BA%AB%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E7%B8%AE%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528566/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A%E5%8B%95%E7%94%BB%E4%BF%9D%E7%AE%A1%E5%BA%AB%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E7%B8%AE%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // サムネイル画像のクラス名と対応する親要素のクラス名を指定
    const thumbnailConfig = [
        { thumbnailClass: 'thum_m4_1', parentClass: 'thread_m4_1' },
        { thumbnailClass: 'thum_m4', parentClass: 'thread_m4' },
        { thumbnailClass: 'thum_m3', parentClass: 'thread_m3' }
    ];

    // サムネイルと親要素のサイズを変更する関数
    function resizeThumbnails() {
        thumbnailConfig.forEach(config => {
            const thumbnails = document.getElementsByClassName(config.thumbnailClass);
            const parents = document.getElementsByClassName(config.parentClass);

            // サムネイル画像のサイズを変更
            for (let i = 0; i < thumbnails.length; i++) {
                const thumbnail = thumbnails[i];
                thumbnail.style.width = '160px'; // 幅を160pxに設定
                thumbnail.style.height = 'auto'; // 高さを自動調整
            }

            // 親要素のレイアウトを調整
            for (let i = 0; i < parents.length; i++) {
                const parent = parents[i];
                parent.style.width = '160px'; // 幅を160pxに設定
                parent.style.display = 'inline-block'; // インラインブロックに変更
                parent.style.verticalAlign = 'top'; // 上端揃え
                parent.style.marginLeft = '10px'; // 横の間隔（左側）
                parent.style.marginRight = '10px'; // 横の間隔（右側）
                parent.style.marginTop = '50px'; // 縦の間隔（上側）
                parent.style.marginBottom = '20px'; // 縦の間隔（下側）
                parent.style.overflow = 'visible'; // はみ出たコンテンツを表示
                parent.style.height = '90px'; // 高さを自動調整
            }
        });
    }

    // テキスト部分のスタイルを調整
    const style = document.createElement('style');
    style.textContent = `
        .title_m40_1, .title_m40, .title_m30 {
            display: block; /* ブロック要素として表示 */
            width: 100%; /* 親要素の幅に合わせる */
            font-size: 12px; /* フォントサイズを小さくする */
            white-space: normal; /* テキストを折り返す */
            overflow: visible; /* はみ出たテキストを表示 */
            text-overflow: clip; /* テキストを切り捨てない */
            margin-top: -105px; /* サムネイルとの間に余白を追加 */
            text-align: center; /* テキストを中央揃え */
            padding-top: 0px;
            line-height: 1.4; /* 行の高さを調整 */
        }
    `;
    document.head.appendChild(style);

    // 初期ロード時にサムネイルのサイズを変更
    resizeThumbnails();

    // MutationObserverを使用して動的に追加される要素を監視
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 新しいノードが追加された場合、サムネイルのサイズを変更
                resizeThumbnails();
            }
        });
    });

    // 監視対象の設定
    const observerConfig = {
        childList: true, // 子要素の変更を監視
        subtree: true   // すべての子孫要素を監視
    };

    // ドキュメント全体を監視
    observer.observe(document.body, observerConfig);
})();