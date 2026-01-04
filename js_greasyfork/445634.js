// ==UserScript==
// @name    AtCoder Default Search Fields
// @namespace    http://tampermonkey.net/
// @version    0.2
// @description    すべての提出検索にデフォルトの値を設定します
// @author    Chippppp
// @license    MIT
// @match    https://atcoder.jp/contests/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/445634/AtCoder%20Default%20Search%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/445634/AtCoder%20Default%20Search%20Fields.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let path = location.pathname.split("/");
    let ul = document.getElementsByClassName("dropdown-menu")[2];
    if (ul == undefined) return;
    let problem = "";
    let idx = path.indexOf("tasks");
    if (idx != -1 && idx + 1 < path.length) {
        problem = path[idx + 1];
    }
    if (!ul.children[0].children[0].href.endsWith("me")) ul.children[0].children[0].href += `?f.Task=${problem}&f.LanguageName=&f.Status=AC&f.User=`;
    ul = document.getElementsByClassName("nav nav-pills small")[0];
    if (ul == undefined) return;
    if (!ul.children[0].children[0].href.endsWith("me")) ul.children[0].children[0].href += `?f.Task=&f.LanguageName=&f.Status=AC&f.User=`;
})();