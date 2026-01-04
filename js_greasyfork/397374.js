// ==UserScript==
// @name         [HWM] Leader army exchange by rank
// @namespace    https://greasyfork.org/en/users/242258
// @description  Displays leader units grouped by rank
// @version      0.1
// @author       Alex_2oo8
// @match        https://www.heroeswm.ru/leader_army_exchange.php*
// @downloadURL https://update.greasyfork.org/scripts/397374/%5BHWM%5D%20Leader%20army%20exchange%20by%20rank.user.js
// @updateURL https://update.greasyfork.org/scripts/397374/%5BHWM%5D%20Leader%20army%20exchange%20by%20rank.meta.js
// ==/UserScript==

var tables = document.getElementsByTagName("table"), table = null;
for (var i = 0; i < tables.length; i++) {
    var trs = tables[i].getElementsByTagName("tr");
    if (trs.length == 0) continue;
    var tds = trs[0].getElementsByTagName("td");
    if (tds.length != 3) continue;
    if (tds[1].innerHTML == "Суммарное лидерство") {
        table = tables[i];
    }
}

if (table !== null) {
    var grouped = [[], [], [], [], [], []];

    trs = table.getElementsByTagName("tbody")[0].children;
    for (i = 1; i < trs.length; i++) {
        var imgs = trs[i].getElementsByTagName("img"), lvl = null;
        for (var j = 0; j < imgs.length; j++) {
            var m = imgs[j].src.match(/_lvl(\d)\.png/);
            if (m) lvl = m[1];
        }

        if (lvl == null) {
            console.log("[HWM] Leader army exchange by rank. Failed to parse unit level: ", trs[i]);
        }
        else {
            grouped[lvl].push(trs[i]);
        }
    }

    var container = document.createElement("table");
    container.cellSpacing = "18";
    var containerRow = document.createElement("tr");
    container.appendChild(containerRow);
    for (i = 0; i < grouped.length; i++) {
        if (grouped[i].length == 0) continue;

        var tb = table.cloneNode(false);
        tb.appendChild(trs[0].cloneNode(true));
        tb.getElementsByTagName("td")[1].style.minWidth = "130px";
        tb.getElementsByTagName("td")[2].style.minWidth = "130px";
        for (j = 0; j < grouped[i].length; j++) {
            tb.appendChild(grouped[i][j]);
        }

        var td = document.createElement("td");
        td.style.verticalAlign = "top";
        td.appendChild(tb);
        containerRow.appendChild(td);
    }

    table.parentNode.appendChild(container);
    table.parentNode.removeChild(table);
}
