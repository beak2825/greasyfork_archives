// ==UserScript==
// @name           hwm_ecostat_adv
// @description    Ecostat advanced by перф
// @homepage       http://elfius.com/forum_new/index.php?showtopic=760
// @version        4.14
// @include        https://*heroeswm.ru/map.php*
// @include        https://*heroeswm.*/map.php*
// @include        https://*heroeswm.*/ecostat*
// @include        https://*heroeswm.*/object-info.php*
// @include        https://*heroeswm.*/mercenary_guild.php*
// @include        https://178.248.235.15/map.php*
// @include        https://178.248.235.15/ecostat*
// @include        https://178.248.235.15/object-info.php*
// @include        https://178.248.235.15/mercenary_guild.php*
// @include        http://*heroeswm.*/map.php*
// @include        http://*heroeswm.*/ecostat*
// @include        http://*heroeswm.*/object-info.php*
// @include        http://*heroeswm.*/mercenary_guild.php*
// @include        http://178.248.235.15/map.php*
// @include        http://178.248.235.15/ecostat*
// @include        http://178.248.235.15/object-info.php*
// @include        http://178.248.235.15/mercenary_guild.php*
// @grant          GM_log
// @namespace перф
// @downloadURL https://update.greasyfork.org/scripts/12761/hwm_ecostat_adv.user.js
// @updateURL https://update.greasyfork.org/scripts/12761/hwm_ecostat_adv.meta.js
// ==/UserScript==

// (c) 2009, LazyGreg  http://www.heroeswm.ru/pl_info.php?id=160839
// (c) 2010-2012, demin  (http://www.heroeswm.ru/pl_info.php?id=15091)
// (c) 2013, перф  (http://www.heroeswm.ru/pl_info.php?id=2188492)

// 4.14 24.07.2020 ввод акционерных предприятий, сместился баланс.
// 4.13 14.03.2020 изменение значков ресурсов.
// 4.12 19.11.2018 перевод сервера игры на https://
// 4.11 30.09.2015 добавлен сектор Sublime Arbor.
// 4.10 11.12.2013 полностью переработан алгоритм получения баланса и времени (быстрее обрабатывает, сохраняет баланс даже если нет Окончания смены).
// 4.06 10.12.2013 выделение цветом времени объектов за последние 5 минут при балансе >1000з.
// 4.05 19.11.2013 добавлены новые сектора, 5 переменных для хранения значений.
// 4.03 09.10.2013 fix для FF3.6.
// 4.02 09.10.2013 Предприятия разбиты в 3 переменных в зависимости от id; Выделение цветом и жирным ячейки "Может купить" в таблице статистики.
// 4.01 Добавлены балансы

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';
var chunks = 5; // количество переменных для хранения статистики
var chunk = 100; // количество obj_id в одной переменной
var BalBorder = 1000; //граница баланса для выделения цветом времени объёктов.

try {

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
    this.GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
}

