// ==UserScript==
// @name         CountWar
// @namespace    clan
// @version      0.0.4
// @description  Подсчет количества заявок в атаке на подборе
// @author       Sweag
// @include      http://www.heroeswm.ru/clan_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25635/CountWar.user.js
// @updateURL https://update.greasyfork.org/scripts/25635/CountWar.meta.js
// ==/UserScript==

var ID_CLAN = document.location.href.split('?id=')[1];
var index, table_clan, str;
var mas =[]; //глобальный массив с данными по игрокам кланов, вложенные массивы: id игрока -> начальная прочка -> текущая прочка -> последняя прочка (меняются местами, текущая затирается)

if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}

var str_monitor, d;
var hrefs = document.getElementsByTagName('a');
for(var i = 0; i < hrefs.length; i++){
    if(hrefs[i].href.indexOf('clan_log.php') > -1){
        var myform = document.createElement('div');
        myform.id = 'sform';
        myform.innerHTML = "<table><div id='table_clan_top'></div></table></div>";
        hrefs[i].parentNode.appendChild(myform);
        break;
    }
}

d = document.getElementById('table_clan_top');
str_monitor = "<table><tr><td bgcolor='#6b6c6a' align='center' colspan='3'><font color='#ffd875'><b>Мониторинг захвата</b></font></td></tr><tr><td height='24'></td><td></td></tr>";
str_monitor += "<tr height='24'><td>Троек:</td></tr><tr align='center' height='24'><td><input type=button value='Старт!' id=startmonitor></td><td><input type=button value='Обновить' id=getmonitor></td><td><input type=button value='Очистить' id=stopmonitor></td></tr></table>";
d.innerHTML += str_monitor;
document.getElementById('getmonitor').onclick = function(){update_mon();};
document.getElementById('startmonitor').onclick = function(){start_mon();};
document.getElementById('stopmonitor').onclick = function(){stop_mon();};

var clan_heroes_online = document.querySelectorAll("img[src$='clans/online.gif']");
var clan_heroes_offline = document.querySelectorAll("img[src$='clans/offline.gif']");
if(clan_heroes_online.length>clan_heroes_offline.length)len=clan_heroes_offline.length; else len=clan_heroes_online.length;
for(var i=0; i<len; i++){
    if ( clan_heroes_offline[i] ) {
        if(clan_heroes_offline[i].parentNode.parentNode.innerHTML.indexOf('1.') > -1){
            table_clan = clan_heroes_offline[i].parentNode;
            str = clan_heroes_offline[i].parentNode.parentNode.parentNode.innerHTML;
            index_line = i;
            break;
        }
    } else if ( clan_heroes_online[i] ) {
        if(clan_heroes_online[i].parentNode.parentNode.innerHTML.indexOf('1.') > -1){
            table_clan = clan_heroes_online[i].parentNode;
            str = clan_heroes_online[i].parentNode.parentNode.parentNode.innerHTML;
            index_line = i;
            break;
        }
    }
}
if ( table_clan ) {
		while ( table_clan.tagName != 'TR' ) { table_clan = table_clan.parentNode; }
		table_clan = table_clan.parentNode.childNodes;
}
var table_clan_length = table_clan.length;

//innerHTML += "<div><table><tr><td>111</td><td>111</td></tr></table></div>";
//get_info_clan("http://www.heroeswm.ru/clan_info.php?id=" + ID_CLANS);
//GM_deleteValue('val_num');
/*val_num = GM_getValue('val_num');
if(val_num==undefined)val_num=0;
alert(val_num);
val_num++;
GM_setValue('val_num', val_num);*/

function start_mon()
{
    var t = GM_getValue('save_mas' + ID_CLAN);
    if(t==null||t==0){
        mas[0] = -1;
        GM_setValue('save_mas' + ID_CLAN, 1);
        GM_setValue('mas_count_war' + ID_CLAN, JSON.stringify(mas));
        //alert(1);
    }
    mas = JSON.parse(GM_getValue('mas_count_war' + ID_CLAN, '[]'));
    update_mon();
}

