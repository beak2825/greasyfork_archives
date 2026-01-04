// ==UserScript==
// @name         Pickers
// @name:CS      Pickers
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Pickers column for Process Path Properties
// @description:CS  script pro přidání sloupce Pickers do Process Path Properties stránky počítá kolik je alokovaných pickerů na daný sort (Target Unit Rate/Pick Rate Ave)
// @author       soufeko
// @match        https://*.amazon.com/gp/picking/config/processPaths.html*
// @compatible   firefox
// @downloadURL https://update.greasyfork.org/scripts/40586/Pickers.user.js
// @updateURL https://update.greasyfork.org/scripts/40586/Pickers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var th = document.createElement('th');
    var a = document.createElement('a');
    a.textContent = 'Pickers';
    a.href = "#";

    var table = document.getElementById('t1');
    var trbody = document.getElementById('t1').getElementsByTagName('tr') [0]; //element of the [tr] - first row
    var x = document.getElementById("t1").rows[0].cells;
    //var th_txt = document.createTextNode('<a href="#" class="sortheader" onclick="ts_resortTable(this);return false;"><span class="sortarrow" sortdir="down">↓</span></a>');
    var g = 3; //just variable

    th.appendChild(a);
    trbody.appendChild(th);// new

    for (var r = 1, n = table.rows.length; r < n; r++) {
        table.rows[r].insertCell(14); //insert a new cell
        x = document.getElementById("t1").rows[r].cells; //set up of new line
        document.getElementById("t1").style.textAlign = "right";
        g = parseInt(x[11].innerHTML) / parseInt(x[6].innerHTML); //insert of

        if (isNaN(g)) {
            (x[14].innerHTML = 0);
        }
        else {
            (x[14].innerHTML = g.toFixed());
        }
    }
})();