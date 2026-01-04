// ==UserScript==
// @name         AtCoderMLEtoHisoka
// @namespace    https://github.com/aplysia56108/AtcoderMLEtoHisoka
// @version      1.0
// @description  【ネタスクリプト】atcoder上で「MLE」が「キミの敗因は容量（メモリ）のムダ使い❤︎」になる。
// @author       aplysia56108
// @match        https://atcoder.jp/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478297/AtCoderMLEtoHisoka.user.js
// @updateURL https://update.greasyfork.org/scripts/478297/AtCoderMLEtoHisoka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("span.label-warning:contains('MLE')").html("キミの敗因は容量（メモリ）のムダ使い❤︎");
})();