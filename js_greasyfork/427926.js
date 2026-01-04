// ==UserScript==
// @name         Codeforces Bold Emphasizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Emphasize the bold text in the problem statement.
// @author       kuma807
// @match        https://codeforces.com/contest/*/problem/*
// @icon         https://www.google.com/s2/favicons?domain=codeforces.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427926/Codeforces%20Bold%20Emphasizer.user.js
// @updateURL https://update.greasyfork.org/scripts/427926/Codeforces%20Bold%20Emphasizer.meta.js
// ==/UserScript==

var bold = document.getElementsByClassName("tex-font-style-bf");
for (var i = 0; i < bold.length; i++) {
    bold[i].style.color = "#FF0000";
}
