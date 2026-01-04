// ==UserScript==
// @name         Atcoder Title Copy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Atcoderの問題ページにタイトルをコピーするボタンを追加する
// @author       sin471
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/434033/Atcoder%20Title%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/434033/Atcoder%20Title%20Copy.meta.js
// ==/UserScript==

/* ユーザー設定項目 */
/*
    先頭のアルファベットとハイフンの除外
    (A - AtCoder → AtCoder)
    除外する場合はtrue
    除かない場合はfalse
*/
const is_remove_head = false //true or false

/*
    拡張子の追加
    追加する場合はダブルクオテーションの中に拡張子を入力
    (A - AtCoder → A - AtCoder.hoge)
*/
const extension = "";//ex: .hoge

/*
    Copied!の表示時間
    デフォルトでは1500ms(1.5秒)
*/
const sleepTime = 1500
/* 設定項目終了 */

function process_text(text) {
    //ユーザーが設定した拡張子の追加
    text += extension
    //先頭のアルファベットとハイフンを除去するか
    if (is_remove_head) {
        text = text.slice(4)
    }
    return text
}

function copy() {
    var title = document.getElementsByClassName("h2")[0];
    //改行文字を削除
    var text = title.firstChild.textContent.trim();
    //ユーザー設定に合わせて加工
    text = process_text(text)

    navigator.clipboard.writeText(text);
};

// ミリ秒間待機する
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function notifyCopied(a) {
    a = this.name;
    a.textContent = "Copied!";
    await sleep(1500);
    a.textContent = "Copy";
};

function create_button() {
    var parent = document.getElementsByClassName("h2");
    var a = document.createElement("a");
    a.textContent = "Copy";
    //AtcoderのCopyボタンと同じCSSを適用
    a.setAttribute("class", "btn btn-default btn-sm");
    parent[0].appendChild(a);
    a.addEventListener('click', copy, false);
    //ボタン内のテキスト内容を一定時間"Copied!"に書き換え
    a.addEventListener('click', { name: a, handleEvent: notifyCopied });
};
create_button();