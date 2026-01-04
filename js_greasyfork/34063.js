// ==UserScript==
// @name         SkladInfo
// @namespace    sklad997
// @version      0.4
// @description  sklad helper
// @author       Sweag
// @match        http://www.heroeswm.ru/sklad_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34063/SkladInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/34063/SkladInfo.meta.js
// ==/UserScript==

if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}
var table_cont, add_table_parent;
var add_table, parent_table_art;

(function() {
    'use strict';
    var p_select = document.getElementsByTagName('select');
    var hrefs=document.getElementsByTagName('a');
    //GM_setValue('show_setting', '0');
    for(var i=0; i<hrefs.length; i++){
        if(hrefs[i].href.indexOf('&cat=1') > -1){
            add_table_parent = hrefs[i].parentNode.parentNode;
        }
        if(hrefs[i].href.indexOf('art_info.php?id=') > -1){
            parent_table_art = hrefs[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        }
        if(hrefs[i].href.indexOf('sklad_info.php') > -1){
            if(hrefs[i].parentNode.innerHTML.indexOf('b_edit.png') && hrefs[i].href.indexOf('sklad_rc_on=0') > -1){
                var t = document.getElementById('inp');
                if(p_select.length<88)table_cont = t.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes; else table_cont = t.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes;
                table_cont[0].childNodes[0].setAttribute("width", "30%");
                table_cont[0].innerHTML += '<td class="wblight" align="center" style="border-top: none;" width="15%"><b>Расчет пользования</b></td>';
                var s = '<td class="wbwhite" style="border-bottom: none;" valign="top">';
                s += '<table width="100%" border="0"><tbody><tr><td>C:&nbsp;</td><td><input type="text" style="width:80;" maxlength="8" name="datefrom" value="';
                s += GetCurrentMonth();
                s += '" id="datefrom"></td><td>&nbsp;&nbsp;<a style="text-decoration:none;" href="#" title="Помощник кладовщика. Настройки." id="open_table">>></a></td></tr><tr><td>По:&nbsp;</td><td><input type="text" style="width:80;" maxlength="10" name="dateto" value="';
                s += GetCurrentDate();
                s += '" id="dateto"></td><td align="center"><input type="submit" value="Ok" id="dateok"></td></tr></tbody></table></td>';
                table_cont[1].innerHTML += s;
                document.getElementById('dateok').onclick = function(){prescaning();};
                document.getElementById('open_table').onclick = function(){opening();};
            }
        }
    }
    var table_temp, tr_temp, td_temp1, td_temp2;
    add_table = document.createElement('table');
    add_table.setAttribute('width', '100%');
    add_table.setAttribute('id', 'table_settings');
    add_table_parent.parentNode.parentNode.nextSibling.insertBefore(add_table, add_table_parent.parentNode.parentNode.nextSibling.firstChild);
    document.getElementById("table_settings").style.display = 'none';
    add_table.setAttribute('border', '1');
    tr_temp = document.createElement('tr');
    add_table.appendChild(tr_temp);
    // первый столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Арт';
    td_temp1.setAttribute('width', '6%');
    // второй столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Ник владельца';
    td_temp1.setAttribute('width', '10%');
    // третий столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Прочка пред.';
    td_temp1.setAttribute('width', '5%');
    // четвертый столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Прочка текущая';
    td_temp1.setAttribute('width', '5%');
    // пятый столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Ремонт, шт.';
    td_temp1.setAttribute('width', '5%');
    // шестой столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Стоимость ремонта ';
    td_temp1.setAttribute('width', '10%');
    // седьмой столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Цена за бой';
    td_temp1.setAttribute('width', '10%');
    // восьмой столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Сумма субаренды';
    td_temp1.setAttribute('width', '10%');
    // девятый столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Отправить субаренду';
    td_temp1.setAttribute('width', '5%');
    // десятый столбец
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = 'Олата последний раз';
    td_temp1.setAttribute('width', '15%');
    // итоговый столбец с управляющей кнопкой
    td_temp1 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    td_temp1.innerHTML = '&nbsp;&nbsp;&nbsp;<input type=button value="Отправить субаренду" id="go_transfer">';
    td_temp1.setAttribute('width', '19%');
    /*tr_temp = document.createElement('tr');
    add_table.appendChild(tr_temp);
    td_temp1 = document.createElement('td');
    td_temp2 = document.createElement('td');
    tr_temp.appendChild(td_temp1);
    tr_temp.appendChild(td_temp2);
    td_temp1.innerHTML = '2 tr 1 td';
    td_temp2.innerHTML = '2 tr 2 td';*/
    // Добавление элемента выбора арта в субаренде
    var str_id='', td_temp = [];
    td_temp2 = document.createElement('td');
    td_temp2.setAttribute('width', '10');
    str_id = 'art?uid=?n=0';
    td_temp2.innerHTML = '<b id="' + str_id + '">*</b>';
    parent_table_art.childNodes[0].insertBefore(td_temp2, parent_table_art.childNodes[0].firstChild);
    for(var j=3; j<parent_table_art.childNodes.length; j++){
        td_temp[j-3] = document.createElement('td');
        if(parent_table_art.childNodes[j].childNodes[0].innerHTML.indexOf('uid=') > -1)str_id = 'art?uid=' + parent_table_art.childNodes[j].childNodes[0].innerHTML.split('uid=')[1].split('&')[0] + '?n=' + j; else str_id = 'art?uid=?n=' + j;
        parent_table_art.childNodes[j].insertBefore(td_temp[j-3], parent_table_art.childNodes[j].firstChild);
        td_temp[j-3].setAttribute('width', '10');
        td_temp[j-3].innerHTML = '<input type="checkbox" id="' + str_id + '" title = "Отметьте, если арт в субаренде">';
        document.getElementById(str_id).onclick = function(){event_check(this);};
    }
    GM_setValue('show_setting', '1');
    opening();
})();

function event_check(obj)
{
    var tr_temp, td_temp1, td_temp2, n, id_td;
    var i, str_id;
    if(!obj.checked){
        //delete child
        for(i=0; i<add_table.children.length; i++){
            if(add_table.childNodes[i].childNodes[0].innerHTML.indexOf(obj.id) > -1){
                add_table.removeChild(add_table.childNodes[i]);
                break;
            }
        }
    } else {
        //insert child
        tr_temp = document.createElement('tr');
        add_table.appendChild(tr_temp);
        td_temp1 = document.createElement('td');
        tr_temp.appendChild(td_temp1);
        td_temp1.innerHTML = '<font title=' + obj.id + '>*</font>';
        id_td = 'td' + obj.id;
        td_temp1.setAttribute('id', id_td);
        document.getElementById(id_td).style.display = 'none';
        // создаем строку для арта
        for(i=0; i<11; i++){
            td_temp2 = document.createElement('td');
            tr_temp.appendChild(td_temp2);
        }
        // добавляем checkbox
        str_id = 'sub' + obj.id;
        tr_temp.childNodes[9].innerHTML = '<input type="checkbox" id="' + str_id + '" title = "Отметьте, если нужно передать субку по арту">';
        n = parseInt(obj.id.split('?n=')[1]);
        tr_temp.childNodes[1].innerHTML = parent_table_art.childNodes[n].childNodes[1].innerHTML;
        // запрос стоимости ремонта
        var xhr = new XMLHttpRequest();
        var uri = add_table.childNodes[1].childNodes[1].innerHTML.split('a href=')[1].split('>')[0].slice(1, -1);
        xhr.open("GET", uri, true);
        xhr.overrideMimeType('text/html; charset=windows-1251');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                text = xhr.responseText;
                add_table.childNodes[1].childNodes[6].innerHTML = text.split('Стоимость ремонта')[1].split('Золото')[1].split('<td>')[1].split('</td>')[0];
            }
        };
        //
    }
}
function GetCurrentDate()
{
    // возвращает текущую дату
    var t, s, y;
    var d = new Date();
    s = d.getDate();
    y = d.getFullYear();
    t = d.getMonth();
    if(parseInt(s) > 7){
        t = parseInt(t) + 1;
    }else{
        switch(t){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                s = "31";
                break;
            case 2:
                if(parseInt(y) % 4 === 0){s = "28";} else {s = "29";}
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                s = "30";
        }
    }
    return s + "." + t + "." + y;
}

