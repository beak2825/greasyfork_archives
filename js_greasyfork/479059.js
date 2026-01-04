// ==UserScript==
// @name         To Red Coder
// @description  誰でもレッドコーダーになれる拡張機能です。
// @namespace    https://atcoder.jp/
// @version      1.0
// @author       Sky_Thunder
// @match        https://atcoder.jp/users/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479059/To%20Red%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/479059/To%20Red%20Coder.meta.js
// ==/UserScript==

k=2800/rating_history[rating_history.length-1].NewRating;
for(c=0;c<rating_history.length;c++){
    r=rating_history[c];
    r.NewRating=Math.round(r.NewRating*k),r.OldRating=Math.round(r.OldRating*k);
}