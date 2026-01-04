// ==UserScript==
// @name     add-typical90-link
// @author uesugi
// @description 典型90にgithubの解説リンクを追加
// @version  0.0.2
// @include  https://atcoder.jp/contests/typical90*
// @exclude  https://atcoder.jp/contests/
// @exclude  https://atcoder.jp/contests/archive
// @grant    none
// @namespace https://greasyfork.org/users/703686
// @downloadURL https://update.greasyfork.org/scripts/427326/add-typical90-link.user.js
// @updateURL https://update.greasyfork.org/scripts/427326/add-typical90-link.meta.js
// ==/UserScript==

let parent = document.getElementsByClassName("nav nav-tabs")[0];
let button = document.createElement("li");
parent.appendChild(button);
let a = document.createElement("a");
button.appendChild(a);
a.textContent = "解説リンク";
a.setAttribute("href", "https://github.com/E869120/kyopro_educational_90/tree/main/editorial");