// ===== ID - Location lookup table =====
var id2loc = [];
var o;
// == create objects with loc info
o = {};
o.abbr = "EmC";
o.name = "Empire Capital";
o.colr = "#000000";
o.ids = [3,4,5,6,7,8,9,10,11,12,32,34,38,165];
id2loc.push(o);
//
o = {};
o.abbr = "EsR";
o.name = "East River";
o.colr = "#000000";
o.ids = [23,24,25,26,28,33,36,75,87,89,238,258,279,300,321,342];
id2loc.push(o);
//
o = {};
o.abbr = "PoR";
o.name = "Portal's Ruins";
o.colr = "#FF0000";
o.ids = [92,93,99,100,102,118,163,211,217,228,245,266,287,308,329,350];
id2loc.push(o);
//
o = {};
o.abbr = "WoD";
o.name = "Wolf's Dale";
o.colr = "#000000";
o.ids = [43,44,45,46,47,48,74,85,86,226,241,261,282,303,324,345];
id2loc.push(o);
//
o = {};
o.abbr = "LzL";
o.name = "Lizard's Lowland";
o.colr = "#009900";
o.ids = [56,57,58,59,60,61,63,64,80,83,242,263,284,305,326,347];
id2loc.push(o);
//
o = {};
o.abbr = "GrW";
o.name = "Green Wood";
o.colr = "#009900";
o.ids = [67,68,69,70,71,72,76,77,81,88,243,264,285,306,327,348];
id2loc.push(o);
//
o = {};
o.abbr = "SnC";
o.name = "Sunny City";
o.colr = "#CC6600";
o.ids = [103,104,105,106,107,115,116,213,220,231,248,269,290,311,332,353];
id2loc.push(o);
//
o = {};
o.abbr = "ShS";
o.name = "Shining Spring";
o.colr = "#009900";
o.ids = [108,109,110,111,112,113,114,117,219,230,247,268,289,310,331,352];
id2loc.push(o);
//
o = {};
o.abbr = "EgN";
o.name = "Eagle's Nest";
o.colr = "#CC6600";
o.ids = [94,95,97,98,101,119,120,139,140,227,244,265,286,307,328,349];
id2loc.push(o);
//
o = {};
o.abbr = "PcC";
o.name = "Peaceful Camp";
o.colr = "#CC6600";
o.ids = [49,50,51,52,53,54,55,73,79,82,141,262,283,304,325,346];
id2loc.push(o);
//
o = {};
o.abbr = "TgL";
o.name = "Tiger's Lake";
o.colr = "#000000";
o.ids = [13,14,15,16,27,31,35,39,84,224,239,259,280,301,322,343];
id2loc.push(o);
//
o = {};
o.abbr = "RgW";
o.name = "Rogue's Wood";
o.colr = "#000000";
o.ids = [18,19,20,21,22,30,37,78,90,225,240,260,281,302,323,344];
id2loc.push(o);
//
//
o = {};
o.abbr = "MgM";
o.name = "Magma Mines";
o.colr = "#3300FF";
o.ids = [121,122,135,142,143,144,145,164,216,232,249,270,291,312,333,354];
id2loc.push(o);
//
o = {};
o.abbr = "BrM";
o.name = "Bear' Mountain";
o.colr = "#3300FF";
o.ids = [123,124,125,136,146,147,148,149,214,215,250,271,292,313,334,355];
id2loc.push(o);
//
o = {};
o.abbr = "FrT";
o.name = "Fairy Trees";
o.colr = "#3300FF";
o.ids = [126,127,134,150,151,152,153,212,221,233,251,272,293,314,335,356];
id2loc.push(o);
//
o = {};
o.abbr = "MfC";
o.name = "Mythril Coast";
o.colr = "#3300FF";
o.ids = [128,129,130,137,138,154,155,156,157,235,253,274,295,316,337,358];
id2loc.push(o);
//
o = {};
o.abbr = "PrC";
o.name = "Port City";
o.colr = "#3300FF";
o.ids = [131,132,133,158,159,160,161,162,222,234,252,273,294,315,336,357];
id2loc.push(o);
//
o = {};
o.abbr = "FsV";
o.name = "Fishing Village";
o.colr = "#FF0000";
o.ids = [166,174,175,196,197,198,199,200,223,236,256,277,298,319,340,361];
id2loc.push(o);
//
o = {};
o.abbr = "DrC";
o.name = "Dragons's Caves";
o.colr = "#000000";
o.ids = [167,168,169,170,171,172,209,210,218,229,246,267,288,309,330,351];
id2loc.push(o);
//
o = {};
o.abbr = "GtW";
o.name = "Great Wall";
o.colr = "#FF0000";
o.ids = [173,178,179,192,193,194,195,201,202,203,254,275,296,317,338,359];
id2loc.push(o);
//
o = {};
o.abbr = "TiV";
o.name = "Titans' Valley";
o.colr = "#FF0000";
o.ids = [176,177,187,188,189,190,191,206,207,208,255,276,297,318,339,360];
id2loc.push(o);
//
o = {};
o.abbr = "KiC";
o.name = "Kingdom Castle";
o.colr = "#FF0000";
o.ids = [180,181,182,183,184,185,186,204,205,237,257,278,299,320,341,362];
id2loc.push(o);
//
o = {};
o.abbr = "UnS";
o.name = "Ungovernable Steppe";
o.colr = "#CC6600";
o.ids = [363,364,365,366,369,370,371,372,373,374,375,376,377,378,379,380];
id2loc.push(o);
//
o = {};
o.abbr = "CrG";
o.name = "Crystal Garden";
o.colr = "#CC6600";
o.ids = [367,368,381,382,383,384,385,386,387,388,389,390,391,392,393,394];
id2loc.push(o);
//
o = {};
o.abbr = "Wld";
o.name = "The Wilderness";
o.colr = "#009900";
o.ids = [395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410];
id2loc.push(o);
//
o = {};
o.abbr = "SbA";
o.name = "Sublime Arbor";
o.colr = "#009900";
o.ids = [411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426];
id2loc.push(o);

