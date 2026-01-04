// ==UserScript==
// @name         AC Custom
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Atcoderの結果表示に飽きた人へ
// @author       YumaHJET
// @match        https://atcoder.jp/contests/*/submissions/me
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478609/AC%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/478609/AC%20Custom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var AC_message = "はい天才";
    var WA_message = "馬鹿じゃないの？";
    var TLE_message = "遅すぎ";

    $('.label-success').text(AC_message);
    $('.label-warning[data-original-title="不正解"]').text(WA_message);
    $('.label-warning[data-original-title="実行時間制限超過"]').text(TLE_message);
})();