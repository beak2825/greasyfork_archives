// ==UserScript==
// @name        ClanMembersForAttak
// @author      Sweag
// @namespace   clan
// @description Инфо по героям при атаке клана
// @include     http://www.heroeswm.ru/clan_info.php*
// @version     0.10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27240/ClanMembersForAttak.user.js
// @updateURL https://update.greasyfork.org/scripts/27240/ClanMembersForAttak.meta.js
// ==/UserScript==

var DEF_COUNT = 10, HOUR_APP = 2, _MINUTE_FIND_ = 7;
var start_index = 0, cur_page = 0;
var ifrom;
var ito;
var find_shpik = 0, time_start, time_stop;
var masDef = [];
var masWinDef = [];
var masPlayer = [], masPlayerStatus = [];
var sign_sort_num = -1, sign_sort_online = -1, sign_sort_lvl = -1, sign_sort_def = -1, sign_sort_shpik = -1;
var Defstr, _STR_ALL_, _TABLE_, _SHOW_LEGEND_='';
var hrefs;
var clan_heroes_online = document.querySelectorAll("img[src$='clans/online.gif']");
var clan_heroes_offline = document.querySelectorAll("img[src$='clans/offline.gif']");
var len;
var index_line;
if(clan_heroes_online.length>clan_heroes_offline.length)len=clan_heroes_offline.length; else len=clan_heroes_online.length;
for(var i=0; i<len; i++){
    if ( clan_heroes_offline[i] ) {
        if(clan_heroes_offline[i].parentNode.parentNode.innerHTML.indexOf('1.') > -1){
            var table_clan = clan_heroes_offline[i].parentNode;
            var str = clan_heroes_offline[i].parentNode.parentNode.parentNode.innerHTML;
            _STR_ALL_ = str;
            index_line = i;
            break;
        }
    } else if ( clan_heroes_online[i] ) {
        if(clan_heroes_online[i].parentNode.parentNode.innerHTML.indexOf('1.') > -1){
            var table_clan = clan_heroes_online[i].parentNode;
            var str = clan_heroes_online[i].parentNode.parentNode.parentNode.innerHTML;
            _STR_ALL_ = str;
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
var cel = '<tr><td class="wbwhite" width="30" id=sort_number title="Сортировать по номеру"><b>№</b></td><td class="wbwhite" width="15" id=sort_online title="Сортировать по онлайну"><img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" width="15" height="15"></td><td class="wbwhite" width="150">&nbsp;&nbsp;Имя персонажа</td><td class="wbwhite" align="center" width="10" id=sort_lvl title="Сортировать по боевому уровню">&nbsp;lvl</td><td class="wbwhite" align="center">Описание</td></tr>'+str;
if ( clan_heroes_offline[index_line] ) {
    _TABLE_ = clan_heroes_offline[index_line].parentNode.parentNode.parentNode;
    clan_heroes_offline[index_line].parentNode.parentNode.parentNode.innerHTML = cel;
} else if ( clan_heroes_online[index_line] ) {
    _TABLE_ = clan_heroes_offline[index_line].parentNode.parentNode.parentNode;
    clan_heroes_online[index_line].parentNode.parentNode.parentNode.innerHTML = cel;
}

document.getElementById('sort_number').onclick = function(){fn_sort_number();};
document.getElementById('sort_online').onclick = function(){fn_sort_online();};
document.getElementById('sort_lvl').onclick = function(){fn_sort_lvl();};
//document.getElementById('sort_defs').onclick = function(){fn_sort_defs();};

hrefs = document.getElementsByTagName('a');
for(var i = 0; i < hrefs.length; i++)
{
	if(hrefs[i].href.indexOf('clan_log.php') > -1)
	{
        var myform = document.createElement('div');
		myform.id = 'sform';
		str = "<table style='border:1px solid #abc;padding:5px;margin:2px;'><tr><td style='border:1px solid #abc;padding:5px;margin:2px;' bgcolor='#6b6c6a' align='center' colspan='2'><font color='#ffd875'><b>Проверка обвеса игроков клана</b></font></td><td style='border:1px solid #abc;padding:5px;margin:2px;' bgcolor='#6b6c6a' align='center'><font color='#ffd875'><b>Проверка шпика</b></td></tr>";
		str += "<tr><td><table style='border:1px solid #abc;padding:5px;margin:2px;'><tr><td><center>По инвентарю</td></tr><tr><td><center><input type=button value='Загрузить' id=startscan1></center></td></tr></table></td>";
        str += "<td><table style='border:1px solid #abc;padding:5px;margin:2px;'><tr><td><center>По протоколу</td></tr><tr><td><center><input type=button value='Загрузить' id=startscan2></center></td></tr></table></td>";
        str += "<td><table style='border:1px solid #abc;padding:5px;margin:2px;'><tr><td colspan='2'><center>Управление</td></tr><tr><td><center><input type=button value='Старт' id=startscan3></center></td><td><center><input type=button value='  Стоп  ' id=stopscan3></center></td></tr></table></td>";
        //str += "</tr></table><tr><div id='show_legend' style='cursor: pointer;'><b>скрыть легенду</b></div></tr></div>";
        str += "<tr><td><input type=button value='Скрыть легенду' id=show_legend></td></tr></tr></table></div>";
        //str += "</tr></table></div>";
		myform.innerHTML = str;
		hrefs[i].parentNode.appendChild(myform);
		i = hrefs.length;
        document.getElementById('startscan1').onclick = function(){prescan_inventory();};
        document.getElementById('startscan2').onclick = function(){prescan_protocol();};
        document.getElementById('startscan3').onclick = function(){prescan_shpik();};
        document.getElementById('stopscan3').onclick = function(){stop_scan();};
        document.getElementById('show_legend').onclick = function(){show_hide_legend();};
	}
}
table_clan[0].childNodes[0].setAttribute("style", "cursor: pointer;");
table_clan[0].childNodes[1].setAttribute("style", "cursor: pointer;");
table_clan[0].childNodes[3].setAttribute("style", "cursor: pointer;");

start_index = 1;
init_mas_player();

function init_mas_player()
{
    for ( var i=1; i<table_clan_length+1; i++ )
    {
        masPlayer[i] = Number(table_clan[i].childNodes[2].innerHTML.split("pl_info.php?id=")[1].split('" class=')[0]);
    }
}
function sort_mas(sign_sort, NumberC)
{
	var sorted = [], original = [];
	var m, t, p, f, i, j, pp;
	for(i=1; i< table_clan_length+1; i++){
		sorted[i] = [];
		for(j=0; j<4; j++){
			sorted[i][j] = table_clan[i].childNodes[j].innerHTML;
		}
        original[i] = table_clan[i].childNodes[4].innerHTML;
        var _tmp_arr_ = original[i].split(';');
        sorted[i][4] = _tmp_arr_.length - 1;
        if(NumberC == 1){
			if(sorted[i][1].indexOf("offline.gif") > -1){
				sorted[i][1] = -1;
			}else {
				sorted[i][1] = 1;
			}
		}
		sorted[i][5] = table_clan[i].childNodes[0].getAttribute("class");
	}
	while(true){
		f = 0;
		for(i=1; i<table_clan_length; i++){
			if(NumberC!=4){
                m = sign_sort*Number(sorted[i][NumberC]);
                t = sign_sort*Number(sorted[i+1][NumberC]);
                if(m<t){
                    f = 1;
                    for(j=0; j<6; j++){
                        p = sorted[i][j];
                        sorted[i][j]=sorted[i+1][j];
                        sorted[i+1][j] = p;
                    }
                }
            }else{
                m = sign_sort*Number(sorted[i][4]);
                t = sign_sort*Number(sorted[i+1][4]);
                if(m<t){
                    f = 1;
                    for(j=0; j<6; j++){
                        p = sorted[i][j];
                        pp = original[i];
                        sorted[i][j] = sorted[i+1][j];
                        original[i] = original[i+1];
                        sorted[i+1][j] = p;
                        original[i+1] = pp;
                    }
                }
            }
		}
		if(f == 0)break;
	}
	for(i=1; i<table_clan_length+1; i++){
		for(j=0; j<4; j++){
			table_clan[i].childNodes[j].innerHTML = sorted[i][j];
			table_clan[i].childNodes[j].setAttribute("class", sorted[i][5]);
		}
        table_clan[i].childNodes[4].innerHTML = original[i];
        table_clan[i].childNodes[4].setAttribute("class", sorted[i][5]);
		if(NumberC == 1){
			if(sorted[i][1] > 0){
				table_clan[i].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/online.gif" align="absmiddle" border="0" height="15" width="15">';
			}else {
				table_clan[i].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
			}
		}
	}
}

function fn_sort_online()
{
	//сортировка по онлайну
	sign_sort_online *= -1;
	sort_mas(sign_sort_online, 1);
	sign_sort_def = -1;
	sign_sort_lvl = -1;
	sign_sort_num = 1;
	if(sign_sort_online>0){
		table_clan[0].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/online.gif" align="absmiddle" border="0" height="15" width="15">';
	}else{
		table_clan[0].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
	}
	table_clan[0].childNodes[0].innerHTML = "&nbsp;№";
	table_clan[0].childNodes[3].innerHTML = "&nbsp;lvl";
	table_clan[0].childNodes[4].innerHTML = "Описание";
	Paint();
}

function fn_sort_number()
{
	sign_sort_num *= -1;
	sort_mas(sign_sort_num, 0);
	sign_sort_def = -1;
	sign_sort_lvl = -1;
	sign_sort_online = -1;
	table_clan[0].childNodes[0].innerHTML = "<b>&nbsp;№</b>";
	table_clan[0].childNodes[3].innerHTML = "&nbsp;lvl";
	table_clan[0].childNodes[4].innerHTML = "Описание";
	table_clan[0].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
	Paint();
}
function fn_sort_lvl()
{
	// Сортировка по уровню
	sign_sort_lvl *= -1;
	sort_mas(sign_sort_lvl, 3);
	sign_sort_def = -1;
	sign_sort_num = 1;
	sign_sort_online = -1;
	table_clan[0].childNodes[0].innerHTML = "&nbsp;№";
	table_clan[0].childNodes[3].innerHTML = "<b>&nbsp;lvl</b>";
	table_clan[0].childNodes[4].innerHTML = "Описание";
	table_clan[0].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
	Paint();
}

/*function fn_sort_defs()
{
	// Сортировка по количеству дефов
	sign_sort_def *= -1;
	sort_mas(sign_sort_def, 5);
	sign_sort_lvl = -1;
	sign_sort_num = 1;
	sign_sort_online = -1;
	table_clan[0].childNodes[0].innerHTML = "&nbsp;№";
	table_clan[0].childNodes[3].innerHTML = "&nbsp;lvl";
	//table_clan[0].childNodes[5].innerHTML = "<b>&nbsp;Дефы</b>";
	table_clan[0].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
	Paint();
}
*/
function fn_sort_shpik()
{
    sign_sort_shpik *= -1;
    sort_mas(sign_sort_def, 4);
    sign_sort_def = -1;
    sign_sort_lvl = -1;
	sign_sort_num = 1;
	sign_sort_online = -1;
	table_clan[0].childNodes[0].innerHTML = "&nbsp;№";
	table_clan[0].childNodes[3].innerHTML = "&nbsp;lvl";
	table_clan[0].childNodes[4].innerHTML = "<b>Описание</b>";
	table_clan[0].childNodes[1].innerHTML = '<img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" height="15" width="15">';
	Paint();
}

function getCurrentDate()
{
	var dt=new Date(); 	var month = dt.getMonth()+1; 	if (month<10) month='0'+month;	var day = dt.getDate(); 	if (day<10)  day='0'+day;	var year = dt.getFullYear();
    return day + "-" + month + "-" + (year + '')[2] + (year + '')[3];
}
function show_hide_legend()
{
    var _table_all_ = document.getElementsByTagName('table');
    for(var i=0; i<_table_all_.length; i++){
        if(_table_all_[i].innerHTML.indexOf('sform') > -1){
            if(_table_all_[i].parentNode.nodeName!='TD')continue;
            var tmp_inner = _table_all_[i].innerHTML;
            if(_SHOW_LEGEND_==''){
                var tmp_split = tmp_inner.split('</div>');
                _table_all_[i].innerHTML = tmp_split[0] + '</div></td></tr></tbody>';
                _SHOW_LEGEND_ = '</div>' + tmp_split[1];
                document.getElementById('show_legend').setAttribute('value', 'Показать легенду');
                document.getElementById('startscan1').onclick = function(){prescan_inventory();};
                document.getElementById('startscan2').onclick = function(){prescan_protocol();};
                document.getElementById('startscan3').onclick = function(){prescan_shpik();};
                document.getElementById('stopscan3').onclick = function(){stop_scan();};
                document.getElementById('show_legend').onclick = function(){show_hide_legend();};
                return;
            }else{
                _table_all_[i].innerHTML = tmp_inner.slice(0, -24) + _SHOW_LEGEND_;
                _SHOW_LEGEND_ = '';
                document.getElementById('show_legend').setAttribute('value', 'Скрыть легенду');
                document.getElementById('startscan1').onclick = function(){prescan_inventory();};
                document.getElementById('startscan2').onclick = function(){prescan_protocol();};
                document.getElementById('startscan3').onclick = function(){prescan_shpik();};
                document.getElementById('stopscan3').onclick = function(){stop_scan();};
                document.getElementById('show_legend').onclick = function(){show_hide_legend();};
                return;
            }
        }
    }
}
function prescan_inventory()
{
    // предварительные танцы с бубном
    init_mas_player();
    scan_inventory();
}

function scan_inventory()
{ //сканирование по инвентарю
    if(start_index<masPlayer.length){
        var text, st="http://www.heroeswm.ru/pl_info.php?id=", result_text="";
        var xhr = new XMLHttpRequest();
        var _index = start_index;//masPlayer.length-
        var uri = st + masPlayer[_index];
        var arr;
        xhr.open("GET", uri, true);
        xhr.overrideMimeType('text/html; charset=windows-1251');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                text = xhr.responseText;
                arr = text.split('slot');
                for(var k=1; k<arr.length; k++)result_text += arr[k].split('title')[1].split('\n')[0].split('<')[0].slice(2);
                table_clan[_index].childNodes[4].innerHTML = '(c) empty inventary';
                if((result_text.indexOf('сурвилурга') > -1)||(result_text.indexOf('генерала') > -1)||(result_text.indexOf('воеводы') > -1)||(result_text.indexOf('времён') > -1)||(result_text.indexOf('подземелий') > -1)||(result_text.indexOf('полководца') > -1)||(result_text.indexOf('амфибии') > -1)||(result_text.indexOf('скаута') > -1)||(result_text.indexOf('Сапоги пирата') > -1)){
                    table_clan[_index].childNodes[4].innerHTML = result_text;
                }
                start_index++;
                scan_inventory();
            }
        };
    }else{
        start_index = 1;
        return;
    }
}

function prescan_protocol()
{
    // предварительные танцы с бубном
    init_mas_player();
    scan_protocol();
}

function scan_protocol()
{   //сканирование по протоколу передач
    if(start_index<masPlayer.length){
        var text, st="http://www.heroeswm.ru/pl_transfers.php?id=", result_text="", tmp_text="";
        var xhr = new XMLHttpRequest();
        var _index = start_index;//masPlayer.length-
        var uri = st + masPlayer[_index] + "&page=" + cur_page;
        var arr;
        xhr.open("GET", uri, true);
        xhr.overrideMimeType('text/html; charset=windows-1251');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                text = xhr.responseText;
                arr = text.split('Протокол игрока')[1].split('&nbsp;&nbsp;');
                var _dat = getCurrentDate();
                var _data = new Date();
                var hrs = _data.getHours();
                table_clan[_index].childNodes[4].innerHTML = '(c) empty protocol';
                for(var k=1; k<arr.length; k++){
                    if((tmp_text.indexOf('сурвилурга') > -1)||(tmp_text.indexOf('генерала') > -1)||(tmp_text.indexOf('воеводы') > -1)||(tmp_text.indexOf('времён') > -1)||(tmp_text.indexOf('подземелий') > -1)||(tmp_text.indexOf('полководца') > -1)||(tmp_text.indexOf('амфибии') > -1)||(tmp_text.indexOf('скаута') > -1)||(tmp_text.indexOf('Сапоги пирата') > -1)){
                        result_text += tmp_text;
                        tmp_text = "";
                    }
                    if(arr[k].substr(0, 8).indexOf(_dat) > -1){
                        var ttt = arr[k].substr(9, 2);
                        if(ttt.length>1){
                            if(hrs>parseInt(ttt)+HOUR_APP)continue;
                            if(arr[k].indexOf("Получен предмет") > -1){
                                tmp_text += arr[k].split("Получен предмет")[1].split("]")[0];
                                tmp_text += "]";
                                continue;
                            }
                            if(arr[k].indexOf("Арендованы") > -1){
                                tmp_text += arr[k].split("Арендованы ")[1].split("] у")[0];
                                tmp_text += "]";
                                continue;
                            }
                            if(arr[k].indexOf("Арендован артефакт") > -1){
                                tmp_text += arr[k].split("Арендован артефакт")[1].split("]")[0];
                                tmp_text += "]";
                                continue;
                            }
                        }
                    }
                }
                if((tmp_text.indexOf('сурвилурга') > -1)||(tmp_text.indexOf('генерала') > -1)||(tmp_text.indexOf('воеводы') > -1)||(tmp_text.indexOf('времён') > -1)||(tmp_text.indexOf('подземелий') > -1)||(tmp_text.indexOf('полководца') > -1)||(tmp_text.indexOf('амфибии') > -1)||(tmp_text.indexOf('скаута') > -1)||(tmp_text.indexOf('Сапоги пирата') > -1)){
                        result_text += tmp_text;
                    }
                if(result_text.length > 1){
                    table_clan[_index].childNodes[4].innerHTML = result_text;
                    start_index++;
                    cur_page = 0;
                    scan_protocol();
                }else{
                    if(parseInt(arr[arr.length-1].split("-")[1])!=parseInt(_dat.split("-")[1])){
                        cur_page = 0;
                        start_index++;
                        scan_protocol();
                        return;
                    }
                    if(parseInt(arr[arr.length-1].split("-")[0])>=parseInt(_dat.split("-")[0])-1){
                        cur_page++;
                        scan_protocol();
                    }else{
                        cur_page = 0;
                        start_index++;
                        scan_protocol();
                    }
                }
            }
        };
    }else{
        start_index = 1;
        cur_page = 0;
        return;
    }
}

