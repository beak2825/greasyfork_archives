// ==UserScript==
// @name         Hide Sponsored Products on Amazon JP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide sponsored products on Amazon.co.jp
// @author       SpiralArrow
// @match        https://www.amazon.co.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508206/Hide%20Sponsored%20Products%20on%20Amazon%20JP.user.js
// @updateURL https://update.greasyfork.org/scripts/508206/Hide%20Sponsored%20Products%20on%20Amazon%20JP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定期的にページをチェックしてスポンサー商品を非表示にする
    setInterval(() => {
        // スポンサーリンクに関連付けられた要素を取得
        const sponsoredElements = document.querySelectorAll('[data-component-type="sp-sponsored-result"], [aria-label="Sponsored"]');
        
        sponsoredElements.forEach(element => {
            element.style.display = 'none';
        });
    }, 1000); // 1秒ごとにチェック
})();