// ==UserScript==

// @author         alex@kocharin.pp.ru
// @collaborator   style: sw.East
// @namespace      https://greasyfork.org/ru/users/3065-чеширский-котъ

// @name           : HWM : Друзья по полочкам :
// @name:en        : HWM : Friends Tabs :
// @description    Позволяет сортировать друзей по группам
// @description:en Allows you to sort friends into groups

// @icon           http://i.imgur.com/GScgZzY.jpg
// @version        0.0.2.0
// @encoding 	   utf-8

// @match        *://*.heroeswm.ru/home.php
// @match        *://*.heroeswm.ru/friends.php
// @match        *://*.lordswm.com/home.php
// @match        *://*.lordswm.com/friends.php
// @match        *://178.248.235.15/home.php
// @match        *://178.248.235.15/friends.php

// @compatible     chrome Chrome + TamperMonkey
// @compatible     firefox Firefox + TamperMonkey
// @compatible     opera Opera + TamperMonkey

// @copyright      2013-2019, sw.East (https://www.heroeswm.ru/pl_info.php?id=3541252)
// @license        MIT

// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374871/%3A%20HWM%20%3A%20%D0%94%D1%80%D1%83%D0%B7%D1%8C%D1%8F%20%D0%BF%D0%BE%20%D0%BF%D0%BE%D0%BB%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%20%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/374871/%3A%20HWM%20%3A%20%D0%94%D1%80%D1%83%D0%B7%D1%8C%D1%8F%20%D0%BF%D0%BE%20%D0%BF%D0%BE%D0%BB%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%20%3A.meta.js
// ==/UserScript==

/*
 *   Copyright (c) 2009 by Alex Kocharin <alex@kocharin.pp.ru>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   Script itself:
 *   http://hwm.kocharin.pp.ru/gm/hwm_friends_mod/
 */

/** === Style ===*/

GM_addStyle ( `

.accordion {
    font: normal bold 12px/18px Arial, sans-serif;
    margin: 0 auto;
}
.accordion-header,.accordion-body {background: white;}
.accordion-header {
    position: relative;
    padding: 5px 5px 5px 25px;
    display: block;
    background: #8bc34a; /* Old browsers */
    background: -moz-linear-gradient(left, #404247 3%, #8bc34a 3%, #8bc34a 36%, #404247 36%, #404247 97%, #8bc34a 97%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, #404247 3%,#8bc34a 3%,#8bc34a 36%,#404247 36%,#404247 97%,#8bc34a 97%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, #404247 3%,#8bc34a 3%,#8bc34a 36%,#404247 36%,#404247 97%,#8bc34a 97%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#404247', endColorstr='#8bc34a',GradientType=1 ); /* IE6-9 */

    text-transform: uppercase;
    color: #fff;
    text-align: left;
    cursor: pointer;
    font: normal bold 12px/18px Arial, sans-serif;
    letter-spacing: .1em;
    transition: all .3s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.25), 0 2px 2px rgba(0,0,0,0.22);

}
.accordion-header a{
    display: block;
    padding: 0 5px 0 0;
    margin: 0 0 0 7px;
}
.accordion-header a:hover {
    color: #fff;
    position: relative;
}
.accordion-body {
    background: #ccc;
    padding: 5px 5px 7px 5px;
    margin: 5px 0 5px 0;
    color: #fff;
    background-color: rgb(245, 245, 245);
    background-url: http://api.thumbr.it/whitenoise-361x370.png?background=ffffffff&noise=626262&density=86&opacity=9

}
.accordion-header > a span {
    background: #8BC34A;
    color: #404247;
    font: normal bold 12px/18px Arial, sans-serif;
    float: right;
    position: relative;
    overflow: visible;
    display: block;
    top: 0;
    left: 0;
    padding: 0 10px;
    margin: 0 20px 0 10px;
    text-align: center;
    width: 25px;
    -webkit-border-radius: 50%;
       -moz-border-radius: 50%;
            border-radius: 50%;
    -webkit-box-shadow: inset 1px 1px 1px rgba(0,0,0, .2), 1px 1px 1px rgba(255,255,255, .1);
       -moz-box-shadow: inset 1px 1px 1px rgba(0,0,0, .2), 1px 1px 1px rgba(255,255,255, .1);
            box-shadow: inset 1px 1px 1px rgba(0,0,0, .2), 1px 1px 1px rgba(255,255,255, .1);
    text-shadow: 0px 1px 0px rgba(0,0,0, .35);
}
a[href*="clan_info"]{
    white-space: nowrap; /* Переносов в тексте нет */
    background: #fff;
    border: 1px solid #ccc;
    margin: 1px -7px 2px 1px;
    padding: 1px 2px 3px 2px;
    line-height: 1.5;
}
a[href*="pl_info"]{
    white-space: nowrap; /* Переносов в тексте нет */
    background: #fff;
    border: 1px solid #ccc;
    margin: 2px -4px 2px 2px;
    padding: 1px 2px 3px 1px;
    line-height: 2;
}
a[href*="pl_info"]:hover{
    color: #8BC34A;
    border: 1px solid #8BC34A;
    -webkit-transition: color .3s linear 0s;
	   -moz-transition: color .3s linear 0s;
	     -o-transition: color .3s linear 0s;
	        transition: color .3s linear 0s;
   box-shadow: 1px 0px 2px #aaa;
}
select {
    background: transparent;
    display: block;
    width: 100%;
    border: 1px solid #a7a7a7;
    color: #32353a;
    font-family: Arial, sans-serif !imporntant;
    font-size: 14px !imporntant;
    line-height: 1.4;
    font-weight: normal;
    padding: 2px 3px;
    height: 20px;
    vertical-align: top;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none !important;
}
` );
/* Style End */

