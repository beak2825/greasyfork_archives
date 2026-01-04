// ==UserScript==
// @name         CF problemset to contest
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Display CF problems in the contest field instead of problemset
// @author       ouuan
// @match        *://codeforces.com/problemset*
// @match        *://codeforc.es/problemset*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391152/CF%20problemset%20to%20contest.user.js
// @updateURL https://update.greasyfork.org/scripts/391152/CF%20problemset%20to%20contest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var matches = window.location.href.match(/\/problemset\/problem\/([1-9][0-9]*)\/([A-Z][1-9]?)/);
    if (matches) window.location.replace("https://codeforces.com/contest/" + matches[1] + "/problem/" + matches[2]);

    var links = document.querySelectorAll('a');

    for (var link of links) {
        matches = link.href.match(/\/problemset\/problem\/([1-9][0-9]*)\/([A-Z][1-9]?)/);
        if (matches) link.href = ("https://codeforces.com/contest/" + matches[1] + "/problem/" + matches[2]);
    }
})();
