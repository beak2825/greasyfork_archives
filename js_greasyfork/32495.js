// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://kosmiczni.pl/game*/game.php?a=klan&c=klan_rent
// @noframes
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32495/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/32495/New%20Userscript.meta.js
// ==/UserScript==
/*if (document.readyState == 'complete') {
    loaded();
} else {
    window.addEventListener('DOMContentLoaded', loaded);
}
function loaded() {*/
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="myButton" type="button" class="newBtn" style="display:flex; right:0; top:0;">Sortuj</button>';
    zNode.setAttribute ('id', 'myContainer');
    document.getElementsByClassName("f_left")[0].appendChild (zNode);
    document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);
    function ButtonClickAction (zEvent) {
    var table, rows, switching, i, x, y, a, b, c, d, shouldSwitch;
var doc=document.getElementsByClassName("f_left")[0];
table = doc.getElementsByTagName("table")[0];
switching = true;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      a = rows[i].getElementsByTagName("TD")[2];
      b = rows[i + 1].getElementsByTagName("TD")[2];
      c = rows[i].getElementsByTagName("TD")[0];
      d = rows[i + 1].getElementsByTagName("TD")[0];
      x = c.getElementsByTagName("A")[0];
      y = d.getElementsByTagName("A")[0];
      if (a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase()) {
        shouldSwitch= true;
        break;
      }
      else {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch=true;
              break;
          }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
    }
//}