function update_mon()
{
    //document.getElementById('select_rayon').disabled = true;
    index = 42;
    while(index<table_clan_length){
        if(table_clan[index].childNodes[1].innerHTML.indexOf('online') > -1){
            get_info();
            break;
        }
        index++;
    }
}

function stop_mon()
{
    var t = GM_getValue('save_mas' + ID_CLAN);
    if(t!=null&&t!=0){GM_deleteValue('save_mas' + ID_CLAN);}
    t = GM_getValue('mas_count_war' + ID_CLAN);
    if(t!=null&&t!=0){GM_deleteValue('mas_count_war' + ID_CLAN);}
    mas = [];
}

function get_info()
{
    if(index>42){//table_clan_length){
        paint();
        return;
    }
    var xhr = new XMLHttpRequest(), href, ID, text, i, find = 0, slot, art, name, n, proch, flaga = -1;
    ID = parseInt(table_clan[index].childNodes[2].innerHTML.split('pl_info.php?id=')[1].split('class=')[0]);
    href = 'http://www.heroeswm.ru/pl_info.php?id=' + ID;
    xhr.open("GET", href, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			slot = xhr.responseText.split('<!-- big table -->')[1].split('slot10')[1];
            if(slot.split('art_info.php?id=')[1].split('crc')[0].indexOf('flyaga') > -1){
                n = slot.indexOf('Прочность');
                flaga = parseInt(slot.slice(n+10, text.indexOf('/', n)));
            }
            slot = xhr.responseText.split('<!-- big table -->')[1].split('slot5')[1];
            text = slot.split('title')[1];
            n = text.indexOf('Прочность');
            proch = parseInt(text.slice(n+10, text.indexOf('/', n)));
            //n = text.indexOf('Нападение');
            //name = text.slice(2, n-1);
            name = slot.split('art_info.php?id=')[1].split('crc')[0];
            if(!isNaN(proch)){
                if(mas[0] == -1){
                    mas[0] = ID + '||' + name + '||' + proch + '||' + proch + '||' + proch + '||' + 0;
                    index++;
                    get_info();
                    return;
                }
                for(i=0; i<mas.length; i++){
                    art = mas[i].split('||');
                    if(parseInt(art[0])==ID){
                        if(art[1]==name){
                            // арт тот же, проверяем прочку
                            if(parseInt(art[0]));
                        }else {
                            // арт не совпадает - пишем новую прочку
                            ;
                        }
                    }
                }
            }
            index++;
            get_info();
        }
	};
}

function paint()
{
    alert(mas[0]);
}















function init_select()
{
    var text, mas_text, i, j, _value_="", title="";
	var xhr = new XMLHttpRequest();
	var uri = "http://www.heroeswm.ru/clan_info.php?id=3892";
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			text = xhr.responseText;
            text = text.split('<!-- big table -->')[1].split('</td></tr></table><table')[1].split('<!--</td></tr></table>-->')[0];
			mas_text = text.split('clan_info.php?id=');
            for(i=0; i<hrefs.length; i++){
                if(hrefs[i].innerHTML.indexOf('Категории') > -1){
                    var pp = hrefs[i].innerHTML.split('Категории');
                    var s0 = pp[0] + 'Категории <select id="select_clan" style="width:135"><option value="0">Выберите..</option>';
                    for(j=1; j<mas_text.length; j++){
                        _value_ = mas_text[j].split("'>")[0];
                        if(_value_.length > 5)_value_ = mas_text[j].split('">')[0];
                        title = mas_text[j].split('title=')[1];
                        if(title.indexOf("'")==0)title = title.split("'")[1]; else title = title.split('"')[1];
                        if(s0.indexOf(title) > -1)continue;
                        s0 += '<option value="' + _value_ + '">' + title + '</option>';
                    }
                    s0 += '</select>'+ pp[1];
                    hrefs[i].innerHTML = s0;
                    break;
                }
            }
		}
      document.getElementById("select_clan").onchange = function(){select_change();};
	};
}