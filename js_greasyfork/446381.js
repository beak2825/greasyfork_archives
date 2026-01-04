// ==UserScript==
// @name         Gitee CSV Formatter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Format CSV files in gitee repo.
// @author       szx
// @match        *://gitee.com/*.csv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446381/Gitee%20CSV%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/446381/Gitee%20CSV%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let box = document.getElementsByTagName("pre")[0];
    let lines = box.getElementsByClassName("line");
    let tb = "<table>";
    for (let line of lines) {
        let words = line.innerHTML.split(/,|;|\t/);
        tb += "<tr>";
        for (let word of words) {
            tb += "<td>" + word + "</td>";
        }
        tb += "</tr>";
    }
    tb += "</table>";
    box.innerHTML = tb;

    let sty = document.createElement("style");
    sty.innerHTML = "table { border-collapse: collapse; border-spacing: 0; } td { max-width: 5em; padding: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }  td:nth-child(1) { max-width: 16em; } tr:nth-child(odd) { background-color: #eee; } tr:nth-child(even) { background-color: #fff; }";
    document.head.append(sty);
})();