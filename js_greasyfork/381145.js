// ==UserScript==
// @name         [HWM] Leader army stats
// @namespace    https://greasyfork.org/en/users/242258
// @description  Displays leadership statistics.
// @version      0.2
// @author       Alex_2oo8
// @match        https://www.heroeswm.ru/leader_army.php*
// @downloadURL https://update.greasyfork.org/scripts/381145/%5BHWM%5D%20Leader%20army%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/381145/%5BHWM%5D%20Leader%20army%20stats.meta.js
// ==/UserScript==

/* global $ obj */

var table = $('<table class="LeaderArmyStats">');

getHeader().appendTo(table);

var titles = [undefined, "Обычные", "Редкие", "Очень редкие", "Легендарные", "Всего"];
for (var r = 1; r <= 5; r++) {
    var row = $('<tr class="r' + r + '">');
    $("<th>" + titles[r] + "</th>").appendTo(row);
    for (var f = 1; f <= 12; f++) {
        var leadership = 0, count = 0;
        for (var i = 1; i < obj.length; i++) {
            if (obj[i].rarity != r && r != 5) continue;
            if (obj[i].race != f % 11 && f != 12) continue;

            leadership += obj[i].cost * obj[i].count;
            count++;
        }

        $("<td>" + format(leadership) + "<span>(" + count + ")</span></td>").appendTo(row);
    }
    row.appendTo(table);
}

table.insertAfter(getArmyTable());
$('<style type="text/css">.LeaderArmyStats { margin: 20px 0 20px 0; } .LeaderArmyStats th img { width: 22px; height: 22px; } .LeaderArmyStats td span { float: right; margin-left: 10px; } .LeaderArmyStats td, .LeaderArmyStats th, .LeaderArmyStats { border: 1px #5D413A solid; border-collapse: collapse; padding: 6px; color: #000; } .LeaderArmyStats tr.r1 { background: linear-gradient(#c8c8c8cc, #8a8a8acc); } .LeaderArmyStats tr.r2 { background: linear-gradient(to top, #4D3F36CC, #715949CC); } .LeaderArmyStats tr.r3 { background: linear-gradient(to top, #263648CC, #3F5674CC); } .LeaderArmyStats tr.r4 { background: linear-gradient(to top, #574819CC, #8D782BCC); } </style>').appendTo('head');

function getHeader() {
    var header = $("<tr>");
    $("<th />").appendTo(header);
    for (var f = 1; f <= 10; f++) {
        $('<th><img src="https://dcdn.heroeswm.ru/i/f/r' + f + '.png"></th>').appendTo(header);
    }
    $('<th><img src="https://dcdn.heroeswm.ru/i/f/r_neut.png"></th>').appendTo(header);
    $('<th>Все</th>').appendTo(header);

    return header;
}

function getArmyTable() {
    return $("#army_info_div").closest("table");
}

function format(x) {
    var str = "" + x;
    for (var i = 3; str.length > i; i += 4) {
        str = str.substr(0, str.length - i) + " " + str.substr(str.length - i);
    }
    return str;
}
