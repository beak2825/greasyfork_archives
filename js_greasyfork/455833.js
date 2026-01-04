// ==UserScript==
// @name         AtCoder TLE to JR
// @namespace    https://github.com/jnc-explosion
// @version      1.1
// @description  atcoder上で「TLE」が「JR」になる。コンテスト駅でのコード事故のため、実行時間に遅れが発生しています。
// @author       jnc-explosion
// @match        https://atcoder.jp/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455833/AtCoder%20TLE%20to%20JR.user.js
// @updateURL https://update.greasyfork.org/scripts/455833/AtCoder%20TLE%20to%20JR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("span.label-warning:contains('TLE')").html("JR").attr("data-original-title","実行に遅延が発生しています");
})();