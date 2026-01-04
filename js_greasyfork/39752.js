// ==UserScript==
// @name        TransferResShow
// @namespace   transfer
// @include     http://www.heroeswm.ru/pl_transfers.php*
// @version     1.1.0.0
// @description transferResShow
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39752/TransferResShow.user.js
// @updateURL https://update.greasyfork.org/scripts/39752/TransferResShow.meta.js
// ==/UserScript==

var WOOD_COST = 2.5, //дерево
    ORE_COST = 0, //руда
    MERCURY_COST = 0, //ртуть
    SULF_COST = 0, //сера
    CRYSTAL_COST = 0, //кристаллы
    GEMS_COST = 0; //самоцветы
var start_index = 0;
var ifrom, ito, textP='';
var res = [0,0,0,0,0,0];
var hrefs = document.getElementsByTagName('a');
for(var i = 0; i < hrefs.length; i++)
{
	if(hrefs[i].href.indexOf('pl_info.php') > -1 && hrefs[i].parentNode.innerHTML.indexOf('Протокол игрока') > -1)
	{
		var myform = document.createElement('div');
		myform.id = 'sform';
		var str = "<table><tr><td bgcolor='#6b6c6a' align='center' colspan='2'><font color='#ffd875'><b>Протокол</b></font></td></tr><tr><td>От: </td><td><input type=text id=datfrom value='"+getCurrentDate()+"'></td></tr>";
		str += "<tr><td>До: </td><td><input type=text id=datto value='"+getCurrentDate()+"'></td></tr>";
		str += "<tr><td colspan=2><center><input type=button value='Загрузить' id=startscan></center></td></tr>";
		str += "</table></div>";
		myform.innerHTML = str;
		hrefs[i].parentNode.appendChild(myform);
		i = hrefs.length;

		document.getElementById('startscan').onclick = function(){prescaning();};
	}
}

function prescaning()
{
    var t = document.getElementById('datfrom').value.split('-');
    ifrom = new Date("20" + t[2] + "-" + t[1] + "-" + t[0]);
    t = document.getElementById('datto').value.split('-');
    ito = new Date("20" + t[2] + "-" + t[1] + "-" + t[0]);
    scaning();
}

function scaning()
{
    var xhr = new XMLHttpRequest();
	var uri = "http://www.heroeswm.ru/pl_transfers.php?id=" + getURIParam()['id']+"&page="+start_index;
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			textP = xhr.responseText;
            doing();
		}
	};
}

function doing()
{
	var text = textP;
	start_index++;
	var goToExit = 0;
	text = text.split('<!-- big table -->')[1].split('&gt;</a></center>')[1].split('</td></tr></table>')[0].replace('<!--0-->','');
	var arr = text.split('&nbsp;&nbsp;');
	for(var i = 1; i < arr.length; i++)
	{
		var cur = getCurTimestamp(arr[i]);
		if(cur >= ifrom && cur <= ito)
		{
			var s = arr[i].split(': ')[1];
			if(s.indexOf('Продано') > -1)
			{
				if(s.indexOf('Древесина') > -1) addRes(s, 0);
				if(s.indexOf('Руда') > -1) addRes(s, 1);
				if(s.indexOf('Ртуть') > -1) addRes(s, 2);
				if(s.indexOf('Сера') > -1) addRes(s, 3);
				if(s.indexOf('Кристаллы') > -1) addRes(s, 4);
				if(s.indexOf('Самоцветы') > -1) addRes(s, 5);
			}
		}
		else if(cur < ifrom)
		{
			Paint();
			i = arr.length;
			goToExit = 1;
		}
	}
	document.getElementById('startscan').value = "Загружено: " + start_index;
	if(!goToExit) setTimeout(scaning,1000);
}

function addRes(str, num)
{
	var mask = /\d+/;
	var a = mask.exec(str);
	res[num] += a[0]*1;
}

