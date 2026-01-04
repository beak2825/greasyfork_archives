// ==UserScript==
// @name         wiiuemulator cmdgen
// @namespace    https://ricli.ml
// @version      0.1
// @description  generate FunKiiU download cmd with title and key
// @author       Ric
// @match        https://www.wiiuemulator.com/Game-Key-Database.htm
// @icon         https://www.wiiuemulator.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447255/wiiuemulator%20cmdgen.user.js
// @updateURL https://update.greasyfork.org/scripts/447255/wiiuemulator%20cmdgen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    editTable("DataTables_Table_0");
    editTable("DataTables_Table_2");
})();

function editTable(id) {
    var tb = document.getElementById(id);
    var i = 1;
    for (; i < tb.rows.length; i++) {
        var title = tb.rows[i].cells[2].innerText;
        var key = tb.rows[i].cells[3].innerText;
        var cmd = "python FunKiiU.py -title "+title+" -key "+key;
        tb.rows[i].deleteCell(3);
        tb.rows[i].cells[2].innerText=cmd;
        tb.rows[i].cells[2].bgColor="#303030";
    }

    tb.rows[0].deleteCell(3);
    tb.rows[0].cells[2].innerText="CMD";
    tb.rows[0].cells[0].style="width: 18em;"
}