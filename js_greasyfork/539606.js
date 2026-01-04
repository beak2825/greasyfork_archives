// ==UserScript==
// @name         X/Twitter スマホブラウザ向け ナビゲーションシンプル化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  X（旧Twitter）のナビゲーションを「ホーム」「検索」「通知」「DM」のみに絞り込み、UIをシンプルにします。
// @author       Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539606/XTwitter%20%E3%82%B9%E3%83%9E%E3%83%9B%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E5%90%91%E3%81%91%20%E3%83%8A%E3%83%93%E3%82%B2%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539606/XTwitter%20%E3%82%B9%E3%83%9E%E3%83%9B%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E5%90%91%E3%81%91%20%E3%83%8A%E3%83%93%E3%82%B2%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 非表示にしたいナビゲーション項目のCSSセレクタを定義します。
    // aria-labelやhref属性を利用して、PC版のサイドバーとモバイル版のボトムバーの両方に対応します。
    const styles = `
        /* --- 非表示にするナビゲーション項目 --- */

        /* Grok */
        a[href="/i/grok"],
        a[aria-label="Grok"] {
            display: none !important;
        }

        /* プレミアム */
        a[data-testid="premium-hub-tab"],
        a[aria-label="プレミアム"],
        a[aria-label="Premium"] {
            display: none !important;
        }

        /* リスト */
        a[href$="/lists"],
        a[aria-label="リスト"],
        a[aria-label="Lists"] {
            display: none !important;
        }

        /* ブックマーク */
        a[href="/i/bookmarks"],
        a[aria-label="ブックマーク"],
        a[aria-label="Bookmarks"] {
            display: none !important;
        }

        /* コミュニティ */
        a[href$="/communities"],
        a[aria-label="コミュニティ"],
        a[aria-label="Communities"] {
            display: none !important;
        }

        /* プロフィール */
        a[data-testid="AppTabBar_Profile_Link"],
        a[aria-label="プロフィール"],
        a[aria-label="Profile"] {
            display: none !important;
        }

        /* もっと見る */
        a[data-testid="AppTabBar_More_Link"],
        a[aria-label="もっと見る"],
        a[aria-label="More"] {
            display: none !important;
        }
    `;

    // スタイルをページに適用します。
    GM_addStyle(styles);
})();