// ==UserScript==
// @name         Checkee.info H1 Only
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Show only H1 rows on Checkee.info...
// @author       Kyan40
// @match        https://www.checkee.info/main.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378339/Checkeeinfo%20H1%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/378339/Checkeeinfo%20H1%20Only.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var rows = document.getElementsByTagName("tr");
    for(var i = rows.length - 1; i >= 0; i--) {
        if (rows[i].innerHTML.indexOf('update.php') != -1 && rows[i].innerHTML.indexOf('H1') == -1) {
            rows[i].style.display = 'none';
        }
    }
})();