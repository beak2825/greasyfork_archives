// ==UserScript==
// @name         Battlefy フォント変更
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Battlefy表示サイズを最適化
// @author       YourName
// @match        https://battlefy.com/apex-legends-global-series-year-5*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527806/Battlefy%20%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/527806/Battlefy%20%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        * {
            font-family: Meiryo, "Yu Gothic", "Hiragino Kaku Gothic ProN", "MS PGothic", sans-serif !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
        }

        /* タイトルなどの大きい文字用の調整 */
        h1, h2, h3 {
            font-size: 0.9em !important;
        }

        /* 入力欄のフォント継承 */
        input, textarea, button {
            font-family: inherit !important;
        }

        /* .\!text-2xlクラスのフォントと行間を変更 */
        .\\!text-2xl {
            font-size: 1.0rem !important;
            line-height: 1.0rem !important;
        }

        /* .py-8クラスにパディングを追加 */
        .py-8 {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
        }
    `;

    document.head.appendChild(style);
})();
