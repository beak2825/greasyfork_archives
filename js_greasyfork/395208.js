// ==UserScript==
// @name         DuoLeaderboardRemover+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make leaderboard invisible
// @author       EA2
// @match        *://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395208/DuoLeaderboardRemover%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/395208/DuoLeaderboardRemover%2B.meta.js
// ==/UserScript==

(function() {
    // Enable global CSS adding
    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    }

    // Add CSS
    addGlobalStyle('._2ANgP.a5SW0 {display: none !important;}')
    addGlobalStyle('.-X3R5._25sFh {display: none !important;}')
    addGlobalStyle('._20HVc._3J-7b {display: none !important;}')
})();