//

for (var i=0; i<chunks; i++) {
	if( !GM_getValue("hwm_ecost_adv_times"+i) ) GM_setValue("hwm_ecost_adv_times"+i, '|2000_00_0');
}
var wtime_regexp = /: (\d+):(\d+)/;
var id_regexp = /id=(\d+)/;
var isEcostat = (url_cur.indexOf("/ecostat_details.php") != -1);
var isMap = (url_cur.indexOf("/map.php") != -1);
var isMercenary = (url_cur.indexOf("/mercenary_guild.php") != -1);
var hwm_check_time = GM_getValue("hwm_check_time", '1'); // see time
var hwm_check_del = GM_getValue("hwm_check_del", '1'); // delete vladelez
var hwm_check_full = GM_getValue("hwm_check_full", '1'); // full name
var naStr = "&nbsp;<b>[n/a]</b>,<font style=color:#666666>000</font style>";

var bt = document.createElement('b');
bt.innerHTML = ' &#9650;';
bt.title = "Настройки скрипта";
addEvent(bt, "click", setting_ts);

var all_a = tag('b');
var a_len = all_a.length;
for (var i=a_len; i--;) {
	var a_i = all_a[i];
	if ( a_i.innerHTML.match(/татистика/) ) {
	if ( location.pathname=='/map.php' ) {
	a_i.parentNode.parentNode.insertBefore(bt, a_i.parentNode.nextSibling);
	} else {
	a_i.parentNode.insertBefore(bt, a_i.nextSibling);
	}
	break;
	}
}

if (url_cur.indexOf("/object-info.php")!=-1) {

var obj_id = id_regexp.exec(url_cur)[1];
var b_id = (tag('body'))[0].innerHTML;
recordWorkTime(obj_id,b_id);

} else {
makeLinks();

var d = document.createElement('iframe');
d.setAttribute( 'style' , 'position:absolute; top:0; width:100; height:30; visibility:hidden;' );
document.body.appendChild(d);

editTables();
}

} finally {  }


function editTables(){
if (isMap) {
// Очищаем столбец Владелец.
   var t_all = tag('TABLE') ;
   for (var i=t_all.length; i--;)	{
     var re = new RegExp('Владелец');
     if ( t_all[i].rows[0].cells[1] != undefined ) {
    	var matches = re.exec(t_all[i].rows[0].cells[1].textContent);
    	if (matches) {
        var table=t_all[i];
        for (var j = 0; j < table.rows.length; j++) {
            var cell = table.rows[j].cells[1];
            while (cell.childNodes.length > 0)
                delete cell.removeChild(cell.firstChild);
//		cell.style.display="none"; // вешает!
        }
	break;
    	}
     }
   }
} else if (isEcostat) {
// Меняем "Может купить"
   var t_all = tag('TABLE') ;
   for (var i=t_all.length; i--;)	{
     var table=t_all[i];
     if ( t_all[i].rows[0].cells[1] != undefined ) {
    	if ( table.rows[0].cells[1].textContent.match('Может купить') ) {
	table.rows[0].cells[1].firstChild.textContent = "Куп.";
        table.rows[0].cells[0].width = "85%";
           for (var j = 1; j < table.rows.length; j++) {
            	var cell = table.rows[j].cells[1];
		if ( parseInt(cell.firstChild.textContent)>0 ) {
//                   cell.style.color="#006699";
                   cell.style.fontWeight = "bold";
//                   cell.style.textDecoration = "blink";
                   cell.style.backgroundColor="#CCFF99";
	      	}
           }
        }
    	if ( table.rows[0].cells[1].textContent.match('Может продать') ) {
	table.rows[0].cells[1].firstChild.textContent = "Ресурс";
        table.rows[0].cells[0].width = "70%";
	break;
        }
     }
   }
}
}

