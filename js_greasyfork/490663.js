// ==UserScript==
// @name        AtCoder Scoreboard Pinner
// @namespace   https://atcoder.jp/
// @version     0.2
// @description 配点表をコンテスト情報の最上部に配置するスクリプト
// @author      hayatroid
// @license     MIT
// @match       https://atcoder.jp/contests/*
// @exclude     https://atcoder.jp/contests/
// @exclude     /^https:\/\/atcoder\.jp\/contests\/.+?\/.+$/
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/490663/AtCoder%20Scoreboard%20Pinner.user.js
// @updateURL https://update.greasyfork.org/scripts/490663/AtCoder%20Scoreboard%20Pinner.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function () {
    // 配点表を取得
    var table = $("#contest-statement > .lang > .lang-ja table")
        .filter(function () {
            var th = $(this).find("thead > tr > th");
            return th.length === 2 && th.eq(0).text() === "問題" && th.eq(1).text() === "点数";
        });

    if (table.length !== 1) throw new Error("Scoreboard cannot be found.");
    table = table.eq(0);

    // 配点表を複製し、コンテスト情報の最上部に配置
    $("#contest-statement").prepend(table.clone());
})();
