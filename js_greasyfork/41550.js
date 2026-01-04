// ==UserScript==
// @name         AuctionHelper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Sweag
// @include      https://www.heroeswm.ru/auction.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41550/AuctionHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/41550/AuctionHelper.meta.js
// ==/UserScript==

var HREF_USER;
var temp = document.querySelectorAll("body > center");
var mytable = document.createElement('tr');
(function() {
    'use strict';

    // Your code here...
    var COST_ABRASIVE = 500;
    var COST_SNAKE_POISON = 100;
    var COST_TIGER_TUSK = 700;
    var COST_ICE_CRYSTAL = 1700;
    var COST_MOON_STONE = 3200;
    var COST_FIRE_CRYSTAL = 1700;
    var COST_METEORIT = 2300;
    var COST_WITCH_FLOWER = 100;
    var COST_WIND_FLOWER = 2300;
    var COST_FERN_FLOWER = 150;
    var COST_BADGRIB = 180;
    var tabitem = document.getElementsByTagName('table');
    var table_auction = 0, COST_CURRENT = 0;
    var tmp_id, tmp_object, tmp_str;
    var nodeChildrenArr = [];
    var hrefs = document.getElementsByTagName('a');
    for(var i = 0; i<hrefs.length; i++){
        if(hrefs[i].href.indexOf('pl_hunter_stat.php') > -1){
            HREF_USER = 'https://www.heroeswm.ru/pl_info.php?id=' + hrefs[i].href.split('pl_hunter_stat.php?id=')[1].split('>')[0];
            i=hrefs.length;
        }
    }
    for(var k = 0; k<tabitem.length; k++){
        if(tabitem[k].rows.length>10){
            table_auction = k;
            var len = tabitem[k].rows.length;
            for(var l = 14; l<len; l++){
                tabitem[k].deleteRow(-1);
            }
        }
    }
    for(var j = 2; j< tabitem[table_auction].rows.length; j++){
        tmp_str = tabitem[table_auction].rows[j].cells[2].innerHTML.split('gold.gif')[1].split('<td>')[1].split('</td>')[0];
        if(tmp_str.indexOf(',') > -1){
            COST_CURRENT = parseInt(tmp_str.split(',')[0])*1000 + parseInt(tmp_str.split(',')[1]);
        } else {
            COST_CURRENT = parseInt(tmp_str);
        }
        if(((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('абразив') > -1)&&(COST_CURRENT<=COST_ABRASIVE))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('змеиный') > -1)&&(COST_CURRENT<=COST_SNAKE_POISON))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('клык') > -1)&&(COST_CURRENT<=COST_TIGER_TUSK))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('ледяной') > -1)&&(COST_CURRENT<=COST_ICE_CRYSTAL))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('лунный') > -1)&&(COST_CURRENT<=COST_MOON_STONE))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('огненный') > -1)&&(COST_CURRENT<=COST_FIRE_CRYSTAL))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('осколок') > -1)&&(COST_CURRENT<=COST_METEORIT))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('ведьм') > -1)&&(COST_CURRENT<=COST_WITCH_FLOWER))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('ветров') > -1)&&(COST_CURRENT<=COST_WIND_FLOWER))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('папоротника') > -1)&&(COST_CURRENT<=COST_FERN_FLOWER))||
           ((tabitem[table_auction].rows[j].cells[0].innerHTML.indexOf('гриб') > -1)&&(COST_CURRENT<=COST_BADGRIB))){
            tmp_id = tabitem[table_auction].rows[j].cells[4].innerHTML.split('div id=')[1].split('>')[0].slice(1,-1);
            tmp_object = document.getElementById(tmp_id);
            nodeChildrenArr = Array.from(tmp_object.children);
            nodeChildrenArr[0].click();
            tmp_object = document.getElementById(tmp_id);
            nodeChildrenArr = Array.from(tmp_object.children);
            nodeChildrenArr[0].value = '10';
        }
    }
    format_str();
    setTimeout(reload, 3000); //pl_hunter_stat.php?id=2478064'>
})();

function format_str()
{
    var xhr = new XMLHttpRequest(), mas_elem = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
	var str;
    xhr.open("GET", HREF_USER, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
            var tmp_text = xhr.responseText, arr_text = tmp_text.split('Умения')[1].split('Рыцарь')[0].split('&nbsp;&nbsp;&nbsp;&nbsp;');
            for(var i=1; i<arr_text.length; i++){
                if(arr_text[i].indexOf('абразив') > -1)mas_elem[0] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('змеиный яд') > -1)mas_elem[1] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('клык тигра') > -1)mas_elem[2] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('ледяной кристалл') > -1)mas_elem[3] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('лунный камень') > -1)mas_elem[4] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('огненный кристалл') > -1)mas_elem[5] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('осколок метеорита') > -1)mas_elem[6] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('цветок ведьм') > -1)mas_elem[7] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('цветок ветров') > -1)mas_elem[8] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('цветок папоротника') > -1)mas_elem[9] = arr_text[i].split(':')[1].split('<BR')[0];
                if(arr_text[i].indexOf('ядовитый гриб') > -1)mas_elem[10] = arr_text[i].split(':')[1].split('<BR')[0];
            }
            var table_auc = temp[0].children[1].children[0].children[0].children[0].children[0].children[0].children[1].children[1];
            str = '<table><tbody><tr><td class="wblight"><img src="https://dcdn.heroeswm.ru/i/abrasive.gif" border="0" title="абразив" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[0] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/snake_poison.gif" border="0" title="змеиный яд" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[1] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/tiger_tusk.gif" border="0" title="клык тигра" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[2] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/ice_crystal.gif" border="0" title="ледяной кристалл" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[3] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/moon_stone.gif" border="0" title="лунный камень" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[4] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/fire_crystal.gif" border="0" title="огненный кристалл" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[5] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/meteorit.gif" border="0" title="осколок метеорита" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[6] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/witch_flower.gif" border="0" title="цветок ведьм" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[7] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/wind_flower.gif" border="0" title="цветок ветров" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[8] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/fern_flower.gif" border="0" title="цветок папоротника" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[9] + '</td><td class=wblight><img src="https://dcdn.heroeswm.ru/i/badgrib.gif" border="0" title="ядовитый гриб" align="absmiddle" width="30" height="30">&nbsp;';
            str += mas_elem[10] + '</td></tr></tbody></table>';
            mytable.innerHTML = str;
            mytable = table_auc.insertBefore(mytable, table_auc.children[0]);
		}
	};
}

function reload()
{
    document.location.reload();
}