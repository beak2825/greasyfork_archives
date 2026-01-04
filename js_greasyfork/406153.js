// ==UserScript==
// @name         AvistaZ H&R stats
// @description  Shows you if a torrent is H&R before you stop seeding it
// @require      http://code.jquery.com/jquery-3.5.1.js
// @match        http://avistaz.to/profile/*/history*
// @match        https://avistaz.to/profile/*/history*
// @version 0.0.1.20200627153427
// @namespace https://greasyfork.org/users/656892
// @downloadURL https://update.greasyfork.org/scripts/406153/AvistaZ%20HR%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/406153/AvistaZ%20HR%20stats.meta.js
// ==/UserScript==

var tbl = document.getElementsByTagName('tbody')[0];

var span = document.createElement("span");
span.appendChild(document.createTextNode("H&R?"));
var th = document.createElement("th");
th.appendChild(span);
document.getElementsByTagName('thead')[0].rows[0].appendChild(th);

var fileSize = /(\d+\.\d+) ([TGMK]?B)/;

function appendColumn() {
    for (var i = 0; i < tbl.rows.length; i++) {
        var row = tbl.rows[i];

        var size = toGB(row.cells[1].innerHTML.match(fileSize)[0]);
        var downloaded = toGB(row.cells[6].innerHTML.match(fileSize)[0]);
        var ratio = row.cells[7].innerHTML.match(/(\d+\.\d+)|∞/)[0];
        ratio == "∞" ? 999.99 : parseFloat(ratio);

        var seedTimeHrs = parseInt(row.cells[10].innerHTML.match(/\d+/)[0])/60;

        var hoursLeft = hoursNeeded(size) - seedTimeHrs;
        var isHnR = ratio < 0.9 && downloaded/size >= 0.1 && hoursLeft > 0;

        createCell(row.insertCell(-1), isHnR? hoursLeft.toFixed(2) : 0, (isHnR ? "text-red" : "text-success") + " text-bold");
    }
}

function hoursNeeded(size) {
    return size < 50 ?
        72 + (2*size) :
        (100*Math.log(size))-219.2023;
}

function toGB(string) {
    var regexp = string.match(fileSize);
    var size = parseFloat(regexp[1]);
    var unit = regexp[2];
    var factor;
    switch(unit) {
        case "TB":
            factor = 1000;
            break;
        case "GB":
            factor = 1;
            break;
        case "MB":
            factor = 1/1000;
            break;
        case "KB":
            factor = 1/1000000; // 10^-6
            break;
        case "B":
            factor = 1/1000000000; // 10^-9
            break;
        default:
            return 0;
    }
    return size * factor;
}

function createCell(cell, text, style) {
    var div = document.createElement('span'),
        txt = document.createTextNode(text);
    div.appendChild(txt);
    div.setAttribute('class', style);
    cell.appendChild(div);
}

appendColumn();