// ==UserScript==
// @name         AtCoder NoCopy
// @namespace    https://atcoder.jp/
// @version      0.1
// @description  Prevents inadvertent copying
// @author       harurun
// @match        https://atcoder.jp/contests/abc*/tasks/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497349/AtCoder%20NoCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/497349/AtCoder%20NoCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let statement_div=document.getElementById("task-statement");
    statement_div.setAttribute("oncopy","return false;");
    statement_div.setAttribute("oncontextmenu","return false;");
})();