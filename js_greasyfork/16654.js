// ==UserScript==
// @name         Win ratio for saltybet.com character statistics
// @version      0.3
// @description  Calculates the win ratio for all characters on the character statistics page
// @author       reconman
// @match        http://www.saltybet.com/stats?playerstats=1
// @grant        none
// @namespace https://greasyfork.org/users/28815
// @downloadURL https://update.greasyfork.org/scripts/16654/Win%20ratio%20for%20saltybetcom%20character%20statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/16654/Win%20ratio%20for%20saltybetcom%20character%20statistics.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var thead = document.getElementsByTagName("thead")[0];
var tr = thead.firstElementChild;
var th = document.createElement('th');
th = tr.appendChild(th);

//<th class="sorting" role="columnheader" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Tier: activate to sort column ascending" style="width: 52px;">Tier</th>

th.innerHTML = "Ratio";
th.className = "sorting";
th.setAttribute("role", "columnheader");
th.setAttribute("tabindex","0");
th.setAttribute("aria-controls","DataTables_Table_0");
th.setAttribute("rowspan","1");
th.setAttribute("colspan","1");
th.setAttribute("aria-label","Ratio: activate to sort column ascending");
th.setAttribute("style","width: 52px;");

var tbody = document.getElementsByTagName("tbody")[0];
var trs = tbody.getElementsByTagName("tr");

for (var i = 0; i < trs.length; ++i) {
    var td = document.createElement('td');
    tr = trs[i];
    var ratio = tr.children[3].innerHTML / tr.children[2].innerHTML;
    ratio = Math.round(ratio*100);
    td.innerHTML = ratio;
    td.className = " ";
    tr.appendChild(td);
}

$('.leaderboard').dataTable().fnDestroy();
$('.leaderboard').dataTable({ 
    "bPaginate": false,
    "bLengthChange": false,
    "aaSorting": []
});
    