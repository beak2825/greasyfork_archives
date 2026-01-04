// ==UserScript==
// @name         DOSPARA 自動カート追加
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  DOSPARAの商品ページ（https://www.dospara.co.jp/SBR1753/IC489402.html）で「カートに入れる」を自動クリックします。
// @author       Your Name
// @match        https://www.dospara.co.jp/SBR1753/IC489402.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528811/DOSPARA%20%E8%87%AA%E5%8B%95%E3%82%AB%E3%83%BC%E3%83%88%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528811/DOSPARA%20%E8%87%AA%E5%8B%95%E3%82%AB%E3%83%BC%E3%83%88%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 指定テキストを含む要素を探してクリックする関数
    function clickCartButton() {
        // aタグ、buttonタグ、input[type="submit"] などを対象にします
        const elements = document.querySelectorAll('a, button, input[type="submit"]');
        for (let el of elements) {
            // 要素のテキスト内容に「カートに入れる」が含まれているかチェック
            if (el.textContent && el.textContent.trim().includes("カートに入れる")) {
                console.log("カート追加ボタンを自動クリックします:", el);
                el.click();
                return true; // クリックが実行されたら終了
            }
        }
        return false;
    }

    // ページ読み込み完了後、指定要素が現れるまで定期的にチェック
    function waitForCartButton() {
        if (!clickCartButton()) {
            // 要素が見つからなかった場合、1秒後に再度試行
            setTimeout(waitForCartButton, 1000);
        }
    }

    // ページロード完了を待ってから実行
    window.addEventListener("load", waitForCartButton);
})();
