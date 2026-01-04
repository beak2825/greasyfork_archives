// ==UserScript==
// @name         Gerrit sort changes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort changes by id, not last update date, in Gerrit
// @author       Adrien Destugues <pulkomandy@pulkomandy.tk>
// @match        https://review.haiku-os.org/*
// @grant        none
// @run-at context-menu
// @downloadURL https://update.greasyfork.org/scripts/378567/Gerrit%20sort%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/378567/Gerrit%20sort%20changes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sortTable(table, col) {
        var rows = Array.prototype.slice.call(table.getElementsByTagName('gr-change-list-item'), 0);
        rows.sort(function(a,b) {
            return getRowValue(a, col) - getRowValue(b, col);
        });

        for (var i=0, row; row = rows[i]; i++) {
            table.appendChild(row);
        }

        function getRowValue(row, col) {
            return parseInt(row.getElementsByClassName(col)[0].children[0].innerHTML, 10);
        }
    }

    var table = document.getElementById("changeList");
    sortTable(table, "number");
})();