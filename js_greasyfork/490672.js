// ==UserScript==
// @name        AtCoder Show Me Score Table
// @namespace   https://atcoder.jp/
// @version     0.4
// @description コンテスト名を配点に置き換えちゃうスクリプト
// @author      hayatroid
// @license     MIT
// @match       https://atcoder.jp/contests/*
// @exclude     https://atcoder.jp/contests/*/json
// @downloadURL https://update.greasyfork.org/scripts/490672/AtCoder%20Show%20Me%20Score%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/490672/AtCoder%20Show%20Me%20Score%20Table.meta.js
// ==/UserScript==

(async () => {
    // キャッシュを読み込む
    const cache = localStorage.getItem(`score_table_${contestScreenName}`);
    if (cache) {
        document.querySelector(".contest-title").textContent = cache;
        return;
    }

    // 配点 (e.g. "100 - 200 - 300 - 400 - 500 - 600") の取得
    const res = await fetch(`https://atcoder.jp/contests/${contestScreenName}`)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.text();
        })
        .then((text) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            // 配点の書かれた table の取得
            const table = [...doc.querySelectorAll("#contest-statement > .lang > .lang-ja table")]
                .filter((element) => {
                    const th = [...element.querySelectorAll("thead > tr > th")];
                    return th.length === 2 && th[0].textContent === "問題" && th[1].textContent === "点数";
                });
            if (table.length !== 1) throw new Error("Scoreboard cannot be found.");
            return table[0];
        })
        .then((table) => {
            // table から配点を取り出し，ハイフンでつなぐ
            const res = [...table.querySelectorAll("tbody > tr > td")]
                .filter((element, index) => {
                    return index % 2 === 1;
                })
                .map((element) => {
                    return element.textContent;
                })
                .join(" - ");
            return res;
        });

    // キャッシュする
    if (res[0] !== "?") {
        localStorage.setItem(`score_table_${contestScreenName}`, res);
    }

    // コンテスト名を配点に置き換える
    document.querySelector(".contest-title").textContent = res;
})();
