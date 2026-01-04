// ==UserScript==
// @name         AtCoder To Luogu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 AtCoder 题目界面显示前往 Luogu 题面的按钮
// @author       Liuxizai
// @license      MIT
// @icon         https://img.atcoder.jp/assets/favicon.png
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490911/AtCoder%20To%20Luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/490911/AtCoder%20To%20Luogu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let at_problem_id = window.location.href.split('/')[6].replace(/\?.*$/, "");
    let lg_problem_id = "AT_" + at_problem_id;
    let h2s = document.querySelector('span.h2');
    h2s.innerHTML += '<a class="btn btn-default btn-sm" href="https://www.luogu.com.cn/problem/' + lg_problem_id + '" target="_blank">Luogu Statement</a>';
})();