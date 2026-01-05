// ==UserScript==
// @name        MonzooBourse
// @namespace   grenad-monzoo
// @description Amélioration de la page de la bourse sur le site monzoo.net
// @include     http://www.monzoo.net/bourse.php*
// @version     1.03
// @copyright   Copyright 2017 -- Grenad
// @author      Grenad
// @downloadURL https://update.greasyfork.org/scripts/29048/MonzooBourse.user.js
// @updateURL https://update.greasyfork.org/scripts/29048/MonzooBourse.meta.js
// ==/UserScript==

var x = document.querySelectorAll(".content_site table");
var head = x[3].tBodies[0].rows;
var head_tx = ["Nom", "Prix de base", "Prix actuel", "Tendance"];
x = x[4];
var tb = x.tBodies[0];
var arr_row = Array.prototype.slice.call(tb.rows, 0);

var config = 0;
var reverse = true;

init_b();
set_percent_b();
sort_b(0);

function init_b() {
    for( var it = 0 ; it < 4 ; it ++) {
        head[0].cells[it].style.cursor = "pointer";
        head[0].cells[it].setAttribute("n", it);
        head[0].cells[it].onclick = function() { sort_b(this.getAttribute("n")); };
    }
    x.insertAdjacentHTML('beforebegin', '<input style="margin-bottom: 16px;width: 558px;font-size: 14px;padding: 12px 20px 12px 20px;" type="text" id="search_name" onkeyup="search()" placeholder="Recherche par nom">');
}

function sort_b(_c) {
    if(config == _c) 
        reverse = !reverse;
    else
        reverse = false;
    config = _c;
    if(config == 0) {
        arr_row = arr_row.sort( function(a, b) {
            return a.cells[0].textContent.trim().localeCompare(b.cells[0].textContent.trim()) * ((reverse) ? -1 : 1);
        });
    } else if (config == 3) {
        arr_row = arr_row.sort( function(a, b) {
            if(reverse)
                return parseFloat(a.cells[config].textContent) > parseFloat(b.cells[config].textContent);
            else
                return parseFloat(a.cells[config].textContent) < parseFloat(b.cells[config].textContent);
        });
    }
    else {
        arr_row = arr_row.sort( function(a, b) {
            if(reverse)
                return parseInt(a.cells[config].textContent) > parseInt(b.cells[config].textContent);
            else
                return parseInt(a.cells[config].textContent) < parseInt(b.cells[config].textContent);
        });
    }
    update_tb_b();
    update_hd_b();
}

function update_tb_b() {
    var e = 0;
    for(var it = 0 ; it < arr_row.length ; it ++) {
        if(arr_row[it].style.display != "none")
            e++;
        arr_row[it].setAttribute("bgcolor", (e % 2) ? "#FCF0DB" : "");
        tb.appendChild(arr_row[it]);
    }
}

function update_hd_b() {
    for( var it = 0 ; it < 4 ; it ++) {
        head[0].cells[it].style.fontWeight = (it == config) ? "800" : "inherit";
        head[0].cells[it].style.textDecoration = (it == config) ? "underline" : "inherit";
        head[0].cells[it].textContent = (it == config) ? head_tx[it] + ((reverse) ? " ▼" : " ▲") : head_tx[it];
    }
}

function set_percent_b() {
    for(var it = 0 ; it < arr_row.length ; it ++) {
        var pc = (parseInt(arr_row[it].cells[2].textContent) * 100 / parseInt(arr_row[it].cells[1].textContent)).toFixed(2);
        if(pc == 100) { 
            arr_row[it].cells[3].setAttribute("percent", pc);
            arr_row[it].cells[3].innerHTML = '<img src="images/bourse/=.gif" style="float: left;">';
            arr_row[it].cells[3].innerHTML += "<span> 0.00%</span>";
            continue;
        }
        arr_row[it].cells[3].setAttribute("percent", pc);
        arr_row[it].cells[3].innerHTML = '<img src="images/bourse/'+ ((pc - 100 > 0) ? "+" : "-") + '.gif" style="float: left;">';
        arr_row[it].cells[3].innerHTML += "<span> " + ((pc - 100 > 0) ? "+" : "") + (pc - 100).toFixed(2) + "%</span>";
    }
}

unsafeWindow.search = function() {
    q = document.getElementById("search_name").value.toUpperCase().trim();
    for(var it = 0 ; it < arr_row.length ; it ++) {
        arr_row[it].style.display = (arr_row[it].textContent.toUpperCase().indexOf(q) > -1) ? "block" : "none";
    }
    update_tb_b();
}