function recordWorkTime(obj_id,text)
{
var chunk_num=Math.floor(obj_id/chunk);
//GM_log(obj_id +"="+ chunk_num);
var times_str = GM_getValue("hwm_ecost_adv_times"+chunk_num);

// Получаем Баланас только для нормально открытой страницы, т.к. XMLHttpRequest всё равно не передаёт нормально русские символы
//objectBalance = 0;
/*var t_all = document.getElementsByTagName ('TABLE')
for (var i=t_all.length; i--;)	{
    var re = new RegExp('Баланс:');
    var matches = re.exec(t_all[i].rows[0].cells[0].textContent);
    if (matches) {
        objectBalance = Number(t_all[i].rows[0].cells[1].textContent.replace(/\D/g, ""))
	break;
    }
}
// И больше ничего не делаем
*/

var objectBalance = 0;
var objectMinutes = "99";
//var objectMinutes = new Date().getMinutes();
//objectMinutes = Math.floor(objectMinutes/5)*5; // округляем в меньшую сторону; нужно учесть 0 или 5 - краш при разборе строки (d{2})

var responseObj = document.implementation.createHTMLDocument(null);
var body_2=-1;
var body_1=text.indexOf("<body");
if (body_1==-1) body_1=text.indexOf("<BODY"); // надо учесть регистры
if (body_1!=-1) {
	body_2=text.indexOf("<\/BODY>");
	if (body_2==-1) body_2=text.indexOf("<\/body>");
}
if (body_2!=-1) {text=text.substring(body_1,body_2+7);}
//GM_log (text);

responseObj.documentElement.innerHTML = text; // нужно вынуть только то что в <BODY> а то засирает консоль ошибок предупреждениями.

var tables = responseObj.querySelectorAll("table");
for (var i=tables.length; i--;)	{
    var gold_img = tables[i].querySelectorAll("[src*='gold.png']");
    if (gold_img.length==3) {
        objectBalance = Number(gold_img[0].parentNode.nextSibling.textContent.replace(/\D/g, ""))
	var ta = wtime_regexp.exec(tables[i].innerHTML);
        if (ta) { objectMinutes = ta[2]; }
	break;
    }
}

	var new_time = obj_id+"_"+objectMinutes+"_"+objectBalance;
	if (times_str.indexOf("|"+obj_id+"_")==-1) { // very 1st visit
		times_str += "|"+new_time;
	} else {
		var vt_regexp = obj_id+"_\(\\d\{2\}\)_\(\\d\+\)";
		var vtR = new RegExp( vt_regexp );
		times_str = times_str.replace(vtR, new_time);
	}

/*if (ta) {

	PosBal = text.indexOf(ta[1]+':'+ta[2]);
		BalS = text.substring(PosBal-650, PosBal-250);
		if ( BalS.match(/gold.gif.+?<\/td><td><b>(.+)<\/b><\/td><\/tr>/) ) {
			objectBalance =  Number( (RegExp.$1).replace(/\D/g, "") );


	var new_time = obj_id+"_"+ta[2]+"_"+objectBalance;
	if (times_str.indexOf("|"+obj_id+"_")==-1) { // very 1st visit
		times_str += "|"+new_time;
	} else {
		var vt_regexp = obj_id+"_\(\\d\{2\}\)_\(\\d\+\)";
		var vtR = new RegExp( vt_regexp );
		times_str = times_str.replace(vtR, new_time);
	}

} else if (times_str.indexOf("|"+obj_id+"_")!=-1) {
		var vt_regexp = "\\|"+ obj_id+"_\(\\d\{2\}\)_\(\\d\+\)";
		var vtR = new RegExp( vt_regexp );
		times_str = times_str.replace(vtR, "");
}*/


GM_setValue("hwm_ecost_adv_times"+chunk_num, times_str);
}

