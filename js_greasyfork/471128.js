// ==UserScript==
// @name         AtCoder Solve Declaration
// @version      0.1
// @license      MIT 
// @description  問題文の隣にツイートするボタンを表示します。
// @author       Kyo_s_s
// @match        https://atcoder.jp/contests/*/tasks/*
// @exclude      https://atcoder.jp/contests/*/tasks/*/editorial
// @namespace https://greasyfork.org/users/1129958
// @downloadURL https://update.greasyfork.org/scripts/471128/AtCoder%20Solve%20Declaration.user.js
// @updateURL https://update.greasyfork.org/scripts/471128/AtCoder%20Solve%20Declaration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        const button = document.createElement("button");
        button.innerHTML = "ときます宣言";
        button.classList.add("btn", "btn-default", "btn-sm");
        button.addEventListener("click", function() {
            const text = "ときます " + window.location.href + "\n#競プロ精進";
            const tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
            window.open(tweetUrl);
        });

        return button;
    }

    function insertButton() {
        const title = document.querySelector(".h2");
        if (title) {
            title.appendChild(createButton());
        }
    }

    window.addEventListener("load", insertButton);
})();