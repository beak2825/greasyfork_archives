// ==UserScript==
// @name         sklad search vol. 2
// @namespace    sklad
// @version      0.2.2
// @description  search uid artefacts
// @author       Sweag
// @match        https://www.heroeswm.ru/sklad_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377534/sklad%20search%20vol%202.user.js
// @updateURL https://update.greasyfork.org/scripts/377534/sklad%20search%20vol%202.meta.js
// ==/UserScript==

var Num_page_start = 0, start_index = 0, Count_page;
var table_res, mytable, countres = 1, Name_art, UID, url1;
let UID_ARR = new Map();
var COLORS_UID = ["null", "IndianRed", "GreenYellow", "Pink",
                  "Aqua", "LightSalmon", "LightGrey",
                  "Gold", "Lavender", "BurlyWood",
                  "Black", "LightCoral", "Chartreuse",
                  "Lightpink", "Coral", "PaleTurquoise",
                  "Yellow", "Gray", "Thistle",
                  "RosyBrown", "Fuchsia", "Crimson",
                  "LimeGreen", "MediumVioletRed", "MediumTurquoise",
                  "OrangeRed", "LightSlateGrey", "DarkKhaki",
                  "BlueViolet", "DarkGoldenRod", "Purple",
                  "Red", "MediumSpringGreen", "Orange",
                  "SteelBlue", "DarkViolet", "DarkGoldenRod",
                  "Maroon", "Green", "DeepSkyBlue",
                  "SaddleBrown", "Darkgoldenrod", "DarkSlateBlue",
                  "Olive", "MidnightBlue", "Brown",
                  "Teal", "Darkolivegreen", "Navy",
                  "DarkSeaGreen", "Tomato", "Silver"];
var items = COLORS_UID.entries();
(function() {
    'use strict';
    var str;
    var temp = document.querySelectorAll("body > center");
    var table_sklad;
    if(temp[0].children[1].children[0].children[0].children[0].childNodes.length>1)table_sklad = temp[0].children[1].children[0].children[0].children[0].children[1]; else table_sklad = temp[0].children[1].children[0].children[0].children[0].children[0];
    url1 = (document.location.href.split('&')[0]).replace('sklad_info', 'sklad_log');
    COLORS_UID[0] = "red";
    table_res = table_sklad.parentNode;
    var myform = document.createElement('div');
    mytable = document.createElement('div');
    myform.id = 'sform';
    str = "<table><tr><td bgcolor='#6b6c6a' align='center' colspan='4'><font color='#ffd875'><b>Поиск кинжала с N-страницы k страниц</b></td>";
    str += "<td bgcolor='#6b6c6a' align='center'><font color='#ffd875'><b>Название артефакта</b></td><td bgcolor='#6b6c6a' align='center'><font color='#ffd875'><b>UID артефакта</b></td><td bgcolor='#6b6c6a'></td></tr>";
    str += "<tr><td>N:</td><td><input type=text size='17' id=searchfrom value='0'></td><td>k:</td><td><input type=text size='17' id=searchto value='1000'></td>";
    str += "<td><input type=text size='35' id=searchdata value='Эльфийский кинжал'></td><td><input type=text size='17' id=searchuid value='0'>0-поиск всех</td><td><center><input type=button value='Загрузить' id=startscan></center></td></tr></table>";
    myform.innerHTML = str;
    temp[0].children[1].children[0].children[0].children[0].insertBefore(myform, temp[0].children[1].children[0].children[0].children[0].children[1]);
    str = "<table class='wb' border='0' style='border-top: none;' cellspacing='0' cellpadding='4'><tr><td align='center' class=wblight colspan='4'>Результат поиска артефакта 'Эльфийский кинжал' среди протокола склада</td></tr>";
    str += "<tr align='center'><td class=wblight width='4%' align='center'>№</td><td class=wblight width='6%'>Страница</td><td class=wblight width='80%'>Строка протокола</td><td class=wblight width='10%'>UID артефакта</td></tr></table>";
    mytable.innerHTML = str;
    mytable=table_res.insertBefore(mytable, null);
    document.getElementById('startscan').onclick = function(){prescaning();};
})();

function prescaning()
{
    Num_page_start = Number(document.getElementById('searchfrom').value);
    Count_page = Number(document.getElementById('searchto').value);
    UID = Number(document.getElementById('searchuid').value);
    Name_art = document.getElementById('searchdata').value;
    var str = "<table class='wb' border='0' style='border-top: none;' cellspacing='0' cellpadding='4'><tr><td align='center' class=wblight colspan='4'>Результат поиска артефакта '" + Name_art + "' среди протокола склада</td></tr>";
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
    if(UID){
        // сравнение uid
        if(UID==uid1)tmp_tr.innerHTML = "<tr align='center'><td class=wbwhite width='4%' align='center'>" + countres + "</td><td class=wbwhite width='6%' align='center'>"+ p1 + "</td><td class=wbwhite width='80%'>"+ text1.split('<!--')[0] + "</td><td class=wbwhite width='10%' align='center'>"+ uid1 + "</td></tr>";
    } else{
        // изменение цвета разных uid
        var col;
        if(!UID_ARR.has(uid1)){
            col = items.next();
            UID_ARR.set(uid1, col);
        } else {
            col = UID_ARR.get(uid1);
        }
        tmp_tr.innerHTML = "<tr align='center'><td class=wbwhite width='4%' align='center'>" + countres + "</td><td class=wbwhite width='6%' align='center'>"+ p1 + "</td><td class=wbwhite width='80%'>"+ text1.split('<!--')[0] + "</td><td class=wbwhite width='10%' align='center'><font color='" + col.value[1] + "'>"+ uid1 + "</td></tr>";
    }
    mytable.childNodes[0].appendChild(tmp_tr);
    countres++;
}

function scaning()
{
    var xhr = new XMLHttpRequest();
	var uri = url1 + '&page=' + (Num_page_start + start_index);
    start_index++;
    document.getElementById('startscan').value = "Загружено: " + start_index;
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
            var text = xhr.responseText;
            if(text.indexOf('Клан участвует в боевых действиях') > -1){
                document.getElementById('startscan').value = "Загрузить";
                alert('Клан участвует в боевых действиях, попробуйте запросить информацию позже.');
            } else {
                var arr = text.split('&gt;</a></center>')[1].split('-->');
                var _uid, _text_uid, _p;
                for(var i=0; i<arr.length; i++){
                    if(arr[i].indexOf(Name_art) > -1){
                        _text_uid = arr[i].slice(17, arr[i].length-14);
                        _uid = arr[i].split('<!--')[1];
                        _p = Num_page_start + start_index;
                        updateres(_text_uid, _uid, _p);
                    }
                }
                if(Num_page_start+start_index<Count_page){
                    scaning();
                }else{
                    if(mytable.children[0].children.length>1){
                        document.getElementById('startscan').value = "Загрузить";
                        alert("Готово!");
                    }else alert("Ничего не найдено, попробуйте изменить условия поиска.");
                }
            }
		}
	};
}