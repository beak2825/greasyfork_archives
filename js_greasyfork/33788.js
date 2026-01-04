// ==UserScript==
// @name        Enable Autocomplete on shikaku-kougi.jp
// @namespace   https://greasyfork.org/ja/users/6866-ppppq
// @include     https://shikaku-kougi.jp/rpv/
// @description 総合資格のログインページ上でブラウザのオートコンプリートを有効にし、いちいち毎回ログイン情報を入力しなくてもいいようにする。
// @version     0.1.20171005
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33788/Enable%20Autocomplete%20on%20shikaku-kougijp.user.js
// @updateURL https://update.greasyfork.org/scripts/33788/Enable%20Autocomplete%20on%20shikaku-kougijp.meta.js
// ==/UserScript==

var inputs = document.querySelectorAll('input[type=password][autocomplete="off"]');

for (var input of inputs) {
    input.autocomplete = 'on';
}