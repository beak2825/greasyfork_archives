// ==UserScript==
// @name         SB/min column
// @version      1.00
// @description  Add SB per minute column
// @author       Toni
// @match        http*://www.swagbucks.com/surveys*
// @grant        none
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/380559/SBmin%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/380559/SBmin%20column.meta.js
// ==/UserScript==

function getSBperMin() {
    var colHead = document.createElement("th");
    colHead.setAttribute("class","table-sortable:numeric effeciency table-sortable");
    colHead.innerText = "SB per Minute";

    var tableHeader = document.getElementById("surveysTHead").children[0];
    tableHeader.insertBefore(colHead, tableHeader.children[0]);

    var tb = document.getElementById("surveyList").lastElementChild;
    var time = 0;
    var sb = 0;
    for (var j = 0; j < tb.rows.length; j++) {
        var bestTd = document.createElement("td")
        time = parseInt(tb.rows[j].children[0].children[0].innerText);
        sb = parseInt(tb.rows[j].children[1].children[0].innerText.slice(0, -3));

        bestTd.innerText = Math.floor(sb/time*100)/100;
        tb.rows[j].insertBefore(bestTd, tb.rows[j].children[0]);
    }
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("surveyList").lastElementChild;
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 0; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

var tableCode = getSBperMin.toString();
var sortCode = sortTable.toString();

var header = document.getElementsByClassName("pageHeader")[1];
var scrpt = document.createElement("script");
scrpt.innerHTML = tableCode + sortCode;
header.appendChild(scrpt);

var btn = document.createElement("button");
btn.setAttribute("onclick", "getSBperMin();sortTable();");
btn.appendChild(document.createTextNode("Activate"));
header.appendChild(btn);