function listen()
{
	if(arr_index > arr.length-1){
		document.getElementById('startscan').value = "Загружено: " + start_index;
		setTimeout(scaning,1000);
		return;
	}
	var cur = getCurTimestamp(arr[arr_index]);
	if(cur >= ifrom && cur <= ito){
		var s = arr[arr_index].split(': ')[1];
		if(s.indexOf('Нападение') > -1){
			var ss = "http://www.heroeswm.ru/" + arr[arr_index].split('<a href="')[3].split('">история')[0];
			var ans = new XMLHttpRequest();
			ans.open("GET", ss, true);
			ans.overrideMimeType('text/html; charset=windows-1251');
			ans.send();
			ans.onreadystatechange = function() {
				if (ans.readyState != 4){ return;}
				if (ans.status == 200) {
					var text_history = ans.responseText;
					text_history = text_history.split('Нападение Сурвилургов')[1].split('<!--</td></tr></table>-->')[0].replace('<!--0-->','');
					var arr_history = text_history.split('Сурвилурги');
					for(var j = 1; j < arr_history.length; j++){
						for(var k=0; k<masPlayer.length; k++){
							if(arr_history[j].indexOf(masPlayer[k]) > -1 ){
								masDef[k]++;
								if(arr_history[j].indexOf('получено') > -1 )masWinDef[k]++;
							}
						}
					}
					arr_index++;
					listen();
				}
			};
		}else{
			arr_index++;
			listen();
		}
	}
	else if(cur < ifrom){
		document.getElementById('startscan').value = "Готово";
        document.getElementById('startscan').disabled=true;
		for(var i=1; i<table_clan_length+1; i++){
			table_clan[i].childNodes[5].innerHTML = masDef[i];
			table_clan[i].childNodes[6].innerHTML = masWinDef[i];
			if( masDef[i] != 0 ){
				var percent_win = Math.round(masWinDef[i]/masDef[i]*100);
				table_clan[i].childNodes[7].innerHTML = percent_win;
			}else{
				table_clan[i].childNodes[7].innerHTML = 0;
			}
		}
		Paint();
	}else{
        arr_index++;
		listen();
    }
}

