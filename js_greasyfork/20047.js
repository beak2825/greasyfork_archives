// ==UserScript==
// @name           [5152] links on home page (control)
// @description    links on home page (control)
// @include        http://www.heroeswm.ru/home.php
// @include        http://*heroeswm.ru/home.php
// @include        http://178.248.235.15/home.php
// @include        http://209.200.152.144/home.php
// @include        http://*.lordswm.com/home.php
// @version 0.1.20160602
// @namespace https://greasyfork.org/ru/scripts/20047-5152-links-on-home-page-control
// @downloadURL https://update.greasyfork.org/scripts/20047/%5B5152%5D%20links%20on%20home%20page%20%28control%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20047/%5B5152%5D%20links%20on%20home%20page%20%28control%29.meta.js
// ==/UserScript==

// === v 1.7 ========

//alert("HWM_Skills_At_Home");	

// =========== SETTINGS ============
// set variable below to "yes" to enable scrollbars
var my_skills_scroll = "no";

var iframe_width = 250;
var iframe_height = 130;// need height=330 for 5 skill groups

var scroll_top = 630;
var scroll_left = 630;

// ==================================



var all_li_subnav = document.evaluate("//li[@class='subnav']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var my_li;
var prev_elm;
// get player ID
my_li = all_li_subnav.snapshotItem(5);
prev_elm = my_li.childNodes[1].childNodes[1];
	//
var ptrn = /<a href="pl_hunter_stat\.php\?id=(.*)">(.*)<\/a>/;
var player_id = prev_elm.innerHTML.replace(ptrn, "$1")
		//alert("player_id = "+player_id);
//
var my_profile_url = "clan_info.php?id=5152";


addPanel();



function addPanel(){
		//alert("addPanel");
	//	create DIV with iframe
	var d = document.createElement( 'div' );
	d.style.marginLeft = 5;
	//
	
	d.innerHTML = 
'<br>» <img src="http://dcdn.heroeswm.ru/i_clans/l_5152.gif?v=12" align="absmiddle" border="0" height="15" width="20"><a style="text-decoration: none;" target="_blank" href="clan_info.php?id=5152"><b>Огненые рубежи </b></a> (<a href="clan_control.php?id=5152">Управление</a>) <BR> <br><font color="blue">»  <b>Статистика:</b></font><br><br> <li><a style="text-decoration: none;" target="_blank" href=" http://heroes-guide.ru/services/clan_stats/5152/">Статистика клана на гайде</a></li><li><a style="text-decoration: none;" target="_blank" href="http://www.kekus.org/free/staty">Статистика на кекусе</a></li> <li><a style="text-decoration: none;" target="_blank" href="forum_messages.php?tid=2446447&page=last">Форум клана</a></li> <br><font color="blue">» <b>Сервис-помощь:</b></font><br><br> <li><a style="text-decoration: none;" target="_blank" href="https://docs.google.com/spreadsheets/d/1dGdjhk2gxnKQhCBGq6F7xx12iPKrVoFqA_A6ri8dsi8/edit?pref=2&pli=1#gid=0">Записаться на защиту (docs.google.com)</a></li> <li><a style="text-decoration: none;" target="_blank" href="http://hwmlinks.ru/gsale.html">Сервис сдачи в гос</a></li><li><a style="text-decoration: none;" target="_blank" href="http://hwm.kekus.de/trade">Рыночная статистика</a></li><li><a style="text-decoration: none;" target="_blank" href="http://www.witchhammer.ru/news.php">Молот ведьм</a></li><li><a style="text-decoration: none;" target="_blank" href="http://lgnd.ru/">lgnd.ru </a></li><li><a style="text-decoration: none;" target="_blank" href="http://help.ordenmira.ru/">Неофициальная справка ГВД</a></li><li><a style="text-decoration: none;" target="_blank" href="http://daily.heroeswm.ru/">HWM DAILY</a></li>';

	
	var combat_lvl_str = "\u0411\u043E\u0435\u0432\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C";
	var all_td = document.getElementsByTagName('td');
	var td_len = all_td.length;
	var my_td;
	for (var i = 0; i < td_len; i++) {
		my_td = all_td[i];
		if(my_td.innerHTML.indexOf("td") != -1 ){ continue; }  // has child TDs
		if(my_td.innerHTML.indexOf(combat_lvl_str) != -1 ){
			//alert("my_td.innerHTML = "+my_td.innerHTML);
			break;
		}
		
	}
	
	my_td.appendChild( d ) ;
	
	//document.body.appendChild( d ) ;
	
	//
	document.getElementById('skills_iframe').addEventListener( "load", smsIframeLoaded , false );
	
}


function smsIframeLoaded(){
		//alert("smsIframeLoaded");
	var my_iframe = document.getElementById('skills_iframe');
	//
	//my_iframe.contentWindow.scrollTo(630, 630);
	my_iframe.contentWindow.scrollTo(scroll_left, scroll_top);
		
}





//
