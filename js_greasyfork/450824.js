// ==UserScript==
// @name         CodeForces Print Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Help you to print complete problemset from CodeForces with only 1 column
// @author       SaoJiaFei
// @match        https://codeforces.com/contest/*/problems
// @match        https://codeforces.com/gym/*/problems
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450824/CodeForces%20Print%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450824/CodeForces%20Print%20Helper.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    // Copy from: https://stackoverflow.com/a/46285637
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}
(function() {
    'use strict';
    addGlobalStyle('.compact-problemset .problem-frames { column-count: 1; }');
})();