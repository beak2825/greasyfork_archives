// ==UserScript==
// @name         Link Click Tracker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  クリック済みリンクを記録し、視覚的に分かるように表示
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525114/Link%20Click%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/525114/Link%20Click%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ハッシュ値を計算する関数 (SHA-256 + 先頭8文字)
    async function computeHash(link) {
        const encoder = new TextEncoder();
        const data = encoder.encode(link);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
        return hashHex.substring(0, 8);
    }

    // リンクにチェックマークを追加する関数
    function addCheckmark(link) {
        // リンク内にimgタグが含まれていない場合のみチェックマークを追加
        if (!link.textContent.includes('✅') && !link.querySelector("img")) {
            link.textContent = "✅ " + link.textContent; // テキストの先頭にチェックマークを追加
        }
    }

    // ページ内のすべてのリンクをチェック
    async function checkLinks() {
        const visitedLinks = JSON.parse(localStorage.getItem("visitedLinks")) || {};
        const links = document.querySelectorAll("a[href]");

        for (const link of links) {
            const href = link.href;

            // ハッシュ値を計算して確認
            const hash = await computeHash(href);
            if (visitedLinks[hash]) {
                addCheckmark(link);
            }

            // クリックイベントを追加
            link.addEventListener("click", async () => {
                const clickHash = await computeHash(href);
                visitedLinks[clickHash] = true;
                localStorage.setItem("visitedLinks", JSON.stringify(visitedLinks));
                checkLinks();
            });
        }
    }

    // ページロード時にリンクをチェック
    checkLinks();
})();