var serv = 'ru';
if (location.href.match(/heroeswm.ru/)) {
    serv = 'ru';
} else if (location.href.match(/lordswm.com/)) {
    serv = 'com';
} else if (location.href.match(/178.248.235.15/)) {
    serv = 'ru';
}

var text_nogroup, text_unkgroup, text_groups, text_name, text_add, text_empty;
if (serv == 'com') {
	text_nogroup = 'No group';
	text_unkgroup = 'Unknown group';
	text_groups = 'Groups of friends';
	text_name = 'Name of group';
	text_add = 'Add';
	text_empty = 'Empty group name';
} else {
	text_nogroup = '\u0411\u0435\u0437 \u0433\u0440\u0443\u043f\u043f\u044b';
	text_unkgroup = '\u0413\u0440\u0443\u043f\u043f\u0430 \u0431\u0435\u0437 \u0438\u043c\u0435\u043d\u0438';
	text_groups = '\u0413\u0440\u0443\u043f\u043f\u044b \u0434\u0440\u0443\u0437\u0435\u0439';
	text_name = '\u0418\u043c\u044f \u0433\u0440\u0443\u043f\u043f\u044b';
	text_add = '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c';
	text_empty = '\u041f\u0443\u0441\u0442\u043e\u0435 \u0438\u043c\u044f \u0433\u0440\u0443\u043f\u043f\u044b';
}

var groups = [ ];
var gids = GM_getValue(serv+'_groups', '');
if (gids == '') {
	var last = GM_getValue(serv+'_last', 1);
/*	GM_setValue(serv+'_groups', String(last));
	GM_setValue(serv+'_last', last+1);
	GM_setValue(serv+'_group'+String(last), "Others");*/
	GM_setValue(serv+'_groups', '');
	gids = GM_getValue(serv+'_groups', '');
}
var groupsids = gids.split(',');
var inv_gids = { };
if (gids != '') {
	for (var i=0; i<groupsids.length; i++) {
		groups.push(GM_getValue(serv+'_group'+groupsids[i], text_unkgroup));
		inv_gids[groupsids[i]] = i;
	}
}

var ftable = { };

function load_ftable() {
	var farr = GM_getValue(serv+'_friends', '').split(',');
	if (farr != '') {
		for(i=0; i<farr.length; i++) {
			var spl = farr[i].split('=');
			ftable[Number(spl[0])] = Number(spl[1]);
		}
	}
}
load_ftable();

