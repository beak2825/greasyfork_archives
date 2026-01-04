// ==UserScript==
// @name         AtCoder Graph Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  レーティンググラフの横軸を日付から回数に変更します
// @author       ogawakun
// @match        https://atcoder.jp/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454517/AtCoder%20Graph%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/454517/AtCoder%20Graph%20Time.meta.js
// ==/UserScript==

$(function() {
  "use strict";
  const size = rating_history.length;
  const first_time = rating_history[0].EndTime;
  const all_time = rating_history[size - 1].EndTime - first_time;
  for (let i = 0; i < size; i++) {
    rating_history[i].EndTime = first_time + all_time / size * i;
  }
})
();