function GetCurrentMonth()
{
    // возвращает дату начала текущего месяца
    var d = new Date();
    var t = d.getMonth();
    if(parseInt(d.getDate()) > 7){
        t = parseInt(t) + 1;
    }
    return "01." + t + "." + d.getFullYear();
}

function prescaning()
{
    //var tmp1 = 'data';
    //var t = JSON.parse(GM_getValue(tmp1));
    //GM_deleteValue(tmp1);
    //alert(t);
    //var xhr = new XMLHttpRequest();
	//xhr.open("GET", 'file:///c://artefacts.json', false);
	//xhr.overrideMimeType('text/html; charset=windows-1251');
    //xhr.send();
	//alert(xhr.responseText);
}
function opening()
{
    var str_id='', j=0;
    /*var tmp='data';
    var MyDate = {
        day: 12,
        month: 10,
        year: 2017
    };
    GM_setValue(tmp, JSON.stringify(MyDate));*/
    if(GM_getValue('show_setting')=='1'){
        GM_setValue('show_setting', '0');
        document.getElementById("table_settings").style.display = 'none';
        for(j=3; j<parent_table_art.childNodes.length; j++){
            if(parent_table_art.childNodes[j].childNodes[1].innerHTML.indexOf('uid=') > -1)str_id = 'art?uid=' + parent_table_art.childNodes[j].childNodes[1].innerHTML.split('uid=')[1].split('&')[0] + '?n=' + j; else str_id = 'art?uid=?n=' + j;
            document.getElementById(str_id).parentNode.style.display = 'none';
        }
        str_id = 'art?uid=?n=0';
        document.getElementById(str_id).parentNode.style.display = 'none';
    } else{
        GM_setValue('show_setting', '1');
        document.getElementById("table_settings").style.display = '';
        for(j=3; j<parent_table_art.childNodes.length; j++){
            if(parent_table_art.childNodes[j].childNodes[1].innerHTML.indexOf('uid=') > -1)str_id = 'art?uid=' + parent_table_art.childNodes[j].childNodes[1].innerHTML.split('uid=')[1].split('&')[0] + '?n=' + j; else str_id = 'art?uid=?n=' + j;
            document.getElementById(str_id).parentNode.style.display = '';
        }
        str_id = 'art?uid=?n=0';
        document.getElementById(str_id).parentNode.style.display = '';
    }
}