// ==UserScript==
// @name         フリマウォッチ: 購入確認画面から商品ページを開く （パッチ）

// @namespace    http://tampermonkey.net/
// @version      0.1
// @license mit
// @description  フリマウォッチで開かれる"購入内容の確認"画面にて、商品名エリアをクリックすることで商品詳細ページを開けるショートカットリンクを追加するプログラムスクリプト。

// @author       You
// @match        https://jp.mercari.com/purchase/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/456656/%E3%83%95%E3%83%AA%E3%83%9E%E3%82%A6%E3%82%A9%E3%83%83%E3%83%81%3A%20%E8%B3%BC%E5%85%A5%E7%A2%BA%E8%AA%8D%E7%94%BB%E9%9D%A2%E3%81%8B%E3%82%89%E5%95%86%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E9%96%8B%E3%81%8F%20%EF%BC%88%E3%83%91%E3%83%83%E3%83%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456656/%E3%83%95%E3%83%AA%E3%83%9E%E3%82%A6%E3%82%A9%E3%83%83%E3%83%81%3A%20%E8%B3%BC%E5%85%A5%E7%A2%BA%E8%AA%8D%E7%94%BB%E9%9D%A2%E3%81%8B%E3%82%89%E5%95%86%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E9%96%8B%E3%81%8F%20%EF%BC%88%E3%83%91%E3%83%83%E3%83%81%EF%BC%89.meta.js
// ==/UserScript==

const waitUntil = (condition) => {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            if (!condition()) return;
            clearInterval(interval)
            resolve()
        }, 100)
    })
}

(async () => {

    let selector = 'div[class^=Top__ItemSummary-]'
    let itemId = document.location.href.match(/\/([\d\w]+$)/)[1]

    await waitUntil(() => document.querySelector(selector) !== null );

    document.querySelector(selector).addEventListener('click', () => {
        window.open(`https://jp.mercari.com/item/${itemId}`)
    })

})();

