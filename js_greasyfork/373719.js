// ==UserScript==
// @name         nosql_nopt
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://nosql.ru/forum/forums.php
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/373719/nosql_nopt.user.js
// @updateURL https://update.greasyfork.org/scripts/373719/nosql_nopt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
setTimeout(function() {
    var s = document.createElement('style');
    s.type = 'text/css';
    s.textContent = '.forum_table>tbody>tr:nth-child(3){display:none;}';
    document.querySelector('head').appendChild(s);
}, 10);
})();