function Paint()
{
	var d = document.getElementById('sform');
	d.innerHTML = "<center>Статистика продаж в период c "+ifrom+" по "+ito+"</center>";
	var ss = "<table class='wb'>";
	ss += "<tr><td class='wb'>-</td><td class='wb'><img src='http://dcdn2.heroeswm.ru/i/wood.gif'></td><td class='wb'><img src='http://dcdn3.heroeswm.ru/i/ore.gif'></td><td class='wb'><img src='http://dcdn2.heroeswm.ru/i/mercury.gif'></td><td class='wb'><img src='http://dcdn3.heroeswm.ru/i/sulphur.gif'></td><td class='wb'><img src='http://dcdn.heroeswm.ru/i/crystal.gif'></td><td class='wb'><img src='http://dcdn2.heroeswm.ru/i/gem.gif'></td></tr>";
	ss += "<tr><td class='wb'>Продано</td><td class='wb' id='rr0'>"+res[0]+"</td><td class='wb' id='rr1'>"+res[1]+"</td><td class='wb' id='rr2'>"+res[2]+"</td><td class='wb' id='rr3'>"+res[3]+"</td><td class='wb' id='rr4'>"+res[4]+"</td><td class='wb' id='rr5'>"+res[5]+"</td></tr>";
	ss += "<tr><td class='wb'>Стоимость единицы</td><td class='wb'><input type=text id='res0' value="+WOOD_COST+"></td><td class='wb'><input type=text id='res1' value="+ORE_COST+"></td><td class='wb'><input type=text id='res2' value="+MERCURY_COST+"></td><td class='wb'><input type=text id='res3' value="+SULF_COST+"></td><td class='wb'><input type=text id='res4' value="+CRYSTAL_COST+"></td><td class='wb'><input type=text id='res5' value="+GEMS_COST+"></td></tr>";
	ss += "<tr><td class='wb'>Сумма</td><td class='wb' id='sum0'></td><td class='wb' id='sum1'></td><td class='wb' id='sum2'></td><td class='wb' id='sum3'></td><td class='wb' id='sum4'></td><td class='wb' id='sum5'></td></tr>";
	ss += "<tr><td class='wb'><b>Итого</b></td><td class='wb' colspan=6 id='isum' align=center></td></tr>";
	ss += "<tr><td class='wb' colspan=7 align=right><input type=button id='startsum' value='Посчитать'></td></tr>";
	ss += "</table>";
	d.innerHTML += ss;
	document.getElementById('startsum').onclick = function(){startsum();};
	startsum();
}

function startsum()
{
	var sss = 0;
	for(var i = 0; i < 6; i++)
	{
		var e = document.getElementById('rr'+i).innerHTML*1 * document.getElementById('res'+i).value*1;
		sss += e;
		document.getElementById('sum'+i).innerHTML = e;
	}
	document.getElementById('isum').innerHTML = "<p style='color:red;'>" + sss + "</p>";
}

function getCurrentDate()
{
	var dt=new Date(); 	var month = dt.getMonth()+1; 	if (month<10) month='0'+month;	var day = dt.getDate(); 	if (day<10)  day='0'+day;	var year = dt.getFullYear();
	return day + "-" + month + "-" + (year + '')[2] + (year + '')[3];
}

function getCurTimestamp(str)
{
	var t = str.split(' ')[0].split('-');
	return (new Date("20" + t[2] + "-" + t[1] + "-" + t[0]));
}

function getPage(uri)
{
	var ans = GM_xmlhttpRequest({
		method: "GET",
		url: uri,
		overrideMimeType: "text/html; charset=windows-1251",
		synchronous: true,
	});
	return ans.responseText;
}

function getURIParam()
{
	var search = window.location.search.substr(1),
	keys = {};
	search.split('&').forEach(function(item) {
	    item = item.split('=');
	    keys[item[0]] = item[1];
	});
	return keys;
}