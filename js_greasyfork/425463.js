// ==UserScript==
// @name            AtCoder Difficulty Colorizer for Typical 90
// @namespace       https://github.com/hotarunx
// @homepage        https://github.com/hotarunx/atcoder-difficulty-colorizer-for-typical90
// @supportURL      https://github.com/hotarunx/atcoder-difficulty-colorizer-for-typical90/issues
// @version         0.0.3
// @description     競プロ典型 90 問の問題ページのタイトルを色付けします
// @author          hotarunx
// @match           https://atcoder.jp/contests/typical90/*
// @match           https://kenkoooo.com/atcoder/*
// @grant           none
// @license         MIT
//
// Copyright(c) 2020 hotarunx
// This software is released under the MIT License, see LICENSE or https://github.com/hotarunx/atcoder-difficulty-colorizer-for-typical90/blob/main/LICENSE.
//
// @downloadURL https://update.greasyfork.org/scripts/425463/AtCoder%20Difficulty%20Colorizer%20for%20Typical%2090.user.js
// @updateURL https://update.greasyfork.org/scripts/425463/AtCoder%20Difficulty%20Colorizer%20for%20Typical%2090.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    setTimeout(()=>{
        // タイトルを色付けする
        // タイトルのHTML要素を取得する
        const title = document.getElementsByClassName("h2")[0];
        // タイトルが存在するなら色付けする
        if (title != undefined) {
            paintColor(title);
        }

        // aタグを色付けする
        const a_elements = document.getElementsByTagName("a");
        // すべてのaタグを色付けする
        for (const element of a_elements) {
            paintColor(element);
        }

        // tdタグを色付けする
        const td_elements = document.getElementsByTagName("td");
        // すべてのtdタグを色付けする
        for (const element of td_elements) {
            paintColor(element);
        }
    }, 1000);
});

// 問題名の難易度に対応する色のカラーコードを返す
// テキストに含まれる★数に対応する色のカラーコードを返す
// テキストが問題名ではない、つまりテキストに★数が含まれないならundefinedを返す
function returnDifficultyColor(title) {
    if (title.match("★1")) return "#808080";
    if (title.match("★2")) return "#808080";
    if (title.match("★3")) return "#804000";
    if (title.match("★4")) return "#008000";
    if (title.match("★5")) return "#00C0C0";
    if (title.match("★6")) return "#0000FF";
    if (title.match("★7")) return "#C0C000";
    return undefined;
}

// HTML要素を色付けする
function paintColor(element) {
    // 色を取得する
    const color = returnDifficultyColor(element.textContent);
    // もしこのHTML要素が問題名ではないなら関数を終了する
    if (color === undefined) {
        return;
    }
    // 色付けする
    element.style.color = color;
}
