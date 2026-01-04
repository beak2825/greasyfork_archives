// ==UserScript==
// @name         Atcoder Submission Shortcut
// @namespace    chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=9fae7fb4-0496-426b-a189-3aa7e5a7e300+editor
// @license MIT
// @version      1.0
// @description  Ctrl + Shift + Enter で提出できるようにする
// @author       Rac
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit
// @match        https://atcoder.jp/contests/*/submit?*
// @match        https://atcoder.jp/contests/*/custom_test
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509606/Atcoder%20Submission%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/509606/Atcoder%20Submission%20Shortcut.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', (event) => {
        if(event.ctrlKey && event.shiftKey && event.key=='Enter') {
            document.querySelector('.col-sm-5 > .btn-primary').click();
        }
    });
})();