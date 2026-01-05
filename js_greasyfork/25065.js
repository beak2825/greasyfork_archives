// ==UserScript==
// @name         clanstat
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Clan money rent
// @author       Sweag
// @include      https://www.heroeswm.ru/clanstat.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25065/clanstat.user.js
// @updateURL https://update.greasyfork.org/scripts/25065/clanstat.meta.js
// ==/UserScript==

var GOLD_SPLIT = 40;
var index = 1;

var hrefs = document.getElementsByTagName('a');
for(var i = 0; i < hrefs.length; i++){
	if(hrefs[i].href.indexOf('clan_info.php') > -1)
	{
		if(hrefs[i].parentNode.parentNode.parentNode.nodeName != "TBODY")continue;
		var table_clans = hrefs[i].parentNode.parentNode.parentNode.childNodes;
		var table_clans_length = hrefs[i].parentNode.parentNode.parentNode.childElementCount;
		table_clans[0].innerHTML += "<td class=wblight width=100 align=center> <font color=#6b6c6a> <b>Арендовано</b></td>";
		break;
	}
}
each_elem();

function each_elem()
{
	var xhr = new XMLHttpRequest();	
	var uri = "https://www.heroeswm.ru/clan_info.php" + table_clans[index].childNodes[1].innerHTML.split("clan_info.php")[1].split('">')[0];
	xhr.open("GET", uri, true);
	xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
	xhr.onreadystatechange = function() { 
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			var id = xhr.responseText.split("href='sklad_info.php")[1].split("'>")[0];
			write_gold(id);
		}
	};
}

function write_gold(id_s)
{
	var gold;
	var ans = new XMLHttpRequest();	
	var href = "https://www.heroeswm.ru/sklad_info.php" + id_s;
	ans.open("GET", href, true);
	ans.overrideMimeType('text/html; charset=windows-1251');
    ans.send();
	ans.onreadystatechange = function() { 
		if (ans.readyState != 4) return;
		if (ans.status == 200) {
			var text = ans.responseText;
			if(text.indexOf("<font color=gray>(") > -1) gold = text.split('<font color=gray>(')[1].split(')')[0]; else gold = "0";
			if( parseInt(gold) > GOLD_SPLIT && gold.split(",").length == 2){
				table_clans[index].innerHTML += "<td class=wbwhite width=100 align=center> <font color=red>"+gold+"</td>";
			}
			else {
				table_clans[index].innerHTML += "<td class=wbwhite width=100 align=center> <font color=green>"+gold+"</td>";
			}
			index++;
			if(index<table_clans_length)each_elem();
		}
	};
}
