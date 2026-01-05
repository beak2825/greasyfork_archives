// ==UserScript==
// @name         BTN Season background colour alternator
// @namespace    broadcasthe.net
// @version      1
// @description  Makes browsing seasons a little easier
// @author       SIGTERM86
// @include      http*://broadcasthe.net/series.php?*id=*
// @downloadURL https://update.greasyfork.org/scripts/29743/BTN%20Season%20background%20colour%20alternator.user.js
// @updateURL https://update.greasyfork.org/scripts/29743/BTN%20Season%20background%20colour%20alternator.meta.js
// ==/UserScript==

var bgcol = "#272A2E";

(function() {
    var tds = document.querySelectorAll('.group');
    for(var i=0; i < tds.length; i+=2) {
        var td = tds[i];
        var tr = td.parentNode;
        var table = tr.parentNode;
        var start = tr.rowIndex-1;
        var count = parseInt(td.getAttribute('rowspan'));
        for (var r=start; r<start+count; r++) {
            var row = table.rows[r];
            row.classList.add("mod2");
        }
    }

    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".mod2 { background-color: "+ bgcol + " !important }";
    document.head.appendChild(css);
})();