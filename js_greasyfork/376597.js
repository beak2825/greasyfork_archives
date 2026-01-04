// ==UserScript==
// @name        HWM_WH_Art_IDs
// @namespace   Рианти
// @description Поиск артефакта по айди на странице склада (ctrl+shift+f); Показ айди при нажатии с зажатым Ctrl по строчке
// @include     https://www.heroeswm.ru/sklad_info.php?id=*
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/376597/HWM_WH_Art_IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/376597/HWM_WH_Art_IDs.meta.js
// ==/UserScript==


var tables = document.querySelectorAll('table[width="970"] table.wb[width="970"]'),
    table = tables[tables.length - 1];
if (table.parentElement.nodeName == 'FORM') table = tables[tables.length - 2];

var links = table.querySelectorAll('a[href*="art_info.php?id="]'),t,t2;
for (var i = 0; i < links.length; i++){
    t = links[i].parentElement;
    while (!(t.firstChild.width == '50' || (t.firstChild.nextSibling && t.firstChild.nextSibling.width == '50'))) t = t.parentElement;
    if(!(t2 = links[i].href.match(/uid=(\d+)/))) continue;
    t.id = t2[1];
    t.className = 'artRow';
    t.onclick = function(e){
        if (e.ctrlKey){
            e.preventDefault();
            var p = e.target.parentElement;
            while(p.nodeName != 'TR') p = p.parentElement;
            var artId = p.querySelector('a[href*="art_info.php?id="]').href.match(/uid=(\d+)/)[1];
            prompt("Айди артефакта: ", artId);
        }
    }
}

window.onkeypress = function(e) {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        if (e.shiftKey && e.ctrlKey && (e.keyCode == 6 || e.keyCode == 1)) {
            e.preventDefault();
            window.location.hash = prompt("Айди артефакта для поиска на странице:");
        }
    }
    else {
        if (e.shiftKey && e.ctrlKey && (e.key == 'F' || e.key == 'А')) {
            e.preventDefault();
            window.location.hash = prompt("Айди артефакта для поиска на странице:");
        }
    }
}

window.onhashchange = function(e){
    var artId = e.newURL.split('#')[1];
    var rows = document.getElementsByClassName('artRow');
    for (var i = 0; i < rows.length; i++) rows[i].style['background-color'] = '';
    document.getElementById(artId).style['background-color'] = '#F6E7D4';
}

if(window.location.hash != '' && document.getElementById(window.location.hash.split('#')[1])) document.getElementById(window.location.hash.split('#')[1]).style['background-color'] = '#F6E7D4';