function makeLinks(){
	var sa;
	var loc;
	var loc_data;
	var ts = "";
	var ids_passed_str = "";
	var my_row;
	var id_regexp = /object-info.php\?id=(\d+)/;
	var my_id;
	var target_time;
	var target_time2;

	var row_count = 0;
	var a_all = tag('a') ;
	var el;
	for (var i=0; i<a_all.length; i++) {
		el = a_all[i];
		if (el.href.indexOf('/object-info.php?')==-1) { continue; }

		ts = "_"+el.href.split('/object-info.php?')[1]+"_";
		if (ids_passed_str.indexOf(ts)!=-1) { continue; } //workaround for last cell on map page (>>>)
		ids_passed_str += ts;

		target_time = naStr;
		my_id = id_regexp.exec(el.href)[1];

	if ( hwm_check_time==1 ) {

		//target_time2 = get_time_id(my_id);
		//if ( target_time2 ) target_time = target_time2;

		sa = document.createElement( 'a' );
		sa.href = el.href;
		sa.style.fontSize = "11px";
		//sa.innerHTML = target_time;
		sa.innerHTML = get_time_id(my_id);
	}

		if (isEcostat) { // add location only in Ecostat page
			if ( hwm_check_del == 1 ) {
			while (a_all[i].parentNode.childNodes[2]) a_all[i].parentNode.removeChild(a_all[i].parentNode.childNodes[2]);
			}
			loc_data = getLocData(my_id);
			loc = document.createElement( 'span' );
			if ( hwm_check_full == 1 ) {
			loc.innerHTML = ",&nbsp;<b><font color="+loc_data.colr+">"+loc_data.name+"</font></b>";
			} else {
			loc.title = loc_data.name;
			loc.innerHTML = "&nbsp;<b><font color="+loc_data.colr+">"+loc_data.abbr+"</font></b>";
			}
			el.parentNode.insertBefore(loc, el.nextSibling);
		}

		if (!isMercenary && sa) {
			el.parentNode.insertBefore(sa, el.nextSibling);
			addEvent(sa, "click", get_obj_time);
		}

		if (isMercenary) { // add location only in Mercenary Guild page
			loc_data = getLocData(my_id);
			loc = document.createElement( 'span' );
			//loc.title = loc_data.name;
			//loc.title = "Wolf's Dale";
			//loc.innerHTML = "&nbsp;&nbsp;XXX";
			loc.innerHTML = "&nbsp;<b>(&nbsp;<font color="+loc_data.colr+">"+loc_data.name+"</font>&nbsp;)</b>";
			el.parentNode.insertBefore(loc, el.nextSibling);
		}

		if (row_count%2 && isEcostat) {
			my_row = el.parentNode.parentNode;
			for(rn=0; rn<my_row.childNodes.length; rn++){
				my_row.childNodes[rn].style.backgroundColor = "#fff";
			}
		}
		row_count++;
	}
}

function getLocData(n) {
	var loc_data = {};
	loc_data.abbr = "n/a";
	loc_data.name = "New Loc?";
	loc_data.colr = "#000000";

	var o;
	var ids_str;
	for(var i=0; i<id2loc.length; i++) {
		o = id2loc[i];
		ids_str = "_" +o.ids.join("_")+ "_";
		if(ids_str.indexOf("_"+n+"_") != -1) {
			loc_data = o;
		}
	}
	return loc_data;
}