/*function scaning()
{
	var st=document.location.href;
	var xhr = new XMLHttpRequest();
	var uri = st.replace('info', 'log')+"&page="+start_index;
	start_index++;
	arr_index = 1;
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			text = xhr.responseText;
			text = text.split('<!-- big table -->')[1];
			text = text.split('&gt;</a></center>')[1];
			text = text.split('</td></tr></table>')[0];
			arr = text.split('&nbsp;&nbsp;');
			listen();
		}
	};
}
*/
function Paint()
{
	var def, win;
	for(var i=1; i<table_clan_length+1; i++){
		def = Number(table_clan[i].childNodes[5].innerHTML);
		win = Number(table_clan[i].childNodes[6].innerHTML);
		if( def < DEF_COUNT ){
			table_clan[i].childNodes[5].setAttribute("style", "color: red;");
		}else{
			table_clan[i].childNodes[5].setAttribute("style", "color: green;");
		}
		if( def == 0 ){
			table_clan[i].childNodes[7].setAttribute("style", "color: black;");
		}else{
			if(100*win/def < 75){
				table_clan[i].childNodes[7].setAttribute("style", "color: red;");
			}else{
				table_clan[i].childNodes[7].setAttribute("style", "color: green;");
			}
		}
		table_clan[i].childNodes[5].setAttribute("align", "center");
		table_clan[i].childNodes[6].setAttribute("align", "center");
		table_clan[i].childNodes[7].setAttribute("align", "center");
	}
}

