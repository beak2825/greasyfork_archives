// ==UserScript==
// @name         sklad search
// @namespace    sklad
// @version      0.4
// @description  search uid artefacts
// @author       Sweag
// @match        https://www.heroeswm.ru/sklad_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377410/sklad%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/377410/sklad%20search.meta.js
// ==/UserScript==

var Num_page_start = 0, start_index = 0, Count_page = 1000;
var table_res, mytable, countres = 1;
(function() {
    'use strict';
    var str;
    var temp = document.querySelectorAll("body > center");
    var table_sklad = temp[0].children[1].children[0].children[0].children[0].children[1];
    table_res = table_sklad.parentNode;
    var myform = document.createElement('div');
    mytable = document.createElement('div');
    myform.id = 'sform';
    str = "<div><table><tr><td bgcolor='#6b6c6a' align='center' colspan='5'><font color='#ffd875'><b>Поиск кинжала с N-страницы k страниц</b></td></tr><tr><td>N:</td><td><input type=text size='10' id=searchfrom value='0'></td><td>k:</td><td><input type=text size='10' id=searchto value='1000'></td><td><center><input type=button value='Загрузить' id=startscan></center></td></tr></table></div>";
    myform.innerHTML = str;
    table_sklad.insertBefore(myform, table_sklad.childNodes[0]);
    str = "<table class='wb' border='0' style='border-top: none;' cellspacing='0' cellpadding='4'><tr><td align='center' class=wblight colspan='4'>Результат поиска Эльфийского кинжала среди протокола склада</td></tr>";
    str += "<tr align='center'><td class=wblight width='4%' align='center'>№</td><td class=wblight width='6%'>Страница</td><td class=wblight width='80%'>Строка протокола</td><td class=wblight width='10%'>UID артефакта</td></tr></table>";
    mytable.innerHTML = str;
    mytable=table_res.insertBefore(mytable, null);
    document.getElementById('startscan').onclick = function(){prescaning();};
})();

function prescaning()
{
    Num_page_start = Number(document.getElementById('searchfrom').value);
    Count_page = Number(document.getElementById('searchto').value);
    var str = "<table class='wb' border='0' style='border-top: none;' cellspacing='0' cellpadding='4'><tr><td align='center' class=wblight colspan='4'>Результат поиска Эльфийского кинжала среди протокола склада</td></tr>";
    str += "<tr align='center'><td class=wblight width='4%' align='center'>№</td><td class=wblight width='6%'>Страница</td><td class=wblight width='80%'>Строка протокола</td><td class=wblight width='10%'>UID артефакта</td></tr></table>";
    mytable.innerHTML = str;
    start_index = 0;
    countres = 1;
    scaning();
}

function updateres(text1, uid1, p1)
{
    var tmp_tr;
    tmp_tr = document.createElement('tr');
    tmp_tr.innerHTML = "<tr><td class=wbwhite width='4%' align='center'>" + countres + "</td><td class=wbwhite width='6%' align='center'>"+ p1 + "</td><td class=wbwhite width='80%'>"+ text1.split('<!--')[0] + "</td><td class=wbwhite width='10%' align='center'>"+ uid1 + "</td></tr>"
    mytable.childNodes[0].appendChild(tmp_tr);
    countres++;
}

function scaning()
{
    var xhr = new XMLHttpRequest();
	var uri = 'https://www.heroeswm.ru/sklad_log.php?id=102&page=' + (Num_page_start + start_index);
    start_index++;
    document.getElementById('startscan').value = "Загружено: " + start_index;
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			var text = xhr.responseText;
            var arr = text.split('&gt;</a></center>')[1].split('-->');
            var uid, text_uid, p, k = 0;
            for(var i=0; i<arr.length; i++){
                if(arr[i].indexOf('Эльфийский кинжал') > -1){
                    text_uid = arr[i];
                    uid = arr[i].split('<!--')[1];
                    p = Num_page_start + start_index;
                    updateres(text_uid, uid, p);
                    if((uid.indexOf('250922672') <= -1)&&(uid.indexOf('250922375') <= -1)&&(uid.indexOf('250922523') <= -1)){
                        k = 1;
                        alert(Num_page_start + start_index);
                        //alert(arr[i].split('<!--'));
                        i = arr.length;
                    }
                }
            }
            if(k == 0){
                if(start_index<Count_page){
                    scaning();
                }
                else {
                    alert('Проверка протокола ничего не дала, попробуйте другие входные данные.');
                    return;
                }
            }
		}
	};
}