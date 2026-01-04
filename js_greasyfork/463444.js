// ==UserScript==
// @name            AtCoder Hide Virtual Standings Tab
// @name:ja         AtCoder Hide Virtual Standings Tab
// @namespace       https://github.com/xe-o
// @version         0.1
// @description     Hide the "Virtual Standings" tab on the AtCoder task page.
// @description:ja  AtCoder問題ページの「バーチャル順位表」のタブを非表示にします。
// @author          XERO
// @license         MIT
// @match           https://atcoder.jp/contests/*/tasks/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/463444/AtCoder%20Hide%20Virtual%20Standings%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/463444/AtCoder%20Hide%20Virtual%20Standings%20Tab.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var link = document.querySelector("a[href$='/standings/virtual']");

  if (link) {
    link.parentElement.style.display = "none";
  }
})();
