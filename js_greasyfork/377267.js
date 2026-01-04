// ==UserScript==
// @name         acscores-link
// @namespace    http://atcoder-scores.herokuapp.com/
// @version      0.1.3
// @description  AtCoder に AtCoder Scores へのリンクを追加します．
// @author       rsk0315
// @match        https://atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377267/acscores-link.user.js
// @updateURL https://update.greasyfork.org/scripts/377267/acscores-link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (userScreenName === '') return;
    if (userScreenName.match(/\W/)) return;

    var match = window.location.href.match(/^https:\/\/atcoder\.jp\/users\/(\w+)$/);
    var param = 'user=' + userScreenName;
    if (match && match[1] != userScreenName)
        param += '&rivals=' + match[1];
    $($('#navbar-collapse .dropdown-menu li.divider')[0]).before(
        `<li><a href="//atcoder-scores.herokuapp.com/?${param}" target="_blank">AtCoder Scores</a></li>`
    );

    if (!match) return;
    var user = match[1];
    // 自分のページだけで表示される [アイコン設定] に注意
    $($('a.btn-text').last()).after(
        ` <span class="divider"></span> <a href="//atcoder-scores.herokuapp.com/graph?user=${user}" class="btn-text" target="_blank">精進グラフ&nbsp;<span class="glyphicon glyphicon-new-window"></span></a>`
    );
})();