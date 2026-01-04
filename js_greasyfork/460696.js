// ==UserScript==
// @name         AtCoder Search Query Holder
// @namespace    https://twitter.com/cpg_tea
// @version      1.0
// @description  「すべての提出」「自分の提出」ページを遷移し合うときに検索条件を保持する
// @author       gmm_tea
// @license      MIT
// @match        https://atcoder.jp/contests/*/submissions?*
// @match        https://atcoder.jp/contests/*/submissions/me?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460696/AtCoder%20Search%20Query%20Holder.user.js
// @updateURL https://update.greasyfork.org/scripts/460696/AtCoder%20Search%20Query%20Holder.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // 「すべての提出」「自分の提出」ボタンを取得
    const ul = document.querySelector("#main-container > div.row > div:nth-child(2) > ul");
    const buttons = Array.from(ul.querySelectorAll("li > a")).slice(0, 2);

    // リンク先に今の検索条件を書き加える
    buttons.forEach((button) => button.setAttribute("href", button.getAttribute("href") + location.search));
})();