function get_obj_time(event)
{
event = event || window.event;
event.preventDefault ? event.preventDefault() : (event.returnValue=false);
var sa = event.target || event.srcElement;
if ( !sa.href ) {
	if (sa.parentNode.parentNode.nodeName=="A") {sa = sa.parentNode.parentNode} else {sa = sa.parentNode} // после подсветки устройства на работу смещается parentNode при клике на времени
}
sa.innerHTML = loaderid(); // анимация загрузки.
var objXMLHttpReqFrId = createXMLHttpReq(Math.random()* 1000000);
objXMLHttpReqFrId.open('GET', sa.href + '&rand=' + (Math.random()* 1000000), true);
objXMLHttpReqFrId.onreadystatechange = function() { handleHttpResponseFrId(objXMLHttpReqFrId,sa); }
objXMLHttpReqFrId.send(null);
}

function handleHttpResponseFrId(obj,sa) {
if (obj.readyState == 4 && obj.status == 200) {
var obj_id = id_regexp.exec(sa.href)[1]; //получение id-обекта из строки ссылки
recordWorkTime(obj_id,obj.responseText); // передаём XMLHttpRequest
//GM_log (obj.responseXML);
/*var target_time = naStr;
var target_time2 = get_time_id(obj_id);
if ( target_time2 ) target_time = target_time2;
sa.innerHTML = target_time;*/
sa.innerHTML = get_time_id(obj_id);
}
}

function get_time_id(my_id)
{
var chunk_num=Math.floor(my_id/chunk);
var times_str = GM_getValue("hwm_ecost_adv_times"+chunk_num);
var target_time2 = naStr;

if(times_str.indexOf("|"+my_id+"_")!=-1) {

var curDate = new Date();
var curHour = curDate.getHours();
var curMin = curDate.getMinutes();
var vt_arr = [];

var vt_regexp = my_id+ "_\(\\d\{2\}\)_\(\\d\+\)";
var vtR = new RegExp( vt_regexp );
vt_arr = vtR.exec(times_str);
//t_min = vt_arr.length? vtR.exec(times_str)[1] : "00"; // ?
var t_min = vt_arr.length? vt_arr[1] : "99"; // ?
var BalanceNum = vt_arr? vt_arr[2] : "000";
/*var t_min = "99";
var BalanceNum = "000";
  if (vt_arr) {
	t_min = vt_arr[1];
	BalanceNum = vt_arr[2];
  } else {
	GM_log(my_id+": "+times_str);
  }*/

var target_hr = (t_min > curMin)? curHour : curHour+1;

target_time2 = "&nbsp;<b>[n/a]</b>";

  if (t_min < 60) {
	var soon_work = t_min-curMin; //скоро на работу
	soon_work = (soon_work < 0)? soon_work+60 : soon_work;
	if ( soon_work<11 && BalanceNum > BalBorder ) { t_min = "<font style=color:#CC0000>"+ t_min +"</font style>"; }
	if ( soon_work>54 && BalanceNum > BalBorder ) { t_min = "<font style=color:#400060>"+ t_min +"</font style>"; }
	target_hr = (target_hr==24)? "00" : target_hr;
	target_time2 = "&nbsp;<b>["+ target_hr +":"+ t_min +"]</b>";
  }

	if (BalanceNum>500000) {
		style_color = '#00B000';
                BalanceStr=Math.round(BalanceNum/100000)/10 + 'kk';
	} else if (BalanceNum>30000) {
		style_color = '#0033FF';
                BalanceStr=Math.round(BalanceNum/1000) + 'k';
	} else if (BalanceNum>999) {
		style_color = '#6633CC';
                BalanceStr=Math.round(BalanceNum/1000) + 'k';
	} else {
		style_color = '#666666';
        	BalanceStr= BalanceNum + 'з';
	}
		BalanceStr = "<font style=color:"+ style_color +">"+ BalanceStr +"</font style>"

target_time2 += "," +BalanceStr;
}
return target_time2;
}

function form_close_ts()
{
	bg = $('bgOverlay');
	bgc = $('bgCenter');
	if( bg )
	{
		bg.style.display = bgc.style.display = 'none';
	}
}