function save_ftable() {
	var farr = [];
	for(var k in ftable) {
		farr.push(k+'='+ftable[k]);
	}
	GM_setValue(serv+'_friends', farr.join(','));
}

if (document.location.href.indexOf('home.php') >= 0) {
	groups.push(text_nogroup);

	var alltds = document.getElementsByTagName('td');
	var mytd = false;
	for(var i=0; i<alltds.length; i++) {
		if (alltds[i].getAttribute('class') == 'wblight') {
			var alla = alltds[i].getElementsByTagName('a');
			if (alla[0] && alla[0].href.indexOf('friends.php') >= 0) {
				mytd = alltds[i];
				break;
			}
		}
	}

	mytd.parentNode.nextSibling.getElementsByTagName('td')[1].setAttribute('valign', 'top');

	mytd = mytd.parentNode.nextSibling.getElementsByTagName('td')[0];
	var allb = mytd.getElementsByTagName('a');

	var table = document.createElement('table');
	table.setAttribute('cellpadding', 0);
	table.setAttribute('cellspacing', 0);
	table.setAttribute('width', '100%');

	//var table = document.createElement('table');
	table.setAttribute('class', 'accordion');

	var trsa = [ ];
	var tdsa = [ ];
	var trsb = [ ];
	var tdsb = [ ];
	var amount = [ ];

	function descr_reset(n, exp)
	{
		tdsa[n].getElementsByTagName('a')[0].innerHTML = (exp?'-':'+')+' '+groups[n]+' <span>'+(amount[n]?amount[n]:0)+'</span> '+(exp?'-':'+');
	}

	function descr_click(e) {
		e.preventDefault();
		var n = e.target.getAttribute('fgid');
		if (trsb[n].style.visibility == "hidden") {
			GM_setValue(serv+'_gr'+groupsids[n]+'exp', true);
			trsb[n].style.visibility = "visible";
			table.insertBefore(trsb[n], trsa[n].nextSibling);
			descr_reset(n, true);
		} else {
			GM_setValue(serv+'_gr'+groupsids[n]+'exp', false);
			trsb[n].style.visibility = "hidden";
			table.removeChild(trsb[n]);
			descr_reset(n, false);
		}
	}

	for(var i=0; i<groups.length; i++) {
		trsa[i] = document.createElement('tr');
		tdsa[i] = document.createElement('div');
		trsb[i] = document.createElement('tr');
		tdsb[i] = document.createElement('td');

		tdsa[i].setAttribute('class', 'accordion-item');
		tdsa[i].setAttribute('align', 'center');
		tdsa[i].addEventListener('click', descr_click, false);
		tdsa[i].setAttribute('fgid', i);
		var descrb = document.createElement('div');
        descrb.setAttribute('class', 'accordion-header');
		var descra = document.createElement('a');
		descra.innerHTML = groups[i];
		descra.href = "#";
		//descra.addEventListener('click', descr_click, false);
		descra.setAttribute('class', 'pi');
		descra.setAttribute('fgid', i);
		descrb.appendChild(descra);
		tdsa[i].appendChild(descrb);
		trsa[i].appendChild(tdsa[i]);

		tdsb[i].setAttribute('class', 'accordion-body');
		//tdsb[i].setAttribute('align', 'left');
		//tdsb[i].style.padding = 2;
		tdsb[i].style.paddingBottom = 5;
		trsb[i].appendChild(tdsb[i]);
		trsb[i].style.visibility = "visible";
	}

	var where = groups.length-1;
	var nfirsts = [];
	for(var i=allb.length-1; i>=0; i--) {
		var str;
		if (allb[i].href.indexOf('clan_info.php') >= 0) {
			str = '\xA0';
		} else {
			var m;
			if (m = allb[i].href.match(/pl_info\.php\?id=(\d+)/)) {
				if (ftable[m[1]] && inv_gids[ftable[m[1]]] != undefined) {
					where = inv_gids[ftable[m[1]]];
				} else {
					where = groups.length-1;
				}
			}
			str = ', ';
			amount[where] = amount[where] ? amount[where] + 1 : 1;
		}
		if (!nfirsts[where]) {
			nfirsts[where] = true;
		} else {
			tdsb[where].insertBefore(document.createTextNode(str), tdsb[where].firstChild);
		}
		tdsb[where].insertBefore(allb[i], tdsb[where].firstChild);
	}
	for(var i=0; i<trsa.length; i++) {
		if (i == trsa.length-1 && !amount[i]) continue;
		var exp = GM_getValue(serv+'_gr'+groupsids[i]+'exp', true);
		table.appendChild(trsa[i]);
		if (exp) {
			table.appendChild(trsb[i]);
		} else {
			trsb[i].style.visibility = "hidden";
		}
		descr_reset(i, exp);
	}
	mytd.appendChild(table);

	var x = 0;
	while (mytd.childNodes[x]) {
		if (mytd.childNodes[x] == table) {
			x++;
		} else {
			mytd.removeChild(mytd.childNodes[x]);
		}
	}
} else if (document.location.href.indexOf('friends.php') >= 0) {
	var alltds = document.getElementsByTagName('table');
	var myt = false;
	for(var i=0; i<alltds.length; i++) {
		if (alltds[i].getAttribute('class') == 'wb') {
			myt = alltds[i];
			break;
		}
	}
	alltds = myt.getElementsByTagName('tr');
	for(var i=0; i<alltds.length; i++) {
		var arr = alltds[i].getElementsByTagName('td');
		if (arr.length == 1) {
			arr[0].setAttribute('colspan', 4);
			arr[0].setAttribute('align', 'center');
		} else {
			alla = alltds[i].getElementsByTagName('a');
			var plid = false;
			for (var ii=0; ii<alla.length; ii++) {
				var m;
				if (m = alla[ii].href.match(/pl_info\.php\?id=(\d+)/)) {
					plid = m[1];
				}
			}

			var newtd = document.createElement('td');
			var newsel = document.createElement('select');
			newsel.style.fontSize = 11;
			for (var ii=-1; ii<groups.length; ii++) {
				var opt = document.createElement('option');
				opt.setAttribute('value', ii);
				opt.innerHTML = ii == -1 ? '------' : groups[ii];

				if (ii != -1 && ftable[plid] && groupsids[ii] == ftable[plid]) {
					opt.setAttribute('selected', true);
				}
				newsel.appendChild(opt);
			}
			newsel.setAttribute('plid', plid);
			newsel.addEventListener('change', function(e) {
				e.preventDefault();
				if (e.target.value == -1) {
					ftable[e.target.getAttribute('plid')] = false;
				} else {
					ftable[e.target.getAttribute('plid')] = groupsids[e.target.value];
				}
				save_ftable();
			}, false);
			newtd.setAttribute('class', 'wbwhite');
			newtd.appendChild(newsel);
			alltds[i].appendChild(newtd);
		}
	}

	// adding right table
	var newxtd = document.createElement('td');

	var td3form = document.createElement('form');
	newxtd.appendChild(td3form);

	var newtable = document.createElement('table');
	newtable.setAttribute('class','wb');
	td3form.appendChild(newtable);

	var newtbody = document.createElement('tbody');
	newtable.appendChild(newtbody);

	var newtr1 = document.createElement('tr');
	newtbody.appendChild(newtr1);

	var newtd1 = document.createElement('td');
	newtd1.innerHTML = text_groups;
	newtd1.setAttribute('class','wbcapt');
	newtd1.setAttribute('align','center');
	newtd1.setAttribute('colspan','3');
	newtr1.appendChild(newtd1);

	var newtr2 = document.createElement('tr');
	newtbody.appendChild(newtr2);

	var newtd2 = document.createElement('td');
	newtd2.innerHTML = text_name;
	newtd2.setAttribute('class','wblight');
	newtd2.setAttribute('align','center');
	newtd2.setAttribute('colspan','3');
	newtr2.appendChild(newtd2);

	var newtr3 = document.createElement('tr');
	newtbody.appendChild(newtr3);

	var newtd3 = document.createElement('td');
	newtd3.setAttribute('class','wblight');
	newtd3.setAttribute('align','center');
	newtd3.setAttribute('colspan','3');
	newtr3.appendChild(newtd3);

	var td3input = document.createElement('input');
	td3input.setAttribute('type','text');
	newtd3.appendChild(td3input);

	var td3button = document.createElement('input');
	td3button.setAttribute('value',text_add);
	td3button.setAttribute('class','wbtn');
	td3button.setAttribute('type','submit');
	newtd3.appendChild(td3button);

	td3form.addEventListener('submit', function(e) {
		e.preventDefault();
		if (td3input.value != '') {
			var last = GM_getValue(serv+'_last', 1);
			var ggg = GM_getValue(serv+'_groups', '');
			if (ggg != '') ggg += ',';
			GM_setValue(serv+'_groups', ggg + String(last));
			GM_setValue(serv+'_last', last+1);
			GM_setValue(serv+'_group'+String(last), td3input.value);
			location.href = location.href;
		} else {
			alert(text_empty);
		}
	}, false);

	for(var i=0; i<groups.length; i++) {
		var ntr = document.createElement('tr');
		newtbody.appendChild(ntr);

		var ntd1 = document.createElement('td');
		ntd1.setAttribute('class','wbwhite');
		ntd1.setAttribute('align','center');
		ntr.appendChild(ntd1);

		if (i == 0) {
			ntd1.appendChild(document.createTextNode('\xA0'));
			ntd1.appendChild(document.createTextNode('\xA0'));
		} else {
			var arrup = document.createElement('a');
			arrup.href = '#';
			arrup.setAttribute('gid', i);
			arrup.addEventListener('click', function(e) {
				e.preventDefault();
				var gids = GM_getValue(serv+'_groups', '').split(',');
				var num = Number(e.target.getAttribute('gid'));
				if (num > 0) {
					var t = gids[num];
					gids[num] = gids[num-1];
					gids[num-1] = t;
					GM_setValue(serv+'_groups', gids.join(','));
					location.href = location.href;
				} else {
					alert('can\'t moveup first group');
				}
			}, false);
			arrup.innerHTML = '\u2191';
			arrup.style.textDecoration = 'none';
			ntd1.appendChild(arrup);
		}

		if (i == groups.length-1) {
			ntd1.appendChild(document.createTextNode('\xA0'));
			ntd1.appendChild(document.createTextNode('\xA0'));
		} else {
			var arrdw = document.createElement('a');
			arrdw.href = '#';
			arrdw.setAttribute('gid', i);
			arrdw.addEventListener('click', function(e) {
				e.preventDefault();
				var gids = GM_getValue(serv+'_groups', '').split(',');
				var num = Number(e.target.getAttribute('gid'));
				if (num < gids.length-1) {
					var t = gids[num];
					gids[num] = gids[num+1];
					gids[num+1] = t;
					GM_setValue(serv+'_groups', gids.join(','));
					location.href = location.href;
				} else {
					alert('can\'t movedown last group');
				}
			}, false);
			arrdw.style.textDecoration = 'none';
			arrdw.innerHTML = '\u2193';
			ntd1.appendChild(arrdw);
		}

		var ntd2 = document.createElement('td');
		ntd2.setAttribute('class','wbwhite');
		ntd2.innerHTML = '<b>'+groups[i]+'</b>';
		ntr.appendChild(ntd2);

		var ntd3 = document.createElement('td');
		ntd3.setAttribute('class','wbwhite');
		ntd3.setAttribute('align','center');
		ntr.appendChild(ntd3);

		var ax = document.createElement('a');
		ax.href = '#';
		ax.setAttribute('gid', i);
		ax.addEventListener('click', function(e) {
			e.preventDefault();
			var gids = GM_getValue(serv+'_groups', '').split(',');
			gids.splice(e.target.getAttribute('gid'), 1);
			GM_setValue(serv+'_groups', gids.join(','));
			location.href = location.href;
		}, false);
		ax.innerHTML = 'X';
		ntd3.appendChild(ax);
	}

	myt.parentNode.parentNode.appendChild(newxtd);
	myt.parentNode.parentNode.setAttribute('valign', 'top');
}
