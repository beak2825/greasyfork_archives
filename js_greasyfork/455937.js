// ==UserScript==
// @name         AtCoder WAになっておどろう
// @namespace    https://github.com/jnc-explosion
// @version      1.0
// @description  atcoder上で「WA」が「WAになっておどろう」になる。オ〜オ〜　さぁWAになって踊ろ　ララララ〜　すぐにわかるから
// @author       jnc-explosion
// @match        https://atcoder.jp/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455937/AtCoder%20WA%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%8A%E3%81%A9%E3%82%8D%E3%81%86.user.js
// @updateURL https://update.greasyfork.org/scripts/455937/AtCoder%20WA%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%8A%E3%81%A9%E3%82%8D%E3%81%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("span.label-warning:contains('WA')").html("WAになっておどろう").attr("data-original-title","オ〜オ〜　さぁWAになって踊ろ\nララララ〜　すぐにわかるから");
})();