function setting_ts()
{
	bg = $('bgOverlay');
	bgc = $('bgCenter');
	if( !bg )
	{
		bg = document.createElement('div') ;
		bg.id = 'bgOverlay' ;
		document.body.appendChild( bg );
		bg.style.position = 'absolute' ;
		bg.style.left = '0';
		bg.style.width = '100%';
		bg.style.background = "#000000";
		bg.style.opacity = "0.5";
		addEvent(bg, "click", form_close_ts);

		bgc = document.createElement('div') ;
		bgc.id = 'bgCenter' ;
		document.body.appendChild( bgc );
		bgc.style.position = 'absolute' ;
		bgc.style.width = '650px';
		bgc.style.background = "#F6F3EA";
		bgc.style.left = ( ( document.body.offsetWidth - 650 ) / 2 ) + 'px';
	}

	bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_ts" title="Close">x</div><table>'+
'<tr><td>Отображать время окончания смены: <input type=checkbox '+(hwm_check_time=="1"?"checked":"")+' id=hwm_check_time_id title=""></td></tr>'+
'<tr><td>Удалять владельца предприятия в экономической статистике: <input type=checkbox '+(hwm_check_del=="1"?"checked":"")+' id=hwm_check_del_id title=""></td></tr>'+
'<tr><td>Отображать полные названия секторов (иначе сокращенные): <input type=checkbox '+(hwm_check_full=="1"?"checked":"")+' id=hwm_check_full_id title=""><br><br></td></tr>'+
'<tr><td><input type="submit" id="hwm_ecost_adv_times_id" value="Стереть окончания смен" title=""></td></tr>'+
'</table></div>' ;

	addEvent($("bt_close_ts"), "click", form_close_ts);
	addEvent($("hwm_check_time_id"), "click", hwm_check_time_f);
	addEvent($("hwm_check_del_id"), "click", hwm_check_del_f);
	addEvent($("hwm_check_full_id"), "click", hwm_check_full_f);
	addEvent($("hwm_ecost_adv_times_id"), "click", hwm_ecost_adv_times_f);

var height_v = getClientHeight_ts();
if (height_v < document.body.offsetHeight) height_v = document.body.offsetHeight;

	bg.style.top = (-document.body.scrollTop)+'px';
	bg.style.height = ( height_v + document.body.scrollTop ) +'px';
	bgc.style.top = ( document.body.scrollTop + 150 ) + 'px';
	bg.style.display = bgc.style.display = 'block';
}

function hwm_check_time_f()
{
if( $('hwm_check_time_id').checked==true ) hwm_check_time='1'; else hwm_check_time='0';
GM_setValue( "hwm_check_time", hwm_check_time );
}

function hwm_check_del_f()
{
if( $('hwm_check_del_id').checked==true ) hwm_check_del='1'; else hwm_check_del='0';
GM_setValue( "hwm_check_del", hwm_check_del );
}

function hwm_check_full_f()
{
if( $('hwm_check_full_id').checked==true ) hwm_check_full='1'; else hwm_check_full='0';
GM_setValue( "hwm_check_full", hwm_check_full );
}

function hwm_ecost_adv_times_f()
{
for (var i=0; i<chunks; i++) {
	GM_setValue("hwm_ecost_adv_times"+i, "|2000_00_0");
  }
}

function loaderid() {
return ' <img border="0" src="data:image/gif;base64,R0lGODlhEAAQAMQAAP///+7u7t3d3bu7u6qqqpmZmYi'+
'IiHd3d2ZmZlVVVURERDMzMyIiIhEREQAR'+
'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'+
'fySDhGYQdDWGQyUhADs=">';
}

function getClientHeight_ts()
{
return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
}

function $( id ) { return document.getElementById( id ); }

function tag( id ) { return document.getElementsByTagName( id ); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn)
	}
	else {
		elem["on" + evType] = fn
	}
}

function createXMLHttpReq(rndm)
{
	var objXMLHttpReq;
	
	if (window.XMLHttpRequest)
	{
		// Real browsers ;)
		//
		objXMLHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		// IE
		//
		objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	return objXMLHttpReq;
}