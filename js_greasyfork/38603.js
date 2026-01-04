// ==UserScript==
// @name           hwm_adv_fast_map
// @namespace      Demin (remastered by Prince_of Dark)
// @description    HWM mod - Rasshirennoe vypadajushhee menju (by Demin)
// @homepage       http://userscripts.org/scripts/show/172172
// @version        1.2.2
// @include        http://*heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://209.200.152.144/*
// @include        http://*lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @downloadURL https://update.greasyfork.org/scripts/38603/hwm_adv_fast_map.user.js
// @updateURL https://update.greasyfork.org/scripts/38603/hwm_adv_fast_map.meta.js
// ==/UserScript==

// (c) 2013, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2008, LazyGreg

(function() {

var version = '1.2';


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


var script_num = 172172;
var script_name = "HWM mod - Rasshirennoe vypadajushhee menju (by Demin)";
update_n(version,script_num,script_name);


var pers_id = document.querySelector("li * a[href^='pl_hunter_stat.php?id=']");
if ( pers_id ) {
pers_id = /id=(\d+)/.exec( pers_id )[1];


// ============== PERSONAL LINKS (replaces Chat menu) ================

var replace_chat = false;
//replace_chat = true; // uncomment this line to have chat replaced

var map_change = document.querySelector("li * a[href='map.php']")
//if ( map_change ) { setTimeout(function() { map_change.href = 'map.php?st=sh'; }, 500) } // uncomment this line to have map link replaced

var my_links = []; // REPLACE CHAT MENU
// Insert ANY number of your links below
// better to write them in english or in "translit"
// russian letters must be converted to unicode codes. Here's an utility: 
// http://static.bobrdobr.ru/store/spuntik/cache/1785ad2ca55f214df4bb297318b250bd.html

my_links.push('<a href="pl_info.php?id=15091">Link_1</a>');
my_links.push('<a href="pl_info.php?id=15091">Link_2</a>');
my_links.push('<a href="pl_info.php?id=15091">Link_3</a>');
// etc.

// ===================================================================
    var Empire_cap = 'Empire Capital';
    var river = 'East River';
    var lake = 'Tiger`s Lake';
    var wood = 'Rogue`s Wood';
    var dale = 'Wolf`s Dale';
    var camp = 'Peasful Camp';
    var lowlands = 'Lizard`s Lowland';
    var green = 'Green Wood';
    var nest = 'Eagle`s Nest';
    var portal = 'Portal`s Ruins';
    var caves = 'Dragon`s Caves';
    var spring = 'Shining Spring';
    var city = 'Sunny City';
    var mines = 'Magma Mines';
    var mountain = 'Bear Mountain';
    var trees = 'Fairy Trees';
    var port = 'Port City';
    var coast = 'Mythril Coast';
    var wall = 'Great Wall';
    var valley = 'Titan`s Valley';
    var village = 'Fishing Village';
    var castle = 'Kingdom Castle';
    var steppe = 'Ungovernable Steppe';
    var arbor = 'Sublime Arbor';
    var garden = 'Crystal Garden';
    var wilderness = 'The Wilderness';
    var island = 'East Island';

// =================== USER VARIABLES ================================
var map_last = [];
map_last.push('<hr>');
map_last.push('<a href="move_sector.php?id=1">' + Empire_cap + '</a>');
map_last.push('<a href="move_sector.php?id=2">' + river + '</a>');
map_last.push('<a href="move_sector.php?id=3">' + lake + '</a>');
map_last.push('<a href="move_sector.php?id=4">' + wood + '</a>');
map_last.push('<a href="move_sector.php?id=5">' + dale + '</a>');
map_last.push('<a href="move_sector.php?id=6">' + camp + '</a>');
map_last.push('<a href="move_sector.php?id=7">' + lowlands + '</a>');
map_last.push('<a href="move_sector.php?id=8">' + green + '</a>');
map_last.push('<a href="move_sector.php?id=9">' + nest + '</a>');
map_last.push('<a href="move_sector.php?id=10">' + portal + '</a>');
map_last.push('<a href="move_sector.php?id=11">' + caves + '</a>');
map_last.push('<a href="move_sector.php?id=12">' + spring + '</a>');
map_last.push('<a href="move_sector.php?id=13">' + city + '</a>');
map_last.push('<a href="move_sector.php?id=14">' + mines + '</a>');
map_last.push('<a href="move_sector.php?id=15">' + mountain + '</a>');
map_last.push('<a href="move_sector.php?id=16">' + trees + '</a>');
map_last.push('<a href="move_sector.php?id=17">' + port + '</a>');
map_last.push('<a href="move_sector.php?id=18">' + coast + '</a>');
map_last.push('<a href="move_sector.php?id=19">' + wall + '</a>');
map_last.push('<a href="move_sector.php?id=20">' + valley + '</a>');
map_last.push('<a href="move_sector.php?id=21">' + village + '</a>');
map_last.push('<a href="move_sector.php?id=22">' + castle + '</a>');
map_last.push('<a href="move_sector.php?id=23">' + steppe + '</a>');
map_last.push('<a href="move_sector.php?id=24">' + garden + '</a>');
map_last.push('<a href="move_sector.php?id=26">' + wilderness + '</a>');
map_last.push('<a href="move_sector.php?id=27">' + arbor + '</a>');
map_last.push('<a href="forum_thread.php?id=25">' + island + '</a>');

//map_last.push('<a href="house_info.php?id=222">\u0414\u043E\u043C</a>');

// ===================================================================


var all_li_subnav, elm, par, next_elm, timer;

// pers - market
all_li_subnav = document.querySelector("li * a[href='auction.php']");
if ( all_li_subnav ) {

addEvent( all_li_subnav, "mouseover", function() { if ( timer != false ) timer = setTimeout(function() {
	timer = false;
	all_li_subnav = document.querySelector("li * a[href='auction.php']");
	par = all_li_subnav.parentNode;
	next_elm = all_li_subnav.nextSibling;

	for ( var i=0; i<pers_market.length; i++ ) {
		elm = document.createElement('li');
		elm.innerHTML = pers_market[i];
		par.insertBefore(elm, next_elm);
	}
}, 500) } );

addEvent( all_li_subnav, "mouseout", function() { if ( timer ) clearTimeout(timer); } );

}

// map - last
all_li_subnav = document.querySelector("li * a[href^='map.php?'][href*='st=hs']");
if ( all_li_subnav ) {
par = all_li_subnav.parentNode;
next_elm = all_li_subnav.nextSibling;

for ( var i=0; i<map_last.length; i++ ) {
	elm = document.createElement('li');
	elm.innerHTML = map_last[i];
	par.insertBefore(elm, next_elm);
}
}



// replaceChatMenu - my_links
if ( replace_chat && my_links.length>0 ) {

	all_li_subnav = document.querySelector("li * a[href='frames.php']");
	if ( all_li_subnav ) {
		all_li_subnav.parentNode.innerHTML = '<font color="f5c137">&nbsp;<b>Links</b>&nbsp;</font>';

		all_li_subnav = document.querySelectorAll("li * a[href^='frames.php']");
		for ( var i=1; i<all_li_subnav.length; i++ ) {
			par = all_li_subnav[i].parentNode;
			par.parentNode.removeChild(par);
		}

		var remove_par = all_li_subnav[0].parentNode;

		par = remove_par.parentNode;
		next_elm = remove_par.nextSibling;

		for ( var i=0; i<my_links.length; i++ ) {
			elm = document.createElement('li');
			elm.innerHTML = my_links[i];
			par.insertBefore(elm, next_elm);
		}

		remove_par.parentNode.removeChild(remove_par);
	}
}


}


function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue('last_update_script','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=$('update_demin_script');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)').exec(g);if(a&&h){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){window.open('http://userscripts.org/scripts/show/'+b,'_blank');window.location='http://userscripts.org/scripts/source/'+b+'.user.js'}},500)}GM_setValue('last_update_script',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var i=document.querySelector('body');if(i){var j=GM_getValue('array_update_script');if(e==1&&((d+86400000<f)||(d>f)||!j)){if(j){GM_deleteValue('array_update_script')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var k=document.createElement('div');k.id='update_demin_script';k.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');k.innerHTML='';i.appendChild(k);if((d+86400000<f)||(d>f)||!j){var l=new XMLHttpRequest();l.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);l.onreadystatechange=function(){update(l,a,b,c,d,e)};l.send(null)}else{$('update_demin_script').innerHTML=j;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+)/g;var h='';var i;while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=i[1]+' '}};GM_setValue('array_update_script',''+h);var j=$('update_demin_script');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

})();
