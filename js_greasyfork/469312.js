// ==UserScript==
// @name           AtCoder Add link to Problems
// @namespace      https://github.com/yi7242
// @version        1.0
// @description    Add links to AtCoder Problems Userpage on AtCoder profile.
// @description:ja AtCoderのプロフィールページにAtCoder Problemsへのリンクを追加するユーザースクリプトです。
// @author         yi7242
// @match          https://atcoder.jp/users/*
// @license        MIT
// @exclude        https://atcoder.jp/users/?/history
// @exclude        https://atcoder.jp/users/?/history/*
// @downloadURL https://update.greasyfork.org/scripts/469312/AtCoder%20Add%20link%20to%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/469312/AtCoder%20Add%20link%20to%20Problems.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let dlTables = document.getElementsByClassName('dl-table');
    let tbody = dlTables[0].getElementsByTagName('tbody')[0];
    let userName = document.getElementsByClassName('username')[0].getElementsByTagName('span')[0].textContent;
    let link = "https://kenkoooo.com/atcoder/#/user/" + userName;
    let insertPoint = document.getElementsByClassName("col-md-3 col-sm-12")[0].getElementsByTagName('h3')[0];
    let newTr = '<tr><th class="no-break">Problems</th><td><a href=' +link+' target="_blank" style="">' + userName + '</a></td></tr>'
    tbody.insertAdjacentHTML("beforeend", newTr)
})();