function getCurTimestamp(str)
{
	var t = str.split(' ')[0].split('-');
	return (new Date("20" + t[2] + "-" + t[1] + "-" + t[0]));
}

function stop_scan()
{
    find_shpik = 0;
    table_clan[0].childNodes[4].innerHTML = "Описание";
}

function prescan_shpik()
{
    var _date_stamp = new Date();
    var _status, _num_status;
    find_shpik = 1;
    time_start = _date_stamp.getMinutes();
    if(time_start>55)time_stop = time_start + _MINUTE_FIND_ - 60; else time_stop = time_start + _MINUTE_FIND_;
    for ( var i=1; i<table_clan_length+1; i++ ){
        _status = table_clan[i].childNodes[1].innerHTML.split("dcdn.heroeswm.ru/i/clans/")[1].split('.gif')[0];
        masPlayerStatus[i] = ';' + _status;
    }
    var cel1 = '<tr><td class="wbwhite" width="30" id=sort_number title="Сортировать по номеру"><b>№</b></td><td class="wbwhite" width="15" id=sort_online title="Сортировать по онлайну"><img src="http://dcdn.heroeswm.ru/i/clans/offline.gif" align="absmiddle" border="0" width="15" height="15"></td><td class="wbwhite" width="150">&nbsp;&nbsp;Имя персонажа</td><td class="wbwhite" align="center" width="10" id=sort_lvl title="Сортировать по боевому уровню">&nbsp;lvl</td><td class="wbwhite" align="center" id=sort_shpik title="Сортировать по результату">Проверка начата в ';
    cel1 += time_start;
    cel1 += ' минут, окончание в ';
    cel1 += time_stop;
    cel1 += ' минут</td></tr>';
    cel1 += _STR_ALL_;
    _TABLE_.innerHTML = cel1;
    table_clan[0].childNodes[4].setAttribute("style", "cursor: pointer;");
    document.getElementById('sort_shpik').onclick = function(){fn_sort_shpik();};
    scan_shpik();
}

function scan_shpik()
{
    //ищем шпика
    if(!find_shpik)return;
    var _date_stamp = new Date();
    if(time_stop == _date_stamp.getMinutes()){alert('Время поиска вышло, проверьте результат'); return;}
    var text, result_text="";
    var xhr = new XMLHttpRequest();
    var uri = document.location.href;
    var arr;
    xhr.open("GET", uri, true);
    xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            text = xhr.responseText;
            arr = text.split('Сайт клана')[1].split('pl_info.php?id=');
            var _status;
            for(var i=1; i<arr.length; i++){
                _status = arr[i-1].split("dcdn.heroeswm.ru/i/clans/")[1].split('.gif')[0];
                var _arr_status = masPlayerStatus[i].split(';');
                if(_status!= _arr_status[_arr_status.length-1]){
                    masPlayerStatus[i] += ';';
                    masPlayerStatus[i] += _status;
                }
                table_clan[i].childNodes[4].innerHTML = masPlayerStatus[i];
            }
        }
    };
    setTimeout(scan_shpik, 10000);
}