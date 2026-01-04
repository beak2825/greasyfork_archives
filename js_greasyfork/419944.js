// ==UserScript==
// @name         Steam Fake Group Checker
// @version      1.0
// @description  Checks if Steam groups contains unprintable unicode
// @author       Tsukani
// @match        https://steamcommunity.com/groups/*
// @grant        none
// @namespace https://greasyfork.org/users/305208
// @downloadURL https://update.greasyfork.org/scripts/419944/Steam%20Fake%20Group%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/419944/Steam%20Fake%20Group%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var txt = (($J(".grouppage_header_name").text() + $J(".grouppage_header_abbrev").text()).replace(/\r?\n|\r/g, "")).replace(/	/g, "");
    txt.match(/[^ -~]+/g);
    if (txt.match(/[^ -~]+/g) != null) {
        console.log("Fake group detected");
        $J(".grouppage_header_name").css("color", "red");
}
})();